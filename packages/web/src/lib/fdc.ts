import { AbiCoder, BrowserProvider, Contract, JsonRpcSigner, keccak256, toUtf8Bytes, zeroPadBytes } from "ethers";

/**
 * Browser port of scripts/fdc.ts.
 *
 * Same four-step flow — prepare → submit → await finalisation → fetch proof —
 * but the submitting transaction is signed by the visitor's own wallet rather
 * than a deployer key, so anybody can relay a proof for a vault they do not own.
 * That is the point: proving life or silence is permissionless.
 *
 * Two of the three endpoints send no CORS headers, so the DA Layer and XRPL are
 * reached through same-origin proxies (see vite.config.ts / vercel.json). The
 * verifier allows `*` and is called directly.
 */

const VERIFIER = "https://fdc-verifiers-testnet.flare.network";
const DA_LAYER = "/da";
const XRPL_RPC = "/xrpl";
const API_KEY = "00000000-0000-0000-0000-000000000000";

/** Stable per network; the entry point for resolving every other Flare contract. */
const CONTRACT_REGISTRY = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
const FDC_PROTOCOL_ID = 200;

export type Phase =
  | "idle"
  | "preparing"
  | "submitting"
  | "waiting"
  | "fetching"
  | "finalising"
  | "done"
  | "error";

export interface Progress {
  phase: Phase;
  /** Human-readable status line. */
  message: string;
  /** 0–1 for the round wait, so the UI can show real progress rather than a spinner. */
  fraction?: number;
  txHash?: string;
  error?: string;
}

function bytes32(s: string): string {
  return zeroPadBytes(toUtf8Bytes(s), 32).toLowerCase();
}

/** ethers returns frozen Result objects; the encoder mutates tuples in place. */
export function plain(value: any): any {
  if (Array.isArray(value)) return value.map(plain);
  if (value && typeof value === "object" && typeof value.toObject === "function") {
    return Object.fromEntries(Object.entries(value.toObject()).map(([k, v]) => [k, plain(v)]));
  }
  return value;
}

export async function xrplRequest(body: unknown): Promise<any> {
  const res = await fetch(XRPL_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`XRPL RPC returned ${res.status}`);
  return res.json();
}

/** Current validated ledger index, used to bound a nonexistence search. */
export async function currentLedger(): Promise<number> {
  const out = await xrplRequest({ method: "ledger", params: [{ ledger_index: "validated" }] });
  const idx = out?.result?.ledger_index ?? out?.result?.ledger?.ledger_index;
  if (!idx) throw new Error("could not read the validated ledger index");
  return Number(idx);
}

/** Close time of a ledger, as a unix timestamp. */
export async function ledgerCloseTime(index: number): Promise<number> {
  const out = await xrplRequest({ method: "ledger", params: [{ ledger_index: index }] });
  const close = out?.result?.ledger?.close_time;
  if (close === undefined) throw new Error(`could not read close time for ledger ${index}`);
  return Number(close) + 946_684_800; // ripple epoch → unix
}

