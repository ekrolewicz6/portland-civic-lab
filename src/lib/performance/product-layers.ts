import type { PerformanceMetric, PerformanceScorecard, PerformanceSnapshot } from "./types";

export interface PerformanceServiceArea {
  slug: string;
  title: string;
  owner: string;
  scorecardId: string;
  portfolio: string;
  operatingQuestion: string;
  priorityPhrases: string[];
}

export interface PerformanceVertical {
  slug: string;
  title: string;
  owner: string;
  purpose: string;
  phrases: string[];
  budgetQuestions: string[];
}

export interface CouncilHearingArea {
  slug: string;
  title: string;
  hearingPurpose: string;
  metrics: PerformanceMetric[];
  questions: string[];
  hearingIssues: CouncilBudgetIssue[];
  contradictionFlags: string[];
  contradictionChecks: Array<{
    slug: string;
    title: string;
    status: "flagged" | "clear";
    summary: string;
    question: string;
    metrics: PerformanceMetric[];
  }>;
}

export interface CouncilBudgetIssue {
  slug: string;
  serviceAreaSlug: string;
  title: string;
  hearingRecord: string;
  councilSignal: string;
  budgetTest: string;
  question: string;
  likelyAmendment: string;
  sourceGap: string;
  metricIds: string[];
  metricPhrases: string[];
}

export const PERFORMANCE_SERVICE_AREAS: PerformanceServiceArea[] = [
  {
    slug: "city-administrator",
    title: "City Administrator Portfolio",
    owner: "City Administrator",
    scorecardId: "89552",
    portfolio: "Portland and Its Government",
    operatingQuestion:
      "Can the city show that the new government structure is improving trust, access, delivery, and measurable management?",
    priorityPhrases: [
      "public satisfaction",
      "direction of the city",
      "311",
      "homelessness",
      "voter",
      "carbon",
      "sidewalk",
    ],
  },
  {
    slug: "city-operations",
    title: "City Operations",
    owner: "City Operations DCA",
    scorecardId: "90259",
    portfolio: "Internal service delivery, finance, people, procurement, technology, and assets.",
    operatingQuestion:
      "Is the operating backbone of the city becoming faster, more reliable, and more financially defensible?",
    priorityPhrases: [
      "311",
      "time to fill",
      "procurement",
      "uptime",
      "asset",
      "reserve",
      "credit",
      "audit",
    ],
  },
  {
    slug: "community-economic-development",
    title: "Community and Economic Development",
    owner: "Community & Economic Development DCA",
    scorecardId: "89654",
    portfolio: "Housing, permitting, economic development, PCEF, arts, children, and venues.",
    operatingQuestion:
      "Can CED connect spending and program activity to visible housing, permitting, climate, and economic outcomes?",
    priorityPhrases: [
      "permits",
      "plans reviewed",
      "housing",
      "affordable",
      "greenhouse",
      "gdp",
      "jobs",
      "business",
      "arts",
      "children",
    ],
  },
  {
    slug: "public-safety",
    title: "Public Safety",
    owner: "Public Safety DCA",
    scorecardId: "89655",
    portfolio: "911, PPB, PF&R, Portland Street Response, violence prevention, and emergency response.",
    operatingQuestion:
      "Are emergency response, violence prevention, and public-safety outcomes improving at the level council can defend?",
    priorityPhrases: [
      "911",
      "crime",
      "homicide",
      "shooting",
      "police",
      "fire",
      "street response",
      "violence",
    ],
  },
  {
    slug: "public-works",
    title: "Public Works",
    owner: "Public Works DCA",
    scorecardId: "89657",
    portfolio: "Water, sewer, transportation, parks, trees, public spaces, and utility affordability.",
    operatingQuestion:
      "Are core infrastructure, utility, mobility, parks, and asset outcomes improving despite cost and backlog pressure?",
    priorityPhrases: [
      "water",
      "wastewater",
      "traffic",
      "commute",
      "tree",
      "parks",
      "utility",
      "roads",
      "sidewalk",
    ],
  },
];

