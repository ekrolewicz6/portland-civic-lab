import { ArrowUpRight } from "lucide-react";

export default function ForestContext() {
  return (
    <section
      className="fire-forest-context"
      aria-labelledby="forest-context-title"
    >
      <div className="fire-forest-stat">
        <span className="fire-eyebrow">
          Oregon’s forest landscape · FIA 2022
        </span>
        <div className="fire-forest-number">
          29.75<span>million acres</span>
        </div>
        <p>Estimated forest land, across public and private ownership.</p>
        <div
          className="fire-forest-meter"
          role="img"
          aria-label="About 49 percent of sampled Oregon land is forest land in the 2022 inventory"
        >
          <span style={{ width: "49%" }} />
        </div>
        <div className="fire-meter-labels">
          <strong>49% forest land</strong>
          <span>of sampled land area</span>
        </div>
        <a href="https://research.fs.usda.gov/download/treesearch/70007.pdf">
          Forest Service inventory <ArrowUpRight size={14} />
        </a>
        <small>
          2022 inventory · published September 2025. Forest-area estimate:
          29,754,801 acres; sampling error ±0.43%. This is a land
          classification, not a live tree-canopy count.
        </small>
      </div>
      <div className="fire-forest-explanation">
        <span className="fire-eyebrow">Understanding the effects</span>
        <h2 id="forest-context-title">
          A fire leaves a pattern.
          <br />
          <em>Its meaning depends on the place.</em>
        </h2>
        <p>
          Wildfire can do ecological work as well as cause harm. A single
          perimeter can contain surviving forest, lightly burned ground, and
          patches where most vegetation changed. The severity layer helps reveal
          that pattern.
        </p>
        <div className="fire-effects-grid">
          <div>
            <span>01 / EXTENT</span>
            <h3>Where fire reached</h3>
            <p>
              A perimeter outlines an event. It may contain ground that did not
              burn.
            </p>
          </div>
          <div>
            <span>02 / SEVERITY</span>
            <h3>What changed</h3>
            <p>
              Satellite assessments describe vegetation change. They don’t, by
              themselves, establish ecological benefit.
            </p>
          </div>
          <div>
            <span>03 / RECOVERY</span>
            <h3>What comes next</h3>
            <p>
              Forest type, repeat fire, regeneration, and local monitoring give
              those changes meaning.
            </p>
          </div>
        </div>
        <details className="fire-progress-question">
          <summary>How much of the landscape has had “good fire”?</summary>
          <p>
            That percentage is not yet established. A meaningful progress bar
            needs a defined landscape, an ecological objective, a time period,
            and reviewed evidence of outcomes. Prescribed fire and wildfire can
            both contribute when the evidence supports it. We do not subtract
            fire acreage from forest area or treat every forest as needing to
            burn on the same schedule.
          </p>
        </details>
        <div className="fire-context-links">
          <a href="https://www.mtbs.gov/faqs">
            How to interpret severity <ArrowUpRight size={13} />
          </a>
          <a href="https://research.fs.usda.gov/psw/fire/behavior">
            Fire and different ecosystems <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
