import { ethers } from "hardhat";

/**
 * End-to-end relay test: does a HEIRLOOM/SEAL instruction actually reach the TEE?
 *
 * This is the check that matters most right now. Registration succeeding only
 * proves data providers could fetch our attestation; it says nothing about
 * whether instructions route. It also rules out the op-name collision another
 * team hit, where a custom op sharing a system command word was silently never
 * relayed.
 *
 * The ciphertext here is deliberately junk. We are testing the transport, not
 * the crypto — the enclave should receive it and fail at the decrypt step,
 * which still proves the whole chain vault → registry → provider → proxy → TEE
 * is live. A real seal needs the payload ECIES-encrypted to the TEE public key.
 */
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";

async function main() {
  const [signer] = await ethers.getSigners();
  const vault = await ethers.getContractAt("HeirloomVault", VAULT, signer);

  console.log(`vault:       ${VAULT}`);
  console.log(`extensionId: ${await vault.extensionId()}`);
  console.log(`teeAddress:  ${await vault.teeAddress()}`);

  const vaultId = 0n;
  const v = await vault.vaults(vaultId);
  console.log(`\nvault #${vaultId} state: ${v.state} (1=Active)`);
  if (v.owner.toLowerCase() !== (await signer.getAddress()).toLowerCase()) {
    throw new Error(`vault ${vaultId} is owned by ${v.owner}, not ${await signer.getAddress()}`);
  }

  // Junk ciphertext — enough to be a non-empty payload the TEE will try to open.
  const payload = ethers.hexlify(ethers.randomBytes(96));

  console.log(`\nsending HEIRLOOM/SEAL for vault ${vaultId}...`);
  const fee = ethers.parseEther("1");
  const tx = await vault.sealWill(vaultId, payload, { value: fee });
  const receipt = await tx.wait();
  console.log(`  tx:     ${receipt?.hash}`);
  console.log(`  gas:    ${receipt?.gasUsed}`);

  // The registry emits the instruction id; surface it so the proxy logs can be
  // grepped for the same value.
  for (const log of receipt?.logs ?? []) {
    try {
      const parsed = vault.interface.parseLog({ topics: [...log.topics], data: log.data });
      if (parsed) console.log(`  event:  ${parsed.name}(${parsed.args.map(String).join(", ")})`);
    } catch {
      /* logs from the registry itself won't parse against the vault ABI */
    }
  }

  console.log(`\nNow watch the extension for a POST /action carrying this instruction.`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
