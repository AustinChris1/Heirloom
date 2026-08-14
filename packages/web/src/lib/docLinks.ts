import { DOCS, LEGAL } from "./docs";

/**
 * Makes rendered markdown behave like a page rather than a file.
 *
 * Headings get GitHub's anchor slugs, which marked does not add, so in-page
 * links keep working. Relative links between markdown files (USAGE.md,
 * docs/PRIVACY.md) become in-app routes instead of 404s, and anything external
 * opens in a new tab.
 */
export function rewriteDocLinks(root: HTMLElement | null): void {
  if (!root) return;

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
    if (!file) return;

    const legal = LEGAL.find((d) => d.slug === file);
    if (legal) {
      a.setAttribute("href", `/${legal.slug}`);
      return;
    }

    const doc = DOCS.find((d) => d.slug === file || (file === "readme" && d.slug === "overview"));
    if (doc) a.setAttribute("href", `/docs/${doc.slug}`);
  });
}
