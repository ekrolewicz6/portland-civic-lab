-- Derived lookup, not a replacement for versioned source records. Preserve
-- each record's last successful observation even when it disappears.
CREATE TABLE IF NOT EXISTS fire.rolling_latest (
  record_id text PRIMARY KEY,
  run_id uuid NOT NULL,
  source_id text NOT NULL REFERENCES fire.sources(id),
  FOREIGN KEY(run_id,record_id) REFERENCES fire.records(run_id,id)
);
CREATE INDEX IF NOT EXISTS fire_rolling_latest_source ON fire.rolling_latest(source_id);
ALTER TABLE fire.rolling_latest ENABLE ROW LEVEL SECURITY;
INSERT INTO fire.rolling_latest(record_id,run_id,source_id)
SELECT DISTINCT ON(r.id) r.id,r.run_id,r.source_id
FROM fire.records r JOIN fire.import_runs i ON i.id=r.run_id
WHERE i.status='complete' AND r.source_id IN ('pnw','odf-2','odf-3','wfigs','wfigs-perimeters')
ORDER BY r.id,i.completed_at DESC
ON CONFLICT(record_id) DO UPDATE SET run_id=excluded.run_id,source_id=excluded.source_id;

-- Keep the derived lookup correct for both old and new importer deployments.
CREATE OR REPLACE FUNCTION fire.update_rolling_lookup() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.id IN ('pnw','odf-2','odf-3','wfigs','wfigs-perimeters')
     AND NEW.active_run IS NOT NULL
     AND EXISTS(SELECT 1 FROM fire.import_runs WHERE id=NEW.active_run AND status='complete') THEN
    INSERT INTO fire.rolling_latest(record_id,run_id,source_id)
    SELECT id,run_id,source_id FROM fire.records WHERE run_id=NEW.active_run
    ON CONFLICT(record_id) DO UPDATE SET run_id=excluded.run_id,source_id=excluded.source_id;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS fire_rolling_lookup_published ON fire.sources;
CREATE TRIGGER fire_rolling_lookup_published AFTER UPDATE OF active_run ON fire.sources
FOR EACH ROW EXECUTE FUNCTION fire.update_rolling_lookup();
