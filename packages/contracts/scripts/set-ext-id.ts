import { ethers } from "hardhat";
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
async function main() {
  const [signer] = await ethers.getSigners();
  const v = await ethers.getContractAt("HeirloomVault", VAULT, signer);
  console.log(`caller: ${signer.address}`);
  console.log(`owner:  ${await v.owner()}`);
  try {
    console.log(`extensionId already set: ${await v.extensionId()}`);
    return;
  } catch { console.log("extensionId not set yet — scanning registry..."); }
  const tx = await v.setExtensionId();
  const r = await tx.wait();
  console.log(`tx: ${r?.hash}`);
  console.log(`extensionId now: ${await v.extensionId()}`);
}
main().catch((e) => { console.error(e?.shortMessage ?? e); process.exitCode = 1; });