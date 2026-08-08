import { ethers } from "hardhat";
import { COSTON2 } from "./coston2";

/**
 * Checks this repo against the Coston2 FCC redeploy.
 *
 * The pinned hackathon notice says most FCC failures are stale stacks still
 * pointed at the old FlareTeeManager. This confirms which deployment we target
 * and that the machine-status calls the notice recommends actually resolve.
 */
// The pinned notice names this as the live FlareTeeManager after the Coston2
// redeploy. The old one (0x004224fa…5d41F) is dead and is what produces
// FunctionNotFound / reverting register() for stale stacks.
const LIVE = COSTON2.flareTeeManager;

async function main() {
  const provider = new ethers.JsonRpcProvider(COSTON2.rpc);
  console.log(`Coston2 head block ${await provider.getBlockNumber()}\n`);

  const code = await provider.getCode(LIVE);
  console.log(`  FlareTeeManager  ${LIVE}  ${code !== "0x" ? `${(code.length - 2) / 2} bytes` : "NO CODE"}`);

  const diamond = new ethers.Contract(
    LIVE,
    [
      "function nextPublicExtensionId() view returns (uint256)",
      "function getTeeExtensionInstructionsSender(uint256) view returns (address)",
      "function getRandomTeeIds(uint256,uint256) view returns (address[])",
      "function getTeeMachineStatus(address) view returns (uint8)",
      "function getTeeMachine(address) view returns (tuple(address,address,string))",
    ],
    provider,
  );

  const nextId = await diamond.nextPublicExtensionId();
  const registered = nextId > 0x10000n ? Number(nextId - 0x10000n) : 0;
  console.log(`\n  nextPublicExtensionId = ${nextId}  (${registered} public extensions registered)`);

  // The notice's own diagnostic calls — confirm the facets are reachable.
  for (const fn of ["getTeeMachineStatus", "getTeeMachine"] as const) {
    try {
      await diamond[fn].staticCall(ethers.ZeroAddress);
      console.log(`  ${fn.padEnd(22)} facet reachable`);
    } catch (err) {
      const msg = (err as Error).message;
      // A revert means the facet exists and rejected the zero address, which is
      // what we want to know. FunctionNotFound would mean the wrong deployment.
      const missing = /FunctionNotFound|no matching function|call revert exception/i.test(msg);
      console.log(`  ${fn.padEnd(22)} ${missing ? "NOT FOUND — wrong deployment" : "facet reachable (reverted on zero address, expected)"}`);
    }
  }

  // Walk a few live extensions and see whether any have machines serving them.
  console.log(`\n  Sampling recent extensions for serving TEE machines:`);
  const start = Number(nextId) - 1;
  let found = 0;
  for (let id = start; id >= 0x10000 && id > start - 8; id--) {
    try {
      const sender = await diamond.getTeeExtensionInstructionsSender(id);
      const teeIds: string[] = await diamond.getRandomTeeIds(id, 1).catch(() => []);
      const live = teeIds.filter((t) => t !== ethers.ZeroAddress);
      if (live.length > 0) {
        const status = await diamond.getTeeMachineStatus(live[0]).catch(() => -1);
        const label = status === 2n ? "PRODUCTION" : status === 1n ? "INITIALIZED" : `status ${status}`;
        console.log(`    ext ${id}  sender ${sender.slice(0, 10)}…  tee ${live[0].slice(0, 10)}…  ${label}`);
        found++;
      }
    } catch {
      /* extension id not readable; keep scanning */
    }
  }
  if (found === 0) console.log(`    none of the last 8 extensions currently have a machine serving them`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
