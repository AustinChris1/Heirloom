import { BrowserProvider, Contract, Eip1193Provider, JsonRpcSigner, keccak256, toUtf8Bytes } from "ethers";
import { HEIRLOOM_VAULT, VAULT_ABI } from "./deployment";

/**
 * Wallet + write path.
 *
 * Reads go through a public RPC (see chain.ts) so the landing page and vault
 * list work with no wallet at all. Only state-changing actions need a signer.
 */

export const COSTON2_CHAIN_ID = 114;
const COSTON2_HEX = "0x72"; // 114

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      on?: (event: string, handler: (...args: any[]) => void) => void;
      removeListener?: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

export class WalletError extends Error {}

export function hasWallet(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

export async function connect(): Promise<{ signer: JsonRpcSigner; address: string; chainId: number }> {
  if (!hasWallet()) {
    throw new WalletError("No Ethereum wallet found. Install MetaMask to use Heirloom.");
  }

  const provider = new BrowserProvider(window.ethereum!);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();

  return { signer, address: await signer.getAddress(), chainId: Number(network.chainId) };
}

/** Switches the wallet to Coston2, adding the network if it isn't known yet. */
export async function switchToCoston2(): Promise<void> {
  if (!hasWallet()) throw new WalletError("No wallet available.");

  try {
    await window.ethereum!.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: COSTON2_HEX }],
    });
  } catch (err: any) {
    // 4902 = chain unknown to the wallet.
    if (err?.code === 4902 || err?.data?.originalError?.code === 4902) {
      await window.ethereum!.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: COSTON2_HEX,
            chainName: "Flare Testnet Coston2",
            nativeCurrency: { name: "Coston2 Flare", symbol: "C2FLR", decimals: 18 },
            rpcUrls: ["https://coston2-api.flare.network/ext/C/rpc"],
            blockExplorerUrls: ["https://coston2-explorer.flare.network"],
          },
        ],
      });
    } else {
      throw err;
    }
  }
}

export function vaultWithSigner(signer: JsonRpcSigner): Contract {
  return new Contract(HEIRLOOM_VAULT, VAULT_ABI_WRITE, signer);
}

/**
 * Reads and writes share one generated ABI.
 *
 * They were split when the ABI was hand-written, which is how `proveLife` and
 * `claimDormancy` ended up missing from both lists. The generated artifact
 * covers the whole contract, so there is nothing left to keep in sync.
 */
export const VAULT_ABI_WRITE = VAULT_ABI;

/** FDC's standard address hash: keccak256 over the address string, not lowercased. */
export function xrplAddressHash(address: string): string {
  return keccak256(toUtf8Bytes(address.trim()));
}

/**
 * Turns a wallet/RPC error into something a person can act on.
 * Ethers nests the useful part several levels down and prefixes it with noise.
 */
/**
 * Custom errors the contract raises with arguments. ethers cannot name them
 * without the ABI in scope during estimateGas, so they arrive as a raw
 * selector — decode the ones a user can actually act on.
 */
const SELECTORS: Record<string, string> = {
  "0xf79aebe5":
    "The proof window ended before the heartbeat was due. The vault went overdue moments ago — wait a minute for the ledger to move past the deadline, then claim again.",
  "0x32901104":
    "The proof window started after the last recorded heartbeat, so it could miss one. Try again — the range is recalculated each attempt.",
  "0x8f4eb604": "The nonexistence bound does not match this deployment's heartbeat amount.",
};

export function humanError(err: unknown): string {
  const e = err as any;
  if (e?.code === "ACTION_REJECTED" || e?.code === 4001) return "You rejected the transaction.";

  // Look for a known custom-error selector anywhere in the payload.
  const blob = typeof e?.data === "string" ? e.data : (e?.info?.error?.data ?? e?.message ?? "");
  if (typeof blob === "string") {
    for (const [selector, explanation] of Object.entries(SELECTORS)) {
      if (blob.includes(selector.slice(2))) return explanation;
    }
  }

  const revert = e?.revert?.name ?? e?.info?.error?.data?.message ?? e?.shortMessage ?? e?.message;
  if (typeof revert === "string") {
    if (revert.includes("insufficient funds")) {
      return "Not enough C2FLR for gas. Top up at faucet.flare.network/coston2.";
    }
    // Surface the contract's own custom errors, which are already written for humans.
    const named = revert.match(/\b(NotVaultOwner|NoSuchVault|WrongState|BeaconNotConfigured|InvalidConfiguration|ExtensionIdUnset|TeeNotConfigured|WillNotAttested|GraceWindowOpen|GuardiansUnsatisfied|NotGuardian|AlreadyApproved|EmptyWill)\b/);
    if (named) return EXPLAIN[named[1]] ?? named[1];
    return revert.replace(/^execution reverted:?\s*/i, "");
  }
  return "Something went wrong. Check the console for details.";
}

const EXPLAIN: Record<string, string> = {
  NotVaultOwner: "Only the vault owner can do that.",
  NoSuchVault: "That vault does not exist.",
  WrongState: "The vault is not in the right state for that action.",
  BeaconNotConfigured: "The heartbeat beacon has not been configured on this deployment.",
  InvalidConfiguration: "Those settings aren't valid — check the guardian threshold and interval.",
  ExtensionIdUnset: "The confidential compute extension isn't registered on this deployment yet.",
  TeeNotConfigured: "No TEE signing address is registered on this deployment yet.",
  WillNotAttested: "Seal the will first — the enclave has to confirm it can read it.",
  GraceWindowOpen: "The grace window is still open. Execution has to wait.",
  GuardiansUnsatisfied: "Not enough guardians have confirmed yet.",
  NotGuardian: "You are not a guardian on this vault.",
  AlreadyApproved: "You have already confirmed this vault.",
  EmptyWill: "The will has no bequests.",
};
