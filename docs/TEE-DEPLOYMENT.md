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

## What the VPS actually needs

Two workloads get conflated here, and they have very different appetites. Only one of them has to happen on the VPS.

**Running** the stack is three containers:

| Container | What it is | Resident memory (estimate) |
|---|---|---|
| `redis` | queue the proxy uses | ~15 MB |
| `ext-proxy` | Go binary watching the chain | ~50–100 MB |
| `extension-tee` | your handlers — Node for the TS target, a static binary for Go | ~80–120 MB (Node) / ~20–50 MB (Go) |

So roughly **150–240 MB resident**. That is the number that matters, and it is small.

**Building** is where the appetite is. `go build`, `npm install`, and `forge build` each spike to several hundred MB — solc and the Go compiler are the culprits. That spike is where "4 GB comfortable" came from, and it is a one-off that has no business happening on the box that serves traffic.

**So don't build on the VPS.** Build the image on your Windows machine, ship it over, and run the deploy CLIs locally too — `pre-build`, `post-build`, and `register-tee` are RPC calls plus HTTP requests to `EXT_PROXY_URL`, which is public by definition. Nothing about them needs to execute on the VPS.

That leaves the VPS doing only what it is good at: keeping three small containers reachable at a stable hostname.

### Sizing against your box

Your Azure B2ats v2: 842 MiB total, **557 MiB already in use by p2pbot, 285 MiB available**, plus 2 GiB swap at 11%. Disk 28 GB at 24.8%, so ~21 GB free.

| | Verdict |
|---|---|
| Disk | Fine. Shipped images and Docker overhead land well under 21 GB. |
| Memory, running only | Tight but workable — 150–240 MB against 285 MB available, with swap behind it. |
| Memory, building on the box | Would thrash or get OOM-killed. Don't. |

Two things buy headroom cheaply:

```bash
# 1. More swap. Insurance, not a fix — but it turns "OOM-killed" into "slow".
sudo fallocate -l 4G /swapfile2 && sudo chmod 600 /swapfile2
sudo mkswap /swapfile2 && sudo swapon /swapfile2
echo '/swapfile2 none swap sw 0 0' | sudo tee -a /etc/fstab

# 2. Cap the containers so a leak in one can't take p2pbot down with it.
#    In docker-compose.yaml, per service:
#      mem_limit: 160m
```

If it still runs hot, the Go target for the extension drops `extension-tee` from ~100 MB to ~30 MB. The handler logic in `packages/extension/src/` is small and pure — porting it is a couple of hours, and Go is also the only target that builds bit-for-bit reproducibly across machines, which matters if you ever rebuild rather than ship the same image.

### Shipping the image instead of building on the VPS

```bash
# on Windows, once the image builds
docker save heirloom-extension:latest | gzip > heirloom-ext.tgz
scp heirloom-ext.tgz faustinchris@40.127.9.20:~

# on the VPS
gunzip -c heirloom-ext.tgz | docker load
```

Then `docker compose up -d` on the VPS with the build sections removed, so Compose uses the loaded image rather than trying to build one.

### Azure networking — verified, nothing to change

Checked against the live host:

| | Status |
|---|---|
| `sly.southafricanorth.cloudapp.azure.com` | Resolves to `40.127.9.20` ✓ |
| Public IP assignment | **Static** ✓ — it cannot drift out from under the URL recorded on-chain |
| NSG inbound | 22, 80, 443 allowed; everything else denied by rule 65500 |
| Anything already listening on 80/443 | **No** — both refuse connections from outside, so Caddy can claim them without fighting p2pbot |

So the NSG needs **no new rule**. Terminate TLS on 443 with Caddy and proxy to the extension on loopback.

**Do not open 6674 to the internet.** The proxy's HTTP API is unauthenticated — anyone who can reach it can call it. Keeping it bound to loopback and reaching it only through Caddy is both safer and gives you the `https://` URL you want registered on-chain.

Note that Docker writes its own iptables rules and **bypasses `ufw`**. A compose file that publishes `6674:6664` binds `0.0.0.0` and would be internet-facing on a host without an NSG in front. Bind it explicitly:

```yaml
ports:
  - "127.0.0.1:6674:6664"
```

Here the NSG denies 6674 anyway, but relying on that alone is one portal edit away from being wrong.

### TLS

```caddyfile
sly.southafricanorth.cloudapp.azure.com {
    reverse_proxy 127.0.0.1:6674
}
```

Caddy fetches a Let's Encrypt certificate automatically — port 80 is open, which is what the ACME HTTP-01 challenge needs, and 443 serves it. Then:

```bash
EXT_PROXY_URL="https://sly.southafricanorth.cloudapp.azure.com"
```

