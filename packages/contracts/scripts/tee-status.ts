import { ethers } from "hardhat";

/**
 * Reads the live FCC registry's view of our TEE machine.
 *
 * This is the authoritative check — the container's own /info reports what it
 * believes, but only the chain decides whether data providers will route
 * instructions to it. Status 2 (PRODUCTION) is the bar.
 */
const TEE_MANAGER = "0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE";
const TEE_ID = process.env.TEE_ID ?? "0xb1c696717eedEb7e215f381d81f8edaA185eE60c";
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";

const ABI = [
  "function getTeeMachineStatus(address) view returns (uint8)",
  "function getTeeMachine(address) view returns (tuple(address owner, address extension, string url))",
  "function getActiveTeeMachines(uint256) view returns (address[])",
];

const STATUS = ["NONE", "INITIALIZED", "PRODUCTION", "RETIRED"];

async function main() {
  const mgr = await ethers.getContractAt(ABI, TEE_MANAGER);

  const status: bigint = await mgr.getTeeMachineStatus(TEE_ID);
  console.log(`TEE ${TEE_ID}`);
  console.log(`  status:     ${status} (${STATUS[Number(status)] ?? "?"})`);

  try {
    const m = await mgr.getTeeMachine(TEE_ID);
    console.log(`  owner:      ${m.owner}`);
    console.log(`  extension:  ${m.extension}`);
    console.log(`  url:        ${m.url}`);
  } catch {
    console.log(`  (machine record not readable with this ABI shape)`);
  }

  try {
    const active: string[] = await mgr.getActiveTeeMachines(66025n);
    console.log(`\n  active machines on extension 66025: ${active.length}`);
    active.forEach((a) => console.log(`    ${a}${a.toLowerCase() === TEE_ID.toLowerCase() ? "  <- ours" : ""}`));
  } catch (e) {
    console.log(`\n  getActiveTeeMachines unavailable: ${(e as Error).message.slice(0, 80)}`);
  }

  // What the vault itself is wired to.
  const vault = await ethers.getContractAt(
    ["function extensionId() view returns (uint256)", "function teeAddress() view returns (address)"],
    VAULT,
  );
  console.log(`\nHeirloomVault ${VAULT}`);
  console.log(`  extensionId: ${await vault.extensionId()}`);
  console.log(`  teeAddress:  ${await vault.teeAddress()}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
