import { Contract, JsonRpcProvider, JsonRpcSigner } from "ethers";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AttestationFlow } from "./AttestationFlow";
import { EnclaveFlow } from "./EnclaveFlow";
import { COSTON2_RPC, PROVABLE_SILENCE_SECONDS } from "../../lib/chain";
import { HEIRLOOM_VAULT, VAULT_ABI } from "../../lib/deployment";
import { LiveVault } from "../../lib/chain";
import {
  BEACON_XRPL_ADDRESS,
  EXPLORER,
  HEARTBEAT_DROPS,
  XRPL_TESTNET_EXPLORER,
} from "../../lib/deployment";
import { toast } from "../../lib/toast";
import { loadVaultName, saveVaultName } from "../../lib/vaultNames";
import { loadWill } from "../../lib/willStore";
import type { WalletAdapter } from "../../lib/xrplWallet";
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

  // An owner can also be a guardian, so read the role per address.
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

  const ACTION_LABELS: Record<string, string> = {
    revoke: "Dormancy cancelled, the vault is active again and guardian approvals are cleared",
    approve: "Guardian confirmation recorded",
    close: "Vault closed permanently",
  };

  async function run(name: string, fn: (c: ReturnType<typeof vaultWithSigner>) => Promise<any>) {
    if (!signer) return;
    setBusy(name);
    setError(null);
    setTxHash(null);
    try {
      const receipt = await (await fn(vaultWithSigner(signer))).wait();
      setTxHash(receipt.hash);
      toast.success(ACTION_LABELS[name] ?? "Transaction confirmed", `${EXPLORER}/tx/${receipt.hash}`);
      onChanged();
    } catch (err) {
      const msg = humanError(err);
      setError(msg);
      toast.error(msg);
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
            <VaultTitle id={vault.id} isOwner={isOwner} />
            <StateBadge state={vault.state} overdue={vault.overdue} />
          </div>
          <div className="text-right">
            <CountdownPanel vault={vault} />
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
              {busy === "revoke" ? "Confirming…" : "I'm alive, cancel"}
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

      {/* The lifecycle in the order it happens: setup, living, then after-death. */}
      <div className="bg-black p-7 md:p-9">
        {/* Steps 1, 5 and 6: seal, execute, payout. */}
        <EnclaveFlow vault={vault} signer={signer} onChanged={onChanged} />


        {isOwner && vault.state !== "Revoked" && <AuthoriseEnclave vault={vault} />}


        <div className={vault.state === "Settled" || vault.state === "Revoked" ? "hidden" : "mt-9 border-t border-ink-800 pt-6"}>
          <p className="label mb-3">Step 3 · Stay alive</p>

          <p className="mb-6 text-sm leading-relaxed text-ink-200">
            Send this before the timer runs out.{" "}
            <strong className="text-white">It is a signal, not a deposit.</strong> Your estate never moves.
          </p>

          <div className="space-y-5">
            <CopyField label="To (beacon account)" value={BEACON_XRPL_ADDRESS} />
            <CopyField label="Destination tag, identifies your vault" value={String(vault.heartbeatTag)} emphasise />
            <CopyField label="Amount, send exactly this" value={`${Number(HEARTBEAT_DROPS) / 1e6} XRP`} />
          </div>

          <TestnetHeartbeat tag={vault.heartbeatTag} />
        </div>


        <details className="mt-5 text-xs text-ink-300">
          <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.16em] hover:text-white">
            Why these three fields
          </summary>
          <div className="mt-3 space-y-2.5 leading-relaxed">
            <p>
              The <strong className="text-ink-100">tag</strong> is what identifies your vault. A payment without
              it, or with someone else's, does not count, and the same tag is what later lets the network prove
              no heartbeat arrived.
            </p>
            <p>
              The <strong className="text-ink-100">beacon</strong> is a marker, not a safe. Nothing is stored
              there. Sending more than the minimum buys you nothing and cannot be recovered.
            </p>
            <p>
              No Flare transaction is needed to send it, and anyone can relay the proof on your behalf, so being
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
            <Step live>Payout: the enclave signs the XRPL payments with its own key, no seed anywhere</Step>
          </ul>
          <p className="mt-4 max-w-[44ch] text-xs leading-relaxed text-ink-300">
            Extension 66025 at PRODUCTION. The enclave's XRPL key is generated inside the TEE and never touches
            disk, so once an estate authorises it, nobody holds a key that can move the funds.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- */

/**
 * The owner's one-time grant of the enclave's key as this estate's XRPL
 * regular key. This is what removes every human from the payout: the master
 * key is never surrendered, and the grant is revocable while alive.
 */
function AuthoriseEnclave({ vault }: { vault: LiveVault }) {
  const [open, setOpen] = useState(false);
  const [estate, setEstate] = useState(() => {
    try {
      const saved = loadWill(vault.willCommitment);
      return saved ? (JSON.parse(saved).estateAccount as string) : "";
    } catch {
      return "";
    }
  });
  const [seed, setSeed] = useState("");
  const [enclaveAddr, setEnclaveAddr] = useState<string | null>(null);
  const [wallets, setWallets] = useState<WalletAdapter[]>([]);
  const [connected, setConnected] = useState<Record<string, string>>({});
  // Detection is async, so don't claim "no wallet" before it answers.
  const [detecting, setDetecting] = useState(true);
  const [current, setCurrent] = useState<string | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Who the enclave is, and who this estate currently trusts.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { enclaveXrplAddress } = await import("../../lib/enclave");
        const addr = await enclaveXrplAddress();
        if (!cancelled) setEnclaveAddr(addr);
      } catch {
        /* enclave unreachable, the panel still explains the step */
      }
      try {
        const { detectWallets } = await import("../../lib/xrplWallet");
        const found = await detectWallets();
        if (!cancelled) setWallets(found);
      } catch {
        /* no wallets, the seed fallback covers it */
      } finally {
        if (!cancelled) setDetecting(false);
      }
      if (!estate.trim()) return;
      try {
        const { regularKeyOf } = await import("../../lib/xrplPayout");
        const key = await regularKeyOf(estate.trim());
        if (!cancelled) setCurrent(key);
      } catch {
        if (!cancelled) setCurrent(undefined);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [estate, open]);

  const delegated = !!enclaveAddr && !!current && current === enclaveAddr;

  /** Isolates "won't sign this type" from "can't sign for this account at all". */
  async function testWallet(wallet: WalletAdapter) {
    if (!wallet.testSign) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const account = connected[wallet.id] || (await wallet.address());
      setConnected((c) => ({ ...c, [wallet.id]: account }));
      const { engineResult } = await wallet.testSign(account);
      setNote(
        `${wallet.name} signed a 1-drop test payment (${engineResult}). Signing works for this account, so a ` +
          `failing authorisation means the wallet refuses the SetRegularKey type.`,
      );
    } catch (err) {
      setError(
        `${wallet.name} could not sign even a plain payment: ${(err as Error).message} — so this is the card ` +
          `or its network, not the transaction type.`,
      );
    } finally {
      setBusy(false);
    }
  }

  /** The production path: sign in the owner's own wallet, no seed anywhere. */
  async function authoriseWithWallet(wallet: WalletAdapter) {
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      if (!enclaveAddr) throw new Error("Could not read the enclave's address.");

      // Reuse a connection from this session. Extensions queue prompts, so
      // asking to connect and to sign back-to-back can leave the second popup
      // hidden behind the first, connect once, then only sign.
      const account = connected[wallet.id] || (await wallet.address());
      setConnected((c) => ({ ...c, [wallet.id]: account }));
      if (estate.trim() && account !== estate.trim()) {
        // Forget the session so the retry re-prompts instead of silently
        // returning the same wrong account forever.
        setConnected((c) => ({ ...c, [wallet.id]: "" }));
        await wallet.disconnect?.().catch(() => {});
        throw new Error(
          `${wallet.name} signed in as ${account}, but this vault's estate is ${estate.trim()}. ` +
            `You've been signed out, click again and pick the estate's account in ${wallet.name}. ` +
            `(Or create your vault with your wallet's address as the estate: wallet first, vault second.)`,
        );
      }

      const { hash, engineResult } = await wallet.setRegularKey(account, enclaveAddr);
      if (engineResult !== "tesSUCCESS") throw new Error(`XRPL returned ${engineResult}`);

      setCurrent(enclaveAddr);
      setNote(hash ? `Authorised in ${wallet.name} — ${hash.slice(0, 16)}…` : `Authorised in ${wallet.name}.`);
      toast.success(
        `Enclave authorised in ${wallet.name} — it can now sign this estate’s payouts`,
        hash ? `${XRPL_TESTNET_EXPLORER}/transactions/${hash}` : undefined,
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function authorise() {
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const [{ addressFromSeed, signPayment }, { accountInfo, submitPayment }, { currentLedger }] =
        await Promise.all([import("../../lib/xrplSign"), import("../../lib/xrplPayout"), import("../../lib/fdc")]);

      const account = addressFromSeed(seed);
      if (estate.trim() && account !== estate.trim()) {
        throw new Error(`That seed controls ${account}, not the estate ${estate.trim()}.`);
      }
      if (!enclaveAddr) throw new Error("Could not read the enclave's address.");

      const { sequence } = await accountInfo(account);
      const ledger = await currentLedger();
      const { blob, hash } = signPayment(
        {
          TransactionType: "SetRegularKey",
          Account: account,
          RegularKey: enclaveAddr,
          Fee: "12",
          Sequence: sequence,
          LastLedgerSequence: ledger + 300,
        },
        seed,
      );
      const { engineResult } = await submitPayment(blob);
      if (engineResult !== "tesSUCCESS") throw new Error(`XRPL returned ${engineResult}`);

      setCurrent(enclaveAddr);
      setSeed("");
      setNote(`Authorised — ${hash.slice(0, 16)}…`);
      toast.success(
        "Enclave authorised, it can now sign this estate’s payouts",
        `${XRPL_TESTNET_EXPLORER}/transactions/${hash}`,
      );
    } catch (err) {
      const msg = (err as Error).message ?? String(err);
      // Xaman gates account-security tx types until an app is allowlisted (1217).
      setError(
        /1217/.test(msg)
          ? "Xaman blocks SetRegularKey for unverified apps, it gates account-security transaction types until an app is allowlisted. Use the seed field above; the enclave-signed payout is identical whichever way the key was granted."
          : /public key for this card|did not find a card/i.test(msg)
            ? `${msg} — Crossmark could not resolve signing material for this account. Usually a card that is view-only, imported incompletely, or on the wrong network. Try "Test signing" below: if a 1-drop payment also fails, it is the card, not the transaction type.`
            : msg,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 border-t border-ink-800 pt-6">
      <p className="label mb-3">Step 2 · Authorise the enclave to pay out</p>

      {delegated ? (
        <p className="max-w-[46ch] text-xs leading-relaxed text-ink-100">
          ✓ Authorised. The enclave signs this estate's payouts itself, revocable any time while alive.
        </p>
      ) : (
        <>
          <p className="mb-4 max-w-[46ch] text-xs leading-relaxed text-ink-300">
            Grant the enclave's key as this estate's XRPL <em>regular key</em>, so it can pay your heirs without
            anyone holding a seed.
            {vault.state !== "Active" && (
              <>
                {" "}
                <strong className="text-white">
                  A real owner does this while alive, after death nobody can.
                </strong>{" "}
                On testnet you still hold this estate's seed, so you can authorise it now and see the
                enclave-signed payout work.
              </>
            )}
          </p>
          <details className="mb-4 max-w-[46ch] text-xs leading-relaxed text-ink-300">
            <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.16em] hover:text-white">
              Why this step
            </summary>
            <p className="mt-3">
              Your estate holds the XRP and signs this grant; the enclave's key below receives signing rights.
              It lives inside the TEE, never holds funds, and your master key never leaves your wallet. XRPL
              calls this a regular key, and you can revoke it at any time while alive.
            </p>
          </details>
          {enclaveAddr && <CopyField label="The enclave's key, what you are authorising" value={enclaveAddr} />}

          {/* Primary path: the owner approves in his own wallet. This is the
              real gesture, the seed field below exists only for browsers with
              no XRPL wallet, and for wallets that refuse the transaction type. */}
          {wallets.length > 0 ? (
            <div className="mt-5">
              <div className="flex flex-wrap gap-3">
                {wallets.map((w) => (
                  <button
                    key={w.id}
                    className="btn btn-solid px-4 py-2"
                    disabled={busy}
                    onClick={() => authoriseWithWallet(w)}
                  >
                    {busy ? "Waiting for your wallet…" : `Authorise with ${w.name}`}
                  </button>
                ))}
              </div>
              <p className="mt-3 max-w-[48ch] text-xs leading-relaxed text-ink-300">
                The wallet must hold this vault's estate account. Scroll inside its popup to reach Approve.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {wallets
                  .filter((w) => w.testSign)
                  .map((w) => (
                    <button
                      key={`${w.id}-test`}
                      className="btn px-3 py-1.5 text-[10px]"
                      disabled={busy}
                      onClick={() => testWallet(w)}
                    >
                      Test signing ({w.name})
                    </button>
                  ))}
              </div>
              <p className="mt-2 max-w-[48ch] text-xs leading-relaxed text-ink-300">
                Diagnostic: sends 1 drop to yourself, to tell a blocked transaction type from a card that cannot
                sign at all.
              </p>
              <p className="mt-3 max-w-[48ch] text-xs leading-relaxed text-ink-300">
                Xaman refuses rekey requests from apps that are not allowlisted. Copy the key above and grant it
                from{" "}
                <a
                  className="underline underline-offset-4 hover:text-white"
                  href="https://xrpl.services"
                  target="_blank"
                  rel="noreferrer"
                >
                  xrpl.services
                </a>{" "}
                instead, same transaction, signed in your own Xaman.
              </p>
            </div>
          ) : detecting ? (
            <p className="mt-5 font-mono text-[11px] text-ink-300">Looking for an XRPL wallet…</p>
          ) : (
            <p className="mt-5 max-w-[48ch] text-xs leading-relaxed text-ink-300">
              No XRPL wallet detected. Install{" "}
              <a className="underline underline-offset-4 hover:text-white" href="https://gemwallet.app" target="_blank" rel="noreferrer">
                GemWallet
              </a>{" "}
              or{" "}
              <a className="underline underline-offset-4 hover:text-white" href="https://crossmark.io" target="_blank" rel="noreferrer">
                Crossmark
              </a>{" "}
              and reload, or use the testnet fallback below.
            </p>
          )}

          {/* Fallback: only for browsers with no wallet, or a wallet that
              refuses the type. Never the intended path. */}
          <details className="mt-5 text-xs text-ink-300">
            <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.16em] hover:text-white">
              Testnet fallback, sign with the estate seed
            </summary>
            <div className="mt-4 space-y-3">
              <input
                className="field w-full font-mono text-xs"
                placeholder="Estate r-address"
                value={estate}
                onChange={(e) => setEstate(e.target.value)}
                spellCheck={false}
              />
              <input
                className="field w-full font-mono text-sm"
                placeholder="Estate testnet seed (s…) — signs this one authorisation"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                spellCheck={false}
              />
              <button className="btn px-4 py-2" disabled={!seed.trim() || busy} onClick={authorise}>
                {busy ? "Authorising…" : "Sign SetRegularKey"}
              </button>
              <p className="max-w-[48ch] leading-relaxed">
                Testnet only. A real owner signs this in their own wallet and never types a seed anywhere.
              </p>
            </div>
          </details>
        </>
      )}

      {note && <p className="mt-3 font-mono text-[11px] text-ink-100">✓ {note}</p>}
      {error && <p className="mt-3 font-mono text-[11px] text-white">✕ {error}</p>}
    </div>
  );
}

