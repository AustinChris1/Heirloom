import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Post-deploy smoke test against the live contract.
 *
 * Creates a real vault, reads it back, and confirms the FTSO wiring and the
 * heartbeat-tag allocation behave on-chain the way the unit tests say they do.
 */
async function main() {
  const file = path.join(__dirname, "..", "deployments", `${network.name}.json`);
  const deployment = JSON.parse(fs.readFileSync(file, "utf8"));
  const address = deployment.contracts.HeirloomVault;

  const [signer] = await ethers.getSigners();
  const vault = await ethers.getContractAt("HeirloomVault", address, signer);
  console.log(`HeirloomVault @ ${address}\n`);

  console.log(`  owner:           ${await vault.owner()}`);
  console.log(`  beaconHash:      ${await vault.beaconAddressHash()}`);
  console.log(`  heartbeatDrops:  ${await vault.heartbeatDrops()}`);

  const [priceE18, ts] = await vault.xrpUsdPrice();
  console.log(`  FTSO XRP/USD:    $${ethers.formatUnits(priceE18, 18)} (ts ${ts})`);

  // 100,000 XRP valued through the live feed.
  const usd = await vault.estateValueUsdE18(100_000n * 1_000_000n);
  console.log(`  100,000 XRP  =   $${Number(ethers.formatUnits(usd, 18)).toLocaleString("en-US")}`);

  const before = await vault.vaultCount();
  console.log(`\n  vaults before:   ${before}`);

  if (process.env.SMOKE_CREATE === "1") {
    const xrplAccountHash = ethers.keccak256(ethers.toUtf8Bytes("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"));
    const willCommitment = ethers.keccak256(ethers.toUtf8Bytes("smoke-test-will"));
    const NINETY_DAYS = 90 * 24 * 60 * 60;
    const THIRTY_DAYS = 30 * 24 * 60 * 60;

    console.log(`  creating a vault...`);
    const tx = await vault.createVault(xrplAccountHash, NINETY_DAYS, THIRTY_DAYS, [], 0, willCommitment);
    const receipt = await tx.wait();
    console.log(`  tx:              ${receipt?.hash}`);

    const id = before;
    const v = await vault.vaults(id);
    console.log(`\n  vault ${id}`);
    console.log(`    state:         ${["None", "Active", "Dormant", "Executing", "Settled", "Revoked"][Number(v.state)]}`);
    console.log(`    heartbeatTag:  ${await vault.heartbeatTag(id)}`);
    console.log(`    lastHeartbeat: ${v.lastHeartbeat}`);
    console.log(`    due in:        ${Number(await vault.timeUntilHeartbeatDue(id)) / 86400} days`);
    console.log(`    overdue:       ${await vault.isHeartbeatOverdue(id)}`);
    console.log(`    canExecute:    ${await vault.canExecute(id)}`);
    console.log(`\n  Explorer: ${deployment.explorer}`);
  } else {
    console.log(`\n  (set SMOKE_CREATE=1 to also create a live vault)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
