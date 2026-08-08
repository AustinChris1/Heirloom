import { BequestKind, Will } from "@heirloom/extension/will";

const KIND_LABEL: Record<BequestKind, string> = {
  FIXED_USD: "US$",
  FIXED_XRP: "XRP",
  SHARE_BPS: "% of remainder",
};

function displayAmount(kind: BequestKind, amount: string): string {
  const value = BigInt(amount || "0");
  if (kind === "FIXED_USD") return (Number(value) / 100).toString();
  if (kind === "FIXED_XRP") return (Number(value) / 1_000_000).toString();
  return (Number(value) / 100).toString();
}

function toRawAmount(kind: BequestKind, display: string): string {
  const value = Number(display);
  if (!Number.isFinite(value) || value < 0) return "0";
  if (kind === "FIXED_USD") return Math.round(value * 100).toString();
  if (kind === "FIXED_XRP") return Math.round(value * 1_000_000).toString();
  return Math.round(value * 100).toString();
}

export function WillEditor({
  will,
  estateXrp,
  onWillChange,
  onEstateChange,
}: {
  will: Will;
  estateXrp: number;
  onWillChange: (w: Will) => void;
  onEstateChange: (v: number) => void;
}) {
  const update = (i: number, patch: Partial<Will["bequests"][number]>) => {
    const bequests = will.bequests.map((b, idx) => (idx === i ? { ...b, ...patch } : b));
    onWillChange({ ...will, bequests });
  };

  return (
    <div className="card">
      <h3>The will</h3>

      <label className="field">
        <span>Estate holdings</span>
        <div className="inline">
          <input
            type="number"
            value={estateXrp}
            min={0}
            step={1000}
            onChange={(e) => onEstateChange(Number(e.target.value))}
          />
          <span className="unit">XRP</span>
        </div>
      </label>

      <div className="bequests">
        {will.bequests.map((bequest, i) => (
          <div className="bequest" key={i}>
            <div className="bequest-head">
              <code title={bequest.beneficiary}>{bequest.beneficiary.slice(0, 12)}…</code>
              <select
                value={bequest.kind}
                onChange={(e) => {
                  const kind = e.target.value as BequestKind;
                  update(i, { kind, amount: toRawAmount(kind, displayAmount(bequest.kind, bequest.amount)) });
                }}
              >
                <option value="FIXED_USD">US$</option>
                <option value="FIXED_XRP">XRP</option>
                <option value="SHARE_BPS">% of remainder</option>
              </select>
            </div>
            <div className="inline">
              <input
                type="number"
                value={displayAmount(bequest.kind, bequest.amount)}
                min={0}
                onChange={(e) => update(i, { amount: toRawAmount(bequest.kind, e.target.value) })}
              />
              <span className="unit">{KIND_LABEL[bequest.kind]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="residuary">
        <span>Residue to</span>
        <code title={will.residuaryBeneficiary}>{will.residuaryBeneficiary.slice(0, 16)}…</code>
      </div>

      <p className="hint">
        Try setting the dollar bequest above the estate's total value — the engine abates the fixed bequests
        proportionally rather than paying the first beneficiary in full and leaving the rest nothing.
      </p>
    </div>
  );
}
