"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Building2,
  Scale,
  AlertCircle,
  MapPin,
  ArrowRight,
  Calendar,
  Briefcase,
} from "lucide-react";

import StatGrid from "@/components/charts/StatGrid";
import TrendChart from "@/components/charts/TrendChart";
import BarChart from "@/components/charts/BarChart";
import ComparisonBarChart from "@/components/charts/ComparisonBarChart";

const ACCENT = "#5c8b9c"; // slate-teal

interface SubScore {
  key: string;
  label: string;
  value: number;
  weight: number;
  rawWeight: number;
  description: string;
}

interface BusinessRow {
  month: string;
  new_businesses: number;
  bankruptcies: number;
  lawsuits: number;
  tax_liens: number;
}

interface ReRow {
  month: string;
  entity_buyers: number;
  person_buyers: number;
  total_volume_usd: string | number;
  deal_count: number;
  entity_share_pct: string | number | null;
}

interface SerialBuyer {
  buyer_name: string;
  buyer_type: string | null;
  deal_count: number;
  total_volume_usd: string | number | null;
  zip_count: number | null;
}

interface DistressEntity {
  entity_name: string;
  categories: string[];
  category_count: number;
}

interface TopLawsuit {
  defendant_name: string;
  plaintiff_name: string | null;
  suit_type: string | null;
  damages_usd: string | number;
  filed_date: string | null;
}

interface ZipRow {
  zip_code: string;
  permit_count: number;
  permit_value_usd: string | number;
  re_deal_count: number;
  re_volume_usd: string | number;
  new_business_count: number;
  total_investment_usd: string | number;
}

interface IndustryRow {
  sector: string;
  jobs_delta: number;
  pct: number;
}

interface DetailPayload {
  composite: {
    score: number;
    label: "Healthy" | "Mixed" | "Concerning" | "Insufficient data";
    subScores: SubScore[];
    missing: string[];
  } | null;
  businessSeries: BusinessRow[];
  reSeries: ReRow[];
  serialBuyers: SerialBuyer[];
  distressEntities: DistressEntity[];
  topLawsuits: TopLawsuit[];
  zipInvestment: ZipRow[];
  industryGainers: IndustryRow[];
  industryLosers: IndustryRow[];
  unemployment: { rate: number | null; period: string | null };
  windowSummary: {
    newBiz12mo: number;
    newBizPriorYear: number;
    bankruptcies12mo: number;
    distress12mo: number;
    distressPriorYear: number;
    reVolume12mo: number;
    reDeals12mo: number;
    entityBuyers12mo: number;
    permitsCurr: number;
    permitsPrior: number;
  } | null;
  meta: { pbjAsOf: string | null; qcewAsOf: string | null; scoreAsOf: string | null };
  dataStatus: string;
}

// ── helpers ─────────────────────────────────────────────────────────────

const fmtUsd = (n: number | string | null) => {
  const v = Number(n ?? 0);
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
};

const fmtPct = (n: number | string | null, decimals = 1) => {
  const v = Number(n ?? 0);
  return `${v >= 0 ? "+" : ""}${v.toFixed(decimals)}%`;
};

function pctChange(curr: number, prior: number): number {
  if (!prior) return 0;
  return Math.round(((curr - prior) / prior) * 1000) / 10;
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <Icon className="w-4 h-4" style={{ color: ACCENT }} />
      <h2 className="text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.15em]">
        {title}
      </h2>
      <div className="flex-1 h-px bg-[var(--color-parchment)]" />
    </div>
  );
}

