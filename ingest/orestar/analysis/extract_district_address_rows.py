"""Private-only stdout bridge for local address matching; do not publish output."""
import json
import duckdb
from common import ROOT, WORK, SNAPSHOT

facts=json.loads((ROOT/'src/lib/campaign-finance/candidate-facts.json').read_text())
assert facts['snapshot']==SNAPSHOT
ids=sorted(row['committeeId'] for row in facts['links'] if row['status']=='reviewed' and row['raceId'] in ('portland-district-3','portland-district-4'))
assert len(ids)==17
manifest=json.loads((WORK/'manifest.json').read_text())
con=duckdb.connect(str(ROOT/manifest['database']),read_only=True)
con.execute("SET threads=2; SET memory_limit='2GB'")
query="""SELECT t.transaction_id,t.committee_id,t.amount_cents,t.is_disclosure_category,t.identity_status,
         json_extract_string(r.source_record_json,'$."Addr Line1"') AS address,
         json_extract_string(r.source_record_json,'$.City') AS city,
         json_extract_string(r.source_record_json,'$.State') AS state,
         json_extract_string(r.source_record_json,'$.Zip') AS zip
         FROM transactions t LEFT JOIN read_parquet(?) r USING(transaction_id)
         WHERE t.basis='cash_contribution' AND t.committee_id IN ("""+','.join('?' for _ in ids)+')'
rows=con.execute(query,[str(WORK/'original-records-private.parquet'),*ids]).fetchall()
con.close()
assert len(rows)==3940
print(json.dumps(rows,separators=(',',':')))
