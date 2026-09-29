import { SOURCES, WIN_WIN_CONDITIONS } from "@/lib/datacenters/data";
export default function ConditionsScorecard() {
  return <div className="space-y-4">{WIN_WIN_CONDITIONS.map((c, i) =>
    <article key={c.condition} className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
      <p className="text-xs font-mono uppercase text-[var(--color-river-deep)]">{c.status === "partial" ? "Partial coverage" : "Not established statewide"}</p>
      <h3 className="mt-2 text-lg font-semibold text-[var(--color-canopy)]">{i + 1}. {c.condition}</h3>
      <p className="mt-2 text-sm leading-relaxed">{c.evidence} <a className="underline text-[var(--color-river-deep)]" href={SOURCES[c.sourceId].url}>Source: {SOURCES[c.sourceId].org}</a></p>
      <details className="mt-3">
        <summary className="cursor-pointer py-2 text-sm font-semibold">Proposed requirement and enforcement</summary>
        <dl className="mt-2 space-y-3 text-sm leading-relaxed">
          {[["Responsible authority", c.authority], ["Before approval", c.requirement], ["Public reporting", c.reporting], ["If the commitment is missed", c.enforcement]].map(([title, value]) =>
            <div key={title}><dt className="font-semibold">{title}</dt><dd>{value}</dd></div>)}
        </dl>
      </details>
    </article>)}</div>;
}
