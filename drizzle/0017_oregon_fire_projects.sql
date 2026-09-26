-- Public-source editorial catalog. Private interviews never enter these tables.
CREATE TABLE IF NOT EXISTS fire.projects (
  id text NOT NULL, version text NOT NULL, data jsonb NOT NULL,
  publication_approved boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT false, imported_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, version), CHECK(jsonb_typeof(data)='object')
);
CREATE UNIQUE INDEX IF NOT EXISTS fire_active_project ON fire.projects(id) WHERE active;
CREATE TABLE IF NOT EXISTS fire.project_evidence (
  project_id text NOT NULL, version text NOT NULL, id text NOT NULL,
  data jsonb NOT NULL, publication_approved boolean NOT NULL DEFAULT false,
  PRIMARY KEY(project_id,version,id), FOREIGN KEY(project_id,version) REFERENCES fire.projects(id,version)
);
CREATE TABLE IF NOT EXISTS fire.project_items (
  project_id text NOT NULL, version text NOT NULL, id text NOT NULL,
  kind text NOT NULL CHECK(kind IN ('activity','observation','cost','media','claim')),
  data jsonb NOT NULL, publication_approved boolean NOT NULL DEFAULT false,
  PRIMARY KEY(project_id,version,kind,id), FOREIGN KEY(project_id,version) REFERENCES fire.projects(id,version)
);
CREATE TABLE IF NOT EXISTS fire.match_candidates (
  record_id text NOT NULL, related_id text NOT NULL, basis jsonb NOT NULL,
  status text NOT NULL DEFAULT 'candidate' CHECK(status IN ('candidate','verified','rejected')),
  evidence_url text, reviewed_at timestamptz,
  PRIMARY KEY(record_id,related_id), CHECK(record_id<>related_id)
);
ALTER TABLE fire.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire.project_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire.project_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire.match_candidates ENABLE ROW LEVEL SECURITY;