export async function prepareRequest(
  typeName: "XRPPayment" | "XRPPaymentNonexistence",
  requestBody: Record<string, unknown>,
): Promise<string> {
  const res = await fetch(`${VERIFIER}/verifier/xrp/${typeName}/prepareRequest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": API_KEY, "X-apikey": API_KEY },
    body: JSON.stringify({
      attestationType: bytes32(typeName),
      sourceId: bytes32("testXRP"),
      requestBody,
    }),
  });

  const out = await res.json().catch(() => ({}));
  if (out?.status !== "VALID") {
    // The verifier's own wording is more useful than anything generic.
    throw new Error(out?.status ? `Verifier: ${out.status}` : `Verifier returned HTTP ${res.status}`);
  }
  return out.abiEncodedRequest;
}

/** Submits the request to FdcHub, paying the configured fee. Returns the voting round. */
export async function submitRequest(signer: JsonRpcSigner, abiEncodedRequest: string): Promise<number> {
  const registry = new Contract(
    CONTRACT_REGISTRY,
    ["function getContractAddressByName(string) view returns (address)"],
    signer,
  );

  const [hubAddr, feeAddr, systemsAddr] = await Promise.all([
    registry.getContractAddressByName("FdcHub"),
    registry.getContractAddressByName("FdcRequestFeeConfigurations"),
    registry.getContractAddressByName("FlareSystemsManager"),
  ]);

  const feeCfg = new Contract(feeAddr, ["function getRequestFee(bytes) view returns (uint256)"], signer);
  const fee: bigint = await feeCfg.getRequestFee(abiEncodedRequest);

  const hub = new Contract(hubAddr, ["function requestAttestation(bytes) payable"], signer);
  const tx = await hub.requestAttestation(abiEncodedRequest, { value: fee });
  const receipt = await tx.wait();

  const provider = signer.provider as BrowserProvider;
  const block = await provider.getBlock(receipt.blockNumber);

  const systems = new Contract(
    systemsAddr,
    [
      "function firstVotingRoundStartTs() view returns (uint64)",
      "function votingEpochDurationSeconds() view returns (uint64)",
    ],
    signer,
  );
  const [first, duration] = await Promise.all([
    systems.firstVotingRoundStartTs() as Promise<bigint>,
    systems.votingEpochDurationSeconds() as Promise<bigint>,
  ]);

  return Number((BigInt(block!.timestamp) - first) / duration);
}

/**
 * Polls the Relay until the round finalises, reporting progress as it goes.
 *
 * Rounds take 90–180 seconds. Reporting a fraction against the upper bound
 * gives an honest, monotonic bar rather than a spinner that says nothing.
 */
export async function waitForFinalisation(
  signer: JsonRpcSigner,
  round: number,
  onProgress: (fraction: number, elapsedSeconds: number) => void,
  timeoutMs = 480_000,
): Promise<void> {
  const registry = new Contract(
    CONTRACT_REGISTRY,
    ["function getContractAddressByName(string) view returns (address)"],
    signer,
  );
  const relay = new Contract(
    await registry.getContractAddressByName("Relay"),
    ["function isFinalized(uint256,uint256) view returns (bool)"],
    signer,
  );

  const started = Date.now();
  const EXPECTED_MS = 180_000;

  while (Date.now() - started < timeoutMs) {
    if (await relay.isFinalized(FDC_PROTOCOL_ID, round)) return;
    const elapsed = Date.now() - started;
    onProgress(Math.min(0.95, elapsed / EXPECTED_MS), Math.round(elapsed / 1000));
    await new Promise((r) => setTimeout(r, 5_000));
  }
  throw new Error(`Round ${round} did not finalise in ${Math.round(timeoutMs / 1000)}s`);
}

/**
 * Retrieves the Merkle proof. The DA Layer answers 400 "not found" for up to a
 * minute after finalisation while it indexes, which is retryable rather than an
 * error — so this inspects the body instead of trusting the status code.
 */
export async function fetchProof(
  round: number,
  abiEncodedRequest: string,
  onAttempt?: (n: number) => void,
): Promise<{ proof: string[]; responseHex: string }> {
  for (let attempt = 1; attempt <= 18; attempt++) {
    onAttempt?.(attempt);
    const res = await fetch(`${DA_LAYER}/api/v1/fdc/proof-by-request-round-raw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votingRoundId: round, requestBytes: abiEncodedRequest }),
    });
    const text = await res.text();

    if (res.ok) {
      const out = JSON.parse(text);
      if (out?.proof && out?.response_hex) return { proof: out.proof, responseHex: out.response_hex };
    } else if (!text.includes("not found")) {
      throw new Error(`DA Layer returned HTTP ${res.status}`);
    }
    await new Promise((r) => setTimeout(r, 8_000));
  }
  throw new Error(`No proof available for round ${round}`);
}

/** Decodes a raw DA Layer response against the struct a vault method expects. */
export function decodeResponse(vault: Contract, method: "proveLife" | "claimDormancy", responseHex: string): any {
  const fragment = vault.interface.getFunction(method)!;
  const responseType = fragment.inputs[1].components![1];
  const hex = responseHex.startsWith("0x") ? responseHex : `0x${responseHex}`;
  return plain(AbiCoder.defaultAbiCoder().decode([responseType as any], hex)[0]);
}

export const standardAddressHash = (address: string): string => keccak256(toUtf8Bytes(address));
