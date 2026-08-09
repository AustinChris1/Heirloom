import { useCurrentFrame } from "remotion";
import { WHITE } from "./theme";

/**
 * The same ECG trace the landing page draws, ported to Remotion.
 *
 * Amplitude is a parameter so the caller can flatline it over time — the
 * product's own mechanic, reused as the video's visual motif.
 */
export function ecgPath(amplitude: number, width = 1920, height = 300, beats = 6): string {
  const mid = height / 2;
  const span = width / beats;
  const a = Math.max(0, Math.min(1, amplitude));

  let d = `M0 ${mid}`;
  for (let i = 0; i < beats; i++) {
    const x = i * span;
    d += ` H${x + span * 0.3}`;
    d += ` L${x + span * 0.36} ${mid - 12 * a}`;
    d += ` L${x + span * 0.42} ${mid}`;
    d += ` L${x + span * 0.48} ${mid + 21 * a}`;
    d += ` L${x + span * 0.54} ${mid - 93 * a}`;
    d += ` L${x + span * 0.6} ${mid + 39 * a}`;
    d += ` L${x + span * 0.66} ${mid}`;
    d += ` L${x + span * 0.78} ${mid - 18 * a}`;
    d += ` L${x + span * 0.86} ${mid}`;
  }
  return d + ` H${width}`;
}

export function Ecg({
  amplitude,
  opacity = 1,
  strokeWidth = 3,
  beats = 6,
  /** When set, the trace draws itself in over this many frames. */
  drawInFrames,
}: {
  amplitude: number;
  opacity?: number;
  strokeWidth?: number;
  beats?: number;
  drawInFrames?: number;
}) {
  const frame = useCurrentFrame();
  const d = ecgPath(amplitude, 1920, 300, beats);

  // Dash-offset draw-on. Length is approximate; the path is mostly horizontal
  // so the viewBox width is a close enough upper bound.
  const total = 2400;
  const drawn = drawInFrames ? Math.min(1, frame / drawInFrames) : 1;

  return (
    <svg
      viewBox="0 0 1920 300"
      preserveAspectRatio="none"
      fill="none"
      style={{ width: "100%", height: "100%", opacity }}
    >
      <path
        d={d}
        stroke={WHITE}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeDasharray={drawInFrames ? total : undefined}
        strokeDashoffset={drawInFrames ? total * (1 - drawn) : undefined}
      />
    </svg>
  );
}
