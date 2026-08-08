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
 * hash, so the readable address is carried here — it must match what
 * `configureBeacon` was called with, or heartbeats will not verify.
 */
export const BEACON_XRPL_ADDRESS = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
export const BEACON_ADDRESS_HASH = "0x22b55aa701468fed59df32fa0b7c86a7d73469e97c06f7ce24777c9433be13f6";
export const HEARTBEAT_DROPS = 1000n;
export const XRPL_TESTNET_EXPLORER = "https://testnet.xrpl.org";

export const VAULT_ABI = [
  "function vaultCount() view returns (uint256)",
  "function heartbeatDrops() view returns (uint256)",
  "function beaconAddressHash() view returns (bytes32)",
  "function heartbeatTag(uint256) pure returns (uint32)",
  "function xrpUsdPrice() view returns (uint256, uint64)",
  "function timeUntilHeartbeatDue(uint256) view returns (uint64)",
  "function isHeartbeatOverdue(uint256) view returns (bool)",
  "function canExecute(uint256) view returns (bool)",
  "function vaults(uint256) view returns (address owner, bytes32 xrplAccountHash, uint64 heartbeatInterval, uint64 lastHeartbeat, uint64 graceWindow, uint64 dormantSince, bytes32 willCommitment, bool willAttested, uint32 guardianThreshold, uint32 guardianApprovals, uint8 state)",
] as const;

export const STATE_NAMES = ["None", "Active", "Dormant", "Executing", "Settled", "Revoked"] as const;
