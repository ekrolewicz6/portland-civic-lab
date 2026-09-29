import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Ban, Building2, Droplets, HardHat, Landmark, Leaf, PlugZap, Waves, Sun, BookOpen, PencilLine, Send } from "lucide-react";
import { COMMITTEE, REVIEWED, SOURCES } from "@/lib/datacenters/data";
import DealCalculator from "@/components/deep-dives/datacenters/DealCalculator";
import ConditionsScorecard from "@/components/deep-dives/datacenters/ConditionsScorecard";
import RateShift from "@/components/deep-dives/datacenters/RateShift";
import SitingMap from "@/components/deep-dives/datacenters/SitingMap";
import SubsidyPerJob from "@/components/deep-dives/datacenters/SubsidyPerJob";
import CommitteeDetail from "@/components/deep-dives/datacenters/CommitteeDetail";
import RecordFindings from "@/components/deep-dives/datacenters/RecordFindings";
import WhoShowedUp from "@/components/deep-dives/datacenters/WhoShowedUp";
import StructuralFactors from "@/components/deep-dives/datacenters/StructuralFactors";
import DocumentLibrary from "@/components/deep-dives/datacenters/DocumentLibrary";
import { BargainDiagram, CountyTaxVisual, ReturnsVisual } from "@/components/deep-dives/datacenters/StoryVisuals";
import { DCAC_DOC_COUNT } from "@/lib/datacenters/dcac-docs";
import { pageMeta } from "@/lib/page-meta";
import "./data-centers.css";

