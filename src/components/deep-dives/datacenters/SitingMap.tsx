import { REGIONS, type SitingPosture } from "@/lib/datacenters/data";

const POSTURE: Record<SitingPosture, { label: string; color: string; bg: string }> = {
  "price-right": { label: "Good at the right price", color: "#3d7a5a", bg: "#e3efe7" },
  conditional: { label: "Conditional", color: "#c8956c", bg: "#f6ecd9" },
  "pull-back": { label: "Pull back", color: "#b85c3a", bg: "#f6e7df" },
  "not-viable": { label: "Not viable", color: "#78716c", bg: "#f0eeec" },
};

/**
 * Schematic siting map: where a deal can pencil, where it can't, and why.
 * The outline is stylized — postures come from the same variables as the
 * calculator (leverage, water, grid), not from a GIS analysis.
 */
export default function SitingMap() {
  return (
    <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-6 items-start">
      {/* ── Map ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
        <svg viewBox="0 0 440 320" className="w-full h-auto" role="img" aria-label="Schematic map of Oregon data center siting regions">
          {/* stylized Oregon outline */}
          <path
            d="M 42,62 L 96,54 L 140,64 L 198,48 L 252,50 L 292,42 L 340,44 L 386,48
               L 378,88 L 394,118 L 386,150 L 390,270 L 56,276 L 40,222 L 50,142 Z"
            fill="#f7f3ed"
            stroke="#1a3a2a"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Columbia River hint */}
          <path
            d="M 42,62 L 96,54 L 140,64 L 198,48 L 252,50 L 292,42"
            fill="none"
            stroke="#4a7f9e"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.55"
          />
          {REGIONS.map((r) => {
            const p = POSTURE[r.posture];
            return (
              <g key={r.id}>
                <circle cx={r.x} cy={r.y} r="11" fill={p.color} opacity="0.18" />
                <circle cx={r.x} cy={r.y} r="5" fill={p.color} />
                <text
                  x={r.x}
                  y={r.y + 24}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fill="#44403c"
                >
                  {r.towns.split(",")[0]}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {(Object.keys(POSTURE) as SitingPosture[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-[11px] text-[var(--color-ink-light)]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: POSTURE[k].color }} />
              {POSTURE[k].label}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-[var(--color-ink-muted)] leading-snug">
          Schematic, not a survey — each verdict comes from the region&apos;s leverage, water, and
          grid position. Same variables as the calculator.
        </p>
      </div>

      {/* ── Region verdicts ── */}
      <div className="space-y-3">
        {REGIONS.map((r) => {
          const p = POSTURE[r.posture];
          return (
            <div key={r.id} className="rounded-sm border border-[var(--color-parchment)] bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-[14px] font-semibold text-[var(--color-ink)]">{r.name}</h4>
                <span
                  className="rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: p.color, backgroundColor: p.bg }}
                >
                  {p.label}
                </span>
              </div>
              <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-light)] leading-relaxed">
                {r.verdict}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-[var(--color-ink-muted)]">
                <span>
                  <span className="font-mono uppercase tracking-wide">Leverage</span> ~
                  {r.preset.leveragePct}%
                </span>
                <span>
                  <span className="font-mono uppercase tracking-wide">Water</span> {r.water}
                </span>
                <span>
                  <span className="font-mono uppercase tracking-wide">Grid</span> {r.grid}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
