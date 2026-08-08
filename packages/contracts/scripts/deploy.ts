import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { COSTON2 } from "./coston2";

/**
 * Deploys HeirloomVault and configures the XRPL heartbeat beacon.
 *
 * Extension registration (`setExtensionId`) is deliberately not done here: it
 * requires the FCC extension to be registered against this contract address
 * first, which happens in the extension's own deploy flow.
 */

// XRPL testnet account all heartbeats are sent to. Override with HEIRLOOM_BEACON_ADDRESS.
const DEFAULT_BEACON_XRPL_ADDRESS = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
// 0.001 XRP — large enough to be unambiguous, small enough to send often.
const DEFAULT_HEARTBEAT_DROPS = 1_000n;

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) throw new Error("No signer available — set PRIVATE_KEY in packages/contracts/.env");

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Network:  ${network.name} (chainId ${network.config.chainId})`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance:  ${ethers.formatEther(balance)} C2FLR`);

  if (balance === 0n) {
    throw new Error(
      `Deployer has no C2FLR. Fund ${deployer.address} at https://faucet.flare.network/coston2 and retry.`,
    );
  }

  const beaconXrplAddress = process.env.HEIRLOOM_BEACON_ADDRESS ?? DEFAULT_BEACON_XRPL_ADDRESS;
  const heartbeatDrops = BigInt(process.env.HEIRLOOM_HEARTBEAT_DROPS ?? DEFAULT_HEARTBEAT_DROPS);
  // FDC's standard address hash is keccak256 over the address string, not lowercased.
  const beaconHash = ethers.keccak256(ethers.toUtf8Bytes(beaconXrplAddress));

  console.log(`\nDeploying HeirloomVault...`);
  const vault = await (await ethers.getContractFactory("HeirloomVault")).deploy(
    COSTON2.flareTeeManager,
    COSTON2.flareTeeManager,
  );
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log(`  HeirloomVault: ${vaultAddress}`);

  console.log(`\nConfiguring beacon...`);
  console.log(`  XRPL address:    ${beaconXrplAddress}`);
  console.log(`  Address hash:    ${beaconHash}`);
  console.log(`  Heartbeat drops: ${heartbeatDrops}`);
  await (await vault.configureBeacon(beaconHash, heartbeatDrops)).wait();

  // Confirms the FTSO wiring resolves through ContractRegistry on the live chain.
  try {
    const [priceE18, ts] = await vault.xrpUsdPrice();
    console.log(`\nFTSO XRP/USD: $${ethers.formatUnits(priceE18, 18)} (feed ts ${ts})`);
  } catch (err) {
    console.warn(`\nWarning: could not read the FTSO feed: ${(err as Error).message}`);
  }

  const deployment = {
    network: network.name,
    chainId: Number(network.config.chainId),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: { HeirloomVault: vaultAddress },
    flareContracts: {
      FlareTeeManager: COSTON2.flareTeeManager,
      FdcVerification: COSTON2.fdcVerification,
      FdcHub: COSTON2.fdcHub,
      FtsoV2: COSTON2.ftsoV2,
    },
    beacon: { xrplAddress: beaconXrplAddress, addressHash: beaconHash, heartbeatDrops: heartbeatDrops.toString() },
    explorer: `${COSTON2.explorer}/address/${vaultAddress}`,
  };

  const outDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${network.name}.json`);
  fs.writeFileSync(outFile, JSON.stringify(deployment, null, 2));

  console.log(`\nDeployment written to ${outFile}`);
  console.log(`Explorer: ${deployment.explorer}`);
  console.log(`\nNext: register the FCC extension against ${vaultAddress}, then call setExtensionId().`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
