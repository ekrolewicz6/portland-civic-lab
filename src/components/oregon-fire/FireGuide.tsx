"use client";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LANDSCAPES } from "@/lib/oregon-fire/guide";
import LandscapeIllustration from "./LandscapeIllustration";
import { exploreScene, useGuideChoice } from "./guide-navigation";
export default function FireGuide() {
  const [id, choose] = useGuideChoice(
    "landscape",
    LANDSCAPES.map((l) => l.id),
    "pine",
  );
  const index = LANDSCAPES.findIndex((l) => l.id === id),
    l = LANDSCAPES[index];
  return (
    <section
      id="understand"
      className="fire-guide-section"
      aria-labelledby="understand-title"
    >
      <div className="fire-section-head">
        <div>
          <span className="fire-eyebrow">
            Start here · a two-minute field guide
          </span>
          <h2 id="understand-title">
            One state. Many relationships with fire.
          </h2>
        </div>
        <p>
          Start with the landscape. Then ask what fire changes—and what people
          want to protect.
        </p>
      </div>
      <div
        className="fire-guide-tabs"
        role="group"
        aria-label="Oregon fire landscapes"
      >
        {LANDSCAPES.map((v, i) => (
          <button
            key={v.id}
            aria-pressed={id === v.id}
            onClick={() => choose(v.id)}
          >
            <span>0{i + 1}</span>
            {v.name}
          </button>
        ))}
      </div>
      <div className="fire-landscape-story">
        <div className="fire-illustration">
          <LandscapeIllustration kind={id} />
          <span>{l.eyebrow}</span>
        </div>
        <div className="fire-guide-copy" aria-live="polite">
          <span className="fire-eyebrow">
            0{index + 1} / 04 · {l.name}
          </span>
          <h3>{l.title}</h3>
          <p>{l.body}</p>
          <blockquote>{l.question}</blockquote>
          <p className="fire-guide-note">{l.caution}</p>
          <div className="fire-guide-actions">
            <button
              onClick={() =>
                exploreScene({ bbox: l.bbox, kind: "all", landscape: id })
              }
            >
              {l.mapLabel}
              <ArrowRight size={16} />
            </button>
            <a href={l.source}>
              Read the science
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
      <div className="fire-guide-pager">
        <span>
          Climate, weather, land use, and past management all shape what happens
          next.
        </span>
        <div>
          <button
            aria-label="Previous landscape"
            disabled={index === 0}
            onClick={() => choose(LANDSCAPES[index - 1].id)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Next landscape"
            disabled={index === 3}
            onClick={() => choose(LANDSCAPES[index + 1].id)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="fire-three-questions">
        {[
          [
            "Where did it reach?",
            "A perimeter outlines a fire event. Some ground inside may not have burned.",
          ],
          [
            "What changed?",
            "Severity describes effects such as vegetation change. One fire can leave a mosaic.",
          ],
          [
            "Was it beneficial?",
            "That needs a local objective and evidence: habitat, surviving trees, community impacts, and recovery.",
          ],
        ].map(([h, t], i) => (
          <div key={h}>
            <span className="fire-eyebrow">0{i + 1} / read the evidence</span>
            <h3>{h}</h3>
            <p>{t}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
