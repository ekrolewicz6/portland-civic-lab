"""Independent round-trip checks for the exported analysis kit."""
import csv
import gzip
import hashlib
import io
import json
import os
import tempfile
import unittest
import zipfile
from pathlib import Path
import duckdb

ROOT = Path(__file__).resolve().parents[3]
DIRECTORY = ROOT / 'public/data/campaign-finance/downloads'

class DownloadTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = json.loads((DIRECTORY / 'manifest.json').read_text())
        cls.archive = zipfile.ZipFile(DIRECTORY / 'analysis.zip')

    @classmethod
    def tearDownClass(cls):
        cls.archive.close()

    def test_downloads_match_declared_size_and_hash(self):
        for entry in self.manifest['downloads'].values():
            body = (DIRECTORY / entry['url'].rsplit('/', 1)[1]).read_bytes()
            self.assertEqual(len(body), entry['bytes'])
            self.assertEqual(hashlib.sha256(body).hexdigest(), entry['sha256'])
        self.assertIsNone(self.archive.testzip())

    def test_every_archive_member_is_in_inventory_and_checksum_file(self):
        names = self.archive.namelist()
        self.assertEqual(len(names), len(set(names)))
        self.assertEqual(set(names), set(self.manifest['bundleMembers']))
        checks = json.loads(self.archive.read('checksums.json'))
        self.assertEqual(set(checks), set(names) - {'checksums.json'})
        for name, entry in checks.items():
            self.assertFalse(name.startswith('/'))
            self.assertNotIn('..', Path(name).parts)
            self.assertEqual(hashlib.sha256(self.archive.read(name)).hexdigest(), entry['sha256'])
        evidence = {f'evidence/{p.relative_to(DIRECTORY.parent).as_posix()}' for p in DIRECTORY.parent.rglob('*') if p.is_file() and DIRECTORY not in p.parents}
        self.assertEqual(evidence, {n for n in names if n.startswith('evidence/')})

    def test_csv_contains_all_ids_and_exact_cents(self):
        raw = gzip.decompress((DIRECTORY / 'transactions.csv.gz').read_bytes())
        rows = list(csv.DictReader(io.StringIO(raw.decode())))
        self.assertEqual(len(rows), self.manifest['rows'])
        expected = {r['transaction_id']: int(r['amount_cents']) for r in rows}
        self.assertEqual(len(expected), len(rows))
        db = duckdb.connect(str(ROOT / 'server-data/campaign-finance/finance.duckdb'), read_only=True)
        try:
            self.assertEqual(expected, dict(db.execute('select transaction_id,amount_cents from transactions').fetchall()))
        finally:
            db.close()

    def test_documented_sql_runs_offline_and_reconciles_candidate_totals(self):
        prior = Path.cwd()
        with tempfile.TemporaryDirectory() as temp:
            self.archive.extractall(temp)
            db = duckdb.connect()
            try:
                os.chdir(temp)
                db.execute(Path('analysis.sql').read_text())
                self.assertEqual(db.execute('select count(*) from transactions').fetchone()[0], self.manifest['rows'])
                for committee, serialized in db.execute('select committee_id,facts_json from candidate_finance_facts').fetchall():
                    facts = json.loads(serialized)
                    cash, matching = db.execute('select cash_cents,matching_cents from cash_by_committee where committee_id=?', [committee]).fetchone()
                    self.assertEqual(cash, facts['cashCents'])
                    self.assertEqual(matching, facts['publicCents'])
                # Independent median and all tied modes agree with the provided SQL.
                values = [r[0] for r in db.execute("select amount_cents from individual_gifts where committee_id='23208'").fetchall()]
                import statistics
                from collections import Counter
                counts = Counter(values); frequency = max(counts.values())
                mean, median, modes = db.execute("select mean_cents,median_cents,modes_cents from individual_gift_statistics where committee_id='23208'").fetchone()
                self.assertEqual(mean, statistics.mean(values))
                self.assertEqual(median, statistics.median(values))
                self.assertEqual(modes, sorted(value for value,n in counts.items() if n==frequency) if frequency>1 else None)
            finally:
                db.close()
                os.chdir(prior)
