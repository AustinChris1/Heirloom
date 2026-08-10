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

**Not yet. This is a working demonstration, not a finished product.**

Everything up to the final payment works today, on real networks, and you can
watch it happen:

- Creating a vault and locking your wishes ✅
- Sending heartbeats and having the network verify them ✅
- The network proving, independently, that you have gone silent ✅
- The waiting period, the reset button, and guardian approval ✅
- Your instructions reaching the sealed computer ✅

**What is not finished:** two things.

The sealed computer can receive your instructions but **cannot yet unlock them**
— the step that scrambles them specifically for that machine is not wired up.
And once it has prepared the payments to your family, **nothing yet sends them**
to the XRP Ledger.

So today the system can prove you are gone, but it cannot yet hand over the
money. That is the remaining work, and it is deliberately stated plainly rather
than glossed over.

---

## What it does not do

- It does not take custody of your XRP. Your coins stay in your own account.
- It does not replace a legal will. Property, pensions and tax are not its
  business.
- It cannot recover a key you have already lost.
- It does not tell your family anything in advance.

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
