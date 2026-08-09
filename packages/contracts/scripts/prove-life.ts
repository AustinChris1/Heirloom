import { ethers } from "hardhat";
import { fetchProof, plain, prepareRequest } from "./fdc";

/**
 * Submits an already-attested XRPL heartbeat to HeirloomVault.proveLife.
 *
 * Split out from live-heartbeat.ts so a run interrupted after the attestation
 * finalised can be resumed without paying for a second one.
 */
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
const TX = process.env.XRPL_TX ?? "84C022779EF8DE35134FFB4C263A6A81CF150DE6C4BFFAE0D6DD4D369A7EDB8D";
const ROUND = Number(process.env.ROUND ?? 1420031);
const VAULT_ID = BigInt(process.env.VAULT_ID ?? 1);

async function main() {
  const [signer] = await ethers.getSigners();
  const vault = await ethers.getContractAt("HeirloomVault", VAULT, signer);

  const encoded = await prepareRequest("XRPPayment", {
    transactionId: `0x${TX}`,
    proofOwner: await signer.getAddress(),
  });

  const { proof, responseHex } = await fetchProof(ROUND, encoded);
  console.log(`  proof nodes: ${proof.length}`);

  const fragment = vault.interface.getFunction("proveLife")!;
  const responseType = fragment.inputs[1].components![1];
  const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
    [responseType as any],
    responseHex.startsWith("0x") ? responseHex : `0x${responseHex}`,
  )[0];

  const before = (await vault.vaults(VAULT_ID)).lastHeartbeat;
  console.log(`\n  lastHeartbeat before: ${before}`);

  const tx = await vault.proveLife(VAULT_ID, { merkleProof: proof, data: plain(decoded) });
  const receipt = await tx.wait();
  console.log(`  tx: ${receipt!.hash}`);

  const after = (await vault.vaults(VAULT_ID)).lastHeartbeat;
  console.log(`  lastHeartbeat after:  ${after}`);
  console.log(after > before ? "\n  ✓ PROOF OF LIFE ACCEPTED ON-CHAIN" : "\n  ✗ heartbeat did not advance");
}

main().catch((e) => {
  console.error(`\n${e.message ?? e}`);
  process.exitCode = 1;
});
