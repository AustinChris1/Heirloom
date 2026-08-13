import { computeAddress, concat, zeroPadValue } from "ethers";

/**
 * Client for the live enclave, reached through the same-origin `/enclave`
 * proxy (the host sends no CORS headers). Serves its attested public key and
 * polls for the signed ActionResults that settle on-chain.
 */

const ENCLAVE = "/enclave";

export interface EnclaveKey {
  /** Uncompressed 65-byte public key, 0x04-prefixed. */
  publicKey: string;
  /** Ethereum-style address derived from it — must equal the vault's teeAddress. */
  address: string;
}

/**
 * The enclave's public key from its signed TeeInfo document. Callers must
 * compare `address` against the contract's `teeAddress` before encrypting —
 * that check is what stops a spoofed endpoint substituting its own key.
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

/**
 * Direct actions carry no authority — ADDRESS reveals a public address, PAYOUT
 * signs a distribution the chain already verified — so they skip the contract.
 */
async function directAction(opCommand: string, payload?: unknown): Promise<unknown> {
  const message = payload
    ? "0x" +
      Array.from(new TextEncoder().encode(JSON.stringify(payload)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    : "0x00";

  const res = await fetch(`${ENCLAVE}/direct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      opType: bytes32Hex("HEIRLOOM"),
      opCommand: bytes32Hex(opCommand),
      message,
    }),
  });
  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? "The enclave's direct endpoint is not enabled on this deployment."
        : `enclave /direct returned ${res.status}`,
    );
  }

  const queued = await res.json();
  const actionId = queued?.data?.id;
  if (!actionId) throw new Error("enclave did not queue the action");

  // Direct results live under the "submit" tag; the endpoint defaults to "threshold".
  const result = await pollActionResult(actionId, undefined, 120_000, "submit");
  if (result.status !== 1) throw new Error(result.log || "the enclave refused the request");
  return JSON.parse(new TextDecoder().decode(hexToBytes(result.data)));
}

function bytes32Hex(s: string): string {
  const bytes = new Uint8Array(32);
  bytes.set(new TextEncoder().encode(s));
  return "0x" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/, "");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
  return out;
}

/** The enclave's own XRPL address — what an owner delegates to as a regular key. */
export async function enclaveXrplAddress(): Promise<string> {
  const out = (await directAction("ADDRESS")) as { address?: string };
  if (!out?.address) throw new Error("enclave returned no XRPL address");
  return out.address;
}

export interface SignedPayout {
  signer: string;
  account: string;
  payments: Array<{ to: string; drops: string; blob: string; hash: string }>;
}

/** Asks the enclave to sign a settled vault's payouts with its own key. */
export async function requestEnclavePayout(
  vaultId: number,
  sequence: number,
  lastLedgerSequence: number,
): Promise<SignedPayout> {
  return (await directAction("PAYOUT", { vaultId, sequence, lastLedgerSequence })) as SignedPayout;
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
 * Polls for an instruction's result. 404s are normal while it travels
 * vault → registry → providers → proxy → enclave.
 */
export async function pollActionResult(
  instructionId: string,
  onTick?: (elapsedSeconds: number) => void,
  timeoutMs = 600_000,
  submissionTag?: string,
): Promise<EnclaveResult> {
  const started = Date.now();
  const query = submissionTag ? `?submissionTag=${submissionTag}` : "";

  while (Date.now() - started < timeoutMs) {
    const res = await fetch(`${ENCLAVE}/action/result/${instructionId}${query}`);
    if (res.ok) {
      const out = await res.json();
      const r = out?.result;
      // Status >= 2 is pending: the node is still retrying the extension.
      if (r?.id && Number(r.status ?? 0) < 2) {
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
  throw new Error(`No final enclave result for ${instructionId} within ${Math.round(timeoutMs / 60_000)} minutes`);
}
