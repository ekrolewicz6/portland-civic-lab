import type { Metadata } from "next";
import Link from "next/link";
import FireEditorialShell from "@/components/oregon-fire/FireEditorialShell";
import FireSpendingEvidence from "@/components/oregon-fire/FireSpendingEvidence";
import { FIRE_AUTHORS, FIRE_URL } from "@/lib/oregon-fire/metadata";
import { pageMeta } from "@/lib/page-meta";
import "../long-guide.css";
import "./landscapes.css";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Following the Work in One Oregon Landscape · Fire in Oregon",
    description: "We're tracing how an Oregon fire-resilience plan becomes funded, completed and maintained work. See the records we have, the pilot candidates, and the evidence still needed.",
    path: "/oregon-fire/landscapes", type: "article",
  }),
  authors: FIRE_AUTHORS.map(name => ({ name })),
};

const candidates = [
  { name: "Ashland & the Rogue Valley", place: "Southwest Oregon", source: "City of Ashland · monitoring", url: "https://ashlandoregon.gov/201/Science-Monitoring", finding: "A long-running forest and community program publishes monitoring material and an updated community plan.", missing: "A completed unit connected to an attributable expenditure, contract and maintenance record." },
  { name: "Deschutes & Central Oregon", place: "Central Oregon", source: "Forest Service · collaborative report", url: "https://www.fs.usda.gov/restoration/documents/cflrp/2023AnnualReports/FY2023%20Deschutes%20CFLRP%20Annual%20Report_Final%20Feb%2028%202024.pdf", finding: "The collaborative reports activities, monitoring discussions and partners across the landscape.", missing: "A bounded project whose plan, unit records, spending and capacity constraints can be reconciled." },
  { name: "Wallowa & the northeastern mountains", place: "Northeastern Oregon", source: "Wallowa Resources · local programs", url: "https://www.wallowaresources.org/", finding: "A regional stewardship organization describes restoration work, local contractors and landowner support.", missing: "Project-specific spending, confirmed treatment geography and repeated outcome observations." },
] as const;

export default function FireLandscapesPage() {
  const data = {
    "@context": "https://schema.org", "@type": "Article", headline: "Following the work in one Oregon landscape",
    url: `${FIRE_URL}/landscapes`, datePublished: "2026-09-30", dateModified: "2026-09-30",
    author: FIRE_AUTHORS.map(name => ({ "@type": "Person", name })),
    publisher: { "@type": "Organization", name: "Portland Civic Lab" },
  };
  return <FireEditorialShell className="fire-landscape-page" eyebrow="The landscape investigation / starting the record" title="What does it take to turn a plan into work?" intro="A map can show a burn. We are tracing the decisions, money, people and repeated work that made it possible—and the evidence of what changed afterward.">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
    <nav className="fire-story-nav" aria-label="On this page"><a href="#question">The question</a><a href="#account">A real spending account</a><a href="#candidates">Candidate landscapes</a><a href="#evidence">What we need</a></nav>
    <section className="fire-landscape-story" id="question">
      <span className="fire-eyebrow">The question we are trying to answer</span>
      <h2>What would it take to do and maintain the work a place needs?</h2>
      <p>We will start with one defined landscape, its adopted priorities, and several traceable treatment sequences. We will connect what was planned and approved to what was funded, staffed, completed and measured. A local example can show why a good idea does—or does not—become work on the ground.</p>
      <div className="fire-landscape-steps" aria-label="Questions the investigation follows">{[
        ["01", "Why here?", "The stated objective, decision and project boundary."],
        ["02", "What happened?", "Preparation, permits, contracts, crews and completed activities."],
        ["03", "What did it cost?", "Budgets, awards, actual expenditures and who paid."],
        ["04", "What comes next?", "Maintenance, monitoring, benefits and burdens."],
      ].map(([number, title, description]) => <div key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></div>)}</div>
    </section>
    <section className="fire-landscape-story" id="account"><span className="fire-eyebrow">Start with a defined account</span><h2>A statewide number hides very different work.</h2><p>ODF&apos;s annual report is a useful public starting point. It cannot tell us the price of a specific burn or the total cost of fire in Oregon. For the pilot, we will follow individual financial records to individual activities.</p><FireSpendingEvidence /></section>
    <section className="fire-landscape-story" id="candidates"><span className="fire-eyebrow">Pilot selection / in progress</span><h2>Three places. One evidence test.</h2><p>These are places to investigate, not ranked projects. We will choose the first pilot only after confirming a project boundary, at least one completed activity tied to an expenditure, and someone who can clarify the records.</p><div className="fire-landscape-candidates">{candidates.map(candidate => <div key={candidate.name}><span className="fire-eyebrow">{candidate.place}</span><h3>{candidate.name}</h3><p>{candidate.finding}</p><p><strong>The missing link:</strong> {candidate.missing}</p><a href={candidate.url}>{candidate.source} ↗</a></div>)}</div><p className="fire-landscape-selection">We will compare documented finance, linked activities and boundaries, access to records, monitoring, and community relevance. The first published pilot must pass all three evidence tests above; no candidate has passed them yet.</p></section>
    <section className="fire-landscape-story fire-landscape-contribute" id="evidence"><span className="fire-eyebrow">Help complete the record</span><h2>One useful record can connect the story.</h2><p>A completed project with its boundary, a work record, and an attributable contract or expenditure would let us start tracing a real decision. Monitoring or maintenance notes would show what happened later. Existing documents and a short written explanation are helpful; partial records are welcome.</p><div><Link href="/contact?topic=Data+correction&project=Oregon+Fire+Map&fireRecord=landscape:pilot">Share a record or correction →</Link><Link href="/oregon-fire#costs-and-choices">Return to the main guide →</Link></div></section>
  </FireEditorialShell>;
}
