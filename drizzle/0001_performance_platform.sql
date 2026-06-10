CREATE SCHEMA IF NOT EXISTS performance;

CREATE TABLE IF NOT EXISTS performance.ingest_runs (
  id serial PRIMARY KEY,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  finished_at timestamp with time zone,
  status text NOT NULL,
  parser_version text NOT NULL,
  scorecards_requested integer DEFAULT 0,
  scorecards_loaded integer DEFAULT 0,
  measure_instances_loaded integer DEFAULT 0,
  unique_measures_loaded integer DEFAULT 0,
  error text,
  metadata jsonb
);

CREATE TABLE IF NOT EXISTS performance.raw_payloads (
  payload_key text PRIMARY KEY,
  payload_kind text NOT NULL,
  source_url text NOT NULL,
  content_text text,
  content_json jsonb,
  content_hash text NOT NULL,
  fetched_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS performance.scorecards (
  scorecard_id text PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL,
  source_url text NOT NULL,
  raw_payload_key text,
  last_fetched_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb
);

CREATE TABLE IF NOT EXISTS performance.containers (
  container_id text PRIMARY KEY,
  scorecard_id text NOT NULL REFERENCES performance.scorecards(scorecard_id) ON DELETE CASCADE,
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  source_url text NOT NULL,
  raw_payload_key text,
  last_fetched_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb
);

CREATE TABLE IF NOT EXISTS performance.measures (
  measure_id text PRIMARY KEY,
  value_id text NOT NULL,
  title text NOT NULL,
  metric_type text NOT NULL,
  latest_period text,
  latest_actual text,
  latest_trend_direction text,
  latest_trend_tone text,
  latest_trend_periods integer,
  polarity integer,
  source_url text NOT NULL,
  additional_data_url text NOT NULL,
  chart_data jsonb,
  files jsonb,
  metadata jsonb,
  latest_changed_at timestamp with time zone,
  last_fetched_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS performance.measure_instances (
  scorecard_id text NOT NULL REFERENCES performance.scorecards(scorecard_id) ON DELETE CASCADE,
  container_id text NOT NULL REFERENCES performance.containers(container_id) ON DELETE CASCADE,
  measure_id text NOT NULL REFERENCES performance.measures(measure_id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY (scorecard_id, container_id, measure_id)
);

CREATE TABLE IF NOT EXISTS performance.measure_values (
  id serial PRIMARY KEY,
  measure_id text NOT NULL REFERENCES performance.measures(measure_id) ON DELETE CASCADE,
  time_period_id text,
  time_period text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  actual_value text,
  target_value text,
  forecast_value text,
  variance_from_target text,
  percentage text,
  percent_change_from_prior text,
  baseline_change text,
  current_trend_direction integer,
  current_trend_periods integer,
  actual_value_color jsonb,
  raw_value jsonb
);

CREATE TABLE IF NOT EXISTS performance.measure_notes (
  measure_id text NOT NULL REFERENCES performance.measures(measure_id) ON DELETE CASCADE,
  note_key text NOT NULL,
  note_title text NOT NULL,
  note_html text,
  note_text text,
  links jsonb,
  last_fetched_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (measure_id, note_key)
);

CREATE TABLE IF NOT EXISTS performance.measure_changes (
  id serial PRIMARY KEY,
  run_id integer REFERENCES performance.ingest_runs(id) ON DELETE SET NULL,
  measure_id text NOT NULL REFERENCES performance.measures(measure_id) ON DELETE CASCADE,
  scorecard_id text,
  container_id text,
  change_type text NOT NULL,
  previous_period text,
  previous_actual text,
  new_period text,
  new_actual text,
  changed_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS performance_containers_scorecard_idx ON performance.containers(scorecard_id);
CREATE INDEX IF NOT EXISTS performance_measure_instances_measure_idx ON performance.measure_instances(measure_id);
CREATE INDEX IF NOT EXISTS performance_measure_values_measure_idx ON performance.measure_values(measure_id, sort_order);
CREATE INDEX IF NOT EXISTS performance_measure_changes_measure_idx ON performance.measure_changes(measure_id, changed_at DESC);
