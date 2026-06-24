"use client";

import { useState } from "react";
import { Home } from "lucide-react";
import { personalCost, projectedCost, fmtMoney, fmtPct } from "@/lib/fpdr/engine";
import { HEADLINE } from "@/lib/fpdr/data";

// Assessed-value bands. In Oregon, Measure 50 decoupled assessed value from
// market value, so these are NOT proxies for home size or quality — two similar
// homes can sit in very different bands.
const PRESETS = [
  { label: "Low", value: 200_000 },
  { label: "Typical", value: 350_000 },
  { label: "High", value: 550_000 },
  { label: "Very high", value: 850_000 },
];

export default function PersonalCostCalculator() {
  const [av, setAv] = useState(350_000);
  const cost = personalCost(av);
  const proj = projectedCost(av);

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* ── Controls ── */}
        <div className="p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[var(--color-parchment)]">
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-4 h-4 text-[var(--color-ember)]" />
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-light)]">
              Your home
            </h3>
          </div>
          <p className="text-[14px] text-[var(--color-ink-muted)] mb-6 leading-relaxed">
            Drag to your home&apos;s <strong>assessed value</strong> — the number
            on your county tax statement, usually well below what the home would
            sell for.
          </p>

          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wide text-[var(--color-ink-muted)]">
              Assessed value
            </span>
            <span className="font-mono text-[22px] font-bold text-[var(--color-canopy)] tabular-nums">
              {fmtMoney(av)}
            </span>
          </div>
          <input
            type="range"
            min={75_000}
            max={1_500_000}
            step={5_000}
            value={av}
            onChange={(e) => setAv(Number(e.target.value))}
            className="w-full accent-[var(--color-ember)] cursor-pointer"
            aria-label="Home assessed value"
          />
          <div className="flex justify-between text-[10px] font-mono text-[var(--color-ink-muted)] mt-1">
            <span>$75K</span>
            <span>$1.5M</span>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setAv(p.value)}
                className={`rounded-sm border px-2 py-2 text-[11px] font-medium transition-colors ${
                  av === p.value
                    ? "border-[var(--color-canopy)] bg-[var(--color-canopy)]/[0.04] text-[var(--color-canopy)]"
                    : "border-[var(--color-parchment)] text-[var(--color-ink-light)] hover:border-[var(--color-sage)]"
                }`}
              >
                <span className="block font-mono">{fmtMoney(p.value)}</span>
                <span className="block text-[10px] text-[var(--color-ink-muted)] mt-0.5">
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Result ── */}
        <div className="p-6 sm:p-8 lg:p-10 bg-[var(--color-paper-warm)] flex flex-col justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
            You pay FPDR about
          </p>
          <p className="mt-2 font-mono text-5xl sm:text-6xl font-bold text-[var(--color-canopy)] tabular-nums leading-none">
            {fmtMoney(cost.annual)}
          </p>
          <p className="text-[14px] text-[var(--color-ink-muted)] mt-2">
            per year — about{" "}
            <span className="font-semibold text-[var(--color-ink)]">
              {fmtMoney(cost.monthly)}/month
            </span>{" "}
            on this one pension fund
          </p>

          <div className="mt-6 grid grid-cols-2 gap-px bg-[var(--color-parchment)] rounded-sm overflow-hidden">
            <div className="bg-white p-4">
              <p className="font-mono text-[22px] font-bold text-[var(--color-ink)] tabular-nums">
                {fmtPct(HEADLINE.shareOfCityLine, 0)}
              </p>
              <p className="text-[11px] text-[var(--color-ink-muted)] leading-snug mt-1">
                of your City of Portland property taxes
              </p>
            </div>
            <div className="bg-white p-4">
              <p className="font-mono text-[22px] font-bold text-[var(--color-ink)] tabular-nums">
                {fmtMoney(proj.total)}
              </p>
              <p className="text-[11px] text-[var(--color-ink-muted)] leading-snug mt-1">
                projected over FY26–FY31, as the rate climbs
              </p>
            </div>
          </div>

          <p className="mt-5 text-[12px] text-[var(--color-ink-muted)] leading-relaxed border-t border-[var(--color-parchment)] pt-4">
            This is a separate line on your Multnomah County tax bill, labeled{" "}
            <span className="font-mono text-[var(--color-ink-light)]">
              &ldquo;Portland Fire/Police Pension.&rdquo;
            </span>{" "}
            Every property inside Portland city limits pays it.
          </p>
        </div>
      </div>
    </div>
  );
}
