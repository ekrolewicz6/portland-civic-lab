"""Precompute candidate facts for public profiles. No browser or acquisition.
Only reviewed committee/race links are publishable. Integer cents throughout.
"""
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path
import csv, hashlib, json
import duckdb
from common import ROOT, WORK, SNAPSHOT

DEST=ROOT/'public/data/campaign-finance/candidates'
LABELS={'public':'City matching funds (reviewed receipts)','unidentified':'Unidentified / aggregate reporting','individual':'Itemized individuals','committee':'Political committees','business':'Business entities','labor':'Labor organizations','self_family':'Candidate and immediate family','other':'Other identified source types'}
TYPE={'Individual':'individual','Political Committee':'committee','Business Entity':'business','Labor Organization':'labor','Candidate & Immediate Family':'self_family'}
STATES=set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY AS GU MP PR VI'.split())
def rows(path):
    with path.open() as f:return list(csv.DictReader(f))
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def run():
    DEST.mkdir(parents=True,exist_ok=True)
    manifest=json.loads((WORK/'manifest.json').read_text())
    crosspath=ROOT/'research/campaign-finance/committee-race-crosswalk.json'
    links=[r for r in json.loads(crosspath.read_text())['links'] if r['status']=='reviewed']
    assert len({(r['raceId'],r['candidateId'],r['committeeId']) for r in links})==len(links)
    match={r['transaction_id'] for r in rows(ROOT/'public/data/campaign-finance/public-matching-receipts.csv')}
    accounts={(r['committee_id'],r['year']):r for r in rows(ROOT/'public/data/campaign-finance/account-summaries.csv')}
    con=duckdb.connect(str(ROOT/manifest['database']),read_only=True);con.execute("SET threads=2; SET memory_limit='2GB'")
    ids=sorted({r['committeeId'] for r in links})
    cur=con.execute('SELECT transaction_id,committee_id,committee_name,transaction_date,filed_date,basis,amount_cents,entity_id,entity_name,identity_status,is_disclosure_category,book_type,city,state FROM transactions WHERE committee_id IN ('+','.join('?' for _ in ids)+') ORDER BY transaction_date,transaction_id',ids)
    cols=[c[0] for c in cur.description];bycid=defaultdict(list)
    for rr in cur.fetchall():
        r=dict(zip(cols,rr));bycid[r['committee_id']].append(r)
    output={}
    for cid in ids:
        rr=bycid[cid];cash=[r for r in rr if r['basis']=='cash_contribution'];categories={k:{'key':k,'label':v,'cents':0,'records':0} for k,v in LABELS.items()};bases=defaultdict(lambda:{'cents':0,'records':0});sources=defaultdict(list);weekly=defaultdict(int)
        geo={k:{'key':k,'label':v,'cents':0,'records':0} for k,v in [('portland','Reported Portland, Oregon'),('other_oregon','Other reported Oregon locations'),('outside_oregon','Outside Oregon (reported state)'),('unknown','Location unknown / aggregate')]}
        months={f'{y}-{m:02}':{'month':f'{y}-{m:02}','cashCents':0,'publicCents':0,'nonmatchingCents':0,'loanCents':0,'inKindCents':0} for y in [2025,2026] for m in range(1,13) if f'{y}-{m:02}'<='2026-09'}
        for r in rr:
            v=r['amount_cents'];bases[r['basis']]['cents']+=v;bases[r['basis']]['records']+=1;month=months[r['transaction_date'][:7]]
            if r['basis']=='loan_received':month['loanCents']+=v
            if r['basis']=='noncash_support':month['inKindCents']+=v
            if r['basis']!='cash_contribution':continue
            pub=r['transaction_id'] in match;hidden=r['is_disclosure_category'] or r['identity_status']=='unknown'
            cat='public' if pub else 'unidentified' if hidden else TYPE.get(r['book_type'],'other')
            categories[cat]['cents']+=v;categories[cat]['records']+=1;month['cashCents']+=v;month['publicCents' if pub else 'nonmatchingCents']+=v
            if not pub:
                state=(r['state'] or '').strip().upper();city=(r['city'] or '').strip().upper()
                place='unknown' if hidden or state not in STATES or (state=='OR' and not city) else 'portland' if state=='OR' and city=='PORTLAND' else 'other_oregon' if state=='OR' else 'outside_oregon'
                geo[place]['cents']+=v;geo[place]['records']+=1
                dt=date.fromisoformat(r['transaction_date']);wk=(dt-timedelta(days=dt.weekday())).isoformat();weekly[wk]+=v
                if not hidden:sources[r['entity_id']].append(r)
        donorrows=[]
        for eid,gifts in sources.items():
            donorrows.append({'id':eid,'name':gifts[0]['entity_name'].strip(),'bookType':gifts[0]['book_type'],'identityStatus':gifts[0]['identity_status'],'cents':sum(r['amount_cents'] for r in gifts),'records':len(gifts),'distinctDates':len({r['transaction_date'] for r in gifts}),'firstDate':gifts[0]['transaction_date'],'lastDate':gifts[-1]['transaction_date']})
        donorrows.sort(key=lambda r:(-r['cents'],r['name'],r['id']))
        individual=[r for r in donorrows if r['bookType']=='Individual']
        account=accounts.get((cid,'2026'));accountout=None
        if account:
            accountout={k:int(account[v]) for k,v in [('openingCashCents','beginning_cash_cents'),('endingCashCents','ending_cash_cents'),('outstandingLoanCents','outstanding_loans_cents'),('payableCents','accounts_payable_cents'),('personalExpenditureCents','outstanding_personal_expenditures_cents')]}
            accountout.update(year=2026,source=account['source'],retrievedAt=account['retrieved_at'],reconciliation=account['status'])
        best=sorted(((k,v) for k,v in weekly.items() if k>='2026-01-01'),key=lambda x:(-x[1],x[0]))
        peak=None if not best else {'start':best[0][0],'end':(date.fromisoformat(best[0][0])+timedelta(days=6)).isoformat(),'cents':best[0][1],'provisional':best[0][0]>'2026-09-07'}
        path=DEST/(cid+'-cash-contributions.csv')
        with path.open('w',newline='') as f:
            fields=['snapshot','transaction_id','committee_id','transaction_date','filed_date','amount_cents','funding_category','entity_id','reported_source','identity_status','book_type','reported_city','reported_state'];w=csv.DictWriter(f,fieldnames=fields);w.writeheader()
            for r in cash:
                pub=r['transaction_id'] in match;hidden=r['is_disclosure_category'] or r['identity_status']=='unknown';cat='public' if pub else 'unidentified' if hidden else TYPE.get(r['book_type'],'other')
                obj=dict(snapshot=SNAPSHOT,transaction_id=r['transaction_id'],committee_id=cid,transaction_date=r['transaction_date'],filed_date=r['filed_date'],amount_cents=r['amount_cents'],funding_category=cat,entity_id=r['entity_id'],reported_source=r['entity_name'],identity_status=r['identity_status'],book_type=r['book_type'],reported_city=r['city'],reported_state=r['state'])
                w.writerow({k:("'"+v if isinstance(v,str) and v.lstrip().startswith(('=','+','-','@')) else v) for k,v in obj.items()})
        cashsum=sum(r['amount_cents'] for r in cash);public=categories['public']['cents'];nonmatching=cashsum-public
        assert sum(c['cents'] for c in categories.values())==cashsum
        assert sum(c['records'] for c in categories.values())==len(cash)
        assert sum(g['cents'] for g in geo.values())==nonmatching
        assert sum(m['cashCents'] for m in months.values())==cashsum
        assert sum(d['cents'] for d in donorrows)+categories['unidentified']['cents']==nonmatching
        output[cid]={'committeeId':cid,'committeeName':rr[0]['committee_name'] if rr else None,'observedRecords':len(rr),'cashCents':cashsum,'cashRecords':len(cash),'publicCents':public,'nonmatchingCents':nonmatching,'sources':list(categories.values()),'geography':list(geo.values()),'bases':dict(bases),'visibleIndividualGroups':len(individual),'repeatIndividualGroups':sum(d['distinctDates']>1 for d in individual),'topSources':donorrows[:10],'visibleSourceGroups':len(donorrows),'monthly':list(months.values()),'peak2026':peak,'latestCashDate':max((r['transaction_date'] for r in cash),default=None),'account':accountout,'evidenceUrl':'/data/campaign-finance/candidates/'+path.name,'evidenceSha256':sha(path)}
    publication={'version':'candidate-finance-facts-v1','snapshot':SNAPSHOT,'start':manifest['start'],'end':manifest['end'],'sourceDatabaseSha256':manifest['database_sha256'],'crosswalkSha256':sha(crosspath),'links':links,'committees':output,'definitions':{'cash':'Gross reported cash contributions, including reviewed City matching payments; before refunds. Loans and noncash support are separate.','nonmatching':'Cash contributions other than reviewed City matching transaction IDs. Includes unidentified, organizational and self/family receipts; not exclusively individual money.','sources':'Exclusive source categories: reviewed matching first, disclosure/unknown next, then reported book type.','geography':'Reported counterparty city/state on nonmatching cash receipts; aggregate categories and unrecognized states stay unknown. Portland postal locality is not a city-boundary or district-residency test.','donors':'Conservative record groups, not verified unique people. Aggregate labels are excluded. Repeat means different reported dates to this committee.','window':'January 1, 2025–September 27, 2026; not a full election cycle. November–December 2024 missing; recent activity provisional.'}}
    target=ROOT/'src/lib/campaign-finance/candidate-facts.json';target.write_text(json.dumps(publication,indent=2)+'\n')
    (DEST/'facts.json').write_text(json.dumps(publication,indent=2)+'\n')
    print(json.dumps({'committees':len(output),'reviewedLinks':len(links),'factsBytes':target.stat().st_size,'records':sum(r['observedRecords'] for r in output.values()),'categoryGeographyAndMonthlyReconciliation':'passed'}))
    con.close()
if __name__=='__main__':run()
