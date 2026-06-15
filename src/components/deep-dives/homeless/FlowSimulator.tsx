"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";
import { simulate, FLOW, fmtNum, fmtMoney } from "@/lib/homeless/engine";
import { STATS } from "@/lib/homeless/data";

const COST_SEGMENTS = [
  { key: "prevention", label: "Prevention", cohort: "keeps the economic group from falling in", color: "var(--color-clay)" },
  { key: "housing", label: "Housing", cohort: "rehouses the economic & episodic groups", color: "var(--color-fern)" },
  { key: "treatment", label: "Treatment beds", cohort: "for the chronic & severe group", color: "var(--color-river)" },
] as const;

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  hint,
  accent,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
  hint?: string;
  accent: string;
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
        className="mt-1.5 w-full cursor-pointer"
        style={{ accentColor: accent }}
      />
      {hint ? <p className="text-[11px] text-[var(--color-ink-muted)] mt-0.5 leading-snug">{hint}</p> : null}
    </div>
  );
}

export default function FlowSimulator() {
  const [evictionPrevention, setEv] = useState(0);
  const [dischargeBan, setDc] = useState(0);
  const [treatmentBeds, setTb] = useState(0);
  const [workforceFill, setWf] = useState(0.8);
  const [masterLeased, setMl] = useState(0);

  const sim = useMemo(
    () => simulate({ evictionPrevention, dischargeBan, treatmentBeds, workforceFill, masterLeased }),
    [evictionPrevention, dischargeBan, treatmentBeds, workforceFill, masterLeased],
  );

  const data = sim.rows.map((r) => ({ ...r, year: +(r.month / 12).toFixed(2) }));
  const touched = evictionPrevention || dischargeBan || treatmentBeds || masterLeased;
  const shrinking = sim.scenarioNetMonthly < 0;

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white overflow-hidden">
      {/* Levers */}
      <div className="p-5 sm:p-7 border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-clay)]">
              Close the inflow (cheapest)
            </p>
            <Slider
              label="Eviction prevention"
              value={evictionPrevention} min={0} max={1} step={0.05}
              onChange={setEv} accent="#b85c3a"
              display={`${Math.round(evictionPrevention * 100)}%`}
              hint="Pay one-time arrears for a verified crisis; landlord made whole."
            />
            <Slider
              label="Ban institutional street discharge"
              value={dischargeBan} min={0} max={1} step={0.05}
              onChange={setDc} accent="#b85c3a"
              display={`${Math.round(dischargeBan * 100)}%`}
              hint="Stop releasing people from jail / hospital / foster care straight to the street."
            />
          </div>
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-fern)]">
              Open the outflow
            </p>
            <Slider
              label="Master-leased housing units"
              value={masterLeased} min={0} max={3000} step={50}
              onChange={setMl} accent="#3d7a5a"
              display={fmtNum(masterLeased)}
              hint="Lease existing apartments now, with a landlord-guarantee fund — units this year, not construction-years."
            />
            <Slider
              label="New staffed treatment beds"
              value={treatmentBeds} min={0} max={2000} step={50}
              onChange={setTb} accent="#3d7a5a"
              display={fmtNum(treatmentBeds)}
              hint="Detox & residential SUD beds — only count if you can staff them."
            />
            <Slider
              label="…of those, share actually staffed"
              value={workforceFill} min={0.5} max={1} step={0.05}
              onChange={setWf} accent="#64748b"
              display={`${Math.round(workforceFill * 100)}%`}
              hint="Workforce is the real rate-limiter — a bed you can't staff is a press release."
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5 sm:p-7">
        <p className="text-[13px] text-[var(--color-ink-light)] mb-3 leading-relaxed">
          People on Multnomah County&apos;s by-name list, projected 4 years out.{" "}
          <span className="text-[var(--color-storm)] font-semibold">Do nothing</span> and it climbs by
          ~{FLOW.inflow - FLOW.outflow}/month. Move the sliders and watch the{" "}
          <span className="text-[var(--color-canopy)] font-semibold">scenario</span> bend.
        </p>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 6" stroke="#d6d3d1" strokeOpacity={0.5} vertical={false} />
              {sim.crossover ? (
                <ReferenceLine
                  x={+(sim.crossover / 12).toFixed(2)}
                  stroke="#3d7a5a"
                  strokeDasharray="3 4"
                  strokeOpacity={0.7}
                  label={{ value: "growth stops", position: "insideTopRight", fontSize: 11, fill: "#3d7a5a" }}
                />
              ) : null}
              <XAxis
                dataKey="year"
                type="number"
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
                tickFormatter={(v: number) => (v === 0 ? "now" : `+${v}y`)}
                tick={{ fontSize: 12, fill: "#78716c", fontFamily: "var(--font-mono)" }}
                tickLine={false}
                axisLine={{ stroke: "#d6d3d1", strokeOpacity: 0.5 }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#78716c", fontFamily: "var(--font-mono)" }}
                tickLine={false}
                axisLine={false}
                width={52}
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#faf6f0",
                  border: "1px solid #ebe5da",
                  borderRadius: "2px",
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                  boxShadow: "0 4px 16px rgba(15,36,25,0.1)",
                  padding: "8px 12px",
                }}
                labelFormatter={(v) => (Number(v) === 0 ? "Today" : `In ${v} years`)}
                formatter={(value: number, name: string) => [
                  fmtNum(value),
                  name === "baseline" ? "Do nothing" : "Your scenario",
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", fontFamily: "var(--font-body)" }}
                formatter={(v: string) => (v === "baseline" ? "Do nothing" : "Your scenario")}
              />
              <Line type="monotone" dataKey="baseline" stroke="#78716c" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="scenario" stroke="#1a3a2a" strokeWidth={2.5} dot={false} animationDuration={500} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Outcomes */}
      <div className="grid sm:grid-cols-3 border-t border-[var(--color-parchment)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-parchment)]">
        <div className="p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">In 4 years, do nothing</p>
          <p className="mt-1 font-mono text-3xl font-bold text-[var(--color-storm)] tabular-nums">{fmtNum(sim.baselineEnd)}</p>
          <p className="text-[12px] text-[var(--color-ink-muted)] mt-1">people, up from {fmtNum(FLOW.startTotal)} today</p>
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">In 4 years, your scenario</p>
          <p className="mt-1 font-mono text-3xl font-bold text-[var(--color-canopy)] tabular-nums">{fmtNum(sim.scenarioEnd)}</p>
          <p className="text-[12px] text-[var(--color-ink-muted)] mt-1">
            {touched ? `${fmtNum(Math.abs(sim.baselineEnd - sim.scenarioEnd))} fewer than doing nothing` : "move a slider to change this"}
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">Does growth stop?</p>
          <p className={`mt-1 font-mono text-3xl font-bold tabular-nums ${shrinking ? "text-[var(--color-fern)]" : "text-[var(--color-clay)]"}`}>
            {shrinking ? "Yes" : "No"}
          </p>
          <p className="text-[12px] text-[var(--color-ink-muted)] mt-1 leading-snug">
            {shrinking
              ? "inflow now ≤ outflow — the list shrinks"
              : `still +${sim.scenarioNetMonthly}/month`}
          </p>
        </div>
      </div>

      {/* Cost of the scenario */}
      <div className="border-t border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-light)]">
            What this scenario costs to run, per year
          </p>
          <p className="font-mono text-[26px] font-bold text-[var(--color-canopy)] tabular-nums leading-none">
            {fmtMoney(sim.cost.total)}
            <span className="text-[13px] font-normal text-[var(--color-ink-muted)]">/yr</span>
          </p>
        </div>

        {/* Stacked bar */}
        <div className="mt-3 flex h-8 w-full overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white">
          {sim.cost.total > 0 ? (
            COST_SEGMENTS.map((seg) => {
              const val = sim.cost[seg.key];
              if (val <= 0) return null;
              return (
                <div
                  key={seg.key}
                  style={{ width: `${(val / sim.cost.total) * 100}%`, backgroundColor: seg.color }}
                  title={`${seg.label}: ${fmtMoney(val)}/yr`}
                />
              );
            })
          ) : (
            <div className="flex w-full items-center justify-center text-[11px] text-[var(--color-ink-muted)]">
              move a lever to spend something
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 grid sm:grid-cols-3 gap-x-5 gap-y-2">
          {COST_SEGMENTS.map((seg) => (
            <div key={seg.key} className="flex items-start gap-2">
              <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-[2px]" style={{ backgroundColor: seg.color }} />
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[13px] font-semibold text-[var(--color-ink)]">{seg.label}</span>
                  <span className="font-mono text-[13px] text-[var(--color-ink-light)] tabular-nums">
                    {fmtMoney(sim.cost[seg.key])}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-ink-muted)] leading-snug">{seg.cohort}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[12px] text-[var(--color-ink-muted)] leading-relaxed border-t border-[var(--color-parchment)] pt-3">
          {sim.cost.total > 0 ? (
            <>
              For scale, the regional homeless-services tax already raises ~
              {fmtMoney(STATS.shsCollectedFY25)}/year — this scenario is about{" "}
              <strong className="text-[var(--color-ink-light)]">
                {Math.round((sim.cost.total / STATS.shsCollectedFY25) * 100)}%
              </strong>{" "}
              of that. And it&apos;s set against the cost of <em>not</em> acting: every person kept off
              the street runs ~$40k/year in ER, jail, and EMS (see the next section).
            </>
          ) : (
            <>Doing nothing has a $0 program cost — and the list grows to {fmtNum(sim.baselineEnd)}. The
            street those people stay on is the most expensive option of all.</>
          )}
        </p>
      </div>
    </div>
  );
}
