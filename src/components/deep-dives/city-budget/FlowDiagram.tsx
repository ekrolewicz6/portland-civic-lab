"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Search, X, Maximize2, Minimize2 } from "lucide-react";
import { buildGraph, STAGE_LABEL, type Basis, type FlowNode } from "@/lib/city-budget/graph";
import { computeLayout, type LaidNode } from "@/lib/city-budget/layout";
import { YEARS, YEAR_LABEL, fmtMoney, fmtExact, type BudgetDataset, type FiscalYear } from "@/lib/city-budget/types";

/**
 * Colour encodes DIRECTION, not identity.
 *
 * The site palette is deliberately desaturated; running it through a contrast
 * and colour-vision check, six of its eight hues read as grey against the
 * paper background and fern/clay collide under protanopia. Eight service-area
 * hues are therefore not available. Two are: river for money arriving, clay
 * for money leaving. Everything else is carried by position, labels, and — for
 * internal transfers — a hatch, which is a non-colour channel that also
 * survives forced-colours mode.
 */
const COLOR = {
  external: "#2d5f7e",
  internal: "#7d8a93",
  hub: "#1a3a2a",
  spending: "#b06a45",
  reserve: "#8a8078",
  program: "#c8956c",
} as const;

const DETAIL = {
  overview: { height: 820, label: "Overview" },
  detailed: { height: 1400, label: "Detailed" },
  everything: { height: 2600, label: "Everything" },
} as const;
type DetailKey = keyof typeof DETAIL;

