"use client";

import { useState } from "react";
import { HEADLINE } from "@/lib/venues/data";
import { AFFORD_PRESETS, annualDebtService, fmtMillions } from "@/lib/venues/engine";

/**
 * §8.2 — the affordability arithmetic, made physical. Pick any capital
 * amount in play (or load one of the live figures) and watch the level
 * annual debt service dwarf everything Portland'5 operations could ever
 * contribute toward it.
 */

const BAR_FLOOR = 21_000_000; // keep the fixed reference bars readable at low amounts

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  minLabel,
  maxLabel,
  ariaLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
  minLabel: string;
  maxLabel: string;
  ariaLabel: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-[12px] font-medium text-[var(--color-ink)]">{label}</label>
        <span className="font-mono text-[13px] font-bold text-[var(--color-canopy)] tabular-nums whitespace-nowrap">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full accent-[var(--color-canopy)] cursor-pointer"
        aria-label={ariaLabel}
      />
      <div className="mt-1 flex justify-between font-mono text-[10px] text-[var(--color-ink-muted)]">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  max,
  fill,
}: {
  label: string;
  value: number;
  max: number;
  fill: string;
}) {
  const pct = Math.max(0.5, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] text-[var(--color-ink)]">{label}</span>
        <span className="font-mono text-[13px] font-bold text-[var(--color-ink)] tabular-nums whitespace-nowrap">
          {fmtMillions(value)}
        </span>
      </div>
      <div className="mt-1.5 h-6 w-full rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
        <div
          className="h-full rounded-sm transition-[width] duration-300"
          style={{ width: `${pct}%`, backgroundColor: fill }}
        />
      </div>
    </div>
  );
}

export default function AffordabilityCalculator() {
  const [amount, setAmount] = useState(115_000_000);
  const [ratePct, setRatePct] = useState(4.5);
  const [years, setYears] = useState(30);

  const annual = annualDebtService(amount, ratePct / 100, years);
  const barMax = Math.max(annual, BAR_FLOOR);
  const vsShortfall = annual / HEADLINE.p5Shortfall;
  const vsFnb = annual / HEADLINE.p5FnbNet;

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white overflow-hidden">
      {/* ── Controls ── */}
      <div className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-light)]">
          Start from a real number
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {AFFORD_PRESETS.map((p) => {
            const selected = amount === p.amount;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setAmount(p.amount)}
                title={p.note}
                aria-pressed={selected}
                aria-label={`Set amount to ${p.label} — ${p.note}`}
                className={`min-h-[44px] rounded-sm border px-3 py-2 font-mono text-[13px] font-semibold tabular-nums transition-colors ${
                  selected
                    ? "border-[var(--color-canopy)] bg-[var(--color-canopy)] text-white"
                    : "border-[var(--color-parchment)] bg-white text-[var(--color-ink-light)] hover:border-[var(--color-sage)]"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <Slider
            label="Capital amount"
            value={amount}
            min={50_000_000}
            max={600_000_000}
            step={5_000_000}
            onChange={setAmount}
            display={fmtMillions(amount)}
            minLabel="$50M"
            maxLabel="$600M"
            ariaLabel="Capital amount to finance"
          />
          <Slider
            label="Interest rate"
            value={ratePct}
            min={3}
            max={7}
            step={0.25}
            onChange={setRatePct}
            display={`${ratePct.toFixed(2)}%`}
            minLabel="3.00%"
            maxLabel="7.00%"
            ariaLabel="Annual interest rate"
          />
          <Slider
            label="Term"
            value={years}
            min={10}
            max={40}
            step={5}
            onChange={setYears}
            display={`${years} years`}
            minLabel="10y"
            maxLabel="40y"
            ariaLabel="Financing term in years"
          />
        </div>
      </div>

      {/* ── Visual: the scale mismatch ── */}
      <div className="space-y-4 p-5 sm:p-7">
        <Bar
          label="Annual debt service"
          value={annual}
          max={barMax}
          fill="var(--color-clay)"
        />
        <Bar
          label="Portland'5 FY24–25 operating + capital shortfall"
          value={HEADLINE.p5Shortfall}
          max={barMax}
          fill="var(--color-canopy)"
        />
        <Bar
          label="Even a doubled food-and-beverage program"
          value={HEADLINE.p5FnbNet}
          max={barMax}
          fill="var(--color-sage)"
        />
      </div>

      {/* ── Outcomes ── */}
      <div className="border-t border-[var(--color-parchment)]">
        <div className="grid divide-y divide-[var(--color-parchment)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              What the debt costs
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tabular-nums text-[var(--color-clay)]">
              {fmtMillions(annual)}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-muted)]">
              annual debt service, level payments
            </p>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              Versus the operating gap
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tabular-nums text-[var(--color-ember)]">
              ×{vsShortfall.toFixed(1)}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-muted)]">
              the entire FY24–25 Portland&apos;5 shortfall
            </p>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              Versus concessions
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tabular-nums text-[var(--color-clay)]">
              ×{vsFnb.toFixed(1)}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-muted)]">
              a doubled F&amp;B program
            </p>
          </div>
        </div>
        <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6">
          <p className="border-l-2 border-[var(--color-ember)] pl-4 font-editorial text-[15px] leading-snug text-[var(--color-ink)]">
            Portland&apos;5 does not have an operating-efficiency problem large enough to
            solve its capital problem.
          </p>
        </div>
      </div>
    </div>
  );
}
