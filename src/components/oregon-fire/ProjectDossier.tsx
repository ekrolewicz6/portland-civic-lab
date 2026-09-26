import Link from "next/link";
import type { FireProject } from "@/lib/oregon-fire/projects";

export default function ProjectDossier({ project: p }: { project: FireProject }) {
  return <>
    <section className="fire-dossier-section" id="objectives"><span className="fire-eyebrow">01 / The decision</span><h2>Why this place?</h2><p>{p.selection}</p>
      <div className="fire-objective-cards">{p.objectives.map((o) => <div key={o.id}><span className="fire-eyebrow">Reported objective</span><h3>{o.title}</h3><p>{o.text}</p></div>)}</div>
      <details><summary>Which alternatives were considered?</summary><p>{p.alternatives}</p></details>
    </section>
    <section className="fire-dossier-section" id="timeline"><span className="fire-eyebrow">02 / The work</span><h2>A sequence, not a single number.</h2>
      <ol className="fire-project-timeline">{p.activities.map((a) => <li key={a.id}><span>{a.date}<small>{a.precision === "month" ? "Month reported; exact date unavailable" : "Relative timing; exact date unavailable"}</small></span><div><h3>{a.label}</h3><p>{a.text}</p><small>{a.type} · {a.status}</small></div></li>)}</ol>
      <p className="fire-guide-note">{p.geometryMeaning}</p><Link className="fire-guide-primary" href={`/oregon-fire?kind=all&bbox=${p.bbox.join(",")}#explore`}>Explore the surrounding region →</Link>
    </section>
    <section className="fire-dossier-section" id="outcomes"><span className="fire-eyebrow">03 / The evidence</span><h2>Did the work help?</h2>
      {p.outcomes.map((o) => <div className="fire-outcome-row" key={o.objective}><div><span className="fire-eyebrow">Objective</span><h3>{o.objective}</h3></div><div><span className="fire-eyebrow">Observed</span><p>{o.observation}</p></div><div><span className="fire-eyebrow">Still unknown</span><p>{o.limitation}</p></div></div>)}
      <p>Acres treated describe work. Ecological outcomes need observations tied to the original objective, with dates and methods.</p>
    </section>
    <section className="fire-dossier-section" id="costs"><span className="fire-eyebrow">04 / Resources & burdens</span><h2>What does this number pay for?</h2>
      {p.costs.length ? p.costs.map((c, i) => <p key={i}>{new Intl.NumberFormat("en-US", { style: "currency", currency: c.currency }).format(c.amount)} · {c.status} · {c.scope} · {c.reportedAt}</p>) : <p>Itemized costs have not been obtained for this project. Missing cost is not zero.</p>}
      <div className="fire-cost-categories">{["Planning & preparation", "Treatment delivery", "Monitoring & maintenance", "Incident response", "Damage & losses", "Funding & receipts"].map((c) => <span key={c}>{c}</span>)}</div>
      <p className="fire-guide-note">These categories pay for different things. A response estimate is not a treatment budget; cost per acre alone does not establish savings or success. Smoke and other community burdens need their own observations.</p>
    </section>
    <section className="fire-dossier-section" id="evidence"><span className="fire-eyebrow">05 / Open record</span><h2>What we know. What we need.</h2>
      <ul className="fire-missing-list">{p.unknowns.map((u) => <li key={u}>{u}</li>)}</ul>
      {p.evidence.filter((e) => e.approved).map((e) => <div className="fire-evidence-card" key={e.id}><a href={e.url}>{e.title} ↗</a><p>{e.publisher} · {e.publishedAt ?? "Publication date not provided"}</p><small>{e.locator} · Checked {e.retrievedAt}. {e.scope}. {e.rights}.</small></div>)}
      <p className="fire-guide-note">{p.review}</p><p><Link href="/api/oregon-fire/projects/export" prefetch={false}>Download project activities with sources (CSV) ↓</Link></p>
      <Link className="fire-guide-primary" href={`/contact?topic=Data+correction&project=Oregon+Fire+Map&fireRecord=project:${p.id}`}>Contribute a record or correction →</Link><p className="fire-guide-note">Include a source, the proposed correction, and your publication preference. Contributions remain private until reviewed.</p>
    </section>
  </>;
}
