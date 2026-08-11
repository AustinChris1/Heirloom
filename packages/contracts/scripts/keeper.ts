import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { Client, Wallet as XrplWallet } from "xrpl";
import { fetchProof, plain, prepareRequest, submitRequest, waitForFinalisation } from "./fdc";

/**
 * The keeper: one pass over every vault, advancing whatever can be advanced.
 * Run it on a timer (cron/systemd/Task Scheduler) and the lifecycle needs no
 * human at all after the owner goes silent:
 *
 *   Active + overdue          → claim dormancy (full FDC nonexistence proof)
 *   Dormant + canExecute      → requestExecution → settle the enclave's result
 *   Settled + not distributed → sign payouts with the DELEGATED regular key
 *                               and broadcast them on XRPL
 *
 * Two properties make this safe to automate blindly:
 *
 *   - every action is permissionless and fact-checked on-chain — a keeper that
 *     fires early or maliciously just wastes its own gas on a revert;
 *   - the keeper never holds the estate's master seed. It signs payouts with a
 *     regular key the owner delegated while alive (set-regular-key.ts) and can
 *     revoke at any moment. Kill the keeper and anyone else can run one.
 *
 * The keeper only manages vaults it has a will file for
 * (deployments/will-vault-<id>.json) — payout needs the address mapping, and
 * strangers' vaults are someone else's to crank.
 */
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
const ENCLAVE = "https://sly.southafricanorth.cloudapp.azure.com";
const BEACON = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
const TESTNET_WSS = "wss://s.altnet.rippletest.net:51233";
const DEPLOYMENTS = path.join(__dirname, "..", "deployments");
const STATE_FILE = path.join(DEPLOYMENTS, "keeper-state.json");

type KeeperState = { distributed: Record<string, string[]> };

function loadState(): KeeperState {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { distributed: {} };
  }
}

function willPathFor(id: number): string {
  return path.join(DEPLOYMENTS, `will-vault-${id}.json`);
}

async function pollEnclave(instructionId: string, timeoutMs = 600_000): Promise<any> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const res = await fetch(`${ENCLAVE}/action/result/${instructionId}`);
    if (res.ok) {
      const out = await res.json();
      // status >= 2 is pending (node still retrying the extension) — not final.
      if (out?.result?.id && Number(out.result.status ?? 0) < 2) return out;
    }
    await new Promise((r) => setTimeout(r, 6000));
  }
  throw new Error(`no final enclave result for ${instructionId}`);
}

/* ---------------- lifecycle steps ---------------- */

async function claimDormancy(vault: any, id: number): Promise<void> {
  const v = await vault.vaults(id);
  const tag: bigint = await vault.heartbeatTag(id);
  const heartbeatDrops: bigint = await vault.heartbeatDrops();

  const client = new Client(TESTNET_WSS);
  await client.connect();
  let minimalBlock: number, deadlineBlock: number, deadlineTs: number;
  try {
    const info = await client.request({ command: "ledger", ledger_index: "validated" });
    const current = Number(info.result.ledger_index ?? (info.result as any).ledger.ledger_index);
    deadlineBlock = current - 5;

    // The proof range must start at or before the last known heartbeat, so
    // size the lookback from how long ago that actually was (~3.5 s/ledger)
    // instead of a fixed window that only fits fresh vaults.
    const silenceSeconds = Math.floor(Date.now() / 1000) - Number(v.lastHeartbeat);
    minimalBlock = deadlineBlock - Math.min(20_000, Math.ceil(silenceSeconds / 3.5) + 200);

    const dl = await client.request({ command: "ledger", ledger_index: deadlineBlock });
    deadlineTs = Number((dl.result as any).ledger.close_time) + 946_684_800;
  } finally {
    await client.disconnect();
  }

  console.log(`  claiming dormancy — ledgers ${minimalBlock}…${deadlineBlock}`);
  const encoded = await prepareRequest("XRPPaymentNonexistence", {
    minimalBlockNumber: String(minimalBlock),
    deadlineBlockNumber: String(deadlineBlock),
    deadlineTimestamp: String(deadlineTs),
    destinationAddressHash: ethers.keccak256(ethers.toUtf8Bytes(BEACON)),
    amount: (heartbeatDrops - 1n).toString(),
    checkFirstMemoData: false,
    firstMemoDataHash: ethers.ZeroHash,
    checkDestinationTag: true,
    destinationTag: String(tag),
    proofOwner: VAULT,
  });
  const round = await submitRequest(encoded);
  await waitForFinalisation(round);
  const { proof, responseHex } = await fetchProof(round, encoded);

  const fragment = vault.interface.getFunction("claimDormancy")!;
  const responseType = fragment.inputs[1].components![1];
  const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
    [responseType as any],
    responseHex.startsWith("0x") ? responseHex : `0x${responseHex}`,
  )[0];

  const tx = await vault.claimDormancy(id, { merkleProof: proof, data: plain(decoded) });
  await tx.wait();
  console.log(`  ✓ dormancy claimed: ${tx.hash}`);
}

