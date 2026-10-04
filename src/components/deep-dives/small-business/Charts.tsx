"use client";

import { useState, useMemo } from "react";
import data from "@/data/small-business/evidence.json";

const fmt = (v: number | null, digits = 0) =>
  v === null
    ? "Unavailable"
    : v.toLocaleString("en-US", { maximumFractionDigits: digits });
const pct = (v: number) => `${v.toFixed(1)}%`;
const money = (v: number) => (v < 0 ? `−$${fmt(-v)}` : `$${fmt(v)}`);
const signedPct = (v: number) =>
  `${v > 0 ? "+" : v < 0 ? "−" : ""}${pct(Math.abs(v))}`;
const palette = [
  "#b8d98b",
  "#86bba1",
  "#5d9b89",
  "#327567",
  "#174c42",
  "#c3784e",
];
const sizeCodes = ["02", "03", "04", "06", "07", "09"];
const sizeLabels = ["Under 5", "5–9", "10–19", "20–99", "100–499", "500+"];
const portland = data.size.filter((r) => r.metro === "Portland");
const industryNames: Record<string, string> = {
  "Accommodation/food": "Hotels and restaurants",
  Administrative: "Administrative services",
  Management: "Corporate offices",
  Professional: "Professional services",
  Transport: "Transportation",
};
const industry = (name: string) => industryNames[name] || name;

function Toggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="sb-toggle" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          type="button"
          key={o.value}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
