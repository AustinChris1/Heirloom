import { SigningKey, computeHmac, concat, getBytes, hexlify, randomBytes, sha256 } from "ethers";

/**
 * ECIES to the enclave's secp256k1 key, byte-compatible with go-ethereum's
 * `ECIES_AES128_SHA256` — what the TEE node's /decrypt endpoint runs.
 *
 * Layout: ephemeralPubKey(65) || iv(16) || AES-128-CTR || HMAC-SHA256(32),
 * with keys from a single-round ConcatKDF over the ECDH x-coordinate.
 * Encryption only; decryption happens exclusively inside the enclave.
 */

/** Encrypts plaintext to an uncompressed (0x04-prefixed, 65-byte) secp256k1 public key. */
export async function eciesEncrypt(recipientPublicKey: string, plaintext: Uint8Array): Promise<Uint8Array> {
  const pub = getBytes(recipientPublicKey);
  if (pub.length !== 65 || pub[0] !== 0x04) {
    throw new Error("recipient key must be a 65-byte uncompressed secp256k1 public key");
  }

  const ephemeral = new SigningKey(hexlify(randomBytes(32)));
  const sharedPoint = getBytes(ephemeral.computeSharedSecret(recipientPublicKey));
  const z = sharedPoint.slice(1, 33); // x-coordinate, already 32 bytes

  const counter = new Uint8Array([0, 0, 0, 1]);
  const K = getBytes(sha256(concat([counter, z])));
  const Ke = K.slice(0, 16);
  const Km = getBytes(sha256(K.slice(16, 32)));

  // Fresh ArrayBuffer-backed views: WebCrypto rejects possibly-shared buffers.
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
