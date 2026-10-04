/** Editorial catalog. Update dates describe article revisions, not source-data freshness.
 * Dates were checked against the article/component history on September 29, 2026.
 * Keep these explicit: a rebuild or a shared layout edit must not make a story look new.
 */
export const DIVE_TOPICS = [
  { id: "money", label: "Public money" },
  { id: "housing", label: "Housing & care" },
  { id: "power", label: "Power & politics" },
  { id: "work", label: "Work & economy" },
  { id: "place", label: "Land & climate" },
] as const;
export type DiveTopic = (typeof DIVE_TOPICS)[number]["id"];
export type DiveSort = "updated" | "title";
export interface DeepDive {
  slug: string;
  title: string;
  description: string;
  subject: string;
  topics: DiveTopic[];
  updated: string;
  tool: string;
  keywords: string;
}
export const DEEP_DIVES: DeepDive[] = [
  {
    slug: "small-business", title: "How well does Portland help its small businesses?",
    description: "What Portland’s businesses contribute, how we compare and what better support could achieve for owners and workers.",
    subject: "The state of small business", topics: ["work", "money"], updated: "2026-10-03",
    tool: "Explore 18 visual exhibits", keywords: "small business firms jobs payroll GDP Prosper Portland owners workers AI entrepreneurship peers economy",
  },
  {
    slug: "data-centers", title: "Are Oregon’s data-center tax breaks worth it?",
    description: "Follow the jobs, electricity and public money. Try the numbers behind a real deal.",
    subject: "Energy, water & taxes", topics: ["money", "work", "place"], updated: "2026-09-29",
    tool: "Try the deal calculator", keywords: "cloud servers Google Amazon jobs electricity water incentives schools",
  },
  {
    slug: "campaign-finance", title: "The money behind Portland’s next council.",
    description: "Who gives, where the money comes from and which businesses campaigns pay.",
    subject: "Elections & influence", topics: ["power", "money"], updated: "2026-09-29",
    tool: "Compare the campaigns", keywords: "election voting candidates donors district 3 district 4 ORESTAR contributions governor Kotek Drazan",
  },
  {
    slug: "participatory-budgeting", title: "Should Portland guarantee residents a vote on part of its budget?",
    description: "Understand Measure 26-267, the strongest cases for YES and NO, and the money left for projects.",
    subject: "Resident power & spending", topics: ["money", "power"], updated: "2026-10-02",
    tool: "Explore the budget tradeoffs", keywords: "participatory budgeting PB measure 26-267 ballot election voting residents administration",
  },
  {
    slug: "fpdr", title: "The pension on your property tax bill.",
    description: "What police and fire pensions cost you, why the bill is growing and what could change.",
    subject: "Taxes & retirement", topics: ["money"], updated: "2026-09-19",
    tool: "Calculate your share", keywords: "FPDR police fire disability retirement levy pensions homeowner",
  },
  {
    slug: "maker-economy", title: "The work behind Portland’s handmade city.",
    description: "Meet the projects, makers and businesses behind the things Portland creates.",
    subject: "Making a living", topics: ["work"], updated: "2026-09-15",
    tool: "Explore the maker directory", keywords: "artists craft manufacturing artisans production small business handmade makers",
  },
  {
    slug: "continuum", title: "From a bed to a home: where the system breaks.",
    description: "Follow three journeys through shelter, housing and care to see where people get stuck.",
    subject: "Housing & care", topics: ["housing", "power"], updated: "2026-09-10",
    tool: "Follow a person’s journey", keywords: "homelessness shelter behavioral health mental health treatment beds housing continuum",
  },
  {
    slug: "homelessness", title: "Why Portland struggles to end homelessness.",
    description: "How people lose housing, what it takes to get it back and who is responsible for helping.",
    subject: "Homelessness", topics: ["housing", "money"], updated: "2026-09-10",
    tool: "Explore the housing system", keywords: "homeless shelter rent behavioral health housing first encampments services",
  },
  {
    slug: "pps-budget", title: "What gets a school dollar to a student?",
    description: "Make sense of Portland Public Schools’ budget, staffing cuts and competing demands.",
    subject: "Schools & public money", topics: ["money"], updated: "2026-09-06",
    tool: "Trace school spending", keywords: "PPS schools teachers students education levy bonds classroom district budget",
  },
  {
    slug: "libraries", title: "New libraries. What comes next?",
    description: "The buildings are only the beginning. Explore the choices about access, services and funding.",
    subject: "Libraries & community", topics: ["money", "place"], updated: "2026-09-06",
    tool: "Explore the branch map", keywords: "library books branches Multnomah County knowledge community bond",
  },
  {
    slug: "city-budget", title: "Where does Portland’s budget go?",
    description: "Trace the money from its source to the services it pays for, and see what Council can change.",
    subject: "City finances", topics: ["money", "power"], updated: "2026-09-06",
    tool: "Follow the money", keywords: "city budget bureaus taxes spending funds fiscal 2026 2027 general fund",
  },
  {
    slug: "i-5-rose-quarter", title: "What should happen to I-5 at the Rose Quarter?",
    description: "Weigh the freeway project, the alternatives and what a closure can teach us about traffic.",
    subject: "Transportation & Albina", topics: ["place", "money"], updated: "2026-09-06",
    tool: "Compare the alternatives", keywords: "freeway highway traffic I5 I-5 interstate Albina roads transportation tolling ODOT",
  },
  {
    slug: "lloyd", title: "What will replace Lloyd Center?",
    description: "Separate the redevelopment promises from the requirements, and ask what gets built.",
    subject: "Housing & redevelopment", topics: ["housing", "place"], updated: "2026-09-06",
    tool: "Examine the housing plan", keywords: "Lloyd Center mall ice rink apartments development affordable housing demolition",
  },
  {
    slug: "oregon-economic-development", title: "How should Oregon grow its economy?",
    description: "The case for changing Business Oregon, and what a new agency could actually accomplish.",
    subject: "Jobs & state government", topics: ["work", "power"], updated: "2026-09-06",
    tool: "Compare state approaches", keywords: "Business Oregon prosperity council Kotek commerce jobs economic development agency",
  },
  {
    slug: "portland-growth-politics", title: "Why Portland’s housing goals collide.",
    description: "More homes, affordable rents and stable neighborhoods: where the goals pull in different directions.",
    subject: "Housing & growth", topics: ["housing", "place"], updated: "2026-09-06",
    tool: "Try the housing calculators", keywords: "housing taxes renters landlords zoning density affordability homes infill growth",
  },
  {
    slug: "mass-timber", title: "Can Oregon build more homes with wood?",
    description: "Where factory-built timber housing works, what it costs and why some projects fail.",
    subject: "Housing & industry", topics: ["housing", "work", "place"], updated: "2026-09-06",
    tool: "Test the factory economics", keywords: "mass timber wood factories manufacturing modular housing forests CLT lumber",
  },
  {
    slug: "venue-portfolio", title: "Portland owns the stages. Who pays the bills?",
    description: "The arenas, theaters and other public venues we own, and the choices about their future.",
    subject: "Public buildings & culture", topics: ["money", "place"], updated: "2026-08-26",
    tool: "Explore the venue portfolio", keywords: "venues stadium arena theaters theatre Keller Moda Schnitzer Providence raceway arts culture",
  },
  {
    slug: "who-runs-portland", title: "Who actually runs Portland?",
    description: "Find out which decisions belong to the city, county, Metro, state and other public bodies.",
    subject: "Who has the power", topics: ["power"], updated: "2026-06-18",
    tool: "Explore the power map", keywords: "government governance power authority city county Metro state agencies decisions council",
  },
];
export function diveDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}
export function normalizeDiveTopic(value: string | undefined): DiveTopic | "all" {
  return DIVE_TOPICS.some(t => t.id === value) ? value as DiveTopic : "all";
}
export function selectDeepDives(topic: DiveTopic | "all", query: string, sort: DiveSort) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return DEEP_DIVES.filter(d => (topic === "all" || d.topics.includes(topic)) && terms.every(term =>
    `${d.title} ${d.description} ${d.subject} ${d.keywords}`.toLowerCase().includes(term)
  )).sort((a, b) => sort === "title" ? a.title.localeCompare(b.title, "en") : b.updated.localeCompare(a.updated));
}
