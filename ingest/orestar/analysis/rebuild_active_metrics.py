"""One-time migration: put recomputable candidate facts in the active database."""
from __future__ import annotations

import hashlib
import json
import os

import duckdb

from active_finance import build
from common import ROOT, write_json

active = ROOT / 'research/campaign-finance/active-snapshot-manifest.json'
previous = json.loads(active.read_text())
source = ROOT / previous['database']
with source.open('rb') as handle:
    if hashlib.file_digest(handle, 'sha256').hexdigest() != previous['database_sha256']:
        raise ValueError('Active database hash mismatch')
snapshot = f"orestar-20250101-{previous['end'].replace('-', '')}-{hashlib.sha256((previous['database_sha256'] + 'active-finance-v1').encode()).hexdigest()[:12]}"
work = ROOT / 'runtime-data/orestar-analysis' / snapshot
output, temp = work / 'analysis-merged.duckdb', work / 'analysis-merged.tmp.duckdb'
if output.exists() or temp.exists():
    raise ValueError('Metrics migration already staged; inspect before retrying')
work.mkdir(parents=True, exist_ok=True)
con = duckdb.connect(str(temp))
try:
    con.execute("SET threads=2; SET memory_limit='2GB'")
    con.execute(f"ATTACH '{str(source).replace(chr(39), chr(39)*2)}' AS prior (READ_ONLY)")
    for table in ('transactions', 'committees', 'entities', 'aliases', 'transfer_candidates', 'transfers'):
        con.execute(f'CREATE TABLE {table} AS SELECT * FROM prior.{table}')
    con.execute('CREATE UNIQUE INDEX transaction_pk ON transactions(transaction_id)')
    con.execute('CREATE INDEX filer_idx ON transactions(committee_id)')
    con.execute('CREATE INDEX entity_idx ON transactions(entity_id)')
    build(con, snapshot, previous['start'], previous['end'])
    con.execute('CREATE TABLE metadata AS SELECT ? AS snapshot,? AS semantics_version,? AS identity_version',
                [snapshot, previous['semantics_version'], previous['identity_version']])
    con.execute('DETACH prior')
    con.execute('CHECKPOINT')
finally:
    con.close()
os.replace(temp, output)
with output.open('rb') as handle:
    digest = hashlib.file_digest(handle, 'sha256').hexdigest()
manifest = {**previous, 'version': 3, 'snapshot': snapshot, 'base_snapshot': previous['snapshot'],
            'database': str(output.relative_to(ROOT)), 'database_sha256': digest,
            'checks': {**previous['checks'], 'transaction_derived_candidate_facts': 'passed'}}
write_json(work / 'manifest.json', manifest)
write_json(active, manifest)
print(json.dumps({'snapshot': snapshot, 'rows': manifest['rows'], 'candidate_facts': 18}, indent=2))