export const COUNCIL_BUDGET_HEARING_ISSUES: CouncilBudgetIssue[] = [
  {
    slug: "pcef-moda-opportunity-cost",
    serviceAreaSlug: "community-economic-development",
    title: "PCEF / Moda opportunity cost",
    hearingRecord:
      "May 7 CEDSA: Novick pressed whether the administration had identified which PCEF priorities would be displaced by a proposed $75M Moda contribution; the answer did not identify a displacement plan. Morillo, Kanal, and Green raised the weak climate nexus, CIP authority, and opportunity-cost problem.",
    councilSignal:
      "Hard skepticism from Novick, Morillo, Kanal, and Green; procedural/control skepticism from Zimmerman, Koyama Lane, and Avalos; Ryan and Clark were open to an eligibility theory if the city-owned asset has a measurable emissions nexus.",
    budgetTest:
      "Do not let the debate stop at 'can this be PCEF eligible?' Require a specific displacement table: which climate programs, fund balance, interest revenue, or future CIP commitments move if Moda is funded.",
    question:
      "What exact PCEF program, reserve, or future-year CIP commitment would be reduced, delayed, or reclassified to make room for the arena contribution?",
    likelyAmendment:
      "Condition or prohibit any Moda/PCEF allocation until council receives a displacement schedule, emissions-reduction estimate, community-benefits terms, and fund-balance/interest impact.",
    sourceGap:
      "Performance Portland has PCEF greenhouse-gas and citywide carbon metrics, but no official spectator-venue, Moda subsidy, lease, community-benefit, or PCEF-displacement metric.",
    metricIds: ["100716953", "100716941", "100717090", "100717091"],
    metricPhrases: ["greenhouse", "local carbon", "risk of expiring funding", "reserve"],
  },
  {
    slug: "prosper-workforce-downtown-roi",
    serviceAreaSlug: "community-economic-development",
    title: "Prosper Portland workforce cuts and downtown ROI",
    hearingRecord:
      "April 8: Smith and Dunphy flagged workforce development as a protection priority. May 7 CEDSA: Pirtle-Guiney pressed whether Prosper was preserving administrative capacity while reducing grant dollars; Avalos challenged the downtown-first ROI theory; Green asked for evidence behind downtown marketing and Clean & Safe / ESD overlap.",
    councilSignal:
      "Avalos, Green, Koyama Lane, Kanal, and Pirtle-Guiney want equity, measurable return, and direct-service clarity; Ryan, Zimmerman, Clark, and the administration were more receptive to a central-city tax-base recovery argument.",
    budgetTest:
      "Separate city-controlled outputs from regional economic indicators. GDP and traded-sector growth do not prove that a marketing line, IBRN cut, or workforce grant cut is justified.",
    question:
      "For each Prosper reduction, how many workers, small businesses, storefronts, or technical-assistance recipients lose direct service, and what measurable downtown return is expected instead?",
    likelyAmendment:
      "Restore workforce/IBRN/SummerWorks or condition downtown marketing dollars on incremental-activity metrics and Clean & Safe / ESD non-duplication.",
    sourceGap:
      "Official metrics show workforce readiness, small business assistance, quality jobs, GDP, and traded-sector growth, but not IBRN geography, participant loss, downtown-marketing incremental return, or ESD overlap.",
    metricIds: ["100716944", "100716945", "100716939", "100716943", "100716946"],
    metricPhrases: ["workforce", "small business", "quality jobs", "economic growth", "traded sector"],
  },
  {
    slug: "public-safety-alternative-response-restorations",
    serviceAreaSlug: "public-safety",
    title: "PS3, PSR, Ceasefire, and public-safety restorations",
    hearingRecord:
      "April 8: councilors identified Portland Street Response, PS3s, fire station coverage, and violence prevention as public-safety protection priorities. The proposed budget raised follow-up questions about PS3 capacity, PSR aftercare, and the Ceasefire coordinator.",
    councilSignal:
      "Progressive bloc likely pushes restorations; Clark prioritizes police staffing and Impact Reduction; Novick and Green still want evidence that special missions and alternatives produce results.",
    budgetTest:
      "Compare response-time and workload metrics to the claimed service impact of cuts. If calls go unanswered or response times worsen, council needs the operational tradeoff in public.",
    question:
      "Which public-safety calls, response times, violence-prevention contacts, or alternative-response outcomes change if PS3, PSR aftercare, or Ceasefire funding is restored or rejected?",
    likelyAmendment:
      "Restore PS3s, PSR aftercare teams, Ceasefire coordinator, or violence-prevention grants using one-time revenue or offsetting lower-priority public-safety spending.",
    sourceGap:
      "Performance Portland has PSR, PPB, PF&R, gun violence, and response-time metrics, but no clean PS3 metric and no direct Ceasefire/coordinator output measure.",
    metricIds: ["100717843", "100717841", "100717842", "100717850", "101107267", "100717839", "100717844"],
    metricPhrases: ["street response", "violence", "shooting", "police response", "fire response"],
  },
  {
    slug: "new-charter-dca-efficiency-and-access",
    serviceAreaSlug: "city-operations",
    title: "New-charter DCA efficiency and Council access",
    hearingRecord:
      "April 8: Ryan demanded DCA-level efficiency cuts and questioned whether voters expected to pay more for the new form of government. May 7 CEDSA: Avalos and Kanal said councilors lacked direct information access and pressed the administration on staff-contact restrictions.",
    councilSignal:
      "Ryan, Zimmerman, Green, Morillo, Avalos, and Kanal are all probing management-layer cost, information flow, or staff-access problems, though from different ideological angles.",
    budgetTest:
      "If the administration defends added management capacity, it needs measurable improvements in 311, hiring, procurement, technology, asset condition, and council responsiveness.",
    question:
      "What measurable service-area performance improved because of the DCA layer, and what bureau-level offsets or response-time commitments justify the added cost?",
    likelyAmendment:
      "Reverse Assistant City Administrator / management add-backs, require bureau offset plans, or require public response-time standards for council information requests.",
    sourceGap:
      "Official metrics include 311, audit, reserves, assets, vehicles, and technology-adjacent operations, but do not measure council information responsiveness or DCA overhead offsets.",
    metricIds: ["100816783", "100816782", "100716496", "100815661", "100815712", "100814976"],
    metricPhrases: ["311", "audit", "asset", "vehicle", "procurement"],
  },
  {
    slug: "parks-east-portland-youth-promises",
    serviceAreaSlug: "public-works",
    title: "Parks, East Portland, youth, and voter-promise protection",
    hearingRecord:
      "April 8: Pirtle-Guiney, Morillo, Avalos, and Dunphy emphasized Parks Levy promises; Dunphy highlighted East Portland equity, afterschool programs, and Teen Force; Avalos raised East Portland Community Center; Canal opposed pausing the North Portland Aquatic Center.",
    councilSignal:
      "There is broad protection energy around voter promises and youth access, but a public split on North Portland Aquatic Center timing and on where parks reductions should land.",
    budgetTest:
      "Separate access and equity outputs from broad system averages. A citywide parks level-of-service number cannot answer whether East Portland or youth programs are protected.",
    question:
      "Which parks, recreation, swim, youth, and East Portland access metrics change under each proposed reduction, and where is the district-level equity table?",
    likelyAmendment:
      "Protect levy commitments, fund East Portland repairs, restore youth/recreation access, or condition aquatic-center timing on explicit tradeoff tables.",
    sourceGap:
      "Official metrics include parks level of service, recreation access, swim lessons, trees, and sidewalks, but not district-level East Portland impacts, Teen Force, SUN, or Summer Free For All outcomes.",
    metricIds: ["100717014", "100717008", "100717007", "100716994", "100716990", "100717009", "101219351"],
    metricPhrases: ["parks", "recreation", "swim", "tree", "sidewalk"],
  },
  {
    slug: "housing-permitting-and-unbudgeted-funds",
    serviceAreaSlug: "community-economic-development",
    title: "Housing, permitting, and unbudgeted housing funds",
    hearingRecord:
      "April 8: Zimmerman named permitting and housing capacity as core city functions. Subsequent budget discussion flagged large unbudgeted PHB housing funds as a major council deliberation topic. May 7 CEDSA kept CED accountability focused on whether housing/permitting claims connect to measurable outputs.",
    councilSignal:
      "Council needs to know whether housing dollars are committed, unspent, producing units, or stuck in pipeline; permitting metrics should show cycle-time bottlenecks, not only a high-level on-time percentage.",
    budgetTest:
      "Do not let affordable units 'in progress' substitute for completed units or permit plan-review compliance substitute for end-to-end permit-cycle performance.",
    question:
      "How many units are completed, under construction, committed but not started, or delayed, and which permitting bottleneck explains delay?",
    likelyAmendment:
      "Require PHB fund-status disclosure, city-financed project pipeline reporting, and end-to-end permitting cycle metrics before budget adoption.",
    sourceGap:
      "Official metrics cover affordable housing produced/in progress, central city housing, city-financed construction, permits issued, and plans reviewed, but not full fund status or complete permit-cycle detail.",
    metricIds: ["100716948", "100716949", "100716954", "100716951", "100716952", "100716938", "100716947"],
    metricPhrases: ["affordable housing", "central city housing", "permits", "plans reviewed", "households assisted"],
  },
  {
    slug: "arts-children-levy-and-grant-accountability",
    serviceAreaSlug: "community-economic-development",
    title: "Arts, Children's Levy, and grant-accountability tradeoffs",
    hearingRecord:
      "May 7 CEDSA: Arts staff quantified small-grant and sponsorship reductions; the Children's Levy clarified it has no general-fund ask and no decision packages; Ryan praised the levy administrative cap and connected it to workforce/cannabis-fund collaboration.",
    councilSignal:
      "Clark and Dunphy link arts to downtown activation and economic development; Ryan and others want grant dollars to show outcomes and administrative discipline.",
    budgetTest:
      "Separate voter-approved or dedicated funds from general-fund grant programs, and ask whether cuts reduce public-facing output or only internal administration.",
    question:
      "How many grants, youth served, partner dollars, exhibitions, performances, sponsorships, or levy-funded services change under the proposed cut?",
    likelyAmendment:
      "Restore small arts/youth grants, protect dedicated levy funds, or require outcome reporting for grant restorations.",
    sourceGap:
      "Official metrics show community grants, financial support to partners, and youth served, but not specific arts outputs, sponsorship losses, or program-by-program youth outcomes.",
    metricIds: ["101172138", "101172140", "101172136"],
    metricPhrases: ["community grants", "financial support", "youth served", "arts", "children"],
  },
  {
    slug: "one-time-revenue-and-fund-integrity",
    serviceAreaSlug: "city-operations",
    title: "One-time revenue, BLT, reserves, and fund integrity",
    hearingRecord:
      "April 8: Green pointed to possible Trail Blazers business-license-tax revenue as a one-time resource and opposed PCEF as an ad hoc budget plug; several councilors emphasized protecting voter-approved funds such as Parks Levy and P-SEP.",
    councilSignal:
      "Council has to distinguish real one-time resources, restricted funds, fund-balance risk, and voter-approved mandates before using any new money to restore cuts.",
    budgetTest:
      "Every amendment should state whether it uses ongoing revenue, one-time revenue, restricted funds, reserve draw, or delayed spending, and what future-year cliff it creates.",
    question:
      "What is the legally available one-time resource, what restriction applies, and what future-year obligation or reserve risk does the amendment create?",
    likelyAmendment:
      "Recognize discrete one-time revenue only with a source memo, legal restriction note, and list of one-time restorations that do not deepen the structural gap.",
    sourceGap:
      "Official metrics show reserves, general-fund growth, risk of expiring funding, credit rating, CPI, and audit deficiencies, but not BLT taxpayer-specific revenue or legal restriction memos.",
    metricIds: ["100717090", "100717091", "100717087", "100711392", "100715510", "100716496"],
    metricPhrases: ["reserve", "risk of expiring funding", "general fund", "credit rating", "consumer price index", "audit"],
  },
];

