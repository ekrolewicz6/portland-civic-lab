"use client";

import { Clock } from "lucide-react";
import type { DataSource } from "./MethodologyExplainer";

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function formatRelative(date: Date, now: Date): string {
  const days = daysBetween(date, now);
  if (days < 0) return `in ${Math.abs(days)} days`;
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.round(days / 30)} months ago`;
  return `${(days / 365).toFixed(1)} years ago`;
}

export default function DataSourceTimeline({
  sources,
}: {
  sources: DataSource[];
}) {
  if (!sources || sources.length === 0) return null;

  const now = new Date();

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <Clock className="w-4 h-4 text-[#8b6c5c]" />
        <h2 className="text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.15em]">
          Data Freshness
        </h2>
        <div className="flex-1 h-px bg-[var(--color-parchment)]" />
      </div>

      <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5">
        <p className="text-[13px] text-[var(--color-ink-muted)] mb-5 leading-relaxed">
          When was each data source last updated, and when is the next refresh
          expected? Stale data is a source of confusion in public debates about
          homelessness.
        </p>

        <div className="space-y-4">
          {sources.map((source) => {
            const last = source.lastUpdated ? new Date(source.lastUpdated) : null;
            const next = source.nextExpected ? new Date(source.nextExpected) : null;

            // Compute progress: 0 = just updated, 100 = next update due now or overdue
            let progress = 0;
            let overdue = false;
            if (last && next) {
              const total = next.getTime() - last.getTime();
              const elapsed = now.getTime() - last.getTime();
              if (total > 0) {
                progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
                overdue = now > next;
              }
            }

            const barColor = overdue
              ? "#b85c3c"
              : progress > 75
                ? "#c89c4c"
                : "#7c8a4c";

            return (
              <div key={source.sourceKey}>
                <div className="flex items-baseline justify-between mb-1.5 gap-3">
                  <p className="text-[13px] font-semibold text-[var(--color-ink)] truncate">
                    {source.displayName}
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)] flex-shrink-0">
                    {source.updateFrequency}
                  </p>
                </div>
                <div className="relative h-2 bg-[var(--color-parchment)]/60 rounded-sm overflow-hidden mb-1.5">
                  <div
                    className="absolute inset-y-0 left-0 rounded-sm transition-all"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
                <div className="flex items-baseline justify-between text-[11px] text-[var(--color-ink-muted)] gap-3">
                  <span>
                    Last: {last ? formatRelative(last, now) : "—"}
                  </span>
                  <span>
                    {overdue ? "Overdue" : "Next"}:{" "}
                    {next
                      ? next.toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                          timeZone: "UTC",
                        })
                      : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
