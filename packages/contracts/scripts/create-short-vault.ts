import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Creates a vault with a deliberately short heartbeat interval so dormancy can
 * be demonstrated without waiting 90 days. Uses the cached XRPL testnet wallet
 * as the estate account so the same vault can also be revived with proveLife.
 */
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
const WALLET_CACHE = path.join(__dirname, "..", "deployments", "xrpl-testnet-wallet.json");
const INTERVAL = BigInt(process.env.INTERVAL ?? 120); // seconds
const GRACE = BigInt(process.env.GRACE ?? 0);

async function main() {
  const [signer] = await ethers.getSigners();
  const vault = await ethers.getContractAt("HeirloomVault", VAULT, signer);

  const { address } = JSON.parse(fs.readFileSync(WALLET_CACHE, "utf8"));
  const accountHash = ethers.keccak256(ethers.toUtf8Bytes(address));

  const id: bigint = await vault.vaultCount();
  console.log(`creating vault #${id} — interval ${INTERVAL}s, grace ${GRACE}s, estate ${address}`);

  const tx = await vault.createVault(accountHash, INTERVAL, GRACE, [], 0, ethers.id(`short-${id}`));
  await tx.wait();

  console.log(`  tag: ${await vault.heartbeatTag(id)}`);
  console.log(`  overdue in ${Number(await vault.timeUntilHeartbeatDue(id))}s`);
  console.log(`\nVAULT_ID=${id}`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exitCode = 1;
});
