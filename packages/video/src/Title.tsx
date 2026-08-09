import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Ecg } from "./Ecg";
import { BLACK, DISPLAY, INK, MONO, WHITE } from "./theme";

/**
 * Opening title. 6 seconds.
 *
 * The trace beats, the headline lands, then the trace flatlines under it —
 * stating the premise before a word is spoken.
 */
export function Title() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Beat for the first two seconds, then die.
  const amplitude = interpolate(frame, [fps * 2, fps * 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const markIn = spring({ frame, fps, config: { damping: 200 } });
  const line1 = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const line2 = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 40, fps, config: { damping: 200 } });

  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK, opacity: fadeOut }}>
      <AbsoluteFill style={{ justifyContent: "center", opacity: 0.5 }}>
        <div style={{ height: 300 }}>
          <Ecg amplitude={amplitude} beats={7} drawInFrames={fps * 2} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", padding: "0 140px" }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: INK[400],
            opacity: markIn,
            marginBottom: 40,
          }}
        >
          Flare Summer Signal · Coston2
        </div>

        <h1
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 190,
            lineHeight: 0.84,
            letterSpacing: "-0.055em",
            textTransform: "uppercase",
            color: WHITE,
            margin: 0,
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div style={{ transform: `translateY(${(1 - line1) * 100}%)` }}>Your keys</div>
          </div>
          <div style={{ overflow: "hidden", color: INK[500] }}>
            <div style={{ transform: `translateY(${(1 - line2) * 100}%)` }}>outlive you.</div>
          </div>
        </h1>

        <div
          style={{
            marginTop: 56,
            fontFamily: MONO,
            fontSize: 26,
            color: INK[200],
            opacity: sub,
            transform: `translateY(${(1 - sub) * 18}px)`,
          }}
        >
          Heirloom — confidential inheritance for native XRP
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