**Check `ufw` before assuming it works.** The NSG allowing 80/443 does not mean the host does:

```bash
sudo ufw status
sudo ufw allow 80,443/tcp   # only if ufw is active
```

**Reboot first.** The login banner reports 30 pending updates and a required restart. Do that before you start, not halfway through a registration.

### End-to-end check before registering

From your laptop, not the VPS — this is the same path Flare's data providers will take:

```bash
curl -sf https://sly.southafricanorth.cloudapp.azure.com/info | jq '.machineData'
```

If that returns `machineData` with a `codeHash`, the URL you are about to write on-chain is genuinely reachable. If it hangs or 502s, fix that first — registering a URL that does not answer is exactly how machines end up stuck at `INITIALIZED`.

## Two stale version defaults, already fixed in this repo

The notice warns that a node older than v0.0.22 has **every data-provider vote rejected**, so the instruction queue stays empty forever and the stack looks merely slow rather than broken. The scaffold ships below that floor in two places, and neither is reachable from `.env` as delivered:

| Where | Shipped default | Fixed to |
|---|---|---|
| `typescript/Dockerfile` — `ARG TEE_NODE_VERSION` | `v0.0.21` | `v0.0.23` |
| `go/go.mod` and `go/tools/go.mod` — `tee-node` | `v0.0.21-0.2026…` | `v0.0.23` |
| `go/go.mod` and `go/tools/go.mod` — `go-flare-common` | `…20260623…` | `…20260727094511-09a10067e6a4` |
| `proxy/Dockerfile` — `ARG TEE_PROXY_VERSION` | `v0.0.18` | `develop` |
| `proxy/Dockerfile` — Go base image | `golang:1.25.1-alpine` | `golang:1.25.8-alpine` |

**Newest is not the same as aligned.** tee-node and tee-proxy share a wire format that is still moving, so the node has to match what the proxy expects rather than lead it. The authority is tee-proxy's own `go.mod`:

```
# https://raw.githubusercontent.com/flare-foundation/tee-proxy/develop/go.mod
go 1.25.8
github.com/flare-foundation/tee-node v0.0.23
github.com/flare-foundation/go-flare-common v1.2.2-0.20260727094511-09a10067e6a4
```

So the aligned set is tee-proxy on `develop` with tee-node pinned to **v0.0.23** — above the v0.0.22 floor, and exactly what the proxy was built against. Tracking `develop` on *both* looks tidier but risks pulling a node newer than the proxy understands, which presents as instructions that register fine and then never relay. Bumping one side alone is the documented way to break this.

Three files carry a tee-node version and all three must agree: the Dockerfile arg (the runtime binary), and the two `go.mod` files (the deploy CLIs). Run `go mod tidy` after changing them.

The Go base-image bump follows from the same `go.mod`: it declares `go 1.25.8`, and the golang image sets `GOTOOLCHAIN=local`, so building on 1.25.1 dies at `go mod download` with `go.mod requires go >= 1.25.8` rather than fetching a newer toolchain.

Worse, setting those as environment variables does nothing on a stock checkout: `docker-compose.yaml` only forwarded `SOURCE_DATE_EPOCH` as a build arg, and `start-services.sh` invoked `docker build` for the proxy with no `--build-arg` at all. Both now forward the refs, and `.env.local.coston2` pins `TEE_NODE_VERSION=develop` / `TEE_PROXY_VERSION=develop`.

If you ever see the queue sitting empty with no errors, check this first:

```bash
docker exec <extension-tee container> /app/server --version   # or inspect the build args
```

## Sequence

