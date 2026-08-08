export type VaultState = "Active" | "Dormant" | "Executing" | "Settled";

const STEPS: Array<{
  state: VaultState;
  title: string;
  proof: string;
  detail: string;
}> = [
  {
    state: "Active",
    title: "Alive",
    proof: "FDC · XRPPayment (0x08)",
    detail:
      "The holder sends a dust payment to the Heirloom beacon carrying their vault's destination tag. Anyone may relay the proof — a holder who is alive but offline stays protected.",
  },
  {
    state: "Dormant",
    title: "Silent",
    proof: "FDC · XRPPaymentNonexistence (0x09)",
    detail:
      "An attestation proves that across an entire ledger range, no tagged heartbeat reached the beacon. This opens a grace window; it does not release anything.",
  },
  {
    state: "Executing",
    title: "Confirmed",
    proof: "Grace window + guardian threshold",
    detail:
      "The grace window elapses and guardians confirm. Guardians can only ever confirm — they cannot move funds, read the will, or alter a single term.",
  },
  {
    state: "Settled",
    title: "Distributed",
    proof: "FCC · TEE-signed distribution",
    detail:
      "The enclave decrypts the will, prices it against FTSO, and signs the XRPL payments. Flare verifies the signature and the commitment before recording the estate as settled.",
  },
];

export function Lifecycle({ state, onChange }: { state: VaultState; onChange: (s: VaultState) => void }) {
  const activeIndex = STEPS.findIndex((s) => s.state === state);

  return (
    <div className="lifecycle">
      <div className="track">
        {STEPS.map((step, i) => (
          <button
            key={step.state}
            className={`node ${i === activeIndex ? "current" : ""} ${i < activeIndex ? "done" : ""}`}
            onClick={() => onChange(step.state)}
            aria-current={i === activeIndex}
          >
            <span className="dot" />
            <span className="node-title">{step.title}</span>
            <span className="node-state">{step.state}</span>
          </button>
        ))}
      </div>

      <div className="step-detail">
        <div className="proof-tag">{STEPS[activeIndex].proof}</div>
        <p>{STEPS[activeIndex].detail}</p>
        {state === "Dormant" && (
          <p className="reversal">
            A single late heartbeat — or the owner's own transaction — returns this vault to Alive and clears every
            guardian approval.
          </p>
        )}
      </div>
    </div>
  );
}
