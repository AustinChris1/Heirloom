import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Creates a throwaway Coston2 deployer key and writes it to .env (gitignored).
 * Testnet only — never reuse this key anywhere that holds value.
 */
async function main() {
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath) && /PRIVATE_KEY=\S/.test(fs.readFileSync(envPath, "utf8"))) {
    console.log(".env already has a PRIVATE_KEY — leaving it alone.");
    return;
  }

  const wallet = ethers.Wallet.createRandom();
  fs.writeFileSync(
    envPath,
    [
      "# Coston2 testnet deployer. Throwaway key — do not reuse.",
      `PRIVATE_KEY=${wallet.privateKey.slice(2)}`,
      "COSTON2_RPC=https://coston2-api.flare.network/ext/C/rpc",
      "",
    ].join("\n"),
  );

  console.log(`Deployer address: ${wallet.address}`);
  console.log(`Fund it at:       https://faucet.flare.network/coston2`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
