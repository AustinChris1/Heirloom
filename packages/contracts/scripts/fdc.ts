import { ethers } from "hardhat";

/**
 * Minimal FDC client: prepare → submit → wait for finalisation → fetch proof.
 *
 * The verifier and DA Layer are plain HTTP, so this deliberately avoids pulling
 * in another SDK. The default all-zeros API key works on the public testnet
 * verifier (rate-limited); override with VERIFIER_API_KEY if you have one.
 */

export const VERIFIER_BASE = process.env.VERIFIER_URL ?? "https://fdc-verifiers-testnet.flare.network";
export const DA_LAYER_BASE = process.env.DA_LAYER_URL ?? "https://ctn2-data-availability.flare.network";
const API_KEY = process.env.VERIFIER_API_KEY ?? "00000000-0000-0000-0000-000000000000";

/** FDC protocol id in the Relay contract. */
const FDC_PROTOCOL_ID = 200;

export function toHex32(s: string): string {
  return ethers.zeroPadBytes(ethers.toUtf8Bytes(s), 32).toLowerCase();
}

/**
 * ethers decodes into a frozen `Result`. Passing one straight back into a
 * contract call fails with "Cannot assign to read only property" because the
 * encoder normalises tuples in place, so deep-convert to plain values first.
 */
export function plain(value: any): any {
  if (Array.isArray(value)) return value.map(plain);
  if (typeof value === "object" && value !== null && typeof value.toObject === "function") {
    const obj = value.toObject();
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, plain(v)]));
  }
  return value;
}

async function post(url: string, body: unknown): Promise<any> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": API_KEY, "X-apikey": API_KEY },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${url} → HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}: ${text.slice(0, 300)}`);
  return json;
}

/** Asks the verifier to encode an attestation request. */
export async function prepareRequest(
  typeName: "XRPPayment" | "XRPPaymentNonexistence",
  requestBody: Record<string, unknown>,
): Promise<string> {
  const url = `${VERIFIER_BASE}/verifier/xrp/${typeName}/prepareRequest`;
  const out = await post(url, {
    attestationType: toHex32(typeName),
    sourceId: toHex32("testXRP"),
    requestBody,
  });

  if (out.status !== "VALID") {
    throw new Error(`verifier rejected the request: ${out.status ?? JSON.stringify(out).slice(0, 200)}`);
  }
  return out.abiEncodedRequest;
}

/** Submits the encoded request to FdcHub and returns its voting round id. */
export async function submitRequest(abiEncodedRequest: string): Promise<number> {
  const [signer] = await ethers.getSigners();

  const registry = await ethers.getContractAt(
    ["function getContractAddressByName(string) view returns (address)"],
    "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019", // FlareContractRegistry, stable per network
    signer,
  );

  const hubAddr: string = await registry.getContractAddressByName("FdcHub");
  const feeCfgAddr: string = await registry.getContractAddressByName("FdcRequestFeeConfigurations");
  const systemsAddr: string = await registry.getContractAddressByName("FlareSystemsManager");

  const feeCfg = await ethers.getContractAt(
    ["function getRequestFee(bytes) view returns (uint256)"],
    feeCfgAddr,
    signer,
  );
  const fee: bigint = await feeCfg.getRequestFee(abiEncodedRequest);

  const hub = await ethers.getContractAt(
    ["function requestAttestation(bytes) payable"],
    hubAddr,
    signer,
  );

  console.log(`  fee: ${ethers.formatEther(fee)} C2FLR`);
  const tx = await hub.requestAttestation(abiEncodedRequest, { value: fee });
  const receipt = await tx.wait();
  console.log(`  tx:  ${receipt!.hash}`);

  const block = await ethers.provider.getBlock(receipt!.blockNumber);
  const systems = await ethers.getContractAt(
    [
      "function firstVotingRoundStartTs() view returns (uint64)",
      "function votingEpochDurationSeconds() view returns (uint64)",
    ],
    systemsAddr,
    signer,
  );
  const first: bigint = await systems.firstVotingRoundStartTs();
  const dur: bigint = await systems.votingEpochDurationSeconds();
  const round = Number((BigInt(block!.timestamp) - first) / dur);
  console.log(`  round: ${round}`);
  return round;
}

/** Blocks until the Relay reports the round finalised. */
export async function waitForFinalisation(round: number, timeoutMs = 600_000): Promise<void> {
  const [signer] = await ethers.getSigners();
  const registry = await ethers.getContractAt(
    ["function getContractAddressByName(string) view returns (address)"],
    "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
    signer,
  );
  const relay = await ethers.getContractAt(
    ["function isFinalized(uint256,uint256) view returns (bool)"],
    await registry.getContractAddressByName("Relay"),
    signer,
  );

  const started = Date.now();
  process.stdout.write("  waiting for finalisation");
  while (Date.now() - started < timeoutMs) {
    if (await relay.isFinalized(FDC_PROTOCOL_ID, round)) {
      console.log(` — finalised after ${Math.round((Date.now() - started) / 1000)}s`);
      return;
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 10_000));
  }
  throw new Error(`round ${round} did not finalise within ${timeoutMs / 1000}s`);
}

/** Retrieves the Merkle proof and raw response from the DA Layer. */
export async function fetchProof(
  round: number,
  abiEncodedRequest: string,
): Promise<{ proof: string[]; responseHex: string }> {
  const url = `${DA_LAYER_BASE}/api/v1/fdc/proof-by-request-round-raw`;

  // The DA Layer answers 400 "attestation request not found" for a minute or so
  // after the round finalises, while it finishes indexing. That is a retryable
  // state, not a failure — so this deliberately does not go through post(),
  // which throws on any non-2xx and would abort the loop on the first attempt.
  process.stdout.write("  fetching proof");
  for (let attempt = 0; attempt < 18; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votingRoundId: round, requestBytes: abiEncodedRequest }),
    });
    const text = await res.text();

    if (res.ok) {
      const out = JSON.parse(text);
      if (out?.proof && out?.response_hex) {
        console.log(` — got it after ${attempt + 1} attempt(s)`);
        return { proof: out.proof, responseHex: out.response_hex };
      }
    } else if (!text.includes("not found")) {
      throw new Error(`DA Layer → HTTP ${res.status}: ${text.slice(0, 200)}`);
    }

    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 10_000));
  }
  throw new Error(`DA Layer never returned a proof for round ${round}`);
}
