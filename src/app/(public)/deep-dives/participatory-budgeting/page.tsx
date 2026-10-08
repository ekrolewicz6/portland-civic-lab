import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, CircleHelp, Landmark, Users, ShieldCheck, BookOpen } from "lucide-react";
import { pageMeta } from "@/lib/page-meta";
import { PB_SOURCES as sources } from "@/lib/participatory-budgeting";
import BudgetIllustration from "@/components/deep-dives/participatory-budgeting/BudgetIllustration";
import CivicIllustration from "@/components/deep-dives/participatory-budgeting/CivicIllustration";
import s from "./participatory-budgeting.module.css";
import DeepDiveSchema from "@/components/deep-dives/DeepDiveSchema";

export const metadata = pageMeta({
  title: "Measure 26-267: a visual guide to Portland participatory budgeting",
  description: "What your vote changes, the strongest YES and NO arguments in the campaigns’ own words, and a visual guide to the money behind Measure 26-267.",
  path: "/deep-dives/participatory-budgeting", type: "article",
});

function Section({ id, number, title, lead, children, tone = "" }: { id: string; number: string; title: string; lead?: string; children: ReactNode; tone?: string }) {
  return <section id={id} className={`${s.section} ${tone}`}><div className={s.wrap}>
    <div className={s.sectionHead}><p className={s.eyebrow}>{number} / The decision</p><h2>{title}</h2>{lead&&<p className={s.lead}>{lead}</p>}</div>{children}
  </div></section>;
}
function Source({ href, children }: { href: string; children: ReactNode }) { return <a className={s.source} href={href}>{children}<ArrowUpRight size={15} aria-hidden="true"/></a>; }
function Alias({ id }: { id: string }) { return <span id={id} className={s.anchor} aria-hidden="true"/>; }
const journey = [
  {scene:"idea", title:"Neighbors propose", who:"Residents", text:"A neighbor suggests a safer crossing near a busy bus stop. Other residents bring different ideas."},
  {scene:"develop", title:"Make it workable", who:"Residents + city staff", text:"Staff and residents chosen to represent their neighbors check costs and whether the city can deliver it. Some ideas will change or stop here."},
  {scene:"vote", title:"Residents choose", who:"Residents", text:"Eligible projects go on a ballot. Residents’ choices decide which projects receive the available money."},
  {scene:"deliver", title:"The city follows through", who:"City + project partners", text:"A winning crossing still needs design, permits, and construction. Winning a vote does not finish the work."},
  {scene:"review", title:"Check the results", who:"Staff, committee + Auditor", text:"Staff and the committee review the program. The independently elected City Auditor also checks whether it works as intended."},
] as const;

