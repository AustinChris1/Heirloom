import { Contract, JsonRpcSigner } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LiveVault } from "../../lib/chain";
import {
  BEACON_XRPL_ADDRESS,
  EXPLORER,
  HEIRLOOM_VAULT,
  XRPL_TESTNET_EXPLORER,
} from "../../lib/deployment";
import {
  currentLedger,
  decodeResponse,
  fetchProof,
  ledgerCloseTime,
  prepareRequest,
  Progress,
  standardAddressHash,
  submitRequest,
  waitForFinalisation,
} from "../../lib/fdc";
import { humanError, VAULT_ABI_WRITE } from "../../lib/wallet";

/**
 * Runs a full FDC attestation from the browser.
 *
 * Both legs of the dead-man's switch live here, so a judge never has to open a
 * terminal to see the thing the project is actually about. The round wait is
 * 90–180 seconds of genuine protocol latency; it is shown as a real progress
 * bar with an elapsed counter rather than hidden behind a spinner, because
 * pretending it is instant would misrepresent how the oracle works.
 */

const STEPS = ["Prepare", "Submit", "Await round", "Fetch proof", "Finalise"] as const;

/**
 * An attestation already submitted to FdcHub but not yet finalised on the
 * vault. Persisted so a refresh mid-round resumes instead of paying again.
 */
interface PendingAttestation {
  method: "proveLife" | "claimDormancy";
  encoded: string;
  round: number;
  at: number;
}

const pendingKey = (vaultId: number) => `heirloom:attest:${vaultId}`;
/** Requests older than this are past any useful proof window. */
const PENDING_TTL_MS = 45 * 60 * 1000;

function savePending(vaultId: number, p: PendingAttestation): void {
  try {
    localStorage.setItem(pendingKey(vaultId), JSON.stringify(p));
  } catch {
    /* private browsing */
  }
}

function clearPending(vaultId: number): void {
  try {
    localStorage.removeItem(pendingKey(vaultId));
  } catch {
    /* private browsing */
  }
}

