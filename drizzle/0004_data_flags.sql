-- Data flags: "report an issue with this number" submissions from the public
CREATE TABLE IF NOT EXISTS "data_flags" (
  "id" serial PRIMARY KEY,
  "question" text NOT NULL,
  "metric" text,
  "message" text NOT NULL,
  "reporter_email" text,
  "member_id" integer REFERENCES "members"("id"),
  "status" text NOT NULL DEFAULT 'new',
  "resolution_note" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "resolved_at" timestamptz
);

CREATE INDEX IF NOT EXISTS "data_flags_status_idx" ON "data_flags" ("status");
CREATE INDEX IF NOT EXISTS "data_flags_question_idx" ON "data_flags" ("question");
