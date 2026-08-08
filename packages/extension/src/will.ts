import { AbiCoder, keccak256, toUtf8Bytes } from "ethers";
import { isValidClassicAddress } from "ripple-address-codec";

/**
 * The sealed will. This structure only ever exists in plaintext inside the
 * enclave — on Flare it is represented by `willCommitment`, a keccak256 over its
 * canonical ABI encoding.
 */

export const DROPS_PER_XRP = 1_000_000n;

/** How a single bequest is denominated. */
export type BequestKind =
  /** A fixed sum in US cents, converted at the FTSO XRP/USD price at execution. */
  | "FIXED_USD"
  /** A fixed number of drops. */
  | "FIXED_XRP"
  /** A share of whatever remains after fixed bequests, in basis points. */
  | "SHARE_BPS";

export interface WillBequest {
  /** Beneficiary's XRPL classic address (r-address). */
  beneficiary: string;
  /** Optional Flare address; when set the share is delivered as FXRP instead of native XRP. */
  flareRecipient?: string;
  kind: BequestKind;
  /** US cents, drops, or basis points depending on `kind`. Decimal string. */
  amount: string;
}

export interface Will {
  vaultId: number;
  /** XRPL classic address holding the estate. */
  estateAccount: string;
  bequests: WillBequest[];
  /** Receives anything left over after fixed bequests and shares. */
  residuaryBeneficiary: string;
}

export class WillValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WillValidationError";
  }
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const MAX_BEQUESTS = 64;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new WillValidationError(message);
}

function parseAmount(raw: unknown, field: string): bigint {
  assert(typeof raw === "string" && /^\d+$/.test(raw), `${field} must be a non-negative integer string`);
  const value = BigInt(raw as string);
  assert(value > 0n, `${field} must be greater than zero`);
  return value;
}

/**
 * Parses and validates an untrusted will payload.
 *
 * Everything arriving at the extension is externally supplied, so this rejects
 * rather than coerces: unknown shapes, malformed XRPL addresses, zero amounts,
 * and share totals above 100% all fail loudly. A will that cannot be executed
 * unambiguously must never reach the point where it moves funds.
 */
export function parseWill(raw: unknown): Will {
  assert(typeof raw === "object" && raw !== null, "will must be an object");
  const obj = raw as Record<string, unknown>;

  assert(typeof obj.vaultId === "number" && Number.isInteger(obj.vaultId) && obj.vaultId >= 0, "vaultId must be a non-negative integer");
  assert(typeof obj.estateAccount === "string" && isValidClassicAddress(obj.estateAccount), "estateAccount must be a valid XRPL classic address");
  assert(
    typeof obj.residuaryBeneficiary === "string" && isValidClassicAddress(obj.residuaryBeneficiary),
    "residuaryBeneficiary must be a valid XRPL classic address",
  );
  assert(Array.isArray(obj.bequests) && obj.bequests.length > 0, "will must contain at least one bequest");
  assert(obj.bequests.length <= MAX_BEQUESTS, `will may contain at most ${MAX_BEQUESTS} bequests`);

  let totalShareBps = 0n;
  const bequests: WillBequest[] = obj.bequests.map((entry, i) => {
    assert(typeof entry === "object" && entry !== null, `bequest ${i} must be an object`);
    const b = entry as Record<string, unknown>;

    assert(
      typeof b.beneficiary === "string" && isValidClassicAddress(b.beneficiary),
      `bequest ${i}: beneficiary must be a valid XRPL classic address`,
    );
    assert(
      b.kind === "FIXED_USD" || b.kind === "FIXED_XRP" || b.kind === "SHARE_BPS",
      `bequest ${i}: kind must be FIXED_USD, FIXED_XRP or SHARE_BPS`,
    );

    const amount = parseAmount(b.amount, `bequest ${i}: amount`);
    if (b.kind === "SHARE_BPS") {
      totalShareBps += amount;
    }

    let flareRecipient: string | undefined;
    if (b.flareRecipient !== undefined && b.flareRecipient !== null && b.flareRecipient !== "") {
      assert(
        typeof b.flareRecipient === "string" && /^0x[0-9a-fA-F]{40}$/.test(b.flareRecipient),
        `bequest ${i}: flareRecipient must be a 20-byte hex address`,
      );
      flareRecipient = b.flareRecipient;
    }

    return { beneficiary: b.beneficiary as string, flareRecipient, kind: b.kind as BequestKind, amount: amount.toString() };
  });

  assert(totalShareBps <= 10_000n, "share bequests may not exceed 100% (10000 bps) in total");

  return {
    vaultId: obj.vaultId as number,
    estateAccount: obj.estateAccount as string,
    bequests,
    residuaryBeneficiary: obj.residuaryBeneficiary as string,
  };
}

/**
 * Canonical commitment over a will.
 *
 * The owner computes this client-side and stores it on Flare before dying; the
 * enclave recomputes it from the decrypted plaintext at execution time and the
 * contract requires the two to match. That binding is what stops a tampered or
 * substituted will from settling — the encrypted blob can be swapped, but not
 * without changing this hash.
 *
 * The encoding is ABI, not JSON, so the same commitment is reproducible from
 * Solidity and from any other client.
 */
export function willCommitment(will: Will): string {
  const encoded = AbiCoder.defaultAbiCoder().encode(
    ["uint256", "string", "string", "tuple(string,address,uint8,uint256)[]"],
    [
      will.vaultId,
      will.estateAccount,
      will.residuaryBeneficiary,
      will.bequests.map((b) => [
        b.beneficiary,
        b.flareRecipient ?? ZERO_ADDRESS,
        kindToEnum(b.kind),
        BigInt(b.amount),
      ]),
    ],
  );
  return keccak256(encoded);
}

export function kindToEnum(kind: BequestKind): number {
  switch (kind) {
    case "FIXED_USD":
      return 0;
    case "FIXED_XRP":
      return 1;
    case "SHARE_BPS":
      return 2;
  }
}

/** XRPL standard address hash used by FDC attestations: keccak256 of the address string. */
export function standardAddressHash(address: string): string {
  return keccak256(toUtf8Bytes(address));
}
