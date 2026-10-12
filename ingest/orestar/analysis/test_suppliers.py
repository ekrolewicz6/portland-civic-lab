"""Local integrity checks for the Portland supplier edition."""
import csv
import hashlib
import json
from collections import defaultdict
import unittest
from common import ROOT

BASE = ROOT / 'public/data/campaign-finance/suppliers'
APP = ROOT / 'src/lib/campaign-finance/supplier-data.json'

def rows(name):
    with (BASE / name).open(newline='') as stream:
        return list(csv.DictReader(stream))

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def run():
    data = json.loads(APP.read_text())
    assert digest(APP) == digest(BASE / 'data.json')
    payments = rows('cash-payments.csv')
    assert not {'purpose_description', 'source_raw_file', 'street_address'} & set(payments[0])
    groups = rows('payee-record-groups.csv')
    relationships = rows('payee-candidate-ledger.csv')
    names = rows('reported-name-groups.csv')
    assert len(payments) == data['totals']['cashPaymentRecords']
    assert len(groups) == data['totals']['visiblePayeeGroups']
    assert len(relationships) == data['totals']['visiblePayeeCandidateRelationships']
    assert len(names) == len(data['reportedNames'])
    assert len({row['transaction_id'] for row in payments}) == len(payments)
    assert sum(int(row['amount_cents']) for row in payments) == data['totals']['cashPaymentCents']
    assert sum(int(row['cash_payment_cents']) for row in groups) == data['totals']['identifiedCents']
    assert sum(int(row['cash_payment_cents']) for row in relationships) == data['totals']['identifiedCents']
    assert sum(int(row['cash_payment_cents']) for row in names) == data['totals']['identifiedCents']
    assert data['totals']['aggregateCents'] == data['totals']['cashPaymentCents'] - data['totals']['identifiedCents']
    group_ids = {row['entity_id'] for row in groups}
    assert all(row['entity_id'] not in group_ids for row in payments if row['is_disclosure_category'] == 'True' or row['identity_status'] == 'unknown')
    by_candidate = defaultdict(int)
    for row in payments:
        by_candidate[row['committee_id']] += int(row['amount_cents'])
    assert len(by_candidate) == 17
    assert by_candidate == {row['committeeId']: row['cents'] for row in data['candidates']}
    for key, item in data['evidence'].items():
        path = ROOT / ('public' + item['url'])
        assert digest(path) == item['sha256'], key
        assert len(rows(path.name)) == item['rows'], key
    assert sum(row['cents'] for row in data['purpose']) == data['totals']['cashPaymentCents']
    assert sum(row['cents'] for row in data['monthly']) == data['totals']['cashPaymentCents']
    shared = [group for group in data['payees'] if group['candidateCount'] > 1]
    assert data['totals']['multiCandidatePayeeGroups'] == len(shared)
    assert data['totals']['multiCandidateGroupCents'] == sum(group['cents'] for group in shared)
    print(json.dumps({'status':'passed','payments':len(payments),'groups':len(groups),'relationships':len(relationships)}))

class SupplierPublicationTests(unittest.TestCase):
    def test_published_evidence_reconciles(self):
        run()

if __name__ == '__main__':
    unittest.main()
