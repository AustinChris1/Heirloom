# Using Heirloom

A guide for someone who has never touched this before. Part one walks the app button by button. The words you'll meet along the way are all explained in [the glossary](#the-words-in-plain-english) at the bottom. The technical evidence lives at the very end, for those who want receipts.

**What you need:**

| | Why | Where |
|---|---|---|
| A browser | The whole app runs in it | [heirloom.wtf](https://heirloom.wtf) |
| MetaMask | Signs your Flare-side actions | [metamask.io](https://metamask.io) — the app adds the Coston2 test network for you |
| Test C2FLR | Pays tiny transaction fees | Free: [faucet.flare.network/coston2](https://faucet.flare.network/coston2) |
| An XRPL testnet account | Plays the role of your XRP savings | Free: [xrpl.org faucets](https://xrpl.org/resources/dev-tools/xrp-faucets) |

Everything here is test networks and test money. Nothing real is at risk.

---

## The whole thing in one picture

```
 while you are alive                        after you go silent
─────────────────────────                ─────────────────────────

 CREATE ──► SEAL ──► ♥ ♥ ♥ ♥ ─ ─ ─ ✕     silence proven ──► DORMANT
 vault      will     heartbeats  you            (the network      │
   │                 every 90d   stop            checked)         │
   │                                                              ▼
   │                                  ◄─── one heartbeat     GRACE WINDOW
   │                                       cancels all       + guardians
   │                                                              │
   ▼                                                              ▼
 your XRP never moves ────────────────────────────────► EXECUTE ► PAID
                                                        enclave   heirs
                                                        opens     receive
                                                        will      XRP
```

Your money stays in your own XRPL account the entire time. Heirloom never holds it.

---

## Part 1 — Setting up

### Connect

Open **[/app](https://heirloom.wtf/app)**. It already shows every vault and the live XRP price with no wallet at all. To *do* anything, click **Connect wallet** — MetaMask pops up, and if you're on the wrong network the app switches (or adds) Coston2 for you.

### Create your vault

The **New vault** form, field by field:

| Field | What it means | What to put |
|---|---|---|
| **Your XRP Ledger account** | The account holding the money — "the estate". Heartbeats must come from it, and inheritance is paid from it | Your r-address (`r…`) |
| **Heartbeat interval** | How long you can be silent before anyone may claim you're gone | `90 days` real use · `5 minutes` for trying it out |
| **Grace window** | Extra days you get to say "I'm alive" after someone claims you're gone | `30 days` real use · `0` for trying it out |
| **Beneficiaries** | Who inherits. Each row: their r-address, an amount, and a kind — **% share**, **USD** (converted to XRP at the price on the day it executes), or **XRP** (a fixed amount) | Add rows with **Add beneficiary**, remove with ✕ |
| **Residue** | Whoever receives whatever is left over | An r-address |
| **Guardians** *(optional)* | People who must additionally approve before anything pays out. They can only approve — never take, change, or speed up | Flare `0x…` addresses + how many must confirm |

**These beneficiary rows are your will.** Not a metaphor — who, how much, in what denomination is the entire document. There's no paperwork behind it.

Watch the right-hand panel while you type:

- **Will commitment** — a fingerprint of your will, recomputed live. This fingerprint is *the only thing the chain ever learns*. Who inherits, and how much, never leaves your browser.
- **Distribution preview** — type an estate size and see exactly who would get what, computed by the *same engine* that later runs inside the enclave. Set the estate smaller than your fixed bequests and watch the **abatement warning**: everyone's fixed amount shrinks proportionally, fairly.

Click **Create vault on Coston2** and approve in MetaMask. The success screen stays put until you're done with it: your will is automatically kept **in this browser**, and **Download will file** saves a copy of *what you just typed* for other devices or safekeeping. The chain only ever has the fingerprint. When you're ready, **View your vault →**.

> **You never deposit anything.** There is no pot to fill. Your XRP stays in your account, spendable as ever — the vault watches, it doesn't hold.

### Name it (optional)

On your vault's card, click **name it** next to "Vault #N" to give it a private label like *Mom's plan*. It's stored only in your browser — everyone else just sees the number, because a public name would leak exactly what this system is built to keep private.

### Seal your will

Find your vault in the list and the **Seal the will** panel. This is the rehearsal, done while you're alive so nothing can fail after you're gone:

1. On the browser that created the vault, **your will is already filled in**. (Elsewhere, paste the downloaded will file.) The app checks it against the fingerprint on-chain — "✓ Matches this vault's commitment" or a refusal (a tampered or wrong will can't be sealed).
2. Click **Encrypt & seal in the enclave**. What happens, in order: the app fetches the enclave's public key and *refuses unless it matches the identity the contract trusts* → your will is encrypted **in your browser** → MetaMask asks you to send it (1 C2FLR fee) → the sealed computer opens it, checks it, and reports back within seconds → MetaMask asks you to record that attestation on-chain.
3. Your vault now shows **"Sealed and attested"** — the enclave has proven it can read and execute your will, without revealing a word of it.

Closed the tab halfway? Reopen — a **Resume pending attestation** button picks up exactly where you left off.

---

## Part 2 — Staying alive

### The heartbeat

The **Stay alive** panel shows exactly three things to copy: the **beacon account** to pay, your vault's **destination tag**, and the tiny **amount**. Send that payment from your estate account before the timer runs out — a fraction of a cent, from the wallet you already use.

> **It's a signal, not a deposit.** The tag is what identifies your vault; a payment without it silently doesn't count. Send the minimum — more buys nothing.

No XRPL wallet handy? Open **+ Testnet helper: send it from here**, paste your estate's testnet seed, and the app builds, signs, and sends the correctly-tagged payment itself. (Testnet only — a real product never asks for a seed.)

### Prove life

Sending the heartbeat keeps you safe. *Proving* it on Flare is bookkeeping that anyone may do — you, your child, a bot:

1. Click **Find my latest heartbeat** — the app scans the beacon and fills in your payment automatically (or paste a transaction hash yourself).
2. Click **Attest and submit**. You'll watch five steps: **Prepare** (encode the request) → **Submit** (MetaMask signs, fee under a cent) → **Await round** (~2–3 minutes while a hundred independent machines each check the XRP Ledger themselves) → **Fetch proof** → **Finalise** (the proof lands on-chain).
3. Your heartbeat timer resets. If someone had claimed you were gone, that claim is *cancelled* and every guardian approval is wiped.

The 2–3 minute wait is real decentralisation, not a loading spinner — the progress bar is honest about it.

---

## Part 3 — When someone is gone

Everything in this part can be done by **anyone** — family, a friend, a bot. That's deliberate: the flow can't depend on any particular person, because every action is checked against facts the network verifies.

### Claim dormancy

On a vault whose heartbeat is overdue: **Claim dormancy**. Same five steps as prove-life, but this time the network proves the *opposite* — that across the entire period, **no** tagged heartbeat reached the beacon. Proving that nothing happened is the hard thing, and it's the reason Heirloom runs on Flare. On success the vault turns **DORMANT** and the grace window starts.

### The grace window

Nothing moves yet. During this period:

| Who | Button | Effect |
|---|---|---|
| The owner | **I'm alive — cancel** | Instantly back to normal; approvals wiped |
| The owner (via anyone) | a heartbeat + **Prove life** | Same, without needing Flare gas |
| Guardians | **Confirm as guardian** | Counts toward the threshold. That's all they can do |

### Execute the will

Once grace has passed and guardians (if any) have confirmed, the **Execute the will** panel appears:

1. The estate account is auto-detected from its own heartbeats (or paste the r-address for a vault that never sent one).
2. Click **Execute in the enclave**: the sealed will comes back *off the chain itself*, the estate's live balance is read from the XRP Ledger, MetaMask sends the instruction (1 C2FLR), and the enclave decrypts, prices any dollar bequests at the live feed, and returns a signed distribution in seconds. MetaMask then records it.
3. The contract verifies three things before accepting: the signature is genuinely the enclave's, the will matches the sealed fingerprint, the price matches the live feed. Vault becomes **SETTLED**.

### Distribute the estate

The settled table shows each inheritance, amounts fixed by the enclave and verified by the chain. Paste the will file (it supplies the addresses behind the fingerprints — it *cannot* change any amount) and the signing seed, click **Sign & broadcast** — one real XRPL payment per heir, each with a ✓ and an explorer link.

The heirs did nothing. No sign-ups, no claims, no wallets to install. Money arrives in their accounts like any other payment — and this is the first moment anyone learns who they were.

### Closing up

**Close vault** (owner, any time before settlement) permanently revokes a vault. The will is never executed; your XRP was never touched anyway.

---

## The words, in plain English

| Word | Meaning |
|---|---|
| **Vault** | Your entry in Heirloom: who inherits, how often you check in, who the guardians are. A numbered record — not a place money goes |
| **Estate** | Your own XRPL account holding the XRP. It never moves until execution |
| **Will / will file** | The beneficiary rows you typed, saved as a small file. The chain sees only its fingerprint |
| **Commitment / fingerprint** | A hash of your will. Proves later that nothing was altered, reveals nothing |
| **Heartbeat** | The tiny tagged payment that says *still here* |
| **Beacon** | The shared account heartbeats are sent to. A signpost, not a wallet you fund |
| **Destination tag** | The number that marks a payment as *your* vault's heartbeat |
| **Dormancy** | The proven state of "no heartbeat arrived for the whole interval" |
| **Grace window** | The safety period after dormancy during which one heartbeat undoes everything |
| **Guardian** | Someone you chose who must additionally approve. Can only refuse, never act |
| **Enclave / sealed computer / TEE** | A chip that runs code nobody — not even its owner — can look inside. The only thing that ever reads your will |
| **Attestation / FDC** | Flare's mechanism where ~100 independent machines check the XRP Ledger and vote on what they saw |
| **FTSO** | Flare's live price feed — how "$50,000 worth" becomes the right amount of XRP on the day |
| **Settle** | The moment the enclave's signed distribution is verified and recorded on-chain |
| **Keeper** | An optional background bot that clicks all the after-death buttons so nobody has to. It can't cheat — every action it takes is fact-checked by the chain |
| **Regular key** | XRPL's built-in way to let a second key sign for your account without giving up your master key. Granted while alive, revocable any time — it's how payouts get signed when you're gone |
| **Drops** | XRP's smallest unit: one millionth of an XRP |
| **C2FLR** | The test network's gas token. Free from the faucet |

---

## For developers — receipts and reproduction

Everything above has been run for real. Status of each leg:

| Step | Status |
|---|---|
| Create vault, guardians, commitment | **Live on Coston2** — verified |
| FTSO XRP/USD pricing | **Live** — verified |
| Distribution preview (real allocation engine) | **Live** — verified |
| `proveLife` via real FDC `XRPPayment` proof | **Live, clickable in the app** |
| `claimDormancy` via real FDC `XRPPaymentNonexistence` proof | **Live, clickable in the app** |
| Cancel dormancy, guardian confirmation | **Live** |
| TEE machine | **Live** — status 2 (PRODUCTION), extension 66025 |
| Sealing (browser-side ECIES to the enclave's attested key) | **Live** — decrypted and attested by the enclave, recorded via `confirmSeal` |
| Executing (enclave decrypt + FTSO pricing + on-chain verification) | **Live** |
| XRPL payout broadcasting | **Live** — `tesSUCCESS` on testnet |
| Unattended lifecycle (keeper + delegated regular key) | **Live** — zero human steps from silence to paid |

Reproduce from a terminal:

```bash
cd packages/contracts

# heartbeat → attestation → proveLife, self-funding
pnpm exec hardhat run scripts/live-heartbeat.ts --network coston2

# the confidential third, end to end
pnpm exec hardhat run scripts/seal-live.ts --network coston2         # prints VAULT_ID
VAULT_ID=<id> pnpm exec hardhat run scripts/claim-dormancy.ts --network coston2
VAULT_ID=<id> pnpm exec hardhat run scripts/execute-live.ts --network coston2

# or let nobody do it: delegate a regular key once, then run the keeper on a timer
pnpm exec hardhat run scripts/set-regular-key.ts --network coston2
pnpm exec hardhat run scripts/keeper.ts --network coston2
```

**Evidence — manual run (vault #6, 10 Aug 2026):**

| | |
|---|---|
| `sealWill` (431-byte ECIES blob) | `0xe563a4a16e89871d8b1cdc73549365135b94594c26a0fce25c41e703be7fc9ad` |
| `confirmSeal` — enclave decrypted, attested, recorded | `0xb95033e4ec91f2723d4b592159cac5b291a7f65ab49046c4dd800ec7de6032c9` |
| `claimDormancy` — FDC nonexistence, round 1421449 | `0x782dcae4b1688eb579341fb1b9c27bda9eaa3d241df82373aff19f8fa9f02328` |
| `settleEstate` — TEE-signed distribution at $1.031901/XRP | `0xdd1f3deaaafe0d2fba67cd2b94f10851b2f64d263cba43b9efee96847381561f` |
| Payout: 2 XRP fixed | [`67E981D0…CE563`](https://testnet.xrpl.org/transactions/67E981D0812F1BD2826D51A815DC10F4A5E8D1ECD1A76E04E810B7434CCCE563) |
| Payout: 48.49897 XRP (50% share) | [`EE2F3648…51982`](https://testnet.xrpl.org/transactions/EE2F3648F5DF36ACDEBEF0D0245F584229C9EFFCAC6AA9D2E39D2AC4B3251982) |
| Payout: 48.49897 XRP (residue) | [`D1DB7CE6…EDE1C0`](https://testnet.xrpl.org/transactions/D1DB7CE62A543338C9BB09765B1D7B4D984B7FF94102DFBA0299EEECCAEDE1C0) |

**Evidence — unattended run (vault #8, same day).** After sealing, no human touched anything; the keeper claimed, executed, settled, and signed the payouts with the delegated regular key:

| | |
|---|---|
| `SetRegularKey` — estate delegates while alive | [`8F9B2E33…2001`](https://testnet.xrpl.org/transactions/8F9B2E33E74CA945115B873D438B3ABCB1C1E80513038AEA779989D1C7122001) |
| Keeper claims dormancy — FDC round 1421565, finalised in 95 s | `0xf635215603b7ad48f51553bb8060d8db8fe514faff018f2bb7b2a2f26ad4b815` |
| Keeper executes + settles | `0x28f3ea7ffb27746ef2059d2f1f866b24cdecf8c24b347b471acfa5a5d175a5a7` |
| Payout: 2 XRP fixed (regular-key signed) | [`77CEA80F…A360`](https://testnet.xrpl.org/transactions/77CEA80F6A6DC12DF9A15A9DD40E63942130BF987D90D91C4DE63DBAFE47A360) |
| Payout: 48.999976 XRP (50% share) | [`7D350333…064A`](https://testnet.xrpl.org/transactions/7D350333FB683343DDE79D8B2FADA82940710EE2545C59F371BC0E55E9C5064A) |
| Payout: 48.999976 XRP (residue) | [`9A9802A9…9B6A`](https://testnet.xrpl.org/transactions/9A9802A991B36D18BF5A38821F121D08FA4464C7537A690C102F25B3F44D9B6A) |

The enclave also **refused** an execution correctly along the way: vault #7's estate could not cover the XRPL reserve and fees, and the allocation engine rejected it inside the TEE rather than producing an unpayable distribution.

> Guardians are Flare addresses (`0x…`), not XRPL addresses — they need a little C2FLR for gas when they confirm.
