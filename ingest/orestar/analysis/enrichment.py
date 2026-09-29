"""Normalize archived official profiles, balance observations and Portland matches.

Source records remain private locally; public output is an explicit field allowlist.
No name-only merging and no addition of City payments to already reported receipts.
"""
import csv
import json
import re
import duckdb
from common import *

ENRICH = ROOT / 'runtime-data/orestar-analysis/enrichment'
CONTEXT = ROOT / 'runtime-data/orestar-analysis/context'
# Manual source review: candidate name AND current election/office corroborate
# the City roster. Variants are recorded, not applied to any donor identity.
LINKS = [
    ('23208', 'portland-district-3', 'tiffany-koyama-lane', 'Tiffany Koyama Lane', 'Tiffany Koyama Lane'),
    ('23028', 'portland-district-3', 'angelita-morillo', 'Angelita Morillo', 'Angelita Morillo'),
    ('15109', 'portland-district-3', 'steve-novick', 'Steve Novick', 'Steven Novick'),
    ('24661', 'portland-district-3', 'tom-sollitt', 'Tom Sollitt', 'Thomas K Sollitt'),
    ('24897', 'portland-district-3', 'kellie-torres', 'Kellie Torres', 'Kellie Torres'),
    ('24973', 'portland-district-3', 'esther-leon', 'Esther León', 'Esther E Leon'),
    ('24972', 'portland-district-3', 'joel-corcoran', 'Joel Corcoran', 'Joel Corcoran'),
    ('24966', 'portland-district-3', 'matthias-hallett', 'Matthias Hallett', 'Matthias M Hallett'),
    ('24979', 'portland-district-3', 'cristal-otero', 'Cristal Otero', 'Cristal Otero'),
    ('23295', 'portland-district-4', 'eli-arnold', 'Eli Arnold', 'Eli Arnold'),
    ('23365', 'portland-district-4', 'mitch-green', 'Mitch Green', 'Mitch Green'),
    ('17629', 'portland-district-4', 'eric-zimmerman', 'Eric Zimmerman', 'Eric Zimmerman'),
    ('23199', 'portland-district-4', 'olivia-clark', 'Olivia Clark', 'Olivia Clark'),
    ('23411', 'portland-district-4', 'jeremy-beausoleil-smith', 'Jeremy Beausoleil Smith', 'Jeremy B Smith'),
    ('25040', 'portland-district-4', 'jamey-evenstar', 'Jamey Evenstar', 'Jamey Evenstar'),
    ('25103', 'portland-district-4', 'jayne-cronlund', 'Jayne Cronlund', 'Jayne Cronlund'),
    ('24615', 'portland-district-4', 'john-j-goldsmith', 'John J Goldsmith', 'John Goldsmith'),
    ('21777', 'portland-auditor', 'simone-rede', 'Simone Rede', 'Simone D Rede'),
]
# Transcribed from the archived official 2026 page; assertions below check each
# amount against the source text before publication. Units are dollars here.
SDE = [
    ('23208','Tiffany Koyama Lane',200000),('23028','Angelita Morillo',193778),
    ('24661','Tom Sollitt',34830),('15109','Steve Novick',100000),
    ('24973','Esther Leon',32217),('24897','Kellie Torres',100000),
    ('23199','Olivia Clark',178330),('17629','Eric Zimmerman',100000),
    ('23365','Mitch Green',200000),('23411','Jeremy Beausoleil Smith',100000),
    ('23295','Eli Arnold',200000),('25040','Jamey Evenstar',56710),
    ('25103','Jayne Cronlund',46570),
]

def csv_out(key, rows):
    if not rows:
        return
    with (PUBLIC / (key+'.csv')).open('w',newline='') as f:
        writer=csv.DictWriter(f,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)

def normalize_profile(data, artifact):
    text=data['text']
    name=re.search(r'Committee Information\s+Name:\s*([^\t\n]+)',text)
    effective=re.search(r'Filing Effective From:\s*(\d\d/\d\d/\d{4})',text)
    candidate=re.search(r'Candidate Information\s+Name:\s*([^\t\n]+)',text)
    office=re.search(r'Election/Office:\s*(.*?)\s*Party Affiliation:\s*([^\t\n]+)',text,re.S)
    assert name and effective, 'Profile structure changed'
    return {'committeeId':data['committeeId'],'name':name[1].strip(),
        'effectiveFrom':iso(effective[1]),'candidateName':candidate[1].strip() if candidate else None,
        'electionOffice':' '.join(office[1].split()) if office else None,
        'party':office[2].strip() if office else None,
        'source':artifact['source'],'sourceSha256':artifact['sha256'],
        'retrievedAt':artifact['retrievedAt'],'accountSummaries':[]}

