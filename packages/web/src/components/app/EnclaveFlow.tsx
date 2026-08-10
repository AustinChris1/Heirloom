import { Contract, Interface, JsonRpcProvider, JsonRpcSigner, parseEther } from "ethers";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { parseWill, willCommitment, Will } from "@heirloom/extension/will";
import { COSTON2_RPC, LiveVault } from "../../lib/chain";
import {
  BEACON_XRPL_ADDRESS,
  EXPLORER,
  HEIRLOOM_VAULT,
  VAULT_ABI,
  XRPL_TESTNET_EXPLORER,
} from "../../lib/deployment";
import { eciesEncrypt } from "../../lib/ecies";
import { fetchEnclaveKey, pollActionResult } from "../../lib/enclave";
import { currentLedger } from "../../lib/fdc";
import { humanError, vaultWithSigner } from "../../lib/wallet";
import {
  accountInfo,
  buildPayoutPayments,
  findEstateAccount,
  PayoutPayment,
  SettledBequest,
  submitPayment,
} from "../../lib/xrplPayout";

/**
 * The confidential third of the lifecycle, run entirely from the browser:
 *
 *   seal     — encrypt the will to the enclave's attested key, send SEAL,
 *              wait for the enclave's signed attestation, record it on-chain;
 *   execute  — recover the sealed ciphertext from the chain itself, send
 *              EXECUTE with the live estate balance, settle the enclave's
 *              signed distribution;
 *   payout   — turn the settled distribution into real XRPL payments and
 *              broadcast them.
 *
 * Every leg resumes: the instruction id lives in an on-chain event, so a
 * closed tab never strands a vault mid-flow.
 */

/** Fee forwarded to the FCC registry with each instruction. */
const INSTRUCTION_FEE = parseEther("1");
/** The vault contract's deploy block — event scans never need to look earlier. */
const DEPLOY_BLOCK = 33_500_000;
/** Blockscout API — the public RPC caps eth_getLogs at 30 blocks, the explorer indexes everything. */
const EXPLORER_API = "https://coston2-explorer.flare.network/api";

const read = new JsonRpcProvider(COSTON2_RPC);
const readVault = new Contract(HEIRLOOM_VAULT, VAULT_ABI, read);
const iface = new Interface(VAULT_ABI);

interface Flow {
  step: number;
  message: string;
  error?: string;
  txHash?: string;
}

const IDLE: Flow = { step: -1, message: "" };

/** Latest instruction id a given event recorded for this vault, with its ciphertext when asked. */
async function latestInstruction(
  vaultId: number,
  eventName: "WillSealed" | "ExecutionRequested",
  wantCiphertext = false,
): Promise<{ instructionId: string; encryptedWill?: string } | null> {
  const topic0 = iface.getEvent(eventName)!.topicHash;
  const topic1 = "0x" + vaultId.toString(16).padStart(64, "0");
  const url =
    `${EXPLORER_API}?module=logs&action=getLogs&fromBlock=${DEPLOY_BLOCK}&toBlock=latest` +
    `&address=${HEIRLOOM_VAULT}&topic0=${topic0}&topic1=${topic1}&topic0_1_opr=and`;
  const out = await (await fetch(url)).json();
  const logs: Array<{ topics: string[]; transactionHash: string }> = Array.isArray(out?.result) ? out.result : [];
  if (logs.length === 0) return null;

  const last = logs[logs.length - 1];
  const instructionId = last.topics[2];

  if (!wantCiphertext) return { instructionId };

  // The sealed ciphertext is public calldata — recover it from the seal tx so
  // execution needs no copy of anything private.
  const tx = await read.getTransaction(last.transactionHash);
  if (!tx) return { instructionId };
  const parsed = iface.parseTransaction({ data: tx.data });
  return { instructionId, encryptedWill: parsed?.args?._encryptedWill ?? parsed?.args?.[1] };
}

export function EnclaveFlow({
  vault,
  signer,
  onChanged,
}: {
  vault: LiveVault;
  signer: JsonRpcSigner | null;
  onChanged: () => void;
}) {
  if (vault.state === "Active" && !vault.willAttested) {
    return <SealPanel vault={vault} signer={signer} onChanged={onChanged} />;
  }
  if ((vault.state === "Dormant" && vault.willAttested) || vault.state === "Executing") {
    return <ExecutePanel vault={vault} signer={signer} onChanged={onChanged} />;
  }
  if (vault.state === "Settled") {
    return <PayoutPanel vault={vault} />;
  }
  return null;
}

