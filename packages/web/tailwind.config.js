/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Strictly monochrome. No hue anywhere — contrast and weight do all the work.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000000",
      white: "#ffffff",
      ink: {
        900: "#0a0a0a",
        800: "#141414",
        700: "#1f1f1f",
        600: "#2e2e2e",
        500: "#454545",
        400: "#6b6b6b",
        300: "#949494",
        200: "#c4c4c4",
        100: "#e4e4e4",
        50: "#f4f4f4",
      },
    },
    extend: {
      fontFamily: {
        display: ["Archivo Black", "Haettenschweiler", "Impact", "Anton", "sans-serif"],
        sans: ["Inter", "SF Pro Text", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SF Mono", "Cascadia Mono", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.055em",
        crush: "-0.07em",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
