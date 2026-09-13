"use client";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { STORIES, GUIDE_SOURCES } from "@/lib/oregon-fire/guide";
import { exploreScene, useGuideChoice } from "./guide-navigation";
export default function FireStories() {
  const [id, choose] = useGuideChoice(
    "story",
    STORIES.map((s) => s.id),
    "woodpecker",
  );
  const s = STORIES.find((v) => v.id === id)!;
  const [stage, setStage] = useGuideChoice("stage", ["0", "1", "2"], "0");
  const t = s.timeline[Number(stage)];
  return (
    <section
      id="fire-stories"
      className="fire-guide-section"
      aria-labelledby="stories-title"
    >
      <div className="fire-section-head">
        <div>
          <span className="fire-eyebrow">
            Follow the evidence · three Oregon stories
          </span>
          <h2 id="stories-title">What actually happened here?</h2>
        </div>
        <p>
          Objectives, observations, and the questions that remain. Every story
          has a source.
        </p>
      </div>
      <div
        className="fire-story-picker"
        role="group"
        aria-label="Documented Oregon stories"
      >
        {STORIES.map((v) => (
          <button
            key={v.id}
            onClick={() => {
              choose(v.id);
              setStage("0");
            }}
            aria-pressed={id === v.id}
          >
            <span className="fire-eyebrow">{v.type}</span>
            <strong>{v.name}</strong>
            <span>{v.location}</span>
          </button>
        ))}
      </div>
      <article className="fire-case-study">
        <div className="fire-case-intro">
          <span className="fire-eyebrow">{s.location}</span>
          <h3>{s.title}</h3>
          <p>{s.intro}</p>
          <a href={s.source}>
            {id === "woodpecker"
              ? "Read OSU’s account"
              : "Read the original source"}
            <ArrowUpRight size={15} />
          </a>
          <small>{s.sourceLabel}</small>
        </div>
        <div className="fire-case-timeline">
          <div
            className="fire-timeline-tabs"
            role="group"
            aria-label="Story timeline"
          >
            {s.timeline.map((v, i) => (
              <button
                key={v.year}
                aria-pressed={Number(stage) === i}
                onClick={() => setStage(String(i))}
              >
                <i />
                {v.year}
              </button>
            ))}
          </div>
          <div className="fire-timeline-body" aria-live="polite">
            <span className="fire-eyebrow">{t.year}</span>
            <h4>{t.title}</h4>
            <p>{t.text}</p>
          </div>
          {id === "egley" && (
            <div
              className="fire-study-bars"
              role="img"
              aria-label="High severity affected 12.9 percent of treated land and 26.7 percent of untreated land in the Egley landscape study"
            >
              <span>Share of each group burned at high severity</span>
              <div>
                <label>Previously treated</label>
                <i style={{ width: "43%" }} />
                <strong>12.9%</strong>
              </div>
              <div>
                <label>Untreated</label>
                <i style={{ width: "89%" }} />
                <strong>26.7%</strong>
              </div>
              <small>
                Common 0–30% display scale. Different treatment types were
                grouped; this is not prescribed fire alone.
              </small>
            </div>
          )}
        </div>
      </article>
      {id === "egley" && (
        <figure className="fire-study-figure">
          <a
            href="/images/oregon-fire/egley-study.webp"
            target="_blank"
            rel="noreferrer"
            aria-label="Open full-size Egley study map"
          >
            <Image
              src="/images/oregon-fire/egley-study.webp"
              alt="Study figure showing earlier treatment areas, burn severity, and paired field sites within the 2007 Egley Fire Complex"
              width={1949}
              height={1015}
              sizes="(max-width: 700px) 100vw, 1200px"
            />
          </a>
          <figcaption>
            A: earlier treatments. B: severity and paired field sites. C: study
            location. Original Figure 1, Dodge et al. (2019),{" "}
            <a href={GUIDE_SOURCES.egleyPaper}>Fire Ecology</a>,{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
            . Image extracted and compressed; labels and contents unchanged.
            Open the image to inspect the full map.
          </figcaption>
        </figure>
      )}
      <div className="fire-outcome-strip">
        <div>
          <span className="fire-eyebrow">Intended</span>
          <p>{s.objective}</p>
        </div>
        <div>
          <span className="fire-eyebrow">Documented</span>
          <p>{s.observed}</p>
        </div>
        <div>
          <span className="fire-eyebrow">Still needed</span>
          <p>{s.missing}</p>
        </div>
      </div>
      <div className="fire-case-map">
        <button
          className="fire-guide-primary"
          onClick={() =>
            exploreScene({
              bbox: s.bbox,
              kind: "all",
              story: id,
              from: id === "egley" ? "2007" : "2021",
              to: id === "egley" ? "2007" : String(new Date().getFullYear()),
              scarEnd:
                id === "egley" ? "2007" : String(new Date().getFullYear()),
              scarYears: id === "egley" ? "1" : "5",
              scarMode: "age",
              scars: "1",
              zoom: "9",
            })
          }
        >
          {s.mapLabel}
          <ArrowRight size={16} />
        </button>
        <p>{s.mapNote}</p>
      </div>
      <aside className="fire-partnership-note">
        <strong>Whose knowledge tells the story?</strong>
        <p>
          We welcome accounts from practitioners, neighbors, researchers, and
          tribal fire programs. Cultural-fire stories and precise locations are
          developed with the relevant partners. We have not added an unreviewed
          cultural-burn case study.
        </p>
        <a href="/contact?topic=Work+on+a+topic&project=Oregon+Fire+Map">
          Contribute a documented story
          <ArrowUpRight size={13} />
        </a>
      </aside>
    </section>
  );
}
