import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { FIRE_AUTHORS } from "@/lib/oregon-fire/metadata";
import { FIRE_LESSONS, LESSON_SOURCES } from "@/lib/oregon-fire/lesson";
import FireMechanicsVisual from "./FireMechanicsVisual";
import FireCostExplorer from "./FireCostExplorer";
import { GuidePanorama, LandscapeOverview, HistoryVisual, WorkVisual, TreatmentEvidence, AftermathVisual, CommunityVisual } from "./FireGuideVisuals";

const visuals = [<FireMechanicsVisual key="mechanics" />, <LandscapeOverview key="landscapes" />, <HistoryVisual key="history" />, <WorkVisual key="work" />, <TreatmentEvidence key="evidence" />, <AftermathVisual key="after" />, <FireCostExplorer key="cost" />, <CommunityVisual key="community" />];
const shortLabels = ["How fire moves", "Different places", "What changed", "The work", "The research", "After the fire", "The costs", "Living with fire"];

export default function FireLongGuide() {
  return <>
    <header className="fire-long-hero">
      <div className="fire-long-hero-top"><span className="fire-eyebrow">Oregon / an illustrated guide</span><a href="#explore">Explore the atlas <ArrowUpRight size={15} /></a></div>
      <h1>Fire in Oregon</h1>
      <p className="fire-long-question">Why do we fight some fires<br className="fire-desktop-break" /> and deliberately light others?</p>
      <div className="fire-long-panorama"><GuidePanorama /></div>
      <p className="fire-long-intro">Fire can kill trees, leave large trees alive, or help keep a prairie open. The result depends on the place, the conditions and what burns. Follow the fire from the ground to the treetops, see what people can change, and examine what those choices cost.</p>
      <a className="fire-long-start" href="#how-fire-moves">Start the story <ArrowDown size={18} /></a>
      <div className="fire-long-byline">By {FIRE_AUTHORS.join(" & ")}<span>Read straight through. Follow the details when you want more.</span></div>
    </header>
    <nav className="fire-long-nav" aria-label="Chapters in the fire guide">{FIRE_LESSONS.map((c,i)=><a key={c.slug} href={`#${c.anchor}`}><span>{String(i+1).padStart(2,"0")}</span>{shortLabels[i]}</a>)}</nav>
    <div className="fire-long-body">
      {FIRE_LESSONS.map((chapter,i)=><section key={chapter.slug} id={chapter.anchor} className={`fire-long-chapter fire-long-chapter-${i+1}`} aria-labelledby={`chapter-title-${i+1}`}>
        <div className="fire-long-chapter-head"><span className="fire-chapter-number" aria-hidden="true">{String(i+1).padStart(2,"0")}</span><div><span className="fire-eyebrow">{chapter.label}</span><h2 id={`chapter-title-${i+1}`}>{chapter.title}</h2></div></div>
        <div className="fire-long-copy">{chapter.paragraphs.map(p=><p key={p}>{p}</p>)}</div>
        <div className="fire-long-visual">{visuals[i]}</div>
        {i===0 && <div className="fire-two-questions"><div><span>During the fire / intensity</span><p>How much energy does it release?</p></div><div><span>After the fire / severity</span><p>What happened to trees, soil and habitat?</p></div></div>}
        {i===3 && <p className="fire-long-case-link"><Link href="/oregon-fire/stories/why-burn">Follow Woodpecker’s planning and burn →</Link><a href={LESSON_SOURCES.woodpecker.url}>Read OSU’s account <ArrowUpRight size={13}/></a></p>}
        {i===5 && <p className="fire-long-case-link"><Link href="/oregon-fire/atlas?kind=wildfire&from=2020&to=2020&scarEnd=2020&scarYears=1#explore">Explore the 2020 fire boundaries →</Link><Link href="/oregon-fire/atlas?story=egley#fire-stories">Read Egley’s one- and nine-year observations →</Link></p>}
        <p className="fire-long-takeaway">{chapter.takeaway}</p>
        <div className="fire-long-chapter-foot"><Link className="fire-deeper-link" href={`/oregon-fire/learn/${chapter.slug}`}><BookOpen size={17}/><span>Go deeper: {shortLabels[i].toLowerCase()}</span><ArrowRight size={17}/></Link><details className="fire-chapter-sources"><summary>Sources for this chapter</summary><ul>{chapter.sources.map(key=><li key={key}><a href={LESSON_SOURCES[key].url}>{LESSON_SOURCES[key].title} ↗</a></li>)}</ul></details></div>
        <p className="fire-long-transition">{chapter.transition}</p>
      </section>)}
      <section className="fire-guide-finish" aria-labelledby="guide-finish-title"><span className="fire-eyebrow">From understanding to investigation</span><h2 id="guide-finish-title">Bring these questions to a place you know.</h2><p>Why was this place chosen? What was planned? What actually happened? What did it cost? And what do the observations tell us afterward?</p><div><a href="#find-place">Find a place <ArrowDown size={17}/></a><Link href="/oregon-fire/atlas">Open the full atlas <ArrowUpRight size={17}/></Link></div></section>
    </div>
  </>;
}
