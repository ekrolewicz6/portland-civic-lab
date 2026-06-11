import { pgTable, pgSchema, index, unique, serial, text, date, integer, numeric, boolean, timestamp, bigserial, jsonb, bigint, foreignKey, uniqueIndex, doublePrecision, smallint, uuid, real, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const accountability = pgSchema("accountability");
export const business = pgSchema("business");
export const content = pgSchema("content");
export const downtown = pgSchema("downtown");
export const economy = pgSchema("economy");
export const education = pgSchema("education");
export const homelessness = pgSchema("homelessness");
export const housing = pgSchema("housing");
export const environment = pgSchema("environment");
export const migration = pgSchema("migration");
export const reference = pgSchema("reference");
export const quality = pgSchema("quality");
export const realEstate = pgSchema("real_estate");
export const safety = pgSchema("safety");
export const transportation = pgSchema("transportation");
export const fiscal = pgSchema("fiscal");
export const performance = pgSchema("performance");
export const availabilityStatus = pgEnum("availability_status", ['open', 'limited', 'full', 'unknown'])
export const category = pgEnum("category", ['shelter', 'treatment'])
export const facilityType = pgEnum("facility_type", ['congregate', 'motel', 'village', 'family', 'youth', 'overnight_emergency', 'behavioral_health', 'sud_residential', 'sud_residential_detox', 'detox', 'otp', 'php_iop', 'outpatient'])
export const matchStatus = pgEnum("match_status", ['suggested', 'held', 'confirmed', 'declined', 'fell_through'])
export const packetStatus = pgEnum("packet_status", ['draft', 'sent', 'received', 'expired', 'revoked'])
export const requestStatus = pgEnum("request_status", ['new', 'matched', 'held', 'confirmed', 'placed', 'fell_through', 'closed'])
export const requesterRole = pgEnum("requester_role", ['outreach', 'emergency_dept', 'jail_release', 'case_manager', 'self', 'family', 'other'])
export const updateMethod = pgEnum("update_method", ['self_report', 'feed', 'manual', 'import'])
export const workerStatus = pgEnum("worker_status", ['pending', 'verified', 'suspended'])


export const ballotMeasuresInAccountability = accountability.table("ballot_measures", {
	id: serial().primaryKey().notNull(),
	measureNumber: text("measure_number").notNull(),
	measureTitle: text("measure_title").notNull(),
	electionDate: date("election_date").notNull(),
	jurisdiction: text().default('Multnomah County'),
	yesVotes: integer("yes_votes"),
	noVotes: integer("no_votes"),
	yesPct: numeric("yes_pct", { precision: 5, scale:  2 }),
	passed: boolean().notNull(),
	annualRevenueEstimate: numeric("annual_revenue_estimate", { precision: 14, scale:  2 }),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_ballot_measure_number").using("btree", table.measureNumber.asc().nullsLast().op("text_ops")),
	unique("ballot_measures_measure_number_election_date_key").on(table.measureNumber, table.electionDate),
]);

export const electedOfficialsInAccountability = accountability.table("elected_officials", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	title: text().notNull(),
	district: integer(),
	termStart: date("term_start"),
	termEnd: date("term_end"),
	email: text(),
	party: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_officials_district").using("btree", table.district.asc().nullsLast().op("int4_ops")),
	unique("elected_officials_name_title_term_start_key").on(table.name, table.title, table.termStart),
]);

export const blsEmploymentInBusiness = business.table("bls_employment", {
	id: serial().primaryKey().notNull(),
	seriesId: text("series_id").notNull(),
	seriesName: text("series_name"),
	year: integer().notNull(),
	period: text().notNull(),
	periodName: text("period_name"),
	value: numeric({ precision: 12, scale:  2 }),
	footnotes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("bls_employment_series_id_year_period_key").on(table.seriesId, table.year, table.period),
]);

export const blsEmploymentSeriesInBusiness = business.table("bls_employment_series", {
	id: serial().primaryKey().notNull(),
	seriesId: text("series_id").notNull(),
	seriesName: text("series_name").notNull(),
	year: integer().notNull(),
	period: text().notNull(),
	periodName: text("period_name"),
	value: numeric({ precision: 12, scale:  1 }).notNull(),
	footnotes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_bls_series_name").using("btree", table.seriesName.asc().nullsLast().op("text_ops")),
	index("idx_bls_series_year").using("btree", table.seriesId.asc().nullsLast().op("int4_ops"), table.year.asc().nullsLast().op("int4_ops")),
	unique("bls_employment_series_series_id_year_period_key").on(table.seriesId, table.year, table.period),
]);

