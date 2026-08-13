import { JsonRpcSigner } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { toast } from "./toast";
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

  // `silent` suppresses toasts for the automatic reconnect on load.
  const doConnect = useCallback(async (silent = false) => {
    setState((s) => ({ ...s, connecting: true, error: null }));
    try {
      const { signer, address, chainId } = await connect();
      try {
        localStorage.setItem(CONNECTED_KEY, "1");
      } catch {
        /* private browsing, session-only connection is fine */
      }
      setState((s) => ({
        ...s,
        signer,
        address,
        chainId,
        connecting: false,
        onCoston2: chainId === COSTON2_CHAIN_ID,
      }));
      if (!silent) {
        if (chainId === COSTON2_CHAIN_ID) {
          toast.success(`Wallet connected — ${address.slice(0, 8)}…${address.slice(-4)}`);
        } else {
          toast.error("Wallet connected, but on the wrong network, switch to Coston2");
        }
      }
    } catch (err) {
      const m = (err as Error).message;
      setState((s) => ({ ...s, connecting: false, error: m }));
      if (!silent) toast.error(m);
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
    toast.info("Wallet disconnected");
    try {
      localStorage.removeItem(CONNECTED_KEY);
    } catch {
      /* private browsing */
    }
    setState((s) => ({ ...s, address: null, signer: null, chainId: null, onCoston2: false }));
  }, []);

/**
   * Reconnect silently on load via `eth_accounts`, which returns an already
   * authorised wallet without prompting. Only if the user connected here before.
   */
  useEffect(() => {
    if (!hasWallet()) return;
    let cancelled = false;
    (async () => {
      try {
        if (localStorage.getItem(CONNECTED_KEY) !== "1") return;
        const accounts = (await window.ethereum!.request({ method: "eth_accounts" })) as string[];
        if (cancelled || !accounts?.length) return;
        await doConnect(true);
      } catch {
        /* no wallet, locked, or storage unavailable, stay disconnected */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [doConnect]);

  // Re-read on account or network changes.
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
