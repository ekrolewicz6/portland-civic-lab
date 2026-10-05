import {
  portfolio,
  sources as sourceIndex,
  MONEY_LABELS,
  money,
} from "@/lib/ced/model";
/**
 * Compatibility types for the CED Portfolio Map. Current records live in lib/ced/portfolio.json.
 *
 * Every fact here must trace to a public source listed in `sources` —
 * council records, portland.gov, prosperportland.us, or mainstream
 * reporting of on-record facts. This is a demonstration built from
 * public records, not authoritative City status. No editorial risk
 * ratings: stages and dates only, as documented.
 */

export type InitiativeCategory =
  | "housing"
  | "permitting"
  | "climate"
  | "economic-development"
  | "arts-venues"
  | "major-projects";

export type InitiativeStage =
  | "planning"
  | "decision-pending"
  | "in-negotiation"
  | "implementation"
  | "operational";

export interface InitiativeSource {
  label: string;
  url: string;
}

export interface InitiativeDecision {
  what: string;
  who: string;
  /** Documented date or window; omit when not on the record. */
  due?: string;
}

export interface CedInitiative {
  slug: string;
  title: string;
  /** Owning bureau or office. */
  owner: string;
  category: InitiativeCategory;
  summary: string;
  stage: InitiativeStage;
  /** Documented public dollar figures, with context. */
  funding?: string;
  nextMilestone?: { label: string; date: string };
  decisionsPending: InitiativeDecision[];
  dependencies: string[];
  lastAction?: { date: string; what: string };
  sources: InitiativeSource[];
}

export const CATEGORY_LABELS: Record<InitiativeCategory, string> = {
  housing: "Housing",
  permitting: "Permitting",
  climate: "Climate",
  "economic-development": "Economic development",
  "arts-venues": "Arts & venues",
  "major-projects": "Major projects",
};

export const STAGE_LABELS: Record<InitiativeStage, string> = {
  planning: "Planning",
  "decision-pending": "Decision pending",
  "in-negotiation": "In negotiation",
  implementation: "Implementation",
  operational: "Operational",
};

/** Compatibility projection for existing venue embeds; there is one current dataset. */
export const CED_INITIATIVES: CedInitiative[] = portfolio.initiatives.map(
  (i) => ({
    slug: i.id,
    title: i.name,
    owner: i.owner,
    category: (
      {
        Housing: "housing",
        "Permitting & land use": "permitting",
        Climate: "climate",
        "Economic development": "economic-development",
        "Arts & civic assets": "arts-venues",
        "Children & families": "arts-venues",
      } as const
    )[i.domain],
    summary: i.summary,
    stage: (
      {
        Discovery: "planning",
        Planning: "planning",
        Decision: "decision-pending",
        Procurement: "implementation",
        Delivery: "implementation",
        Operating: "operational",
      } as const
    )[i.stage],
    funding:
      portfolio.funding
        .filter((f) => f.initiative === i.id)
        .map(
          (f) => `${money(f.amount)} · ${MONEY_LABELS[f.type]} · ${f.status}`,
        )
        .join("; ") || undefined,
    nextMilestone: { label: i.next.label, date: i.next.expected.label },
    decisionsPending: portfolio.decisions
      .filter(
        (d) =>
          d.initiative === i.id &&
          d.state === "unresolved" &&
          d.kind === "decision",
      )
      .map((d) => ({
        what: d.question,
        who: d.authority,
        due: d.expected.label,
      })),
    dependencies: i.dependencies.map((d) => d.description),
    lastAction: { date: i.latest.date, what: i.latest.label },
    sources: i.sources.flatMap((id) => {
      const s = sourceIndex.get(id);
      return s ? [{ label: s.label, url: s.url }] : [];
    }),
  }),
);
/**
 * Sort key for a documented due value. ISO-prefixed dates ("2026-09-01",
 * "2026-08") sort chronologically; anything else ("Fall 2026", "TBD",
 * undefined) sorts after them, in original order.
 */
function dueSortKey(due?: string): number {
  if (!due) return Number.MAX_SAFE_INTEGER;
  const m = due.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return (
    Number(m[1]) * 10000 + Number(m[2] ?? "12") * 100 + Number(m[3] ?? "31")
  );
}

/** All documented pending decisions across the portfolio, dated ones first. */
export function pendingDecisions(
  initiatives: CedInitiative[] = CED_INITIATIVES,
): Array<InitiativeDecision & { initiative: CedInitiative }> {
  const rows = initiatives.flatMap((initiative) =>
    initiative.decisionsPending.map((d) => ({ ...d, initiative })),
  );
  return rows.sort((a, b) => dueSortKey(a.due) - dueSortKey(b.due));
}

export function initiativesByCategory(
  initiatives: CedInitiative[] = CED_INITIATIVES,
): Array<{
  category: InitiativeCategory;
  label: string;
  items: CedInitiative[];
}> {
  const order: InitiativeCategory[] = [
    "housing",
    "permitting",
    "climate",
    "economic-development",
    "arts-venues",
    "major-projects",
  ];
  return order
    .map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      items: initiatives.filter((i) => i.category === category),
    }))
    .filter((g) => g.items.length > 0);
}
