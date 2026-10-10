"""Apply approved ORESTAR amendments that the manual importer held for review.

Every change is listed in research/campaign-finance/reviewed-amendments.json with
the workbook it came from, the reason and who approved it. The script rebuilds
one new immutable database from the active one, checks each change against the
archived workbook, and changes nothing outside the approved list.
"""
from __future__ import annotations

import hashlib
import json
import os

import duckdb

from common import ROOT, cents, iso, write_json
from merge_manual_export import ACTIVE, RESEARCH, digest, normalize, rebuild_derived
from verify_active import verify

REGISTRY = RESEARCH / 'reviewed-amendments.json'
PUBLIC = ROOT / 'public/data/campaign-finance/reviewed-amendments.json'
PUBLIC_FIELDS = ('kind', 'transactionId', 'existingTransactionId', 'incomingTransactionId', 'filerId', 'filer', 'subtype',
                 'transactionDate', 'fromAmountCents', 'toAmountCents', 'existingTransactionDate', 'existingAmountCents',
                 'incomingTransactionDate', 'incomingAmountCents', 'reason', 'approvedAt', 'appliedSnapshot')


def publish(registry: dict) -> None:
    """Public copy: what changed and why, without workbook hashes or names of approvers."""
    applied = [{key: item[key] for key in PUBLIC_FIELDS if key in item} for item in registry['amendments'] if item.get('appliedSnapshot')]
    write_json(PUBLIC, {'version': registry['version'], 'note': registry['note'], 'amendments': applied})


