import { ethers } from "hardhat";

/**
 * Full system health check. Reads only — safe to run any time, including
 * immediately before recording a demo.
 */
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
const TEE_MANAGER = "0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE";
const PROXY = "https://sly.southafricanorth.cloudapp.azure.com";
const STATE = ["None", "Active", "Dormant", "Executing", "Settled", "Revoked"];

async function main() {
  const vault = await ethers.getContractAt("HeirloomVault", VAULT);
  let problems = 0;
  const bad = (msg: string) => {
    console.log(`  ✗ ${msg}`);
    problems++;
  };

  console.log("=== Contract ===");
  const extId: bigint = await vault.extensionId();
  const teeAddr: string = await vault.teeAddress();
  const beacon: string = await vault.beaconAddressHash();
  console.log(`  extensionId:  ${extId}`);
  console.log(`  teeAddress:   ${teeAddr}`);
  if (extId === 0n) bad("extensionId unset");
  if (teeAddr === ethers.ZeroAddress) bad("teeAddress unset — settlements would revert");
  if (beacon === ethers.ZeroHash) bad("beacon not configured");

  console.log("\n=== FTSO ===");
  const [price, ts] = await vault.xrpUsdPrice();
  const age = Math.floor(Date.now() / 1000) - Number(ts);
  console.log(`  XRP/USD: $${ethers.formatUnits(price, 18)} (${age}s old)`);
  if (price === 0n) bad("FTSO returned zero");
  if (age > 300) bad(`FTSO feed is ${age}s stale`);

  console.log("\n=== TEE machine ===");
  const mgr = await ethers.getContractAt(
    [
      "function getTeeMachineStatus(address) view returns (uint8)",
      "function getActiveTeeMachines(uint256) view returns (address[])",
    ],
    TEE_MANAGER,
  );
  const status: bigint = await mgr.getTeeMachineStatus(teeAddr);
  console.log(`  status: ${status} ${status === 2n ? "(PRODUCTION)" : "(NOT PRODUCTION)"}`);
  if (status !== 2n) {
    bad("TEE not in production — re-run post-build.sh then set-tee-address.ts");
  }
  const active: string[] = await mgr.getActiveTeeMachines(extId).catch(() => []);
  console.log(`  active machines on extension ${extId}: ${active.length}`);
  if (!active.some((a) => a.toLowerCase() === teeAddr.toLowerCase())) {
    bad("the vault's teeAddress is not among the active machines");
  }

  console.log("\n=== Enclave endpoint ===");
  try {
    const res = await fetch(`${PROXY}/info`, { signal: AbortSignal.timeout(20_000) });
    const info: any = await res.json();
    const onChainExt = BigInt(info?.machineData?.extensionId ?? 0);
    console.log(`  HTTP ${res.status}, reports extension ${onChainExt}`);
    if (onChainExt !== extId) bad(`enclave serves extension ${onChainExt}, vault expects ${extId}`);
  } catch (e) {
    bad(`proxy unreachable: ${(e as Error).message}`);
  }

  console.log("\n=== Vaults ===");
  const count: bigint = await vault.vaultCount();
  for (let i = 0n; i < count; i++) {
    const v = await vault.vaults(i);
    const tag = await vault.heartbeatTag(i);
    const overdue = await vault.isHeartbeatOverdue(i);
    const due = Number(await vault.timeUntilHeartbeatDue(i));
    console.log(
      `  #${i}  ${STATE[Number(v.state)].padEnd(8)} tag ${tag}  ` +
        `${overdue ? "OVERDUE" : `due in ${due}s`}  will:${v.willAttested ? "sealed" : "unsealed"}`,
    );
  }

  console.log(problems === 0 ? "\n✓ ALL SYSTEMS GO" : `\n✗ ${problems} problem(s) — see above`);
  if (problems > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exitCode = 1;
});
