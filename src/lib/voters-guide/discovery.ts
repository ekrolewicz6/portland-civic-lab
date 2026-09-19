import type { Candidate, Evidence } from "./types";

export const discoveryVersion = "2026-09-19.1";
export type Issue = "housing" | "safety" | "money" | "climate";
export type Question = {
  id: string;
  title: string;
  context: string;
  issue: Issue;
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
export const questions: Question[] = [
  {
    id: "housing",
    issue: "housing",
    title: "Which housing approach would you most like Council to advance?",
    context:
      "These tools can work together. Choose the approach you most want to see; choosing it does not mean you oppose the others.",
    options: [
      {
        id: "build",
        text: "Make it easier to build homes by changing permit rules, fees or other barriers.",
      },
      {
        id: "public",
        text: "Expand publicly owned or community-owned homes that stay affordable.",
      },
      {
        id: "tenants",
        text: "Strengthen tenant protections and help people stay in their homes.",
      },
    ],
  },
  {
    id: "homelessness",
    issue: "safety",
    title: "What would you most like to see in a response to homelessness?",
    context:
      "Housing, treatment and rules for public space are different parts of the response. A promise also needs available places and services for people to go to.",
    options: [
      {
        id: "care",
        text: "Expand housing and voluntary health or addiction services.",
      },
      {
        id: "rules",
        text: "Pair shelter or services with enforcement of rules for public space.",
      },
      {
        id: "county",
        text: "Give the County primary responsibility for homelessness services.",
      },
    ],
  },
  {
    id: "safety",
    issue: "safety",
    title: "Which part of public safety most needs attention?",
    context:
      "Police, unarmed responders and health workers have different jobs. Supporting one does not establish opposition to another.",
    options: [
      {
        id: "police",
        text: "Increase police staffing, investigations or emergency response capacity.",
      },
      { id: "unarmed", text: "Expand unarmed responses to people in crisis." },
      {
        id: "combined",
        text: "Develop coordinated police and health-worker responses.",
      },
    ],
  },
  {
    id: "services",
    issue: "money",
    title: "What change would you most like to see in city spending?",
    context:
      "Promises to save money need specific examples. Cutting a cost can also reduce a service, so the details matter.",
    options: [
      {
        id: "scrutiny",
        text: "Scrutinize costs, contracts and results before making new commitments.",
      },
      {
        id: "maintenance",
        text: "Put existing services and maintenance ahead of new projects.",
      },
      {
        id: "public",
        text: "Invest more in public services and publicly owned assets.",
      },
    ],
  },
  {
    id: "transport",
    issue: "climate",
    title: "Which transportation approach do you want to explore?",
    context:
      "Street space and funding are limited. Council can change city streets; transit fares and service also require regional partners.",
    options: [
      {
        id: "active",
        text: "Make more room for reliable buses, walking and cycling.",
      },
      {
        id: "fares",
        text: "Work with transit agencies to reduce or remove fares.",
      },
      {
        id: "lanes",
        text: "Oppose the proposed business-access-and-transit lanes on 82nd Avenue.",
      },
    ],
  },
  {
    id: "climate",
    issue: "climate",
    title: "Which climate or environmental action matters most to you?",
    context:
      "Portland can invest in climate work and set rules for major facilities. The Portland Clean Energy Fund, often called PCEF, is also at the center of debates about paying for city infrastructure. Choose one starting point; the full guide covers the other decisions too.",
    options: [
      {
        id: "protect",
        text: "Keep spending tied to climate purposes and protect the fund.",
      },
      {
        id: "water",
        text: "Consider climate-fund money for water infrastructure to reduce pressure on water bills.",
      },
      { id: "oil", text: "Oppose expansion of oil-train operations." },
      { id: "data", text: "Restrict new large data centers." },
    ],
  },
  {
    id: "funding",
    issue: "money",
    title: "How would you prefer to fund city priorities?",
    context:
      "These approaches can coexist. This question identifies a preference, not agreement with every tax or every possible cut.",
    options: [
      {
        id: "audit",
        text: "Look for savings or spending reductions before raising taxes or fees.",
      },
      {
        id: "targeted",
        text: "Consider additional taxes aimed at large businesses, wealth or vacant property.",
      },
      {
        id: "partners",
        text: "Seek private partners, philanthropy or sponsorships for public projects.",
      },
    ],
  },
  {
    id: "budget",
    issue: "money",
    title: "What is your approach to public money for Moda Center?",
    context:
      "Keeping the Trail Blazers and agreeing to a particular public subsidy are separate questions. A candidate may support the team while rejecting a proposed deal.",
    options: [
      { id: "yes", text: "Support public investment in renovating the arena." },
      {
        id: "conditions",
        text: "Consider a deal only with acceptable public costs and protections.",
      },
      {
        id: "no",
        text: "Oppose public spending on arena renovations or retaining the team.",
      },
    ],
  },
];

// Authored positive-support mappings. Unlisted choices are UNKNOWN, never inferred opposition.
// Each mapping uses the exact source and full position from the existing issue brief.
const rows: Record<string, Partial<Record<string, string[]>>> = {
  "ali-beaudoin": { services: ["scrutiny"] },
  "joel-corcoran": { services: ["scrutiny"] },
  "guy-frankenstein": { funding: ["targeted"] },
  "matthias-hallett": {
    housing: ["build"],
    safety: ["police"],
    services: ["scrutiny"],
  },
  "patrick-hilton": {
    housing: ["public"],
    homelessness: ["rules"],
    funding: ["targeted"],
  },
  "larry-kelly": {
    housing: ["build"],
    homelessness: ["care"],
    safety: ["unarmed"],
  },
  "tiffany-koyama-lane": {
    housing: ["public", "tenants"],
    services: ["public"],
    transport: ["active"],
    climate: ["data"],
  },
  "keir-legree": { safety: ["police"] },
  "esther-leon": {
    housing: ["public", "build"],
    homelessness: ["care"],
    safety: ["unarmed"],
    funding: ["targeted"],
    transport: ["active"],
  },
  "darren-mccormick": { safety: ["police"] },
  "angelita-morillo": {
    housing: ["tenants"],
    safety: ["unarmed"],
    services: ["public"],
    transport: ["active"],
    climate: ["oil", "data"],
  },
  "steve-novick": {
    housing: ["build"],
    homelessness: ["rules"],
    safety: ["police", "unarmed"],
    climate: ["water"],
    budget: ["conditions"],
  },
  "cristal-otero": {
    housing: ["public", "tenants"],
    homelessness: ["care"],
    services: ["scrutiny"],
    funding: ["targeted"],
    climate: ["protect"],
  },
  "terry-parker": {
    safety: ["police"],
    services: ["maintenance"],
    transport: ["lanes"],
  },
  "heart-free-pham": { services: ["scrutiny"] },
  "tom-sollitt": { services: ["scrutiny"], funding: ["audit"] },
  "john-sweeney": {
    homelessness: ["county"],
    services: ["maintenance"],
    budget: ["no"],
  },
  "kellie-torres": {
    housing: ["build"],
    safety: ["police"],
    funding: ["partners"],
  },
  "kimberly-tucker": { services: ["scrutiny"] },
  "martin-ward": { housing: ["public"], budget: ["no"] },
  "eli-arnold": {
    housing: ["build"],
    safety: ["police", "combined"],
    transport: ["fares"],
  },
  "olivia-clark": { housing: ["build"], homelessness: ["rules"] },
  "jamey-evenstar": {
    housing: ["public"],
    safety: ["unarmed"],
    transport: ["active", "fares"],
  },
  "mitch-green": {
    housing: ["public", "tenants"],
    services: ["public"],
    climate: ["protect"],
    transport: ["active"],
  },
  "john-mcdonald": { services: ["scrutiny"], budget: ["yes"] },
  "jeremy-beausoleil-smith": {
    housing: ["public", "tenants"],
    safety: ["unarmed"],
    climate: ["data"],
  },
  "eric-zimmerman": {
    homelessness: ["rules"],
    safety: ["police", "unarmed"],
    services: ["maintenance"],
  },
};
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
    const issue = person.analysis?.issues[q.issue];
    const supported = rows[person.id]?.[q.id];
    if (issue && supported)
      positions[q.id] = {
        supported,
        opposed: [],
        text: issue.position,
        source: issue.source,
      };
  }
  // Explicit rejection, not an assumption that alternative approaches conflict.
  if (positions.budget?.supported.includes("no"))
    positions.budget.opposed = ["yes"];
  if (positions.budget?.supported.includes("yes"))
    positions.budget.opposed = ["no"];
  if (positions.transport?.supported.includes("lanes"))
    positions.transport.opposed = [];
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
) {
  const evidence = discoveryEvidence(person);
  const selected = questions.filter((q) =>
    q.options.some((o) => o.id === answers[q.id]),
  );
  const aligned = selected.filter((q) =>
    evidence.positions[q.id]?.supported.includes(answers[q.id]),
  );
  const different = selected.filter((q) =>
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
    .map((p) => assess(p, answers, preferences))
    .sort(
      (a, b) =>
        a.group - b.group ||
        b.experienceMatches.length - a.experienceMatches.length ||
        a.person.name.localeCompare(b.person.name),
    );
}
