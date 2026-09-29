"""Frozen checks for anonymous address-to-council-district publication."""
import csv
import hashlib
import json
import unittest
from common import ROOT, SNAPSHOT

APP=ROOT/'src/lib/campaign-finance/district-address-data.json'
PUBLIC=ROOT/'public/data/campaign-finance/zip-map/district-address-data.json'
CSV=ROOT/'public/data/campaign-finance/zip-map/candidate-district-address-summary.csv'

class DistrictAddressTests(unittest.TestCase):
    def test_reconciliation_and_privacy(self):
        raw=APP.read_bytes()
        self.assertEqual(raw,PUBLIC.read_bytes())
        data=json.loads(raw)
        self.assertEqual(data['snapshot'],SNAPSHOT)
        self.assertEqual(len(data['candidates']),17)
        self.assertEqual(data['geography']['locallyMatchedTransactions'],954)
        self.assertEqual(sum(c['cashRecords'] for c in data['candidates']),3940)
        self.assertEqual(sum(c['cashCents'] for c in data['candidates']),207120805)
        with CSV.open(newline='') as stream:
            rows=list(csv.DictReader(stream))
        self.assertEqual(len(rows),17*7)
        self.assertEqual(set(rows[0]),{'snapshot','committee_id','candidate','district','category','cash_cents','transactions'})
        self.assertEqual(hashlib.sha256(CSV.read_bytes()).hexdigest(),data['evidenceSha256'])
        for candidate in data['candidates']:
            self.assertEqual(sum(x['cents'] for x in candidate['categories'].values()),candidate['cashCents'])
            self.assertEqual(sum(x['records'] for x in candidate['categories'].values()),candidate['cashRecords'])
        for key in ('street','geometry','coordinates','latitude','longitude','transaction_id','zip5'):
            self.assertNotIn('"'+key+'"',raw.decode())

if __name__=='__main__':unittest.main()
