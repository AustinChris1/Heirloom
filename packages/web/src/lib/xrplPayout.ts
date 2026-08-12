import { standardAddressHash, xrplRequest } from "./fdc";

/**
 * The final third of the lifecycle: turning a settled distribution into real
 * XRP Ledger payments.
 *
 * Everything here is bound to what the chain already verified. Payments are
 * built from `distributionOf(vaultId)` — the TEE-signed, contract-checked
 * bequest list — with the will supplying only the mapping from address hashes
 * back to r-addresses. An address that doesn't hash to a settled bequest never
 * makes it into a payment, so the will file cannot smuggle in a beneficiary
 * the enclave didn't sign off on.
 *
 * Signing happens locally with the estate's testnet seed. In the full design
 * the enclave holds a delegated regular key and returns signed blobs; on this
 * deployment the seed-holder plays that role, and the UI says so plainly.
 */

/** A settled bequest as read from distributionOf(vaultId). */
export interface SettledBequest {
  destinationHash: string;
  drops: bigint;
  flareRecipient: string;
}

export interface PayoutPayment {
  beneficiary: string;
  drops: bigint;
  tx: Record<string, unknown>;
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const FEE_DROPS = "12";

/** Finds the XRPL account that sent this vault's heartbeats — the estate itself. */
export async function findEstateAccount(beacon: string, heartbeatTag: number): Promise<string | null> {
  const out = await xrplRequest({
    method: "account_tx",
    params: [{ account: beacon, ledger_index_min: -1, ledger_index_max: -1, limit: 200 }],
  });
  for (const entry of out?.result?.transactions ?? []) {
    const tx = entry.tx ?? entry.tx_json;
    if (tx?.TransactionType === "Payment" && Number(tx.DestinationTag) === heartbeatTag) {
      return tx.Account as string;
    }
  }
  return null;
}

/** The regular key currently authorised on an account, if any. */
export async function regularKeyOf(account: string): Promise<string | null> {
  const out = await xrplRequest({
    method: "account_info",
    params: [{ account, ledger_index: "validated" }],
  });
  return out?.result?.account_data?.RegularKey ?? null;
}

/** Balance and next sequence for an XRPL account. */
export async function accountInfo(account: string): Promise<{ balanceDrops: bigint; sequence: number }> {
  const out = await xrplRequest({
    method: "account_info",
    params: [{ account, ledger_index: "validated" }],
  });
  const data = out?.result?.account_data;
  if (!data) throw new Error(out?.result?.error_message ?? `no account data for ${account}`);
  return { balanceDrops: BigInt(data.Balance), sequence: Number(data.Sequence) };
}

function utf8ToHex(value: string): string {
  return Array.from(new TextEncoder().encode(value))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

/**
 * Builds one unsigned Payment per settled bequest.
 *
 * `willAddresses` are the candidate beneficiaries from the will file; each
 * settled hash must resolve to exactly one of them. FXRP deliveries
 * (flareRecipient set) are FAssets-side and excluded from the XRPL leg.
 */
export function buildPayoutPayments(input: {
  vaultId: number;
  estateAccount: string;
  distribution: SettledBequest[];
  willAddresses: string[];
  startSequence: number;
  lastLedgerSequence: number;
}): PayoutPayment[] {
  const byHash = new Map(input.willAddresses.map((a) => [standardAddressHash(a).toLowerCase(), a]));

  const native = input.distribution.filter(
    (b) => b.drops > 0n && b.flareRecipient.toLowerCase() === ZERO_ADDRESS,
  );

  return native.map((bequest, i) => {
    const beneficiary = byHash.get(bequest.destinationHash.toLowerCase());
    if (!beneficiary) {
      throw new Error(
        `settled bequest ${bequest.destinationHash.slice(0, 10)}… matches no address in the will file`,
      );
    }
    return {
      beneficiary,
      drops: bequest.drops,
      tx: {
        TransactionType: "Payment",
        Account: input.estateAccount,
        Destination: beneficiary,
        Amount: bequest.drops.toString(),
        Fee: FEE_DROPS,
        Sequence: input.startSequence + i,
        LastLedgerSequence: input.lastLedgerSequence,
        Memos: [
          {
            Memo: {
              MemoType: utf8ToHex("heirloom/v1"),
              MemoData: utf8ToHex(`vault:${input.vaultId};settled`),
            },
          },
        ],
      },
    };
  });
}

/** Broadcasts a signed blob. Returns the engine result, e.g. "tesSUCCESS". */
export async function submitPayment(blob: string): Promise<{ engineResult: string; message: string }> {
  const out = await xrplRequest({ method: "submit", params: [{ tx_blob: blob }] });
  const result = out?.result;
  if (!result?.engine_result) throw new Error(result?.error_message ?? "submit failed");
  return { engineResult: result.engine_result, message: result.engine_result_message ?? "" };
}
