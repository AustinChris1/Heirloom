# How Heirloom works, in plain language

Written for the person who would actually use this: someone holding XRP they
have kept for years, who wants it to reach their family, and who does not want a
lecture about cryptography.

---

## The problem

You hold XRP. Only you have the key. That is the point — nobody can take it.

But it also means that if you die, **nobody can reach it either**. The coins sit
there forever. This has already happened to a great deal of money.

Your options today are all bad:

- **Give a family member your key.** They can take everything tomorrow, while
  you are alive and well.
- **Move it to a company that holds it for you.** You have given up the one
  thing you were protecting.
- **Write your key into a legal will.** Now it sits in a document, handled by
  people you did not choose, for years.
- **Do nothing.** Most people do this. The coins are lost.

Heirloom is a fifth option: **you keep your key, and the coins still reach your
family.**

---

## The idea

You tell the system: *"If I go quiet for long enough, give my XRP to these
people, in these amounts."*

Then two things have to be true for it to be safe:

1. **Nobody can read your instructions while you are alive.** Not your family,
   not us, not anyone watching the network.
2. **Nobody can act early.** Not by lying, not by guessing, not by bribing
   somebody.

Heirloom does both. Here is how, without the jargon.

---

The whole journey, in one picture:

```
  YOU, ALIVE                                  YOU, GONE
 ────────────                                ───────────

  write wishes ──► lock them ──► ♥ ♥ ♥ ♥ ✕   the network checks: truly silent?
  (only you        (a sealed     check in         │
   ever see        computer      now and          ▼
   them)           proves it     then        waiting period ── your one
                   can read                  + your chosen     heartbeat
                   them later)               people agree      undoes it all
                                                  │
                                                  ▼
  your XRP stays in YOUR account ──────────► wishes carried out
  the entire time                            money arrives with your family
```

## What you do

### Step 1 — You write your wishes

In the app, you list who gets what. You can say things like:

- "£50,000 worth to my daughter"
- "half of what is left to my son"
- "everything remaining to my brother"

**Your instructions are locked before they leave your computer.** What gets
stored publicly is a *fingerprint* of them — a short string of letters and
numbers that could not be turned back into the original, but which proves later
that nothing was altered.

So the network knows *a will exists*. It does not know who is in it, or for how
much. Your heirs do not know they are heirs.

### A thing worth being clear about: you never deposit anything

There is no pot to fill. Your XRP stays in **your own account, under your own
key**, from the day you set this up until the day your wishes are carried out.

The heartbeat payments described below go to a **beacon** — an address used only
as a signpost, so the network has something to point at. It is not a safe and it
is not a deposit. Send the minimum; anything more is simply spent for nothing.

If that seems obvious, it is worth saying anyway: the natural assumption is that
a system handling your inheritance must be *holding* it somewhere. This one
never does, and that is the entire point.

### Step 2 — You check in, now and then

Every so often — you choose how often, say every 90 days — you send a tiny
payment on the XRP Ledger. A fraction of a penny. It carries a number that
identifies your vault.

That is your **heartbeat**. It says: *still here*.

It is deliberately trivial. No new account, no new password, no fee worth
noticing. Just a small payment from the wallet you already use.

### Step 3 — You stop

One day you stop sending it.

**Nothing happens automatically.** Silence on its own proves nothing — you might
be on holiday, or in hospital, or simply forgot.

### Step 4 — The network checks

Anyone can now ask the network a question:

> *Across this entire stretch of time, did a heartbeat from this person arrive?*

About a hundred independent computers around the world each go and look at the
XRP Ledger for themselves. They each answer separately. More than half of them,
weighted by how much money they have staked on being honest, must agree.

**This is the part that makes Heirloom possible at all.** Anyone can prove a
payment *happened* — you point at it. Proving that a payment *never happened*
requires a network willing to look at every possibility and agree. Flare is the
only chain that offers this as a built-in service, which is why Heirloom is
built here and not somewhere else.

Nobody is trusted to say you have gone. The network looked and agreed.

### Step 5 — A waiting period

Even after that, nothing moves yet.

A **grace window** opens — say 30 days. During this time:

- **If you send a single heartbeat, everything resets.** The vault goes back to
  normal. Any approvals collected are wiped clean.
- **If you press the "I'm alive" button yourself, same thing.** Instantly.

