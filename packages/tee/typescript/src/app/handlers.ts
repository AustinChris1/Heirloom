/** Handler functions for the HEIRLOOM extension operations. */

import http from "node:http";
import { bytesToHex, decodeAbiParameters, encodeAbiParameters, parseAbiParameters } from "viem";
import { Framework } from "../base/types.js";
import {
  OP_COMMAND_ADDRESS,
  OP_COMMAND_EXECUTE,
  OP_COMMAND_PAYOUT,
  OP_COMMAND_SEAL,
  OP_TYPE_HEIRLOOM,
  VERSION,
} from "./config.js";
import { allocate, DEFAULT_FEE_PER_TX_DROPS } from "./heirloom/allocate.js";
import { buildPayments } from "./heirloom/xrpl.js";
import { cachedXrplAddress, enclaveXrplIdentity, signXrplTx } from "./heirloom/enclaveSigner.js";
import { parseWill, standardAddressHash, willCommitment } from "./heirloom/will.js";

/**
 * Heirloom's two confidential operations.
 *
 * Both receive an ABI-encoded `ExecuteMessage` emitted by HeirloomVault. That
 * payload is untrusted input — it arrives from a public chain and anyone can
 * craft one — so every field is decoded strictly and re-validated here, and the
 * ciphertext is only decrypted after the envelope checks out.
 *
 * Nothing in the returned payload reveals a beneficiary except the distribution
 * itself, and that only after the vault has legitimately reached Executing.
 */

let signPort = "9090";

/** Counters only — never any will content. Surfaced on GET /state for debugging. */
let sealsAttested = 0;
let estatesExecuted = 0;
let payoutsSigned = 0;

/**
 * Distributions this enclave has executed, kept so a PAYOUT direct action can
 * sign them later. In-memory on purpose: a restart clears it, and PAYOUT then
 * requires a fresh EXECUTE — the same lifetime the TEE identity itself has.
 */
interface ExecutedEntry {
  estateAccount: string;
  allocations: Array<{ beneficiary: string; drops: string; source: string }>;
}
const executedCache = new Map<number, ExecutedEntry>();

/**
 * PAYOUT signs a vault's distribution at a caller-supplied sequence, and the
 * caller is untrusted — signing the same payments at many sequences would
 * make every one of them broadcastable. One signing per execution, ever.
 */
const paidOut = new Set<number>();

export function setSignPort(port: string): void {
  signPort = port;
}

export function register(framework: Framework): void {
  framework.handle(OP_TYPE_HEIRLOOM, OP_COMMAND_SEAL, handleSeal);
  framework.handle(OP_TYPE_HEIRLOOM, OP_COMMAND_EXECUTE, handleExecute);
  framework.handle(OP_TYPE_HEIRLOOM, OP_COMMAND_ADDRESS, handleAddress);
  framework.handle(OP_TYPE_HEIRLOOM, OP_COMMAND_PAYOUT, handlePayout);
}

export function reportState(): unknown {
  return { sealsAttested, estatesExecuted, payoutsSigned, xrplSigner: cachedXrplAddress(), version: VERSION };
}

export function resetState(): void {
  sealsAttested = 0;
  estatesExecuted = 0;
  payoutsSigned = 0;
  executedCache.clear();
  paidOut.clear();
}

/** Matches HeirloomVault.ExecuteMessage. */
const EXECUTE_MESSAGE = parseAbiParameters("(uint256, address, bytes32, bytes, uint256, uint256)");

interface ExecuteMessage {
  vaultId: bigint;
  contractAddr: `0x${string}`;
  willCommitment: `0x${string}`;
  encryptedWill: `0x${string}`;
  xrpUsdPriceE18: bigint;
  estateDrops: bigint;
}

function decodeExecuteMessage(msgHex: string): ExecuteMessage {
  const hex = (msgHex.startsWith("0x") ? msgHex : `0x${msgHex}`) as `0x${string}`;
  const [tuple] = decodeAbiParameters(EXECUTE_MESSAGE, hex) as unknown as [
    readonly [bigint, `0x${string}`, `0x${string}`, `0x${string}`, bigint, bigint],
  ];
  return {
    vaultId: tuple[0],
    contractAddr: tuple[1],
    willCommitment: tuple[2],
    encryptedWill: tuple[3],
    xrpUsdPriceE18: tuple[4],
    estateDrops: tuple[5],
  };
}

