import { SigningKey, computeHmac, concat, getBytes, hexlify, randomBytes, sha256 } from "ethers";

/**
 * ECIES encryption to the enclave's secp256k1 key, byte-compatible with
 * go-ethereum's `crypto/ecies` under `ECIES_AES128_SHA256` — which is what the
 * Flare TEE node's /decrypt endpoint runs (tee-node pkg/utils/crypto.go
 * delegates to geth's `ecies.Encrypt(rand, pub, m, nil, nil)`).
 *
 * The scheme, exactly as geth implements it:
 *
 *   1. ephemeral secp256k1 keypair R
 *   2. z  = x-coordinate of ECDH(R, recipient), left-padded to 32 bytes
 *   3. K  = SHA256(counter=1 || z)            — NIST concatKDF, one round
 *      Ke = K[0:16]   (AES-128 key)
 *      Km = SHA256(K[16:32])                  (HMAC key)
 *   4. em = iv(16, random) || AES-128-CTR(Ke, iv, plaintext)
 *   5. d  = HMAC-SHA256(Km, em)
 *   6. ciphertext = R_uncompressed(65) || em || d
 *
 * Only encryption lives here — decryption happens exclusively inside the
 * enclave. Getting any byte of this wrong fails at the enclave's decrypt step,
 * which is precisely where the transport test stopped; this file is the
 * missing half of that handshake.
 */

/** Encrypts plaintext to an uncompressed (0x04-prefixed, 65-byte) secp256k1 public key. */
export async function eciesEncrypt(recipientPublicKey: string, plaintext: Uint8Array): Promise<Uint8Array> {
  const pub = getBytes(recipientPublicKey);
  if (pub.length !== 65 || pub[0] !== 0x04) {
    throw new Error("recipient key must be a 65-byte uncompressed secp256k1 public key");
  }

  // Ephemeral key. ethers' SigningKey wraps noble-secp256k1, and
  // computeSharedSecret returns the full uncompressed ECDH point.
  const ephemeral = new SigningKey(hexlify(randomBytes(32)));
  const sharedPoint = getBytes(ephemeral.computeSharedSecret(recipientPublicKey));
  const z = sharedPoint.slice(1, 33); // x-coordinate, already 32 bytes

  // concatKDF with SHA-256: a single round covers the 32 bytes needed.
  const counter = new Uint8Array([0, 0, 0, 1]);
  const K = getBytes(sha256(concat([counter, z])));
  const Ke = K.slice(0, 16);
  const Km = getBytes(sha256(K.slice(16, 32)));

  // Copy into fresh ArrayBuffer-backed views — WebCrypto's BufferSource typing
  // rejects views that could sit on a SharedArrayBuffer.
  const iv = new Uint8Array(randomBytes(16));
  const aesKey = await crypto.subtle.importKey("raw", new Uint8Array(Ke), { name: "AES-CTR" }, false, ["encrypt"]);
  const ct = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-CTR", counter: iv, length: 128 }, aesKey, new Uint8Array(plaintext)),
  );

  const em = concat([iv, ct]);
  const mac = computeHmac("sha256", Km, em);

  return getBytes(concat([ephemeral.publicKey, em, mac]));
}

/** The 113 bytes of overhead every ECIES blob carries: 65 (ephemeral key) + 16 (iv) + 32 (mac). */
export const ECIES_OVERHEAD = 113;
