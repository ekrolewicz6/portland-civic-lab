"""Rebuild the single active transaction database from complete verified daily exports.

Never append a partial daily slice: a complete current view accounts for late filings,
amendments, deletions and changes to earlier transaction dates.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
from datetime import date
from pathlib import Path

import duckdb
import pyarrow as pa
import pyarrow.parquet as pq

from common import ROOT, SEMANTICS, cents, identity, iso, norm, write_json
from daily_dashboard import verified_source
from active_finance import build as build_candidate_facts
from verify_active import verify

RESEARCH = ROOT / "research/campaign-finance"
BASE = json.loads((RESEARCH / "snapshot-manifest.json").read_text())
HEADER_COUNT = 46


def digest(path: Path) -> str:
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def normalize(row: dict, source_name: str, source_row: int, source_file: str, retrieved_at: str) -> dict:
    day, filed = iso(row["Tran Date"]), iso(row["Filed Date"])
    entity, identity_status = identity(row)
    basis, direction, cash_sign = SEMANTICS[row["Sub Type"]]
    return {
        "transaction_id": row["Tran Id"], "original_id": row["Original Id"] or None,
        "transaction_date": day, "filed_date": filed, "status": row["Tran Status"],
        "committee_id": row["Filer Id"].strip(), "committee_name": row["Filer"],
        "entity_id": entity, "entity_name": row["Contributor/Payee"], "identity_status": identity_status,
        "counterparty_committee_id": row["Contributor/Payee Committee ID"].strip() or None,
        "is_disclosure_category": identity_status == "disclosure_category",
        "subtype": row["Sub Type"], "family": row["Transaction Type"],
        "basis": basis, "direction": direction, "amount_cents": cents(row["Amount"]), "cash_sign": cash_sign,
        "book_type": row["Book Type"] or "Unspecified", "city": norm(row["City"]),
        "state": norm(row["State"]), "county": norm(row["County"]),
        "employer": row["Emp Name"], "occupation": row["Occptn Txt"],
        "purpose_codes": row["Purpose Codes"], "purpose_description": row["Purp Desc"],
        "filed_lag_days": (date.fromisoformat(filed) - date.fromisoformat(day)).days if filed else None,
        "source_dataset": source_name, "source_row": source_row, "source_raw_file": source_file,
        "retrieved_at": retrieved_at,
    }


def build(end: str) -> dict:
    sources = []
    for label in ("contributions", "non-contributions"):
        path, metadata = verified_source(end, label)
        sources.append((label, path, metadata))
    source_digest = hashlib.sha256(json.dumps({
        "sources": [source[2]["sha256"] for source in sources],
        "builder": digest(Path(__file__)), "normalizer": digest(Path(__file__).with_name("common.py")),
        "candidate_metrics": digest(Path(__file__).with_name("active_finance.py")),
        "matching_payors": digest(ROOT / 'public/data/campaign-finance/public-matching-receipts.csv'),
        "semantics": BASE["semantics_version"],
    }, sort_keys=True).encode()).hexdigest()[:12]
    snapshot = f"orestar-20250101-{end.replace('-', '')}-{source_digest}"
    work = ROOT / "runtime-data/orestar-analysis" / snapshot
    work.mkdir(parents=True, exist_ok=True)
    parquet_file = work / "normalized.parquet"
    database_file = work / "analysis.duckdb"
    temporary_db = work / "analysis.tmp.duckdb"
    if database_file.exists():
        existing = json.loads((work / "manifest.json").read_text())
        if digest(database_file) != existing["database_sha256"]:
            raise ValueError("Existing full-refresh database hash mismatch")
        return existing
    if parquet_file.exists() or temporary_db.exists():
        raise ValueError(f"Unresolved earlier build in {work}")
    writer = None
    batch = []
    seen_ids, seen_originals, filers = set(), set(), set()
    source_files = []
    for label, source, metadata in sources:
        count = 0
        with source.open(newline="", encoding="utf-8-sig") as handle:
            reader = csv.reader(handle)
            headers = next(reader)
            if len(headers) != HEADER_COUNT or len(set(headers)) != HEADER_COUNT:
                raise ValueError(f"Unexpected export headers: {label}")
            for line, values in enumerate(reader, 2):
                if len(values) != HEADER_COUNT:
                    raise ValueError(f"Wrong row width: {label}:{line}")
                row = dict(zip(headers, values))
                txid, original = row["Tran Id"].strip(), row["Original Id"].strip()
                if not txid or txid in seen_ids:
                    raise ValueError(f"Duplicate/blank transaction ID: {txid}")
                if original and original in seen_originals:
                    raise ValueError(f"Two current versions of original ID: {original}")
                seen_ids.add(txid)
                if original:
                    seen_originals.add(original)
                day = iso(row["Tran Date"])
                if not day or not "2025-01-01" <= day <= end:
                    raise ValueError(f"Out-of-range transaction date: {txid}")
                if row["Sub Type"] not in SEMANTICS:
                    raise ValueError(f"Unreviewed subtype: {row['Sub Type']}")
                if (label == "contributions") != (row["Transaction Type"] == "Contribution"):
                    raise ValueError(f"Wrong source family: {txid}")
                filers.add(row["Filer Id"].strip())
                batch.append(normalize(row, label, line, str(source.relative_to(ROOT)), metadata["generatedAt"]))
                count += 1
                if len(batch) >= 10000:
                    table = pa.Table.from_pylist(batch)
                    if writer is None:
                        writer = pq.ParquetWriter(parquet_file, table.schema)
                    writer.write_table(table.cast(writer.schema))
                    batch.clear()
        if count != metadata["mergedRows"]:
            raise ValueError(f"Source row count changed: {label}")
        source_files.append({"file": str(source.relative_to(ROOT)), "sha256": metadata["sha256"],
                             "rows": count, "retrieval_end": metadata["generatedAt"],
                             "method": "verified_complete_current_search"})
    if batch:
        table = pa.Table.from_pylist(batch)
        if writer is None:
            writer = pq.ParquetWriter(parquet_file, table.schema)
        writer.write_table(table.cast(writer.schema))
    if writer is None:
        raise ValueError("Empty current ORESTAR exports")
    writer.close()
    con = duckdb.connect(str(temporary_db))
    try:
        con.execute("SET threads=2; SET memory_limit='2GB'")
        con.execute("CREATE TABLE transactions AS SELECT * FROM read_parquet(?)", [str(parquet_file)])
        count, unique = con.execute("SELECT count(*),count(DISTINCT transaction_id) FROM transactions").fetchone()
        if (count, unique) != (sum(source[2]["mergedRows"] for source in sources), len(seen_ids)):
            raise ValueError("Database count/uniqueness mismatch")
        con.execute("CREATE UNIQUE INDEX transaction_pk ON transactions(transaction_id)")
        con.execute("CREATE INDEX filer_idx ON transactions(committee_id)")
        con.execute("CREATE INDEX entity_idx ON transactions(entity_id)")
        con.execute("CREATE TABLE committees AS SELECT committee_id, arg_max(committee_name, transaction_date) AS name, min(transaction_date) first_observed, max(transaction_date) last_observed, count(*) records FROM transactions GROUP BY committee_id")
        con.execute("CREATE TABLE entities AS SELECT entity_id, arg_max(entity_name, transaction_date) AS name, any_value(identity_status) identity_status, min(transaction_date) first_observed, max(transaction_date) last_observed, count(*) records FROM transactions GROUP BY entity_id")
        con.execute("CREATE TABLE aliases AS SELECT entity_id, entity_name AS name, min(transaction_date) first_observed, max(transaction_date) last_observed, count(*) records FROM transactions GROUP BY entity_id, entity_name")
        con.execute("CREATE TABLE transfer_candidates AS SELECT r.transaction_id receipt_id, p.transaction_id payment_id, r.counterparty_committee_id sender_id, r.committee_id recipient_id, r.amount_cents, r.transaction_date receipt_date, p.transaction_date payment_date, abs(date_diff('day', cast(r.transaction_date AS DATE), cast(p.transaction_date AS DATE))) day_gap FROM transactions r JOIN transactions p ON r.counterparty_committee_id=p.committee_id AND r.committee_id=p.counterparty_committee_id AND r.amount_cents=p.amount_cents WHERE r.basis='cash_contribution' AND p.basis='cash_payment' AND r.amount_cents>0 AND abs(date_diff('day',cast(r.transaction_date AS DATE),cast(p.transaction_date AS DATE)))<=7")
        con.execute("CREATE TABLE transfers AS SELECT *, CASE WHEN day_gap=0 AND count(*) OVER (PARTITION BY receipt_id)=1 AND count(*) OVER (PARTITION BY payment_id)=1 THEN 'strict_unique_same_day' ELSE 'review_candidate' END AS match_status FROM transfer_candidates")
        build_candidate_facts(con, snapshot, '2025-01-01', end)
        con.execute("CREATE TABLE metadata AS SELECT ? AS snapshot, ? AS semantics_version, ? AS identity_version", [snapshot, BASE["semantics_version"], BASE["identity_version"]])
        con.execute("CHECKPOINT")
    finally:
        con.close()
    os.replace(temporary_db, database_file)
    manifest = {
        "version": 3, "snapshot": snapshot, "start": "2025-01-01", "end": end,
        "rows": len(seen_ids), "filers": len(filers),
        "semantics_version": BASE["semantics_version"], "identity_version": BASE["identity_version"],
        "database": str(database_file.relative_to(ROOT)), "database_sha256": digest(database_file),
        "normalized_sha256": digest(parquet_file), "source_files": source_files,
        "source_count_verified": True, "search_filters_verified": True,
        "completeness_verified": False,
        "checks": {"source_hashes": "passed", "source_result_counts": "passed", "row_widths": "passed", "unique_transaction_ids": "passed", "unique_original_ids": "passed", "date_coverage": "passed", "derived_tables_rebuilt": "passed", "transaction_derived_candidate_facts": "passed"},
        "limits": ["Count agreement does not prove complete underlying disclosure.",
                   "Recent transactions may not yet have been filed.",
                   "November–December 2024 is omitted from this observation window."],
    }
    write_json(work / "manifest.json", manifest)
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--end", required=True)
    args = parser.parse_args()
    manifest = build(args.end)
    verify((ROOT / manifest['database']).parent / 'manifest.json')
    write_json(RESEARCH / "active-snapshot-manifest.json", manifest)
    print(json.dumps({key: manifest[key] for key in ("snapshot", "rows", "filers", "database")}, indent=2))


if __name__ == "__main__":
    main()
