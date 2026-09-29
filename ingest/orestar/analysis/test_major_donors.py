import csv
import json
import unittest
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / 'research/campaign-finance/investigation/portland'
PUBLIC = ROOT / 'public/data/campaign-finance/story'


def rows(path):
    with path.open(newline='', encoding='utf-8') as handle:
        return list(csv.DictReader(handle))


class MajorDonorMatrixTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / 'src/lib/campaign-finance/major-donor-matrix.json').read_text())
        cls.ledger = rows(SOURCE / 'donor-candidate-complete-ledger.csv')
        cls.public = rows(PUBLIC / 'major-donor-matrix.csv')

    def test_selected_groups_and_candidate_relationships(self):
        self.assertEqual(len(self.data['candidates']), 17)
        self.assertEqual(len(self.data['rows']), 85)
        self.assertEqual(sum(row['bookType'] == 'Individual' for row in self.data['rows']), 54)
        self.assertEqual(len(self.public), 171)
        lookup = {(row['entity_id'], row['committee_id']): row for row in self.ledger}
        self.assertEqual(len(lookup), len(self.ledger))
        for item in self.public:
            original = lookup[item['entity_id'], item['committee_id']]
            for key in ('gross_cents', 'observed_refund_cents', 'contribution_records'):
                self.assertEqual(item[key], original[key])
            self.assertEqual(item['contribution_transaction_ids'], original['contribution_transaction_ids'])

    def test_refunds_and_provisional_identity_remain_explicit(self):
        for row in self.data['rows']:
            self.assertEqual(sum(cell['grossCents'] for cell in row['support']), row['grossCents'])
            self.assertEqual(sum(cell['refundCents'] for cell in row['support']), row['refundCents'])
            self.assertGreater(row['grossCents'], 0)
            if row['bookType'] == 'Individual':
                self.assertGreaterEqual(row['grossCents'], 75000)
                self.assertEqual(row['identityStatus'], 'provisional_record_group')
        self.assertTrue(any(row['refundCents'] > 0 for row in self.data['rows']))
        by_name = defaultdict(list)
        for row in self.data['rows']:
            by_name[row['name'].casefold()].append(row)
        for duplicates in by_name.values():
            if len(duplicates) > 1:
                self.assertEqual(len({row['entityId'] for row in duplicates}), len(duplicates))
                self.assertTrue(all(row['groupCode'] for row in duplicates))

    def test_no_aggregate_or_private_location_fields(self):
        self.assertEqual(set(self.public[0]), {
            'snapshot', 'entity_id', 'reported_name', 'book_type', 'identity_status',
            'committee_id', 'candidate', 'district', 'gross_cents', 'observed_refund_cents',
            'contribution_records', 'contribution_transaction_ids', 'refund_transaction_ids',
        })
        self.assertFalse(any('aggregate' in row['name'].casefold() or 'anonymous' in row['name'].casefold()
                             for row in self.data['rows']))


if __name__ == '__main__':
    unittest.main()
