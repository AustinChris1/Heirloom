import { AbiCoder, getBytes, hexlify } from "ethers";
import { allocate, DEFAULT_FEE_PER_TX_DROPS } from "./allocate";
import { buildPayments } from "./xrpl";
import { parseWill, standardAddressHash, willCommitment } from "./will";

/**
 * The two operations Heirloom's extension exposes inside the enclave.
 *
 * Both receive an ABI-encoded `ExecuteMessage` emitted by HeirloomVault. That
 * payload is untrusted input: it arrives from a public chain and anyone can
 * craft one. Every field is decoded strictly and re-validated here, and the
 * ciphertext is only decrypted after the envelope checks out.
 */

export const OP_TYPE_HEIRLOOM = "HEIRLOOM";
export const OP_COMMAND_SEAL = "SEAL";
export const OP_COMMAND_EXECUTE = "EXECUTE";

/** Matches HeirloomVault.ExecuteMessage. */
const EXECUTE_MESSAGE_ABI = ["tuple(uint256,address,bytes32,bytes,uint256,uint256)"];

export interface ExecuteMessage {
  vaultId: bigint;
  contractAddr: string;
  willCommitment: string;
  encryptedWill: string;
  xrpUsdPriceE18: bigint;
  estateDrops: bigint;
}

/** Decrypts ECIES ciphertext using the TEE node's key. Injected so the pure logic stays testable. */
export type Decryptor = (ciphertext: Uint8Array) => Promise<Uint8Array>;

export interface HandlerResult {
  /** Hex-encoded ActionResult.Data written back on-chain. */
  data: string;
  /** 0 = error, 1 = success, >=2 = pending. */
  status: number;
  error?: string;
}

export function decodeExecuteMessage(messageHex: string): ExecuteMessage {
  const [decoded] = AbiCoder.defaultAbiCoder().decode(EXECUTE_MESSAGE_ABI, messageHex);
  return {
    vaultId: decoded[0],
    contractAddr: decoded[1],
    willCommitment: decoded[2],
    encryptedWill: hexlify(decoded[3]),
    xrpUsdPriceE18: decoded[4],
    estateDrops: decoded[5],
  };
}

/**
 * SEAL — the dry run the owner performs while alive.
 *
 * Confirms the enclave can decrypt the blob, that the will parses, and that its
 * commitment matches what the vault recorded. Returns only a beneficiary count:
 * enough to prove the will is executable, not enough to reveal who is in it.
 */
export async function handleSeal(messageHex: string, decrypt: Decryptor): Promise<HandlerResult> {
  try {
    const message = decodeExecuteMessage(messageHex);
    const will = parseWill(JSON.parse(Buffer.from(await decrypt(getBytes(message.encryptedWill))).toString("utf8")));

    if (Number(message.vaultId) !== will.vaultId) {
      return fail(`will is for vault ${will.vaultId}, instruction is for vault ${message.vaultId}`);
    }

    const commitment = willCommitment(will);
    if (commitment.toLowerCase() !== message.willCommitment.toLowerCase()) {
      return fail("sealed will does not match the commitment recorded on-chain");
    }

    const data = AbiCoder.defaultAbiCoder().encode(
      ["address", "uint256", "bytes32", "uint32"],
      [message.contractAddr, message.vaultId, commitment, will.bequests.length],
    );
    return { data, status: 1 };
  } catch (err) {
    return fail(errorMessage(err));
  }
}

/**
 * EXECUTE — decrypt, price, allocate, and return the signed distribution.
 *
 * The price arrives from the contract (read from FTSO at request time) rather
 * than being fetched here, so the value the enclave settles at is one the chain
 * also observed and re-checks against the live feed before accepting.
 */
export async function handleExecute(messageHex: string, decrypt: Decryptor): Promise<HandlerResult> {
  try {
    const message = decodeExecuteMessage(messageHex);
    const will = parseWill(JSON.parse(Buffer.from(await decrypt(getBytes(message.encryptedWill))).toString("utf8")));

    if (Number(message.vaultId) !== will.vaultId) {
      return fail(`will is for vault ${will.vaultId}, instruction is for vault ${message.vaultId}`);
    }

    const commitment = willCommitment(will);
    if (commitment.toLowerCase() !== message.willCommitment.toLowerCase()) {
      return fail("sealed will does not match the commitment recorded on-chain");
    }

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
      a.flareRecipient ?? "0x0000000000000000000000000000000000000000",
    ]);

    const data = AbiCoder.defaultAbiCoder().encode(
      ["address", "uint256", "bytes32", "uint256", "tuple(bytes32,uint256,address)[]"],
      [message.contractAddr, message.vaultId, commitment, message.xrpUsdPriceE18, bequests],
    );
    return { data, status: 1 };
  } catch (err) {
    return fail(errorMessage(err));
  }
}

export async function route(opType: string, opCommand: string, messageHex: string, decrypt: Decryptor): Promise<HandlerResult> {
  if (opType !== OP_TYPE_HEIRLOOM) return fail(`unsupported op type: ${opType}`);
  switch (opCommand) {
    case OP_COMMAND_SEAL:
      return handleSeal(messageHex, decrypt);
    case OP_COMMAND_EXECUTE:
      return handleExecute(messageHex, decrypt);
    default:
      return fail(`unsupported op command: ${opCommand}`);
  }
}

function fail(error: string): HandlerResult {
  return { data: "0x", status: 0, error };
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