export const metadata: Metadata = pageMeta({
  title: "Oregon's Data Center Bargain — Follow the Money",
  description: "What does Oregon get from data-center tax deals? Explore real agreement terms, test the break-even point, and follow the money, power and water.",
  path: "/deep-dives/data-centers", type: "article",
});
const NAV = [["fight","What changed"],["case-for","The tradeoff"],["price","Try the examples"],["evidence","Read the numbers"],["test","A better deal"],["committee","Take part"],["record","The record"],["sources","Sources"]];
const SOURCE_IDS: (keyof typeof SOURCES)[] = ["advisoryCommittee","preliminary","businessOregonRoi","impactStudy","econw","pucImplementation","pgeRates","odeSchoolFunding","morrowAssessor","wascoAgreement","morrowMinutes","capitalChronicleLawsuit","hillsboroResponse","hillsboroMoratorium","taxFairness","awsWater","uecPresentation","tribalStatement","deqAir","audit2016"];
function Src({ id, label }: { id: keyof typeof SOURCES; label?: string }) {
  return <a className="dc-source" href={SOURCES[id].url}>{label ?? SOURCES[id].org} ↗</a>;
}
function Fold({ title, children }: { title: string; children: ReactNode }) {
  return <details className="dc-disclosure"><summary>{title}</summary><div className="dc-detail-body">{children}</div></details>;
}
function Section({ id, kicker, title, lead, tone="", children }: { id: string; kicker: string; title: string; lead?: string; tone?: string; children: ReactNode }) {
  return <section id={id} className={"dc-section "+(tone?"dc-section-"+tone:"")}><div className="dc-wrap">
    <div className="dc-section-heading"><div><span className="dc-kicker">{kicker}</span><h2>{title}</h2></div>{lead&&<p>{lead}</p>}</div>{children}
  </div></section>;
}
export default function DataCentersDeepDivePage() {
  return <div className="dc-story">
    <header className="dc-hero"><div className="dc-wrap dc-hero-grid"><div>
      <Link className="dc-kicker" href="/deep-dives">Policy deep-dive / Energy, water & taxes</Link>
      <h1>Oregon built the cloud.<em>Was it worth the bill?</em></h1>
      <p className="dc-hero-deck">Data centers bring jobs and tax payments. They also get tax breaks and need power and water. A good deal depends on one big question: <strong>would the project come here anyway?</strong></p>
      <div className="dc-actions"><a href="#price">Try a real-world example <ArrowRight size={17}/></a><a href="#case-for">Understand the tradeoff</a></div>
      <p className="dc-hero-meta">Portland Civic Lab · Policy analysis<br /><time dateTime="2026-09-29">Updated {REVIEWED}</time></p>
    </div><BargainDiagram /></div></header>

    <nav className="dc-nav" aria-label="Article sections"><div className="dc-wrap">{NAV.map(([id,label])=><a key={id} href={"#"+id}>{label}</a>)}</div></nav>

    <Section id="fight" kicker="First, the ground rules" title="Three decisions. Three different rulebooks." lead="A tax break, a power connection and permission to build are separate decisions. Oregon has changed some of the rules—not all of them.">
      <div className="dc-policy-grid">
        <article className="dc-policy"><Ban size={29}/><span className="dc-tag amber">New standard-zone approvals paused</span><h3>Tax breaks</h3><p>The June 5 state pause covers the standard enterprise-zone program. Long-term rural zones and the Strategic Investment Program remain separate routes.</p><Src id="businessOregonRoi" label="Business Oregon · program comparison"/></article>
        <article className="dc-policy"><PlugZap size={29}/><span className="dc-tag">PGE rates changed July 8</span><h3>Electricity bills</h3><p>PGE created dedicated data-center rates. Protections elsewhere depend on the utility. One rate decision does not settle the entire state&apos;s power needs.</p><Src id="pgeRates" label="PGE · July 8 implementation"/></article>
        <article className="dc-policy"><Building2 size={29}/><span className="dc-tag amber">Hillsboro land-use pause</span><h3>Where to build</h3><p>Hillsboro&apos;s July 27 pause covers new applications for data centers and battery storage as a primary use. Previously submitted projects may continue.</p><Src id="hillsboroMoratorium" label="Hillsboro · 120-day moratorium"/></article>
      </div>
      <Fold title="Details: who is covered, the lawsuit and what comes next">
        <p>HB 4084 pauses new standard-zone authorizations until 90 days after the 2027 legislative session adjourns. Existing authorizations are a separate category. Business Oregon lists data centers as eligible for long-term rural zones and SIP. The pause is not a freeze on every tax deal.</p>
        <p>The POWER Act concerns investor-owned utility tariffs. PacifiCorp and Idaho Power have separate implementation processes; consumer-owned utilities have their own governing arrangements. The June PUC schedule anticipated a PacifiCorp order in October and compliance filing in November; check the docket for subsequent decisions. <Src id="pucImplementation"/></p>
        <p>The June lawsuit challenges pre-pause approvals in Hillsboro and Washington County. Plaintiffs allege procedural failures; that is not a court finding. Hillsboro describes staff administration under existing program rules. This revision does not establish the current court disposition. <Src id="capitalChronicleLawsuit" label="Reporting on the complaint"/> <Src id="hillsboroResponse" label="The city’s explanation"/></p>
      </Fold>
    </Section>

    <Section id="case-for" kicker="The central tradeoff" title="The same tax break can be a gain—or a giveaway." lead="The answer changes depending on what happens without it. Compare two possible futures, not just a big investment number." tone="warm">
      <div className="dc-fork">
        <article className="dc-fork-path"><span className="dc-tag">If the incentive changes the decision</span><h3>The deal brings something new.</h3><div className="dc-fork-flow"><span>Tax break</span><ArrowRight size={18}/><span>Project arrives</span><ArrowRight size={18}/><span>New receipts</span></div><p>Some tax revenue may beat an empty site—if the payments cover the public costs.</p></article>
        <div className="dc-fork-middle">or</div>
        <article className="dc-fork-path"><span className="dc-tag amber">If the project would arrive anyway</span><h3>The public gives up revenue.</h3><div className="dc-fork-flow"><span>Project arrives</span><ArrowRight size={18}/><span>Break still granted</span><ArrowRight size={18}/><span>Less paid</span></div><p>The same investment could have paid full tax. The subsidy needs a stronger justification.</p></article>
      </div>
      <p className="dc-takeaway">We do not know which future applies just from the size of the building. Evidence about competing sites, costs and the company&apos;s decision matters.</p>
      <div className="dc-two" style={{marginTop:36}}>
        <article className="dc-panel"><span className="dc-kicker">Why communities say yes</span><h3>Even a reduced tax bill can matter.</h3><CountyTaxVisual />
          <div className="dc-benefit-row"><HardHat size={25}/><div><strong>Work beyond permanent jobs</strong><p>Construction, suppliers and contractors count too. Ask how long the work lasts and who gets hired.</p></div></div>
          <div className="dc-benefit-row"><Landmark size={25}/><div><strong>The terms are negotiable</strong><p>The Dalles tied payments to full taxes and a minimum floor. The calculator below lets you try those terms.</p></div></div>
          <Fold title="What would make the case stronger?"><p>Documented competing sites, evidence that the incentive changes the decision, and audited local cash flows. An empty parcel today does not prove it would stay empty without this deal.</p><p>The $22.96M is collected across taxing jurisdictions, not simply available to the county government. Construction benefits should be assessed for duration, local hiring, wages and whether the incentive caused them. <Src id="econw"/></p></Fold>
        </article>
        <article id="case-against" className="dc-panel" style={{scrollMarginTop:140}}><span className="dc-kicker">Why others ask for restraint</span><h3>A local gain can shift costs elsewhere.</h3>
          <p>School funding connects local tax decisions to the rest of Oregon.</p>
          <div className="dc-school-flow" role="img" aria-label="In a typical formula-funded district, lower local school revenue can trigger more state aid, leaving less in the statewide funding pool if state funding stays fixed.">
            <div><strong>↓</strong>Local school-tax revenue</div><ArrowRight/><div><strong>↑</strong>State aid fills the gap</div><ArrowRight/><div><strong>↓</strong>Less available statewide</div>
          </div>
          <p className="dc-fine">Typical formula-funded district; state funding held fixed. Exceptions matter.</p>
          <Src id="odeSchoolFunding" label="Oregon Department of Education · school funding"/>
          <Fold title="School-funding exceptions"><p>Eligible local operating revenues, including enterprise-zone school fees, enter the equalization formula. Districts whose local revenues already exceed formula funding do not receive the same backfill. Capital bonds and certain local-option receipts are treated separately. A site-level review must identify the affected levies.</p></Fold>
          <h3 style={{marginTop:26}}>Water needs a local answer.</h3>
          <div className="dc-water-row"><div><Droplets size={23}/><strong>How much is taken?</strong><p>Measure withdrawals from each source.</p></div><div><Waves size={23}/><strong>What comes back?</strong><p>Track consumption, discharge and quality.</p></div><div><Sun size={23}/><strong>When is it needed?</strong><p>Check summer peaks and drought limits.</p></div></div>
          <Fold title="What the financial comparison leaves out"><p>A small annual share of city water use does not establish an acceptable seasonal impact. Power supply, backup generators, noise and cumulative basin impacts need their own evidence. The committee&apos;s preliminary report leaves important questions open. <Src id="preliminary"/></p><p>Credible evidence that an incentive is needed, verified net receipts, funded service costs and enforceable resource limits can strengthen a specific deal. A large exemption alone does not establish how much revenue was realistically available.</p><SubsidyPerJob/></Fold>
        </article>
      </div>
    </Section>

    <Section id="price" kicker="Try it yourself" title="Does the tax break pay off?" lead="Start with a real agreement or program. Move the big assumption. Watch the public-money comparison change.">
      <DealCalculator />
      <Fold title="Why these examples—and why no Morrow County forecast?"><p>The Dalles examples use terms from the signed 2021 Design LLC agreement. Project 1&apos;s illustration uses $600M at 1.10%: $6.6M in full tax and a $3.3M total payment at a 50% share. Project 2 uses 60%. Both have a $3M floor. Included taxes and community-service payments are not added twice. Escalators and actual assessment schedules are not modeled. <Src id="wascoAgreement" label="Signed agreement · definitions and Exhibit A"/></p><p>The Hillsboro example is a program illustration using the maximum city fees and school support, not a named project or proof of current eligibility. The annual share changes after year 3.</p><p>Morrow County&apos;s 2023 approval minutes describe a 15-year SIP exemption, an initial $100M taxable portion, a community-service fee up to $2.5M and additional obligations. That is not a flat payment. Without the complete schedules we cannot present a defensible project forecast. <Src id="morrowMinutes" label="Approval minutes · page 6"/></p></Fold>
      <Fold title="What to ask about a site near you"><SitingMap /></Fold>
    </Section>

    <Section id="evidence" kicker="Read the numbers carefully" title="Economic activity is not the same as taxpayer payback." lead="A project can generate business activity while the tax incentive returns less public revenue than it costs. And neither number tells us whether the incentive was necessary." tone="dark">
      <ReturnsVisual />
      <p className="dc-fine" style={{color:"#d0ddd4",marginTop:18}}>Historical results for whole incentive programs, not individual data centers. <Src id="impactStudy" label="February 2022 study · figures 17 and 20"/></p>
      <Fold title="What these return ratios mean"><p>These are modified net ROI figures. Economic-output ROI compares modeled output with adjusted abatements; employee-income-tax ROI is a much narrower fiscal calculation. Several business taxes and environmental costs are excluded.</p><p>The rural income-tax calculation is $81.46M ÷ ($534.95M − $34.20M) − 1 ≈ −0.84. A +1.35 net ratio corresponds to $2.35 of gross receipts per adjusted dollar of abatement, not $1.35. These estimates do not establish how much activity was caused by the incentive. The June 2026 Business Oregon presentation repeats the economic-output figures; the income-tax figures come from the original study.</p></Fold>
      <div className="dc-measure-grid">
        <article className="dc-panel"><span className="dc-kicker">Investment / Know the denominator</span><h3>Almost all of one program&apos;s investment.</h3><div className="dc-investment-bar" role="img" aria-label="Data centers represent 15.4 billion dollars of 15.8 billion dollars within the long-term rural program, about 97.5 percent."><span/><span/></div><div className="dc-chart-legend"><span><i className="dc-dot dc-green"/> Data centers · $15.4B</span><span><i className="dc-dot" style={{background:"#d8b282"}}/> Other · $0.4B</span></div><p>This describes the <strong>long-term rural program</strong>. It does not describe all data-center investment in Oregon.</p><Src id="businessOregonRoi" label="Business Oregon · slide 4"/><Fold title="The other programs"><p>The same table separately lists $3.1B of data-center investment under standard zones and $11.2B under SIP. The $15.8B denominator belongs to the rural program only.</p></Fold></article>
        <article className="dc-panel"><span className="dc-kicker">Jobs / Keep the definitions attached</span><h3>Two estimates we cannot simply combine.</h3><div className="dc-job-pair"><div><strong>7,600</strong><span>Business Oregon<br/>2025 · “direct contributions”</span></div><b>≠</b><div><strong>2,630</strong><span>ECONorthwest<br/>2024 data · on-site operations</span></div></div><p>Different years. Different coverage. The totals have not been reconciled.</p><Src id="businessOregonRoi" label="Business Oregon · slide 2"/>{" "}<Src id="econw" label="ECONorthwest · employment analysis"/><Fold title="What we can and cannot infer"><p>ECONorthwest separates operating employment from construction and other effects. The larger Business Oregon total is labeled direct, so it cannot simply be relabeled as construction and multiplier jobs to explain the gap. Both authors&apos; definitions need reconciliation.</p></Fold></article>
      </div>
      <div style={{marginTop:28}}><RateShift /></div>
      <p className="dc-small" style={{color:"#d0ddd4",marginTop:18}}>PGE&apos;s change shows that costs can be allocated differently. It does not prove every utility has solved the problem, or that future investment will be unchanged.</p>
    </Section>

    <Section id="test" kicker="Our proposed standard" title="A better deal has to pass six tests." lead="Two have partial coverage in the reviewed record. Four remain open statewide. Each project still needs its own evidence." tone="warm">
      <ConditionsScorecard />
      <p className="dc-fine" style={{marginTop:24}}>These are proposed requirements, not universal current law or a finding that every project fails. More tax revenue does not excuse an unlawful water impact or a procedural violation.</p>
    </Section>

    <Section id="committee" kicker="Have a say" title="Bring a specific question to the public record." lead="The committee has released preliminary findings. Its September report expects final recommendations before the end of 2026.">
      <div className="dc-action-banner"><div className="dc-date-block"><span>October</span><strong>24</strong><span>5 p.m. / 2026</span></div><div><h3>Written comments are open.</h3><p>Name the site, utility or agreement. Link the evidence. Explain which promise should be required—or which unanswered question matters.</p><a href={SOURCES.advisoryCommittee.url}>Open the official comment instructions <ArrowRight size={18}/></a></div></div>
      <div className="dc-three" style={{marginTop:28}}>
        <div className="dc-panel"><BookOpen size={24}/><h3>Read the questions</h3><p>Start with what the committee still wants to know.</p><Src id="preliminary" label="September preliminary findings"/></div>
        <div className="dc-panel"><PencilLine size={24}/><h3>Make one point well</h3><p>Separate what you observed from what you estimated. Add a source and a concrete request.</p></div>
        <div className="dc-panel"><Send size={24}/><h3>Use the current form</h3><p>The official committee page links the written-comment form and any schedule changes.</p><Src id="advisoryCommittee" label="Committee notice"/></div>
      </div>
      <div id="next" style={{scrollMarginTop:140}}><Fold title="Committee membership and upcoming decisions"><CommitteeDetail/><p style={{marginTop:20}}>The standard-zone pause runs through 90 days after the 2027 session adjourns. Other incentive programs and utility proceedings need separate decisions. For mailing-list updates, ODOE lists {COMMITTEE.email}. Hearing testimony does not replace government-to-government tribal consultation.</p></Fold></div>
    </Section>

    <Section id="record" kicker="Keep digging" title="The evidence is here when you need it." lead="Agency estimates, company positions and our judgments play different roles. A statement at a hearing is not independently verified just because it is in the record." tone="warm">
      <div className="dc-record-grid"><Fold title="Selected findings and unanswered questions"><RecordFindings/></Fold><div id="voices"><Fold title="Stakeholder positions and published responses"><WhoShowedUp/></Fold></div><div id="why"><Fold title="How the decision process shapes the debate"><StructuralFactors/></Fold></div><div id="library"><Fold title={`Document index · ${DCAC_DOC_COUNT} linked items`}><DocumentLibrary/></Fold></div></div>
    </Section>

    <Section id="sources" kicker="Sources & method" title="Know what is fact, estimate or assumption." lead="A document-based analysis by Portland Civic Lab. Evidence checked September 29, 2026; historical numbers keep their original dates.">
      <div className="dc-method-key">{[["Documented","A source reports a decision, number or term."],["Estimated","A study models an outcome from data."],["Assumed","An editable input fills a gap in a scenario."],["Our judgment","A proposed standard or interpretation."]].map(([t,d],i)=><div key={t}><span className="dc-tag">{String(i+1).padStart(2,"0")}</span><strong>{t}</strong><p>{d}</p></div>)}</div>
      <Fold title="What this revision checked—and what remains unresolved"><p>Selected primary records were reviewed for fiscal definitions, program coverage, employment estimates and current participation guidance. The document index is a reading aid, not a claim that every recording was transcribed or every statement corroborated.</p><p>Stakeholder positions come from published material. No new interviews or responses were obtained. Remaining work includes complete project assessment and payment schedules, reconciliation of the jobs estimates, and subsequent court and utility decisions. Calculator examples use disclosed assumptions, not audited actual returns.</p><p><Link href="/contact">Send a correction or documented response</Link> with the claim, source page and proposed correction.</p></Fold>
      <Fold title="Correction history · September 29, 2026"><ul><li>Separated economic-output ROI from limited fiscal ROI, corrected net versus gross interpretation and dated the historical cost-per-job comparison.</li><li>Corrected the investment denominator and removed an unsupported explanation of the jobs discrepancy.</li><li>Narrowed moratorium and utility claims to their actual coverage and added the separate Hillsboro land-use pause.</li><li>Replaced regional probabilities and categorical site verdicts with evidence questions and visibly assumed scenarios.</li><li>Rebuilt the calculator with separate fiscal views, longer horizons, public costs, uncertain construction, payment floors, stepped fees, example provenance and CSV exports.</li><li>Added school-funding exceptions, proposed enforcement terms, published positions and unresolved questions.</li><li>Updated the comment deadline and report expectation; removed unsupported claims of a complete review of recordings.</li></ul></Fold>
      <Fold title={`Primary records and reporting · ${SOURCE_IDS.length} sources`}><div className="dc-sources-grid">{SOURCE_IDS.map(id=>{const s=SOURCES[id];return <a key={id} href={s.url}>{s.title}<span>{s.org} · {s.kind}</span></a>})}</div></Fold>
    </Section>
  </div>;
}