def run() -> dict:
    registry = json.loads(REGISTRY.read_text())
    pending = [item for item in registry['amendments'] if item['decision'] == 'approved' and not item.get('appliedSnapshot')]
    if not pending:
        publish(registry)
        return {'status': 'nothing_to_apply'}
    previous = json.loads(ACTIVE.read_text())
    base_path = ROOT / previous['database']
    if digest(base_path) != previous['database_sha256']:
        raise ValueError('Active database checksum mismatch')

    updates, replacements = [], []
    for sha in sorted({item['workbookSha256'] for item in pending}):
        archive = ROOT / 'runtime-data/orestar-manual' / sha
        audit = json.loads((archive / 'audit.json').read_text())
        if not any(source['sha256'] == sha for source in previous['source_files']):
            raise ValueError(f'Workbook {sha[:12]} is not part of the active database')
        held = audit['heldForReview']
        raw = {row['Tran Id']: row for row in json.loads((archive / 'held-raw-records.json').read_text())}
        for item in (entry for entry in pending if entry['workbookSha256'] == sha):
            if item['kind'] == 'changed_existing':
                match = next(entry for entry in held['changedExisting'] if entry['transactionId'] == item['transactionId'])
                differences = match['differences']
                if [difference['field'] for difference in differences] != ['amount_cents']:
                    raise ValueError(f"Only a reviewed amount change can be applied in place: {item['transactionId']}")
                row = raw[item['transactionId']]
                if (differences[0]['existing'], differences[0]['incoming'], cents(row['Amount'])) != (item['fromAmountCents'], item['toAmountCents'], item['toAmountCents']):
                    raise ValueError(f"Reviewed amounts do not match the workbook: {item['transactionId']}")
                updates.append(item)
            elif item['kind'] == 'superseded':
                match = next(entry for entry in held['superseding'] if entry['existingTransactionId'] == item['existingTransactionId'])
                row = raw[item['incomingTransactionId']]
                checks = (match['incomingTransactionId'] == item['incomingTransactionId'], row['Tran Status'] == 'Amended',
                          cents(row['Amount']) == item['incomingAmountCents'], iso(row['Tran Date']) == item['incomingTransactionDate'],
                          row['Filer Id'].strip() == item['filerId'])
                if not all(checks):
                    raise ValueError(f"Reviewed amendment does not match the workbook: {item['incomingTransactionId']}")
                replacements.append((item, row, archive, audit))
            else:
                raise ValueError(f"Unknown amendment kind: {item['kind']}")

    keys = sorted(item.get('transactionId') or item['incomingTransactionId'] for item in pending)
    suffix = hashlib.sha256((previous['database_sha256'] + json.dumps(keys)).encode()).hexdigest()[:12]
    snapshot = f"orestar-20250101-{previous['end'].replace('-', '')}-{suffix}"
    work = ROOT / 'runtime-data/orestar-analysis' / snapshot
    output, temp = work / 'analysis-merged.duckdb', work / 'analysis-merged.tmp.duckdb'
    if output.exists() or temp.exists():
        raise ValueError(f'Unresolved database at {work}; inspect before retrying')
    work.mkdir(parents=True, exist_ok=True)
    con = duckdb.connect(str(temp))
    try:
        con.execute("SET threads=2; SET memory_limit='2GB'")
        con.execute(f"ATTACH '{str(base_path).replace(chr(39), chr(39) * 2)}' AS prior (READ_ONLY)")
        con.execute('CREATE TABLE transactions AS SELECT * FROM prior.transactions')
        families = dict(con.execute('SELECT subtype,any_value(family) FROM transactions GROUP BY subtype').fetchall())
        columns = len(con.execute('DESCRIBE transactions').fetchall())
        for item in updates:
            changed = con.execute('UPDATE transactions SET amount_cents=? WHERE transaction_id=? AND amount_cents=? AND committee_id=? RETURNING transaction_id',
                                  [item['toAmountCents'], item['transactionId'], item['fromAmountCents'], item['filerId']]).fetchall()
            if len(changed) != 1:
                raise ValueError(f"Expected one record to update: {item['transactionId']}")
        for item, row, archive, audit in replacements:
            existing = con.execute('SELECT original_id,committee_id,subtype,amount_cents,transaction_date FROM transactions WHERE transaction_id=?',
                                   [item['existingTransactionId']]).fetchall()
            if len(existing) != 1:
                raise ValueError(f"Superseded record is not in the ledger: {item['existingTransactionId']}")
            original, committee, subtype, amount, day = existing[0]
            if row['Original Id'] not in (original, item['existingTransactionId']) or committee != item['filerId'] or subtype != row['Sub Type'] \
                    or (amount, day) != (item['existingAmountCents'], item['existingTransactionDate']):
                raise ValueError(f"Superseded record differs from the review: {item['existingTransactionId']}")
            con.execute('DELETE FROM transactions WHERE transaction_id=?', [item['existingTransactionId']])
            con.execute(f"INSERT INTO transactions VALUES ({','.join('?' for _ in range(columns))})", normalize(row, families[row['Sub Type']], archive, audit))
        count, unique, filers = con.execute('SELECT count(*),count(DISTINCT transaction_id),count(DISTINCT committee_id) FROM transactions').fetchone()
        if count != previous['rows'] or unique != count:
            raise ValueError('Amended transaction count or IDs do not reconcile')
        if con.execute('SELECT count(*)-count(DISTINCT original_id) FROM transactions WHERE original_id IS NOT NULL').fetchone()[0]:
            raise ValueError('Two current transaction versions share an Original Id')
        rebuild_derived(con, snapshot, previous['start'], previous['end'], previous)
        con.execute('DETACH prior')
        con.execute('CHECKPOINT')
    except Exception:
        con.close()
        temp.unlink(missing_ok=True)
        raise
    else:
        con.close()
    os.replace(temp, output)

    for item in pending:
        item['appliedSnapshot'] = snapshot
    applied = [{key: item[key] for key in PUBLIC_FIELDS if key in item} for item in pending]
    limits = [limit for limit in previous.get('limits', []) if 'held for review' not in limit]
    limits.append(f'{len(pending)} reviewed amendment(s) were applied after import; they are listed in reviewed-amendments.json.')
    manifest = {**previous, 'snapshot': snapshot, 'base_snapshot': previous['snapshot'], 'rows': count, 'filers': filers,
                'database': str(output.relative_to(ROOT)), 'database_sha256': digest(output),
                'reviewed_amendments': [*previous.get('reviewed_amendments', []), *applied],
                'checks': {**previous['checks'], 'reviewed_amendments': 'applied'}, 'limits': limits}
    write_json(work / 'manifest.json', manifest)
    # The registry must name the amendments before verification, which allows only listed base-row changes.
    write_json(REGISTRY, registry)
    verify(work / 'manifest.json')
    write_json(ACTIVE, manifest)
    publish(registry)
    return {'status': 'applied', 'snapshot': snapshot, 'rows': count, 'updated': len(updates), 'replaced': len(replacements)}


if __name__ == '__main__':
    print(json.dumps(run(), indent=2))
