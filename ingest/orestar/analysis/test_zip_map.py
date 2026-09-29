"""Published ZIP-map reconciliation and privacy-boundary checks."""
import csv
import hashlib
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DATA = ROOT / 'src/lib/campaign-finance/zip-map-data.json'
BASE = ROOT / 'public/data/campaign-finance/zip-map'

class ZipMapTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(DATA.read_text())
        cls.candidates = cls.data['candidates']
        cls.shapes = json.loads((BASE / 'portland-metro-2020-zcta-500k.geojson').read_text())
        with (BASE / 'candidate-zip-totals.csv').open() as stream:
            cls.rows = list(csv.DictReader(stream))

    def test_snapshot_and_boundaries(self):
        self.assertEqual(self.data['snapshot'], 'orestar-20250101-20260927-v1')
        codes = [f['properties']['GEOID'] for f in self.shapes['features']]
        self.assertEqual(len(codes), 109)
        self.assertEqual(len(codes), len(set(codes)))
        self.assertEqual(hashlib.sha256((BASE / 'portland-metro-2020-zcta-500k.geojson').read_bytes()).hexdigest(), self.data['boundarySha256'])
        self.assertEqual(hashlib.sha256((BASE / 'candidate-zip-totals.csv').read_bytes()).hexdigest(), self.data['evidenceSha256'])

    def test_financial_partition(self):
        self.assertEqual(len(self.candidates), 18)
        for c in self.candidates:
            with self.subTest(candidate=c['candidate']):
                cov = c['coverageCents']
                self.assertEqual(sum(cov.values()), c['cashCents'])
                self.assertEqual(sum(c['coverageRecords'].values()), sum(row['records'] for row in c['zipTotals']) + c['coverageRecords'].get('public', 0) + c['coverageRecords'].get('unidentified', 0) + c['coverageRecords'].get('missing_zip', 0) + c['coverageRecords'].get('invalid_zip', 0))
                self.assertEqual(sum(row['cents'] for row in c['zipTotals'] if row['mapped']), cov.get('mapped', 0))
                self.assertEqual(sum(row['cents'] for row in c['zipTotals'] if not row['mapped']), cov.get('other_zip', 0))

    def test_csv_contains_only_aggregate_evidence(self):
        self.assertEqual(len(self.rows), sum(len(c['zipTotals']) for c in self.candidates))
        self.assertEqual(set(self.rows[0]), {'snapshot','race_id','candidate','committee_id','zip5','gross_cash_cents','records','in_metro_map'})
        for row in self.rows:
            self.assertRegex(row['zip5'], r'^\d{5}$')
        self.assertEqual(json.loads((BASE / 'data.json').read_text()), self.data)

if __name__ == '__main__':
    unittest.main()
