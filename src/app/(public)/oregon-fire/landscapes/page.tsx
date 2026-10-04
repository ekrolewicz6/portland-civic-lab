import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Circle } from "lucide-react";
import FireEditorialShell from "@/components/oregon-fire/FireEditorialShell";
import FireSpendingEvidence from "@/components/oregon-fire/FireSpendingEvidence";
import { FIRE_AUTHORS, FIRE_URL } from "@/lib/oregon-fire/metadata";
import { pageMeta } from "@/lib/page-meta";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Following the Work in One Oregon Landscape · Fire in Oregon",
    description: "We're tracing how an Oregon fire-resilience plan becomes funded, completed and maintained work. See the records we have, the pilot candidates, and the evidence still needed.",
    path: "/oregon-fire/landscapes", type: "article",
  }),
  authors: FIRE_AUTHORS.map(name => ({ name })),
};

const questions = [
  ["Why here?", "The stated objective, decision and project boundary."],
  ["What happened?", "Preparation, permits, contracts, crews and completed activities."],
  ["What did it cost?", "Budgets, awards, actual expenditures and who paid."],
  ["What comes next?", "Maintenance, monitoring, benefits and burdens."],
] as const;

const candidates = [
  { name: "Ashland & the Rogue Valley", place: "Southwest Oregon", source: "City of Ashland · monitoring", url: "https://ashlandoregon.gov/201/Science-Monitoring", finding: "A long-running forest and community program publishes monitoring material and an updated community plan.", missing: "A completed unit connected to an attributable expenditure, contract and maintenance record." },
  { name: "Deschutes & Central Oregon", place: "Central Oregon", source: "Forest Service · collaborative report", url: "https://www.fs.usda.gov/restoration/documents/cflrp/2023AnnualReports/FY2023%20Deschutes%20CFLRP%20Annual%20Report_Final%20Feb%2028%202024.pdf", finding: "The collaborative reports activities, monitoring discussions and partners across the landscape.", missing: "A bounded project whose plan, unit records, spending and capacity constraints can be reconciled." },
  { name: "Wallowa & the northeastern mountains", place: "Northeastern Oregon", source: "Wallowa Resources · local programs", url: "https://www.wallowaresources.org/", finding: "A regional stewardship organization describes restoration work, local contractors and landowner support.", missing: "Project-specific spending, confirmed treatment geography and repeated outcome observations." },
] as const;

const tests = [
  "A confirmed project boundary.",
  "At least one completed activity tied to an expenditure.",
  "Someone who can clarify the records.",
] as const;

export default function FireLandscapesPage() {
  const data = {
    "@context": "https://schema.org", "@type": "Article", headline: "Following the work in one Oregon landscape",
    url: `${FIRE_URL}/landscapes`, datePublished: "2026-09-30", dateModified: "2026-09-30",
    author: FIRE_AUTHORS.map(name => ({ "@type": "Person", name })),
    publisher: { "@type": "Organization", name: "Portland Civic Lab" },
  };
  return <FireEditorialShell
    className="fire-landscape-page"
    eyebrow="The landscape investigation · starting the record"
    title="What does it take to turn a plan into work?"
    intro="A map can show a burn. We are tracing the decisions, money, people and repeated work that made it possible, and the evidence of what changed afterward."
    nav={[{ id: "question", label: "The question" }, { id: "account", label: "A real spending account" }, { id: "candidates", label: "Candidate landscapes" }, { id: "evidence", label: "What we need" }]}
  >
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />

    <section className="fire-rail fire-dossier-section" id="question">
      <div className="fire-rail-label"><span className="fire-eyebrow">The question we are trying to answer</span></div>
      <h2>What would it take to do and maintain the work a place needs?</h2>
      <p>We will start with one defined landscape, its adopted priorities, and several traceable treatment sequences. We will connect what was planned and approved to what was funded, staffed, completed and measured. A local example can show why a good idea does or does not become work on the ground.</p>
      <ol className="fire-steps fire-wide fire-landscape-steps" aria-label="Questions the investigation follows">
        {questions.map(([title, description], i) => <li key={title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></li>)}
      </ol>
    </section>

    <section className="fire-rail fire-dossier-section" id="account">
      <div className="fire-rail-label"><span className="fire-eyebrow">Start with a defined account</span></div>
      <h2>A statewide number hides very different work.</h2>
      <p>ODF&apos;s annual report is a useful public starting point. It cannot tell us the price of a specific burn or the total cost of fire in Oregon. For the pilot, we will follow individual financial records to individual activities.</p>
      <div className="fire-wide"><FireSpendingEvidence /></div>
    </section>

    <section className="fire-rail fire-dossier-section" id="candidates">
      <div className="fire-rail-label"><span className="fire-eyebrow">Pilot selection · in progress</span></div>
      <h2>Three places. One evidence test.</h2>
      <p>These are three places to investigate. We have not ranked them. We will compare documented finance, linked activities and boundaries, access to records, monitoring, and community relevance.</p>
      <div className="fire-candidates fire-wide">
        {candidates.map(candidate => <article key={candidate.name}>
          <span className="fire-eyebrow">{candidate.place}</span>
          <h3>{candidate.name}</h3>
          <dl>
            <div><dt>What is public</dt><dd>{candidate.finding}</dd></div>
            <div className="fire-candidate-missing"><dt>The missing link</dt><dd>{candidate.missing}</dd></div>
          </dl>
          <a href={candidate.url}>{candidate.source} <ArrowUpRight size={15} aria-hidden="true" /></a>
        </article>)}
      </div>
      <div className="fire-evidence-test fire-wide">
        <div>
          <span className="fire-eyebrow">The evidence test</span>
          <h3>A place becomes the pilot when its records show three things.</h3>
        </div>
        <ul>{tests.map(test => <li key={test}><Circle size={18} aria-hidden="true" />{test}</li>)}</ul>
        <p>The first published pilot must pass all three. No candidate has passed them yet.</p>
      </div>
    </section>

    <section className="fire-contribute-band" id="evidence">
      <div>
        <span className="fire-eyebrow">Help complete the record</span>
        <h2>One useful record can connect the story.</h2>
      </div>
      <div>
        <p>A completed project with its boundary, a work record, and an attributable contract or expenditure would let us start tracing a real decision. Monitoring or maintenance notes would show what happened later. Existing documents and a short written explanation are helpful, and partial records are welcome.</p>
        <div className="fire-contribute-actions">
          <Link className="fire-button fire-button-light" href="/contact?topic=Data+correction&project=Oregon+Fire+Map&fireRecord=landscape:pilot">Share a record or correction <ArrowRight size={17} aria-hidden="true" /></Link>
          <Link className="fire-text-link" href="/oregon-fire#costs-and-choices">Return to the main guide</Link>
        </div>
      </div>
    </section>
  </FireEditorialShell>;
}
