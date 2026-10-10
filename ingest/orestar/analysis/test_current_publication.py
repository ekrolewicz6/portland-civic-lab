"""Reconcile dated public summaries to the minimized release ledger."""
import csv
import hashlib
import json
from pathlib import Path
import unittest
import duckdb

ROOT = Path(__file__).resolve().parents[3]

class CurrentPublicationTests(unittest.TestCase):
    def test_accounting_and_candidate_evidence_matches_ledger(self):
        summary = json.loads((ROOT / 'src/lib/campaign-finance/current-summary.json').read_text())
        manifest = json.loads((ROOT / 'server-data/campaign-finance/manifest.json').read_text())
        self.assertEqual(summary['snapshot'], manifest['snapshot'])
        self.assertEqual(summary['end'], manifest['end'])
        db = duckdb.connect(str(ROOT / manifest['database']), read_only=True)
        try:
            actual = {basis: (records, amount) for basis, records, amount in db.execute('SELECT basis,count(*),sum(amount_cents) FROM transactions GROUP BY basis').fetchall()}
            self.assertEqual({row['basis']: (row['records'], row['amount_cents']) for row in summary['bases']}, actual)
            for item in summary['evidence'].values():
                path = ROOT / ('public' + item['url'])
                self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), item['sha256'])
                with path.open(newline='') as stream:
                    self.assertEqual(len(list(csv.DictReader(stream))), item['rows'])
            with (ROOT / ('public' + summary['evidence']['candidates']['url'])).open(newline='') as stream:
                candidates = list(csv.DictReader(stream))
            for row in candidates:
                cash, payments = db.execute("SELECT coalesce(sum(amount_cents) FILTER (WHERE basis='cash_contribution'),0),coalesce(sum(amount_cents) FILTER (WHERE basis='cash_payment'),0) FROM transactions WHERE committee_id=?", [row['committee_id']]).fetchone()
                self.assertEqual(int(row['cash_cents']), cash)
                self.assertEqual(int(row['payment_cents']), payments)
                self.assertEqual(cash, sum(int(row[key]) for key in ['public_cents','individual_cents','unidentified_cents','other_cents']))
            suppliers = json.loads((ROOT / 'src/lib/campaign-finance/supplier-data.json').read_text())
            self.assertEqual(suppliers['snapshot'], summary['snapshot'])
            with (ROOT / ('public' + suppliers['evidence']['payments']['url'])).open(newline='') as stream:
                rows = list(csv.DictReader(stream))
            ids = [row['committeeId'] for row in suppliers['candidates']]
            expected = db.execute("SELECT transaction_id,amount_cents FROM transactions WHERE basis='cash_payment' AND committee_id IN (" + ','.join('?' for _ in ids) + ')', ids).fetchall()
            self.assertEqual({row['transaction_id']: int(row['amount_cents']) for row in rows}, dict(expected))
            self.assertEqual(suppliers['totals']['cashRaisedCents'], sum(int(row['cash_cents']) for row in candidates if row['committee_id'] in ids))
        finally:
            db.close()

if __name__ == '__main__':
    unittest.main()
