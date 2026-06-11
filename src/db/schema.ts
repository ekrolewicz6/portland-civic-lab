import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  date,
  timestamp,
  jsonb,
  doublePrecision,
  boolean,
} from "drizzle-orm/pg-core";

// ── Safety ──────────────────────────────────────────────────────────────

export const safetyCrimeMonthly = pgTable("safety_crime_monthly", {
  id: serial("id").primaryKey(),
  month: date("month").notNull(),
  category: text("category").notNull(),
  offenseType: text("offense_type").notNull(),
  count: integer("count").notNull(),
  ratePer1000: numeric("rate_per_1000"),
  neighborhood: text("neighborhood"),
});

export const safetyGraffitiMonthly = pgTable("safety_graffiti_monthly", {
  id: serial("id").primaryKey(),
  month: date("month").notNull(),
  count: integer("count").notNull(),
});

export const safetyResponseTimes = pgTable("safety_response_times", {
  id: serial("id").primaryKey(),
  month: date("month").notNull(),
  priority: text("priority").notNull(),
  medianMinutes: numeric("median_minutes"),
});

// ── Housing ─────────────────────────────────────────────────────────────

export const housingPermits = pgTable("housing_permits", {
  id: serial("id").primaryKey(),
  permitNum: text("permit_num").unique().notNull(),
  permitType: text("permit_type"),
  projectAddress: text("project_address"),
  valuation: numeric("valuation"),
  applicationDate: date("application_date"),
  issuedDate: date("issued_date"),
  finalDate: date("final_date"),
  status: text("status"),
  processingDays: integer("processing_days"),
});

export const housingPipelineMonthly = pgTable("housing_pipeline_monthly", {
  id: serial("id").primaryKey(),
  month: date("month").notNull(),
  unitsInPipeline: integer("units_in_pipeline"),
  avgProcessingMonths: numeric("avg_processing_months"),
});

export const housingRents = pgTable("housing_rents", {
  id: serial("id").primaryKey(),
  month: date("month").notNull(),
  zipCode: text("zip_code"),
  zori: numeric("zori"),
});

// ── Business ────────────────────────────────────────────────────────────

export const businessLicenses = pgTable("business_licenses", {
  id: serial("id").primaryKey(),
  businessName: text("business_name"),
  address: text("address"),
  naicsCode: text("naics_code"),
  naicsDescription: text("naics_description"),
  dateAdded: date("date_added"),
  lat: doublePrecision("lat"),
  lon: doublePrecision("lon"),
  zipCode: text("zip_code"),
});

export const businessFormationMonthly = pgTable("business_formation_monthly", {
  id: serial("id").primaryKey(),
  month: date("month").notNull(),
  newRegistrations: integer("new_registrations"),
  cancellations: integer("cancellations"),
  netFormation: integer("net_formation"),
});

// ── Downtown ────────────────────────────────────────────────────────────

export const downtownFootTraffic = pgTable("downtown_foot_traffic", {
  id: serial("id").primaryKey(),
  week: date("week").notNull(),
  pctOf2019: numeric("pct_of_2019"),
  dayOfWeek: text("day_of_week"),
});

export const downtownVacancy = pgTable("downtown_vacancy", {
  id: serial("id").primaryKey(),
  quarter: date("quarter").notNull(),
  officeVacancyPct: numeric("office_vacancy_pct"),
  retailVacancyPct: numeric("retail_vacancy_pct"),
});

// ── Migration ───────────────────────────────────────────────────────────

export const migrationWaterMonthly = pgTable("migration_water_monthly", {
  id: serial("id").primaryKey(),
  month: date("month").notNull(),
  activations: integer("activations"),
  deactivations: integer("deactivations"),
  net: integer("net"),
  zipCode: text("zip_code"),
});

export const migrationCensus = pgTable("migration_census", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  population: integer("population"),
  change: integer("change"),
});

// ── Tax ─────────────────────────────────────────────────────────────────

export const taxComparison = pgTable("tax_comparison", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  incomeLevel: integer("income_level").notNull(),
  effectiveRate: numeric("effective_rate"),
  federal: numeric("federal"),
  state: numeric("state"),
  local: numeric("local"),
  other: numeric("other"),
});

// ── Program ─────────────────────────────────────────────────────────────

