"""Build reproducible public analysis downloads from the minimized ledger only."""
import csv
import gzip
import hashlib
import io
import json
import tempfile
import zipfile
from pathlib import Path
import duckdb
from package_publication import TABLE_COLUMNS

ROOT = Path(__file__).resolve().parents[3]
PUBLIC = ROOT / 'public/data/campaign-finance'
OUT = PUBLIC / 'downloads'
DOCS = ROOT / 'ingest/orestar/download-docs'
SITE = 'https://www.portlandciviclab.org'
PREFIX = SITE + '/data/campaign-finance/downloads/'
TABLE_DESCRIPTIONS = {
    'transactions': 'All current-version transactions in the published ledger. One row per transaction_id; integer USD cents. Never add unlike accounting bases.',
    'committees': 'All filing committees observed in these records, including candidates, PACs, parties and ballot measures.',
    'entities': 'Conservative counterparty record groups. Only committee: IDs identify an authoritative committee; other groups are not verified people or legal entities.',
    'aliases': 'Reported names for each conservative entity group.',
    'reviewed_matching_ids': 'Transaction IDs classified as City public matching receipts. Join by transaction_id to separate public from private contributions.',
    'candidate_finance_facts': 'Derived JSON facts for 18 reviewed council/auditor committees. Governor records are in transactions; governor interpretations are in evidence/governor/data.json.',
}
FIELDS = {
    'transaction_id': 'ORESTAR current transaction identifier, stored as text. Primary key.',
    'original_id': 'ORESTAR original-version identifier. Not a second transaction to count. Null means not supplied.',
    'transaction_date': 'Reported transaction date, ISO YYYY-MM-DD; not the download date.',
    'filed_date': 'Current version filing date, ISO YYYY-MM-DD; may differ from original disclosure date.',
    'status': 'Reported current-version status, such as Original or Amended.',
    'committee_id': 'ORESTAR filing committee identifier, stored as text.',
    'committee_name': 'Reported filing committee name. Not a verified candidate/race link.',
    'entity_id': 'Conservative reported counterparty group. committee: is authoritative; record: is a fingerprint; disclosure: and unknown: are not donors.',
    'entity_name': 'Reported counterparty name, not an independently verified identity.',
    'identity_status': 'authoritative_committee_id, provisional_record_group, disclosure_category or unknown.',
    'subtype': 'Original ORESTAR accounting subtype.',
    'basis': 'Normalized accounting basis; use cash_contribution for gross cash raised and cash_payment for gross cash paid out.',
    'direction': 'in, out or adjustment relative to the filing committee. Not sufficient to calculate cash effect without subtype semantics.',
    'amount_cents': 'Signed integer USD cents, exact; divide by 100 for dollars. Do not sum unrelated bases.',
    'city': 'Normalized reported counterparty city; may be blank.',
    'state': 'Normalized reported counterparty state; may be blank.',
    'purpose_codes': 'Reported purpose categories, not unrestricted free-text descriptions.',
    'source_dataset': 'Public acquisition batch label; not a download path.',
    'source_row': 'Row locator within the private source batch, not an additional ID.',
    'retrieved_at': 'Source acquisition/file timestamp retained for provenance; not proof of source completeness.',
    'family': 'Acquisition family. For accounting, filter basis rather than family.',
    'book_type': 'Reported contributor/payee type. Business size, ownership and political affiliation are not inferred.',
    'is_disclosure_category': 'True for combined or generic disclosure rows; do not count as an identified donor.',
    'name': 'Reported name associated with this ID.',
    'first_observed': 'Earliest transaction date observed in this snapshot.',
    'last_observed': 'Latest transaction date observed in this snapshot.',
    'records': 'Number of transaction records, not a count of unique people.',
    'facts_json': 'JSON-encoded candidate facts; cash amounts are cents. Separately dated official balances are not refreshed by these facts.',
}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()