/** Decrypts the sealed will and re-derives its commitment. Shared by both handlers. */
async function openWill(message: ExecuteMessage) {
  const ciphertext = Buffer.from(message.encryptedWill.slice(2), "hex");
  const plaintext = await decryptViaNode(new Uint8Array(ciphertext));
  const will = parseWill(JSON.parse(Buffer.from(plaintext).toString("utf-8")));

  if (Number(message.vaultId) !== will.vaultId) {
    throw new Error(`will is for vault ${will.vaultId}, instruction is for vault ${message.vaultId}`);
  }

  const commitment = willCommitment(will);
  if (commitment.toLowerCase() !== message.willCommitment.toLowerCase()) {
    throw new Error("sealed will does not match the commitment recorded on-chain");
  }

  return { will, commitment };
}

/**
 * SEAL — the dry run the owner performs while alive.
 *
 * Confirms the enclave can decrypt the blob, that the will parses, and that its
 * commitment matches what the vault recorded. Returns only a beneficiary count:
 * enough to prove the will is executable, not enough to reveal who is in it.
 */
async function handleSeal(msg: string): Promise<[string | null, number, string | null]> {
  if (!msg) return [null, 0, "originalMessage is empty"];

  try {
    const message = decodeExecuteMessage(msg);
    const { will, commitment } = await openWill(message);

    const data = encodeAbiParameters(parseAbiParameters("address, uint256, bytes32, uint32"), [
      message.contractAddr,
      message.vaultId,
      commitment,
      will.bequests.length,
    ]);

    sealsAttested += 1;
    console.log(`sealed will attested for vault ${message.vaultId} (${will.bequests.length} bequests)`);
    return [data, 1, null];
  } catch (e) {
    return [null, 0, errorMessage(e)];
  }
}

/**
 * EXECUTE — decrypt, price, allocate, and return the distribution.
 *
 * The price arrives from the contract (read from FTSO at request time) rather
 * than being fetched here, so the value the enclave settles at is one the chain
 * also observed and re-checks against the live feed before accepting.
 */
