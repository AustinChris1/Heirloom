# Flare Summer Signal — submission

Filled against the required fields from the [hackathon brief](https://dorahacks.io/hackathon/flaresummersignal/detail).

> **Status:** live on Coston2 and XRPL testnet. Both FDC attestation legs — proof of life and **proof of silence** — have been executed against real infrastructure and accepted on-chain, **including from the web app itself**, where a visitor can run a full attestation with their own wallet. A Flare Compute Extension is registered (id `66025`) with a self-hosted TEE machine at status **PRODUCTION**, and `HEIRLOOM/SEAL` instructions from the vault have been observed arriving at the enclave. Transaction hashes are in [Demo](#demo); remaining gaps are in [Known limitations](#known-limitations).

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

Everything below runs against live Coston2 and live XRPL testnet. Nothing is mocked.

| | |
|---|---|
| **Web app** | `pnpm install && pnpm --filter @heirloom/web dev` — landing page at `/`, working vault client at `/app`. Connect a wallet and create a real vault. |
| **Health check** | `hardhat run scripts/health.ts --network coston2` — read-only; verifies contract wiring, FTSO freshness, TEE production status, and the enclave endpoint in one command. |
| **Proof of life** | `hardhat run scripts/live-heartbeat.ts --network coston2` — funds its own XRPL testnet wallet, sends a tagged heartbeat, obtains an FDC attestation, submits it. |
| **Proof of silence** | `VAULT_ID=<n> hardhat run scripts/claim-dormancy.ts --network coston2` — proves no heartbeat exists across a ledger range and drives the vault to Dormant. |
| **Confidential compute** | `hardhat run scripts/seal-e2e.ts --network coston2` — routes a `HEIRLOOM/SEAL` instruction to the enclave through Flare's data providers. |

**Test suites:** 65 tests — 30 contract, 20 extension (ethers), 15 TEE extension (viem).

### Evidence from live runs

| | |
|---|---|
| XRPL heartbeat payment | [`84C0227…EDB8D`](https://testnet.xrpl.org/transactions/84C022779EF8DE35134FFB4C263A6A81CF150DE6C4BFFAE0D6DD4D369A7EDB8D) |
| `proveLife` accepted (script) | `0xeafa132a60f30289001fda05debbc40b99c19230cc263d911c095ccd4c3f5d1b` |
| `claimDormancy` accepted (script) | `0x2f4bf71b10d33e43f65843e144c144ef68a9fdd2e567efa24a0f2f97f2949ee7` |
| **`proveLife` accepted — driven entirely from the web app** | `0x432299785c27536c48a0594e83cf064cb2f9eaec5f2bbd583d68b1dd4a3f30a9` |
| **`claimDormancy` accepted — driven entirely from the web app** | `0x2203734cb790196287e1b6b2f2a53fdf5d756df53c4178883bf4335b8bd63c26` |

That last one matters: a visitor pasted an XRPL transaction hash into the app and the browser ran the whole attestation — encoded the request at the verifier, submitted it to `FdcHub` with their own wallet, waited out the voting round, pulled the Merkle proof from the DA Layer, and submitted it to the vault. No terminal, no operator keys. Proving life and proving silence are permissionless by design, and the app demonstrates that rather than describing it.
| `SEAL` reaching the enclave | proxy log: `opType HEIRLOOM, opCommand SEAL … node returned 400: can not decrypt` — the instruction arrived and failed at the decrypt step, as designed for a deliberately junk payload |

## GitHub repo

This repository. Layout:

```
packages/contracts/   HeirloomVault.sol, TeeActionResult.sol, 30 tests, deploy + live-operation scripts
packages/extension/   Will schema, allocation engine, SEAL/EXECUTE handlers (ethers)
packages/tee/         Deployable Flare Compute Extension — viem port, Docker images, registration tooling
packages/web/         Landing page (/) and working vault client (/app)
docs/                 SUBMISSION, ARCHITECTURE, USAGE, DEMO, TEE-DEPLOYMENT, HOSTING
```

Start with **[USAGE.md](USAGE.md)** to run it, or **[TEE-DEPLOYMENT.md](TEE-DEPLOYMENT.md)** for how the enclave was stood up against the redeployed Coston2 FCC diamond.

## How the project uses Flare

Five integration points, each load-bearing:

**1. FDC `XRPPayment` (`0x08`) — proof of life.** *(verified live)*
`HeirloomVault.proveLife` verifies an XRPL payment proof and requires that it originated from the estate's own XRPL account (`sourceAddressHash`), landed on the Heirloom beacon, carried this vault's unique destination tag, succeeded on the ledger, delivered at least the configured minimum, and is strictly newer than the heartbeat on record. Permissionless, so a relayer can rescue an offline holder.

**2. FDC `XRPPaymentNonexistence` (`0x09`) — proof of silence.** *(verified live)*
`claimDormancy` is the heart of the product, and the reason this is on Flare at all: proving a payment happened is common, proving that *none exists* is not. Without this attestation type there is no trustless dead-man's switch — only a keeper you have to trust to tell the truth about silence. It requires the attestation's search range to start no later than the last proven heartbeat and extend past the moment the next one was due — closing the gap a claimant could otherwise use to prove silence over an unrelated window. It also pins `requestBody.amount` to exactly `heartbeatDrops - 1`, because the attestation excludes payments delivering *more than* that bound; any larger value would let genuine heartbeats slip through the search.

**3. FCC — the sealed will.** *(extension 66025 registered; TEE machine at PRODUCTION; instructions verified arriving)*
`HeirloomVault` is itself the FCC InstructionSender — not a scaffold contract sitting in front of it. It routes `HEIRLOOM/SEAL` and `HEIRLOOM/EXECUTE` instructions through `TeeExtensionRegistry.sendInstructions`, and verifies returned results against the registered TEE address using the domain-separated scheme the TEE nodes actually sign: `keccak256(abi.encode("TEE_ACTION_RESULT", chainId, ActionResult.Hash()))` under the EIP-191 prefix, matching `go-flare-common`'s `signing.TEEActionResult`.

**4. FTSO — fiat-denominated bequests.** *(verified live)*
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
| Web app | Landing page and a working vault client — wallet connect, will builder, live commitment and distribution preview, vault operations, per-address guardian detection |
| FCC deployment | Vendored scaffold retargeted onto `HeirloomVault` as the InstructionSender, extension registered, TEE machine driven to PRODUCTION on a self-hosted enclave behind TLS |
| viem port of the extension | Second implementation of the will schema and commitment, pinned by a cross-implementation test vector so client (ethers) and enclave (viem) provably agree byte-for-byte |
| Live FDC client | Prepare → submit → await finalisation → fetch proof → verify on-chain, for both XRPL attestation types |
| Deploy + operations tooling | Coston2 address book, deploy script, `health.ts` preflight, `tee-status.ts`, `set-tee-address.ts`, `live-heartbeat.ts`, `claim-dormancy.ts`, `seal-e2e.ts` |

**Ported or integrated:** the TEE result verification scheme and the InstructionSender registry pattern follow `flare-foundation/fce-weather-insurance`, Flare's reference FCC application. The pattern is theirs; the application of it — a two-phase seal-then-execute flow where the enclave attests a will is readable *before* it is ever needed — is new here.

## Deployment details

Target network: **Coston2** (chain ID 114).

| Contract | Address |
|---|---|
| **HeirloomVault** | [`0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A`](https://coston2-explorer.flare.network/address/0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A) |

| Component | Value |
|---|---|
| FCC extension id | `66025` — registered with `HeirloomVault` itself as the InstructionSender |
| TEE machine | `0xb1c696717eedEb7e215f381d81f8edaA185eE60c` — on-chain status **2 (PRODUCTION)** |
| Enclave endpoint | `https://sly.southafricanorth.cloudapp.azure.com` (self-hosted, TLS via Let's Encrypt) |
| Attestation mode | `SIMULATED_TEE=true` — accepted on Coston2; code hash `0x194844cf…` whitelisted on the extension |

Beacon configured with XRPL address `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh` (hash `0x22b55aa7…13f6`), heartbeat minimum 1000 drops. Four vaults registered; `#2` was driven to Dormant by a real nonexistence attestation.

Live protocol dependencies, verified answering:

| Contract | Address |
|---|---|
| FlareTeeManager (FCC diamond) | `0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE` |
| FdcVerification | `0x906507E0B64bcD494Db73bd0459d1C667e14B933` |
| FdcHub | `0x48aC463d7975828989331F4De43341627b9c5f1D` |
| FtsoV2 | `0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d` |

Full deployment record: `packages/contracts/deployments/coston2.json`.

## Known limitations

Stated up front rather than left to be discovered.

- **Payout signing is not yet delegated to the enclave.** The full lifecycle — client-side ECIES seal, enclave attestation, FDC-proven dormancy, enclave execution, on-chain settlement of the TEE-signed distribution, and real XRPL payouts — has run end to end on this deployment (transaction trail in [Usage](USAGE.md)). But the estate account's XRPL signature on the final payments comes from the demo operator's testnet seed. The production design delegates an XRPL *regular key* to a TEE-held wallet so the enclave signs the payouts too; that delegation is not wired.
- **The encrypted will travels in the instruction payload.** Flare's own guidance is explicit that on-chain storage of encrypted secrets is unsuitable for production. The production path is an off-chain blob with only the commitment on-chain — the contract is already structured for it, since the commitment is what settlement checks.
- **FXRP delivery is modelled and recorded but the transfer is not wired.**
- **Attestation is simulated, not hardware-backed.** `SIMULATED_TEE=true` is accepted on Coston2 and is the sanctioned path for testnet, but it is not a real Confidential Space measurement. Production would require `MODE=0` on a GCP Confidential Space VM.
- **TEE identity does not survive a container restart.** Confirmed by Flare: recovery is registering a replacement machine, not restoring the old identity. `setTeeAddress` is deliberately re-callable for exactly this reason, and the procedure is scripted.

## Roadmap

**Immediate (days).** Delegate an XRPL regular key to a TEE-held wallet so the enclave signs the payout transactions itself, removing the last human signature from the lifecycle.

**Near (weeks).** Move the encrypted will off-chain to a commitment-only design. Wire FXRP delivery through FAssets. Ship a heartbeat relayer so holders never think about Flare gas. Add multi-TEE fan-out — `getRandomTeeIds` already supports routing one instruction to several enclaves, and the allocation engine is deterministic precisely so independent enclaves can be cross-checked rather than trusted individually.

**Later.** Generalise the primitive beyond inheritance: social recovery, vesting, treasury continuity. Integrate with an XRPL wallet (Xaman) so setting up a vault is a few taps rather than a developer workflow.

## Why this is worth continuing after the hackathon

The problem does not go away when the deadline passes, and it gets worse every year as the original cohort of holders ages. Flare is pushing to bring idle XRP into programmable finance; a meaningful share of that XRP is idle precisely because its owners have no safe answer to *what happens if I am not here*. Heirloom is a reason for that XRP to touch Flare that has nothing to do with yield — which makes it durable in a way yield products are not.
