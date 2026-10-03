"use client";

import { useState, useMemo } from "react";
import data from "@/data/small-business/evidence.json";

const fmt = (v: number | null, digits = 0) =>
  v === null
    ? "Unavailable"
    : v.toLocaleString("en-US", { maximumFractionDigits: digits });
const pct = (v: number) => `${v.toFixed(1)}%`;
const money = (v: number) => `$${fmt(v)}`;
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
  label = "Read the data table",
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
          label="Small business size definition"
          value={band}
          onChange={setBand}
          options={[
            { value: "08", label: "Fewer than 500 employees" },
            { value: "05", label: "Fewer than 20" },
          ]}
        />
        <Toggle
          label="Economic contribution measure"
          value={metric}
          onChange={setMetric}
          options={[
            { value: "jobs_share", label: "Jobs" },
            { value: "payroll_share", label: "Payroll" },
            { value: "receipts_share", label: "Receipts" },
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
            of metro employer{" "}
            {metric === "jobs_share"
              ? "jobs"
              : metric === "payroll_share"
                ? "payroll"
                : "receipts"}
          </h4>
          <p>
            At enterprises with fewer than {band === "08" ? "500" : "20"}{" "}
            employees across the entire enterprise.
          </p>
          <div className="sb-mini-stats">
            {[
              ["Jobs", row.jobs_share],
              ["Payroll", row.payroll_share],
              ["Receipts", row.receipts_share],
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
        One square is one percentage point. A local location of a national chain
        is counted with its parent enterprise. Nonemployers are outside this
        chart.
      </p>
      <Table
        headers={[
          "Enterprise employees",
          "Metro jobs",
          "Jobs share",
          "Payroll share",
          "Receipts share",
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
        aria-label="Metro jobs across six nonoverlapping enterprise size bands"
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
            <strong>{fmt(r.jobs)} jobs</strong>
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
        label="Industry composition metric"
        value={metric}
        onChange={setMetric}
        options={[
          { value: "jobs", label: "Jobs" },
          { value: "firms", label: "Employer firms" },
          { value: "payroll_usd", label: "Annual payroll" },
        ]}
      />
      <div className="sb-legend">
        <span>
          <i className="sb-green-dot" />
          Enterprise under 500
        </span>
        <span>
          <i className="sb-rust-dot" />
          Enterprise 500+
        </span>
      </div>
      <div className="sb-bar-chart">
        {rows.map((r) => {
          const value = r[metric] || 0;
          const part = small.get(r.naics)?.[metric] || 0;
          return (
            <div className="sb-bar-row" key={r.naics}>
              <span>{r.sector}</span>
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
        Switching from jobs to firms changes the picture. Many small practices
        can coexist with a few very large health systems. Enterprise counts may
        recur across industries; do not add sector firm counts as unique firms.
      </p>
      <Table
        headers={[
          "Sector",
          "All employer jobs",
          "Under-500 jobs",
          "All firms",
          "Annual payroll",
        ]}
        rows={rows.map((r) => [
          r.sector,
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
          label="Peer size threshold"
          value={band}
          onChange={setBand}
          options={[
            { value: "08", label: "Under 500" },
            { value: "05", label: "Under 20" },
          ]}
        />
        <Toggle
          label="Peer metric"
          value={metric}
          onChange={setMetric}
          options={[
            { value: "jobs_share", label: "Jobs" },
            { value: "payroll_share", label: "Payroll" },
            { value: "receipts_share", label: "Receipts" },
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
        Give every metro Portland’s broad industry mix <span>(jobs only)</span>
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
          ? "Standardized to Portland’s 19-sector employment mix. This removes one compositional difference, not differences in firm age, detailed specialization or policy. NAICS 99 is excluded (0.006% of Portland jobs)."
          : `For context, the job-weighted share across all 387 metros is ${pct(benchmark)} at this threshold. The selected cities are comparisons, not a “best place” ranking.`}
      </p>
      <Table
        headers={[
          "Metro",
          "Observed share",
          adjusted && metric === "jobs_share"
            ? "Industry-standardized jobs share"
            : "Displayed share",
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
          { value: "500000", label: "500,000+ employer jobs" },
        ]}
      />
      <svg
        className="sb-svg sb-context-svg"
        viewBox="0 0 780 205"
        role="img"
        aria-label={`Distribution of under-500 job shares in ${dots.length} US metros; Portland is 50.2 percent.`}
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
              <title>{`${r.name}: ${pct(r.share)}; ${fmt(r.jobs)} jobs`}</title>
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
        Each dot is one metro; rows separate overlapping dots and have no
        economic meaning. Smaller metros often have high small-firm shares. The
        comparison contains {dots.length} metros, excludes micropolitan and
        rural areas, and counts jobs rather than unique firms.
      </p>
      <Table
        headers={["Metro", "Employer jobs", "Under-500 share"]}
        rows={[...metros]
          .sort((a, b) => b.jobs - a.jobs)
          .map((r) => [r.name, fmt(r.jobs), pct(r.share)])}
        label={`Explore all ${dots.length} metro values`}
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
          viewBox="0 0 730 400"
          role="group"
          aria-label="Sector employment change from 2019 to 2025 plotted against concentration relative to US employment. Use the sector selector or table for exact values."
        >
          <text x="75" y="27" className="sb-plot-note">
            MORE CONCENTRATED THAN THE U.S.
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
              aria-label={`Explore ${a.sector}`}
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
              <title>{`${a.sector}: ${pct(a.change)} job change; ${a.employment_lq}× US concentration; annual average pay ${money(a.average_pay_usd!)}`}</title>
            </circle>
          ))}
          <text x="369" y="395" textAnchor="middle">
            Change in private jobs, 2019–2025 →
          </text>
        </svg>
        <div className="sb-sector-detail">
          <label htmlFor="sb-sector">Explore a sector</label>
          <select
            id="sb-sector"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {rows.map((r) => (
              <option key={r.naics} value={r.naics}>
                {r.sector}
              </option>
            ))}
          </select>
          <div aria-live="polite">
            <strong className={r.change >= 0 ? "sb-positive" : "sb-negative"}>
              {r.change > 0 ? "+" : ""}
              {pct(r.change)}
            </strong>
            <p>
              {fmt(r.before)} → {fmt(r.jobs)} jobs
            </p>
            <dl>
              <dt>Concentration</dt>
              <dd>{r.employment_lq}× U.S.</dd>
              <dt>Annual average pay</dt>
              <dd>{money(r.average_pay_usd!)}</dd>
            </dl>
          </div>
          <p>
            Circle area = jobs. <span className="sb-positive">Green</span> = pay
            above the county private-sector average;{" "}
            <span className="sb-negative">rust</span> = below.
          </p>
        </div>
      </div>
      <Table
        headers={[
          "Sector",
          "2019 jobs",
          "2025 jobs",
          "Change",
          "2025 location quotient",
          "2025 average pay",
        ]}
        rows={rows.map((r) => [
          r.sector,
          fmt(r.before),
          fmt(r.jobs),
          pct(r.change),
          r.employment_lq!,
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
        label="Nonemployer measure"
        value={metric}
        onChange={setMetric}
        options={[
          { value: "establishments", label: "Businesses without payroll" },
          { value: "receipts_usd", label: "Gross business receipts" },
        ]}
      />
      <div className="sb-bar-chart">
        {rows.slice(0, 10).map((r) => (
          <div key={r.naics} className="sb-bar-row">
            <span>{r.sector}</span>
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
        headers={["Sector", "Nonemployer businesses", "Gross receipts"]}
        rows={rows.map((r) => [
          r.sector,
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
            label: "Monthly gross receipts",
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
            label: "Owner hours per week",
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
        <span>What remains before owner taxes, benefits and reinvestment</span>
        <strong>
          {money(remainder)}
          <small> / month</small>
        </strong>
        <p>{money(Math.round(hourly * 100) / 100)} per owner hour</p>
      </div>
      <p className="sb-chart-explainer">
        Illustrative arithmetic, not a Portland earnings estimate. Monthly
        receipts − business expenses; hours converted at 52 weeks ÷ 12. Debt
        principal, capital replacement, unpaid family work and multiple owners
        can change the result. Expenses here exclude owner compensation.
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
        This is annual payroll divided by mid-March employment. It is not the
        median worker’s wage or full-time equivalent pay. Hours, occupation,
        industry and employment changes affect the ratio; benefits are not
        included.
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
        Compare establishment turnover
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
          Entry rate
        </span>
        <span>
          <i className="sb-rust-dot" />
          Exit rate
        </span>
      </div>
      <svg
        className="sb-svg"
        viewBox="0 0 730 330"
        role="img"
        aria-label={`Entry and exit rates for ${metro}, 2019 to 2023`}
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
                <title>{`${r.year} ${field === "entry_rate_pct" ? "entry" : "exit"}: ${pct(r[field]!)}`}</title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
      <div className="sb-mini-stats" aria-live="polite">
        <div>
          <strong>{fmt(latest.establishments_entered)}</strong>
          <span>establishments entered, 2023</span>
        </div>
        <div>
          <strong>{fmt(latest.establishments_exited)}</strong>
          <span>establishments exited, 2023</span>
        </div>
        <div>
          <strong>
            {fmt(
              latest.establishments_entered! - latest.establishments_exited!,
            )}
          </strong>
          <span>net difference</span>
        </div>
      </div>
      <Table
        headers={["Year", "Entries", "Entry rate", "Exits", "Exit rate"]}
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
          { label: "Jobs created", value: r.jobs_created!, type: "positive" },
          {
            label: "Jobs destroyed",
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
        Job creation includes openings and expanding establishments; destruction
        includes closures and contracting establishments. A positive net result
        can coexist with substantial disruption.
      </p>
      <Table
        headers={["Firm age", "Metro jobs", "Net job change"]}
        rows={data.age.map((a) => [
          a.firm_age_band.replace(/^[a-e]\) /, ""),
          fmt(a.jobs),
          fmt(a.net_jobs),
        ])}
        label="See how job change differs by firm age"
      />
    </div>
  );
}

const journeys = {
  storefront: {
    title: "A food or retail storefront",
    stages: [
      ["Test demand", "Customers, pricing, foot traffic and cash runway."],
      [
        "Check the premises",
        "Confirm legal use, accessibility, utility capacity and lease conditions before a commitment.",
      ],
      [
        "Build and license",
        "Coordinate drawings, health requirements where applicable, permits and construction.",
      ],
      [
        "Open and staff",
        "Inspection, payroll, insurance and reliable scheduling.",
      ],
      [
        "Survive and improve",
        "Customer retention, repairs, working capital and owner compensation.",
      ],
    ],
    issue:
      "A navigation tool can organize requirements. It cannot make an unsuitable space compliant or supply the cash to carry an unfinished buildout.",
  },
  trades: {
    title: "A small construction firm",
    stages: [
      [
        "Qualify",
        "Licensing, insurance, certification where useful and estimating skills.",
      ],
      [
        "Find work",
        "Public and private bid opportunities matched to realistic capacity.",
      ],
      [
        "Price the job",
        "Materials, labor, contingencies and subcontractor terms.",
      ],
      [
        "Deliver",
        "Crew availability, site coordination, documentation and change orders.",
      ],
      [
        "Collect",
        "Invoices, retainage and payment delays can create a financing gap.",
      ],
    ],
    issue:
      "Winning a bigger contract can worsen cash flow if payroll and materials come due before the customer pays. Procurement assistance must connect to working capital and prompt payment.",
  },
  solo: {
    title: "A solo service business",
    stages: [
      ["Define the offer", "A service a reachable customer will pay for."],
      [
        "Set up",
        "Registration, tax records, contracts and any occupational requirements.",
      ],
      [
        "Win customers",
        "Referrals, sales, proposals and a credible portfolio.",
      ],
      [
        "Deliver and invoice",
        "Billable work competes with marketing, administration and care responsibilities.",
      ],
      [
        "Choose the next step",
        "Raise prices, hire, remain solo or move to employment.",
      ],
    ],
    issue:
      "A successful solo business may never hire. Evaluate net income, volatility and time, rather than treating employer status as the only legitimate destination.",
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
        label="Business journey"
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
          <h4>The price of waiting</h4>
          <p>
            Illustrative cash already committed before opening; excludes
            foregone profit and one-time buildout.
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
          Monthly carrying costs <strong>{money(burn)}</strong>
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
          <span>additional cash needed</span>
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
      desc: "No citywide denominator that includes eligible nonusers.",
    },
    {
      label: "Aware and able to apply",
      value: "?",
      desc: "Awareness, language access and abandoned applications are not measured here.",
    },
    {
      label: "Unique OSB clients",
      value: "759",
      desc: "Reported in the first-year report, May 2025–May 2026.",
    },
    {
      label: "Problems resolved",
      value: "?",
      desc: "A referral is not confirmation that the issue was resolved.",
    },
    {
      label: "Better business outcomes",
      value: "?",
      desc: "Need comparable income, time, survival and job-quality measures.",
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
        A measurement chain, not a scaled conversion funnel. Unknown values
        remain unknown; 759 cannot be divided by a county or metro count to
        obtain a valid city service rate.
      </p>
      <details className="sb-audit">
        <summary>Open the OSB reconciliation check</summary>
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
            581<small>listed total</small>
          </span>
        </div>
        <p>
          The report also gives 759 unique businesses: an arithmetic difference
          of 178. The reason is not stated, so these are not labeled
          “unassigned” businesses. Page 2 reports 1,600 touchpoints; page 3 says
          1,700+ interactions. Terminology or reporting windows may differ.
          These are unresolved reporting questions, not proof of improper
          conduct.
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
      "Shared intake, named case owners, multilingual navigation, and a resolution deadline.",
    owner: "OSB / Prosper, with named bureau counterparts",
    dependencies:
      "A shared case definition, referral agreements, accessible intake and authority to escalate delays.",
    test: "Randomized or phased rollout of case management; compare resolution rates, elapsed time, owner effort and repeat contacts.",
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
      "Human advisors with AI-assisted document preparation, cash-flow workflows, and specialist review.",
    owner: "Prosper and contracted community providers",
    dependencies:
      "Consent-based records, multilingual service, licensed expert review where required, secure tools and provider capacity.",
    test: "Compare existing assistance, human assistance with AI, and simpler forms. Measure verified completed tasks, errors, time saved and six- and twelve-month outcomes.",
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
      "Coordinated permit cases, premises support, public purchasing and faster payment.",
    owner: "Permitting & Development, Procurement, Revenue and Prosper",
    dependencies:
      "Bureau authority, legal and budget changes, usable premises, payment-system changes and targeted capital.",
    test: "Use a phased process change or comparable permit cohorts. Track end-to-end opening time, cancellations, public cost, safety and displacement.",
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
              ? "1 · Better delivery"
              : c.id === "shared"
                ? "2 · Shared services"
                : "3 · Structural reform",
        }))}
      />
      <div className="sb-policy-grid">
        <div>
          <p className="sb-eyebrow">
            Illustrative first-year operating scenario
          </p>
          <h4>{c.title}</h4>
          <p>{c.description}</p>
          <dl className="sb-costs">
            <dt>
              {c.people} staff × {money(loaded)}
            </dt>
            <dd>{money(c.people * loaded)}</dd>
            <dt>Systems, tools & operations</dt>
            <dd>{money(c.systems)}</dd>
            <dt>Language, quality / targeted support</dt>
            <dd>{money(c.services)}</dd>
            <dt>Evaluation & accessibility</dt>
            <dd>{money(c.evaluation)}</dd>
          </dl>
          <p className="sb-budget-total">
            {money(total)}
            <span>first-year cost</span>
          </p>
        </div>
        <div className="sb-policy-inputs">
          <label htmlFor="sb-loaded">
            Loaded annual staff cost <strong>{money(loaded)}</strong>
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
            Businesses served in first year <strong>{fmt(cases)}</strong>
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
            Additional resolution rate assumed{" "}
            <strong>{effect} percentage points</strong>
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
                : "Not defined"}
            </strong>
            <span>cost per additional resolved case</span>
            <p>
              {additional > 0
                ? `${fmt(additional)} more cases resolved than without the intervention. This effect is assumed, not measured.`
                : "If there is no additional effect, more activity does not establish value."}
            </p>
          </div>
        </div>
      </div>
      <div className="sb-policy-details">
        <p>
          <strong>Responsible institutions</strong>
          {c.owner}
        </p>
        <p>
          <strong>What must change</strong>
          {c.dependencies}
        </p>
        <p>
          <strong>How to test it</strong>
          {c.test}
        </p>
      </div>
      <p className="sb-chart-explainer">
        Planning assumptions, not appropriations, bids, proven effects or
        benefit–cost ratios. Alternatives are not automatically additive. Loan
        principal, major construction and agencywide overhead are outside these
        operating scenarios. Cost per additional case = first-year cost ÷
        (businesses served × assumed percentage-point effect ÷ 100).
      </p>
    </div>
  );
}

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
          Search the evidence
          <input
            id="sb-source-search"
            type="search"
            placeholder="Try: permits, GDP, owners, Census…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label htmlFor="sb-source-family">
          Source family
          <select
            id="sb-source-family"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
          >
            <option value="all">All families</option>
            {[...new Set(sources.map((s) => s.family))].sort().map((f) => (
              <option key={f} value={f}>
                {f.replaceAll("-", " ")}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="sb-library-count" role="status">
        {rows.length} of {sources.length} registered sources · inclusion does
        not mean every finding was validated
      </p>
      <div className="sb-source-list">
        {rows.map((s) => (
          <details key={s.id}>
            <summary>
              <span className="sb-source-publisher">{s.publisher}</span>
              <strong>{s.title}</strong>
              <span className="sb-source-status">{s.status}</span>
            </summary>
            <div>
              <p>{s.note}</p>
              <dl>
                <dt>Geography</dt>
                <dd>{s.geography}</dd>
                <dt>Measurement period</dt>
                <dd>{s.reference_period}</dd>
                <dt>Publication</dt>
                <dd>{s.published}</dd>
                <dt>Evidence location</dt>
                <dd>{s.evidence_locations}</dd>
                <dt>Method / limitation</dt>
                <dd>{s.methodology_note}</dd>
              </dl>
              <a href={s.url} target="_blank" rel="noreferrer">
                Open original source ↗
              </a>
            </div>
          </details>
        ))}
        {!rows.length && (
          <p>
            No sources match. Try a broader term or clear the family filter.
          </p>
        )}
      </div>
    </div>
  );
}
