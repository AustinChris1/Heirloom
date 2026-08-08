import { ethers } from "hardhat";
import { COSTON2, XRP_USD_FEED_ID } from "./coston2";

/**
 * Read-only preflight against live Coston2.
 *
 * Confirms every protocol dependency Heirloom relies on actually exists and
 * answers before spending gas on a deploy.
 */
async function main() {
  const provider = new ethers.JsonRpcProvider(COSTON2.rpc);
  const net = await provider.getNetwork();
  console.log(`Connected to Coston2 (chainId ${net.chainId}), head block ${await provider.getBlockNumber()}\n`);

  const checks: Array<[string, string]> = [
    ["FlareTeeManager", COSTON2.flareTeeManager],
    ["FdcVerification", COSTON2.fdcVerification],
    ["FdcHub", COSTON2.fdcHub],
    ["FtsoV2", COSTON2.ftsoV2],
  ];

  for (const [name, address] of checks) {
    const code = await provider.getCode(address);
    const status = code !== "0x" ? `live (${(code.length - 2) / 2} bytes)` : "NO CODE";
    console.log(`  ${name.padEnd(16)} ${address}  ${status}`);
  }

  // FTSO XRP/USD — the feed that prices fiat-denominated bequests.
  const ftso = new ethers.Contract(
    COSTON2.ftsoV2,
    ["function getFeedByIdInWei(bytes21) view returns (uint256, uint64)"],
    provider,
  );
  const [priceE18, ts] = await ftso.getFeedByIdInWei(XRP_USD_FEED_ID);
  console.log(`\n  FTSO XRP/USD:    $${ethers.formatUnits(priceE18, 18)}  (feed timestamp ${ts})`);

  // FCC extension registry — confirms the diamond answers the registry facet.
  const teeRegistry = new ethers.Contract(
    COSTON2.flareTeeManager,
    ["function nextPublicExtensionId() view returns (uint256)"],
    provider,
  );
  try {
    const nextId = await teeRegistry.nextPublicExtensionId();
    const registered = nextId > 0x10000n ? nextId - 0x10000n : 0n;
    console.log(`  FCC extensions:  nextPublicExtensionId = ${nextId} (${registered} public extension(s) registered)`);
  } catch (err) {
    console.log(`  FCC extensions:  registry facet did not answer — ${(err as Error).message}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
