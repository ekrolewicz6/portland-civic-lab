import { RATE_SHIFT, SOURCES } from "@/lib/datacenters/data";

/**
 * The POWER Act rate split, on a dark section: who pays more, who pays less.
 * Bars are scaled against the largest absolute change.
 */
export default function RateShift() {
  const maxAbs = Math.max(...RATE_SHIFT.map((r) => Math.abs(r.changePct)));
  return (
    <div className="rounded-sm border border-white/12 bg-white/[0.05] p-6 backdrop-blur">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember-bright)]">
        How PGE’s electricity rates changed
      </div>
      <p className="mt-1.5 text-[12px] text-white/55">
        PGE’s new rates took effect July 8, 2026, under the POWER Act, Oregon’s law addressing large electricity users.
      </p>
      <div className="mt-5 space-y-5">
        {RATE_SHIFT.map((r) => {
          const up = r.changePct > 0;
          return (
            <div key={r.who}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[13px] font-semibold text-white">{r.who}</span>
                <span
                  className={`font-mono text-[22px] font-bold tabular-nums leading-none ${
                    up ? "text-[var(--color-ember-bright)]" : "text-[var(--color-lichen)]"
                  }`}
                >
                  {up ? "+" : ""}
                  {r.changePct}%
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full rounded-sm bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: `${(Math.abs(r.changePct) / maxAbs) * 100}%`,
                    backgroundColor: up ? "#e0a870" : "#a8c5b2",
                  }}
                />
              </div>
              <p className="mt-1.5 text-[12px] text-white/55 leading-relaxed">{r.detail}</p>
            </div>
          );
        })}
      </div>
      <a href={SOURCES.pgeRates.url} className="mt-5 inline-block text-xs text-white/75 underline underline-offset-2">Source: PGE’s financial filing describing the July 8 changes</a>
    </div>
  );
}
