import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * The DA Layer and XRPL's JSON-RPC send no `Access-Control-Allow-Origin`, so a
 * browser cannot call them directly. Both are proxied instead: same-origin to
 * the page, forwarded server-side. These paths mirror the rewrites in the root
 * vercel.json, so dev and production resolve identically.
 *
 * Proxying XRPL also keeps xrpl.js (~1 MB) out of the bundle — the app only
 * needs two read-only ledger queries.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // The demo runs the same allocation engine the enclave runs, rather than a
      // reimplementation — what you see previewed is what the TEE would compute.
      "@heirloom/extension": path.resolve(__dirname, "../extension/src"),
    },
  },
  server: {
    port: 5173,
    // Repo root, so `?raw` imports of docs/*.md and the root README resolve.
    fs: { allow: [path.resolve(__dirname, "../..")] },
    proxy: {
      "/da": {
        target: "https://ctn2-data-availability.flare.network",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/da/, ""),
      },
      "/xrpl": {
        target: "https://s.altnet.rippletest.net:51234",
        changeOrigin: true,
        secure: true,
        rewrite: () => "/",
      },
    },
  },
});
