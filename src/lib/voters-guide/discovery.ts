import type { Candidate, Evidence } from "./types";
import { councilDecisions } from "./council-decisions";
import { decisionAccounts } from "./council-record-accounts";

export const discoveryVersion = "2026-09-19.2";
export type Issue = "housing" | "safety" | "money" | "climate";
export type Question = {
  id: string;
  title: string;
  context: string;
  issue: Issue;
  priority: string;
  decisionId: string;
  optional?: boolean;
  options: { id: string; text: string }[];
};
export const priorities = [
  {
    id: "housing",
    label: "Homes people can afford",
    detail: "Building homes, protecting renters and ownership.",
  },
  {
    id: "homelessness",
    label: "Homelessness",
    detail: "Housing, services and the use of public space.",
  },
  {
    id: "safety",
    label: "Public safety",
    detail: "Who responds to crime and people in crisis.",
  },
  {
    id: "services",
    label: "Household costs & city services",
    detail: "Bills, maintenance and dependable services.",
  },
  {
    id: "transport",
    label: "Getting around",
    detail: "Streets, buses, walking and cycling.",
  },
  {
    id: "climate",
    label: "Climate & environmental health",
    detail: "Climate funding and protection from pollution.",
  },
] as const;
// Ask about the actual decision. A broad campaign goal cannot establish a vote on it.
const choices = [
  { id: "yes", text: "Yes — I would support this proposal." },
  { id: "no", text: "No — I would oppose this proposal." },
  {
    id: "depends",
    text: "It depends — I would need changes or more information.",
  },
];
export const questions: Question[] = [
  {
    id: "homebuyer-income",
    priority: "housing",
    issue: "housing",
    decisionId: "homebuyer-income",
    title:
      "Would you let higher-income buyers qualify for this housing fee break?",
    context:
      "Portland temporarily removed the buyer income limit for certain unsold homes approved before 2026. The homes still have a price limit, and buyers must live in them. Supporters want the homes sold; the question is whether the benefit should stay limited by income.",
    options: choices,
  },
  {
    id: "camp-removal",
    priority: "homelessness",
    issue: "safety",
    decisionId: "camp-removal",
    title:
      "Would you move money from camp removals to this package of services?",
    context:
      "A 2025 proposal would cut about $4.3 million from the camp-removal program as part of a package supporting housing, food, immigration services and city staff. This meant less money for removals. It would not repeal camping restrictions.",
    options: choices,
  },
  {
    id: "oversight-funding",
    priority: "safety",
    issue: "safety",
    decisionId: "oversight-funding",
    title:
      "Would you use expected savings in police oversight to fund police and fire services?",
    context:
      "Council considered $7.68 million for police support, training and fire services. It would use emergency reserves first, then replace that money with expected unspent funds from the police oversight office. The proposal did not abolish oversight; the savings were not yet certain.",
    options: choices,
  },
  {
    id: "water-rates",
    priority: "services",
    issue: "money",
    decisionId: "water-rates",
    title: "Would you approve this increase in water bills?",
    context:
      "The 2026 rate increase raised a typical monthly water charge from $65.57 to $70.89, before sewer and stormwater charges. It provided more revenue for the water system while increasing household costs. Council approved it over objections from some members.",
    options: choices,
  },
  {
    id: "street-fee",
    priority: "transport",
    issue: "climate",
    decisionId: "street-fee",
    title:
      "Would you charge households a monthly fee for street repairs and safety?",
    context:
      "The approved fee starts in January 2027: $12 a month for a typical single-family home or $8.40 per apartment. Three-quarters goes to street maintenance and one-quarter to safety. It adds funding for streets and another charge for households.",
    options: choices,
  },
  {
    id: "zenith-enforcement",
    priority: "climate",
    issue: "climate",
    decisionId: "zenith-enforcement",
    title:
      "Would you let residents sue to enforce Zenith’s pipeline agreement?",
    context:
      "Council considered giving residents a right to sue over violations of the city’s pipeline agreement as a condition of transferring it to a new owner. That would add a way to enforce the agreement. It would not shut down the terminal or decide its air permit.",
    options: choices,
  },
  {
    id: "services-first",
    priority: "services",
    issue: "money",
    decisionId: "services-first",
    optional: true,
    title:
      "Would you use climate-fund interest to help keep other city services running?",
    context:
      "A June 2026 proposal would use about $16 million in climate-fund interest, plus other funds, for parks, unarmed police support, fire services and staff. It would preserve services while leaving less of that interest for climate work. Council split evenly, so it failed.",
    options: choices,
  },
  {
    id: "moda",
    priority: "services",
    issue: "money",
    decisionId: "moda",
    optional: true,
    title:
      "Would you approve the city’s starting terms for Moda Center negotiations?",
    context:
      "Council approved a framework for negotiating a public role in renovating the arena. This opened a path toward a deal with future public costs. It was not the final contract or a vote to pay every renovation cost. Rejecting it did not necessarily mean wanting the team to leave.",
    options: choices,
  },
  {
    id: "psr-framework",
    priority: "safety",
    issue: "safety",
    decisionId: "psr-framework",
    optional: true,
    title:
      "Would you make Portland Street Response a full branch of the emergency system?",
    context:
      "The 2025 plan gave the unarmed crisis-response service a place alongside other emergency responders and called for a community advisory committee. It set a direction for expansion, but did not itself pay for round-the-clock service.",
    options: choices,
  },
];
export function questionCoverage(people: Candidate[], q: Question) {
  const positions = people
    .map((p) => discoveryEvidence(p).positions[q.id])
    .filter(Boolean);
  const stances = new Set(positions.flatMap((p) => p.supported));
  return {
    known: positions.length,
    total: people.length,
    comparable:
      positions.length >= 2 && stances.has("yes") && stances.has("no"),
  };
}
export const experienceOptions = [
  { id: "delivery", label: "Delivering projects or services" },
  { id: "budgets", label: "Working with budgets" },
  { id: "policy", label: "Developing policy or legislation" },
  { id: "community", label: "Organizing or representing communities" },
  { id: "agreements", label: "Building agreements across groups" },
] as const;
export type ExperienceId = (typeof experienceOptions)[number]["id"];
export type ExperiencePreference = { id: ExperienceId; requirement: boolean };
export type PositionEvidence = {
  supported: string[];
  opposed: string[];
  text: string;
  source: Evidence;
  limit: string;
  reason?: { label: string; text: string; source: Evidence };
};
export type ExperienceEvidence = {
  id: ExperienceId;
  text: string;
  source: Evidence;
  status: "Reported experience" | "Public record";
};
// Roles establish relevant experience, not effectiveness. No inferred collaboration scores.
const experienceRows: Record<string, ExperienceId[]> = {
  "ali-beaudoin": ["budgets"],
  "joel-corcoran": ["policy"],
  "patrick-hilton": ["delivery"],
  "tiffany-koyama-lane": ["policy", "community"],
  "keir-legree": ["delivery"],
  "esther-leon": ["delivery"],
  "angelita-morillo": ["policy"],
  "steve-novick": ["policy"],
  "cristal-otero": ["delivery"],
  "kellie-torres": ["policy"],
  "timothy-tj-anderson": ["budgets", "community"],
  "eli-arnold": ["delivery"],
  "olivia-clark": ["policy"],
  "jayne-cronlund": ["delivery"],
  "jamey-evenstar": ["policy"],
  "mitch-green": ["policy"],
  "josh-leake": ["budgets"],
  "jeremy-beausoleil-smith": ["delivery"],
  "eric-zimmerman": ["policy"],
};
export function discoveryEvidence(person: Candidate) {
  const positions: Record<string, PositionEvidence> = {};
  for (const q of questions) {
    const decision = councilDecisions.find((d) => d.id === q.decisionId);
    const vote = decision?.votes[person.name];
    // Absence, no reviewed answer and a general campaign goal are never opposition.
    if (!decision || (vote !== "Yes" && vote !== "No")) continue;
    const account = decisionAccounts[decision.id]?.[person.name];
    positions[q.id] = {
      supported: [vote.toLowerCase()],
      opposed: [vote === "Yes" ? "no" : "yes"],
      text: `Voted ${vote.toLowerCase()} on ${decision.source.date}. ${account?.action ?? decision.summary}`,
      source: decision.source,
      limit: decision.limit,
      reason: account?.reason,
    };
  }
  const experience: ExperienceEvidence[] = (
    experienceRows[person.id] ?? []
  ).map((id) => ({
    id,
    text: person.background,
    source: person.sources[0],
    status: "Reported experience",
  }));
  return { positions, experience };
}
export type Answers = Record<string, string>;
export function assess(
  person: Candidate,
  answers: Answers,
  preferences: ExperiencePreference[],
  field?: Candidate[],
) {
  const evidence = discoveryEvidence(person);
  const selected = questions.filter((q) =>
    q.options.some((o) => o.id === answers[q.id]),
  );
  const aligned = selected.filter(
    (q) =>
      (!field || questionCoverage(field, q).comparable) &&
      evidence.positions[q.id]?.supported.includes(answers[q.id]),
  );
  const different = selected.filter(
    (q) =>
      (!field || questionCoverage(field, q).comparable) &&
      evidence.positions[q.id]?.opposed.includes(answers[q.id]),
  );
  const unknown = selected.filter(
    (q) => !aligned.includes(q) && !different.includes(q),
  );
  const experienceMatches = preferences.filter((p) =>
    evidence.experience.some((e) => e.id === p.id),
  );
  const unmet = preferences.filter(
    (p) => p.requirement && !experienceMatches.includes(p),
  );
  const group = !selected.length
    ? 3
    : aligned.length === selected.length
      ? 0
      : aligned.length
        ? 1
        : different.length
          ? 2
          : 3;
  return {
    person,
    evidence,
    aligned,
    different,
    unknown,
    experienceMatches,
    unmet,
    group,
  };
}
export function orderResults(
  people: Candidate[],
  answers: Answers,
  preferences: ExperiencePreference[],
) {
  return people
    .map((p) => assess(p, answers, preferences, people))
    .sort(
      (a, b) =>
        a.group - b.group ||
        b.experienceMatches.length - a.experienceMatches.length ||
        a.person.name.localeCompare(b.person.name),
    );
}
