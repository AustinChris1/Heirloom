import { Will, WillBequest } from "./will.js";

/**
 * Turns a will plus a live XRP/USD price into an exact set of XRPL payments.
 *
 * All arithmetic is integer arithmetic over drops. Nothing here may lose or
 * invent a drop: the sum of every allocation plus the untouched reserve and
 * fees must equal the estate exactly, and `allocate` asserts that before
 * returning.
 */

export const DEFAULT_BASE_RESERVE_DROPS = 1_000_000n; // 1 XRP — XRPL account reserve
export const DEFAULT_FEE_PER_TX_DROPS = 12n;

export interface AllocationInput {
  will: Will;
  /** Total drops held by the estate account. */
  estateDrops: bigint;
  /** FTSO XRP/USD price scaled to 18 decimals. */
  xrpUsdPriceE18: bigint;
  baseReserveDrops?: bigint;
  feePerTxDrops?: bigint;
}

export interface Allocation {
  beneficiary: string;
  flareRecipient?: string;
  drops: bigint;
  /** Which clause produced this line, for the audit trail. */
  source: "FIXED_USD" | "FIXED_XRP" | "SHARE_BPS" | "RESIDUE";
  /** True when the estate could not cover the fixed bequests in full. */
  abated: boolean;
}

export interface AllocationResult {
  allocations: Allocation[];
  /** Drops left untouched on the XRPL account (reserve + fees). */
  retainedDrops: bigint;
  /** Total drops actually distributed. */
  distributedDrops: bigint;
  /** True if fixed bequests had to be scaled down. */
  abatementApplied: boolean;
}

export class AllocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AllocationError";
  }
}

/** Converts US cents to drops at an 18-decimal XRP/USD price. */
export function centsToDrops(cents: bigint, xrpUsdPriceE18: bigint): bigint {
  if (xrpUsdPriceE18 <= 0n) throw new AllocationError("XRP/USD price must be positive");
  // drops = cents / 100 / (price / 1e18) * 1e6  =  cents * 1e22 / price
  return (cents * 10n ** 22n) / xrpUsdPriceE18;
}

/**
 * Computes the distribution.
 *
 * Order follows how estates actually settle: fixed bequests are satisfied
 * first, then percentage shares of what remains, then the residue. When the
 * estate cannot cover every fixed bequest — because XRP fell, or the holder
 * spent down the account after writing the will — the fixed bequests **abate**
 * proportionally rather than being paid first-come-first-served. Without that
 * rule the beneficiary listed first would take everything and the rest would
 * get nothing, which is both unfair and not what the testator wrote.
 */
export function allocate(input: AllocationInput): AllocationResult {
  const { will, estateDrops, xrpUsdPriceE18 } = input;
  const baseReserve = input.baseReserveDrops ?? DEFAULT_BASE_RESERVE_DROPS;
  const feePerTx = input.feePerTxDrops ?? DEFAULT_FEE_PER_TX_DROPS;

  if (estateDrops < 0n) throw new AllocationError("estateDrops must not be negative");
  if (xrpUsdPriceE18 <= 0n) throw new AllocationError("XRP/USD price must be positive");

  const fixed = will.bequests.filter((b) => b.kind === "FIXED_USD" || b.kind === "FIXED_XRP");
  const shares = will.bequests.filter((b) => b.kind === "SHARE_BPS");

  // One payment per fixed/share bequest, plus one for the residue.
  const paymentCount = BigInt(fixed.length + shares.length + 1);
  const reserved = baseReserve + paymentCount * feePerTx;

  if (estateDrops <= reserved) {
    throw new AllocationError(
      `estate of ${estateDrops} drops cannot cover the account reserve and fees (${reserved} drops)`,
    );
  }
  const distributable = estateDrops - reserved;

  // --- Fixed bequests, with abatement if the estate falls short ---

  const fixedRequests = fixed.map((b) => ({ bequest: b, want: fixedAmountInDrops(b, xrpUsdPriceE18) }));
  const totalFixedWanted = fixedRequests.reduce((sum, f) => sum + f.want, 0n);

  const abatementApplied = totalFixedWanted > distributable;
  const allocations: Allocation[] = [];
  let paid = 0n;

  for (const { bequest, want } of fixedRequests) {
    // Proportional abatement. Integer division floors, so the estate can never
    // be over-committed; the shortfall lands in the residue below.
    const give = abatementApplied ? (want * distributable) / totalFixedWanted : want;
    paid += give;
    allocations.push({
      beneficiary: bequest.beneficiary,
      flareRecipient: bequest.flareRecipient,
      drops: give,
      source: bequest.kind as "FIXED_USD" | "FIXED_XRP",
      abated: abatementApplied,
    });
  }

  // --- Percentage shares of what survives the fixed bequests ---

  const remainder = distributable - paid;
  for (const bequest of shares) {
    const give = (remainder * BigInt(bequest.amount)) / 10_000n;
    paid += give;
    allocations.push({
      beneficiary: bequest.beneficiary,
      flareRecipient: bequest.flareRecipient,
      drops: give,
      source: "SHARE_BPS",
      abated: false,
    });
  }

  // --- Residue, including every drop lost to flooring above ---

  const residue = distributable - paid;
  if (residue > 0n) {
    allocations.push({
      beneficiary: will.residuaryBeneficiary,
      drops: residue,
      source: "RESIDUE",
      abated: false,
    });
    paid += residue;
  }

  const nonZero = allocations.filter((a) => a.drops > 0n);
  const distributed = nonZero.reduce((sum, a) => sum + a.drops, 0n);

  // Conservation check: nothing created, nothing lost.
  if (distributed + reserved !== estateDrops) {
    throw new AllocationError(
      `allocation does not conserve the estate: ${distributed} + ${reserved} != ${estateDrops}`,
    );
  }

  return {
    allocations: nonZero,
    retainedDrops: reserved,
    distributedDrops: distributed,
    abatementApplied,
  };
}

function fixedAmountInDrops(bequest: WillBequest, xrpUsdPriceE18: bigint): bigint {
  const amount = BigInt(bequest.amount);
  return bequest.kind === "FIXED_USD" ? centsToDrops(amount, xrpUsdPriceE18) : amount;
}
