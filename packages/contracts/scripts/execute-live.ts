import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { Client, Wallet as XrplWallet } from "xrpl";

/**
 * Live execute → settle → payout: the final third of the lifecycle.
 *
 * Requires a vault that is Dormant with an attested will (see seal-live.ts and
 * claim-dormancy.ts). Mirrors the browser's ExecutePanel/PayoutPanel:
 *
 *   1. recover the sealed ciphertext from the seal transaction's calldata —
 *      execution needs no private copy of anything;
 *   2. read the estate's live balance from the XRP Ledger;
 *   3. requestExecution — the contract snapshots the FTSO XRP/USD price into
 *      the instruction;
 *   4. wait for the enclave's signed distribution and settle it on-chain;
 *   5. broadcast the settled distribution as real XRPL payments, cross-checked
 *      hash-by-hash against what the contract recorded.
 */
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
const ENCLAVE = "https://sly.southafricanorth.cloudapp.azure.com";
const TESTNET_WSS = "wss://s.altnet.rippletest.net:51233";
const EXPLORER_API = "https://coston2-explorer.flare.network/api";
const VAULT_ID = Number(process.env.VAULT_ID ?? 6);
const WALLET_CACHE = path.join(__dirname, "..", "deployments", "xrpl-testnet-wallet.json");

/**
 * Event lookup via the explorer API. The public RPC caps eth_getLogs at 30
 * blocks, which makes it useless for "find the seal for this vault" — the
 * explorer indexes the whole history and allows any range.
 */
async function findLogs(topic0: string, vaultId: number): Promise<Array<{ topics: string[]; transactionHash: string }>> {
  const topic1 = ethers.zeroPadValue(ethers.toBeHex(vaultId), 32);
  const url =
    `${EXPLORER_API}?module=logs&action=getLogs&fromBlock=33500000&toBlock=latest` +
    `&address=${VAULT}&topic0=${topic0}&topic1=${topic1}&topic0_1_opr=and`;
  const out = await (await fetch(url)).json();
  return Array.isArray(out?.result) ? out.result : [];
}

