import { HEIRLOOM_VAULT } from "./deployment";

/**
 * Browser-local copies of wills, keyed by commitment. The chain stores only
 * the fingerprint, so sealing and payout need the plaintext re-supplied;
 * keeping it here means forgetting the download is not fatal. Never leaves the browser.
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