/** Seconds as a live clock: days+hours far out, mm:ss when it matters. */
function formatRemaining(seconds: number): string {
  if (seconds <= 0) return "0s";
  const d = Math.floor(seconds / 86_400);
  const h = Math.floor((seconds % 86_400) / 3_600);
  const m = Math.floor((seconds % 3_600) / 60);
  const s = Math.floor(seconds % 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

function formatElapsed(seconds: number): string {
  const d = Math.floor(seconds / 86_400);
  const h = Math.floor((seconds % 86_400) / 3_600);
  const m = Math.floor((seconds % 3_600) / 60);
  if (d > 0) return `${d}d ${h}h ago`;
  if (h > 0) return `${h}h ${m}m ago`;
  return `${m}m ago`;
}

/** The vault's clock: heartbeat countdown when Active, grace window when Dormant. */
function CountdownPanel({ vault }: { vault: LiveVault }) {
  const [now, setNow] = useState(() => Date.now() / 1000);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => clearInterval(t);
  }, []);

  if (vault.state === "Dormant") {
    const since = now - vault.dormantSince;
    const graceLeft = vault.dormantSince + vault.graceWindow - now;
    return (
      <>
        <p className="label mb-2">{graceLeft > 0 ? "Grace window" : "Grace elapsed"}</p>
        <p className="font-mono text-2xl tabular-nums">
          {graceLeft > 0 ? formatRemaining(graceLeft) : "READY"}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-300">
          dormant {formatElapsed(since)}
        </p>
      </>
    );
  }

  if (vault.state === "Settled" || vault.state === "Revoked") {
    // "Settled" means the distribution is verified and recorded on-chain, the
    // XRP has not moved until it is broadcast, so do not claim it has.
    let paid = false;
    try {
      paid = localStorage.getItem(`heirloom:distributed:${vault.id}`) === "1";
    } catch {
      /* private browsing */
    }
    return (
      <>
        <p className="label mb-2">Status</p>
        <p className="font-mono text-2xl tabular-nums">
          {vault.state === "Revoked" ? "CLOSED" : paid ? "PAID" : "SETTLED"}
        </p>
        {vault.state === "Settled" && (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-300">
            {/* Only the browser that broadcast knows the payout happened: the
                chain stores hashes of the estate and beneficiaries, so nobody
                else can even tell which XRPL account to check. */}
            {paid ? "broadcast from this browser" : "awaiting payout"}
          </p>
        )}
      </>
    );
  }

  if (vault.state === "Executing") {
    return (
      <>
        <p className="label mb-2">Status</p>
        <p className="font-mono text-2xl tabular-nums">EXECUTING</p>
      </>
    );
  }

  // Count down to the heartbeat, then up past it.
  const dueAt = vault.lastHeartbeat + vault.heartbeatInterval;
  const overdueBy = now - dueAt;
  const isOverdue = vault.overdue || overdueBy > 0;
  const unprovable = isOverdue && overdueBy > PROVABLE_SILENCE_SECONDS;

  return (
    <>
      <p className="label mb-2">{isOverdue ? "Overdue by" : "Heartbeat due"}</p>
      <p className={`font-mono text-2xl tabular-nums ${unprovable ? "text-ink-500" : ""}`}>
        {isOverdue ? formatRemaining(overdueBy) : formatRemaining(dueAt - now)}
      </p>
      {isOverdue && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-300">
          {unprovable ? "silence too long to prove · heartbeat to reset" : "dormancy may be claimed"}
        </p>
      )}
    </>
  );
}

