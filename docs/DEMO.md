# Demo video script

*Private run-of-show for recording. Not listed on the docs site.*

Target: **~3½ minutes of finished video**. Every beat below genuinely runs — no mock-ups, no "imagine if". The full lifecycle (seal → dormancy → execute → payout) has been run end to end on this deployment; the video's job is to show it happening, clickable, in the app.

> ## Read this first: the waits are longer than the video
>
> An FDC round takes **90–180 seconds to finalise**. The enclave itself is fast — seal and execute results arrive **within seconds** — so the only real waits are the FDC legs.
>
> Do **not** record the FDC waits in one take. Record start and finish, cut the middle, and say "this takes about two minutes, cut for time" — honest, and every judge accepts it. Watching a round begin to finalise is persuasive; you don't need all of it.

## Before recording

- [ ] **Health check** — one command, verifies everything:
      `pnpm exec hardhat run scripts/health.ts --network coston2` → must end `✓ ALL SYSTEMS GO`.
      If the TEE is not status 2, the VPS container restarted and **the TEE identity changed**: re-run `post-build.sh`, then `set-tee-address.ts`. A new TEE identity also means old vaults were sealed to a dead key — prepare the demo vault *after* this check passes.
- [ ] **Top up the estate first.** Payouts drain it, and an estate that cannot cover reserve + fees makes the enclave refuse execution (correctly) — which strands that vault in Executing, recoverable only by `revokeVault`. One faucet call fixes it:
      `curl -X POST https://faucet.altnet.rippletest.net/accounts -H "Content-Type: application/json" -d '{"destination":"<estate r-address>"}'`
- [ ] **Prepare the dormancy → payout vault** (real will, 180-second interval, grace 0):
      `pnpm exec hardhat run scripts/seal-live.ts --network coston2` → note the `VAULT_ID` it prints.
      This creates the vault, encrypts the will to the enclave, seals it, and waits for the enclave's attestation — the same path the app runs. It saves the will to `packages/contracts/deployments/will-vault-<id>.json`.
- [ ] **Decide who cranks: you or the keeper.** `scripts/keeper.ts` runs the whole post-death sequence unattended (claim → execute → settle → payout with the delegated regular key). For the video, clicking execute/payout in the app is the better shot — but mentioning "and a cron job does all of this with nobody watching" is a strong line. If the keeper is on a timer during recording, it WILL race you to the demo vault — disable it while filming.
- [ ] **Keep two things open in an editor for the payout beat:** the will file above, and the estate seed from `packages/contracts/deployments/xrpl-testnet-wallet.json`.
- [ ] **Click through the app once before recording.** The scripts and the app share the same code paths byte-for-byte, and the scripted run is proven — but rehearse the clicks: seal a throwaway vault from the app, and walk the prepared vault through claim → execute → payout. Anything that surprises you should surprise you now, not on camera.
- [ ] **Shell note (PowerShell):** `VAR=value command` is bash syntax and a parse error in PowerShell.
      Use `$env:VAULT_ID="7"; pnpm exec hardhat run ...` instead.
- [ ] Deployer has C2FLR (each SEAL/EXECUTE instruction carries a 1 C2FLR fee).
- [ ] Browser at 1280×720 or larger, zoom 100%, dark room for the black UI.
- [ ] Proxy logs tailing in a second window — a real instruction arriving at a real enclave is your most credible shot.

---

## 0:00 — The problem (20s)

Land on the hero. Let the ECG run.

> "Billions in crypto are lost forever when holders die. If you self-custody XRP, your options today are: give someone your keys, hand it to a custodian, put your seed phrase in a legal document, or do nothing. Almost everyone does nothing."

Scroll to the four options. Let them read.

## 0:20 — The insight (25s)

Scroll into the flatline section slowly. Let the trace die as you scroll — the page does this for you.

> "A dead-man's switch needs to prove something unusual: not that a payment happened, but that **none did**. Proving absence is the hard part. Flare's Data Connector has an attestation type for exactly that — `XRPPaymentNonexistence`. That's the whole reason this is built on Flare."

## 0:45 — Create a vault and seal the will (60s)

Go to `/app`. Connect wallet.

> "This is live on Coston2 against a deployed contract."

Create a vault:
- Paste your XRPL testnet address
- Heartbeat **1 day**, grace **0** *(say: "shortened for the demo — real vaults use 90 and 30 days")*
- Add two beneficiaries — one **$50,000 fixed**, one **100% share**
- Add a residuary address

Point at the right-hand panel:

> "The commitment updates as I type. That hash is the *only* thing that reaches the chain — beneficiaries and amounts never leave the browser. And this distribution preview isn't a mock-up, it's the exact allocation engine that runs inside the enclave. Watch what happens if the estate can't cover the fixed bequest —"

Drop the estate size below the fixed bequest so **abatement** kicks in.

> "— every bequest abates proportionally, preserving the ratios that were written."

Submit. Show the transaction confirming, then click **Download will file**.

> "The chain holds the hash; I hold the will."

Now the seal — open the vault, paste the will file into **Seal the will**:

> "Before anything is encrypted, the app fetches the enclave's public key from its attestation document and checks it derives to the exact address the contract verifies signatures against. A spoofed endpoint gets refused. Then the will is encrypted **in this browser** — ECIES to the enclave's key — and sealed."

Click **Encrypt & seal in the enclave**. The enclave's attestation lands in seconds; cut to the proxy logs showing `HEIRLOOM / SEAL … ok`, then back to the app confirming on-chain.

