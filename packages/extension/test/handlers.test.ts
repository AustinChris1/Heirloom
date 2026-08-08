import { describe, expect, it } from "vitest";
import { AbiCoder, hexlify, toUtf8Bytes } from "ethers";
import { handleExecute, handleSeal } from "../src/handlers";
import { parseWill, Will, WillValidationError, willCommitment } from "../src/will";

const ESTATE = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
const DAUGHTER = "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w";
const SON = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe";
const RESIDUARY = "rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf";
const VAULT_CONTRACT = "0x1111111111111111111111111111111111111111";
const PRICE_2_50 = 2_500_000_000_000_000_000n;

const WILL: Will = {
  vaultId: 0,
  estateAccount: ESTATE,
  bequests: [
    { beneficiary: DAUGHTER, kind: "FIXED_USD", amount: "5000000" }, // $50,000
    { beneficiary: SON, kind: "SHARE_BPS", amount: "10000" },
  ],
  residuaryBeneficiary: RESIDUARY,
};

/** Stands in for the enclave's ECIES decryption; the plaintext is the ciphertext here. */
const passthroughDecrypt = async (ciphertext: Uint8Array) => ciphertext;

function encodeMessage(overrides: Partial<{ vaultId: bigint; commitment: string; will: Will; estateDrops: bigint; price: bigint }> = {}) {
  const will = overrides.will ?? WILL;
  return AbiCoder.defaultAbiCoder().encode(
    ["tuple(uint256,address,bytes32,bytes,uint256,uint256)"],
    [
      [
        overrides.vaultId ?? BigInt(will.vaultId),
        VAULT_CONTRACT,
        overrides.commitment ?? willCommitment(will),
        hexlify(toUtf8Bytes(JSON.stringify(will))),
        overrides.price ?? PRICE_2_50,
        overrides.estateDrops ?? 100_000_000_000n, // 100,000 XRP
      ],
    ],
  );
}

describe("will validation", () => {
  it("rejects a malformed XRPL beneficiary address", () => {
    expect(() =>
      parseWill({ ...WILL, bequests: [{ beneficiary: "not-an-xrpl-address", kind: "FIXED_XRP", amount: "1" }] }),
    ).toThrow(WillValidationError);
  });

  it("rejects share bequests totalling more than 100%", () => {
    expect(() =>
      parseWill({
        ...WILL,
        bequests: [
          { beneficiary: DAUGHTER, kind: "SHARE_BPS", amount: "7000" },
          { beneficiary: SON, kind: "SHARE_BPS", amount: "4000" },
        ],
      }),
    ).toThrow(WillValidationError);
  });

  it("rejects a will with no bequests", () => {
    expect(() => parseWill({ ...WILL, bequests: [] })).toThrow(WillValidationError);
  });

  it("produces a commitment that changes when any term changes", () => {
    const original = willCommitment(WILL);
    const edited = willCommitment({
      ...WILL,
      bequests: [{ ...WILL.bequests[0], amount: "5000001" }, WILL.bequests[1]],
    });
    expect(edited).not.toBe(original);
  });
});

describe("SEAL", () => {
  it("attests a well-formed will without revealing its contents", async () => {
    const result = await handleSeal(encodeMessage(), passthroughDecrypt);
    expect(result.status).toBe(1);

    const [contractAddr, vaultId, commitment, count] = AbiCoder.defaultAbiCoder().decode(
      ["address", "uint256", "bytes32", "uint32"],
      result.data,
    );
    expect(contractAddr).toBe(VAULT_CONTRACT);
    expect(vaultId).toBe(0n);
    expect(commitment).toBe(willCommitment(WILL));
    expect(count).toBe(2n);

    // Only a count comes back — no beneficiary appears in the payload.
    expect(result.data.toLowerCase()).not.toContain(Buffer.from(DAUGHTER, "utf8").toString("hex").toLowerCase());
  });

  it("refuses a will whose commitment does not match the vault", async () => {
    const result = await handleSeal(
      encodeMessage({ commitment: "0x" + "11".repeat(32) }),
      passthroughDecrypt,
    );
    expect(result.status).toBe(0);
    expect(result.error).toContain("does not match the commitment");
  });

  it("refuses a will addressed to a different vault", async () => {
    const result = await handleSeal(encodeMessage({ vaultId: 7n }), passthroughDecrypt);
    expect(result.status).toBe(0);
    expect(result.error).toContain("vault");
  });
});

describe("EXECUTE", () => {
  it("returns a distribution the vault contract can decode", async () => {
    const result = await handleExecute(encodeMessage(), passthroughDecrypt);
    expect(result.status).toBe(1);

    const [contractAddr, vaultId, commitment, price, bequests] = AbiCoder.defaultAbiCoder().decode(
      ["address", "uint256", "bytes32", "uint256", "tuple(bytes32,uint256,address)[]"],
      result.data,
    );

    expect(contractAddr).toBe(VAULT_CONTRACT);
    expect(vaultId).toBe(0n);
    expect(commitment).toBe(willCommitment(WILL));
    expect(price).toBe(PRICE_2_50);
    expect(bequests.length).toBeGreaterThan(0);

    // $50,000 at $2.50/XRP = 20,000 XRP = 20,000,000,000 drops.
    expect(bequests[0][1]).toBe(20_000_000_000n);
  });

  it("fails cleanly rather than partially distributing an unexecutable estate", async () => {
    const result = await handleExecute(encodeMessage({ estateDrops: 1_000n }), passthroughDecrypt);
    expect(result.status).toBe(0);
    expect(result.error).toContain("reserve");
  });

  it("rejects a tampered ciphertext whose commitment no longer matches", async () => {
    const tampered: Will = {
      ...WILL,
      bequests: [{ beneficiary: DAUGHTER, kind: "SHARE_BPS", amount: "10000" }],
    };
    // Commitment from the original will, ciphertext from the attacker's rewrite.
    const message = AbiCoder.defaultAbiCoder().encode(
      ["tuple(uint256,address,bytes32,bytes,uint256,uint256)"],
      [[0n, VAULT_CONTRACT, willCommitment(WILL), hexlify(toUtf8Bytes(JSON.stringify(tampered))), PRICE_2_50, 100_000_000_000n]],
    );

    const result = await handleExecute(message, passthroughDecrypt);
    expect(result.status).toBe(0);
    expect(result.error).toContain("does not match the commitment");
  });
});
