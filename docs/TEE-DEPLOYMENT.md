# Registering the Heirloom extension on Coston2 FCC

Written against the pinned hackathon notice about the Coston2 FCC redeploy. Read that notice first — most reported FCC failures are stale stacks pointed at the dead `FlareTeeManager`.

## Preflight: this repo is already on the current deployment

```
pnpm exec hardhat run scripts/verify-fcc.ts
```

Confirmed on the live chain:

```
FlareTeeManager  0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE  live
nextPublicExtensionId = 66025  (489 public extensions registered)
getTeeMachineStatus    facet reachable
getTeeMachine          facet reachable

Sampling recent extensions for serving TEE machines:
  ext 66019  tee 0xE4838C8f…  PRODUCTION
  ext 66018  tee 0x6B63d9fc…  PRODUCTION
```

Two things follow. This repo targets the correct registry, so there is nothing to migrate. And other teams' simulated TEEs are reaching `PRODUCTION` right now, so the infrastructure genuinely works today.

## The two questions

**Indexer-DB credentials — do you still need to request them?**
Probably not. The notice says the credentials are *in a pinned message*, and that the `indexer-reader` credentials printed in the older docs and in `extension_proxy.coston2.docker.toml.example` are **dead**. Check the group's full pinned list before asking. If you follow the official guide's credentials you will get a proxy that cannot sync, which looks identical to a broken registration.

**Is a VPS good enough?**
Yes, and it is strictly better than a tunnel. Point 3 of the notice warns against quick tunnels because data providers push to the URL stored on-chain, and quick-tunnel hostnames rotate on restart — machines stuck at `INITIALIZED` usually have a dead hostname recorded. A VPS has a stable public hostname by definition, which removes that entire failure mode. It also removes the "your laptop must stay awake" problem, which was the main reason to skip this.

`SIMULATED_TEE=true` is explicitly fine for judging. GCP Confidential Space is **not** required.

## VPS requirements

| | |
|---|---|
| RAM | 2 GB minimum, 4 GB comfortable (Docker + 3 containers + Go builds) |
| Disk | ~10 GB |
| Ports | `6674` reachable from the internet (ext-proxy external) |
| Software | Docker + Compose, Go, Foundry |
| DNS | A record for a hostname you control → the VPS |

TLS is worth doing properly. Put Caddy in front so the registered URL is `https://` and stable:

```caddyfile
tee.yourdomain.com {
    reverse_proxy localhost:6674
}
```

## Sequence

Everything below runs on the VPS.

**1. Current sources.** The notice is emphatic about this.

```bash
git clone https://github.com/flare-foundation/fce-sign.git && cd fce-sign
git checkout main && git pull
```

`tee-node` and `tee-proxy` must be on `develop`, with `tee-node >= v0.0.22`. Older versions get every data-provider vote rejected, so the queue stays empty forever and it looks like nothing is happening.

**2. Configure.** `./scripts/use-chain.sh local coston2 typescript`, then in `.env.local.coston2`:

```bash
DEPLOYMENT_PRIVATE_KEY="<funded coston2 key, no 0x>"
INITIAL_OWNER="0x<your address>"
EXT_PROXY_URL="https://tee.yourdomain.com"   # stable — not a quick tunnel
```

Re-run `use-chain.sh` after editing so `.env` picks the values up.

**3. Indexer DB.** Copy `config/proxy/extension_proxy.coston2.docker.toml.example` to `…docker.toml` and fill the `[db]` block with the credentials **from the pinned message**, not the ones in the example file.

**4. Port the Heirloom handlers.** They are already written to match the framework's shape:

| From this repo | To |
|---|---|
| `packages/extension/src/handlers.ts` | `typescript/src/app/` — register `HEIRLOOM`/`SEAL` and `HEIRLOOM`/`EXECUTE` |
| `packages/extension/src/will.ts`, `allocate.ts`, `xrpl.ts` | `typescript/src/app/` — pure logic, no changes needed |
| `OP_TYPE_HEIRLOOM` / `OP_COMMAND_*` | `internal/config/config.go` — must match `HeirloomVault.sol` exactly |

Do not modify `base/` — that is framework infrastructure.

**5. The integration step that differs from the scaffold.**

`pre-build.sh` deploys its *own* `InstructionSender` and registers the extension against it. Heirloom does not want that: **`HeirloomVault` is itself the InstructionSender**, and the registry rejects `sendInstructions` from any address other than the one bound at registration.

So register the extension against the already-deployed vault:

```
0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A
```

Either pass that address to the registration CLI in `go/tools/cmd/` directly, or let `pre-build.sh` run and then re-register pointing at the vault. Getting this wrong is silent until the first instruction reverts.

**6. Register the machine.**

```bash
./scripts/start-services.sh
./scripts/post-build.sh          # uses register-tee -command rRap (capital R = fresh challenge)
```

**7. Verify from the chain's point of view**, not the container's:

```bash
cast call 0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE \
  "getTeeMachine(address)((address,address,string))" <teeId>
# → is that URL exactly what you are serving right now?

cast call 0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE \
  "getTeeMachineStatus(address)(uint8)" <teeId>
# → 1 = INITIALIZED, 2 = PRODUCTION
```

`INITIALIZED` that never advances almost always means the on-chain URL is not reachable.

**8. Wire the vault to the extension.** Two owner-only calls on `HeirloomVault`, from the deployer key:

```bash
cast send 0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A "setExtensionId()" ...
cast send 0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A "setTeeAddress(address)" <teeId> ...
```

`setExtensionId()` scans the registry from `0x10000` for the extension bound to the vault's address and caches it. It is set-once, so it will revert if called twice — and it will revert with `ExtensionNotFound` if step 5 registered against the wrong sender.

`setTeeAddress` registers the key that settlements must recover to. Until it is set, `sealWill` and `requestExecution` route fine but `confirmSeal` / `settleEstate` reject everything with `TeeNotConfigured`.

## What lights up when this works

The two lifecycle steps currently marked dark in the app:

- **`sealWill`** — the enclave decrypts the will while the owner is alive and attests it is readable, returning only a beneficiary count. `confirmSeal` verifies that signature and flips `willAttested`.
- **`requestExecution` → `settleEstate`** — the enclave decrypts, prices against the FTSO figure the contract passed in, allocates with abatement, and returns a signed distribution the contract verifies three ways before recording.

Nothing else in the repo changes. The contract already routes both instructions and verifies TEE results under the exact `TEE_ACTION_RESULT` scheme; the test suite signs real ECDSA signatures under it and the contract accepts them.

## Revised recommendation

Earlier this was not worth doing, on the assumption that credentials had unknown turnaround, that a laptop would have to stay awake, and that a stable public URL meant paying for GCP. With a VPS and pinned credentials, none of those hold. Two other teams reaching `PRODUCTION` today is the strongest signal available that the path is open.

Do it — but in this order, so a bad afternoon on the TEE never costs the submission:

1. Record the demo video and host the web app. Both are done in an hour and neither can fail on judging day.
2. Run one real FDC `XRPPayment` attestation end to end against vault `#0` on XRPL testnet. No Docker, and it exercises the most distinctive integration in the project.
3. Then register the extension.
