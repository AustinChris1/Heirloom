/** Handler functions for the HEIRLOOM extension operations. */

import http from "node:http";
import { bytesToHex, decodeAbiParameters, encodeAbiParameters, parseAbiParameters } from "viem";
import { Framework } from "../base/types.js";
import { OP_COMMAND_EXECUTE, OP_COMMAND_SEAL, OP_TYPE_HEIRLOOM, VERSION } from "./config.js";
import { allocate, DEFAULT_FEE_PER_TX_DROPS } from "./heirloom/allocate.js";
import { buildPayments } from "./heirloom/xrpl.js";
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

export function setSignPort(port: string): void {
  signPort = port;
}

export function register(framework: Framework): void {
  framework.handle(OP_TYPE_HEIRLOOM, OP_COMMAND_SEAL, handleSeal);
  framework.handle(OP_TYPE_HEIRLOOM, OP_COMMAND_EXECUTE, handleExecute);
}

export function reportState(): unknown {
  return { sealsAttested, estatesExecuted, version: VERSION };
}

export function resetState(): void {
  sealsAttested = 0;
  estatesExecuted = 0;
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

    // Assembled here so the enclave can sign them; broadcasting is permissionless.
    buildPayments({
      estateAccount: will.estateAccount,
      allocations: result.allocations,
      startSequence: 1,
      feePerTxDrops: DEFAULT_FEE_PER_TX_DROPS,
      vaultId: will.vaultId,
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
