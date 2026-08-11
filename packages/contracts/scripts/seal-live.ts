import { ethers } from "hardhat";
import { webcrypto } from "node:crypto";
import * as fs from "fs";
import * as path from "path";

/**
 * Live end-to-end seal: create a vault with a REAL will, encrypt it to the
 * enclave's key with geth-compatible ECIES, send SEAL, wait for the enclave's
 * signed attestation, and record it with confirmSeal.
 *
 * This is the Node mirror of what packages/web runs in the browser
 * (lib/ecies.ts + lib/enclave.ts + EnclaveFlow), kept byte-identical so a pass
 * here proves the browser path. Where seal-e2e.ts sent junk bytes to prove
 * transport, this proves the crypto: the enclave must actually decrypt, parse,
 * and re-derive the commitment we stored on-chain.
 *
 * The will file is saved to deployments/ so the execute/payout legs can reuse it.
 */
const VAULT = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A";
const ENCLAVE = "https://sly.southafricanorth.cloudapp.azure.com";
const WALLET_CACHE = path.join(__dirname, "..", "deployments", "xrpl-testnet-wallet.json");
const INTERVAL = BigInt(process.env.INTERVAL ?? 180); // seconds until dormancy may be claimed
const GRACE = BigInt(process.env.GRACE ?? 0);

/* ---------------- geth-compatible ECIES (mirror of web/src/lib/ecies.ts) ---------------- */

async function eciesEncrypt(recipientPublicKey: string, plaintext: Uint8Array): Promise<Uint8Array> {
  const pub = ethers.getBytes(recipientPublicKey);
  if (pub.length !== 65 || pub[0] !== 0x04) throw new Error("recipient key must be uncompressed");

  const ephemeral = new ethers.SigningKey(ethers.hexlify(ethers.randomBytes(32)));
  const sharedPoint = ethers.getBytes(ephemeral.computeSharedSecret(recipientPublicKey));
  const z = sharedPoint.slice(1, 33);

  const K = ethers.getBytes(ethers.sha256(ethers.concat([new Uint8Array([0, 0, 0, 1]), z])));
  const Ke = K.slice(0, 16);
  const Km = ethers.getBytes(ethers.sha256(K.slice(16, 32)));

  const iv = new Uint8Array(ethers.randomBytes(16));
  const aesKey = await webcrypto.subtle.importKey("raw", new Uint8Array(Ke), { name: "AES-CTR" }, false, ["encrypt"]);
  const ct = new Uint8Array(
    await webcrypto.subtle.encrypt({ name: "AES-CTR", counter: iv, length: 128 }, aesKey, new Uint8Array(plaintext)),
  );

  const em = ethers.concat([iv, ct]);
  const mac = ethers.computeHmac("sha256", Km, em);
  return ethers.getBytes(ethers.concat([ephemeral.publicKey, em, mac]));
}

/* ---------------- will commitment (mirror of extension/src/will.ts) ---------------- */

interface Will {
  vaultId: number;
  estateAccount: string;
  bequests: Array<{ beneficiary: string; flareRecipient?: string; kind: string; amount: string }>;
  residuaryBeneficiary: string;
}

const KIND_ENUM: Record<string, number> = { FIXED_USD: 0, FIXED_XRP: 1, SHARE_BPS: 2 };
const ZERO = "0x0000000000000000000000000000000000000000";

function willCommitment(will: Will): string {
  return ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["uint256", "string", "string", "tuple(string,address,uint8,uint256)[]"],
      [
        will.vaultId,
        will.estateAccount,
        will.residuaryBeneficiary,
        will.bequests.map((b) => [b.beneficiary, b.flareRecipient ?? ZERO, KIND_ENUM[b.kind], BigInt(b.amount)]),
      ],
    ),
  );
}

/* ---------------- main ---------------- */

