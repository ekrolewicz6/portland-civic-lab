"""Independently reconcile headline figures against the immutable database."""
import csv
import json
from decimal import Decimal
import duckdb
from common import *

def run():
    manifest=json.loads((WORK/'manifest.json').read_text())
    con=duckdb.connect(str(ROOT/manifest['database']),read_only=True)
    con.execute("SET threads=2; SET memory_limit='1GB'")
    s=json.loads((WORK/'summary.json').read_text())
    e=json.loads((RESEARCH/'enrichment.json').read_text())
    findings=json.loads((RESEARCH/'findings.json').read_text())
    one=lambda sql,params=[]:con.execute(sql,params).fetchone()[0]
    checks={}
    assert one('SELECT count(*) FROM transactions')==316926
    assert one('SELECT count(DISTINCT committee_id) FROM transactions')==1888
    checks['population']='316926 current rows; 1888 filers'
    cash=one("SELECT sum(amount_cents) FROM transactions WHERE basis='cash_contribution'")
    assert cash==sum(x['amount_cents'] for x in s['bases'] if x['basis']=='cash_contribution')
    checks['cash_contributions_cents']=cash
    large=con.execute("SELECT amount_cents,committee_id,transaction_date,basis FROM transactions WHERE transaction_id='5816290'").fetchone()
    assert large==(1000000000,'23285','2026-09-16','cash_contribution')
    month=one("SELECT sum(amount_cents) FROM transactions WHERE basis='cash_contribution' AND transaction_date BETWEEN '2026-09-01' AND '2026-09-27'")
    without=one("SELECT sum(amount_cents) FROM transactions WHERE basis='cash_contribution' AND transaction_date BETWEEN '2026-09-01' AND '2026-09-27' AND transaction_id<>'5816290'")
    assert month-large[0]==without
    checks['september']={'cents':month,'without_specified_record_cents':without,'record_share':large[0]/month}
    accounts=[]
    for id in ['4792','19050']:
        row=next(x for x in e['profiles'][id]['accountSummaries'] if x['year']==2026)
        assert row['beginning_cash_cents']+row['official_net_cash_change_cents']==row['ending_cash_cents']
        receipts=one("SELECT sum(amount_cents) FROM transactions WHERE committee_id=? AND basis='cash_contribution' AND transaction_date>='2026-01-01'",[id])
        assert receipts==row['official_cash_contributions_cents']
        payments=one("SELECT sum(amount_cents) FROM transactions WHERE committee_id=? AND basis='cash_payment' AND transaction_date>='2026-01-01'",[id])
        assert row['official_cash_payments_cents']-payments==row['payment_difference_cents']
        accounts.append(row)
    checks['cash_positions']={'ratio':accounts[0]['ending_cash_cents']/accounts[1]['ending_cash_cents'],'retained_payment_difference_cents':accounts[1]['payment_difference_cents']}
    receipts=list(csv.DictReader((PUBLIC/'public-matching-receipts.csv').open()))
    ids=[x['transaction_id'] for x in receipts]
    assert len(ids)==len(set(ids))
    public_total=0
    for row in receipts:
        amount,committee,basis=con.execute('SELECT amount_cents,committee_id,basis FROM transactions WHERE transaction_id=?',[row['transaction_id']]).fetchone()
        assert amount==int(row['amount_cents']) and committee==row['committee_id'] and basis=='cash_contribution'
        public_total+=amount
    programme=e['portlandPublicFinancing']
    assert public_total==sum(x['orestar_reported_matching_cents'] for x in programme)
    for row in programme:
        committee_cash=one("SELECT sum(amount_cents) FROM transactions WHERE committee_id=? AND basis='cash_contribution'",[row['committee_id']])
        assert committee_cash==row['orestar_cash_contributions_cents']
        assert row['orestar_reported_matching_cents']/committee_cash==row['classified_public_share']>0.5
    total=sum(x['orestar_cash_contributions_cents'] for x in programme)
    checks['public_matching']={'committees':len(programme),'numerator_cents':public_total,'denominator_cents':total,'share':public_total/total}
    questions=json.loads((RESEARCH/'questions.json').read_text())
    assert len(questions['questions'])==44
    assert all(x['status'] in ('answered','qualified','currently unanswerable') for x in questions['questions'])
    for f in findings['findings']:
        for name in f['evidence']:
            assert '/' not in name and (PUBLIC/name).is_file(), (f['id'],name)
    for name in ['findings','questions','gaps','enrichment','robustness','independent-spending']:
        assert digest(RESEARCH/(name+'.json'))==digest(PUBLIC/(name+'.json'))==digest(ROOT/'src/lib/campaign-finance'/(name+'.json'))
    checks['publication']='All finding evidence exists; public, research and application copies agree'
    result={'snapshot':SNAPSHOT,'status':'passed','checks':checks,'limits':'Validates calculations and links, not independent truth of reported transactions or completion of the research programme.'}
    for path in [RESEARCH/'findings-verification.json',PUBLIC/'findings-verification.json']:write_json(path,result)
    print(json.dumps(result,indent=2));con.close()

if __name__=='__main__':run()
