import { CONTINUUM, PATHWAYS, PHASES } from "@/lib/homeless/continuum";
import { PLACEMENT_COHORTS } from "@/lib/homeless/data";
import type { CountStatus } from "@/lib/homeless/continuum-types";
import { shy } from "@/lib/homeless/shy";

/**
 * The continuum, drawn: all fourteen stages in one view on wide screens,
 * grouped by phase, each with its clock, whether anyone can count who is in
 * it, and the best number Portland has. On narrow screens the same cells
 * stack into a list. Below it, which cohort passes through which stage, in
 * what order. Server component.
 */

const STATUS: Record<CountStatus, { label: string; cls: string; dot: string }> = {
  known: { label: "counted", cls: "text-[var(--color-fern)]", dot: "bg-[var(--color-fern)]" },
  partial: { label: "partly", cls: "text-[#a9784f]", dot: "bg-[var(--color-ember)]" },
  unknown: { label: "not counted", cls: "text-[var(--color-clay)]", dot: "bg-[var(--color-clay)]" },
};

const COLS = "xl:grid-cols-[repeat(14,minmax(0,1fr))]";

export default function ContinuumMap() {
  const cohortNames = new Map(PLACEMENT_COHORTS.map((c) => [c.id, c.cohort]));
  const counted = CONTINUUM.filter((s) => s.count.status === "known").length;
  const partial = CONTINUUM.filter((s) => s.count.status === "partial").length;
  const phaseOf = new Map(PHASES.map((p) => [p.key, p]));

  return (
    <div className="space-y-5">
      {/* Stage map */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--color-parchment)] px-5 pt-4 pb-3 sm:px-6">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">The continuum, left to right</p>
          <p className="font-mono text-[11px] tabular-nums text-[var(--color-ink-muted)]">
            {counted} counted · {partial} partly · <span className="text-[var(--color-clay)]">{CONTINUUM.length - counted - partial} not counted at all</span>
          </p>
        </div>

        <div className={`grid gap-1 px-4 py-4 sm:px-5 ${COLS}`}>
          {/* Phase headers: one per phase, spanning its stages on xl; a full-width band on small screens */}
          {PHASES.map((p) => {
            const n = CONTINUUM.filter((s) => s.phase === p.key).length;
            return (
              <div
                key={p.key}
                className="hidden xl:block xl:[grid-column:span_var(--span)] border-t-[3px] pt-1.5"
                style={{ ["--span" as string]: n, borderColor: p.color }}
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: p.color }}>{p.label}</p>
                <p className="text-[10.5px] leading-tight text-[var(--color-ink-muted)]">{p.sub}</p>
              </div>
            );
          })}

          {/* Stage cells */}
          {CONTINUUM.map((s, i) => {
            const st = STATUS[s.count.status];
            const p = phaseOf.get(s.phase);
            const firstOfPhase = i === 0 || CONTINUUM[i - 1].phase !== s.phase;
            return (
              <div key={s.id} className="contents">
                {firstOfPhase ? (
                  <div className="mt-3 flex items-center gap-2 border-t-[3px] pt-1.5 first:mt-0 xl:hidden" style={{ borderColor: p?.color }}>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: p?.color }}>{p?.label}</span>
                    <span className="text-[11px] text-[var(--color-ink-muted)]">{p?.sub}</span>
                  </div>
                ) : null}
                <div className="flex items-start gap-3 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-2.5 py-2.5 xl:flex-col xl:gap-1 xl:px-1.5 xl:py-2">
                  <div className="flex w-8 shrink-0 items-center justify-between xl:w-full">
                    <span className="font-mono text-[10px] font-bold text-[var(--color-ink-muted)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`h-2 w-2 rounded-full ${st.dot}`} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 xl:flex xl:w-full xl:flex-1 xl:flex-col">
                    <p className="text-[12px] font-semibold leading-tight text-[var(--color-canopy)] xl:text-[10.5px]">{shy(s.name)}</p>
                    <p className="mt-0.5 font-mono text-[9.5px] leading-snug text-[var(--color-ink-muted)] [overflow-wrap:anywhere]">{s.duration.split(";")[0].split(".")[0]}</p>
                    <div className="mt-1.5 xl:mt-auto xl:pt-2">
                      <p className={`font-mono text-[9px] font-semibold uppercase tracking-[0.12em] ${st.cls}`}>{st.label}</p>
                      <p className="text-[10px] leading-snug text-[var(--color-ink-light)] tabular-nums hyphens-auto [overflow-wrap:anywhere]" title={s.count.what}>{s.count.portlandToday}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="border-t border-[var(--color-parchment)] px-5 py-3 text-[12px] leading-relaxed text-[var(--color-ink-muted)] sm:px-6">
          <span className="font-semibold text-[var(--color-fern)]">Counted</span> means a published figure exists for who is in the stage now.{" "}
          <span className="font-semibold text-[#a9784f]">Partly</span> means capacity or annual throughput is published but not who is there today.{" "}
          <span className="font-semibold text-[var(--color-clay)]">Not counted</span> means nobody can say. The number under each stage is the best one Portland has, on whatever basis it exists.
        </p>
      </div>

      {/* Cohort × stage matrix */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 pt-4 pb-3 sm:px-6">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">Who passes through which stage, in what order</p>
          <p className="font-mono text-[11px] text-[var(--color-ink-muted)]">numbers are the step order for that cohort</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-[12px] xl:min-w-0 xl:table-fixed">
            <thead>
              <tr className="border-y border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
                <th className="sticky left-0 z-10 w-[176px] bg-[var(--color-paper-warm)] px-4 py-2 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)] sm:px-5">Cohort</th>
                {CONTINUUM.map((s) => (
                  <th key={s.id} className="px-1 py-2 text-center align-bottom font-medium leading-tight text-[var(--color-ink-light)]">
                    <span className="block text-[10.5px]">{shy(s.name)}</span>
                  </th>
                ))}
                <th className="w-[96px] px-2 py-2 text-left align-bottom font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {PATHWAYS.map((p) => {
                const order = new Map(p.steps.map((id, i) => [id, i + 1]));
                return (
                  <tr key={p.cohort} className="border-b border-[var(--color-parchment)] last:border-b-0">
                    <td className="sticky left-0 z-10 bg-white px-4 py-2.5 text-[12.5px] font-semibold leading-tight text-[var(--color-ink)] sm:px-5">
                      {cohortNames.get(p.cohort) ?? p.cohort}
                    </td>
                    {CONTINUUM.map((s) => {
                      const n = order.get(s.id);
                      const first = n === 1;
                      return (
                        <td key={s.id} className="px-1 py-2.5 text-center">
                          {n ? (
                            <span
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-bold ${
                                first ? "bg-[var(--color-ember)] text-[var(--color-canopy)]" : "bg-[var(--color-canopy)]/10 text-[var(--color-canopy)]"
                              }`}
                              title={`${cohortNames.get(p.cohort)}: step ${n} is ${s.name}`}
                            >
                              {n}
                            </span>
                          ) : null}
                        </td>
                      );
                    })}
                    <td className="px-2 py-2.5">
                      <span className="font-mono text-[9.5px] uppercase leading-tight tracking-[0.08em] text-[var(--color-ink-muted)]">{p.evidence}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="border-t border-[var(--color-parchment)] px-5 py-3 text-[12px] leading-relaxed text-[var(--color-ink-muted)] sm:px-6">
          The <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-ember)] align-middle font-mono text-[9px] font-bold text-[var(--color-canopy)]">1</span> is the first placement that has to exist for that person. Most failures are the wrong first door, not the wrong last one.
        </p>
      </div>
    </div>
  );
}
