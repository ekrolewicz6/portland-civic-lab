"use client";
import Image from "next/image";
import { useState, type PointerEvent } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GUIDE_SOURCES } from "@/lib/oregon-fire/guide";
import { useGuideChoice, exploreScene } from "./guide-navigation";
export default function FireComparison() {
  const [later, choose] = useGuideChoice(
    "compare",
    ["2020-09-27", "2025-09-27"],
    "2020-09-27",
  );
  const [split, setSplit] = useState(50);
  function reveal(e: PointerEvent<HTMLDivElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    setSplit(
      Math.round(
        Math.max(0, Math.min(100, ((e.clientX - box.left) / box.width) * 100)),
      ),
    );
  }
  return (
    <section
      id="through-time"
      className="fire-guide-section"
      aria-labelledby="comparison-title"
    >
      <div className="fire-section-head">
        <div>
          <span className="fire-eyebrow">From orbit · western Oregon</span>
          <h2 id="comparison-title">
            The fire ends.
            <br />
            <em>The landscape keeps changing.</em>
          </h2>
        </div>
        <p>
          Compare real, dated NASA imagery. Watch the burn scars appear, then
          look again five years later.
        </p>
      </div>
      <div className="fire-comparison-toolbar">
        <span>Compare July 19, 2020 with</span>
        <div
          className="fire-segment"
          role="group"
          aria-label="Satellite comparison date"
        >
          <button
            aria-pressed={later === "2020-09-27"}
            onClick={() => choose("2020-09-27")}
          >
            September 27, 2020
          </button>
          <button
            aria-pressed={later === "2025-09-27"}
            onClick={() => choose("2025-09-27")}
          >
            Five years later
          </button>
        </div>
      </div>
      <figure>
        <div
          className="fire-image-compare"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            reveal(e);
          }}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) reveal(e);
          }}
          onPointerUp={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId))
              e.currentTarget.releasePointerCapture(e.pointerId);
          }}
        >
          <Image
            src={`/images/oregon-fire/oregon-${later}.webp`}
            alt={`Western Oregon in false-color MODIS imagery on ${later}`}
            fill
            sizes="(max-width: 700px) 100vw, 1280px"
          />
          <div
            className="fire-compare-before"
            style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
          >
            <Image
              src="/images/oregon-fire/oregon-2020-07-19.webp"
              alt="The same western Oregon view on July 19, 2020, before the major September fires"
              fill
              sizes="(max-width: 700px) 100vw, 1280px"
            />
          </div>
          <div
            className="fire-compare-line"
            style={{ left: `${split}%` }}
            aria-hidden="true"
          >
            <span>↔</span>
          </div>
          <div className="fire-image-label before">July 19, 2020</div>
          <div className="fire-image-label after">
            {later === "2020-09-27"
              ? "September 27, 2020"
              : "September 27, 2025"}
          </div>
        </div>
        <label className="fire-compare-slider">
          Reveal the earlier image
          <input
            type="range"
            min="0"
            max="100"
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label="Earlier satellite image reveal"
            aria-valuetext={`${split} percent earlier image`}
          />
          <span>{split}%</span>
        </label>
        <figcaption>
          NASA GIBS · Terra MODIS · bands 7–2–1 · identical geographic extent.
          False color: vegetation appears green; burn scars can appear brown or
          dark red; water can also look dark. Clouds obscure parts of the later
          view. These are imagery observations, not severity classes or measured
          restoration outcomes. July and September also differ seasonally.
        </figcaption>
      </figure>
      <div className="fire-comparison-reading">
        <div>
          <span className="fire-eyebrow">Look closely</span>
          <h3>
            {later === "2020-09-27"
              ? "New scars interrupt the green."
              : "A greener pixel is not a recovered forest."}
          </h3>
          <p>
            {later === "2020-09-27"
              ? "NASA documented extensive new scars after the 2020 fires. Compare their shapes with the dated perimeter records, rather than assuming every dark area burned."
              : "Vegetation, later fires, drought, clouds, and seasonal conditions can all change this image. Field observations are needed to tell which plants returned and whether the intended habitat is recovering."}
          </p>
        </div>
        <div>
          <button
            className="fire-guide-primary"
            onClick={() =>
              exploreScene({
                bbox: "-124.5,43.5,-120.5,46",
                from: "2020",
                to: "2020",
                kind: "wildfire",
                scars: "1",
                scarEnd: "2020",
                scarYears: "1",
                scarMode: "age",
                markers: "0",
                zoom: "7",
              })
            }
          >
            Explore the 2020 perimeters
            <ArrowRight size={16} />
          </button>
          <a href={GUIDE_SOURCES.nasa}>
            NASA’s original 2020 explanation
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
