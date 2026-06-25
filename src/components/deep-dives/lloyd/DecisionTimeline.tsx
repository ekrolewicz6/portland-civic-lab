import { TIMELINE } from "@/lib/lloyd/data";

export default function DecisionTimeline() {
  return (
    <ol className="relative border-l-2 border-[var(--color-parchment)] ml-1.5 space-y-6">
      {TIMELINE.map((t) => {
        const isNow = t.status === "now";
        const isFuture = t.status === "future";
        return (
          <li key={t.date + t.label} className="relative pl-6">
            <span
              className={`absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2 ${
                isNow
                  ? "bg-[var(--color-ember)] border-[var(--color-ember)]"
                  : isFuture
                    ? "bg-[var(--color-paper)] border-[var(--color-ink-muted)]"
                    : "bg-[var(--color-canopy)] border-[var(--color-canopy)]"
              }`}
            />
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-mono text-[12px] font-semibold ${
                  isNow ? "text-[var(--color-ember)]" : "text-[var(--color-ink-muted)]"
                }`}
              >
                {t.date}
              </span>
              {isNow && (
                <span className="text-[9px] font-semibold uppercase tracking-wide bg-[var(--color-ember)]/15 text-[var(--color-ember)] px-1.5 py-0.5 rounded-sm">
                  happening now
                </span>
              )}
            </div>
            <p
              className={`text-[14px] leading-snug mt-0.5 ${
                isFuture ? "text-[var(--color-ink-light)]" : "text-[var(--color-ink)]"
              }`}
            >
              {t.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
