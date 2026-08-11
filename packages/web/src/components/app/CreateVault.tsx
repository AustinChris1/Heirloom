import { JsonRpcSigner } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { parseWill, Will, WillBequest, willCommitment } from "@heirloom/extension/will";
import { allocate } from "@heirloom/extension/allocate";
import { humanError, vaultWithSigner, xrplAddressHash } from "../../lib/wallet";
import { saveWill } from "../../lib/willStore";
import { EXPLORER } from "../../lib/deployment";

const DAY = 24 * 60 * 60;

const BLANK_BEQUEST: WillBequest = { beneficiary: "", kind: "SHARE_BPS", amount: "0" };

/** Amount fields are entered in human units and stored in the will's raw units. */
function toRaw(kind: WillBequest["kind"], display: string): string {
  const v = Number(display);
  if (!Number.isFinite(v) || v <= 0) return "0";
  if (kind === "FIXED_USD") return Math.round(v * 100).toString(); // cents
  if (kind === "FIXED_XRP") return Math.round(v * 1_000_000).toString(); // drops
  return Math.round(v * 100).toString(); // bps
}

function fromRaw(kind: WillBequest["kind"], raw: string): string {
  const v = Number(raw || "0");
  if (v === 0) return "";
  if (kind === "FIXED_USD") return String(v / 100);
  if (kind === "FIXED_XRP") return String(v / 1_000_000);
  return String(v / 100);
}

const UNIT: Record<WillBequest["kind"], string> = {
  FIXED_USD: "USD",
  FIXED_XRP: "XRP",
  SHARE_BPS: "% of remainder",
};

