"""District 3/4 weekly, donor-portfolio and event-window research.
All outputs additive; no network requests. Seeded degree-preserving null on
observed individual groups only, with an explicitly exploratory interpretation.
"""
from __future__ import annotations
import csv, json, math, random
from collections import defaultdict, Counter
from datetime import date, timedelta
from itertools import combinations
import duckdb
from common import ROOT, WORK, RESEARCH, PUBLIC, SNAPSHOT, digest, write_json

OUT=RESEARCH/'investigation/portland'
def run():
    OUT.mkdir(parents=True,exist_ok=True)
    manifest=json.loads((WORK/'manifest.json').read_text())
    con=duckdb.connect(str(ROOT/manifest['database']),read_only=True)
    con.execute("SET threads=2; SET memory_limit='2GB'")
    links=[x for x in json.loads((RESEARCH/'committee-race-crosswalk.json').read_text())['links'] if x['raceId'] in ['portland-district-3','portland-district-4']]
    names={x['committeeId']:x['candidateName'] for x in links}; districts={x['committeeId']:int(x['raceId'][-1]) for x in links}
    context=json.loads((RESEARCH/'investigation/portland-context.json').read_text())
    matching={r['transaction_id'] for r in csv.DictReader((PUBLIC/'public-matching-receipts.csv').open())}
    qs={}; tables={}
    def query(key,sql,definition):
        cur=con.execute(sql); cols=[x[0] for x in cur.description]
        rows=[dict(zip(cols,r)) for r in cur.fetchall()]; write(key,rows,definition,sql); return rows
    def write(key,rows,definition,sql=None):
        if not rows: raise ValueError('Unexpected empty output: '+key)
        path=OUT/(key+'.csv')
        with path.open('w',newline='') as f:
            w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader()
            w.writerows({k:(''.join(["'",v]) if isinstance(v,str) and v.lstrip().startswith(('=','+','@','-')) else v) for k,v in r.items()} for r in rows)
        qs[key]={'rows':len(rows),'definition':definition,'sql':sql,'sha256':digest(path)};tables[key]=rows
    ids=','.join("'"+i+"'" for i in names)
    rows=query('transactions',f"SELECT transaction_id,transaction_date,filed_date,status,committee_id,entity_id,entity_name,identity_status,is_disclosure_category,book_type,basis,amount_cents,state,city,purpose_codes,purpose_description,filed_lag_days,source_raw_file,source_row FROM transactions WHERE committee_id IN ({ids}) ORDER BY transaction_date,transaction_id",'Every observed transaction for 17 source-reviewed candidate committees, original bases retained. No street addresses exported.')
    for r in rows:
        r['candidate']=names[r['committee_id']]; r['district']=districts[r['committee_id']];r['public_match']=r['transaction_id'] in matching
    cash=[r for r in rows if r['basis']=='cash_contribution']
    visible=[r for r in cash if not r['is_disclosure_category'] and r['identity_status']!='unknown' and not r['public_match']]
    allg=defaultdict(list);candg=defaultdict(list)
    for r in visible:allg[r['entity_id']].append(r);candg[(r['entity_id'],r['committee_id'])].append(r)
    portfolio=[]
    for eid,rr in allg.items():
        cs=sorted(set(r['candidate'] for r in rr)); cents=sum(r['amount_cents'] for r in rr)
        portfolio.append({'entity_id':eid,'reported_name':rr[0]['entity_name'].strip(),'book_type':rr[0]['book_type'],'identity_status':rr[0]['identity_status'],'candidates':'; '.join(cs),'candidate_count':len(cs),'gifts':len(rr),'gross_cents':cents,'first_date':min(r['transaction_date'] for r in rr),'last_date':max(r['transaction_date'] for r in rr),'repeat_to_same_candidate':any(len(v)>1 for (g,c),v in candg.items() if g==eid),'transaction_ids':'|'.join(r['transaction_id'] for r in rr)})
    portfolio.sort(key=lambda r:(-r['gross_cents'],r['entity_id']))
    write('all-visible-donor-portfolios',portfolio,'Every visible nonmatching source group. Multiple candidates is observable; hedging or political motivation is not established.')
    dc=[]
    for (eid,cid),rr in candg.items():
        dc.append({'entity_id':eid,'reported_name':rr[0]['entity_name'].strip(),'book_type':rr[0]['book_type'],'committee_id':cid,'candidate':names[cid],'district':districts[cid],'gifts':len(rr),'gross_cents':sum(r['amount_cents'] for r in rr),'first_date':min(r['transaction_date'] for r in rr),'last_date':max(r['transaction_date'] for r in rr),'transaction_ids':'|'.join(r['transaction_id'] for r in rr)})
    write('donor-candidate-ledger',sorted(dc,key=lambda r:(r['entity_id'],r['committee_id'])),'One visible source group by candidate. Counts are contribution records, not independent decisions; refunds are separate transaction rows.')
    # All Oregon giving for the donors observed in these city races, same exact identities.
    con.execute(f"CREATE TEMP VIEW selected_donors AS SELECT DISTINCT entity_id FROM transactions WHERE committee_id IN ({ids}) AND basis='cash_contribution' AND NOT is_disclosure_category AND identity_status<>'unknown'")
    statewide=query('city-donors-statewide-portfolios',"SELECT entity_id,any_value(entity_name) AS reported_name,committee_id,any_value(committee_name) AS recipient,count(*) AS gifts,sum(amount_cents)::BIGINT AS gross_cents,min(transaction_date) AS first_date,max(transaction_date) AS last_date FROM transactions WHERE entity_id IN (SELECT entity_id FROM selected_donors) AND basis='cash_contribution' AND NOT is_disclosure_category GROUP BY entity_id,committee_id ORDER BY entity_id,gross_cents DESC",'Exact same record groups observed in city candidate receipts, expanded to all ORESTAR recipient committees. Includes public payor groups separately identifiable; no unique-person claims.')
    # Complete calendar grid. First week is left-truncated; latest weeks are provisional.
    start,end=date(2025,1,1),date(2026,9,27)
    def monday(s):d=date.fromisoformat(s);return (d-timedelta(days=d.weekday())).isoformat()
    grid={};cur=start-timedelta(days=start.weekday())
    while cur<=end:
        for cid in names:
            grid[(cid,cur.isoformat())]={'committee_id':cid,'candidate':names[cid],'district':districts[cid],'week_start':cur.isoformat(),'cash_cents':0,'public_cents':0,'nonmatching_cents':0,'unidentified_cents':0,'individual_itemized_cents':0,'cash_records':0,'individual_records':0,'visible_groups':set(),'cash_payment_cents':0,'refund_cents':0,'provisional':(end-(cur+timedelta(days=6))).days<14,'left_truncated':cur<start}
        cur+=timedelta(days=7)
    for r in rows:
        g=grid[(r['committee_id'],monday(r['transaction_date']))]
        if r['basis']=='cash_contribution':
            g['cash_cents']+=r['amount_cents'];g['cash_records']+=1
            g['public_cents' if r['public_match'] else 'nonmatching_cents']+=r['amount_cents']
            if r['is_disclosure_category'] or r['identity_status']=='unknown':g['unidentified_cents']+=r['amount_cents']
            elif not r['public_match']:g['visible_groups'].add(r['entity_id'])
            if r['book_type']=='Individual' and not r['is_disclosure_category']:g['individual_itemized_cents']+=r['amount_cents'];g['individual_records']+=1
        if r['basis']=='cash_payment':g['cash_payment_cents']+=r['amount_cents']
        if r['basis']=='contribution_refund':g['refund_cents']+=r['amount_cents']
    weekly=[]
    for r in grid.values():r['visible_groups']=len(r['visible_groups']);weekly.append(r)
    write('candidate-weeks',weekly,'Monday-Sunday weeks; zero-filled only for matched committees. Nonmatching means not one of the reviewed City matching receipts, not proven private individual money. Aggregate records have reporting dates, not necessarily actual underlying gift dates.')
    best=[]
    for cid in names:
        for basis in ['nonmatching_cents','cash_cents','individual_itemized_cents']:
            for rank,r in enumerate(sorted((w for w in weekly if w['committee_id']==cid and w['week_start']>='2026-01-01'),key=lambda w:(-w[basis],w['week_start']))[:5],1):
                best.append({'committee_id':cid,'candidate':names[cid],'basis':basis,'rank':rank,'week_start':r['week_start'],'cents':r[basis],'public_cents':r['public_cents'],'unidentified_cents':r['unidentified_cents'],'provisional':r['provisional']})
    write('strongest-weeks',best,'Top five 2026 Monday-start weeks by three separately ranked bases. First 2026 partial week starts December 29, 2025 and is excluded.')
    # Uniform before/after comparisons, never causal event estimates.
    eventrows=[]
    for e in context['events']:
        dt=date.fromisoformat(e['date'])
        for window in [7,14,28]:
            prestart=dt-timedelta(days=window);poststart=dt+timedelta(days=1);postend=dt+timedelta(days=window)
            available=max(0,(min(postend,end)-poststart).days+1)
            for cid in names:
                pre=[r for r in cash if r['committee_id']==cid and prestart<=date.fromisoformat(r['transaction_date'])<dt and not r['public_match']]
                post=[r for r in cash if r['committee_id']==cid and poststart<=date.fromisoformat(r['transaction_date'])<=min(postend,end) and not r['public_match']]
                a=sum(r['amount_cents'] for r in pre);b=sum(r['amount_cents'] for r in post)
                eventrows.append({'event':e['label'],'event_date':e['date'],'window_days':window,'committee_id':cid,'candidate':names[cid],'pre_cents':a,'post_cents':b,'pre_records':len(pre),'post_records':len(post),'post_observed_days':available,'full_post_window':available==window,'mature_14_days':postend<=end-timedelta(days=14),'difference_cents':b-a if available==window else None,'ratio':b/a if a and available==window else None,'pre_unidentified_cents':sum(r['amount_cents'] for r in pre if r['is_disclosure_category']),'post_unidentified_cents':sum(r['amount_cents'] for r in post if r['is_disclosure_category']),'pre_itemized_individual_cents':sum(r['amount_cents'] for r in pre if r['book_type']=='Individual' and not r['is_disclosure_category']),'post_itemized_individual_cents':sum(r['amount_cents'] for r in post if r['book_type']=='Individual' and not r['is_disclosure_category'])})
    write('event-windows',eventrows,'Event day excluded; symmetric 7/14/28-day windows, incomplete post-period explicitly null for comparisons. All windows descriptive and overlapping. 14-day maturity flag is a sensitivity screen, not a legal filing rule.')
    # Both strict and deliberately permissive name/type joins for sensitivity.
    indiv=[r for r in visible if r['book_type']=='Individual']
    byid=defaultdict(set);byname=defaultdict(set);bynameids=defaultdict(set)
    for r in indiv:
        byid[r['entity_id']].add(r['committee_id']);n=' '.join(r['entity_name'].upper().split());byname[n].add(r['committee_id']);bynameids[n].add(r['entity_id'])
    pairs=[]
    for a,b in combinations(names,2):
        sa={k for k,v in byid.items() if a in v};sb={k for k,v in byid.items() if b in v}
        lax=sum(a in v and b in v for v in byname.values())
        pairs.append({'committee_a':a,'committee_b':b,'candidate_a':names[a],'candidate_b':names[b],'groups_a':len(sa),'groups_b':len(sb),'shared':len(sa&sb),'jaccard':len(sa&sb)/len(sa|sb) if sa|sb else 0,'share_of_smaller':len(sa&sb)/min(len(sa),len(sb)) if sa and sb else 0,'same_name_sensitivity_shared':lax})
    # Three independently seeded chains, specified for all 136 pairs before
    # interpreting significance. Sorted initial edges avoid Python hash randomness.
    original_edges=[(d,cid) for d,v in sorted(byid.items()) for cid in sorted(v)]
    null=[[] for _ in pairs];chain_values=[[] for _ in pairs]
    attempts=0;success=0;seeds=[20260927,20260928,20260929]
    for seed in seeds:
        edges=list(original_edges);edge_set=set(edges);rng=random.Random(seed)
        def swap(n):
            nonlocal attempts,success
            done=0
            while done<n and attempts<20000000:
                attempts+=1;i,j=rng.sample(range(len(edges)),2);d,a=edges[i];e,b=edges[j]
                if d==e or a==b or (d,b) in edge_set or (e,a) in edge_set:continue
                edge_set.remove((d,a));edge_set.remove((e,b));edge_set.add((d,b));edge_set.add((e,a));edges[i]=(d,b);edges[j]=(e,a);done+=1;success+=1
            if done<n:raise RuntimeError('Null sampler swap bound exceeded')
        swap(10*len(edges));cv=[[] for _ in pairs]
        for draw in range(999):
            swap(len(edges));bs=defaultdict(set)
            for d,cid in edges:bs[cid].add(d)
            for i,p in enumerate(pairs):cv[i].append(len(bs[p['committee_a']]&bs[p['committee_b']]))
        for i,vs in enumerate(cv):null[i].extend(vs);chain_values[i].append(vs)
    for p,vs,chains in zip(pairs,null,chain_values):
        p['null_mean']=sum(vs)/len(vs);p['permutation_p']=(1+sum(v>=p['shared'] for v in vs))/(1+len(vs))
        sv=sorted(vs);p['null_p025']=sv[int(.025*(len(sv)-1))];p['null_p975']=sv[int(.975*(len(sv)-1))]
        means=[sum(v)/len(v) for v in chains];p['chain_null_means']='|'.join(str(x) for x in means)
        ac=[]
        for v in chains:
            m=sum(v)/len(v);den=sum((x-m)**2 for x in v)
            ac.append(sum((a-m)*(b-m) for a,b in zip(v,v[1:]))/den if den else 0)
        p['max_abs_chain_lag1']=max(abs(x) for x in ac)
        p['exceedances']=sum(v>=p['shared'] for v in vs);p['null_draws']=len(vs)
    order=sorted(range(len(pairs)),key=lambda i:pairs[i]['permutation_p']);last=1.
    for rank in range(len(order),0,-1):
        i=order[rank-1];last=min(last,pairs[i]['permutation_p']*len(order)/rank);pairs[i]['bh_q']=last
    pairs.sort(key=lambda p:(-p['shared'],p['candidate_a'],p['candidate_b']))
    write('donor-overlap-tests',pairs,'All 136 pairs of 17 reviewed committees; exact Individual fingerprints; 2,997 seeded degree-preserving MCMC draws across three independently seeded chains; 10-edge-count burn-in per chain, edge-count successful swaps per draw, BH correction. Chain means and lag-1 diagnostics reported; mixing not proven. Missing small donors and name sensitivity not validated identity links.')
    repeat=sorted([r for r in portfolio if r['book_type']=='Individual' and r['repeat_to_same_candidate']],key=lambda r:(-r['gifts'],-r['gross_cents']))
    write('repeat-individual-donors',repeat,'Repeat means multiple cash contribution records to at least one candidate. Recurring schedule is a hypothesis; gross amounts not net refunds.')
    unresolved=[{'reported_name':n,'record_groups':len(bynameids[n]),'candidate_count_name_only':len(v),'candidates':'; '.join(names[c] for c in sorted(v)),'status':'review_candidate_not_merged'} for n,v in byname.items() if len(bynameids[n])>1]
    if unresolved:write('identity-review-queue',unresolved,'Same normalized name but distinct full-address fingerprints. Not automatically merged.')
    coverage=[]
    for d,ns in context['roster'].items():
        for n in ns:
            cid=next((i for i,v in names.items() if v==n),None)
            coverage.append({'district':d,'candidate':n,'committee_id':cid,'coverage':'reviewed_link' if cid else 'unlinked_not_zero'})
    write('candidate-coverage',coverage,'All 33 qualified candidates from official roster; unlinked names are not zero fundraising.')
    outside=query('outside-committees',"SELECT transaction_id,transaction_date,committee_id,committee_name,entity_id,entity_name,basis,amount_cents,purpose_codes,purpose_description FROM transactions WHERE committee_id IN ('21023','24993','22236') OR lower(entity_name) LIKE '%ditch mitch%' ORDER BY transaction_date,transaction_id",'Selected outside committees only. Their full activity may include other races; do not attribute entire PAC spending to D3/D4 or add to candidate receipts.')
    summary={'snapshot':SNAPSHOT,'candidates_reviewed':len(names),'roster_candidates':len(coverage),'transactions':len(rows),'cash_records':len(cash),'cash_cents':sum(r['amount_cents'] for r in cash),'public_cents':sum(r['amount_cents'] for r in cash if r['public_match']),'visible_nonmatching_groups':len(portfolio),'visible_individual_groups':len(byid),'multi_candidate_individual_groups':sum(len(v)>1 for v in byid.values()),'repeat_individual_groups':len(repeat),'tables':qs,'names':names,'districts':districts,'network':{'seeds':seeds,'chains':3,'draws_per_chain':999,'draws':2997,'hypotheses':len(pairs),'edges':len(edges),'attempts':attempts,'successful_swaps':success},'source_database_sha256':digest(ROOT/manifest['database'])}
    assert len(weekly)==len(names)*91
    assert sum(r['cash_cents'] for r in weekly)==summary['cash_cents']
    assert sum(r['gross_cents'] for r in portfolio)==sum(r['amount_cents'] for r in visible)
    assert all(r['cash_cents']==r['public_cents']+r['nonmatching_cents'] for r in weekly)
    write_json(OUT/'analysis.json',summary)
    print(json.dumps({k:v for k,v in summary.items() if k not in ['tables','names','districts']},indent=2))

if __name__=='__main__':run()
