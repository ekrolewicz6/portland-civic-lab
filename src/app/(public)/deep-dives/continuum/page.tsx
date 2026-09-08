import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Home, ShieldCheck } from "lucide-react";
import { pageMeta } from "@/lib/page-meta";
import SystemMap from "@/components/deep-dives/homeless/story/SystemMap";
import CapacityDiagnosis from "@/components/deep-dives/homeless/story/CapacityDiagnosis";
import DiagnosticBoard from "@/components/deep-dives/homeless/story/DiagnosticBoard";
import InvestigationRequests from "@/components/deep-dives/homeless/story/InvestigationRequests";
import StoryNavigation from "@/components/deep-dives/homeless/story/StoryNavigation";
import JourneyExplorer from "@/components/deep-dives/homeless/story/JourneyExplorer";
import EvidenceFlow from "@/components/deep-dives/homeless/story/EvidenceFlow";
import CostExplorer from "@/components/deep-dives/homeless/story/CostExplorer";
import ActionAgenda from "@/components/deep-dives/homeless/story/ActionAgenda";
import ReferenceAtlas from "@/components/deep-dives/homeless/story/ReferenceAtlas";
import QuoteButton from "@/components/deep-dives/homeless/story/QuoteButton";
import styles from "@/components/deep-dives/homeless/story/ContinuumStory.module.css";

export const metadata: Metadata = pageMeta({
  title: "Where the path out of homelessness breaks",
  description: "A visual guide to Portland’s homelessness system: where placements break down, what local services cost, and changes that could help people reach a lasting home. Explore real evidence and clearly labeled example journeys.",
  path: "/deep-dives/continuum",
  type: "article",
});

const SHELTER_REVIEW = "https://hsd.multco.us/wp-content/uploads/2026/01/Adult-Shelter-Review-FY25.pdf";
const QUOTE = "The handoff is part of the service.";

function SectionHeader({ number, label, title, children }: { number: string; label: string; title: string; children?: React.ReactNode }) {
  return <div className={styles.sectionHeader}><div className={styles.eyebrow}>{number} / {label}</div><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}

