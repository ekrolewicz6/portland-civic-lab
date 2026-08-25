import { PHASES } from "@/lib/venues/data";

/**
 * §11: the four-phase, ten-year strategy as a vertical timeline.
 *
 * Server component, light context. Each phase hangs off a continuous left
 * rail (border-l parchment) that doubles as a year axis: a small mono year
 * tick sits on the line at every phase boundary (2026, 2027, 2030, 2033)
 * with a closing 2036 tick at the end of the rail. Each phase's roman
 * numeral rides the rail as a filled square node rotated 45 degrees, per
 * the site's marker convention. Phase I is the current phase (we are
 * inside Aug 2026 – Jun 2027): it keeps the "You are here" chip and its
 * rail segment carries a subtle ember accent. Phase IV's "2036 test"
 * workstream is lifted out of the phase body and rendered once as the
 * end-cap callout, so the test reads as the destination of the whole
 * timeline rather than as one more workstream card.
 */

const TEST_2036_HEADING = "The 2036 test";

/** First year in a phase's date range, e.g. "Jul 2027 – Jun 2030" → 2027. */
function startYear(dates: string): string | undefined {
  return dates.match(/\d{4}/)?.[0];
}

const YEAR_TICK =
  "absolute left-0 -translate-x-1/2 bg-[var(--color-paper)] px-1.5 font-mono text-[10px] font-semibold tabular-nums tracking-[0.08em] text-[var(--color-ink-muted)]";

export default function PhaseTimeline() {
  const test2036 = PHASES.flatMap((p) => p.workstreams).find(
    (w) => w.heading === TEST_2036_HEADING
  )?.items[0];
  const endYear = PHASES[PHASES.length - 1]?.dates.match(/\d{4}/g)?.pop();

  return (
    <div>
      <ol>
        {PHASES.map((phase, i) => {
          const workstreams = phase.workstreams.filter(
            (w) => w.heading !== TEST_2036_HEADING
          );
          const isLast = i === PHASES.length - 1;
          const isCurrent = phase.id === "phase-1";
          return (
            <li
              key={phase.id}
              className={`relative border-l pl-6 sm:pl-8 ${
                isCurrent
                  ? "border-[var(--color-ember)]/45"
                  : "border-[var(--color-parchment)]"
              } ${isLast ? "pb-9" : "pb-10 sm:pb-12"}`}
            >
              {/* Year tick on the rail at the phase boundary */}
              <span aria-hidden className={`${YEAR_TICK} top-0`}>
                {startYear(phase.dates)}
              </span>
              {/* Closing tick at the end of the rail */}
              {isLast && endYear ? (
                <span aria-hidden className={`${YEAR_TICK} bottom-0`}>
                  {endYear}
                </span>
              ) : null}

              {/* Date-range marker */}
              <p className="pt-7 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                {phase.dates}
              </p>

              {/* Phase heading, its numeral riding the rail as a square node */}
              <div className="relative mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                <span
                  aria-hidden
                  className="absolute left-[-24px] top-[14px] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--color-ember)] sm:left-[-32px] lg:h-7 lg:w-7"
                >
                  <span className="flex h-full w-full -rotate-45 items-center justify-center font-mono text-[length:10px] font-bold text-[var(--color-canopy)] lg:text-[length:12px]">
                    {phase.n}
                  </span>
                </span>
                <h3 className="font-editorial text-[24px] leading-tight text-[var(--color-ink)]">
                  <span className="sr-only">Phase {phase.n}: </span>
                  {phase.title}
                </h3>
                {isCurrent ? (
                  <span className="rounded-full bg-[var(--color-ember)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                    You are here
                  </span>
                ) : null}
              </div>

              {phase.intro ? (
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-light)]">
                  {phase.intro}
                </p>
              ) : null}

              {/* Workstreams */}
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {workstreams.map((ws) => (
                  <div
                    key={ws.heading}
                    className="rounded-sm border border-[var(--color-parchment)] bg-white p-5"
                  >
                    <h4 className="text-[15px] font-semibold leading-snug text-[var(--color-ink)]">
                      {ws.heading}
                    </h4>
                    <ul className="mt-2.5 space-y-1.5">
                      {ws.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-[14px] leading-snug text-[var(--color-ink-light)]"
                        >
                          <span
                            aria-hidden
                            className="mt-[7px] h-[5px] w-[5px] shrink-0 bg-[var(--color-ember)]"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ol>

      {/* End-cap: the 2036 test */}
      {test2036 ? (
        <div className="mt-2 rounded-sm border border-[var(--color-parchment)] border-l-2 border-l-[var(--color-ember)] bg-[var(--color-paper-warm)] p-5 sm:p-6">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            The 2036 test
          </p>
          <p className="mt-2 max-w-2xl font-editorial text-[19px] sm:text-[21px] leading-snug text-[var(--color-ink)]">
            {test2036}
          </p>
        </div>
      ) : null}
    </div>
  );
}
