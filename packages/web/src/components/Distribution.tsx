import { AllocationResult } from "@heirloom/extension/allocate";

const SOURCE_LABEL: Record<string, string> = {
  FIXED_USD: "fixed · US$",
  FIXED_XRP: "fixed · XRP",
  SHARE_BPS: "share",
  RESIDUE: "residue",
};

function xrp(drops: bigint): string {
  return (Number(drops) / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function usd(drops: bigint, priceE18: bigint): string {
  const value = (Number(drops) / 1_000_000) * (Number(priceE18) / 1e18);
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function Distribution({
  result,
  error,
  priceE18,
  commitment,
}: {
  result: AllocationResult | null;
  error: string | null;
  priceE18: bigint | null;
  commitment: string | null;
}) {
  return (
    <div className="card">
      <h3>What the enclave would sign</h3>

      {error && <div className="error">Will cannot be executed — {error}</div>}

      {result && priceE18 && (
        <>
          {result.abatementApplied && (
            <div className="notice">
              The estate cannot cover every fixed bequest. Each has been abated proportionally, preserving the
              ratios the testator wrote.
            </div>
          )}

          <table className="dist">
            <thead>
              <tr>
                <th>Beneficiary</th>
                <th>Clause</th>
                <th className="num">XRP</th>
                <th className="num">Value</th>
              </tr>
            </thead>
            <tbody>
              {result.allocations.map((a, i) => (
                <tr key={i} className={a.abated ? "abated" : ""}>
                  <td>
                    <code title={a.beneficiary}>{a.beneficiary.slice(0, 14)}…</code>
                  </td>
                  <td>
                    <span className="clause">{SOURCE_LABEL[a.source]}</span>
                  </td>
                  <td className="num">{xrp(a.drops)}</td>
                  <td className="num dim">{usd(a.drops, priceE18)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <dl className="totals">
            <div>
              <dt>Distributed</dt>
              <dd>{xrp(result.distributedDrops)} XRP</dd>
            </div>
            <div>
              <dt>Retained on ledger</dt>
              <dd>
                {xrp(result.retainedDrops)} XRP <span className="dim">reserve + fees</span>
              </dd>
            </div>
          </dl>
        </>
      )}

      {commitment && (
        <div className="commitment">
          <span>Will commitment stored on Flare</span>
          <code>{commitment}</code>
          <p className="hint">
            This is all the chain ever learns. Change any term above and it changes — which is exactly what stops a
            substituted will from settling.
          </p>
        </div>
      )}
    </div>
  );
}