/** Latest event of a kind for a vault, via the explorer (public RPC caps getLogs at 30 blocks). */
async function findLogs(vault: any, eventName: string, id: number): Promise<Array<{ topics: string[]; transactionHash: string }>> {
  const topic0 = vault.interface.getEvent(eventName)!.topicHash;
  const topic1 = ethers.zeroPadValue(ethers.toBeHex(id), 32);
  const url =
    `https://coston2-explorer.flare.network/api?module=logs&action=getLogs&fromBlock=33500000&toBlock=latest` +
    `&address=${VAULT}&topic0=${topic0}&topic1=${topic1}&topic0_1_opr=and`;
  const out = await (await fetch(url)).json();
  return Array.isArray(out?.result) ? out.result : [];
}

/** Fetches the enclave's signed distribution for an instruction and settles it. */
async function settleInstruction(vault: any, instructionId: string): Promise<void> {
  const result = await pollEnclave(instructionId);
  if (result.result.status !== 1) throw new Error(`enclave reported failure: ${result.result.log}`);

  const settleTx = await vault.settleEstate(
    result.result.data,
    result.result.id,
    result.result.submissionTag,
    result.result.status,
    result.signature,
  );
  await settleTx.wait();
  console.log(`  ✓ settled: ${settleTx.hash}`);
}

/** Resume path for a vault stuck in Executing: settle its pending instruction. */
async function settlePending(vault: any, id: number): Promise<void> {
  const logs = await findLogs(vault, "ExecutionRequested", id);
  if (!logs.length) throw new Error("Executing but no ExecutionRequested event found");
  await settleInstruction(vault, logs[logs.length - 1].topics[2]);
}

async function executeAndSettle(vault: any, id: number): Promise<void> {
  const will = JSON.parse(fs.readFileSync(willPathFor(id), "utf8"));

  // Recover the sealed ciphertext from the seal transaction's public calldata.
  const logs = await findLogs(vault, "WillSealed", id);
  if (!logs.length) throw new Error("no WillSealed event");
  const sealTx = await ethers.provider.getTransaction(logs[logs.length - 1].transactionHash);
  const encryptedWill: string = vault.interface.parseTransaction({ data: sealTx!.data })!.args._encryptedWill;

  const client = new Client(TESTNET_WSS);
  await client.connect();
  const info = await client.request({ command: "account_info", account: will.estateAccount, ledger_index: "validated" });
  await client.disconnect();
  const estateDrops = BigInt(info.result.account_data.Balance);

  console.log(`  executing — estate holds ${Number(estateDrops) / 1e6} XRP`);
  const tx = await vault.requestExecution(id, encryptedWill, estateDrops, { value: ethers.parseEther("1") });
  const receipt = await tx.wait();

  let instructionId: string | undefined;
  for (const log of receipt?.logs ?? []) {
    try {
      const p = vault.interface.parseLog({ topics: [...log.topics], data: log.data });
      if (p?.name === "ExecutionRequested") instructionId = p.args.instructionId;
    } catch {
      /* registry logs */
    }
  }
  if (!instructionId) throw new Error("no ExecutionRequested event");

  await settleInstruction(vault, instructionId);
}

