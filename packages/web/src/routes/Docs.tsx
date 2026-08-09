import { marked } from "marked";
import { useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "../components/Logo";
import { DOCS, findDoc } from "../lib/docs";

/**
 * Documentation, rendered from the repository's own markdown.
 *
 * The content is imported raw rather than copied, so these pages cannot drift
 * from the files in docs/. Styling is done with a scoped stylesheet instead of
 * a typography plugin — the whole site is monochrome and the defaults would
 * introduce colour.
 */
export function Docs() {
  const { slug } = useParams();
  const doc = findDoc(slug);
  const contentRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => marked.parse(doc.body, { async: false }) as string, [doc.body]);

  // Links between docs are written as relative markdown paths (USAGE.md,
  // docs/DEMO.md). Rewrite them to in-app routes so they don't 404, and send
  // genuinely external links to a new tab.
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

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

  return (
    <div className="grain min-h-screen bg-black">
      <header className="sticky top-0 z-30 border-b border-ink-800 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link to="/" aria-label="Heirloom home">
            <Logo size={24} />
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/app" className="btn px-4 py-2">
              Open app
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px] flex-col gap-10 px-5 py-10 md:flex-row md:gap-16 md:px-8 md:py-14">
        {/* ---- index ---- */}
        <aside className="md:w-64 md:shrink-0">
          <p className="label mb-5">Documentation</p>
          <nav className="flex flex-col gap-px">
            {DOCS.map((d) => {
              const active = d.slug === doc.slug;
              return (
                <Link
                  key={d.slug}
                  to={`/docs/${d.slug}`}
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

          <a
            href="https://github.com/AustinChris1/flareHack"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400 underline-offset-4 hover:text-white hover:underline"
          >
            Source on GitHub ↗
          </a>
        </aside>

        {/* ---- content ---- */}
        <motion.main
          key={doc.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-w-0 flex-1"
        >
          <div ref={contentRef} className="prose-mono" dangerouslySetInnerHTML={{ __html: html }} />
        </motion.main>
      </div>

      <footer className="mt-20 border-t border-ink-800 px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
            Coston2 testnet · chain 114
          </p>
          <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300 hover:text-white">
            ← Back to overview
          </Link>
        </div>
      </footer>
    </div>
  );
}
