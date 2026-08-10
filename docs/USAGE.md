# Using Heirloom

Everything below runs against **Coston2** (Flare's testnet) and **XRPL testnet**. No real money is involved anywhere.

## What you need

| | Why | Cost |
|---|---|---|
| **MetaMask** (or any injected EVM wallet) | Creating and managing vaults on Flare | Free |
| **A little C2FLR** | Gas on Coston2 | Free — [faucet.flare.network/coston2](https://faucet.flare.network/coston2) |
| **An XRPL testnet wallet** | Only if you want to send a heartbeat | Free — see below |

**Do you need an XRP wallet?** Only for the heartbeat. You can create a vault, write a will, watch the commitment and distribution compute, add guardians, and browse every vault without ever touching XRPL. The moment you want to prove you're alive, you need an XRPL testnet account, because the heartbeat *is* an XRPL payment.

### Getting an XRPL testnet wallet

Easiest is the official faucet — it creates an account and funds it in one click:

**<https://xrpl.org/xrp-testnet-faucet.html>**

It hands you an address (`r…`) and a secret (`s…`), pre-funded with 100 test XRP. Nothing there is real; treat the secret as disposable.

To send from it, use any XRPL testnet tool — the [XRPL Explorer](https://testnet.xrpl.org), a testnet-enabled Xaman/XUMM account, or a few lines of `xrpl.js`.

---

## 1. Create a vault

1. Open the app and click **Connect wallet**. Approve, and switch to Coston2 if prompted (the button adds the network for you).
2. Go to **New vault**.
3. Fill in:
   - **Your XRP Ledger account** — the account that holds the estate. Heartbeats must come from it. Paste your testnet `r…` address.
   - **Heartbeat interval** — how long you may stay silent before dormancy can be claimed. Try **1 day** for a demo rather than the 90-day default.
   - **Grace window** — how long you get to overturn a dormancy claim. Try **0** for a demo so you don't have to wait.
   - **Beneficiaries** — an XRPL address plus an amount. Each is either a fixed sum in USD, a fixed number of XRP, or a percentage share of what remains.
   - **Residue** — who receives whatever is left.
   - **Guardians** *(optional)* — Flare addresses that must confirm before execution, and how many of them are required.
4. Watch the right-hand panel. The **will commitment** recomputes as you type, and the **distribution preview** runs the exact allocation engine the enclave runs — including abatement if the estate can't cover every fixed bequest.
5. Click **Create vault on Coston2** and approve the transaction.

Only the commitment hash reaches the chain. Beneficiaries and amounts never leave your browser.

## 2. Send a heartbeat

Open your vault from the list. The **Stay alive** panel gives you three copyable values:

| Field | Value |
|---|---|
| To | `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh` (the beacon) |
| Destination tag | unique to your vault — e.g. `700000000` |
| Amount | `0.001 XRP` minimum |

Send that payment from your estate account. **The destination tag is what identifies your vault** — a payment without it, or with somebody else's, does not count.

The beacon is a destination marker, not a custodian: nobody needs its keys, and the dust you send is genuinely spent. At 0.001 XRP that's a fraction of a cent, and on testnet it's free.

With `xrpl.js`:

```js
import { Client, Wallet } from "xrpl";

const client = new Client("wss://s.altnet.rippletest.net:51233");
await client.connect();

const wallet = Wallet.fromSeed("sYourTestnetSecret");
const result = await client.submitAndWait({
  TransactionType: "Payment",
  Account: wallet.address,
  Destination: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  DestinationTag: 700000000,        // <- your vault's tag
  Amount: "1000",                    // drops = 0.001 XRP
}, { wallet });

console.log(result.result.hash);
await client.disconnect();
```

Keep that transaction hash — proving life needs it.

### Easier: let the repo send it

Browser wallets are the weak link. The destination tag usually sits behind an "advanced" toggle, and some extensions cannot reliably reach it — so the payment goes out **without a tag**, succeeds on XRPL, and silently fails to count.

```bash
cd packages/contracts
VAULT_ID=5 pnpm exec hardhat run scripts/send-heartbeat.ts --network coston2
```

<details>
<summary>PowerShell (Windows)</summary>

PowerShell has no inline env-var prefix — `VAULT_ID=5 cmd` is a parse error. Set it first:

```powershell
$env:VAULT_ID="5"; pnpm exec hardhat run scripts/send-heartbeat.ts --network coston2
```

The same applies to every `VAR=value` command in this document.
</details>

It sends from the cached testnet wallet with the tag set, and prints the hash to paste into **Prove life**. If the vault is not registered to that wallet it says so *before* spending anything, and prints the address to use when creating one.

To find out what went wrong with a payment you already sent:

```bash
VAULT_ID=<n> pnpm exec hardhat run scripts/find-heartbeat.ts --network coston2
```

It lists payments carrying that vault's tag and tells you whether the sender matches the registered estate account — the two things that make a heartbeat count.

> **Faucet payments never count.** The XRPL faucet has no destination-tag field, and the funds come from the faucet's account rather than yours. A heartbeat has to come *from the estate account* **with the tag** — that is what stops anyone else keeping your vault alive against your wishes.

## 3. Prove you're alive

The payment alone doesn't reset the clock; Flare has to be *shown* it happened. That means an FDC attestation — and the app runs the whole thing for you.

Open your vault, find **Attestations → Prove life**, paste the XRPL transaction hash from step 2, and click **Attest and submit**. The app then:

1. Asks the verifier to encode an `XRPPayment` request.
2. Submits it to `FdcHub.requestAttestation` — **your wallet signs this**, and pays a fee of roughly 10⁻¹⁵ C2FLR.
3. Waits for the voting round to finalise. **This takes 90–180 seconds** and is shown as a real progress bar. That wait is data providers reaching consensus, not the page hanging.
4. Fetches the Merkle proof from the DA Layer.
5. Calls `proveLife`, which your wallet also signs.

The contract verifies the proof, checks the payment went to the beacon with *your* tag from *your* account, and resets `lastHeartbeat`.

**Anyone can relay this** — it does not have to be the owner. The proof is self-contained, so being offline never puts you at risk.

## 4. Claim dormancy

Once the interval has elapsed with no heartbeat, anyone can prove the *absence* of one. In the app: **Attestations → Claim dormancy**. The button only enables when the vault is Active *and* overdue.

Same five steps, but the request is an `XRPPaymentNonexistence` over a 400-ledger range carrying your vault's destination tag. The app reads the ledger range from XRPL itself and pins the amount to `heartbeatDrops - 1`, which is what the contract requires.

The vault moves to **Dormant** and the grace window opens. Nothing has moved yet.

### From the command line instead

Both flows also exist as scripts, which is useful for scripted demos or if a wallet misbehaves:

```bash
pnpm exec hardhat run scripts/live-heartbeat.ts --network coston2
VAULT_ID=<n> pnpm exec hardhat run scripts/claim-dormancy.ts --network coston2
```

## 5. Cancel — the important one

While dormant, the owner can call **I'm alive — cancel** in the app (`revokeDormancy`). The vault returns to Active and **every guardian approval is cleared**. A false alarm costs nothing and leaves no residue.

This is the single most important behaviour in the system: dormancy is a claim, not a verdict.

## 6. Guardians

Guardians are a second signal that the owner is really gone — people who would know. They are named when the vault is created and cannot be added later.

**They do nothing while the vault is alive.** There is nothing to confirm, and the app says so. A guardian only becomes relevant once someone has proven dormancy.

Once the vault is **Dormant**, each guardian opens it and clicks **Confirm as guardian** (`guardianApprove`). The count moves from `0/1` toward the threshold. Execution requires *both* the grace window elapsed *and* the threshold met.

What guardians **cannot** do:

- Move funds, or change who receives them
- Trigger dormancy — that needs a cryptographic nonexistence proof, not a vote
- Accelerate anything — the grace window runs regardless
- Act while the vault is alive
- Undo a cancellation — if the owner revokes dormancy, **every approval is cleared** and the count resets to zero

So a guardian's only power is to *withhold* confirmation. Colluding guardians can stall an estate; they can never redirect one.

**You can be your own guardian.** The contract permits it, and for a demo it's the easiest way to show the flow: create a vault with your own Flare address as guardian and threshold 1, let it go dormant, then confirm as yourself. The app detects guardianship per address rather than assuming the owner isn't one.

> **Note:** guardians are Flare addresses (`0x…`), not XRPL addresses. They need a little C2FLR for gas when they confirm.

---

## What is live right now

| Step | Status |
|---|---|
| Create vault, guardians, commitment | **Live on Coston2** — verified |
| FTSO XRP/USD pricing | **Live** — verified |
| Distribution preview (real allocation engine) | **Live** — verified |
| **`proveLife` via real FDC `XRPPayment` proof** | **Live, and clickable in the app** — real XRPL payment attested and accepted on-chain |
| **`claimDormancy` via real FDC `XRPPaymentNonexistence` proof** | **Live, and clickable in the app** — vault driven Active → Dormant by a real nonexistence attestation |
| Cancel dormancy, guardian confirmation | **Live** |
| Confidential Compute routing (`HEIRLOOM`/`SEAL`) | **Live** — instruction observed reaching the enclave |
| TEE machine | **Live** — status 2 (PRODUCTION), extension 66025 |
| Sealing a will the enclave can open | Blocked on client-side ECIES to the enclave's public key |
| XRPL payout broadcasting | Not implemented — the enclave signs, nothing submits |

Both FDC legs now run against live attestations, not mocks. Reproduce them yourself:

```bash
cd packages/contracts
pnpm exec hardhat run scripts/live-heartbeat.ts --network coston2    # XRPL payment → attestation → proveLife
pnpm exec hardhat run scripts/create-short-vault.ts --network coston2 # 120s interval
VAULT_ID=<id> pnpm exec hardhat run scripts/claim-dormancy.ts --network coston2
```

`live-heartbeat.ts` funds its own XRPL testnet wallet from the faucet, so it needs nothing but a funded Coston2 deployer.

Evidence from the runs above:

| | |
|---|---|
| XRPL heartbeat | [`84C0227…EDB8D`](https://testnet.xrpl.org/transactions/84C022779EF8DE35134FFB4C263A6A81CF150DE6C4BFFAE0D6DD4D369A7EDB8D) |
| `proveLife` | `0xeafa132a60f30289001fda05debbc40b99c19230cc263d911c095ccd4c3f5d1b` |
| `claimDormancy` | `0x2f4bf71b10d33e43f65843e144c144ef68a9fdd2e567efa24a0f2f97f2949ee7` |
