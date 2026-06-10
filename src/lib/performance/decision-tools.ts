import type {
  PerformanceDecisionSuite,
  PerformanceDecisionTool,
  PerformanceMetric,
  PerformanceSnapshot,
  PerformanceToolMetric,
} from "./types";

function metricMatches(metric: PerformanceMetric, phrases: string[]): boolean {
  const title = metric.title.toLowerCase();
  return phrases.some((phrase) => title.includes(phrase.toLowerCase()));
}

function selectMetrics(
  snapshot: PerformanceSnapshot,
  phrases: string[],
  limit = 8,
): PerformanceToolMetric[] {
  const selected: PerformanceToolMetric[] = [];
  const seen = new Set<string>();

  for (const metric of snapshot.metrics) {
    if (!metricMatches(metric, phrases) || seen.has(metric.measureId)) continue;
    seen.add(metric.measureId);
    selected.push({
      measureId: metric.measureId,
      title: metric.title,
      latestPeriod: metric.latestPeriod,
      latestActual: metric.latestActual,
      trendDirection: metric.trend.direction,
    });
    if (selected.length >= limit) break;
  }

  if (selected.length > 0) return selected;

  return snapshot.metrics.slice(0, limit).map((metric) => ({
    measureId: metric.measureId,
    title: metric.title,
    latestPeriod: metric.latestPeriod,
    latestActual: metric.latestActual,
    trendDirection: metric.trend.direction,
  }));
}

function tool(
  input: Omit<PerformanceDecisionTool, "priorityMetrics"> & {
    phrases: string[];
    snapshot: PerformanceSnapshot;
    limit?: number;
  },
): PerformanceDecisionTool {
  return {
    slug: input.slug,
    audience: input.audience,
    title: input.title,
    purpose: input.purpose,
    delivery: input.delivery,
    priorityMetrics: selectMetrics(input.snapshot, input.phrases, input.limit),
    openQuestions: input.openQuestions,
  };
}

