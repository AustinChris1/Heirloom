import { computeAddress, concat, zeroPadValue } from "ethers";

/**
 * Client for the live Heirloom enclave (TEE node + extension behind its proxy).
 *
 * Reached through the same-origin `/enclave` proxy — the host sends no CORS
 * headers, mirroring how the DA Layer and XRPL are already handled.
 *
 * Two things live here:
 *
 *   - the enclave's encryption key, fetched from its attested /info document
 *     and cross-checked against the TEE address the vault contract trusts, so
 *     the browser never encrypts a will to an unverified key;
 *   - polling for signed ActionResults, which is how a SEAL or EXECUTE
 *     instruction's outcome travels back to be settled on-chain.
 */

const ENCLAVE = "/enclave";

export interface EnclaveKey {
  /** Uncompressed 65-byte public key, 0x04-prefixed. */
  publicKey: string;
  /** Ethereum-style address derived from it — must equal the vault's teeAddress. */
  address: string;
}

/**
 * Fetches the enclave's public key from its signed TeeInfo document.
 *
 * The caller is expected to compare `address` against the contract's
 * registered `teeAddress`: that one check ties the key served over HTTPS to
 * the identity the chain verifies signatures against, so a spoofed endpoint
 * cannot trick the browser into encrypting to an attacker's key.
 */
export async function fetchEnclaveKey(): Promise<EnclaveKey> {
  const res = await fetch(`${ENCLAVE}/info`);
  if (!res.ok) throw new Error(`enclave /info returned ${res.status}`);
  const info = await res.json();

  const point = info?.teeInfo?.publicKey;
  if (!point?.x || !point?.y) throw new Error("enclave /info carried no public key");

  const publicKey = concat(["0x04", zeroPadValue(point.x, 32), zeroPadValue(point.y, 32)]);
  return { publicKey, address: computeAddress(publicKey) };
}

/** The signed result of one enclave action, exactly as the contract wants it. */
export interface EnclaveResult {
  /** ActionResult.Data — the ABI payload the extension produced. */
  data: string;
  /** ActionResult.ID — the instruction id from sendInstructions. */
  actionId: string;
  submissionTag: string;
  /** 0 = error, 1 = success, >=2 = pending. */
  status: number;
  /** The extension's own log line — carries the decrypt/parse error on failure. */
  log: string;
  /** TEE node signature; recovers to the registered teeAddress. */
  signature: string;
}

/**
 * Polls the enclave for the result of an instruction.
 *
 * An instruction travels vault → registry → data providers → proxy → enclave
 * before a result exists, so 404s are the normal state for a while — they mean
 * "not arrived yet", not "failed". Polls every 6 s for up to 10 minutes.
 */
export async function pollActionResult(
  instructionId: string,
  onTick?: (elapsedSeconds: number) => void,
  timeoutMs = 600_000,
): Promise<EnclaveResult> {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const res = await fetch(`${ENCLAVE}/action/result/${instructionId}`);
    if (res.ok) {
      const out = await res.json();
      const r = out?.result;
      if (r?.id) {
        return {
          data: r.data ?? "0x",
          actionId: r.id,
          submissionTag: r.submissionTag ?? "",
          status: Number(r.status ?? 0),
          log: r.log ?? "",
          signature: out.signature,
        };
      }
    }
    onTick?.(Math.round((Date.now() - started) / 1000));
    await new Promise((resolve) => setTimeout(resolve, 6_000));
  }
  throw new Error(`No enclave result for ${instructionId} within ${Math.round(timeoutMs / 60_000)} minutes`);
}
