# Heirloom

**Confidential inheritance and programmable custody for native XRP.**

A trustless dead-man's switch. XRP holders set up private, programmable inheritance and recovery rules where the will is sealed inside a Flare Confidential Compute enclave, the heartbeat is proven by the Flare Data Connector, and the XRP never has to leave the XRP Ledger.

Built for [Flare Summer Signal](https://dorahacks.io/hackathon/flaresummersignal/detail) — entered in both bounties: **Interoperable Asset Products** and **Confidential Compute Apps**.

---

## The problem

Billions of dollars in crypto are permanently lost when holders die or lose access to their keys. XRP's holder base skews long-term retail — people who bought years ago and hold in self-custody. It is exactly the population least likely to have an estate plan for their coins, and there is no good option available to them today:

- **Give someone your keys.** They can take everything, today, while you are alive and well.
- **Use a custodian.** You stop self-custodying, which is the thing you were doing on purpose.
- **Write a legal will.** The seed phrase ends up in a document handled by people you did not choose, and probate is public.
- **Do nothing.** The coins are lost forever. This is what almost everyone does.

What is missing is a way to say *"if I am gone, distribute my XRP like this"* that nobody can act on early, nobody can read while you are alive, and nobody has to be trusted to carry out.

## What Heirloom does

Alice registers a vault bound to her XRP Ledger account and writes her will in the app: beneficiaries, splits, fiat-denominated bequests, a heartbeat interval, and optionally a set of guardians. The will is encrypted to a TEE's public key before it leaves her browser. Flare stores only a commitment to it.

While alive she sends a periodic dust payment on the XRP Ledger to a shared Heirloom beacon address, carrying a destination tag unique to her vault. That is her heartbeat. It costs a fraction of a cent and requires no Flare-side key.

If she stops, anyone can request an FDC attestation proving no tagged heartbeat reached the beacon across the whole interval. That opens a grace window rather than releasing anything. A single late heartbeat — or Alice's own transaction — reverts the vault and clears every guardian approval. Only after the grace window elapses *and* the guardian threshold is met does the enclave decrypt the will, price it against FTSO, and sign the XRPL payments that distribute the estate.

No custodian, no lawyer, no key handover, and nobody — not the guardians, not Flare, not Heirloom — ever sees the will.

## Why this needs Flare specifically

This product is not portable to another chain. Four enshrined protocols each carry weight nothing else provides:

| Protocol | Surface | Role |
|---|---|---|
| **FDC** | `XRPPayment` (`0x08`) | Proof of life. Verified against the estate's own XRPL source address, so nobody can heartbeat on a dead holder's behalf. |
| **FDC** | `XRPPaymentNonexistence` (`0x09`) | Proof of *silence* — that no tagged heartbeat exists across a ledger range. This is the dead-man's switch itself. |
| **FCC** | TEE extension (`HEIRLOOM`) | Holds and executes the sealed will inside hardware isolation; the chain verifies its signature without ever seeing a beneficiary. |
| **FTSO** | XRP/USD block-latency feed | Lets a will say "$50,000 to my daughter" rather than a drop count fixed years earlier. |
| **FAssets** | FXRP | Optional delivery rail — a beneficiary can elect FXRP on Flare instead of native XRP, landing directly in XRPFi. |

`XRPPaymentNonexistence` is the load-bearing one. Proving a payment *happened* is common; proving that across an entire ledger range **no** matching payment exists is a fundamentally harder claim, and FDC is the only oracle that makes it verifiable on-chain. Without it there is no trustless dead-man's switch — only a keeper you have to trust to tell the truth about silence.

## Status

Verified live against Coston2 (`scripts/verify-live.ts`):

```
Connected to Coston2 (chainId 114), head block 33,767,053

  FlareTeeManager  0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE  live
  FdcVerification  0x906507E0B64bcD494Db73bd0459d1C667e14B933  live
  FdcHub           0x48aC463d7975828989331F4De43341627b9c5f1D  live
  FtsoV2           0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d  live

  FTSO XRP/USD:    $1.034433
  FCC extensions:  485 public extension(s) registered
```

**Live on Coston2, end to end.**

| | |
|---|---|
| `HeirloomVault` | [`0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A`](https://coston2-explorer.flare.network/address/0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A) |
| FCC extension id | `66025` — registered with the vault itself as the InstructionSender |
| TEE machine | `0xb1c696717eedEb7e215f381d81f8edaA185eE60c` — on-chain status **2 (PRODUCTION)** |
| Enclave endpoint | `https://sly.southafricanorth.cloudapp.azure.com` |

**The full lifecycle has been run against this deployment** — vault created, will ECIES-encrypted in the client and sealed, the enclave decrypting and attesting it, dormancy proven by a real FDC nonexistence attestation, the will executed and priced inside the enclave at the FTSO snapshot, the TEE-signed distribution verified by `settleEstate`, and three real XRPL payments delivered `tesSUCCESS` on testnet. The transaction trail is in [Usage](docs/USAGE.md).

Both FDC attestation legs run against live infrastructure — including **from the web app itself**, where a visitor signs the attestation request with their own wallet, waits out the voting round, and submits the Merkle proof without ever opening a terminal. The seal → execute → payout legs are equally clickable at `/app`.

**→ [How to use it](docs/USAGE.md)** · **[TEE deployment](docs/TEE-DEPLOYMENT.md)**

| Component | State |
|---|---|
| `HeirloomVault.sol` — full lifecycle, FDC + FTSO + FCC integration | Deployed on Coston2, 30 tests passing |
| TEE extension — will schema, allocation engine, SEAL/EXECUTE handlers | Complete, 19 tests passing |
| Demo app — reads the live contract and the live FTSO feed | Complete, builds clean |
| TEE extension registered on live FCC infrastructure | **Live** — extension 66025, TEE machine `0xb1c6…E60c` at status 2 (PRODUCTION) |
| Seal → execute → settle → payout | **Live** — full run on vault #6: enclave-decrypted will, TEE-signed distribution, 3 XRPL payments `tesSUCCESS` |

## Repository layout

```
packages/
  contracts/      Solidity — HeirloomVault, TEE result verification, tests, deploy scripts
  extension/      Flare Compute Extension — will schema, allocation engine, handlers
  web/            React app — landing page at /, working vault client at /app
```

The web app is two surfaces on purpose. `/` is a scroll-driven landing page; `/app` is the working client where you connect a wallet, build a will, create a vault, and act on it. A page that is read and a dashboard that is operated want different designs, so they get different routes.

**What you can actually do at `/app` right now:** connect a wallet and switch to Coston2, compose a will with fixed-dollar, fixed-XRP and percentage bequests, watch the commitment and the full distribution recompute live against the real allocation engine, create a vault on-chain and download its will file, read every vault's live state, copy the exact XRPL heartbeat payment your vault needs, confirm as a guardian, and cancel a dormancy claim as the owner. Then the confidential legs: seal the will — encrypted in your browser to the enclave's attested key, refused unless that key derives to the address the contract trusts — watch the enclave attest it, execute a dormant vault (the sealed ciphertext is recovered from the chain itself, the estate balance read live from XRPL), settle the TEE-signed distribution, and broadcast the settled bequests as real XRPL payments.

## Running it

```bash
# Contracts — 30 tests
cd packages/contracts && pnpm install && pnpm exec hardhat test

# Read-only preflight against live Coston2 (no funds needed)
pnpm exec hardhat run scripts/verify-live.ts

# Extension — 19 tests
cd ../extension && pnpm install && pnpm exec vitest run

# Demo app
cd ../web && pnpm install && pnpm dev
```

To deploy, fund the deployer address printed by `hardhat run scripts/new-deployer.ts` at the [Coston2 faucet](https://faucet.flare.network/coston2), then:

```bash
pnpm exec hardhat run scripts/deploy.ts --network coston2
```

## Design decisions worth defending

**Dormancy is a claim, not a verdict.** The most dangerous failure mode is not theft — it is a false positive that distributes a living person's estate. So dormancy only ever opens a window. `proveLife` is accepted in the Dormant state, is permissionless, and requires no Flare-side key, which means a holder who is alive but offline, travelling, or out of gas can still be rescued by anyone willing to relay their XRPL heartbeat. Recovery clears all guardian approvals.

**Guardians confirm; they never seize.** They cannot read the will, alter a term, or move funds. The worst a fully colluding guardian set can do is fail to slow down a dormancy claim that was already cryptographically proven.

**The nonexistence bound is exact.** `XRPPaymentNonexistence` excludes payments delivering *more than* the requested amount, so the contract requires the request to be for exactly `heartbeatDrops - 1`. Anything larger would let real heartbeats slip through the search unnoticed; the contract rejects those proofs rather than trusting the claimant's parameters. There is a test for it.

**Sealed wills get a dry run.** `sealWill` asks the enclave to decrypt and parse the will *while the owner is alive* and attest that it is readable. Without that step, a corrupt or mis-encrypted ciphertext would only surface at execution — when the one person who could fix it is gone.

**Estates abate proportionally.** When the estate cannot cover every fixed bequest — because XRP moved, or the holder spent down the account after writing the will — the fixed bequests are scaled down in proportion rather than paid first-come-first-served. That is how estates actually settle, and the alternative silently rewrites the testator's intent based on list order.

**Three independent checks gate a settlement.** The signature must recover to the registered TEE address, the revealed commitment must match what the owner sealed, and the price the enclave used must sit within 5% of the live FTSO feed. The first proves the enclave produced it, the second proves it executed *this* will and not a substituted one, the third bounds how far a stale price could skew a fiat-denominated bequest.

## Honest limitations

Stated plainly, because the alternative is a judge discovering them.

- **Sealing a will still needs the payload ECIES-encrypted to the enclave's public key.** *(The two FDC legs — `proveLife` and `claimDormancy` — now run against live attestations, not mocks; see [USAGE.md](docs/USAGE.md) for transaction hashes.)* The relay itself is proven: a `HEIRLOOM`/`SEAL` instruction sent from the deployed vault reached the enclave through Flare's data providers and was rejected at exactly the right step — `node returned 400: can not decrypt` — because the test payload was deliberate junk. Everything up to and including the enclave's decrypt call is live; what remains is the client-side encryption step, so the demo currently seals against a payload the enclave cannot open.
- **The encrypted will currently rides in the instruction payload.** Flare's own guidance is explicit that on-chain storage of encrypted secrets is unsuitable for production. The production path is an off-chain blob with only the commitment on-chain; the contract is already structured for it, since the commitment is what settlement checks.
- **FXRP delivery is modelled but not wired.** `Bequest.flareRecipient` is carried end-to-end and recorded on settlement; the actual FXRP transfer is not implemented.

## Where this goes next

Inheritance is the demo. The primitive underneath is *private, programmable rules governing native XRP, enforced by an enclave and triggered by provable on-ledger facts.* The same machinery covers:

- **Social recovery** — lost your key, guardians plus the enclave restore access.
- **Vesting and savings locks** — funds that unlock on a schedule or on a provable condition.
- **Corporate treasury continuity** — a signer goes dark, the enclave rotates authority per a sealed policy.

Flare is trying to activate more than 2 billion idle XRP. A meaningful share of it is idle precisely because its owners have no safe answer to *what happens if I am not here*. Heirloom is that answer, and every vault it protects is XRP with a reason to move on-chain.
