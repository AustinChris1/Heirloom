# Heirloom demo video: production brief

*Private. Not listed on the docs site.*

The footage is already recorded. This document is the narration and the edit: every scene says what is on screen, what happens in it, and the exact words to read over it.

**Final video target:** 4 minutes 30 seconds, 1920 x 1080, MP4 with burned-in captions.

**Every quoted line is written for an AI voice.** No em dashes, no code formatting, no symbols a reader would say out loud, short sentences. Paste them in exactly as written. Generate each scene as its own clip so it can be nudged against the picture.

---

## 1. What Heirloom is, in two sentences

Heirloom is a dead man's switch for XRP. You write a will that nobody can read, you prove you are alive with a tiny payment now and then, and if you go silent the network proves it, a sealed computer opens your will, and your heirs are paid from your own account.

The thing that makes it special: your XRP never moves while you are alive, nobody can read the will early, and after you are gone no human being holds a key that could move the money.

---

## 2. The recorded flow

Scenes follow the recording exactly:

| # | Scene | Footage |
|---|---|---|
| 1 | The problem | Landing hero, scrolling the four bad options |
| 2 | The insight | Landing flatline section |
| 3 | The documentation | Docs, flicking through each page |
| 4 | Test networks | `/app`, then the Flare and XRP faucets |
| 5 | Live vaults | Scrolling the vault list |
| 6 | Writing the will | New vault form, commitment, preview, abatement |
| 7 | Authorising the enclave | GemWallet approval |
| 8 | Sealing the will | Encrypt and seal, enclave attests |
| 9 | Staying alive | Heartbeat, then Prove life |
| 10 | Proving silence | Claim dormancy, vault turns Dormant |
| 11 | Execution | Execute the will, vault turns Settled |
| 12 | The payout | Enclave signs, payments land on XRPL |
| 13 | Close | End card |

---

## 3. The script

Read slowly. Almost everyone goes too fast on the first pass; slow down about twenty percent from what feels natural.

---

### Scene 1: The problem (0:00 to 0:35)

**Show:** Landing hero, the ECG pulse running. Then the scroll into the four options.

**Do:** Let the hero sit for three seconds before any voice starts. Scroll slowly through the four options; each one wants about two seconds on screen.

**Say:**

> Billions in crypto are lost forever when the people holding it die. If you hold XRP yourself, every option you have today is bad. Give someone your keys, and they can take everything tomorrow, while you are alive and well. Move it to a custodian, and you have given up the one thing you were protecting. Write your seed phrase into a legal will, and it sits in a document handled by people you did not choose. Or do nothing, which is what almost everyone does.

---

### Scene 2: The insight (0:35 to 1:00)

**Show:** The flatline section. The heartbeat trace dies as the page scrolls.

**Do:** Scroll into it slowly. Let the trace finish dying before the voice starts. This section does the work; do not rush it.

**Say:**

> A dead man's switch has to prove something unusual. Not that a payment happened, but that none did. Proving absence is the hard part, and almost nothing on chain can do it. Flare's Data Connector has an attestation type for exactly this. It is called XRP Payment Nonexistence, and it is the reason this is built on Flare.

**Editing note:** Hold the final frame of the flatline for one extra second before cutting to Scene 3. Silence there is good.

---

### Scene 3: The documentation (1:00 to 1:15)

**Show:** The docs site, flicking through the pages.

**Do:** Keep each page on screen about two seconds. Do not linger or scroll deeply; this is a flick, not a read.

**Say:**

> Everything here is written down. How it works in plain language, the architecture, the deployment, and the honest limits. The docs are served from the same repository they describe, so they cannot drift from what is running.

---

### Scene 4: Test networks (1:15 to 1:35)

**Show:** The app at `/app`, then the Flare faucet and the XRP Ledger faucet.

**Do:** Show each faucet page for about four seconds.

**Say:**

> This runs on test networks. Flare's Coston 2 for the contract, and the XRP Ledger testnet for the money. Both faucets are free and open, so everything you are about to see can be reproduced by anyone, with nothing real at risk.

---

### Scene 5: Live vaults (1:35 to 1:50)

**Show:** The vault list, scrolling.

**Do:** Scroll gently. Let one or two vault cards with live countdown timers stay on screen long enough to see the seconds moving.

**Say:**

> These are real vaults on a deployed contract, and anyone can read them. The timers are live. What you cannot see is who inherits, or how much, because that never touches the chain.

---

### Scene 6: Writing the will (1:50 to 2:35)

