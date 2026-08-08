import { JsonRpcSigner } from "ethers";
import { motion } from "framer-motion";
import { useState } from "react";
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

          {signer && vault.state === "Dormant" && !isOwner && (
            <button className="btn" disabled={!!busy} onClick={() => run("approve", (c) => c.guardianApprove(vault.id))}>
              {busy === "approve" ? "Confirming…" : "Confirm as guardian"}
            </button>
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
        <p className="label mb-6">Stay alive</p>
        <p className="mb-7 max-w-[44ch] text-sm leading-relaxed text-ink-300">
          Send this payment from your XRP Ledger account before the timer runs out. It costs a fraction of a cent
          and needs no Flare transaction — anyone can relay the proof for you.
        </p>

        <div className="space-y-5">
          <CopyField label="To (beacon account)" value={BEACON_XRPL_ADDRESS} />
          <CopyField label="Destination tag" value={String(vault.heartbeatTag)} emphasise />
          <CopyField label="Amount (minimum)" value={`${Number(HEARTBEAT_DROPS) / 1e6} XRP`} />
        </div>

        <p className="mt-7 max-w-[44ch] text-xs leading-relaxed text-ink-300">
          The destination tag is what identifies your vault. A payment without it — or with someone else's — will
          not count, and the same tag is what lets the network later prove that no heartbeat arrived.
        </p>

        <a
          href={`${XRPL_TESTNET_EXPLORER}/accounts/${BEACON_XRPL_ADDRESS}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-ink-300 underline-offset-4 hover:text-white hover:underline"
        >
          Beacon on XRPL testnet ↗
        </a>

        {/* What is live on this deployment, and what still needs infrastructure. */}
        <div className="mt-9 border-t border-ink-800 pt-6">
          <p className="label mb-4">Lifecycle on this deployment</p>
          <ul className="space-y-2.5 text-xs">
            <Step live>Create vault, guardians, commitment</Step>
            <Step live>Heartbeat on XRPL, proven via FDC XRPPayment</Step>
            <Step live>Dormancy via FDC XRPPaymentNonexistence</Step>
            <Step live>Cancel dormancy, guardian confirmation</Step>
            <Step>Seal and execute the will — needs the TEE extension registered</Step>
          </ul>
          <p className="mt-4 max-w-[44ch] text-xs leading-relaxed text-ink-300">
            The final step calls into Flare Confidential Compute. The extension is written and tested but not yet
            registered on live FCC infrastructure, so those two actions revert on this deployment.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- */

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