export const programPcbSummary = pgTable("program_pcb_summary", {
  id: serial("id").primaryKey(),
  asOf: date("as_of").notNull(),
  totalCertified: integer("total_certified"),
  survivalRate1yr: numeric("survival_rate_1yr"),
  jobsCreated: integer("jobs_created"),
  creditsIssued: numeric("credits_issued"),
});

// ── Dashboard Cache ─────────────────────────────────────────────────────

export const dashboardCache = pgTable("dashboard_cache", {
  question: text("question").primaryKey(),
  data: jsonb("data"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── Insights ────────────────────────────────────────────────────────────

export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  question: text("question"),
  text: text("text"),
  severity: text("severity"),
  ruleName: text("rule_name"),
  metricValue: doublePrecision("metric_value"),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// ── Climate Accountability Platform ─────────────────────────────────

export const climateWorkplanActions = pgTable("climate_workplan_actions", {
  id: serial("id").primaryKey(),
  actionId: text("action_id").notNull().unique(),      // "E-1", "T-3", "F-2", etc.
  title: text("title").notNull(),
  sector: text("sector").notNull(),                    // "electricity"|"buildings"|"transportation"|etc.
  category: text("category").notNull(),               // "decarbonization"|"resilience"
  leadBureaus: text("lead_bureaus").array().notNull(), // ["BPS","PBOT"]
  isDeclarationPriority: boolean("is_declaration_priority").notNull().default(false),
  fiscalYear: text("fiscal_year"),                    // "FY 22-25","TBD","Ongoing",etc.
  resourceGap: text("resource_gap"),                  // "Funded","$","$$","$$$","$$$$","$$$$$","N/A","TBD","+"
  isPcefFunded: boolean("is_pcef_funded").notNull().default(false),
  isMultiBureau: boolean("is_multi_bureau").notNull().default(false),
  status: text("status").notNull().default("ongoing"), // "achieved"|"ongoing"|"delayed"
  description: text("description"),
  externalPartners: text("external_partners"),
  cobenefits: text("cobenefits"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const climateActionStatusHistory = pgTable("climate_action_status_history", {
  id: serial("id").primaryKey(),
  actionId: text("action_id").notNull(),
  status: text("status").notNull(),
  statusDate: date("status_date").notNull(),
  narrative: text("narrative"),
  source: text("source"),
});

export const climateBureauScorecard = pgTable("climate_bureau_scorecard", {
  id: serial("id").primaryKey(),
  bureauCode: text("bureau_code").notNull().unique(),
  bureauName: text("bureau_name").notNull(),
  totalActions: integer("total_actions").notNull().default(0),
  achievedActions: integer("achieved_actions").notNull().default(0),
  ongoingActions: integer("ongoing_actions").notNull().default(0),
  delayedActions: integer("delayed_actions").notNull().default(0),
  crossBureauActions: integer("cross_bureau_actions").notNull().default(0),
  pcefFundingReceived: numeric("pcef_funding_received"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const climateFinanceSources = pgTable("climate_finance_sources", {
  id: serial("id").primaryKey(),
  fiscalYear: text("fiscal_year").notNull(),
  source: text("source").notNull(),         // "PCEF"|"General Fund"|"Federal/State"|"Unfunded"
  allocationAmount: numeric("allocation_amount"),
  actionCount: integer("action_count"),
});

export const pcefAllocations = pgTable("pcef_allocations", {
  id: serial("id").primaryKey(),
  fiscalYear: text("fiscal_year").notNull(),
  recipient: text("recipient").notNull(),
  recipientType: text("recipient_type").notNull(), // "bureau"|"community"
  amount: numeric("amount").notNull(),
  programArea: text("program_area"),
});

export const pcefInterestDiversions = pgTable("pcef_interest_diversions", {
  id: serial("id").primaryKey(),
  fiscalYear: text("fiscal_year").notNull().unique(),
  amountDiverted: numeric("amount_diverted").notNull(),
  destination: text("destination"),
  notes: text("notes"),
});

export const climateEmissionsTrajectory = pgTable("climate_emissions_trajectory", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  isTarget: boolean("is_target").notNull().default(false),
  targetType: text("target_type"),                        // "2030_goal"|"2050_goal"|null
  totalMtco2e: numeric("total_mtco2e"),
  electricityMtco2e: numeric("electricity_mtco2e"),
  buildingsMtco2e: numeric("buildings_mtco2e"),
  transportationMtco2e: numeric("transportation_mtco2e"),
  wasteMtco2e: numeric("waste_mtco2e"),
  industryMtco2e: numeric("industry_mtco2e"),
  otherMtco2e: numeric("other_mtco2e"),
  populationThousands: numeric("population_thousands"),
});

// ── Peer-metro economic indicators (for empirical scoring) ──────────────
// Portland + 6 peer MSAs. Loaded by ingest/fetch-peer-metros.ts.

export const metroMetadata = pgTable("metro_metadata", {
  metroCode: text("metro_code").primaryKey(), // BLS area code, e.g. "38900"
  metroName: text("metro_name").notNull(),
  shortName: text("short_name").notNull(),
  stateFips: text("state_fips").notNull(),
  lausSeriesId: text("laus_series_id"), // BLS LAUS unemployment-rate series
  qcewAreaCode: text("qcew_area_code"), // BLS QCEW area code, e.g. "C3890"
  isPortland: boolean("is_portland").default(false),
  population: integer("population"),
  displayOrder: integer("display_order"),
});

export const metroUnemploymentMonthly = pgTable("metro_unemployment_monthly", {
  metroCode: text("metro_code").notNull(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  rate: numeric("rate", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const metroEmploymentQuarterly = pgTable("metro_employment_quarterly", {
  metroCode: text("metro_code").notNull(),
  year: integer("year").notNull(),
  quarter: integer("quarter").notNull(),
  establishments: integer("establishments"),
  employment: integer("employment"),
  avgWeeklyWage: integer("avg_weekly_wage"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const metroBusinessFormationQuarterly = pgTable("metro_business_formation_quarterly", {
  metroCode: text("metro_code").notNull(),
  year: integer("year").notNull(),
  quarter: integer("quarter").notNull(),
  applicationsTotal: integer("applications_total"),
  applicationsHighPropensity: integer("applications_high_propensity"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Annual MSA-level business applications, aggregated from Census BFS county XLSX
// (https://www.census.gov/econ/bfs/xlsx/bfs_county_apps_annual.xlsx).
export const metroBusinessApplicationsAnnual = pgTable("metro_business_applications_annual", {
  metroCode: text("metro_code").notNull(),
  year: integer("year").notNull(),
  applicationsTotal: integer("applications_total").notNull(),
  countiesIncluded: integer("counties_included").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Annual MSA-level ACS 1-year economic indicators (B23025 employment status,
// B19013 median household income). Census API, no key required.
export const metroAcsAnnual = pgTable("metro_acs_annual", {
  metroCode: text("metro_code").notNull(),
  year: integer("year").notNull(),
  population16Plus: integer("population_16_plus"),
  laborForce: integer("labor_force"),
  unemployedAcs: integer("unemployed_acs"),
  medianHouseholdIncome: integer("median_household_income"),
  lfpRate: numeric("lfp_rate", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Annual MSA-level personal income (BEA CAINC1 county data rolled up).
// Total personal income + population + computed per-capita. BEA Regional API.
export const metroPersonalIncomeAnnual = pgTable("metro_personal_income_annual", {
  metroCode: text("metro_code").notNull(),
  year: integer("year").notNull(),
  personalIncomeThousands: numeric("personal_income_thousands", { precision: 18, scale: 0 }),
  population: integer("population"),
  perCapitaIncome: integer("per_capita_income"),
  countiesIncluded: integer("counties_included"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Monthly MSA-level Zillow ZHVI (typical home value), all-homes tier, smoothed/SA.
export const metroZhviMonthly = pgTable("metro_zhvi_monthly", {
  metroCode: text("metro_code").notNull(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  zhvi: numeric("zhvi", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ── PBJ Public Records (Portland Business Journal weekly scrape) ────────
// Source: intelligence/bizjournals-records/insights/output/*.json
// Loaded by ingest/sync-pbj-records.ts. See plans/purrfect-snuggling-island.md.

export const pbjBusinessMonthly = pgTable("pbj_business_monthly", {
  month: date("month").primaryKey(),
  newBusinesses: integer("new_businesses").notNull().default(0),
  bankruptcies: integer("bankruptcies").notNull().default(0),
  lawsuits: integer("lawsuits").notNull().default(0),
  taxLiens: integer("tax_liens").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const pbjRealEstateMonthly = pgTable("pbj_real_estate_monthly", {
  month: date("month").primaryKey(),
  entityBuyers: integer("entity_buyers").notNull().default(0),
  personBuyers: integer("person_buyers").notNull().default(0),
  totalVolumeUsd: numeric("total_volume_usd", { precision: 14, scale: 2 }).notNull().default("0"),
  dealCount: integer("deal_count").notNull().default(0),
  entitySharePct: numeric("entity_share_pct", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const pbjSerialBuyer = pgTable("pbj_serial_buyer", {
  buyerName: text("buyer_name").primaryKey(),
  buyerType: text("buyer_type"), // 'entity' | 'person'
  dealCount: integer("deal_count").notNull(),
  totalVolumeUsd: numeric("total_volume_usd", { precision: 14, scale: 2 }),
  zipCount: integer("zip_count"),
  lastSeenWeek: date("last_seen_week"),
  ingestedAt: timestamp("ingested_at", { withTimezone: true }).defaultNow(),
});

export const pbjDistressEntity = pgTable("pbj_distress_entity", {
  entityName: text("entity_name").primaryKey(),
  categories: text("categories").array().notNull(),
  categoryCount: integer("category_count").notNull(),
  lastSeenWeek: date("last_seen_week"),
  ingestedAt: timestamp("ingested_at", { withTimezone: true }).defaultNow(),
});

export const pbjZipInvestment = pgTable("pbj_zip_investment", {
  zipCode: text("zip_code").primaryKey(),
  permitCount: integer("permit_count").default(0),
  permitValueUsd: numeric("permit_value_usd", { precision: 14, scale: 2 }).default("0"),
  reDealCount: integer("re_deal_count").default(0),
  reVolumeUsd: numeric("re_volume_usd", { precision: 14, scale: 2 }).default("0"),
  newBusinessCount: integer("new_business_count").default(0),
  totalInvestmentUsd: numeric("total_investment_usd", { precision: 14, scale: 2 }).default("0"),
  ingestedAt: timestamp("ingested_at", { withTimezone: true }).defaultNow(),
});

export const pbjTopLawsuit = pgTable("pbj_top_lawsuit", {
  caseId: text("case_id").primaryKey(), // hash(defendant + plaintiff + filed_date + damages)
  defendantName: text("defendant_name").notNull(),
  plaintiffName: text("plaintiff_name"),
  suitType: text("suit_type"),
  damagesUsd: numeric("damages_usd", { precision: 14, scale: 2 }).notNull(),
  filedDate: date("filed_date"),
  ingestedAt: timestamp("ingested_at", { withTimezone: true }).defaultNow(),
});

// ── Progress Reports ───────────────────────────────────────────────────

import { boolean as pgBoolean, pgSchema, primaryKey } from "drizzle-orm/pg-core";

export const contentSchema = pgSchema("content");

export const progressReports = contentSchema.table("progress_reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issueDate: date("issue_date").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  coverImageUrl: text("cover_image_url"),
  published: pgBoolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reportSections = contentSchema.table("report_sections", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id")
    .notNull()
    .references(() => progressReports.id),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  content: text("content").notNull(),
  sectionOrder: integer("section_order").notNull(),
  sectionType: text("section_type").default("article"), // article, data-summary, profile, recommendation
  dataQuery: text("data_query"),
  dataSnapshot: jsonb("data_snapshot"),
});

// ── Performance Portland / ClearImpact mirror ──────────────────────────

export const performanceSchema = pgSchema("performance");

export const performanceIngestRuns = performanceSchema.table("ingest_runs", {
  id: serial("id").primaryKey(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  status: text("status").notNull(),
  parserVersion: text("parser_version").notNull(),
  scorecardsRequested: integer("scorecards_requested").default(0),
  scorecardsLoaded: integer("scorecards_loaded").default(0),
  measureInstancesLoaded: integer("measure_instances_loaded").default(0),
  uniqueMeasuresLoaded: integer("unique_measures_loaded").default(0),
  error: text("error"),
  metadata: jsonb("metadata"),
});

export const performanceRawPayloads = performanceSchema.table("raw_payloads", {
  payloadKey: text("payload_key").primaryKey(),
  payloadKind: text("payload_kind").notNull(),
  sourceUrl: text("source_url").notNull(),
  contentText: text("content_text"),
  contentJson: jsonb("content_json"),
  contentHash: text("content_hash").notNull(),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }).defaultNow().notNull(),
});

export const performanceScorecards = performanceSchema.table("scorecards", {
  scorecardId: text("scorecard_id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  sourceUrl: text("source_url").notNull(),
  rawPayloadKey: text("raw_payload_key"),
  lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true }).defaultNow().notNull(),
  metadata: jsonb("metadata"),
});

export const performanceContainers = performanceSchema.table("containers", {
  containerId: text("container_id").primaryKey(),
  scorecardId: text("scorecard_id").notNull(),
  title: text("title").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  sourceUrl: text("source_url").notNull(),
  rawPayloadKey: text("raw_payload_key"),
  lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true }).defaultNow().notNull(),
  metadata: jsonb("metadata"),
});

export const performanceMeasures = performanceSchema.table("measures", {
  measureId: text("measure_id").primaryKey(),
  valueId: text("value_id").notNull(),
  title: text("title").notNull(),
  metricType: text("metric_type").notNull(),
  latestPeriod: text("latest_period"),
  latestActual: text("latest_actual"),
  latestTrendDirection: text("latest_trend_direction"),
  latestTrendTone: text("latest_trend_tone"),
  latestTrendPeriods: integer("latest_trend_periods"),
  polarity: integer("polarity"),
  sourceUrl: text("source_url").notNull(),
  additionalDataUrl: text("additional_data_url").notNull(),
  chartData: jsonb("chart_data"),
  files: jsonb("files"),
  metadata: jsonb("metadata"),
  latestChangedAt: timestamp("latest_changed_at", { withTimezone: true }),
  lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true }).defaultNow().notNull(),
});

export const performanceMeasureInstances = performanceSchema.table(
  "measure_instances",
  {
    scorecardId: text("scorecard_id").notNull(),
    containerId: text("container_id").notNull(),
    measureId: text("measure_id").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.scorecardId, table.containerId, table.measureId],
    }),
  }),
);

export const performanceMeasureValues = performanceSchema.table("measure_values", {
  id: serial("id").primaryKey(),
  measureId: text("measure_id").notNull(),
  timePeriodId: text("time_period_id"),
  timePeriod: text("time_period").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  actualValue: text("actual_value"),
  targetValue: text("target_value"),
  forecastValue: text("forecast_value"),
  varianceFromTarget: text("variance_from_target"),
  percentage: text("percentage"),
  percentChangeFromPrior: text("percent_change_from_prior"),
  baselineChange: text("baseline_change"),
  currentTrendDirection: integer("current_trend_direction"),
  currentTrendPeriods: integer("current_trend_periods"),
  actualValueColor: jsonb("actual_value_color"),
  rawValue: jsonb("raw_value"),
});

export const performanceMeasureNotes = performanceSchema.table(
  "measure_notes",
  {
    measureId: text("measure_id").notNull(),
    noteKey: text("note_key").notNull(),
    noteTitle: text("note_title").notNull(),
    noteHtml: text("note_html"),
    noteText: text("note_text"),
    links: jsonb("links"),
    lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.measureId, table.noteKey],
    }),
  }),
);

export const performanceMeasureChanges = performanceSchema.table("measure_changes", {
  id: serial("id").primaryKey(),
  runId: integer("run_id"),
  measureId: text("measure_id").notNull(),
  scorecardId: text("scorecard_id"),
  containerId: text("container_id"),
  changeType: text("change_type").notNull(),
  previousPeriod: text("previous_period"),
  previousActual: text("previous_actual"),
  newPeriod: text("new_period"),
  newActual: text("new_actual"),
  changedAt: timestamp("changed_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Membership (WorkOS AuthKit) ─────────────────────────────────────────

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  workosUserId: text("workos_user_id").unique().notNull(),
  email: text("email").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  role: text("role").default("member").notNull(), // member | contributor | steward | admin
  status: text("status").default("active").notNull(), // active | suspended
  neighborhood: text("neighborhood"),
  interests: jsonb("interests"), // string[] of topic interests
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Data flags (member/public data feedback) ────────────────────────────

export const dataFlags = pgTable("data_flags", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  metric: text("metric"),
  message: text("message").notNull(),
  reporterEmail: text("reporter_email"),
  memberId: integer("member_id").references(() => members.id),
  status: text("status").default("new").notNull(), // new | reviewing | resolved | dismissed
  resolutionNote: text("resolution_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});
