import { Client, Wallet as XrplWallet } from "xrpl";
import * as fs from "fs";
import * as path from "path";

/**
 * Delegates a regular key on the estate account — the production trust model,
 * demonstrated for real.
 *
 * XRPL lets an account authorise a second signing key (`SetRegularKey`)
 * without surrendering its master key. The owner does this once, while alive.
 * From then on the delegate can sign payments *from* the estate, the master
 * seed can go in a drawer, and revoking is one transaction away at any time.
 *
 * In the finished product the delegate keypair lives inside the TEE. Here it
 * is generated locally and handed to the keeper (see keeper.ts), which is the
 * same trust shape one step earlier: payouts no longer touch the master seed.
 */
const TESTNET_WSS = "wss://s.altnet.rippletest.net:51233";
const WALLET_CACHE = path.join(__dirname, "..", "deployments", "xrpl-testnet-wallet.json");
const KEEPER_CACHE = path.join(__dirname, "..", "deployments", "keeper-key.json");

async function main() {
  const { address, seed } = JSON.parse(fs.readFileSync(WALLET_CACHE, "utf8"));
  const estate = XrplWallet.fromSeed(seed);
  if (estate.classicAddress !== address) throw new Error("cached seed does not match cached address");

  // Reuse an existing keeper key so re-running is idempotent.
  let keeper: XrplWallet;
  if (fs.existsSync(KEEPER_CACHE)) {
    keeper = XrplWallet.fromSeed(JSON.parse(fs.readFileSync(KEEPER_CACHE, "utf8")).seed);
    console.log(`existing keeper key: ${keeper.classicAddress}`);
  } else {
    keeper = XrplWallet.generate();
    fs.writeFileSync(KEEPER_CACHE, JSON.stringify({ address: keeper.classicAddress, seed: keeper.seed }, null, 2));
    console.log(`generated keeper key: ${keeper.classicAddress} → saved to deployments/keeper-key.json`);
  }

  const client = new Client(TESTNET_WSS);
  await client.connect();
  try {
    const tx = await client.autofill({
      TransactionType: "SetRegularKey" as const,
      Account: estate.classicAddress,
      RegularKey: keeper.classicAddress,
    });
    const signed = estate.sign(tx);
    const result = await client.submitAndWait(signed.tx_blob);
    const outcome = (result.result.meta as any)?.TransactionResult;
    console.log(`SetRegularKey: ${outcome} — https://testnet.xrpl.org/transactions/${signed.hash}`);
    if (outcome !== "tesSUCCESS") process.exitCode = 1;
    else {
      console.log(`\nThe estate's master seed is no longer needed for payouts.`);
      console.log(`The keeper signs with the delegated key; the owner can revoke it any time while alive.`);
    }
  } finally {
    await client.disconnect();
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exitCode = 1;
});