/** "Vault #9", plus a private label stored only in this browser. */
function VaultTitle({ id, isOwner }: { id: number; isOwner: boolean }) {
  const [name, setName] = useState(() => loadVaultName(id));
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function commit() {
    saveVaultName(id, draft);
    setName(loadVaultName(id));
    setEditing(false);
  }

  return (
    <div className="mb-2 flex items-baseline gap-2">
      <p className="label">
        Vault #{id}
        {name && <span className="ml-2 normal-case tracking-normal text-white">· {name}</span>}
      </p>
      {isOwner && !editing && (
        <button
          className="font-mono text-[10px] text-ink-400 hover:text-white"
          title="Private name, only visible in this browser"
          onClick={() => {
            setDraft(name);
            setEditing(true);
          }}
        >
          {name ? "rename" : "name it"}
        </button>
      )}
      {editing && (
        <span className="flex items-baseline gap-2">
          <input
            autoFocus
            className="w-40 border-b border-ink-600 bg-transparent font-mono text-[11px] text-white focus:border-white focus:outline-none"
            placeholder="Private name, only you see it"
            value={draft}
            maxLength={48}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            onBlur={commit}
          />
        </span>
      )}
    </div>
  );
}

/**
 * Testnet-only: sends the heartbeat with the right destination tag, which most
 * wallet UIs bury and which silently doesn't count if omitted.
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
      toast.success("Heartbeat sent on XRPL, now prove it with Prove life", `${XRPL_TESTNET_EXPLORER}/transactions/${hash}`);
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
              <CopyField label="Sent, paste this hash into Prove life below" value={sent} />
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
