import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import FireEditorialShell from "@/components/oregon-fire/FireEditorialShell";
import FireMechanicsVisual from "@/components/oregon-fire/FireMechanicsVisual";
import FireCostExplorer from "@/components/oregon-fire/FireCostExplorer";
import { TreatmentEvidence, AftermathVisual, CommunityVisual, LandscapeOverview } from "@/components/oregon-fire/FireGuideVisuals";
import { FIRE_GUIDE_ORDER, FIRE_LESSONS, LESSON_SOURCES, LESSON_DATE } from "@/lib/oregon-fire/lesson";
import { FIRE_AUTHORS, FIRE_URL } from "@/lib/oregon-fire/metadata";
import { pageMeta } from "@/lib/page-meta";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return FIRE_LESSONS.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = FIRE_LESSONS.find(l => l.slug === slug);
  if (!lesson) return {};
  return { ...pageMeta({ title: `${lesson.title} · Fire in Oregon`, description: lesson.paragraphs[0], path: `/oregon-fire/learn/${slug}`, type: "article", sectionImage: true }), authors: FIRE_AUTHORS.map(name => ({ name })) };
}
const pad = (n: number) => String(n).padStart(2, "0");

export default async function FireLessonPage({ params }: Props) {
  const { slug } = await params;
  const orderedLessons = FIRE_GUIDE_ORDER.map(key => FIRE_LESSONS.find(l => l.slug === key)!);
  const index = orderedLessons.findIndex(l => l.slug === slug);
  if (index < 0) notFound();
  const lesson = orderedLessons[index];
  const previous = orderedLessons[index - 1], next = orderedLessons[index + 1];
  const data = { "@context": "https://schema.org", "@type": "Article", headline: lesson.title, description: lesson.paragraphs[0], url: `${FIRE_URL}/learn/${slug}`, datePublished: LESSON_DATE, dateModified: "2026-09-30", author: FIRE_AUTHORS.map(name => ({ "@type": "Person", name })), publisher: { "@type": "Organization", name: "Portland Civic Lab" }, citation: lesson.sources.map(key => LESSON_SOURCES[key].url) };
  const visual =
    slug === "how-fire-moves" ? <FireMechanicsVisual /> :
    slug === "different-landscapes" ? <LandscapeOverview /> :
    slug === "does-treatment-work" ? <TreatmentEvidence /> :
    slug === "after-the-fire" ? <AftermathVisual /> :
    slug === "costs-and-choices" ? <FireCostExplorer /> :
    slug === "living-with-fire" ? <CommunityVisual /> : null;
  return <FireEditorialShell
    className="fire-lesson-page"
    eyebrow={`Go deeper / ${pad(index + 1)} / ${lesson.label}`}
    title={lesson.title}
    intro={lesson.paragraphs[0]}
    navLabel="In this explanation"
    nav={[...lesson.detail.map((section, i) => ({ id: `detail-${i + 1}`, label: section.title })), { id: "evidence", label: "The evidence" }]}
  >
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
    <section className="fire-rail fire-lesson-open">
      <div className="fire-rail-label"><span className="fire-eyebrow">The short version</span></div>
      <p className="fire-lede fire-lesson-summary">{lesson.takeaway}</p>
      {visual && <div className="fire-wide">{visual}</div>}
    </section>
    {lesson.detail.map((section, i) => <section key={section.title} id={`detail-${i + 1}`} className="fire-rail fire-detail-section">
      <div className="fire-rail-label"><span className="fire-eyebrow">{pad(i + 1)} / {pad(lesson.detail.length)}</span></div>
      <h2>{section.title}</h2>
      {section.paragraphs.map(p => <p key={p}>{p}</p>)}
    </section>)}
    <section className="fire-rail fire-detail-section fire-lesson-close">
      <div className="fire-rail-label"><span className="fire-eyebrow">Think it through</span></div>
      <p className="fire-lede fire-detail-question">{lesson.question}</p>
      {slug === "choosing-the-work" && <p className="fire-long-case-link"><Link href="/oregon-fire/stories/why-burn">Follow Woodpecker’s documented burn <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/oregon-fire/projects/woodpecker">Open its project dossier <ArrowRight size={16} aria-hidden="true" /></Link></p>}
      {slug === "how-we-got-here" && <p className="fire-long-case-link"><Link href="/oregon-fire/stories/why-burn#reading-landscape">Examine the original Horse Canyon repeat photographs <ArrowRight size={16} aria-hidden="true" /></Link></p>}
      {slug === "after-the-fire" && <p className="fire-long-case-link"><Link href="/oregon-fire/atlas?story=egley#fire-stories">Read the Egley case <ArrowRight size={16} aria-hidden="true" /></Link></p>}
    </section>
    <section className="fire-rail fire-detail-section" id="evidence">
      <div className="fire-rail-label"><span className="fire-eyebrow">Sources</span></div>
      <h2>Read the evidence</h2>
      <ul className="fire-detail-sources">{lesson.sources.map(key => <li key={key}><a href={LESSON_SOURCES[key].url}>{LESSON_SOURCES[key].title} ↗</a><small>{LESSON_SOURCES[key].locator}</small></li>)}</ul>
      <p><Link className="fire-text-link" href={`/contact?topic=Data+correction&project=Oregon+Fire+Map&fireRecord=guide:${slug}`}>Suggest a correction or supporting record <ArrowRight size={16} aria-hidden="true" /></Link></p>
    </section>
    <nav className="fire-detail-navigation" aria-label="Continue reading">
      {previous ? <Link href={`/oregon-fire/learn/${previous.slug}`}><span><ArrowLeft size={15} aria-hidden="true" /> Previous</span><strong>{previous.label}</strong></Link> : <span />}
      <Link href={`/oregon-fire#${lesson.anchor}`}><span>Fire in Oregon</span><strong>Return to this chapter in the guide</strong></Link>
      {next ? <Link href={`/oregon-fire/learn/${next.slug}`}><span>Next <ArrowRight size={15} aria-hidden="true" /></span><strong>{next.label}</strong></Link> : <span />}
    </nav>
  </FireEditorialShell>;
}
