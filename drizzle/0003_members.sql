-- Membership (WorkOS AuthKit)
CREATE TABLE IF NOT EXISTS "members" (
  "id" serial PRIMARY KEY,
  "workos_user_id" text NOT NULL UNIQUE,
  "email" text NOT NULL UNIQUE,
  "first_name" text,
  "last_name" text,
  "avatar_url" text,
  "role" text NOT NULL DEFAULT 'member',
  "status" text NOT NULL DEFAULT 'active',
  "neighborhood" text,
  "interests" jsonb,
  "joined_at" timestamptz NOT NULL DEFAULT now(),
  "last_seen_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "members_email_idx" ON "members" ("email");
