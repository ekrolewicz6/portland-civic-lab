"""Portland D3/D4 cash-payee edition from frozen, reviewed committee records.

Every cash payment is retained once. Payables, refunds, loans and noncash
support are never added to supplier receipts. Exact entity IDs are provisional
except authoritative committee IDs; same-name groups are a separate view.
"""
from collections import defaultdict
from pathlib import Path
import csv
import hashlib
import json
import re
from common import ROOT, SNAPSHOT, write_json

SOURCE = ROOT / 'research/campaign-finance/investigation/portland'
PUBLIC = ROOT / 'public/data/campaign-finance/suppliers'
APP = ROOT / 'src/lib/campaign-finance/supplier-data.json'
START, END = '2025-01-01', '2026-09-27'

def sha(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()

def read(name):
    with (SOURCE / name).open(newline='') as stream:
        return list(csv.DictReader(stream))

def safe(value):
    if isinstance(value, str) and value.lstrip().startswith(('=', '+', '-', '@')):
        return "'" + value
    return value

def write_csv(name, rows):
    if not rows:
        raise ValueError('Refusing empty evidence: ' + name)
    path = PUBLIC / name
    with path.open('w', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        for row in rows:
            writer.writerow({key: safe(value) for key, value in row.items()})
    return {'url': '/data/campaign-finance/suppliers/' + name, 'sha256': sha(path), 'rows': len(rows)}

def purpose_group(code):
    if not code.strip():
        return 'Unspecified code'
    if ';' in code:
        return 'Multiple reported codes'
    return {
        'Fundraising Event Expenses': 'Fundraising event code',
        'Management Services': 'Management services',
        'General Operational Expenses (need description)': 'General operations',
        'Wages, Salaries, Benefits': 'Wages, salaries, benefits',
        'Reimbursement for Personal Expenditures': 'Personal-expense reimbursement',
        'Preparation and Production of Advertising': 'Advertising production',
        'Online and Social Media Advertising': 'Online advertising',
        'Newspaper and Other Periodical Advertising': 'Print-media advertising',
        'Other Advertising (yard signs, buttons, etc.)': 'Other advertising / signs',
        'Literature, Brochures, Printing': 'Literature and printing',
        'Travel Expenses (need description)': 'Travel',
        'Utilities': 'Utilities',
    }.get(code, 'Other reported code')

def clean_name(name):
    return re.sub(r'\s+', ' ', name).strip().casefold()

def cents(rows):
    return sum(int(row['amount_cents']) for row in rows)

def run():
    PUBLIC.mkdir(parents=True, exist_ok=True)
    analysis = json.loads((SOURCE / 'analysis.json').read_text())
    report = json.loads((SOURCE / 'report-data.json').read_text())
    facts = json.loads((ROOT / 'src/lib/campaign-finance/candidate-facts.json').read_text())
    assert analysis['snapshot'] == report['snapshot'] == facts['snapshot'] == SNAPSHOT
    source_path = SOURCE / 'transactions.csv'
    assert sha(source_path) == analysis['tables']['transactions']['sha256']
    roster = {row['committee_id']: row for row in report['candidates']}
    assert len(roster) == 17
    rows = [row for row in read('transactions.csv') if row['basis'] == 'cash_payment']
    assert len(rows) == 2441 and cents(rows) == 67207027
    for row in rows:
        assert row['committee_id'] in roster
        assert START <= row['transaction_date'] <= END
        assert int(row['amount_cents']) >= 0
        row['candidate'] = roster[row['committee_id']]['candidate']
        row['district'] = roster[row['committee_id']]['district']
        row['purpose_group'] = purpose_group(row['purpose_codes'])
        row['disclosure'] = row['is_disclosure_category'] == 'True' or row['identity_status'] == 'unknown'
    assert len({row['transaction_id'] for row in rows}) == len(rows)
    visible = [row for row in rows if not row['disclosure']]
    hidden = [row for row in rows if row['disclosure']]
    assert cents(visible) + cents(hidden) == cents(rows)

    # Public evidence excludes unrestricted descriptions and private raw-file paths.
    ledger = [{key: row[key] for key in ['transaction_id','transaction_date','filed_date','committee_id','candidate','district','entity_id','entity_name','identity_status','is_disclosure_category','book_type','amount_cents','purpose_codes','purpose_group','city','state','source_row']} for row in rows]
    ledger.sort(key=lambda row: (row['transaction_date'], row['transaction_id']))

    by_entity = defaultdict(list)
    by_candidate = defaultdict(list)
    by_purpose = defaultdict(list)
    by_month = defaultdict(list)
    by_name = defaultdict(list)
    for row in rows:
        by_candidate[row['committee_id']].append(row)
        by_purpose[row['purpose_group']].append(row)
        by_month[row['transaction_date'][:7]].append(row)
        if not row['disclosure']:
            by_entity[row['entity_id']].append(row)
            by_name[clean_name(row['entity_name'])].append(row)
    assert len(by_entity) == 251

    entity_groups = []
    relationships = []
    for eid, group in by_entity.items():
        by_committee = defaultdict(list)
        for row in group:
            by_committee[row['committee_id']].append(row)
        names = sorted({row['entity_name'].strip() for row in group})
        entity_groups.append({'entityId': eid, 'reportedName': names[0], 'nameVariants': names,
            'identityStatus': group[0]['identity_status'], 'bookType': group[0]['book_type'],
            'cents': cents(group), 'records': len(group), 'candidateCount': len(by_committee),
            'candidates': [{'committeeId': cid, 'name': roster[cid]['candidate'], 'district': roster[cid]['district'], 'cents': cents(rr), 'records': len(rr)} for cid, rr in sorted(by_committee.items(), key=lambda item: (-cents(item[1]), item[0]))],
            'purposeCodes': sorted({row['purpose_codes'] for row in group if row['purpose_codes']}),
            'firstDate': min(row['transaction_date'] for row in group), 'lastDate': max(row['transaction_date'] for row in group)})
        for cid, rr in by_committee.items():
            relationships.append({'snapshot': SNAPSHOT, 'entity_id': eid, 'reported_payee': names[0],
                'committee_id': cid, 'candidate': roster[cid]['candidate'], 'district': roster[cid]['district'],
                'cash_payment_cents': cents(rr), 'records': len(rr),
                'reported_purpose_codes': ' | '.join(sorted({row['purpose_codes'] for row in rr if row['purpose_codes']})),
                'transaction_ids': '|'.join(row['transaction_id'] for row in sorted(rr, key=lambda row: row['transaction_id']))})
    entity_groups.sort(key=lambda group: (-group['cents'], group['reportedName'], group['entityId']))
    relationships.sort(key=lambda row: (row['committee_id'], -row['cash_payment_cents'], row['entity_id']))
    assert len(relationships) == 295

    name_groups = []
    for key, group in by_name.items():
        ids = {row['entity_id'] for row in group}
        cids = {row['committee_id'] for row in group}
        labels = sorted({row['entity_name'].strip() for row in group})
        name_groups.append({'reportedName': labels[0], 'nameVariants': labels, 'identityGroups': len(ids),
            'cents': cents(group), 'records': len(group), 'candidateCount': len(cids),
            'candidates': [{'committeeId': cid, 'name': roster[cid]['candidate'], 'district': roster[cid]['district'],
                'cents': cents([row for row in group if row['committee_id'] == cid])} for cid in sorted(cids)],
            'purposeCodes': sorted({row['purpose_codes'] for row in group if row['purpose_codes']})})
    name_groups.sort(key=lambda group: (-group['cents'], group['reportedName']))

    candidates = []
    for cid, group in by_candidate.items():
        identified = [row for row in group if not row['disclosure']]
        candidates.append({'committeeId': cid, 'candidate': roster[cid]['candidate'], 'district': roster[cid]['district'],
            'cents': cents(group), 'records': len(group), 'identifiedCents': cents(identified),
            'aggregateCents': cents(group) - cents(identified),
            'visiblePayeeGroups': len({row['entity_id'] for row in identified})})
        assert cents(group) == facts['committees'][cid]['bases']['cash_payment']['cents'], cid
    candidates.sort(key=lambda row: (row['district'], -row['cents']))
    assert len(candidates) == 17

    purpose = [{'name': key, 'cents': cents(group), 'records': len(group)} for key, group in by_purpose.items()]
    purpose.sort(key=lambda row: (-row['cents'], row['name']))
    monthly = [{'month': key, 'cents': cents(group), 'records': len(group)} for key, group in sorted(by_month.items())]
    multi = [group for group in entity_groups if group['candidateCount'] > 1]
    assert len(multi) == 20
    assert sum(group['cents'] for group in entity_groups) == cents(visible)
    assert sum(row['cents'] for row in purpose) == sum(row['cents'] for row in monthly) == sum(row['cents'] for row in candidates) == cents(rows)
    assert sum(row['cash_payment_cents'] for row in relationships) == cents(visible)
    assert sum(group['cents'] for group in name_groups) == cents(visible)

    csv_groups = [{'snapshot': SNAPSHOT, 'entity_id': group['entityId'], 'reported_payee': group['reportedName'],
        'identity_status': group['identityStatus'], 'book_type': group['bookType'], 'cash_payment_cents': group['cents'],
        'records': group['records'], 'candidate_count': group['candidateCount'],
        'candidates': ' | '.join(f"{c['name']}: ${c['cents']/100:,.2f}" for c in group['candidates']),
        'purpose_codes': ' | '.join(group['purposeCodes'])} for group in entity_groups]
    csv_names = [{'snapshot': SNAPSHOT, 'reported_payee': group['reportedName'], 'identity_group_count': group['identityGroups'],
        'cash_payment_cents': group['cents'], 'records': group['records'], 'candidate_count': group['candidateCount'],
        'candidates': ' | '.join(f"{c['name']}: ${c['cents']/100:,.2f}" for c in group['candidates']),
        'note': 'Same reported name only; legal-entity identity not independently verified'} for group in name_groups]
    evidence = {key: write_csv(name, data) for key, name, data in [
        ('payments', 'cash-payments.csv', ledger), ('payeeGroups', 'payee-record-groups.csv', csv_groups),
        ('payeeCandidates', 'payee-candidate-ledger.csv', relationships),
        ('reportedNames', 'reported-name-groups.csv', csv_names)]}
    output = {'version': 'portland-suppliers-v1', 'snapshot': SNAPSHOT, 'start': START, 'end': END,
        'sourceTransactionsSha256': sha(source_path), 'reportDataSha256': sha(SOURCE / 'report-data.json'),
        'totals': {'cashPaymentCents': cents(rows), 'cashPaymentRecords': len(rows),
            'identifiedCents': cents(visible), 'aggregateCents': cents(hidden),
            'visiblePayeeGroups': len(entity_groups), 'visiblePayeeCandidateRelationships': len(relationships),
            'multiCandidatePayeeGroups': len(multi), 'multiCandidateGroupCents': sum(group['cents'] for group in multi)},
        'candidates': candidates, 'purpose': purpose, 'monthly': monthly, 'payees': entity_groups,
        'reportedNames': name_groups, 'evidence': evidence,
        'definitions': {'basis': 'Gross cash-payment records only, not loans, noncash support, payables, cancellations or refunds. Earlier or later spending is outside the window.',
            'payeeGroups': 'Conservative source-record fingerprints. Same-name groups are a separate descriptive view, not automatic legal-entity merges.',
            'aggregate': 'Generic small-expenditure disclosure categories are not supplier identities and never bridge campaigns.',
            'purposes': 'One exclusive bucket per cash-payment record based on the reported purpose code. Blank and multi-code records stay separate. A filed code does not establish the underlying economic role.',
            'relationship': 'A common payee does not establish candidate coordination, consultant advice, shared political beliefs, an endorsement or beneficial ownership.',
            'profit': 'Cash received by a reported payee is not profit; payroll, reimbursement, processor and pass-through payments may be included.'}}
    write_json(APP, output)
    write_json(PUBLIC / 'data.json', output)
    assert sha(APP) == sha(PUBLIC / 'data.json')
    print(json.dumps({'status': 'passed', 'payments': len(rows), 'cents': cents(rows), 'groups': len(entity_groups),
        'relationships': len(relationships), 'sharedGroups': len(multi), 'evidence': {key: item['rows'] for key, item in evidence.items()}}))

if __name__ == '__main__':
    run()
