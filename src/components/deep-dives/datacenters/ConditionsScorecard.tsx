import { Check, Minus, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WIN_WIN_CONDITIONS, type ConditionStatus } from "@/lib/datacenters/data";

const STATUS: Record<
  ConditionStatus,
  { label: string; Icon: LucideIcon; badge: string; ring: string }
> = {
  met: {
    label: "Met",
    Icon: Check,
    badge: "bg-[#e3efe7] text-[var(--color-fern)]",
    ring: "border-[var(--color-fern)]/40",
  },
  partial: {
    label: "Partial",
    Icon: Minus,
    badge: "bg-[#f6ecd9] text-[var(--color-ember)]",
    ring: "border-[var(--color-ember)]/40",
  },
  unmet: {
    label: "Unmet",
    Icon: X,
    badge: "bg-[#f6e7df] text-[var(--color-clay)]",
    ring: "border-[var(--color-clay)]/50",
  },
};

/**
 * The win-win test: each condition a data center deal must meet to be a net
 * gain for its host community, and where Oregon stands as of August 2026.
 */
export default function ConditionsScorecard() {
  return (
    <div className="space-y-3">
      {WIN_WIN_CONDITIONS.map((c, i) => {
        const S = STATUS[c.status];
        return (
          <div
            key={c.condition}
            className={`flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 rounded-sm border bg-white p-5 ${S.ring}`}
          >
            <div
              className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 ${S.badge} flex-shrink-0 self-start sm:w-[92px]`}
            >
              <S.Icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap">
                {S.label}
              </span>
            </div>
            <div>
              <h4 className="text-[15px] font-semibold text-[var(--color-ink)]">
                <span className="font-mono text-[13px] text-[var(--color-ink-muted)] mr-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {c.condition}
              </h4>
              <p className="text-[13px] text-[var(--color-ink-light)] leading-relaxed mt-0.5">
                {c.evidence}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
