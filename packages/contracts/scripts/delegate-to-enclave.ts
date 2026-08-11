import { Client, Wallet as XrplWallet } from "xrpl";
import * as fs from "fs";
import * as path from "path";

/**
 * Delegates the ENCLAVE's own XRPL key as the estate's regular key.
 *
 * This is the production trust model, complete: the enclave generates its
 * signing key inside the TEE (derived from the TEE identity, never stored),
 * publishes only the address, and the estate owner authorises that address
 * while alive with one `SetRegularKey`. After that the enclave can sign the
 * estate's payouts and nobody — not the keeper operator, not Heirloom, not
 * the heirs — ever holds a key that could move the funds.
 *
 * Contrast with set-regular-key.ts, which delegates to a locally generated
 * keeper key. Same XRPL mechanism, one rung less trust: this script's key
 * never leaves hardware.
 *
 * Requires the enclave's /direct endpoint to be enabled (see TEE-DEPLOYMENT).
 */
const ENCLAVE = process.env.ENCLAVE_URL ?? "https://sly.southafricanorth.cloudapp.azure.com";
const TESTNET_WSS = "wss://s.altnet.rippletest.net:51233";
const WALLET_CACHE = path.join(__dirname, "..", "deployments", "xrpl-testnet-wallet.json");

function bytes32Hex(s: string): string {
  const buf = Buffer.alloc(32);
  buf.write(s, "utf-8");
  return "0x" + buf.toString("hex");
}

/** Runs a direct action against the enclave and returns its decoded JSON payload. */
async function directAction(opCommand: string, payload?: unknown): Promise<any> {
  const message = payload ? "0x" + Buffer.from(JSON.stringify(payload), "utf-8").toString("hex") : "0x00";

  const queued = await (
    await fetch(`${ENCLAVE}/direct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opType: bytes32Hex("HEIRLOOM"), opCommand: bytes32Hex(opCommand), message }),
    })
  ).json();

  const actionId = queued?.data?.id;
  if (!actionId) throw new Error(`enclave did not queue the action: ${JSON.stringify(queued)}`);

  const started = Date.now();
  while (Date.now() - started < 120_000) {
    // Direct results are stored under the "submit" tag; the endpoint defaults
    // to "threshold" and would never find them.
    const res = await fetch(`${ENCLAVE}/action/result/${actionId}?submissionTag=submit`);
    if (res.ok) {
      const out = await res.json();
      if (out?.result?.id && Number(out.result.status ?? 0) < 2) {
        if (out.result.status !== 1) throw new Error(`enclave refused: ${out.result.log}`);
        return JSON.parse(Buffer.from(out.result.data.replace(/^0x/, ""), "hex").toString("utf-8"));
      }
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error("no result from the enclave within 2 minutes");
}

async function main() {
  console.log(`asking ${ENCLAVE} for its XRPL signing address…`);
  const { address: enclaveAddress } = await directAction("ADDRESS");
  console.log(`enclave XRPL address: ${enclaveAddress}`);

  const { address, seed } = JSON.parse(fs.readFileSync(WALLET_CACHE, "utf8"));
  const estate = XrplWallet.fromSeed(seed);
  if (estate.classicAddress !== address) throw new Error("cached seed does not match cached address");

  const client = new Client(TESTNET_WSS);
  await client.connect();
  try {
    const tx = await client.autofill({
      TransactionType: "SetRegularKey" as const,
      Account: estate.classicAddress,
      RegularKey: enclaveAddress,
    });
    const signed = estate.sign(tx);
    const result = await client.submitAndWait(signed.tx_blob);
    const outcome = (result.result.meta as any)?.TransactionResult;
    console.log(`SetRegularKey: ${outcome} — https://testnet.xrpl.org/transactions/${signed.hash}`);
    if (outcome !== "tesSUCCESS") {
      process.exitCode = 1;
      return;
    }
    console.log(`\nThe estate's payouts can now be signed by the enclave itself.`);
    console.log(`No human holds a key that can move this estate; the owner can revoke while alive.`);
  } finally {
    await client.disconnect();
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exitCode = 1;
});
