"""Promote a validated manual workbook into one immutable active ORESTAR database."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from datetime import date
from pathlib import Path

import duckdb

from active_finance import build as build_candidate_facts
from common import ROOT, SEMANTICS, cents, identity, iso, norm, write_json
from verify_active import verify

RESEARCH = ROOT / 'research/campaign-finance'
ACTIVE = RESEARCH / 'active-snapshot-manifest.json'


def digest(path: Path) -> str:
    with path.open('rb') as source:
        return hashlib.file_digest(source, 'sha256').hexdigest()


def normalize(row: dict, family: str, archive: Path, audit: dict) -> tuple:
    day, filed = iso(row['Tran Date']), iso(row['Filed Date'])
    entity, identity_status = identity(row)
    basis, direction, cash_sign = SEMANTICS[row['Sub Type']]
    return (
        row['Tran Id'], row['Original Id'] or None, day, filed, row['Tran Status'],
        row['Filer Id'].strip(), row['Filer'], entity, row['Contributor/Payee'], identity_status,
        row['Contributor/Payee Committee ID'].strip() or None,
        identity_status == 'disclosure_category', row['Sub Type'], family, basis, direction,
        cents(row['Amount']), cash_sign, row['Book Type'] or 'Unspecified',
        norm(row['City']), norm(row['State']), norm(row['County']),
        row['Emp Name'], row['Occptn Txt'], row['Purpose Codes'], row['Purp Desc'],
        (date.fromisoformat(filed) - date.fromisoformat(day)).days,
        'manual-export-' + audit['sha256'][:12], row['__source_row'],
        str((archive / f"{audit['sha256']}.xlsx").relative_to(ROOT)), audit['sourceFileMtimeUtc'],
    )


def rebuild_derived(con, snapshot: str, start: str, end: str, previous: dict) -> None:
    """Rebuild every table derived from transactions, plus candidate facts, inside a staged database."""
    con.execute('CREATE UNIQUE INDEX transaction_pk ON transactions(transaction_id)')
    con.execute('CREATE INDEX filer_idx ON transactions(committee_id)')
    con.execute('CREATE INDEX entity_idx ON transactions(entity_id)')
    con.execute('CREATE TABLE committees AS SELECT committee_id,arg_max(committee_name,transaction_date) AS name,min(transaction_date) first_observed,max(transaction_date) last_observed,count(*) records FROM transactions GROUP BY committee_id')
    con.execute('CREATE TABLE entities AS SELECT entity_id,arg_max(entity_name,transaction_date) AS name,any_value(identity_status) identity_status,min(transaction_date) first_observed,max(transaction_date) last_observed,count(*) records FROM transactions GROUP BY entity_id')
    con.execute('CREATE TABLE aliases AS SELECT entity_id,entity_name AS name,min(transaction_date) first_observed,max(transaction_date) last_observed,count(*) records FROM transactions GROUP BY entity_id,entity_name')
    con.execute("CREATE TABLE transfer_candidates AS SELECT r.transaction_id receipt_id,p.transaction_id payment_id,r.counterparty_committee_id sender_id,r.committee_id recipient_id,r.amount_cents,r.transaction_date receipt_date,p.transaction_date payment_date,abs(date_diff('day',cast(r.transaction_date AS DATE),cast(p.transaction_date AS DATE))) day_gap FROM transactions r JOIN transactions p ON r.counterparty_committee_id=p.committee_id AND r.committee_id=p.counterparty_committee_id AND r.amount_cents=p.amount_cents WHERE r.basis='cash_contribution' AND p.basis='cash_payment' AND r.amount_cents>0 AND abs(date_diff('day',cast(r.transaction_date AS DATE),cast(p.transaction_date AS DATE)))<=7")
    con.execute("CREATE TABLE transfers AS SELECT *,CASE WHEN day_gap=0 AND count(*) OVER (PARTITION BY receipt_id)=1 AND count(*) OVER (PARTITION BY payment_id)=1 THEN 'strict_unique_same_day' ELSE 'review_candidate' END match_status FROM transfer_candidates")
    build_candidate_facts(con, snapshot, start, end)
    con.execute('CREATE TABLE metadata AS SELECT ? AS snapshot,? AS semantics_version,? AS identity_version', [snapshot, previous['semantics_version'], previous['identity_version']])


def run(archive: Path) -> dict:
    audit = json.loads((archive / 'audit.json').read_text())
    raw = json.loads((archive / 'new-raw-records.json').read_text())
    source_path = archive / f"{audit['sha256']}.xlsx"
    if digest(source_path) != audit['sha256'] or len(raw) != audit['newRows'] or not raw:
        raise ValueError('Manual archive hash or audited row count mismatch')
    previous = json.loads(ACTIVE.read_text())
    if previous['snapshot'] != audit['baseSnapshot']:
        raise ValueError('Active database changed since workbook validation; rerun the importer')
    base_path = ROOT / previous['database']
    if digest(base_path) != previous['database_sha256']:
        raise ValueError('Active database checksum mismatch')
    prior = duckdb.connect(str(base_path), read_only=True)
    try:
        families = dict(prior.execute('SELECT subtype,any_value(family) FROM transactions GROUP BY subtype').fetchall())
        columns = [row[0] for row in prior.execute('DESCRIBE transactions').fetchall()]
    finally:
        prior.close()
    if len(columns) != 31:
        raise ValueError('Unexpected normalized transaction schema')
    records = []
    for row in raw:
        if row['Sub Type'] not in families:
            raise ValueError(f"No reviewed transaction family for {row['Sub Type']}")
        records.append(normalize(row, families[row['Sub Type']], archive, audit))
    if len({row[0] for row in records}) != len(records):
        raise ValueError('Duplicate incoming transaction IDs')
    end = max(previous['end'], audit['latestTransactionDate'])
    snapshot = f"orestar-20250101-{end.replace('-', '')}-{audit['sha256'][:12]}"
    work = ROOT / 'runtime-data/orestar-analysis' / snapshot
    output = work / 'analysis-merged.duckdb'
    temp = work / 'analysis-merged.tmp.duckdb'
    work.mkdir(parents=True, exist_ok=True)
    if output.exists():
        saved = work / 'manifest.json'
        if not saved.exists():
            raise ValueError(f'Unresolved completed database lacks a manifest at {work}; inspect before retrying')
        existing = json.loads(saved.read_text())
        if existing.get('base_snapshot') != previous['snapshot'] or existing.get('source_files', [{}])[-1].get('sha256') != audit['sha256']:
            raise ValueError(f'Completed database at {work} belongs to another refresh; inspect before retrying')
        verify(saved)
        write_json(ACTIVE, existing)
        return {key: existing[key] for key in ('snapshot', 'rows', 'filers', 'database', 'database_sha256', 'completeness_verified')}
    if temp.exists():
        raise ValueError(f'Unresolved temporary database at {temp}; inspect before retrying')
    con = duckdb.connect(str(temp))
    try:
        con.execute("SET threads=2; SET memory_limit='2GB'")
        con.execute(f"ATTACH '{str(base_path).replace(chr(39), chr(39)*2)}' AS prior (READ_ONLY)")
        con.execute('CREATE TABLE transactions AS SELECT * FROM prior.transactions')
        con.executemany(f"INSERT INTO transactions VALUES ({','.join('?' for _ in columns)})", records)
        count, unique, filers = con.execute('SELECT count(*),count(DISTINCT transaction_id),count(DISTINCT committee_id) FROM transactions').fetchone()
        if count != previous['rows'] + len(records) or unique != count:
            raise ValueError('Merged transaction count or IDs do not reconcile')
        if con.execute('SELECT count(*)-count(DISTINCT original_id) FROM transactions WHERE original_id IS NOT NULL').fetchone()[0]:
            raise ValueError('Two current transaction versions share an Original Id')
        rebuild_derived(con, snapshot, previous['start'], end, previous)
        con.execute('DETACH prior')
        con.execute('CHECKPOINT')
    except Exception:
        con.close()
        temp.unlink(missing_ok=True)
        raise
    else:
        con.close()
    os.replace(temp, output)
    manifest = {
        'version': 3, 'snapshot': snapshot, 'base_snapshot': previous['snapshot'],
        'start': previous['start'], 'end': end, 'rows': count, 'filers': filers,
        'semantics_version': previous['semantics_version'], 'identity_version': previous['identity_version'],
        'database': str(output.relative_to(ROOT)), 'database_sha256': digest(output),
        'source_files': [*previous['source_files'], {
            'file': str(source_path.relative_to(ROOT)), 'sha256': audit['sha256'],
            'rows': audit['sourceRows'], 'overlap_rows': audit['overlapRows'], 'new_rows': audit['newRows'],
            'retrieval_end': audit['sourceFileMtimeUtc'], 'method': 'user_supplied_manual_export',
        }],
        'completeness_verified': False,
        'checks': {'source_hash': 'passed', 'schema': 'passed', 'overlap_ids_and_financial_fields': 'passed',
                   'unique_ids': 'passed', 'transaction_derived_candidate_facts': 'passed',
                   'source_result_count': 'unavailable', 'search_filters': 'unavailable'},
        'limits': audit['limits'],
    }
    check = duckdb.connect(str(output), read_only=True)
    try:
        if check.execute('SELECT count(*) FROM candidate_finance_facts').fetchone()[0] < 17:
            raise ValueError('Candidate fact count failed post-build check')
        if check.execute('SELECT count(*) FROM transactions').fetchone()[0] != count:
            raise ValueError('Post-build row count failed')
    finally:
        check.close()
    write_json(work / 'manifest.json', manifest)
    verify(work / 'manifest.json')
    write_json(ACTIVE, manifest)
    return {key: manifest[key] for key in ('snapshot', 'rows', 'filers', 'database', 'database_sha256', 'completeness_verified')}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('archive', type=Path)
    print(json.dumps(run(parser.parse_args().archive), indent=2))
