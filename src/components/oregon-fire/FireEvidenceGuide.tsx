import Link from "next/link";
import { documentationCoverage, publishedProjects } from "@/lib/oregon-fire/projects";
const terms = [
  ["Intensity / severity", "Intensity describes fire’s energy; severity describes its effects. A satellite severity map is not a direct measurement of flame intensity."],
  ["Perimeter / burned footprint", "An event boundary may include unburned islands. A treatment unit is a work boundary, not proof that every acre burned."],
  ["Forest land / canopy / biomass", "Forest land is an inventory classification. Canopy cover and living or dead biomass are different measures; burned land is not automatically lost forest."],
  ["Old growth / large trees", "Tree size, age, and stand characteristics are different attributes. A project needs its own definitions and retained-tree objectives."],
  ["Pile / broadcast burning", "Pile burning treats concentrated material. Broadcast or understory burning carries fire across a unit; their reported acreage has different meanings."],
  ["Planned / completed / wildfire-consumed", "A permit authorizes work. An accomplishment reports work. A planned treatment burned in wildfire is not a prescribed ignition."],
  ["History / objective", "A historical fire regime is context. It is not a universal schedule or a forecast under today’s climate and land use."],
];
export default function FireEvidenceGuide() {
  const metrics = documentationCoverage();
  return <section className="fire-project-teaser" id="project-records"><span className="fire-eyebrow">Follow a documented decision</span><h2>What was the work meant to do?</h2><p>Read the objective, follow the sequence, and look for observations that can establish a result.</p>
    {publishedProjects().map((p) => <p key={p.id}><Link className="fire-guide-primary" href={`/oregon-fire/projects/${p.id}`}>{p.title} →</Link></p>)}
    <div className="fire-documentation-metrics" aria-label="Reviewed project documentation coverage"><div><strong>{metrics.purpose}/{metrics.denominator}</strong>Purpose documented</div><div><strong>{metrics.verifiedGeometry}/{metrics.denominator}</strong>Unit geometry verified</div><div><strong>{metrics.monitoring}/{metrics.denominator}</strong>Monitoring obtained</div></div>
    <p className="fire-guide-note">{metrics.meaning} Denominator: {metrics.denominator} curated project dossier, checked {metrics.version}. No ecological progress percentage has been established.</p>
    <details><summary>Words that change how you read a fire map</summary><dl>{terms.map(([term, meaning]) => <div key={term} style={{ margin: "1rem 0" }}><dt><strong>{term}</strong></dt><dd>{meaning}</dd></div>)}</dl><a href="https://extension.oregonstate.edu/catalog/pub/em-9340-ecological-effects-fire">OSU ecological effects guide ↗</a></details>
  </section>;
}
