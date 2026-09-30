"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Search, X } from "lucide-react";
import { DEEP_DIVES, DIVE_TOPICS, diveDate, normalizeDiveTopic, selectDeepDives, type DiveSort, type DiveTopic } from "@/lib/deep-dives";
import StoryCover from "./StoryCover";
import s from "./discovery.module.css";

type Filters = { topic: DiveTopic | "all"; query: string; sort: DiveSort };
export default function DeepDiveLibrary({ initialFilters }: { initialFilters: Filters }) {
  const [filters, setFilters] = useState(initialFilters);
  const stories = selectDeepDives(filters.topic, filters.query, filters.sort);
  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(window.location.search);
      setFilters({ topic: normalizeDiveTopic(params.get("topic") ?? undefined), query: (params.get("q") ?? "").slice(0,120), sort: params.get("sort") === "title" ? "title" : "updated" });
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  function update(next: Filters, replace = false) {
    setFilters(next);
    const url = new URL(window.location.href);
    if (next.topic === "all") url.searchParams.delete("topic"); else url.searchParams.set("topic", next.topic);
    if (!next.query.trim()) url.searchParams.delete("q"); else url.searchParams.set("q", next.query);
    if (next.sort === "updated") url.searchParams.delete("sort"); else url.searchParams.set("sort", next.sort);
    url.hash = "collection";
    window.history[replace ? "replaceState" : "pushState"](window.history.state, "", url);
  }
  function clear() { update({ topic: "all", query: "", sort: "updated" }); }
  return <section className={s.library} id="collection" aria-labelledby="collection-heading">
    <div className={s.libraryHeading}>
      <div><p className={s.eyebrow}>The collection</p><h2 id="collection-heading">What are you curious about?</h2></div>
      <form action="/deep-dives#collection" method="get" role="search" aria-label="Search deep dives" className={s.search} onSubmit={e => { e.preventDefault(); update(filters, true); }}>
        <Search size={18} aria-hidden="true"/><label className={s.srOnly} htmlFor="dive-search">Search deep dives</label>
        <input id="dive-search" type="search" name="q" value={filters.query} maxLength={120} onChange={e => update({ ...filters, query: e.target.value }, true)} placeholder="Try “schools” or “taxes”"/>
        <input type="hidden" name="topic" value={filters.topic}/><input type="hidden" name="sort" value={filters.sort}/>
      </form>
    </div>
    <nav className={s.topics} aria-label="Filter stories by topic">
      {[{id:"all",label:"Everything"}, ...DIVE_TOPICS].map(topic => <a key={topic.id} className={s.topic} href={`/deep-dives${topic.id === "all" ? "" : `?topic=${topic.id}`}#collection`} aria-current={filters.topic === topic.id ? "true" : undefined} onClick={e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault(); update({ ...filters, topic: topic.id as Filters["topic"] });
      }}>{topic.label}<span>{topic.id === "all" ? DEEP_DIVES.length : DEEP_DIVES.filter(d=>d.topics.includes(topic.id as DiveTopic)).length}</span></a>)}
    </nav>
    <div className={s.resultsBar}>
      <p role="status" aria-live="polite"><strong>{stories.length}</strong> {stories.length === 1 ? "deep dive" : "deep dives"}{filters.query.trim() ? ` matching “${filters.query.trim()}”` : " to explore"}</p>
      <div className={s.sort}><label htmlFor="dive-sort">Sort by</label><select id="dive-sort" value={filters.sort} onChange={e=>update({...filters,sort:e.target.value as DiveSort})}><option value="updated">Recently updated</option><option value="title">Title A–Z</option></select><ArrowDown size={13} aria-hidden="true"/></div>
    </div>
    {filters.topic !== "all" || filters.query ? <button className={s.clear} type="button" onClick={clear}><X size={13} aria-hidden="true"/> Clear filters</button> : null}
    {stories.length ? <div className={s.gallery}>
      {stories.map(dive=><article className={s.card} key={dive.slug} data-testid="dive-card">
        <a href={`/deep-dives/${dive.slug}`} aria-labelledby={`story-${dive.slug}`}>
          <div className={s.cardCover}><StoryCover slug={dive.slug}/><span className={s.coverArrow}><ArrowUpRight size={21} aria-hidden="true"/></span></div>
          <div className={s.cardBody}>
            <p className={s.subject}>{dive.subject}</p><h3 id={`story-${dive.slug}`}>{dive.title}</h3>
            <p className={s.description}>{dive.description}</p>
            <p className={s.tool}><span aria-hidden="true">↳</span> {dive.tool}</p>
            <p className={s.date}>Updated <time dateTime={dive.updated}>{diveDate(dive.updated)}</time></p>
          </div>
        </a>
      </article>)}
    </div> : <div className={s.empty}><Search size={32} aria-hidden="true"/><h3>No stories match that search yet.</h3><p>Try a broader word, like “housing,” or clear your filters to see the full collection.</p><button type="button" onClick={clear}>Show all {DEEP_DIVES.length} deep dives <ArrowUpRight size={17} aria-hidden="true"/></button></div>}
    <p className={s.catalogNote}>Dates show when articles were revised. Individual sources and figures may be older.</p>
  </section>;
}
