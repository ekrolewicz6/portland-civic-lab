import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Ban, Building2, Droplets, HardHat, Landmark, PlugZap, Waves, Sun, BookOpen, PencilLine, Send } from "lucide-react";
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
  title: "Oregon’s Data Centers: Are the Tax Breaks Worth It?",
  description: "Understand Oregon’s data-center tax breaks, their effects on jobs and schools, and their power and water needs. Try examples based on real agreements.",
  path: "/deep-dives/data-centers", type: "article",
});
const NAV = [["fight","What changed"],["case-for","The tradeoff"],["jobs","How many jobs?"],["price","Try the examples"],["evidence","Read the numbers"],["test","A better deal"],["committee","Take part"],["record","The record"],["sources","Sources"]];
const SOURCE_IDS: (keyof typeof SOURCES)[] = ["advisoryCommittee","preliminary","businessOregonRoi","impactStudy","econw","econwFull","employmentDefinitions","pucImplementation","pgeRates","odeSchoolFunding","morrowAssessor","wascoAgreement","morrowMinutes","capitalChronicleLawsuit","hillsboroResponse","hillsboroMoratorium","taxFairness","awsWater","uecPresentation","tribalStatement","deqAir","audit2016"];
function Src({ id, label, page }: { id: keyof typeof SOURCES; label?: string; page?: number }) {
  return <a className="dc-source" href={SOURCES[id].url + (page ? `#page=${page}` : "")}>{label ?? SOURCES[id].org} ↗</a>;
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
      <h1>Oregon’s data centers.{" "}<em>Are the tax breaks worth it?</em></h1>
      <p className="dc-hero-deck">Data centers are buildings full of computers that store information and run online services. They bring jobs and tax payments, but they also need electricity and water. Oregon offers some of these projects tax breaks. To judge whether a break is worth its cost, we need to ask: <strong>would the company build here without it?</strong></p>
      <div className="dc-actions"><a href="#price">Try a real-world example <ArrowRight size={17}/></a><a href="#case-for">Understand the tradeoff</a></div>
      <p className="dc-hero-meta">Portland Civic Lab · Policy analysis<br /><time dateTime="2026-09-29">Updated {REVIEWED}</time></p>
    </div><BargainDiagram /></div></header>

    <nav className="dc-nav" aria-label="Article sections"><div className="dc-wrap">{NAV.map(([id,label])=><a key={id} href={"#"+id}>{label}</a>)}</div></nav>

    <Section id="fight" kicker="First, the ground rules" title="Tax breaks, electricity and building permits have different rules." lead="A company needs more than a tax agreement to build a data center. It also needs permission to use the site and a way to get electricity. Separate public decisions govern each step.">
      <div className="dc-policy-grid">
        <article className="dc-policy"><Ban size={29}/><span className="dc-tag amber">One tax-break program is paused</span><h3>Tax breaks</h3><p>On June 5, Oregon paused new data-center approvals under its standard enterprise-zone program, which temporarily reduces property taxes. Two other tax-break programs remain available: long-term rural enterprise zones and the Strategic Investment Program.</p><Src id="businessOregonRoi" label="Business Oregon · program comparison"/></article>
        <article className="dc-policy"><PlugZap size={29}/><span className="dc-tag">PGE rates changed July 8</span><h3>Electricity bills</h3><p>Portland General Electric (PGE) now charges data centers under a separate set of electricity rates. Other power companies have their own rules, so customers elsewhere may have different protections against paying for data-center costs.</p><Src id="pgeRates" label="PGE · July 8 rate changes"/></article>
        <article className="dc-policy"><Building2 size={29}/><span className="dc-tag amber">Hillsboro paused new applications</span><h3>Where to build</h3><p>On July 27, Hillsboro paused new applications for sites whose main use would be a data center or battery storage. Applications submitted before the pause may still move forward.</p><Src id="hillsboroMoratorium" label="Hillsboro · 120-day pause"/></article>
      </div>
      <Fold title="Details: who is covered, the lawsuit and what comes next">
        <p>House Bill 4084 pauses new data-center approvals under the standard enterprise-zone program until 90 days after lawmakers finish their 2027 session. Projects approved earlier fall into a separate category. Business Oregon, the state’s economic development agency, still lists data centers as eligible for the long-term rural program and the Strategic Investment Program, often called SIP.</p>
        <p>The POWER Act sets requirements for electricity companies owned by investors. The Oregon Public Utility Commission, the state regulator, oversees their rates and service rules. PacifiCorp and Idaho Power have separate proceedings to put the law into practice. Utilities owned by customers or local governments follow different rules. A June schedule expected a PacifiCorp decision in October and a filing showing compliance in November. Those were planned dates; check the regulator’s case record for later decisions. <Src id="pucImplementation"/></p>
        <p>A lawsuit filed in June challenges tax-break approvals made in Hillsboro and Washington County before the pause. The people and groups suing say officials did not follow the required approval process. Hillsboro says its staff followed existing program rules. We have not verified a later court ruling that settles the dispute. <Src id="capitalChronicleLawsuit" label="Reporting on the complaint"/> <Src id="hillsboroResponse" label="The city’s explanation"/></p>
      </Fold>
    </Section>

    <Section id="case-for" kicker="The central tradeoff" title="Would the company build here without the tax break?" lead="A tax break can bring in public money if it attracts a project that would otherwise go elsewhere. If the company would build here anyway, the same break lets it pay less for an investment Oregon would already receive." tone="warm">
      <div className="dc-fork">
        <article className="dc-fork-path"><span className="dc-tag">If the tax break brings the project here</span><h3>The deal brings something new.</h3><div className="dc-fork-flow"><span>Tax break</span><ArrowRight size={18}/><span>Project arrives</span><ArrowRight size={18}/><span>Taxes and fees</span></div><p>The taxes and fees could leave the community better off than an empty site would. Those payments still need to cover the added cost of public services.</p></article>
        <div className="dc-fork-middle">or</div>
        <article className="dc-fork-path"><span className="dc-tag amber">If the project would arrive anyway</span><h3>The public gives up revenue.</h3><div className="dc-fork-flow"><span>Project arrives</span><ArrowRight size={18}/><span>Break still granted</span><ArrowRight size={18}/><span>Less paid</span></div><p>The company could have made the same investment and paid the full property tax bill. Officials need to explain what the public gains by reducing that bill.</p></article>
      </div>
      <p className="dc-takeaway">The size of a proposed project cannot tell us whether a tax break is necessary. We need evidence about the company’s other possible locations, their costs, and why it would choose one over another.</p>
      <div className="dc-two" style={{marginTop:36}}>
        <article className="dc-panel"><span className="dc-kicker">Why communities say yes</span><h3>Even a reduced tax bill can matter.</h3><CountyTaxVisual />
          <div className="dc-benefit-row"><HardHat size={25}/><div><strong>Construction and local businesses can benefit too</strong><p>A September study estimates that Oregon’s recent data-center building activity supported about 3,500 construction jobs per year. That work ends at each project, but workers may move to the next one. Suppliers and service businesses benefit too. <a className="dc-inline-link" href="#jobs">See the job counts and what they include.</a></p></div></div>
          <div className="dc-benefit-row"><Landmark size={25}/><div><strong>Local officials can negotiate payments</strong><p>The Dalles negotiated payments based on a share of what the company would owe without a tax break. Its agreement also sets a minimum annual payment. You can try those rules in the calculator below.</p></div></div>
          <Fold title="What would make the case stronger?"><p>The case is stronger when a company identifies realistic competing sites and shows how the tax break affects its choice. Officials also need checked estimates of the money local governments would receive and spend. An empty site today could still attract another use later.</p><p>The $22.96 million goes to several local governments and public districts, rather than all going to the county government. Job estimates should explain how long the work lasts, who gets hired, what workers earn, and whether that work depends on the tax break. <Src id="econw"/></p></Fold>
        </article>
        <article id="case-against" className="dc-panel" style={{scrollMarginTop:140}}><span className="dc-kicker">Why others ask for restraint</span><h3>A local gain can shift costs elsewhere.</h3>
          <p>Oregon uses both local taxes and state money to fund schools. Its funding formula is a set of rules that divides this money among districts, taking student numbers and needs into account. When a tax break reduces a district’s local revenue, the state generally provides more of its funding. If the state’s school budget stays the same, that leaves less money to share across Oregon’s schools.</p>
          <div className="dc-school-flow" role="img" aria-label="When a district loses local school revenue, the state generally supplies more of its funding. If the state budget stays fixed, there is less money to share among schools statewide.">
            <div><strong>↓</strong>Less local school revenue</div><ArrowRight/><div><strong>↑</strong>More funding from the state</div><ArrowRight/><div><strong>↓</strong>Less to share statewide</div>
          </div>
          <p className="dc-fine">This is the usual pattern when the state does not add money to its school budget. Some districts and taxes follow different rules.</p>
          <Src id="odeSchoolFunding" label="Oregon Department of Education · school funding"/>
          <Fold title="When the school-funding rules work differently"><p>Payments that companies make to schools under enterprise-zone agreements count as local revenue in the state’s calculation. They can therefore reduce the amount the state provides.</p><p>Some districts already collect more locally than the formula would give them. The state does not replace their lost revenue unless the loss brings them below that amount.</p><p>Other rules apply to taxes that repay money borrowed for school construction and to some extra taxes approved by local voters, called local-option taxes. To understand a particular deal, identify which school taxes it reduces and which rules apply to them.</p></Fold>
          <h3 style={{marginTop:26}}>Water needs a local answer.</h3>
          <div className="dc-water-row"><div><Droplets size={23}/><strong>How much is taken?</strong><p>Identify where the water comes from and how much the facility takes.</p></div><div><Waves size={23}/><strong>What comes back?</strong><p>Measure how much water is used up, how much is returned, and whether its quality changes.</p></div><div><Sun size={23}/><strong>When is it needed?</strong><p>Check the highest summer use and how it would be limited during a drought.</p></div></div>
          <Fold title="What the financial comparison leaves out"><p>A facility may use a small share of a city’s water over a year but still put pressure on supplies during a dry summer. Officials also need to examine electricity supply, pollution from backup generators, noise, and the combined water use of facilities drawing from the same area. The state’s advisory committee is still examining these questions. <Src id="preliminary"/></p><p>A deal is easier to justify when officials can show that the tax break is needed, payments cover public costs, and water and pollution limits can be enforced. Even a large tax break does not tell us how much revenue Oregon could have collected without it: the company might have built elsewhere.</p><SubsidyPerJob/></Fold>
        </article>
      </div>
    </Section>

    <Section id="jobs" kicker="Jobs / Oregon statewide" title="How much work lasts after construction?" lead="A September 2026 study separates the people running Oregon’s data centers from the work of building them. The two estimates cover different years and types of work." tone="warm">
      <div className="dc-two dc-jobs-grid">
        <article className="dc-panel dc-job-card dc-job-construction">
          <div className="dc-job-heading"><HardHat size={27} aria-hidden="true"/><span className="dc-tag amber">Temporary at each project</span></div>
          <h3>Building the facilities</h3>
          <strong className="dc-job-count">3,492</strong>
          <p className="dc-job-unit">estimated construction jobs per year<br/><span>Average during 2023–2025</span></p>
          <p>This estimate includes employees and self-employed business owners. It covers work on buildings and systems such as power and cooling. It excludes installing servers and other computing equipment.</p>
          <div className="dc-job-duration"><span aria-hidden="true" className="dc-job-track dc-job-track-finite"/><p>Work ends when a project finishes. New projects and upgrades can keep crews employed.</p></div>
          <Src id="econwFull" page={93} label="September study · construction, pp. 89–93"/>
        </article>
        <article className="dc-panel dc-job-card dc-job-operations">
          <div className="dc-job-heading"><Building2 size={27} aria-hidden="true"/><span className="dc-tag">Ongoing operations</span></div>
          <h3>Running the facilities</h3>
          <strong className="dc-job-count">2,629</strong>
          <p className="dc-job-unit">estimated employees running data centers<br/><span>Annual average in 2024</span></p>
          <p>This estimate covers employees of companies that own, run or rent space in a data center. It excludes staff supplied by other companies, such as contract security and cleaning workers.</p>
          <div className="dc-job-duration"><span aria-hidden="true" className="dc-job-track dc-job-track-continuing"/><p>These roles continue while facilities operate, though staffing can change over time.</p></div>
          <Src id="econwFull" page={80} label="September study · operations, pp. 73–82"/>
        </article>
      </div>
      <div className="dc-jobs-note"><h3>Are these all full-time jobs?</h3><p>We do not have that breakdown. These counts can include full- and part-time work. “Full-time” describes weekly hours; “temporary” describes how long a job lasts. A construction worker can work full-time on a temporary project. <Src id="employmentDefinitions" label="How government job counts work"/></p></div>
      <p className="dc-small dc-muted" style={{marginTop:20}}>These are estimates of work supported by the industry, not counts of new hires or proof that tax breaks created those jobs. The study was prepared by ECONorthwest and the University of Virginia, with funding from the Lemelson Foundation.</p>
      <Fold title="How reliable are the counts, and who is left out?">
        <p>The operations estimate uses employer records checked against known data-center locations. It is an average across 2024, not a count taken today. The construction estimate uses a model based on the 2023–2025 building activity. The researchers did not have the projects’ construction payrolls, so that figure is less direct. Neither estimate tells us how many workers live in the host community. <Src id="econwFull" page={76} label="Methods · pp. 76–82 and 89–93"/></p>
        <p>The same study estimates another 7,780 jobs supported by suppliers and worker spending connected to operations, and another 4,844 connected to construction. These include work at other businesses, not just at data centers. They should not be described as permanent on-site jobs. <Src id="econwFull" page={86} label="Tables 6.1 and 6.6 · pp. 86 and 93"/></p>
      </Fold>
    </Section>

    <Section id="price" kicker="Try it yourself" title="Does the tax break pay off?" lead="Choose an example based on a real agreement or program, then change its assumptions. The calculator compares the money governments might receive with a tax break and without one.">
      <DealCalculator />
      <Fold title="Why these examples—and why no Morrow County forecast?"><p>The Dalles examples use the signed 2021 agreement with Design LLC, a Google company. Its Project 1 illustration assumes $600 million of taxable property at a 1.10% tax rate. That would produce a $6.6 million annual bill without the break. A 50% payment would be $3.3 million. Project 2 uses a 60% share, and both projects have a $3 million minimum annual payment. Taxes and community-service fees already included in those payments are counted once. The calculator does not include scheduled payment increases or changes in the property’s tax value. <Src id="wascoAgreement" label="Signed agreement · definitions and Exhibit A"/></p><p>The Hillsboro example shows how the city’s program rules could work, using the highest allowed city fees and school payments. The payment share rises after year 3. This is not a forecast for a particular project or a claim that a new project qualifies today.</p><p>Morrow County’s 2023 approval record describes a 15-year tax break under the Strategic Investment Program. The deal initially leaves $100 million of property value subject to tax and includes a community-service fee of up to $2.5 million, plus other obligations. A single annual payment would not capture those rules. We need the full payment and property-value schedules before making a project forecast. <Src id="morrowMinutes" label="Approval minutes · page 6"/></p></Fold>
      <Fold title="What to ask about a site near you"><SitingMap /></Fold>
    </Section>

    <Section id="evidence" kicker="Read the numbers carefully" title="Business activity and tax revenue measure different things." lead="A project may create sales, wages and construction work while bringing in less tax revenue than the tax break costs. A study of those benefits also needs to ask how much would have happened without the break." tone="dark">
      <ReturnsVisual />
      <p className="dc-fine" style={{color:"#d0ddd4",marginTop:18}}>These historical figures cover whole tax-break programs, including businesses other than data centers. <Src id="impactStudy" label="February 2022 study · figures 17 and 20"/></p>
      <Fold title="How the study calculated these comparisons"><p>The study calls these figures “modified return on investment,” or ROI. It compares an estimated benefit with the cost of tax breaks after subtracting required fees, application fees and included taxes on property outside the exemption. It divides the benefit by that adjusted cost, then subtracts one. A result of zero means the two amounts are equal; a positive result means the measured benefit is larger.</p><p>One comparison measures the value of goods and services produced. The other counts only state income taxes from employees. Neither is a full account of public benefits and costs: several business taxes and environmental costs are left out.</p><p>For the rural program, the study’s income-tax calculation is $81.46 million ÷ ($534.95 million − $34.20 million) − 1, or about −0.84. That means about 16 cents in employee income tax for each dollar of adjusted tax-break cost. The standard program’s +1.35 result means $2.35 in employee income tax for each dollar of adjusted cost. These estimates do not tell us how much investment the tax break caused. Business Oregon repeated the business-activity figures in June 2026; the income-tax figures come from the original study.</p></Fold>
      <div className="dc-measure-grid">
        <article className="dc-panel"><span className="dc-kicker">Investment / Which program?</span><h3>Data centers dominate the rural program.</h3><div className="dc-investment-bar" role="img" aria-label="Data centers represent 15.4 billion dollars of 15.8 billion dollars within the long-term rural program, about 97.5 percent."><span/><span/></div><div className="dc-chart-legend"><span><i className="dc-dot dc-green"/> Data centers · $15.4B</span><span><i className="dc-dot" style={{background:"#d8b282"}}/> Other · $0.4B</span></div><p>Of the $15.8 billion invested through the <strong>long-term rural enterprise-zone program</strong>, $15.4 billion went to data centers. Other programs also support data centers, so this is only part of Oregon’s total.</p><Src id="businessOregonRoi" label="Business Oregon · slide 4"/><Fold title="The other programs"><p>The same table lists another $3.1 billion in data-center investment under standard enterprise zones and $11.2 billion under the Strategic Investment Program. The $15.8 billion total shown above belongs only to the rural program.</p></Fold></article>
        <article className="dc-panel"><span className="dc-kicker">Jobs / Comparing sources</span><h3>Why does another report say 7,600 jobs?</h3><p>Business Oregon reports 7,600 “direct” jobs for 2025. The September study counts 2,629 employees linked to operating facilities in 2024. We have not established exactly which workers explain the difference.</p><p>The larger figure cannot simply be labeled permanent jobs, and the gap cannot be assumed to represent construction workers. Check the year, employers and types of work each source includes.</p><Src id="businessOregonRoi" label="Business Oregon · slide 2"/>{" "}<Src id="econwFull" page={74} label="September study · definitions, pp. 74–82"/></article>
      </div>
      <div style={{marginTop:28}}><RateShift /></div>
      <p className="dc-small" style={{color:"#d0ddd4",marginTop:18}}>PGE’s new rates shift more electricity costs to data centers. The result does not tell us how other utilities divide their costs or whether the higher rates will affect future projects.</p>
    </Section>

    <Section id="test" kicker="Our proposed standard" title="A better deal has to pass six tests." lead="The records we reviewed show some protections for the first two tests, but they do not establish that any test is met across Oregon. Each proposed project needs to show how it would meet these standards." tone="warm">
      <ConditionsScorecard />
      <p className="dc-fine" style={{marginTop:24}}>These are standards we propose for future decisions. They are not all required by current law, and an individual project may already meet some of them. A project must still follow water laws and approval rules even if it brings in more tax revenue.</p>
    </Section>

    <Section id="committee" kicker="Have a say" title="Tell the committee what you want it to examine." lead="Oregon’s Data Center Advisory Committee advises the governor on data-center policy. Its September report sets out early findings and questions for the public, with final recommendations expected before the end of 2026.">
      <div className="dc-action-banner"><div className="dc-date-block"><span>October</span><strong>24</strong><span>5 p.m. / 2026</span></div><div><h3>Written comments are open.</h3><p>If your concern involves a particular site, power company or tax agreement, name it and link any evidence you have. Explain what you want the committee to recommend or what question it should investigate.</p><a href={SOURCES.advisoryCommittee.url}>Open the official comment instructions <ArrowRight size={18}/></a></div></div>
      <div className="dc-three" style={{marginTop:28}}>
        <div className="dc-panel"><BookOpen size={24}/><h3>Read the questions</h3><p>The September report explains what the committee has learned and what it still wants to know.</p><Src id="preliminary" label="September preliminary findings"/></div>
        <div className="dc-panel"><PencilLine size={24}/><h3>Make one point well</h3><p>Explain what you observed and how you made any estimates. Include a source and say what action you would like officials to take.</p></div>
        <div className="dc-panel"><Send size={24}/><h3>Use the current form</h3><p>The official committee page links the written-comment form and any schedule changes.</p><Src id="advisoryCommittee" label="Committee notice"/></div>
      </div>
      <div id="next" style={{scrollMarginTop:140}}><Fold title="Committee membership and upcoming decisions"><CommitteeDetail/><p style={{marginTop:20}}>The pause on new standard enterprise-zone approvals lasts until 90 days after the 2027 legislative session ends. Changes to other tax-break programs and utility rules require separate decisions. For mailing-list updates, the Oregon Department of Energy lists {COMMITTEE.email}. Hearing from a tribal representative at a public meeting does not replace formal consultation between the state and a tribal government.</p></Fold></div>
    </Section>

    <Section id="record" kicker="Keep digging" title="The evidence is here when you need it." lead="The material below includes government estimates, company statements and our own analysis. We identify who made each claim so you can judge its support. Inclusion in a public hearing does not mean a claim has been independently checked." tone="warm">
      <div className="dc-record-grid"><Fold title="Selected findings and unanswered questions"><RecordFindings/></Fold><div id="voices"><Fold title="What companies, governments and other groups say"><WhoShowedUp/></Fold></div><div id="why"><Fold title="How the decision process shapes the debate"><StructuralFactors/></Fold></div><div id="library"><Fold title={`Document index · ${DCAC_DOC_COUNT} linked items`}><DocumentLibrary/></Fold></div></div>
    </Section>

    <Section id="sources" kicker="Sources & method" title="Know what is fact, estimate or assumption." lead="Portland Civic Lab prepared this analysis from published records. We checked the evidence on September 29, 2026. Older figures are labeled with the dates they describe.">
      <div className="dc-method-key">{[["Documented","A source reports a decision, number or term."],["Estimated","A study uses data and calculations to estimate a result."],["Assumed","We choose a value where information is missing. You can change it in the calculator."],["Our judgment","We explain what we think the evidence means or what officials should require."]].map(([t,d],i)=><div key={t}><span className="dc-tag">{String(i+1).padStart(2,"0")}</span><strong>{t}</strong><p>{d}</p></div>)}</div>
      <Fold title="What we checked and what we still do not know"><p>We checked selected original records to understand how the tax programs work, what the financial and job figures count, and how the public can comment. The document index helps readers find more material. We have not transcribed every recording or independently checked every statement.</p><p>The views we describe come from published material; we did not conduct new interviews. We still need complete schedules of project property values and payments, a breakdown of full- and part-time jobs, an explanation of the differing job estimates, and updates on court and utility decisions. The calculator combines documented rules with labeled assumptions. Its results are examples, not verified amounts that governments have collected.</p><p><Link href="/contact">Send a correction or documented response</Link> with the claim, source page and proposed correction.</p></Fold>
      <Fold title="Correction history · September 29, 2026"><ul><li>Added a jobs section using the September full study: 3,492 modeled construction jobs per year during 2023–2025 and 2,629 employees in ongoing operations in 2024. Separated job duration from full-time hours and identified contractors, business owners and other jobs counted separately.</li><li>Rewrote explanations throughout the article, charts and calculator in plain language, including school-funding rules and temporary work. The calculator’s assumptions and formulas are unchanged.</li><li>Distinguished business activity from employee income-tax revenue, explained the return calculations, and added dates to the older tax-break-per-job comparison.</li><li>Clarified which program the investment total describes and removed an unsupported explanation of the difference between job estimates.</li><li>Clarified which tax approvals and utilities the new rules cover, and added Hillsboro’s separate pause on development applications.</li><li>Removed unsupported estimates of whether projects would be built in each region. Added questions to investigate and clearly labeled calculator assumptions.</li><li>Rebuilt the calculator to compare local and state revenue over different periods. Added public costs, uncertain chances of building, minimum payments, fees that change over time, source notes and downloadable results.</li><li>Explained exceptions to school-funding rules, suggested ways to enforce agreements, and added published views and unanswered questions.</li><li>Updated the comment deadline and expected report date. Clarified that the review did not cover every recording.</li></ul></Fold>
      <Fold title={`Original records and reporting · ${SOURCE_IDS.length} sources`}><div className="dc-sources-grid">{SOURCE_IDS.map(id=>{const s=SOURCES[id];return <a key={id} href={s.url}>{s.title}<span>{s.org} · {s.kind === "primary" ? "Original record or statement" : s.kind === "news" ? "News reporting" : "Analysis"}</span></a>})}</div></Fold>
    </Section>
  </div>;
}