function loadPending(vaultId: number): PendingAttestation | null {
  try {
    const raw = localStorage.getItem(pendingKey(vaultId));
    if (!raw) return null;
    const p = JSON.parse(raw) as PendingAttestation;
    if (Date.now() - p.at > PENDING_TTL_MS) {
      clearPending(vaultId);
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

function stepIndex(phase: Progress["phase"]): number {
  switch (phase) {
    case "preparing":
      return 0;
    case "submitting":
      return 1;
    case "waiting":
      return 2;
    case "fetching":
      return 3;
    case "finalising":
      return 4;
    case "done":
      return 5;
    default:
      return -1;
  }
}

export function AttestationFlow({
  vault,
  signer,
  onChanged,
}: {
  vault: LiveVault;
  signer: JsonRpcSigner | null;
  onChanged: () => void;
}) {
  const [progress, setProgress] = useState<Progress>({ phase: "idle", message: "" });
  const [xrplTx, setXrplTx] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanNote, setScanNote] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAttestation | null>(() => loadPending(vault.id));

  // Re-read after any state change: a completed attestation clears it.
  useEffect(() => {
    setPending(loadPending(vault.id));
  }, [vault.id, vault.state, vault.lastHeartbeat]);
  const busy = !["idle", "done", "error"].includes(progress.phase);

  /**
   * Heartbeats are public payments to a known beacon carrying this vault's
   * tag — nothing about them needs to be pasted by hand. Scan the beacon's
   * recent transactions and pick the newest one the contract would accept
   * (it rejects anything at or before the recorded lastHeartbeat as stale).
   */
  async function scanForHeartbeat() {
    setScanning(true);
    setScanNote(null);
    try {
      const { xrplRequest } = await import("../../lib/fdc");
      const out = await xrplRequest({
        method: "account_tx",
        params: [{ account: BEACON_XRPL_ADDRESS, ledger_index_min: -1, ledger_index_max: -1, limit: 200 }],
      });

      for (const entry of out?.result?.transactions ?? []) {
        const tx = entry.tx ?? entry.tx_json;
        if (tx?.TransactionType !== "Payment" || Number(tx.DestinationTag) !== vault.heartbeatTag) continue;

        const when = Number(tx.date ?? entry.tx_json?.date ?? 0) + 946_684_800; // ripple epoch → unix
        const hash = entry.hash ?? tx.hash;
        if (!hash) continue;

        if (when <= vault.lastHeartbeat) {
          setScanNote("Found a heartbeat, but it is already proven — send a fresh one.");
          return;
        }
        setXrplTx(hash);
        setScanNote(`Found a heartbeat from ${new Date(when * 1000).toLocaleString()}.`);
        return;
      }
      setScanNote("No heartbeat carrying this vault's tag has reached the beacon yet.");
    } catch (e) {
      setScanNote(`Scan failed: ${(e as Error).message}`);
    } finally {
      setScanning(false);
    }
  }

  // Remember the last live phase so an error can point at the step that
  // failed instead of resetting the whole strip to "not started".
  const lastLivePhase = useRef<Progress["phase"]>("idle");
  const set = (p: Partial<Progress>) => {
    if (p.phase && p.phase !== "error") lastLivePhase.current = p.phase;
    setProgress((prev) => ({ ...prev, ...p }) as Progress);
  };

  /** Shared tail: wait for the round, fetch the proof, submit it to the vault. */
  async function completeWith(
    method: "proveLife" | "claimDormancy",
    encoded: string,
    round: number,
  ) {
    const contract = new Contract(HEIRLOOM_VAULT, VAULT_ABI_WRITE, signer!);

    // Remember the in-flight attestation. The request is already paid for and
    // sitting in a voting round; a refresh or a closed tab should not cost
    // another fee and another three minutes.
    savePending(vault.id, { method, encoded, round, at: Date.now() });

    set({ phase: "waiting", message: `Round ${round} — waiting for finalisation`, fraction: 0 });
    await waitForFinalisation(signer!, round, (fraction, elapsed) =>
      set({
        phase: "waiting",
        message: `Round ${round} — finalising (${elapsed}s)`,
        fraction,
      }),
    );

    set({ phase: "fetching", message: "Retrieving the Merkle proof", fraction: undefined });
    const { proof, responseHex } = await fetchProof(round, encoded, (n) =>
      set({ phase: "fetching", message: `Retrieving the Merkle proof (attempt ${n})` }),
    );

    set({ phase: "finalising", message: "Submitting the proof on Coston2" });
    const decoded = decodeResponse(contract, method, responseHex);
    const tx = await contract[method](vault.id, { merkleProof: proof, data: decoded });
    const receipt = await tx.wait();

    clearPending(vault.id);
    set({
      phase: "done",
      message: method === "proveLife" ? "Proof of life accepted" : "Dormancy proven on-chain",
      txHash: receipt.hash,
    });
    onChanged();
  }

  /** Continue an attestation that a refresh interrupted. */
  async function resumePending() {
    const p = pending;
    if (!signer || !p) return;
    try {
      set({ phase: "waiting", message: `Resuming round ${p.round}`, fraction: 0 });
      await completeWith(p.method, p.encoded, p.round);
    } catch (e) {
      set({ phase: "error", message: "", error: humanError(e) || (e as Error)?.message || String(e) });
    }
  }

  async function runProveLife() {
    if (!signer) return;
    const hash = xrplTx.trim().replace(/^0x/, "");
    if (!/^[0-9a-fA-F]{64}$/.test(hash)) {
      set({ phase: "error", message: "", error: "That is not a 64-character XRPL transaction hash." });
      return;
    }

    try {
      set({ phase: "preparing", message: "Asking the verifier to encode the request" });
      const encoded = await prepareRequest("XRPPayment", {
        transactionId: `0x${hash}`,
        proofOwner: HEIRLOOM_VAULT,
      });

      set({ phase: "submitting", message: "Confirm the attestation request in your wallet" });
      const round = await submitRequest(signer, encoded);

      await completeWith("proveLife", encoded, round);
    } catch (e) {
      // humanError can come back empty for exotic reverts — fall through to
      // the raw message rather than showing a bare ✕.
      set({ phase: "error", message: "", error: humanError(e) || (e as Error)?.message || String(e) });
    }
  }

  async function runClaimDormancy() {
    if (!signer) return;

    // The nonexistence search must reach back past the vault's last recorded
    // heartbeat. Testnet data providers will not confirm ranges that stretch
    // back many hours, so a long-silent vault is honestly unprovable here —
    // say so up front instead of failing after four slow steps.
    const silenceHours = (Date.now() / 1000 - vault.lastHeartbeat) / 3600;
    if (silenceHours > 6) {
      set({
        phase: "error",
        message: "",
        error:
          `This vault's last recorded heartbeat is ${silenceHours.toFixed(0)} hours old — the testnet ` +
          `attestation providers won't confirm a silence range that long. Prove a recent heartbeat first, ` +
          `or demonstrate dormancy on a fresh short-interval vault.`,
      });
      return;
    }

    try {
      set({ phase: "preparing", message: "Reading the XRP Ledger for a search range" });

      // End the range a few ledgers back so it is comfortably finalised. The
      // contract requires the range to START at or before the vault's last
      // recorded heartbeat, so size the lookback from how long ago that was
      // (~3.5 s per testnet ledger) — a fixed window only fits fresh vaults.
      const head = await currentLedger();
      const deadlineBlock = head - 5;
      const silenceSeconds = Math.floor(Date.now() / 1000) - vault.lastHeartbeat;
      const lookback = Math.min(100_000, Math.ceil(silenceSeconds / 3.5) + 200);
      const minimalBlock = Math.max(1, deadlineBlock - lookback);
      const deadlineTimestamp = await ledgerCloseTime(deadlineBlock);

      set({ phase: "preparing", message: `Encoding a nonexistence request over ${lookback.toLocaleString()} ledgers` });
      const contract = new Contract(HEIRLOOM_VAULT, VAULT_ABI_WRITE, signer);
      const heartbeatDrops: bigint = await contract.heartbeatDrops();

      const encoded = await prepareRequest("XRPPaymentNonexistence", {
        minimalBlockNumber: String(minimalBlock),
        deadlineBlockNumber: String(deadlineBlock),
        deadlineTimestamp: String(deadlineTimestamp),
        destinationAddressHash: standardAddressHash(BEACON_XRPL_ADDRESS),
        // The attestation excludes payments delivering *more than* this bound, so
        // the contract requires exactly heartbeatDrops - 1.
        amount: (heartbeatDrops - 1n).toString(),
        checkFirstMemoData: false,
        firstMemoDataHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        checkDestinationTag: true,
        destinationTag: String(vault.heartbeatTag),
        proofOwner: HEIRLOOM_VAULT,
      });

      set({ phase: "submitting", message: "Confirm the attestation request in your wallet" });
      const round = await submitRequest(signer, encoded);

      await completeWith("claimDormancy", encoded, round);
    } catch (e) {
      // humanError can come back empty for exotic reverts — fall through to
      // the raw message rather than showing a bare ✕.
      set({ phase: "error", message: "", error: humanError(e) || (e as Error)?.message || String(e) });
    }
  }

  const canProve = vault.state === "Active" || vault.state === "Dormant";
  const canClaim = vault.state === "Active" && vault.overdue;

  return (
    <div className="mt-9 border-t border-ink-800 pt-6">
      <p className="label mb-4">Attestations</p>

      {!signer ? (
        <p className="text-xs text-ink-300">Connect a wallet on Coston2 to relay a proof.</p>
      ) : (
        <>
          {pending && !busy && (
            <div className="mb-6 border border-ink-600 p-4">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white">
                Attestation in progress
              </p>
              <p className="mb-3 max-w-[46ch] text-xs leading-relaxed text-ink-300">
                A {pending.method === "proveLife" ? "proof of life" : "dormancy"} request is already paid for
                and sitting in voting round {pending.round}. Resume it rather than starting over.
              </p>
              <button className="btn" onClick={resumePending}>
                Resume round {pending.round}
              </button>
            </div>
          )}

          {/* ---- proof of life ---- */}
          {canProve && (
            <div className="mb-7">
              <h4 className="mb-1.5 text-sm font-semibold">Prove life</h4>
              <p className="mb-3 max-w-[46ch] text-xs leading-relaxed text-ink-300">
                Send the heartbeat above from your XRPL account, then let the app find it — or paste the
                transaction hash yourself. Anyone can relay this; it does not have to be the owner.
              </p>
              <input
                className="field mb-3 font-mono text-[11px]"
                placeholder="XRPL transaction hash (64 hex characters)"
                value={xrplTx}
                onChange={(e) => setXrplTx(e.target.value)}
                spellCheck={false}
                disabled={busy}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn" disabled={busy || scanning} onClick={scanForHeartbeat}>
                  {scanning ? "Scanning…" : "Find my latest heartbeat"}
                </button>
                <button className="btn" disabled={busy || !xrplTx.trim()} onClick={runProveLife}>
                  Attest and submit
                </button>
              </div>
              {scanNote && <p className="mt-3 font-mono text-[11px] text-ink-100">{scanNote}</p>}
            </div>
          )}

          {/* ---- proof of silence ---- */}
          <div>
            <h4 className="mb-1.5 text-sm font-semibold">Prove silence</h4>
            <p className="mb-3 max-w-[46ch] text-xs leading-relaxed text-ink-300">
              {canClaim
                ? "Proves that across an entire ledger range, no payment carrying this vault's tag reached the beacon. This opens the grace window — it releases nothing."
                : vault.state !== "Active"
                  ? `Only available while the vault is Active. This one is ${vault.state}.`
                  : "Available once the heartbeat interval has lapsed with no heartbeat."}
            </p>
            <button className="btn" disabled={busy || !canClaim} onClick={runClaimDormancy}>
              Claim dormancy
            </button>
          </div>

          {/* ---- progress ---- */}
          <AnimatePresence>
            {progress.phase !== "idle" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-7 border-t border-ink-800 pt-6"
              >
                <ol className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
                  {STEPS.map((label, i) => {
                    const failed = progress.phase === "error";
                    const current = stepIndex(failed ? lastLivePhase.current : progress.phase);
                    const done = (current > i && !failed) || progress.phase === "done" || (failed && current > i);
                    const active = current === i;
                    return (
                      <li
                        key={label}
                        className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                          done || active ? "text-white" : "text-ink-500"
                        }`}
                      >
                        {failed && active ? "✕" : done ? "●" : active ? "◐" : "○"} {label}
                      </li>
                    );
                  })}
                </ol>

                {progress.phase === "error" ? (
                  <p className="font-mono text-[11px] text-white">
                    ✕ Failed at “{STEPS[Math.max(0, stepIndex(lastLivePhase.current))]}” —{" "}
                    {progress.error || "no error detail; check the browser console"}
                  </p>
                ) : (
                  <>
                    <p className="font-mono text-[11px] text-ink-100">{progress.message}</p>
                    {progress.fraction !== undefined && (
                      <div className="mt-3 h-px w-full bg-ink-800">
                        <motion.div
                          className="h-px bg-white"
                          animate={{ scaleX: progress.fraction }}
                          style={{ transformOrigin: "left" }}
                          transition={{ ease: "linear", duration: 0.4 }}
                        />
                      </div>
                    )}
                    {progress.phase === "waiting" && (
                      <p className="mt-3 max-w-[44ch] text-[11px] leading-relaxed text-ink-400">
                        A voting round takes 90–180 seconds. Data providers are reaching consensus on this
                        attestation right now — this wait is the oracle working, not the page hanging.
                      </p>
                    )}
                  </>
                )}

                {progress.txHash && (
                  <a
                    href={`${EXPLORER}/tx/${progress.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block break-all font-mono text-[10px] text-ink-300 underline-offset-4 hover:text-white hover:underline"
                  >
                    {progress.txHash}
                  </a>
                )}

                {progress.phase === "done" && xrplTx.trim() && (
                  <a
                    href={`${XRPL_TESTNET_EXPLORER}/transactions/${xrplTx.trim().replace(/^0x/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block font-mono text-[10px] text-ink-300 underline-offset-4 hover:text-white hover:underline"
                  >
                    View the heartbeat on XRPL ↗
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
