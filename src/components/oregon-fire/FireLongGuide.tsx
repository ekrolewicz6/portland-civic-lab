import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { FIRE_AUTHORS } from "@/lib/oregon-fire/metadata";
import { FIRE_GUIDE_ORDER, FIRE_LESSONS, LESSON_SOURCES } from "@/lib/oregon-fire/lesson";
import FireMechanicsVisual from "./FireMechanicsVisual";
import FireChoicesVisual from "./FireChoicesVisual";
import FireSpendingEvidence from "./FireSpendingEvidence";
import FireMaintenanceEvidence from "./FireMaintenanceEvidence";
import FireVideoFeature from "./FireVideoFeature";
import WhetstonePermitCase from "./WhetstonePermitCase";
import { LandscapeOverview, HistoryVisual, WorkVisual, TreatmentEvidence, AftermathVisual, CommunityVisual } from "./FireGuideVisuals";

const orderedLessons = FIRE_GUIDE_ORDER.map(slug => FIRE_LESSONS.find(lesson => lesson.slug === slug)!);
const visuals = [<FireMechanicsVisual key="mechanics" />, <LandscapeOverview key="landscapes" />, <HistoryVisual key="history" />, <div key="work" className="fire-choices-and-work"><FireChoicesVisual /><WorkVisual /></div>, <FireSpendingEvidence key="spending" />, <TreatmentEvidence key="evidence" />, <AftermathVisual key="after" />, <CommunityVisual key="community" />];
const shortLabels = ["How fire moves", "Different places", "What changed", "The choices", "The money", "What helped", "After the fire", "What comes next"];
const chapterQuestions = [
  "What can one fire change?", "Why does the right response depend on the place?", "How did today's conditions develop?", "Why this location, and which work belongs here?", "What does the money actually pay for?", "How could we tell whether earlier work helped?", "What happened after the flames?", "Who can make the next decision?",
];
const readerQuestions = [
  { text: "Why can fire help one place and harm another?", anchor: "how-fire-moves" },
  { text: "Why isn't there one answer for all of Oregon?", anchor: "understand" },
  { text: "Why burn, thin, or protect buildings?", anchor: "burn-windows" },
  { text: "Why choose this location?", anchor: "burn-windows" },
  { text: "Why doesn't an approved burn always happen?", anchor: "whetstone-permit" },
  { text: "What does the money buy?", anchor: "costs-and-choices" },
  { text: "Who pays when work needs to be repeated?", anchor: "costs-and-choices" },
  { text: "Why can't wood sales pay for everything?", anchor: "costs-and-choices" },
  { text: "How can we know an investment helped?", anchor: "fire-stories" },
  { text: "What can my community change?", anchor: "what-success-means" },
];
const chapterLeads = [
  "Start with fuel, weather and the paths flames and embers can take.",
  "A prairie, dry pine forest and wet forest do not ask the same thing of fire.",
  "People, land use, climate and past fires shaped the conditions we see.",
  "Choose a goal for a place, then follow the work from plan to outcome.",
  "A real public spending report shows why there is no single price for a burned acre.",
  "Researchers compare what happened after wildfire reached earlier work.",
  "The outline of a fire is only the beginning. Its effects vary across space and time.",
  "The decisions extend from the landscape to homes and the community around them.",
];

