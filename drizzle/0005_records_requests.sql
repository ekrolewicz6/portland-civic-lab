-- Public records requests the Lab plans, files, and tracks publicly
CREATE TABLE IF NOT EXISTS "records_requests" (
  "id" serial PRIMARY KEY,
  "title" text NOT NULL UNIQUE,
  "agency" text NOT NULL,
  "description" text NOT NULL,
  "requested_data" text,
  "status" text NOT NULL DEFAULT 'planned',
  "filed_at" date,
  "due_at" date,
  "resolved_at" date,
  "outcome_note" text,
  "result_url" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "records_requests_status_idx" ON "records_requests" ("status");

-- Seed: the Lab's own documented data gaps become the first tracked requests
INSERT INTO "records_requests" ("title", "agency", "description", "requested_data", "status")
VALUES
  (
    '911 call answer and dispatch times, monthly detail',
    'Bureau of Emergency Communications (BOEC)',
    'The safety dashboard currently hand-encodes response times from the BOEC director''s report PDFs. Machine-readable monthly data would let us track emergency response performance automatically and accurately.',
    'Monthly call volumes, answer times (including 20-second answer rate), and dispatch times by priority level, 2019-present, in CSV or any machine-readable format.',
    'planned'
  ),
  (
    'Shelter capacity and nightly utilization data',
    'Joint Office of Homeless Services (JOHS)',
    'The homelessness dashboard cannot report shelter utilization because the data behind JOHS''s public Tableau dashboard is not downloadable. The underlying data would show whether shelter capacity is meeting need.',
    'Nightly (or weekly) shelter bed capacity, occupancy, and turn-away counts by shelter type, 2022-present, in CSV or any machine-readable format.',
    'planned'
  )
ON CONFLICT ("title") DO NOTHING;
