-- Contact form fallback storage (previously created at runtime by the route)
CREATE TABLE IF NOT EXISTS "contact_submissions" (
  "id" uuid PRIMARY KEY,
  "submitted_at" timestamptz NOT NULL DEFAULT now(),
  "delivery" text NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "organization" text,
  "topic" text,
  "message" text NOT NULL,
  "client_ip" text,
  "user_agent" text,
  "raw_payload" jsonb NOT NULL
);

CREATE INDEX IF NOT EXISTS "contact_submissions_submitted_at_idx"
  ON "contact_submissions" ("submitted_at" DESC);