If you chose to have **guardians** — people you trust, perhaps your solicitor
and your eldest child — they must also confirm during this window. Guardians can
only *agree*. They cannot take anything, cannot change who receives what, cannot
speed anything up, and cannot act while you are alive. Their only power is to
refuse.

### Step 6 — Your wishes are carried out

Only after all of that does a **sealed computer** open your instructions.

This is a special kind of computer chip that runs in a locked box. Not even the
person who owns the machine can see inside it. Your instructions are unlocked
there, the current XRP price is checked so "£50,000 worth" means the right
amount, and the payments to your family are prepared and signed.

Then it locks again. Your wishes are never revealed to anyone.

---

## What could go wrong, and what protects you

| Your worry | What actually happens |
|---|---|
| "Someone claims I'm dead while I'm alive" | One heartbeat, or one button press, undoes it completely. Everything resets. |
| "My family sees the will early" | They cannot. It is locked before it leaves your computer, and only ever opened after you are genuinely gone. |
| "Someone swaps my will for a different one" | The fingerprint would not match, and the payment would be refused. |
| "My guardians conspire against me" | They can only agree, never act. And you overrule them all with a single heartbeat. |
| "The sealed computer is compromised" | It could reveal your wishes — a real risk, and a serious one. But it **cannot move your money**. Payment still requires proof of silence, an expired waiting period, guardian agreement, and a matching fingerprint. None of those come from the sealed computer. |
| "I forget to check in" | You choose the interval. Ninety days is normal. And anyone — a family member, a friend — can send the proof on your behalf. Being offline never puts you at risk. |
| "The company running this disappears" | There is no company holding anything. Your XRP never leaves your own account until the rules you wrote are satisfied. |

---

## Will it pay my family automatically? — the honest answer

**Yes — the whole journey now runs, on real test networks, end to end.**

Every step works today and you can watch it happen:

- Creating a vault and locking your wishes ✅
- Sending heartbeats and having the network verify them ✅
- The network proving, independently, that you have gone silent ✅
- The waiting period, the reset button, and guardian approval ✅
- Your instructions reaching the sealed computer ✅
- The sealed computer unlocking them — and only it can ✅
- The payments arriving in the beneficiaries' XRP Ledger accounts ✅

A complete run exists on the public test networks: a vault was created, its
will sealed so that only the enclave could read it, silence proven by the
network, the will opened and priced inside the sealed computer, and three real
payments delivered on the XRP Ledger. The transaction trail is in
[Usage](USAGE.md).

**One honest caveat remains.** The final signature on the outgoing payments no
longer uses the owner's own key at all: while alive, the estate granted a
*regular key* — XRPL's built-in way to authorise a second signer without
handing over your master key — and an unattended keeper process uses it to
sign the payouts, with the owner able to revoke the grant at any moment. The
caveat is *where* that delegated key lives: today it sits with the keeper; in
the finished product it would live inside the sealed computer itself, so that
not even the keeper's operator could sign anything. Same mechanism, one step
of trust earlier. Everything else already works exactly as the finished
product would.

---

## What it does not do

- It does not take custody of your XRP. Your coins stay in your own account.
- It does not replace a legal will. Property, pensions and tax are not its
  business.
- It cannot recover a key you have already lost.
- It does not tell your family anything in advance.

---

## A worked example

Mr. A holds 100 XRP. In Heirloom he writes: *70 to my daughter, 25 to my son,
anything left to my daughter.* Neither child knows — not the amounts, not that
a plan exists. His 100 XRP stays in his own account, and he spends from it
freely; the plan follows whatever is there on the day it matters.

He checks in every 90 days. One day he stops. The network proves the silence,
his month of grace passes untouched, and the sealed computer opens his
instructions for the first time. His daughter's account receives 70 XRP, his
son's 25 — ordinary payments on the XRP Ledger, nothing for them to claim,
sign, or set up. A sliver stays behind for the ledger's own reserve and fees.

Nobody was asked. Nobody could have acted earlier. Nobody read the will before
it was carried out.

---

## The short version

You keep your key. You send a tiny payment now and then to say you are still
here. If you stop, a hundred independent computers check whether that is really
true, you get a month to say otherwise, people you chose have to agree, and only
then does a locked machine open instructions nobody has ever read.

No company. No lawyer. No handing your key to anyone.

---

*Heirloom currently runs on test networks only. No real money is involved. See
[Usage](USAGE.md) to try it, or [Architecture](ARCHITECTURE.md) for the
technical detail.*