export const CED_VERTICALS: PerformanceVertical[] = [
  {
    slug: "permitting-delivery",
    title: "Permitting Delivery",
    owner: "CED service area",
    purpose: "Expose whether permitting throughput is improving or simply being described more optimistically.",
    phrases: ["permits issued", "plans reviewed", "permit"],
    budgetQuestions: [
      "What is the gap between permits issued and plans reviewed?",
      "Which review-cycle detail is absent from the official scorecard?",
      "Which staffing or technology request is tied to an outcome metric?",
    ],
  },
  {
    slug: "housing-delivery",
    title: "Housing Delivery",
    owner: "CED service area",
    purpose: "Connect affordability, production, central city housing, and city-financed construction.",
    phrases: ["housing", "affordable", "central city", "construction"],
    budgetQuestions: [
      "How much production is completed versus in progress?",
      "Which funds are committed but not producing units yet?",
      "What does the scorecard miss about social housing or site-readiness?",
    ],
  },
  {
    slug: "pcef-climate",
    title: "PCEF / Climate Outcomes",
    owner: "CED service area",
    purpose: "Separate PCEF allocation claims from actual greenhouse-gas reduction confidence.",
    phrases: ["pcef", "greenhouse", "carbon"],
    budgetQuestions: [
      "What climate outcome can be measured now versus projected later?",
      "Is any backfill or diversion risk visible in the performance data?",
      "Which grants have dollars out the door but weak outcome evidence?",
    ],
  },
  {
    slug: "economic-development",
    title: "Economic Development",
    owner: "CED service area",
    purpose: "Track whether Prosper and CED activity is linked to quality jobs and business outcomes.",
    phrases: ["gdp", "jobs", "business", "workforce", "traded sector"],
    budgetQuestions: [
      "Which measures are regional conditions versus city-controlled outputs?",
      "Where do small business assistance counts fail to prove business survival or growth?",
      "Are quality jobs improving in a way council can attribute to the program?",
    ],
  },
  {
    slug: "arts-youth",
    title: "Arts / Children / Youth",
    owner: "CED service area",
    purpose: "Connect grants and dollars to public benefit outputs for cultural and youth programs.",
    phrases: ["arts", "children", "youth", "grants"],
    budgetQuestions: [
      "Which grants have output measures and which only report dollars?",
      "How many youth are served, and what outcome follows service?",
      "What should council ask before protecting or expanding these funds?",
    ],
  },
  {
    slug: "spectator-venues-moda",
    title: "Spectator Venues / Moda",
    owner: "CED service area",
    purpose: "Track public subsidy, community benefits, lease/funding status, and PCEF exposure.",
    phrases: ["venue", "spectator", "arena", "lease", "fund"],
    budgetQuestions: [
      "Which public costs are visible in the budget but absent from official performance metrics?",
      "What enforceable community benefit is tied to a measurable output?",
      "Is any climate or PCEF exposure being described without a performance measure?",
    ],
  },
];

