ALTER TABLE safety.boec_911_monthly
ADD COLUMN IF NOT EXISTS pct_answered_20sec NUMERIC(5,1);
