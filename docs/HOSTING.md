# Hosting

Short version: **the web app hosts free as a static site and needs no Docker.** Docker and a public tunnel are only required for the optional TEE extension, and that is a separate, self-contained piece.

## What actually needs hosting

Heirloom has three parts and they have completely different requirements.

| Part | Where it runs | Cost | Docker? |
|---|---|---|---|
| `HeirloomVault` contract | Coston2 — already deployed | Free (testnet gas from the faucet) | No |
| Demo web app | Any static host | Free forever | No |
| TEE extension | Your machine, or a Confidential Space VM | Free locally; paid on GCP | Yes — this is the only part |

The contract is already live at [`0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A`](https://coston2-explorer.flare.network/address/0x250B6F94F8779a9CfbD826FD6CCF0a9845DcEb3A). Nothing to host.

## The web app — free, no Docker

`packages/web` is a Vite build that produces plain static files. It talks to Coston2 directly over a public RPC endpoint from the browser, and transactions are signed by the visitor's own wallet — so there is no backend, no server, and nothing to keep running.

Two routes:

| Route | What it is |
|---|---|
| `/` | Landing page. Scroll-driven, monochrome, explains the product. |
| `/app` | The working client — connect a wallet, create a vault, read live state, act on it. |

They are deliberately separate surfaces: a landing page is scrolled and read, a vault dashboard is scanned and operated, and merging them makes both worse.

`public/_redirects` and `vercel.json` both rewrite unknown paths to `index.html`, so deep links to `/app` work on any static host.

```bash
cd packages/web
pnpm install
pnpm build      # → dist/
```

`dist/` is the whole site. Any of these host it free, permanently:

**Cloudflare Pages** — most generous free tier, unlimited bandwidth.
```bash
pnpm dlx wrangler pages deploy dist --project-name heirloom
```

**Vercel** — `vercel.json` is already committed, so it autodetects everything.
```bash
pnpm dlx vercel --prod
```

**Netlify**
```bash
pnpm dlx netlify-cli deploy --prod --dir dist
```

**GitHub Pages** — free, no extra account: push the repo, then point Pages at a workflow that runs the build and publishes `dist/`.

All four give you an HTTPS URL you can paste straight into the DoraHacks submission as the demo link.

### Pointing it at a different deployment

The contract address is baked in with an env override:

```bash
VITE_HEIRLOOM_VAULT=0xYourVault pnpm build
```

## The TEE extension — the only part that needs Docker

This is worth understanding before deciding whether to bother.

Flare Confidential Compute does not host your code for you. An extension is a container that runs inside a hardware enclave, and it is reached through a proxy that watches the chain for instructions. That means three containers (`extension-tee`, `ext-proxy`, `redis`) and a **publicly reachable URL for the proxy**, because Flare's infrastructure has to call into it.

For a simulated TEE against real Coston2, the whole stack is free:

| Requirement | Cost |
|---|---|
| Docker + Compose | Free |
| A stable public hostname | Free on a VPS you already have; otherwise a *named* cloudflared tunnel or reserved ngrok domain |
| Coston2 gas | Free from the faucet |
| Indexer-DB credentials | Free — **check the hackathon Telegram's pinned messages**, they are posted there. The `indexer-reader` credentials in the older docs are dead. |

`SIMULATED_TEE=true` on Coston2 is explicitly fine for judging; GCP Confidential Space is **not** required.

The real constraint is that whatever runs the proxy must stay reachable at the hostname recorded on-chain — a sleeping laptop or a rotating quick-tunnel URL is an extension that silently never leaves `INITIALIZED`. **A VPS solves both**, which is why this is now worth doing.

Full walkthrough: [TEE-DEPLOYMENT.md](TEE-DEPLOYMENT.md).

### Order of work

Registering is now worth doing — see [TEE-DEPLOYMENT.md](TEE-DEPLOYMENT.md) for the full sequence. But do it third, so a bad afternoon on the TEE can never cost the submission:

1. **Record the demo video and host the web app.** An hour's work, and neither can fail on judging day.
2. **Run one real FDC attestation end to end** — send an XRPL testnet payment to the beacon with vault `#0`'s destination tag (`700000000`), request an `XRPPayment` attestation, and call `proveLife` with the real proof. No Docker, and it exercises the most distinctive integration in the project against live infrastructure.
3. **Then register the extension.**

The extension logic is already complete and tested either way, and the contract-side verification is byte-compatible with what TEE nodes actually sign — the test suite generates real ECDSA signatures under Flare's `TEE_ACTION_RESULT` scheme and the contract accepts them. Registering proves the plumbing; it is upside, not a prerequisite.
