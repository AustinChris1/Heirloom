import { useEffect, useMemo, useState } from "react";
import { allocate, AllocationResult } from "@heirloom/extension/allocate";
import { Will, WillBequest, willCommitment } from "@heirloom/extension/will";
import { ChainSnapshot, readChain } from "./lib/chain";
import { Lifecycle, VaultState } from "./components/Lifecycle";
import { WillEditor } from "./components/WillEditor";
import { Distribution } from "./components/Distribution";
import { IntegrationMap } from "./components/IntegrationMap";

const ESTATE = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";

const INITIAL_WILL: Will = {
  vaultId: 0,
  estateAccount: ESTATE,
  bequests: [
    { beneficiary: "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w", kind: "FIXED_USD", amount: "5000000" },
    { beneficiary: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe", kind: "SHARE_BPS", amount: "6000" },
    { beneficiary: "rDNvpqSzJzk8wtHTUiTSHtdvJHhpzurwPP", kind: "SHARE_BPS", amount: "4000" },
  ],
  residuaryBeneficiary: "rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf",
};

export default function App() {
  const [chain, setChain] = useState<ChainSnapshot | null>(null);
  const [chainError, setChainError] = useState<string | null>(null);
  const [will, setWill] = useState<Will>(INITIAL_WILL);
  const [estateXrp, setEstateXrp] = useState(100_000);
  const [state, setState] = useState<VaultState>("Active");

  useEffect(() => {
    let cancelled = false;
    const tick = () =>
      readChain()
        .then((snapshot) => !cancelled && (setChain(snapshot), setChainError(null)))
        .catch((err) => !cancelled && setChainError(err.message));
    tick();
    const id = setInterval(tick, 5_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const estateDrops = useMemo(() => BigInt(Math.round(estateXrp)) * 1_000_000n, [estateXrp]);

  const { result, error } = useMemo((): { result: AllocationResult | null; error: string | null } => {
    if (!chain) return { result: null, error: null };
    try {
      return { result: allocate({ will, estateDrops, xrpUsdPriceE18: chain.xrpUsdPriceE18 }), error: null };
    } catch (err) {
      return { result: null, error: (err as Error).message };
    }
  }, [will, estateDrops, chain]);

  const commitment = useMemo(() => {
    try {
      return willCommitment(will);
    } catch {
      return null;
    }
  }, [will]);

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-text">
          <h1>Heirloom</h1>
          <p className="tagline">Confidential inheritance and programmable custody for native XRP.</p>
          <p className="sub">
            A trustless dead-man's switch. The will is sealed inside a Flare Confidential Compute enclave, the
            heartbeat is proven by the Flare Data Connector, and the XRP never leaves the XRP Ledger.
          </p>
        </div>
        <div className="chain-badge">
          <div className="badge-label">Coston2 · live</div>
          {chain ? (
            <>
              <div className="price">{chain.xrpUsdDisplay}</div>
              <div className="badge-meta">FTSO XRP/USD</div>
              <div className="badge-meta dim">block {chain.blockNumber.toLocaleString()}</div>
              <div className="badge-meta dim">{chain.registeredExtensions} FCC extensions registered</div>
            </>
          ) : (
            <div className="badge-meta">{chainError ? `offline — ${chainError}` : "connecting…"}</div>
          )}
        </div>
      </header>

      <section className="panel">
        <h2>1 · The vault lifecycle</h2>
        <p className="lede">
          Dormancy is a claim, not a verdict. Every path out of it is reversible by the one person who matters —
          right up until execution.
        </p>
        <Lifecycle state={state} onChange={setState} />
      </section>

      <section className="panel">
        <h2>2 · The sealed will</h2>
        <p className="lede">
          Written here, encrypted to the enclave's key, and never stored in the clear. Flare only ever holds the
          commitment below. Bequests may be denominated in dollars — the enclave prices them against the same FTSO
          feed shown above, at the moment of execution.
        </p>
        <div className="split">
          <WillEditor
            will={will}
            estateXrp={estateXrp}
            onWillChange={setWill}
            onEstateChange={setEstateXrp}
          />
          <Distribution
            result={result}
            error={error}
            priceE18={chain?.xrpUsdPriceE18 ?? null}
            commitment={commitment}
          />
        </div>
      </section>

      <section className="panel">
        <h2>3 · What Flare is doing</h2>
        <p className="lede">
          Four protocols, each carrying weight the others cannot. Remove any one and the product stops working.
        </p>
        <IntegrationMap />
      </section>

      <footer className="foot">
        <span>Flare Summer Signal · Interoperable Asset Products + Confidential Compute Apps</span>
        <span className="dim">
          The distribution preview runs the exact allocation engine that executes inside the TEE.
        </span>
      </footer>
    </div>
  );
}

export type { Will, WillBequest };
