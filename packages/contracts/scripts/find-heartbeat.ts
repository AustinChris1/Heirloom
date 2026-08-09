import { ethers } from "hardhat";
import { Client } from "xrpl";

/**
 * Finds a heartbeat payment on XRPL and checks whether the vault will accept it.
 *
 * `proveLife` requires the payment to originate from the vault's own registered
 * XRPL account. Sending from a different wallet produces a valid attestation
 * that the contract then rejects — which is confusing to debug after the fact,
 * so check before spending a round on it.
 */
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
const BEACON = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
const VAULT_ID = BigInt(process.env.VAULT_ID ?? 3);

async function main() {
  const vault = await ethers.getContractAt("HeirloomVault", VAULT);
  const v = await vault.vaults(VAULT_ID);
  const tag = Number(await vault.heartbeatTag(VAULT_ID));
  const minDrops: bigint = await vault.heartbeatDrops();

  console.log(`vault #${VAULT_ID}`);
  console.log(`  registered account hash: ${v.xrplAccountHash}`);
  console.log(`  expects destination tag: ${tag}`);
  console.log(`  minimum: ${minDrops} drops`);
  console.log(`  lastHeartbeat: ${v.lastHeartbeat}`);

  const client = new Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();
  try {
    const res: any = await client.request({
      command: "account_tx",
      account: BEACON,
      ledger_index_min: -1,
      ledger_index_max: -1,
      limit: 200,
      forward: false,
    });

    const matches = (res.result.transactions ?? []).filter((t: any) => {
      const tx = t.tx_json ?? t.tx;
      return tx?.TransactionType === "Payment" && tx?.DestinationTag === tag;
    });

    console.log(`\npayments to the beacon carrying tag ${tag}: ${matches.length}`);
    if (matches.length === 0) {
      console.log("  none found — check the destination tag was set on the payment.");
      return;
    }

    for (const m of matches.slice(0, 5)) {
      const tx = m.tx_json ?? m.tx;
      const hash = m.hash ?? tx.hash;
      const sender: string = tx.Account;
      const delivered = m.meta?.delivered_amount ?? tx.Amount;
      const senderHash = ethers.keccak256(ethers.toUtf8Bytes(sender));
      const ok = senderHash.toLowerCase() === v.xrplAccountHash.toLowerCase();

      console.log(`\n  tx     ${hash}`);
      console.log(`  from   ${sender}`);
      console.log(`  amount ${delivered} drops`);
      console.log(`  result ${m.meta?.TransactionResult}`);
      console.log(`  sender matches the vault's registered account: ${ok ? "YES ✓" : "NO ✗"}`);
      if (!ok) {
        console.log(`         sender hashes to ${senderHash}`);
        console.log(`         vault expects    ${v.xrplAccountHash}`);
      }
      if (ok) {
        console.log(`\n  → paste this hash into "Prove life":\n     ${hash}`);
      }
    }
  } finally {
    await client.disconnect();
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exitCode = 1;
});
