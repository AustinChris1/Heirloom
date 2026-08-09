import { artifacts } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Writes the compiled HeirloomVault ABI into the web package.
 *
 * The app previously carried a hand-written human-readable ABI, which silently
 * omitted proveLife and claimDormancy — their FDC proof arguments are deeply
 * nested tuples that are painful to transcribe and easy to get subtly wrong.
 * Generating it removes that whole class of bug: the ABI the browser uses is
 * the one the contract was compiled with.
 *
 * Re-run after any change to HeirloomVault.sol.
 */
async function main() {
  const artifact = await artifacts.readArtifact("HeirloomVault");
  const out = path.join(__dirname, "..", "..", "web", "src", "lib", "HeirloomVault.abi.json");

  fs.writeFileSync(out, `${JSON.stringify(artifact.abi, null, 2)}\n`);

  const fns = artifact.abi.filter((f: any) => f.type === "function").length;
  console.log(`wrote ${fns} functions to ${path.relative(process.cwd(), out)}`);
  for (const name of ["proveLife", "claimDormancy", "createVault", "guardianApprove", "revokeDormancy"]) {
    const found = artifact.abi.some((f: any) => f.type === "function" && f.name === name);
    console.log(`  ${found ? "✓" : "✗"} ${name}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
