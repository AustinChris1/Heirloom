import { describe, expect, it } from "vitest";
import { Will, willCommitment } from "../src/will";

/**
 * Cross-implementation commitment vector.
 *
 * The commitment is computed twice in production by two different libraries:
 * the client (ethers, here and in the web app) computes it when the owner seals
 * a will, and the enclave (viem, in packages/tee) recomputes it at execution.
 * `HeirloomVault.settleEstate` requires the two to be equal.
 *
 * If these ever diverge, every settlement reverts with CommitmentMismatch — so
 * both sides pin the same vector. The twin of this test lives at
 * packages/tee/typescript/src/__tests__/heirloom.test.ts.
 */
export const VECTOR_WILL: Will = {
  vaultId: 0,
  estateAccount: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  bequests: [
    { beneficiary: "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w", kind: "FIXED_USD", amount: "5000000" },
    { beneficiary: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe", kind: "SHARE_BPS", amount: "10000" },
  ],
  residuaryBeneficiary: "rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf",
};

/** Verified equal across both implementations on 2026-08-08. */
export const PINNED_COMMITMENT = "0x70ca3ac005273bca7bb1e1d0921bc0f6813f0ff99d63deb28e4492972aa30c58";

describe("commitment vector (ethers side)", () => {
  it("matches the pinned cross-implementation vector", () => {
    expect(willCommitment(VECTOR_WILL)).toBe(PINNED_COMMITMENT);
  });
});
