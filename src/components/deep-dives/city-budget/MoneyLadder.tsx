import { dataset } from "@/lib/city-budget/data.server";
import { fmtExact, fmtMoney, YEARS, type FiscalYear } from "@/lib/city-budget/types";

/**
 * Every program, nested and exhaustive, built from native <details>.
 *
 * This is not a fallback bolted on afterwards — it is the primary surface on a
 * phone (where a six-column Sankey is noise), the screen-reader path on every
 * viewport, and the version that works with JavaScript off. Native <details>
 * gets keyboard support, correct semantics, and browser Cmd+F for free.
 *
 * It is also the exact half of the pairing: the diagram shows proportion, this
 * shows the number.
 */
export default function MoneyLadder({ year = "2026-27" as FiscalYear }: { year?: FiscalYear }) {
  const yi = YEARS.indexOf(year);
  const at = (v: (number | null)[]) => v[yi] ?? 0;

  const areas = new Map<string, { total: number; bureaus: typeof dataset.bureaus }>();
  for (const b of dataset.bureaus) {
    if (at(b.values) <= 0) continue;
    const a = areas.get(b.serviceArea) ?? { total: 0, bureaus: [] };
    a.total += at(b.values);
    a.bureaus.push(b);
    areas.set(b.serviceArea, a);
  }
  const cityTotal = [...areas.values()].reduce((s, a) => s + a.total, 0);
  const sorted = [...areas.entries()].sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--color-parchment)] px-4 py-3">
        <h3 className="text-[14px] font-semibold text-[var(--color-ink)]">
          Every program, by service area
        </h3>
        <span className="font-mono text-[12px] tabular-nums text-[var(--color-ink-muted)]">
          {fmtExact(cityTotal)} · {dataset.programs.length} programs
        </span>
      </div>

      <div className="divide-y divide-[var(--color-parchment)]">
        {sorted.map(([area, a]) => (
          <details key={area} className="group">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-paper-warm)]">
              <Caret />
              <span className="min-w-0 flex-1 text-[13px] font-semibold text-[var(--color-ink)]">
                {area}
              </span>
              <Bar pct={(a.total / cityTotal) * 100} />
              <span className="w-24 shrink-0 text-right font-mono text-[12px] font-semibold tabular-nums text-[var(--color-ink)]">
                {fmtMoney(a.total)}
              </span>
              <span className="w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-[var(--color-ink-muted)]">
                {((a.total / cityTotal) * 100).toFixed(1)}%
              </span>
            </summary>

            {a.bureaus
              .sort((x, y) => at(y.values) - at(x.values))
              .map((b) => {
                const progs = dataset.programs
                  .filter((p) => p.bureauSlug === b.slug && at(p.total) > 0)
                  .sort((x, y) => at(y.total) - at(x.total));
                return (
                  <details key={b.slug} className="border-t border-[var(--color-parchment)]">
                    <summary className="flex cursor-pointer list-none items-center gap-3 py-2 pl-9 pr-4 hover:bg-[var(--color-paper-warm)]">
                      <Caret />
                      <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--color-ink)]">
                        {b.name}
                      </span>
                      <Bar pct={(at(b.values) / a.total) * 100} />
                      <span className="w-24 shrink-0 text-right font-mono text-[12px] tabular-nums text-[var(--color-ink)]">
                        {fmtMoney(at(b.values))}
                      </span>
                      <span className="w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-[var(--color-ink-muted)]">
                        {((at(b.values) / cityTotal) * 100).toFixed(1)}%
                      </span>
                    </summary>

                    <ul className="border-t border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
                      {progs.map((p) => (
                        <li
                          key={p.slug}
                          className="flex items-center gap-3 border-b border-[var(--color-parchment)]/60 py-1.5 pl-16 pr-4 last:border-b-0"
                        >
                          <span className="min-w-0 flex-1 truncate text-[12px] text-[var(--color-ink-light)]">
                            {p.name}
                          </span>
                          <Bar pct={(at(p.total) / at(b.values)) * 100} />
                          <span className="w-24 shrink-0 text-right font-mono text-[12px] tabular-nums text-[var(--color-ink)]">
                            {fmtExact(at(p.total))}
                          </span>
                          <span className="w-12 shrink-0 text-right font-mono text-[10px] tabular-nums text-[var(--color-ink-muted)]">
                            {at(p.fte) > 0 ? `${at(p.fte).toFixed(0)} FTE` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
          </details>
        ))}
      </div>
    </div>
  );
}

function Caret() {
  return (
    <span
      aria-hidden="true"
      className="shrink-0 select-none font-mono text-[10px] text-[var(--color-ink-muted)] transition-transform group-open:rotate-90"
    >
      ▶
    </span>
  );
}

/** Bar is scaled to the PARENT, which is how people reason about a share. */
function Bar({ pct }: { pct: number }) {
  return (
    <span
      aria-hidden="true"
      className="hidden h-1.5 w-28 shrink-0 overflow-hidden rounded-sm bg-[var(--color-parchment)] sm:block"
    >
      <span
        className="block h-full rounded-sm bg-[var(--color-canopy)]"
        style={{ width: `${Math.min(100, Math.max(0.5, pct))}%` }}
      />
    </span>
  );
}
