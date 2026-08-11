import { HEIRLOOM_VAULT } from "./deployment";

/**
 * Private vault labels.
 *
 * Deliberately browser-local: a name on-chain would leak intent ("for my
 * daughter") next to a system whose whole point is that nobody learns anything
 * until execution. localStorage gives the owner "Mom's vault" on their own
 * screen while every other visitor still sees just the number.
 */
const key = (id: number) => `heirloom:name:${HEIRLOOM_VAULT.toLowerCase()}:${id}`;

export function loadVaultName(id: number): string {
  try {
    return localStorage.getItem(key(id)) ?? "";
  } catch {
    return "";
  }
}

export function saveVaultName(id: number, name: string): void {
  try {
    const trimmed = name.trim().slice(0, 48);
    if (trimmed) localStorage.setItem(key(id), trimmed);
    else localStorage.removeItem(key(id));
  } catch {
    /* private browsing — labels just don't persist */
  }
}
