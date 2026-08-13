/**
 * Live Coston2 deployment. Mirrors packages/contracts/deployments/coston2.json.
 * Set VITE_HEIRLOOM_VAULT to point the demo at a different deployment.
 */
export const HEIRLOOM_VAULT =
  (import.meta.env.VITE_HEIRLOOM_VAULT as string | undefined) ??
  "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";

export const EXPLORER = "https://coston2-explorer.flare.network";

/**
 * The XRPL account every heartbeat is sent to. The contract stores only its
 * hash, so the readable address is carried here, it must match what
 * `configureBeacon` was called with, or heartbeats will not verify.
 */
export const BEACON_XRPL_ADDRESS = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
export const BEACON_ADDRESS_HASH = "0x22b55aa701468fed59df32fa0b7c86a7d73469e97c06f7ce24777c9433be13f6";
export const HEARTBEAT_DROPS = 1000n;
export const XRPL_TESTNET_EXPLORER = "https://testnet.xrpl.org";

/**
 * The compiled ABI, generated from the deployed contract by
 * `packages/contracts/scripts/export-abi.ts`.
 *
 * This used to be a hand-written human-readable ABI, which silently omitted
 * `proveLife` and `claimDormancy` — their FDC proof arguments are deeply nested
 * tuples, and `getFunction` simply returned null at runtime. Generating it
 * removes that whole class of bug. Re-run the export after changing the
 * contract.
 */
export { default as VAULT_ABI } from "./HeirloomVault.abi.json";

export const STATE_NAMES = ["None", "Active", "Dormant", "Executing", "Settled", "Revoked"] as const;
