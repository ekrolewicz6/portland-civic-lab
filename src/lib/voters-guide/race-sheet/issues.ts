/**
 * The one issue vocabulary for the Race Sheet. Every chip, status line,
 * card heading and share fragment uses these ids and labels. The ids match
 * the keys of `Candidate.analysis.issues` and the retired quiz's `issue`.
 */
export const ISSUE_IDS = ["housing", "safety", "money", "climate"] as const;
export type IssueId = (typeof ISSUE_IDS)[number];

export type Issue = {
  id: IssueId;
  /** Chip label in everyday words. */
  label: string;
  /** Shorter label for 320px screens and tray text. */
  short: string;
  /** The question a reader is really asking. Shown in the chip's (i). */
  question: string;
  /** What to look for while scanning the column; from council-topics.ts. */
  context: string;
  /** Plain noun for the status line: "12 of 21 have a housing position". */
  noun: string;
};

export const issues: Issue[] = [
  {
    id: "housing",
    label: "Rent and homes",
    short: "Homes",
    noun: "housing",
    question: "How would they make housing more affordable?",
    context:
      "Building more homes, protecting tenants and changing ownership are different tools. Look for the mechanism, who benefits and how it would be funded.",
  },
  {
    id: "safety",
    label: "Camps, crime and who responds",
    short: "Safety",
    noun: "safety",
    question: "What balance of enforcement, prevention and care do they propose?",
    context:
      "Support for police and support for unarmed response can coexist. Shelter, treatment and housing commitments are distinct; capacity and implementation matter.",
  },
  {
    id: "money",
    label: "Your bills and taxes",
    short: "Money",
    noun: "taxes and bills",
    question: "Who pays, and what would receive priority?",
    context:
      "A promise of better management is not a costed saving. New services need both startup money and continuing revenue.",
  },
  {
    id: "climate",
    label: "Streets, buses and air",
    short: "Streets",
    noun: "streets and climate",
    question: "Where would they invest, and what would they restrict?",
    context:
      "Compare street space, infrastructure and climate spending. Council sets city policy; regional transit decisions also require partners.",
  },
];

export const issueById = (id: string) => issues.find((i) => i.id === id);
export const isIssueId = (id: string): id is IssueId =>
  (ISSUE_IDS as readonly string[]).includes(id);
