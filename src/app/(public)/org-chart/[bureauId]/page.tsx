import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Users } from "lucide-react";
import { getBureauDetail, bureauIds } from "@/lib/org/bureau";
import { pageMeta } from "@/lib/page-meta";
import {
  SERVICE_AREA_BY_SLUG,
  FUND_MODEL_LABELS,
} from "@/data/org-structure";
import { PERSONNEL_FY, PERSONNEL_SOURCE } from "@/data/org-personnel";
import { FINANCE_FY, FINANCE_SOURCE } from "@/data/org-analysis";
import {
  INDIVIDUAL_SALARIES,
  INDIVIDUAL_SALARIES_AVAILABLE,
  INDIVIDUAL_SALARIES_FY,
} from "@/data/individual-salaries";

export const dynamicParams = false;

export function generateStaticParams() {
  return bureauIds().map((bureauId) => ({ bureauId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bureauId: string }>;
}): Promise<Metadata> {
  const { bureauId } = await params;
  const d = getBureauDetail(bureauId);
  if (!d) return { title: "Bureau not found" };
  return pageMeta({
    title: `${d.node.name} — Portland Org Chart`,
    description: `Headcount, salary cost, departments, and pay for the ${d.node.name} — City of Portland (${PERSONNEL_FY}).`,
    path: `/org-chart/${bureauId}`,
    type: "article",
  });
}

function money(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}k`;
  return `$${Math.round(n)}`;
}
function full(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}
function fmtFte(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
function band(min: number | null, max: number | null): string {
  if (!min && !max) return "—";
  if (min && max && min !== max) return `${money(min)}–${money(max)}`;
  return money((min || max) as number);
}

export default async function BureauPage({
  params,
}: {
  params: Promise<{ bureauId: string }>;
}) {
  const { bureauId } = await params;
  const d = getBureauDetail(bureauId);
  if (!d) notFound();

  const { node, personnel, finance, chain, costPerFte, buckets } = d;
  const sa = SERVICE_AREA_BY_SLUG[node.serviceArea];
  const maxDept = finance?.departments[0]?.budget ?? 0;
  const maxBucket = Math.max(...buckets.map((b) => b.fte), 1);
  const maxClassCost = personnel.classifications[0]?.cost ?? 1;

  return (
    <div className="bg-[var(--color-paper)]">
      {/* hero */}
      <section
        className="relative overflow-hidden border-b border-[var(--color-parchment)]"
        style={{ backgroundColor: `${sa.color}10` }}
      >
        <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:px-12">
          <Link
            href="/org-chart"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-ink-light)] hover:text-[var(--color-ink)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Org chart
          </Link>

          {/* reporting chain */}
          <div className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-[var(--color-ink-muted)]">
            {chain.slice(0, -1).map((p) => (
              <span key={p.id} className="flex items-center gap-1.5">
                {bureauIds().includes(p.id) ? (
                  <Link
                    href={`/org-chart/${p.id}`}
                    className="hover:text-[var(--color-canopy)] hover:underline"
                  >
                    {p.name}
                  </Link>
                ) : (
                  <span>{p.name}</span>
                )}
                <span>/</span>
              </span>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: sa.color }}
            />
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              {sa.label}
            </span>
          </div>
          <h1 className="mt-2 font-editorial-normal text-[34px] leading-tight text-[var(--color-ink)] sm:text-[44px]">
            {node.name}
            {node.abbr && (
              <span className="ml-3 font-mono text-[18px] text-[var(--color-ink-muted)]">
                {node.abbr}
              </span>
            )}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-[14px] text-[var(--color-ink-light)]">
            {node.leader && (
              <span>
                Led by{" "}
                <span className="font-semibold text-[var(--color-ink)]">
                  {node.leader}
                </span>
                {node.leaderTitle ? `, ${node.leaderTitle}` : ""}
              </span>
            )}
            {node.fundModel && <span>{FUND_MODEL_LABELS[node.fundModel]}</span>}
          </div>
          {node.notes && (
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-[var(--color-ink-light)]">
              {node.notes}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:px-12">
        {/* key stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <BigStat label="Authorized FTE" value={fmtFte(personnel.totalFte)} />
          <BigStat label="Salary cost" value={money(personnel.totalCost)} hint="budgeted personnel $" />
          <BigStat label="Avg cost / FTE" value={money(costPerFte)} />
          <BigStat label="Job classes" value={String(personnel.classCount)} />
          <BigStat
            label="Operating budget"
            value={finance ? money(finance.operatingTotal) : "—"}
            hint="all funds"
          />
          <BigStat
            label="Departments"
            value={finance ? String(finance.departments.length) : "—"}
          />
        </div>

        {/* departments */}
        {finance && finance.departments.length > 0 && (
          <section className="mt-12">
            <h2 className="font-editorial text-[24px] text-[var(--color-ink)]">
              Where the money goes
            </h2>
            <p className="mt-1 text-[13px] text-[var(--color-ink-light)]">
              Program budget, {money(finance.operatingTotal)} total ({FINANCE_FY},
              all funds — capital, debt, and pass-throughs included, so this is
              larger than salary cost). Top programs shown cover {finance.shownPct}%
              of the bureau.
            </p>
            <div className="mt-5 space-y-2.5">
              {finance.departments.map((dep) => (
                <div key={dep.name}>
                  <div className="flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="text-[var(--color-ink)]">{dep.name}</span>
                    <span className="flex-none tabular-nums text-[var(--color-ink-light)]">
                      {full(dep.budget)}{" "}
                      <span className="text-[var(--color-ink-muted)]">
                        · {dep.pct}%
                      </span>
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-sm bg-[var(--color-parchment)]">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${maxDept ? (dep.budget / maxDept) * 100 : 0}%`,
                        backgroundColor: sa.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
          {/* classification table */}
          <section>
            <h2 className="font-editorial text-[24px] text-[var(--color-ink)]">
              Salaries by job classification
            </h2>
            <p className="mt-1 text-[13px] text-[var(--color-ink-light)]">
              {personnel.classCount} classes · {fmtFte(personnel.totalFte)} FTE ·{" "}
              {money(personnel.totalCost)} budgeted ({PERSONNEL_FY}). Pay bands
              from the City compensation plan.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--color-parchment)] text-left text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)]">
                    <th className="py-2 pr-3 font-semibold">Classification</th>
                    <th className="py-2 px-2 text-right font-semibold">FTE</th>
                    <th className="py-2 px-2 text-right font-semibold">Budgeted</th>
                    <th className="py-2 px-2 text-right font-semibold">Pay band</th>
                    <th className="hidden py-2 pl-2 font-semibold sm:table-cell">
                      Union
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {personnel.classifications.map((c, i) => (
                    <tr
                      key={i}
                      className="border-b border-[var(--color-parchment)]/60"
                    >
                      <td className="py-1.5 pr-3 text-[var(--color-ink)]">
                        <div className="flex items-center gap-2">
                          <span
                            className="hidden h-1.5 rounded-sm sm:block"
                            style={{
                              width: `${Math.max((c.cost / maxClassCost) * 56, 2)}px`,
                              backgroundColor: sa.color,
                              opacity: 0.5,
                            }}
                          />
                          {c.title}
                        </div>
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums text-[var(--color-ink-light)]">
                        {fmtFte(c.fte)}
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums text-[var(--color-ink-light)]">
                        {money(c.cost)}
                      </td>
                      <td className="whitespace-nowrap py-1.5 px-2 text-right tabular-nums text-[var(--color-ink-muted)]">
                        {band(c.salaryMin, c.salaryMax)}
                      </td>
                      <td className="hidden py-1.5 pl-2 text-[var(--color-ink-muted)] sm:table-cell">
                        {c.bargUnit ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* pay distribution */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <h2 className="font-editorial text-[20px] text-[var(--color-ink)]">
              Pay distribution
            </h2>
            <p className="mt-1 text-[12px] text-[var(--color-ink-light)]">
              Authorized FTE by classification pay-band midpoint.
            </p>
            <div className="mt-4 space-y-2">
              {buckets.map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                  <span className="w-16 flex-none text-right text-[11px] tabular-nums text-[var(--color-ink-muted)]">
                    {b.label}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded-sm bg-[var(--color-parchment)]/60">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${(b.fte / maxBucket) * 100}%`,
                        backgroundColor: sa.color,
                      }}
                    />
                  </div>
                  <span className="w-10 flex-none text-[11px] tabular-nums text-[var(--color-ink-light)]">
                    {Math.round(b.fte)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              <Users className="mb-1.5 h-4 w-4 opacity-50" />
              Authorized positions, not filled headcount. Named individual
              salaries require a{" "}
              <Link
                href="/records"
                className="font-semibold text-[var(--color-canopy)] hover:underline"
              >
                public records request
              </Link>
              .
            </div>
          </aside>
        </div>

        {/* individual salaries (v3 — appears once the PRR roster is loaded) */}
        {INDIVIDUAL_SALARIES_AVAILABLE &&
          (INDIVIDUAL_SALARIES[bureauId]?.length ?? 0) > 0 && (
            <section className="mt-12">
              <h2 className="font-editorial text-[24px] text-[var(--color-ink)]">
                Individual salaries
              </h2>
              <p className="mt-1 text-[13px] text-[var(--color-ink-light)]">
                {INDIVIDUAL_SALARIES_FY} · obtained via public records request.
                Names below the citywide median are suppressed.
              </p>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-[var(--color-parchment)] text-left text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)]">
                      <th className="py-2 pr-3 font-semibold">Name</th>
                      <th className="py-2 px-2 font-semibold">Classification</th>
                      <th className="py-2 pl-2 text-right font-semibold">
                        Total pay
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {INDIVIDUAL_SALARIES[bureauId].slice(0, 300).map((e, i) => (
                      <tr
                        key={i}
                        className="border-b border-[var(--color-parchment)]/60"
                      >
                        <td className="py-1.5 pr-3 text-[var(--color-ink)]">
                          {e.name ?? (
                            <span className="text-[var(--color-ink-muted)]">
                              (suppressed)
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 px-2 text-[var(--color-ink-light)]">
                          {e.classification}
                        </td>
                        <td className="py-1.5 pl-2 text-right tabular-nums text-[var(--color-ink-light)]">
                          {full(e.regularGross + e.overtime + e.otherEarnings)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

        {/* sources */}
        <div className="mt-12 border-t border-[var(--color-parchment)] pt-5 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
          Sources: staffing &amp; salary cost from the{" "}
          <a
            href={PERSONNEL_SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--color-canopy)] hover:underline"
          >
            FY2025-26 Adopted Budget — FTE Summary <ExternalLink className="inline h-3 w-3" />
          </a>{" "}
          joined to the City compensation plan; program budget from the{" "}
          <a
            href={FINANCE_SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--color-canopy)] hover:underline"
          >
            budget Bureau Programs
          </a>
          .{node.source && (
            <>
              {" "}
              Bureau page:{" "}
              <a
                href={node.source}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--color-canopy)] hover:underline"
              >
                portland.gov
              </a>
              .
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function BigStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-4">
      <div className="font-editorial text-[26px] leading-none text-[var(--color-ink)]">
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
