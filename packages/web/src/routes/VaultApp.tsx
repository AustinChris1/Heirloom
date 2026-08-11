import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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

  // Closed vaults stay on-chain forever, but showing them clutters the list —
  // especially after a round of testing. Hidden by default, revealable.
  const [showClosed, setShowClosed] = useState(false);
  const allVaults = chain?.vaults ?? [];
  const closedCount = allVaults.filter((v) => v.state === "Revoked" || v.state === "Settled").length;
  const vaults = showClosed
    ? allVaults
    : allVaults.filter((v) => v.state !== "Revoked" && v.state !== "Settled");
  const mine = wallet.address
    ? vaults.filter((v) => v.owner.toLowerCase() === wallet.address!.toLowerCase())
    : [];
  const shown = selected !== null ? vaults.find((v) => v.id === selected) : undefined;

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
                empty="No vaults registered yet. Create the first one."
              />

              {closedCount > 0 && (
                <button
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300 underline-offset-4 hover:text-white hover:underline"
                  onClick={() => setShowClosed((s) => !s)}
                >
                  {showClosed ? "Hide" : "Show"} {closedCount} closed vault{closedCount === 1 ? "" : "s"}
                </button>
              )}

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
                <span className="font-mono text-[11px] uppercase tracking-[0.16em]">{v.state}</span>
              </div>

              <div className="font-mono text-3xl tabular-nums">
                {v.overdue ? "OVERDUE" : `${v.daysUntilDue.toFixed(1)}d`}
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
