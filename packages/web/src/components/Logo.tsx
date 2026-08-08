import { motion } from "framer-motion";

/**
 * The Heirloom mark.
 *
 * A seal — the oldest instrument of inheritance — crossed by a cardiac pulse
 * that beats once and then goes flat. The whole product in one glyph: a life
 * signal, its ending, and the sealed instrument that outlives it.
 *
 * Monochrome by construction: strokes inherit `currentColor`, so the mark works
 * on either ground without a second asset.
 */

/** Beats once on the left, flat from the centre out. */
const PULSE_PATH = "M3 24 H15 L18 24 L21 11 L25 37 L28 24 L31 24 H45";

export function LogoMark({
  size = 40,
  className = "",
  animate = false,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Heirloom"
    >
      {/* The seal */}
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <circle
        cx="24"
        cy="24"
        r="16.5"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeDasharray="1.5 3"
        opacity="0.5"
      />

      {/* The pulse, clipped to the seal so it reads as struck into it */}
      {animate ? (
        <motion.path
          d={PULSE_PATH}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : (
        <path
          d={PULSE_PATH}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      )}
    </svg>
  );
}

export function Logo({
  size = 32,
  className = "",
  animate = false,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={size} animate={animate} />
      <span
        className="font-black uppercase leading-none tracking-crush"
        style={{ fontSize: size * 0.62 }}
      >
        Heirloom
      </span>
    </div>
  );
}
