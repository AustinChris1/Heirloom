import { describe, expect, it, beforeEach } from "vitest";
import { createHmac } from "node:crypto";
import { decode } from "ripple-binary-codec";
import { enclaveXrplIdentity, signXrplTx } from "../app/heirloom/enclaveSigner.js";

/**
 * The enclave's XRPL signing identity, verified without a real TEE node.
 *
 * `signViaNode` is stubbed with a DETERMINISTIC signer (HMAC over a fixed
 * secret) — the real tee-node /sign is also deterministic (RFC 6979), so this
 * faithfully exercises "same identity derives the same address every time".
 */
const NODE_SECRET = "stand-in-for-the-tee-node-identity-key";
const deterministicSign = async (message: Uint8Array): Promise<Uint8Array> =>
  new Uint8Array(createHmac("sha256", NODE_SECRET).update(message).digest());

// enclaveXrplIdentity caches for the process; these tests only assert stability,
// which the cache trivially satisfies, plus validity of what it produced.
describe("enclave XRPL identity", () => {
  it("derives a valid classic address, stable across calls", async () => {
    const a = await enclaveXrplIdentity(deterministicSign);
    const b = await enclaveXrplIdentity(deterministicSign);

    expect(a.address).toMatch(/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/);
    expect(a.address).toBe(b.address);
    expect(a.privateKey).toBe(b.privateKey);
    expect(a.publicKey).toHaveLength(66); // 33-byte compressed pubkey, hex
  });

  it("signs a Payment into a decodable blob carrying the right fields", async () => {
    const identity = await enclaveXrplIdentity(deterministicSign);
    const tx = {
      TransactionType: "Payment",
      Account: identity.address,
      Destination: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
      Amount: "2000000",
      Fee: "12",
      Sequence: 42,
      LastLedgerSequence: 9_000_000,
    };

    const { blob, hash } = signXrplTx(tx, identity);
    const decoded = decode(blob) as Record<string, unknown>;

    expect(decoded.TransactionType).toBe("Payment");
    expect(decoded.Amount).toBe("2000000");
    expect(decoded.Sequence).toBe(42);
    expect(decoded.SigningPubKey).toBe(identity.publicKey.toUpperCase());
    expect(decoded.TxnSignature).toBeTruthy();
    expect(hash).toMatch(/^[0-9A-F]{64}$/);
  });

  it("produces distinct signatures for distinct sequences", async () => {
    const identity = await enclaveXrplIdentity(deterministicSign);
    const base = {
      TransactionType: "Payment",
      Account: identity.address,
      Destination: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
      Amount: "1000000",
      Fee: "12",
      LastLedgerSequence: 9_000_000,
    };
    const one = signXrplTx({ ...base, Sequence: 1 }, identity);
    const two = signXrplTx({ ...base, Sequence: 2 }, identity);
    expect(one.hash).not.toBe(two.hash);
  });
});