export function CreateVault({
  signer,
  vaultCount,
  xrpUsdPriceE18,
  onCreated,
  onViewVaults,
}: {
  signer: JsonRpcSigner;
  vaultCount: number;
  xrpUsdPriceE18: bigint | null;
  onCreated: () => void;
  onViewVaults: () => void;
}) {
  const [estateAccount, setEstateAccount] = useState("");
  const [residuary, setResiduary] = useState("");
  const [bequests, setBequests] = useState<WillBequest[]>([{ ...BLANK_BEQUEST }]);
  const [intervalDays, setIntervalDays] = useState(90);
  const [graceDays, setGraceDays] = useState(30);
  // Testnet affordance: a demo can't wait 90 days for dormancy. Minutes make
  // the full lifecycle demonstrable in one sitting; real vaults use days.
  const [intervalUnit, setIntervalUnit] = useState<"days" | "minutes">("days");
  const [guardians, setGuardians] = useState<string[]>([]);
  const [threshold, setThreshold] = useState(0);
  const [estateXrp, setEstateXrp] = useState(10_000);

  const [busy, setBusy] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** Snapshot of the will at creation time — offered as a download, since sealing needs this exact JSON. */
  const [createdWill, setCreatedWill] = useState<Will | null>(null);

  // The will the contract will be committed to. Validated with the exact parser
  // the enclave runs, so anything accepted here is executable later.
  const { will, commitment, validationError } = useMemo(() => {
    const draft: Will = {
      vaultId: vaultCount,
      estateAccount: estateAccount.trim(),
      bequests: bequests.filter((b) => b.beneficiary.trim() && b.amount !== "0"),
      residuaryBeneficiary: residuary.trim(),
    };
    try {
      const parsed = parseWill(draft);
      return { will: parsed, commitment: willCommitment(parsed), validationError: null as string | null };
    } catch (err) {
      return { will: null, commitment: null, validationError: (err as Error).message };
    }
  }, [estateAccount, residuary, bequests, vaultCount]);

  const preview = useMemo(() => {
    if (!will || !xrpUsdPriceE18) return null;
    try {
      return allocate({
        will,
        estateDrops: BigInt(Math.round(estateXrp)) * 1_000_000n,
        xrpUsdPriceE18,
      });
    } catch {
      return null;
    }
  }, [will, estateXrp, xrpUsdPriceE18]);

  const validGuardians = guardians.filter((g) => /^0x[0-9a-fA-F]{40}$/.test(g.trim()));
  const canSubmit = !!will && !!commitment && threshold <= validGuardians.length && !busy;

  async function submit() {
    if (!will || !commitment) return;
    setBusy(true);
    setError(null);
    setTxHash(null);

    try {
      const contract = vaultWithSigner(signer);
      const tx = await contract.createVault(
        xrplAddressHash(will.estateAccount),
        BigInt(intervalDays * (intervalUnit === "days" ? DAY : 60)),
        BigInt(graceDays * DAY),
        validGuardians.map((g) => g.trim()),
        threshold,
        commitment,
      );
      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      setCreatedWill(will);
      // Keep a browser-local copy keyed by the commitment, so sealing and
      // payout on this machine work even if the download is never clicked.
      saveWill(commitment, will);
      onCreated();
    } catch (err) {
      setError(humanError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-px bg-ink-800 lg:grid-cols-[1.15fr_0.85fr]">
      {/* ---------------- form ---------------- */}
      <div className="bg-black p-7 md:p-10">
        <p className="label mb-8">New vault · #{vaultCount}</p>

        <Section title="Your XRP Ledger account" hint="The account holding the estate. Heartbeats must come from it.">
          <input
            className="field font-mono text-sm"
            placeholder="rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
            value={estateAccount}
            onChange={(e) => setEstateAccount(e.target.value)}
            spellCheck={false}
          />
        </Section>

        <Section title="Timing" hint="How long you can be silent, and how long you get to overturn a dormancy claim.">
          <div className="grid grid-cols-2 gap-6">
            <label className="block">
              <span className="label mb-2 block">Heartbeat interval</span>
              <span className="flex items-baseline gap-2">
                <input
                  className="field w-20 text-right tabular-nums"
                  inputMode="numeric"
                  value={intervalDays}
                  onChange={(e) => setIntervalDays(Math.max(1, Number(e.target.value) || 0))}
                />
                <select
                  className="field font-mono text-[11px] uppercase tracking-wider"
                  value={intervalUnit}
                  onChange={(e) => setIntervalUnit(e.target.value as "days" | "minutes")}
                >
                  <option className="bg-black" value="days">
                    days
                  </option>
                  <option className="bg-black" value="minutes">
                    minutes (testnet demo)
                  </option>
                </select>
              </span>
            </label>
            <NumberField label="Grace window" unit="days" value={graceDays} onChange={setGraceDays} min={0} />
          </div>
        </Section>

        <Section title="Beneficiaries" hint="Fixed sums are paid first, then shares of what remains, then the residue.">
          <div className="space-y-5">
            <AnimatePresence initial={false}>
              {bequests.map((b, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-[1fr_auto] items-end gap-4"
                >
                  <div className="grid gap-3 sm:grid-cols-[1.6fr_0.7fr_0.9fr]">
                    <input
                      className="field font-mono text-xs"
                      placeholder="Beneficiary r-address"
                      value={b.beneficiary}
                      onChange={(e) =>
                        setBequests((bs) => bs.map((x, j) => (j === i ? { ...x, beneficiary: e.target.value } : x)))
                      }
                      spellCheck={false}
                    />
                    <input
                      className="field text-right tabular-nums"
                      placeholder="0"
                      inputMode="decimal"
                      value={fromRaw(b.kind, b.amount)}
                      onChange={(e) =>
                        setBequests((bs) =>
                          bs.map((x, j) => (j === i ? { ...x, amount: toRaw(x.kind, e.target.value) } : x)),
                        )
                      }
                    />
                    <select
                      className="field font-mono text-[11px] uppercase tracking-wider"
                      value={b.kind}
                      onChange={(e) => {
                        const kind = e.target.value as WillBequest["kind"];
                        setBequests((bs) =>
                          bs.map((x, j) =>
                            j === i ? { ...x, kind, amount: toRaw(kind, fromRaw(x.kind, x.amount)) } : x,
                          ),
                        );
                      }}
                    >
                      <option className="bg-black" value="SHARE_BPS">
                        % share
                      </option>
                      <option className="bg-black" value="FIXED_USD">
                        USD
                      </option>
                      <option className="bg-black" value="FIXED_XRP">
                        XRP
                      </option>
                    </select>
                  </div>
                  <button
                    className="pb-2.5 font-mono text-xs text-ink-300 hover:text-white"
                    onClick={() => setBequests((bs) => bs.filter((_, j) => j !== i))}
                    aria-label={`Remove beneficiary ${i + 1}`}
                    disabled={bequests.length === 1}
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button className="btn mt-6 px-4 py-2" onClick={() => setBequests((bs) => [...bs, { ...BLANK_BEQUEST }])}>
            Add beneficiary
          </button>
        </Section>

        <Section title="Residue" hint="Receives anything left after fixed bequests and shares.">
          <input
            className="field font-mono text-sm"
            placeholder="rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf"
            value={residuary}
            onChange={(e) => setResiduary(e.target.value)}
            spellCheck={false}
          />
        </Section>

        <Section
          title="Guardians"
          hint="Optional Flare addresses that must confirm before execution. They can only confirm — never seize."
        >
          <div className="space-y-3">
            {guardians.map((g, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] items-end gap-4">
                <input
                  className="field font-mono text-xs"
                  placeholder="0x…"
                  value={g}
                  onChange={(e) => setGuardians((gs) => gs.map((x, j) => (j === i ? e.target.value : x)))}
                  spellCheck={false}
                />
                <button
                  className="pb-2.5 font-mono text-xs text-ink-300 hover:text-white"
                  onClick={() => {
                    setGuardians((gs) => gs.filter((_, j) => j !== i));
                    setThreshold((t) => Math.min(t, guardians.length - 1));
                  }}
                  aria-label={`Remove guardian ${i + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-6">
            <button className="btn px-4 py-2" onClick={() => setGuardians((gs) => [...gs, ""])}>
              Add guardian
            </button>
            {validGuardians.length > 0 && (
              <NumberField
                label="Confirmations required"
                unit={`of ${validGuardians.length}`}
                value={threshold}
                onChange={(v) => setThreshold(Math.max(0, Math.min(v, validGuardians.length)))}
                min={0}
              />
            )}
          </div>
        </Section>

        <div className="mt-10 border-t border-ink-800 pt-8">
          {validationError && <p className="mb-5 font-mono text-xs text-ink-300">⚠ {validationError}</p>}
          {error && <p className="mb-5 font-mono text-xs text-white">✕ {error}</p>}

          {txHash ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <p className="font-mono text-sm">Vault created.</p>
              <a
                href={`${EXPLORER}/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="block break-all font-mono text-[11px] text-ink-300 underline-offset-4 hover:text-white hover:underline"
              >
                {txHash}
              </a>
              {createdWill && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="btn px-4 py-2"
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(createdWill, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `heirloom-will-vault-${createdWill.vaultId}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download will file
                    </button>
                    <button className="btn btn-solid px-4 py-2" onClick={onViewVaults}>
                      View your vault →
                    </button>
                  </div>
                  <p className="max-w-[42ch] text-xs leading-relaxed text-ink-300">
                    Your will is saved in this browser, so sealing and payout here just work. Download the file
                    too if you want a copy that survives this device — the chain holds only the fingerprint.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <button className="btn btn-solid w-full py-4" disabled={!canSubmit} onClick={submit}>
              {busy ? "Confirm in wallet…" : "Create vault on Coston2"}
            </button>
          )}
        </div>
      </div>

      {/* ---------------- live preview ---------------- */}
      <div className="bg-black p-7 md:p-10">
        <p className="label mb-8">What gets stored on Flare</p>

        <div className="mb-9">
          <div className="label mb-2 text-ink-300">Will commitment</div>
          {commitment ? (
            <motion.code
              key={commitment}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              className="block break-all font-mono text-[11px] leading-relaxed text-white"
            >
              {commitment}
            </motion.code>
          ) : (
            <p className="font-mono text-[11px] text-ink-300">Complete the will to compute it.</p>
          )}
          <p className="mt-3 max-w-[42ch] text-xs leading-relaxed text-ink-300">
            This hash is all the chain ever learns. Beneficiaries and amounts stay off-chain — change any term and
            the hash changes, which is what stops a substituted will from settling.
          </p>
        </div>

        <div className="mb-6 border-t border-ink-800 pt-7">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <div className="label text-ink-300">Distribution preview</div>
            <label className="flex items-baseline gap-2 font-mono text-[11px] text-ink-300">
              <input
                className="w-24 border-b border-ink-700 bg-transparent text-right tabular-nums text-white focus:border-white focus:outline-none"
                inputMode="decimal"
                value={estateXrp}
                onChange={(e) => setEstateXrp(Number(e.target.value) || 0)}
              />
              XRP
            </label>
          </div>

          {preview ? (
            <>
              {preview.abatementApplied && (
                <p className="mb-4 font-mono text-[11px] leading-relaxed text-white">
                  ⚠ The estate cannot cover every fixed bequest. Each is abated proportionally, preserving the
                  ratios you wrote.
                </p>
              )}
              <table className="w-full text-xs">
                <tbody>
                  {preview.allocations.map((a, i) => (
                    <tr key={i} className="border-b border-ink-800/70">
                      <td className="py-2.5 font-mono text-[11px] text-ink-300">
                        {a.beneficiary.slice(0, 10)}…
                      </td>
                      <td className="py-2.5 font-mono text-[10px] uppercase tracking-wider text-ink-300">
                        {a.source.replace("_", " ").toLowerCase()}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-white">
                        {(Number(a.drops) / 1e6).toLocaleString("en-US", { maximumFractionDigits: 4 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-ink-300">
                {(Number(preview.retainedDrops) / 1e6).toFixed(6)} XRP retained for reserve and fees
              </p>
            </>
          ) : (
            <p className="font-mono text-[11px] text-ink-300">
              {validationError ? "Waiting for a valid will." : "Enter an estate size."}
            </p>
          )}
        </div>

        <p className="max-w-[44ch] text-xs leading-relaxed text-ink-300">
          This preview runs the exact allocation engine that executes inside the enclave — not a reimplementation.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="mb-1 text-base font-semibold tracking-tight">{title}</h3>
      {hint && <p className="mb-5 max-w-[52ch] text-xs leading-relaxed text-ink-300">{hint}</p>}
      {children}
    </div>
  );
}

function NumberField({
  label,
  unit,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="label mb-2 block">{label}</span>
      <span className="flex items-baseline gap-2">
        <input
          className="field w-20 text-right tabular-nums"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
        />
        <span className="font-mono text-[11px] text-ink-300">{unit}</span>
      </span>
    </label>
  );
}
