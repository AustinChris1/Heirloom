import { Contract, JsonRpcProvider, JsonRpcSigner } from "ethers";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AttestationFlow } from "./AttestationFlow";
import { EnclaveFlow } from "./EnclaveFlow";
import { COSTON2_RPC } from "../../lib/chain";
import { HEIRLOOM_VAULT, VAULT_ABI } from "../../lib/deployment";
import { LiveVault } from "../../lib/chain";
import {
  BEACON_XRPL_ADDRESS,
  EXPLORER,
  HEARTBEAT_DROPS,
  XRPL_TESTNET_EXPLORER,
} from "../../lib/deployment";
import { humanError, vaultWithSigner } from "../../lib/wallet";

/**
 * A single vault: its state, the exact heartbeat it needs, and the actions
 * available to whoever is connected.
 */
export function VaultDetail({
  vault,
  signer,
  address,
  onChanged,
}: {
  vault: LiveVault;
  signer: JsonRpcSigner | null;
  address: string | null;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const isOwner = !!address && address.toLowerCase() === vault.owner.toLowerCase();

  // Guardianship is independent of ownership — the contract lets an owner also
  // be a guardian — so this has to be read per address rather than inferred
  // from "not the owner", which is what the first version got wrong.
  const [role, setRole] = useState({ guardian: false, approved: false });
  useEffect(() => {
    if (!address) {
      setRole({ guardian: false, approved: false });
      return;
    }
    let cancelled = false;
    const read = new Contract(HEIRLOOM_VAULT, VAULT_ABI, new JsonRpcProvider(COSTON2_RPC));
    Promise.all([read.isGuardian(vault.id, address), read.hasApproved(vault.id, address)])
      .then(([guardian, approved]) => !cancelled && setRole({ guardian, approved }))
      .catch(() => !cancelled && setRole({ guardian: false, approved: false }));
    return () => {
      cancelled = true;
    };
  }, [address, vault.id, vault.guardianApprovals, vault.state]);

  async function run(name: string, fn: (c: ReturnType<typeof vaultWithSigner>) => Promise<any>) {
    if (!signer) return;
    setBusy(name);
    setError(null);
    setTxHash(null);
    try {
      const receipt = await (await fn(vaultWithSigner(signer))).wait();
      setTxHash(receipt.hash);
      onChanged();
    } catch (err) {
      setError(humanError(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid gap-px bg-ink-800 lg:grid-cols-2"
    >
      {/* ---- state ---- */}
      <div className="bg-black p-7 md:p-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="label mb-2">Vault #{vault.id}</p>
            <StateBadge state={vault.state} overdue={vault.overdue} />
          </div>
          <div className="text-right">
            <p className="label mb-2">Heartbeat</p>
            <p className="font-mono text-2xl tabular-nums">
              {vault.overdue ? "OVERDUE" : `${vault.daysUntilDue.toFixed(1)}d`}
            </p>
          </div>
        </div>

        <dl className="mt-8 space-y-3 border-t border-ink-800 pt-6 text-xs">
          <Row label="Owner">
            <span className="font-mono">
              {vault.owner.slice(0, 10)}…{vault.owner.slice(-6)}
              {isOwner && <span className="ml-2 text-ink-300">(you)</span>}
            </span>
          </Row>
          <Row label="Will">{vault.willAttested ? "Sealed and attested" : "Not sealed yet"}</Row>
          <Row label="Guardians">{vault.guardians} confirmed</Row>
          <Row label="XRPL tag">
            <span className="font-mono">{vault.heartbeatTag}</span>
          </Row>
        </dl>

        {/* ---- actions ---- */}
        <div className="mt-8 flex flex-wrap gap-3 border-t border-ink-800 pt-6">
          {!signer && <p className="font-mono text-[11px] text-ink-300">Connect a wallet to act on this vault.</p>}

          {signer && isOwner && vault.state === "Dormant" && (
            <button className="btn btn-solid" disabled={!!busy} onClick={() => run("revoke", (c) => c.revokeDormancy(vault.id))}>
              {busy === "revoke" ? "Confirming…" : "I'm alive — cancel"}
            </button>
          )}

          {signer && vault.state === "Dormant" && role.guardian && !role.approved && (
            <button className="btn" disabled={!!busy} onClick={() => run("approve", (c) => c.guardianApprove(vault.id))}>
              {busy === "approve" ? "Confirming…" : "Confirm as guardian"}
            </button>
          )}

          {signer && role.guardian && role.approved && vault.state === "Dormant" && (
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-300">
              ✓ You have confirmed
            </span>
          )}

          {signer && role.guardian && vault.state === "Active" && (
            <span className="font-mono text-[11px] text-ink-300">
              You are a guardian here. Nothing to confirm while the vault is alive.
            </span>
          )}

          {signer && isOwner && vault.state !== "Settled" && vault.state !== "Revoked" && (
            <button className="btn" disabled={!!busy} onClick={() => run("close", (c) => c.revokeVault(vault.id))}>
              {busy === "close" ? "Confirming…" : "Close vault"}
            </button>
          )}
        </div>

        {error && <p className="mt-5 font-mono text-[11px] text-white">✕ {error}</p>}
        {txHash && (
          <a
            href={`${EXPLORER}/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block break-all font-mono text-[10px] text-ink-300 underline-offset-4 hover:text-white hover:underline"
          >
            ✓ {txHash}
          </a>
        )}
      </div>

      {/* ---- how to stay alive ---- */}
      <div className="bg-black p-7 md:p-9">
        <p className="label mb-3">Stay alive</p>

        {/* One sentence, then the fields. The previous version stacked four
            explanatory paragraphs around three inputs, which is how someone
            reads "send a payment" and assumes it funds the estate. */}
        <p className="mb-6 text-sm leading-relaxed text-ink-200">
          Send this payment from your XRP Ledger account before the timer runs out.
          <br />
          <strong className="text-white">It is a signal, not a deposit</strong> — your estate never moves.
        </p>

        <div className="space-y-5">
          <CopyField label="To (beacon account)" value={BEACON_XRPL_ADDRESS} />
          <CopyField label="Destination tag — identifies your vault" value={String(vault.heartbeatTag)} emphasise />
          <CopyField label="Amount — send exactly this" value={`${Number(HEARTBEAT_DROPS) / 1e6} XRP`} />
        </div>

        <TestnetHeartbeat tag={vault.heartbeatTag} />

        {/* Detail belongs behind a disclosure, not in front of the fields. */}
        <details className="mt-5 text-xs text-ink-300">
          <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.16em] hover:text-white">
            Why these three fields
          </summary>
          <div className="mt-3 space-y-2.5 leading-relaxed">
            <p>
              The <strong className="text-ink-100">tag</strong> is what identifies your vault. A payment without
              it — or with someone else's — does not count, and the same tag is what later lets the network prove
              no heartbeat arrived.
            </p>
            <p>
              The <strong className="text-ink-100">beacon</strong> is a marker, not a safe. Nothing is stored
              there. Sending more than the minimum buys you nothing and cannot be recovered.
            </p>
            <p>
              No Flare transaction is needed to send it, and anyone can relay the proof on your behalf — so being
              offline never puts you at risk.
            </p>
            <a
              href={`${XRPL_TESTNET_EXPLORER}/accounts/${BEACON_XRPL_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block pt-1 font-mono text-[10px] uppercase tracking-[0.16em] underline-offset-4 hover:text-white hover:underline"
            >
              Beacon on XRPL testnet ↗
            </a>
          </div>
        </details>

        <AttestationFlow vault={vault} signer={signer} onChanged={onChanged} />

        <EnclaveFlow vault={vault} signer={signer} onChanged={onChanged} />

        {/* What is live on this deployment, and what still needs infrastructure. */}
        <div className="mt-9 border-t border-ink-800 pt-6">
          <p className="label mb-4">Lifecycle on this deployment</p>
          <ul className="space-y-2.5 text-xs">
            <Step live>Create vault, guardians, commitment</Step>
            <Step live>Heartbeat on XRPL, proven via FDC XRPPayment</Step>
            <Step live>Dormancy via FDC XRPPaymentNonexistence</Step>
            <Step live>Cancel dormancy, guardian confirmation</Step>
            <Step live>Seal: browser-side ECIES to the enclave's attested key, attested via FCC</Step>
            <Step live>Execute: enclave decrypts, prices via FTSO, contract verifies its signature</Step>
            <Step live>Payout: settled distribution broadcast as real XRPL payments</Step>
          </ul>
          <p className="mt-4 max-w-[44ch] text-xs leading-relaxed text-ink-300">
            The enclave serves at status PRODUCTION on extension 66025. The one departure from the full design:
            payout signing uses the estate's testnet seed here, where production would delegate a regular key to
            the enclave itself.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- */

/**
 * Testnet-only convenience: sign and send the heartbeat right here, so the
 * whole demo needs no external XRPL wallet. Most wallet UIs bury the
 * destination tag, and a heartbeat without the tag silently doesn't count —
 * this path can't make that mistake. Pasting a seed into a page is acceptable
 * exactly because this is testnet; a real product would never ask.
 */
function TestnetHeartbeat({ tag }: { tag: number }) {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setBusy(true);
    setError(null);
    setSent(null);
    try {
      const [{ addressFromSeed, signPayment }, { accountInfo, submitPayment }, { currentLedger }] =
        await Promise.all([import("../../lib/xrplSign"), import("../../lib/xrplPayout"), import("../../lib/fdc")]);

      const account = addressFromSeed(seed);
      const { sequence } = await accountInfo(account);
      const ledger = await currentLedger();

      const { blob, hash } = signPayment(
        {
          TransactionType: "Payment",
          Account: account,
          Destination: BEACON_XRPL_ADDRESS,
          Amount: HEARTBEAT_DROPS.toString(),
          DestinationTag: tag,
          Fee: "12",
          Sequence: sequence,
          LastLedgerSequence: ledger + 300,
        },
        seed,
      );
      const { engineResult } = await submitPayment(blob);
      if (engineResult !== "tesSUCCESS") throw new Error(`XRPL returned ${engineResult}`);
      setSent(hash);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-300 underline-offset-4 hover:text-white hover:underline"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "− Hide testnet helper" : "+ Testnet helper: send it from here"}
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <input
            className="field w-full font-mono text-xs"
            placeholder="Estate testnet seed (s…) — signs the tagged dust payment"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            spellCheck={false}
          />
          <button className="btn px-4 py-2" disabled={!seed.trim() || busy} onClick={send}>
            {busy ? "Sending…" : "Sign & send heartbeat"}
          </button>
          {sent && (
            <div className="space-y-1">
              <CopyField label="Sent — paste this hash into Prove life below" value={sent} />
              <a
                href={`${XRPL_TESTNET_EXPLORER}/transactions/${sent}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-300 underline-offset-4 hover:text-white hover:underline"
              >
                On XRPL testnet ↗
              </a>
            </div>
          )}
          {error && <p className="font-mono text-[11px] text-white">✕ {error}</p>}
        </div>
      )}
    </div>
  );
}

function Step({ children, live = false }: { children: React.ReactNode; live?: boolean }) {
  return (
    <li className={`flex items-baseline gap-3 ${live ? "text-ink-100" : "text-ink-300"}`}>
      <span className="font-mono text-[10px]">{live ? "●" : "○"}</span>
      <span>{children}</span>
    </li>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className="label">{label}</dt>
      <dd className="text-right text-ink-100">{children}</dd>
    </div>
  );
}

function StateBadge({ state, overdue }: { state: string; overdue: boolean }) {
  const inverted = state === "Active" && !overdue;
  return (
    <span
      className={`inline-block border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] ${
        inverted ? "border-white bg-white text-black" : "border-ink-600 text-ink-200"
      }`}
    >
      {state}
      {overdue && state === "Active" ? " · overdue" : ""}
    </span>
  );
}

function CopyField({ label, value, emphasise = false }: { label: string; value: string; emphasise?: boolean }) {
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <div className="label mb-2">{label}</div>
      <button
        className="group flex w-full items-center justify-between gap-4 border-b border-ink-700 pb-2.5 text-left transition-colors hover:border-white"
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        }}
      >
        <span className={`break-all font-mono ${emphasise ? "text-xl" : "text-sm"}`}>{value}</span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-ink-300 group-hover:text-white">
          {copied ? "copied" : "copy"}
        </span>
      </button>
    </div>
  );
}
