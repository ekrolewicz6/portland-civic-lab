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
    assert (len(payments), len(groups), len(relationships), len(names)) == (2441, 251, 295, 215)
    assert len({row['transaction_id'] for row in payments}) == len(payments)
    assert sum(int(row['amount_cents']) for row in payments) == data['totals']['cashPaymentCents'] == 67207027
    assert sum(int(row['cash_payment_cents']) for row in groups) == data['totals']['identifiedCents'] == 66161759
    assert sum(int(row['cash_payment_cents']) for row in relationships) == data['totals']['identifiedCents']
    assert sum(int(row['cash_payment_cents']) for row in names) == data['totals']['identifiedCents']
    assert data['totals']['aggregateCents'] == 1045268
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
    assert sum(row['cents'] for row in data['purpose']) == 67207027
    assert sum(row['cents'] for row in data['monthly']) == 67207027
    assert data['totals']['multiCandidatePayeeGroups'] == 20
    assert data['totals']['multiCandidateGroupCents'] == 17695164
    print(json.dumps({'status':'passed','payments':len(payments),'groups':len(groups),'relationships':len(relationships)}))

class SupplierPublicationTests(unittest.TestCase):
    def test_frozen_evidence_reconciles(self):
        run()

if __name__ == '__main__':
    unittest.main()
