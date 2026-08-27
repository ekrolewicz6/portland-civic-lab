import { SOURCES, WIDE_UTILIZATION } from "@/lib/venues/data";

/**
 * §4, part two: the rest of the portfolio's utilization, one row per venue,
 * with the City's take stated honestly ("Not published" where that is the
 * truth). Stacked cards on phones, table from md up.
 */

function SourceLinks({ ids }: { ids: string[] }) {
  return (
    <>
      {ids.map((sid, j) => {
        const src = SOURCES[sid as keyof typeof SOURCES];
        return (
          <span key={sid}>
            {j > 0 ? " · " : ""}
            <a
              href={src.url}
              target={src.url.startsWith("/") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="underline decoration-[var(--color-sage)]/60 underline-offset-2 hover:text-[var(--color-canopy)]"
            >
              {src.org}
            </a>
          </span>
        );
      })}
    </>
  );
}

export default function WideUtilization() {
  return (
    <div className="mt-8">
      <h3 className="font-editorial text-[20px] sm:text-[22px] leading-snug text-[var(--color-ink)]">
        And the rest of the portfolio
      </h3>
      <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-[var(--color-ink-light)]">
        The same three questions for every other venue on this page, from the best public year
        available. Where a cell says &ldquo;not published,&rdquo; that is the finding: nobody can
        answer the question from the public record.
      </p>

      {/* phones: stacked cards */}
      <div className="mt-4 rounded-sm border border-[var(--color-parchment)] bg-white md:hidden">
        <ul className="divide-y divide-[var(--color-parchment)]">
          {WIDE_UTILIZATION.map((r) => (
            <li key={r.venue} className="px-4 py-3.5">
              <p className="text-[13.5px] font-semibold text-[var(--color-ink)]">{r.venue}</p>
              <p className="mt-1 font-mono text-[12px] tabular-nums text-[var(--color-ink-light)]">
                {r.events} events · {r.people}
              </p>
              <p
                className={`mt-0.5 text-[12.5px] font-semibold ${
                  r.takeMissing ? "text-[var(--color-clay)]" : "text-[var(--color-ink)]"
                }`}
              >
                City&apos;s take: {r.cityTake}
              </p>
              {r.note ? (
                <p className="mt-1 text-[11.5px] leading-snug text-[var(--color-ink-light)]">
                  {r.note}
                </p>
              ) : null}
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
                <SourceLinks ids={r.sourceIds} />
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* md+: table */}
      <div className="mt-4 hidden overflow-x-auto rounded-sm border border-[var(--color-parchment)] bg-white md:block">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
              {["Venue", "Events", "People through it", "What the City clears", "Notes & sources"].map(
                (h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-parchment)]">
            {WIDE_UTILIZATION.map((r) => (
              <tr key={r.venue} className="align-top">
                <td className="px-4 py-3 text-[13px] font-semibold text-[var(--color-ink)]">
                  {r.venue}
                </td>
                <td className="px-4 py-3 font-mono text-[12px] tabular-nums text-[var(--color-ink-light)]">
                  {r.events}
                </td>
                <td className="px-4 py-3 font-mono text-[12px] tabular-nums text-[var(--color-ink-light)]">
                  {r.people}
                </td>
                <td
                  className={`px-4 py-3 text-[12.5px] font-semibold ${
                    r.takeMissing ? "text-[var(--color-clay)]" : "text-[var(--color-ink)]"
                  }`}
                >
                  {r.cityTake}
                </td>
                <td className="max-w-[340px] px-4 py-3 text-[12px] leading-snug text-[var(--color-ink-light)]">
                  {r.note}{" "}
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
                    <SourceLinks ids={r.sourceIds} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        Best available public year per venue · tickets sold and visitor claims are not audited
        attendance
      </p>
    </div>
  );
}
