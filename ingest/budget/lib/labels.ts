/**
 * Label canonicalization and classification.
 *
 * Labels wrap AROUND the value line — see table.ts for how fragments are
 * reattached. By the time a label reaches here it is already rejoined.
 */

export type RevenueClass =
  | "external.taxes"
  | "external.licenses-permits"
  | "external.charges-for-services"
  | "external.intergovernmental"
  | "external.bond-loan-proceeds"
  | "external.misc"
  | "internal.beginning-fund-balance"
  | "internal.fund-transfers-revenue"
  | "internal.interagency"
  | "internal.general-fund-discretionary"
  | "internal.general-fund-overhead";

export type ExpenseClass =
  | "personnel"
  | "external-materials-services"
  | "internal-materials-services"
  | "capital-outlay"
  | "debt-service"
  | "contingency"
  | "fund-transfers-expense"
  | "ending-fund-balance"
  | "reserved-future";

export type AnyClass = RevenueClass | ExpenseClass;

/** Structural rows — subtotals, not leaf objects. */
export const STRUCTURAL = new Set([
  "external revenues",
  "internal revenues",
  "fund expense",
  "bureau expense",
  "unappropriated",
  "grand total",
  "total",
]);

export function normalize(label: string): string {
  return label
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s*-\s*/g, " - ")
    .replace(/[^a-z0-9 &'/.-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Rejoin a wrapped label into one clean string.
 *
 * A trailing hyphen means two different things depending on what precedes it:
 *   "Fund Transfers -" + "Revenue"   -> "Fund Transfers - Revenue"  (separator)
 *   "Sumner-Parkrose-Argay-" + "Columbia" -> "Sumner-Parkrose-Argay-Columbia"
 *                                            (a hyphenated name broken at the hyphen)
 * The tell is whether a space precedes the hyphen.
 */
export function joinFragments(parts: string[]): string {
  const clean = parts.map((p) => p.trim()).filter(Boolean);
  if (!clean.length) return "";

  let out = clean[0];
  for (let i = 1; i < clean.length; i++) {
    if (/(?<!\s)-$/.test(out)) out += clean[i];
    else out += " " + clean[i];
  }
  return out.replace(/\s+/g, " ").replace(/\s+-\s*$/, "").trim();
}

const REVENUE_MAP: [RegExp, RevenueClass][] = [
  [/^beginning fund balance$/, "internal.beginning-fund-balance"],
  [/^fund transfers? - revenue$/, "internal.fund-transfers-revenue"],
  [/^interagency/, "internal.interagency"],
  [/^general fund discretionary$/, "internal.general-fund-discretionary"],
  [/^general fund overhead$/, "internal.general-fund-overhead"],
  [/^tax(es)?\b|property tax|business licen|transient lodging|cannabis tax|gas tax|arts tax/, "external.taxes"],
  [/licen[cs]e|permit/, "external.licenses-permits"],
  [/charges? for service|service charge|rents? (and|&) |fees?$/, "external.charges-for-services"],
  [/intergovernmental|grants?$|federal|state (of oregon|revenue)/, "external.intergovernmental"],
  [/bond|loan|debt proceed|interest/, "external.bond-loan-proceeds"],
  [/miscellaneous|misc\.?$|other/, "external.misc"],
];

const EXPENSE_MAP: [RegExp, ExpenseClass][] = [
  [/^personnel/, "personnel"],
  [/^external materials (and|&) services$/, "external-materials-services"],
  [/^internal materials (and|&) services$/, "internal-materials-services"],
  [/^capital outlay$/, "capital-outlay"],
  [/^debt service/, "debt-service"],
  [/^contingency$/, "contingency"],
  [/^fund transfers? - expense$/, "fund-transfers-expense"],
  [/^ending fund balance$/, "ending-fund-balance"],
  [/^reserved for future expenditure$/, "reserved-future"],
];

export function classifyRevenue(label: string): RevenueClass | null {
  const n = normalize(label);
  if (STRUCTURAL.has(n)) return null;
  for (const [re, cls] of REVENUE_MAP) if (re.test(n)) return cls;
  return null;
}

export function classifyExpense(label: string): ExpenseClass | null {
  const n = normalize(label);
  if (STRUCTURAL.has(n)) return null;
  for (const [re, cls] of EXPENSE_MAP) if (re.test(n)) return cls;
  return null;
}

/** These never count as spending on programs — they're internal or unspent. */
export const INTERNAL_EXPENSE: ReadonlySet<ExpenseClass> = new Set([
  "fund-transfers-expense",
  "ending-fund-balance",
  "reserved-future",
  "contingency",
]);

export const INTERNAL_REVENUE: ReadonlySet<RevenueClass> = new Set([
  "internal.beginning-fund-balance",
  "internal.fund-transfers-revenue",
  "internal.interagency",
  "internal.general-fund-overhead",
]);

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
