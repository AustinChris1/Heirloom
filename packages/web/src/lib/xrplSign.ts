import { sha512 } from "ethers";
import { encode, encodeForSigning } from "ripple-binary-codec";
import { deriveKeypair, sign as rippleSign } from "ripple-keypairs";

/**
 * XRPL transaction signing, isolated in its own module.
 *
 * ripple-binary-codec is the heaviest dependency the payout leg needs, and the
 * app has deliberately kept XRPL client libraries out of the main bundle —
 * so this file is only ever loaded via dynamic import, at the moment someone
 * actually broadcasts a distribution.
 */

/** Signs a payment with the estate's seed, returning the blob and its ledger hash. */
export function signPayment(tx: Record<string, unknown>, seed: string): { blob: string; hash: string } {
  const keypair = deriveKeypair(seed.trim());
  const signable = { ...tx, SigningPubKey: keypair.publicKey };
  const signature = rippleSign(encodeForSigning(signable), keypair.privateKey);
  const blob = encode({ ...signable, TxnSignature: signature });

  // XRPL tx hash: first half of SHA-512 over the signed blob prefixed "TXN\0".
  const hash = sha512("0x54584e00" + blob.toLowerCase()).slice(2, 66).toUpperCase();
  return { blob, hash };
}
