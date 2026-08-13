import architecture from "../../../../docs/ARCHITECTURE.md?raw";
import howItWorks from "../../../../docs/HOW-IT-WORKS.md?raw";
import hosting from "../../../../docs/HOSTING.md?raw";
import submission from "../../../../docs/SUBMISSION.md?raw";
import teeDeployment from "../../../../docs/TEE-DEPLOYMENT.md?raw";
import usage from "../../../../docs/USAGE.md?raw";
import readme from "../../../../README.md?raw";

/**
 * The repository's documentation, served from the app.
 *
 * Imported as raw text rather than duplicated, so the site and the repo can
 * never drift, editing a file in docs/ changes the published page on the next
 * build. A judge should not have to browse GitHub to read any of this.
 */
export interface Doc {
  slug: string;
  title: string;
  blurb: string;
  body: string;
}

export const DOCS: Doc[] = [
  {
    slug: "overview",
    title: "Overview",
    blurb: "What Heirloom is, how it works, and what is live.",
    body: readme,
  },
  {
    slug: "how-it-works",
    title: "How it works",
    blurb: "Plain language, no jargon. Start here.",
    body: howItWorks,
  },
  {
    slug: "usage",
    title: "Usage",
    blurb: "Every button, step by step, for someone brand new, glossary included.",
    body: usage,
  },
  {
    slug: "architecture",
    title: "Architecture",
    blurb: "The vault lifecycle, the five Flare integrations, and the trust boundary.",
    body: architecture,
  },
  {
    slug: "submission",
    title: "Submission",
    blurb: "The hackathon submission, with live transaction hashes as evidence.",
    body: submission,
  },
  {
    slug: "tee-deployment",
    title: "TEE deployment",
    blurb: "Standing up a Flare Compute Extension against the redeployed Coston2 diamond.",
    body: teeDeployment,
  },
  {
    slug: "hosting",
    title: "Hosting",
    blurb: "What needs a server, what does not, and what it costs.",
    body: hosting,
  },
  // docs/DEMO.md is deliberately NOT listed, it is the private run-of-show
  // for recording the demo video, not documentation for a visitor.
];

export const findDoc = (slug?: string): Doc =>
  DOCS.find((d) => d.slug === slug) ?? DOCS[0];