async function payout(vault: any, id: number, state: KeeperState): Promise<void> {
  const will = JSON.parse(fs.readFileSync(willPathFor(id), "utf8"));

  // Sign with the delegated regular key when one exists — the production trust
  // shape. The master seed is only a fallback for vaults never delegated.
  const keeperPath = path.join(DEPLOYMENTS, "keeper-key.json");
  const estatePath = path.join(DEPLOYMENTS, "xrpl-testnet-wallet.json");
  const usingRegularKey = fs.existsSync(keeperPath);
  const signer = XrplWallet.fromSeed(JSON.parse(fs.readFileSync(usingRegularKey ? keeperPath : estatePath, "utf8")).seed);
  console.log(`  paying out, signing with ${usingRegularKey ? "delegated regular key" : "estate master seed"}`);

  const distribution = await vault.distributionOf(id);
  const addresses: string[] = [...will.bequests.map((b: any) => b.beneficiary), will.residuaryBeneficiary];
  const byHash = new Map(addresses.map((a) => [ethers.keccak256(ethers.toUtf8Bytes(a)).toLowerCase(), a]));

  const client = new Client(TESTNET_WSS);
  await client.connect();
  const hashes: string[] = [];
  try {
    for (const b of distribution) {
      if (b.drops === 0n) continue;
      const beneficiary = byHash.get(b.destinationHash.toLowerCase());
      if (!beneficiary) throw new Error(`settled hash ${b.destinationHash} matches nothing in the will`);

      const payment = await client.autofill({
        TransactionType: "Payment" as const,
        Account: will.estateAccount,
        Destination: beneficiary,
        Amount: b.drops.toString(),
        Memos: [
          {
            Memo: {
              MemoType: Buffer.from("heirloom/v1").toString("hex").toUpperCase(),
              MemoData: Buffer.from(`vault:${id};settled`).toString("hex").toUpperCase(),
            },
          },
        ],
      });
      const signed = signer.sign(payment);
      const submitted = await client.submitAndWait(signed.tx_blob);
      const outcome = (submitted.result.meta as any)?.TransactionResult;
      console.log(`  ${outcome} → ${beneficiary}: ${Number(b.drops) / 1e6} XRP  (${signed.hash})`);
      if (outcome !== "tesSUCCESS") throw new Error(`payment failed: ${outcome}`);
      hashes.push(signed.hash);
    }
  } finally {
    await client.disconnect();
  }

  state.distributed[String(id)] = hashes;
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  console.log(`  ✓ vault ${id} distributed (${hashes.length} payments)`);
}

/* ---------------- one pass ---------------- */

async function main() {
  const [signer] = await ethers.getSigners();
  const vault = await ethers.getContractAt("HeirloomVault", VAULT, signer);
  const state = loadState();

  const count = Number(await vault.vaultCount());
  console.log(`keeper pass — ${count} vault(s), ${new Date().toISOString()}`);

  for (let id = 0; id < count; id++) {
    if (!fs.existsSync(willPathFor(id))) continue; // not ours to crank

    const v = await vault.vaults(id);
    const stateNum = Number(v.state);

    try {
      if (stateNum === 1 && (await vault.isHeartbeatOverdue(id))) {
        console.log(`vault ${id}: Active and overdue`);
        await claimDormancy(vault, id);
      } else if (stateNum === 2 && (await vault.canExecute(id))) {
        console.log(`vault ${id}: Dormant and executable`);
        await executeAndSettle(vault, id);
        await payout(vault, id, state);
      } else if (stateNum === 3) {
        console.log(`vault ${id}: Executing — settling the pending instruction`);
        await settlePending(vault, id);
        await payout(vault, id, state);
      } else if (stateNum === 4 && !state.distributed[String(id)]) {
        console.log(`vault ${id}: Settled, not yet distributed`);
        await payout(vault, id, state);
      }
    } catch (e: any) {
      console.error(`vault ${id}: ${e.message ?? e}`);
    }
  }

  console.log("pass complete");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
