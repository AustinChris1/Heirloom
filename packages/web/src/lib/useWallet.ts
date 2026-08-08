import { JsonRpcSigner } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { COSTON2_CHAIN_ID, connect, hasWallet, switchToCoston2 } from "./wallet";

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
    setState((s) => ({ ...s, address: null, signer: null, chainId: null, onCoston2: false }));
  }, []);

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
