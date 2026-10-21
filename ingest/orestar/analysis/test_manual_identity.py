"""The import guard must identify payors exactly as the database normalizer does."""
import json
import subprocess
import unittest
from common import ROOT, identity

class ManualIdentityTest(unittest.TestCase):
    def test_import_guard_matches_database_payor_identity(self):
        source = (ROOT / 'ingest/orestar/import-manual-export.mjs').read_text()
        functions = source[source.index('const norm ='):source.index('for (const row of newRows)')]
        row = {'Tran Id': '1', 'Filer Id': '2', 'Contributor/Payee Committee ID': '',
               'Contributor/Payee': ' City of Portland - Small Donor Elections ', 'Book Type': 'Other',
               'Addr Line1': '123 EXAMPLE ST', 'Addr Line2': '', 'City': 'Portland',
               'State': 'OR', 'Zip': '97204', 'Country': 'United States'}
        variants = [row, {**row, 'Contributor/Payee Committee ID': '123'},
                    {**row, 'Contributor/Payee': 'Café \"Example\"', 'Addr Line2': 'Suite  2'}]
        script = "import { createHash } from 'node:crypto';\n" + functions + "\nconsole.log(JSON.stringify(JSON.parse(process.argv[1]).map(identity)));"
        actual = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', script, json.dumps(variants)], text=True))
        self.assertEqual(actual, [identity(item)[0] for item in variants])