> "The enclave just proved it can decrypt and execute this will — and told the chain so, over its own signature — without revealing a single beneficiary. That's the dry run you do while you're alive, so a corrupt ciphertext can't surface after you're gone."

## 1:45 — Proof of life and proof of silence (55s on screen, ~5 min real time)

**Both legs are real attestations, not mocks. Do this in the web app, not the terminal** — the vault panel has a **Prove life** field and a **Claim dormancy** button that run the whole FDC flow in the browser: prepare → submit (wallet signs) → wait for the round → fetch the proof → submit it.

> **Send the heartbeat with a script, not a wallet.** The destination tag hides behind an "advanced" toggle in most extensions, and a payment without the tag succeeds on XRPL and silently fails to count — a miserable thing to hit on camera.
>
> ```bash
> $env:VAULT_ID="<n>"; pnpm exec hardhat run scripts/send-heartbeat.ts --network coston2
> ```
>
> It prints the hash to paste straight into **Prove life**.

> "To stay alive I send a dust payment on the XRP Ledger carrying the destination tag unique to my vault. A fraction of a cent, no Flare-side key, and anyone can relay the proof for me."

Then the one that matters. Switch to the **prepared vault** from your pre-flight (the one with the real will and the 180-second interval — it is overdue by now) and click **Claim dormancy**.

> "Now the hard direction. This proves that across four hundred ledgers, *no* payment carrying my tag reached the beacon. Proving something happened is easy. Proving nothing happened is the whole problem — and it's why this is on Flare."

**Narrate over the round wait — this is the most valuable 30 seconds in the video:**

> "And this wait is the point. My request is sitting in a voting round while Flare's data providers — the same validator set that secures the price feeds — each independently go and read the XRP Ledger themselves, and each satisfy themselves that no payment with my tag exists in that range. Consensus needs more than half the network's total weight. Only the Merkle root of what they agreed goes on-chain.
>
> So nobody asserts that I've gone silent. Not me, not a keeper, not Flare. A majority of the network's economic weight independently looked, and agreed."

Land on the vault flipping to **DORMANT**.

## 2:40 — Execute and pay out (35s)

The prepared vault is Dormant, its will attested, grace already elapsed. The **Execute the will** panel is showing.

Paste the estate's r-address into the estate field *(this vault never heartbeated, so there's nothing to auto-detect — a real vault's estate is found from its own heartbeats)*, click **Execute in the enclave**:

> "Watch what it does: the sealed ciphertext comes back off the chain itself — it's public calldata, so execution needs no private copy of anything. The estate balance is read live from the XRP Ledger. And inside the enclave the will is decrypted and priced against the FTSO XRP/USD feed, so '$50,000 to my daughter' means the right amount of XRP *today*, not the day the will was written."

The enclave's signed distribution lands in seconds; the app settles it on-chain.

> "The contract just verified three things independently: the signature recovers to the registered enclave, the revealed commitment matches what I sealed, and the price sits within tolerance of the live feed. Only then is the distribution recorded."

The **Distribute the estate** panel appears. Paste the will file and the estate seed, click **Sign & broadcast**:

> "And there it is — the will, executed. Real payments, on the XRP Ledger, to the people it named."

Click through to one `tesSUCCESS` on the XRPL explorer. This is the closing money shot.

## 3:15 — The trust boundary (15s)

Scroll the landing page to **The enclave holds your secret. It does not hold your money.**

> "The obvious objection is that the enclave is a trusted component. So it was given exactly one power — reading a will nobody else can read — and no authority over whether, when, or to whom anything moves. It can't move funds early, can't pay someone else, can't act alone, and can't outvote the owner. One late heartbeat returns the vault to living and clears every guardian approval."

## 3:30 — Close (10s)

> "Inheritance is the demo. The primitive is private, programmable rules over native XRP, enforced by an enclave and triggered by provable on-ledger facts. Same machinery does social recovery, vesting, and savings locks — for the two billion XRP sitting idle that Flare is trying to activate."

---

## Say these out loud

Being explicit about limits is worth more than hiding them:

- Timings are shortened for the demo — **1 day** on the vault you create on camera, **180 seconds** on the prepared vault. Real vaults use 90 days with a 30-day grace window.
- The FDC round waits were **cut for time**. Say so; do not let it look instant.
- The payout signature comes from a **delegated regular key** — the estate performed a real `SetRegularKey` on XRPL, the master seed is never touched, and the owner can revoke the delegation at any moment while alive. The remaining production step is moving that delegated key **inside the TEE** (the tee-node's managed-wallet subsystem); today the keeper holds it. Same mechanism, one rung earlier.
- The encrypted will travels in the instruction payload; production would keep it off-chain with only the commitment on-chain — the contract is already structured for that.

## Don't

- Don't skip the seal beat to save time. Browser-side encryption to an attested enclave key is the confidential-compute story — it's the difference between "routing works" and "the product works".
- Don't demo dormancy on a vault you heartbeated in the last ~25 minutes — the nonexistence proof will (correctly) refuse. The prepared vault has never heartbeated; that's why it's the one you execute.
- Don't scroll fast through the flatline section — it's the best thing on the page and it needs about four seconds.
- Don't skip the proxy logs. A real instruction arriving at a real enclave is the single most credible thing you have.
- Don't let the reveal go unremarked: the distribution appearing on-chain is the *first moment* the beneficiaries become public — and only because the will has legitimately executed. Say that.