async function main() {
  const [signer] = await ethers.getSigners();
  const vault = await ethers.getContractAt("HeirloomVault", VAULT, signer);

  // 1. The enclave's key, cross-checked against the address the contract trusts.
  const info = await (await fetch(`${ENCLAVE}/info`)).json();
  const { x, y } = info.teeInfo.publicKey;
  const enclaveKey = ethers.concat(["0x04", ethers.zeroPadValue(x, 32), ethers.zeroPadValue(y, 32)]);
  const enclaveAddress = ethers.computeAddress(enclaveKey);
  const teeAddress: string = await vault.teeAddress();
  console.log(`enclave key:  ${enclaveAddress}`);
  console.log(`contract tee: ${teeAddress}`);
  if (enclaveAddress.toLowerCase() !== teeAddress.toLowerCase()) {
    throw new Error("enclave key does not match the contract's teeAddress — refusing to encrypt");
  }

  // 2. A real will for a fresh vault. Beneficiaries are throwaway testnet
  //    addresses; the estate is the cached XRPL wallet that sends heartbeats.
  const { address: estateAccount } = JSON.parse(fs.readFileSync(WALLET_CACHE, "utf8"));
  const id = Number(await vault.vaultCount());

  const will: Will = {
    vaultId: id,
    estateAccount,
    bequests: [
      { beneficiary: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH", kind: "FIXED_XRP", amount: "2000000" },
      { beneficiary: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe", kind: "SHARE_BPS", amount: "5000" },
    ],
    residuaryBeneficiary: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
  };
  const commitment = willCommitment(will);

  console.log(`\ncreating vault #${id} — interval ${INTERVAL}s, grace ${GRACE}s, estate ${estateAccount}`);
  const createTx = await vault.createVault(
    ethers.keccak256(ethers.toUtf8Bytes(estateAccount)),
    INTERVAL,
    GRACE,
    [],
    0,
    commitment,
  );
  await createTx.wait();

  const willPath = path.join(__dirname, "..", "deployments", `will-vault-${id}.json`);
  fs.writeFileSync(willPath, JSON.stringify(will, null, 2));
  console.log(`will saved to ${willPath}`);

  // 3. Encrypt and seal.
  const ciphertext = await eciesEncrypt(ethers.hexlify(enclaveKey), new TextEncoder().encode(JSON.stringify(will)));
  console.log(`\nciphertext: ${ciphertext.length} bytes — sending HEIRLOOM/SEAL…`);

  const sealTx = await vault.sealWill(id, ciphertext, { value: ethers.parseEther("1") });
  const receipt = await sealTx.wait();

  let instructionId: string | undefined;
  for (const log of receipt?.logs ?? []) {
    try {
      const parsed = vault.interface.parseLog({ topics: [...log.topics], data: log.data });
      if (parsed?.name === "WillSealed") instructionId = parsed.args.instructionId;
    } catch {
      /* registry logs don't parse against the vault ABI */
    }
  }
  if (!instructionId) throw new Error("no WillSealed event");
  console.log(`  seal tx:     ${receipt?.hash}`);
  console.log(`  instruction: ${instructionId}`);

  // 4. Poll the enclave for its signed attestation.
  console.log(`\npolling ${ENCLAVE}/action/result/${instructionId}`);
  const started = Date.now();
  let result: any = null;
  while (Date.now() - started < 600_000) {
    const res = await fetch(`${ENCLAVE}/action/result/${instructionId}`);
    if (res.ok) {
      const out = await res.json();
      // status >= 2 is pending (node still retrying the extension) — not final.
      if (out?.result?.id && Number(out.result.status ?? 0) < 2) {
        result = out;
        break;
      }
    }
    process.stdout.write(`  waiting… ${Math.round((Date.now() - started) / 1000)}s\r`);
    await new Promise((r) => setTimeout(r, 6000));
  }
  if (!result) throw new Error("no enclave result within 10 minutes");

  console.log(`\n  status: ${result.result.status}  log: ${result.result.log}`);
  if (result.result.status !== 1) {
    throw new Error(`enclave rejected the seal: ${result.result.log}`);
  }

  // 5. Record the attestation on-chain.
  const confirmTx = await vault.confirmSeal(
    result.result.data,
    result.result.id,
    result.result.submissionTag,
    result.result.status,
    result.signature,
  );
  await confirmTx.wait();

  const v = await vault.vaults(id);
  console.log(`\nconfirmSeal tx: ${confirmTx.hash}`);
  console.log(`vault #${id} willAttested: ${v.willAttested}`);
  console.log(`\nVAULT_ID=${id}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
