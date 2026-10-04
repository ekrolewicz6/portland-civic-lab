import Link from "next/link";
import type { Metadata } from "next";
import { Flame, Scissors, Wind, ClipboardCheck, Sprout, Coins, ArrowRight } from "lucide-react";
import RepeatPhotoEvidence from "@/components/oregon-fire/RepeatPhotoEvidence";
import FireMechanicsVisual, { HabitatTree } from "@/components/oregon-fire/FireMechanicsVisual";
import FireCostExplorer from "@/components/oregon-fire/FireCostExplorer";
import FireEditorialShell from "@/components/oregon-fire/FireEditorialShell";
import { projectById } from "@/lib/oregon-fire/projects";
import { FIRE_AUTHORS, FIRE_URL } from "@/lib/oregon-fire/metadata";

const title = "Why burn this place?";
const description = "See how a planned fire can change a forest, why Oregon crews choose particular places, and how to weigh the costs and results.";
const ecology = "https://extension.oregonstate.edu/catalog/pub/em-9340-ecological-effects-fire";
export const metadata: Metadata = {
  title: `${title} | Fire in Oregon`, description,
  alternates: { canonical: `${FIRE_URL}/stories/why-burn` },
  authors: FIRE_AUTHORS.map(name => ({ name })),
  openGraph: { title, description, url: `${FIRE_URL}/stories/why-burn`, type: "article" },
  twitter: { card: "summary_large_image" },
};
const chapters = [["changed", "How fire moves"], ["matters", "Why here?"], ["choices", "The choices & costs"], ["happened", "The actual burn"], ["helped", "Did it help?"]];

