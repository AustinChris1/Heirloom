import { ethers } from "hardhat";

/**
 * Retires a dead TEE machine from an extension's active set.
 *
 * A TEE identity does not survive a container rebuild, so every redeploy leaves
 * the previous machine registered and *still in the active set*. That matters:
 * `getRandomTeeIds` picks uniformly from that set, so a dead entry silently
 * swallows a share of every instruction — the vault sends SEAL, the chosen
 * machine no longer exists, and no result ever comes back.
 *
 * Run after re-registering, with OLD_TEE set to the retired id.
 */
const FLARE_TEE_MANAGER = "0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE";
const EXTENSION_ID = 66025n;
const OLD_TEE = process.env.OLD_TEE ?? "0xb1c696717eedEb7e215f381d81f8edaA185eE60c";

const ABI = [
  "function getTeeMachineStatus(address) view returns (uint8)",
  "function getTeeMachines(uint256) view returns (address[])",
  "function pause(address)",
  "function pauseTeeMachine(address)",
  "function ban(address)",
  "function removeTeeMachine(address)",
];

async function main() {
  const [signer] = await ethers.getSigners();
  const registry = new ethers.Contract(FLARE_TEE_MANAGER, ABI, signer);

  console.log(`signer:  ${await signer.getAddress()}`);
  console.log(`old TEE: ${OLD_TEE}`);
  try {
    console.log(`status:  ${await registry.getTeeMachineStatus(OLD_TEE)} (2 = PRODUCTION, 4 = PAUSED)`);
  } catch {
    console.log("status:  unreadable");
  }

  // The registry's retirement method name is not pinned in our ABI subset, so
  // try the plausible ones and report which exists.
  for (const method of ["pause", "pauseTeeMachine", "removeTeeMachine", "ban"]) {
    try {
      const tx = await (registry as any)[method](OLD_TEE);
      await tx.wait();
      console.log(`\n✓ ${method}(${OLD_TEE}) succeeded — tx ${tx.hash}`);
      console.log(`status now: ${await registry.getTeeMachineStatus(OLD_TEE)}`);
      return;
    } catch (e: any) {
      console.log(`  ${method}: ${(e.shortMessage ?? e.message ?? "").slice(0, 90)}`);
    }
  }
  console.log("\nNo retirement method succeeded — inspect the registry ABI on the explorer.");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
