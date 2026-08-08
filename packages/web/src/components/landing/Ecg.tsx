import { MotionValue, useTransform } from "framer-motion";
import { motion } from "framer-motion";

/**
 * Builds an ECG trace whose beat amplitude is a parameter.
 *
 * At amplitude 1 it beats; at 0 it is a flat line. Driving that parameter from
 * scroll position is the page's central gesture — the reader's own scrolling is
 * what kills the signal, which is exactly what the product detects.
 */
export function ecgPath(amplitude: number, width = 1200, height = 200, beats = 6): string {
  const mid = height / 2;
  const span = width / beats;
  const a = Math.max(0, Math.min(1, amplitude));

  let d = `M0 ${mid}`;
  for (let i = 0; i < beats; i++) {
    const x = i * span;
    // Flat lead-in, then P-QRS-T, then flat lead-out.
    d += ` H${x + span * 0.3}`;
    d += ` L${x + span * 0.36} ${mid - 8 * a}`;
    d += ` L${x + span * 0.42} ${mid}`;
    d += ` L${x + span * 0.48} ${mid + 14 * a}`;
    d += ` L${x + span * 0.54} ${mid - 62 * a}`;
    d += ` L${x + span * 0.6} ${mid + 26 * a}`;
    d += ` L${x + span * 0.66} ${mid}`;
    d += ` L${x + span * 0.78} ${mid - 12 * a}`;
    d += ` L${x + span * 0.86} ${mid}`;
  }
  d += ` H${width}`;
  return d;
}

export function Ecg({
  progress,
  className = "",
  beats = 6,
  strokeWidth = 2,
}: {
  /** 0 = fully beating, 1 = flatlined. */
  progress: MotionValue<number>;
  className?: string;
  beats?: number;
  strokeWidth?: number;
}) {
  const d = useTransform(progress, (p) => ecgPath(1 - p, 1200, 200, beats));
  const opacity = useTransform(progress, [0, 0.85, 1], [1, 0.6, 0.25]);

  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <motion.path
        d={d}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
        style={{ opacity }}
      />
    </svg>
  );
}

/** Self-running trace for the hero, where there is no scroll to drive it yet. */
export function EcgLive({ className = "", beats = 8 }: { className?: string; beats?: number }) {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <motion.path
        d={ecgPath(1, 1200, 200, beats)}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
    </svg>
  );
}
