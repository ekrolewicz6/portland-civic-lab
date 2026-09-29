import { REGIONS, SOURCES } from "@/lib/datacenters/data";
/** Schematic geography supports questions; no unsupported probability or feasibility score. */
export default function SitingMap() {
  return <div className="grid gap-6 lg:grid-cols-2">
    <div>
      <svg viewBox="0 0 440 320" className="w-full h-auto" role="img" aria-label="Schematic Oregon map locating six regions discussed below">
        <path d="M42,62 L96,54 L140,64 L198,48 L252,50 L292,42 L340,44 L386,48 L378,88 L394,118 L386,150 L390,270 L56,276 L40,222 L50,142 Z" fill="#f7f3ed" stroke="#1a3a2a" strokeWidth="1.5" />
        {REGIONS.map(r => <g key={r.id}><circle cx={r.x} cy={r.y} r="6" fill="#4a7f9e" /><text x={r.x} y={r.y + 22} textAnchor="middle" fontSize="11" fill="#44403c">{r.towns}</text></g>)}
      </svg>
      <p className="text-xs leading-relaxed text-[var(--color-ink-muted)]">Editorial questions by region. Markers are schematic. They do not rank sites, measure bargaining power or establish infrastructure availability.</p>
    </div>
    <div className="space-y-3">{REGIONS.map(r => <article key={r.id} className="border border-[var(--color-parchment)] rounded-sm bg-white p-4">
      <h4 className="font-semibold">{r.name}</h4><p className="mt-2 text-sm font-medium">{r.question}</p>
      <p className="mt-2 text-sm leading-relaxed">{r.evidenceNeeded}</p>
      <a className="mt-2 inline-block text-xs underline text-[var(--color-river-deep)]" href={SOURCES[r.sourceId].url}>{SOURCES[r.sourceId].org}</a>
    </article>)}</div>
  </div>;
}