export function findScorecard(
  snapshot: PerformanceSnapshot,
  scorecardId: string,
): PerformanceScorecard | undefined {
  return snapshot.scorecards.find((scorecard) => scorecard.scorecardId === scorecardId);
}

export function metricsMatching(
  metrics: PerformanceMetric[],
  phrases: string[],
  limit?: number,
): PerformanceMetric[] {
  const seen = new Set<string>();
  const matches = metrics.filter((metric) => {
    if (seen.has(metric.measureId)) return false;
    const haystack = [
      metric.title,
      metric.metricType,
      metric.latestActual ?? "",
      metric.latestPeriod ?? "",
      ...Object.values(metric.narratives).map((narrative) => narrative?.text ?? ""),
    ]
      .join(" ")
      .toLowerCase();
    const matched = phrases.some((phrase) => haystack.includes(phrase.toLowerCase()));
    if (matched) seen.add(metric.measureId);
    return matched;
  });

  return typeof limit === "number" ? matches.slice(0, limit) : matches;
}

export function serviceAreaMetrics(
  snapshot: PerformanceSnapshot,
  area: PerformanceServiceArea,
): PerformanceMetric[] {
  const scorecard = findScorecard(snapshot, area.scorecardId);
  if (!scorecard) return [];
  return scorecard.containers.flatMap((container) => container.metrics);
}

