# Demo video script

Target: **3 minutes of finished video**. Every beat below is something that genuinely runs — no mock-ups, no "imagine if". Where a step isn't live yet, say so on camera; judges reward that far more than they punish it.

> ## Read this first: the scripts are slower than the video
>
> An FDC round takes **90–180 seconds to finalise**, and you run two of them. Real elapsed time for the two attestation scripts is **four to six minutes**, not the 60 seconds they occupy on screen.
>
> So do **not** try to record those live in one take. Either:
>
> **(a) Record them separately and cut the waits.** Start each script, record start and finish, edit the wait out. Say "this takes about two minutes, cut for time" — that is honest and every judge accepts it.
>
> **(b) Run them before recording** and show the terminal output plus the explorer links on camera.
>
> Option (a) is better: watching a round actually finalise is persuasive, you just don't need all of it.

## Before recording

- [ ] **Run the health check** — one command, verifies everything:
      `pnpm exec hardhat run scripts/health.ts --network coston2` → must end `✓ ALL SYSTEMS GO`.
      If the TEE is not status 2, the VPS container restarted and **the TEE identity changed**: re-run `post-build.sh`, then `set-tee-address.ts`.
- [ ] **Create a fresh vault for the dormancy demo**, because a vault can only go dormant once:
      `INTERVAL=120 pnpm exec hardhat run scripts/create-short-vault.ts --network coston2` → note the `VAULT_ID`.
      Wait 120 seconds before running `claim-dormancy.ts` against it.
- [ ] Deployer has C2FLR.
- [ ] Browser at 1280×720 or larger, zoom 100%, dark room for the black UI.
- [ ] Proxy logs tailing in a second window — you will want them live on camera.

---

## 0:00 — The problem (20s)

Land on the hero. Let the ECG run.

> "Billions in crypto are lost forever when holders die. If you self-custody XRP, your options today are: give someone your keys, hand it to a custodian, put your seed phrase in a legal document, or do nothing. Almost everyone does nothing."

Scroll to the four options. Let them read.

## 0:20 — The insight (25s)

Scroll into the flatline section slowly. Let the trace die as you scroll — the page does this for you.

> "A dead-man's switch needs to prove something unusual: not that a payment happened, but that **none did**. Proving absence is the hard part. Flare's Data Connector has an attestation type for exactly that — `XRPPaymentNonexistence`. That's the whole reason this is built on Flare."

## 0:45 — Create a vault (50s)

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

Submit. Show the transaction confirming.

## 1:35 — Proof of life and proof of silence (60s on screen, ~5 min real time)

**This is the centrepiece. Both legs are real attestations, not mocks.**

> "To stay alive I send a dust payment on the XRP Ledger carrying the destination tag unique to my vault. A fraction of a cent, no Flare-side key, and anyone can relay the proof for me."

```bash
pnpm exec hardhat run scripts/live-heartbeat.ts --network coston2
```

Let it run — it funds an XRPL wallet, sends the payment, requests an FDC attestation, waits for the round to finalise, and submits the proof. Narrate over the wait.

> "That's a real XRPL payment, a real FDC attestation, a real Merkle proof verified by Flare's own contract. Proof of life accepted."

Then the one that matters. Use the **fresh** vault id from your pre-flight — a vault that is already Dormant will refuse, since dormancy can only be claimed from Active:

```bash
VAULT_ID=<your fresh id> pnpm exec hardhat run scripts/claim-dormancy.ts --network coston2
```

> "Now the hard direction. This proves that across four hundred ledgers, *no* payment carrying my tag reached the beacon. Proving something happened is easy. Proving nothing happened is the whole problem — and it's why this is on Flare."

Land on `state 1 → 2` and `DORMANCY PROVEN ON-CHAIN`.

Optionally cut to the app's **Stay alive** panel to show the human version of the same thing — beacon address, destination tag, amount, all copyable.

## 2:10 — Confidential compute (35s)

This is the strongest section. Have proxy logs visible.

> "The will itself is sealed to a hardware enclave. Let me show you that path is real."

Run:

```bash
pnpm exec hardhat run scripts/seal-e2e.ts --network coston2
```

Cut to the proxy logs:

```
opType HEIRLOOM, opCommand SEAL, ... node returned 400: can not decrypt
```

> "That instruction went from my contract, through Flare's data providers, into an enclave running on my own machine, and failed exactly where it should — because I deliberately sent it junk instead of a properly encrypted will. Everything up to the enclave's decrypt call is live. The client-side encryption is the one piece I haven't finished."

Then show status — `health.ts` is the better shot, since it proves the whole system in one screen:

```bash
pnpm exec hardhat run scripts/health.ts --network coston2
```

> "Status 2 — production. Registered TEE machine on extension 66025, wired to the vault, serving over TLS from my own box. All systems go."

## 2:45 — The trust boundary (15s)

Scroll the landing page to **The enclave holds your secret. It does not hold your money.**

> "The obvious objection is that the enclave is a trusted component. So it was given exactly one power — reading a will nobody else can read — and no authority over whether, when, or to whom anything moves. It can't move funds early, can't pay someone else, can't act alone, and can't outvote the owner. One late heartbeat returns the vault to living and clears every guardian approval."

## 3:00 — Close (10s)

> "Inheritance is the demo. The primitive is private, programmable rules over native XRP, enforced by an enclave and triggered by provable on-ledger facts. Same machinery does social recovery, vesting, and savings locks — for the two billion XRP sitting idle that Flare is trying to activate."

---

## Say these out loud

Being explicit about limits is worth more than hiding them:

- Timings are shortened for the demo — **1 day** on the vault you create on camera, **120 seconds** on the dormancy vault. Real vaults use 90 days with a 30-day grace window.
- The attestation waits were **cut for time**. Say so; do not let it look instant.
- `live-heartbeat.ts` uses its **own** cached XRPL wallet and vault, not the vault you created on camera. Either say "here's the same flow on a vault I prepared earlier", or skip creating one on camera and narrate over the script instead.
- Sealing needs **client-side ECIES** to the enclave's public key. Transport is proven; encryption isn't wired.
- XRPL payout **broadcasting** is future work — the enclave signs, nothing pushes it to the ledger.

## Don't

- Don't claim a full seal → dormancy → **payout** cycle. Everything up to dormancy is real; the payout leg is not, and one follow-up question finds that out.
- Don't scroll fast through the flatline section — it's the best thing on the page and it needs about four seconds.
- Don't skip the proxy logs. A real instruction arriving at a real enclave is the single most credible thing you have.
