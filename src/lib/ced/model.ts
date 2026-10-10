import raw from "./portfolio.json";
import type { Decision, Funding, OutcomeId, Portfolio, Window } from "./types";
export const portfolio = raw as Portfolio;
export const EDITION = portfolio.edition;
export const sources = new Map(portfolio.sources.map((s) => [s.id, s]));
export const initiatives = new Map(portfolio.initiatives.map((i) => [i.id, i]));
export const OUTCOMES: {
  id: OutcomeId;
  name: string;
  indicator: string;
  explanation: string;
  measureId: string;
}[] = [
  {
    id: "housing-costs",
    name: "Housing affordability",
    indicator: "Households spending less than 30% of income on housing",
    explanation:
      "Housing supply, preservation and household stability. A contribution pathway is not an estimate of rent reduction.",
    measureId: "100716938",
  },
  {
    id: "affordable-housing",
    name: "Regulated affordable homes",
    indicator: "Share of housing units that are regulated and affordable",
    explanation:
      "Preserve existing affordability and deliver homes with enforceable affordability commitments.",
    measureId: "100716940",
  },
  {
    id: "carbon",
    name: "Lower carbon emissions",
    indicator: "Carbon reduction from the 1990 baseline",
    explanation:
      "Reduce emissions from buildings, transportation and industry; measure realized reductions separately from modeled ones.",
    measureId: "100716941",
  },
  {
    id: "quality-jobs",
    name: "Jobs that meet basic needs",
    indicator: "Workers earning enough to meet basic income needs",
    explanation:
      "Connect investment to job quality, retention, access and household earnings.",
    measureId: "100716939",
  },
  {
    id: "economic-growth",
    name: "Economic growth",
    indicator: "Real gross domestic product for Portland",
    explanation:
      "Support productive activity and a functioning Central City without attributing citywide GDP changes to individual projects.",
    measureId: "100716943",
  },
];
export const MONEY_LABELS: Record<Funding["type"], string> = {
  allocation: "Allocation / award",
  "authorization-ceiling": "Authorization ceiling",
  "program-envelope": "Program envelope",
  proposal: "Proposed / conditional",
  estimate: "Cost estimate",
};
export type DecisionStatus =
  | "Resolved"
  | "Superseded"
  | "Upcoming"
  | "Due"
  | "Past expected date"
  | "No public date found";
export function today(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function statusOf(d: Decision, asOf: string): DecisionStatus {
  if (d.state === "resolved") return "Resolved";
  if (d.state === "superseded") return "Superseded";
  if (d.expected.reviewedPastOn && d.expected.reviewedPastOn <= asOf)
    return "Past expected date";
  if (!d.expected.start || !d.expected.end) return "No public date found";
  if (d.expected.end < asOf) return "Past expected date";
  if (d.expected.start <= asOf) return "Due";
  return "Upcoming";
}
export function statusExplanation(d: Decision, asOf: string): string {
  if (d.resolution) return d.resolution.text;
  if (statusOf(d, asOf) === "Past expected date")
    return d.expected.reviewedPastOn ||
      (d.expected.end && d.checked > d.expected.end)
      ? `No resolution located in the sources checked ${dateLabel(d.checked)}. This does not establish a project delay.`
      : `The expected window has passed since the ${dateLabel(d.checked)} check. A new source check is needed.`;
  if (!d.expected.start)
    return d.expected.precision === "unknown"
      ? "No public deadline located in the reviewed sources."
      : `Published timing: ${d.expected.label}. No precise calendar deadline inferred.`;
  return d.kind === "milestone"
    ? "Scheduled milestone; it does not by itself imply a vote or completed action."
    : "Publicly documented decision or decision window; completion is not confirmed.";
}
export function isActive(d: Decision) {
  return d.state === "unresolved";
}
export function addDays(day: string, days: number): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function upcoming(asOf: string, days = 60) {
  const end = addDays(asOf, days);
  return portfolio.decisions
    .filter(
      (d) =>
        isActive(d) &&
        d.expected.start &&
        d.expected.end &&
        d.expected.end >= asOf &&
        d.expected.start <= end,
    )
    .sort((a, b) => a.expected.start!.localeCompare(b.expected.start!));
}
export function stats(asOf: string) {
  const active = portfolio.decisions.filter(isActive);
  return {
    initiatives: portfolio.initiatives.length,
    decisions: active.filter((d) => d.kind === "decision").length,
    milestones: active.filter((d) => d.kind === "milestone").length,
    upcoming: upcoming(asOf).length,
    past: active.filter((d) => statusOf(d, asOf) === "Past expected date")
      .length,
    undated: active.filter((d) => !d.expected.start).length,
    dependencies: portfolio.initiatives.reduce(
      (n, i) => n + i.dependencies.length,
      0,
    ),
  };
}
export function dateLabel(date?: string): string {
  if (!date) return "No public date found";
  if (/^\d{4}-\d{2}$/.test(date))
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${date}-01T12:00:00Z`));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
export function money(amount: number) {
  return amount >= 1e9
    ? `$${Number((amount / 1e9).toFixed(2))}B`
    : amount >= 1e6
      ? `$${Number((amount / 1e6).toFixed(2))}M`
      : `$${amount.toLocaleString("en-US")}`;
}
export function dependencyGroups() {
  return [
    ...new Set(
      portfolio.initiatives.flatMap((i) => i.dependencies.map((d) => d.target)),
    ),
  ]
    .map((target) => ({
      target,
      items: portfolio.initiatives.filter((i) =>
        i.dependencies.some((d) => d.target === target),
      ),
    }))
    .sort(
      (a, b) =>
        b.items.length - a.items.length || a.target.localeCompare(b.target),
    );
}
export function csvCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
export function decisionsCsv(asOf: string) {
  return [
    [
      "ID",
      "Initiative",
      "Kind",
      "Question",
      "Authority",
      "Status",
      "Expected timing",
      "Observed",
      "Last checked",
      "Resolution date",
      "Resolution",
      "Source",
    ]
      .map(csvCell)
      .join(","),
    ...portfolio.decisions.map((d) =>
      [
        d.id,
        initiatives.get(d.initiative)?.name ?? d.initiative,
        d.kind,
        d.question,
        d.authority,
        statusOf(d, asOf),
        d.expected.label,
        d.observed,
        d.checked,
        d.resolution?.date ?? "",
        d.resolution?.text ?? "",
        sources.get(d.resolution?.source ?? d.source)?.url ?? "",
      ]
        .map(csvCell)
        .join(","),
    ),
  ].join("\r\n");
}
export function windowIsPast(w: Window, asOf: string) {
  return (
    (!!w.end && w.end < asOf) ||
    (!!w.reviewedPastOn && w.reviewedPastOn <= asOf)
  );
}