export default function FlowDiagram({ data }: { data: BudgetDataset }) {
  const [year, setYear] = useState<FiscalYear>("2026-27");
  const [basis, setBasis] = useState<Basis>("net");
  const [detail, setDetail] = useState<DetailKey>("detailed");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [focus, setFocus] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [full, setFull] = useState(false);
  const [width, setWidth] = useState(1180);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Quantise so dragging the window doesn't thrash the layout.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width / 8) * 8;
      if (w > 320) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const graph = useMemo(
    () => buildGraph(data, { year, basis, expanded }),
    [data, year, basis, expanded],
  );

  // Label gutters grow with the viewport: at 1400px+ there is room to show a
  // bureau's full name instead of truncating it.
  const narrow = width < 700;
  const labelW = width >= 1650 ? 240 : width >= 1400 ? 200 : width >= 1050 ? 155 : 120;

  const layout = useMemo(
    () =>
      computeLayout(graph, {
        width,
        height: DETAIL[detail].height,
        nodeWidth: narrow ? 9 : 13,
        labelMinHeight: narrow ? 16 : 13,
        labelPitch: narrow ? 17 : 15,
        padding: {
          top: 10,
          right: narrow ? 8 : labelW + 14,
          bottom: 10,
          left: narrow ? 8 : labelW + 10,
        },
      }),
    [graph, width, detail, narrow, labelW],
  );

  const byId = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n])), [layout]);

  /** Upstream + downstream of a node, for focus+context dimming. */
  const connected = useMemo(() => {
    const id = hover ?? focus;
    if (!id) return null;
    const nodes = new Set<string>([id]);
    const links = new Set<string>();
    const walk = (from: string, dir: "up" | "down") => {
      const queue = [from];
      while (queue.length) {
        const cur = queue.pop()!;
        for (const l of layout.links) {
          const match = dir === "down" ? l.source === cur : l.target === cur;
          if (!match) continue;
          const next = dir === "down" ? l.target : l.source;
          links.add(l.id);
          if (!nodes.has(next)) {
            nodes.add(next);
            queue.push(next);
          }
        }
      }
    };
    walk(id, "down");
    walk(id, "up");
    return { nodes, links };
  }, [hover, focus, layout.links]);

  const selected = focus ? byId.get(focus) : null;

  const toggleBureau = useCallback((slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const onNodeClick = useCallback(
    (n: LaidNode) => {
      if (n.stage === "bureau" && !n.parentId) toggleBureau(n.id.replace("bureau:", ""));
      setFocus((f) => (f === n.id ? null : n.id));
    },
    [toggleBureau],
  );

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return layout.nodes
      .filter((n) => n.label.toLowerCase().includes(q))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [query, layout.nodes]);

  const dim = (id: string, kind: "node" | "link") => {
    if (!connected) return 1;
    const on = kind === "node" ? connected.nodes.has(id) : connected.links.has(id);
    return on ? 1 : kind === "node" ? 0.14 : 0.05;
  };

  const unlabeled = layout.nodes.filter((n) => !n.labeled).length;

  return (
    <div
      className={
        full
          ? "fixed inset-0 z-50 overflow-auto bg-[var(--color-paper)] p-4 sm:p-6"
          : "relative"
      }
    >
      {/* ── controls ── */}
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Control label="Year">
          {YEARS.map((y) => (
            <Chip key={y} on={year === y} onClick={() => setYear(y)}>
              {y}
            </Chip>
          ))}
        </Control>

        <Control label="Basis">
          <Chip on={basis === "net"} onClick={() => setBasis("net")}>
            Net
          </Chip>
          <Chip on={basis === "gross"} onClick={() => setBasis("gross")}>
            Gross
          </Chip>
        </Control>

        <Control label="Detail">
          {(Object.keys(DETAIL) as DetailKey[]).map((d) => (
            <Chip key={d} on={detail === d} onClick={() => setDetail(d)}>
              {DETAIL[d].label}
            </Chip>
          ))}
        </Control>

        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a bureau or program"
            className="w-56 rounded-sm border border-[var(--color-parchment)] bg-white py-1.5 pl-7 pr-2 text-[12px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-sage)] focus:outline-none"
          />
          {hits.length > 0 && (
            <ul className="absolute z-20 mt-1 max-h-72 w-72 overflow-auto rounded-sm border border-[var(--color-parchment)] bg-white shadow-lg">
              {hits.map((h) => (
                <li key={h.id}>
                  <button
                    onClick={() => {
                      setFocus(h.id);
                      setQuery("");
                    }}
                    className="flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left text-[12px] hover:bg-[var(--color-paper-warm)]"
                  >
                    <span className="truncate text-[var(--color-ink)]">{h.label}</span>
                    <span className="shrink-0 font-mono text-[11px] text-[var(--color-ink-muted)]">
                      {fmtMoney(h.value)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {(expanded.size > 0 || focus) && (
            <button
              onClick={() => {
                setExpanded(new Set());
                setFocus(null);
              }}
              className="rounded-sm border border-[var(--color-parchment)] px-2 py-1 text-[11px] text-[var(--color-ink-light)] hover:border-[var(--color-sage)]"
            >
              Reset
            </button>
          )}
          <button
            onClick={() => setFull((f) => !f)}
            className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--color-parchment)] px-2 py-1 text-[11px] text-[var(--color-ink-light)] hover:border-[var(--color-sage)]"
          >
            {full ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            {full ? "Exit" : "Full screen"}
          </button>
        </div>
      </div>

      {/* ── headline + legend ── */}
      <div className="mb-4 border-b border-[var(--color-parchment)] pb-4">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-mono text-[26px] font-bold tabular-nums text-[var(--color-canopy)] sm:text-[32px]">
            {fmtExact(graph.total)}
          </span>
          <span className="text-[14px] text-[var(--color-ink-light)]">
            {basis === "gross"
              ? "the City's official total — dollars that move between funds are counted more than once"
              : "with internal transfers removed, so no dollar is counted twice"}
            {" · "}
            <span className="text-[var(--color-ink-muted)]">{YEAR_LABEL[year]}</span>
          </span>
        </div>

        <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Legend swatch={COLOR.external} label="Money arriving from outside the City" />
          <Legend swatch={COLOR.spending} label="Spending by a bureau or program" />
          <Legend swatch={COLOR.reserve} label="Held, or not broken out" />
          <li className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-ink-light)]">
            <span
              aria-hidden="true"
              className="h-3 w-5 rounded-[2px] border border-[var(--color-parchment)]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #7d8a93 0 2px, transparent 2px 5px)",
              }}
            />
            Internal transaction — the same dollar, counted twice
          </li>
          <li className="text-[12px] text-[var(--color-ink-muted)]">
            Band thickness = dollars, one scale across the whole diagram
          </li>
          <li className="text-[12px] text-[var(--color-ink-muted)]">
            Click a band to pin its exact figure · click a bureau to open its programs
          </li>
        </ul>
      </div>

      {/* ── diagram + inspector ── */}
      <div
        className={`grid gap-5 ${
          selected ? "lg:grid-cols-[minmax(0,1fr)_300px]" : "grid-cols-1"
        }`}
      >
        <div ref={wrapRef} className="relative min-w-0">
          {/* Column headings, anchored to their column and hidden when the
              viewport is too narrow for them to sit apart. */}
          <div className="relative mb-2 hidden h-4 lg:block">
            {layout.columns.map((c, i) => {
              const prev = layout.columns[i - 1];
              // Drop a heading that would collide with the one before it.
              if (prev && c.x - prev.x < 150) return null;
              return (
                <span
                  key={c.stage}
                  className="absolute whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]"
                  style={
                    i === layout.columns.length - 1
                      ? { right: Math.max(0, width - c.x - 40) }
                      : { left: Math.max(0, c.x - 2) }
                  }
                >
                  {STAGE_LABEL[c.stage]}
                </span>
              );
            })}
          </div>

          <div className="relative" style={{ height: layout.height }}>
            <svg
              width={width}
              height={layout.height}
              viewBox={`0 0 ${width} ${layout.height}`}
              className="absolute inset-0"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="pcl-internal"
                  patternUnits="userSpaceOnUse"
                  width="6"
                  height="6"
                  patternTransform="rotate(45)"
                >
                  <rect width="6" height="6" fill={COLOR.internal} fillOpacity="0.18" />
                  <line x1="0" y1="0" x2="0" y2="6" stroke={COLOR.internal} strokeWidth="1.6" strokeOpacity="0.5" />
                </pattern>
              </defs>

              {/* thick ribbons first so thin ones stay visible */}
              <g style={{ pointerEvents: "none" }}>
                {[...layout.links]
                  .sort((a, b) => b.thickness - a.thickness)
                  .map((l) => (
                    <path
                      key={l.id}
                      d={l.d}
                      fill={l.internal ? "url(#pcl-internal)" : COLOR.external}
                      fillOpacity={l.internal ? 0.9 : 0.24}
                      style={{ opacity: dim(l.id, "link"), transition: "opacity 160ms" }}
                    />
                  ))}
              </g>

              {layout.nodes.map((n) => (
                <rect
                  key={n.id}
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={n.h}
                  rx={1}
                  fill={COLOR[n.kind]}
                  style={{ opacity: dim(n.id, "node"), transition: "opacity 160ms" }}
                />
              ))}
            </svg>

            {/* Labels are HTML, not SVG text: the site scales arbitrary px type
                up at six breakpoints with !important, and SVG fontSize ignores
                all of it. HTML also gives real truncation, Cmd+F, and focus rings. */}
            {layout.nodes.map((n) => {
              const on = !connected || connected.nodes.has(n.id);
              const left = n.labelSide === "left" ? n.x - 6 : n.x + n.w + 6;
              return (
                <button
                  key={n.id}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(n.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => onNodeClick(n)}
                  aria-label={`${n.label}. ${fmtExact(n.value)}. ${((n.value / graph.total) * 100).toFixed(1)} percent of the total.${n.stage === "bureau" && !n.parentId ? " Activate to show its programs." : ""}`}
                  className="absolute cursor-pointer text-left"
                  style={{
                    left: n.labelSide === "left" ? undefined : left,
                    right: n.labelSide === "left" ? width - n.x + 6 : undefined,
                    top: n.labeled ? n.labelY : n.y + n.h / 2,
                    transform: "translateY(-50%)",
                    width: labelW,
                    height: n.labeled ? undefined : Math.max(n.h, 7),
                    opacity: on ? 1 : 0.25,
                    transition: "opacity 160ms",
                  }}
                >
                  {n.labeled && (
                    // Labels sit over the ribbon field, so they carry a
                    // translucent backing — without it, text on a dense
                    // crossing is unreadable.
                    <span
                      className={`line-clamp-2 block rounded-[2px] bg-[var(--color-paper)]/80 px-1 text-[11px] leading-tight backdrop-blur-[1px] ${
                        n.labelSide === "left" ? "text-right" : ""
                      } ${focus === n.id ? "font-semibold text-[var(--color-canopy)]" : "text-[var(--color-ink-light)]"}`}
                    >
                      {n.label}
                      <span className="ml-1 font-mono text-[10px] text-[var(--color-ink-muted)]">
                        {fmtMoney(n.value)}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
            Ribbon thickness is dollars, on one scale across the whole diagram.{" "}
            <span className="inline-block h-2 w-4 translate-y-[1px] rounded-sm bg-[repeating-linear-gradient(45deg,#7d8a93_0_2px,transparent_2px_5px)]" />{" "}
            marks internal transactions — money moving between city funds, counted on both sides
            of the gross total.
            {unlabeled > 0 && (
              <>
                {" "}
                {unlabeled} node{unlabeled === 1 ? " is" : "s are"} too small to label at this size;
                use search, the table below, or switch to Everything.
              </>
            )}
          </p>
        </div>

        {/* ── inspector ── */}
        {selected && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <NodeCard
              node={selected}
              total={graph.total}
              data={data}
              year={year}
              onClose={() => setFocus(null)}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <li className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-ink-light)]">
      <span
        aria-hidden="true"
        className="h-3 w-5 rounded-[2px]"
        style={{ backgroundColor: swatch, opacity: 0.85 }}
      />
      {label}
    </li>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
        {label}
      </span>
      <div className="flex gap-1">{children}</div>
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-sm border px-2 py-1 text-[11px] font-medium transition-colors ${
        on
          ? "border-[var(--color-canopy)] bg-[var(--color-canopy)] text-white"
          : "border-[var(--color-parchment)] text-[var(--color-ink-light)] hover:border-[var(--color-sage)]"
      }`}
    >
      {children}
    </button>
  );
}

function NodeCard({
  node,
  total,
  data,
  year,
  onClose,
}: {
  node: FlowNode;
  total: number;
  data: BudgetDataset;
  year: FiscalYear;
  onClose: () => void;
}) {
  const yi = YEARS.indexOf(year);
  const prog = node.id.startsWith("prog:")
    ? data.programs.find((p) => `prog:${p.slug}` === node.id)
    : undefined;
  const [copied, setCopied] = useState(false);

  const citation = prog
    ? `${prog.bureau}'s ${prog.name} program is budgeted at ${fmtExact(prog.total[yi] ?? 0)} for FY ${year} (City of Portland FY 2026-27 Adopted Budget, Vol. 2, p. ${prog.pages[0]}).`
    : `${node.label}: ${fmtExact(node.value)} in the City of Portland FY ${year} budget (FY 2026-27 Adopted Budget).`;

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-semibold leading-snug text-[var(--color-ink)]">
          {node.label}
        </h3>
        <button
          onClick={onClose}
          aria-label="Clear selection"
          className="shrink-0 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="font-mono text-[24px] font-bold tabular-nums leading-none text-[var(--color-canopy)]">
        {fmtExact(node.value)}
      </p>
      <p className="mt-1 text-[12px] text-[var(--color-ink-muted)]">
        {((node.value / total) * 100).toFixed(2)}% of the {fmtMoney(total)} shown
      </p>

      {prog && (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-[var(--color-parchment)]">
            {YEARS.map((y, i) => (
              <div key={y} className="bg-white p-2">
                <dt className="font-mono text-[9px] uppercase tracking-wide text-[var(--color-ink-muted)]">
                  {y}
                </dt>
                <dd className="font-mono text-[12px] font-semibold tabular-nums text-[var(--color-ink)]">
                  {prog.total[i] == null ? "—" : fmtMoney(prog.total[i] as number)}
                </dd>
              </div>
            ))}
          </dl>
          {(prog.fte[yi] ?? 0) > 0 && (
            <p className="mt-3 text-[12px] text-[var(--color-ink-light)]">
              <span className="font-mono font-semibold">{(prog.fte[yi] ?? 0).toFixed(2)}</span> FTE
            </p>
          )}
          {prog.funding.length > 0 && (
            <div className="mt-3 border-t border-[var(--color-parchment)] pt-3">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-[var(--color-ink-muted)]">
                Paid from
              </p>
              <ul className="space-y-0.5">
                {[...new Set(prog.funding.map((f) => f.fundName))].slice(0, 5).map((f) => (
                  <li key={f} className="text-[12px] text-[var(--color-ink-light)]">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {prog.description && (
            <p className="mt-3 border-t border-[var(--color-parchment)] pt-3 text-[12px] leading-relaxed text-[var(--color-ink-light)]">
              {prog.description}
            </p>
          )}
          <p className="mt-3 font-mono text-[10px] text-[var(--color-ink-muted)]">
            Vol. 2, p. {prog.pages[0]}
          </p>
        </>
      )}

      {!prog && node.detail && (
        <p className="mt-3 border-t border-[var(--color-parchment)] pt-3 text-[12px] leading-relaxed text-[var(--color-ink-light)]">
          {node.detail}
        </p>
      )}

      <button
        onClick={() => {
          navigator.clipboard?.writeText(citation);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }}
        className="mt-4 w-full rounded-sm border border-[var(--color-parchment)] px-3 py-2 text-[11px] font-medium text-[var(--color-ink-light)] hover:border-[var(--color-sage)]"
      >
        {copied ? "Copied" : "Copy this line with its citation"}
      </button>
    </div>
  );
}
