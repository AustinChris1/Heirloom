import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Logo, LogoMark } from "../components/Logo";
import { Ecg, EcgLive } from "../components/landing/Ecg";
import { DrawRule, EASE, Rise, WordReveal, staggerChild, staggerParent } from "../components/landing/primitives";
import { EXPLORER, HEIRLOOM_VAULT } from "../lib/deployment";
import { ChainSnapshot } from "../lib/chain";

export function Landing({ chain }: { chain: ChainSnapshot | null }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="grain relative bg-black">
      {/* Scroll progress, the only persistent chrome */}
      <motion.div
        className="fixed inset-x-0 top-0 z-40 h-px origin-left bg-white"
        style={{ scaleX }}
      />

      <Nav />
      <Hero chain={chain} />
      <Problem />
      <Flatline />
      <Lifecycle />
      <Protocols />
      <Boundaries />
      <Questions />
      <Closing />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 md:px-10 mix-blend-difference">
      <Link to="/" aria-label="Heirloom home">
        <Logo size={26} animate />
      </Link>
      <div className="flex items-center gap-3">
        <Link
          to="/docs"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70 underline-offset-4 hover:text-white hover:underline"
        >
          Docs
        </Link>
        <Link to="/app" className="btn border-white/40 px-4 py-2">
          Open app
        </Link>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */

function Hero({ chain }: { chain: ChainSnapshot | null }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-10">
      {/* Live trace across the whole viewport, behind the type */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-ink-700">
        <EcgLive className="h-[46vh] w-full" beats={7} />
      </div>

      <motion.div style={{ y, opacity, scale }} className="relative z-10 mx-auto w-full max-w-[1400px]">
        <motion.p
          className="label mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Flare Summer Signal, live on Coston2
        </motion.p>

        <h1 className="font-black uppercase leading-[0.82] tracking-crush text-[clamp(3.2rem,13vw,13rem)]">
          <WordReveal text="Your keys" delay={0.15} />
          <br />
          {/* ink-400 on black is ~3.2:1, under AA for body copy, but this is
              display type at 13vw where 3:1 is the bar. Anything darker stops
              reading as a second voice and starts reading as a rendering bug. */}
          <span className="text-ink-400">
            <WordReveal text="outlive you." delay={0.3} />
          </span>
        </h1>

        <motion.div
          className="mt-12 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 1, ease: EASE }}
        >
          <p className="max-w-[54ch] text-lg leading-relaxed text-ink-200 md:text-xl">
            A trustless dead-man's switch for XRP. Your will stays sealed inside a hardware enclave until the
            ledger itself proves you have gone silent.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/app" className="btn btn-solid px-7 py-4">
              Create a vault
            </Link>
            <a
              href={`${EXPLORER}/address/${HEIRLOOM_VAULT}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-300 underline-offset-4 hover:text-white hover:underline"
            >
              View contract
            </a>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-wrap gap-x-12 gap-y-4 border-t border-ink-800 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          <Stat label="XRP / USD · FTSO" value={chain?.xrpUsdDisplay ?? "—"} />
          <Stat label="Vaults registered" value={chain ? String(chain.vaultCount) : "—"} />
          <Stat label="Coston2 block" value={chain ? chain.blockNumber.toLocaleString() : "—"} />
          <Stat label="Test suite" value="65 passing" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="label mb-1.5">{label}</div>
      <div className="font-mono text-xl tabular-nums">{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const OPTIONS = [
  ["Give someone your keys", "They can take everything today, while you are alive and well."],
  ["Use a custodian", "You stop self-custodying, which is the thing you were doing on purpose."],
  ["Write a legal will", "Your seed phrase ends up in a document handled by people you did not choose."],
  ["Do nothing", "The coins are lost forever. This is what almost everyone does."],
];

function Problem() {
  return (
    <section className="relative px-6 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <Rise>
          <p className="label mb-10">The problem</p>
        </Rise>

        <h2 className="max-w-[20ch] font-black uppercase leading-[0.88] tracking-tightest text-[clamp(2.2rem,7vw,6rem)]">
          <WordReveal text="Every option available to you today is bad." />
        </h2>

        <motion.div
          className="mt-20 grid gap-px bg-ink-800 md:grid-cols-2"
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15%" }}
        >
          {OPTIONS.map(([title, body], i) => (
            <motion.div
              key={title}
              variants={staggerChild}
              className="group relative bg-black p-8 transition-colors duration-500 hover:bg-white md:p-12"
            >
              <span className="label transition-colors duration-500 group-hover:text-black/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight transition-colors duration-500 group-hover:text-black md:text-3xl">
                {title}
              </h3>
              <p className="mt-3 max-w-[38ch] text-ink-300 transition-colors duration-500 group-hover:text-ink-700">
                {body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <Rise delay={0.1} className="mt-20">
          <p className="max-w-[62ch] text-xl leading-relaxed text-ink-200 md:text-2xl">
            What is missing is a way to say{" "}
            <em className="text-white">“if I am gone, distribute my XRP like this”</em> that nobody can act on
            early, nobody can read while you are alive, and nobody has to be trusted to carry out.
          </p>
        </Rise>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The page's central gesture: scrolling this section is what flatlines the
 * trace. The reader performs the silence the protocol detects.
 */
const BEATS = [
  {
    label: "While you live",
    body: "A dust payment on the XRP Ledger, carrying a tag unique to your vault. That is your heartbeat.",
  },
  {
    label: "Silence",
    body: "You stop. Nothing happens automatically, silence is not yet proof.",
  },
  {
    label: "FDC · XRPPaymentNonexistence 0x09",
    body: "Then anyone can prove, cryptographically, that across an entire ledger range no heartbeat exists.",
  },
];

function Flatline() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // The trace dies across the middle of the section, so the flatline lands as
  // the copy reaches "silence" rather than before the reader gets there.
  const flat = useTransform(scrollYProgress, [0.12, 0.55], [0, 1]);

  // One caption is mounted at a time, chosen by scroll position.
  //
  // The previous version cross-faded three absolutely-positioned captions with
  // independent opacity ramps. Any drift between those ranges, or a viewport
  // short enough to compress them, put two on screen at once, unreadable. With
  // a single index and AnimatePresence, overlap is structurally impossible
  // rather than merely tuned away.
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = p < 0.36 ? 0 : p < 0.68 ? 1 : 2;
    setStep((current) => (current === next ? current : next));
  });

  const beat = BEATS[step];

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16">
        <div className="w-full max-w-[1400px] shrink text-white">
          <Ecg progress={flat} className="h-[22vh] w-full md:h-[26vh]" beats={5} />
        </div>

        {/* Reserved height keeps the sticky frame from jumping as captions swap,
            and survives three wrapped lines on a short viewport. */}
        <div className="flex min-h-[11rem] w-full max-w-[52ch] items-start justify-center text-center md:min-h-[12rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <p className="label mb-4">{beat.label}</p>
              <p className="text-balance text-2xl leading-snug text-white md:text-[2.15rem] md:leading-[1.25]">
                {beat.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Which of the three you are on, otherwise a slow scroll feels stuck. */}
        <div className="flex gap-2" aria-hidden="true">
          {BEATS.map((_, i) => (
            <span
              key={i}
              className={`h-px w-8 transition-colors duration-300 ${i === step ? "bg-white" : "bg-ink-700"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const STAGES = [
  {
    n: "01",
    title: "Seal",
    proof: "FCC · HEIRLOOM/SEAL",
    body: "Your will is encrypted to the enclave's key before it leaves your browser. Flare stores only a commitment. The enclave then decrypts it while you are alive and attests that it is readable, because a corrupt ciphertext discovered at execution is discovered too late to fix.",
  },
  {
    n: "02",
    title: "Live",
    proof: "FDC · XRPPayment 0x08",
    body: "You send a periodic dust payment to the beacon with your vault's destination tag. It costs a fraction of a cent and needs no Flare-side key. Anyone may relay the proof, so being offline never puts you at risk.",
  },
  {
    n: "03",
    title: "Silence",
    proof: "FDC · XRPPaymentNonexistence 0x09",
    body: "An attestation proves no tagged heartbeat reached the beacon across the whole interval. This opens a grace window. It releases nothing. One late heartbeat returns the vault to living and clears every guardian approval.",
  },
  {
    n: "04",
    title: "Distribute",
    proof: "FCC · TEE-signed settlement",
    body: "Only after the grace window elapses and guardians confirm does the enclave decrypt the will, price it against FTSO, and sign the XRPL payments. Flare verifies the signature and the commitment before anything settles.",
  },
];

/**
 * Horizontal scroll driven by vertical scroll.
 *
 * The travel distance is *measured*, not guessed. The previous version moved the
 * track by a fixed `-72%`, which is a percentage of the track's own width, and
 * because the cards are sized in `vw`, that percentage only lands correctly at
 * one viewport width. On narrower screens the cards are proportionally wider,
 * so 72% stopped short and the last two stages were never reached.
 *
 * Measuring `scrollWidth - clientWidth` gives the exact distance needed for the
 * final card to arrive, at any width, and it self-corrects on resize and
 * orientation change.
 */
function Lifecycle() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [travel, setTravel] = useState(0);
  useLayoutEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (el) setTravel(Math.max(0, el.scrollWidth - el.clientWidth));
    };
    measure();

    // Card widths are in vw, so any viewport change alters the distance. A
    // ResizeObserver also catches mobile browser-chrome collapse, which a
    // resize listener alone can miss.
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  return (
    // Taller on mobile: the cards are proportionally wider there, so the same
    // scroll distance would rush all four past in a fraction of the section.
    <section ref={ref} className="relative h-[520vh] bg-white text-black md:h-[400vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="px-6 md:px-10">
          <p className="label mb-3 text-ink-500">How it works</p>
          <h2 className="mb-12 font-black uppercase leading-none tracking-tightest text-[clamp(2rem,6vw,5rem)]">
            Four stages. One is irreversible.
          </h2>
        </div>

        {/* The measured element is the viewport-width clip; the motion element
            inside it is the full-width track. */}
        <div ref={trackRef} className="w-full overflow-hidden">
          <motion.div style={{ x }} className="flex w-max gap-6 pl-6 pr-6 md:gap-10 md:pl-10 md:pr-10">
            {STAGES.map((s) => (
              <article
                key={s.n}
                className="w-[82vw] shrink-0 border-t-2 border-black pt-6 md:w-[46vw] lg:w-[34vw]"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">{s.n}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-500">{s.proof}</span>
                </div>
                <h3 className="mt-5 font-black uppercase leading-none tracking-tightest text-[clamp(2.6rem,7vw,5.5rem)]">
                  {s.title}
                </h3>
                <p className="mt-6 max-w-[42ch] leading-relaxed text-ink-600">{s.body}</p>
              </article>
            ))}
          </motion.div>
        </div>

        {/* Which stage you are on, otherwise a long track feels directionless. */}
        <div className="mt-10 flex gap-2 px-6 md:px-10" aria-hidden="true">
          {STAGES.map((_, i) => (
            <StageTick key={i} index={i} progress={scrollYProgress} total={STAGES.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** One segment of the progress rail, filling as its stage comes into view. */
function StageTick({
  index,
  progress,
  total,
}: {
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const scaleX = useTransform(progress, [start, end], [0, 1], { clamp: true });

  return (
    <div className="h-0.5 flex-1 bg-black/15">
      <motion.div className="h-0.5 origin-left bg-black" style={{ scaleX }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

const PROTOCOLS = [
  ["FDC", "XRPPayment · 0x08", "Proof of life, bound to your own XRPL account."],
  ["FDC", "XRPPaymentNonexistence · 0x09", "Proof of silence. The dead-man's switch itself."],
  ["FCC", "TEE extension · HEIRLOOM", "Holds and executes the sealed will inside hardware isolation."],
  ["FTSO", "XRP/USD block-latency feed", "Bequests denominated in dollars, priced at execution."],
  ["FAssets", "FXRP", "Optional delivery straight into XRPFi instead of native XRP."],
];

function Protocols() {
  return (
    <section className="relative overflow-hidden px-6 py-32 md:px-10 md:py-48">
      {/* Marquee, the one loud decorative element, and it says something true */}
      <div className="pointer-events-none absolute inset-x-0 top-10 flex select-none overflow-hidden opacity-[0.06]">
        <div className="flex shrink-0 animate-marquee whitespace-nowrap font-black uppercase tracking-tightest text-[14vw] leading-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="mr-12">
              Not portable to another chain ·
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <Rise>
          <p className="label mb-10">Why Flare</p>
        </Rise>

        <h2 className="max-w-[24ch] font-black uppercase leading-[0.88] tracking-tightest text-[clamp(2rem,6.5vw,5.5rem)]">
          <WordReveal text="Proving a payment happened is common." />{" "}
          <span className="text-ink-400">
            <WordReveal text="Proving none exists is not." delay={0.2} />
          </span>
        </h2>

        <Rise delay={0.1} className="mt-10">
          <p className="max-w-[60ch] text-lg leading-relaxed text-ink-300">
            Without <code className="font-mono text-white">XRPPaymentNonexistence</code> there is no trustless
            dead-man's switch, only a keeper you have to trust to tell the truth about silence. FDC is the only
            oracle that makes that claim verifiable on-chain.
          </p>
        </Rise>

        <div className="mt-20">
          {PROTOCOLS.map(([proto, surface, why], i) => (
            <Rise key={surface} delay={i * 0.05}>
              <div className="group grid grid-cols-1 items-baseline gap-2 border-t border-ink-800 py-7 transition-colors duration-300 hover:border-white md:grid-cols-[110px_1fr_1.3fr] md:gap-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-300 transition-colors group-hover:text-white">
                  {proto}
                </span>
                <span className="font-mono text-sm text-white">{surface}</span>
                <span className="text-ink-300 transition-colors group-hover:text-ink-100">{why}</span>
              </div>
            </Rise>
          ))}
          <DrawRule />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const CANNOT = [
  ["Move funds early", "Settlement requires a proof of silence covering the full interval. There is no code path from a live vault to a payout."],
  ["Pay someone else", "The distribution must hash to the commitment the owner sealed. A substituted will produces a different hash and is rejected on-chain."],
  ["Act alone", "Flare verifies the enclave's signature, the commitment, and that the price used sits within 5% of the live FTSO feed, three independent checks, none of which the enclave supplies."],
  ["Outvote the owner", "One late heartbeat returns the vault to living and clears every guardian approval. The owner overrules everyone, right up to execution."],
  ["Read anything twice", "The will is encrypted to the enclave before it leaves the browser. Flare stores a hash. Nothing recoverable is ever published."],
];

/**
 * Pre-empts the sharpest question a technical reader has: the enclave is a
 * trusted component, so why trust it? The honest answer is that it is trusted
 * with confidentiality but not with authority.
 */
function Boundaries() {
  return (
    <section className="relative border-t border-ink-800 px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <Rise>
          <p className="label mb-10">The trust boundary</p>
        </Rise>

        <h2 className="max-w-[22ch] font-black uppercase leading-[0.88] tracking-tightest text-[clamp(2rem,6.5vw,5.5rem)]">
          <WordReveal text="The enclave holds your secret." />{" "}
          <span className="text-ink-400">
            <WordReveal text="It does not hold your money." delay={0.2} />
          </span>
        </h2>

        <Rise delay={0.1} className="mt-10">
          <p className="max-w-[62ch] text-lg leading-relaxed text-ink-200">
            A hardware enclave is still a component you have to trust, and any honest reading of this design has
            to say what happens if that trust is misplaced. So the enclave was given exactly one power, reading a
            will nobody else can read, and no authority over whether, when, or to whom anything moves.
          </p>
        </Rise>

        <div className="mt-16">
          {CANNOT.map(([title, body], i) => (
            <Rise key={title} delay={i * 0.05}>
              <div className="grid grid-cols-1 gap-3 border-t border-ink-800 py-8 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-12">
                <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                  <span className="text-ink-500">It cannot </span>
                  {title.toLowerCase()}
                </h3>
                <p className="max-w-[58ch] leading-relaxed text-ink-200">{body}</p>
              </div>
            </Rise>
          ))}
          <DrawRule />
        </div>

        <Rise delay={0.1} className="mt-14">
          <p className="max-w-[62ch] text-lg leading-relaxed text-ink-200">
            A compromised enclave leaks the contents of a will. That is a real and serious failure, and it is
            strictly smaller than the failure every alternative already accepts, where somebody can simply take
            the coins.
          </p>
        </Rise>
      </div>
    </section>
  );
}

/**
 * The objections people actually raise, answered where they raise them. Anyone
 * arriving from a link will not click into the docs first, so the questions
 * that decide whether they trust this belong before the closing call.
 */
const FAQ: Array<{ q: string; a: React.ReactNode }> = [
  {
    q: "Do I have to deposit my XRP?",
    a: (
      <>
        No. It never leaves your account. Heirloom holds a rule, not your money, and you keep spending as
        normal.
      </>
    ),
  },
  {
    q: "What if I spend it before I die?",
    a: (
      <>
        Nothing breaks. The will pays out whatever is actually there on the day. Percentages scale, and fixed
        amounts shrink in proportion if the estate cannot cover them.
      </>
    ),
  },
  {
    q: "Who signs the payment when I am gone?",
    a: (
      <>
        Nobody. The enclave signs it with a key generated inside the hardware that has never been exported. You
        authorise that key once, while alive, and can revoke it at any time.
      </>
    ),
  },
  {
    q: "Can anyone read my will?",
    a: (
      <>
        No. It is encrypted in your browser before it is sent, and only the enclave can open it. Not us, not
        Flare, not your heirs, until it legitimately executes.
      </>
    ),
  },
  {
    q: "What if someone claims I am dead while I am alive?",
    a: (
      <>
        They need the network to prove your silence, and then you get a grace window. One heartbeat, or one
        button, reverts everything and clears every approval.
      </>
    ),
  },
  {
    q: "What if Heirloom disappears?",
    a: (
      <>
        The contract, the proofs and the encrypted will are on-chain. Every step after death is permissionless,
        so anyone can run the keeper that submits them.
      </>
    ),
  },
  {
    q: "What does it cost?",
    a: (
      <>
        Nothing today. The proposal is a fraction of a percent taken once at payout, and nothing at all if the
        switch never fires. We cannot take custody, so we cannot charge for it.
      </>
    ),
  },
  {
    q: "Is this real money?",
    a: (
      <>
        Not yet. Heirloom runs on Coston2 and the XRP Ledger testnet, so everything here can be reproduced by
        anyone with nothing at risk.
      </>
    ),
  },
];

function Questions() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto w-full max-w-[1100px]">
        <p className="label mb-10">Questions</p>

        <dl className="grid gap-px bg-ink-800 sm:grid-cols-2">
          {FAQ.map(({ q, a }, i) => (
            <motion.div
              key={q}
              className="bg-black p-7 md:p-9"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: EASE }}
            >
              <dt className="mb-3 text-base font-semibold tracking-tight text-white">{q}</dt>
              <dd className="max-w-[46ch] text-sm leading-relaxed text-ink-300">{a}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Closing() {

  // Deliberately not scroll-linked. Tying opacity to scrollYProgress over a
  // tall section meant the content sat centred and fully visible while progress
  // was still near zero, so it rendered invisible exactly when you were
  // looking at it. A viewport trigger fires when it is actually on screen.
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-32">
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <LogoMark size={72} className="mb-12 text-white" />

        <h2 className="max-w-[16ch] font-black uppercase leading-[0.85] tracking-crush text-[clamp(2.6rem,10vw,9rem)]">
          <WordReveal text="Nobody sees the will." />
        </h2>

        <p className="mt-10 max-w-[52ch] text-lg leading-relaxed text-ink-300">
          No custodian. No lawyer. No key handover. Just a rule you wrote, enforced by hardware and proven by
          the ledger you already trust.
        </p>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <Link to="/app" className="btn btn-solid px-9 py-4 text-xs">
            Open the app
          </Link>
          <Link to="/docs" className="btn px-7 py-4">
            Read the docs
          </Link>
          <a
            href={`${EXPLORER}/address/${HEIRLOOM_VAULT}`}
            target="_blank"
            rel="noreferrer"
            className="btn px-7 py-4"
          >
            Contract on Coston2
          </a>
        </div>
      </motion.div>

      <footer className="mt-32 flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t border-ink-800 pt-8">
        <Logo size={20} className="text-ink-300" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
          Flare Summer Signal 2026 · Coston2 · chain 114
        </p>
        <nav className="flex flex-wrap items-center gap-5">
          <Link
            to="/docs/privacy"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300 hover:text-white"
          >
            Privacy
          </Link>
          <a
            href="https://x.com/heirloom_xrp"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300 hover:text-white"
          >
            X ↗
          </a>
          <a
            href="https://github.com/AustinChris1/Heirloom"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300 hover:text-white"
          >
            GitHub ↗
          </a>
        </nav>
      </footer>
    </section>
  );
}
