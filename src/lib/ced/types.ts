export type Source = {
  id: string;
  label: string;
  url: string;
  kind: "primary" | "reported";
  checked: string;
  note?: string;
};
export type Window = {
  label: string;
  start?: string;
  end?: string;
  /** Editorial review confirms an imprecise past window without inventing a day. */
  reviewedPastOn?: string;
  precision: "day" | "month" | "quarter" | "year" | "window" | "unknown";
};
export type Stage =
  | "Discovery"
  | "Planning"
  | "Decision"
  | "Procurement"
  | "Delivery"
  | "Operating";
export type Domain =
  | "Housing"
  | "Permitting & land use"
  | "Climate"
  | "Economic development"
  | "Arts & civic assets"
  | "Children & families";
export type OutcomeId =
  | "housing-costs"
  | "affordable-housing"
  | "carbon"
  | "quality-jobs"
  | "economic-growth";
export type Decision = {
  id: string;
  initiative: string;
  question: string;
  authority: string;
  kind: "decision" | "milestone";
  expected: Window;
  state: "unresolved" | "resolved" | "superseded";
  observed: string;
  checked: string;
  source: string;
  resolution?: { date: string; text: string; source: string };
  successor?: string;
};
export type Dependency = {
  target: string;
  type: "coordination" | "approval" | "funding" | "delivery" | "sequence";
  description: string;
  basis: "public-record" | "pcl-synthesis";
  source: string;
  status: "required" | "underway" | "unknown" | "satisfied";
};
export type Initiative = {
  id: string;
  name: string;
  domain: Domain;
  owner: string;
  partners: string[];
  stage: Stage;
  objective: string;
  summary: string;
  publicStatus: string;
  progress?: string;
  checked: string;
  reviewNote: string;
  recordSource: string;
  next: { label: string; expected: Window; source: string };
  latest: { date: string; label: string; source: string };
  analysis: string;
  success: string;
  inaction: string;
  unknowns: string[];
  outcomes: {
    id: OutcomeId;
    relationship: string;
    strength: "plausible-contribution" | "indirect";
    source: string;
  }[];
  dependencies: Dependency[];
  sources: string[];
  legacyId?: string;
  conflict?: boolean;
};
export type Funding = {
  id: string;
  initiative: string;
  label: string;
  amount: number;
  type:
    | "allocation"
    | "authorization-ceiling"
    | "program-envelope"
    | "proposal"
    | "estimate";
  payer: "City" | "Regional" | "State" | "Federal" | "Mixed";
  period: string;
  status: string;
  overlap: string;
  source: string;
};
export type Change = {
  id: string;
  initiative: string;
  eventDate: string;
  recorded: string;
  before: string;
  after: string;
  significance: string;
  source: string;
};
export type Portfolio = {
  edition: string;
  sources: Source[];
  initiatives: Initiative[];
  decisions: Decision[];
  funding: Funding[];
  changes: Change[];
};
