-- Funding catalogue freshness.
--
-- funding_opportunities already carried verification_status, but nothing
-- recorded WHEN a programme was last confirmed against its live source, and
-- nothing surfaced it. A benefits directory that quietly ages is worse than no
-- directory: it sends people to grants that closed, and the first dead link
-- costs the trust that every subsequent recommendation depends on.
--
-- verified_at is the date a human last opened the URL and confirmed the
-- programme still exists on the stated terms. link_checked_at is cheaper and
-- automated — it only means the page still resolves. They are deliberately
-- separate: a live URL is not evidence the programme is still open.
--
-- Idempotent; safe to re-run.

ALTER TABLE funding_opportunities
  ADD COLUMN IF NOT EXISTS verified_at date,
  ADD COLUMN IF NOT EXISTS link_checked_at timestamptz,
  ADD COLUMN IF NOT EXISTS link_status text;

COMMENT ON COLUMN funding_opportunities.verified_at IS
  'Date a human last confirmed this programme against its live source. NULL means never verified — render it as unverified, do not assume current.';
COMMENT ON COLUMN funding_opportunities.link_checked_at IS
  'Last automated link check. Confirms the URL resolves; says nothing about whether the programme is still open.';
COMMENT ON COLUMN funding_opportunities.link_status IS
  'ok | redirect | not_found | error | unreachable';

-- Anything already marked verified must have gained that status at some point,
-- but we do not know when. Leave verified_at NULL rather than inventing a date:
-- a fabricated freshness date is precisely the failure this column exists to
-- prevent.

CREATE INDEX IF NOT EXISTS funding_opportunities_verified_at_idx
  ON funding_opportunities (verified_at NULLS FIRST);
