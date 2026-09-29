import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COMMITTEE, REVIEWED, SOURCES, WHATS_NEXT } from "@/lib/datacenters/data";
import { DIVE_CONTAINER, Section } from "@/components/deep-dives/shared";
import RateShift from "@/components/deep-dives/datacenters/RateShift";
import SubsidyPerJob from "@/components/deep-dives/datacenters/SubsidyPerJob";
import ConditionsScorecard from "@/components/deep-dives/datacenters/ConditionsScorecard";
import DealCalculator from "@/components/deep-dives/datacenters/DealCalculator";
import SitingMap from "@/components/deep-dives/datacenters/SitingMap";
import CommitteeDetail from "@/components/deep-dives/datacenters/CommitteeDetail";
import RecordFindings from "@/components/deep-dives/datacenters/RecordFindings";
import WhoShowedUp from "@/components/deep-dives/datacenters/WhoShowedUp";
import StructuralFactors from "@/components/deep-dives/datacenters/StructuralFactors";
import DocumentLibrary from "@/components/deep-dives/datacenters/DocumentLibrary";
import { DCAC_DOC_COUNT } from "@/lib/datacenters/dcac-docs";
import { pageMeta } from "@/lib/page-meta";

export const metadata: Metadata = pageMeta({
  title: "Oregon's Data Center Bargain — What the Evidence Can Tell Us",
  description: "Oregon's data-center tax deals, power protections and water tradeoffs: the competing cases, six conditions for a better agreement, and a transparent fiscal calculator.",
  path: "/deep-dives/data-centers", type: "article",
});
const NAV = [
  ["fight", "What changed"], ["case-for", "The case for"], ["case-against", "The case against"],
  ["evidence", "Read the numbers"], ["test", "Six conditions"], ["price", "Test a deal"],
  ["committee", "Participate"], ["record", "The record"], ["sources", "Sources & corrections"],
];
const SOURCE_IDS: (keyof typeof SOURCES)[] = [
  "advisoryCommittee", "preliminary", "businessOregonRoi", "impactStudy", "econw",
  "pucImplementation", "pgeRates", "odeSchoolFunding", "morrowAssessor", "wascoAgreement",
  "morrowMinutes", "capitalChronicleLawsuit", "hillsboroResponse", "hillsboroMoratorium",
  "taxFairness", "awsWater", "uecPresentation", "tribalStatement", "deqAir", "audit2016",
];
function Src({ id, label }: { id: keyof typeof SOURCES; label?: string }) {
  const s = SOURCES[id];
  return <>{" "}<a href={s.url} className="underline underline-offset-2 text-[var(--color-river-deep)]">{label ?? s.org}</a></>;
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
    <h3 className="text-lg font-semibold text-[var(--color-canopy)]">{title}</h3>
    <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--color-ink-light)]">{children}</div>
  </article>;
}
function Fold({ title, children }: { title: string; children: React.ReactNode }) {
  return <details className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
    <summary className="cursor-pointer py-2 text-lg font-semibold text-[var(--color-canopy)]">{title}</summary>
    <div className="mt-5">{children}</div>
  </details>;
}
export default function DataCentersDeepDivePage() {
  return <div className="bg-[var(--color-paper)]">
    <section className="relative bg-[var(--color-canopy)] text-white noise-overlay">
      <div className={DIVE_CONTAINER + " relative z-10 py-16 sm:py-24"}>
        <Link href="/deep-dives" className="font-mono text-xs uppercase tracking-widest text-[var(--color-ember-bright)]">Policy Deep-Dive · Energy, water &amp; taxes</Link>
        <h1 className="mt-6 max-w-5xl font-editorial-normal text-[40px] sm:text-[58px] lg:text-[70px] leading-[1.04] tracking-tight">
          Oregon built the cloud.<span className="block italic text-[var(--color-ember-bright)]">Was it worth the bill?</span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg sm:text-xl text-white/80 leading-relaxed">
          A data center can be a major taxpayer and still receive a costly subsidy. It can support a rural economy
          and still put pressure on power, water and public services. Oregon&apos;s task is to distinguish a useful
          investment from an unnecessarily generous agreement. That takes a local balance sheet, credible alternatives
          and enforceable terms.
        </p>
        <p className="mt-5 text-sm text-white/70">By Portland Civic Lab · Evidence revision <time dateTime="2026-09-29">{REVIEWED}</time> · Policy analysis</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#case-for" className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-ember)] px-5 py-3 font-semibold text-[var(--color-canopy)]">Read both cases <ArrowRight className="h-4 w-4" /></a>
          <a href="#price" className="rounded-sm border border-white/40 px-5 py-3 font-semibold">Test the assumptions</a>
          <a href="#committee" className="rounded-sm border border-white/40 px-5 py-3 font-semibold">Comment by October 24</a>
        </div>
        <div className="mt-10 grid gap-5 border-t border-white/20 pt-6 sm:grid-cols-3">
          <div><p className="font-mono text-2xl text-[var(--color-ember-bright)]">+29.7% / −1.3%</p><p className="mt-2 text-sm text-white/75">PGE data-center / residential average rate changes, effective July 8. <a href={SOURCES.pgeRates.url} className="underline text-white">PGE filing</a></p></div>
          <div><p className="font-mono text-2xl text-[var(--color-ember-bright)]">2,630</p><p className="mt-2 text-sm text-white/75">Estimated direct operating jobs statewide, using 2024 data. Preliminary July 2026 analysis. <a href={SOURCES.econw.url + "#page=23"} className="underline text-white">ECONorthwest</a></p></div>
          <div><p className="font-mono text-2xl text-[var(--color-ember-bright)]">October 24</p><p className="mt-2 text-sm text-white/75">Written comments close at 5 p.m. on the committee&apos;s preliminary findings. <a href={SOURCES.advisoryCommittee.url} className="underline text-white">Current notice</a></p></div>
        </div>
      </div>
    </section>
    <nav aria-label="Article sections" className="sticky top-14 z-40 border-b border-[var(--color-parchment)] bg-[var(--color-paper)]/95 backdrop-blur">
      <div className={DIVE_CONTAINER}><div className="flex overflow-x-auto gap-2 py-2">
        {NAV.map(([id, label]) => <a key={id} href={"#" + id} className="whitespace-nowrap px-3 py-3 text-xs font-mono uppercase hover:bg-[var(--color-paper-warm)]">{label}</a>)}
      </div></div>
    </nav>

    <Section id="fight" eyebrow="The policy landscape" title="There is more than one pause—and more than one kind of deal"
      lead="A tax exemption, a land-use approval and an electricity connection are separate decisions. A change to one does not settle the others.">
      <div className="space-y-5">
        <p className="text-base leading-relaxed">Our judgment: Oregon should require a transparent, project-specific justification for preferential tax terms.
          The public evidence supports stronger scrutiny. It does not establish that every existing deal loses money, that every rural deal was necessary,
          or that every urban project would arrive without help.</p>
        <div className="overflow-x-auto rounded-sm border border-[var(--color-parchment)] bg-white">
          <table className="w-full text-sm text-left">
            <caption className="p-4 text-left font-semibold">What the reviewed records establish</caption>
            <thead className="bg-[var(--color-paper-warm)]"><tr><th scope="col" className="p-4">Program or decision</th><th scope="col" className="p-4">Scope and status</th></tr></thead>
            <tbody>
              <tr className="border-t border-[var(--color-parchment)]"><th scope="row" className="p-4 align-top">Standard enterprise zone</th><td className="p-4">HB 4084 pauses new data-center authorizations from June 5, 2026 until 90 days after the 2027 session adjourns. Existing authorizations are a separate category. <Src id="businessOregonRoi" label="Business Oregon, slide 4" /></td></tr>
              <tr className="border-t border-[var(--color-parchment)]"><th scope="row" className="p-4 align-top">Long-term rural zone / SIP</th><td className="p-4">Business Oregon lists data centers as eligible under these separate programs. The standard-zone pause is not a freeze on every new tax deal. <Src id="businessOregonRoi" label="Program comparison" /></td></tr>
              <tr className="border-t border-[var(--color-parchment)]"><th scope="row" className="p-4 align-top">PGE</th><td className="p-4">Dedicated rates took effect July 8. Average changes were +29.7% for the data-center class and −1.3% for residential customers. <Src id="pgeRates" /></td></tr>
              <tr className="border-t border-[var(--color-parchment)]"><th scope="row" className="p-4 align-top">Other electricity providers</th><td className="p-4">The POWER Act concerns investor-owned utility tariffs. PacifiCorp and Idaho Power implementation must be checked separately; consumer-owned utilities use their own governing arrangements. <Src id="pucImplementation" label="PUC, slides 2–3 and 8" /></td></tr>
              <tr className="border-t border-[var(--color-parchment)]"><th scope="row" className="p-4 align-top">Hillsboro land use</th><td className="p-4">On July 27 the city paused new applications for data centers and battery storage as a primary use for 120 days. Previously submitted projects may continue. This is distinct from the state tax-incentive restriction. <Src id="hillsboroMoratorium" /></td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed">The June lawsuit challenges pre-pause enterprise-zone approvals in Hillsboro and Washington County.
          The plaintiffs allege procedural failures; those allegations do not by themselves establish a violation.
          Hillsboro describes staff administration under its existing program rules. Read both accounts:
          {" "}<Src id="capitalChronicleLawsuit" label="reporting on the complaint" /> and <Src id="hillsboroResponse" label="the city’s explanation" />.
          This revision does not establish the current court disposition.</p>
      </div>
    </Section>

    <Section id="case-for" tone="warm" eyebrow="The case for incentives" title="A smaller share of a large investment can still matter"
      lead="The strongest argument is about additional local revenue and opportunity. It depends on what would happen without the incentive.">
      <div className="space-y-4">
        <Card title="The receipts can change a small community’s budget">
          <p>ECONorthwest&apos;s July presentation reports $22.96 million in data-center property-tax collections in Morrow County, about 32% of countywide collections.
            That is money collected across taxing jurisdictions, not simply discretionary county-government revenue.
            The assessment excludes negotiated fees. <Src id="econw" label="Preliminary analysis, slide 22" /></p>
        </Card>
        <Card title="Employment benefits extend beyond permanent operators">
          <p>Construction, contractors and suppliers matter as well as on-site jobs. ECONorthwest separates operating employment from construction and other effects.
            Temporary work still has economic value; the useful questions are duration, local hiring, wages and whether the work would occur without the subsidy.
            <Src id="econw" label="Employment definitions and contribution estimates" /></p>
        </Card>
        <Card title="Communities can negotiate a better return">
          <p>The 2021 The Dalles/Wasco County SIP agreement ties annual payments to hypothetical full property taxes, with a minimum payment.
            A negotiated formula can preserve upside as a site grows. That is stronger evidence of a negotiable term than a company&apos;s general promise of community benefit.
            <Src id="wascoAgreement" label="Signed agreement, definitions and Exhibit A" /></p>
          <p><strong>What would strengthen this case:</strong> documented competing sites, evidence the incentive changes the decision, and an audited local cash-flow comparison.
            An empty parcel today is not proof that it will remain empty without this particular deal.</p>
        </Card>
      </div>
    </Section>

    <Section id="case-against" eyebrow="The case for restraint" title="Public resources have alternatives"
      lead="An investment can benefit Oregon while the subsidy used to attract it is larger than necessary.">
      <div className="space-y-4">
        <Card title="Activity associated with an incentive is not activity caused by it">
          <p>Locational advantages and existing infrastructure may attract investment independently of tax relief.
            The state&apos;s 2022 impact study does not quantify that project-level counterfactual. Both claims—indispensable subsidy and inevitable investment—need evidence.
            <Src id="impactStudy" label="Study, section 9.1" /></p>
        </Card>
        <Card title="A local payment may shift who funds schools">
          <p>ODE explains that eligible local operating revenues, including enterprise-zone school fees, enter the equalization formula.
            A reduction can reduce the statewide pool even when state aid backfills the host district. Districts already above formula funding are an exception;
            capital bonds and some local-option revenues are treated separately. <Src id="odeSchoolFunding" label="ODE, slides 5 and 11–13" /></p>
        </Card>
        <Card title="The environmental ledger needs its own evidence">
          <p>A site&apos;s water withdrawals, water consumed, discharges and peak summer demand answer different questions.
            Electricity supply and backup generation add further effects. The committee calls for attention to cumulative impacts across shared basins and energy systems.
            A small annual percentage of city water use cannot by itself demonstrate an acceptable seasonal impact.
            <Src id="preliminary" label="September preliminary findings, water and energy sections" /></p>
          <p><strong>What would weaken this case against a specific deal:</strong> credible evidence that the incentive is necessary, verified net receipts,
            funded service costs and enforceable resource limits. The size of an exemption alone cannot tell us how much revenue was realistically available.</p>
        </Card>
        <SubsidyPerJob />
      </div>
    </Section>

    <Section id="evidence" tone="dark" eyebrow="Keep the measures separate" title="Three questions the same headline number cannot answer"
      lead="Economic activity, public revenue and the effect of an incentive are different measurements.">
      <div className="space-y-5">
        <RateShift />
        <div className="rounded-sm bg-white text-[var(--color-ink)] p-5 sm:p-6">
          <h3 className="text-lg font-semibold">How to read the return figures</h3>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm text-left">
              <thead><tr><th scope="col" className="p-3">Measure</th><th scope="col" className="p-3">Published values / definition</th><th scope="col" className="p-3">What it cannot establish</th></tr></thead>
              <tbody>
                <tr className="border-t"><th scope="row" className="p-3 align-top">Economic-output ROI</th><td className="p-3">Modified ROI: standard 29.16; rural 1.18; SIP 6.24. Modeled output compared with net abatements.</td><td className="p-3">Taxpayer payback. Output is not tax revenue.</td></tr>
                <tr className="border-t"><th scope="row" className="p-3 align-top">Employee-income-tax ROI</th><td className="p-3">Modified ROI: standard +1.35; rural −0.84; SIP +0.03. Net return relative to adjusted abatements after specified offsets.</td><td className="p-3">A complete fiscal or social balance sheet; several business taxes and environmental costs are excluded.</td></tr>
                <tr className="border-t"><th scope="row" className="p-3 align-top">Incentive additionality</th><td className="p-3">How much investment or employment would not occur without the incentive.</td><td className="p-3">Not estimated by those ROI figures.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-relaxed">These are historical program-level results from the February 2022 study. The June 2026 presentation repeats the economic-output figures; the income-tax comparison comes from the original study.
            Figure 20&apos;s rural calculation is $81.46M ÷ ($534.95M − $34.20M) − 1 ≈ −0.84.
            The net-return formula matters: +1.35 is not $1.35 of gross revenue per dollar.
            <Src id="impactStudy" label="Original study, figures 17 and 20" /></p>
        </div>
        <div className="rounded-sm bg-white text-[var(--color-ink)] p-5 sm:p-6">
          <h3 className="text-lg font-semibold">Two comparisons that need their denominators</h3>
          <p className="mt-3 text-sm leading-relaxed"><strong>Investment:</strong> $15.4B of $15.8B is data centers&apos; share within the long-term rural program.
            It is not that program&apos;s share of all Oregon data-center investment. The table separately lists $3.1B under standard zones and $11.2B under SIP.
            <Src id="businessOregonRoi" label="Business Oregon, slide 4" /></p>
          <p className="mt-3 text-sm leading-relaxed"><strong>Jobs:</strong> Business Oregon labels 7,600 jobs as direct contributions for 2025;
            ECONorthwest estimates 2,630 direct operating jobs using 2024 data and an on-site definition.
            Years and coverage differ, and we have not reconciled the totals. The larger figure cannot simply be relabeled as construction and multiplier effects.
            <Src id="businessOregonRoi" label="Business Oregon, slide 2" />; <Src id="econw" label="ECONorthwest, slides 16–23" />.</p>
        </div>
        <p className="text-sm leading-relaxed text-white/80"><strong className="text-white">Our interpretation:</strong> PGE shows that stronger cost allocation is possible.
          A tariff decision alone cannot prove that future investment will be unaffected, or that all power-related costs across Oregon have been solved.</p>
      </div>
    </Section>

    <Section id="test" eyebrow="An editorial standard" title="Six conditions for a better agreement"
      lead="Two conditions have partial coverage. Four are not established statewide by the reviewed record. This is an evidence assessment, not a finding that every individual project fails.">
      <p className="mb-5 text-sm leading-relaxed">The requirements below are our proposed decision rules, not a description of universal current law.
        A project should document each condition. Strong tax receipts cannot compensate for an unlawful water impact or a procedural violation.</p>
      <ConditionsScorecard />
    </Section>

    <Section id="price" tone="warm" layout="stacked" eyebrow="Make the assumptions visible" title="What changes the financial answer?"
      lead="The calculator compares two uncertain fiscal outcomes: offering a deal and offering no break. It cannot decide the environmental, legal or distributional questions.">
      <DealCalculator />
      <div className="grid gap-4 mt-6 md:grid-cols-2">
        <Card title="Contract check: The Dalles / Wasco County, 2021">
          <p>The agreement&apos;s Project 1 example uses $600M value and a 1.10% rate: $6.6M without SIP.
            Its annual payment is the greater of 50% of that tax or $3M, so the example totals $3.3M.
            This total already includes statutory property tax and community-service payments; adding them again would double-count.
            Project 2 uses 60% with the same floor. <Src id="wascoAgreement" label="Definitions and Exhibit A" /></p>
          <p>Use the share option and $3M floor to reproduce this arithmetic. The calculator does not model the agreement’s escalation or assessment schedules.
            These contract examples are not estimates of actual collections.</p>
        </Card>
        <Card title="Contract check: Morrow County, 2023">
          <p>The county&apos;s approval minutes describe a 15-year SIP exemption, an initial $100M taxable portion, a community-service fee up to $2.5M and additional negotiated obligations.
            That is not a flat annual payment and is distinct from the rural-zone deals.
            <Src id="morrowMinutes" label="Approval record, page 6" /></p>
          <p>The complete payment and assessment schedules are needed before projecting this agreement.
            We have not validated a full project valuation for either case; neither is loaded as a supposedly measured regional preset.</p>
        </Card>
      </div>
      <div className="mt-8"><Fold title="Regional questions to take to a proposed site"><SitingMap /></Fold></div>
    </Section>

    <Section id="committee" eyebrow="You can still participate" title="Read the preliminary findings, then put evidence on the record"
      lead={<>As checked {REVIEWED}, written comments are open until {COMMITTEE.commentDeadline}. The September document expects final recommendations before the end of 2026.</>}>
      <div className="mb-6 rounded-sm border-2 border-[var(--color-fern)]/30 bg-white p-5">
        <p className="text-sm leading-relaxed">Read the <Src id="preliminary" label="September 10 preliminary findings" />, then use the written-comment form linked from the
          {" "}<Src id="advisoryCommittee" label="official committee notice" />. Check that notice for any schedule changes.</p>
        <p className="mt-3 text-sm leading-relaxed">A useful comment names a site, utility, basin or agreement; distinguishes an observation from an estimate;
          links the supporting record; and says which requirement or unanswered question the evidence changes.
          Hearing testimony is distinct from government-to-government tribal consultation.</p>
        <p className="mt-3 text-sm">For mailing-list updates, the committee lists {COMMITTEE.email}. The online form is the current written-comment route.</p>
      </div>
      <Fold title="Committee membership, charge and schedule"><CommitteeDetail /></Fold>
      <div id="next" className="mt-6 grid gap-4 md:grid-cols-3 scroll-mt-32">{WHATS_NEXT.map(e => <Card key={e.what} title={e.what}><p className="font-mono text-xs">{e.when}</p><p>{e.why}</p></Card>)}</div>
    </Section>

    <Section id="record" eyebrow="Read further" title="The record, with its limits"
      lead="These supporting sections distinguish an agency estimate from a stakeholder position and from our interpretation. Inclusion in a hearing does not independently verify a claim.">
      <div className="space-y-4">
        <Fold title="Selected findings and unresolved questions"><RecordFindings /></Fold>
        <div id="voices" className="scroll-mt-32"><Fold title="Stakeholder positions and published responses"><WhoShowedUp /></Fold></div>
        <div id="why" className="scroll-mt-32"><Fold title="How the decision process shapes the debate"><StructuralFactors /></Fold></div>
        <div id="library" className="scroll-mt-32"><Fold title={`Document index · ${DCAC_DOC_COUNT} linked items`}><DocumentLibrary /></Fold></div>
      </div>
    </Section>

    <Section id="sources" tone="warm" eyebrow="Sources, method & corrections" title="What this revision checked"
      lead="A document-based analysis by Portland Civic Lab. Selected primary records were reviewed for the fiscal definitions, program coverage, employment discrepancy and current participation guidance.">
      <div className="space-y-5">
        <Card title="How to read the evidence">
          <p><strong>Documented:</strong> a source reports a number, decision or term. <strong>Estimated:</strong> a study models an outcome.
            <strong>Assumed:</strong> the calculator uses an editable input. <strong>Judgment:</strong> our proposed conditions or interpretation.</p>
          <p>Historical figures keep their source periods. The document index is a reading aid, not a claim that every recording was transcribed,
            every statement corroborated or every link continuously monitored. Preliminary findings remain preliminary.</p>
          <p>Company and government positions below come from published material. No new interviews or responses were obtained for this revision.
            The unresolved work is project-level assessment and payment schedules, the competing jobs definitions, and subsequent court and utility decisions.</p>
          <p><Link href="/contact" className="underline text-[var(--color-river-deep)]">Send a correction or documented response</Link> with the relevant claim, source page and proposed correction.</p>
        </Card>
        <details className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <summary className="cursor-pointer py-2 font-semibold">Correction history · September 29, 2026</summary>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>Separated economic-output ROI from limited fiscal ROI; corrected net versus gross interpretation and dated the historical cost-per-job comparison.</li>
            <li>Corrected the within-program investment denominator and removed an unsupported explanation of the jobs discrepancy.</li>
            <li>Narrowed the tax moratorium and electricity claims to their actual program and utility coverage; added the distinct Hillsboro land-use pause.</li>
            <li>Replaced regional probability estimates and categorical site verdicts with explicit assumptions and evidence questions.</li>
            <li>Rebuilt the calculator with separate fiscal perspectives, longer horizons, costs, construction receipts, uncertain construction and downloadable cash flows.</li>
            <li>Added school-funding exceptions, conditional enforcement proposals, published stakeholder positions and clear unresolved questions.</li>
            <li>Updated the written-comment deadline and final-report expectation; removed unsupported claims of a complete review of all recordings.</li>
          </ul>
        </details>
        <div className="grid gap-3 sm:grid-cols-2">{SOURCE_IDS.map(id => {
          const s = SOURCES[id];
          return <a key={id} href={s.url} className="rounded-sm border border-[var(--color-parchment)] bg-white p-4 hover:border-[var(--color-sage)]">
            <span className="block text-sm font-semibold">{s.title}</span>
            <span className="mt-1 block text-xs text-[var(--color-ink-muted)]">{s.org} · {s.kind}</span>
          </a>;
        })}</div>
      </div>
    </Section>
  </div>;
}
