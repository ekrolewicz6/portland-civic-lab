// HomeownerCalculator: interactive card that lets a reader drag a slider to
// their home's assessed value and see the four PPS lines on their property tax
// bill, the annual total, and the compression-adjusted figure for the local
// option levy. Serves the "what you pay" section of the PPS budget deep dive.
"use client";

import { useState } from "react";
import { Home } from "lucide-react";
import {
  homeownerTax,
  TAX_RATES,
  LEVY_EFFECTIVE_RATE,
  fmtMoney,
} from "@/lib/pps-budget/engine";

export default function HomeownerCalculator() {
  const [av, setAv] = useState(300_000);
  const tax = homeownerTax(av);

  const lines: { label: string; rate: number; amount: number }[] = [
    { label: "Permanent rate", rate: TAX_RATES.permanent, amount: tax.permanent },
    { label: "Gap bond", rate: TAX_RATES.gap, amount: tax.gap },
    { label: "Local option levy", rate: TAX_RATES.localOption, amount: tax.localOption },
    { label: "Construction bond", rate: TAX_RATES.bond, amount: tax.bond },
  ];

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
            Drag to your home&apos;s <strong>assessed value</strong>, not its
            market value. Assessed value is the taxable number on your county
            statement, usually well below what the home would sell for.
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
            min={150_000}
            max={900_000}
            step={10_000}
            value={av}
            onChange={(e) => setAv(Number(e.target.value))}
            className="w-full accent-[var(--color-ember)] cursor-pointer"
            aria-label="Home assessed value"
          />
          <div className="flex justify-between text-[10px] font-mono text-[var(--color-ink-muted)] mt-1">
            <span>$150K</span>
            <span>$900K</span>
          </div>

          <p className="mt-6 text-[12px] text-[var(--color-ink-muted)] leading-relaxed border-t border-[var(--color-parchment)] pt-4">
            These four lines appear on every Multnomah County tax bill for a
            property inside the PPS district. Rates are set per $1,000 of
            assessed value.
          </p>
        </div>

        {/* ── Tax lines ── */}
        <div className="p-6 sm:p-8 lg:p-10 bg-[var(--color-paper-warm)] flex flex-col justify-center">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            What this home pays PPS per year
          </p>

          <div className="mt-4 divide-y divide-[var(--color-parchment)]">
            {lines.map((line) => (
              <div key={line.label} className="py-3">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-ink)]">
                      {line.label}
                    </p>
                    <p className="font-mono text-[10px] text-[var(--color-ink-muted)] tabular-nums">
                      ${line.rate} per $1,000
                    </p>
                  </div>
                  <p className="font-mono text-[16px] font-semibold text-[var(--color-ink)] tabular-nums text-right">
                    {fmtMoney(line.amount)}
                  </p>
                </div>
                {line.label === "Local option levy" && (
                  <div className="mt-2 flex items-baseline justify-between gap-4 rounded-sm bg-[var(--color-sage-tint)] px-3 py-2">
                    <p className="text-[11px] text-[var(--color-ink-light)] leading-snug">
                      compression-adjusted: what the district actually receives
                      from this line
                      <span className="block font-mono text-[10px] text-[var(--color-ink-muted)] tabular-nums mt-0.5">
                        ${LEVY_EFFECTIVE_RATE} per $1,000 after compression
                      </span>
                    </p>
                    <p className="font-mono text-[13px] font-semibold text-[var(--color-fern)] tabular-nums text-right">
                      {fmtMoney(tax.localOptionEffective)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-1 flex items-baseline justify-between gap-4 border-t-2 border-[var(--color-canopy)] pt-3">
            <p className="text-[13px] font-semibold text-[var(--color-canopy)]">
              Total to PPS
            </p>
            <p className="font-mono text-[24px] font-bold text-[var(--color-canopy)] tabular-nums text-right">
              {fmtMoney(tax.total)}
            </p>
          </div>

          <p className="mt-5 font-mono text-[10px] text-[var(--color-ink-muted)] leading-relaxed">
            Rates: Portland Public Schools adopted budget, FY2026-27.
            Compression-adjusted levy rate: Tax Supervising and Conservation
            Commission annual report, FY2024-25.
          </p>
        </div>
      </div>
    </div>
  );
}
