"""Read-only derived evidence for the district investigation; cents remain integers.
Run after investigation.py and portland_investigation.py. No acquisition or writes
to the immutable source database. Uses standard library only.
"""
from __future__ import annotations
import csv, hashlib, json, math
from collections import defaultdict, Counter
from datetime import date, timedelta
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
BASE=ROOT/'research/campaign-finance/investigation'
OUT=BASE/'portland'
def read(path):
    with path.open() as f: return list(csv.DictReader(f))
def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def write(name, rows):
    assert rows
    p=OUT/(name+'.csv')
    with p.open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0])); w.writeheader()
        for row in rows:
            w.writerow({k:("'"+v if isinstance(v,str) and v.lstrip().startswith(('=','+','-','@')) else v) for k,v in row.items()})
    return {'file':p.name,'rows':len(rows),'sha256':digest(p)}
def quantile(v,p):
    if not v: return None
    v=sorted(v); x=(len(v)-1)*p; i=int(x); return v[i]+(v[min(i+1,len(v)-1)]-v[i])*(x-i)

def run():
    manifest=json.loads((OUT/'analysis.json').read_text()); names=manifest['names']; districts=manifest['districts']
    match={r['transaction_id'] for r in read(ROOT/'public/data/campaign-finance/public-matching-receipts.csv')}
    tx=read(OUT/'transactions.csv')
    for r in tx:
        r['amount_cents']=int(r['amount_cents']); r['public']=r['transaction_id'] in match
        r['disclosure']=r['is_disclosure_category'].lower()=='true'
    bycid=defaultdict(list); refunds=defaultdict(list); gifts=defaultdict(list)
    for r in tx:
        bycid[r['committee_id']].append(r)
        if r['basis']=='contribution_refund': refunds[(r['entity_id'],r['committee_id'])].append(r)
        if r['basis']=='cash_contribution' and not r['public'] and not r['disclosure'] and r['identity_status']!='unknown': gifts[(r['entity_id'],r['committee_id'])].append(r)
    ledger=[]
    for (eid,cid),rr in sorted(gifts.items()):
        rf=refunds[(eid,cid)]; gross=sum(r['amount_cents'] for r in rr); returned=sum(r['amount_cents'] for r in rf)
        ledger.append(dict(entity_id=eid,reported_name=rr[0]['entity_name'].strip(),identity_status=rr[0]['identity_status'],book_type=rr[0]['book_type'],committee_id=cid,candidate=names[cid],district=districts[cid],contribution_records=len(rr),distinct_reported_dates=len(set(r['transaction_date'] for r in rr)),gross_cents=gross,observed_refund_cents=returned,gross_less_observed_refunds_cents=gross-returned,first_date=min(r['transaction_date'] for r in rr),last_date=max(r['transaction_date'] for r in rr),gifts_2025=sum(r['transaction_date']<'2026' for r in rr),gross_2025_cents=sum(r['amount_cents'] for r in rr if r['transaction_date']<'2026'),gifts_2026=sum(r['transaction_date']>='2026' for r in rr),gross_2026_cents=sum(r['amount_cents'] for r in rr if r['transaction_date']>='2026'),dated_gifts=' | '.join(f"{r['transaction_date']}: ${r['amount_cents']/100:.2f} [ID {r['transaction_id']}]" for r in rr),contribution_transaction_ids='|'.join(r['transaction_id'] for r in rr),refund_transaction_ids='|'.join(r['transaction_id'] for r in rf)))
    tables=[write('donor-candidate-complete-ledger',ledger)]
    # The overlap test counts strict Individual fingerprints. Sum only those
    # groups' receipts to the two campaigns in each pair; do not add across
    # matrix cells because a multi-candidate donor appears in multiple pairs.
    individual_ledger=defaultdict(dict)
    for row in ledger:
        if row['book_type']=='Individual':individual_ledger[row['entity_id']][row['committee_id']]=row
    individual_sets={cid:{eid for eid,recipients in individual_ledger.items() if cid in recipients} for cid in names}
    pair_amounts=[]
    for pair in read(OUT/'donor-overlap-tests.csv'):
        a,b=pair['committee_a'],pair['committee_b'];shared=sorted(individual_sets[a]&individual_sets[b])
        gross_a=sum(int(individual_ledger[eid][a]['gross_cents']) for eid in shared)
        gross_b=sum(int(individual_ledger[eid][b]['gross_cents']) for eid in shared)
        refunds=sum(int(individual_ledger[eid][cid]['observed_refund_cents']) for eid in shared for cid in (a,b))
        assert len(shared)==int(pair['shared']), (a,b,'overlap mismatch')
        pair_amounts.append(dict(committee_a=a,committee_b=b,candidate_a=names[a],candidate_b=names[b],shared_groups=len(shared),gross_to_a_cents=gross_a,gross_to_b_cents=gross_b,pair_gross_cents=gross_a+gross_b,observed_refunds_cents=refunds,gross_less_observed_refunds_cents=gross_a+gross_b-refunds,shared_entity_ids='|'.join(shared)))
    assert len(pair_amounts)==136
    tables.append(write('shared-donor-pair-amounts',pair_amounts))
    byentity=defaultdict(list)
    for row in ledger: byentity[row['entity_id']].append(row)
    portfolios=[]
    for eid,rr in byentity.items():
        dates={x['transaction_date'] for (g,c),rows in gifts.items() if g==eid for x in rows}
        portfolios.append(dict(entity_id=eid,reported_name=rr[0]['reported_name'],identity_status=rr[0]['identity_status'],book_type=rr[0]['book_type'],candidate_count=len(rr),candidate_portfolio=' | '.join(f"{r['candidate']}: ${r['gross_cents']/100:.2f}, {r['contribution_records']} records / {r['distinct_reported_dates']} dates" for r in rr),contribution_records=sum(r['contribution_records'] for r in rr),distinct_reported_dates=len(dates),candidate_date_combinations=sum(r['distinct_reported_dates'] for r in rr),gross_cents=sum(r['gross_cents'] for r in rr),observed_refund_cents=sum(r['observed_refund_cents'] for r in rr),gross_less_observed_refunds_cents=sum(r['gross_less_observed_refunds_cents'] for r in rr),repeat_records_same_candidate=any(r['contribution_records']>1 for r in rr),repeat_dates_same_candidate=any(r['distinct_reported_dates']>1 for r in rr),first_date=min(dates),last_date=max(dates)))
    portfolios.sort(key=lambda r:(-r['gross_cents'],r['entity_id']))
    tables.append(write('donor-portfolios-complete',portfolios))
    profiles={r['committee_id']:r for r in read(BASE/'fundraising-profiles.csv') if r['period']=='2025-2026' and r['committee_id'] in names}
    accounts={r['committee_id']:r for r in read(ROOT/'public/data/campaign-finance/account-summaries.csv') if r['year']=='2026' and r['committee_id'] in names}
    weeks=read(OUT/'candidate-weeks.csv'); best=read(OUT/'strongest-weeks.csv'); cand=[]; payees=[]; daily=[]; bases=[]
    for cid,rr in bycid.items():
        cc=[r for r in rr if r['basis']=='cash_contribution']; nm=[r for r in cc if not r['public']]; pr=profiles[cid]
        item=[r for r in nm if r['book_type']=='Individual' and not r['disclosure'] and r['identity_status']!='unknown']
        ind=defaultdict(list)
        for r in item:ind[r['entity_id']].append(r)
        vals=[sum(x['amount_cents'] for x in v) for v in ind.values()]; isum=sum(vals)
        cash=sum(r['amount_cents'] for r in cc); pub=sum(r['amount_cents'] for r in cc if r['public']); unid=sum(r['amount_cents'] for r in nm if r['disclosure'] or r['identity_status']=='unknown')
        # Current-version filing lags are explicitly not original disclosure lags.
        lags=[float(r['filed_lag_days']) for r in nm if r['filed_lag_days'] and float(r['filed_lag_days'])>=0]
        bestw=next(r for r in best if r['committee_id']==cid and r['basis']=='nonmatching_cents' and r['rank']=='1')
        ac=accounts[cid]
        row=dict(committee_id=cid,candidate=names[cid],district=districts[cid],cash_cents=cash,public_cents=pub,nonmatching_cents=cash-pub,unidentified_cents=unid,visible_individual_cents=isum,other_visible_nonmatching_cents=cash-pub-unid-isum,public_share=pub/cash if cash else None,unidentified_share_nonmatching=unid/(cash-pub) if cash>pub else None,individual_groups=len(ind),repeat_record_individual_groups=sum(len(v)>1 for v in ind.values()),repeat_date_individual_groups=sum(len({x['transaction_date'] for x in v})>1 for v in ind.values()),individual_top10_share=sum(sorted(vals,reverse=True)[:10])/isum if isum else None,individual_effective_groups=isum**2/sum(v*v for v in vals) if isum else None,first_nonmatching_date=min(r['transaction_date'] for r in nm) if nm else None,last_nonmatching_date=max(r['transaction_date'] for r in nm) if nm else None,current_version_lag_p50_days=quantile(lags,.5),current_version_lag_p90_days=quantile(lags,.9),cash_payment_cents=sum(r['amount_cents'] for r in rr if r['basis']=='cash_payment'),refund_cents=sum(r['amount_cents'] for r in rr if r['basis']=='contribution_refund'),inkind_cents=sum(r['amount_cents'] for r in rr if r['basis']=='noncash_support'),loan_receipts_cents=sum(r['amount_cents'] for r in rr if r['basis']=='loan_received'),best_2026_nonmatching_week=bestw['week_start'],best_week_cents=int(bestw['cents']),best_week_unidentified_cents=int(bestw['unidentified_cents']),best_week_provisional=bestw['provisional']=='True',official_2026_beginning_cash_cents=int(ac['beginning_cash_cents']),official_ending_cash_cents=int(ac['ending_cash_cents']),official_loans_cents=int(ac['outstanding_loans_cents']),official_personal_expenditures_cents=int(ac['outstanding_personal_expenditures_cents']),official_payables_cents=int(ac['accounts_payable_cents']),official_source=ac['source'],official_retrieved_at=ac['retrieved_at'],official_reconciliation=ac['status'])
        assert cash==int(pr['cash_cents']) and pub==int(pr['public_cents']) and isum==int(pr['individual_cents'])
        cand.append(row)
        bypay=defaultdict(list); bydate=defaultdict(list); bybasis=defaultdict(list)
        for r in rr:
            bybasis[r['basis']].append(r)
            if r['basis']=='cash_payment':bypay[r['entity_id']].append(r)
        for r in nm:bydate[r['transaction_date']].append(r)
        for eid,v in bypay.items():payees.append(dict(committee_id=cid,candidate=names[cid],entity_id=eid,reported_payee=v[0]['entity_name'],cash_payment_cents=sum(x['amount_cents'] for x in v),records=len(v),transaction_ids='|'.join(x['transaction_id'] for x in v)))
        for dt,v in bydate.items():daily.append(dict(committee_id=cid,candidate=names[cid],date=dt,nonmatching_cents=sum(x['amount_cents'] for x in v),unidentified_cents=sum(x['amount_cents'] for x in v if x['disclosure']),records=len(v),records_at_350=sum(x['amount_cents']==35000 for x in v),filing_dates='|'.join(sorted(set(x['filed_date'] for x in v))),transaction_ids='|'.join(x['transaction_id'] for x in v)))
        for b,v in bybasis.items():bases.append(dict(committee_id=cid,candidate=names[cid],basis=b,cents=sum(x['amount_cents'] for x in v),records=len(v)))
    cand.sort(key=lambda r:(r['district'],-r['cash_cents']))
    tables.extend([write('candidate-report-metrics',cand),write('candidate-payees-reviewed-groups',sorted(payees,key=lambda r:(r['committee_id'],-r['cash_payment_cents']))),write('candidate-daily-nonmatching',sorted(daily,key=lambda r:(r['committee_id'],r['date']))),write('candidate-accounting-bases',bases)])
    onset=[]
    for day in range(14,19):
        dt=date(2026,9,day)
        for cid in names:
            v=[r for r in bycid[cid] if r['basis']=='cash_contribution' and not r['public']]
            a=[r for r in v if dt-timedelta(days=7)<=date.fromisoformat(r['transaction_date'])<dt]
            b=[r for r in v if dt<date.fromisoformat(r['transaction_date'])<=dt+timedelta(days=7)]
            onset.append(dict(committee_id=cid,candidate=names[cid],assumed_billboard_onset=dt.isoformat(),pre_cents=sum(r['amount_cents'] for r in a),post_cents=sum(r['amount_cents'] for r in b),all_recent_and_provisional=True))
    tables.append(write('billboard-date-sensitivity',onset))
    # Evidence reviews do not turn a provisional fingerprint into a verified person.
    review_names=['Christopher Schweizer','Toby Hodges','Warren Rosenfeld','James M Labbe','Daniel Deutsch','Roger Vrilakas','Tessa Bridge','Elizabeth Angel','Homer Williams']
    checks=[]
    for p in portfolios:
        if p['reported_name'] in review_names or p['entity_id'].startswith('committee:'):
            v=[x for (eid,cid),rr in gifts.items() if eid==p['entity_id'] for x in rr]
            checks.append(dict(entity_id=p['entity_id'],reported_name=p['reported_name'],records=len(v),reported_name_variants='|'.join(sorted({x['entity_name'] for x in v})),reported_book_types='|'.join(sorted({x['book_type'] for x in v})),link_basis='authoritative ORESTAR committee ID' if p['entity_id'].startswith('committee:') else 'same conservative name/type/full-address fingerprint; not externally verified person',review='transaction IDs, dates, amounts and donor category checked; no street address published',transaction_ids='|'.join(x['transaction_id'] for x in v)))
    tables.append(write('named-case-evidence-review',checks))
    assert sum(r['gross_cents'] for r in portfolios)==sum(r['gross_cents'] for r in ledger)
    assert sum(r['cash_cents'] for r in cand)==manifest['cash_cents']
    assert all(r['cash_cents']==r['public_cents']+r['unidentified_cents']+r['visible_individual_cents']+r['other_visible_nonmatching_cents'] for r in cand)
    individuals=[r for r in portfolios if r['book_type']=='Individual']
    out=dict(snapshot=manifest['snapshot'],source_manifest_sha256=digest(OUT/'analysis.json'),candidates=cand,totals=dict(cash_cents=sum(r['cash_cents'] for r in cand),public_cents=sum(r['public_cents'] for r in cand),nonmatching_cents=sum(r['nonmatching_cents'] for r in cand),unidentified_cents=sum(r['unidentified_cents'] for r in cand),individual_groups=len(individuals),repeat_record_groups=sum(r['repeat_records_same_candidate'] for r in individuals),repeat_date_groups=sum(r['repeat_dates_same_candidate'] for r in individuals),multi_candidate_groups=sum(r['candidate_count']>1 for r in individuals)),frequency_leaders=sorted(individuals,key=lambda r:(-r['contribution_records'],-r['gross_cents']))[:15],repeat_dollar_leaders=sorted((r for r in individuals if r['repeat_records_same_candidate']),key=lambda r:-r['gross_cents'])[:15],tables=tables,definitions={'dates':'Reported transaction dates, not necessarily dates of underlying gifts in an aggregate record. Multiple records on a date do not establish multiple solicitation decisions.','refunds':'Gross receipts minus observed same-fingerprint, same-committee refunds within this snapshot. Does not prove the refund relates to a gift inside this window; unmatched identities and prior-cycle refunds remain possible.','lag':'Current-version filed date minus transaction date, not original disclosure date. Excludes negative/unavailable lags.','public':'Reviewed City matching-receipt IDs, not every government-named payor.','scope':'17 reviewed committees, not all 33 candidates; missing links are not zero fundraising.','shared_pair_dollars':'For a committee pair, gross itemized Individual receipts from strict record groups present in both committees, summed across those two committees only. Public matching and aggregate labels are excluded. Refunds are separately supplied. Pair totals overlap when a group supported three or more candidates; matrix cells cannot be summed.'},assertions_passed=6)
    (OUT/'report-data.json').write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps(out['totals'],indent=2));print('Evidence tables:',len(tables))
if __name__=='__main__':run()
