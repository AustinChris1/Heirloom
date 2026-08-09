import { Contract, JsonRpcSigner } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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
  const busy = !["idle", "done", "error"].includes(progress.phase);

  const set = (p: Partial<Progress>) => setProgress((prev) => ({ ...prev, ...p }) as Progress);

  /** Shared tail: wait for the round, fetch the proof, submit it to the vault. */
  async function completeWith(
    method: "proveLife" | "claimDormancy",
    encoded: string,
    round: number,
  ) {
    const contract = new Contract(HEIRLOOM_VAULT, VAULT_ABI_WRITE, signer!);

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

    set({
      phase: "done",
      message: method === "proveLife" ? "Proof of life accepted" : "Dormancy proven on-chain",
      txHash: receipt.hash,
    });
    onChanged();
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
      set({ phase: "error", message: "", error: humanError(e) });
    }
  }

  async function runClaimDormancy() {
    if (!signer) return;
    try {
      set({ phase: "preparing", message: "Reading the XRP Ledger for a search range" });

      // End the range a few ledgers back so it is comfortably finalised, and
      // open it wide enough to cover the whole missed interval.
      const head = await currentLedger();
      const deadlineBlock = head - 5;
      const minimalBlock = deadlineBlock - 400;
      const deadlineTimestamp = await ledgerCloseTime(deadlineBlock);

      set({ phase: "preparing", message: `Encoding a nonexistence request over 400 ledgers` });
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
      set({ phase: "error", message: "", error: humanError(e) });
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
          {/* ---- proof of life ---- */}
          {canProve && (
            <div className="mb-7">
              <h4 className="mb-1.5 text-sm font-semibold">Prove life</h4>
              <p className="mb-3 max-w-[46ch] text-xs leading-relaxed text-ink-300">
                Send the heartbeat above from your XRPL account, then paste its transaction hash. Anyone can
                relay this — it does not have to be the owner.
              </p>
              <input
                className="field mb-3 font-mono text-[11px]"
                placeholder="XRPL transaction hash (64 hex characters)"
                value={xrplTx}
                onChange={(e) => setXrplTx(e.target.value)}
                spellCheck={false}
                disabled={busy}
              />
              <button className="btn" disabled={busy || !xrplTx.trim()} onClick={runProveLife}>
                Attest and submit
              </button>
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
                    const current = stepIndex(progress.phase);
                    const done = current > i || progress.phase === "done";
                    const active = current === i;
                    return (
                      <li
                        key={label}
                        className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                          done ? "text-white" : active ? "text-white" : "text-ink-500"
                        }`}
                      >
                        {done ? "●" : active ? "◐" : "○"} {label}
                      </li>
                    );
                  })}
                </ol>

                {progress.phase === "error" ? (
                  <p className="font-mono text-[11px] text-white">✕ {progress.error}</p>
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
