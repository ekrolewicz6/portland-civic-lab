"use client";

import { useState } from "react";
import { BUILD_PACE, HEADLINE } from "@/lib/lloyd/data";
import { buildoutYears, fmtNum } from "@/lib/lloyd/engine";

const MAX = Math.max(...BUILD_PACE.map((b) => b.units));
const BAR: Record<string, string> = {
  promise: "var(--color-ember)",
  peak: "var(--color-canopy)",
  now: "var(--color-clay)",
};

export default function DeliveryReality() {
  const [pace, setPace] = useState(514);
  const years = buildoutYears(pace);

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white overflow-hidden">
      {/* Pace control */}
      <div className="p-6 sm:p-8 border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-light)]">
            Homes built per year at Lloyd
          </label>
          <span className="font-mono text-[20px] font-bold text-[var(--color-canopy)] tabular-nums">
            {fmtNum(pace)}
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={1000}
          step={10}
          value={pace}
          onChange={(e) => setPace(Number(e.target.value))}
          className="w-full accent-[var(--color-ember)] cursor-pointer"
          aria-label="Homes built per year at Lloyd Center"
        />
        <div className="flex justify-between text-[10px] font-mono text-[var(--color-ink-muted)] mt-1">
          <span>100</span>
          <span>1,000</span>
        </div>
        <p className="mt-5 text-[14px] text-[var(--color-ink-light)] leading-relaxed">
          At that pace, the plan&apos;s{" "}
          <strong className="text-[var(--color-ink)]">{fmtNum(HEADLINE.unitsModeled)}</strong> modeled
          homes take{" "}
          <span className="font-mono text-[18px] font-bold text-[var(--color-canopy)] tabular-nums">
            {years.toFixed(0)} years
          </span>{" "}
          to finish. The developer hopes for first homes in 2&ndash;3 years and full build-out
          &ldquo;over a decade or more.&rdquo;
        </p>
      </div>

      {/* Scale comparison */}
      <div className="p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)] mb-4">
          Lloyd&apos;s promise vs. what Portland actually builds
        </p>
        <div className="space-y-3">
          {BUILD_PACE.map((b) => (
            <div key={b.label}>
              <div className="flex justify-between items-baseline text-[12px] mb-1 gap-3">
                <span className="text-[var(--color-ink-light)] leading-snug">{b.label}</span>
                <span className="font-mono font-semibold text-[var(--color-ink)] tabular-nums flex-shrink-0">
                  {fmtNum(b.units)}
                </span>
              </div>
              <div className="h-5 rounded-sm bg-[var(--color-paper-warm)] overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all"
                  style={{ width: `${(b.units / MAX) * 100}%`, backgroundColor: BAR[b.tone] }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[12px] text-[var(--color-ink-muted)] leading-relaxed border-t border-[var(--color-parchment)] pt-4">
          Portland permitted just{" "}
          <strong className="text-[var(--color-ink)]">{fmtNum(HEADLINE.permits2025)}</strong>{" "}
          multifamily homes citywide in 2025 — its fewest since 2009. Lloyd alone promises roughly{" "}
          <strong className="text-[var(--color-ink)]">ten times</strong> that, on one site, while the
          tax district meant to seed it is generating{" "}
          <strong className="text-[var(--color-ink)]">no</strong> new revenue.
        </p>
      </div>
    </div>
  );
}