export default function Page() {
  const project = projectById("woodpecker")!;
  return <FireEditorialShell
    className="fire-story-page"
    eyebrow="Fire, explained"
    title={title}
    intro="A planned burn can remove small plants and help the trees we want to keep. But where, when, and how it burns make all the difference."
    navLabel="Story chapters"
    nav={chapters.map(([id, label], i) => ({ id, label, number: `0${i + 1}` }))}
  >
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org", "@type": "Article", headline: title, description,
      datePublished: "2026-09-26", dateModified: "2026-09-26", url: `${FIRE_URL}/stories/why-burn`,
      author: FIRE_AUTHORS.map(name => ({ "@type": "Person", name })),
      citation: [project.evidence[0].url, ecology, "https://extension.oregonstate.edu/catalog/em-9341-fire-behavior", "https://doi.org/10.5066/P13VCTOE", "https://doi.org/10.1017/dry.2026.10019", "https://research.fs.usda.gov/treesearch/55535"],
    }).replace(/</g, "\\u003c") }} />

    <section id="changed" className="fire-rail fire-dossier-section fire-visual-chapter">
      <div className="fire-rail-label"><span className="fire-eyebrow">01 / How fire moves</span></div>
      <h2>Where the flames go matters.</h2>
      <p>Dry needles, shrubs, and small trees are fuel: material that can burn. They can connect the forest floor to branches overhead. Breaking some of those connections is one reason to use a planned burn.</p>
      <div className="fire-wide"><FireMechanicsVisual /></div>
      <div className="fire-story-takeaway"><Flame aria-hidden="true" /><p><strong>Less fuel can change the way a fire burns.</strong> A treated forest can still burn. The question is how that fire affects trees, habitat, and nearby people.</p></div>
      <details><summary>Does every Oregon forest need this?</summary><p>No. Dry pine forests, wet coastal forests, oak woodlands, and sagebrush country have different histories and needs. A burn that helps one place may be wrong for another.</p><p><a href={ecology}>Read OSU’s guide to Oregon’s different fire regimes ↗</a></p></details>
    </section>

    <section id="matters" className="fire-rail fire-dossier-section fire-visual-chapter">
      <div className="fire-rail-label"><span className="fire-eyebrow">02 / A real Oregon example</span></div>
      <h2>At Woodpecker, the goal was to help particular trees.</h2>
      <p>In October 2025, OSU students and staff burned two small areas in the McDonald-Dunn Research Forest near Corvallis. They chose the areas for their potential to restore these tree communities:</p>
      <div className="fire-habitat-pair fire-wide">
        <div><HabitatTree kind="oak" /><div><span className="fire-eyebrow">One burn area</span><h3>Give oak and madrone more room.</h3><p>Reduce competing plants around Oregon white oak and Pacific madrone.</p></div></div>
        <div><HabitatTree kind="pine" /><div><span className="fire-eyebrow">The other burn area</span><h3>Support valley ponderosa pine.</h3><p>Use fire in a stand of Willamette Valley ponderosa pine, a tree adapted to fire.</p></div></div>
      </div>
      <p>The intended burn would reduce shrubs and small trees while keeping the larger trees. These drawings show the goals; photographs of the actual units still need reuse permission.</p>
      <p><a className="fire-story-source" href={project.evidence[0].url}>Source: OSU’s account of the Woodpecker burns ↗</a></p>
    </section>

    <section id="choices" className="fire-rail fire-dossier-section fire-visual-chapter">
      <div className="fire-rail-label"><span className="fire-eyebrow">03 / Choosing the work</span></div>
      <h2>Lighting the fire is one part of the job.</h2>
      <p>Crews decide what to remove first, which conditions to burn in, and how to protect nearby people and property.</p>
      <div className="fire-tool-sequence fire-steps fire-wide">
        <div><span>1 / Prepare</span><Scissors aria-hidden="true" /><h3>Change the fuel.</h3><p>Sometimes small trees or shrubs need to be cut before burning. That work has its own costs and effects.</p></div>
        <div><span>2 / Wait</span><Wind aria-hidden="true" /><h3>Choose the conditions.</h3><p>Wind and moisture affect the flames and where smoke travels. A suitable window can be short.</p></div>
        <div><span>3 / Burn</span><Flame aria-hidden="true" /><h3>Use a written plan.</h3><p>Plan the ignition, crews, boundaries, and response if conditions change.</p></div>
      </div>
      <p><a className="fire-story-source" href="https://extension.oregonstate.edu/catalog/pub/em-9343-planning-prescribed-burn">How crews plan a prescribed burn: OSU Extension ↗</a></p>
      <h3 className="fire-story-subheading">What does prevention buy us?</h3>
      <p>Spending before a fire may reduce damage later. To judge the value, we need the full cost of the work and a realistic estimate of what changes. A lower price per acre alone cannot tell us the savings.</p>
      <div className="fire-wide"><FireCostExplorer /></div>
    </section>

    <section id="happened" className="fire-rail fire-dossier-section fire-visual-chapter">
      <div className="fire-rail-label"><span className="fire-eyebrow">04 / Woodpecker’s timeline</span></div>
      <h2>Here is what was reported.</h2>
      <ol className="fire-burn-timeline fire-wide">
        <li><span className="fire-timeline-dot" /><span>Before the burn</span><h3>Students planned; staff contacted neighbors.</h3><p>Students developed burn plans. Forest staff explained the work to nearby residents.</p></li>
        <li><span className="fire-timeline-dot burned" /><time dateTime="2025-10">October 2025</time><h3>Two areas were burned.</h3><p>OSU describes low flames and patchy burning where fuels were damp.</p></li>
        <li className="fire-timeline-missing"><span className="fire-timeline-dot" /><span>Follow-up records needed</span><h3>Check what grew and survived.</h3><p>We still need repeated measurements to describe lasting changes.</p></li>
      </ol>
      <p className="fire-story-footnote">We have OSU’s published account. Exact ignition dates, burned acreage, and verified unit boundaries are still needed.</p>
      <p><Link className="fire-guide-primary" href="/oregon-fire/projects/woodpecker#timeline">See the project record <ArrowRight size={16} aria-hidden="true" /></Link></p>
    </section>

    <section id="helped" className="fire-rail fire-dossier-section fire-visual-chapter">
      <div className="fire-rail-label"><span className="fire-eyebrow">05 / Checking the results</span></div>
      <h2>Did the trees and habitat benefit?</h2>
      <p>To answer that, we need to look beyond the day of the burn.</p>
      <div className="fire-evidence-checks fire-wide">
        <div><ClipboardCheck aria-hidden="true" /><span className="fire-evidence-status known">Reported</span><h3>The burn happened.</h3><p>OSU describes the work and its initial effects.</p></div>
        <div><Sprout aria-hidden="true" /><span className="fire-evidence-status pending">Still unknown</span><h3>How did the trees respond?</h3><p>We need later measurements of tree survival, competing plants, and habitat.</p></div>
        <div><Coins aria-hidden="true" /><span className="fire-evidence-status pending">Still unknown</span><h3>What did the whole job cost?</h3><p>We need itemized spending, funding, and future maintenance costs.</p></div>
      </div>
      <div className="fire-wide"><RepeatPhotoEvidence /></div>
      <div className="fire-story-related fire-wide"><h3>Follow a different part of the story.</h3><div><Link href="/oregon-fire?story=egley#fire-stories"><strong>Egley: when wildfire met earlier treatments</strong><span>A field and satellite study of treatment effects.</span><ArrowRight size={18} aria-hidden="true" /></Link><Link href="/oregon-fire?story=finley#fire-stories"><strong>Finley: using fire for prairie and oak habitat</strong><span>A different ecosystem and a different purpose.</span><ArrowRight size={18} aria-hidden="true" /></Link><Link href="/oregon-fire?scarMode=severity&scarYears=1&scarEnd=2024#explore"><strong>Look inside recent fire scars</strong><span>See how effects can vary within a single fire.</span><ArrowRight size={18} aria-hidden="true" /></Link></div></div>
      <p className="fire-story-footnote">Public sources checked September 26, 2026. Independent ecological review is still needed.</p>
    </section>

    <section className="fire-contribute-band fire-story-ending">
      <div><span className="fire-eyebrow">Help us fill the gaps</span><h2>Have a burn plan, photos, or monitoring results?</h2></div>
      <div><div className="fire-contribute-actions"><Link className="fire-button fire-button-light" href="/contact?topic=Data+correction&project=Oregon+Fire+Map&fireRecord=story:why-burn">Share a record or suggest a correction <ArrowRight size={17} aria-hidden="true" /></Link><Link className="fire-text-link" href="/oregon-fire/projects/woodpecker#evidence">See the records we still need</Link></div></div>
    </section>
  </FireEditorialShell>;
}
