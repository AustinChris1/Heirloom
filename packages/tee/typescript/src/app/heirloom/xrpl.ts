import { Allocation } from "./allocate.js";

/**
 * XRPL Payment assembly.
 *
 * The enclave builds these transactions but never holds the estate's seed in a
 * form that can leave it: signing happens through the TEE node's sign port, so
 * the key material stays inside the hardware boundary. What comes back out is a
 * signed blob that anyone may broadcast — publishing it grants no further power
 * than executing the will the owner already sealed.
 */

export interface XrplPayment {
  TransactionType: "Payment";
  Account: string;
  Destination: string;
  /** Drops, as the decimal string XRPL expects. */
  Amount: string;
  Fee: string;
  Sequence: number;
  /** Identifies the vault this distribution settles, for off-chain reconciliation. */
  DestinationTag?: number;
  LastLedgerSequence?: number;
  Memos?: Array<{ Memo: { MemoData: string; MemoType?: string } }>;
}

export interface BuildPaymentsInput {
  estateAccount: string;
  allocations: Allocation[];
  /** Account sequence to start from; each payment consumes one. */
  startSequence: number;
  feePerTxDrops: bigint;
  /** Ledger index after which unexecuted payments expire. */
  lastLedgerSequence?: number;
  vaultId: number;
}

const MEMO_TYPE = utf8ToHex("heirloom/v1");

/**
 * Builds one Payment per allocation, in a fixed order.
 *
 * Sequence numbers are assigned deterministically so two independent TEE
 * machines executing the same will produce byte-identical transactions. That
 * determinism is what lets a distribution be cross-checked across enclaves
 * instead of trusted from a single one.
 */
export function buildPayments(input: BuildPaymentsInput): XrplPayment[] {
  const { estateAccount, allocations, startSequence, feePerTxDrops, lastLedgerSequence, vaultId } = input;

  return allocations
    .filter((a) => a.drops > 0n)
    .map((allocation, i) => {
      const payment: XrplPayment = {
        TransactionType: "Payment",
        Account: estateAccount,
        Destination: allocation.beneficiary,
        Amount: allocation.drops.toString(),
        Fee: feePerTxDrops.toString(),
        Sequence: startSequence + i,
        Memos: [
          {
            Memo: {
              MemoType: MEMO_TYPE,
              MemoData: utf8ToHex(`vault:${vaultId};clause:${allocation.source}`),
            },
          },
        ],
      };
      if (lastLedgerSequence !== undefined) {
        payment.LastLedgerSequence = lastLedgerSequence;
      }
      return payment;
    });
}

export function utf8ToHex(value: string): string {
  return Buffer.from(value, "utf8").toString("hex").toUpperCase();
}
