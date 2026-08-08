import { Contract, JsonRpcProvider, formatUnits } from "ethers";

export const COSTON2_RPC = "https://coston2-api.flare.network/ext/C/rpc";
export const FTSO_V2 = "0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d";
export const FLARE_TEE_MANAGER = "0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE";
export const XRP_USD_FEED_ID = "0x015852502f55534400000000000000000000000000";

const provider = new JsonRpcProvider(COSTON2_RPC);

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

export interface ChainSnapshot {
  blockNumber: number;
  xrpUsdPriceE18: bigint;
  xrpUsdDisplay: string;
  feedTimestamp: number;
  registeredExtensions: number;
}

/** Reads live Coston2 state. Everything here is a real on-chain read. */
export async function readChain(): Promise<ChainSnapshot> {
  const [blockNumber, feed, nextId] = await Promise.all([
    provider.getBlockNumber(),
    ftso.getFeedByIdInWei(XRP_USD_FEED_ID) as Promise<[bigint, bigint]>,
    teeRegistry.nextPublicExtensionId().catch(() => 0n) as Promise<bigint>,
  ]);

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
  };
}
