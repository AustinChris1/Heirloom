# Privacy

Heirloom is a dead man's switch for XRP. Its whole purpose is that nobody learns who inherits from you, or how much, until your will legitimately executes. This page says exactly what the product knows, what it stores, and who else sees anything.

Short version: **there is no Heirloom server, no account, and no database.** The app is a static page that talks to public infrastructure from your own browser.

---

## What never leaves your browser

- **Your will.** Beneficiaries, amounts, and the residuary address are typed into the page and encrypted there, to the enclave's public key, before anything is sent. The plaintext is never transmitted to us or to anyone else.
- **Your seed.** The app never asks for it in normal use. Authorisation and payouts are signed by your own wallet. The testnet seed fields that exist for fallback are used locally to sign a transaction and are never stored or sent anywhere.
- **Private vault names.** A label like "Mom's plan" is stored in your browser only. Other visitors see the vault number.

## What is stored on your device

The app uses your browser's local storage for convenience, never for tracking:

| Stored | Why |
|---|---|
| A copy of each will you create | So sealing and payout work later without re-typing it |
| Private vault labels | Naming a vault for yourself |
| Whether you connected a wallet here | So a page refresh does not appear to disconnect you |
| An in-flight attestation request | So a refresh mid-round does not cost another fee |
| Which vaults you have already paid out | So a distribution is not broadcast twice |

Clearing your browser data removes all of it. Nothing there is recoverable by us, because it never reaches us.

## What is public, by design

Heirloom writes to public blockchains. Anyone can read:

- That a vault exists, its owner's Flare address, its state, and its timers
- A **hash** of your will, never its contents
- A **hash** of your XRP Ledger account, never the address itself
- Your heartbeat payments on the XRP Ledger, which are ordinary tagged payments
- After a will executes: the distribution amounts and the beneficiary address hashes, and the XRPL payments themselves

That last point matters. Execution is the moment your beneficiaries become discoverable, and that only happens after the network has proven you went silent.

## Who else your browser talks to

Using the app means making requests to third parties, each of which can see your IP address:

| Service | Why |
|---|---|
| Flare's Coston2 RPC | Reading vaults and sending transactions |
| The XRP Ledger public API | Reading balances and ledger data, broadcasting payments |
| Flare's FDC verifier and Data Availability layer | Preparing and fetching attestation proofs |
| The Heirloom enclave host | Fetching the enclave's public key and instruction results |
| Your wallet extension | Signing |
| Vercel, which hosts the page | Serving the site |

We do not run analytics, advertising, tracking pixels, or cookies. The site sets no cookies of its own.

## What we cannot do

- We cannot read your will. Only the enclave can, and only after execution conditions are met.
- We cannot move your XRP. Your funds stay in your own account, and the enclave can only sign a distribution the contract has already verified.
- We cannot recover anything for you. There is no account to reset and no support key.

## Testnet

Heirloom currently runs on Coston2 and the XRP Ledger testnet. No real funds are involved, and testnet data is disposable. Treat anything you enter here as a demonstration, not as a real estate plan.

## Contact

Questions, or something in this page that does not match what the code does: open an issue on [GitHub](https://github.com/AustinChris1/Heirloom) or reach us on [X](https://x.com/heirloom_xrp). The code is public, and this page is meant to be checkable against it.
