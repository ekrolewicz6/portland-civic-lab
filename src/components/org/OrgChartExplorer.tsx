"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Users,
  Expand,
  Minimize2,
  ArrowRight,
} from "lucide-react";
import {
  ORG_TREE,
  ORG_AS_OF,
  SERVICE_AREAS,
  SERVICE_AREA_BY_SLUG,
  FUND_MODEL_LABELS,
  type OrgUnit,
  type ServiceAreaSlug,
  type FundModel,
} from "@/data/org-structure";
import { BUREAU_PERSONNEL } from "@/data/org-personnel";
import {
  flattenTree,
  orgStats,
  salaryCostRollup,
  operatingBudgetRollup,
} from "@/lib/org/queries";

function fmtFte(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
function money(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}k`;
  return `$${Math.round(n)}`;
}

function matchesQuery(unit: OrgUnit, q: string): boolean {
  if (!q) return true;
  const hay = [unit.name, unit.abbr, unit.leader, unit.notes, unit.reorg2025]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function buildKeepSet(
  node: OrgUnit,
  predicate: (u: OrgUnit) => boolean,
  acc: Set<string>,
): boolean {
  let keepChild = false;
  node.children?.forEach((c) => {
    if (buildKeepSet(c, predicate, acc)) keepChild = true;
  });
  const keep = predicate(node) || keepChild;
  if (keep) acc.add(node.id);
  return keep;
}

export default function OrgChartExplorer() {
  const flat = useMemo(() => flattenTree(), []);
  const stats = useMemo(() => orgStats(), []);
  const costRollup = useMemo(() => salaryCostRollup(), []);
  const budgetRollup = useMemo(() => operatingBudgetRollup(), []);

  const [expanded, setExpanded] = useState<Set<string>>(
    () =>
      new Set(
        flat.filter((u) => u.depth <= 2 && u.childCount > 0).map((u) => u.id),
      ),
  );
  const [query, setQuery] = useState("");
  const [saFilter, setSaFilter] = useState<ServiceAreaSlug | "all">("all");
  const [fundFilter, setFundFilter] = useState<FundModel | "all">("all");

  const q = query.trim().toLowerCase();
  const isFiltering = q !== "" || saFilter !== "all" || fundFilter !== "all";

  const predicate = useMemo(() => {
    return (u: OrgUnit) =>
      matchesQuery(u, q) &&
      (saFilter === "all" || u.serviceArea === saFilter) &&
      (fundFilter === "all" || u.fundModel === fundFilter);
  }, [q, saFilter, fundFilter]);

  const keepSet = useMemo(() => {
    if (!isFiltering) return null;
    const acc = new Set<string>();
    buildKeepSet(ORG_TREE, predicate, acc);
    return acc;
  }, [isFiltering, predicate]);

  const matchCount = useMemo(
    () => (isFiltering ? flat.filter((u) => predicate(u)).length : 0),
    [isFiltering, predicate, flat],
  );

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function expandAll() {
    setExpanded(new Set(flat.filter((u) => u.childCount > 0).map((u) => u.id)));
  }
  function collapseAll() {
    setExpanded(new Set());
  }
  function resetFilters() {
    setQuery("");
    setSaFilter("all");
    setFundFilter("all");
  }

  function renderNode(unit: OrgUnit, depth: number) {
    if (keepSet && !keepSet.has(unit.id)) return null;
    const hasChildren = !!unit.children?.length;
    const isOpen = isFiltering ? true : expanded.has(unit.id);
    const sa = SERVICE_AREA_BY_SLUG[unit.serviceArea];
    const isMatch = q !== "" && matchesQuery(unit, q);
    const personnel = BUREAU_PERSONNEL[unit.id];
    const isBureauPage = !!personnel;
    const cost = costRollup[unit.id] ?? 0;
    const budget = budgetRollup[unit.id] ?? 0;

    const nameClass = `text-[14px] leading-tight text-[var(--color-ink)] ${
      isMatch || unit.type === "service-area" || unit.type === "administrator"
        ? "font-semibold"
        : ""
    }`;

    return (
      <div key={unit.id}>
        <div
          className="group flex items-center gap-1.5 rounded-sm border-l-[3px] pr-2 hover:bg-[var(--color-paper-warm)]"
          style={{ borderLeftColor: sa.color, marginLeft: depth * 15 }}
        >
          <button
            type="button"
            onClick={() => hasChildren && toggle(unit.id)}
            className={`flex h-6 w-5 flex-none items-center justify-center text-[var(--color-ink-muted)] ${
              hasChildren ? "hover:text-[var(--color-ink)]" : "opacity-0"
            }`}
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            {hasChildren &&
              (isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              ))}
          </button>

          <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-0.5 py-1.5">
            {isBureauPage ? (
              <Link
                href={`/org-chart/${unit.id}`}
                className={`${nameClass} group/link inline-flex items-center gap-1 hover:text-[var(--color-canopy)] hover:underline`}
              >
                {unit.name}
                <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-60" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => hasChildren && toggle(unit.id)}
                className={`${nameClass} text-left`}
              >
                {unit.name}
              </button>
            )}
            {unit.abbr && (
              <span className="font-mono text-[11px] text-[var(--color-ink-muted)]">
                {unit.abbr}
              </span>
            )}
            {unit.vacant && (
              <span className="rounded-sm bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-800">
                Vacant
              </span>
            )}
            {unit.reorg2025 && (
              <span className="rounded-sm bg-violet-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-violet-800">
                2025 move
              </span>
            )}
            {personnel && (
              <span className="rounded-sm bg-[var(--color-canopy)]/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--color-canopy)]">
                {personnel.classCount} classes
              </span>
            )}
            {unit.leader && (
              <span className="text-[12px] text-[var(--color-ink-light)]">
                · {unit.leader}
              </span>
            )}
            {/* leaf nodes with no data of their own (districts, folded-in
                programs) surface their note inline so they aren't blank */}
            {!personnel && !hasChildren && unit.notes && (
              <span className="basis-full text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
                {unit.notes}
              </span>
            )}
          </div>

          {/* right metrics — desktop columns (budget · salary · FTE) */}
          <div className="hidden flex-none items-center gap-4 text-[12px] tabular-nums sm:flex">
            {budget > 0 ? (
              <span
                className="hidden w-24 text-right text-[var(--color-ink)] md:inline"
                title="Total operating budget, all funds (double-counts internal transfers)"
              >
                {money(budget)}
              </span>
            ) : (
              <span className="hidden w-24 md:inline" />
            )}
            {cost > 0 ? (
              <span
                className="w-20 text-right text-[var(--color-ink-light)]"
                title="Budgeted personnel (salary) cost"
              >
                {money(cost)}
              </span>
            ) : (
              <span className="w-20" />
            )}
            {unit.fteRollup ? (
              <span
                className="flex w-16 items-center justify-end gap-1 text-[var(--color-ink-muted)]"
                title="Authorized FTE (including sub-units)"
              >
                <Users className="h-3 w-3 opacity-45" />
                {fmtFte(unit.fteRollup)}
              </span>
            ) : (
              <span className="w-16" />
            )}
          </div>
          {/* right metrics — mobile stacked (salary over FTE) */}
          <div className="flex flex-none flex-col items-end leading-tight tabular-nums sm:hidden">
            {cost > 0 && (
              <span className="text-[12px] text-[var(--color-ink)]">
                {money(cost)}
              </span>
            )}
            {unit.fteRollup ? (
              <span className="text-[11px] text-[var(--color-ink-muted)]">
                {fmtFte(unit.fteRollup)} FTE
              </span>
            ) : null}
          </div>
        </div>

        {isOpen &&
          hasChildren &&
          unit.children!.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  }

  return (
    <div>
      {/* stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Authorized positions"
          value={Math.round(stats.totalFte).toLocaleString()}
          hint={`FTE · ${stats.fteFiscalYear}`}
        />
        <Stat
          label="Budgeted salary cost"
          value={money(costRollup[ORG_TREE.id] ?? 0)}
          hint="citywide personnel $"
        />
        <Stat
          label="Operating budget"
          value={money(budgetRollup[ORG_TREE.id] ?? 0)}
          hint="all funds"
        />
        <Stat label="Bureaus" value={stats.bureaus} />
      </div>

      {/* headcount by service area */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          <span>Authorized headcount by service area</span>
          <span>{Math.round(stats.totalFte).toLocaleString()} FTE total</span>
        </div>
        <div className="flex h-5 w-full overflow-hidden rounded-sm">
          {stats.byServiceArea
            .filter((sa) => sa.fte > 0)
            .map((sa) => {
              const meta = SERVICE_AREA_BY_SLUG[sa.slug];
              const pct = (sa.fte / stats.totalFte) * 100;
              return (
                <button
                  key={sa.slug}
                  type="button"
                  onClick={() =>
                    setSaFilter((cur) => (cur === sa.slug ? "all" : sa.slug))
                  }
                  title={`${meta.label}: ${fmtFte(sa.fte)} FTE (${pct.toFixed(0)}%)`}
                  className="h-full transition-opacity hover:opacity-80"
                  style={{ width: `${pct}%`, backgroundColor: meta.color }}
                />
              );
            })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          {SERVICE_AREAS.map((sa) => {
            const row = stats.byServiceArea.find((r) => r.slug === sa.slug);
            return (
              <button
                key={sa.slug}
                type="button"
                onClick={() =>
                  setSaFilter((cur) => (cur === sa.slug ? "all" : sa.slug))
                }
                className={`flex items-center gap-1.5 text-[12px] transition-opacity ${
                  saFilter !== "all" && saFilter !== sa.slug
                    ? "opacity-35"
                    : "opacity-100"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: sa.color }}
                />
                <span className="text-[var(--color-ink-light)]">
                  {sa.label}
                </span>
                {row && row.fte > 0 && (
                  <span className="text-[var(--color-ink-muted)]">
                    {fmtFte(row.fte)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* salary cost by service area */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          <span>Budgeted salary cost by service area</span>
          <span>{money(stats.totalCost)} total</span>
        </div>
        <div className="flex h-5 w-full overflow-hidden rounded-sm">
          {stats.byServiceArea
            .filter((sa) => sa.cost > 0)
            .map((sa) => {
              const meta = SERVICE_AREA_BY_SLUG[sa.slug];
              const pct = (sa.cost / stats.totalCost) * 100;
              return (
                <button
                  key={sa.slug}
                  type="button"
                  onClick={() =>
                    setSaFilter((cur) => (cur === sa.slug ? "all" : sa.slug))
                  }
                  title={`${meta.label}: ${money(sa.cost)} (${pct.toFixed(0)}%)`}
                  className="h-full transition-opacity hover:opacity-80"
                  style={{ width: `${pct}%`, backgroundColor: meta.color }}
                />
              );
            })}
        </div>
      </div>

      {/* controls */}
      <div className="mt-5 flex flex-col gap-3 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bureaus, offices, leaders…"
            className="w-full rounded-sm border border-[var(--color-parchment)] bg-white py-2 pl-8 pr-8 text-[14px] outline-none focus:border-[var(--color-sage)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={fundFilter}
          onChange={(e) => setFundFilter(e.target.value as FundModel | "all")}
          className="rounded-sm border border-[var(--color-parchment)] bg-white px-2.5 py-2 text-[13px] outline-none focus:border-[var(--color-sage)]"
        >
          <option value="all">All funding</option>
          {Object.entries(FUND_MODEL_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="flex items-center gap-1 rounded-sm border border-[var(--color-parchment)] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[var(--color-ink-light)] hover:text-[var(--color-ink)]"
          >
            <Expand className="h-3.5 w-3.5" /> Expand
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="flex items-center gap-1 rounded-sm border border-[var(--color-parchment)] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[var(--color-ink-light)] hover:text-[var(--color-ink)]"
          >
            <Minimize2 className="h-3.5 w-3.5" /> Collapse
          </button>
        </div>
      </div>

      {isFiltering && (
        <div className="mt-3 flex items-center justify-between gap-3 text-[13px] text-[var(--color-ink-light)]">
          <span>
            {matchCount} unit{matchCount === 1 ? "" : "s"} match
            {saFilter !== "all" && ` in ${SERVICE_AREA_BY_SLUG[saFilter].label}`}.
          </span>
          <button
            type="button"
            onClick={resetFilters}
            className="font-semibold text-[var(--color-canopy)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* full-width tree */}
      <div className="mt-5 rounded-sm border border-[var(--color-parchment)] bg-white p-2 sm:p-3">
        <div className="mb-1 hidden items-center justify-end gap-4 pr-2 text-[10px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)] sm:flex">
          <span className="hidden w-24 text-right md:inline">Budget</span>
          <span className="w-20 text-right">Salary $</span>
          <span className="w-16 text-right">FTE</span>
        </div>
        {keepSet && keepSet.size === 0 ? (
          <p className="px-3 py-8 text-center text-[14px] text-[var(--color-ink-muted)]">
            No units match.{" "}
            <button
              onClick={resetFilters}
              className="font-semibold text-[var(--color-canopy)] hover:underline"
            >
              Clear filters
            </button>
          </p>
        ) : (
          renderNode(ORG_TREE, 0)
        )}
      </div>

      <p className="mt-5 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        Click any bureau to open its page — salary cost, departments, the full
        job-classification breakdown, and pay distribution. Structure as of{" "}
        {ORG_AS_OF}; headcount is authorized FTE and salary $ is budgeted
        personnel cost (FY2025-26 budget), not filled people or actual pay.
        Budget is the all-funds operating total — it double-counts internal
        transfers and is dominated by capital, debt, and pass-throughs (utility
        bureaus, grant funds), so it runs far larger than salary cost. Vacant
        seats and 2025 reorg moves are flagged. Full data:{" "}
        <a
          href="/api/org"
          className="font-semibold text-[var(--color-canopy)] hover:underline"
        >
          /api/org
        </a>
        .
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-3.5">
      <div className="font-editorial text-[28px] leading-none text-[var(--color-ink)]">
        {value}
      </div>
      <div className="mt-1.5 text-[12px] text-[var(--color-ink-light)]">
        {label}
      </div>
      {hint && (
        <div className="text-[10px] text-[var(--color-ink-muted)]">{hint}</div>
      )}
    </div>
  );
}
