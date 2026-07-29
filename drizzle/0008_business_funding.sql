-- Business funding finder: business profiles, co-owners, and the curated
-- funding catalog PCL matches them against.
--
-- No EIN/SSN/bank columns by design — identity-sensitive data stays out
-- until an actual submission requires it.

CREATE TABLE IF NOT EXISTS "businesses" (
  "id" serial PRIMARY KEY,
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "legal_name" text,
  "entity_type" text,
  "naics_code" text,
  "description" text,
  "address_street" text,
  "address_city" text DEFAULT 'Portland',
  "address_state" text DEFAULT 'OR',
  "address_zip" text,
  "neighborhood" text,
  "website" text,
  "year_founded" integer,
  "employee_count" integer,
  "revenue_band" text,
  "ownership_attributes" jsonb,
  "certifications" jsonb,
  "mission_tags" jsonb,
  "claimed" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "business_members" (
  "business_id" integer NOT NULL REFERENCES "businesses"("id") ON DELETE CASCADE,
  "member_id" integer NOT NULL REFERENCES "members"("id"),
  "role" text NOT NULL DEFAULT 'owner',
  "title" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("business_id", "member_id")
);

CREATE TABLE IF NOT EXISTS "business_invites" (
  "id" serial PRIMARY KEY,
  "business_id" integer NOT NULL REFERENCES "businesses"("id") ON DELETE CASCADE,
  "email" text NOT NULL,
  "role" text NOT NULL DEFAULT 'co_owner',
  "token" text NOT NULL UNIQUE,
  "invited_by_member_id" integer NOT NULL REFERENCES "members"("id"),
  "status" text NOT NULL DEFAULT 'pending',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "accepted_at" timestamptz,
  "expires_at" timestamptz
);

CREATE TABLE IF NOT EXISTS "funding_opportunities" (
  "id" serial PRIMARY KEY,
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "funder" text NOT NULL,
  "level" text NOT NULL,
  "category" text NOT NULL DEFAULT 'grant',
  "amount_min" integer,
  "amount_max" integer,
  "value_type" text NOT NULL DEFAULT 'one_time',
  "unit_label" text,
  "effort_level" integer,
  "success_probability" text,
  "deadline" date,
  "rolling" boolean NOT NULL DEFAULT false,
  "url" text,
  "description" text,
  "eligibility" jsonb,
  "verification_status" text NOT NULL DEFAULT 'needs_verification',
  "source_note" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "opportunity_matches" (
  "id" serial PRIMARY KEY,
  "business_id" integer NOT NULL REFERENCES "businesses"("id") ON DELETE CASCADE,
  "opportunity_id" integer NOT NULL REFERENCES "funding_opportunities"("id") ON DELETE CASCADE,
  "fit_score" integer,
  "fit_rationale" text,
  "status" text NOT NULL DEFAULT 'identified',
  "status_note" text,
  "amount_requested" integer,
  "amount_awarded" integer,
  "application_draft" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "business_members_member_idx" ON "business_members" ("member_id");
CREATE INDEX IF NOT EXISTS "business_invites_token_idx" ON "business_invites" ("token");
CREATE INDEX IF NOT EXISTS "funding_opportunities_verification_idx" ON "funding_opportunities" ("verification_status");
CREATE INDEX IF NOT EXISTS "opportunity_matches_business_idx" ON "opportunity_matches" ("business_id");
CREATE UNIQUE INDEX IF NOT EXISTS "opportunity_matches_unique" ON "opportunity_matches" ("business_id", "opportunity_id");
