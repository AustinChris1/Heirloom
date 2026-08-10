import { Contract, JsonRpcProvider, formatUnits } from "ethers";
import { HEIRLOOM_VAULT, STATE_NAMES, VAULT_ABI } from "./deployment";

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

  // Read the most recent few vaults straight from the deployed contract.
  const count = Number(vaultCount);
  const ids = Array.from({ length: Math.min(count, 12) }, (_, i) => count - 1 - i).filter((i) => i >= 0);

  const vaults = await Promise.all(
    ids.map(async (id): Promise<LiveVault> => {
      const [v, tag, dueIn, overdue, canExecute] = await Promise.all([
        vaultContract.vaults(id),
        vaultContract.heartbeatTag(id) as Promise<bigint>,
        vaultContract.timeUntilHeartbeatDue(id) as Promise<bigint>,
        vaultContract.isHeartbeatOverdue(id) as Promise<boolean>,
        vaultContract.canExecute(id) as Promise<boolean>,
      ]);
      return {
        id,
        owner: v.owner,
        state: STATE_NAMES[Number(v.state)] ?? "Unknown",
        heartbeatTag: Number(tag),
        lastHeartbeat: Number(v.lastHeartbeat),
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
