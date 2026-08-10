import { dataset } from "@/lib/city-budget/data.server";
import { fmtExact, fmtMoney } from "@/lib/city-budget/types";

/**
 * The comparison that actually answers "what do we choose?".
 *
 * Two stacked bars of the same eight service areas. The left is all program
 * spending; the right is only the discretionary General Fund — the money
 * Council genuinely allocates each year rather than money already committed by
 * a rate, a levy, a grant, or a bond covenant.
 *
 * They look nothing alike, and that difference is the point: a budget's
 * priorities live in the money you can move.
 */

const AREA_COLOR: Record<string, string> = {
  "Public Safety": "#b85c3a",
  "Public Works": "#2d5f7e",
  "Community & Economic Development": "#3d7a5a",
  "City Administrator": "#c8956c",
  "City Operations": "#7c6f9e",
  "City Council": "#64748b",
  "Office of the City Auditor": "#8a8078",
  "Office of the Mayor": "#a8a29e",
};
const fallback = "#a8a29e";

export default function Priorities() {
  const CUR = 3;
  const at = (v: (number | null)[]) => v[CUR] ?? 0;

  const all = new Map<string, number>();
  const disc = new Map<string, number>();
  for (const p of dataset.programs) {
    all.set(p.serviceArea, (all.get(p.serviceArea) ?? 0) + at(p.total));
    const d = p.funding
      .filter((f) => f.gfSplit === "discretionary")
      .reduce((s, f) => s + (f.values[CUR] ?? 0), 0);
    if (d > 0) disc.set(p.serviceArea, (disc.get(p.serviceArea) ?? 0) + d);
  }

  const allTotal = [...all.values()].reduce((s, v) => s + v, 0);
  const discTotal = [...disc.values()].reduce((s, v) => s + v, 0);

  const order = [...all.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
  const rows = order.map((area) => ({
    area,
    all: all.get(area) ?? 0,
    allPct: ((all.get(area) ?? 0) / allTotal) * 100,
    disc: disc.get(area) ?? 0,
    discPct: ((disc.get(area) ?? 0) / discTotal) * 100,
  }));

  const safety = rows.find((r) => r.area === "Public Safety");

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Column
          title="Every dollar the City spends"
          total={allTotal}
          note="Includes water and sewer rates, gas taxes, federal grants, bond proceeds — money that arrives already committed to a purpose."
          rows={rows.map((r) => ({ area: r.area, v: r.all, pct: r.allPct }))}
        />
        <Column
          title="Only the dollars Council chooses"
          total={discTotal}
          note="Discretionary General Fund: the money not already promised to a rate payer, a grant, a levy, or a bond covenant."
          rows={rows.map((r) => ({ area: r.area, v: r.disc, pct: r.discPct }))}
          emphasis
        />
      </div>

      {safety && (
        <p className="max-w-3xl text-[15px] leading-relaxed text-[var(--color-ink-light)]">
          Public safety is{" "}
          <strong className="text-[var(--color-ink)]">{safety.allPct.toFixed(1)}%</strong> of what
          the City spends and{" "}
          <strong className="text-[var(--color-clay)]">{safety.discPct.toFixed(1)}%</strong> of what
          it actually decides. That gap is not a scandal and not an accident — most of the budget
          arrives spoken for, and police and fire are funded almost entirely from the one pot that
          isn&apos;t. But it means the annual budget fight is largely a fight about public safety,
          because that is where the movable money already sits.
        </p>
      )}
    </div>
  );
}

function Column({
  title,
  total,
  note,
  rows,
  emphasis,
}: {
  title: string;
  total: number;
  note: string;
  rows: { area: string; v: number; pct: number }[];
  emphasis?: boolean;
}) {
  const visible = rows.filter((r) => r.v > 0);
  return (
    <div
      className={`rounded-sm border bg-white p-5 sm:p-6 ${
        emphasis ? "border-[var(--color-ember)]/50" : "border-[var(--color-parchment)]"
      }`}
    >
      <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">{title}</h3>
      <p className="mt-1 font-mono text-[22px] font-bold tabular-nums text-[var(--color-canopy)]">
        {fmtExact(total)}
      </p>

      {/* One stacked bar, so the two panels can be compared at a glance. */}
      <div className="mt-4 flex h-9 w-full overflow-hidden rounded-sm border border-[var(--color-parchment)]">
        {visible.map((r) => (
          <div
            key={r.area}
            className="h-full"
            style={{
              width: `${r.pct}%`,
              backgroundColor: AREA_COLOR[r.area] ?? fallback,
            }}
            title={`${r.area}: ${fmtMoney(r.v)} (${r.pct.toFixed(1)}%)`}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-1.5">
        {visible.map((r) => (
          <li key={r.area} className="flex items-baseline gap-2">
            <span
              aria-hidden="true"
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: AREA_COLOR[r.area] ?? fallback }}
            />
            <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--color-ink-light)]">
              {r.area}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-[var(--color-ink-muted)]">
              {fmtMoney(r.v)}
            </span>
            <span className="w-12 shrink-0 text-right font-mono text-[12px] font-semibold tabular-nums text-[var(--color-ink)]">
              {r.pct.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-[var(--color-parchment)] pt-3 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        {note}
      </p>
    </div>
  );
}