**Where each step runs:** everything happens on your Windows machine except starting the containers. Steps 1–5 and 7–8 are local; only step 6 touches the VPS.

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
EXT_PROXY_URL="https://sly.southafricanorth.cloudapp.azure.com"  # stable — not a quick tunnel
```

Re-run `use-chain.sh` after editing so `.env` picks the values up.

**3. Indexer DB.** Copy `config/proxy/extension_proxy.coston2.docker.toml.example` to `…docker.toml` and fill the `[db]` block with the credentials **from the pinned message**, not the ones in the example file.

**4. Port the Heirloom handlers — done, in `packages/tee`.**

The scaffold lives at `packages/tee` with the KEY extension replaced by Heirloom:

| File | What it is |
|---|---|
| `typescript/src/app/config.ts` | `HEIRLOOM` / `SEAL` / `EXECUTE`, matching `HeirloomVault.sol` |
| `typescript/src/app/handlers.ts` | Both handlers, decrypting via the TEE node's `/decrypt` |
| `typescript/src/app/heirloom/{will,allocate,xrpl}.ts` | Will schema, allocation engine, XRPL assembly |

The scaffold uses **viem**, not ethers, so `will.ts` was ported rather than copied. That port is the one place a silent, fatal bug could hide: the client computes the commitment with ethers when the owner seals a will, and the enclave recomputes it with viem at execution — `settleEstate` requires them equal, so any encoding drift would revert every settlement with `CommitmentMismatch`.

Both implementations were run against the same will and produce the identical hash:

```
ETHERS_COMMITMENT=0x70ca3ac005273bca7bb1e1d0921bc0f6813f0ff99d63deb28e4492972aa30c58
VIEM_COMMITMENT  =0x70ca3ac005273bca7bb1e1d0921bc0f6813f0ff99d63deb28e4492972aa30c58
```

That vector is now pinned as an assertion on both sides, so a future edit to either encoder fails a test rather than breaking settlement in production:
`packages/extension/test/commitment-vector.test.ts` and `packages/tee/typescript/src/__tests__/heirloom.test.ts`.

Do not modify `base/` — that is framework infrastructure.

**5. Register against the vault, not a fresh contract — `scripts/heirloom-register.sh`.**

`pre-build.sh` deploys its *own* `InstructionSender` and registers the extension against it. Heirloom cannot use that: **`HeirloomVault` is itself the InstructionSender**, and the registry rejects `sendInstructions` from any address other than the one bound at registration. Registering against the scaffold's contract leaves every `HEIRLOOM` instruction reverting, and `setExtensionId()` on the vault fails with `ExtensionNotFound` because it scans for its own address.

`scripts/heirloom-register.sh` skips the contract deploy and calls
`register-extension --instructionSender 0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A`.

Go and Foundry are not needed on the workstation — `Dockerfile.tools` carries them:

```bash
docker build -f Dockerfile.tools -t heirloom-tools .
docker run --rm -v "$PWD:/w" -w /w heirloom-tools ./scripts/heirloom-register.sh
```

**6. Start the containers — this is the only step on the VPS.**

Build the image locally, ship it as above, then on the VPS:

```bash
docker compose up -d            # image already loaded; no build on this box
curl -sf http://localhost:6674/info | jq '.machineData'
```

`codeHash` should be the simulated-TEE value `0x194844cf…`, and `extensionId` should match `config/extension.env`.

Then, **back on your laptop**, register the machine:

```bash
./scripts/post-build.sh          # uses register-tee -command rRap (capital R = fresh challenge)
```

It reaches the node through `EXT_PROXY_URL`, so it does not need to run on the VPS.

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

## TEE identity does not survive a container restart

Confirmed by Flare in the hackathon group: the runtime generates a **new TEE identity** every time the container restarts, and there is no supported way to restore the old one. The sanctioned recovery is to register a *replacement* machine, not to resurrect the previous `teeId`. Reusing the same public URL is fine as long as it now resolves to the replacement.

That has a direct consequence for Heirloom, and the contract is already built for it:

- `setExtensionId()` is **set-once** — correct, because the extension id is stable across restarts.
- `setTeeAddress(address)` is **owner-only and re-callable** — also correct, because it has to be updated after every restart.

So the restart drill is: bring the container back, re-run `post-build.sh` to register the replacement machine, then call `setTeeAddress` with the new `teeId`. Skip that last step and every settlement reverts with `UnauthorizedTee`, because the contract is still checking signatures against a machine that no longer exists.

Before a demo, check what the chain thinks is live rather than what your container thinks:

- <https://coston2-systems-explorer.flare.network/tee/objects> — filter to the extension id and read the STATUS column. Repeated `register-tee` runs leave dead machines behind.
- `getTeeMachineStatus(teeId)` → `1` = INITIALIZED, `2` = PRODUCTION.
- `getTeeMachine(teeId)` → confirm the recorded URL is the one you are actually serving.

## If instructions register but never relay

A team hit this with a custom op named `VRF`/`PROVE`. Anything starting with `F_` is reserved, and reusing a system command word (`PAY`, `REISSUE`, `VRF`, `PROVE`, `KEY_GENERATE`, `TEE_INFO`) can stop an instruction being relayed.

Heirloom uses `HEIRLOOM` / `SEAL` and `HEIRLOOM` / `EXECUTE`. The opType is unmistakably ours and none of the strings appear on that reserved list, so the risk is low — but `EXECUTE` is generic enough to be worth ruling out early. The cheap test is to send a `SEAL` instruction as soon as the proxy is live and watch whether it reaches `POST /instruction`. If it does not, renaming means changing the `bytes32` constants in `HeirloomVault.sol`, which are compile-time — that is a redeploy plus re-registration, so find out before demo day rather than during it.

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
