import { ArrowUpRight } from "lucide-react";

const units = [
  {
    name: "Prairie",
    acres: 21,
    purpose: "Reduce old grass and weeds so native prairie plants have room to grow.",
  },
  {
    name: "North oak",
    acres: 33,
    purpose: "Clear litter before native seeding while retaining large oaks and habitat structure.",
  },
  {
    name: "South oak",
    acres: 33,
    purpose: "Prepare oak habitat for seeding, with homes close to its south and west edges.",
  },
];

export default function WhetstonePermitCase() {
  return (
    <section id="whetstone-permit" className="fire-whetstone" aria-labelledby="whetstone-title">
      <div className="fire-whetstone-heading">
        <div>
          <span className="fire-eyebrow">Inside a real decision · Jackson County, 2023</span>
          <h3 id="whetstone-title">An 87-acre burn was planned. It was likely canceled.</h3>
        </div>
        <p>
          At Whetstone Savanna near White City, a habitat burn was planned
          for prairie and oak woodland. The DEQ coordinator later said she
          believes staffing prevented the burn. A permit cannot be counted
          as acres burned.
        </p>
      </div>

      <div className="fire-whetstone-figure" aria-label="The burn plan divided 87 proposed acres into three subunits: 21 acres of prairie, 33 acres of north oak, and 33 acres of south oak">
        <div className="fire-whetstone-figure-top">
          <span>Planned burn area</span>
          <strong>87 <small>acres</small></strong>
        </div>
        <div className="fire-whetstone-area-bar" role="img" aria-label="Prairie 21 acres, north oak 33 acres, south oak 33 acres">
          {units.map((unit) => (
            <span key={unit.name} style={{ flexGrow: unit.acres }} title={`${unit.name}: ${unit.acres} planned acres`} />
          ))}
        </div>
        <div className="fire-whetstone-units">
          {units.map((unit) => (
            <div key={unit.name}>
              <span className="fire-whetstone-unit-name">{unit.name}</span>
              <strong>{unit.acres} acres</strong>
              <p>{unit.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="fire-whetstone-decision">
        <div>
          <span className="fire-eyebrow">Why here?</span>
          <p>
            The plan proposed fire to remove accumulated grass and litter,
            control invasive plants, and prepare ground for native seed. It
            aimed to protect vernal-pool habitat and keep the larger oaks,
            snags, and shrub patches that make the woodland valuable.
          </p>
        </div>
        <div>
          <span className="fire-eyebrow">Why not just light it?</span>
          <p>
            Prairie grasses and shaded oak litter dry at different rates.
            Planners allowed the three units to burn separately. Smoke could
            affect neighboring homes, roads, and Medford airport, so the plan
            called for suitable dispersal conditions and advance notice.
          </p>
        </div>
      </div>

      <ol className="fire-whetstone-sequence" aria-label="From plan to reported status">
        <li>
          <span>01 / Plan</span>
          <strong>Three units, different needs</strong>
          <p>The Nature Conservancy&apos;s plan describes 87 acres and the intended habitat effects.</p>
        </li>
        <li>
          <span>02 / Authorization</span>
          <strong>DEQ letter · June 6, 2023</strong>
          <p>Up to seven burn days during June 7–July 7, subject to other agency approvals and conditions.</p>
        </li>
        <li>
          <span>03 / Latest account</span>
          <strong>Likely canceled</strong>
          <p>On September 29, 2026, the DEQ coordinator corrected her earlier account: she believes the Whetstone burn was canceled because of staffing. We have not seen a final cancellation record.</p>
        </li>
      </ol>

      <div className="fire-whetstone-source">
        <p>
          <strong>Source:</strong> The Nature Conservancy&apos;s <cite>ODOT Whetstone Burn</cite> plan (2023),
          unit, purpose, and smoke sections; Oregon DEQ open burn letter permit
          15-OB-23-001 (June 6, 2023). Jennifer Horton of Oregon DEQ supplied
          both records and clarified the likely status in correspondence on September 29, 2026.
          A <a href="https://www.landconserve.org/news/2023/agaterxburn">separate Agate Desert Preserve burn</a>
          did go ahead nearby in June 2023.
        </p>
        <a href="https://www.oregon.gov/deq/aq/pages/burning-101.aspx">
          How DEQ letter permits work <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}