export const censusCbpInBusiness = business.table("census_cbp", {
	id: serial().primaryKey().notNull(),
	source: text().notNull(),
	year: integer().notNull(),
	countyFips: text("county_fips").notNull(),
	stateFips: text("state_fips").notNull(),
	establishments: integer().notNull(),
	sizeLabel: text("size_label"),
	sizeCode: text("size_code"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("census_cbp_year_county_fips_state_fips_size_code_key").on(table.year, table.countyFips, table.stateFips, table.sizeCode),
]);

export const civicappsLicensesInBusiness = business.table("civicapps_licenses", {
	licenseId: bigserial("license_id", { mode: "bigint" }).primaryKey().notNull(),
	businessName: text("business_name").notNull(),
	address: text(),
	naicsCode: text("naics_code"),
	naicsDescription: text("naics_description"),
	dateAdded: date("date_added"),
	latitude: numeric({ precision: 10, scale:  7 }),
	longitude: numeric({ precision: 10, scale:  7 }),
	apiId: text("api_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("civicapps_licenses_api_id_key").on(table.apiId),
]);

export const oregonRegistrationsInBusiness = business.table("oregon_registrations", {
	id: serial().primaryKey().notNull(),
	registryNumber: text("registry_number"),
	businessName: text("business_name"),
	entityType: text("entity_type"),
	registryDate: date("registry_date"),
	city: text(),
	state: text(),
	zipCode: text("zip_code"),
	rawData: jsonb("raw_data"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("oregon_registrations_registry_number_key").on(table.registryNumber),
]);

export const oregonSosActiveInBusiness = business.table("oregon_sos_active", {
	id: serial().primaryKey().notNull(),
	registryNumber: text("registry_number").notNull(),
	businessName: text("business_name"),
	entityType: text("entity_type"),
	registryDate: date("registry_date"),
	address: text(),
	city: text(),
	state: text(),
	zip: text(),
	jurisdiction: text(),
	rawData: jsonb("raw_data"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("oregon_sos_active_registry_number_key").on(table.registryNumber),
]);

export const oregonSosAllActiveInBusiness = business.table("oregon_sos_all_active", {
	id: serial().primaryKey().notNull(),
	registryNumber: text("registry_number"),
	businessName: text("business_name").notNull(),
	entityType: text("entity_type"),
	registryDate: timestamp("registry_date", { withTimezone: true, mode: 'string' }),
	associatedNameType: text("associated_name_type"),
	firstName: text("first_name"),
	middleName: text("middle_name"),
	lastName: text("last_name"),
	suffix: text(),
	entityOfRecordRegNumber: text("entity_of_record_reg_number"),
	entityOfRecordName: text("entity_of_record_name"),
	address: text(),
	addressContinued: text("address_continued"),
	city: text(),
	state: text(),
	zip: text(),
	jurisdiction: text(),
	businessDetails: text("business_details"),
	notOfRecordEntity: text("not_of_record_entity"),
}, (table) => [
	index("idx_sos_all_date").using("btree", table.registryDate.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_sos_all_entity").using("btree", table.entityType.asc().nullsLast().op("text_ops")),
	index("idx_sos_all_name_btree").using("btree", table.businessName.asc().nullsLast().op("text_ops")),
]);

export const oregonSosEntityTypesInBusiness = business.table("oregon_sos_entity_types", {
	entityType: text("entity_type").primaryKey().notNull(),
	count: integer().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const oregonSosNewMonthlyInBusiness = business.table("oregon_sos_new_monthly", {
	id: serial().primaryKey().notNull(),
	registryNumber: text("registry_number").notNull(),
	businessName: text("business_name"),
	entityType: text("entity_type"),
	registryDate: date("registry_date"),
	address: text(),
	city: text(),
	state: text(),
	zip: text(),
	rawData: jsonb("raw_data"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("oregon_sos_new_monthly_registry_number_key").on(table.registryNumber),
]);

export const oregonSosStatsInBusiness = business.table("oregon_sos_stats", {
	key: text().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	value: bigint({ mode: "number" }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const promisesInAccountability = accountability.table("promises", {
	id: serial().primaryKey().notNull(),
	promiseId: text("promise_id").notNull(),
	speaker: text().notNull(),
	speech: text().notNull(),
	speechDate: date("speech_date").notNull(),
	category: text().notNull(),
	claimText: text("claim_text").notNull(),
	isDirectQuote: boolean("is_direct_quote").default(true).notNull(),
	claimType: text("claim_type").default('metric').notNull(),
	verificationStatus: text("verification_status").default('in_progress').notNull(),
	verificationNotes: text("verification_notes"),
	verifiedAt: timestamp("verified_at", { withTimezone: true, mode: 'string' }),
	verifiedBy: text("verified_by"),
	metricTarget: numeric("metric_target"),
	metricActual: numeric("metric_actual"),
	metricUnit: text("metric_unit"),
	metricDirection: text("metric_direction"),
	baselineValue: numeric("baseline_value"),
	baselineDate: date("baseline_date"),
	targetDate: date("target_date"),
	dataSourceTable: text("data_source_table"),
	dataSourceQuery: text("data_source_query"),
	dataSourceName: text("data_source_name"),
	dataNeeded: text("data_needed"),
	displayOrder: integer("display_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("promises_promise_id_key").on(table.promiseId),
]);

export const oregonSosYearlyInBusiness = business.table("oregon_sos_yearly", {
	year: integer().primaryKey().notNull(),
	regCount: integer("reg_count").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const newsContextInContent = content.table("news_context", {
	id: serial().primaryKey().notNull(),
	category: text().notNull(),
	headline: text().notNull(),
	source: text().notNull(),
	url: text().notNull(),
	publishedDate: date("published_date").notNull(),
	summary: text().notNull(),
	relevance: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_news_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
]);

export const progressReportsInContent = content.table("progress_reports", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	issueDate: date("issue_date").notNull(),
	slug: text().notNull(),
	summary: text(),
	coverImageUrl: text("cover_image_url"),
	published: boolean().default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("progress_reports_slug_key").on(table.slug),
]);

export const pbotRequestsInDowntown = downtown.table("pbot_requests", {
	id: serial().primaryKey().notNull(),
	itemId: text("item_id").notNull(),
	workStartDate: date("work_start_date"),
	workEndDate: date("work_end_date"),
	daysOfWeek: text("days_of_week"),
	sidewalkClosure: text("sidewalk_closure"),
	streetClosure: text("street_closure"),
	bikeLaneClosure: text("bike_lane_closure"),
	laneClosureCount: text("lane_closure_count"),
	objectId: integer("object_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("pbot_requests_item_id_key").on(table.itemId),
]);

export const trimetRoutesInDowntown = downtown.table("trimet_routes", {
	routeId: text("route_id").primaryKey().notNull(),
	routeName: text("route_name").notNull(),
	routeType: text("route_type").notNull(),
	routeTypeName: text("route_type_name"),
	routeColor: text("route_color"),
	routeTextColor: text("route_text_color"),
	routeUrl: text("route_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const trimetStopsInDowntown = downtown.table("trimet_stops", {
	stopId: text("stop_id").primaryKey().notNull(),
	stopName: text("stop_name").notNull(),
	lat: numeric({ precision: 10, scale:  7 }),
	lon: numeric({ precision: 10, scale:  7 }),
	stopCode: text("stop_code"),
	zoneId: text("zone_id"),
	locationType: text("location_type"),
	routeIds: text("route_ids").array(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const vacancyRealInDowntown = downtown.table("vacancy_real", {
	id: serial().primaryKey().notNull(),
	quarter: date().notNull(),
	source: text().notNull(),
	officeVacancyPct: numeric("office_vacancy_pct", { precision: 5, scale:  2 }),
	retailVacancyPct: numeric("retail_vacancy_pct", { precision: 5, scale:  2 }),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("vacancy_real_quarter_source_key").on(table.quarter, table.source),
]);

export const qcewDetailedInEconomy = economy.table("qcew_detailed", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	quarter: integer().notNull(),
	industryCode: text("industry_code").notNull(),
	industryTitle: text("industry_title").notNull(),
	naicsLevel: integer("naics_level").notNull(),
	parentSupersector: text("parent_supersector"),
	establishments: integer(),
	month1Employment: integer("month1_employment"),
	month2Employment: integer("month2_employment"),
	month3Employment: integer("month3_employment"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalQuarterlyWages: bigint("total_quarterly_wages", { mode: "number" }),
	avgWeeklyWage: integer("avg_weekly_wage"),
	avgEstablishmentSize: numeric("avg_establishment_size", { precision: 8, scale:  1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_qcew_detail_code").using("btree", table.industryCode.asc().nullsLast().op("text_ops")),
	index("idx_qcew_detail_yq").using("btree", table.year.asc().nullsLast().op("int4_ops"), table.quarter.asc().nullsLast().op("int4_ops")),
	unique("qcew_detailed_year_quarter_industry_code_key").on(table.year, table.quarter, table.industryCode),
]);

export const qcewEmploymentInEconomy = economy.table("qcew_employment", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	quarter: integer().notNull(),
	industryCode: text("industry_code").notNull(),
	industryTitle: text("industry_title").notNull(),
	ownCode: integer("own_code").default(5),
	establishments: integer(),
	month1Employment: integer("month1_employment"),
	month2Employment: integer("month2_employment"),
	month3Employment: integer("month3_employment"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalQuarterlyWages: bigint("total_quarterly_wages", { mode: "number" }),
	avgWeeklyWage: integer("avg_weekly_wage"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_qcew_year_qtr").using("btree", table.year.asc().nullsLast().op("int4_ops"), table.quarter.asc().nullsLast().op("int4_ops")),
	unique("qcew_employment_year_quarter_industry_code_own_code_key").on(table.year, table.quarter, table.industryCode, table.ownCode),
]);

export const classSizeInEducation = education.table("class_size", {
	id: serial().primaryKey().notNull(),
	schoolYear: text("school_year").notNull(),
	districtName: text("district_name").default('Portland SD 1J'),
	avgClassSize: numeric("avg_class_size", { precision: 5, scale:  1 }),
	subject: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("class_size_school_year_district_name_subject_key").on(table.schoolYear, table.districtName, table.subject),
]);

export const reportSectionsInContent = content.table("report_sections", {
	id: serial().primaryKey().notNull(),
	reportId: integer("report_id").notNull(),
	title: text().notNull(),
	subtitle: text(),
	content: text().notNull(),
	sectionOrder: integer("section_order").notNull(),
	sectionType: text("section_type").default('article'),
	dataQuery: text("data_query"),
	dataSnapshot: jsonb("data_snapshot"),
}, (table) => [
	foreignKey({
			columns: [table.reportId],
			foreignColumns: [progressReportsInContent.id],
			name: "report_sections_report_id_fkey"
		}),
]);

export const promiseEvidenceInAccountability = accountability.table("promise_evidence", {
	id: serial().primaryKey().notNull(),
	promiseId: text("promise_id").notNull(),
	snapshotDate: date("snapshot_date").notNull(),
	metricValue: numeric("metric_value"),
	source: text(),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const statewidePitByCountyInHomelessness = homelessness.table("statewide_pit_by_county", {
	id: serial().primaryKey().notNull(),
	county: text().notNull(),
	coc: text(),
	sheltered: integer(),
	unsheltered: integer(),
	total: integer(),
	unshelteredPct: numeric("unsheltered_pct", { precision: 5, scale:  1 }),
	shelterBeds: integer("shelter_beds"),
	ratePer1000Sheltered: numeric("rate_per_1000_sheltered", { precision: 6, scale:  2 }),
	ratePer1000Unsheltered: numeric("rate_per_1000_unsheltered", { precision: 6, scale:  2 }),
	ratePer1000Total: numeric("rate_per_1000_total", { precision: 6, scale:  2 }),
	year: integer().default(2025),
});

export const perPupilSpendingInEducation = education.table("per_pupil_spending", {
	id: serial().primaryKey().notNull(),
	schoolYear: text("school_year").notNull(),
	districtName: text("district_name").default('Portland SD 1J'),
	totalPerPupil: numeric("total_per_pupil", { precision: 10, scale:  2 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("per_pupil_spending_school_year_district_name_key").on(table.schoolYear, table.districtName),
]);

export const schoolEnrollmentInEducation = education.table("school_enrollment", {
	id: serial().primaryKey().notNull(),
	schoolYear: text("school_year").notNull(),
	districtName: text("district_name").default('Portland SD 1J'),
	schoolName: text("school_name").notNull(),
	schoolType: text("school_type"),
	enrollmentCurrent: integer("enrollment_current"),
	enrollmentPrior: integer("enrollment_prior"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_school_enrollment_name").using("btree", table.schoolName.asc().nullsLast().op("text_ops")),
	index("idx_school_enrollment_year").using("btree", table.schoolYear.asc().nullsLast().op("text_ops")),
	unique("school_enrollment_school_year_school_name_key").on(table.schoolYear, table.schoolName),
]);

export const airnowAqiInEnvironment = environment.table("airnow_aqi", {
	id: serial().primaryKey().notNull(),
	date: date().notNull(),
	hour: integer(),
	aqi: integer().notNull(),
	category: text().notNull(),
	pollutant: text().notNull(),
	reportingArea: text("reporting_area"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("airnow_aqi_date_hour_pollutant_key").on(table.date, table.hour, table.pollutant),
]);

export const byNameListInHomelessness = homelessness.table("by_name_list", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	totalOnList: integer("total_on_list"),
	newEntries: integer("new_entries"),
	exitsToHousing: integer("exits_to_housing"),
	source: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("by_name_list_month_key").on(table.month),
]);

export const contextStatsInHomelessness = homelessness.table("context_stats", {
	id: serial().primaryKey().notNull(),
	metric: text().notNull(),
	value: text().notNull(),
	context: text(),
	source: text(),
	asOfDate: text("as_of_date"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("context_stats_metric_key").on(table.metric),
]);

export const housingPlacementsInHomelessness = homelessness.table("housing_placements", {
	id: serial().primaryKey().notNull(),
	fiscalYear: text("fiscal_year").notNull(),
	totalPlacements: integer("total_placements"),
	shsPlacements: integer("shs_placements"),
	rapidRehousing: integer("rapid_rehousing"),
	pshPlacements: integer("psh_placements"),
	evictionsPrevented: integer("evictions_prevented"),
	source: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("housing_placements_fiscal_year_key").on(table.fiscalYear),
]);

export const overdoseDeathsInHomelessness = homelessness.table("overdose_deaths", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	totalOdDeathsHomeless: integer("total_od_deaths_homeless"),
	fentanylDeathsHomeless: integer("fentanyl_deaths_homeless"),
	totalHomelessDeaths: integer("total_homeless_deaths"),
	countyWideOpioidDeaths: integer("county_wide_opioid_deaths"),
	source: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("overdose_deaths_year_key").on(table.year),
]);

export const pitCountsInHomelessness = homelessness.table("pit_counts", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	cocCode: text("coc_code").default('OR-501'),
	cocName: text("coc_name").default('Portland, Gresham/Multnomah County CoC'),
	totalHomeless: integer("total_homeless"),
	sheltered: integer(),
	unsheltered: integer(),
	chronicallyHomeless: integer("chronically_homeless"),
	veterans: integer(),
	families: integer(),
	unaccompaniedYouth: integer("unaccompanied_youth"),
	source: text().default('HUD AHAR/PIT Count'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_pit_coc").using("btree", table.cocCode.asc().nullsLast().op("text_ops")),
	index("idx_pit_year").using("btree", table.year.asc().nullsLast().op("int4_ops")),
	unique("pit_counts_year_coc_code_key").on(table.year, table.cocCode),
]);

export const shelterCapacityInHomelessness = homelessness.table("shelter_capacity", {
	id: serial().primaryKey().notNull(),
	quarter: text().notNull(),
	totalBeds: integer("total_beds"),
	county24HrBeds: integer("county_24hr_beds"),
	cityOvernightBeds: integer("city_overnight_beds"),
	utilizationPct: numeric("utilization_pct", { precision: 5, scale:  1 }),
	source: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("shelter_capacity_quarter_key").on(table.quarter),
]);

export const shsFundingInHomelessness = homelessness.table("shs_funding", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	taxRevenue: bigint("tax_revenue", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	spending: bigint({ mode: "number" }),
	pshUnitsAdded: integer("psh_units_added"),
	pshUnitsCumulative: integer("psh_units_cumulative"),
	source: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("shs_funding_year_key").on(table.year),
]);

export const fhfaHpiInHousing = housing.table("fhfa_hpi", {
	id: serial().primaryKey().notNull(),
	cbsa: text(),
	metroName: text("metro_name"),
	year: integer(),
	quarter: integer(),
	hpi: numeric({ precision: 10, scale:  2 }),
	hpiChange: numeric("hpi_change", { precision: 10, scale:  4 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("fhfa_hpi_cbsa_year_quarter_key").on(table.cbsa, table.year, table.quarter),
]);

export const fredHousePriceIndexInHousing = housing.table("fred_house_price_index", {
	id: serial().primaryKey().notNull(),
	quarter: date().notNull(),
	hpiValue: numeric("hpi_value", { precision: 10, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("fred_house_price_index_quarter_key").on(table.quarter),
]);

export const permitActivitiesInHousing = housing.table("permit_activities", {
	id: serial().primaryKey().notNull(),
	detailId: integer("detail_id"),
	activityName: text("activity_name"),
	activityType: text("activity_type"),
	mustCheck: text("must_check"),
	activityStatus: text("activity_status"),
	lastActivityDate: date("last_activity_date"),
	completedDate: date("completed_date"),
	goalDate: date("goal_date"),
	staffContact: text("staff_contact"),
	daysFromSetup: integer("days_from_setup"),
}, (table) => [
	foreignKey({
			columns: [table.detailId],
			foreignColumns: [permitDetailsInHousing.detailId],
			name: "permit_activities_detail_id_fkey"
		}),
]);

export const irpCampsiteReportsInHomelessness = homelessness.table("irp_campsite_reports", {
	id: serial().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	arcgisObjectId: bigint("arcgis_object_id", { mode: "number" }),
	incidentDate: timestamp("incident_date", { withTimezone: true, mode: 'string' }),
	incidentId: text("incident_id"),
	isDuplicate: boolean("is_duplicate").default(false),
	itemDate: timestamp("item_date", { withTimezone: true, mode: 'string' }),
	isVehicle: boolean("is_vehicle").default(false),
	reportId: text("report_id"),
	lat: numeric({ precision: 10, scale:  7 }),
	lon: numeric({ precision: 10, scale:  7 }),
	neighborhood: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_irp_incident_date").using("btree", table.incidentDate.asc().nullsLast().op("timestamptz_ops")),
	unique("irp_campsite_reports_arcgis_object_id_key").on(table.arcgisObjectId),
]);

export const permitsInHousing = housing.table("permits", {
	permitId: bigserial("permit_id", { mode: "bigint" }).primaryKey().notNull(),
	permitNumber: text("permit_number").notNull(),
	permitType: text("permit_type").notNull(),
	permitTypeMapped: text("permit_type_mapped"),
	projectAddress: text("project_address"),
	valuation: numeric({ precision: 14, scale:  2 }),
	applicationDate: date("application_date"),
	issuedDate: date("issued_date"),
	finalDate: date("final_date"),
	status: text().notNull(),
	processingDays: integer("processing_days"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	arcgisObjectId: bigint("arcgis_object_id", { mode: "number" }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	neighborhood: text(),
}, (table) => [
	uniqueIndex("idx_permits_arcgis_oid").using("btree", table.arcgisObjectId.asc().nullsLast().op("int8_ops")).where(sql`(arcgis_object_id IS NOT NULL)`),
]);

export const permitDetailsInHousing = housing.table("permit_details", {
	detailId: integer("detail_id").primaryKey().notNull(),
	ivrNumber: text("ivr_number"),
	permitType: text("permit_type"),
	workDescription: text("work_description"),
	address: text(),
	setupDate: date("setup_date"),
	underReviewDate: date("under_review_date"),
	issueDate: date("issue_date"),
	finalDate: date("final_date"),
	status: text(),
	daysToIssue: integer("days_to_issue"),
	daysInReview: integer("days_in_review"),
	fetchedAt: timestamp("fetched_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const permitBottleneckAnalysisInHousing = housing.table("permit_bottleneck_analysis", {
	activityType: text("activity_type").primaryKey().notNull(),
	avgDaysToComplete: numeric("avg_days_to_complete"),
	medianDaysToComplete: numeric("median_days_to_complete"),
	pctIsLastReview: numeric("pct_is_last_review"),
	totalPermitsReviewed: integer("total_permits_reviewed"),
	avgCorrectionRounds: numeric("avg_correction_rounds"),
});

export const censusDemographicsInMigration = migration.table("census_demographics", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	metric: text().notNull(),
	value: numeric({ precision: 14, scale:  2 }).notNull(),
	description: text(),
}, (table) => [
	unique("census_demographics_year_metric_key").on(table.year, table.metric),
]);

export const censusPopulationInMigration = migration.table("census_population", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	population: integer().notNull(),
	changeFromPrev: integer("change_from_prev"),
	pctChange: numeric("pct_change", { precision: 6, scale:  2 }),
	source: text().default('PEP').notNull(),
	geoName: text("geo_name"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("census_population_year_source_key").on(table.year, table.source),
]);

export const businessFormationMonthly = pgTable("business_formation_monthly", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	newRegistrations: integer("new_registrations"),
	cancellations: integer(),
	netFormation: integer("net_formation"),
});

export const businessLicenses = pgTable("business_licenses", {
	id: serial().primaryKey().notNull(),
	businessName: text("business_name"),
	address: text(),
	naicsCode: text("naics_code"),
	naicsDescription: text("naics_description"),
	dateAdded: date("date_added"),
	lat: doublePrecision(),
	lon: doublePrecision(),
	zipCode: text("zip_code"),
});

export const dashboardCache = pgTable("dashboard_cache", {
	question: text().primaryKey().notNull(),
	data: jsonb(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const downtownFootTraffic = pgTable("downtown_foot_traffic", {
	id: serial().primaryKey().notNull(),
	week: date().notNull(),
	pctOf2019: numeric("pct_of_2019"),
	dayOfWeek: text("day_of_week"),
});

export const downtownVacancy = pgTable("downtown_vacancy", {
	id: serial().primaryKey().notNull(),
	quarter: date().notNull(),
	officeVacancyPct: numeric("office_vacancy_pct"),
	retailVacancyPct: numeric("retail_vacancy_pct"),
});

export const fredHousePriceIndex = pgTable("fred_house_price_index", {
	id: serial().primaryKey().notNull(),
	quarter: date().notNull(),
	hpi: numeric({ precision: 8, scale:  2 }).notNull(),
});

export const housingPermits = pgTable("housing_permits", {
	id: serial().primaryKey().notNull(),
	permitNum: text("permit_num").notNull(),
	permitType: text("permit_type"),
	projectAddress: text("project_address"),
	valuation: numeric(),
	applicationDate: date("application_date"),
	issuedDate: date("issued_date"),
	finalDate: date("final_date"),
	status: text(),
	processingDays: integer("processing_days"),
}, (table) => [
	unique("housing_permits_permit_num_unique").on(table.permitNum),
]);

export const housingPipelineMonthly = pgTable("housing_pipeline_monthly", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	unitsInPipeline: integer("units_in_pipeline"),
	avgProcessingMonths: numeric("avg_processing_months"),
});

export const hudVacancy = pgTable("hud_vacancy", {
	id: serial().primaryKey().notNull(),
	quarter: date().notNull(),
	zipCode: text("zip_code"),
	censusTract: text("census_tract"),
	totalAddresses: integer("total_addresses"),
	residentialVacant: integer("residential_vacant"),
	residentialNoStat: integer("residential_no_stat"),
	commercialVacant: integer("commercial_vacant"),
	countyFips: text("county_fips").default('41051'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("hud_vacancy_quarter_zip_code_key").on(table.quarter, table.zipCode),
]);

export const insights = pgTable("insights", {
	id: serial().primaryKey().notNull(),
	question: text(),
	text: text(),
	severity: text(),
	ruleName: text("rule_name"),
	metricValue: doublePrecision("metric_value"),
	generatedAt: timestamp("generated_at", { mode: 'string' }).defaultNow(),
});

export const migrationCensus = pgTable("migration_census", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	population: integer(),
	change: integer(),
}, (table) => [
	unique("migration_census_year_key").on(table.year),
]);

export const migrationWaterMonthly = pgTable("migration_water_monthly", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	activations: integer(),
	deactivations: integer(),
	net: integer(),
	zipCode: text("zip_code"),
});

export const programPcbSummary = pgTable("program_pcb_summary", {
	id: serial().primaryKey().notNull(),
	asOf: date("as_of").notNull(),
	totalCertified: integer("total_certified"),
	survivalRate1Yr: numeric("survival_rate_1yr"),
	jobsCreated: integer("jobs_created"),
	creditsIssued: numeric("credits_issued"),
});

export const safetyCrimeMonthly = pgTable("safety_crime_monthly", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	category: text().notNull(),
	offenseType: text("offense_type").notNull(),
	count: integer().notNull(),
	ratePer1000: numeric("rate_per_1000"),
	neighborhood: text(),
});

export const safetyGraffitiMonthly = pgTable("safety_graffiti_monthly", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	count: integer().notNull(),
});

export const safetyResponseTimes = pgTable("safety_response_times", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	priority: text().notNull(),
	medianMinutes: numeric("median_minutes"),
});

export const neighborhoodsInReference = reference.table("neighborhoods", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	coalition: text(),
	mapLabel: text("map_label"),
	neighborhoodId: integer("neighborhood_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("neighborhoods_name_key").on(table.name),
]);

export const taxComparison = pgTable("tax_comparison", {
	id: serial().primaryKey().notNull(),
	city: text().notNull(),
	incomeLevel: integer("income_level").notNull(),
	effectiveRate: numeric("effective_rate"),
	federal: numeric(),
	state: numeric(),
	local: numeric(),
	other: numeric(),
});

export const zillowZhvf = pgTable("zillow_zhvf", {
	id: serial().primaryKey().notNull(),
	baseDate: date("base_date").notNull(),
	forecast1MoPct: numeric("forecast_1mo_pct", { precision: 5, scale:  2 }),
	forecast3MoPct: numeric("forecast_3mo_pct", { precision: 5, scale:  2 }),
	forecast12MoPct: numeric("forecast_12mo_pct", { precision: 5, scale:  2 }),
	region: text().default('Portland, OR'),
}, (table) => [
	unique("zillow_zhvf_base_date_region_key").on(table.baseDate, table.region),
]);

export const zillowZhvi = pgTable("zillow_zhvi", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	zhvi: numeric({ precision: 12, scale:  2 }).notNull(),
	source: text().default('Zillow ZHVI - Typical Home Value (35th-65th percentile)'),
}, (table) => [
	unique("zillow_zhvi_month_key").on(table.month),
]);

export const parkAmenitiesInQuality = quality.table("park_amenities", {
	id: serial().primaryKey().notNull(),
	parkName: text("park_name"),
	amenityType: text("amenity_type").notNull(),
	amenityName: text("amenity_name"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("park_amenities_park_name_amenity_type_amenity_name_key").on(table.parkName, table.amenityType, table.amenityName),
]);

export const zillowMetrics = pgTable("zillow_metrics", {
	id: serial().primaryKey().notNull(),
	metric: text().notNull(),
	month: date().notNull(),
	value: numeric({ precision: 14, scale:  2 }).notNull(),
	description: text(),
}, (table) => [
	unique("zillow_metrics_metric_month_key").on(table.metric, table.month),
]);

export const pavementConditionInQuality = quality.table("pavement_condition", {
	id: serial().primaryKey().notNull(),
	streetName: text("street_name"),
	pci: integer(),
	surfaceType: text("surface_type"),
	functionalClass: text("functional_class"),
	inspectionYear: integer("inspection_year"),
	lengthFt: numeric("length_ft"),
	sqYards: numeric("sq_yards"),
	numLanes: integer("num_lanes"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_pavement_pci").using("btree", table.pci.asc().nullsLast().op("int4_ops")),
	index("idx_pavement_year").using("btree", table.inspectionYear.asc().nullsLast().op("int4_ops")),
	unique("pavement_condition_street_name_pci_inspection_year_key").on(table.streetName, table.pci, table.inspectionYear),
]);

export const listingsInRealEstate = realEstate.table("listings", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	address: text().notNull(),
	neighborhood: text().notNull(),
	sqft: integer().notNull(),
	spaceType: text("space_type").notNull(),
	askingRent: numeric("asking_rent", { precision: 10, scale:  2 }),
	pcbTerms: jsonb("pcb_terms").default({}),
	condition: text().default('move-in ready'),
	vacancyDuration: text("vacancy_duration"),
	listedDate: date("listed_date").default(sql`CURRENT_DATE`),
	status: text().default('available'),
	description: text(),
	amenities: text().array().default([""]),
	floor: text(),
	contactEmail: text("contact_email"),
	lat: doublePrecision(),
	lon: doublePrecision(),
	images: text().array().default([""]),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const boec911DataInSafety = safety.table("boec_911_data", {
	id: serial().primaryKey().notNull(),
	reportMonth: text("report_month").notNull(),
	metric: text().notNull(),
	value: numeric({ precision: 12, scale:  2 }).notNull(),
	source: text().default('BOEC Director Report Feb 2026'),
}, (table) => [
	unique("boec_911_data_report_month_metric_key").on(table.reportMonth, table.metric),
]);

export const crimeMonthlyInSafety = safety.table("crime_monthly", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	category: text().notNull(),
	count: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("crime_monthly_month_category_key").on(table.month, table.category),
]);

export const fbiCrimeEstimatesInSafety = safety.table("fbi_crime_estimates", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	stateAbbr: text("state_abbr").default('OR').notNull(),
	stateName: text("state_name").default('Oregon'),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	population: bigint({ mode: "number" }),
	violentCrime: integer("violent_crime"),
	homicide: integer(),
	rapeLegacy: integer("rape_legacy"),
	rapeRevised: integer("rape_revised"),
	robbery: integer(),
	aggravatedAssault: integer("aggravated_assault"),
	propertyCrime: integer("property_crime"),
	burglary: integer(),
	larceny: integer(),
	motorVehicleTheft: integer("motor_vehicle_theft"),
	arson: integer(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("fbi_crime_estimates_year_state_abbr_key").on(table.year, table.stateAbbr),
]);

export const fbiCrimeOregonInSafety = safety.table("fbi_crime_oregon", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	population: integer(),
	violentCrime: integer("violent_crime"),
	homicide: integer(),
	robbery: integer(),
	aggravatedAssault: integer("aggravated_assault"),
	propertyCrime: integer("property_crime"),
	burglary: integer(),
	larceny: integer(),
	motorVehicleTheft: integer("motor_vehicle_theft"),
}, (table) => [
	unique("fbi_crime_oregon_year_key").on(table.year),
]);

export const fbiPropertyCrimeSummaryInSafety = safety.table("fbi_property_crime_summary", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	stateAbbr: text("state_abbr").default('OR').notNull(),
	ori: text(),
	agencyName: text("agency_name"),
	offense: text(),
	actual: integer(),
	cleared: integer(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	population: bigint({ mode: "number" }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const fbiViolentCrimeSummaryInSafety = safety.table("fbi_violent_crime_summary", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	stateAbbr: text("state_abbr").default('OR').notNull(),
	ori: text(),
	agencyName: text("agency_name"),
	offense: text(),
	actual: integer(),
	cleared: integer(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	population: bigint({ mode: "number" }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const graffitiMonthlyInSafety = safety.table("graffiti_monthly", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	count: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("graffiti_monthly_month_key").on(table.month),
]);

export const ppbOffensesInSafety = safety.table("ppb_offenses", {
	id: serial().primaryKey().notNull(),
	address: text(),
	caseNumber: text("case_number"),
	councilDistrict: text("council_district"),
	crimeAgainst: text("crime_against"),
	customCrimeAgainst: text("custom_crime_against"),
	customCrimeCategory: text("custom_crime_category"),
	neighborhood: text(),
	occurDate: date("occur_date"),
	occurTime: text("occur_time"),
	offenseCategory: text("offense_category"),
	offenseCount: integer("offense_count"),
	offenseType: text("offense_type"),
	lat: doublePrecision(),
	lon: doublePrecision(),
	x: doublePrecision(),
	y: doublePrecision(),
	reportDate: date("report_date"),
	reportMonthYear: text("report_month_year"),
}, (table) => [
	unique("ppb_offenses_case_offense_uq").on(table.caseNumber, table.offenseType),
]);

export const statewideUnshelteredChangeInHomelessness = homelessness.table("statewide_unsheltered_change", {
	id: serial().primaryKey().notNull(),
	county: text().notNull(),
	count2023: integer("count_2023"),
	count2025: integer("count_2025"),
	numericChange: integer("numeric_change"),
	pctChange: integer("pct_change"),
});

export const parksInQuality = quality.table("parks", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	acres: numeric({ precision: 10, scale:  2 }),
	propertyId: text("property_id"),
	geometryType: text("geometry_type"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	parkType: text("park_type"),
}, (table) => [
	unique("parks_name_key").on(table.name),
]);

export const climateWorkplanActions = pgTable("climate_workplan_actions", {
	id: serial().primaryKey().notNull(),
	actionId: text("action_id").notNull(),
	title: text().notNull(),
	sector: text().notNull(),
	category: text().notNull(),
	leadBureaus: text("lead_bureaus").array().notNull(),
	isDeclarationPriority: boolean("is_declaration_priority").default(false).notNull(),
	fiscalYear: text("fiscal_year"),
	resourceGap: text("resource_gap"),
	isPcefFunded: boolean("is_pcef_funded").default(false).notNull(),
	isMultiBureau: boolean("is_multi_bureau").default(false).notNull(),
	status: text().default('ongoing').notNull(),
	description: text(),
	externalPartners: text("external_partners"),
	cobenefits: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("climate_workplan_actions_action_id_key").on(table.actionId),
]);

export const climateActionStatusHistory = pgTable("climate_action_status_history", {
	id: serial().primaryKey().notNull(),
	actionId: text("action_id").notNull(),
	status: text().notNull(),
	statusDate: date("status_date").notNull(),
	narrative: text(),
	source: text(),
});

export const climateBureauScorecard = pgTable("climate_bureau_scorecard", {
	id: serial().primaryKey().notNull(),
	bureauCode: text("bureau_code").notNull(),
	bureauName: text("bureau_name").notNull(),
	totalActions: integer("total_actions").default(0).notNull(),
	achievedActions: integer("achieved_actions").default(0).notNull(),
	ongoingActions: integer("ongoing_actions").default(0).notNull(),
	delayedActions: integer("delayed_actions").default(0).notNull(),
	crossBureauActions: integer("cross_bureau_actions").default(0).notNull(),
	pcefFundingReceived: numeric("pcef_funding_received"),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("climate_bureau_scorecard_bureau_code_key").on(table.bureauCode),
]);

export const climateFinanceSources = pgTable("climate_finance_sources", {
	id: serial().primaryKey().notNull(),
	fiscalYear: text("fiscal_year").notNull(),
	source: text().notNull(),
	allocationAmount: numeric("allocation_amount"),
	actionCount: integer("action_count"),
});

export const pcefAllocations = pgTable("pcef_allocations", {
	id: serial().primaryKey().notNull(),
	fiscalYear: text("fiscal_year").notNull(),
	recipient: text().notNull(),
	recipientType: text("recipient_type").notNull(),
	amount: numeric().notNull(),
	programArea: text("program_area"),
});

export const pcefInterestDiversions = pgTable("pcef_interest_diversions", {
	id: serial().primaryKey().notNull(),
	fiscalYear: text("fiscal_year").notNull(),
	amountDiverted: numeric("amount_diverted").notNull(),
	destination: text(),
	notes: text(),
}, (table) => [
	unique("pcef_interest_diversions_fiscal_year_key").on(table.fiscalYear),
]);

export const climateEmissionsTrajectory = pgTable("climate_emissions_trajectory", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	isTarget: boolean("is_target").default(false).notNull(),
	targetType: text("target_type"),
	totalMtco2E: numeric("total_mtco2e"),
	electricityMtco2E: numeric("electricity_mtco2e"),
	buildingsMtco2E: numeric("buildings_mtco2e"),
	transportationMtco2E: numeric("transportation_mtco2e"),
	wasteMtco2E: numeric("waste_mtco2e"),
	industryMtco2E: numeric("industry_mtco2e"),
	otherMtco2E: numeric("other_mtco2e"),
	populationThousands: numeric("population_thousands"),
});

export const cewActionsInEnvironment = environment.table("cew_actions", {
	actionId: text("action_id").primaryKey().notNull(),
	sector: text().notNull(),
	category: text().notNull(),
	title: text().notNull(),
	description: text(),
	leadBureaus: text("lead_bureaus").array().notNull(),
	mapsToDeclaration: boolean("maps_to_declaration").default(false).notNull(),
	fiscalYear: text("fiscal_year"),
	resourceGap: text("resource_gap"),
	status: text().default('ongoing').notNull(),
	pcefFunded: boolean("pcef_funded").default(false).notNull(),
	multiBureau: boolean("multi_bureau").default(false).notNull(),
	externalPartners: text("external_partners").array(),
	coBenefits: text("co_benefits").array(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_cew_actions_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("idx_cew_actions_sector").using("btree", table.sector.asc().nullsLast().op("text_ops")),
	index("idx_cew_actions_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
]);

export const cewActionHistoryInEnvironment = environment.table("cew_action_history", {
	id: serial().primaryKey().notNull(),
	actionId: text("action_id").notNull(),
	status: text().notNull(),
	reportPeriod: text("report_period").notNull(),
	narrative: text(),
	recordedAt: timestamp("recorded_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_cew_history_action").using("btree", table.actionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.actionId],
			foreignColumns: [cewActionsInEnvironment.actionId],
			name: "cew_action_history_action_id_fkey"
		}),
]);

export const bureausInEnvironment = environment.table("bureaus", {
	abbreviation: text().primaryKey().notNull(),
	fullName: text("full_name").notNull(),
	category: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const emissionsTargetsInEnvironment = environment.table("emissions_targets", {
	targetYear: smallint("target_year").primaryKey().notNull(),
	targetMtco2E: numeric("target_mtco2e", { precision: 12, scale:  0 }).notNull(),
	targetPctBelow1990: numeric("target_pct_below_1990", { precision: 5, scale:  2 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const pcefInvestmentsInEnvironment = environment.table("pcef_investments", {
	id: serial().primaryKey().notNull(),
	fiscalYear: text("fiscal_year").notNull(),
	category: text().notNull(),
	recipientType: text("recipient_type").notNull(),
	recipientName: text("recipient_name"),
	budgeted: numeric({ precision: 14, scale:  2 }),
	spent: numeric({ precision: 14, scale:  2 }),
	projectsFunded: integer("projects_funded"),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_pcef_fy").using("btree", table.fiscalYear.asc().nullsLast().op("text_ops")),
	index("idx_pcef_type").using("btree", table.recipientType.asc().nullsLast().op("text_ops")),
]);

export const renewableEnergyInEnvironment = environment.table("renewable_energy", {
	year: smallint().primaryKey().notNull(),
	pctRenewable: numeric("pct_renewable", { precision: 5, scale:  2 }),
	pctCommunityOwned: numeric("pct_community_owned", { precision: 5, scale:  2 }),
	totalMwh: numeric("total_mwh", { precision: 14, scale:  0 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const evictionFilingsInHomelessness = homelessness.table("eviction_filings", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	county: text().notNull(),
	filings: integer(),
	filingRatePer100: numeric("filing_rate_per_100", { precision: 5, scale:  2 }),
	defaultJudgments: integer("default_judgments"),
	stipulatedAgreements: integer("stipulated_agreements"),
	source: text().default('Evicted in Oregon / HRAC PSU'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("eviction_filings_month_county_key").on(table.month, table.county),
]);

export const shsSpendingByTypeInHomelessness = homelessness.table("shs_spending_by_type", {
	id: serial().primaryKey().notNull(),
	fiscalYear: text("fiscal_year").notNull(),
	interventionType: text("intervention_type").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	amount: bigint({ mode: "number" }),
	householdsServed: integer("households_served"),
	housingPlacements: integer("housing_placements"),
	costPerPlacement: numeric("cost_per_placement", { precision: 10, scale:  2 }),
	source: text().default('Metro SHS Reports'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("shs_spending_by_type_fiscal_year_intervention_type_key").on(table.fiscalYear, table.interventionType),
]);

export const shsByCountyInHomelessness = homelessness.table("shs_by_county", {
	id: serial().primaryKey().notNull(),
	fiscalYear: text("fiscal_year").notNull(),
	county: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	allocation: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	spent: bigint({ mode: "number" }),
	householdsPlaced: integer("households_placed"),
	source: text().default('Metro SHS Reports'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("shs_by_county_fiscal_year_county_key").on(table.fiscalYear, table.county),
]);

export const affordableHousingVacancyInHomelessness = homelessness.table("affordable_housing_vacancy", {
	id: serial().primaryKey().notNull(),
	asOf: date("as_of").notNull(),
	source: text().notNull(),
	totalUnits: integer("total_units"),
	vacantUnits: integer("vacant_units"),
	vacancyPct: numeric("vacancy_pct", { precision: 5, scale:  2 }),
	avgDaysToFill: integer("avg_days_to_fill"),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const culturalInstitutionsInQuality = quality.table("cultural_institutions", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	type: text(),
	address: text(),
	website: text(),
	source: text(),
}, (table) => [
	unique("cultural_institutions_name_key").on(table.name),
]);

export const contextStatsInQuality = quality.table("context_stats", {
	id: serial().primaryKey().notNull(),
	metric: text().notNull(),
	value: text().notNull(),
	context: text(),
	source: text(),
	asOfDate: date("as_of_date"),
}, (table) => [
	unique("context_stats_metric_key").on(table.metric),
]);

export const affordabilityInQuality = quality.table("affordability", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	metric: text().notNull(),
	value: numeric({ precision: 12, scale:  2 }),
	source: text(),
}, (table) => [
	unique("affordability_year_metric_key").on(table.year, table.metric),
]);

export const transitRidershipInQuality = quality.table("transit_ridership", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	mode: text().notNull(),
	ridership: integer(),
	onTimePct: numeric("on_time_pct", { precision: 5, scale:  1 }),
	source: text().default('TriMet'),
}, (table) => [
	unique("transit_ridership_month_mode_key").on(table.month, table.mode),
]);

export const libraryStatsInQuality = quality.table("library_stats", {
	id: serial().primaryKey().notNull(),
	fiscalYear: text("fiscal_year").notNull(),
	libraryName: text("library_name").notNull(),
	visits: integer(),
	circulation: integer(),
	programs: integer(),
	programAttendance: integer("program_attendance"),
	registeredUsers: integer("registered_users"),
	staffFte: numeric("staff_fte", { precision: 8, scale:  2 }),
	totalRevenue: numeric("total_revenue", { precision: 14, scale:  2 }),
	totalExpenditures: numeric("total_expenditures", { precision: 14, scale:  2 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	circPhysical: integer("circ_physical"),
	circEcontent: integer("circ_econtent"),
	circTotal: integer("circ_total"),
	programsKids: integer("programs_kids"),
	programsKidsAttendance: integer("programs_kids_attendance"),
	programsYa: integer("programs_ya"),
	programsYaAttendance: integer("programs_ya_attendance"),
	programsAdults: integer("programs_adults"),
	programsAdultsAttendance: integer("programs_adults_attendance"),
	programsTotal: integer("programs_total"),
	programAttendanceTotal: integer("program_attendance_total"),
	branches: integer(),
	populationServed: integer("population_served"),
	hoursOpenYear: integer("hours_open_year"),
	collectionBooks: integer("collection_books"),
	collectionEbooks: integer("collection_ebooks"),
}, (table) => [
	index("idx_library_stats_name").using("btree", table.libraryName.asc().nullsLast().op("text_ops")),
	index("idx_library_stats_year").using("btree", table.fiscalYear.asc().nullsLast().op("text_ops")),
	unique("library_stats_fiscal_year_library_name_key").on(table.fiscalYear, table.libraryName),
]);

export const racialDisparitiesInHomelessness = homelessness.table("racial_disparities", {
	id: serial().primaryKey().notNull(),
	raceGroup: text("race_group").notNull(),
	pctOfPopulation: numeric("pct_of_population", { precision: 5, scale:  1 }),
	pctOfPit: numeric("pct_of_pit", { precision: 5, scale:  1 }),
	disparityRatio: numeric("disparity_ratio", { precision: 5, scale:  2 }),
	scope: text().default('statewide'),
	year: integer().default(2025),
});

export const members = pgTable("members", {
	id: serial().primaryKey().notNull(),
	workosUserId: text("workos_user_id").notNull(),
	email: text().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	avatarUrl: text("avatar_url"),
	role: text().default('member').notNull(),
	status: text().default('active').notNull(),
	neighborhood: text(),
	interests: jsonb(),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lastSeenAt: timestamp("last_seen_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("members_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	unique("members_workos_user_id_key").on(table.workosUserId),
	unique("members_email_key").on(table.email),
]);

export const ridershipInTransportation = transportation.table("ridership", {
	id: serial().primaryKey().notNull(),
	fiscalYear: integer("fiscal_year").notNull(),
	mode: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	boardings: bigint({ mode: "number" }).notNull(),
	source: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("ridership_fiscal_year_mode_key").on(table.fiscalYear, table.mode),
]);

export const dataSourcesInHomelessness = homelessness.table("data_sources", {
	id: serial().primaryKey().notNull(),
	sourceKey: text("source_key").notNull(),
	displayName: text("display_name").notNull(),
	agency: text().notNull(),
	methodology: text().notNull(),
	scope: text().notNull(),
	whatItMisses: text("what_it_misses"),
	updateFrequency: text("update_frequency"),
	lastUpdated: date("last_updated"),
	nextExpected: date("next_expected"),
	url: text(),
	usedBy: text("used_by").array(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("data_sources_source_key_key").on(table.sourceKey),
]);

export const metroMetadata = pgTable("metro_metadata", {
	metroCode: text("metro_code").primaryKey().notNull(),
	metroName: text("metro_name").notNull(),
	shortName: text("short_name").notNull(),
	stateFips: text("state_fips").notNull(),
	lausSeriesId: text("laus_series_id"),
	qcewAreaCode: text("qcew_area_code"),
	isPortland: boolean("is_portland").default(false),
	population: integer(),
	displayOrder: integer("display_order"),
});

export const dataDisputesInHomelessness = homelessness.table("data_disputes", {
	id: serial().primaryKey().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
	dateSurfaced: date("date_surfaced").notNull(),
	status: text().default('active'),
	claimASource: text("claim_a_source").notNull(),
	claimASummary: text("claim_a_summary").notNull(),
	claimAData: jsonb("claim_a_data"),
	claimBSource: text("claim_b_source").notNull(),
	claimBSummary: text("claim_b_summary").notNull(),
	claimBData: jsonb("claim_b_data"),
	expertAssessment: text("expert_assessment"),
	expertSource: text("expert_source"),
	methodologyDifference: text("methodology_difference").notNull(),
	newsUrl: text("news_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("data_disputes_slug_key").on(table.slug),
]);

export const crashesInTransportation = transportation.table("crashes", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	fatalities: integer().notNull(),
	seriousInjuries: integer("serious_injuries"),
	pedestrianFatalities: integer("pedestrian_fatalities"),
	cyclistFatalities: integer("cyclist_fatalities"),
	motorcyclistFatalities: integer("motorcyclist_fatalities"),
	vehicleOccupantFatalities: integer("vehicle_occupant_fatalities"),
	totalReportedCrashes: integer("total_reported_crashes"),
	source: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("crashes_year_key").on(table.year),
]);

export const commuteModeInTransportation = transportation.table("commute_mode", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	mode: text().notNull(),
	count: integer().notNull(),
	pct: numeric({ precision: 5, scale:  1 }).notNull(),
	source: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("commute_mode_year_mode_key").on(table.year, table.mode),
]);

export const shelterBedInventoryInHomelessness = homelessness.table("shelter_bed_inventory", {
	id: serial().primaryKey().notNull(),
	county: text().notNull(),
	seasonalOverflow: integer("seasonal_overflow"),
	yearRound: integer("year_round"),
	totalBeds: integer("total_beds"),
	totalHomeless: integer("total_homeless"),
	bedsPctOfPit: integer("beds_pct_of_pit"),
	year: integer().default(2025),
});

export const studentHomelessnessInHomelessness = homelessness.table("student_homelessness", {
	id: serial().primaryKey().notNull(),
	county: text().notNull(),
	count202324: integer("count_2023_24"),
	count202425: integer("count_2024_25"),
	numericChange: integer("numeric_change"),
	pctChange: numeric("pct_change", { precision: 6, scale:  1 }),
});

export const pbjRealEstateMonthly = pgTable("pbj_real_estate_monthly", {
	month: date().primaryKey().notNull(),
	entityBuyers: integer("entity_buyers").default(0).notNull(),
	personBuyers: integer("person_buyers").default(0).notNull(),
	totalVolumeUsd: numeric("total_volume_usd", { precision: 14, scale:  2 }).default('0').notNull(),
	dealCount: integer("deal_count").default(0).notNull(),
	entitySharePct: numeric("entity_share_pct", { precision: 5, scale:  2 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
	id: uuid().primaryKey().notNull(),
	submittedAt: timestamp("submitted_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	delivery: text().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	organization: text(),
	topic: text(),
	message: text().notNull(),
	clientIp: text("client_ip"),
	userAgent: text("user_agent"),
	rawPayload: jsonb("raw_payload").notNull(),
}, (table) => [
	index("contact_submissions_submitted_at_idx").using("btree", table.submittedAt.desc().nullsFirst().op("timestamptz_ops")),
]);

export const pbjBusinessMonthly = pgTable("pbj_business_monthly", {
	month: date().primaryKey().notNull(),
	newBusinesses: integer("new_businesses").default(0).notNull(),
	bankruptcies: integer().default(0).notNull(),
	lawsuits: integer().default(0).notNull(),
	taxLiens: integer("tax_liens").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const doubledUpInHomelessness = homelessness.table("doubled_up", {
	id: serial().primaryKey().notNull(),
	county: text().notNull(),
	estimate: integer(),
	marginOfError: integer("margin_of_error"),
	year: integer().default(2024),
});

export const msaEmploymentWagesInEconomy = economy.table("msa_employment_wages", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	quarter: integer().notNull(),
	areaFips: text("area_fips").default('C3890').notNull(),
	areaName: text("area_name").default('Portland-Vancouver-Hillsboro MSA').notNull(),
	establishments: integer(),
	month1Employment: integer("month1_employment"),
	month2Employment: integer("month2_employment"),
	month3Employment: integer("month3_employment"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalQuarterlyWages: bigint("total_quarterly_wages", { mode: "number" }),
	avgWeeklyWage: integer("avg_weekly_wage"),
	source: text().default('BLS QCEW'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("msa_employment_wages_year_quarter_area_fips_key").on(table.year, table.quarter, table.areaFips),
]);

export const businessFormationInEconomy = economy.table("business_formation", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	geography: text().default('Portland-Vancouver-Hillsboro MSA').notNull(),
	totalEstablishments: integer("total_establishments"),
	totalEmployment: integer("total_employment"),
	annualPayrollThousands: integer("annual_payroll_thousands"),
	newFirmsPer10KPop: numeric("new_firms_per_10k_pop", { precision: 6, scale:  2 }),
	newMfgFirmsPer10KPop: numeric("new_mfg_firms_per_10k_pop", { precision: 6, scale:  2 }),
	metroRankMfgFormation: integer("metro_rank_mfg_formation"),
	netEstablishmentChange: integer("net_establishment_change"),
	establishmentEntryRate: numeric("establishment_entry_rate", { precision: 5, scale:  2 }),
	establishmentExitRate: numeric("establishment_exit_rate", { precision: 5, scale:  2 }),
	source: text(),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("business_formation_year_geography_key").on(table.year, table.geography),
]);

export const airnowForecastInEnvironment = environment.table("airnow_forecast", {
	id: serial().primaryKey().notNull(),
	dateIssue: date("date_issue").notNull(),
	dateForecast: date("date_forecast").notNull(),
	aqi: integer().notNull(),
	category: text().notNull(),
	pollutant: text().notNull(),
	reportingArea: text("reporting_area").notNull(),
	actionDay: boolean("action_day").default(false),
	discussion: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("airnow_forecast_date_forecast_pollutant_key").on(table.dateForecast, table.pollutant),
]);

export const askSubscribers = pgTable("ask_subscribers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	surveySlug: text("survey_slug"),
	channel: text(),
	source: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ask_subscribers_survey_idx").using("btree", table.surveySlug.asc().nullsLast().op("text_ops")),
	unique("ask_subscribers_email_key").on(table.email),
]);

export const chronicAbsenteeismInEducation = education.table("chronic_absenteeism", {
	id: serial().primaryKey().notNull(),
	schoolYear: text("school_year").notNull(),
	districtName: text("district_name").notNull(),
	institutionName: text("institution_name"),
	institutionType: text("institution_type"),
	studentGroup: text("student_group").notNull(),
	studentsIncluded: integer("students_included"),
	regularAttenders: integer("regular_attenders"),
	regularAttenderPct: numeric("regular_attender_pct", { precision: 5, scale:  1 }),
	chronicallyAbsent: integer("chronically_absent"),
	chronicallyAbsentPct: numeric("chronically_absent_pct", { precision: 5, scale:  1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_chronic_absenteeism_district").using("btree", table.districtName.asc().nullsLast().op("text_ops")),
	index("idx_chronic_absenteeism_type").using("btree", table.institutionType.asc().nullsLast().op("text_ops")),
	index("idx_chronic_absenteeism_year").using("btree", table.schoolYear.asc().nullsLast().op("text_ops")),
]);

export const censusDemographics = pgTable("census_demographics", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	metric: text().notNull(),
	value: numeric(),
}, (table) => [
	unique("census_demographics_year_metric_key").on(table.year, table.metric),
]);

export const ridershipMonthlyInTransportation = transportation.table("ridership_monthly", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	mode: text().notNull(),
	boardings: integer().notNull(),
	vehicleRevenueMiles: integer("vehicle_revenue_miles"),
	vehicleRevenueHours: integer("vehicle_revenue_hours"),
	source: text().default('NTD'),
}, (table) => [
	unique("ridership_monthly_month_mode_key").on(table.month, table.mode),
]);

export const boec911MonthlyInSafety = safety.table("boec_911_monthly", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	total911Calls: integer("total_911_calls"),
	pctAnswered15Sec: numeric("pct_answered_15sec", { precision: 5, scale:  1 }),
	avgWaitSeconds: integer("avg_wait_seconds"),
	nonEmergencyWaitSeconds: integer("non_emergency_wait_seconds"),
	authorizedFte: integer("authorized_fte"),
	certifiedDispatchers: integer("certified_dispatchers"),
	vacancies: integer(),
	source: text().default('BOEC Director Report'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	pctAnswered20Sec: numeric("pct_answered_20sec", { precision: 5, scale:  1 }),
}, (table) => [
	unique("boec_911_monthly_month_key").on(table.month),
]);

export const crashRecordsInTransportation = transportation.table("crash_records", {
	id: serial().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	crashId: bigint("crash_id", { mode: "number" }),
	crashDate: date("crash_date"),
	crashYear: integer("crash_year"),
	crashMonth: integer("crash_month"),
	county: text(),
	street: text(),
	severity: text(),
	totalFatalities: integer("total_fatalities").default(0),
	totalInjuries: integer("total_injuries").default(0),
	totalPedestrians: integer("total_pedestrians").default(0),
	totalCyclists: integer("total_cyclists").default(0),
	crashType: text("crash_type"),
	crashCause: text("crash_cause"),
	alcoholInvolved: boolean("alcohol_involved").default(false),
	speedInvolved: boolean("speed_involved").default(false),
	speedLimit: integer("speed_limit"),
	lat: numeric({ precision: 10, scale:  7 }),
	lon: numeric({ precision: 10, scale:  7 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_crash_date").using("btree", table.crashDate.asc().nullsLast().op("date_ops")),
	index("idx_crash_severity").using("btree", table.severity.asc().nullsLast().op("text_ops")),
	unique("crash_records_crash_id_key").on(table.crashId),
]);

export const treeCanopyInEnvironment = environment.table("tree_canopy", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	citywidePct: numeric("citywide_pct", { precision: 4, scale:  1 }),
	commercialPct: numeric("commercial_pct", { precision: 4, scale:  1 }),
	industrialPct: numeric("industrial_pct", { precision: 4, scale:  1 }),
	openSpacePct: numeric("open_space_pct", { precision: 4, scale:  1 }),
	residentialPct: numeric("residential_pct", { precision: 4, scale:  1 }),
	source: text().default('Portland Tree Canopy Monitoring Report'),
}, (table) => [
	unique("tree_canopy_year_key").on(table.year),
]);

export const treeInventoryInEnvironment = environment.table("tree_inventory", {
	id: serial().primaryKey().notNull(),
	neighborhood: text(),
	treeCount: integer("tree_count"),
	topSpecies: text("top_species").array(),
	avgDiameter: numeric("avg_diameter", { precision: 5, scale:  1 }),
	conditionGoodPct: numeric("condition_good_pct", { precision: 5, scale:  1 }),
	conditionFairPct: numeric("condition_fair_pct", { precision: 5, scale:  1 }),
	conditionPoorPct: numeric("condition_poor_pct", { precision: 5, scale:  1 }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("tree_inventory_neighborhood_key").on(table.neighborhood),
]);

export const programOffersInFiscal = fiscal.table("program_offers", {
	id: serial().primaryKey().notNull(),
	serviceArea: text("service_area").notNull(),
	bureau: text().notNull(),
	programOffer: text("program_offer").notNull(),
	fy202425: numeric("fy_2024_25", { precision: 14, scale:  2 }),
	fy202526: numeric("fy_2025_26", { precision: 14, scale:  2 }),
	fy202627: numeric("fy_2026_27", { precision: 14, scale:  2 }),
	fundType: text("fund_type").default('All Funds'),
	source: text().default('CBO Program Offer Data FY 2026-27'),
}, (table) => [
	unique("program_offers_service_area_bureau_program_offer_fund_type_key").on(table.serviceArea, table.bureau, table.programOffer, table.fundType),
]);

export const boecCallVolumeAnnualInSafety = safety.table("boec_call_volume_annual", {
	id: serial().primaryKey().notNull(),
	year: integer().notNull(),
	referenceMonth: text("reference_month").default('March').notNull(),
	totalCalls: integer("total_calls").notNull(),
	source: text().default('BOEC Director Report'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("boec_call_volume_annual_year_reference_month_key").on(table.year, table.referenceMonth),
]);

export const footTrafficInDowntown = downtown.table("foot_traffic", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	visits: integer().notNull(),
	isAnnualTotal: boolean("is_annual_total").default(false),
	source: text().default('Portland Clean & Safe / Placer.ai'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("foot_traffic_month_key").on(table.month),
]);

export const officeVacancyInDowntown = downtown.table("office_vacancy", {
	id: serial().primaryKey().notNull(),
	quarter: text().notNull(),
	quarterDate: date("quarter_date").notNull(),
	vacancyPct: numeric("vacancy_pct", { precision: 4, scale:  1 }).notNull(),
	source: text().default('CBRE / Colliers / Kidder Mathews'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("office_vacancy_quarter_key").on(table.quarter),
]);

export const pbjSerialBuyer = pgTable("pbj_serial_buyer", {
	buyerName: text("buyer_name").primaryKey().notNull(),
	buyerType: text("buyer_type"),
	dealCount: integer("deal_count").notNull(),
	totalVolumeUsd: numeric("total_volume_usd", { precision: 14, scale:  2 }),
	zipCount: integer("zip_count"),
	lastSeenWeek: date("last_seen_week"),
	ingestedAt: timestamp("ingested_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("pbj_serial_buyer_volume_idx").using("btree", table.totalVolumeUsd.desc().nullsFirst().op("numeric_ops")),
]);

export const pbjDistressEntity = pgTable("pbj_distress_entity", {
	entityName: text("entity_name").primaryKey().notNull(),
	categories: text().array().notNull(),
	categoryCount: integer("category_count").notNull(),
	lastSeenWeek: date("last_seen_week"),
	ingestedAt: timestamp("ingested_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("pbj_distress_entity_count_idx").using("btree", table.categoryCount.desc().nullsFirst().op("int4_ops")),
]);

export const pbjZipInvestment = pgTable("pbj_zip_investment", {
	zipCode: text("zip_code").primaryKey().notNull(),
	permitCount: integer("permit_count").default(0),
	permitValueUsd: numeric("permit_value_usd", { precision: 14, scale:  2 }).default('0'),
	reDealCount: integer("re_deal_count").default(0),
	reVolumeUsd: numeric("re_volume_usd", { precision: 14, scale:  2 }).default('0'),
	newBusinessCount: integer("new_business_count").default(0),
	totalInvestmentUsd: numeric("total_investment_usd", { precision: 14, scale:  2 }).default('0'),
	ingestedAt: timestamp("ingested_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const enrollmentInEducation = education.table("enrollment", {
	id: serial().primaryKey().notNull(),
	schoolYear: text("school_year").notNull(),
	districtName: text("district_name").notNull(),
	gradeLevel: text("grade_level").notNull(),
	enrollment: integer().notNull(),
	demographicGroup: text("demographic_group"),
	demographicCount: integer("demographic_count"),
	demographicPct: numeric("demographic_pct", { precision: 5, scale:  1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_enrollment_district").using("btree", table.districtName.asc().nullsLast().op("text_ops")),
	index("idx_enrollment_grade").using("btree", table.gradeLevel.asc().nullsLast().op("text_ops")),
	index("idx_enrollment_year").using("btree", table.schoolYear.asc().nullsLast().op("text_ops")),
	unique("enrollment_school_year_district_name_grade_level_demographi_key").on(table.schoolYear, table.districtName, table.gradeLevel, table.demographicGroup),
]);

export const graduationRatesInEducation = education.table("graduation_rates", {
	id: serial().primaryKey().notNull(),
	schoolYear: text("school_year").notNull(),
	districtName: text("district_name").notNull(),
	rate4Yr: numeric("rate_4yr", { precision: 5, scale:  1 }),
	rate5Yr: numeric("rate_5yr", { precision: 5, scale:  1 }),
	source: text().default('ODE published'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("graduation_rates_school_year_district_name_key").on(table.schoolYear, table.districtName),
]);

export const testScoresInEducation = education.table("test_scores", {
	id: serial().primaryKey().notNull(),
	schoolYear: text("school_year").notNull(),
	districtName: text("district_name").notNull(),
	subject: text().notNull(),
	gradeLevel: text("grade_level").notNull(),
	proficiencyPct: numeric("proficiency_pct", { precision: 5, scale:  1 }),
	source: text().default('ODE published'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("test_scores_school_year_district_name_subject_grade_level_key").on(table.schoolYear, table.districtName, table.subject, table.gradeLevel),
]);

export const pbjTopLawsuit = pgTable("pbj_top_lawsuit", {
	caseId: text("case_id").primaryKey().notNull(),
	defendantName: text("defendant_name").notNull(),
	plaintiffName: text("plaintiff_name"),
	suitType: text("suit_type"),
	damagesUsd: numeric("damages_usd", { precision: 14, scale:  2 }).notNull(),
	filedDate: date("filed_date"),
	ingestedAt: timestamp("ingested_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("pbj_top_lawsuit_damages_idx").using("btree", table.damagesUsd.desc().nullsFirst().op("numeric_ops")),
]);

export const staffingInEducation = education.table("staffing", {
	id: serial().primaryKey().notNull(),
	schoolYear: text("school_year").notNull(),
	districtName: text("district_name").notNull(),
	enrollment: integer(),
	teachersFte: numeric("teachers_fte", { precision: 8, scale:  1 }),
	pupilTeacherRatio: numeric("pupil_teacher_ratio", { precision: 4, scale:  1 }),
	source: text().default('NCES CCD via Urban Institute'),
}, (table) => [
	unique("staffing_school_year_district_name_key").on(table.schoolYear, table.districtName),
]);

export const housingRents = pgTable("housing_rents", {
	id: serial().primaryKey().notNull(),
	month: date().notNull(),
	zipCode: text("zip_code"),
	zori: numeric(),
}, (table) => [
	index("idx_housing_rents_month").using("btree", table.month.asc().nullsLast().op("date_ops")),
]);

export const rawPayloadsInPerformance = performance.table("raw_payloads", {
	payloadKey: text("payload_key").primaryKey().notNull(),
	payloadKind: text("payload_kind").notNull(),
	sourceUrl: text("source_url").notNull(),
	contentText: text("content_text"),
	contentJson: jsonb("content_json"),
	contentHash: text("content_hash").notNull(),
	fetchedAt: timestamp("fetched_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const ingestRunsInPerformance = performance.table("ingest_runs", {
	id: serial().primaryKey().notNull(),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	status: text().notNull(),
	parserVersion: text("parser_version").notNull(),
	scorecardsRequested: integer("scorecards_requested").default(0),
	scorecardsLoaded: integer("scorecards_loaded").default(0),
	measureInstancesLoaded: integer("measure_instances_loaded").default(0),
	uniqueMeasuresLoaded: integer("unique_measures_loaded").default(0),
	error: text(),
	metadata: jsonb(),
});

export const scorecardsInPerformance = performance.table("scorecards", {
	scorecardId: text("scorecard_id").primaryKey().notNull(),
	title: text().notNull(),
	slug: text().notNull(),
	sourceUrl: text("source_url").notNull(),
	rawPayloadKey: text("raw_payload_key"),
	lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb(),
});

export const containersInPerformance = performance.table("containers", {
	containerId: text("container_id").primaryKey().notNull(),
	scorecardId: text("scorecard_id").notNull(),
	title: text().notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	sourceUrl: text("source_url").notNull(),
	rawPayloadKey: text("raw_payload_key"),
	lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb(),
}, (table) => [
	index("performance_containers_scorecard_idx").using("btree", table.scorecardId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.scorecardId],
			foreignColumns: [scorecardsInPerformance.scorecardId],
			name: "containers_scorecard_id_fkey"
		}).onDelete("cascade"),
]);

export const measuresInPerformance = performance.table("measures", {
	measureId: text("measure_id").primaryKey().notNull(),
	valueId: text("value_id").notNull(),
	title: text().notNull(),
	metricType: text("metric_type").notNull(),
	latestPeriod: text("latest_period"),
	latestActual: text("latest_actual"),
	latestTrendDirection: text("latest_trend_direction"),
	latestTrendTone: text("latest_trend_tone"),
	latestTrendPeriods: integer("latest_trend_periods"),
	polarity: integer(),
	sourceUrl: text("source_url").notNull(),
	additionalDataUrl: text("additional_data_url").notNull(),
	chartData: jsonb("chart_data"),
	files: jsonb(),
	metadata: jsonb(),
	latestChangedAt: timestamp("latest_changed_at", { withTimezone: true, mode: 'string' }),
	lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const measureValuesInPerformance = performance.table("measure_values", {
	id: serial().primaryKey().notNull(),
	measureId: text("measure_id").notNull(),
	timePeriodId: text("time_period_id"),
	timePeriod: text("time_period").notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	actualValue: text("actual_value"),
	targetValue: text("target_value"),
	forecastValue: text("forecast_value"),
	varianceFromTarget: text("variance_from_target"),
	percentage: text(),
	percentChangeFromPrior: text("percent_change_from_prior"),
	baselineChange: text("baseline_change"),
	currentTrendDirection: integer("current_trend_direction"),
	currentTrendPeriods: integer("current_trend_periods"),
	actualValueColor: jsonb("actual_value_color"),
	rawValue: jsonb("raw_value"),
}, (table) => [
	index("performance_measure_values_measure_idx").using("btree", table.measureId.asc().nullsLast().op("int4_ops"), table.sortOrder.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.measureId],
			foreignColumns: [measuresInPerformance.measureId],
			name: "measure_values_measure_id_fkey"
		}).onDelete("cascade"),
]);

export const measureChangesInPerformance = performance.table("measure_changes", {
	id: serial().primaryKey().notNull(),
	runId: integer("run_id"),
	measureId: text("measure_id").notNull(),
	scorecardId: text("scorecard_id"),
	containerId: text("container_id"),
	changeType: text("change_type").notNull(),
	previousPeriod: text("previous_period"),
	previousActual: text("previous_actual"),
	newPeriod: text("new_period"),
	newActual: text("new_actual"),
	changedAt: timestamp("changed_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("performance_measure_changes_measure_idx").using("btree", table.measureId.asc().nullsLast().op("text_ops"), table.changedAt.desc().nullsFirst().op("text_ops")),
	foreignKey({
			columns: [table.measureId],
			foreignColumns: [measuresInPerformance.measureId],
			name: "measure_changes_measure_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.runId],
			foreignColumns: [ingestRunsInPerformance.id],
			name: "measure_changes_run_id_fkey"
		}).onDelete("set null"),
]);

export const fredSeries = pgTable("fred_series", {
	id: serial().primaryKey().notNull(),
	seriesId: text("series_id").notNull(),
	seriesName: text("series_name").notNull(),
	category: text().notNull(),
	date: date().notNull(),
	value: numeric({ precision: 14, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_fred_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("idx_fred_series_id").using("btree", table.seriesId.asc().nullsLast().op("text_ops")),
	unique("fred_series_series_id_date_key").on(table.seriesId, table.date),
]);

export const redfinMarketInHousing = housing.table("redfin_market", {
	id: serial().primaryKey().notNull(),
	zipCode: text("zip_code"),
	periodBegin: date("period_begin"),
	periodEnd: date("period_end"),
	periodDuration: text("period_duration"),
	medianSalePrice: numeric("median_sale_price", { precision: 12, scale:  2 }),
	medianPpsf: numeric("median_ppsf", { precision: 10, scale:  2 }),
	homesSold: integer("homes_sold"),
	newListings: integer("new_listings"),
	inventory: integer(),
	daysOnMarket: integer("days_on_market"),
	avgSaleToList: numeric("avg_sale_to_list", { precision: 6, scale:  4 }),
	soldAboveListPct: numeric("sold_above_list_pct", { precision: 6, scale:  4 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const askResponses = pgTable("ask_responses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	surveySlug: text("survey_slug").notNull(),
	surveyVersion: integer("survey_version").default(1).notNull(),
	answers: jsonb().notNull(),
	cohortId: text("cohort_id"),
	cohortsMatched: jsonb("cohorts_matched").default([]),
	tenure: text(),
	age: text(),
	income: text(),
	channel: text(),
	source: text(),
	completed: boolean().default(true).notNull(),
	ipHash: text("ip_hash"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	clientHash: text("client_hash"),
	durationMs: integer("duration_ms"),
}, (table) => [
	index("ask_responses_channel_idx").using("btree", table.channel.asc().nullsLast().op("text_ops")),
	index("ask_responses_cohort_idx").using("btree", table.cohortId.asc().nullsLast().op("text_ops")),
	index("ask_responses_iphash_idx").using("btree", table.ipHash.asc().nullsLast().op("text_ops")),
	index("ask_responses_survey_idx").using("btree", table.surveySlug.asc().nullsLast().op("text_ops")),
]);

export const facilities = pgTable("facilities", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	category: category().notNull(),
	type: facilityType().notNull(),
	subtype: text(),
	operator: text(),
	funder: text(),
	address: text(),
	city: text().default('Portland'),
	geo: jsonb(),
	phone: text(),
	accessMethod: text("access_method"),
	capacityPublished: boolean("capacity_published").default(false).notNull(),
	capacityCount: integer("capacity_count"),
	capacityUnit: text("capacity_unit"),
	servicesCertified: jsonb("services_certified").default([]),
	populationServed: text("population_served"),
	eligibility: jsonb().notNull(),
	source: text(),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("facilities_category_idx").using("btree", table.category.asc().nullsLast().op("enum_ops")),
	index("facilities_type_idx").using("btree", table.type.asc().nullsLast().op("enum_ops")),
]);

export const facilityContacts = pgTable("facility_contacts", {
	id: serial().primaryKey().notNull(),
	facilityId: text("facility_id").notNull(),
	name: text(),
	email: text(),
	phone: text(),
	updateToken: text("update_token").notNull(),
	active: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.facilityId],
			foreignColumns: [facilities.id],
			name: "facility_contacts_facility_id_facilities_id_fk"
		}).onDelete("cascade"),
	unique("facility_contacts_update_token_unique").on(table.updateToken),
]);

export const placementRequests = pgTable("placement_requests", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	requesterRole: requesterRole("requester_role").notNull(),
	requesterName: text("requester_name"),
	requesterContact: text("requester_contact"),
	requesterWorkerId: integer("requester_worker_id"),
	needTypes: jsonb("need_types").notNull(),
	gender: text(),
	ageBand: text("age_band"),
	insurance: text(),
	location: jsonb(),
	flags: jsonb().default({}),
	notes: text(),
	status: requestStatus().default('new').notNull(),
	matchedFacilityId: text("matched_facility_id"),
}, (table) => [
	foreignKey({
			columns: [table.matchedFacilityId],
			foreignColumns: [facilities.id],
			name: "placement_requests_matched_facility_id_facilities_id_fk"
		}),
	foreignKey({
			columns: [table.requesterWorkerId],
			foreignColumns: [placementWorkers.id],
			name: "placement_requests_requester_worker_id_placement_workers_id_fk"
		}),
]);

export const matches = pgTable("matches", {
	id: serial().primaryKey().notNull(),
	requestId: uuid("request_id").notNull(),
	facilityId: text("facility_id").notNull(),
	score: real().notNull(),
	rank: integer().notNull(),
	status: matchStatus().default('suggested').notNull(),
	holdExpiresAt: timestamp("hold_expires_at", { mode: 'string' }),
	outcome: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("matches_request_idx").using("btree", table.requestId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.facilityId],
			foreignColumns: [facilities.id],
			name: "matches_facility_id_facilities_id_fk"
		}),
	foreignKey({
			columns: [table.requestId],
			foreignColumns: [placementRequests.id],
			name: "matches_request_id_placement_requests_id_fk"
		}).onDelete("cascade"),
]);

export const placementWorkers = pgTable("placement_workers", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	name: text(),
	organization: text(),
	role: requesterRole().default('outreach').notNull(),
	status: workerStatus().default('pending').notNull(),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("placement_workers_email_unique").on(table.email),
]);

export const auditLog = pgTable("audit_log", {
	id: serial().primaryKey().notNull(),
	actorType: text("actor_type").notNull(),
	actorId: text("actor_id"),
	action: text().notNull(),
	entity: text(),
	entityId: text("entity_id"),
	detail: jsonb().default({}),
	at: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("audit_log_at_idx").using("btree", table.at.asc().nullsLast().op("timestamp_ops")),
]);

export const loginTokens = pgTable("login_tokens", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	token: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	usedAt: timestamp("used_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("login_tokens_token_unique").on(table.token),
]);

export const availability = pgTable("availability", {
	id: serial().primaryKey().notNull(),
	facilityId: text("facility_id").notNull(),
	bedType: text("bed_type").default('general').notNull(),
	openCount: integer("open_count"),
	totalCount: integer("total_count"),
	status: availabilityStatus().default('unknown').notNull(),
	method: updateMethod().default('self_report').notNull(),
	updatedBy: text("updated_by"),
	note: text(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	staffedCount: integer("staffed_count"),
}, (table) => [
	index("availability_facility_idx").using("btree", table.facilityId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.facilityId],
			foreignColumns: [facilities.id],
			name: "availability_facility_id_facilities_id_fk"
		}).onDelete("cascade"),
]);

export const availabilityEvents = pgTable("availability_events", {
	id: serial().primaryKey().notNull(),
	facilityId: text("facility_id").notNull(),
	bedType: text("bed_type").default('general').notNull(),
	openCount: integer("open_count"),
	status: availabilityStatus().notNull(),
	method: updateMethod().notNull(),
	reportedBy: text("reported_by"),
	reportedAt: timestamp("reported_at", { mode: 'string' }).defaultNow().notNull(),
	staffedCount: integer("staffed_count"),
}, (table) => [
	foreignKey({
			columns: [table.facilityId],
			foreignColumns: [facilities.id],
			name: "availability_events_facility_id_facilities_id_fk"
		}).onDelete("cascade"),
]);

export const consents = pgTable("consents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	requestId: uuid("request_id"),
	scope: jsonb().notNull(),
	sharedWithFacilityId: text("shared_with_facility_id"),
	method: text().default('verbal').notNull(),
	grantedAt: timestamp("granted_at", { mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	revokedAt: timestamp("revoked_at", { mode: 'string' }),
	recordedByWorkerId: integer("recorded_by_worker_id"),
	notes: text(),
}, (table) => [
	foreignKey({
			columns: [table.recordedByWorkerId],
			foreignColumns: [placementWorkers.id],
			name: "consents_recorded_by_worker_id_placement_workers_id_fk"
		}),
	foreignKey({
			columns: [table.requestId],
			foreignColumns: [placementRequests.id],
			name: "consents_request_id_placement_requests_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.sharedWithFacilityId],
			foreignColumns: [facilities.id],
			name: "consents_shared_with_facility_id_facilities_id_fk"
		}),
]);

export const referralPackets = pgTable("referral_packets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	requestId: uuid("request_id").notNull(),
	matchId: integer("match_id"),
	facilityId: text("facility_id").notNull(),
	consentId: uuid("consent_id").notNull(),
	payload: jsonb().notNull(),
	status: packetStatus().default('draft').notNull(),
	createdByWorkerId: integer("created_by_worker_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("referral_packets_facility_idx").using("btree", table.facilityId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.consentId],
			foreignColumns: [consents.id],
			name: "referral_packets_consent_id_consents_id_fk"
		}),
	foreignKey({
			columns: [table.createdByWorkerId],
			foreignColumns: [placementWorkers.id],
			name: "referral_packets_created_by_worker_id_placement_workers_id_fk"
		}),
	foreignKey({
			columns: [table.facilityId],
			foreignColumns: [facilities.id],
			name: "referral_packets_facility_id_facilities_id_fk"
		}),
	foreignKey({
			columns: [table.matchId],
			foreignColumns: [matches.id],
			name: "referral_packets_match_id_matches_id_fk"
		}),
	foreignKey({
			columns: [table.requestId],
			foreignColumns: [placementRequests.id],
			name: "referral_packets_request_id_placement_requests_id_fk"
		}).onDelete("cascade"),
]);

export const workerSessions = pgTable("worker_sessions", {
	id: serial().primaryKey().notNull(),
	workerId: integer("worker_id").notNull(),
	token: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	revokedAt: timestamp("revoked_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("worker_sessions_token_idx").using("btree", table.token.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.workerId],
			foreignColumns: [placementWorkers.id],
			name: "worker_sessions_worker_id_placement_workers_id_fk"
		}).onDelete("cascade"),
	unique("worker_sessions_token_unique").on(table.token),
]);

export const smsSessions = pgTable("sms_sessions", {
	phoneHash: text("phone_hash").primaryKey().notNull(),
	lang: text().default('en').notNull(),
	lastQuery: jsonb("last_query"),
	offset: integer().default(0).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const dataFlags = pgTable("data_flags", {
	id: serial().primaryKey().notNull(),
	question: text().notNull(),
	metric: text(),
	message: text().notNull(),
	reporterEmail: text("reporter_email"),
	memberId: integer("member_id"),
	status: text().default('new').notNull(),
	resolutionNote: text("resolution_note"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	resolvedAt: timestamp("resolved_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("data_flags_question_idx").using("btree", table.question.asc().nullsLast().op("text_ops")),
	index("data_flags_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "data_flags_member_id_fkey"
		}),
]);

export const recordsRequests = pgTable("records_requests", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	agency: text().notNull(),
	description: text().notNull(),
	requestedData: text("requested_data"),
	status: text().default('planned').notNull(),
	filedAt: date("filed_at"),
	dueAt: date("due_at"),
	resolvedAt: date("resolved_at"),
	outcomeNote: text("outcome_note"),
	resultUrl: text("result_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("records_requests_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	unique("records_requests_title_key").on(table.title),
]);

export const topicProposals = pgTable("topic_proposals", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	memberId: integer("member_id").notNull(),
	status: text().default('open').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("topic_proposals_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "topic_proposals_member_id_fkey"
		}),
]);

export const proposalVotes = pgTable("proposal_votes", {
	proposalId: integer("proposal_id").notNull(),
	memberId: integer("member_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "proposal_votes_member_id_fkey"
		}),
	foreignKey({
			columns: [table.proposalId],
			foreignColumns: [topicProposals.id],
			name: "proposal_votes_proposal_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.proposalId, table.memberId], name: "proposal_votes_pkey"}),
]);

export const measureInstancesInPerformance = performance.table("measure_instances", {
	scorecardId: text("scorecard_id").notNull(),
	containerId: text("container_id").notNull(),
	measureId: text("measure_id").notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => [
	index("performance_measure_instances_measure_idx").using("btree", table.measureId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.containerId],
			foreignColumns: [containersInPerformance.containerId],
			name: "measure_instances_container_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.measureId],
			foreignColumns: [measuresInPerformance.measureId],
			name: "measure_instances_measure_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.scorecardId],
			foreignColumns: [scorecardsInPerformance.scorecardId],
			name: "measure_instances_scorecard_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.scorecardId, table.containerId, table.measureId], name: "measure_instances_pkey"}),
]);

export const ghgEmissionsInEnvironment = environment.table("ghg_emissions", {
	year: smallint().notNull(),
	sector: text().notNull(),
	mtco2E: numeric({ precision: 12, scale:  0 }).notNull(),
	sourceDetail: text("source_detail"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_ghg_year").using("btree", table.year.asc().nullsLast().op("int2_ops")),
	primaryKey({ columns: [table.year, table.sector], name: "ghg_emissions_pkey"}),
	unique("ghg_emissions_year_sector_key").on(table.year, table.sector),
]);

export const metroBusinessApplicationsAnnual = pgTable("metro_business_applications_annual", {
	metroCode: text("metro_code").notNull(),
	year: integer().notNull(),
	applicationsTotal: integer("applications_total").notNull(),
	countiesIncluded: integer("counties_included").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	primaryKey({ columns: [table.metroCode, table.year], name: "metro_business_applications_annual_pkey"}),
]);

export const metroZhviMonthly = pgTable("metro_zhvi_monthly", {
	metroCode: text("metro_code").notNull(),
	year: integer().notNull(),
	month: integer().notNull(),
	zhvi: numeric({ precision: 12, scale:  2 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	primaryKey({ columns: [table.metroCode, table.year, table.month], name: "metro_zhvi_monthly_pkey"}),
]);

export const metroUnemploymentMonthly = pgTable("metro_unemployment_monthly", {
	metroCode: text("metro_code").notNull(),
	year: integer().notNull(),
	month: integer().notNull(),
	rate: numeric({ precision: 5, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	primaryKey({ columns: [table.metroCode, table.year, table.month], name: "metro_unemployment_monthly_pkey"}),
]);

export const metroBusinessFormationQuarterly = pgTable("metro_business_formation_quarterly", {
	metroCode: text("metro_code").notNull(),
	year: integer().notNull(),
	quarter: integer().notNull(),
	applicationsTotal: integer("applications_total"),
	applicationsHighPropensity: integer("applications_high_propensity"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	primaryKey({ columns: [table.metroCode, table.year, table.quarter], name: "metro_business_formation_quarterly_pkey"}),
]);

export const metroEmploymentQuarterly = pgTable("metro_employment_quarterly", {
	metroCode: text("metro_code").notNull(),
	year: integer().notNull(),
	quarter: integer().notNull(),
	establishments: integer(),
	employment: integer(),
	avgWeeklyWage: integer("avg_weekly_wage"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	primaryKey({ columns: [table.metroCode, table.year, table.quarter], name: "metro_employment_quarterly_pkey"}),
]);

export const metroPersonalIncomeAnnual = pgTable("metro_personal_income_annual", {
	metroCode: text("metro_code").notNull(),
	year: integer().notNull(),
	personalIncomeThousands: numeric("personal_income_thousands", { precision: 18, scale:  0 }),
	population: integer(),
	perCapitaIncome: integer("per_capita_income"),
	countiesIncluded: integer("counties_included"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	primaryKey({ columns: [table.metroCode, table.year], name: "metro_personal_income_annual_pkey"}),
]);

export const measureNotesInPerformance = performance.table("measure_notes", {
	measureId: text("measure_id").notNull(),
	noteKey: text("note_key").notNull(),
	noteTitle: text("note_title").notNull(),
	noteHtml: text("note_html"),
	noteText: text("note_text"),
	links: jsonb(),
	lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.measureId],
			foreignColumns: [measuresInPerformance.measureId],
			name: "measure_notes_measure_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.measureId, table.noteKey], name: "measure_notes_pkey"}),
]);

export const metroAcsAnnual = pgTable("metro_acs_annual", {
	metroCode: text("metro_code").notNull(),
	year: integer().notNull(),
	population16Plus: integer("population_16_plus"),
	laborForce: integer("labor_force"),
	unemployedAcs: integer("unemployed_acs"),
	medianHouseholdIncome: integer("median_household_income"),
	lfpRate: numeric("lfp_rate", { precision: 5, scale:  2 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	primaryKey({ columns: [table.metroCode, table.year], name: "metro_acs_annual_pkey"}),
]);
export const mvPermitPhaseSummaryInHousing = housing.materializedView("mv_permit_phase_summary", {	activityType: text("activity_type"),
	permitsAffected: integer("permits_affected"),
	medianDay: integer("median_day"),
	medianStepDuration: integer("median_step_duration"),
}).as(sql`WITH permit_phases AS ( SELECT a.detail_id, a.activity_type, a.days_from_setup, a.days_from_setup - lag(a.days_from_setup) OVER (PARTITION BY a.detail_id ORDER BY a.completed_date, a.days_from_setup) AS step_duration FROM housing.permit_activities a WHERE a.completed_date IS NOT NULL AND a.days_from_setup IS NOT NULL AND a.days_from_setup >= 0 ) SELECT activity_type, count(DISTINCT detail_id)::integer AS permits_affected, round(percentile_cont(0.5::double precision) WITHIN GROUP (ORDER BY (days_from_setup::double precision))::numeric)::integer AS median_day, round(percentile_cont(0.5::double precision) WITHIN GROUP (ORDER BY ( CASE WHEN step_duration > 0 THEN step_duration ELSE NULL::integer END::double precision))::numeric)::integer AS median_step_duration FROM permit_phases GROUP BY activity_type HAVING count(DISTINCT detail_id) >= 100`);

export const mvPermitJourneyByTypeInHousing = housing.materializedView("mv_permit_journey_by_type", {	permitType: text("permit_type"),
	permits: integer(),
	structural: integer(),
	lifeSafety: integer("life_safety"),
	issuance: integer(),
	buildingInsp: integer("building_insp"),
	finalPermit: integer("final_permit"),
}).as(sql`SELECT d.permit_type, count(DISTINCT a.detail_id)::integer AS permits, round(percentile_cont(0.5::double precision) WITHIN GROUP (ORDER BY (a.days_from_setup::double precision)) FILTER (WHERE a.activity_type = 'Structural'::text)::numeric)::integer AS structural, round(percentile_cont(0.5::double precision) WITHIN GROUP (ORDER BY (a.days_from_setup::double precision)) FILTER (WHERE a.activity_type = 'Life Safety'::text)::numeric)::integer AS life_safety, round(percentile_cont(0.5::double precision) WITHIN GROUP (ORDER BY (a.days_from_setup::double precision)) FILTER (WHERE a.activity_type = 'Issuance'::text)::numeric)::integer AS issuance, round(percentile_cont(0.5::double precision) WITHIN GROUP (ORDER BY (a.days_from_setup::double precision)) FILTER (WHERE a.activity_type = 'Building Inspections'::text)::numeric)::integer AS building_insp, round(percentile_cont(0.5::double precision) WITHIN GROUP (ORDER BY (a.days_from_setup::double precision)) FILTER (WHERE a.activity_type = 'Final Permit'::text)::numeric)::integer AS final_permit FROM housing.permit_activities a JOIN housing.permit_details d ON d.detail_id = a.detail_id WHERE a.completed_date IS NOT NULL AND a.days_from_setup >= 0 GROUP BY d.permit_type HAVING count(DISTINCT a.detail_id) >= 200`);

export const mvPermitJourneyTrendInHousing = housing.materializedView("mv_permit_journey_trend", {	period: text(),
	permits: integer(),
	structuralDays: integer("structural_days"),
	issuanceDays: integer("issuance_days"),
	inspectionDays: integer("inspection_days"),
	finalDays: integer("final_days"),
}).as(sql`SELECT to_char(date_trunc('quarter'::text, d.setup_date::timestamp with time zone), 'YYYY-"Q"Q'::text) AS period, count(DISTINCT a.detail_id)::integer AS permits, round(percentile_cont(0.5::double precision) WITHIN GROUP (ORDER BY (a.days_from_setup::double precision)) FILTER (WHERE a.activity_type = 'Structural'::text)::numeric)::integer AS structural_days, round(percentile_cont(0.5::double precision) WITHIN GROUP (ORDER BY (a.days_from_setup::double precision)) FILTER (WHERE a.activity_type = 'Issuance'::text)::numeric)::integer AS issuance_days, round(percentile_cont(0.5::double precision) WITHIN GROUP (ORDER BY (a.days_from_setup::double precision)) FILTER (WHERE a.activity_type = 'Building Inspections'::text)::numeric)::integer AS inspection_days, round(percentile_cont(0.5::double precision) WITHIN GROUP (ORDER BY (a.days_from_setup::double precision)) FILTER (WHERE a.activity_type = 'Final Permit'::text)::numeric)::integer AS final_days FROM housing.permit_activities a JOIN housing.permit_details d ON d.detail_id = a.detail_id WHERE a.completed_date IS NOT NULL AND a.days_from_setup >= 0 AND d.setup_date >= '2019-01-01'::date GROUP BY (to_char(date_trunc('quarter'::text, d.setup_date::timestamp with time zone), 'YYYY-"Q"Q'::text)) HAVING count(DISTINCT a.detail_id) >= 50`);

export const mvPermitSlowestExamplesInHousing = housing.materializedView("mv_permit_slowest_examples", {	rank: integer(),
	detailId: integer("detail_id"),
	permitType: text("permit_type"),
	address: text(),
	daysToIssue: integer("days_to_issue"),
	status: text(),
	activityType: text("activity_type"),
	daysFromSetup: integer("days_from_setup"),
}).as(sql`WITH top_types AS ( SELECT permit_bottleneck_analysis.activity_type FROM housing.permit_bottleneck_analysis ORDER BY permit_bottleneck_analysis.avg_days_to_complete DESC LIMIT 5 ), ranked_permits AS ( SELECT a.detail_id, d.permit_type, d.address, d.days_to_issue, d.status, a.activity_type, a.days_from_setup, row_number() OVER (PARTITION BY a.activity_type ORDER BY a.days_from_setup DESC) AS rn FROM housing.permit_activities a JOIN housing.permit_details d ON d.detail_id = a.detail_id JOIN top_types t ON t.activity_type = a.activity_type WHERE a.days_from_setup IS NOT NULL AND (a.activity_status = ANY (ARRAY['Approved'::text, 'Completed'::text])) ) SELECT rn::integer AS rank, detail_id, permit_type, address, days_to_issue, status, activity_type, days_from_setup FROM ranked_permits WHERE rn <= 3`);

export const mvPermitCorrectionStatsInHousing = housing.materializedView("mv_permit_correction_stats", {	id: integer(),
	totalPermits: integer("total_permits"),
	withCorrections: integer("with_corrections"),
	avgRounds: doublePrecision("avg_rounds"),
	earliestActivity: text("earliest_activity"),
	latestActivity: text("latest_activity"),
}).as(sql`SELECT 1 AS id, ( SELECT count(DISTINCT permit_activities.detail_id)::integer AS count FROM housing.permit_activities) AS total_permits, ( SELECT count(DISTINCT permit_activities.detail_id)::integer AS count FROM housing.permit_activities WHERE permit_activities.activity_name ~~* '%correction%'::text) AS with_corrections, ( SELECT round(avg(sub.rounds), 2)::double precision AS round FROM ( SELECT count(*)::integer AS rounds FROM housing.permit_activities WHERE permit_activities.activity_name ~~* '%correction%'::text GROUP BY permit_activities.detail_id) sub) AS avg_rounds, ( SELECT min(permit_activities.last_activity_date)::text AS min FROM housing.permit_activities WHERE permit_activities.last_activity_date IS NOT NULL) AS earliest_activity, ( SELECT max(permit_activities.last_activity_date)::text AS max FROM housing.permit_activities WHERE permit_activities.last_activity_date IS NOT NULL) AS latest_activity`);

export const mvPermitBottleneckTrendInHousing = housing.materializedView("mv_permit_bottleneck_trend", {	quarter: text(),
	activityType: text("activity_type"),
	medianDays: integer("median_days"),
}).as(sql`SELECT to_char(date_trunc('quarter'::text, completed_date::timestamp with time zone), 'YYYY-"Q"Q'::text) AS quarter, activity_type, round(percentile_cont(0.5::double precision) WITHIN GROUP (ORDER BY (days_from_setup::double precision)))::integer AS median_days FROM housing.permit_activities WHERE completed_date IS NOT NULL AND days_from_setup IS NOT NULL AND days_from_setup > 0 AND (activity_type = ANY (ARRAY['Fire Inspections'::text, 'Electrical Inspections'::text, 'Plumbing Inspections'::text, 'Mechanical Inspections'::text, 'Plan Review PW'::text])) GROUP BY (to_char(date_trunc('quarter'::text, completed_date::timestamp with time zone), 'YYYY-"Q"Q'::text)), activity_type HAVING count(*) >= 5`);