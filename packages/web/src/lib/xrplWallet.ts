/**
 * XRPL wallet adapters, for the one transaction the owner signs himself:
 * authorising the enclave as his estate's regular key.
 *
 * This step must never involve a pasted seed. `SetRegularKey` is an ordinary
 * XRPL transaction, so the owner approves it in whatever wallet he already
 * uses — the key stays there, and this page only ever sees a hash.
 *
 * XRPL has no single connector standard (no EIP-1193 equivalent), so each
 * wallet gets a small adapter behind one interface. Adding another is a matter
 * of writing `detect`, `address`, and `setRegularKey`.
 *
 *   Crossmark  — injected at `window.crossmark`
 *   GemWallet  — official API package, message-based
 *   Xaman      — needs a hosted API key; documented, not wired here
 */

declare global {
  interface Window {
    crossmark?: {
      methods?: CrossmarkMethods;
      async?: CrossmarkMethods;
    };
  }
}

interface CrossmarkMethods {
  signInAndWait?: () => Promise<any>;
  signAndSubmitAndWait?: (tx: Record<string, unknown>) => Promise<any>;
}

export interface WalletAdapter {
  id: string;
  name: string;
  installUrl: string;
  /** Whether this wallet is present in the browser right now. */
  detect: () => Promise<boolean>;
  /** Prompts for connection and returns the active account. */
  address: () => Promise<string>;
  /** Signs and submits SetRegularKey. Returns the ledger outcome. */
  setRegularKey: (account: string, regularKey: string) => Promise<{ hash: string | null; engineResult: string }>;
  /**
   * Forgets the cached session, so the next `address()` genuinely re-prompts.
   * Matters for wallets with sticky sign-ins (Xaman): connecting the wrong
   * account must be recoverable by just trying again.
   */
  disconnect?: () => Promise<void>;
}

/* ---------------------------------------------------------------- */
/* Crossmark                                                         */
/* ---------------------------------------------------------------- */

/** Crossmark has moved these between namespaces across versions; accept either. */
function crossmarkApi(): CrossmarkMethods {
  const cm = window.crossmark;
  const m = cm?.methods ?? cm?.async;
  if (!m) throw new Error("Crossmark is not available in this browser.");
  return m;
}

/** Surfaces the wallet's own complaint rather than a generic failure. */
function crossmarkError(res: any): string | null {
  const meta = res?.response?.data?.meta ?? res?.data?.meta ?? res?.meta;
  if (meta?.isRejected) return "You rejected the request in Crossmark.";
  return (
    res?.response?.data?.errorMessage ??
    res?.response?.errorMessage ??
    res?.data?.errorMessage ??
    res?.errorMessage ??
    res?.error?.message ??
    null
  );
}

const crossmark: WalletAdapter = {
  id: "crossmark",
  name: "Crossmark",
  installUrl: "https://crossmark.io",
  detect: async () => typeof window !== "undefined" && !!window.crossmark,
  address: async () => {
    const signIn = crossmarkApi().signInAndWait;
    if (!signIn) throw new Error("This Crossmark version cannot sign in.");
    const res = await signIn();
    const address =
      res?.response?.data?.address ?? res?.data?.address ?? res?.response?.address ?? res?.address ?? null;
    if (!address) {
      throw new Error(
        crossmarkError(res) ??
          "Crossmark returned no address — make sure an account is created and the wallet is unlocked.",
      );
    }
    return address;
  },
  setRegularKey: async (account, regularKey) => {
    const submit = crossmarkApi().signAndSubmitAndWait;
    if (!submit) throw new Error("This Crossmark version cannot submit transactions.");

    const res = await submit({ TransactionType: "SetRegularKey", Account: account, RegularKey: regularKey });
    const failure = crossmarkError(res);
    if (failure) throw new Error(failure);

    const meta = res?.response?.data?.meta ?? res?.data?.meta ?? res?.meta;
    const resp = res?.response?.data?.resp ?? res?.data?.resp ?? res?.response ?? res;
    return {
      hash: resp?.result?.hash ?? resp?.result?.tx_json?.hash ?? resp?.hash ?? null,
      engineResult:
        resp?.result?.engine_result ??
        resp?.result?.meta?.TransactionResult ??
        resp?.engine_result ??
        (meta?.isSuccess ? "tesSUCCESS" : "unknown"),
    };
  },
};

