# Privacy Policy

**Last updated: 14 August 2026**

This policy explains what information Heirloom ("we", "us") collects when you use heirloom.wtf and the Heirloom application (the "Service"), how it is handled, and what rights you have over it.

Heirloom is a dead man's switch for XRP. Its entire purpose is that nobody learns who inherits from you, or how much, until your will legitimately executes. The design follows from that, and so does this policy.

**In short: there is no Heirloom server, no user account, and no database.** The Service is a static web page that runs in your browser and talks directly to public blockchain infrastructure. We do not collect, store, or process personal data about you, because there is nowhere for it to go.

---

## 1. Who we are

Heirloom is an open-source project. The source code for the Service, including this policy, is published at [github.com/AustinChris1/Heirloom](https://github.com/AustinChris1/Heirloom), so every statement below can be checked against what actually runs.

Contact: [@heirloom_xrp](https://x.com/heirloom_xrp) on X, or open an issue on GitHub.

## 2. Information we do not collect

We do not ask for, receive, or store:

- Your name, email address, postal address, or phone number
- An account, username, or password
- Your will: beneficiaries, amounts, or the residuary address
- Your seed phrase or private keys
- Analytics, advertising identifiers, or behavioural profiles

The Service sets **no cookies of its own** and runs **no analytics, advertising, or tracking pixels**.

## 3. Information that stays in your browser

Some information is created by you while using the Service and is stored **only on your own device**, in your browser's local storage. It is never transmitted to us:

| Stored on your device | Purpose |
|---|---|
| A copy of each will you create | So sealing and payout work later without re-entering it |
| Private vault labels, such as "Mom's plan" | So you can name a vault for yourself; others see only the vault number |
| A record that you connected a wallet | So refreshing the page does not appear to disconnect you |
| An in-flight attestation request | So refreshing mid-round does not cost you a second fee |
| Which vaults you have already paid out | So a distribution is not broadcast twice |

Clearing your browser data deletes all of it permanently. We cannot recover it, because we never had it.

**Your will is encrypted inside your browser**, to the enclave's public key, before any part of it is transmitted. The plaintext never reaches us, the enclave host, Flare, or your beneficiaries.

## 4. Information that is public by design

Heirloom writes to public blockchains. Blockchain data is permanent, worldwide, and readable by anyone. It cannot be edited or deleted by us or by you.

The following becomes public when you use the Service:

- That a vault exists, the Flare address that owns it, its state, and its timers
- A **cryptographic hash** of your will, never its contents
- A **cryptographic hash** of your XRP Ledger account, never the address itself
- Your heartbeat payments on the XRP Ledger, which are ordinary tagged payments
- After a will executes: the distribution amounts, the beneficiary address hashes, and the XRP Ledger payments themselves

Execution is the point at which your beneficiaries become discoverable, and it only occurs after the network has proven you went silent. A public blockchain address may be personal data in some jurisdictions if it can be linked to you. Please consider that before publishing an address that identifies you.

## 5. Third parties your browser contacts

Using the Service means your browser makes requests to independent third parties. Each can see your IP address and the fact that a request was made. None of them receive your will.

| Service | Why your browser contacts it |
|---|---|
| Flare Coston2 RPC | Reading vaults, sending transactions |
| XRP Ledger public API | Reading balances and ledger data, broadcasting payments |
| Flare Data Connector verifier and Data Availability layer | Preparing and fetching attestation proofs |
| The Heirloom enclave host | Fetching the enclave's public key and instruction results |
| Your wallet extension (GemWallet, Crossmark, Xaman) | Signing transactions you approve |
| Vercel | Serving the web page |

These parties have their own privacy policies, which govern what they do with the requests they receive. We do not control them.

## 6. Retention

We retain nothing, because we collect nothing. Data in your browser stays until you clear it. Data on a blockchain is permanent by the nature of the technology.

## 7. Your rights

Depending on where you live, data protection law may give you the right to access, correct, delete, port, or restrict the processing of your personal data, and to object to it.

We hold no personal data about you, so there is nothing for us to disclose, correct, or erase. You can exercise the practical equivalent yourself at any time:

- **Delete your local data** by clearing your browser's site data for heirloom.wtf.
- **Revoke the enclave's authority** over your XRP Ledger account at any time while you are alive, using your own wallet.
- **Stop using the Service**, which requires no notice to us.

We cannot delete data from a public blockchain. Nobody can. That limitation is inherent to every blockchain application and is the reason the Service publishes hashes rather than contents.

If you believe we hold personal data about you, contact us and we will look into it.

## 8. Security

Your will is encrypted in your browser using ECIES to a public key fetched from the enclave's attestation, and the application refuses to encrypt anything unless that key matches the exact enclave identity the smart contract trusts. Your private keys stay in your own wallet and are never requested by the Service in normal use.

No system is perfectly secure. The Service is open source specifically so its security claims can be independently verified rather than taken on trust, and its known limitations are documented publicly in the repository.

## 9. Children

The Service is not directed at anyone under 18, and we do not knowingly collect information from children.

## 10. International use

The Service is a static page served from a content delivery network and is reachable worldwide. Because we operate no server and hold no personal data, there is no international transfer of your personal data by us. Requests your browser makes to third parties may be served from infrastructure anywhere in the world.

## 11. Testnet

Heirloom currently runs on the Flare Coston2 test network and the XRP Ledger testnet. No real funds are involved, and testnet data is disposable and may be reset without notice. Anything you enter is a demonstration, not a real estate plan.

## 12. Changes to this policy

If this policy changes, the updated version is published in the same public repository as the code, with a new date at the top. The revision history is visible in the repository's commit log.

## 13. Contact

Questions about this policy, or anything in it that does not match what the code does: open an issue on [GitHub](https://github.com/AustinChris1/Heirloom) or reach us on [X](https://x.com/heirloom_xrp). This page is meant to be checkable against the source.

See also: [Terms and Conditions](TERMS.md).
