import { ethers } from "hardhat";
import { Client } from "xrpl";
import { fetchProof, plain, prepareRequest, submitRequest, waitForFinalisation } from "./fdc";

/**
 * The dead-man's switch, against live infrastructure.
 *
 * Proves that across an entire XRPL ledger range, *no* payment carrying this
 * vault's destination tag reached the beacon — then submits that proof to
 * claimDormancy. This is the attestation type the whole design rests on:
 * proving a payment happened is common, proving none exists is not.
 *
 * Uses a vault whose heartbeat window has already lapsed. VAULT_ID must name a
 * vault that is Active and overdue.
 */
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
const BEACON = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
const TESTNET_WSS = "wss://s.altnet.rippletest.net:51233";
const VAULT_ID = BigInt(process.env.VAULT_ID ?? 0);

async function main() {
  const [signer] = await ethers.getSigners();
  const vault = await ethers.getContractAt("HeirloomVault", VAULT, signer);

  const v = await vault.vaults(VAULT_ID);
  const tag: bigint = await vault.heartbeatTag(VAULT_ID);
  const overdue: boolean = await vault.isHeartbeatOverdue(VAULT_ID);

  console.log(`vault #${VAULT_ID}`);
  console.log(`  state:   ${v.state} (1=Active)`);
  console.log(`  tag:     ${tag}`);
  console.log(`  overdue: ${overdue}`);
  if (Number(v.state) !== 1) throw new Error(`vault must be Active; it is ${v.state}`);
  if (!overdue) {
    const secs = await vault.timeUntilHeartbeatDue(VAULT_ID);
    throw new Error(`vault is not overdue yet — ${Number(secs) / 3600}h remaining`);
  }

  // The search range must cover the whole interval the heartbeat was due in.
  const client = new Client(TESTNET_WSS);
  await client.connect();
  let minimalBlock: number;
  let deadlineBlock: number;
  let deadlineTs: number;
  try {
    const info = await client.request({ command: "ledger", ledger_index: "validated" });
    const current = Number(info.result.ledger_index ?? info.result.ledger.ledger_index);

    // Look back over a window comfortably inside the ledger the verifier holds,
    // ending a few ledgers back so the range is fully finalised.
    deadlineBlock = current - 5;
    minimalBlock = deadlineBlock - 400;

    const dl = await client.request({ command: "ledger", ledger_index: deadlineBlock });
    deadlineTs = Number(dl.result.ledger.close_time) + 946_684_800; // ripple epoch → unix

    console.log(`\nsearch range: ledgers ${minimalBlock} … ${deadlineBlock}`);
  } finally {
    await client.disconnect();
  }

  // The attestation excludes payments delivering *more than* `amount`, so the
  // contract requires exactly heartbeatDrops - 1: that excludes everything that
  // would have counted as a heartbeat, and nothing smaller.
  const heartbeatDrops: bigint = await vault.heartbeatDrops();
  const amount = (heartbeatDrops - 1n).toString();

  console.log("\n=== FDC attestation (XRPPaymentNonexistence) ===");
  console.log(`  amount: ${amount} (heartbeatDrops ${heartbeatDrops} - 1)`);
  const encoded = await prepareRequest("XRPPaymentNonexistence", {
    minimalBlockNumber: String(minimalBlock),
    deadlineBlockNumber: String(deadlineBlock),
    deadlineTimestamp: String(deadlineTs),
    destinationAddressHash: ethers.keccak256(ethers.toUtf8Bytes(BEACON)),
    amount,
    checkFirstMemoData: false,
    firstMemoDataHash: ethers.ZeroHash,
    checkDestinationTag: true,
    destinationTag: String(tag),
    // The vault only accepts a proof addressed to itself (or to nobody).
    proofOwner: VAULT,
  });
  console.log(`  encoded: ${encoded.slice(0, 42)}…`);

  const round = await submitRequest(encoded);
  await waitForFinalisation(round);

  const { proof, responseHex } = await fetchProof(round, encoded);
  console.log(`  proof nodes: ${proof.length}`);

  const fragment = vault.interface.getFunction("claimDormancy")!;
  const responseType = fragment.inputs[1].components![1];
  const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
    [responseType as any],
    responseHex.startsWith("0x") ? responseHex : `0x${responseHex}`,
  )[0];

  console.log("\n=== claimDormancy on Coston2 ===");
  const tx = await vault.claimDormancy(VAULT_ID, { merkleProof: proof, data: plain(decoded) });
  const receipt = await tx.wait();
  console.log(`  tx: ${receipt!.hash}`);

  const after = await vault.vaults(VAULT_ID);
  console.log(`\n  state ${v.state} → ${after.state} (2=Dormant)`);
  console.log(after.state === 2n ? "  ✓ DORMANCY PROVEN ON-CHAIN" : "  ✗ state did not change");
}

main().catch((e) => {
  console.error(`\n${e.message ?? e}`);
  process.exitCode = 1;
});
