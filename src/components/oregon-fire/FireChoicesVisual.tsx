import { LESSON_SOURCES } from "@/lib/oregon-fire/lesson";

const choices = [
  { title: "Use planned fire", change: "Burn selected vegetation under a written plan and suitable conditions.", limit: "Preparation, smoke, weather and trained crews shape when it can happen.", kind: "fire" },
  { title: "Thin or remove fuel", change: "Change tree density or the path from ground fuels to crowns.", limit: "Cut material may still need to be removed or burned; work may need repeating.", kind: "thin" },
  { title: "Protect buildings", change: "Reduce routes for embers and flames to ignite a home or neighboring structure.", limit: "Home protection does not replace habitat or landscape work.", kind: "home" },
  { title: "Manage a wildfire", change: "Choose a response to an active event as conditions and objectives allow.", limit: "Its timing, weather, and spread are not controlled like a planned burn.", kind: "wildfire" },
] as const;

export default function FireChoicesVisual() {
  return <figure className="fire-choices-visual">
    <div className="fire-choices-header fire-figure-head"><div><span className="fire-eyebrow">The tool follows the goal</span><h3>Four choices, four different jobs.</h3></div><p>A project may use several of these. The real question is which objective each step serves in a particular place.</p></div>
    <div className="fire-choices-grid">{choices.map((choice, index) => <div key={choice.kind} className={`fire-choice-${choice.kind}`}>
      <span className="fire-choice-number">0{index + 1}</span><h4>{choice.title}</h4><p>{choice.change}</p><small>{choice.limit}</small>
    </div>)}</div>
    <figcaption>General explanation from <a href={LESSON_SOURCES.planning.url}>OSU Extension&apos;s burn planning guide ↗</a>, <a href={LESSON_SOURCES.adaptation.url}>the Forest Service&apos;s climate and fire review ↗</a>, and <a href={LESSON_SOURCES.homes.url}>NIST&apos;s account of building ignition ↗</a>. These are possible approaches, not documented alternatives for Woodpecker or Whetstone.</figcaption>
  </figure>;
}