**Show:** The New vault form. Estate account, timings, beneficiaries, residue. The right-hand panel updating as you type.

**Do:**

1. Fill in the estate account.
2. Set the interval to minutes and the grace window to zero.
3. Add the beneficiaries, one row at a time, slowly enough that the commitment visibly changes.
4. Drop the estate size below the fixed bequests so the abatement warning appears. Hold two seconds.
5. Create the vault.

**Say:**

> I bind a vault to my own XRP Ledger account. This is the account holding my savings, and it is the account my heirs are paid from. Nothing is deposited into Heirloom. Nothing moves at all.

> Watch the commitment on the right. It updates as I type. That hash is the only thing that ever reaches the chain. The beneficiaries and the amounts never leave this browser. And the distribution preview underneath is not a mock-up. It is the same allocation engine that runs inside the enclave later.

> If the estate cannot cover everything I promised, every bequest shrinks in proportion, preserving the ratios I wrote.

**Editing note:** A subtle zoom into the commitment hash as it changes makes the point land. One point one times is enough.

---

### Scene 7: Authorising the enclave (2:35 to 3:00)

**Show:** The authorisation panel, the GemWallet popup, then the green confirmation.

**Do:** Click authorise, approve in the wallet, and hold on the green confirmation line for two full seconds.

**Say:**

> Now the step that makes everything after my death possible. I grant the enclave's key permission to sign for my account. This is one ordinary XRP Ledger transaction, approved in my own wallet. My key never leaves that wallet. The enclave's key was generated inside the hardware and has never been exported to anyone, including me. And I can revoke this at any time while I am alive.

**Editing note:** This is the second most important frame in the video. Zoom slightly on the green confirmation.

---

### Scene 8: Sealing the will (3:00 to 3:25)

**Show:** The seal panel with the will matched to the commitment, then the encrypt and seal step running.

**Do:** Click seal. Two wallet confirmations. The enclave answers in seconds, so this needs no trimming.

**Say:**

> Before anything is encrypted, the app fetches the enclave's public key from its attestation document, and refuses to continue unless that key matches the exact identity the contract trusts. Then the will is encrypted here in the browser and sent to the sealed computer.

> It just proved it can open my will and execute it, and it said so with its own signature, without revealing a single beneficiary. That is the rehearsal you run while you are alive, so a broken will cannot surface after you are gone.

---

### Scene 9: Staying alive (3:25 to 3:45)

**Show:** The Stay alive panel, the heartbeat being sent, then Prove life running its five steps.

**Do:** Send the heartbeat, then start Prove life. Let the progress bar move for a few seconds before cutting.

**Say:**

> To stay alive I send a tiny payment on the XRP Ledger, carrying a destination tag unique to my vault. A fraction of a cent. No Flare transaction needed, and anyone can relay the proof on my behalf, so being offline never puts me at risk.

**Editing note:** The voting round takes two to three minutes. Speed-ramp it to about four seconds and let the caption say the wait was shortened.

---

### Scene 10: Proving silence (3:45 to 4:20)

**Show:** The overdue vault, its counter climbing. Claim dormancy running. The vault turning Dormant.

**Do:** Start the claim. Hold on the progress bar during the narration below, then cut to the moment the state changes.

**Say:**

> Now the hard direction. This proves that across hundreds of ledgers, no payment carrying my tag ever reached the beacon.

> This wait is the point. My request is sitting in a voting round while Flare's data providers, the same validators that secure the price feeds, each go and read the XRP Ledger for themselves. Each one satisfies itself that no payment with my tag exists in that range. More than half the network's economic weight has to agree. Nobody asserts that I am gone. The network looked, and agreed.

> And even now, nothing has moved. This opens a waiting period. One heartbeat from me, or one button, cancels all of it and clears every approval.

**Editing note:** This is the centrepiece. Keep the start and the end of the round, speed-ramp the middle, and let the narration run across the cut so it feels continuous.

---

### Scene 11: Execution (4:20 to 4:40)

**Show:** Execute the will, the confirmations, the vault reaching Settled with the distribution table.

**Say:**

> The waiting period has passed, so the will can execute. The sealed will is recovered from the chain itself, because the encrypted copy is public and useless to anyone but the enclave. The estate balance is read live from the XRP Ledger. Inside the enclave the will is decrypted and priced against Flare's live XRP price feed, so a bequest written in dollars means the right amount of XRP today.

> The contract then checks three things before accepting anything. That the signature really came from the registered enclave. That the will matches the fingerprint I sealed. And that the price is close to the live feed.

---