async function handleExecute(msg: string): Promise<[string | null, number, string | null]> {
  if (!msg) return [null, 0, "originalMessage is empty"];

  try {
    const message = decodeExecuteMessage(msg);
    const { will, commitment } = await openWill(message);

    const result = allocate({
      will,
      estateDrops: message.estateDrops,
      xrpUsdPriceE18: message.xrpUsdPriceE18,
    });

    // Remember the distribution so a later PAYOUT direct action can sign it
    // with the enclave-held key — the only place the payment set and the
    // beneficiary addresses coexist after this handler returns.
    executedCache.set(Number(message.vaultId), {
      estateAccount: will.estateAccount,
      allocations: result.allocations
        .filter((a) => a.drops > 0n)
        .map((a) => ({ beneficiary: a.beneficiary, drops: a.drops.toString(), source: a.source })),
    });

    const bequests = result.allocations.map((a) => [
      standardAddressHash(a.beneficiary),
      a.drops,
      (a.flareRecipient ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
    ]);

    const data = encodeAbiParameters(
      parseAbiParameters("address, uint256, bytes32, uint256, (bytes32, uint256, address)[]"),
      [message.contractAddr, message.vaultId, commitment, message.xrpUsdPriceE18, bequests] as never,
    );

    estatesExecuted += 1;
    console.log(
      `executed vault ${message.vaultId}: ${result.allocations.length} payments, ` +
        `${result.distributedDrops} drops distributed${result.abatementApplied ? " (abated)" : ""}`,
    );
    return [data, 1, null];
  } catch (e) {
    return [null, 0, errorMessage(e)];
  }
}

/**
 * ADDRESS — direct action; returns the enclave's XRPL signing address.
 *
 * This is what an estate owner delegates to (`SetRegularKey`) while alive.
 * Public information by design: an address grants nothing by itself.
 */
async function handleAddress(_msg: string): Promise<[string | null, number, string | null]> {
  try {
    const identity = await enclaveXrplIdentity(signViaNode);
    return [utf8ToHexPayload(JSON.stringify({ address: identity.address })), 1, null];
  } catch (e) {
    return [null, 0, errorMessage(e)];
  }
}

/**
 * PAYOUT — direct action; signs an executed vault's distribution with the
 * enclave-held key and returns broadcastable blobs.
 *
 * Message: hex-encoded JSON { vaultId, sequence, lastLedgerSequence }.
 * Sequence and expiry come from the untrusted caller — they cannot change who
 * gets paid or how much (that is frozen from EXECUTE), and the one-signing
 * guard stops a replayed request from minting the same payments at a second
 * sequence.
 */
async function handlePayout(msg: string): Promise<[string | null, number, string | null]> {
  if (!msg || msg === "0x") return [null, 0, "message is empty"];

  try {
    const req = JSON.parse(Buffer.from(msg.replace(/^0x/, ""), "hex").toString("utf-8"));
    const vaultId = Number(req.vaultId);
    const sequence = Number(req.sequence);
    const lastLedgerSequence = Number(req.lastLedgerSequence);
    if (!Number.isInteger(vaultId) || vaultId < 0) return [null, 0, "vaultId must be a non-negative integer"];
    if (!Number.isInteger(sequence) || sequence <= 0) return [null, 0, "sequence must be a positive integer"];
    if (!Number.isInteger(lastLedgerSequence) || lastLedgerSequence <= 0) {
      return [null, 0, "lastLedgerSequence must be a positive integer"];
    }

    const entry = executedCache.get(vaultId);
    if (!entry) {
      return [null, 0, `no executed distribution in enclave memory for vault ${vaultId} — EXECUTE must precede PAYOUT (a restart clears the cache)`];
    }
    if (paidOut.has(vaultId)) {
      return [null, 0, `payouts for vault ${vaultId} were already signed once — refusing a second signing, which could double-pay at a different sequence`];
    }

    const identity = await enclaveXrplIdentity(signViaNode);
    const payments = buildPayments({
      estateAccount: entry.estateAccount,
      allocations: entry.allocations.map((a) => ({
        beneficiary: a.beneficiary,
        drops: BigInt(a.drops),
        source: a.source as "FIXED_USD" | "FIXED_XRP" | "SHARE_BPS" | "RESIDUE",
      })),
      startSequence: sequence,
      feePerTxDrops: DEFAULT_FEE_PER_TX_DROPS,
      lastLedgerSequence,
      vaultId,
    });

    const signed = payments.map((p) => {
      const { blob, hash } = signXrplTx(p as unknown as Record<string, unknown>, identity);
      return { to: p.Destination, drops: p.Amount, blob, hash };
    });

    paidOut.add(vaultId);
    payoutsSigned += 1;
    console.log(`signed ${signed.length} payout(s) for vault ${vaultId} with enclave key ${identity.address}`);

    return [
      utf8ToHexPayload(JSON.stringify({ signer: identity.address, account: entry.estateAccount, payments: signed })),
      1,
      null,
    ];
  } catch (e) {
    return [null, 0, errorMessage(e)];
  }
}

/** Sign a message with the TEE node's identity key via its sign port. Base64 in, base64 out. */
function signViaNode(message: Uint8Array): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:${signPort}/sign`;
    const body = JSON.stringify({ message: Buffer.from(message).toString("base64") });

    const req = http.request(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const data = Buffer.concat(chunks).toString("utf-8");
          if (res.statusCode !== 200) {
            reject(new Error(`sign: node returned ${res.statusCode}: ${data}`));
            return;
          }
          try {
            resolve(new Uint8Array(Buffer.from(JSON.parse(data).signature, "base64")));
          } catch (e) {
            reject(new Error(`sign: decode response: ${e}`));
          }
        });
      },
    );
    req.on("error", (e) => reject(new Error(`sign: request error: ${e.message}`)));
    req.write(body);
    req.end();
  });
}

function utf8ToHexPayload(value: string): string {
  return "0x" + Buffer.from(value, "utf-8").toString("hex");
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

/**
 * Call the TEE node's /decrypt endpoint.
 * Sends ciphertext as base64-encoded bytes (matching Go's []byte JSON marshaling).
 * Returns the decrypted plaintext bytes.
 *
 * The enclave's private key never leaves the node — the extension only ever
 * sees plaintext it was authorised to receive.
 */
function decryptViaNode(ciphertext: Uint8Array): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:${signPort}/decrypt`;
    const body = JSON.stringify({
      encryptedMessage: Buffer.from(ciphertext).toString("base64"),
    });

    const req = http.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const data = Buffer.concat(chunks).toString("utf-8");
          if (res.statusCode !== 200) {
            reject(new Error(`node returned ${res.statusCode}: ${data}`));
            return;
          }
          try {
            const parsed = JSON.parse(data);
            resolve(new Uint8Array(Buffer.from(parsed.decryptedMessage, "base64")));
          } catch (e) {
            reject(new Error(`decode response: ${e}`));
          }
        });
      },
    );

    req.on("error", (e) => reject(new Error(`request error: ${e.message}`)));
    req.write(body);
    req.end();
  });
}

export { bytesToHex };
