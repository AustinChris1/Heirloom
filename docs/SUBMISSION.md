# Flare Summer Signal — submission

Filled against the required fields from the [hackathon brief](https://dorahacks.io/hackathon/flaresummersignal/detail).

---

## Project name

**Heirloom** — confidential inheritance and programmable custody for native XRP.

## Selected bounties

**Both.**

- **Confidential Compute Apps** — the will (beneficiaries, splits, trigger terms) is ECIES-encrypted to a Flare Compute Extension's key and only ever decrypted inside the TEE. Flare stores a commitment; the chain never sees a beneficiary. Heirs do not know they are heirs.
- **Interoperable Asset Products** — the trigger is a pair of FDC attestations over the XRP Ledger, and the payout is native XRP distributed by XRPL transactions the enclave assembles and signs. Flare smart contracts govern an asset that never leaves its home chain.

The two are not two projects stapled together: the confidential half is what makes the interoperable half safe to automate. A dead-man's switch whose terms are public tells the world exactly when and to whom a large XRP balance is about to move.

## Short product description

A trustless dead-man's switch for XRP holders. You bind a vault to your XRP Ledger account, write a will that is encrypted before it leaves your browser, and prove you are alive with a periodic dust payment on the XRPL. If you go silent for a full interval, an FDC attestation proves that silence on Flare, a grace window opens, and only after it elapses does a TEE decrypt your will, price it against FTSO, and sign the XRPL payments that distribute your estate. Any heartbeat during the grace window cancels everything.

## Target user

Long-term self-custodying XRP holders — the "held since 2013" cohort — who have no estate plan for their coins because every existing option requires either giving someone their keys today or giving up self-custody entirely. Secondarily: anyone who wants programmable custody over native XRP (social recovery, vesting, treasury continuity) without wrapping or bridging it.

## Demo

- **Demo app:** `packages/web` — `pnpm install && pnpm dev`. Reads the live Coston2 FTSO XRP/USD feed and the live FCC extension registry, and previews the distribution using the exact allocation engine that runs inside the enclave.
- **Live protocol preflight:** `pnpm exec hardhat run scripts/verify-live.ts` in `packages/contracts` — no funds needed, confirms every Flare dependency answers on Coston2.
- **Test suites:** 49 tests total — 30 contract tests, 19 extension tests.

## GitHub repo

This repository. Layout:

```
packages/contracts/   HeirloomVault.sol, TeeActionResult.sol, tests, deploy + verification scripts
packages/extension/   Flare Compute Extension — will schema, allocation engine, SEAL/EXECUTE handlers
packages/web/         Demo app
docs/                 This document, ARCHITECTURE.md
```

## How the project uses Flare

Five integration points, each load-bearing:

**1. FDC `XRPPayment` (`0x08`) — proof of life.**
`HeirloomVault.proveLife` verifies an XRPL payment proof and requires that it originated from the estate's own XRPL account (`sourceAddressHash`), landed on the Heirloom beacon, carried this vault's unique destination tag, succeeded on the ledger, delivered at least the configured minimum, and is strictly newer than the heartbeat on record. Permissionless, so a relayer can rescue an offline holder.

**2. FDC `XRPPaymentNonexistence` (`0x09`) — proof of silence.**
`claimDormancy` is the heart of the product. It requires the attestation's search range to start no later than the last proven heartbeat and extend past the moment the next one was due — closing the gap a claimant could otherwise use to prove silence over an unrelated window. It also pins `requestBody.amount` to exactly `heartbeatDrops - 1`, because the attestation excludes payments delivering *more than* that bound; any larger value would let genuine heartbeats slip through the search.

**3. FCC — the sealed will.**
`HeirloomVault` is itself the FCC InstructionSender. It routes `HEIRLOOM/SEAL` and `HEIRLOOM/EXECUTE` instructions through `TeeExtensionRegistry.sendInstructions`, and verifies returned results against the registered TEE address using the domain-separated scheme the TEE nodes actually sign: `keccak256(abi.encode("TEE_ACTION_RESULT", chainId, ActionResult.Hash()))` under the EIP-191 prefix, matching `go-flare-common`'s `signing.TEEActionResult`.

**4. FTSO — fiat-denominated bequests.**
`requestExecution` reads XRP/USD from the block-latency feed and passes it into the enclave, so a will can say "$50,000 to my daughter". On settlement the contract re-reads the feed and rejects any distribution priced more than 5% away from it, bounding how far a stale or manipulated price could skew a bequest.

**5. FAssets — optional delivery rail.**
Each bequest carries an optional `flareRecipient`; when set, the beneficiary's share is earmarked for FXRP delivery on Flare rather than native XRP, dropping them directly into XRPFi. Modelled and recorded end-to-end; the transfer itself is not yet wired.

## What was newly built during the program

Everything in this repository was written during the hackathon. There is no pre-existing product being re-badged.

| Newly built | Detail |
|---|---|
| `HeirloomVault.sol` | Full vault lifecycle state machine, both FDC verification paths, FTSO pricing with tolerance checking, FCC instruction routing, guardian logic, grace-window semantics |
| `TeeActionResult.sol` | Library verifying TEE-signed results under Flare's domain-separated scheme |
| Contract test suite | 30 tests covering every rejection path — spoofed heartbeat source, wrong destination tag, replayed heartbeat, mis-scoped nonexistence range, wrong nonexistence bound, forged TEE signature, cross-instruction signature reuse, tampered payload, substituted will, out-of-tolerance price |
| Flare Compute Extension | Will schema with strict validation of untrusted input, canonical ABI commitment, estate allocation engine with proportional abatement, XRPL payment assembly, `SEAL` and `EXECUTE` handlers |
| Extension test suite | 19 tests including drop-level conservation invariants and a crashed-price scenario |
| Demo app | Live Coston2 reads, interactive will editor, distribution preview running the real allocation engine |
| Deploy + verification tooling | Coston2 address book, read-only protocol preflight, deploy script |

**Ported or integrated:** the TEE result verification scheme and the InstructionSender registry pattern follow `flare-foundation/fce-weather-insurance`, Flare's reference FCC application. The pattern is theirs; the application of it — a two-phase seal-then-execute flow where the enclave attests a will is readable *before* it is ever needed — is new here.

## Deployment details

Target network: **Coston2** (chain ID 114).

| Contract | Address |
|---|---|
| **HeirloomVault** | [`0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A`](https://coston2-explorer.flare.network/address/0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A) |

Beacon configured with XRPL address `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh` (hash `0x22b55aa7…13f6`), heartbeat minimum 1000 drops. Vault `#0` is registered and Active with heartbeat tag `700000000`.

Live protocol dependencies, verified answering:

| Contract | Address |
|---|---|
| FlareTeeManager (FCC diamond) | `0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE` |
| FdcVerification | `0x906507E0B64bcD494Db73bd0459d1C667e14B933` |
| FdcHub | `0x48aC463d7975828989331F4De43341627b9c5f1D` |
| FtsoV2 | `0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d` |

Full deployment record: `packages/contracts/deployments/coston2.json`.

## Known limitations

Stated up front rather than left to be discovered:

- The TEE extension is **not yet registered on live FCC infrastructure** — that needs Docker, a public tunnel, and indexer-DB credentials from Flare. The extension logic is complete and tested, and the contract-side verification is byte-compatible with what TEE nodes sign (the tests produce real signatures under that scheme and the contract accepts them). See [HOSTING.md](HOSTING.md).
- The encrypted will currently travels in the instruction payload; the production path is an off-chain blob with only the commitment on-chain, which is what settlement already checks.
- FXRP delivery is modelled and recorded but the transfer is not implemented.

## Roadmap

**Immediate (days).** Fund the deployer and deploy to Coston2. Register the extension against live FCC infrastructure and run a full seal → heartbeat → dormancy → execute cycle against XRPL testnet with real FDC proofs.

**Near (weeks).** Move the encrypted will off-chain to a commitment-only design. Wire FXRP delivery through FAssets. Ship a heartbeat relayer so holders never think about Flare gas. Add multi-TEE fan-out — `getRandomTeeIds` already supports routing one instruction to several enclaves, and the allocation engine is deterministic precisely so independent enclaves can be cross-checked rather than trusted individually.

**Later.** Generalise the primitive beyond inheritance: social recovery, vesting, treasury continuity. Integrate with an XRPL wallet (Xaman) so setting up a vault is a few taps rather than a developer workflow.

## Why this is worth continuing after the hackathon

The problem does not go away when the deadline passes, and it gets worse every year as the original cohort of holders ages. Flare is pushing to bring idle XRP into programmable finance; a meaningful share of that XRP is idle precisely because its owners have no safe answer to *what happens if I am not here*. Heirloom is a reason for that XRP to touch Flare that has nothing to do with yield — which makes it durable in a way yield products are not.
