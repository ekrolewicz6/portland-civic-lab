"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { bureauComparison, type BureauRow } from "@/lib/org/bureau";

function money(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}k`;
  return `$${Math.round(n)}`;
}
function fmtFte(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

type SortKey =
  | "name"
  | "fte"
  | "salaryCost"
  | "costPerFte"
  | "operatingTotal"
  | "classCount";

const COLUMNS: {
  key: SortKey;
  label: string;
  numeric: boolean;
  render: (r: BureauRow) => string;
}[] = [
  { key: "name", label: "Bureau / office", numeric: false, render: (r) => r.name },
  { key: "fte", label: "FTE", numeric: true, render: (r) => fmtFte(r.fte) },
  {
    key: "salaryCost",
    label: "Salary cost",
    numeric: true,
    render: (r) => money(r.salaryCost),
  },
  {
    key: "costPerFte",
    label: "Cost / FTE",
    numeric: true,
    render: (r) => money(r.costPerFte),
  },
  {
    key: "operatingTotal",
    label: "Operating budget",
    numeric: true,
    render: (r) => money(r.operatingTotal),
  },
  {
    key: "classCount",
    label: "Classes",
    numeric: true,
    render: (r) => String(r.classCount),
  },
];

export default function BureauComparison() {
  const rows = useMemo(() => bureauComparison(), []);
  const [sortKey, setSortKey] = useState<SortKey>("salaryCost");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      if (sortKey === "name") {
        av = a.name;
        bv = b.name;
      } else {
        av = (a[sortKey] as number) ?? -Infinity;
        bv = (b[sortKey] as number) ?? -Infinity;
      }
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortKey, dir]);

  function sortBy(key: SortKey) {
    if (key === sortKey) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDir(key === "name" ? "asc" : "desc");
    }
  }

  return (
    <div>
      {/* mobile: sort control + cards (the table needs too many columns for a phone) */}
      <div className="md:hidden">
        <div className="mb-3 flex items-center gap-2">
          <label className="text-[12px] text-[var(--color-ink-muted)]">
            Sort by
          </label>
          <select
            value={sortKey}
            onChange={(e) => {
              const k = e.target.value as SortKey;
              setSortKey(k);
              setDir(k === "name" ? "asc" : "desc");
            }}
            className="flex-1 rounded-sm border border-[var(--color-parchment)] bg-white px-2.5 py-2 text-[13px] outline-none focus:border-[var(--color-sage)]"
          >
            <option value="salaryCost">Salary cost</option>
            <option value="fte">Headcount (FTE)</option>
            <option value="costPerFte">Cost per FTE</option>
            <option value="operatingTotal">Operating budget</option>
            <option value="classCount">Job classes</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
        <div className="space-y-2">
          {sorted.map((r) => (
            <Link
              key={r.id}
              href={`/org-chart/${r.id}`}
              className="block rounded-sm border border-[var(--color-parchment)] bg-white p-3 transition-colors hover:border-[var(--color-sage)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 flex-none rounded-sm"
                    style={{ backgroundColor: r.color }}
                  />
                  <span className="truncate font-medium text-[var(--color-ink)]">
                    {r.name}
                  </span>
                </span>
                <span className="flex-none text-[14px] font-semibold tabular-nums text-[var(--color-ink)]">
                  {money(r.salaryCost)}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-[var(--color-ink-light)]">
                <span className="tabular-nums">{fmtFte(r.fte)} FTE</span>
                <span className="tabular-nums">{money(r.costPerFte)} / FTE</span>
                <span className="tabular-nums">{money(r.operatingTotal)} budget</span>
                <span className="tabular-nums">{r.classCount} classes</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* desktop: sortable table */}
      <div className="hidden overflow-x-auto rounded-sm border border-[var(--color-parchment)] bg-white md:block">
        <table className="w-full min-w-[720px] text-[13px]">
        <thead>
          <tr className="border-b border-[var(--color-parchment)] text-left text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)]">
            {COLUMNS.map((c) => (
              <th
                key={c.key}
                className={`py-2.5 ${c.numeric ? "px-2 text-right" : "pl-3 pr-2"}`}
              >
                <button
                  type="button"
                  onClick={() => sortBy(c.key)}
                  className={`inline-flex items-center gap-1 font-semibold hover:text-[var(--color-ink)] ${
                    c.numeric ? "flex-row-reverse" : ""
                  } ${sortKey === c.key ? "text-[var(--color-ink)]" : ""}`}
                >
                  {c.label}
                  {sortKey === c.key ? (
                    dir === "asc" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-30" />
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr
              key={r.id}
              className="border-b border-[var(--color-parchment)]/60 hover:bg-[var(--color-paper-warm)]"
            >
              <td className="py-2 pl-3 pr-2">
                <Link
                  href={`/org-chart/${r.id}`}
                  className="group inline-flex items-center gap-2 text-[var(--color-ink)] hover:text-[var(--color-canopy)]"
                >
                  <span
                    className="h-2.5 w-2.5 flex-none rounded-sm"
                    style={{ backgroundColor: r.color }}
                    title={r.serviceAreaLabel}
                  />
                  <span className="group-hover:underline">{r.name}</span>
                  {r.abbr && (
                    <span className="font-mono text-[11px] text-[var(--color-ink-muted)]">
                      {r.abbr}
                    </span>
                  )}
                </Link>
              </td>
              <td className="px-2 py-2 text-right tabular-nums text-[var(--color-ink-light)]">
                {fmtFte(r.fte)}
              </td>
              <td className="px-2 py-2 text-right tabular-nums text-[var(--color-ink)]">
                {money(r.salaryCost)}
              </td>
              <td className="px-2 py-2 text-right tabular-nums text-[var(--color-ink-light)]">
                {money(r.costPerFte)}
              </td>
              <td className="px-2 py-2 text-right tabular-nums text-[var(--color-ink-muted)]">
                {money(r.operatingTotal)}
              </td>
              <td className="px-2 py-2 text-right tabular-nums text-[var(--color-ink-muted)]">
                {r.classCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
