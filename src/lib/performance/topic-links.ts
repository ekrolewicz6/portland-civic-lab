import type { PerformanceMetric } from "./types";

export interface PerformanceTopicLink {
  slug: string;
  title: string;
  href: string;
  rationale: string;
}

const TOPIC_LINK_RULES: Array<PerformanceTopicLink & { phrases: string[] }> = [
  {
    slug: "housing",
    title: "Housing Dashboard",
    href: "/dashboard/housing",
    rationale: "Housing supply, affordability, construction, and permitting context.",
    phrases: [
      "housing",
      "affordable",
      "central city housing",
      "construction",
      "permits issued",
      "plans reviewed",
    ],
  },
  {
    slug: "homelessness",
    title: "Homelessness Dashboard",
    href: "/dashboard/homelessness",
    rationale: "Shelter, exits to housing, campsites, materials, and homelessness operations.",
    phrases: ["homeless", "shelter", "campsite", "permanent housing", "materials disposed"],
  },
  {
    slug: "safety",
    title: "Safety Dashboard",
    href: "/dashboard/safety",
    rationale: "911, police, fire, violence prevention, traffic safety, and emergency response.",
    phrases: [
      "911",
      "police",
      "crime",
      "homicide",
      "shooting",
      "fire",
      "street response",
      "traffic deaths",
      "violence",
    ],
  },
  {
    slug: "fiscal",
    title: "Fiscal Dashboard",
    href: "/dashboard/fiscal",
    rationale: "Budget pressure, reserves, audit risk, inflation, and financial condition.",
    phrases: [
      "consumer price index",
      "general fund",
      "reserve",
      "credit rating",
      "audit deficiencies",
      "risk of expiring funding",
      "financial",
      "fund",
    ],
  },
  {
    slug: "climate",
    title: "Climate Dashboard",
    href: "/dashboard/climate",
    rationale: "Carbon reduction, PCEF outcomes, energy, canopy, and climate delivery.",
    phrases: ["carbon", "greenhouse", "pcef", "energy", "tree canopy", "climate"],
  },
  {
    slug: "transportation",
    title: "Transportation Dashboard",
    href: "/dashboard/transportation",
    rationale: "Traffic deaths, commute mode, sidewalks, roads, access, and mobility.",
    phrases: ["traffic", "commute", "sidewalk", "roads", "street", "vehicles"],
  },
  {
    slug: "quality",
    title: "Quality of Life Dashboard",
    href: "/dashboard/quality",
    rationale: "Parks, recreation, graffiti, public space, utilities, and basic services.",
    phrases: [
      "parks",
      "recreation",
      "graffiti",
      "tree",
      "utility",
      "water",
      "wastewater",
      "restroom",
      "public satisfaction",
    ],
  },
  {
    slug: "economy",
    title: "Economy Dashboard",
    href: "/dashboard/economy",
    rationale: "GDP, jobs, traded sectors, small business, and workforce health.",
    phrases: ["gdp", "jobs", "business", "workforce", "traded sector", "economic"],
  },
  {
    slug: "accountability",
    title: "Accountability Dashboard",
    href: "/dashboard/accountability",
    rationale: "Public trust, commitments, service delivery, and government accountability.",
    phrases: ["voter", "public satisfaction", "direction of the city", "311", "service"],
  },
];

export function getPerformanceTopicLinks(metric: PerformanceMetric): PerformanceTopicLink[] {
  const haystack = [
    metric.title,
    metric.metricType,
    metric.latestActual ?? "",
    metric.latestPeriod ?? "",
    ...Object.values(metric.narratives).map((narrative) => narrative?.text ?? ""),
  ]
    .join(" ")
    .toLowerCase();

  return TOPIC_LINK_RULES.filter((rule) =>
    rule.phrases.some((phrase) => haystack.includes(phrase.toLowerCase())),
  ).map(({ phrases: _phrases, ...link }) => link);
}

export function getAllPerformanceTopicRules(): PerformanceTopicLink[] {
  return TOPIC_LINK_RULES.map(({ phrases: _phrases, ...link }) => link);
}
