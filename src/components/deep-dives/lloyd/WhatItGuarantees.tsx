import { Check, Minus, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GUARANTEES, type GuaranteeLevel } from "@/lib/lloyd/data";

const LEVEL: Record<
  GuaranteeLevel,
  { label: string; Icon: LucideIcon; badge: string; ring: string }
> = {
  required: {
    label: "Locked in",
    Icon: Check,
    badge: "bg-[#e3efe7] text-[var(--color-fern)]",
    ring: "border-[var(--color-fern)]/40",
  },
  flexible: {
    label: "Flexible",
    Icon: Minus,
    badge: "bg-[#f6ecd9] text-[var(--color-ember)]",
    ring: "border-[var(--color-ember)]/40",
  },
  "not-required": {
    label: "Not required",
    Icon: X,
    badge: "bg-[#f6e7df] text-[var(--color-clay)]",
    ring: "border-[var(--color-clay)]/50",
  },
};

export default function WhatItGuarantees() {
  return (
    <div className="space-y-3">
      {GUARANTEES.map((g) => {
        const L = LEVEL[g.level];
        return (
          <div
            key={g.item}
            className={`flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 rounded-sm border bg-white p-5 ${L.ring}`}
          >
            <div
              className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 ${L.badge} flex-shrink-0 self-start`}
            >
              <L.Icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap">
                {L.label}
              </span>
            </div>
            <div>
              <h4 className="text-[15px] font-semibold text-[var(--color-ink)]">{g.item}</h4>
              <p className="text-[13px] text-[var(--color-ink-light)] leading-relaxed mt-0.5">
                {g.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