export function buildPerformanceDecisionSuite(
  snapshot: PerformanceSnapshot,
): PerformanceDecisionSuite {
  const weakMetrics = snapshot.metrics
    .filter(
      (metric) =>
        metric.values.length === 0 ||
        Object.keys(metric.narratives).length < 4 ||
        !metric.latestPeriod ||
        !metric.latestActual,
    )
    .slice(0, 12)
    .map((metric) => ({
      measureId: metric.measureId,
      title: metric.title,
      latestPeriod: metric.latestPeriod,
      latestActual: metric.latestActual,
      trendDirection: metric.trend.direction,
    }));

  const riskRegister = selectMetrics(snapshot, [
    "911",
    "homicide",
    "shooting",
    "exits to permanent housing",
    "shelter",
    "risk of expiring funding",
    "audit deficiencies",
    "asset",
    "plans reviewed",
    "traffic deaths",
    "utility",
    "satisfaction",
  ]);

  return {
    raymondLee: [
      tool({
        snapshot,
        slug: "executive-performance-brief",
        audience: "raymond_lee",
        title: "Monthly Executive Brief",
        purpose:
          "A concise brief for the City Administrator and DCA team: what improved, what declined, what is stale, and where an owner or action is needed.",
        delivery:
          "Produce a one-page brief with changed metrics, service-area owner, next management question, and links to official source packets.",
        phrases: [
          "311",
          "time to fill",
          "procurement",
          "technology uptime",
          "asset",
          "public satisfaction",
          "direction of the city",
        ],
        openQuestions: [
          "Which metrics changed since the last council work session?",
          "Where is the service-area model visibly improving delivery?",
          "Which stale metrics need an owner before the next quarterly update?",
        ],
      }),
      tool({
        snapshot,
        slug: "reorganization-proof-dashboard",
        audience: "raymond_lee",
        title: "Service-Area Delivery Dashboard",
        purpose:
          "Track whether the service-area model is improving access, cycle time, reliability, and cross-bureau accountability.",
        delivery:
          "Bring 311, hiring, procurement, technology uptime, asset condition, permitting, homelessness operations, and public satisfaction into one review.",
        phrases: [
          "311",
          "time to fill",
          "procurement",
          "uptime",
          "plans reviewed",
          "permits issued",
          "campsite",
          "shelter",
          "public satisfaction",
        ],
        openQuestions: [
          "Which service-area priorities have direct official metrics behind them?",
          "Where does the official scorecard stop before answering the management question?",
        ],
      }),
      tool({
        snapshot,
        slug: "public-narrative-builder",
        audience: "raymond_lee",
        title: "Briefing + Source Builder",
        purpose:
          "Prepare source-backed talking points for Council, media, and internal check-ins without overclaiming beyond the official data.",
        delivery:
          "For each metric, render the latest official value, official Performance Portland notes, source URLs, and a clearly labeled management reading.",
        phrases: ["public satisfaction", "direction of the city", "confidence", "budget", "service"],
        openQuestions: [
          "Which facts can be cited as official city data?",
          "Which statements require interpretation, context, or follow-up before being used publicly?",
        ],
      }),
    ],
    dcas: [
      tool({
        snapshot,
        slug: "dca-service-area-scorecard",
        audience: "dca",
        title: "Service Area Scorecard",
        purpose:
          "Give every DCA a service-area operating view with official metrics, last update, trend status, and bureau/program linkage.",
        delivery:
          "Start with CED, then clone the pattern for City Operations, Public Safety, and Public Works.",
        phrases: ["housing", "permits", "plans reviewed", "PCEF", "GDP", "jobs", "business"],
        openQuestions: [
          "Which measures belong to the DCA versus partner bureaus or external conditions?",
          "Which official metrics are outcome measures rather than workload counts?",
        ],
      }),
      tool({
        snapshot,
        slug: "ced-service-area-cockpit",
        audience: "dca",
        title: "Community & Economic Development Cockpit",
        purpose:
          "Prepare CED leadership for permitting, housing, PCEF, economic development, arts, youth, and spectator-venue questions.",
        delivery:
          "Bind CED metrics to budget lines, council questions, and gap flags before work sessions.",
        phrases: [
          "permits issued",
          "plans reviewed",
          "affordable housing",
          "central city housing",
          "greenhouse",
          "GDP",
          "small business",
          "children",
          "arts",
        ],
        openQuestions: [
          "Where is the scorecard silent on the real bottleneck?",
          "Which CED outcomes are being used to justify budget decisions?",
          "Where do PCEF output measures fail to prove climate impact confidence?",
        ],
      }),
      tool({
        snapshot,
        slug: "data-gap-tracker",
        audience: "dca",
        title: "Data Gap Tracker",
        purpose:
          "Track stale, missing, or insufficient official measures before they become work-session vulnerabilities.",
        delivery:
          "Flag missing narratives, stale periods, no history, unclear source notes, and weak outcome linkage.",
        phrases: ["plans reviewed", "workforce", "quality jobs", "materials", "served", "grants"],
        openQuestions: [
          "Which metrics cannot support an oversight answer yet?",
          "Which gaps should be fixed by a bureau, a DCA, or the City Budget Office?",
        ],
      }),
    ],
    cityCouncil: [
      tool({
        snapshot,
        slug: "budget-hearing-prep",
        audience: "city_council",
        title: "Budget Hearing Prep",
        purpose:
          "For each service area, show top metrics, budget changes, evidence gaps, and source-backed questions.",
        delivery:
          "Generate one-page packets for work sessions and budget hearings from official metrics plus Civic Lab analysis.",
        phrases: [
          "risk of expiring funding",
          "general fund",
          "reserve",
          "audit deficiencies",
          "911",
          "shelter",
          "permits",
          "traffic deaths",
        ],
        openQuestions: [
          "Which budget increase lacks an outcome metric?",
          "Which declining outcome is hidden behind positive workload metrics?",
          "Which one-time funding cliff needs a public explanation?",
        ],
      }),
      tool({
        snapshot,
        slug: "council-question-bank",
        audience: "city_council",
        title: "Council Question Bank",
        purpose:
          "Generate pointed but source-backed oversight questions by service area, bureau, and work-session agenda.",
        delivery:
          "Pair each question with a chart, official narrative excerpt, and source URL.",
        phrases: ["911", "plans reviewed", "public satisfaction", "exits", "asset", "utility"],
        openQuestions: [
          "What should council ask if a bureau cites workload but not outcome?",
          "Which metric trends contradict the public narrative in the budget request?",
        ],
      }),
      tool({
        snapshot,
        slug: "source-packet-export",
        audience: "city_council",
        title: "Source Packet Export",
        purpose:
          "Give council staff one-click packets with charts, narrative tabs, source URLs, and budget citations.",
        delivery:
          "V1 exports normalized CSV and metric detail pages; V2 adds PDF packets with budget citations.",
        phrases: ["budget", "fund", "service", "performance", "target"],
        openQuestions: [
          "Which source packets need budget citations added first?",
          "Should district relevance be added only where source geography is defensible?",
        ],
      }),
    ],
    riskRegister,
    staleOrWeakMetrics: weakMetrics,
  };
}