/* ================================================================ */
/*  Seal                                                            */
/* ================================================================ */

const SEAL_STEPS = ["Verify enclave key", "Encrypt & send", "Enclave attests", "Record on-chain"] as const;

function SealPanel({
  vault,
  signer,
  onChanged,
}: {
  vault: LiveVault;
  signer: JsonRpcSigner | null;
  onChanged: () => void;
}) {
  const [willText, setWillText] = useState("");
  const [flow, setFlow] = useState<Flow>(IDLE);
  const [pending, setPending] = useState<string | null>(null);

  // A seal instruction may already be in flight from an earlier session.
  useEffect(() => {
    let cancelled = false;
    latestInstruction(vault.id, "WillSealed")
      .then((found) => !cancelled && setPending(found?.instructionId ?? null))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [vault.id, vault.willAttested]);

  const parsed = useMemo(() => {
    if (!willText.trim()) return null;
    try {
      const will = parseWill(JSON.parse(willText));
      const commitment = willCommitment(will);
      if (commitment.toLowerCase() !== vault.willCommitment.toLowerCase()) {
        return { error: "This will does not match the commitment this vault was created with." };
      }
      if (will.vaultId !== vault.id) {
        return { error: `This will names vault ${will.vaultId}, but this is vault ${vault.id}.` };
      }
      return { will };
    } catch (err) {
      return { error: (err as Error).message };
    }
  }, [willText, vault.willCommitment, vault.id]);

  async function seal() {
    if (!signer || !parsed?.will) return;
    setFlow({ step: 0, message: "Fetching the enclave's attested public key…" });

    try {
      const [key, teeAddress] = await Promise.all([fetchEnclaveKey(), readVault.teeAddress() as Promise<string>]);
      if (key.address.toLowerCase() !== teeAddress.toLowerCase()) {
        throw new Error(
          `Enclave key mismatch: the endpoint serves ${key.address}, the contract trusts ${teeAddress}. Refusing to encrypt.`,
        );
      }

      setFlow({ step: 1, message: "Encrypting in your browser and sending SEAL…" });
      const plaintext = new TextEncoder().encode(JSON.stringify(parsed.will));
      const ciphertext = await eciesEncrypt(key.publicKey, plaintext);

      const contract = vaultWithSigner(signer);
      const tx = await contract.sealWill(vault.id, ciphertext, { value: INSTRUCTION_FEE });
      const receipt = await tx.wait();

      const sealed = receipt.logs
        .map((l: any) => {
          try {
            return iface.parseLog({ topics: [...l.topics], data: l.data });
          } catch {
            return null;
          }
        })
        .find((l: any) => l?.name === "WillSealed");
      if (!sealed) throw new Error("sealWill succeeded but emitted no WillSealed event");

      await attest(sealed.args.instructionId, receipt.hash);
    } catch (err) {
      setFlow((f) => ({ ...f, error: humanError(err) }));
    }
  }

  async function attest(instructionId: string, txHash?: string) {
    if (!signer) return;
    try {
      setFlow({ step: 2, message: "Waiting for data providers to relay the instruction…", txHash });
      const result = await pollActionResult(instructionId, (s) =>
        setFlow({ step: 2, message: `Waiting for the enclave's attestation… ${s}s`, txHash }),
      );
      if (result.status !== 1) {
        throw new Error(`The enclave rejected the will: ${result.log || "no log"}`);
      }

      setFlow({ step: 3, message: "Recording the attestation on-chain…", txHash });
      const contract = vaultWithSigner(signer);
      const tx2 = await contract.confirmSeal(
        result.data,
        result.actionId,
        result.submissionTag,
        result.status,
        result.signature,
      );
      await tx2.wait();

      setFlow({ step: 4, message: "Sealed and attested. The enclave can read this will; nobody else can." });
      onChanged();
    } catch (err) {
      setFlow((f) => ({ ...f, error: humanError(err) }));
    }
  }

  const busy = flow.step >= 0 && flow.step < 4 && !flow.error;

  return (
    <Panel label="Seal the will" steps={SEAL_STEPS} flow={flow}>
      <p className="mb-5 max-w-[46ch] text-xs leading-relaxed text-ink-300">
        Paste the will file this vault was created with. It is encrypted to the enclave's key in your browser —
        the plaintext never leaves this page — and the enclave attests it can decrypt and execute it.
      </p>

      <textarea
        className="field h-28 w-full resize-y font-mono text-[11px] leading-relaxed"
        placeholder='{"vaultId": 0, "estateAccount": "r…", "bequests": […], "residuaryBeneficiary": "r…"}'
        value={willText}
        onChange={(e) => setWillText(e.target.value)}
        spellCheck={false}
        disabled={busy}
      />
      {parsed && "error" in parsed && <p className="mt-3 font-mono text-[11px] text-ink-300">⚠ {parsed.error}</p>}
      {parsed && "will" in parsed && (
        <p className="mt-3 font-mono text-[11px] text-ink-100">
          ✓ Matches this vault's commitment — {parsed.will!.bequests.length} bequest(s)
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button className="btn btn-solid" disabled={!signer || !parsed || "error" in parsed || busy} onClick={seal}>
          {busy ? "Working…" : "Encrypt & seal in the enclave"}
        </button>
        {pending && !busy && (
          <button className="btn" disabled={!signer} onClick={() => attest(pending)}>
            Resume pending attestation
          </button>
        )}
      </div>
      {!signer && <p className="mt-3 font-mono text-[11px] text-ink-300">Connect the owner wallet to seal.</p>}
    </Panel>
  );
}

/* ================================================================ */
/*  Execute                                                         */
/* ================================================================ */

const EXEC_STEPS = ["Recover sealed will", "Read estate", "Send EXECUTE", "Enclave executes", "Settle on-chain"] as const;

function ExecutePanel({
  vault,
  signer,
  onChanged,
}: {
  vault: LiveVault;
  signer: JsonRpcSigner | null;
  onChanged: () => void;
}) {
  const [flow, setFlow] = useState<Flow>(IDLE);
  // The estate is normally discovered from its own heartbeats on the beacon. A
  // vault that never heartbeated (short-interval demo vaults) has nothing to
  // discover, so the executor can supply the r-address directly.
  const [estateOverride, setEstateOverride] = useState("");
  const busy = flow.step >= 0 && flow.step < 5 && !flow.error;

  const graceEndsAt = (vault.dormantSince + vault.graceWindow) * 1000;
  const graceRemainingDays = Math.max(0, (graceEndsAt - Date.now()) / 86_400_000);

  async function execute() {
    if (!signer) return;
    try {
      setFlow({ step: 0, message: "Recovering the sealed ciphertext from the seal transaction…" });
      const sealed = await latestInstruction(vault.id, "WillSealed", true);
      if (!sealed?.encryptedWill) throw new Error("No sealed will found on-chain for this vault.");

      setFlow({ step: 1, message: "Finding the estate account from its heartbeats…" });
      const estate = estateOverride.trim() || (await findEstateAccount(BEACON_XRPL_ADDRESS, vault.heartbeatTag));
      if (!estate) {
        throw new Error(
          "No heartbeat names this vault's tag on the beacon, so the estate can't be auto-detected — enter its r-address below.",
        );
      }
      const { balanceDrops } = await accountInfo(estate);

      setFlow({
        step: 2,
        message: `Estate ${estate} holds ${(Number(balanceDrops) / 1e6).toLocaleString()} XRP. Sending EXECUTE…`,
      });
      const contract = vaultWithSigner(signer);
      const tx = await contract.requestExecution(vault.id, sealed.encryptedWill, balanceDrops, {
        value: INSTRUCTION_FEE,
      });
      const receipt = await tx.wait();

      const requested = receipt.logs
        .map((l: any) => {
          try {
            return iface.parseLog({ topics: [...l.topics], data: l.data });
          } catch {
            return null;
          }
        })
        .find((l: any) => l?.name === "ExecutionRequested");
      if (!requested) throw new Error("requestExecution succeeded but emitted no event");

      await settle(requested.args.instructionId, receipt.hash);
    } catch (err) {
      setFlow((f) => ({ ...f, error: humanError(err) }));
    }
  }

  async function settle(instructionId?: string, txHash?: string) {
    if (!signer) return;
    try {
      let id = instructionId;
      if (!id) {
        setFlow({ step: 3, message: "Finding the pending EXECUTE instruction…" });
        const found = await latestInstruction(vault.id, "ExecutionRequested");
        if (!found) throw new Error("No EXECUTE instruction found for this vault.");
        id = found.instructionId;
      }

      setFlow({ step: 3, message: "Waiting for the enclave's signed distribution…", txHash });
      const result = await pollActionResult(id, (s) =>
        setFlow({ step: 3, message: `Waiting for the enclave's signed distribution… ${s}s`, txHash }),
      );
      if (result.status !== 1) {
        throw new Error(`The enclave reported failure: ${result.log || "no log"}`);
      }

      setFlow({ step: 4, message: "Settling the distribution on-chain…", txHash });
      const contract = vaultWithSigner(signer);
      const tx2 = await contract.settleEstate(
        result.data,
        result.actionId,
        result.submissionTag,
        result.status,
        result.signature,
      );
      await tx2.wait();

      setFlow({ step: 5, message: "Settled. The distribution is recorded and ready to broadcast." });
      onChanged();
    } catch (err) {
      setFlow((f) => ({ ...f, error: humanError(err) }));
    }
  }

  return (
    <Panel label="Execute the will" steps={EXEC_STEPS} flow={flow}>
      {vault.state === "Dormant" && !vault.canExecute && (
        <p className="max-w-[46ch] text-xs leading-relaxed text-ink-300">
          Dormancy is proven but execution is still gated:{" "}
          {graceRemainingDays > 0 && <>the grace window runs another {graceRemainingDays.toFixed(1)} days</>}
          {graceRemainingDays > 0 && vault.guardianApprovals < vault.guardianThreshold && <> and </>}
          {vault.guardianApprovals < vault.guardianThreshold && (
            <>
              guardians stand at {vault.guardianApprovals}/{vault.guardianThreshold}
            </>
          )}
          . A single heartbeat still reverts everything.
        </p>
      )}

      {vault.state === "Dormant" && vault.canExecute && (
        <>
          <p className="mb-5 max-w-[46ch] text-xs leading-relaxed text-ink-300">
            Grace elapsed, guardians satisfied. Anyone may now instruct the enclave: the sealed ciphertext is
            recovered from the chain, the estate balance is read from the XRP Ledger, and the enclave returns a
            signed distribution priced at the live FTSO feed.
          </p>
          <input
            className="field mb-4 w-full font-mono text-xs"
            placeholder="Estate r-address — auto-detected from heartbeats if left blank"
            value={estateOverride}
            onChange={(e) => setEstateOverride(e.target.value)}
            spellCheck={false}
            disabled={busy}
          />
          <button className="btn btn-solid" disabled={!signer || busy} onClick={execute}>
            {busy ? "Working…" : "Execute in the enclave"}
          </button>
        </>
      )}

      {vault.state === "Executing" && !busy && flow.step < 5 && (
        <>
          <p className="mb-5 max-w-[46ch] text-xs leading-relaxed text-ink-300">
            An EXECUTE instruction is already with the enclave. Fetch its signed distribution and settle it
            on-chain — this step is permissionless.
          </p>
          <button className="btn btn-solid" disabled={!signer} onClick={() => settle()}>
            Fetch result & settle
          </button>
        </>
      )}

      {!signer && <p className="mt-3 font-mono text-[11px] text-ink-300">Connect any wallet to proceed.</p>}
    </Panel>
  );
}

/* ================================================================ */
/*  Payout                                                          */
/* ================================================================ */

function PayoutPanel({ vault }: { vault: LiveVault }) {
  const [distribution, setDistribution] = useState<SettledBequest[] | null>(null);
  const [willText, setWillText] = useState("");
  const [seed, setSeed] = useState("");
  const [payments, setPayments] = useState<PayoutPayment[] | null>(null);
  const [results, setResults] = useState<Array<{ hash: string; engineResult: string }> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (readVault.distributionOf(vault.id) as Promise<any[]>)
      .then(
        (rows) =>
          !cancelled &&
          setDistribution(
            rows.map((r) => ({
              destinationHash: r.destinationHash ?? r[0],
              drops: BigInt(r.drops ?? r[1]),
              flareRecipient: r.flareRecipient ?? r[2],
            })),
          ),
      )
      .catch(() => !cancelled && setDistribution([]));
    return () => {
      cancelled = true;
    };
  }, [vault.id]);

  const will: Will | null = useMemo(() => {
    try {
      return willText.trim() ? parseWill(JSON.parse(willText)) : null;
    } catch {
      return null;
    }
  }, [willText]);

  async function broadcast() {
    if (!will || !distribution) return;
    setBusy(true);
    setError(null);
    setResults(null);
    try {
      const { sequence } = await accountInfo(will.estateAccount);
      const ledger = await currentLedger();

      const built = buildPayoutPayments({
        vaultId: vault.id,
        estateAccount: will.estateAccount,
        distribution,
        willAddresses: [...will.bequests.map((b) => b.beneficiary), will.residuaryBeneficiary],
        startSequence: sequence,
        lastLedgerSequence: ledger + 300,
      });
      setPayments(built);

      // Signing pulls in ripple-binary-codec; load it only when actually broadcasting.
      const { signPayment } = await import("../../lib/xrplSign");

      const out: Array<{ hash: string; engineResult: string }> = [];
      for (const payment of built) {
        const { blob, hash } = signPayment(payment.tx, seed);
        const { engineResult } = await submitPayment(blob);
        out.push({ hash, engineResult });
        setResults([...out]);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel label="Distribute the estate" steps={[]} flow={IDLE}>
      <p className="mb-5 max-w-[46ch] text-xs leading-relaxed text-ink-300">
        The distribution below is what the enclave signed and the contract verified. Broadcasting it moves the
        actual XRP: each settled bequest becomes one XRPL payment, built from this table — a will file can only
        name addresses, never change amounts.
      </p>

      {distribution && distribution.length > 0 && (
        <table className="mb-6 w-full text-xs">
          <tbody>
            {distribution.map((b, i) => (
              <tr key={i} className="border-b border-ink-800/70">
                <td className="py-2 font-mono text-[11px] text-ink-300">{b.destinationHash.slice(0, 14)}…</td>
                <td className="py-2 text-right font-mono tabular-nums text-white">
                  {(Number(b.drops) / 1e6).toLocaleString("en-US", { maximumFractionDigits: 6 })} XRP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="space-y-4">
        <textarea
          className="field h-24 w-full resize-y font-mono text-[11px] leading-relaxed"
          placeholder="Will file — supplies the r-addresses behind the settled hashes"
          value={willText}
          onChange={(e) => setWillText(e.target.value)}
          spellCheck={false}
        />
        <input
          className="field w-full font-mono text-sm"
          placeholder="Estate testnet seed (s…) — signs the payments"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          spellCheck={false}
        />
      </div>

      <p className="mt-4 max-w-[46ch] text-xs leading-relaxed text-ink-300">
        On this deployment the seed-holder signs locally; in the full design the enclave holds a delegated
        regular key and returns already-signed blobs, making this step permissionless too.
      </p>

      <button
        className="btn btn-solid mt-5"
        disabled={!will || !seed.trim() || busy || !distribution?.length}
        onClick={broadcast}
      >
        {busy ? "Broadcasting…" : "Sign & broadcast on XRPL testnet"}
      </button>

      {error && <p className="mt-4 font-mono text-[11px] text-white">✕ {error}</p>}

      {results && payments && (
        <div className="mt-5 space-y-2">
          {results.map((r, i) => (
            <a
              key={r.hash}
              href={`${XRPL_TESTNET_EXPLORER}/transactions/${r.hash}`}
              target="_blank"
              rel="noreferrer"
              className="block font-mono text-[10px] text-ink-300 underline-offset-4 hover:text-white hover:underline"
            >
              {r.engineResult === "tesSUCCESS" ? "✓" : "✕"} {payments[i].beneficiary.slice(0, 12)}… ·{" "}
              {(Number(payments[i].drops) / 1e6).toLocaleString()} XRP · {r.engineResult} · {r.hash.slice(0, 16)}…
            </a>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ================================================================ */
/*  Shared chrome                                                   */
/* ================================================================ */

function Panel({
  label,
  steps,
  flow,
  children,
}: {
  label: string;
  steps: readonly string[];
  flow: Flow;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-9 border-t border-ink-800 pt-6"
    >
      <p className="label mb-5">{label}</p>

      {steps.length > 0 && flow.step >= 0 && (
        <ol className="mb-5 flex flex-wrap gap-x-5 gap-y-2">
          {steps.map((s, i) => (
            <li
              key={s}
              className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                i < flow.step ? "text-ink-100" : i === flow.step ? "text-white" : "text-ink-500"
              }`}
            >
              {i < flow.step ? "✓ " : ""}
              {s}
            </li>
          ))}
        </ol>
      )}

      {children}

      {flow.message && !flow.error && (
        <p className="mt-5 font-mono text-[11px] leading-relaxed text-ink-100">{flow.message}</p>
      )}
      {flow.error && <p className="mt-5 font-mono text-[11px] leading-relaxed text-white">✕ {flow.error}</p>}
      {flow.txHash && (
        <a
          href={`${EXPLORER}/tx/${flow.txHash}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block break-all font-mono text-[10px] text-ink-300 underline-offset-4 hover:text-white hover:underline"
        >
          {flow.txHash}
        </a>
      )}
    </motion.div>
  );
}
