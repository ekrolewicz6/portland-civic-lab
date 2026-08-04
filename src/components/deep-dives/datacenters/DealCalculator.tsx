"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { REGIONS } from "@/lib/datacenters/data";
import { dealMath, ASSUMPTIONS, type DealInputs } from "@/lib/datacenters/engine";

const fmtM = (m: number) =>
  m >= 1000 ? `$${(m / 1000).toFixed(1)}B` : `$${m.toFixed(m < 10 ? 1 : 0)}M`;
const fmtK = (n: number) => `$${Math.round(n / 1000).toLocaleString("en-US")}K`;

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  lo,
  hi,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  lo: string;
  hi: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wide text-[var(--color-ink-muted)]">
          {label}
        </span>
        <span className="font-mono text-[16px] font-bold text-[var(--color-canopy)] tabular-nums">
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
        className="w-full accent-[var(--color-ember)] cursor-pointer"
        aria-label={label}
      />
      <div className="flex justify-between text-[10px] font-mono text-[var(--color-ink-muted)] mt-0.5">
        <span>{lo}</span>
        <span>{hi}</span>
      </div>
    </div>
  );
}

export default function DealCalculator() {
  const [regionId, setRegionId] = useState("columbia-east");
  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[2];
  const [inp, setInp] = useState<DealInputs>({ ...REGIONS[2].preset });

  const set = (patch: Partial<DealInputs>) => setInp((prev) => ({ ...prev, ...patch }));
  const pickRegion = (id: string) => {
    const r = REGIONS.find((x) => x.id === id);
    if (!r) return;
    setRegionId(id);
    setInp({ ...r.preset });
  };

  const res = dealMath(inp);
  const p = inp.leveragePct / 100;
  const signs = res.net >= 0;
  const barMax = Math.max(res.pvFullTax, res.pvDealProperty, 1);

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* ── Controls ── */}
        <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[var(--color-parchment)]">
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-4 h-4 text-[var(--color-ember)]" />
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-light)]">
              Price the deal
            </h3>
          </div>
          <p className="text-[13px] text-[var(--color-ink-muted)] mb-5 leading-relaxed">
            Start from a region, then move the levers. Every input is a real deal term — the
            presets track the public record for each region.
          </p>

          <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => pickRegion(r.id)}
                className={`rounded-sm border px-2 py-2 text-left text-[11px] font-medium transition-colors ${
                  regionId === r.id
                    ? "border-[var(--color-canopy)] bg-[var(--color-canopy)]/[0.04] text-[var(--color-canopy)]"
                    : "border-[var(--color-parchment)] text-[var(--color-ink-light)] hover:border-[var(--color-sage)]"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          <div className="space-y-5">
            <Slider
              label="On-site investment (bldg + servers)"
              value={inp.investmentM}
              display={fmtM(inp.investmentM)}
              min={200}
              max={5000}
              step={100}
              onChange={(v) => set({ investmentM: v })}
              lo="$200M"
              hi="$5B"
            />
            <Slider
              label="Effective property tax rate"
              value={inp.taxRatePct}
              display={`${inp.taxRatePct.toFixed(2)}%`}
              min={0.7}
              max={1.4}
              step={0.05}
              onChange={(v) => set({ taxRatePct: v })}
              lo="0.7%"
              hi="1.4%"
            />
            <Slider
              label="Abatement length"
              value={inp.abatementYears}
              display={`${inp.abatementYears} yrs`}
              min={0}
              max={15}
              step={1}
              onChange={(v) => set({ abatementYears: v })}
              lo="none"
              hi="15 yrs"
            />
            <Slider
              label="Fee in lieu of taxes"
              value={inp.feeM}
              display={`${fmtM(inp.feeM)}/yr`}
              min={0}
              max={20}
              step={0.5}
              onChange={(v) => set({ feeM: v })}
              lo="$0"
              hi="$20M/yr"
            />
            <Slider
              label="Permanent jobs"
              value={inp.jobs}
              display={String(inp.jobs)}
              min={10}
              max={500}
              step={10}
              onChange={(v) => set({ jobs: v })}
              lo="10"
              hi="500"
            />
            <Slider
              label="Average wage"
              value={inp.wageK}
              display={`$${inp.wageK}K`}
              min={50}
              max={150}
              step={5}
              onChange={(v) => set({ wageK: v })}
              lo="$50K"
              hi="$150K"
            />
            <div className="rounded-sm border border-[var(--color-ember)]/40 bg-[#f6ecd9]/40 p-3">
              <Slider
                label="Leverage: would they build with NO break?"
                value={inp.leveragePct}
                display={`${inp.leveragePct}%`}
                min={0}
                max={100}
                step={5}
                onChange={(v) => set({ leveragePct: v })}
                lo="never"
                hi="certainly"
              />
              <p className="mt-1.5 text-[11px] text-[var(--color-ink-muted)] leading-snug">
                {region.leverageNote}
              </p>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="p-6 sm:p-8 bg-[var(--color-paper-warm)] flex flex-col justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
            The deal pencils out only if leverage is below
          </p>
          <p className="mt-2 font-mono text-5xl sm:text-6xl font-bold text-[var(--color-canopy)] tabular-nums leading-none">
            {(res.breakEvenP * 100).toFixed(0)}%
          </p>
          <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
            At your estimate ({inp.leveragePct}%), signing{" "}
            <strong className={signs ? "text-[var(--color-fern)]" : "text-[var(--color-clay)]"}>
              {signs ? "beats" : "loses to"} holding firm by {fmtM(Math.abs(res.net))}
            </strong>{" "}
            in expected 15-year value.
          </p>

          {/* leverage vs break-even track */}
          <div className="mt-5">
            <div className="relative h-2.5 w-full rounded-sm bg-white border border-[var(--color-parchment)] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0"
                style={{ width: `${res.breakEvenP * 100}%`, backgroundColor: "#e3efe7" }}
              />
              <div
                className="absolute inset-y-0 w-0.5 bg-[var(--color-canopy)]"
                style={{ left: `calc(${Math.min(p * 100, 99.5)}% - 1px)` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] font-mono text-[var(--color-ink-muted)]">
              <span>deal-friendly zone ends at {(res.breakEvenP * 100).toFixed(0)}%</span>
              <span>▎= your leverage</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { l: "If fully taxed, 15-yr PV", v: res.pvFullTax, c: "#1a3a2a" },
              { l: "What the deal pays, 15-yr PV", v: res.pvDealProperty, c: "#c8956c" },
            ].map((b) => (
              <div key={b.l}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] text-[var(--color-ink-light)]">{b.l}</span>
                  <span className="font-mono text-[15px] font-bold tabular-nums text-[var(--color-ink)]">
                    {fmtM(b.v)}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-sm bg-white border border-[var(--color-parchment)] overflow-hidden">
                  <div
                    className="h-full"
                    style={{ width: `${(b.v / barMax) * 100}%`, backgroundColor: b.c }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px bg-[var(--color-parchment)] rounded-sm overflow-hidden">
            <div className="bg-white p-4">
              <p className="font-mono text-[20px] font-bold text-[var(--color-ink)] tabular-nums">
                {fmtK(res.forgonePerJobYear)}
              </p>
              <p className="text-[11px] text-[var(--color-ink-muted)] leading-snug mt-1">
                taxes forgone per job, per year (state study range: $4.2K–$54.5K)
              </p>
            </div>
            <div className="bg-white p-4">
              <p className="font-mono text-[20px] font-bold text-[var(--color-ink)] tabular-nums">
                {fmtM(res.pvIncomeTax)}
              </p>
              <p className="text-[11px] text-[var(--color-ink-muted)] leading-snug mt-1">
                15-yr PV of income taxes from the jobs (goes to the state, not the county)
              </p>
            </div>
          </div>

          <p className="mt-5 text-[11px] text-[var(--color-ink-muted)] leading-relaxed border-t border-[var(--color-parchment)] pt-4">
            Teaching model, not a forecast: {ASSUMPTIONS.horizonYears}-yr horizon,{" "}
            {(ASSUMPTIONS.discountRate * 100).toFixed(0)}% real discount, taxable value ≈{" "}
            {(ASSUMPTIONS.taxableShare * 100).toFixed(0)}% of investment (server refresh vs.
            depreciation), {(ASSUMPTIONS.effectiveIncomeTax * 100).toFixed(1)}% effective income
            tax, baseline land revenue ≈ $0. Construction activity, utility fees, and service
            costs are excluded on both sides.
          </p>
        </div>
      </div>
    </div>
  );
}
