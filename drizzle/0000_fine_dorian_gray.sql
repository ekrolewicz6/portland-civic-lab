CREATE SCHEMA "content";
--> statement-breakpoint
CREATE TABLE "business_formation_monthly" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" date NOT NULL,
	"new_registrations" integer,
	"cancellations" integer,
	"net_formation" integer
);
--> statement-breakpoint
CREATE TABLE "business_licenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_name" text,
	"address" text,
	"naics_code" text,
	"naics_description" text,
	"date_added" date,
	"lat" double precision,
	"lon" double precision,
	"zip_code" text
);
--> statement-breakpoint
CREATE TABLE "climate_action_status_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"action_id" text NOT NULL,
	"status" text NOT NULL,
	"status_date" date NOT NULL,
	"narrative" text,
	"source" text
);
--> statement-breakpoint
CREATE TABLE "climate_bureau_scorecard" (
	"id" serial PRIMARY KEY NOT NULL,
	"bureau_code" text NOT NULL,
	"bureau_name" text NOT NULL,
	"total_actions" integer DEFAULT 0 NOT NULL,
	"achieved_actions" integer DEFAULT 0 NOT NULL,
	"ongoing_actions" integer DEFAULT 0 NOT NULL,
	"delayed_actions" integer DEFAULT 0 NOT NULL,
	"cross_bureau_actions" integer DEFAULT 0 NOT NULL,
	"pcef_funding_received" numeric,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "climate_bureau_scorecard_bureau_code_unique" UNIQUE("bureau_code")
);
--> statement-breakpoint
CREATE TABLE "climate_emissions_trajectory" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"is_target" boolean DEFAULT false NOT NULL,
	"target_type" text,
	"total_mtco2e" numeric,
	"electricity_mtco2e" numeric,
	"buildings_mtco2e" numeric,
	"transportation_mtco2e" numeric,
	"waste_mtco2e" numeric,
	"industry_mtco2e" numeric,
	"other_mtco2e" numeric,
	"population_thousands" numeric
);
--> statement-breakpoint
CREATE TABLE "climate_finance_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"fiscal_year" text NOT NULL,
	"source" text NOT NULL,
	"allocation_amount" numeric,
	"action_count" integer
);
--> statement-breakpoint
CREATE TABLE "climate_workplan_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"action_id" text NOT NULL,
	"title" text NOT NULL,
	"sector" text NOT NULL,
	"category" text NOT NULL,
	"lead_bureaus" text[] NOT NULL,
	"is_declaration_priority" boolean DEFAULT false NOT NULL,
	"fiscal_year" text,
	"resource_gap" text,
	"is_pcef_funded" boolean DEFAULT false NOT NULL,
	"is_multi_bureau" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'ongoing' NOT NULL,
	"description" text,
	"external_partners" text,
	"cobenefits" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "climate_workplan_actions_action_id_unique" UNIQUE("action_id")
);
--> statement-breakpoint
CREATE TABLE "dashboard_cache" (
	"question" text PRIMARY KEY NOT NULL,
	"data" jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "downtown_foot_traffic" (
	"id" serial PRIMARY KEY NOT NULL,
	"week" date NOT NULL,
	"pct_of_2019" numeric,
	"day_of_week" text
);
--> statement-breakpoint
CREATE TABLE "downtown_vacancy" (
	"id" serial PRIMARY KEY NOT NULL,
	"quarter" date NOT NULL,
	"office_vacancy_pct" numeric,
	"retail_vacancy_pct" numeric
);
--> statement-breakpoint
CREATE TABLE "housing_permits" (
	"id" serial PRIMARY KEY NOT NULL,
	"permit_num" text NOT NULL,
	"permit_type" text,
	"project_address" text,
	"valuation" numeric,
	"application_date" date,
	"issued_date" date,
	"final_date" date,
	"status" text,
	"processing_days" integer,
	CONSTRAINT "housing_permits_permit_num_unique" UNIQUE("permit_num")
);
--> statement-breakpoint
CREATE TABLE "housing_pipeline_monthly" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" date NOT NULL,
	"units_in_pipeline" integer,
	"avg_processing_months" numeric
);
--> statement-breakpoint
CREATE TABLE "housing_rents" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" date NOT NULL,
	"zip_code" text,
	"zori" numeric
);
--> statement-breakpoint
CREATE TABLE "insights" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text,
	"text" text,
	"severity" text,
	"rule_name" text,
	"metric_value" double precision,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "migration_census" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"population" integer,
	"change" integer
);
--> statement-breakpoint
CREATE TABLE "migration_water_monthly" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" date NOT NULL,
	"activations" integer,
	"deactivations" integer,
	"net" integer,
	"zip_code" text
);
--> statement-breakpoint
CREATE TABLE "pbj_business_monthly" (
	"month" date PRIMARY KEY NOT NULL,
	"new_businesses" integer DEFAULT 0 NOT NULL,
	"bankruptcies" integer DEFAULT 0 NOT NULL,
	"lawsuits" integer DEFAULT 0 NOT NULL,
	"tax_liens" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pbj_distress_entity" (
	"entity_name" text PRIMARY KEY NOT NULL,
	"categories" text[] NOT NULL,
	"category_count" integer NOT NULL,
	"last_seen_week" date,
	"ingested_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pbj_real_estate_monthly" (
	"month" date PRIMARY KEY NOT NULL,
	"entity_buyers" integer DEFAULT 0 NOT NULL,
	"person_buyers" integer DEFAULT 0 NOT NULL,
	"total_volume_usd" numeric(14, 2) DEFAULT '0' NOT NULL,
	"deal_count" integer DEFAULT 0 NOT NULL,
	"entity_share_pct" numeric(5, 2),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pbj_serial_buyer" (
	"buyer_name" text PRIMARY KEY NOT NULL,
	"buyer_type" text,
	"deal_count" integer NOT NULL,
	"total_volume_usd" numeric(14, 2),
	"zip_count" integer,
	"last_seen_week" date,
	"ingested_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pbj_top_lawsuit" (
	"case_id" text PRIMARY KEY NOT NULL,
	"defendant_name" text NOT NULL,
	"plaintiff_name" text,
	"suit_type" text,
	"damages_usd" numeric(14, 2) NOT NULL,
	"filed_date" date,
	"ingested_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pbj_zip_investment" (
	"zip_code" text PRIMARY KEY NOT NULL,
	"permit_count" integer DEFAULT 0,
	"permit_value_usd" numeric(14, 2) DEFAULT '0',
	"re_deal_count" integer DEFAULT 0,
	"re_volume_usd" numeric(14, 2) DEFAULT '0',
	"new_business_count" integer DEFAULT 0,
	"total_investment_usd" numeric(14, 2) DEFAULT '0',
	"ingested_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pcef_allocations" (
	"id" serial PRIMARY KEY NOT NULL,
	"fiscal_year" text NOT NULL,
	"recipient" text NOT NULL,
	"recipient_type" text NOT NULL,
	"amount" numeric NOT NULL,
	"program_area" text
);
--> statement-breakpoint
CREATE TABLE "pcef_interest_diversions" (
	"id" serial PRIMARY KEY NOT NULL,
	"fiscal_year" text NOT NULL,
	"amount_diverted" numeric NOT NULL,
	"destination" text,
	"notes" text,
	CONSTRAINT "pcef_interest_diversions_fiscal_year_unique" UNIQUE("fiscal_year")
);
--> statement-breakpoint
CREATE TABLE "program_pcb_summary" (
	"id" serial PRIMARY KEY NOT NULL,
	"as_of" date NOT NULL,
	"total_certified" integer,
	"survival_rate_1yr" numeric,
	"jobs_created" integer,
	"credits_issued" numeric
);
--> statement-breakpoint
CREATE TABLE "content"."progress_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"issue_date" date NOT NULL,
	"slug" text NOT NULL,
	"summary" text,
	"cover_image_url" text,
	"published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "progress_reports_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "content"."report_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"report_id" integer NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"content" text NOT NULL,
	"section_order" integer NOT NULL,
	"section_type" text DEFAULT 'article',
	"data_query" text,
	"data_snapshot" jsonb
);
--> statement-breakpoint
CREATE TABLE "safety_crime_monthly" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" date NOT NULL,
	"category" text NOT NULL,
	"offense_type" text NOT NULL,
	"count" integer NOT NULL,
	"rate_per_1000" numeric,
	"neighborhood" text
);
--> statement-breakpoint
CREATE TABLE "safety_graffiti_monthly" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" date NOT NULL,
	"count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "safety_response_times" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" date NOT NULL,
	"priority" text NOT NULL,
	"median_minutes" numeric
);
--> statement-breakpoint
CREATE TABLE "tax_comparison" (
	"id" serial PRIMARY KEY NOT NULL,
	"city" text NOT NULL,
	"income_level" integer NOT NULL,
	"effective_rate" numeric,
	"federal" numeric,
	"state" numeric,
	"local" numeric,
	"other" numeric
);
--> statement-breakpoint
ALTER TABLE "content"."report_sections" ADD CONSTRAINT "report_sections_report_id_progress_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "content"."progress_reports"("id") ON DELETE no action ON UPDATE no action;