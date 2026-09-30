import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { pageMeta } from "@/lib/page-meta";
import { DEEP_DIVES, diveDate, normalizeDiveTopic, selectDeepDives } from "@/lib/deep-dives";
import DeepDiveLibrary from "@/components/deep-dives/discovery/DeepDiveLibrary";
import StoryCover from "@/components/deep-dives/discovery/StoryCover";
import s from "@/components/deep-dives/discovery/discovery.module.css";

export const metadata: Metadata = pageMeta({
  title: "Policy Deep-Dives",
  description: "Explore Portland’s biggest questions through visual stories, original research and interactive tools. Browse housing, public money, elections, work and the environment.",
  path: "/deep-dives",
});

export default async function DeepDivesIndex({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const initialFilters = { topic: normalizeDiveTopic(first(params.topic)), query: (first(params.q) ?? "").slice(0,120), sort: first(params.sort) === "title" ? "title" as const : "updated" as const };
  const featured = selectDeepDives("all", "", "updated")[0];
  const picks = [
    { dive: DEEP_DIVES.find(d=>d.slug === "campaign-finance")!, label: "Before you vote" },
    { dive: DEEP_DIVES.find(d=>d.slug === "maker-economy")!, label: "Made in Portland" },
    { dive: DEEP_DIVES.find(d=>d.slug === "fpdr")!, label: "On your tax bill" },
  ].filter(pick => pick.dive.slug !== featured.slug).slice(0, 2);
  return <div className={s.page}>
    <div className={s.wrap}>
      <header className={s.intro}>
        <div><p className={s.eyebrow}><span className={s.smallLine}/> Portland Civic Lab / Deep dives</p><h1><span>The city,</span>{" "}<em>explained.</em></h1></div>
        <div className={s.introRight}><p>Get beneath the headlines. Explore the decisions shaping Portland, with clear explanations, visual stories and tools you can try.</p><a className={s.browseLink} href="#collection">Find your next question <ArrowDown size={18} aria-hidden="true"/></a></div>
      </header>
      <section className={s.focus} aria-labelledby="focus-heading">
        <div className={s.sectionRule}><h2 id="focus-heading">In focus</h2><span>Three places to start</span><span className={s.rule}/></div>
        <div className={s.focusGrid}>
          <article className={s.feature}>
            <Link href={`/deep-dives/${featured.slug}`} aria-labelledby="featured-story-title">
              <div className={s.featureArt}><StoryCover slug={featured.slug}/><span className={s.featureBadge}><span/> Latest update</span></div>
              <div className={s.featureBody}><p className={s.featureSubject}>{featured.subject}</p><h3 id="featured-story-title">{featured.title}</h3><p>{featured.description}</p><div className={s.featureBottom}><span>Updated <time dateTime={featured.updated}>{diveDate(featured.updated)}</time></span><span className={s.featureCta}>Explore the story <ArrowUpRight size={19} aria-hidden="true"/></span></div></div>
            </Link>
          </article>
          <div className={s.picks}>
            {picks.map(({dive,label})=><article className={s.pick} key={dive.slug}>
              <Link href={`/deep-dives/${dive.slug}`} aria-labelledby={`pick-${dive.slug}`}>
                <div className={s.pickArt}><StoryCover slug={dive.slug}/></div>
                <div className={s.pickBody}><p className={s.subject}>{label}</p><h3 id={`pick-${dive.slug}`}>{dive.title}</h3><p>{dive.description}</p><div className={s.pickBottom}><time dateTime={dive.updated}>Updated {diveDate(dive.updated)}</time><ArrowUpRight size={20} aria-hidden="true"/></div></div>
              </Link>
            </article>)}
          </div>
        </div>
      </section>
      <DeepDiveLibrary initialFilters={initialFilters}/>
      <aside className={s.invitation}><div><p className={s.eyebrow}>The next question could be yours</p><h2>What should we look into?</h2><p>A confusing policy, an unanswered question, a decision that deserves a closer look.</p></div><Link href="/proposals">Suggest a deep dive <ArrowUpRight size={19} aria-hidden="true"/></Link></aside>
    </div>
  </div>;
}
