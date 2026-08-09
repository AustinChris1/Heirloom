import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BLACK, DISPLAY, INK, MONO, WHITE } from "./theme";

/**
 * Closing slate, 7 seconds — the deployment facts a judge needs to verify the
 * claims, held still long enough to read or pause on.
 */
const FACTS: Array<[string, string]> = [
  ["HeirloomVault", "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A"],
  ["FCC extension", "66025 — vault is its own InstructionSender"],
  ["TEE machine", "0xb1c6…E60c · status 2 (PRODUCTION)"],
  ["Attestations", "XRPPayment 0x08 · XRPPaymentNonexistence 0x09"],
  ["Tests", "65 passing"],
];

export function Closing() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const mark = spring({ frame, fps, config: { damping: 200 } });
  const head = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        opacity: fadeOut,
        padding: "0 140px",
        justifyContent: "center",
      }}
    >
      {/* The mark: a seal crossed by a pulse that beats once, then flatlines. */}
      <svg width={110} height={110} viewBox="0 0 48 48" fill="none" style={{ opacity: mark, marginBottom: 56 }}>
        <circle cx="24" cy="24" r="21" stroke={WHITE} strokeWidth="1.5" opacity="0.35" />
        <circle cx="24" cy="24" r="16.5" stroke={WHITE} strokeWidth="0.75" strokeDasharray="1.5 3" opacity="0.5" />
        <path
          d="M3 24 H15 L18 24 L21 11 L25 37 L28 24 L31 24 H45"
          stroke={WHITE}
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>

      <div style={{ overflow: "hidden" }}>
        <h2
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 150,
            lineHeight: 0.86,
            letterSpacing: "-0.055em",
            textTransform: "uppercase",
            color: WHITE,
            margin: 0,
            maxWidth: "16ch",
            transform: `translateY(${(1 - head) * 100}%)`,
          }}
        >
          Nobody sees the will.
        </h2>
      </div>

      <div style={{ marginTop: 70, borderTop: `1px solid ${INK[800]}` }}>
        {FACTS.map(([label, value], i) => {
          const appear = spring({ frame: frame - 30 - i * 7, fps, config: { damping: 200 } });
          return (
            <div
              key={label}
              style={{
                display: "flex",
                gap: 48,
                padding: "20px 0",
                borderBottom: `1px solid ${INK[800]}`,
                opacity: appear,
                transform: `translateY(${(1 - appear) * 12}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 20,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: INK[400],
                  width: 280,
                  flexShrink: 0,
                }}
              >
                {label}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 24, color: WHITE }}>{value}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
