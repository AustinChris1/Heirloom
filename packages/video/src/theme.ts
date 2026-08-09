/**
 * Shared design tokens.
 *
 * These mirror the web app exactly so the rendered segments cut against the
 * screen recording without a visible seam — same monochrome ramp, same
 * typographic weight, same easing.
 */

export const BLACK = "#000000";
export const WHITE = "#ffffff";

export const INK = {
  900: "#0a0a0a",
  800: "#141414",
  700: "#1f1f1f",
  500: "#454545",
  400: "#6b6b6b",
  300: "#949494",
  200: "#c4c4c4",
  100: "#e4e4e4",
} as const;

export const DISPLAY = '"Archivo Black", Haettenschweiler, Impact, Anton, sans-serif';
export const SANS = 'Inter, "SF Pro Text", -apple-system, "Segoe UI", sans-serif';
export const MONO = 'ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace';

/** The web app's easing curve, as a cubic-bezier for Remotion springs/interpolations. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export const FPS = 30;
