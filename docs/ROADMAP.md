# Business model and roadmap

Heirloom charges nothing today. No fee logic exists in the contract, the allocation engine, or the enclave, and this page is the proposal rather than a description of something already running. It is written down because "how does this survive after the hackathon" is a fair question, and the answer shapes what gets built next.

---

## What it costs to run

| | |
|---|---|
| Domain, VPS, static hosting | ~$20 a month |
| The enclave (three small containers on a 1 GB host) | included above |
| The keeper, if run as a service | negligible per vault, real at scale |
| Gas | paid by whoever sends the transaction, not by us |

Heirloom never touches user funds, so it has no float, no custody revenue, and no yield to skim. Whatever it charges has to be charged openly.

## The proposal

**Free to create a vault.** The funnel should be as wide as possible at the moment someone is least sure about a system they have just met. A vault is a row in a contract; it costs us nothing.

**A small flat fee to seal.** Sealing is where the enclave does real work: it decrypts a will, validates it, and signs an attestation. Charging here means some revenue arrives while the owner is alive, without gating the decision to try the product at all.

**0.3% of the estate at distribution, capped.** The fee is one more line in the distribution the enclave computes, so it is signed by the TEE, verified by the contract, and visible on-chain like every other bequest. It cannot be hidden or applied retroactively. A cap keeps it honest on large estates, where a percentage of automated software stops being defensible.

For comparison: probate typically costs 1 to 5 percent and takes months. A solicitor's hour costs more than a decade of vault fees.

**An optional keeper subscription.** After death, someone has to submit the permissionless transactions that claim dormancy, execute, and pay out. Anyone can run a keeper, and the security model never depends on ours being honest, since every action it takes is checked on-chain. Most people will not want to run one. Charging for that is charging for the thing that genuinely costs money.

**White-label, longer term.** The hard problem is not the cryptography, it is distribution. Wallets, exchanges, and custodians already have the users who need this. "Inheritance, powered by Heirloom" inside a wallet someone already trusts converts far better than acquiring holders one at a time.

The line worth defending: **we cannot take custody, so we cannot charge a custody fee. We take a fraction of a percent, once, at the moment the estate pays out, and nothing at all if it never does.**

---

## Roadmap

### Now: proven on testnet

The full lifecycle runs on Coston2 and the XRP Ledger testnet, including payouts signed inside the TEE with a key nobody has exported. Transaction trails are in [Usage](USAGE.md).

### Next: what mainnet actually requires

- **Move the encrypted will off-chain.** Today it travels in the instruction payload. Only the commitment needs to be on-chain, and the contract is already built for that.
- **`SignerListSet` instead of a single regular key.** With the enclave at weight 1 and each guardian at weight 1 and a quorum of 2, the enclave alone cannot sign. That closes the last "what if the TEE is compromised" question, at the cost of a more complex signing flow.
- **Hardware-backed attestation.** `SIMULATED_TEE=true` is sanctioned on Coston2 but is not a real Confidential Space measurement. Production wants `MODE=0` on a GCP Confidential Space VM.
- **Enclave key survivability.** TEE identity does not survive a container rebuild today, so a rebuilt enclave means owners must re-delegate. The tee-node's wallet backup and restore machinery is the fix.
- **Keeper redundancy.** One keeper is a liveness dependency, not a trust dependency, but it should still be more than one machine.
- **Xaman allowlisting** for `SetRegularKey`, so the wallet most XRPL users hold can grant the enclave directly.
- **An audit**, before anyone is asked to point real money at this.

### Then: reach

- **FXRP delivery.** Each bequest already carries an optional `flareRecipient`, so a beneficiary can elect FXRP on Flare instead of native XRP and land directly in XRPFi. The plumbing is modelled end to end; the FAssets minting flow is not wired. Note the deliberate asymmetry: this is a *beneficiary's* choice at payout, never the estate's while alive, because minting FXRP would mean moving the owner's XRP, which is the one thing Heirloom promises never to do.
- **Issued tokens and trustlines**, so an XRPL will can cover more than XRP.
- **A Xaman xApp**, which is where the users are.

### Other assets

The oracle is only needed when the asset lives on a different chain from the logic. That single fact orders the work:

| Asset | Trigger | Payout | Difficulty |
|---|---|---|---|
| **Flare-native** (FLR, FXRP, ERC-20s) | A direct `ping()` on the vault. No oracle, dormancy is a timestamp comparison | The owner grants an ERC-20 **allowance**: revocable, funds stay in their wallet, and the contract `transferFrom`s only once conditions are met | **Easier than XRP.** The allowance is the exact EVM analogue of a regular key |
| **XRP** | FDC `XRPPaymentNonexistence` | Enclave-held regular key | Shipped |
| **BTC, DOGE** | FDC already supports `Payment` and `ReferencedPaymentNonexistence` for both | Bitcoin has no revocable regular key. The enclave would hold a key in a 2-of-2 or taproot multisig | Trigger free, payout is a real trust change |
| **ETH, USDT on Ethereum** | Proving *silence* on an EVM chain is not an FDC attestation type, so the vault would need to live on Ethereum with its own `ping()` | Allowance, as above | Possible, but Flare drops out of the loop and heartbeats cost Ethereum gas |

Flare-native assets are the obvious next step: no oracle, no new cryptography, and the confidential will keeps earning its place by hiding the terms until they execute.

### Beyond inheritance

Inheritance is the demonstration. The primitive is private, programmable rules over native XRP, enforced by an enclave and triggered by facts the network proves for itself:

- **Social recovery**, where the trigger is silence rather than death.
- **Vesting and scheduled transfers**, where terms stay private until they execute.
- **Treasury and business continuity**, where a company's funds have a documented successor without a shared key.

Each is the same machinery with a different trigger, and none of them is possible without an oracle that can prove a payment *did not* happen.
