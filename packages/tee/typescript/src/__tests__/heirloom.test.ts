import { describe, expect, it } from "vitest";
import { decodeAbiParameters, encodeAbiParameters, parseAbiParameters, toHex } from "viem";
import { parseWill, Will, WillValidationError, willCommitment } from "../app/heirloom/will.js";
import { allocate } from "../app/heirloom/allocate.js";

/**
 * Verifies the viem port produces the same results as the ethers original in
 * packages/extension. The commitment in particular must be byte-identical —
 * the contract compares it against what the owner sealed, so an encoding drift
 * between client and enclave would make every settlement revert.
 */

const ESTATE = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
const DAUGHTER = "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w";
const SON = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe";
const RESIDUARY = "rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf";
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

describe("will validation", () => {
  it("accepts a well-formed will", () => {
    expect(parseWill(WILL).bequests).toHaveLength(2);
  });

  it("rejects a malformed XRPL address", () => {
    expect(() =>
      parseWill({ ...WILL, bequests: [{ beneficiary: "not-an-address", kind: "FIXED_XRP", amount: "1" }] }),
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
});

/**
 * Pinned cross-implementation vector. The client computes the commitment with
 * ethers when the owner seals a will; this enclave recomputes it with viem at
 * execution, and `settleEstate` requires them equal. Divergence would revert
 * every settlement with CommitmentMismatch, so both sides assert the same hash.
 * Twin test: packages/extension/test/commitment-vector.test.ts
 */
const PINNED_COMMITMENT = "0x70ca3ac005273bca7bb1e1d0921bc0f6813f0ff99d63deb28e4492972aa30c58";

describe("commitment", () => {
  it("matches the ethers implementation byte for byte", () => {
    expect(willCommitment(WILL)).toBe(PINNED_COMMITMENT);
  });

  it("changes when any term changes", () => {
    const edited = willCommitment({
      ...WILL,
      bequests: [{ ...WILL.bequests[0], amount: "5000001" }, WILL.bequests[1]],
    });
    expect(edited).not.toBe(willCommitment(WILL));
  });

  it("is stable across repeated encodings", () => {
    expect(willCommitment(WILL)).toBe(willCommitment(structuredClone(WILL)));
  });
});

describe("allocation", () => {
  it("prices a fixed USD bequest against the supplied FTSO figure", () => {
    const result = allocate({
      will: parseWill(WILL),
      estateDrops: 100_000_000_000n, // 100,000 XRP
      xrpUsdPriceE18: PRICE_2_50,
    });
    // $50,000 at $2.50/XRP = 20,000 XRP = 20,000,000,000 drops
    expect(result.allocations[0].drops).toBe(20_000_000_000n);
    expect(result.distributedDrops + result.retainedDrops).toBe(100_000_000_000n);
  });
});

describe("ExecuteMessage round-trip", () => {
  it("decodes the exact tuple HeirloomVault encodes", () => {
    const params = parseAbiParameters("(uint256, address, bytes32, bytes, uint256, uint256)");
    const vaultAddr = "0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A" as const;
    const commitment = willCommitment(WILL);
    const payload = toHex(JSON.stringify(WILL));

    const encoded = encodeAbiParameters(params, [
      [0n, vaultAddr, commitment, payload, PRICE_2_50, 100_000_000_000n],
    ] as never);

    const [tuple] = decodeAbiParameters(params, encoded) as unknown as [
      readonly [bigint, string, string, string, bigint, bigint],
    ];

    expect(tuple[0]).toBe(0n);
    expect(tuple[1]).toBe(vaultAddr);
    expect(tuple[2]).toBe(commitment);
    expect(JSON.parse(Buffer.from(tuple[3].slice(2), "hex").toString("utf-8")).vaultId).toBe(0);
    expect(tuple[4]).toBe(PRICE_2_50);
  });
});
