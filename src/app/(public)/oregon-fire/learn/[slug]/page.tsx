import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FireEditorialShell from "@/components/oregon-fire/FireEditorialShell";
import FireMechanicsVisual from "@/components/oregon-fire/FireMechanicsVisual";
import FireCostExplorer from "@/components/oregon-fire/FireCostExplorer";
import { TreatmentEvidence, AftermathVisual, CommunityVisual, LandscapeOverview } from "@/components/oregon-fire/FireGuideVisuals";
import { FIRE_LESSONS, LESSON_SOURCES, LESSON_DATE } from "@/lib/oregon-fire/lesson";
import { FIRE_AUTHORS, FIRE_URL } from "@/lib/oregon-fire/metadata";
import { pageMeta } from "@/lib/page-meta";
import "../../long-guide.css";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return FIRE_LESSONS.map(({slug})=>({slug})); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {slug}=await params;
  const lesson=FIRE_LESSONS.find(l=>l.slug===slug);
  if(!lesson) return {};
  return {...pageMeta({title:`${lesson.title} · Fire in Oregon`,description:lesson.paragraphs[0],path:`/oregon-fire/learn/${slug}`,type:"article"}),authors:FIRE_AUTHORS.map(name=>({name}))};
}
export default async function FireLessonPage({params}:Props) {
  const {slug}=await params;
  const index=FIRE_LESSONS.findIndex(l=>l.slug===slug);
  if(index<0) notFound();
  const lesson=FIRE_LESSONS[index];
  const previous=FIRE_LESSONS[index-1], next=FIRE_LESSONS[index+1];
  const data={"@context":"https://schema.org","@type":"Article",headline:lesson.title,description:lesson.paragraphs[0],url:`${FIRE_URL}/learn/${slug}`,datePublished:LESSON_DATE,dateModified:"2026-09-27",author:FIRE_AUTHORS.map(name=>({"@type":"Person",name})),publisher:{"@type":"Organization",name:"Portland Civic Lab"},citation:lesson.sources.map(key=>LESSON_SOURCES[key].url)};
  return <FireEditorialShell eyebrow={`Go deeper / ${String(index+1).padStart(2,"0")} / ${lesson.label}`} title={lesson.title} intro={lesson.paragraphs[0]}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/>
    <nav className="fire-story-nav" aria-label="In this explanation">{lesson.detail.map((section,i)=><a key={section.title} href={`#detail-${i+1}`}>{section.title}</a>)}</nav>
    <p className="fire-lesson-summary">{lesson.takeaway}</p>
    {slug==="how-fire-moves" && <FireMechanicsVisual/>}
    {slug==="different-landscapes" && <LandscapeOverview/>}
    {slug==="does-treatment-work" && <TreatmentEvidence/>}
    {slug==="after-the-fire" && <AftermathVisual/>}
    {slug==="costs-and-choices" && <FireCostExplorer/>}
    {slug==="living-with-fire" && <CommunityVisual/>}
    {lesson.detail.map((section,i)=><section key={section.title} id={`detail-${i+1}`} className="fire-detail-section"><h2>{section.title}</h2>{section.paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}
    {slug==="choosing-the-work" && <p><Link href="/oregon-fire/stories/why-burn">Follow Woodpecker’s documented burn →</Link> · <Link href="/oregon-fire/projects/woodpecker">Open its project dossier →</Link></p>}
    {slug==="how-we-got-here" && <p><Link href="/oregon-fire/stories/why-burn#reading-landscape">Examine the original Horse Canyon repeat photographs →</Link></p>}
    {slug==="after-the-fire" && <p><Link href="/oregon-fire/atlas?story=egley#fire-stories">Read the Egley case →</Link></p>}
    <aside className="fire-detail-question"><span className="fire-eyebrow">Think it through</span><p>{lesson.question}</p></aside>
    <section className="fire-detail-section" id="evidence"><h2>Read the evidence</h2><ul className="fire-detail-sources">{lesson.sources.map(key=><li key={key}><a href={LESSON_SOURCES[key].url}>{LESSON_SOURCES[key].title} ↗</a><small>{LESSON_SOURCES[key].locator}</small></li>)}</ul></section>
    <p><Link href={`/contact?topic=Data+correction&project=Oregon+Fire+Map&fireRecord=guide:${slug}`}>Suggest a correction or supporting record →</Link></p>
    <nav className="fire-detail-navigation" aria-label="Continue reading">{previous && <Link href={`/oregon-fire/learn/${previous.slug}`}>← {previous.label}</Link>}<Link href={`/oregon-fire#${lesson.anchor}`}>Return to this chapter in the guide</Link>{next && <Link href={`/oregon-fire/learn/${next.slug}`}>{next.label} →</Link>}</nav>
  </FireEditorialShell>;
}