def run():
    manifest = json.loads((ROOT / 'server-data/campaign-finance/manifest.json').read_text())
    source = ROOT / manifest['database']
    assert digest(source.read_bytes()) == manifest['database_sha256']
    # No private database, workbook, research directory or arbitrary binary is an input.
    assert manifest['database'] == 'server-data/campaign-finance/finance.duckdb'
    db = duckdb.connect(str(source), read_only=True)
    db.execute('SET threads=2')
    tables = {}
    members = {}
    with tempfile.TemporaryDirectory(prefix='finance-downloads-') as temp:
        staging = Path(temp)
        for table, columns in TABLE_COLUMNS.items():
            schema = db.execute(f'DESCRIBE {table}').fetchall()
            assert [row[0] for row in schema] == columns
            order = 'committee_id,transaction_date,transaction_id' if table == 'transactions' else ','.join(columns)
            target = staging / f'{table}.parquet'
            db.execute(f"COPY (SELECT {','.join(columns)} FROM {table} ORDER BY {order}) TO '{target}' (FORMAT PARQUET, COMPRESSION ZSTD, COMPRESSION_LEVEL 19, ROW_GROUP_SIZE 122880)")
            # Exact multiset equivalence, not only a row-count comparison.
            for left, right in [(table, f"read_parquet('{target}')"), (f"read_parquet('{target}')", table)]:
                assert db.execute(f'SELECT count(*) FROM (SELECT * FROM {left} EXCEPT ALL SELECT * FROM {right})').fetchone()[0] == 0
            name = f'tables/{table}.parquet'
            members[name] = target.read_bytes()
            tables[table] = {'file': name, 'rows': db.execute(f'SELECT count(*) FROM {table}').fetchone()[0],
                             'description': TABLE_DESCRIPTIONS[table], 'columns': [{'name': row[0], 'type': row[1], 'description': FIELDS[row[0]]} for row in schema]}
        assert tables['transactions']['rows'] == manifest['rows']
        evidence = []
        for path in sorted(PUBLIC.rglob('*')):
            if not path.is_file() or OUT in path.parents:
                continue
            assert not path.is_symlink()
            assert path.suffix in {'.json', '.csv', '.geojson', '.md', '.txt'}, f'Unreviewed evidence format: {path.name}'
            name = 'evidence/' + path.relative_to(PUBLIC).as_posix()
            members[name] = path.read_bytes()
            evidence.append(name)
        snapshot = {key: manifest[key] for key in ['snapshot', 'start', 'end', 'rows', 'completeness_verified', 'source_files']}
        members['snapshot.json'] = encoded(snapshot)
        members['schema.json'] = encoded({'version': 1, 'tables': tables, 'nulls': 'Parquet preserves nulls. CSV uses empty fields for null/blank values; IDs should be read as strings.'})
        for name in ['README.md', 'analysis.sql', 'LICENSE-CONTENT.md']:
            members[name] = (DOCS / name).read_bytes() if name != 'LICENSE-CONTENT.md' else (ROOT / name).read_bytes()
        members['README.md'] = members['README.md'].replace(b'{{SNAPSHOT}}', manifest['snapshot'].encode()).replace(b'{{END}}', manifest['end'].encode()).replace(b'{{ROWS}}', str(manifest['rows']).encode())
        members['evidence-index.json'] = encoded({'note': 'All published campaign-finance evidence files. Each retains its own evidence/snapshot dates. Do not concatenate these derived or archived tables with current transactions.', 'files': evidence})
        checksums = {name: {'bytes': len(body), 'sha256': digest(body)} for name, body in sorted(members.items())}
        members['checksums.json'] = encoded(checksums)
        bundle = staging / 'analysis.zip'
        with zipfile.ZipFile(bundle, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for name, body in sorted(members.items()):
                entry = zipfile.ZipInfo(name, date_time=(2020, 1, 1, 0, 0, 0))
                entry.compress_type = zipfile.ZIP_STORED if name.endswith('.parquet') else zipfile.ZIP_DEFLATED
                entry.external_attr = 0o100644 << 16
                archive.writestr(entry, body, compresslevel=9)
        # A portable fallback: exact source text, no formula-prefix mutation. Read as data.
        result = db.execute('SELECT * FROM transactions ORDER BY committee_id,transaction_date,transaction_id')
        text = io.StringIO(newline='')
        writer = csv.writer(text)
        writer.writerow(TABLE_COLUMNS['transactions'])
        writer.writerows(result.fetchall())
        csv_bytes = text.getvalue().encode()
        compressed = io.BytesIO()
        with gzip.GzipFile(fileobj=compressed, mode='wb', filename='', mtime=0, compresslevel=9) as stream:
            stream.write(csv_bytes)
        artifacts = {'bundle': ('analysis.zip', bundle.read_bytes(), 'application/zip'),
                     'parquet': ('transactions.parquet', members['tables/transactions.parquet'], 'application/vnd.apache.parquet'),
                     'csv': ('transactions.csv.gz', compressed.getvalue(), 'application/gzip')}
        downloads = {key: {'url': PREFIX + name, 'bytes': len(body), 'sha256': digest(body), 'mediaType': media} for key, (name, body, media) in artifacts.items()}
        output = {**snapshot, 'version': 1, 'landingPage': SITE + '/deep-dives/campaign-finance/data',
                  'readme': PREFIX + 'README.md', 'schema': PREFIX + 'schema.json', 'queries': PREFIX + 'analysis.sql',
                  'license': 'https://creativecommons.org/licenses/by/4.0/', 'editorialLicense': 'https://creativecommons.org/licenses/by-nd/4.0/',
                  'attribution': 'Portland Civic Lab; underlying records: Oregon Secretary of State ORESTAR. Cite the snapshot and source dates.',
                  'coverage': 'All current records held in our published Oregon ledger, not all ORESTAR history or a complete election cycle. Includes all observed filers, not only council/governor campaigns. Federal FEC records are excluded.',
                  'limitations': ['Manual-export coverage is provisional; older-dated late filings, removals and amendments outside the supplied exports may be missing.', 'Archived maps, balances, event interpretations and network tests retain their individual dates.', 'No donor street addresses, donor-level ZIP codes, employer/occupation fields, unrestricted purpose descriptions or private research files are included.'],
                  'downloads': downloads, 'uncompressedTransactionCsvBytes': len(csv_bytes), 'tables': tables,
                  'bundleMembers': {name: {'bytes': len(body), 'sha256': digest(body)} for name, body in sorted(members.items())}}
        OUT.mkdir(exist_ok=True)
        for name, body, _media in artifacts.values():
            (OUT / name).write_bytes(body)
        for name in ['README.md', 'schema.json', 'analysis.sql']:
            (OUT / name).write_bytes(members[name])
        (OUT / 'manifest.json').write_bytes(encoded(output))
        # Small server-rendered page metadata, not the archive inventory.
        (ROOT / 'src/lib/campaign-finance/downloads.json').write_bytes(encoded({key: value for key, value in output.items() if key not in ['bundleMembers', 'source_files', 'tables']}))
    db.close()
    print(json.dumps({'snapshot': manifest['snapshot'], 'rows': manifest['rows'], 'downloads': downloads, 'evidenceFiles': len(evidence), 'bundleMembers': len(members)}, indent=2))


if __name__ == '__main__':
    run()
