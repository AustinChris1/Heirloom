import { ethers } from "hardhat";
import { COSTON2 } from "./coston2";
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
async function main() {
  const p = new ethers.JsonRpcProvider(COSTON2.rpc);
  const d = new ethers.Contract(COSTON2.flareTeeManager,
    ["function getTeeExtensionInstructionsSender(uint256) view returns (address)"], p);
  const id = 0x101e9;
  const sender = await d.getTeeExtensionInstructionsSender(id);
  console.log(`extension ${id} (0x${id.toString(16)}) -> sender ${sender}`);
  console.log(`bound to HeirloomVault: ${sender.toLowerCase() === VAULT.toLowerCase()}`);
}
main().catch((e) => { console.error(e); process.exitCode = 1; });