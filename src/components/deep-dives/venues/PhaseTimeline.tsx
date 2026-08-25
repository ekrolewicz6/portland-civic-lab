import { PHASES } from "@/lib/venues/data";

/**
 * §11 — the four-phase, ten-year strategy as a vertical timeline.
 *
 * Server component, light context. Each phase hangs off a continuous left
 * rail (border-l parchment) with a mono date-range marker and a square
 * node on the line; Phase I is pinned with a "You are here" chip (we are
 * inside Aug 2026 – Jun 2027). Phase IV's "2036 test" workstream is
 * lifted out of the phase body and rendered once as the end-cap callout,
 * so the test reads as the destination of the whole timeline rather than
 * as one more workstream card.
 */

const TEST_2036_HEADING = "The 2036 test";

export default function PhaseTimeline() {
  const test2036 = PHASES.flatMap((p) => p.workstreams).find(
    (w) => w.heading === TEST_2036_HEADING
  )?.items[0];

  return (
    <div>
      <ol>
        {PHASES.map((phase, i) => {
          const workstreams = phase.workstreams.filter(
            (w) => w.heading !== TEST_2036_HEADING
          );
          const isLast = i === PHASES.length - 1;
          return (
            <li
              key={phase.id}
              className={`relative border-l border-[var(--color-parchment)] pl-6 sm:pl-8 ${
                isLast ? "pb-4" : "pb-10 sm:pb-12"
              }`}
            >
              {/* Node on the rail */}
              <span
                aria-hidden
                className="absolute -left-[5px] top-[5px] h-[9px] w-[9px] rotate-45 bg-[var(--color-ember)]"
              />

              {/* Date-range marker */}
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                {phase.dates}
              </p>

              {/* Phase heading */}
              <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                <span className="font-editorial text-[28px] leading-none text-[var(--color-ember)]">
                  {phase.n}
                </span>
                <h3 className="font-editorial text-[24px] leading-tight text-[var(--color-ink)]">
                  {phase.title}
                </h3>
                {phase.id === "phase-1" ? (
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
