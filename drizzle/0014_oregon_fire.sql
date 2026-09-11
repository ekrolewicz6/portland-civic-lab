-- Additive, independently runnable migration. Public reads go through the app.
CREATE SCHEMA IF NOT EXISTS fire;
CREATE TABLE IF NOT EXISTS fire.sources (
  id text PRIMARY KEY, active_run uuid, definition jsonb NOT NULL,
  last_success timestamptz, last_error text
);
CREATE TABLE IF NOT EXISTS fire.import_runs (
  id uuid PRIMARY KEY, source_id text NOT NULL REFERENCES fire.sources(id),
  status text NOT NULL CHECK (status IN ('running','complete','failed')),
  started_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
  checkpoint jsonb NOT NULL DEFAULT '{}', metadata jsonb NOT NULL DEFAULT '{}',
  fetched_count integer NOT NULL DEFAULT 0, accepted_count integer NOT NULL DEFAULT 0,
  held_count integer NOT NULL DEFAULT 0, error text,
  lease_until timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS fire_one_running_import ON fire.import_runs(source_id) WHERE status='running';
CREATE TABLE IF NOT EXISTS fire.records (
  run_id uuid NOT NULL REFERENCES fire.import_runs(id), id text NOT NULL,
  source_id text NOT NULL REFERENCES fire.sources(id), native_id text NOT NULL,
  data jsonb NOT NULL, attributes jsonb NOT NULL, geometry jsonb NOT NULL,
  map_geometry jsonb NOT NULL, checksum text NOT NULL,
  west double precision NOT NULL, south double precision NOT NULL,
  east double precision NOT NULL, north double precision NOT NULL,
  public boolean NOT NULL DEFAULT true,
  PRIMARY KEY (run_id,id)
);
CREATE INDEX IF NOT EXISTS fire_records_viewport ON fire.records(run_id,west,east,south,north);
CREATE INDEX IF NOT EXISTS fire_records_id ON fire.records(id);
CREATE INDEX IF NOT EXISTS fire_records_source ON fire.records(source_id,run_id);
CREATE INDEX IF NOT EXISTS fire_records_kind_year ON fire.records((data->>'kind'),((data->>'year')::integer),run_id);
CREATE INDEX IF NOT EXISTS fire_records_irwin ON fire.records((data->>'irwinId'),run_id) WHERE data->>'irwinId' IS NOT NULL;
CREATE INDEX IF NOT EXISTS fire_records_year ON fire.records(run_id,((data->>'year')::integer));
CREATE TABLE IF NOT EXISTS fire.links (
  record_id text NOT NULL, related_id text NOT NULL, evidence_url text NOT NULL,
  relationship text NOT NULL, verified_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(record_id,related_id,relationship)
);
CREATE TABLE IF NOT EXISTS fire.explanations (
  id text PRIMARY KEY, record_id text, title text NOT NULL, body text NOT NULL,
  source_url text NOT NULL, publication_approved boolean NOT NULL DEFAULT false,
  reviewed_at timestamptz, attribution text NOT NULL
);
CREATE TABLE IF NOT EXISTS fire.reference (
  id text PRIMARY KEY, data jsonb NOT NULL, source_url text NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now()
);
-- No anonymous direct table access, including archived and held records.
ALTER TABLE fire.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire.import_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire.records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire.explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire.reference ENABLE ROW LEVEL SECURITY;
CREATE TABLE IF NOT EXISTS fire.rejections (
  run_id uuid NOT NULL REFERENCES fire.import_runs(id), native_id text NOT NULL,
  attributes jsonb NOT NULL, reason text NOT NULL,
  PRIMARY KEY(run_id,native_id)
);
ALTER TABLE fire.rejections ENABLE ROW LEVEL SECURITY;
