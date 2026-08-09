import { ethers } from "hardhat";
import { Client, Wallet } from "xrpl";
import * as fs from "fs";
import * as path from "path";
import { fetchProof, prepareRequest, submitRequest, waitForFinalisation } from "./fdc";

/**
 * The full proof-of-life cycle against live infrastructure.
 *
 *   fund an XRPL testnet wallet
 *   → create a vault owned by it
 *   → send a tagged dust payment to the beacon
 *   → have FDC attest that payment
 *   → submit the proof to HeirloomVault.proveLife
 *
 * Nothing here is mocked: real XRPL transaction, real FDC attestation, real
 * Merkle proof verified on-chain by Flare's own FdcVerification contract.
 *
 * The wallet is cached so re-runs reuse the same estate account rather than
 * begging the faucet each time.
 */

const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
const BEACON = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
const HEARTBEAT_DROPS = "1000";
const TESTNET_WSS = "wss://s.altnet.rippletest.net:51233";
const WALLET_CACHE = path.join(__dirname, "..", "deployments", "xrpl-testnet-wallet.json");

const DAY = 24 * 60 * 60;

async function getWallet(client: Client): Promise<Wallet> {
  if (fs.existsSync(WALLET_CACHE)) {
    const { seed } = JSON.parse(fs.readFileSync(WALLET_CACHE, "utf8"));
    const w = Wallet.fromSeed(seed);
    console.log(`  reusing cached XRPL wallet ${w.address}`);
    return w;
  }
  console.log(`  requesting a funded testnet wallet...`);
  const { wallet } = await client.fundWallet();
  fs.mkdirSync(path.dirname(WALLET_CACHE), { recursive: true });
  fs.writeFileSync(WALLET_CACHE, JSON.stringify({ address: wallet.address, seed: wallet.seed }, null, 2));
  console.log(`  funded ${wallet.address} (seed cached — testnet only, disposable)`);
  return wallet;
}

async function main() {
  const [signer] = await ethers.getSigners();
  const vault = await ethers.getContractAt("HeirloomVault", VAULT, signer);

  const client = new Client(TESTNET_WSS);
  await client.connect();

  try {
    console.log("=== 1. XRPL testnet wallet ===");
    const wallet = await getWallet(client);

    // --- vault owned by that XRPL account ---
    console.log("\n=== 2. Vault ===");
    const accountHash = ethers.keccak256(ethers.toUtf8Bytes(wallet.address));

    let vaultId = -1n;
    const total: bigint = await vault.vaultCount();
    for (let i = 0n; i < total; i++) {
      const v = await vault.vaults(i);
      if (v.xrplAccountHash === accountHash && Number(v.state) === 1) {
        vaultId = i;
        break;
      }
    }

    if (vaultId < 0n) {
      // Short interval so the same account can also demo dormancy later.
      const tx = await vault.createVault(accountHash, BigInt(DAY), 0n, [], 0, ethers.id("live-heartbeat-demo"));
      await tx.wait();
      vaultId = total;
      console.log(`  created vault #${vaultId} for ${wallet.address}`);
    } else {
      console.log(`  reusing vault #${vaultId}`);
    }

    const tag: bigint = await vault.heartbeatTag(vaultId);
    const before = (await vault.vaults(vaultId)).lastHeartbeat;
    console.log(`  destination tag: ${tag}`);
    console.log(`  lastHeartbeat before: ${before}`);

    // --- the heartbeat itself ---
    console.log("\n=== 3. XRPL heartbeat payment ===");
    const submitted = await client.submitAndWait(
      {
        TransactionType: "Payment",
        Account: wallet.address,
        Destination: BEACON,
        DestinationTag: Number(tag),
        Amount: HEARTBEAT_DROPS,
      },
      { wallet },
    );

    const result = (submitted.result.meta as any)?.TransactionResult;
    const txHash = submitted.result.hash;
    console.log(`  ${result}  ${txHash}`);
    console.log(`  https://testnet.xrpl.org/transactions/${txHash}`);
    if (result !== "tesSUCCESS") throw new Error(`XRPL payment failed: ${result}`);

    // XRPPayment needs 3 confirmations (~12s).
    console.log("  waiting for XRPL confirmations...");
    await new Promise((r) => setTimeout(r, 15_000));

    // --- FDC attestation ---
    console.log("\n=== 4. FDC attestation (XRPPayment) ===");
    const encoded = await prepareRequest("XRPPayment", {
      transactionId: `0x${txHash}`,
      proofOwner: await signer.getAddress(),
    });
    console.log(`  encoded request: ${encoded.slice(0, 42)}…`);

    const round = await submitRequest(encoded);
    await waitForFinalisation(round);

    console.log("\n=== 5. Merkle proof ===");
    const { proof, responseHex } = await fetchProof(round, encoded);
    console.log(`  proof nodes: ${proof.length}`);

    // Decode the response into the struct proveLife expects.
    const artifact = await ethers.getContractAt("HeirloomVault", VAULT);
    const fragment = artifact.interface.getFunction("proveLife")!;
    const responseType = fragment.inputs[1].components![1]; // Proof.data
    const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
      [responseType as any],
      responseHex.startsWith("0x") ? responseHex : `0x${responseHex}`,
    )[0];

    console.log("\n=== 6. proveLife on Coston2 ===");
    const tx = await vault.proveLife(vaultId, { merkleProof: proof, data: decoded });
    const receipt = await tx.wait();
    console.log(`  tx: ${receipt!.hash}`);

    const after = (await vault.vaults(vaultId)).lastHeartbeat;
    console.log(`\n  lastHeartbeat  ${before} → ${after}`);
    console.log(after > before ? "  ✓ PROOF OF LIFE ACCEPTED" : "  ✗ heartbeat did not advance");
  } finally {
    await client.disconnect();
  }
}

main().catch((e) => {
  console.error(`\n${e.message ?? e}`);
  process.exitCode = 1;
});
