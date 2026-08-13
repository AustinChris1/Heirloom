/**
 * XRPL wallet adapters for the one transaction the owner signs himself:
 * `SetRegularKey`, authorising the enclave. XRPL has no EIP-1193 equivalent,
 * so each wallet gets an adapter behind one interface.
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
  /** Diagnostic 1-drop self-payment: isolates "refuses this type" from "cannot sign at all". */
  testSign?: (account: string) => Promise<{ hash: string | null; engineResult: string }>;
  /** Forgets a cached session so the next `address()` re-prompts (Xaman is sticky). */
  disconnect?: () => Promise<void>;
}

/* ---------------------------------------------------------------- */
/* Crossmark                                                         */
/* ---------------------------------------------------------------- */

/** Crossmark moved these between namespaces across versions. */
function crossmarkApi(): CrossmarkMethods {
  const cm = window.crossmark;
  const m = cm?.methods ?? cm?.async;
  if (!m) throw new Error("Crossmark is not available in this browser.");
  return m;
}

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
          "Crossmark returned no address, make sure an account is created and the wallet is unlocked.",
      );
    }
    return address;
  },
  setRegularKey: async (account, regularKey) => {
    const submit = crossmarkApi().signAndSubmitAndWait;
    if (!submit) throw new Error("This Crossmark version cannot submit transactions.");

    // Account omitted: Crossmark fills it from the active card.
    void account;
    const res = await submit({ TransactionType: "SetRegularKey", RegularKey: regularKey });
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
  testSign: async (account) => {
    const submit = crossmarkApi().signAndSubmitAndWait;
    if (!submit) throw new Error("This Crossmark version cannot submit transactions.");
    const res = await submit({ TransactionType: "Payment", Destination: account, Amount: "1" });
    const failure = crossmarkError(res);
    if (failure) throw new Error(failure);
    const meta = res?.response?.data?.meta ?? res?.data?.meta ?? res?.meta;
    const resp = res?.response?.data?.resp ?? res?.data?.resp ?? res?.response ?? res;
    return {
      hash: resp?.result?.hash ?? resp?.hash ?? null,
      engineResult: resp?.result?.engine_result ?? (meta?.isSuccess ? "tesSUCCESS" : "unknown"),
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
    if (!address) throw new Error("GemWallet did not return an address, is it unlocked?");
    return address;
  },
  setRegularKey: async (account, regularKey) => {
    // GemWallet's first-class helper; more reliable than generic submitTransaction.
    void account;
    const { setRegularKey } = await import("@gemwallet/api");
    const res = await setRegularKey({ regularKey });
    const hash = (res?.result as { hash?: string } | undefined)?.hash ?? null;
    if (!hash) throw new Error("GemWallet did not confirm the transaction.");
    return { hash, engineResult: "tesSUCCESS" };
  },
  testSign: async (account) => {
    const { sendPayment } = await import("@gemwallet/api");
    const res = await sendPayment({ amount: "1", destination: account });
    const hash = (res?.result as { hash?: string } | undefined)?.hash ?? null;
    if (!hash) throw new Error("GemWallet did not confirm the test payment.");
    return { hash, engineResult: "tesSUCCESS" };
  },
};

/* ---------------------------------------------------------------- */
/* Xaman (ex-XUMM)                                                   */
/* ---------------------------------------------------------------- */

/**
 * Xaman signs on the phone via its hosted API, so it needs a (public-safe) API
 * key from apps.xaman.dev. Gated behind VITE_XAMAN_API_KEY.
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
    if (!sdk.payload) throw new Error("Xaman payloads unavailable, sign in first.");

    const { created, resolved } = await sdk.payload.createAndSubscribe(
      {
        txjson: { TransactionType: "SetRegularKey", Account: account, RegularKey: regularKey },
        // Without this, payloads validate against the profile's network (mainnet).
        options: { force_network: "TESTNET" },
      } as never,
      (event: any) => {
        if (typeof event?.data?.signed !== "undefined") return event.data;
      },
    );

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

/** GemWallet first: the one verified signing SetRegularKey without app verification. */
export const WALLETS: WalletAdapter[] = [gemwallet, crossmark, xaman];

/** Every wallet currently present in this browser. */
export async function detectWallets(): Promise<WalletAdapter[]> {
  const found = await Promise.all(
    WALLETS.map(async (w) => ((await w.detect().catch(() => false)) ? w : null)),
  );
  return found.filter((w): w is WalletAdapter => w !== null);
}
