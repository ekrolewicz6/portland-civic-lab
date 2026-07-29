/**
 * The service catalog — what PCL does for a business once it has a profile.
 *
 * Code-owned rather than a database table: services change with deploys, not
 * with data, and engineering controls the set. Same convention as
 * src/lib/site.ts and src/data/questions.ts.
 *
 * Two shapes of work:
 *   application — PCL finds the program, preps the forms, the owner submits.
 *   audit       — no form exists; PCL analyzes the owner's own statements and
 *                 renegotiates. Needs private data, so it comes after trust.
 */

export type ServiceStatus = "active" | "coming_soon";
export type ServiceShape = "application" | "audit";

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  /** What the owner gets, in dollars, when this is real. */
  valueHint: string;
  status: ServiceStatus;
  shape: ServiceShape;
  href?: string;
}

export const SERVICES: Service[] = [
  {
    slug: "funding",
    name: "Funding finder",
    tagline:
      "Grants, tax credits, rebates, and subsidies you qualify for — found, prepped, and tracked.",
    valueHint: "Live now",
    status: "active",
    shape: "application",
  },
  {
    slug: "card-processing",
    name: "Card processing audit",
    tagline:
      "One month's merchant statement, re-bid against better processors. A café doing $900k pays about $27k a year in fees.",
    valueHint: "Typical savings $3–6k/yr",
    status: "coming_soon",
    shape: "audit",
  },
  {
    slug: "insurance",
    name: "Insurance re-bid",
    tagline:
      "General liability, property, and workers' comp put back out to market instead of auto-renewing.",
    valueHint: "Typical savings $1–5k/yr",
    status: "coming_soon",
    shape: "audit",
  },
  {
    slug: "permitting",
    name: "Permits & licensing",
    tagline:
      "Renewals tracked, applications prepared, and the review bottlenecks mapped before you file.",
    valueHint: "Time back, penalties avoided",
    status: "coming_soon",
    shape: "application",
  },
  {
    slug: "financing",
    name: "Better capital",
    tagline:
      "CDFI, Kiva, and SBA options compared against what you're paying now — before a credit card becomes the plan.",
    valueHint: "4–7% instead of 18–28%",
    status: "coming_soon",
    shape: "application",
  },
  {
    slug: "procurement",
    name: "Government contracts",
    tagline:
      "Agencies buy coffee, books, and catering. Set-aside certifications plus the bid pipeline to use them.",
    valueHint: "$50k+/yr in reliable customers",
    status: "coming_soon",
    shape: "application",
  },
  {
    slug: "software",
    name: "Software & banking",
    tagline:
      "Nonprofit, startup, and partner pricing on the tools you already pay full price for.",
    valueHint: "Typical savings $1–3k/yr",
    status: "coming_soon",
    shape: "audit",
  },
  {
    slug: "lease",
    name: "Lease intelligence",
    tagline:
      "Rent is expense #1. PCL's own vacancy and lease-comp data, pointed at your next renewal.",
    valueHint: "The biggest line on the P&L",
    status: "coming_soon",
    shape: "audit",
  },
];

export const ACTIVE_SERVICES = SERVICES.filter((s) => s.status === "active");
export const UPCOMING_SERVICES = SERVICES.filter(
  (s) => s.status === "coming_soon"
);