function DigDeeper({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-5 flex justify-end">
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
      >
        {label}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function ScoreBar({ s }: { s: SubScore }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[12px]">
        <span className="text-[var(--color-ink)]">{s.label}</span>
        <span className="font-mono text-[var(--color-ink-muted)]">
          {s.value}
          <span className="text-[10px] ml-2">w {(s.rawWeight * 100).toFixed(0)}%</span>
        </span>
      </div>
      <div className="w-full h-2 bg-[var(--color-parchment)] rounded-sm overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-500"
          style={{
            width: `${s.value}%`,
            backgroundColor:
              s.value >= 70 ? "#3d7a5a" : s.value >= 40 ? "#c8956c" : "#b85c3a",
          }}
        />
      </div>
      <p className="text-[10.5px] text-[var(--color-ink-muted)] leading-snug">
        {s.description}
      </p>
    </div>
  );
}

// ── component ───────────────────────────────────────────────────────────

export default function EconomicHealthDetail() {
  const [data, setData] = useState<DetailPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/economic-health/detail")
      .then((r) => r.json())
      .then((d: DetailPayload) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-48 rounded-sm bg-[var(--color-parchment)]" />
        ))}
      </div>
    );
  }

  if (error || !data || data.dataStatus === "error") {
    return (
      <div className="text-center py-16 text-[var(--color-ink-muted)]">
        <p className="text-sm">Economic Health data temporarily unavailable.</p>
      </div>
    );
  }

  const c = data.composite;
  const w = data.windowSummary;
  const newBizPct = w ? pctChange(w.newBiz12mo, w.newBizPriorYear) : 0;
  const distressPct = w ? pctChange(w.distress12mo, w.distressPriorYear) : 0;
  const permitPct = w ? pctChange(w.permitsCurr, w.permitsPrior) : 0;
  const entitySharePct =
    w && w.reDeals12mo > 0
      ? Math.round((w.entityBuyers12mo / w.reDeals12mo) * 1000) / 10
      : 0;
  const topDistress = data.distressEntities[0];
  const pbjStale =
    data.meta.pbjAsOf && Date.now() - new Date(data.meta.pbjAsOf).getTime() > 60 * 86400 * 1000;

  return (
    <div className="space-y-10">
      {pbjStale && (
        <div className="bg-[#fff7e6] border border-[#e8c87a] rounded-sm p-4 text-[13px]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#9a6b1a]" />
            <span className="font-semibold text-[#5a3a0a]">PBJ data refresh due</span>
          </div>
          <p className="text-[12px] text-[#7a5a2a] mt-1">
            Source data last refreshed {data.meta.pbjAsOf}. Re-run the PBJ scrape + sync to update.
          </p>
        </div>
      )}

      {/* ━━━ 1. HEALTH SCORE ━━━ */}
      <section>
        <SectionHeader icon={Activity} title="State of the Economy — Health Score" />
        <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-6">
          {c ? (
            <>
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8">
                <div className="flex-shrink-0">
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center"
                    style={{
                      background: `conic-gradient(${ACCENT} ${c.score * 3.6}deg, #efe7d8 ${c.score * 3.6}deg)`,
                    }}
                  >
                    <div className="w-24 h-24 rounded-full bg-[var(--color-paper-warm)] flex flex-col items-center justify-center">
                      <span className="text-[36px] font-mono font-semibold text-[var(--color-ink)] leading-none">
                        {c.score}
                      </span>
                      <span className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-[0.1em] mt-0.5">
                        / 100
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] mb-1.5">
                    Composite Economic Health
                  </p>
                  <h3 className="font-editorial-normal text-[28px] leading-tight text-[var(--color-ink)] mb-2">
                    {c.label === "Healthy" && "Portland's economy is broadly healthy."}
                    {c.label === "Mixed" && "Mixed signals — some indicators positive, some concerning."}
                    {c.label === "Concerning" && "Concerning signals across multiple indicators."}
                    {c.label === "Insufficient data" && "Insufficient data to compute a score."}
                  </h3>
                  <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
                    A weighted composite of business formation, financial distress, employment,
                    unemployment, building-permit activity, and real-estate volume. Each sub-score
                    is on a 0-100 scale; the composite uses the weights shown.
                  </p>
                </div>
              </div>

              {c.subScores.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
                  {c.subScores.map((s) => (
                    <ScoreBar key={s.key} s={s} />
                  ))}
                </div>
              )}

              {c.missing.length > 0 && (
                <p className="text-[11px] text-[var(--color-ink-muted)] mt-5 italic">
                  Missing inputs ({c.missing.join(", ")}) excluded; remaining weights re-normalized.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-[var(--color-ink-muted)]">Score unavailable.</p>
          )}

          {w && (
            <div className="mt-8 pt-6 border-t border-[var(--color-parchment)]">
              <StatGrid
                accentColor={ACCENT}
                stats={[
                  {
                    label: "New businesses (12mo)",
                    value: w.newBiz12mo,
                    change: newBizPct,
                    changeLabel: "vs prior 12",
                  },
                  {
                    label: "Bankruptcies (12mo)",
                    value: w.bankruptcies12mo,
                    change: distressPct,
                    changeLabel: "distress YoY",
                  },
                  {
                    label: "Unemployment (MSA)",
                    value: data.unemployment.rate?.toFixed(1) ?? "—",
                    suffix: "%",
                    subtitle: data.unemployment.period ?? "",
                  },
                  {
                    label: "BDS permits (12mo)",
                    value: w.permitsCurr,
                    change: permitPct,
                    changeLabel: "vs prior 12",
                  },
                ]}
              />
            </div>
          )}
        </div>
      </section>

      {/* ━━━ 2. WINNERS ━━━ */}
      <section>
        <SectionHeader icon={TrendingUp} title="Where Portland is Doing Well" />
        <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-ink)] mb-3">
                Industries adding jobs (YoY)
              </h3>
              {data.industryGainers.length > 0 ? (
                <ul className="space-y-2">
                  {data.industryGainers.map((g) => (
                    <li
                      key={g.sector}
                      className="flex justify-between text-[13px] py-1.5 border-b border-[var(--color-parchment)]"
                    >
                      <span className="text-[var(--color-ink)]">{g.sector}</span>
                      <span className="font-mono text-[#3d7a5a]">
                        +{g.jobs_delta.toLocaleString()} ({fmtPct(g.pct)})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-[var(--color-ink-muted)]">
                  Industry breakdown unavailable.
                </p>
              )}
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-ink)] mb-3">
                Top ZIPs by total investment
              </h3>
              {data.zipInvestment.length > 0 ? (
                <BarChart
                  height={Math.min(280, 28 * data.zipInvestment.slice(0, 5).length + 60)}
                  layout="vertical"
                  color={ACCENT}
                  valuePrefix="$"
                  data={data.zipInvestment.slice(0, 5).map((z) => ({
                    name: z.zip_code,
                    value: Math.round(Number(z.total_investment_usd) / 1_000_000),
                  }))}
                  valueSuffix="M"
                />
              ) : (
                <p className="text-[12px] text-[var(--color-ink-muted)]">No ZIP data.</p>
              )}
            </div>
          </div>
          <DigDeeper href="/dashboard/economy" label="Industry & wage detail on Economy" />
          <DigDeeper href="/dashboard/housing" label="Permit pipeline detail on Housing" />
        </div>
      </section>

      {/* ━━━ 3. LOSERS ━━━ */}
      <section>
        <SectionHeader icon={TrendingDown} title="Where Portland is Struggling" />
        <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-ink)] mb-3">
                Industries shedding jobs (YoY)
              </h3>
              {data.industryLosers.length > 0 ? (
                <ul className="space-y-2">
                  {data.industryLosers.map((g) => (
                    <li
                      key={g.sector}
                      className="flex justify-between text-[13px] py-1.5 border-b border-[var(--color-parchment)]"
                    >
                      <span className="text-[var(--color-ink)]">{g.sector}</span>
                      <span className="font-mono text-[#b85c3a]">
                        {g.jobs_delta.toLocaleString()} ({fmtPct(g.pct)})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-[var(--color-ink-muted)]">
                  Industry breakdown unavailable.
                </p>
              )}
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-ink)] mb-3">
                Bankruptcies — last 24 months
              </h3>
              {data.businessSeries.length > 0 ? (
                <TrendChart
                  height={220}
                  color="#b85c3a"
                  data={data.businessSeries.map((r) => ({
                    date: r.month,
                    value: r.bankruptcies,
                  }))}
                />
              ) : (
                <p className="text-[12px] text-[var(--color-ink-muted)]">No bankruptcy data.</p>
              )}
            </div>
          </div>
          <DigDeeper href="/dashboard/economy" label="Sector-level wage and job detail on Economy" />
        </div>
      </section>

      {/* ━━━ 4. WHO'S WINNING ━━━ */}
      <section>
        <SectionHeader icon={Building2} title="Who's Winning — Capital Concentration" />
        <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5">
          <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed mb-4">
            Of {Number(w?.reDeals12mo ?? 0).toLocaleString()} real-estate transactions in the last
            12 months, <strong>{entitySharePct}%</strong> went to LLCs, corporations, or trusts —
            meaning roughly <strong>{Number(w?.entityBuyers12mo ?? 0).toLocaleString()}</strong>{" "}
            Portland properties were absorbed by entities, not individuals.
          </p>

          {data.reSeries.length > 0 && (
            <div className="mb-5">
              <ComparisonBarChart
                height={240}
                xKey="month"
                bars={[
                  { key: "person_buyers", label: "Individual buyer", color: ACCENT, stackId: "a" },
                  { key: "entity_buyers", label: "Entity buyer (LLC/corp/trust)", color: "#7c5a8c", stackId: "a" },
                ]}
                data={data.reSeries as unknown as Record<string, string | number>[]}
                showLegend={true}
              />
            </div>
          )}

          {data.serialBuyers.length > 0 && (
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-ink)] mb-3">
                Most-active buyers
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="text-left text-[var(--color-ink-muted)] border-b border-[var(--color-parchment)]">
                      <th className="py-2 font-semibold">Buyer</th>
                      <th className="py-2 font-semibold">Type</th>
                      <th className="py-2 font-semibold text-right">Properties</th>
                      <th className="py-2 font-semibold text-right">Total value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.serialBuyers.slice(0, 10).map((b) => (
                      <tr key={b.buyer_name} className="border-b border-[var(--color-parchment)]">
                        <td className="py-2 text-[var(--color-ink)]">{b.buyer_name}</td>
                        <td className="py-2 text-[var(--color-ink-muted)]">
                          {b.buyer_type ?? "—"}
                        </td>
                        <td className="py-2 text-right font-mono">{b.deal_count}</td>
                        <td className="py-2 text-right font-mono">{fmtUsd(b.total_volume_usd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <DigDeeper href="/dashboard/housing" label="Rent and home-value detail on Housing" />
        </div>
      </section>

      {/* ━━━ 5. WHO'S LOSING ━━━ */}
      <section>
        <SectionHeader icon={Scale} title="Who's Losing — Lawsuits and Distress" />
        <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-ink)] mb-3">
                Biggest lawsuits (claimed damages)
              </h3>
              {data.topLawsuits.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-[12.5px]">
                    <thead>
                      <tr className="text-left text-[var(--color-ink-muted)] border-b border-[var(--color-parchment)]">
                        <th className="py-2 font-semibold">Defendant</th>
                        <th className="py-2 font-semibold">Plaintiff</th>
                        <th className="py-2 font-semibold text-right">Damages</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topLawsuits.slice(0, 10).map((s, i) => (
                        <tr key={i} className="border-b border-[var(--color-parchment)]">
                          <td className="py-2 text-[var(--color-ink)]">{s.defendant_name}</td>
                          <td className="py-2 text-[var(--color-ink-muted)]">
                            {s.plaintiff_name ?? "—"}
                          </td>
                          <td className="py-2 text-right font-mono">{fmtUsd(s.damages_usd)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[12px] text-[var(--color-ink-muted)]">No lawsuit data.</p>
              )}
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-ink)] mb-3">
                Multi-category distress entities
              </h3>
              <p className="text-[11.5px] text-[var(--color-ink-muted)] mb-3">
                Companies appearing in 2+ negative categories (lawsuit + lien + bankruptcy +
                judgment).
              </p>
              {data.distressEntities.length > 0 ? (
                <ul className="space-y-1.5">
                  {data.distressEntities.slice(0, 12).map((e) => (
                    <li
                      key={e.entity_name}
                      className="flex justify-between gap-3 text-[12.5px] py-1 border-b border-[var(--color-parchment)]"
                    >
                      <span className="text-[var(--color-ink)] truncate">{e.entity_name}</span>
                      <span className="text-[var(--color-ink-muted)] flex-shrink-0">
                        {e.categories.join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-[var(--color-ink-muted)]">No distress data.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 6. WHY ━━━ */}
      <section>
        <SectionHeader icon={AlertCircle} title="Why — Putting it Together" />
        <div className="bg-[var(--color-canopy)] rounded-sm p-6 text-white/85">
          <p className="text-[15px] leading-relaxed text-white/90 mb-4">
            Portland filed{" "}
            <strong className="text-white">
              {Number(w?.newBiz12mo ?? 0).toLocaleString()}
            </strong>{" "}
            new businesses over the last 12 months
            {w && w.newBizPriorYear > 0 ? (
              <>
                ,{" "}
                <strong className={newBizPct >= 0 ? "text-[#9ec8a8]" : "text-[#e8a88f]"}>
                  {newBizPct >= 0 ? "+" : ""}
                  {newBizPct}%
                </strong>{" "}
                versus the prior 12
              </>
            ) : null}
            . Bankruptcies totaled{" "}
            <strong className="text-white">{w?.bankruptcies12mo ?? 0}</strong>; total distress
            filings (bankruptcies + lawsuits + active liens) ran{" "}
            <strong className={distressPct >= 0 ? "text-[#e8a88f]" : "text-[#9ec8a8]"}>
              {distressPct >= 0 ? "+" : ""}
              {distressPct}%
            </strong>{" "}
            year-over-year.
          </p>
          <p className="text-[14px] leading-relaxed text-white/80 mb-4">
            Unemployment sits at{" "}
            <strong className="text-white">
              {data.unemployment.rate != null ? data.unemployment.rate.toFixed(1) + "%" : "—"}
            </strong>{" "}
            ({data.unemployment.period ?? "latest"}). Of{" "}
            <strong className="text-white">
              {Number(w?.reDeals12mo ?? 0).toLocaleString()}
            </strong>{" "}
            real-estate transactions, <strong className="text-white">{entitySharePct}%</strong>{" "}
            went to LLCs, corporations, or trusts — meaning{" "}
            <strong className="text-white">
              {Number(w?.entityBuyers12mo ?? 0).toLocaleString()}
            </strong>{" "}
            Portland properties were absorbed by entities rather than individuals over the past
            year.
          </p>
          {topDistress && (
            <p className="text-[14px] leading-relaxed text-white/80">
              <strong className="text-white">{data.distressEntities.length}</strong> entities
              appear in two or more negative categories (lawsuit + lien + bankruptcy + judgment),
              led by{" "}
              <strong className="text-white">{topDistress.entity_name}</strong> (
              {topDistress.categories.join(", ")}).
            </p>
          )}
          <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-white/10">
            <Link
              href="/dashboard/economy"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/90 hover:text-white transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Detailed jobs, wages, and industry breakdown
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard/housing"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/90 hover:text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              Rent, home-value, and permit-pipeline detail
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* coverage footer */}
      <section>
        <p className="text-[11px] text-[var(--color-ink-muted)] italic">
          Coverage: PBJ public records through {data.meta.pbjAsOf ?? "(no data)"} ·
          QCEW through {data.meta.qcewAsOf ?? "(no data)"} ·
          score recomputed {data.meta.scoreAsOf}.
          {data.composite?.missing.length
            ? ` Score uses ${data.composite.subScores.length} of 6 indicators (missing: ${data.composite.missing.join(", ")}).`
            : ""}
        </p>
      </section>
    </div>
  );
}
