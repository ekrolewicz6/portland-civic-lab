import { GAPS } from "@/lib/pps-budget/data";

/**
 * Act IV close (document.md section 13, "What we cannot know"): the census of
 * what the public record cannot answer about the PPS budget. One row per gap
 * with why it matters and the drafted-but-unsent ask; the withdrawn R2 row
 * stays on the page, struck through, with our correction visible.
 */

type GapRow = (typeof GAPS)[number];

function isStruck(r: GapRow): boolean {
  return "struck" in r && r.struck === true;
}

function WithdrawnChip() {
  return (
    <span className="ml-2 inline-block whitespace-nowrap rounded-sm bg-[var(--color-ember)] px-1.5 py-0.5 align-middle font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-canopy-deep)]">
      withdrawn, our error
    </span>
  );
}

function Ask({ text }: { text: string }) {
  return (
    <p className="text-[12px] leading-snug text-[var(--color-ink)]">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fern)]">
        The ask ·{" "}
      </span>
      {text}
    </p>
  );
}

export default function CannotKnow() {
  return (
    <div className="mt-8">
      <h3 className="font-editorial text-[20px] sm:text-[22px] leading-snug text-[var(--color-ink)]">
        What we cannot know
      </h3>
      <p className="mt-3 max-w-3xl border-l-2 border-[var(--color-fern)] pl-4 font-editorial text-[16px] leading-snug text-[var(--color-ink)]">
        What a public body declines to publish is a decision about the public.
      </p>
      <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-[var(--color-ink-light)]">
        This is the census of those decisions. Each row names a hole in the public record, what
        the hole costs, and the specific request that would fill it. One row is ours to answer
        for: we withdrew a request after finding the document in our own files, and the
        correction stays on the page.
      </p>

      {/* phones: stacked cards */}
      <div className="mt-4 rounded-sm border border-[var(--color-parchment)] bg-white md:hidden">
        <ul className="divide-y divide-[var(--color-parchment)]">
          {GAPS.map((r) => {
            const struck = isStruck(r);
            return (
              <li key={r.gap} className="px-4 py-3.5">
                <p
                  className={`text-[13.5px] font-semibold ${
                    struck
                      ? "text-[var(--color-ink-muted)]"
                      : "text-[var(--color-ink)]"
                  }`}
                >
                  <span className={struck ? "line-through" : undefined}>{r.gap}</span>
                  {struck ? <WithdrawnChip /> : null}
                </p>
                <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-light)]">
                  {r.why}
                </p>
                <div className="mt-1.5">
                  <Ask text={r.ask} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* md+: table */}
      <div className="mt-4 hidden overflow-x-auto rounded-sm border border-[var(--color-parchment)] bg-white md:block">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
              {["The gap", "Why it matters", "The ask"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-parchment)]">
            {GAPS.map((r) => {
              const struck = isStruck(r);
              return (
                <tr key={r.gap} className="align-top">
                  <td
                    className={`max-w-[280px] px-4 py-3 text-[13px] font-semibold ${
                      struck
                        ? "text-[var(--color-ink-muted)]"
                        : "text-[var(--color-ink)]"
                    }`}
                  >
                    <span className={struck ? "line-through" : undefined}>{r.gap}</span>
                    {struck ? <WithdrawnChip /> : null}
                  </td>
                  <td className="max-w-[340px] px-4 py-3 text-[12px] leading-snug text-[var(--color-ink-light)]">
                    {r.why}
                  </td>
                  <td className="max-w-[260px] px-4 py-3">
                    <Ask text={r.ask} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        Ten records requests are drafted and unsent; the district can moot every one of them by
        publishing.
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        Portland Public Schools financial reports page, inspected directly · MSRB EMMA · Oregon
        Secretary of State audits division
      </p>
    </div>
  );
}
