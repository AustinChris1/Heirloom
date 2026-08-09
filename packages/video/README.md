# Submission video segments

Remotion compositions that cut against your screen recording. They cover the
parts a screen recording is bad at — a title that sets the premise, the four
stages held still long enough to read, and a closing slate of verifiable facts.

They do **not** narrate, explain, or show the product working. That is the
recording's job, and it is the part that convinces a judge.

## Render

```bash
pnpm install
pnpm exec remotion render src/index.ts Title     out/title.mp4      # 6s
pnpm exec remotion render src/index.ts Lifecycle out/lifecycle.mp4  # 12s
pnpm exec remotion render src/index.ts Closing   out/closing.mp4    # 7s
```

Preview and scrub interactively with `pnpm studio`.

All three are 1920×1080 at 30fps, pure black-and-white, using the same tokens
as the web app so they cut without a visible seam.

## Suggested cut

| | Source | Length |
|---|---|---|
| Open | `title.mp4` | 6s |
| The problem | screen recording — landing page, four options | ~20s |
| The insight | screen recording — flatline scroll | ~25s |
| How it works | `lifecycle.mp4` | 12s |
| Create a vault | screen recording — app, will builder, abatement | ~40s |
| **Prove life / prove silence** | screen recording — the attestation buttons | ~60s |
| Cancel dormancy | screen recording — one click | ~15s |
| Trust boundary | screen recording — landing scroll | ~15s |
| Close | `closing.mp4` | 7s |

Roughly 3:20. Trim the vault-creation section first if you need to lose time —
never the attestation section.

## Editing

The attestation flows contain **90–180 seconds of genuine round-finalisation
waiting**. Cut it and say you did; the wait is real protocol latency, not a
loading spinner, and claiming otherwise misrepresents how the oracle works.

[`browser-use/video-use`](https://github.com/browser-use/video-use) can do this
editing pass — it removes silence and filler words, adds fades, and burns in
subtitles, which is worth having for an international judging panel.
