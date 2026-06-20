"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DEFAULTS,
  annualTax,
  buyerScarcityScenario,
  fmtMoney,
  fmtPct,
  projectFeasibility,
  reformRevenue,
  scarcityScenario,
  taxBasisScenario,
} from "@/lib/growth-politics/engine";

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  tone = "light",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  display: string;
  tone?: "light" | "dark";
}) {
  const labelClass = tone === "dark" ? "text-white/55" : "text-[var(--color-ink-light)]";
  const valueClass = tone === "dark" ? "text-[var(--color-ember-bright)]" : "text-[var(--color-canopy)]";

  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-4">
        <span className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${labelClass}`}>
          {label}
        </span>
        <span className={`font-mono text-[17px] font-bold tabular-nums ${valueClass}`}>
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full cursor-pointer accent-[var(--color-ember)]"
      />
    </label>
  );
}

function NumberCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border-y border-[var(--color-parchment)] bg-white p-4 sm:rounded-sm sm:border">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        {label}
      </p>
      <p className="mt-1 font-mono text-[24px] font-bold leading-none tabular-nums text-[var(--color-ink)]">
        {value}
      </p>
      {note ? <p className="mt-2 text-[12px] leading-snug text-[var(--color-ink-muted)]">{note}</p> : null}
    </div>
  );
}

function MoneyTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; payload?: { name?: string } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-3 py-2 shadow-lg">
      <p className="font-mono text-[12px] font-semibold text-[var(--color-ink)]">{label}</p>
      {payload.map((item) => (
        <p key={`${item.name}-${item.payload?.name}`} className="font-mono text-[12px] text-[var(--color-ink-light)]">
          {item.name}: {fmtMoney(Number(item.value ?? 0))}
        </p>
      ))}
    </div>
  );
}

function SameValueTaxTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; payload?: { name?: string; ratio?: string; note?: string } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const first = payload[0]?.payload;
  return (
    <div className="max-w-[260px] rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-3 py-2 shadow-lg">
      <p className="font-mono text-[12px] font-semibold text-[var(--color-ink)]">{label}</p>
      <p className="mt-1 font-mono text-[12px] text-[var(--color-ink-light)]">
        Modeled annual tax: {fmtMoney(Number(payload[0]?.value ?? 0))}
      </p>
      {first?.ratio ? (
        <p className="mt-2 text-[12px] leading-snug text-[var(--color-ink-light)]">
          Tax system counts {first.ratio} of the same market value.
        </p>
      ) : null}
      {first?.note ? (
        <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-light)]">{first.note}</p>
      ) : null}
    </div>
  );
}

function shortTaxBarLabel(value: string): string {
  if (value.startsWith("Older")) return "Older";
  if (value.startsWith("New")) return "New";
  if (value.startsWith("Minimum")) return "Floor";
  if (value.startsWith("Full")) return "Full";
  return value;
}

export function Measure50Calculator() {
  const [rmv, setRmv] = useState<number>(DEFAULTS.medianHomeValue);
  const [legacyRatio, setLegacyRatio] = useState<number>(0.35);
  const [corridorRatio, setCorridorRatio] = useState<number>(0.5);

  const result = useMemo(
    () => taxBasisScenario({ rmv, legacyRatio, corridorRatio }),
    [rmv, legacyRatio, corridorRatio],
  );

  const keyComparison = [
    {
      label: "Older capped-tax home",
      value: result.legacyTax,
      note: `Taxed as if ${fmtPct(legacyRatio, 0)} of the market value counts.`,
      fill: "#b85c3a",
    },
    {
      label: "New or heavily changed home",
      value: result.cprTax,
      note: `Taxed using the county's ${fmtPct(DEFAULTS.residentialCpr)} new-home ratio.`,
      fill: "#4a7f9e",
    },
  ];

  return (
    <div className="-mx-4 overflow-hidden border-y border-[var(--color-parchment)] bg-white sm:mx-0 sm:rounded-sm sm:border">
      <div className="grid xl:grid-cols-[0.78fr_1.22fr]">
        <div className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4 sm:p-7 lg:border-b-0 lg:border-r">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
            Property-tax comparison
          </p>
          <h3 className="mt-2 font-editorial text-[30px] leading-tight text-[var(--color-ink)]">
            Same home value, different tax bill.
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
            This shows how two homes worth the same amount can owe different yearly property taxes.
            The difference matters because it can save one owner money, raise costs for newer homes,
            and shift pressure onto renters, buyers, and public budgets. The policy slider below is a
            one-way minimum floor: it raises parcels below the floor but does not cut taxes for parcels
            already above it.
          </p>

          <div className="-mx-4 mt-5 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              In this example
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink-light)]">
              An older capped-tax home owes about{" "}
              <strong className="font-mono text-[var(--color-ink)]">{fmtMoney(result.legacyTax)}</strong>{" "}
              a year. A new or heavily changed home at the same market value owes about{" "}
              <strong className="font-mono text-[var(--color-ink)]">{fmtMoney(result.cprTax)}</strong>.
            </p>
            <p className="mt-3 rounded-sm bg-[var(--color-paper-warm)] p-3 text-[14px] leading-relaxed text-[var(--color-ink)]">
              Difference: <strong className="font-mono">{fmtMoney(result.annualAdvantageVsCpr)}</strong> per year.
              If you own the lower-tax home, that is savings. If you are buying, renting, or funding city services,
              that gap can show up somewhere else.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <Slider
              label="Real market value"
              value={rmv}
              min={250_000}
              max={1_800_000}
              step={25_000}
              onChange={setRmv}
              display={fmtMoney(rmv)}
            />
            <Slider
              label="Taxed share of market value"
              value={legacyRatio}
              min={0.18}
              max={0.65}
              step={0.01}
              onChange={setLegacyRatio}
              display={fmtPct(legacyRatio, 0)}
            />
            <Slider
              label="Policy example: minimum taxed share"
              value={corridorRatio}
              min={0.4}
              max={0.7}
              step={0.01}
              onChange={setCorridorRatio}
              display={fmtPct(corridorRatio, 0)}
            />
          </div>
        </div>

        <div className="p-4 sm:p-7">
          <div className="-mx-4 border-y border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4 sm:mx-0 sm:rounded-sm sm:border">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
              What the bars mean
            </p>
            <h4 className="mt-2 font-editorial text-[25px] leading-tight text-[var(--color-ink)]">
              Each bar is the estimated yearly property tax on the same {fmtMoney(rmv)} home.
            </h4>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
              The shorter the bar, the lower the yearly tax bill. The first two bars are the key comparison:
              an older capped-tax home versus a new or heavily changed home.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {keyComparison.map((item) => (
              <div key={item.label} className="border-y border-[var(--color-parchment)] bg-white p-4 sm:rounded-sm sm:border">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 rounded-[2px]" style={{ backgroundColor: item.fill }} />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                      {item.label}
                    </p>
                    <p className="mt-1 font-mono text-[25px] font-bold leading-none text-[var(--color-ink)]">
                      {fmtMoney(item.value)}
                    </p>
                    <p className="mt-2 text-[12px] leading-snug text-[var(--color-ink-muted)]">{item.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 h-[260px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.bars} margin={{ top: 18, right: 8, left: 8, bottom: 28 }}>
                <CartesianGrid strokeDasharray="2 6" stroke="#ebe5da" vertical={false} />
                <XAxis
                  dataKey="name"
                  interval={0}
                  tickFormatter={shortTaxBarLabel}
                  tick={{ fontFamily: "var(--font-mono)", fontSize: 12, fill: "#78716c" }}
                  tickLine={false}
                  axisLine={{ stroke: "#ebe5da" }}
                />
                <YAxis
                  tickFormatter={(v: number) => fmtMoney(v)}
                  tick={{ fontFamily: "var(--font-mono)", fontSize: 12, fill: "#78716c" }}
                  tickLine={false}
                  axisLine={false}
                  width={68}
                />
                <Tooltip content={<MoneyTooltip />} />
                <Bar dataKey="value" name="Annual tax" radius={[5, 5, 0, 0]} maxBarSize={88}>
                  {result.bars.map((bar) => (
                    <Cell key={bar.name} fill={bar.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <NumberCard
              label="Why owners care"
              value={fmtMoney(result.annualAdvantageVsCpr)}
              note="Modeled yearly savings for the older capped-tax home versus the new-home comparison."
            />
            <NumberCard
              label="Why buyers care"
              value={fmtMoney(result.capitalizedAdvantageVsCpr)}
              note="Rough estimate of how a lower yearly bill can get priced into a sale."
            />
            <NumberCard
              label="Why policy matters"
              value={fmtMoney(result.annualIncreaseToCorridor)}
              note="Modeled yearly increase if the property is below the minimum floor; $0 if already above it."
            />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            This is a formula model, not an exact property-tax estimate. Actual bills depend on location,
            bonds, exemptions, and county assessment details.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ScarcityTransferCalculator() {
  const [monthlyRent, setMonthlyRent] = useState<number>(DEFAULTS.medianRent);
  const [premium, setPremium] = useState<number>(0.1);
  const [households, setHouseholds] = useState<number>(DEFAULTS.renterHouseholds);

  const result = useMemo(
    () => scarcityScenario({ monthlyRent, scarcityPremium: premium, households }),
    [monthlyRent, premium, households],
  );

  const buyer = useMemo(
    () => buyerScarcityScenario({ homeValue: DEFAULTS.medianHomeValue, scarcityPremium: premium }),
    [premium],
  );

  return (
    <div className="-mx-4 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-7">
      <div className="grid gap-7 xl:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
            Housing shortage calculator
          </p>
          <h3 className="mt-2 font-editorial text-[30px] leading-tight text-[var(--color-ink)]">
            Even a small shortage premium is huge at city scale.
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
            When there are not enough homes, renters bid against each other for the homes that exist.
            This estimates the extra annual cost if rents are pushed up by a shortage premium.
          </p>
          <div className="mt-6 space-y-5">
            <Slider
              label="Median monthly rent"
              value={monthlyRent}
              min={900}
              max={3_200}
              step={25}
              onChange={setMonthlyRent}
              display={fmtMoney(monthlyRent)}
            />
            <Slider
              label="Shortage premium"
              value={premium}
              min={0.02}
              max={0.3}
              step={0.01}
              onChange={setPremium}
              display={fmtPct(premium, 0)}
            />
            <Slider
              label="Renter households"
              value={households}
              min={50_000}
              max={180_000}
              step={1_000}
              onChange={setHouseholds}
              display={households.toLocaleString()}
            />
          </div>
        </div>

        <div>
          <div className="grid gap-3 sm:grid-cols-3">
            <NumberCard label="Per renter/year" value={fmtMoney(result.perHousehold)} />
            <NumberCard label="Aggregate/year" value={fmtMoney(result.aggregate)} />
            <NumberCard label="Buyer impact" value={fmtMoney(buyer.annual)} note="Extra annual mortgage cost on median home." />
          </div>
          <div className="-mx-4 mt-6 border-y border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4 sm:mx-0 sm:rounded-sm sm:border">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
              Citywide yearly cost by shortage premium
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
              The chart shows aggregate renter cost only. The per-household number is shown above because it
              is much smaller than the citywide total and would disappear on the same axis.
            </p>
          </div>
          <div className="mt-4 h-[260px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.rows} margin={{ top: 18, right: 10, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="2 6" stroke="#ebe5da" vertical={false} />
                <XAxis dataKey="premium" tick={{ fontFamily: "var(--font-mono)", fontSize: 12, fill: "#78716c" }} tickLine={false} axisLine={{ stroke: "#ebe5da" }} />
                <YAxis tickFormatter={(v: number) => fmtMoney(v)} tick={{ fontFamily: "var(--font-mono)", fontSize: 12, fill: "#78716c" }} tickLine={false} axisLine={false} width={74} />
                <Tooltip content={<MoneyTooltip />} />
                <Bar dataKey="aggregate" name="Citywide yearly renter cost" fill="#1a3a2a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectFeasibilityCalculator() {
  const [delayMonths, setDelayMonths] = useState<number>(6);
  const [sdcPerUnit, setSdcPerUnit] = useState<number>(20_000);
  const [annualTaxPerUnit, setAnnualTaxPerUnit] = useState<number>(4_500);
  const [ihGap, setIhGap] = useState<number>(90_000);

  const result = useMemo(
    () =>
      projectFeasibility({
        projectCost: 30_000_000,
        units: 100,
        carryRate: 0.1,
        delayMonths,
        sdcPerUnit,
        ihAnnualGap: ihGap,
        yieldRate: 0.06,
        annualTaxPerUnit,
      }),
    [annualTaxPerUnit, delayMonths, ihGap, sdcPerUnit],
  );

  return (
    <div className="-mx-4 overflow-hidden border-y border-[var(--color-parchment)] bg-white sm:mx-0 sm:rounded-sm sm:border">
      <div className="grid xl:grid-cols-[0.82fr_1.18fr]">
        <div className="bg-[var(--color-canopy)] p-4 text-white sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
            New-apartment cost calculator
          </p>
          <h3 className="mt-2 font-editorial text-[30px] leading-tight">
            What costs get loaded onto the next apartment?
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-white/70">
            Baseline: 100-unit, $30M project, 10% annual interest/carrying cost, and a 6% needed return.
            Move the levers to see how delay, fees, affordable-unit costs, and taxes raise the rent a project needs.
          </p>
          <div className="mt-6 space-y-5">
            <Slider tone="dark" label="Delay months" value={delayMonths} min={0} max={18} step={1} onChange={setDelayMonths} display={`${delayMonths} mo.`} />
            <Slider tone="dark" label="Development fees / unit" value={sdcPerUnit} min={0} max={50_000} step={1_000} onChange={setSdcPerUnit} display={fmtMoney(sdcPerUnit)} />
            <Slider tone="dark" label="Annual tax / unit" value={annualTaxPerUnit} min={0} max={8_000} step={250} onChange={setAnnualTaxPerUnit} display={fmtMoney(annualTaxPerUnit)} />
            <Slider tone="dark" label="Affordable-unit funding gap" value={ihGap} min={0} max={160_000} step={5_000} onChange={setIhGap} display={fmtMoney(ihGap)} />
          </div>
        </div>
        <div className="p-4 sm:p-7">
          <div className="grid sm:grid-cols-3 gap-3">
            <NumberCard label="Delay cost" value={fmtMoney(result.delayCost)} note="Interest/carrying cost while waiting." />
            <NumberCard label="One-time burden / unit" value={fmtMoney(result.oneTimeCostPerUnit)} />
            <NumberCard label="Added rent needed" value={fmtMoney(result.monthlyThresholdTotal)} note="Monthly amount needed to cover the modeled costs." />
          </div>
          <div className="mt-6 h-[260px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.stack} margin={{ top: 18, right: 8, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 6" stroke="#ebe5da" vertical={false} />
                <XAxis dataKey="name" tick={{ fontFamily: "var(--font-mono)", fontSize: 12, fill: "#78716c" }} tickLine={false} axisLine={{ stroke: "#ebe5da" }} />
                <YAxis tickFormatter={(v: number) => fmtMoney(v)} tick={{ fontFamily: "var(--font-mono)", fontSize: 12, fill: "#78716c" }} tickLine={false} axisLine={false} width={74} />
                <Tooltip content={<MoneyTooltip />} />
                <Bar dataKey="value" name="Cost per unit" radius={[5, 5, 0, 0]} maxBarSize={110}>
                  {result.stack.map((bar) => <Cell key={bar.name} fill={bar.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReformLeverSimulator() {
  const [additionalAv, setAdditionalAv] = useState<number>(10_000_000_000);
  const result = useMemo(() => reformRevenue(additionalAv), [additionalAv]);

  return (
    <div className="-mx-4 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-7">
      <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-7 items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
            Tax reform funding simulator
          </p>
          <h3 className="mt-2 font-editorial text-[30px] leading-tight text-[var(--color-ink)]">
            What could a fairer tax base pay for?
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
            This shows rough yearly public dollars if reform makes more property value count for taxes.
            It does not account for every legal limit, district rule, bond, or budget restriction.
          </p>
          <div className="mt-6">
            <Slider
              label="Additional property value counted for taxes"
              value={additionalAv}
              min={1_000_000_000}
              max={20_000_000_000}
              step={500_000_000}
              onChange={setAdditionalAv}
              display={fmtMoney(additionalAv, 1)}
            />
          </div>
          <div className="mt-5">
            <NumberCard label="Rough yearly public dollars" value={fmtMoney(result.annual, 1)} note="Additional taxable value / 1,000 × tax rate." />
          </div>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-6 items-center">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={result.allocation} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="88%" paddingAngle={2}>
                  {result.allocation.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                </Pie>
                <Tooltip content={<MoneyTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {result.allocation.map((item) => (
              <div key={item.name} className="flex items-start gap-3 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-3">
                <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-[2px]" style={{ backgroundColor: item.fill }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13px] font-semibold leading-tight text-[var(--color-ink)]">{item.name}</p>
                    <p className="font-mono text-[13px] font-bold tabular-nums text-[var(--color-canopy)]">
                      {fmtMoney(item.value, 1)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyTaxMiniChart() {
  const data = [
    {
      name: "25% counted",
      tax: Math.round(annualTax(DEFAULTS.medianHomeValue, 0.25)),
      fill: "#b85c3a",
      ratio: "25%",
      note: "Example of a very low taxable basis after many years of capped growth.",
    },
    {
      name: "35% counted",
      tax: Math.round(annualTax(DEFAULTS.medianHomeValue, 0.35)),
      fill: "#c8956c",
      ratio: "35%",
      note: "Example of an older property with a low, but less extreme, taxable basis.",
    },
    {
      name: "48% new",
      tax: Math.round(annualTax(DEFAULTS.medianHomeValue, DEFAULTS.residentialCpr)),
      fill: "#4a7f9e",
      ratio: "48.1%",
      note: "Uses Multnomah County's 2025-26 residential changed-property ratio.",
    },
    {
      name: "55% counted",
      tax: Math.round(annualTax(DEFAULTS.medianHomeValue, 0.55)),
      fill: "#1a3a2a",
      ratio: "55%",
      note: "Example of a property already taxed above the proposed 50% floor.",
    },
  ];

  return (
    <div className="rounded-sm border border-white/12 bg-white/[0.05] p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-sm border border-white/10 bg-black/10 p-3">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
            Same market value
          </p>
          <p className="mt-1 font-mono text-[22px] font-bold text-white">{fmtMoney(DEFAULTS.medianHomeValue)}</p>
        </div>
        <div className="rounded-sm border border-white/10 bg-black/10 p-3">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
            What changes
          </p>
          <p className="mt-1 text-[13px] leading-snug text-white/78">
            Not the home value. Only the taxable share of that value.
          </p>
        </div>
      </div>
      <div className="mt-3 rounded-sm border border-white/10 bg-black/10 p-3">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
          How to read 25% or 35%
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/78">
          These are not the age of the house. They mean the tax system counts only 25% or 35% of the
          home&apos;s market value. Those first two bars are examples of long-capped properties: the taxable
          value has lagged behind market value for many years while the annual taxable-value increase was
          capped, usually at 3%.
        </p>
      </div>
      <div className="h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.13)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "rgba(255,255,255,0.62)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tickFormatter={(v: number) => fmtMoney(v)} tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "rgba(255,255,255,0.5)" }} tickLine={false} axisLine={false} width={58} />
            <Tooltip content={<SameValueTaxTooltip />} />
            <Bar dataKey="tax" name="Modeled annual tax" radius={[4, 4, 0, 0]}>
              {data.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <p className="rounded-sm border border-white/10 bg-black/10 p-3 text-[12px] leading-relaxed text-white/68">
          <span className="font-semibold text-white">Why “long-capped”?</span> Oregon&apos;s taxable value
          system dates back to the Measure 50 reset in the 1990s. A house does not have to be owned by
          the same person the whole time, because a sale usually does not reset the taxable basis.
        </p>
        <p className="rounded-sm border border-white/10 bg-black/10 p-3 text-[12px] leading-relaxed text-white/68">
          <span className="font-semibold text-white">Why compare to new?</span> New or heavily changed
          housing usually enters the rolls using Multnomah County&apos;s changed-property ratio, so it can
          start closer to today&apos;s market value than a long-capped property.
        </p>
      </div>
    </div>
  );
}