def account_fields(data):
    section=None; values={}
    for cells in data['rows']:
        if len(cells)!=3:continue
        label=cells[0].strip()
        if label in ['Contributions','Expenditures','Cash Balance','Financial Status'] and cells[2] in ['', 'Amount']:
            section=label;continue
        if label and section and re.fullmatch(r'\(?-?\$[\d,.]+\)?',cells[2]):
            key=section+':'+label
            if key not in values:values[key]=cents(cells[2])
    assert 'Cash Balance:Ending Cash Balance' in values
    return values

def run():
    manifest=json.loads((ENRICH/'manifest.json').read_text())
    snapshot=json.loads((WORK/'manifest.json').read_text())
    con=duckdb.connect(str(ROOT/snapshot['database']),read_only=True)
    con.execute('SET threads=2')
    profiles={}; accounts=[]; reconciliation=[]
    for committee,item in sorted(manifest['items'].items()):
        artifact=item['artifacts'].get('profile')
        if not artifact:continue
        path=ENRICH/artifact['path'];assert digest(path)==artifact['sha256']
        profile=normalize_profile(json.loads(path.read_text()),artifact);profiles[committee]=profile
        for year in [2025,2026]:
            artifact=item['artifacts'].get('account'+str(year))
            if not artifact:continue
            path=ENRICH/artifact['path'];assert digest(path)==artifact['sha256']
            data=json.loads(path.read_text())
            assert re.search(r'year\s+'+str(year),data['text'])
            assert '('+committee+')' in data['text']
            v=account_fields(data)
            get=lambda section,label:v[section+':'+label]
            beginning=get('Cash Balance','Beginning Balance (Previous Year)')
            closing=get('Cash Balance','Ending Cash Balance')
            official_net=(get('Cash Balance','Total Contributions')+get('Cash Balance','Other Receipts')+
                get('Cash Balance','Loans Received (exempt)')-get('Cash Balance','Total Expenditures')-
                get('Cash Balance','Other Disbursements')-get('Cash Balance','Loan Payments (exempt)')+
                get('Cash Balance','Balance Adjustments'))
            assert beginning+official_net==closing, (committee,year,'official balance equation')
            flow=con.execute("SELECT coalesce(sum(amount_cents*cash_sign),0)::BIGINT FROM transactions WHERE committee_id=? AND substr(transaction_date,1,4)=?",[committee,str(year)]).fetchone()[0]
            cash_in=get('Contributions','Cash Contributions');cash_out=get('Expenditures','Cash Expenditures')
            own_in=con.execute("SELECT coalesce(sum(amount_cents),0)::BIGINT FROM transactions WHERE committee_id=? AND substr(transaction_date,1,4)=? AND basis='cash_contribution'",[committee,str(year)]).fetchone()[0]
            own_out=con.execute("SELECT coalesce(sum(amount_cents),0)::BIGINT FROM transactions WHERE committee_id=? AND substr(transaction_date,1,4)=? AND basis='cash_payment'",[committee,str(year)]).fetchone()[0]
            row={'committee_id':committee,'year':year,'beginning_cash_cents':beginning,
                'ending_cash_cents':closing,'outstanding_loans_cents':get('Financial Status','Total Outstanding Loans'),
                'outstanding_personal_expenditures_cents':get('Financial Status','Outstanding Personal Expenditures'),
                'accounts_payable_cents':get('Financial Status','Accounts Payable'),
                'accounts_receivable_cents':get('Financial Status','Accounts Receivable'),
                'official_cash_contributions_cents':cash_in,'snapshot_cash_contributions_cents':own_in,
                'contribution_difference_cents':cash_in-own_in,'official_cash_payments_cents':cash_out,
                'snapshot_cash_payments_cents':own_out,'payment_difference_cents':cash_out-own_out,
                'official_net_cash_change_cents':official_net,'snapshot_net_cash_change_cents':flow,
                'net_difference_cents':official_net-flow,'status':'agrees' if (cash_in==own_in and cash_out==own_out and official_net==flow) else 'difference_requires_review',
                'retrieved_at':artifact['retrievedAt'],'source':artifact['source'],'source_sha256':artifact['sha256']}
            accounts.append(row);profile['accountSummaries'].append(row)
        if len(profile['accountSummaries'])==2:
            a,b=profile['accountSummaries'];assert a['ending_cash_cents']==b['beginning_cash_cents'], (committee,'roll forward')
    roster=json.loads((CONTEXT/'portland-roster.json').read_text())
    links=[]
    for committee,race,candidate_id,name,source_name in LINKS:
        p=profiles[committee]
        assert p['candidateName']==source_name and '2026 General Election' in p['electionOffice']
        office='City Auditor' if race=='portland-auditor' else 'District '+race[-1]
        assert office in p['electionOffice'] and name in roster['text']
        links.append({'committeeId':committee,'raceId':race,'candidateId':candidate_id,
            'candidateName':name,'orestarCandidateName':source_name,'status':'reviewed',
            'reviewedAt':END,'effectiveFrom':p['effectiveFrom'],'sourceProfileSha256':p['sourceSha256'],
            'sources':[p['source'],roster['url']],
            'decision':'Manual candidate/committee identity and election/office comparison with official City roster. Name variants explicitly retained.',
            'scope':'Current 2026 candidate association. Does not attribute every 2025–2026 committee transaction to this race.'})
    crosswalk={'version':'committee-race-v2','snapshot':SNAPSHOT,'reviewedAt':END,'links':links,
        'note':'Missing link is not zero. Current official profiles do not establish historical race attribution.'}
    write_json(RESEARCH/'committee-race-crosswalk.json',crosswalk)
    write_json(PUBLIC/'committee-race-crosswalk.json',crosswalk)
    city=json.loads((CONTEXT/'sde-2026.json').read_text())
    receipts=[]
    for committee,name,distributed in SDE:
        # Select only this named row's amount, not an unrelated occurrence.
        start=city['text'].index(name)
        amount=re.search(r'\$([\d,]+)',city['text'][start:start+800]);assert amount and int(amount[1].replace(',',''))==distributed
        rows=con.execute("SELECT transaction_id,transaction_date,entity_id,entity_name,amount_cents FROM transactions WHERE committee_id=? AND basis='cash_contribution' AND transaction_date>='2026-01-01' AND book_type='Other' AND (lower(entity_name) LIKE '%city of portland%' OR lower(entity_name) LIKE '%small donor elections%') ORDER BY transaction_date,transaction_id",[committee]).fetchall()
        # Reviewed source labels/purposes, recipient eligibility and observed
        # period. This is a payment classification, NOT a donor entity merge.
        reported=sum(r[4] for r in rows)
        totals=con.execute("SELECT sum(amount_cents)::BIGINT FROM transactions WHERE committee_id=? AND basis='cash_contribution'",[committee]).fetchone()[0]
        for transaction,date,entity,label,amount in rows:
            receipts.append({'transaction_id':transaction,'committee_id':committee,'transaction_date':date,'entity_id':entity,'reported_name':label,'amount_cents':amount,'classification':'reviewed_reported_public_matching_receipt','evidence':'Filer-reported City/program payor or matching description; certified candidate on official City program page. Not a City disbursement-level match.'})
        reconciliation.append({'committee_id':committee,'candidate_name':name,
            'city_distributed_cents':distributed*100,'orestar_reported_matching_cents':reported,
            'difference_cents':distributed*100-reported,'orestar_cash_contributions_cents':totals,
            'cash_not_classified_public_cents':totals-reported,'classified_public_share':reported/totals if totals else None,
            'matching_records':len(rows),'transaction_ids':'|'.join(r[0] for r in rows),
            'reconciliation_status':'aggregate_amount_agrees' if distributed*100==reported else 'unresolved_difference_not_an_allegation',
            'source':city['url'],'retrieved_at':city['retrievedAt'],
            'limitation':'City cycle-to-date observation versus fixed reported receipts. Timing, amendments and source coverage may differ. Do not add the two sources. Remainder is not verified private giving.'})
    csv_out('account-summaries',accounts);csv_out('portland-public-financing',reconciliation);csv_out('public-matching-receipts',receipts)
    data={'version':'official-enrichment-v1','snapshot':SNAPSHOT,'profiles':profiles,
        'coverage':{'profiles':len(profiles),'filers':snapshot['filers'],'account_years':len(accounts),'reviewed_race_links':len(links)},
        'portlandPublicFinancing':reconciliation,
        'cityMatchingDistributedCents':sum(r['city_distributed_cents'] for r in reconciliation),
        'snapshotMatchingReportedCents':sum(r['orestar_reported_matching_cents'] for r in reconciliation),
        'accountAgreement':{'agrees':sum(r['status']=='agrees' for r in accounts),'differences':sum(r['status']!='agrees' for r in accounts)}}
    for path in [RESEARCH/'enrichment.json',PUBLIC/'enrichment.json',ROOT/'src/lib/campaign-finance/enrichment.json']:write_json(path,data)
    print(json.dumps({k:v for k,v in data.items() if k not in ['profiles','portlandPublicFinancing']},indent=2))
    con.close()

if __name__=='__main__':run()
