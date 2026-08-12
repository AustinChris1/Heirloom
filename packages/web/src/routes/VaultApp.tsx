import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { CreateVault } from "../components/app/CreateVault";
import { VaultDetail } from "../components/app/VaultDetail";
import { ChainSnapshot } from "../lib/chain";
import { EXPLORER, HEIRLOOM_VAULT } from "../lib/deployment";
import { useWallet } from "../lib/useWallet";

type Tab = "vaults" | "create";

export function VaultApp({ chain, refresh }: { chain: ChainSnapshot | null; refresh: () => void }) {
  const wallet = useWallet();
  const [tab, setTab] = useState<Tab>("vaults");
  const [selected, setSelected] = useState<number | null>(null);

  // Closed vaults stay on-chain forever, but showing them clutters the list.
  // Filter chips scope the view; within a view, vaults needing attention sort
  // first (Dormant → Executing → overdue → Active), newest first within a rank.
  type Filter = "open" | "settled" | "closed" | "all";
  const [filter, setFilter] = useState<Filter>("open");
  const allVaults = chain?.vaults ?? [];

  const matches = (v: (typeof allVaults)[number]) =>
    filter === "all"
      ? true
      : filter === "open"
        ? v.state === "Active" || v.state === "Dormant" || v.state === "Executing"
        : filter === "settled"
          ? v.state === "Settled"
          : v.state === "Revoked";

  const rank = (v: (typeof allVaults)[number]) =>
    v.state === "Dormant" ? 0 : v.state === "Executing" ? 1 : v.state === "Active" && v.overdue ? 2 : v.state === "Active" ? 3 : v.state === "Settled" ? 4 : 5;

  const vaults = allVaults.filter(matches).sort((a, b) => rank(a) - rank(b) || b.id - a.id);
  const counts = {
    open: allVaults.filter((v) => v.state === "Active" || v.state === "Dormant" || v.state === "Executing").length,
    settled: allVaults.filter((v) => v.state === "Settled").length,
    closed: allVaults.filter((v) => v.state === "Revoked").length,
    all: allVaults.length,
  };
  const mine = wallet.address
    ? vaults.filter((v) => v.owner.toLowerCase() === wallet.address!.toLowerCase())
    : [];
  // Selection survives filter changes by looking in the full list.
  const shown = selected !== null ? allVaults.find((v) => v.id === selected) : undefined;

  return (
    <div className="grain min-h-screen bg-black">
      <header className="sticky top-0 z-30 border-b border-ink-800 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link to="/" aria-label="Heirloom home">
            <Logo size={24} />
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/docs"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-300 underline-offset-4 hover:text-white hover:underline"
            >
              Docs
            </Link>
            {chain && (
              <span className="hidden font-mono text-[11px] text-ink-300 sm:inline">
                XRP {chain.xrpUsdDisplay}
              </span>
            )}
            <ConnectButton wallet={wallet} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-10 md:px-8 md:py-14">
        {/* status strip */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-ink-800 pb-6">
          <div>
            <h1 className="font-black uppercase leading-none tracking-tightest text-[clamp(2rem,5vw,3.4rem)]">
              Your vaults
            </h1>
            <a
              href={`${EXPLORER}/address/${HEIRLOOM_VAULT}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block break-all font-mono text-[11px] text-ink-300 underline-offset-4 hover:text-white hover:underline"
            >
              {HEIRLOOM_VAULT}
            </a>
          </div>

          <nav className="flex gap-2">
            <TabButton active={tab === "vaults"} onClick={() => setTab("vaults")}>
              Vaults {chain ? `(${chain.vaultCount})` : ""}
            </TabButton>
            <TabButton active={tab === "create"} onClick={() => setTab("create")}>
              New vault
            </TabButton>
          </nav>
        </div>

        {!wallet.available && (
          <Notice>
            No Ethereum wallet detected. Install MetaMask to create and manage vaults — you can still browse
            everything below without one.
          </Notice>
        )}

        {wallet.address && !wallet.onCoston2 && (
          <Notice>
            <span className="mb-3 block">You're connected to the wrong network.</span>
            <button className="btn btn-solid" onClick={wallet.switchToCoston2}>
              Switch to Coston2
            </button>
          </Notice>
        )}

        <AnimatePresence mode="wait">
          {tab === "create" ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              {wallet.signer && wallet.onCoston2 ? (
                <CreateVault
                  signer={wallet.signer}
                  vaultCount={chain?.vaultCount ?? 0}
                  xrpUsdPriceE18={chain?.xrpUsdPriceE18 ?? null}
                  onCreated={refresh}
                  onViewVaults={() => setTab("vaults")}
                />
              ) : (
                <Notice>
                  Connect a wallet on Coston2 to create a vault. You'll need a little C2FLR for gas — grab some
                  free at{" "}
                  <a
                    className="underline underline-offset-4 hover:text-white"
                    href="https://faucet.flare.network/coston2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    faucet.flare.network/coston2
                  </a>
                  .
                </Notice>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="vaults"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="space-y-8"
            >
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["open", `Open (${counts.open})`],
                    ["settled", `Settled (${counts.settled})`],
                    ["closed", `Closed (${counts.closed})`],
                    ["all", `All (${counts.all})`],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`cursor-pointer border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                      filter === key
                        ? "border-white bg-white text-black"
                        : "border-ink-700 text-ink-300 hover:border-white hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {wallet.address && mine.length > 0 && (
                <VaultGroup
                  title="Owned by you"
                  vaults={mine}
                  selected={selected}
                  onSelect={setSelected}
                />
              )}

              <VaultGroup
                title={wallet.address && mine.length > 0 ? "All vaults" : "All vaults on this deployment"}
                vaults={vaults}
                selected={selected}
                onSelect={setSelected}
                empty={
                  filter === "open"
                    ? "No open vaults. Create one, or check the other filters."
                    : "Nothing under this filter."
                }
              />

              <AnimatePresence>
                {shown && (
                  <VaultDetail
                    key={shown.id}
                    vault={shown}
                    signer={wallet.onCoston2 ? wallet.signer : null}
                    address={wallet.address}
                    onChanged={refresh}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-ink-800 px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
            Coston2 testnet · chain 114
          </p>
          <Link
            to="/"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300 hover:text-white"
          >
            ← Back to overview
          </Link>
        </div>
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function VaultGroup({
  title,
  vaults,
  selected,
  onSelect,
  empty,
}: {
  title: string;
  vaults: ReturnType<typeof Object>[] | any[];
  selected: number | null;
  onSelect: (id: number | null) => void;
  empty?: string;
}) {
  return (
    <section>
      <p className="label mb-4">{title}</p>
      {vaults.length === 0 ? (
        <p className="border border-ink-800 p-8 text-sm text-ink-300">{empty}</p>
      ) : (
        <div className="grid gap-px bg-ink-800 sm:grid-cols-2 lg:grid-cols-3">
          {vaults.map((v: any) => (
            <button
              key={v.id}
              onClick={() => onSelect(selected === v.id ? null : v.id)}
              className={`group flex flex-col items-start gap-4 p-6 text-left transition-colors duration-300 ${
                selected === v.id ? "bg-white text-black" : "bg-black hover:bg-ink-900"
              }`}
            >
              <div className="flex w-full items-baseline justify-between">
                <span
                  className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
                    selected === v.id ? "text-black/50" : "text-ink-300"
                  }`}
                >
                  #{v.id}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
                  {v.state === "Active" && v.overdue ? "Overdue" : v.state}
                </span>
              </div>

              <div className="font-mono text-3xl tabular-nums">
                <CardClock vault={v} />
              </div>

              <div
                className={`font-mono text-[10px] uppercase tracking-wider ${
                  selected === v.id ? "text-black/50" : "text-ink-300"
                }`}
              >
                tag {v.heartbeatTag} · {v.willAttested ? "sealed" : "unsealed"} · guardians {v.guardians}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * The headline number on a vault card, ticking live.
 *
 * Active vaults count down to the next heartbeat; Dormant ones count down the
 * grace window, which is the number that actually decides whether the estate
 * is about to move.
 */
function CardClock({ vault }: { vault: any }) {
  const [now, setNow] = useState(() => Date.now() / 1000);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => {
    if (s <= 0) return "0s";
    const d = Math.floor(s / 86_400);
    const h = Math.floor((s % 86_400) / 3_600);
    const m = Math.floor((s % 3_600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${String(Math.floor(s % 60)).padStart(2, "0")}s`;
  };

  // Settled = distribution verified on-chain; the XRP moves only when broadcast.
  if (vault.state === "Settled") {
    let paid = false;
    try {
      paid = localStorage.getItem(`heirloom:distributed:${vault.id}`) === "1";
    } catch {
      /* private browsing */
    }
    return <>{paid ? "PAID" : "SETTLED"}</>;
  }
  if (vault.state === "Revoked") return <>CLOSED</>;
  if (vault.state === "Executing") return <>EXECUTING</>;
  if (vault.state === "Dormant") {
    const graceLeft = vault.dormantSince + vault.graceWindow - now;
    return <>{graceLeft > 0 ? fmt(graceLeft) : "READY"}</>;
  }
  // Counts down to the heartbeat, then counts up past it.
  const dueAt = vault.lastHeartbeat + vault.heartbeatInterval;
  const overdueBy = now - dueAt;
  if (vault.overdue || overdueBy > 0) return <span title="overdue by">+{fmt(overdueBy)}</span>;
  return <>{fmt(dueAt - now)}</>;
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
        active ? "border-white bg-white text-black" : "border-ink-700 text-ink-300 hover:border-white hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10 border border-ink-700 p-6 text-sm leading-relaxed text-ink-200">{children}</div>
  );
}

function ConnectButton({ wallet }: { wallet: ReturnType<typeof useWallet> }) {
  if (!wallet.available) {
    return (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noreferrer"
        className="btn px-4 py-2"
      >
        Get a wallet
      </a>
    );
  }

  if (wallet.address) {
    return (
      <button className="btn px-4 py-2" onClick={wallet.disconnect} title={wallet.address}>
        {wallet.onCoston2 ? "" : "⚠ "}
        {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
      </button>
    );
  }

  return (
    <button className="btn btn-solid px-4 py-2" disabled={wallet.connecting} onClick={wallet.connect}>
      {wallet.connecting ? "Connecting…" : "Connect wallet"}
    </button>
  );
}
