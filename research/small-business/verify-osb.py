#!/usr/bin/env python3
"""Check the full transcription without resolving the source's discrepancies."""
import csv,json
from pathlib import Path
p=Path(__file__).resolve().parent
x=json.loads((p/'data/osb-year-one.json').read_text())
assert [len(x[k]) for k in ['industry','intake','services']]==[16,7,5]
assert sum(r['percent'] or 0 for r in x['industry'])==102
assert x['industry'][-1]=={'label':'Agriculture','percent':None,'display':'<1%'}
assert sum(r['percent'] for r in x['intake'])==100
assert sum(r['percent'] for r in x['services'])==100
assert sum(r['businesses'] for r in x['districts'])==581
assert x['unique_businesses']-581==178
assert [r['events'] for r in x['districts']]==[34,27,33,32]
assert sum(r['events'] for r in x['districts'])==126
assert x['events_reported']-126==10
with (p/'data/osb-year-one.csv').open() as f:rows=list(csv.DictReader(f))
assert len(rows)==38
assert next(r for r in rows if r['label']=='Agriculture')['value']==''
assert all(r['page'] and r['source_id']=='osb-2026' for r in rows)
with (p/'web-claims.tsv').open() as f:claims=list(csv.DictReader(f,delimiter='\t'))
assert all(any(c['id']==f'w{i}' and c['locator'] and c['limitation'] for c in claims) for i in range(17,25))
print(json.dumps({'status':'verified','industry_categories':16,'inquiry_channels':7,'service_categories':5,'csv_rows':38,'business_gap':178,'event_gap':10,'agriculture_exact_share':None}))