export default function ParticipatoryBudgetingPage() {
  return <article className={s.page}><DeepDiveSchema slug="participatory-budgeting" />
    <header className={s.hero}><div className={s.wrap}>
      <Link href="/deep-dives" className={s.back}>← All deep dives</Link>
      <div className={s.heroGrid}>
        <div><p className={s.eyebrow}>Measure 26-267 · November 3, 2026</p>
          <h1>Should Portland guarantee residents a vote on part of its <em>budget?</em></h1>
          <p className={s.dek}>Measure 26-267 would let residents choose projects for part of Portland’s spending and require the city to fund the program each year. Supporters want lasting public decision-making power. Opponents worry about the permanent commitment and its effect on other services.</p>
          <div className={s.heroLinks}><a href="#the-cases">Hear both cases <ArrowDown size={18}/></a><a href="#follow-the-money-three-different-questions">Follow the money <ArrowRight size={18}/></a></div>
        </div>
        <figure className={s.heroArt}><CivicIllustration scene="neighborhood"/><figcaption>A neighborhood idea. A public decision.</figcaption><p>Participatory budgeting means residents help decide how a defined pot of public money is spent.</p></figure>
      </div>
      <div className={s.edition}><span>Visual guide · October 2, 2026</span><span>5–10 minute read · No endorsement</span><Link href={sources.research}>Full research & sources <ArrowUpRight size={16}/></Link></div>
    </div></header>

    <nav className={s.nav} aria-label="Article sections"><div className={s.wrap}>
      <a href="#what-a-yes-or-no-vote-would-do">Your vote</a><a href="#what-participatory-budgeting-actually-means">How it works</a><a href="#the-cases">Both cases</a><a href="#follow-the-money-three-different-questions">The money</a><a href="#read-the-actual-commitment-carefully">The rules</a><a href="#what-other-places-actually-tell-us">Real examples</a><a href="#sources-and-scope">Sources</a>
    </div></nav>

    <Section id="what-a-yes-or-no-vote-would-do" number="01" title="What would your vote change?">
      <div className={s.voteGrid}>
        <div className={`${s.voteCard} ${s.yesVote}`}><div className={s.voteTop}><span className={s.ballotMark}>YES</span><Users aria-hidden="true" size={33}/></div><h3>Create a protected role for residents.</h3><p>The city must set aside funding every year, and residents choose which eligible projects receive it. This requirement goes in the charter: Portland’s basic governing document, changed by voters.</p><a href="#the-strongest-case-for-voting-yes">Read the YES case <ArrowRight size={18}/></a></div>
        <div className={`${s.voteCard} ${s.noVote}`}><div className={s.voteTop}><span className={s.ballotMark}>NO</span><Landmark aria-hidden="true" size={33}/></div><h3>Keep the current budget process.</h3><p>The city continues making budget decisions through elected officials, with public hearings and testimony. A NO vote would allow a future participatory-budgeting program, but would not require one.</p><a href="#the-strongest-case-for-voting-no">Read the NO case <ArrowRight size={18}/></a></div>
      </div>
      <div className={s.annotation}><CircleHelp size={23} aria-hidden="true"/><p><strong>This measure creates no new tax.</strong> It changes how some existing public money is assigned. That still means choosing between competing uses.</p></div>
      <Source href={sources.ballot}>Official ballot filing</Source>
    </Section>

    <Section id="what-participatory-budgeting-actually-means" number="02" title="Follow a neighborhood idea." lead="Imagine residents propose a safer crossing. This is an illustration of the process, not a promised Portland project.">
      <ol className={s.journey}>{journey.map((step,index)=><li key={step.scene}>
        <div className={s.journeyArt}><CivicIllustration scene={step.scene}/><span>{String(index+1).padStart(2,"0")}</span></div>
        <p className={s.role}>{step.who}</p><h3>{step.title}</h3><p>{step.text}</p>
      </li>)}</ol>
      <div className={s.oversight}><ShieldCheck size={28} aria-hidden="true"/><div><h3>Who watches the process?</h3><p>Council sets up the program. An oversight committee includes residents from every Council district and helps guide it. The committee does not choose which projects get the money.</p></div></div>
      <Source href={sources.amendment}>Read the required steps</Source>
    </Section>

    <Section id="the-cases" number="03" title="Two serious cases. A real choice." lead="The quotations are the campaigns’ own words. The explanations summarize their arguments; they are not promises about what Portland will experience." tone={s.casesSection}>
      <div className={s.cases}>
        <section id="the-strongest-case-for-voting-yes" className={`${s.campaign} ${s.yesCase}`} aria-labelledby="yes-title">
          <Alias id="why-supporters-want-a-charter-guarantee"/>
          <div className={s.campaignHeading}><span className={s.caseLabel}>The case for YES</span><Users size={30} aria-hidden="true"/></div>
          <h3 id="yes-title">Give residents power that lasts.</h3><p className={s.campaignName}>Your 2 Cents Portland</p>
          <div className={s.argument}><span>01 / A decision, not just a hearing</span><blockquote>“Puts the power in residents’ hands”</blockquote><Source href={sources.yes}>Campaign website</Source><p>Supporters want residents to have a direct role in choosing public investments. Testimony can be ignored; a binding project vote must be honored. Residents would choose from projects reviewed for feasibility.</p></div>
          <div className={s.argument}><span>02 / More people can shape priorities</span><blockquote>“We believe all residents can and should have a greater direct voice and vote”</blockquote><Source href={sources.yesFaq}>Campaign FAQ · excerpt</Source><p>People who use a crossing, park, or service may spot needs City Hall misses. Opening participation to residents beyond registered voters could bring in young people and noncitizens. Supporters also see value in people learning, working together, and making decisions about their neighborhoods.</p></div>
          <div className={s.argument}><span>03 / A commitment people can count on</span><blockquote>“participatory budgeting (PB) redistributes power rather than prescribes outcomes.”</blockquote><Source href={sources.policy}>Campaign policy sheet · page 2</Source><p>Supporters point to earlier promises: Portland committed $1 million in 2020 for a process with unhoused residents. The campaign says it never launched. They argue that officials should not control whether residents get a share of decision-making power. A protected budget could make participation worth the effort, while operating rules improve with experience. <a href={sources.research+"#why-supporters-want-a-charter-guarantee"}>Read the history.</a></p></div>
          <p className={s.caseClosing}>The benefit supporters seek: a lasting way for more residents to turn local knowledge into public investment.</p>
          <a className={s.campaignLink} href={sources.yes}>Explore the YES campaign <ArrowUpRight size={19}/></a>
        </section>
        <section id="the-strongest-case-for-voting-no" className={`${s.campaign} ${s.noCase}`} aria-labelledby="no-title">
          <div className={s.campaignHeading}><span className={s.caseLabel}>The case for NO</span><Landmark size={30} aria-hidden="true"/></div>
          <h3 id="no-title">Test the approach before locking it in.</h3><p className={s.campaignName}>Protect Our City Services</p>
          <div className={s.argument}><span>01 / Keep room to fund other needs</span><blockquote>“You can believe in a bigger voice for Portlanders and vote NO on Measure 26-267.”</blockquote><Source href={sources.no}>Campaign website · excerpt</Source><p>Opponents worry that reserving money for this program leaves less for other needs, especially during a downturn. They want elected officials to stay accountable for balancing the whole budget, including emergency response, parks, and services people already rely on.</p></div>
          <div className={s.argument}><span>02 / Know the operating plan first</span><blockquote>“there’s nothing spelled out about how residency is verified, or whether there’s a minimum age to vote.”</blockquote><Source href={sources.noMeasure}>Campaign measure page · excerpt</Source><p>Opponents want clearer costs and voting rules before making a permanent commitment. They question who will participate and how projects will be delivered. Groups with more time and resources could have more influence, even when a program is open to everyone.</p></div>
          <div className={s.argument}><span>03 / Start with a pilot</span><blockquote>“through a pilot like the one City Club recommended.”</blockquote><Source href={sources.noFaq}>Campaign FAQ · excerpt</Source><p>A pilot is a smaller trial that can be evaluated before expansion. Opponents favor learning from one before setting permanent funding in the charter. That would preserve flexibility if costs rise, participation is uneven, or projects stall. A NO vote itself supplies neither a pilot nor its funding.</p></div>
          <p className={s.caseClosing}>The risk opponents want to avoid: a permanent budget obligation before Portland knows how this citywide program will work.</p>
          <a className={s.campaignLink} href={sources.no}>Explore the NO campaign <ArrowUpRight size={19}/></a>
        </section>
      </div>
      <div className={s.context}><Alias id="who-benefits-who-bears-the-risk"/><p className={s.eyebrow}>Context from the Lab</p><p>Residents could gain influence and useful projects while other services lose funding. The same person could experience both. Wider eligibility creates an opportunity for inclusion; outreach and voting rules will help determine who actually takes part.</p></div>
    </Section>

    <Section id="follow-the-money-three-different-questions" number="04" title="Follow the money." lead="Three different questions: how much must be set aside, where it comes from, and what it pays for.">
      <div className={s.formulaPanel}>
        <div><p className={s.eyebrow}>How the minimum is calculated</p><h3>2% of a specific budget category.</h3><p>The measure uses part of the previous year’s approved General Fund spending—the city’s main operating fund. It does not use the whole city budget.</p><p className={s.note}><strong>Legal formula:</strong> At least 2% of the previous fiscal year’s adopted General Fund discretionary ongoing expenses.</p><details className={s.fold}><summary>What those budget terms mean</summary><p>“Adopted” means approved in the budget. “Discretionary” refers to spending the city can choose, rather than money reserved for a required use. “Ongoing” means continuing expenses. It is not the same as all General Fund revenue or all city spending. A reconciled calculation from the adopted budget is still needed.</p><Source href={sources.amendment}>Official amendment</Source></details></div>
        <figure className={s.hundred}><div className={s.hundredGrid} aria-hidden="true">{Array.from({length:100},(_,i)=><span key={i} className={i<2?s.reserved:undefined}/>)}</div><figcaption><strong>$2 for every $100</strong><span>in the measure’s specified spending base.</span><span className={s.note}>Illustration of the 2% minimum. These squares do not represent the entire city budget.</span></figcaption></figure>
      </div>
      <div className={s.fundingFlow}><div><Landmark size={26} aria-hidden="true"/><h3>Council identifies the funds.</h3><p>Other city funds can help, but money reserved for a purpose must still pay for eligible work.</p></div><ArrowRight className={s.flowArrow} size={26} aria-hidden="true"/><div><Users size={26} aria-hidden="true"/><h3>The program pays for two things.</h3><p>Public projects and the work needed to run the process. Administration is included in program funding.</p></div></div>
      <BudgetIllustration/>
      <div className={s.tradeoff}><h3>What would the same dollars otherwise buy?</h3><p>That is the key budget question. Some winning projects may provide valuable services. Other planned work may lose funding. The measure does not name a list of cuts, and the full allocation is not all overhead. Projects can also need maintenance or ongoing staff after the first year.</p><Source href={sources.research+"#follow-the-money-three-different-questions"}>Read the funding analysis</Source></div>
    </Section>

    <Section id="read-the-actual-commitment-carefully" number="05" title="What is settled—and what isn’t?" tone={s.rulesSection}>
      <Alias id="checking-the-campaign-claims"/>
      <div className={s.rules}>
        <div><h3><Check size={24} aria-hidden="true"/> Required by the measure</h3><ul>
          <li>Residents choose among feasible projects through a binding vote.</li><li>Participation is open to all residents.</li><li>Funding is provided every year, with no end date in the amendment.</li><li>Staff review projects; the program is evaluated and independently audited.</li>
        </ul></div>
        <div><h3><CircleHelp size={24} aria-hidden="true"/> Still to be decided</h3><ul>
          <li>Detailed staffing costs and the funds used.</li><li>Age rules, residency checks, and protection against duplicate votes.</li><li>How districts share funding and how projects account for future costs.</li><li>Audit timing, delivery targets, and what happens when performance falls short.</li>
        </ul></div>
      </div>
      <p className={s.rulesNote}>The city can improve operating rules. Changing the charter’s funding requirement is a separate decision for voters. The amendment does not limit funding to one-time projects.</p>
      <Source href={sources.amendment}>Read the amendment</Source>
      <ol className={s.timeline} aria-label="Implementation milestones">
        <li><span>By budget year</span><strong>2027–28</strong><p>Program funding must begin.</p></li>
        <li><span>No later than</span><strong>July 2028</strong><p>The first resident process must begin.</p></li>
        <li><span>After selection</span><strong>Project delivery</strong><p>Timing depends on each project.</p></li>
      </ol>
      <details className={s.fold}><summary>Why some summaries give different dates</summary><p>The ballot summary says operational in July 2027. The amendment separates funding by 2027–28 from the first process beginning by July 2028. That is not a promise of voting in July 2027 or finished projects by July 2028. The text also leaves “bi-annual” undefined; the funding requirement is annual.</p><Source href={sources.ballot}>Compare the ballot summary</Source></details>
    </Section>

    <Section id="what-other-places-actually-tell-us" number="06" title="Real projects. Different experiences." lead="Other places show what residents can choose—and why program design and delivery matter. Their results do not predict Portland’s.">
      <div className={s.examples}>
        <article className={s.example}><div className={s.exampleArt}><CivicIllustration scene="metro"/></div><div className={s.exampleBody}><p className={s.eyebrow}>Metro · 2026</p><h3>Local experience already exists.</h3><p className={s.exampleStat}>23 <span>parks & nature projects</span></p><p>Residents helped choose $3 million in grants, including $166,400 for accessible river access at Milwaukie Bay Park.</p><p className={s.exampleLimit}><strong>What it tells us:</strong> Local participation can shape public investment. These awards use restricted parks-and-nature funding; they do not test Portland’s proposed citywide funding rule.</p><Source href={sources.metro}>Metro · awards announced</Source></div></article>
        <article className={s.example}><div className={s.exampleArt}><CivicIllustration scene="cambridge"/></div><div className={s.exampleBody}><p className={s.eyebrow}>Cambridge · 2026</p><h3>A program people return to.</h3><p className={s.exampleStat}>12th <span>cycle of resident choices</span></p><p>More than 10,000 residents voted. Winners included $100,000 for sidewalk repairs that protect trees.</p><p className={s.exampleLimit}><strong>What it tells us:</strong> A continuing program can attract participation. These are selections, not proof that every project is complete or that all residents are equally represented.</p><Source href={sources.cambridge}>Cambridge · selected projects</Source></div></article>
        <article className={s.example}><div className={s.exampleArt}><CivicIllustration scene="seattle"/></div><div className={s.exampleBody}><p className={s.eyebrow}>Seattle · 2023 vote</p><h3>The vote is only the beginning.</h3><p className={s.exampleStat}>2025–26 <span>implementation authorized</span></p><p>After the 2023 vote, the 2025–26 budget authorized projects including $2 million for mental-health crisis responders.</p><p className={s.exampleLimit}><strong>What it tells us:</strong> Delivery can take years. Regular city projects face delays too; voters need costs, responsibilities, and progress reports to judge results.</p><Source href={sources.seattle}>Seattle · December 2024 authorization</Source></div></article>
      </div>
      <p className={s.researchNote}>Research finds potential benefits for participation, but uneven evidence about wider trust and savings. Three researchers support this measure’s design; City Club recommends a pilot. Neither supplies a complete Portland implementation budget.</p>
      <div className={s.sources}><Source href={sources.letter}>Researchers’ letter</Source><Source href={sources.cityClub}>City Club report</Source><Source href={sources.research+"#what-other-places-actually-tell-us"}>More places & research</Source></div>
    </Section>

    <Section id="what-would-make-the-proposal-easier-to-judge" number="07" title="Four questions still worth asking.">
      <Alias id="a-fair-way-to-make-the-voting-decision"/>
      <ol className={s.questions}>
        <li><span>01</span><div><h3>Where would the money come from?</h3><p>Ask which funds would cover the program and what they would otherwise pay for.</p></div></li>
        <li><span>02</span><div><h3>What would running it cost?</h3><p>Ask for a staffing and outreach budget that shows how much would reach projects.</p></div></li>
        <li><span>03</span><div><h3>Who would actually take part?</h3><p>Ask how people with less time, different languages, or limited internet access could participate.</p></div></li>
        <li><span>04</span><div><h3>Who would make it happen?</h3><p>If it passes, ask who delivers and evaluates projects. If it loses, ask who would fund a pilot and when.</p></div></li>
      </ol>
    </Section>

    <section id="sources-and-scope" className={s.sourceShelf}><div className={s.wrap}>
      <Alias id="read-the-supplied-campaign-materials"/>
      <div className={s.shelfHeading}><BookOpen size={29} aria-hidden="true"/><div><p className={s.eyebrow}>Keep exploring</p><h2>Read the words. Check the evidence.</h2></div></div>
      <div className={s.shelfGrid}>
        <div><h3>The decision</h3><a href={sources.amendment}>Official amendment <ArrowUpRight size={17}/></a><a href={sources.ballot}>Official ballot filing <ArrowUpRight size={17}/></a><Link href="/voters-guide">2026 voters’ guide <ArrowRight size={17}/></Link></div>
        <div><h3>The campaigns</h3><a href={sources.yes}>Your 2 Cents · YES <ArrowUpRight size={17}/></a><a href={sources.no}>Protect Our City Services · NO <ArrowUpRight size={17}/></a><details className={s.fold}><summary>Supplied campaign materials</summary><a href={sources.letter}>Researchers’ letter · PDF</a><a href={sources.policy}>Policy fact sheet · PDF</a><a href={sources.threePager}>Campaign three-pager · PDF</a><a href={sources.suppliedAmendment}>Campaign copy of amendment · PDF</a><a href={sources.timeline}>Advocacy timeline · PDF</a><a href={sources.presentation}>Campaign presentation · 59 slides</a></details></div>
        <div><h3>The full research</h3><Link href={sources.research}>Read the research edition <ArrowRight size={17}/></Link><p>Detailed claim checks, local history, international comparisons, and the limits of the evidence.</p></div>
      </div>
      <p className={s.method}>Portland Civic Lab · Independent analysis, no endorsement. This guide draws on the September 17–20 research review, with the measure and campaign excerpts checked for this rewrite. Older estimates and events retain their dates. Campaign claims are attributed; illustrations do not promise particular projects.</p>
    </div></section>
  </article>;
}
