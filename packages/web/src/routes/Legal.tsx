import { marked } from "marked";
import { useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "../components/Logo";
import { LEGAL, findLegal } from "../lib/docs";
import { rewriteDocLinks } from "../lib/docLinks";

/** The privacy policy and terms, at /privacy and /terms rather than inside the docs index. */
export function Legal() {
  const { pathname } = useLocation();
  const doc = findLegal(pathname.replace(/^\//, "")) ?? LEGAL[0];
  const contentRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => marked.parse(doc.body, { async: false }) as string, [doc.body]);

  useEffect(() => {
    rewriteDocLinks(contentRef.current);
    window.scrollTo(0, 0);
  }, [html]);

  const other = LEGAL.find((d) => d.slug !== doc.slug)!;

  return (
    <div className="grain min-h-screen bg-black">
      <header className="sticky top-0 z-50 border-b border-ink-800 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link to="/" aria-label="Heirloom home">
            <Logo size={24} />
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/docs" className="btn px-4 py-2">
              Docs
            </Link>
            <Link to="/app" className="btn px-4 py-2">
              Open app
            </Link>
          </nav>
        </div>
      </header>

      <motion.main
        key={doc.slug}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16"
      >
        <div ref={contentRef} className="prose-mono" dangerouslySetInnerHTML={{ __html: html }} />
      </motion.main>

      <footer className="mt-16 border-t border-ink-800 px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-between gap-4">
          <Link
            to={`/${other.slug}`}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300 hover:text-white"
          >
            {other.title} →
          </Link>
          <nav className="flex flex-wrap items-center gap-5">
            <Link
              to="/docs"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300 hover:text-white"
            >
              Docs
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