export default function ContinuumPage() {
  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="continuum-title">
      <div className={styles.container}>
        <div className={styles.breadcrumb}><Link href="/deep-dives">Policy deep dives</Link><span aria-hidden="true">/</span><Link href="/deep-dives/homelessness">Homelessness</Link><span aria-hidden="true">/</span><span>The continuum</span></div>
        <div className={styles.heroGrid}>
          <div>
            <h1 id="continuum-title">Where the path out of homelessness <em>breaks.</em></h1>
            <p className={styles.heroLead}>Too few places. Staffing limits. Housing units sitting vacant while people wait. See where the evidence identifies a failure—and the questions we still need answered.</p>
            <div className={styles.heroActions}><a href="#breaks" className={styles.primaryLink}>See the failure map <ArrowRight size={17} aria-hidden="true" /></a><a href="#capacity" className={styles.secondaryLink}>Is there a bed for everyone? <ArrowRight size={16} aria-hidden="true" /></a></div>
          </div>
          <figure className={styles.heroDiagram}>
            <div className={styles.heroDiagramLabel}>What a working system connects</div>
            <div className={styles.heroStop}><span className={styles.heroStopIcon}><ShieldCheck size={25} strokeWidth={1.5} aria-hidden="true" /></span><div><strong>Safe tonight</strong><small>A place that meets the person’s needs</small></div></div>
            <div className={styles.heroHandoff}>A suitable home + a funded move</div>
            <div className={styles.heroStop}><span className={styles.heroStopIcon}><Home size={25} strokeWidth={1.5} aria-hidden="true" /></span><div><strong>A lasting home</strong><small>Rent the household can afford</small></div></div>
            <div className={styles.heroHandoff}>Care + benefits + tenancy help</div>
            <div className={styles.heroStop}><span className={styles.heroStopIcon}><HeartHandshake size={25} strokeWidth={1.5} aria-hidden="true" /></span><div><strong>Support that stays</strong><small>Help that follows changing needs</small></div></div>
            <figcaption className={styles.heroDiagramCaption}>People can go directly into housing. Care and housing help can happen together. Shelter is an option along the way.</figcaption>
          </figure>
        </div>
        <div className={styles.heroFacts}>
          <div className={styles.heroFact}><div className={styles.heroFactTop}><span className={styles.heroFactNumber}>4,187</span><strong>beds for 10,526 people</strong></div><p>January 2025: year-round shelter and transitional inventory versus people experiencing homelessness in Multnomah County.</p><a href="#capacity">See the matched-date capacity comparison ↓</a></div>
          <div className={styles.heroFact}><div className={styles.heroFactTop}><span className={styles.heroFactNumber}>~½</span><strong>of exit destinations unknown</strong></div><p>In the County’s FY25 adult shelter review. An unknown destination does not mean a return to the street.</p><a href={SHELTER_REVIEW} target="_blank" rel="noreferrer">County shelter review · FY25 ↗</a></div>
          <div className={styles.heroFact}><div className={styles.heroFactTop}><span className={styles.heroFactNumber}>−21.7%</span><strong>in the homeless-services operating budget</strong></div><p>FY27 adopted versus FY26 adopted: $242.9m, down $67.3m. Funding reductions and allocation choices affect different parts of the path.</p><a href="#money">See the adopted budgets and local costs ↓</a></div>
        </div>
      </div>
    </section>

    <StoryNavigation />

    <section id="capacity" className={styles.section}>
      <span id="tonight" className={styles.alias} />
      <div className={styles.container}>
        <SectionHeader number="01" label="The capacity question" title="Is there a bed for everyone?" />
        <CapacityDiagnosis />
      </div>
    </section>

    <section id="breaks" className={styles.section}>
      <div className={styles.container}>
        <SectionHeader number="02" label="Locate the failure" title="The failures are not all the same.">A shortage of beds needs a different response from an unfilled shift, a delayed move-in or a contract that is not properly monitored. Here is where each problem shows up.</SectionHeader>
        <DiagnosticBoard />
        <details className={styles.conceptDisclosure}><summary>See how these constraints interrupt a placement</summary><SystemMap /></details>
      </div>
    </section>

    <section id="pathways" className={`${styles.section} ${styles.warm}`}>
      <span id="lanes" className={styles.alias} /><span id="saying-no" className={styles.alias} />
      <div className={styles.container}>
        <SectionHeader number="03" label="Follow a person" title="Different needs. Different routes home.">A rent crisis, a hospital discharge and an unusable shelter offer need different responses. Explore three illustrative situations and compare the handoffs.</SectionHeader>
        <p className={styles.journeyEvidence}><strong>98% wanted stable housing</strong> among 350 local survey respondents asked. This is not a countywide estimate. <a href="https://hsd.multco.us/wp-content/uploads/2026/04/Pathways-Survey-Findings-Published-4.9.2026.pdf" target="_blank" rel="noreferrer">PSU Pathways · April 2026 ↗</a></p>
        <JourneyExplorer />
        <div className={styles.principleStrip}><div><strong>Ask what the person needs.</strong><span>Housing, care, safety and household needs shape the match.</span></div><div><strong>Verify what the place provides.</strong><span>An available bed may not be a usable placement.</span></div><div><strong>Confirm that the connection happened.</strong><span>One worker’s referral needs another worker’s arrival record.</span></div></div>
      </div>
    </section>

    <section id="count" className={styles.section}>
      <div className={styles.container}>
        <SectionHeader number="04" label="Follow the outcome" title="What happens after someone says yes?">A City report makes a crucial distinction visible: interest, acceptance and using a bed are separate results. Lasting housing requires further follow-up.</SectionHeader>
        <EvidenceFlow />
      </div>
    </section>

    <div id="the-handoff" className={styles.quoteBand}><div className={`${styles.container} ${styles.quoteInner}`}><p>“{QUOTE}”</p><QuoteButton quote={QUOTE} /></div></div>

    <section id="money" className={styles.section}>
      <div className={styles.container}>
        <SectionHeader number="05" label="Follow the money" title="What does a place actually cost?">Shelter operating costs, rent benchmarks and adopted budgets answer different questions. Choose a view to see the dollars, the year and what they buy.</SectionHeader>
        <CostExplorer />
      </div>
    </section>

    <section id="fix" className={`${styles.section} ${styles.warm}`}>
      <div className={styles.container}>
        <SectionHeader number="06" label="Change the result" title="Fund the connections. Verify the result.">These are proposed priorities built on services already operating locally. Open a change to see who can act and how the public could track progress.</SectionHeader>
        <ActionAgenda />
      </div>
    </section>

    <section id="investigate" className={styles.section}>
      <div className={styles.container}>
        <SectionHeader number="07" label="Get the missing evidence" title="Turn a red flag into an investigation.">Choose the question you want answered. Each request names the records that could distinguish a capacity problem, a staffing problem and an execution problem.</SectionHeader>
        <InvestigationRequests />
      </div>
    </section>

    <section id="stages" className={styles.section}>
      <span id="risks" className={styles.alias} /><span id="sources" className={styles.alias} />
      <div className={styles.container}>
        <SectionHeader number="08" label="Go deeper" title="The services behind the story.">Definitions, existing local programs and primary sources—available whenever you want to go deeper.</SectionHeader>
        <ReferenceAtlas />
        <div className={styles.endNote}><span>Evidence reviewed September 8, 2026. Each figure retains its own reporting period.</span><Link href="/deep-dives/homelessness">Explore the broader homelessness deep dive →</Link></div>
      </div>
    </section>
  </div>;
}