/* ---------------------------------------------------------------- */
/* GemWallet                                                         */
/* ---------------------------------------------------------------- */

const gemwallet: WalletAdapter = {
  id: "gemwallet",
  name: "GemWallet",
  installUrl: "https://gemwallet.app",
  detect: async () => {
    try {
      const { isInstalled } = await import("@gemwallet/api");
      return (await isInstalled()).result.isInstalled;
    } catch {
      return false;
    }
  },
  address: async () => {
    const { getAddress } = await import("@gemwallet/api");
    const res = await getAddress();
    const address = res?.result?.address;
    if (!address) throw new Error("GemWallet did not return an address — is it unlocked?");
    return address;
  },
  setRegularKey: async (account, regularKey) => {
    const { submitTransaction } = await import("@gemwallet/api");
    const res = await submitTransaction({
      transaction: { TransactionType: "SetRegularKey", Account: account, RegularKey: regularKey } as never,
    });
    const hash = (res?.result as { hash?: string } | undefined)?.hash ?? null;
    if (!hash) throw new Error("GemWallet did not confirm the transaction.");
    return { hash, engineResult: "tesSUCCESS" };
  },
};

/* ---------------------------------------------------------------- */
/* Xaman (ex-XUMM)                                                   */
/* ---------------------------------------------------------------- */

/**
 * Xaman is not an extension: sign requests travel through Xaman's hosted API
 * and the owner approves on their phone. That needs a (free) API key from
 * apps.xaman.dev with this site's origin allowed, so the adapter is gated
 * behind VITE_XAMAN_API_KEY — the button simply doesn't exist until a key is
 * configured. The key is public-safe: it identifies the app, it signs nothing.
 */
let xummSdk: any | null = null;

async function xumm(): Promise<any> {
  if (!xummSdk) {
    const key = import.meta.env.VITE_XAMAN_API_KEY as string | undefined;
    if (!key) throw new Error("Xaman is not configured on this deployment.");
    const { Xumm } = await import("xumm");
    xummSdk = new Xumm(key);
  }
  return xummSdk;
}

const xaman: WalletAdapter = {
  id: "xaman",
  name: "Xaman",
  installUrl: "https://xaman.app",
  detect: async () => !!import.meta.env.VITE_XAMAN_API_KEY,
  address: async () => {
    const sdk = await xumm();
    await sdk.authorize(); // popup → scan once with the Xaman app
    const account = await sdk.user.account;
    if (!account) throw new Error("Xaman sign-in did not return an account.");
    return account;
  },
  setRegularKey: async (account, regularKey) => {
    const sdk = await xumm();
    if (!sdk.payload) throw new Error("Xaman payloads unavailable — sign in first.");

    const { created, resolved } = await sdk.payload.createAndSubscribe(
      { txjson: { TransactionType: "SetRegularKey", Account: account, RegularKey: regularKey } },
      (event: any) => {
        if (typeof event?.data?.signed !== "undefined") return event.data;
      },
    );

    // Signed-in users get a push notification; the sign page covers everyone
    // else (QR on desktop, deeplink on the phone itself).
    if (created?.next?.always) window.open(created.next.always, "_blank", "noopener");

    const outcome: any = await resolved;
    if (!outcome?.signed) throw new Error("You declined the request in Xaman.");

    const result = await sdk.payload.get(created.uuid);
    return {
      hash: result?.response?.txid ?? null,
      engineResult: result?.response?.dispatched_result ?? "tesSUCCESS",
    };
  },
  disconnect: async () => {
    const sdk = await xumm();
    await sdk.logout();
    xummSdk = null; // next use builds a fresh session
  },
};

/* ---------------------------------------------------------------- */

export const WALLETS: WalletAdapter[] = [xaman, crossmark, gemwallet];

/** Every wallet currently present in this browser. */
export async function detectWallets(): Promise<WalletAdapter[]> {
  const found = await Promise.all(
    WALLETS.map(async (w) => ((await w.detect().catch(() => false)) ? w : null)),
  );
  return found.filter((w): w is WalletAdapter => w !== null);
}
