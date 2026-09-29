"""Interpret captured target allocations without inventing target identities."""
import csv
import json
import re
import duckdb
from common import *

def run():
    root=ROOT/'runtime-data/orestar-analysis/details'
    m=json.loads((root/'manifest.json').read_text())
    snapshot=json.loads((WORK/'manifest.json').read_text())
    con=duckdb.connect(str(ROOT/snapshot['database']),read_only=True);con.execute('SET threads=2')
    allocations=[];records=[];associations=[];gaps=[]
    ids=m.get('independentIds',[])
    pattern=re.compile(r'(Independent|In-Kind) Expenditure in (Support|Opposition|Oppose)\s*-\s*(.*?)\s*-\s*(\$[\d,]+\.\d{2})',re.I)
    for transaction in ids:
        artifact=m['items'].get(transaction)
        if not artifact or artifact['status']!='complete':gaps.append({'transaction_id':transaction,'reason':'Detail not acquired successfully'});continue
        path=ROOT/artifact['path'];assert digest(path)==artifact['sha256']
        data=json.loads(path.read_text())
        if 'ORESTAR does not support multiple tabs' in data['text']:
            gaps.append({'transaction_id':transaction,'reason':'Diagnostic capture has duplicate-tab warning; revalidation required'});continue
        source=con.execute('SELECT committee_id,committee_name,basis,amount_cents,transaction_date,status FROM transactions WHERE transaction_id=?',[transaction]).fetchone()
        if not source:gaps.append({'transaction_id':transaction,'reason':'Live detail ID absent from fixed current-version snapshot; not added'});continue
        committee,name,basis,amount,date,status=source
        row_values={row[0]:row[2] for row in data['rows'] if len(row)>=3 and row[1]==':' and len(row[0])<70}
        detail_amount=cents(row_values['Amount'])
        if detail_amount!=amount:gaps.append({'transaction_id':transaction,'reason':'Detail amount differs from snapshot; version reconciliation required'});continue
        text=row_values.get('In-Kind/Independent Expenditures','')
        parsed=list(pattern.finditer(text))
        residual=pattern.sub('',text).strip(' ;\n\t')
        if not parsed or residual:
            gaps.append({'transaction_id':transaction,'reason':'Unparsed target allocation text: '+residual[:200]});continue
        total=sum(cents(match[4]) for match in parsed)
        record={'transaction_id':transaction,'committee_id':committee,'committee_name':name,'transaction_date':date,
            'basis':basis,'transaction_cents':amount,'allocated_cents':total,'allocation_difference_cents':amount-total,
            'allocation_count':len(parsed),'status':status,'source_sha256':artifact['sha256'],
            'retrieved_at':data['retrievedAt'],'reconciliation_status':'agrees' if total==amount else 'allocation_difference_requires_review'}
        records.append(record)
        for index,match in enumerate(parsed):
            allocations.append({'transaction_id':transaction,'allocation_index':index,'committee_id':committee,
                'committee_name':name,'transaction_date':date,'basis':basis,
                'expenditure_kind':match[1].lower(),'position':match[2].lower(),
                'target_label':match[3].strip(),'allocated_cents':cents(match[4]),
                'target_identity_status':'reported_label_not_crosswalked','record_reconciliation':record['reconciliation_status'],
                'source':data['source'],'source_sha256':artifact['sha256']})
        if row_values.get('Associations','').strip():
            associations.append({'transaction_id':transaction,'reported_associations':row_values['Associations'],'source_sha256':artifact['sha256'],'status':'source_text_pending_relationship_review'})
    schemas={
        'independent-allocations':'transaction_id allocation_index committee_id committee_name transaction_date basis expenditure_kind position target_label allocated_cents target_identity_status record_reconciliation source source_sha256',
        'independent-records':'transaction_id committee_id committee_name transaction_date basis transaction_cents allocated_cents allocation_difference_cents allocation_count status source_sha256 retrieved_at reconciliation_status',
        'transaction-associations':'transaction_id reported_associations source_sha256 status',
        'detail-gaps':'transaction_id reason',
    }
    for key,rows in [('independent-allocations',allocations),('independent-records',records),('transaction-associations',associations),('detail-gaps',gaps)]:
        # Always replace with a header even at zero rows: never leave stale evidence.
        with (PUBLIC/(key+'.csv')).open('w',newline='') as f:
            writer=csv.DictWriter(f,fieldnames=schemas[key].split());writer.writeheader()
            writer.writerows({k:("'" + v if isinstance(v,str) and re.match(r'^\\s*[=+@-]',v) else v) for k,v in row.items()} for row in rows)
    groups={}
    for row in allocations:
        key=(row['expenditure_kind'],row['position'],row['basis'])
        g=groups.setdefault(key,{'kind':key[0],'position':key[1],'basis':key[2],'allocations':0,'allocated_cents':0})
        g['allocations']+=1;g['allocated_cents']+=row['allocated_cents']
    data={'version':'reported-target-allocations-v1','snapshot':SNAPSHOT,'searched_records':len(ids),
        'parsed_records':len(records),'allocation_rows':len(allocations),'gap_records':len(gaps),
        'reconciliation_differences':sum(r['allocation_difference_cents']!=0 for r in records),
        'multi_target_records':sum(r['allocation_count']>1 for r in records),'groups':list(groups.values()),
        'limitation':'ORESTAR independent-checkbox result population only, not proof all outside spending was disclosed or correctly flagged. Targets are reported labels, not reviewed race/entity identities. Cash, obligations and in-kind allocations remain separate; related payable/payment records cannot be summed as two purchases. Live details may postdate the fixed export.'}
    for path in [RESEARCH/'independent-spending.json',PUBLIC/'independent-spending.json',ROOT/'src/lib/campaign-finance/independent-spending.json']:write_json(path,data)
    print(json.dumps(data,indent=2));con.close()

if __name__=='__main__':run()