async function main() {
  const [signer] = await ethers.getSigners();
  const vault = await ethers.getContractAt("HeirloomVault", VAULT, signer);

  const willPath = path.join(__dirname, "..", "deployments", `will-vault-${VAULT_ID}.json`);
  const will = JSON.parse(fs.readFileSync(willPath, "utf8"));

  const v = await vault.vaults(VAULT_ID);
  console.log(`vault #${VAULT_ID} state: ${v.state} (2=Dormant, 3=Executing)  attested: ${v.willAttested}`);

  let instructionId: string | undefined;

  if (Number(v.state) === 2) {
    if (!(await vault.canExecute(VAULT_ID))) throw new Error("canExecute is false — grace or guardians unsatisfied");

    // 1. The ciphertext is public calldata on the seal tx; recover it from the event.
    const logs = await findLogs(vault.interface.getEvent("WillSealed")!.topicHash, VAULT_ID);
    if (logs.length === 0) throw new Error("no WillSealed event for this vault");
    const sealTx = await ethers.provider.getTransaction(logs[logs.length - 1].transactionHash);
    const parsed = vault.interface.parseTransaction({ data: sealTx!.data });
    const encryptedWill: string = parsed!.args._encryptedWill;
    console.log(`recovered ciphertext from chain: ${(encryptedWill.length - 2) / 2} bytes`);

    // 2. Live estate balance.
    const client = new Client(TESTNET_WSS);
    await client.connect();
    const info = await client.request({
      command: "account_info",
      account: will.estateAccount,
      ledger_index: "validated",
    });
    await client.disconnect();
    const estateDrops = BigInt(info.result.account_data.Balance);
    console.log(`estate ${will.estateAccount}: ${Number(estateDrops) / 1e6} XRP`);

    // 3. Instruct the enclave.
    const tx = await vault.requestExecution(VAULT_ID, encryptedWill, estateDrops, {
      value: ethers.parseEther("1"),
    });
    const receipt = await tx.wait();
    for (const log of receipt?.logs ?? []) {
      try {
        const p = vault.interface.parseLog({ topics: [...log.topics], data: log.data });
        if (p?.name === "ExecutionRequested") {
          instructionId = p.args.instructionId;
          console.log(`EXECUTE sent — price snapshot $${ethers.formatEther(p.args.xrpUsdPriceE18)}/XRP`);
        }
      } catch {
        /* registry logs */
      }
    }
    if (!instructionId) throw new Error("no ExecutionRequested event");
  } else if (Number(v.state) === 3) {
    // Resume: find the pending instruction.
    const logs = await findLogs(vault.interface.getEvent("ExecutionRequested")!.topicHash, VAULT_ID);
    if (logs.length === 0) throw new Error("vault is Executing but no ExecutionRequested event found");
    instructionId = logs[logs.length - 1].topics[2];
    console.log(`resuming pending instruction ${instructionId}`);
  } else if (Number(v.state) !== 4) {
    throw new Error(`vault must be Dormant, Executing or Settled; it is ${v.state}`);
  }

  // 4. Wait for the enclave's signed distribution and settle it.
  if (instructionId) {
    console.log(`\npolling ${ENCLAVE}/action/result/${instructionId}`);
    const started = Date.now();
    let result: any = null;
    while (Date.now() - started < 600_000) {
      const res = await fetch(`${ENCLAVE}/action/result/${instructionId}`);
      if (res.ok) {
        const out = await res.json();
        // status >= 2 is pending (node still retrying the extension) — not final.
        if (out?.result?.id && Number(out.result.status ?? 0) < 2) {
          result = out;
          break;
        }
      }
      process.stdout.write(`  waiting… ${Math.round((Date.now() - started) / 1000)}s\r`);
      await new Promise((r) => setTimeout(r, 6000));
    }
    if (!result) throw new Error("no enclave result within 10 minutes");
    console.log(`\n  status: ${result.result.status}  log: ${result.result.log}`);
    if (result.result.status !== 1) throw new Error(`enclave reported failure: ${result.result.log}`);

    const settleTx = await vault.settleEstate(
      result.result.data,
      result.result.id,
      result.result.submissionTag,
      result.result.status,
      result.signature,
    );
    await settleTx.wait();
    console.log(`settleEstate tx: ${settleTx.hash}`);
  }

  // 5. Broadcast the settled distribution as real XRPL payments.
  const distribution = await vault.distributionOf(VAULT_ID);
  console.log(`\nsettled distribution (${distribution.length} bequests):`);

  const addresses: string[] = [...will.bequests.map((b: any) => b.beneficiary), will.residuaryBeneficiary];
  const byHash = new Map(addresses.map((a) => [ethers.keccak256(ethers.toUtf8Bytes(a)).toLowerCase(), a]));

  const { seed } = JSON.parse(fs.readFileSync(WALLET_CACHE, "utf8"));
  const estate = XrplWallet.fromSeed(seed);
  if (estate.classicAddress !== will.estateAccount) throw new Error("cached seed does not control the estate");

  const client = new Client(TESTNET_WSS);
  await client.connect();
  try {
    for (const b of distribution) {
      const beneficiary = byHash.get(b.destinationHash.toLowerCase());
      if (!beneficiary) throw new Error(`settled hash ${b.destinationHash} matches nothing in the will`);
      if (b.drops === 0n) continue;

      console.log(`  → ${beneficiary}: ${Number(b.drops) / 1e6} XRP`);
      const payment = await client.autofill({
        TransactionType: "Payment" as const,
        Account: estate.classicAddress,
        Destination: beneficiary,
        Amount: b.drops.toString(),
        Memos: [
          {
            Memo: {
              MemoType: Buffer.from("heirloom/v1").toString("hex").toUpperCase(),
              MemoData: Buffer.from(`vault:${VAULT_ID};settled`).toString("hex").toUpperCase(),
            },
          },
        ],
      });
      const signed = estate.sign(payment);
      const submitted = await client.submitAndWait(signed.tx_blob);
      const ok = (submitted.result.meta as any)?.TransactionResult;
      console.log(`     ${ok} — https://testnet.xrpl.org/transactions/${signed.hash}`);
    }
  } finally {
    await client.disconnect();
  }

  console.log(`\n✓ estate distributed on the XRP Ledger`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
