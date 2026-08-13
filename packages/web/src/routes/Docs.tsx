import { marked } from "marked";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "../components/Logo";
import { DOCS, findDoc } from "../lib/docs";

/**
 * Documentation, rendered from the repository's own markdown.
 *
 * The index is a retractable sidebar rather than a block above/beside the
 * content: on desktop it is sticky with its own scrollbar, so switching
 * documents never requires scrolling back to the top; on mobile it slides in
 * as a drawer over the page. One toggle in the header drives both.
 */

const DESKTOP = "(min-width: 768px)";

export function Docs() {
  const { slug } = useParams();
  const doc = findDoc(slug);
  const contentRef = useRef<HTMLDivElement>(null);

  // Open by default where there is room for it, closed where there is not.
  const [navOpen, setNavOpen] = useState(() => window.matchMedia(DESKTOP).matches);
  const isDesktop = () => window.matchMedia(DESKTOP).matches;

  const html = useMemo(() => marked.parse(doc.body, { async: false }) as string, [doc.body]);

  // Links between docs are written as relative markdown paths (USAGE.md,
  // docs/ARCHITECTURE.md). Rewrite them to in-app routes so they don't 404,
  // and send genuinely external links to a new tab.
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    // GitHub gives headings anchor ids; marked does not, add the same slugs
    // so in-page links (e.g. the Usage glossary) work here too.
    root.querySelectorAll("h1, h2, h3").forEach((h) => {
      h.id = (h.textContent ?? "")
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    });

    root.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href") ?? "";
      if (/^https?:/i.test(href)) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noreferrer");
        return;
      }
      const file = href.split("/").pop()?.replace(/\.md$/i, "").toLowerCase();
      const match = DOCS.find((d) => d.slug === file || (file === "readme" && d.slug === "overview"));
      if (match) a.setAttribute("href", `/docs/${match.slug}`);
    });

    window.scrollTo(0, 0);
  }, [html]);

  const index = (
    <nav className="flex flex-col gap-px">
      {DOCS.map((d) => {
        const active = d.slug === doc.slug;
        return (
          <Link
            key={d.slug}
            to={`/docs/${d.slug}`}
            onClick={() => {
              // A drawer that stays open after choosing covers what you chose.
              if (!isDesktop()) setNavOpen(false);
            }}
            className={`border-l-2 py-2.5 pl-4 text-sm transition-colors ${
              active
                ? "border-white text-white"
                : "border-ink-800 text-ink-300 hover:border-ink-500 hover:text-white"
            }`}
          >
            {d.title}
            <span className="mt-1 block text-[11px] leading-snug text-ink-500">{d.blurb}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="grain min-h-screen bg-black">
      <header className="sticky top-0 z-50 border-b border-ink-800 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              className="btn px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em]"
              onClick={() => setNavOpen((o) => !o)}
              aria-expanded={navOpen}
              aria-controls="docs-index"
            >
              {navOpen ? "✕" : "☰"}
            </button>
            <Link to="/" aria-label="Heirloom home">
              <Logo size={24} />
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/app" className="btn px-4 py-2">
              Open app
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile: drawer over the page, with a backdrop that closes it. */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
            onClick={() => setNavOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {navOpen && (
          <motion.aside
            key="drawer"
            id="docs-index"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-ink-800 bg-black px-5 pb-10 pt-24 md:hidden"
          >
            <p className="label mb-5">Documentation</p>
            {index}
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="mx-auto flex max-w-[1500px] px-5 py-10 md:px-8 md:py-14">
        {/* Desktop: a bordered rail, sticky with its own scrollbar, always
            reachable, never scrolled away, collapsible from the header. No
            width animation: squishing text reads worse than an instant reflow. */}
        {navOpen && (
          <motion.aside
            key="sidebar"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden w-72 shrink-0 border-r border-ink-800 pr-8 md:block"
          >
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <p className="label mb-5">Documentation</p>
              {index}
              <a
                href="https://github.com/AustinChris1/Heirloom"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400 underline-offset-4 hover:text-white hover:underline"
              >
                Source on GitHub ↗
              </a>
            </div>
          </motion.aside>
        )}

        {/* ---- content: centred in whatever space the rail leaves ---- */}
        <motion.main
          key={doc.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-w-0 flex-1"
        >
          <div ref={contentRef} className="prose-mono mx-auto md:px-10" dangerouslySetInnerHTML={{ __html: html }} />
        </motion.main>
      </div>

      <footer className="mt-20 border-t border-ink-800 px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
            Coston2 testnet · chain 114
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
          <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300 hover:text-white">
            ← Back to overview
          </Link>
        </div>
      </footer>
    </div>
  );
}
