import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BLACK, DISPLAY, INK, MONO, WHITE } from "./theme";

/**
 * The four-stage lifecycle, 12 seconds — one stage every three.
 *
 * This is the segment worth rendering rather than screen-recording: the four
 * stages are the mental model a judge needs, and a scroll-through of the
 * website never holds any one of them still long enough to read.
 */
const STAGES = [
  { n: "01", title: "Seal", proof: "FCC · HEIRLOOM/SEAL", body: "Your will is encrypted to the enclave before it leaves your browser. Flare stores only a hash." },
  { n: "02", title: "Live", proof: "FDC · XRPPayment 0x08", body: "A dust payment on the XRP Ledger, tagged to your vault. That is your heartbeat." },
  { n: "03", title: "Silence", proof: "FDC · XRPPaymentNonexistence 0x09", body: "An attestation proves no tagged heartbeat arrived across the whole interval." },
  { n: "04", title: "Distribute", proof: "FCC · TEE-signed settlement", body: "Only after the grace window does the enclave open the will, price it, and sign the payments." },
];

const PER_STAGE = 90; // 3 seconds at 30fps

export function Lifecycle() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const index = Math.min(STAGES.length - 1, Math.floor(frame / PER_STAGE));
  const local = frame - index * PER_STAGE;
  const stage = STAGES[index];

  const enter = spring({ frame: local, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK, opacity: fadeOut, padding: "0 140px", justifyContent: "center" }}>
      {/* progress rail */}
      <div style={{ display: "flex", gap: 12, marginBottom: 70 }}>
        {STAGES.map((_, i) => (
          <div
            key={i}
            style={{
              height: 2,
              flex: 1,
              backgroundColor: i < index ? WHITE : i === index ? INK[300] : INK[800],
            }}
          >
            {i === index && (
              <div style={{ height: 2, width: `${(local / PER_STAGE) * 100}%`, backgroundColor: WHITE }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.2em", color: INK[400] }}>{stage.n}</span>
        <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: "0.14em", color: INK[400], textTransform: "uppercase" }}>
          {stage.proof}
        </span>
      </div>

      <div style={{ overflow: "hidden", marginTop: 24 }}>
        <h2
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 200,
            lineHeight: 0.85,
            letterSpacing: "-0.055em",
            textTransform: "uppercase",
            color: WHITE,
            margin: 0,
            transform: `translateY(${(1 - enter) * 100}%)`,
          }}
        >
          {stage.title}
        </h2>
      </div>

      <p
        style={{
          fontFamily: MONO,
          fontSize: 30,
          lineHeight: 1.5,
          color: INK[200],
          maxWidth: "62ch",
          marginTop: 44,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 20}px)`,
        }}
      >
        {stage.body}
      </p>

      {index === 3 && (
        <p
          style={{
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: INK[400],
            marginTop: 40,
            opacity: interpolate(local, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          One is irreversible
        </p>
      )}
    </AbsoluteFill>
  );
}
