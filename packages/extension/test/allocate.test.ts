import { describe, expect, it } from "vitest";
import { allocate, AllocationError, centsToDrops, DEFAULT_BASE_RESERVE_DROPS, DEFAULT_FEE_PER_TX_DROPS } from "../src/allocate";
import { Will } from "../src/will";

// Valid XRPL testnet-style classic addresses.
const ESTATE = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh";
const DAUGHTER = "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w";
const SON = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe";
const CHARITY = "rDNvpqSzJzk8wtHTUiTSHtdvJHhpzurwPP";
const RESIDUARY = "rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf";

const PRICE_2_50 = 2_500_000_000_000_000_000n; // $2.50 / XRP

function will(bequests: Will["bequests"]): Will {
  return { vaultId: 0, estateAccount: ESTATE, bequests, residuaryBeneficiary: RESIDUARY };
}

/** Reserve plus one fee per payment, including the residue payment. */
function reservedFor(paymentCount: number): bigint {
  return DEFAULT_BASE_RESERVE_DROPS + BigInt(paymentCount) * DEFAULT_FEE_PER_TX_DROPS;
}

describe("centsToDrops", () => {
  it("converts a dollar amount at the FTSO price", () => {
    // $100.00 at $2.50/XRP = 40 XRP = 40,000,000 drops
    expect(centsToDrops(10_000n, PRICE_2_50)).toBe(40_000_000n);
  });

  it("rejects a non-positive price", () => {
    expect(() => centsToDrops(100n, 0n)).toThrow(AllocationError);
  });
});

describe("allocate", () => {
  it("pays a fixed USD bequest and sweeps the rest to the residuary beneficiary", () => {
    const estate = 100_000_000n; // 100 XRP
    const result = allocate({
      will: will([{ beneficiary: DAUGHTER, kind: "FIXED_USD", amount: "10000" }]), // $100
      estateDrops: estate,
      xrpUsdPriceE18: PRICE_2_50,
    });

    expect(result.abatementApplied).toBe(false);
    expect(result.allocations[0]).toMatchObject({ beneficiary: DAUGHTER, drops: 40_000_000n, source: "FIXED_USD" });

    const residue = result.allocations.find((a) => a.source === "RESIDUE");
    expect(residue?.beneficiary).toBe(RESIDUARY);
    expect(result.distributedDrops + result.retainedDrops).toBe(estate);
  });

  it("splits the remainder by basis points after fixed bequests", () => {
    const estate = 100_000_000n; // 100 XRP
    const result = allocate({
      will: will([
        { beneficiary: DAUGHTER, kind: "FIXED_XRP", amount: "20000000" }, // 20 XRP
        { beneficiary: SON, kind: "SHARE_BPS", amount: "6000" }, // 60% of what's left
        { beneficiary: CHARITY, kind: "SHARE_BPS", amount: "4000" }, // 40% of what's left
      ]),
      estateDrops: estate,
      xrpUsdPriceE18: PRICE_2_50,
    });

    const reserved = reservedFor(4);
    const remainder = estate - reserved - 20_000_000n;

    expect(result.allocations.find((a) => a.beneficiary === DAUGHTER)?.drops).toBe(20_000_000n);
    expect(result.allocations.find((a) => a.beneficiary === SON)?.drops).toBe((remainder * 6000n) / 10_000n);
    expect(result.allocations.find((a) => a.beneficiary === CHARITY)?.drops).toBe((remainder * 4000n) / 10_000n);
    expect(result.distributedDrops + result.retainedDrops).toBe(estate);
  });

  it("abates fixed bequests proportionally when the estate falls short", () => {
    // Wants 100 XRP of fixed bequests but only ~50 XRP is distributable.
    const estate = 50_000_000n;
    const result = allocate({
      will: will([
        { beneficiary: DAUGHTER, kind: "FIXED_XRP", amount: "75000000" }, // 75 XRP
        { beneficiary: SON, kind: "FIXED_XRP", amount: "25000000" }, // 25 XRP
      ]),
      estateDrops: estate,
      xrpUsdPriceE18: PRICE_2_50,
    });

    expect(result.abatementApplied).toBe(true);

    const daughter = result.allocations.find((a) => a.beneficiary === DAUGHTER)!;
    const son = result.allocations.find((a) => a.beneficiary === SON)!;

    // The 75/25 ratio from the will survives the shortfall.
    expect(daughter.drops * 25n).toBeGreaterThanOrEqual(son.drops * 75n - 100n);
    expect(daughter.drops * 25n).toBeLessThanOrEqual(son.drops * 75n + 100n);
    expect(daughter.abated).toBe(true);
    expect(result.distributedDrops + result.retainedDrops).toBe(estate);
  });

  it("never distributes more than the estate holds, at any price", () => {
    // A crashed XRP price inflates every USD-denominated bequest.
    const estate = 10_000_000n; // 10 XRP
    const crashedPrice = 100_000_000_000_000_000n; // $0.10 / XRP
    const result = allocate({
      will: will([
        { beneficiary: DAUGHTER, kind: "FIXED_USD", amount: "5000000" }, // $50,000
        { beneficiary: SON, kind: "FIXED_USD", amount: "5000000" },
      ]),
      estateDrops: estate,
      xrpUsdPriceE18: crashedPrice,
    });

    expect(result.abatementApplied).toBe(true);
    expect(result.distributedDrops).toBeLessThanOrEqual(estate);
    expect(result.distributedDrops + result.retainedDrops).toBe(estate);
  });

  it("keeps the XRPL account reserve and fees untouched", () => {
    const estate = 100_000_000n;
    const result = allocate({
      will: will([{ beneficiary: DAUGHTER, kind: "SHARE_BPS", amount: "10000" }]),
      estateDrops: estate,
      xrpUsdPriceE18: PRICE_2_50,
    });

    expect(result.retainedDrops).toBe(reservedFor(2));
    expect(result.retainedDrops).toBeGreaterThanOrEqual(DEFAULT_BASE_RESERVE_DROPS);
  });

  it("refuses to execute an estate too small to cover the reserve", () => {
    expect(() =>
      allocate({
        will: will([{ beneficiary: DAUGHTER, kind: "SHARE_BPS", amount: "10000" }]),
        estateDrops: 500_000n, // below the 1 XRP reserve
        xrpUsdPriceE18: PRICE_2_50,
      }),
    ).toThrow(AllocationError);
  });

  it("conserves every drop across a mixed will", () => {
    const estate = 987_654_321n;
    const result = allocate({
      will: will([
        { beneficiary: DAUGHTER, kind: "FIXED_USD", amount: "12345" },
        { beneficiary: SON, kind: "FIXED_XRP", amount: "7777777" },
        { beneficiary: CHARITY, kind: "SHARE_BPS", amount: "3333" },
      ]),
      estateDrops: estate,
      xrpUsdPriceE18: PRICE_2_50,
    });

    const summed = result.allocations.reduce((s, a) => s + a.drops, 0n);
    expect(summed).toBe(result.distributedDrops);
    expect(summed + result.retainedDrops).toBe(estate);
  });
});
