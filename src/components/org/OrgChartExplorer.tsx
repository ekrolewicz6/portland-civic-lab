"use client";

import { useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Search,
  X,
  ExternalLink,
  AlertTriangle,
  CircleUserRound,
  Building2,
  Expand,
  Minimize2,
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
import { flattenTree, unitPath, orgStats } from "@/lib/org/queries";

const TYPE_LABELS: Record<string, string> = {
  root: "City",
  branch: "Branch",
  elected: "Elected",
  council: "Council",
  district: "District",
  administrator: "City Administrator",
  "service-area": "Service area",
  bureau: "Bureau",
  office: "Office",
  division: "Division",
  program: "Program",
  board: "Board",
};

function matchesQuery(unit: OrgUnit, q: string): boolean {
  if (!q) return true;
  const hay = [unit.name, unit.abbr, unit.leader, unit.notes, unit.reorg2025]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

/** Returns the set of node ids to render given the active filters. A node is
 *  kept if it passes the predicate OR any descendant does (so ancestors stay
 *  as context). */
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

  // Default: expand the root, both branches, the City Administrator, and the
  // four service areas (everything at depth <= 2 that has children).
  const [expanded, setExpanded] = useState<Set<string>>(
    () =>
      new Set(
        flat.filter((u) => u.depth <= 2 && u.childCount > 0).map((u) => u.id),
      ),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [saFilter, setSaFilter] = useState<ServiceAreaSlug | "all">("all");
  const [fundFilter, setFundFilter] = useState<FundModel | "all">("all");
  const [confirmedOnly, setConfirmedOnly] = useState(false);

  const q = query.trim().toLowerCase();
  const isFiltering =
    q !== "" || saFilter !== "all" || fundFilter !== "all" || confirmedOnly;

  const predicate = useMemo(() => {
    return (u: OrgUnit) =>
      matchesQuery(u, q) &&
      (saFilter === "all" || u.serviceArea === saFilter) &&
      (fundFilter === "all" || u.fundModel === fundFilter) &&
      (!confirmedOnly || !u.unconfirmed);
  }, [q, saFilter, fundFilter, confirmedOnly]);

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

  const selected = selectedId
    ? flat.find((u) => u.id === selectedId)
    : undefined;
  const selectedPath = selectedId ? unitPath(selectedId) : [];
  const selectedNode = selectedId ? findNode(ORG_TREE, selectedId) : undefined;

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
    setConfirmedOnly(false);
  }

  // ── recursive node renderer ────────────────────────────────────────────────
  function renderNode(unit: OrgUnit, depth: number) {
    if (keepSet && !keepSet.has(unit.id)) return null;
    const hasChildren = !!unit.children?.length;
    const isOpen = isFiltering ? true : expanded.has(unit.id);
    const sa = SERVICE_AREA_BY_SLUG[unit.serviceArea];
    const isMatch = q !== "" && matchesQuery(unit, q);
    const isSelected = unit.id === selectedId;

    return (
      <div key={unit.id}>
        <div
          className={`group flex items-start gap-1.5 rounded-sm border-l-[3px] pr-2 transition-colors ${
            isSelected
              ? "bg-[var(--color-canopy)]/8"
              : "hover:bg-[var(--color-paper-warm)]"
          }`}
          style={{
            borderLeftColor: sa.color,
            marginLeft: depth * 16,
          }}
        >
          <button
            type="button"
            onClick={() => hasChildren && toggle(unit.id)}
            className={`mt-1.5 flex h-5 w-5 flex-none items-center justify-center text-[var(--color-ink-muted)] ${
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

          <button
            type="button"
            onClick={() => setSelectedId(unit.id)}
            className="flex-1 py-1.5 text-left"
          >
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span
                className={`text-[14px] leading-tight ${
                  isMatch
                    ? "font-semibold text-[var(--color-ink)]"
                    : "text-[var(--color-ink)]"
                } ${
                  unit.type === "service-area" || unit.type === "administrator"
                    ? "font-semibold"
                    : ""
                }`}
              >
                {unit.name}
              </span>
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
              {unit.unconfirmed && (
                <span
                  title="Leader or placement not confirmed on an official page"
                  className="rounded-sm bg-stone-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-stone-500"
                >
                  Unconfirmed
                </span>
              )}
              {hasChildren && (
                <span className="text-[11px] text-[var(--color-ink-muted)]">
                  {unit.children!.length}
                </span>
              )}
            </span>
            {unit.leader && (
              <span className="mt-0.5 flex items-center gap-1 text-[12px] text-[var(--color-ink-light)]">
                <CircleUserRound className="h-3 w-3 flex-none opacity-60" />
                {unit.leader}
              </span>
            )}
          </button>
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
        <Stat label="Operating units" value={stats.totalUnits} />
        <Stat label="Bureaus" value={stats.bureaus} />
        <Stat label="Service areas" value={4} hint="+ electeds & City Admin" />
        <Stat label="Moved in 2025 reorg" value={stats.reorgMoves} />
      </div>

      {/* legend */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        {SERVICE_AREAS.map((sa) => (
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
            <span className="text-[var(--color-ink-light)]">{sa.label}</span>
          </button>
        ))}
      </div>

      {/* controls */}
      <div className="mt-5 flex flex-col gap-3 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-3 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
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
          className="rounded-sm border border-[var(--color-parchment)] bg-white py-2 px-2.5 text-[13px] outline-none focus:border-[var(--color-sage)]"
        >
          <option value="all">All funding</option>
          {Object.entries(FUND_MODEL_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-1.5 text-[13px] text-[var(--color-ink-light)]">
          <input
            type="checkbox"
            checked={confirmedOnly}
            onChange={(e) => setConfirmedOnly(e.target.checked)}
            className="accent-[var(--color-canopy)]"
          />
          Confirmed only
        </label>

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
            {saFilter !== "all" &&
              ` in ${SERVICE_AREA_BY_SLUG[saFilter].label}`}
            .
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

      {/* chart + detail */}
      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 rounded-sm border border-[var(--color-parchment)] bg-white p-2 sm:p-3">
          {keepSet && keepSet.size === 0 ? (
            <p className="px-3 py-8 text-center text-[14px] text-[var(--color-ink-muted)]">
              No units match. <button onClick={resetFilters} className="font-semibold text-[var(--color-canopy)] hover:underline">Clear filters</button>
            </p>
          ) : (
            renderNode(ORG_TREE, 0)
          )}
        </div>

        {/* detail panel */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          {selected && selectedNode ? (
            <DetailPanel
              node={selectedNode}
              path={selectedPath.map((p) => ({ id: p.id, name: p.name }))}
              onClose={() => setSelectedId(null)}
              onSelect={setSelectedId}
            />
          ) : (
            <div className="rounded-sm border border-dashed border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6 text-center">
              <Building2 className="mx-auto h-6 w-6 text-[var(--color-ink-muted)]" />
              <p className="mt-3 text-[14px] text-[var(--color-ink-light)]">
                Select any bureau or office to see its leader, funding, where it
                sits, and the source.
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        Structure as of {ORG_AS_OF}. Reconciled against the FY2026-27 budget and
        the Summer 2025 city org chart. Items tagged{" "}
        <span className="font-semibold">Unconfirmed</span> were not named on an
        official structural/leadership page and should be verified against the
        linked source. Budget-aggregation lines (Fund &amp; Debt Management,
        Special Appropriations) are excluded. Full data:{" "}
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

function findNode(node: OrgUnit, id: string): OrgUnit | undefined {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return undefined;
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
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

function DetailPanel({
  node,
  path,
  onClose,
  onSelect,
}: {
  node: OrgUnit;
  path: { id: string; name: string }[];
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const sa = SERVICE_AREA_BY_SLUG[node.serviceArea];
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white">
      <div
        className="flex items-start justify-between gap-2 rounded-t-sm px-4 py-3"
        style={{ backgroundColor: `${sa.color}14` }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 flex-none rounded-sm"
              style={{ backgroundColor: sa.color }}
            />
            <span className="truncate text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              {sa.label}
            </span>
          </div>
          <h3 className="mt-1 font-editorial text-[20px] leading-tight text-[var(--color-ink)]">
            {node.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-none text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 px-4 py-4 text-[13px]">
        {/* breadcrumb */}
        {path.length > 1 && (
          <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[11px] text-[var(--color-ink-muted)]">
            {path.slice(0, -1).map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className="hover:text-[var(--color-canopy)] hover:underline"
              >
                {p.name}
                <span className="mx-1 text-[var(--color-ink-muted)]">/</span>
              </button>
            ))}
          </div>
        )}

        <dl className="space-y-2">
          <Row label="Type" value={TYPE_LABELS[node.type] ?? node.type} />
          {node.leader && (
            <Row
              label="Leader"
              value={
                node.leaderTitle
                  ? `${node.leader} — ${node.leaderTitle}`
                  : node.leader
              }
            />
          )}
          {node.fundModel && (
            <Row label="Funding" value={FUND_MODEL_LABELS[node.fundModel]} />
          )}
          {node.children?.length ? (
            <Row label="Reports in" value={`${node.children.length} unit${node.children.length === 1 ? "" : "s"}`} />
          ) : null}
        </dl>

        {node.notes && (
          <p className="leading-relaxed text-[var(--color-ink-light)]">
            {node.notes}
          </p>
        )}

        {node.reorg2025 && (
          <div className="rounded-sm bg-violet-50 px-3 py-2 text-[12px] leading-relaxed text-violet-900">
            <span className="font-semibold">2025 reorg: </span>
            {node.reorg2025}
          </div>
        )}

        {node.unconfirmed && (
          <div className="flex items-start gap-1.5 rounded-sm bg-stone-50 px-3 py-2 text-[12px] leading-relaxed text-stone-600">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none" />
            <span>
              Leader or placement not confirmed on an official page — verify
              against the source before citing.
            </span>
          </div>
        )}

        {node.children?.length ? (
          <div>
            <div className="mb-1 text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              Reports here
            </div>
            <ul className="space-y-0.5">
              {node.children.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onSelect(c.id)}
                    className="text-left text-[13px] text-[var(--color-canopy)] hover:underline"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {node.source && (
          <a
            href={node.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-canopy)] hover:underline"
          >
            Official source <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="flex-none text-[var(--color-ink-muted)]">{label}</dt>
      <dd className="text-right text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}
