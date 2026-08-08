import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

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
    fs: { allow: [path.resolve(__dirname, "..")] },
  },
});
