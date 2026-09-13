"use client";
import {
  ArrowUpRight,
  Wind,
  CloudRain,
  Users,
  ClipboardList,
  Leaf,
} from "lucide-react";
import { SEASONS, GUIDE_SOURCES } from "@/lib/oregon-fire/guide";
import { useGuideChoice } from "./guide-navigation";
const factors = [
  {
    id: "weather",
    name: "Weather",
    icon: CloudRain,
    title: "Conditions must fit this particular plan.",
    text: "Wind, humidity, temperature, and the forecast influence fire behavior. A seasonal opportunity is not an approval to burn. Conditions must continue to be monitored after ignition.",
  },
  {
    id: "fuels",
    name: "Fuels",
    icon: Leaf,
    title: "Too wet and too dry can both be problems.",
    text: "A burn needs to affect the intended vegetation and fuels without exceeding its objectives. Damp fuels can produce patchy effects; dry conditions can make control harder.",
  },
  {
    id: "smoke",
    name: "Smoke",
    icon: Wind,
    title: "The people downwind matter.",
    text: "Planners consider smoke dispersal, communities, roads, and sensitive locations. Planned fire still produces harmful smoke. Nearby smoke measurements alone cannot identify which burn caused them.",
  },
  {
    id: "people",
    name: "People & equipment",
    icon: Users,
    title: "An opportunity needs a prepared crew.",
    text: "A plan identifies the people, equipment, communication, and contingencies needed. A weather window does not guarantee that those resources are available.",
  },
  {
    id: "plan",
    name: "Preparation & approvals",
    icon: ClipboardList,
    title: "The work starts before ignition.",
    text: "Site preparation, objectives, notifications, permits, and agency requirements must be addressed. A plan or permit in this atlas does not establish that burning actually happened.",
  },
];
const goals = [
  {
    id: "community",
    name: "Communities",
    question: "Are people and essential places better protected?",
    measures: [
      "Documented changes in exposure and vulnerability",
      "Homes and infrastructure assessed against a stated objective",
      "Smoke impacts, disruption, and who bears them",
    ],
    limit:
      "Acres treated or lower vegetation severity alone do not prove that homes were protected.",
    strategies: [
      "Identify where fuel work supports a specific community objective; measure the result.",
      "Consider treatment of remaining surface fuels, local ecology, and maintenance needs.",
      "Protect people and critical assets; evaluate outcomes and responder exposure.",
      "Only where agency decisions, conditions, and protection objectives allow.",
    ],
  },
  {
    id: "habitat",
    name: "Habitat & cultural priorities",
    question: "Did the intended plants, animals, and relationships benefit?",
    measures: [
      "Repeated observations of target species and habitat structure",
      "Invasive species and unintended effects",
      "Partner-defined cultural objectives and permission to report them",
    ],
    limit:
      "Satellite greenness cannot identify every species or determine whether cultural objectives were met.",
    strategies: [
      "Use documented habitat objectives and monitor target species.",
      "Evaluate which vegetation to retain or remove; avoid assuming all habitats need thinning.",
      "Protect sensitive places while considering the consequences of continued fire exclusion.",
      "Assess whether observed effects meet local ecological objectives.",
    ],
  },
  {
    id: "forest",
    name: "Forest condition",
    question: "Is this forest better able to sustain its intended functions?",
    measures: [
      "Surviving trees, regeneration, and species composition",
      "Surface fuels and the need for repeat work",
      "Drought, later fire, and observations over several years",
    ],
    limit:
      "A returning vegetation signal is one measure. Tree structure, species, and fuels can follow different paths.",
    strategies: [
      "Match the objective to forest type and current conditions.",
      "Evidence supports lower later wildfire severity in studied forests; effects vary and can decline over time.",
      "Consider protection needs and the long-term consequences of repeated exclusion.",
      "Document actual effects rather than automatically classifying wildfire as restoration.",
    ],
  },
];
export default function FireDecisions() {
  const [season, setSeason] = useGuideChoice(
    "season",
    SEASONS.map((s) => s.id),
    "fall",
  );
  const s = SEASONS.find((x) => x.id === season)!;
  const [factor, setFactor] = useGuideChoice(
    "factor",
    factors.map((f) => f.id),
    "weather",
  );
  const f = factors.find((x) => x.id === factor)!;
  const [goal, setGoal] = useGuideChoice(
    "goal",
    goals.map((g) => g.id),
    "forest",
  );
  const g = goals.find((x) => x.id === goal)!;
  return (
    <>
      <section
        id="burn-windows"
        className="fire-guide-section fire-planning"
        aria-labelledby="planning-title"
      >
        <div className="fire-section-head">
          <div>
            <span className="fire-eyebrow">Behind the decision</span>
            <h2 id="planning-title">Why don’t we just burn more?</h2>
          </div>
          <p>
            The right opportunity is a combination of conditions, preparation,
            people, and purpose.
          </p>
        </div>
        <div
          className="fire-season-grid"
          role="group"
          aria-label="Explore the burn-planning year"
        >
          {SEASONS.map((v) => (
            <button
              key={v.id}
              onClick={() => setSeason(v.id)}
              aria-pressed={season === v.id}
            >
              <span>{v.months}</span>
              <strong>{v.name}</strong>
              <i />
            </button>
          ))}
        </div>
        <div className="fire-season-reading" aria-live="polite">
          <span className="fire-eyebrow">
            {s.name} · an illustrative seasonal guide
          </span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </div>
        <div
          className="fire-factor-grid"
          role="group"
          aria-label="What a burn needs"
        >
          {factors.map((v) => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                aria-pressed={v.id === factor}
                onClick={() => setFactor(v.id)}
              >
                <Icon size={22} />
                {v.name}
              </button>
            );
          })}
        </div>
        <div className="fire-factor-reading" aria-live="polite">
          <h3>{f.title}</h3>
          <p>{f.text}</p>
        </div>
        <div className="fire-planning-footer">
          <p>
            This explains decisions; it is not a live forecast or a go/no-go
            tool. We do not infer why an individual burn was delayed from a
            missing feed record.
          </p>
          <a href={GUIDE_SOURCES.planning}>
            What goes into a burn plan
            <ArrowUpRight size={14} />
          </a>
          <a href={GUIDE_SOURCES.weather}>
            How weather changes the window
            <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
      <section
        id="what-success-means"
        className="fire-guide-section fire-success"
        aria-labelledby="success-title"
      >
        <div className="fire-section-head">
          <div>
            <span className="fire-eyebrow">
              What should good management achieve?
            </span>
            <h2 id="success-title">
              Choose the goal.
              <br />
              <em>Then ask for the evidence.</em>
            </h2>
          </div>
          <p>
            “More acres burned” measures activity. Success depends on what a
            particular place and its communities need.
          </p>
        </div>
        <div
          className="fire-success-tabs"
          role="group"
          aria-label="Management objective"
        >
          {goals.map((v) => (
            <button
              key={v.id}
              aria-pressed={goal === v.id}
              onClick={() => setGoal(v.id)}
            >
              {v.name}
            </button>
          ))}
        </div>
        <div className="fire-success-evidence" aria-live="polite">
          <h3>{g.question}</h3>
          <ol>
            {g.measures.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ol>
          <p>{g.limit}</p>
        </div>
        <div className="fire-options-table">
          <table>
            <caption>
              Questions to ask about management options · {g.name}
            </caption>
            <thead>
              <tr>
                <th scope="col">An option</th>
                <th scope="col">What to examine</th>
              </tr>
            </thead>
            <tbody>
              {[
                "Prescribed fire",
                "Thinning with follow-up fuel treatment",
                "Wildfire suppression",
                "Managing naturally ignited fire",
              ].map((label, i) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{g.strategies[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="fire-guide-note">
          These options are not interchangeable or universally available.
          Decisions depend on ownership, policy, ecology, weather, and
          protection needs. A useful project review also names who decided,
          alternatives considered, costs, and public participation
          opportunities.
        </p>
        <div className="fire-success-bottom">
          <div>
            <strong>Our progress measure for now</strong>
            <p>
              For each story above: an explicit objective, a documented
              observation, and the missing evidence. Costs and measured local
              outcomes are shown as missing when we have not obtained them. We
              have not calculated an Oregon-wide “good fire” percentage.
            </p>
          </div>
          <a href="https://research.fs.usda.gov/rmrs/articles/how-do-thinning-prescribed-fire-and-wildfire-affect-future-wildfire-severity">
            Read the treatment research
            <ArrowUpRight size={15} />
          </a>
        </div>
      </section>
      <section className="fire-today" aria-labelledby="today-title">
        <div>
          <span className="fire-eyebrow">For today, not just history</span>
          <h2 id="today-title">Smoke in your sky?</h2>
          <p>
            A fire near you is not automatically the source of your smoke. Use
            current official information alongside this historical atlas.
          </p>
          <a href={GUIDE_SOURCES.smoke}>
            Understand smoke tradeoffs
            <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="fire-today-links">
          <a href="https://fire.airnow.gov/">
            Current air quality & smoke
            <ArrowUpRight size={17} />
            <span>AirNow Fire and Smoke Map</span>
          </a>
          <a href="https://wildfire.oregon.gov/pages/evacuations.aspx">
            Evacuation information
            <ArrowUpRight size={17} />
            <span>Oregon’s official wildfire resources</span>
          </a>
          <a href="https://www.oregon.gov/oem/Pages/default.aspx">
            Emergency updates & local alerts
            <ArrowUpRight size={17} />
            <span>Oregon Emergency Management</span>
          </a>
        </div>
      </section>
    </>
  );
}
