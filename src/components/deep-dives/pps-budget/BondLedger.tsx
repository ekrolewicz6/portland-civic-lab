import { BOND_LEDGER } from "@/lib/pps-budget/data";

/**
 * The bond promise-vs-delivery ledger, for Act IV's waste examination (W1).
 *
 * One row per capital project: the number voters saw on the ballot (sage bar)
 * against the latest audited figure (clay when it blew past the promise, fern
 * when the project held to its revised budget). The Center for Black Student
 * Excellence gets a dashed outline instead of a fill, because its story is
 * the opposite failure: $60M promised, zero dollars spent. All bars share one
 * scale so Jefferson's $491M sets the width of the room.
 */

type Row = (typeof BOND_LEDGER)[number];

const fmtM = (n: number) => `$${n % 1 === 0 ? n : n.toFixed(1)}M`;

const overPromise = (s: Row["status"]) => s === "over" || s === "paused";

export default function BondLedger() {
  const max = Math.max(...BOND_LEDGER.flatMap((r) => [r.ballotM, r.latestM]));

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
      <div className="space-y-5">
        {BOND_LEDGER.map((row) => {
          const pct = Math.round((row.latestM / row.ballotM - 1) * 100);
          const unspent = row.status === "unspent";
          const latestColor = overPromise(row.status)
            ? "var(--color-clay)"
            : "var(--color-fern)";

          return (
            <div
              key={row.project}
              className="border-b border-[var(--color-parchment)] pb-5 last:border-b-0 last:pb-0"
            >
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="text-[14px] font-semibold text-[var(--color-ink)]">
                  {row.project}
                </span>
                <span className="rounded-sm bg-[var(--color-paper-warm)] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                  {row.bond} bond
                </span>
              </div>

              <div className="mt-2.5 space-y-1.5">
                {/* What the ballot promised */}
                <BarRow
                  label="ballot"
                  widthPct={(row.ballotM / max) * 100}
                  fill="var(--color-sage)"
                  value={fmtM(row.ballotM)}
                />
                {/* Where the number stands now */}
                {unspent ? (
                  <BarRow
                    label="spent"
                    widthPct={(row.ballotM / max) * 100}
                    dashed
                    value="$0"
                    tag="zero spent"
                    tagColor="var(--color-clay)"
                  />
                ) : (
                  <BarRow
                    label="latest"
                    widthPct={(row.latestM / max) * 100}
                    fill={latestColor}
                    value={fmtM(row.latestM)}
                    tag={`${pct >= 0 ? "+" : ""}${pct}%`}
                    tagColor={latestColor}
                  />
                )}
              </div>

              <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-ink-light)]">
                {row.note}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-5 border-t border-[var(--color-parchment)] pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        Source: independent bond performance audits, Sjoberg Evashenk Consulting
      </p>
    </div>
  );
}

function BarRow({
  label,
  widthPct,
  fill,
  dashed,
  value,
  tag,
  tagColor,
}: {
  label: string;
  widthPct: number;
  fill?: string;
  dashed?: boolean;
  value: string;
  tag?: string;
  tagColor?: string;
}) {
  return (
    <div className="grid grid-cols-[52px_1fr] items-center gap-x-2.5 sm:grid-cols-[60px_1fr]">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
        {label}
      </span>
      <div className="flex items-center gap-x-2.5">
        <div className="h-2.5 flex-1 rounded-sm bg-[var(--color-paper-warm)]">
          <div
            className="h-full rounded-sm"
            style={{
              width: `${widthPct}%`,
              backgroundColor: dashed ? "transparent" : fill,
              border: dashed ? "1.5px dashed var(--color-clay)" : undefined,
            }}
          />
        </div>
        <span className="whitespace-nowrap font-mono text-[12px] tabular-nums text-[var(--color-ink)]">
          {value}
          {tag && (
            <span
              className="ml-1.5 font-semibold"
              style={{ color: tagColor }}
            >
              {tag}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