### Scene 12: The payout (4:40 to 5:05)

**Show:** The distribution table, the enclave signing, the results with tesSUCCESS, then the XRPL explorer.

**Do:** Click through to one transaction on the explorer and hold for three seconds.

**Say:**

> And here is the part that matters most. I am not signing this. Nobody is. The enclave signs these payments with the key it generated inside itself, using the permission I granted while I was alive. No seed is entered by anyone, anywhere.

> Real payments, on the XRP Ledger, to the people my will named. This is also the first moment anyone learns who they were.

---

### Scene 13: Close (5:05 to 5:15)

**Show:** Back on the landing page, or an end card.

**Say:**

> Inheritance is the demonstration. The primitive underneath is private, programmable rules over native XRP, enforced by an enclave and triggered by facts the network proves for itself. My coins never left my account while I was alive. Nobody could read my will. Nobody could act early. And when the network agreed I was gone, no human being had to be trusted to carry it out.

---

## 4. Editing checklist

### Audio

- [ ] Remove silences longer than half a second, except the deliberate holds noted in Scenes 2 and 7.
- [ ] Ambient instrumental bed at about minus twenty five decibels. No vocals.
- [ ] Normalise the voice to minus three decibels peak. Light noise reduction only.
- [ ] Optional: a soft chime when the vault state changes in Scenes 10 and 12.

### Captions

- [ ] Auto-generate, then proofread every line. Watch these specifically: **Heirloom, Coston 2, XRPL, XRP Ledger, FDC, FTSO, GemWallet, enclave, TEE, tesSUCCESS, dormancy, attestation, Merkle**.
- [ ] Style: bold sans-serif white, black drop shadow, bottom centre, burned in.
- [ ] Where a wait is speed-ramped, add a caption saying the wait was shortened. Do not let it look instant.

### Visuals

- [ ] Hard cuts only. Fade only at the very end.
- [ ] Subtle zooms, one point one times, on exactly three frames: the commitment hash in Scene 6, the green authorisation confirmation in Scene 7, and the tesSUCCESS result in Scene 12.
- [ ] Speed-ramp the two voting rounds in Scenes 9 and 10. Nothing else needs it; the enclave answers in seconds.
- [ ] No filters or grading. The app is already monochrome by design.

---

## 5. Delivery

- **Format:** MP4, H.264
- **Resolution:** 1920 x 1080
- **Frame rate:** 30 fps
- **Audio:** AAC, 192 kbps stereo
- **Length:** aim for 4:30 to 5:15. Past 5:30 it starts to feel long.

If you need to cut for time, drop Scene 3 (documentation) first, then tighten Scene 5 (vault list).

---

## 6. Say these out loud

Being explicit about limits is worth more than hiding them, and each has a good answer:

- **Timings are shortened.** The demo vault uses minutes instead of the ninety days a real vault would use, and no grace window instead of thirty days.
- **The attestation waits were cut.** Say it; every judge accepts it.
- **The authorisation was signed in GemWallet.** Xaman refuses this transaction type for apps that are not yet allowlisted, because rekey transactions are the classic phishing pattern. That is a wallet vendor's safety policy, not a limit of the design, and the request is filed.
- **The encrypted will travels in the instruction payload.** Production keeps it off chain with only the fingerprint on chain, and the contract is already built for that.
- **This is testnet.** No real money moved.

## 7. Don't

- Don't skip the sealing scene. Browser-side encryption to an attested enclave key is the confidential compute story.
- Don't say the enclave holds the money. It holds a signing key and a secret. The XRP never leaves the owner's account until the will executes.
- Don't rush the flatline scroll or the voting-round narration. Those two moments carry the argument.
- Don't let the final reveal go unremarked. The distribution appearing on chain is the first time the beneficiaries become public, and only because the will legitimately executed.

## 8. If you re-record

The order that works, and the traps:

1. Create the vault **wallet first**. The estate must be an account your XRPL wallet actually holds, or the authorisation cannot be signed.
2. **Seal before anything else.** A will can only be sealed while the vault is Active. The app blocks a dormancy claim on an unsealed vault, but the order still matters.
3. Authorise the enclave while the vault is Active.
4. Use two vaults: a life vault for the heartbeat scene, and a death vault that is **never heartbeated**. A heartbeat blocks that vault's silence proof for about twenty five minutes.
5. Keep the estate funded. A balance below the ledger reserve plus fees makes the enclave refuse to execute. Correct behaviour, bad look on camera.
6. Don't run the keeper on a timer while filming. It will do your clicks for you.
