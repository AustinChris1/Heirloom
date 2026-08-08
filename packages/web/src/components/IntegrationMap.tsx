const INTEGRATIONS = [
  {
    protocol: "FDC",
    surface: "XRPPayment · 0x08",
    role: "Proof of life",
    why: "Turns an XRPL dust payment into an on-chain fact. Checked against the estate's own source address so nobody can keep a dead holder's vault alive on their behalf.",
  },
  {
    protocol: "FDC",
    surface: "XRPPaymentNonexistence · 0x09",
    role: "Proof of silence",
    why: "Proves a negative — that no tagged heartbeat exists in an entire ledger range. This is the dead-man's switch itself, and it is the only attestation type that can express it.",
  },
  {
    protocol: "FCC",
    surface: "TEE extension · HEIRLOOM",
    role: "The sealed will",
    why: "Decrypts the will, allocates the estate, and signs XRPL payments inside hardware isolation. The chain verifies the enclave's signature; it never sees a beneficiary.",
  },
  {
    protocol: "FTSO",
    surface: "XRP/USD block-latency feed",
    role: "Fiat-denominated bequests",
    why: "Lets a will say \"$50,000 to my daughter\" instead of a drop count fixed years earlier. The settlement price is re-checked on-chain against the live feed before it is accepted.",
  },
  {
    protocol: "FAssets",
    surface: "FXRP",
    role: "Optional delivery rail",
    why: "A beneficiary may elect to receive FXRP on Flare instead of native XRP, landing them directly in XRPFi rather than on a ledger they have never used.",
  },
];

export function IntegrationMap() {
  return (
    <div className="integrations">
      {INTEGRATIONS.map((item) => (
        <div className="integration" key={`${item.protocol}-${item.surface}`}>
          <div className="int-head">
            <span className={`chip chip-${item.protocol.toLowerCase()}`}>{item.protocol}</span>
            <span className="int-role">{item.role}</span>
          </div>
          <code className="int-surface">{item.surface}</code>
          <p>{item.why}</p>
        </div>
      ))}
    </div>
  );
}
