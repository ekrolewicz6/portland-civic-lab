import { HEADLINE, P5_UTILIZATION } from "@/lib/venues/data";
import { fmtCount, fmtMoney, fmtPct } from "@/lib/venues/engine";

/**
 * §5: Portland'5 utilization, FY2024–25.
 *
 * Server component, pure CSS bars, no charting library. For every venue it
 * shows share-of-system for events, attendance, and revenue side by side, so
 * the divergence is the picture: Keller runs ~25% of events but ~50% of
 * attendance and revenue; Winningstad runs 14% of events for ~1.7% of
 * attendance. Raw figures follow in a table.
 */

const TOTALS = P5_UTILIZATION.reduce(
  (acc, r) => ({
    events: acc.events + r.events,
    attendance: acc.attendance + r.attendance,
    revenue: acc.revenue + r.revenue,
  }),
  { events: 0, attendance: 0, revenue: 0 },
);

const CHIP_TONE: Record<"good" | "warn" | "bad", string> = {
  good: "bg-[var(--color-fern)]/10 text-[var(--color-fern)]",
  warn: "bg-[var(--color-clay)]/12 text-[var(--color-clay)]",
  bad: "bg-[var(--color-ember)]/10 text-[var(--color-ember)]",
};

function ShareBar({
  label,
  share,
  fillClass,
}: {
  label: string;
  share: number;
  fillClass: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-ink-muted)] lg:w-32">
        {label}
      </span>
      <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-sm bg-[var(--color-paper-warm)]">
        <div
          className={`h-full rounded-sm ${fillClass}`}
          style={{
            width: `${(share * 100).toFixed(2)}%`,
            minWidth: share > 0 ? "2px" : undefined,
          }}
        />
      </div>
      <span className="w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-[var(--color-ink-light)] lg:w-14">
        {fmtPct(share)}
      </span>
    </div>
  );
}

export default function UtilizationChart() {
  return (
    <div>
      {/* ── Headline callout ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] border-l-[3px] border-l-[var(--color-ember)] bg-white p-5">
        <h3 className="font-editorial text-[20px] leading-snug text-[var(--color-ink)]">
          A busy calendar is not a full house.
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
          Winningstad hosted <span className="font-mono tabular-nums">100</span> events for fewer
          than <span className="font-mono tabular-nums">14,000</span> people; Keller hosted{" "}
          <span className="font-mono tabular-nums">179</span> for nearly{" "}
          <span className="font-mono tabular-nums">400,000</span>.
        </p>
      </div>

      {/* ── Share-of-system bars ── */}
      <div className="mt-6 divide-y divide-[var(--color-parchment)] rounded-sm border border-[var(--color-parchment)] bg-white">
        {P5_UTILIZATION.map((r) => (
          <div key={r.venue} className="p-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <h4 className="text-[14px] font-semibold text-[var(--color-ink)]">{r.venue}</h4>
              {/* a single-character recovery value is the data sentinel for "no note" */}
              {r.recovery.length > 1 ? (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] ${CHIP_TONE[r.recoveryTone]}`}
                >
                  {r.recovery}
                </span>
              ) : null}
            </div>
            <div className="mt-2.5 space-y-1.5">
              <ShareBar
                label="% of events"
                share={r.events / TOTALS.events}
                fillClass="bg-[var(--color-sage)]"
              />
              <ShareBar
                label="% of attendance"
                share={r.attendance / TOTALS.attendance}
                fillClass="bg-[var(--color-canopy)]"
              />
              <ShareBar
                label="% of revenue"
                share={r.revenue / TOTALS.revenue}
                fillClass="bg-[var(--color-ember)]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Raw figures: stacked list on phones, table from md up ── */}
      <div className="mt-6 rounded-sm border border-[var(--color-parchment)] bg-white md:hidden">
        <ul className="divide-y divide-[var(--color-parchment)]">
          {P5_UTILIZATION.map((r) => (
            <li key={r.venue} className="px-4 py-3">
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">{r.venue}</p>
              <p className="mt-1 font-mono text-[12px] tabular-nums text-[var(--color-ink-light)]">
                {fmtCount(r.events)} events · {fmtCount(r.attendance)} attendees ·{" "}
                {fmtMoney(r.revenue)}
              </p>
            </li>
          ))}
          <li className="bg-[var(--color-paper-warm)] px-4 py-3">
            <p className="text-[13px] font-bold text-[var(--color-ink)]">
              All Portland&apos;5 venues
            </p>
            <p className="mt-1 font-mono text-[12px] font-bold tabular-nums text-[var(--color-ink)]">
              {fmtCount(HEADLINE.p5EventsFy25)} events · {fmtCount(HEADLINE.p5AttendanceFy25)}{" "}
              attendees · {`$${(HEADLINE.p5RevenueFy25 / 1_000_000).toFixed(3)}M`}
            </p>
          </li>
        </ul>
      </div>
      <div className="mt-6 hidden overflow-x-auto rounded-sm border border-[var(--color-parchment)] bg-white md:block">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
              <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                Venue
              </th>
              <th className="px-4 py-3 text-right font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                Events
              </th>
              <th className="px-4 py-3 text-right font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                Attendance
              </th>
              <th className="px-4 py-3 text-right font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                Charges-for-services
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-parchment)]">
            {P5_UTILIZATION.map((r) => (
              <tr key={r.venue}>
                <td className="px-4 py-2.5 text-[13px] text-[var(--color-ink)]">{r.venue}</td>
                <td className="px-4 py-2.5 text-right font-mono text-[12px] tabular-nums text-[var(--color-ink-light)]">
                  {fmtCount(r.events)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-[12px] tabular-nums text-[var(--color-ink-light)]">
                  {fmtCount(r.attendance)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-[12px] tabular-nums text-[var(--color-ink-light)]">
                  {fmtMoney(r.revenue)}
                </td>
              </tr>
            ))}
            <tr className="bg-[var(--color-paper-warm)]">
              <td className="px-4 py-3 text-[13px] font-bold text-[var(--color-ink)]">
                All Portland&apos;5 venues
              </td>
              <td className="px-4 py-3 text-right font-mono text-[12px] font-bold tabular-nums text-[var(--color-ink)]">
                {fmtCount(HEADLINE.p5EventsFy25)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-[12px] font-bold tabular-nums text-[var(--color-ink)]">
                {fmtCount(HEADLINE.p5AttendanceFy25)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-[12px] font-bold tabular-nums text-[var(--color-ink)]">
                {`$${(HEADLINE.p5RevenueFy25 / 1_000_000).toFixed(3)}M`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
        FY2024–25 · charges-for-services revenue
      </p>
    </div>
  );
}
