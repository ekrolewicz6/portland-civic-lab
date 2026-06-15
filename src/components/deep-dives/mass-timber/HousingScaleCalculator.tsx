"use client";

import { useState } from "react";
import { housingScale, fmtMoney, fmtPct } from "@/lib/mass-timber/engine";

const PRESETS = [500, 1000, 2500, 5000];

const STACK = [
  { key: "lihtcEquity", label: "Federal LIHTC equity", color: "var(--color-fern)", note: "tax-credit investors — the single biggest source" },
  { key: "publicShare", label: "Public subsidy (the gap)", color: "var(--color-canopy)", note: "city/state bonds, grants — the part taxpayers fund" },
  { key: "debtAndCdfi", label: "Bank & mission debt", color: "var(--color-river)", note: "conventional loans and CDFI lenders" },
] as const;

export default function HousingScaleCalculator() {
  const [units, setUnits] = useState(1000);
  const s = housingScale(units);

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white overflow-hidden">
      <div className="p-5 sm:p-7 border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
        <div className="flex items-baseline justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-light)]">
            Affordable homes to build
          </label>
          <span className="font-mono text-[22px] font-bold text-[var(--color-canopy)] tabular-nums">
            {units.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={10000}
          step={100}
          value={units}
          onChange={(e) => setUnits(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--color-canopy)] cursor-pointer"
          aria-label="Number of homes to build"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setUnits(p)}
              className={`rounded-sm border px-3 py-1.5 text-[12px] font-mono transition-colors ${
                units === p
                  ? "border-[var(--color-canopy)] bg-[var(--color-canopy)]/[0.04] text-[var(--color-canopy)]"
                  : "border-[var(--color-parchment)] text-[var(--color-ink-light)] hover:border-[var(--color-sage)]"
              }`}
            >
              {p.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              Total cost to build
            </p>
            <p className="mt-1 font-mono text-4xl font-bold text-[var(--color-ink)] tabular-nums leading-none">
              {fmtMoney(s.totalDevelopmentCost)}
            </p>
            <p className="text-[12px] text-[var(--color-ink-muted)] mt-1">
              ≈ {fmtMoney(s.totalDevelopmentCost / units)} per home, all-in
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              Public share of that
            </p>
            <p className="mt-1 font-mono text-4xl font-bold text-[var(--color-canopy)] tabular-nums leading-none">
              {fmtMoney(s.publicShare)}
            </p>
            <p className="text-[12px] text-[var(--color-ink-muted)] mt-1">
              {fmtPct(s.publicShare / s.totalDevelopmentCost)} of the total — about{" "}
              {fmtMoney(s.publicPerUnit)} per home
            </p>
          </div>
        </div>

        {/* Funding stack */}
        <div className="mt-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-light)] mb-2">
            Who pays for it
          </p>
          <div className="flex h-10 w-full overflow-hidden rounded-sm border border-[var(--color-parchment)]">
            {STACK.map((seg) => {
              const val = s[seg.key];
              return (
                <div
                  key={seg.key}
                  style={{ width: `${(val / s.totalDevelopmentCost) * 100}%`, backgroundColor: seg.color }}
                  title={`${seg.label}: ${fmtMoney(val)}`}
                />
              );
            })}
          </div>
          <div className="mt-3 space-y-2">
            {STACK.map((seg) => (
              <div key={seg.key} className="flex items-start gap-3">
                <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-[2px]" style={{ backgroundColor: seg.color }} />
                <div className="flex-1 min-w-0 flex items-baseline justify-between gap-3">
                  <span className="text-[13px] text-[var(--color-ink)]">
                    {seg.label}
                    <span className="text-[var(--color-ink-muted)]"> — {seg.note}</span>
                  </span>
                  <span className="font-mono text-[13px] font-semibold text-[var(--color-ink)] tabular-nums whitespace-nowrap">
                    {fmtMoney(s[seg.key])}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline / the real constraint */}
        <div className="mt-6 rounded-sm bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] p-4">
          <p className="text-[13px] text-[var(--color-ink-light)] leading-relaxed">
            <strong className="text-[var(--color-canopy)]">≈ {s.yearsLow}–{s.yearsHigh} years</strong>{" "}
            to actually build these. The real ceiling isn&apos;t money — it&apos;s how fast Oregon can
            hand out the rationed federal tax credits that anchor every deal. The factory could
            build faster than the financing pipeline can fill it.
          </p>
        </div>
      </div>
    </div>
  );
}
