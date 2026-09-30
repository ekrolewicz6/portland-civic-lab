import { REGIONS, SOURCES } from "@/lib/datacenters/data";
/** Schematic geography supports questions; no unsupported probability or feasibility score. */
export default function SitingMap() {
  return <div className="grid gap-6 lg:grid-cols-2">
    <div>
      <div className="dc-region-map"><svg viewBox="0 0 440 320" className="w-full h-auto" role="img" aria-label="Oregon map showing the approximate locations of six regions discussed below">
        <path d="M42,62 L96,54 L140,64 L198,48 L252,50 L292,42 L340,44 L386,48 L378,88 L394,118 L386,150 L390,270 L56,276 L40,222 L50,142 Z" fill="#f7f3ed" stroke="#1a3a2a" strokeWidth="1.5" />

      </svg>
      {REGIONS.map((r,i) => <span key={r.id} className="dc-map-marker" aria-hidden="true" style={{left: `${r.x / 440 * 100}%`,top: `${r.y / 320 * 100}%`}}>{i+1}</span>)}
      </div>
      <ol className="dc-map-key">{REGIONS.map((r,i) => <li key={r.id}><strong>{i+1}</strong><span>{r.towns}</span></li>)}</ol>
      <p className="text-[.9375rem] leading-relaxed text-[var(--color-ink-muted)]">These are questions we suggest asking in each region. The map shows approximate locations, not exact project sites. It does not show whether a site has enough power, water or internet access.</p>
    </div>
    <div className="space-y-3">{REGIONS.map((r,i) => <article key={r.id} className="border border-[var(--color-parchment)] rounded-sm bg-white p-4">
      <h4 className="font-semibold">{i+1}. {r.name}</h4><p className="mt-2 text-base font-medium">{r.question}</p>
      <p className="mt-2 text-base leading-relaxed">{r.evidenceNeeded}</p>
      <a className="mt-2 inline-block text-[.9375rem] underline text-[var(--color-river-deep)]" href={SOURCES[r.sourceId].url}>{SOURCES[r.sourceId].org}</a>
    </article>)}</div>
  </div>;
}
