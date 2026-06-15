"use client";

import { useState } from "react";
import { costOfInaction, COST, fmtMoney, fmtNum } from "@/lib/homeless/engine";

const PRESETS = [
  { label: "a city block's worth", value: 50 },
  { label: "one neighborhood", value: 500 },
  { label: "Multnomah's unsheltered", value: 6912 },
];

export default function CostOfInactionCalculator() {
  const [people, setPeople] = useState(500);
  const r = costOfInaction(people);
  const maxBar = Math.max(r.streetCost, r.housedCost);

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white overflow-hidden">
      <div className="p-5 sm:p-7 border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
        <div className="flex items-baseline justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-light)]">
            People housed instead of left on the street
          </label>
          <span className="font-mono text-[22px] font-bold text-[var(--color-canopy)] tabular-nums">
            {fmtNum(people)}
          </span>
        </div>
        <input
          type="range"
          min={10}
          max={7000}
          step={10}
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
          className="mt-3 w-full cursor-pointer"
          style={{ accentColor: "var(--color-canopy)" }}
          aria-label="Number of people housed"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeople(p.value)}
              className={`rounded-sm border px-3 py-1.5 text-[11px] transition-colors ${
                people === p.value
                  ? "border-[var(--color-canopy)] bg-[var(--color-canopy)]/[0.04] text-[var(--color-canopy)]"
                  : "border-[var(--color-parchment)] text-[var(--color-ink-light)] hover:border-[var(--color-sage)]"
              }`}
            >
              <span className="font-mono">{fmtNum(p.value)}</span> · {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* Two bars */}
        <div className="space-y-4">
          {[
            { label: "Leave them on the street", sub: "ER, jail, EMS, sanitation — spread across a dozen budgets", value: r.streetCost, color: "var(--color-clay)" },
            { label: "House them with support", sub: "rent + case management in supportive housing", value: r.housedCost, color: "var(--color-fern)" },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className="text-[14px] font-medium text-[var(--color-ink)]">{row.label}</span>
                <span className="font-mono text-[16px] font-bold tabular-nums" style={{ color: row.color }}>
                  {fmtMoney(row.value)}/yr
                </span>
              </div>
              <div className="h-6 w-full rounded-sm bg-[var(--color-paper-warm)] overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-500"
                  style={{ width: `${(row.value / maxBar) * 100}%`, backgroundColor: row.color }}
                />
              </div>
              <p className="text-[11px] text-[var(--color-ink-muted)] mt-1">{row.sub}</p>
            </div>
          ))}
        </div>

        {/* Headline */}
        <div className="mt-6 rounded-sm bg-[var(--color-canopy)] text-white p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember-bright)]">
            Doing nothing costs more
          </p>
          <p className="mt-1 font-mono text-3xl sm:text-4xl font-bold tabular-nums">
            {fmtMoney(r.saved)}<span className="text-[16px] font-normal text-white/60"> / year</span>
          </p>
          <p className="text-[13px] text-white/70 mt-1.5 leading-relaxed">
            That&apos;s about <strong className="text-white">{fmtMoney(r.savedPerPerson)} per person, per year</strong>{" "}
            that the street costs over supportive housing.
          </p>
        </div>

        <p className="mt-4 text-[12px] text-[var(--color-ink-muted)] leading-relaxed">
          <strong>The honest caveat:</strong> most of that &ldquo;saving&rdquo; is <em>federal</em> health
          spending (Medicaid-funded ER and hospital care), not the local budget. The fix isn&apos;t that
          housing pays for itself locally — it&apos;s pulling the federal payer in to fund the solution
          that saves it money. The street figure (${fmtNum(COST.streetPerYear)}) sits in a national range
          of ${fmtNum(COST.streetRangeLow)}–${fmtNum(COST.streetRangeHigh)}/year.
        </p>
      </div>
    </div>
  );
}