export function priorityServiceAreaMetrics(
  snapshot: PerformanceSnapshot,
  area: PerformanceServiceArea,
  limit = 10,
): PerformanceMetric[] {
  const allMetrics = serviceAreaMetrics(snapshot, area);
  const matched = metricsMatching(allMetrics, area.priorityPhrases, limit);
  if (matched.length > 0) return matched;

  return allMetrics
    .slice()
    .sort((a, b) => {
      const aNarratives = Object.keys(a.narratives).length;
      const bNarratives = Object.keys(b.narratives).length;
      return bNarratives - aNarratives;
    })
    .slice(0, limit);
}

export function issueMetrics(
  snapshot: PerformanceSnapshot,
  issue: CouncilBudgetIssue,
  limit = 6,
): PerformanceMetric[] {
  const byId = new Map(snapshot.metrics.map((metric) => [metric.measureId, metric]));
  const exactMatches = issue.metricIds
    .map((id) => byId.get(id))
    .filter((metric): metric is PerformanceMetric => Boolean(metric));
  const phraseMatches = metricsMatching(snapshot.metrics, issue.metricPhrases, limit);

  const seen = new Set<string>();
  return [...exactMatches, ...phraseMatches].filter((metric) => {
    if (seen.has(metric.measureId)) return false;
    seen.add(metric.measureId);
    return true;
  }).slice(0, limit);
}

