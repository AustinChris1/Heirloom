import { ethers } from "hardhat";

/**
 * Points HeirloomVault at the registered TEE machine.
 *
 * Settlement recovers the signer of a TEE-signed ActionResult and requires it
 * to equal this address, so until it is set every confirmSeal/settleEstate
 * reverts with TeeNotConfigured.
 *
 * This is deliberately re-callable: Flare confirmed TEE identity does not
 * survive a container restart, so after any restart you re-register the machine
 * and call this again with the new id. Skipping it leaves the contract checking
 * signatures against a machine that no longer exists.
 */
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
const TEE_ID = process.env.TEE_ID ?? "0xb1c696717eedEb7e215f381d81f8edaA185eE60c";

async function main() {
  const [signer] = await ethers.getSigners();
  const vault = await ethers.getContractAt("HeirloomVault", VAULT, signer);

  const current = await vault.teeAddress();
  console.log(`vault:       ${VAULT}`);
  console.log(`current tee: ${current}`);
  console.log(`target tee:  ${TEE_ID}`);

  if (current.toLowerCase() === TEE_ID.toLowerCase()) {
    console.log("\nalready set — nothing to do.");
    return;
  }

  const tx = await vault.setTeeAddress(TEE_ID);
  const receipt = await tx.wait();
  console.log(`\ntx: ${receipt?.hash}`);
  console.log(`now: ${await vault.teeAddress()}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
