import { Contract, JsonRpcProvider, formatUnits } from "ethers";
import { HEIRLOOM_VAULT, STATE_NAMES, VAULT_ABI } from "./deployment";

/** Vault destination tags are allocated from this base (HeirloomVault.TAG_BASE). */
const TAG_BASE = 700_000_000;
/** How many of the most recent vaults the list reads. Older ones stay on-chain. */
export const MAX_VAULTS = 40;

export const COSTON2_RPC = "https://coston2-api.flare.network/ext/C/rpc";
export const FTSO_V2 = "0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d";
export const FLARE_TEE_MANAGER = "0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE";
export const XRP_USD_FEED_ID = "0x015852502f55534400000000000000000000000000";

const provider = new JsonRpcProvider(COSTON2_RPC);

const vaultContract = new Contract(HEIRLOOM_VAULT, VAULT_ABI, provider);

const ftso = new Contract(
  FTSO_V2,
  ["function getFeedByIdInWei(bytes21) view returns (uint256, uint64)"],
  provider,
);

const teeRegistry = new Contract(
  FLARE_TEE_MANAGER,
  ["function nextPublicExtensionId() view returns (uint256)"],
  provider,
);

export interface LiveVault {
  id: number;
  owner: string;
  state: string;
  heartbeatTag: number;
  lastHeartbeat: number;
  /** Seconds of silence before dormancy may be claimed — with lastHeartbeat, gives the due time. */
  heartbeatInterval: number;
  daysUntilDue: number;
  overdue: boolean;
  willAttested: boolean;
  guardians: string;
  guardianApprovals: number;
  guardianThreshold: number;
  willCommitment: string;
  dormantSince: number;
  graceWindow: number;
  /** Contract view: dormant + attested + grace elapsed + guardians satisfied. */
  canExecute: boolean;
  /** Unix seconds when this snapshot was read, so countdowns stay true between refreshes. */
  readAt: number;
}

export interface ChainSnapshot {
  blockNumber: number;
  xrpUsdPriceE18: bigint;
  xrpUsdDisplay: string;
  feedTimestamp: number;
  registeredExtensions: number;
  vaultCount: number;
  vaults: LiveVault[];
}

/** Reads live Coston2 state. Everything here is a real on-chain read. */
export async function readChain(): Promise<ChainSnapshot> {
  const [blockNumber, feed, nextId, vaultCount] = await Promise.all([
    provider.getBlockNumber(),
    ftso.getFeedByIdInWei(XRP_USD_FEED_ID) as Promise<[bigint, bigint]>,
    teeRegistry.nextPublicExtensionId().catch(() => 0n) as Promise<bigint>,
    vaultContract.vaultCount().catch(() => 0n) as Promise<bigint>,
  ]);

  // One call per vault: the tag, countdown and executability are all derivable
  // from the struct, which keeps the poll cheap on a public RPC.
  const count = Number(vaultCount);
  const ids = Array.from({ length: Math.min(count, MAX_VAULTS) }, (_, i) => count - 1 - i).filter((i) => i >= 0);
  const now = Math.floor(Date.now() / 1000);

  const vaults = await Promise.all(
    ids.map(async (id): Promise<LiveVault> => {
      const v = await vaultContract.vaults(id);

      const state = STATE_NAMES[Number(v.state)] ?? "Unknown";
      const dueAt = Number(v.lastHeartbeat) + Number(v.heartbeatInterval);
      const overdue = state === "Active" && now >= dueAt;
      const dueIn = BigInt(Math.max(0, dueAt - now));
      const tag = BigInt(TAG_BASE + id);
      const canExecute =
        state === "Dormant" &&
        v.willAttested &&
        now >= Number(v.dormantSince) + Number(v.graceWindow) &&
        Number(v.guardianApprovals) >= Number(v.guardianThreshold);
      return {
        id,
        owner: v.owner,
        state,
        heartbeatTag: Number(tag),
        lastHeartbeat: Number(v.lastHeartbeat),
        heartbeatInterval: Number(v.heartbeatInterval),
        daysUntilDue: Number(dueIn) / 86_400,
        overdue,
        willAttested: v.willAttested,
        guardians: `${v.guardianApprovals}/${v.guardianThreshold}`,
        guardianApprovals: Number(v.guardianApprovals),
        guardianThreshold: Number(v.guardianThreshold),
        willCommitment: v.willCommitment,
        dormantSince: Number(v.dormantSince),
        graceWindow: Number(v.graceWindow),
        canExecute,
        readAt: Math.floor(Date.now() / 1000),
      };
    }),
  );

  const [priceE18, ts] = feed;
  return {
    blockNumber,
    xrpUsdPriceE18: priceE18,
    xrpUsdDisplay: Number(formatUnits(priceE18, 18)).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
    }),
    feedTimestamp: Number(ts),
    registeredExtensions: nextId > 0x10000n ? Number(nextId - 0x10000n) : 0,
    vaultCount: count,
    vaults,
  };
}
