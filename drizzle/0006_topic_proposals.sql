-- Member-proposed dashboard topics and one-member-one-vote support
CREATE TABLE IF NOT EXISTS "topic_proposals" (
  "id" serial PRIMARY KEY,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "member_id" integer NOT NULL REFERENCES "members"("id"),
  "status" text NOT NULL DEFAULT 'open',
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "proposal_votes" (
  "proposal_id" integer NOT NULL REFERENCES "topic_proposals"("id") ON DELETE CASCADE,
  "member_id" integer NOT NULL REFERENCES "members"("id"),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("proposal_id", "member_id")
);

CREATE INDEX IF NOT EXISTS "topic_proposals_status_idx" ON "topic_proposals" ("status");
