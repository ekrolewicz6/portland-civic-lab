-- Interactive filters start from the published run; history remains intact.
CREATE INDEX IF NOT EXISTS fire_records_run_kind_year
ON fire.records(run_id,(data->>'kind'),((data->>'year')::integer))
INCLUDE(west,east,south,north,source_id,public);