export default function FireLongGuide() {
  return <>
    <header className="fire-long-hero">
      <div className="fire-long-hero-top"><span className="fire-eyebrow">An Oregon field guide · Fire, land & choices</span><a href="#explore">Explore the atlas <ArrowUpRight size={15} /></a></div>
      <div className="fire-long-hero-stage">
        <div className="fire-long-hero-copy">
          <h1>Fire in<br />Oregon<span className="fire-hero-period">.</span></h1>
          <p className="fire-long-question">Fire is part of Oregon. The choices we make decide what happens next.</p>
          <p className="fire-long-intro">Follow a fire across different landscapes. See why people burn some places on purpose, why other work stalls, what it costs, and how we can tell whether it helped.</p>
          <a className="fire-long-start" href="#how-fire-moves">Begin the story <ArrowDown size={18} /></a>
        </div>
        <figure className="fire-hero-evidence">
          <div className="fire-hero-image-pair">
            <div><Image src="/images/oregon-fire/oregon-2020-07-19.webp" alt="Western Oregon before the September 2020 fires, photographed from space on July 19" fill priority sizes="(max-width: 800px) 45vw, 24vw" /><span>Before <b>July 19</b></span></div>
            <div><Image src="/images/oregon-fire/oregon-2020-09-27.webp" alt="The same area after the September 2020 fires, photographed from space on September 27" fill priority sizes="(max-width: 800px) 45vw, 24vw" /><span>After <b>Sept 27</b></span></div>
          </div>
          <figcaption><span>01 / Same place, different day</span> Western Oregon in 2020. NASA Terra MODIS false-color images. The dark patches in the later view reveal the scale of the fires; the map below can show their boundaries and effects. <a href={LESSON_SOURCES.nasa.url}>Image source ↗</a></figcaption>
        </figure>
      </div>
      <div className="fire-long-byline">By {FIRE_AUTHORS.join(" & ")}<span>Read straight through. Follow the details when you want more.</span></div>
    </header>
    <nav className="fire-long-nav" aria-label="Chapters in the fire guide">{orderedLessons.map((c,i)=><a key={c.slug} href={`#${c.anchor}`}><span>{String(i+1).padStart(2,"0")}</span>{shortLabels[i]}</a>)}</nav>
    <div className="fire-long-body">
      <nav className="fire-reader-questions" aria-label="Questions answered in the guide"><div><span className="fire-eyebrow">Start with a question</span><h2>What have you always wondered about fire?</h2></div><div className="fire-reader-questions-grid">{readerQuestions.map((item, i)=><a key={item.text} href={`#${item.anchor}`}><span>{String(i+1).padStart(2,"0")}</span>{item.text}<ArrowRight size={15} aria-hidden="true" /></a>)}</div></nav>
      {orderedLessons.map((chapter,i)=><section key={chapter.slug} id={chapter.anchor} className={`fire-long-chapter fire-long-chapter-${i+1}`} aria-labelledby={`chapter-title-${i+1}`}>
        <div className="fire-long-chapter-head"><span className="fire-chapter-number" aria-hidden="true">{String(i+1).padStart(2,"0")}</span><div><span className="fire-eyebrow">{chapter.label}</span><h2 id={`chapter-title-${i+1}`}>{chapter.title}</h2></div></div>
        <p className="fire-long-focus">{chapterQuestions[i]}</p><p className="fire-long-lead">{chapterLeads[i]}</p>
        <div className="fire-long-visual">{visuals[i]}</div>
        <div className="fire-long-copy">{chapter.paragraphs.map(p=><p key={p}>{p}</p>)}</div>
        {i===1 && <FireVideoFeature id="O6Vayv9FCLM" kicker="The big picture / 2017 talk" title="Why wildfires have gotten worse—and what we can do about it" publisher="Paul Hessburg · TEDxBend · 2017" context="A visual introduction to the patchwork of forests and past fires across western landscapes. The talk helps frame the question; the Oregon examples and current evidence on this page supply the local detail." watchFor={["How neighboring patches can carry different fire histories.","Why thinning, planned fire, earlier wildfire and weather all matter.","Where a landscape argument still needs a local objective and measured result."]} sourceUrl="https://www.ted.com/talks/paul_hessburg_why_wildfires_have_gotten_worse_and_what_we_can_do_about_it" />}
        {i===3 && <FireVideoFeature id="XpZemPMRkDw" kicker="In practice / US Forest Service" title="Prescribed fire in the Northwest" publisher="US Forest Service · Pacific Northwest Research Station" context="See the work behind a planned burn: the landscape goal, preparation, conditions and smoke planning. Woodpecker, below, gives one Oregon project a specific purpose." watchFor={["What crews decide before ignition.","Why conditions can postpone a burn without changing its purpose.","What records would show that work actually happened."]} sourceUrl="https://www.climatehubs.usda.gov/hubs/northwest/topic/prescribed-fire-northwest" />}
        {i===0 && <div className="fire-two-questions"><div><span>During the fire / intensity</span><p>How much energy does it release?</p></div><div><span>After the fire / severity</span><p>What happened to trees, soil and habitat?</p></div></div>}
        {i===3 && <p className="fire-long-case-link"><Link href="/oregon-fire/stories/why-burn">Follow Woodpecker’s planning and burn →</Link><a href={LESSON_SOURCES.woodpecker.url}>Read OSU’s account <ArrowUpRight size={13}/></a></p>}
        {i===3 && <WhetstonePermitCase />}
        {i===4 && <><FireMaintenanceEvidence /><div className="fire-cost-questions"><div><h3>What would another million buy here?</h3><p>We need a place&apos;s ready projects, actual costs and available crews to answer that. Our <Link href="/oregon-fire/landscapes">landscape investigation</Link> is tracing those records.</p></div><div><h3>Could selling removed wood pay for it?</h3><p>Sometimes revenue helps. ODF reports reinvesting proceeds from timber sales in a juniper-removal project. That example does not establish that wood sales cover the full cost of every kind of work. <a href={LESSON_SOURCES.odfSpending.url}>See page 3 ↗</a></p></div></div><div className="fire-spending-followup"><p><strong>Two different research results:</strong> A <a href={LESSON_SOURCES.suppressionStudy.url}>Pacific Northwest Forest Service study</a> estimates $5–6 in federal suppression-cost savings per treatment dollar in its setting. A <a href={LESSON_SOURCES.benefitsStudy.url}>separate western study</a> estimates $3.73 in expected avoided damages per treatment dollar. They answer different questions. Neither is a forecast for the project near you.</p><Link href="/oregon-fire/learn/costs-and-choices">Explore the assumptions behind these estimates →</Link></div></>}
        {i===6 && <p className="fire-long-case-link"><Link href="/oregon-fire/atlas?kind=wildfire&from=2020&to=2020&scarEnd=2020&scarYears=1#explore">Explore the 2020 fire boundaries →</Link><Link href="/oregon-fire/atlas?story=egley#fire-stories">Read Egley’s one- and nine-year observations →</Link></p>}
        <p className="fire-long-takeaway">{chapter.takeaway}</p>
        <div className="fire-long-chapter-foot"><Link className="fire-deeper-link" href={`/oregon-fire/learn/${chapter.slug}`}><BookOpen size={17}/><span>Go deeper: {shortLabels[i].toLowerCase()}</span><ArrowRight size={17}/></Link><details className="fire-chapter-sources"><summary>Sources for this chapter</summary><ul>{chapter.sources.map(key=><li key={key}><a href={LESSON_SOURCES[key].url}>{LESSON_SOURCES[key].title} ↗</a></li>)}</ul></details></div>
        <p className="fire-long-transition">{chapter.transition}</p>
      </section>)}
      <section className="fire-guide-finish" aria-labelledby="guide-finish-title"><span className="fire-eyebrow">From understanding to investigation</span><h2 id="guide-finish-title">Bring these questions to a place you know.</h2><p>Why was this place chosen? What was planned? What actually happened? What did it cost? And what do the observations tell us afterward? We are tracing those questions through the records of one Oregon landscape, beginning with a documented pilot selection.</p><div><Link href="/oregon-fire/landscapes">Follow the landscape investigation <ArrowUpRight size={17}/></Link><a href="#find-place">Find a place <ArrowDown size={17}/></a><Link href="/oregon-fire/atlas">Open the full atlas <ArrowUpRight size={17}/></Link></div></section>
    </div>
  </>;
}
