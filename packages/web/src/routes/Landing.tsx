import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
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
      {/* Scroll progress — the only persistent chrome */}
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
      <Link to="/app" className="btn border-white/40 px-4 py-2">
        Open app
      </Link>
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
          Flare Summer Signal — live on Coston2
        </motion.p>

        <h1 className="font-black uppercase leading-[0.82] tracking-crush text-[clamp(3.2rem,13vw,13rem)]">
          <WordReveal text="Your keys" delay={0.15} />
          <br />
          <span className="text-ink-500">
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
            Heirloom is a trustless dead-man's switch for XRP. Your will is sealed inside a hardware enclave,
            your heartbeat is proven on the XRP Ledger, and your estate is distributed only after you have
            genuinely gone silent. Nobody holds your keys. Nobody reads your will.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/app" className="btn btn-solid px-7 py-4">
              Create a vault
            </Link>
            <a
              href={`${EXPLORER}/address/${HEIRLOOM_VAULT}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-400 underline-offset-4 hover:text-white hover:underline"
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
          <Stat label="Test suite" value="49 passing" />
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
function Flatline() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const flat = useTransform(scrollYProgress, [0.1, 0.62], [0, 1]);
  const aliveOpacity = useTransform(scrollYProgress, [0.05, 0.35], [1, 0]);
  const silentOpacity = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const proofOpacity = useTransform(scrollYProgress, [0.72, 0.88], [0, 1]);
  const proofY = useTransform(scrollYProgress, [0.72, 0.88], [40, 0]);

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <div className="w-full max-w-[1400px]">
          <div className="relative h-[36vh] w-full text-white">
            <Ecg progress={flat} className="h-full w-full" beats={5} />
          </div>

          <div className="relative mt-14 h-32 text-center">
            <motion.div style={{ opacity: aliveOpacity }} className="absolute inset-x-0">
              <p className="label mb-4">Step 02 — while you live</p>
              <p className="mx-auto max-w-[46ch] text-2xl leading-snug md:text-4xl">
                A dust payment on the XRP Ledger, carrying a tag unique to your vault. That is your heartbeat.
              </p>
            </motion.div>

            <motion.div style={{ opacity: silentOpacity }} className="absolute inset-x-0">
              <p className="label mb-4">Step 03 — silence</p>
              <p className="mx-auto max-w-[46ch] text-2xl leading-snug md:text-4xl">
                You stop. Nothing happens automatically — silence is not yet proof.
              </p>
            </motion.div>

            <motion.div style={{ opacity: proofOpacity, y: proofY }} className="absolute inset-x-0">
              <p className="label mb-4">FDC · XRPPaymentNonexistence 0x09</p>
              <p className="mx-auto max-w-[52ch] text-2xl leading-snug md:text-4xl">
                Then anyone can prove, cryptographically, that{" "}
                <span className="text-ink-400">across an entire ledger range no heartbeat exists.</span>
              </p>
            </motion.div>
          </div>
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
    body: "Your will is encrypted to the enclave's key before it leaves your browser. Flare stores only a commitment. The enclave then decrypts it while you are alive and attests that it is readable — because a corrupt ciphertext discovered at execution is discovered too late to fix.",
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

/** Horizontal scroll driven by vertical scroll. */
function Lifecycle() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-72%"]);

  return (
    <section ref={ref} className="relative h-[400vh] bg-white text-black">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="px-6 md:px-10">
          <p className="label mb-3 text-ink-500">How it works</p>
          <h2 className="mb-12 font-black uppercase leading-none tracking-tightest text-[clamp(2rem,6vw,5rem)]">
            Four stages. One is irreversible.
          </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-6 pl-6 md:gap-10 md:pl-10">
          {STAGES.map((s) => (
            <article
              key={s.n}
              className="w-[82vw] shrink-0 border-t-2 border-black pt-6 md:w-[46vw] lg:w-[34vw]"
            >
              <div className="flex items-baseline justify-between">
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
    </section>
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
      {/* Marquee — the one loud decorative element, and it says something true */}
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
          <span className="text-ink-500">
            <WordReveal text="Proving none exists is not." delay={0.2} />
          </span>
        </h2>

        <Rise delay={0.1} className="mt-10">
          <p className="max-w-[60ch] text-lg leading-relaxed text-ink-300">
            Without <code className="font-mono text-white">XRPPaymentNonexistence</code> there is no trustless
            dead-man's switch — only a keeper you have to trust to tell the truth about silence. FDC is the only
            oracle that makes that claim verifiable on-chain.
          </p>
        </Rise>

        <div className="mt-20">
          {PROTOCOLS.map(([proto, surface, why], i) => (
            <Rise key={surface} delay={i * 0.05}>
              <div className="group grid grid-cols-1 items-baseline gap-2 border-t border-ink-800 py-7 transition-colors duration-300 hover:border-white md:grid-cols-[110px_1fr_1.3fr] md:gap-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400 transition-colors group-hover:text-white">
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

function Closing() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col items-center justify-center px-6 py-32">
      <motion.div style={{ scale, opacity }} className="flex flex-col items-center text-center">
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
        <Logo size={20} className="text-ink-400" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
          Flare Summer Signal 2026 · Coston2 · chain 114
        </p>
      </footer>
    </section>
  );
}
