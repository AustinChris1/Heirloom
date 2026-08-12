# Demo video script

*Private run-of-show for recording. Not listed on the docs site.*

Target: **~3½ minutes of finished video**, shot **entirely in the browser** — every step of the lifecycle is clickable in the app, no terminal on camera. The full unattended lifecycle has also been proven (vault #8, keeper-driven, transaction trail in USAGE.md), so nothing here is a mock-up.

Every quoted speech below is **TTS-ready**: no em dashes, no code formatting or symbols an AI voice would read literally, sentences kept short. Paste them into the voice tool as they are.

> ## Read this first: the waits are longer than the video
>
> An FDC round takes **90–180 seconds to finalise**, and the demo runs two of them (prove-life, claim-dormancy). The enclave itself answers **within seconds** — the FDC rounds are the only real waits.
>
> Do **not** record those waits in one take. Record start and finish, cut the middle, and say "this takes about two minutes, cut for time" — honest, and every judge accepts it.

## Before recording

- [ ] **Health, without a terminal:** open the app and check vault #6 or #8 shows *Settled* (proves contract reads) and the FTSO price ticks (proves the feed). The definitive check is simply that the seal step attests during rehearsal. *(Optional terminal equivalent: `scripts/health.ts` → `✓ ALL SYSTEMS GO`. If the TEE is not status 2, the enclave container restarted — re-run `post-build.sh` + `set-tee-address.ts` and re-seal a fresh vault; old vaults are sealed to the dead key.)*
- [ ] **Estate funded:** ~100 XRP. Payouts drain it, and an estate below reserve+fees makes the enclave refuse execution (correctly) — the refused vault is stuck in Executing and only `revokeVault` clears it. Refill: `curl -X POST https://faucet.altnet.rippletest.net/accounts -H "Content-Type: application/json" -d '{"destination":"<estate r-address>"}'` (or ask Claude).
- [ ] **Install GemWallet, set it to Testnet, and hold the estate account.** The authorisation beat is signed there — one approval, no seed on screen. (Crossmark failed to resolve signing material in testing; Xaman refuses this transaction type until the app is allowlisted. GemWallet is the one to film.)
- [ ] **Three strings in a notepad:** the estate r-address, the estate seed (`packages/contracts/deployments/xrpl-testnet-wallet.json`), and MetaMask unlocked on Coston2 with the owner account (~5 C2FLR; each SEAL/EXECUTE carries a 1 C2FLR fee).
- [ ] **Know the two-vault rule:** a "life" vault for the heartbeat/prove-life beat, and a "death" vault that is **never heartbeated** — a heartbeat with a vault's tag blocks that vault's nonexistence proof for ~25 minutes.
- [ ] **Rehearse the full click-through once off-camera.** Also do the negative test then: paste a will with one amount changed and watch the seal panel refuse it.
- [ ] **Keeper off.** `scripts/keeper.ts` runs the whole post-death sequence unattended — great as a closing *line* ("a cron job does all of this with nobody watching"), fatal if it races you to the demo vault mid-recording. Don't schedule it while filming.
- [ ] Browser at 1280×720 or larger, zoom 100%, dark room for the black UI. Proxy logs tailing in a second window — a real instruction arriving at a real enclave is your most credible shot.

---

## 0:00 — The problem (20s)

Land on the hero. Let the ECG run.

> "Billions in crypto are lost forever when holders die. If you self-custody XRP, your options today are: give someone your keys, hand it to a custodian, put your seed phrase in a legal document, or do nothing. Almost everyone does nothing."

Scroll to the four options. Let them read.

## 0:20 — The insight (25s)

Scroll into the flatline section slowly. Let the trace die as you scroll — the page does this for you.

> "A dead man's switch needs to prove something unusual. Not that a payment happened, but that none did. Proving absence is the hard part. Flare's Data Connector has an attestation type for exactly that, called XRP Payment Nonexistence. That's the whole reason this is built on Flare."

## 0:45 — Create the death vault and seal the will (60s)

Go to `/app`. Connect wallet.

> "This is live on Coston 2, against a deployed contract."

Create a vault:
- Paste the estate r-address
- Heartbeat **5 minutes (testnet demo)** — the unit selector is there for exactly this — grace **0** *(say: "shortened for the demo — real vaults use 90 days and a 30-day grace window")*
- Two bequests: **2 XRP fixed** and a **50% share**, plus a residuary address

Point at the right-hand panel:

> "The commitment updates as I type. That hash is the only thing that reaches the chain. Beneficiaries and amounts never leave the browser. And this distribution preview isn't a mock-up. It's the exact allocation engine that runs inside the enclave. Watch what happens if the estate can't cover the fixed bequest."

Drop the estate-size preview below the fixed bequest so **abatement** kicks in.

> "Every bequest shrinks proportionally, preserving the ratios that were written."

Submit → **Download will file**. Then, still on the vault, **Authorise with GemWallet** — one approval on screen:

> "Before he ever goes quiet, the owner does one more thing: he grants the enclave's key permission to sign for his account. One standard XRPL transaction, approved in his own wallet. His own key never leaves it, and he can revoke this any time he's alive."

> "The chain holds the hash. I hold the will."

Open the vault, paste the will file into **Seal the will**:

> "Before anything is encrypted, the app fetches the enclave's public key from its attestation document, and refuses unless it matches the exact address the contract trusts. Then the will is encrypted right here in the browser, to the enclave's own key, and sealed."

Click **Encrypt & seal in the enclave**. Two wallet confirmations; between them the enclave's attestation lands in seconds — cut to the proxy logs (`HEIRLOOM / SEAL … ok`) and back.

> "The enclave just proved it can decrypt and execute this will, over its own signature, without revealing a single beneficiary. That's the dry run you do while you're alive, so a corrupt ciphertext can't surface after you're gone."

## 1:45 — Proof of life (30s on screen, ~4 min real time)

Create the **life vault** (interval 1 day, same estate). In its **Stay alive** panel, open **+ Testnet helper: send it from here**, paste the estate seed, **Sign & send heartbeat** — the app builds the dust payment with the right destination tag itself, which is why this exists: most wallets bury the tag, and an untagged heartbeat silently doesn't count.

Copy the printed hash into **Prove life**.

> "To stay alive, I send a dust payment on the XRP Ledger carrying my vault's destination tag. A fraction of a cent, with no Flare-side key, and anyone can relay the proof for me. Watch the round. Prepare, submit, wait for finalisation, fetch the Merkle proof, and verify it on chain."

Heartbeat timer resets on screen.

## 2:15 — Proof of silence (30s on screen, ~5 min real time)

Back to the **death vault** — its 5 minutes are long gone. Click **Claim dormancy**.

> "Now the hard direction. This proves that across hundreds of ledgers, no payment carrying my tag reached the beacon. Proving something happened is easy. Proving nothing happened is the whole problem, and it's why this is on Flare."

**Narrate over the round wait — the most valuable 30 seconds in the video:**

> "This wait is the point. My request sits in a voting round while Flare's data providers, the same validators that secure the price feeds, each independently read the XRP Ledger and satisfy themselves that no payment with my tag exists in that range. Consensus needs more than half the network's weight. Nobody asserts that I've gone silent. A majority of the network's economic weight looked, and agreed."

Vault flips **DORMANT**; the **Execute the will** panel appears (grace 0, no guardians).

## 2:45 — Execute and pay out (35s)

Paste the estate r-address into the estate field *(this vault never heartbeated, so there's nothing to auto-detect — a real vault's estate is found from its own heartbeats)*, click **Execute in the enclave**:

> "Watch what it does. The sealed ciphertext comes back off the chain itself. It's public data, so execution needs no private copy of anything. The estate balance is read live from the XRP Ledger. And inside the enclave, the will is decrypted and priced against the live price feed, so a bequest written in dollars means the right amount of XRP today."

Signed distribution lands in seconds; the app settles it.

> "The contract verified three things independently. The signature recovers to the registered enclave. The revealed commitment matches what I sealed. And the price sits within tolerance of the live feed."

**Distribute the estate** appears. Paste will file + estate seed → **Sign & broadcast**:

> "And there it is. The will, executed. Real payments on the XRP Ledger, to the people it named. This is also the first moment anyone learns who they were."

Click through to a `tesSUCCESS` on the XRPL explorer — the closing money shot. Then one line, over the settled vault:

> "And none of my clicks were needed. A keeper cron job runs this whole sequence unattended, signing with a regular key the owner delegated while alive. We've run it end to end with zero human steps. The clicks are for you."

## 3:20 — The trust boundary (15s)

Scroll the landing page to **The enclave holds your secret. It does not hold your money.**

> "The obvious objection is that the enclave is a trusted component. So it was given exactly one power, reading a will nobody else can read, and no authority over whether, when, or to whom anything moves. It can't move funds early. It can't pay someone else. It can't act alone. And it can't outvote the owner. One late heartbeat resets everything."

## 3:35 — Close (10s)

> "Inheritance is the demo. The primitive is private, programmable rules over native XRP, enforced by an enclave and triggered by provable on-ledger facts. The same machinery does social recovery, vesting, and savings locks, for the two billion XRP sitting idle that Flare is trying to activate."

---

## Say these out loud

Being explicit about limits is worth more than hiding them:

- Timings are shortened — **5 minutes** on the death vault, **1 day** on the life vault. Real vaults use 90 days with a 30-day grace window.
- The FDC round waits were **cut for time**. Say so; do not let it look instant.
- The authorisation is signed in **GemWallet**. Say that Xaman blocks this transaction type for apps that are not yet allowlisted — it is a wallet-vendor safety policy about rekey transactions, not a limitation of the design, and the allowlist request is filed.
- The payout signature comes from a **delegated regular key** — the estate performed a real `SetRegularKey`, the master seed is never touched, and the owner can revoke at any moment while alive. The remaining production step is holding that delegated key **inside the TEE** (tee-node managed-wallet subsystem); today the keeper holds it. Same mechanism, one rung earlier.
- The encrypted will travels in the instruction payload; production keeps it off-chain with only the commitment on-chain — the contract is already structured for that.

## Don't

- Don't skip the seal beat. Browser-side encryption to an attested enclave key is the confidential-compute story — the difference between "routing works" and "the product works".
- Don't heartbeat the death vault — its nonexistence proof will (correctly) refuse for ~25 minutes afterwards. Life vault and death vault, always separate.
- Don't run the keeper on a timer while filming — it will race you to the death vault and win.
- Don't scroll fast through the flatline section — it's the best thing on the page and needs about four seconds.
- Don't skip the proxy logs, and don't let the final reveal go unremarked: the distribution appearing on-chain is the first time the beneficiaries become public, and only because the will legitimately executed.
