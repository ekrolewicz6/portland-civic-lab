-- Shared-auth canonical account layer.
--
-- 1. account_public_id: opaque UUID exposed to other Civic Lab apps instead
--    of the sequential members.id.
-- 2. account_identities: audit map of every WorkOS user id ever linked to a
--    member (covers environment consolidation and verified-email relinking).
--
-- Idempotent: safe to re-run.

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS account_public_id uuid NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS members_account_public_id_key
  ON members (account_public_id);

CREATE TABLE IF NOT EXISTS account_identities (
  id serial PRIMARY KEY,
  member_id integer NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  workos_user_id text NOT NULL UNIQUE,
  -- how this identity got linked: 'primary' (normal sign-in),
  -- 'email_relink' (verified-email match to an existing member),
  -- 'migration' (environment consolidation backfill)
  source text NOT NULL DEFAULT 'primary',
  linked_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS account_identities_member_id_idx
  ON account_identities (member_id);

-- Seed identities from the current members table.
INSERT INTO account_identities (member_id, workos_user_id, source)
SELECT id, workos_user_id, 'primary' FROM members
ON CONFLICT (workos_user_id) DO NOTHING;
