import { ethers } from "hardhat";
import { Client, Wallet } from "xrpl";
import * as fs from "fs";
import * as path from "path";

/**
 * Sends a heartbeat for a vault, with the destination tag set correctly.
 *
 * Browser wallets are the weak link here: the destination tag is usually behind
 * an "advanced" toggle, and a payment sent without it succeeds on XRPL while
 * silently failing to count. This does it deterministically instead.
 *
 * The vault must be registered to the wallet cached in
 * deployments/xrpl-testnet-wallet.json — the contract requires the heartbeat to
 * originate from the estate account, so anybody cannot keep a vault alive.
 *
 *   VAULT_ID=5 pnpm exec hardhat run scripts/send-heartbeat.ts --network coston2
 */
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
const BEACON = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
const TESTNET_WSS = "wss://s.altnet.rippletest.net:51233";
const WALLET_CACHE = path.join(__dirname, "..", "deployments", "xrpl-testnet-wallet.json");
const VAULT_ID = BigInt(process.env.VAULT_ID ?? 0);

async function main() {
  const vault = await ethers.getContractAt("HeirloomVault", VAULT);
  const v = await vault.vaults(VAULT_ID);
  const tag = Number(await vault.heartbeatTag(VAULT_ID));
  const minDrops: bigint = await vault.heartbeatDrops();

  const client = new Client(TESTNET_WSS);
  await client.connect();

  try {
    let wallet: Wallet;
    if (fs.existsSync(WALLET_CACHE)) {
      wallet = Wallet.fromSeed(JSON.parse(fs.readFileSync(WALLET_CACHE, "utf8")).seed);
    } else {
      console.log("no cached wallet — requesting a funded one from the faucet...");
      wallet = (await client.fundWallet()).wallet;
      fs.mkdirSync(path.dirname(WALLET_CACHE), { recursive: true });
      fs.writeFileSync(WALLET_CACHE, JSON.stringify({ address: wallet.address, seed: wallet.seed }, null, 2));
    }

    console.log(`vault #${VAULT_ID}`);
    console.log(`  sending from: ${wallet.address}`);
    console.log(`  destination:  ${BEACON}`);
    console.log(`  tag:          ${tag}`);
    console.log(`  amount:       ${minDrops} drops`);

    // Fail early rather than paying for an attestation the vault will reject.
    const senderHash = ethers.keccak256(ethers.toUtf8Bytes(wallet.address));
    if (senderHash.toLowerCase() !== v.xrplAccountHash.toLowerCase()) {
      console.log(`\n✗ This vault is not registered to that wallet.`);
      console.log(`  vault expects a sender hashing to ${v.xrplAccountHash}`);
      console.log(`  this wallet hashes to             ${senderHash}`);
      console.log(`\n  Create a vault whose estate account is:\n    ${wallet.address}`);
      return;
    }

    const submitted = await client.submitAndWait(
      {
        TransactionType: "Payment",
        Account: wallet.address,
        Destination: BEACON,
        DestinationTag: tag,
        Amount: minDrops.toString(),
      },
      { wallet },
    );

    const result = (submitted.result.meta as any)?.TransactionResult;
    const hash = submitted.result.hash;
    console.log(`\n  ${result}`);
    console.log(`  ${hash}`);
    console.log(`  https://testnet.xrpl.org/transactions/${hash}`);

    if (result === "tesSUCCESS") {
      console.log(`\n→ Paste this into "Prove life" in the app:\n\n   ${hash}\n`);
    }
  } finally {
    await client.disconnect();
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exitCode = 1;
});