export function councilIssuesForServiceArea(serviceAreaSlug: string): CouncilBudgetIssue[] {
  return COUNCIL_BUDGET_HEARING_ISSUES.filter(
    (issue) => issue.serviceAreaSlug === serviceAreaSlug,
  );
}

export function buildCouncilHearingAreas(snapshot: PerformanceSnapshot): CouncilHearingArea[] {
  return PERFORMANCE_SERVICE_AREAS.filter((area) => area.slug !== "city-administrator").map(
    (area) => {
      const metrics = priorityServiceAreaMetrics(snapshot, area, 8);
      const decliningMetrics = metrics.filter((metric) => metric.trend.tone === "negative");
      const weakNarrativeMetrics = metrics.filter((metric) => Object.keys(metric.narratives).length < 4);
      const declining = decliningMetrics.length;
      const weakNarratives = weakNarrativeMetrics.length;
      const hearingIssues = councilIssuesForServiceArea(area.slug);
      const issueQuestions = hearingIssues.slice(0, 2).map((issue) => issue.question);

      return {
        slug: area.slug,
        title: area.title,
        hearingPurpose: area.operatingQuestion,
        metrics,
        questions: [
          issueQuestions[0] ??
            `Which ${area.title} budget requests are tied to these official performance measures?`,
          issueQuestions[1] ?? `Which measures are outcomes versus workload counts?`,
          `What would change in these metrics if council adopted or rejected a proposed amendment?`,
        ],
        hearingIssues,
        contradictionFlags: [
          declining > 0
            ? `${declining} priority metrics are directionally negative and need explanation.`
            : "No priority metrics are flagged as directionally negative in the current parser view.",
          weakNarratives > 0
            ? `${weakNarratives} priority metrics lack complete narrative coverage.`
            : "Priority metrics have complete official narrative tabs.",
        ],
        contradictionChecks: [
          {
            slug: "negative-priority-metrics",
            title: "Negative movement in priority metrics",
            status: declining > 0 ? "flagged" : "clear",
            summary:
              declining > 0
                ? `${declining} priority ${declining === 1 ? "metric is" : "metrics are"} moving in the wrong direction or marked as negative.`
                : "No selected priority metrics are currently marked as negative.",
            question:
              "What budget action, management intervention, or external condition explains the direction of travel?",
            metrics: decliningMetrics,
          },
          {
            slug: "missing-official-narrative",
            title: "Missing official explanation",
            status: weakNarratives > 0 ? "flagged" : "clear",
            summary:
              weakNarratives > 0
                ? `${weakNarratives} priority ${weakNarratives === 1 ? "metric lacks" : "metrics lack"} the full four official explanation tabs.`
                : "Selected priority metrics have complete official narrative tabs.",
            question:
              "If council is being asked to fund or defend this area, what explanation is missing from the official scorecard?",
            metrics: weakNarrativeMetrics,
          },
        ],
      };
    },
  );
}
