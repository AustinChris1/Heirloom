import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      // Flare periphery contracts require the Cancun EVM target.
      evmVersion: "cancun",
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    coston2: {
      url: process.env.COSTON2_RPC ?? "https://coston2-api.flare.network/ext/C/rpc",
      chainId: 114,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    flare: {
      url: process.env.FLARE_RPC ?? "https://flare-api.flare.network/ext/C/rpc",
      chainId: 14,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      coston2: "empty",
    },
    customChains: [
      {
        network: "coston2",
        chainId: 114,
        urls: {
          apiURL: "https://coston2-explorer.flare.network/api",
          browserURL: "https://coston2-explorer.flare.network",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
  },
};

export default config;
