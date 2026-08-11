import { createHash } from "node:crypto";
import { deriveAddress, deriveKeypair, generateSeed, sign as rippleSign } from "ripple-keypairs";
import { encode, encodeForSigning } from "ripple-binary-codec";

/**
 * The enclave's own XRPL signing identity.
 *
 * The keypair is not stored anywhere — it is DERIVED, on demand, from the TEE
 * node's identity key: the extension asks the sign port to sign a fixed
 * derivation message, hashes the (RFC 6979, deterministic) signature, and uses
 * the result as seed entropy. Consequences, all intentional:
 *
 *   - the private key exists only inside the enclave, reconstructed rather
 *     than persisted; there is nothing on disk to steal or back up;
 *   - the same TEE identity always derives the same XRPL address, so the key
 *     survives extension restarts;
 *   - if the TEE identity changes (container rebuild), the XRPL key changes
 *     with it — exactly mirroring how sealed wills are bound to the enclave.
 *     Owners re-delegate after a re-registration, same as they re-seal.
 *
 * An estate owner authorises this address as an XRPL *regular key* while
 * alive (`SetRegularKey`). From then on the enclave can sign that estate's
 * payouts, and the owner can revoke with one transaction at any time.
 */

export interface XrplIdentity {
  publicKey: string;
  privateKey: string;
  address: string;
}

const DERIVATION_MESSAGE = "HEIRLOOM/XRPL-PAYOUT-KEY/v1";

let cached: XrplIdentity | null = null;

/** The derived identity, computing it on first use. `signViaNode` is the tee-node sign call. */
export async function enclaveXrplIdentity(
  signViaNode: (message: Uint8Array) => Promise<Uint8Array>,
): Promise<XrplIdentity> {
  if (cached) return cached;

  const signature = await signViaNode(new TextEncoder().encode(DERIVATION_MESSAGE));
  const entropy = new Uint8Array(createHash("sha256").update(signature).digest().subarray(0, 16));
  const seed = generateSeed({ entropy, algorithm: "ecdsa-secp256k1" });
  const keypair = deriveKeypair(seed);

  cached = { ...keypair, address: deriveAddress(keypair.publicKey) };
  return cached;
}

/** The derived address if it has been computed this lifetime — for GET /state. */
export function cachedXrplAddress(): string | null {
  return cached?.address ?? null;
}

/** Signs one XRPL transaction with the enclave key. Returns the broadcastable blob and its ledger hash. */
export function signXrplTx(
  tx: Record<string, unknown>,
  identity: XrplIdentity,
): { blob: string; hash: string } {
  const signable = { ...tx, SigningPubKey: identity.publicKey };
  const signature = rippleSign(encodeForSigning(signable), identity.privateKey);
  const blob = encode({ ...signable, TxnSignature: signature });

  // XRPL tx hash: first half of SHA-512 over the signed blob prefixed "TXN\0".
  const hash = createHash("sha512")
    .update(Buffer.concat([Buffer.from([0x54, 0x58, 0x4e, 0x00]), Buffer.from(blob, "hex")]))
    .digest()
    .subarray(0, 32)
    .toString("hex")
    .toUpperCase();

  return { blob, hash };
}