function Table({
  headers,
  rows,
  label = "See the numbers in a table",
}: {
  headers: string[];
  rows: (string | number)[][];
  label?: string;
}) {
  return (
    <details className="sb-data-table">
      <summary>{label}</summary>
      <div className="sb-table-scroll">
        <table>
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((v, j) =>
                  j === 0 ? (
                    <th key={j} scope="row">
                      {v}
                    </th>
                  ) : (
                    <td key={j}>{v}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function ContributionChart() {
  const [band, setBand] = useState("08");
  const [metric, setMetric] = useState<
    "jobs_share" | "payroll_share" | "receipts_share"
  >("jobs_share");
  const row = portland.find((r) => r.size_code === band)!;
  const share = (row[metric] || 0) * 100;
  return (
    <div>
      <div className="sb-controls">
        <Toggle
          label="Company size cutoff"
          value={band}
          onChange={setBand}
          options={[
            { value: "08", label: "Fewer than 500 employees" },
            { value: "05", label: "Fewer than 20 employees" },
          ]}
        />
        <Toggle
          label="What to measure"
          value={metric}
          onChange={setMetric}
          options={[
            { value: "jobs_share", label: "Jobs" },
            { value: "payroll_share", label: "Pay" },
            { value: "receipts_share", label: "Sales" },
          ]}
        />
      </div>
      <div className="sb-waffle-layout">
        <div className="sb-waffle" aria-hidden="true">
          {Array.from({ length: 100 }, (_, i) => (
            <i
              key={i}
              style={{
                background: `linear-gradient(90deg, var(--sb-green) ${Math.max(0, Math.min(100, (share - i) * 100))}%, var(--sb-line) 0)`,
              }}
            />
          ))}
        </div>
        <div className="sb-number-story" aria-live="polite">
          <span className="sb-huge">{pct(share)}</span>
          <h4>
            of all{" "}
            {metric === "jobs_share"
              ? "jobs"
              : metric === "payroll_share"
                ? "pay"
                : "sales"}{" "}
            in the Portland area
          </h4>
          <p>
            {metric === "jobs_share" ? "are" : "is"} at companies with fewer
            than {band === "08" ? "500" : "20"} employees, counting every
            location the company has.
          </p>
          <div className="sb-mini-stats">
            {[
              ["Jobs", row.jobs_share],
              ["Pay", row.payroll_share],
              ["Sales", row.receipts_share],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <strong>{pct(Number(value) * 100)}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="sb-chart-explainer">
        Each square is one percent of the total. Businesses with no employees
        are not in this chart.
      </p>
      <Table
        headers={[
          "Company size (employees)",
          "Jobs",
          "Share of jobs",
          "Share of pay",
          "Share of sales",
        ]}
        rows={sizeCodes.map((code, i) => {
          const r = portland.find((r) => r.size_code === code)!;
          return [
            sizeLabels[i],
            fmt(r.jobs),
            pct(r.jobs_share! * 100),
            pct(r.payroll_share! * 100),
            pct(r.receipts_share! * 100),
          ];
        })}
      />
    </div>
  );
}

export function SizeBands() {
  const rows = sizeCodes.map((code) =>
    portland.find((r) => r.size_code === code)!,
  );
  return (
    <div>
      <div
        className="sb-stacked"
        aria-label="Portland-area jobs divided into six company sizes"
      >
        {rows.map((r, i) => (
          <div
            key={r.size_code}
            style={{
              width: `${r.jobs_share! * 100}%`,
              background: palette[i],
              color: i === 3 || i === 4 ? "#fff" : "#10251b",
            }}
          >
            <span>{(r.jobs_share! * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <div className="sb-band-legend">
        {rows.map((r, i) => (
          <div key={r.size_code}>
            <i style={{ background: palette[i] }} />
            <span>{sizeLabels[i]} employees</span>
            <strong>
              {fmt(r.jobs)} jobs · {pct(r.jobs_share! * 100)}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IndustryExplorer() {
  const [metric, setMetric] = useState<"jobs" | "firms" | "payroll_usd">(
    "jobs",
  );
  const rows = [
    ...data.sectors.filter((r) => r.size_code === "01" && r.naics !== "99"),
  ].sort((a, b) => (b[metric] || 0) - (a[metric] || 0));
  const max = rows[0][metric]!;
  const small = new Map(
    data.sectors.filter((r) => r.size_code === "08").map((r) => [r.naics, r]),
  );
  const display = (v: number | null) =>
    metric === "payroll_usd" ? `$${((v || 0) / 1e9).toFixed(2)}B` : fmt(v);
  return (
    <div>
      <Toggle
        label="What to measure"
        value={metric}
        onChange={setMetric}
        options={[
          { value: "jobs", label: "Jobs" },
          { value: "firms", label: "Companies" },
          { value: "payroll_usd", label: "Total pay" },
        ]}
      />
      <div className="sb-legend">
        <span>
          <i className="sb-green-dot" />
          Companies with fewer than 500 employees
        </span>
        <span>
          <i className="sb-rust-dot" />
          Companies with 500 or more
        </span>
      </div>
      <div className="sb-bar-chart">
        {rows.map((r) => {
          const value = r[metric] || 0;
          const part = small.get(r.naics)?.[metric] || 0;
          return (
            <div className="sb-bar-row" key={r.naics}>
              <span>{industry(r.sector)}</span>
              <div className="sb-bar-track">
                <div
                  className="sb-split-bar"
                  style={{ width: `${(value / max) * 100}%` }}
                >
                  <i style={{ width: `${(part / value) * 100}%` }} />
                  <b style={{ flex: 1 }} />
                </div>
              </div>
              <strong>{display(value)}</strong>
            </div>
          );
        })}
      </div>
      <p className="sb-chart-explainer">
        Try switching from jobs to companies. Health care has many small
        practices alongside a few very large health systems, so it looks
        different each way. A company that works in two industries is counted in
        both, so the company counts can’t be added up.
      </p>
      <Table
        headers={[
          "Industry",
          "All jobs",
          "Jobs at companies under 500",
          "Companies",
          "Total pay",
        ]}
        rows={rows.map((r) => [
          industry(r.sector),
          fmt(r.jobs),
          fmt(small.get(r.naics)?.jobs ?? null),
          fmt(r.firms),
          money(r.payroll_usd || 0),
        ])}
      />
    </div>
  );
}

export function PeerComparison() {
  const [band, setBand] = useState("08");
  const [adjusted, setAdjusted] = useState(false);
  const [metric, setMetric] = useState<
    "jobs_share" | "payroll_share" | "receipts_share"
  >("jobs_share");
  const rows = data.size
    .filter((r) => r.size_code === band)
    .map((r) => ({
      name: r.metro,
      raw: r[metric]! * 100,
      value:
        adjusted && metric === "jobs_share"
          ? data.adjusted.find((a) => a.msa === r.msa && a.size_code === band)!
              .adjusted_jobs_share
          : r[metric]! * 100,
    }))
    .sort((a, b) => b.value - a.value);
  const benchmark =
    (data.metros.reduce(
      (a, r) => a + (band === "08" ? r.smallJobs : r.microJobs),
      0,
    ) /
      data.metros.reduce((a, r) => a + r.jobs, 0)) *
    100;
  return (
    <div>
      <div className="sb-controls">
        <Toggle
          label="Company size cutoff"
          value={band}
          onChange={setBand}
          options={[
            { value: "08", label: "Fewer than 500 employees" },
            { value: "05", label: "Fewer than 20" },
          ]}
        />
        <Toggle
          label="What to measure"
          value={metric}
          onChange={setMetric}
          options={[
            { value: "jobs_share", label: "Jobs" },
            { value: "payroll_share", label: "Pay" },
            { value: "receipts_share", label: "Sales" },
          ]}
        />
      </div>
      <label className="sb-check">
        <input
          type="checkbox"
          checked={adjusted}
          onChange={(e) => setAdjusted(e.target.checked)}
          disabled={metric !== "jobs_share"}
        />{" "}
        Give every metro Portland’s mix of industries{" "}
        <span>(works for jobs only)</span>
      </label>
      <div className="sb-peer-bars" aria-live="polite">
        {rows.map((r) => (
          <div
            className={`sb-peer-row ${r.name === "Portland" ? "sb-highlight-row" : ""}`}
            key={r.name}
          >
            <span>
              {r.name}
              {r.name === "Portland" && <small>OR–WA metro</small>}
            </span>
            <div>
              <i style={{ width: `${(r.value / 65) * 100}%` }} />
            </div>
            <strong>{pct(r.value)}</strong>
          </div>
        ))}
      </div>
      <p className="sb-chart-explainer">
        {adjusted && metric === "jobs_share"
          ? "This version asks what each metro’s share would be if it had Portland’s mix of industries. It removes one difference between regions. Others remain, such as how old the companies are, what each region specializes in and local policy."
          : `Across all 387 U.S. metro areas, ${pct(benchmark)} of ${metric === "jobs_share" ? "jobs" : metric === "payroll_share" ? "pay" : "sales"} ${metric === "jobs_share" ? "are" : "is"} at companies this size. The chart compares nine metros. It does not rank them from best to worst.`}
      </p>
      <Table
        headers={[
          "Metro area",
          "Actual share",
          adjusted && metric === "jobs_share"
            ? "With Portland’s industry mix"
            : "Share shown",
        ]}
        rows={rows.map((r) => [r.name, pct(r.raw), pct(r.value)])}
      />
    </div>
  );
}

export function MetroContext() {
  const [minimum, setMinimum] = useState("0");
  const metros = data.metros.filter((r) => r.jobs >= Number(minimum));
  const dots = [...metros].sort((a, b) => a.share - b.share);
  const min = 20,
    max = 80;
  const x = (n: number) => 34 + ((n - min) / (max - min)) * 712;
  return (
    <div>
      <Toggle
        label="Metro comparison population"
        value={minimum}
        onChange={setMinimum}
        options={[
          { value: "0", label: "All 387 metros" },
          { value: "500000", label: "Large metros (500,000+ jobs)" },
        ]}
      />
      <svg
        className="sb-svg sb-context-svg"
        viewBox="0 0 780 205"
        role="img"
        aria-label={`Share of jobs at companies with fewer than 500 employees in ${dots.length} U.S. metro areas. Portland is 50.2 percent.`}
      >
        {[20, 30, 40, 50, 60, 70, 80].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1="30" y2="157" stroke="#d5d9ce" />
            <text x={x(v)} y="182" textAnchor="middle">
              {v}%
            </text>
          </g>
        ))}
        {dots
          .filter((r) => r.msa !== "38900")
          .map((r, i) => (
            <circle
              key={r.msa}
              cx={x(r.share)}
              cy={45 + (i % 9) * 11}
              r="3.7"
              fill="#71978b"
              opacity=".68"
            >
              <title>{`${r.name}: ${pct(r.share)} of ${fmt(r.jobs)} jobs`}</title>
            </circle>
          ))}
        <line
          x1={x(50.2386)}
          x2={x(50.2386)}
          y1="20"
          y2="154"
          stroke="#a34727"
          strokeWidth="2"
        />
        <text x={x(50.2386) + 8} y="20" fill="#a34727">
          Portland 50.2%
        </text>
      </svg>
      <p className="sb-chart-explainer">
        Each dot is one metro area. The dots are stacked only to keep them from
        overlapping. Smaller metros often have higher shares. This view shows{" "}
        {dots.length} metro areas and leaves out small towns and rural areas.
      </p>
      <Table
        headers={["Metro area", "Jobs", "Share at companies under 500"]}
        rows={[...metros]
          .sort((a, b) => b.jobs - a.jobs)
          .map((r) => [r.name, fmt(r.jobs), pct(r.share)])}
        label={`See all ${dots.length} metro areas in a table`}
      />
    </div>
  );
}

export function SectorMatrix() {
  const [selected, setSelected] = useState("62");
  const rows = data.qcew
    .filter(
      (r) =>
        r.year === 2025 &&
        r.naics !== "10" &&
        r.naics !== "99" &&
        (r.jobs || 0) > 1000,
    )
    .map((r) => {
      const base = data.qcew.find(
        (b) => b.year === 2019 && b.naics === r.naics,
      )!;
      return {
        ...r,
        change: (r.jobs! / base.jobs! - 1) * 100,
        before: base.jobs!,
      };
    });
  const r = rows.find((r) => r.naics === selected)!;
  const x = (n: number) => 74 + ((n + 30) / 60) * 590;
  const y = (n: number) => 344 - (n / 2.2) * 280;
  return (
    <div>
      <div className="sb-matrix-layout">
        <svg
          className="sb-svg"
          viewBox="0 0 730 418"
          role="group"
          aria-label="Each industry’s change in jobs from 2019 to 2025, plotted against how large a part of the local economy it is compared with the United States. Use the industry menu or the table for exact values."
        >
          <text x="75" y="27" className="sb-plot-note">
            ↑ Share of jobs here vs. U.S.
          </text>
          {[-30, -20, -10, 0, 10, 20, 30].map((n) => (
            <g key={n}>
              <line
                x1={x(n)}
                x2={x(n)}
                y1="45"
                y2="344"
                stroke={n === 0 ? "#749384" : "#dfe2d8"}
                strokeDasharray={n === 0 ? "4 4" : undefined}
              />
              <text x={x(n)} y="371" textAnchor="middle">
                {n > 0 ? "+" : ""}
                {n}%
              </text>
            </g>
          ))}
          {[0, 0.5, 1, 1.5, 2].map((n) => (
            <g key={n}>
              <line
                x1="74"
                x2="664"
                y1={y(n)}
                y2={y(n)}
                stroke={n === 1 ? "#749384" : "#dfe2d8"}
                strokeDasharray={n === 1 ? "4 4" : undefined}
              />
              <text x="58" y={y(n) + 5} textAnchor="end">
                {n.toFixed(1)}×
              </text>
            </g>
          ))}
          {rows.map((a) => (
            <circle
              className="sb-matrix-bubble"
              tabIndex={0}
              role="button"
              aria-label={`Show ${industry(a.sector)}`}
              aria-pressed={selected === a.naics}
              onClick={() => setSelected(a.naics)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(a.naics);
                }
              }}
              key={a.naics}
              cx={x(a.change)}
              cy={y(a.employment_lq!)}
              r={Math.sqrt(a.jobs! / 75064) * 27}
              fill={a.average_pay_usd! > 80983 ? "#1f6151" : "#bc704b"}
              opacity={selected === a.naics ? 1 : 0.5}
              stroke={selected === a.naics ? "#152f26" : "#fff"}
              strokeWidth={selected === a.naics ? 3 : 1}
            >
              <title>{`${industry(a.sector)}: jobs changed ${signedPct(a.change)}; ${a.employment_lq} times its share of U.S. jobs; average yearly pay ${money(a.average_pay_usd!)}`}</title>
            </circle>
          ))}
          <text x="369" y="410" textAnchor="middle">
            Change in jobs, 2019 to 2025 →
          </text>
        </svg>
        <div className="sb-sector-detail">
          <label htmlFor="sb-sector">Choose an industry</label>
          <select
            id="sb-sector"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {rows.map((r) => (
              <option key={r.naics} value={r.naics}>
                {industry(r.sector)}
              </option>
            ))}
          </select>
          <div aria-live="polite">
            <strong className={r.change >= 0 ? "sb-positive" : "sb-negative"}>
              {signedPct(r.change)}
            </strong>
            <p>
              {fmt(r.before)} jobs in 2019, {fmt(r.jobs)} in 2025
            </p>
            <dl>
              <dt>Share of jobs here vs. U.S.</dt>
              <dd>{r.employment_lq}×</dd>
              <dt>Average yearly pay</dt>
              <dd>{money(r.average_pay_usd!)}</dd>
            </dl>
          </div>
          <p>
            Bigger circles have more jobs.{" "}
            <span className="sb-positive">Green</span> industries pay more than
            the county’s private-sector average.{" "}
            <span className="sb-negative">Rust</span> industries pay less.
          </p>
        </div>
      </div>
      <Table
        headers={[
          "Industry",
          "2019 jobs",
          "2025 jobs",
          "Change",
          "Share of jobs vs. U.S.",
          "Average pay, 2025",
        ]}
        rows={rows.map((r) => [
          industry(r.sector),
          fmt(r.before),
          fmt(r.jobs),
          signedPct(r.change),
          `${r.employment_lq}×`,
          money(r.average_pay_usd!),
        ])}
      />
    </div>
  );
}

export function NonemployerChart() {
  const [metric, setMetric] = useState<"establishments" | "receipts_usd">(
    "establishments",
  );
  const rows = [...data.nes.filter((r) => r.naics !== "00")].sort(
    (a, b) => (b[metric] || 0) - (a[metric] || 0),
  );
  const max = rows[0][metric]!;
  return (
    <div>
      <Toggle
        label="What to measure"
        value={metric}
        onChange={setMetric}
        options={[
          { value: "establishments", label: "Number of businesses" },
          { value: "receipts_usd", label: "Total sales" },
        ]}
      />
      <div className="sb-bar-chart">
        {rows.slice(0, 10).map((r) => (
          <div key={r.naics} className="sb-bar-row">
            <span>{industry(r.sector)}</span>
            <div className="sb-bar-track">
              <i style={{ width: `${(r[metric]! / max) * 100}%` }} />
            </div>
            <strong>
              {metric === "establishments"
                ? fmt(r.establishments)
                : `$${(r.receipts_usd! / 1e6).toFixed(0)}M`}
            </strong>
          </div>
        ))}
      </div>
      <Table
        headers={["Industry", "Businesses with no employees", "Total sales"]}
        rows={rows.map((r) => [
          industry(r.sector),
          fmt(r.establishments),
          money(r.receipts_usd || 0),
        ])}
      />
    </div>
  );
}

export function OwnerCalculator() {
  const [revenue, setRevenue] = useState(12000),
    [cost, setCost] = useState(8000),
    [hours, setHours] = useState(50);
  const remainder = revenue - cost,
    hourly = remainder / ((hours * 52) / 12);
  return (
    <div className="sb-calculator">
      <div className="sb-controls-grid">
        {[
          {
            id: "revenue",
            label: "Monthly sales",
            value: revenue,
            set: setRevenue,
            min: 1000,
            max: 40000,
            step: 500,
            format: money,
          },
          {
            id: "cost",
            label: "Monthly business expenses",
            value: cost,
            set: setCost,
            min: 0,
            max: 40000,
            step: 500,
            format: money,
          },
          {
            id: "hours",
            label: "Owner’s hours per week",
            value: hours,
            set: setHours,
            min: 10,
            max: 80,
            step: 1,
            format: (n: number) => `${n} hours`,
          },
        ].map((c) => (
          <label key={c.id} htmlFor={`sb-${c.id}`}>
            <span>
              {c.label}
              <strong>{c.format(c.value)}</strong>
            </span>
            <input
              id={`sb-${c.id}`}
              type="range"
              min={c.min}
              max={c.max}
              step={c.step}
              value={c.value}
              onChange={(e) => c.set(Number(e.target.value))}
            />
          </label>
        ))}
      </div>
      <div className="sb-calculator-result" aria-live="polite">
        <span>
          Left over each month, before the owner’s taxes, benefits and money put
          back into the business
        </span>
        <strong>
          {money(remainder)}
          <small> / month</small>
        </strong>
        <p>
          {money(Math.round(hourly * 100) / 100)} for each hour the owner works
        </p>
      </div>
      <p className="sb-chart-explainer">
        The math is monthly sales minus expenses, divided by the owner’s hours
        in a month. Expenses here don’t include paying the owner. Loan payments,
        replacing equipment, unpaid help from family and co-owners would all
        change the answer.
      </p>
    </div>
  );
}

export function PayrollChart() {
  const rows = sizeCodes.map((c) => portland.find((r) => r.size_code === c)!);
  const max = Math.max(...rows.map((r) => r.annual_payroll_per_job_usd!));
  return (
    <div>
      <div className="sb-bar-chart">
        {rows.map((r, i) => (
          <div key={r.size_code} className="sb-bar-row">
            <span>{sizeLabels[i]} employees</span>
            <div className="sb-bar-track">
              <i
                style={{
                  width: `${(r.annual_payroll_per_job_usd! / max) * 100}%`,
                  background: palette[i],
                }}
              />
            </div>
            <strong>{money(r.annual_payroll_per_job_usd!)}</strong>
          </div>
        ))}
      </div>
      <p className="sb-chart-explainer">
        This is a company-size group’s total pay divided by its jobs. It is not
        the typical worker’s wage. Part-time hours, the kinds of jobs and the
        industry all affect it, and benefits are left out.
      </p>
    </div>
  );
}

export function DynamicsChart() {
  const [metro, setMetro] = useState("Portland");
  const rows = data.bds
    .filter((r) => r.metro === metro)
    .sort((a, b) => a.year! - b.year!);
  const latest = rows.at(-1)!;
  const x = (year: number) => 60 + (year - 2019) * 151;
  const y = (value: number) => 280 - ((value - 4) / 13) * 230;
  return (
    <div>
      <label className="sb-select-label" htmlFor="sb-dynamics-metro">
        Metro area
        <select
          id="sb-dynamics-metro"
          value={metro}
          onChange={(e) => setMetro(e.target.value)}
        >
          {Array.from(new Set(data.bds.map((r) => r.metro))).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </label>
      <div className="sb-legend">
        <span>
          <i className="sb-green-dot" />
          Opened
        </span>
        <span>
          <i className="sb-rust-dot" />
          Closed
        </span>
      </div>
      <div className="sb-dynamics-layout">
        <svg
          className="sb-svg"
          viewBox="0 0 730 330"
          role="img"
          aria-label={`Share of business locations that opened and closed each year in ${metro}, 2019 to 2023`}
        >
          {[5, 8, 11, 14, 17].map((n) => (
            <g key={n}>
              <line x1="60" x2="665" y1={y(n)} y2={y(n)} stroke="#dce0d4" />
              <text x="46" y={y(n) + 5} textAnchor="end">
                {n}%
              </text>
            </g>
          ))}
          {rows.map((r) => (
            <text x={x(r.year!)} y="315" key={r.year} textAnchor="middle">
              {r.year}
            </text>
          ))}
          {(["entry_rate_pct", "exit_rate_pct"] as const).map((field, i) => (
            <g key={field}>
              <polyline
                fill="none"
                stroke={i ? "#b86540" : "#24644f"}
                strokeWidth="4"
                points={rows
                  .map((r) => `${x(r.year!)},${y(r[field]!)}`)
                  .join(" ")}
              />
              {rows.map((r) => (
                <circle
                  key={r.year}
                  cx={x(r.year!)}
                  cy={y(r[field]!)}
                  r="5"
                  fill={i ? "#b86540" : "#24644f"}
                >
                  <title>{`${r.year}: ${pct(r[field]!)} of locations ${field === "entry_rate_pct" ? "opened" : "closed"}`}</title>
                </circle>
              ))}
            </g>
          ))}
        </svg>
        <div className="sb-mini-stats" aria-live="polite">
          <div>
            <strong>{fmt(latest.establishments_entered)}</strong>
            <span>locations opened in 2023</span>
          </div>
          <div>
            <strong>{fmt(latest.establishments_exited)}</strong>
            <span>locations closed in 2023</span>
          </div>
          <div>
            <strong>
              {fmt(
                latest.establishments_entered! - latest.establishments_exited!,
              )}
            </strong>
            <span>net change</span>
          </div>
        </div>
      </div>
      <Table
        headers={["Year", "Opened", "Share opened", "Closed", "Share closed"]}
        rows={rows.map((r) => [
          r.year!,
          fmt(r.establishments_entered),
          pct(r.entry_rate_pct!),
          fmt(r.establishments_exited),
          pct(r.exit_rate_pct!),
        ])}
      />
    </div>
  );
}

export function JobFlows() {
  const r = data.bds.find((r) => r.metro === "Portland" && r.year === 2023)!;
  return (
    <div>
      <div className="sb-flow-bars">
        {[
          { label: "Jobs added", value: r.jobs_created!, type: "positive" },
          {
            label: "Jobs cut",
            value: r.jobs_destroyed!,
            type: "negative",
          },
          { label: "Net change", value: r.net_jobs!, type: "net" },
        ].map((a) => (
          <div key={a.label}>
            <span>{a.label}</span>
            <div>
              <i
                className={`sb-${a.type}-fill`}
                style={{ width: `${(a.value / r.jobs_created!) * 100}%` }}
              />
            </div>
            <strong>
              {a.type === "negative" ? "−" : "+"}
              {fmt(a.value)}
            </strong>
          </div>
        ))}
      </div>
      <p className="sb-chart-explainer">
        Jobs added come from new and growing locations. Jobs cut come from
        closed and shrinking ones. A net gain of about 20,000 jobs sat on top of
        far more hiring and far more loss than that.
      </p>
      <Table
        headers={["Company age (years)", "Jobs", "Net job change"]}
        rows={data.age.map((a) => [
          a.firm_age_band
            .replace(/^[a-e]\) /, "")
            .replace("Left Censored", "Founded before the records begin"),
          fmt(a.jobs),
          fmt(a.net_jobs),
        ])}
        label="See job changes by company age"
      />
    </div>
  );
}

const journeys = {
  storefront: {
    title: "A food or retail storefront",
    stages: [
      [
        "Test the idea",
        "Are there enough customers at this price, and enough cash to last until they come?",
      ],
      [
        "Check the space",
        "Before signing a lease, confirm the use is legal there, the space is accessible and the utilities can handle it.",
      ],
      [
        "Build and get licensed",
        "Line up drawings, permits and construction, plus health approvals if you serve food.",
      ],
      [
        "Open and hire",
        "Pass inspection, set up payroll and insurance, and build a schedule staff can rely on.",
      ],
      [
        "Stay open",
        "Keep customers coming back, pay for repairs and still pay the owner.",
      ],
    ],
    issue:
      "A website can list the requirements. It can’t make the wrong space legal, or pay the bills while an unfinished buildout drags on.",
  },
  trades: {
    title: "A small construction firm",
    stages: [
      [
        "Get qualified",
        "A license, insurance, any certification that helps, and the skill to estimate a job.",
      ],
      [
        "Find work",
        "Look for public and private bids the firm can realistically handle.",
      ],
      [
        "Price the job",
        "Cover materials, labor, surprises and subcontractors.",
      ],
      [
        "Do the work",
        "Keep the crew staffed, the site coordinated and the paperwork and change orders current.",
      ],
      [
        "Get paid",
        "Slow invoices and money the customer holds back until the end can leave the firm short of cash.",
      ],
    ],
    issue:
      "Winning a bigger contract can make cash flow worse, because payroll and materials come due before the customer pays. Help with bidding has to come with working capital and prompt payment.",
  },
  solo: {
    title: "A solo service business",
    stages: [
      [
        "Decide what to sell",
        "A service that customers you can reach will pay for.",
      ],
      [
        "Set up",
        "Register, keep tax records, write contracts and meet any licensing rules for the occupation.",
      ],
      [
        "Find customers",
        "Referrals, proposals and a track record people can see.",
      ],
      [
        "Do the work and bill for it",
        "Paid work competes with marketing, paperwork and caring for family.",
      ],
      [
        "Choose what comes next",
        "Raise prices, hire, stay solo or take a job.",
      ],
    ],
    issue:
      "A solo business that never hires can still be a success. Judge it by what the owner earns, how steady the income is and how many hours it takes.",
  },
};
export function BarrierJourney() {
  const [kind, setKind] = useState<keyof typeof journeys>("storefront");
  const [months, setMonths] = useState(3);
  const [burn, setBurn] = useState(6000);
  const j = journeys[kind];
  return (
    <div>
      <Toggle
        label="Kind of business"
        value={kind}
        onChange={setKind}
        options={[
          { value: "storefront", label: "Storefront" },
          { value: "trades", label: "Trades & contracting" },
          { value: "solo", label: "Solo services" },
        ]}
      />
      <div className="sb-journey">
        {j.stages.map(([title, desc], i) => (
          <div key={title}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <h4>{title}</h4>
            <p>{desc}</p>
          </div>
        ))}
      </div>
      <p className="sb-chart-explainer">{j.issue}</p>
      <div className="sb-delay">
        <div>
          <h4>What a delay costs</h4>
          <p>
            An example of the bills an owner keeps paying before opening day.
            Lost profit and construction costs would be on top of this.
          </p>
        </div>
        <label htmlFor="sb-delay-months">
          Months of delay <strong>{months}</strong>
          <input
            id="sb-delay-months"
            type="range"
            min="1"
            max="12"
            value={months}
            onChange={(e) => setMonths(+e.target.value)}
          />
        </label>
        <label htmlFor="sb-delay-burn">
          Monthly bills while waiting <strong>{money(burn)}</strong>
          <input
            id="sb-delay-burn"
            type="range"
            min="1000"
            max="20000"
            step="500"
            value={burn}
            onChange={(e) => setBurn(+e.target.value)}
          />
        </label>
        <div className="sb-delay-total" aria-live="polite">
          <strong>{money(months * burn)}</strong>
          <span>extra cash needed</span>
        </div>
      </div>
    </div>
  );
}

export function SupportFunnel() {
  const stages = [
    {
      label: "Businesses that need help",
      value: "?",
      desc: "Nobody has counted them, including the ones that never ask.",
    },
    {
      label: "Know about the help and can apply",
      value: "?",
      desc: "No data on who has heard of it, language access or applications people gave up on.",
    },
    {
      label: "Businesses the office served",
      value: "759",
      desc: "From its first-year report, May 2025 to May 2026.",
    },
    {
      label: "Problems solved",
      value: "?",
      desc: "Being referred somewhere does not mean the problem was fixed.",
    },
    {
      label: "Better off afterward",
      value: "?",
      desc: "Would need income, hours, survival and job quality, measured the same way for everyone.",
    },
  ];
  return (
    <div>
      <div className="sb-funnel">
        {stages.map((s, i) => (
          <div key={s.label} className={i === 2 ? "sb-funnel-known" : ""}>
            <span className="sb-funnel-index">0{i + 1}</span>
            <strong>{s.value}</strong>
            <h4>{s.label}</h4>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
      <p className="sb-chart-explainer">
        These are five things to measure, and the boxes are not drawn to scale.
        We can’t divide 759 by a county or metro count of businesses to get a
        share served, because those counts cover different places.
      </p>
      <details className="sb-audit">
        <summary>The office’s own numbers don’t quite add up</summary>
        <div className="sb-audit-equation">
          <span>
            103<small>District 1</small>
          </span>
          <b>+</b>
          <span>
            182<small>District 2</small>
          </span>
          <b>+</b>
          <span>
            154<small>District 3</small>
          </span>
          <b>+</b>
          <span>
            142<small>District 4</small>
          </span>
          <b>=</b>
          <span>
            581<small>total listed</small>
          </span>
        </div>
        <p>
          The report lists 581 businesses across the four council districts and
          759 businesses overall, a difference of 178 that it does not explain.
          It also reports 1,600 “touchpoints” on page 2 and “1,700+
          interactions” on page 3. Those may be different terms or different
          time periods. These are open questions about the reporting. They are
          not evidence that anyone did anything wrong.
        </p>
      </details>
    </div>
  );
}

const concepts = [
  {
    id: "delivery",
    title: "Make the existing system work",
    people: 5,
    systems: 180000,
    services: 120000,
    evaluation: 100000,
    cases: 1000,
    description:
      "One intake shared by every program, a named person on each case, help in the owner’s language and a deadline for an answer.",
    owner:
      "The Office of Small Business and Prosper Portland, with a named contact in each bureau.",
    dependencies:
      "An agreed definition of a case, referral agreements, intake that everyone can use and the authority to push on delays.",
    test: "Roll it out in stages or assign cases at random. Compare how many problems get solved, how long it takes, how much effort it costs the owner and how often people have to come back.",
  },
  {
    id: "shared",
    title: "Give small firms a back office",
    people: 8,
    systems: 300000,
    services: 280000,
    evaluation: 150000,
    cases: 750,
    description:
      "Human advisors who use AI to help prepare documents and cash-flow plans, with specialists reviewing the work.",
    owner: "Prosper Portland and community groups working under contract.",
    dependencies:
      "Owners’ consent to share records, service in several languages, licensed experts where the law requires them, secure tools and enough staff at the provider groups.",
    test: "Compare today’s help, human help with AI and simpler forms. Measure tasks verified as finished, errors, time saved and how businesses are doing after six and twelve months.",
  },
  {
    id: "structural",
    title: "Remove the recurring obstacle",
    people: 5,
    systems: 550000,
    services: 480000,
    evaluation: 315000,
    cases: 500,
    description:
      "Permit cases coordinated from start to finish, help securing space, public purchasing from small firms and faster payment.",
    owner:
      "Portland Permitting & Development, Procurement, the Revenue Division and Prosper Portland.",
    dependencies:
      "Authority for the bureaus, legal and budget changes, usable space, changes to payment systems and targeted capital.",
    test: "Phase in the change, or compare similar groups of permit cases. Track time from start to opening, cancellations, public cost, safety and whether other businesses were pushed out.",
  },
];
export function PolicyLab() {
  const [concept, setConcept] = useState("shared");
  const [loaded, setLoaded] = useState(145000);
  const [cases, setCases] = useState(750);
  const [effect, setEffect] = useState(20);
  const c = concepts.find((c) => c.id === concept)!;
  const total = c.people * loaded + c.systems + c.services + c.evaluation;
  const additional = (cases * effect) / 100;
  return (
    <div>
      <Toggle
        label="Program concept"
        value={concept}
        onChange={(v) => {
          setConcept(v);
          setCases(concepts.find((c) => c.id === v)!.cases);
        }}
        options={concepts.map((c) => ({
          value: c.id,
          label:
            c.id === "delivery"
              ? "1 · Make the current system work"
              : c.id === "shared"
                ? "2 · A shared back office"
                : "3 · Fix the recurring roadblocks",
        }))}
      />
      <div className="sb-policy-grid">
        <div>
          <p className="sb-eyebrow">Example first-year budget</p>
          <h4>{c.title}</h4>
          <p>{c.description}</p>
          <dl className="sb-costs">
            <dt>
              {c.people} staff × {money(loaded)}
            </dt>
            <dd>{money(c.people * loaded)}</dd>
            <dt>Systems, tools and operations</dt>
            <dd>{money(c.systems)}</dd>
            <dt>Language help, quality checks and targeted support</dt>
            <dd>{money(c.services)}</dd>
            <dt>Evaluation and accessibility</dt>
            <dd>{money(c.evaluation)}</dd>
          </dl>
          <p className="sb-budget-total">
            {money(total)}
            <span>first-year cost</span>
          </p>
        </div>
        <div className="sb-policy-inputs">
          <label htmlFor="sb-loaded">
            Yearly cost of one staff member, with benefits{" "}
            <strong>{money(loaded)}</strong>
            <input
              id="sb-loaded"
              type="range"
              min="100000"
              max="200000"
              step="5000"
              value={loaded}
              onChange={(e) => setLoaded(+e.target.value)}
            />
          </label>
          <label htmlFor="sb-cases">
            Businesses served in the first year <strong>{fmt(cases)}</strong>
            <input
              id="sb-cases"
              type="range"
              min="100"
              max="2000"
              step="50"
              value={cases}
              onChange={(e) => setCases(+e.target.value)}
            />
          </label>
          <label htmlFor="sb-effect">
            Extra problems solved for every 100 businesses served{" "}
            <strong>{effect}</strong>
            <input
              id="sb-effect"
              type="range"
              min="0"
              max="60"
              step="5"
              value={effect}
              onChange={(e) => setEffect(+e.target.value)}
            />
          </label>
          <div aria-live="polite" className="sb-scenario-result">
            <strong>
              {additional > 0
                ? money(Math.round(total / additional))
                : "No answer"}
            </strong>
            <span>cost for each extra problem solved</span>
            <p>
              {additional > 0
                ? `${fmt(additional)} more problems solved than would have been without the program. That effect is our assumption. Nobody has measured it.`
                : "If the program solves no extra problems, serving more businesses does not show it was worth the money."}
            </p>
          </div>
        </div>
      </div>
      <div className="sb-policy-details">
        <p>
          <strong>Who would run it</strong>
          {c.owner}
        </p>
        <p>
          <strong>What has to be in place</strong>
          {c.dependencies}
        </p>
        <p>
          <strong>How to test it</strong>
          {c.test}
        </p>
      </div>
      <p className="sb-chart-explainer">
        These are planning numbers. They are not appropriations or bids, and
        nobody has proven the effects. The three options overlap, so their
        results can’t simply be added. Loans, major construction and agency
        overhead are left out.
      </p>
    </div>
  );
}

const statusLabels: Record<string, string> = {
  "archived-reviewed": "Reviewed and archived",
  reviewed: "Reviewed",
  screened: "Skimmed, not fully reviewed",
  queued: "Not yet reviewed",
};
const familyLabels: Record<string, string> = {
  accountability: "Audits",
  ai: "AI",
  barriers: "Barriers",
  capital: "Capital",
  "capital-demand-ai": "Capital, customers and AI",
  dynamics: "Openings and closings",
  gdp: "GDP",
  geography: "Geography",
  jobs: "Jobs",
  local: "Local reports",
  "operating-conditions": "Taxes and operating conditions",
  policy: "Policy research",
  procurement: "Public contracting",
  programs: "Programs",
  structure: "Company size and industry",
};
export function EvidenceLibrary() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const sources = data.sources;
  const rows = useMemo(
    () =>
      sources.filter(
        (s) =>
          (family === "all" || s.family === family) &&
          `${s.title} ${s.publisher} ${s.geography} ${s.note} ${s.id}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, family, sources],
  );
  return (
    <div>
      <div className="sb-library-controls">
        <label htmlFor="sb-source-search">
          Search the sources
          <input
            id="sb-source-search"
            type="search"
            placeholder="Try permits, GDP, owners or Census"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label htmlFor="sb-source-family">
          Type of source
          <select
            id="sb-source-family"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
          >
            <option value="all">All types</option>
            {[...new Set(sources.map((s) => s.family))].sort().map((f) => (
              <option key={f} value={f}>
                {familyLabels[f] || f.replaceAll("-", " ")}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="sb-library-count" role="status">
        {rows.length} of {sources.length} sources. Being listed here does not
        mean we verified every finding in a source.
      </p>
      <div className="sb-source-list">
        {rows.map((s) => (
          <details key={s.id}>
            <summary>
              <span className="sb-source-publisher">{s.publisher}</span>
              <strong>{s.title}</strong>
              <span className="sb-source-status">
                {statusLabels[s.status] || s.status}
              </span>
            </summary>
            <div>
              <p>{s.note}</p>
              <dl>
                <dt>Place</dt>
                <dd>{s.geography}</dd>
                <dt>Period covered</dt>
                <dd>{s.reference_period}</dd>
                <dt>Published</dt>
                <dd>{s.published}</dd>
                <dt>Where in the source</dt>
                <dd>{s.evidence_locations}</dd>
                <dt>Method and limits</dt>
                <dd>{s.methodology_note}</dd>
              </dl>
              <a href={s.url} target="_blank" rel="noreferrer">
                Open the source ↗
              </a>
            </div>
          </details>
        ))}
        {!rows.length && (
          <p>No sources match. Try a broader word or clear the type filter.</p>
        )}
      </div>
    </div>
  );
}
