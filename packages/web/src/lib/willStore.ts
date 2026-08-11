import { HEIRLOOM_VAULT } from "./deployment";

/**
 * Browser-local copies of wills created here, keyed by their on-chain
 * commitment.
 *
 * The chain deliberately stores only the fingerprint, so if the plaintext is
 * lost, sealing and payout need it re-supplied. Saving it in localStorage at
 * creation means the machine that wrote the will can always produce it again —
 * the download button stays for moving it to another device or keeping a
 * durable copy, but forgetting to click it is no longer fatal.
 *
 * Same privacy story as the vault-name labels: this never leaves the browser.
 */
const key = (commitment: string) => `heirloom:will:${HEIRLOOM_VAULT.toLowerCase()}:${commitment.toLowerCase()}`;

export function saveWill(commitment: string, will: unknown): void {
  try {
    localStorage.setItem(key(commitment), JSON.stringify(will));
  } catch {
    /* private browsing — the download button is the fallback */
  }
}

/** The stored will's JSON text, or empty when this browser never made it. */
export function loadWill(commitment: string): string {
  try {
    return localStorage.getItem(key(commitment)) ?? "";
  } catch {
    return "";
  }
}
