/**
 * Live Coston2 protocol addresses.
 *
 * FdcVerification, FtsoV2 and FdcHub are resolved on-chain through
 * `ContractRegistry` and are listed here only for scripts and documentation.
 *
 * The FCC registries are the `FlareTeeManager` diamond: `TeeExtensionRegistry`
 * and `TeeMachineRegistry` are facets of the same contract, so both constructor
 * arguments take the same address.
 */
export const COSTON2 = {
  chainId: 114,
  rpc: "https://coston2-api.flare.network/ext/C/rpc",
  explorer: "https://coston2-explorer.flare.network",

  flareTeeManager: "0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE",
  fdcVerification: "0x906507E0B64bcD494Db73bd0459d1C667e14B933",
  fdcHub: "0x48aC463d7975828989331F4De43341627b9c5f1D",
  ftsoV2: "0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d",
  relay: "0xa10B672D1c62e5457b17af63d4302add6A99d7dE",
} as const;

/** FDC protocol id, used with `Relay.isFinalized`. */
export const FDC_PROTOCOL_ID = 200;

/** FTSO XRP/USD feed id. */
export const XRP_USD_FEED_ID = "0x015852502f55534400000000000000000000000000";
