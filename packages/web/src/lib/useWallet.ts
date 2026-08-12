import { JsonRpcSigner } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { COSTON2_CHAIN_ID, connect, hasWallet, switchToCoston2 } from "./wallet";

/** Marks that the user connected here, so reloads can reattach without prompting. */
const CONNECTED_KEY = "heirloom:wallet-connected";

export interface WalletState {
  address: string | null;
  chainId: number | null;
  signer: JsonRpcSigner | null;
  connecting: boolean;
  error: string | null;
  onCoston2: boolean;
  available: boolean;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    signer: null,
    connecting: false,
    error: null,
    onCoston2: false,
    available: hasWallet(),
  });

  const doConnect = useCallback(async () => {
    setState((s) => ({ ...s, connecting: true, error: null }));
    try {
      const { signer, address, chainId } = await connect();
      try {
        localStorage.setItem(CONNECTED_KEY, "1");
      } catch {
        /* private browsing — session-only connection is fine */
      }
      setState((s) => ({
        ...s,
        signer,
        address,
        chainId,
        connecting: false,
        onCoston2: chainId === COSTON2_CHAIN_ID,
      }));
    } catch (err) {
      setState((s) => ({ ...s, connecting: false, error: (err as Error).message }));
    }
  }, []);

  const doSwitch = useCallback(async () => {
    try {
      await switchToCoston2();
      await doConnect();
    } catch (err) {
      setState((s) => ({ ...s, error: (err as Error).message }));
    }
  }, [doConnect]);

  const disconnect = useCallback(() => {
    try {
      localStorage.removeItem(CONNECTED_KEY);
    } catch {
      /* private browsing */
    }
    setState((s) => ({ ...s, address: null, signer: null, chainId: null, onCoston2: false }));
  }, []);

  /**
   * Reconnect silently on load.
   *
   * A wallet the user already authorised stays authorised across reloads —
   * `eth_accounts` returns it without prompting. Without this the app looks
   * disconnected after every refresh, which is both wrong and alarming
   * mid-flow. Only reconnects if the user connected here before, so a visitor
   * who never clicked Connect is not silently attached to a page.
   */
  useEffect(() => {
    if (!hasWallet()) return;
    let cancelled = false;
    (async () => {
      try {
        if (localStorage.getItem(CONNECTED_KEY) !== "1") return;
        const accounts = (await window.ethereum!.request({ method: "eth_accounts" })) as string[];
        if (cancelled || !accounts?.length) return;
        await doConnect();
      } catch {
        /* no wallet, locked, or storage unavailable — stay disconnected */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [doConnect]);

  // Re-read on wallet-side account or network changes, otherwise the UI silently
  // keeps transacting as whoever was connected a moment ago.
  useEffect(() => {
    if (!hasWallet()) return;
    const eth = window.ethereum!;
    const onAccounts = (accounts: string[]) => (accounts.length === 0 ? disconnect() : doConnect());
    const onChain = () => doConnect();

    eth.on?.("accountsChanged", onAccounts);
    eth.on?.("chainChanged", onChain);
    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
    };
  }, [doConnect, disconnect]);

  return { ...state, connect: doConnect, switchToCoston2: doSwitch, disconnect };
}
