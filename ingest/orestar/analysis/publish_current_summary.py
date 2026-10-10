"""Publish dated accounting totals from the verified, privacy-minimized active ledger.

This does not rebuild identity research, address maps, balances or event analyses.
"""
import csv
import hashlib
import json
from pathlib import Path
import duckdb

ROOT = Path(__file__).resolve().parents[3]
PUBLIC = ROOT / 'public/data/campaign-finance/current'

def digest(path):
    return hashlib.file_digest(path.open('rb'), 'sha256').hexdigest()

def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')

def evidence(name, rows):
    path = PUBLIC / name
    with path.open('w', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        for row in rows:
            writer.writerow({key: "'" + value if isinstance(value, str) and value.lstrip().startswith(('=', '+', '-', '@')) else value for key, value in row.items()})
    return {'url': '/data/campaign-finance/current/' + name, 'rows': len(rows), 'sha256': digest(path)}

def run():
    manifest = json.loads((ROOT / 'server-data/campaign-finance/manifest.json').read_text())
    source = ROOT / manifest['database']
    assert digest(source) == manifest['database_sha256']
    db = duckdb.connect(str(source), read_only=True)
    def query(sql):
        result = db.execute(sql)
        fields = [item[0] for item in result.description]
        return [dict(zip(fields, row)) for row in result.fetchall()]
    bases = query('SELECT basis,count(*) AS records,sum(amount_cents)::BIGINT AS amount_cents FROM transactions GROUP BY basis ORDER BY basis')
    committees = query("SELECT committee_id,max(committee_name) AS name,count(*) AS records,coalesce(sum(amount_cents) FILTER (WHERE basis='cash_contribution'),0)::BIGINT AS cash_contributions_cents,coalesce(sum(amount_cents) FILTER (WHERE basis='cash_payment'),0)::BIGINT AS cash_payments_cents FROM transactions GROUP BY committee_id ORDER BY cash_contributions_cents DESC,committee_id")
    disclosure = query("SELECT family,basis,count(*) AS records,sum(amount_cents)::BIGINT AS amount_cents FROM transactions WHERE is_disclosure_category OR identity_status='unknown' GROUP BY family,basis ORDER BY family,basis")
    facts = {cid: json.loads(value) for cid, value in db.execute('SELECT committee_id,facts_json FROM candidate_finance_facts').fetchall()}
    links = json.loads((ROOT / 'src/lib/campaign-finance/candidate-facts.json').read_text())['links']
    rows = []
    for link in links:
        if link['status'] != 'reviewed' or link['committeeId'] not in facts:
            continue
        f = facts[link['committeeId']]
        category = lambda key: next((row['cents'] for row in f['sources'] if row['key'] == key), 0)
        row = {'snapshot': manifest['snapshot'], 'through': manifest['end'], 'committee_id': link['committeeId'], 'candidate': link['candidateName'], 'race_id': link['raceId'], 'cash_cents': f['cashCents'], 'cash_records': f['cashRecords'], 'public_cents': f['publicCents'], 'individual_cents': category('individual'), 'unidentified_cents': category('unidentified'), 'other_cents': f['nonmatchingCents'] - category('individual') - category('unidentified'), 'payment_cents': f['bases']['cash_payment']['cents']}
        assert row['cash_cents'] == sum(row[key] for key in ['public_cents','individual_cents','unidentified_cents','other_cents'])
        rows.append(row)
    assert len(rows) == len(facts) == 18
    assert sum(row['records'] for row in bases) == manifest['rows']
    assert sum(row['cash_contributions_cents'] for row in committees) == next(row['amount_cents'] for row in bases if row['basis'] == 'cash_contribution')
    PUBLIC.mkdir(parents=True, exist_ok=True)
    files = {key: evidence(name, data) for key, name, data in [('bases','financial-bases.csv',bases),('committees','committees.csv',committees),('disclosure','disclosure.csv',disclosure),('candidates','candidate-funding.csv',rows)]}
    output = {key: manifest[key] for key in ('snapshot','start','end','rows','completeness_verified')}
    output.update({'filers':len(committees),'bases':bases,'top_committees':committees[:10],'disclosure':disclosure,'evidence':files})
    write_json(ROOT / 'src/lib/campaign-finance/current-summary.json', output)
    write_json(PUBLIC / 'summary.json', output)
    db.close()
    print(json.dumps({'snapshot':manifest['snapshot'],'rows':manifest['rows'],'filers':len(committees),'candidateRows':len(rows),'evidence':files},indent=2))

if __name__ == '__main__':
    run()
