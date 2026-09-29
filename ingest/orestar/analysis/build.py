"""Audit + normalize the frozen edition; fail closed on drift or new semantics.

Run with the pinned Python environment. No source files are modified. Outputs
are immutable content-addressed builds; publication points at a completed build.
"""
from __future__ import annotations
import csv
import json
import os
from collections import Counter
from datetime import date, timedelta
from pathlib import Path

os.environ.setdefault("OMP_NUM_THREADS", "2")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "2")
import duckdb
import pyarrow as pa
import pyarrow.parquet as pq
from common import *

INPUTS = [
    ("contributions", "af941a5a33884de19f47e56cfbaa04ad972062c67746da683f6679ed07a7bb53", 217239),
    ("non-contributions", "129c673acff441295b47e6e99f52d6e1f9e350a57d8ab0137aca364869546790", 99687),
]

def audit_source(label, expected_hash, expected_count):
    folder = ROOT / f"runtime-data/orestar/{label}-{START}_{END}"
    source = folder / f"orestar-{label}-{START}_{END}.csv"
    actual_hash = digest(source)
    if actual_hash != expected_hash:
        raise ValueError(f"Frozen source changed: {source}")
    manifest = json.loads((folder / "manifest.json").read_text())
    entries = list(manifest["entries"].values())
    leaves = [e for e in entries if e["status"] in ("complete", "empty")]
    if any(e["status"] == "failed" for e in entries):
        raise ValueError("Unresolved acquisition failures")
    partitions = []
    for e in leaves:
        if e["status"] == "complete":
            raw = folder / e["rawFile"]
            if digest(raw) != e["sha256"]:
                raise ValueError(f"Raw checksum mismatch: {raw}")
        partitions.append({**e, "transactionType": e.get("transactionType", "C")})
    # Every day in every requested family must occur in exactly one leaf.
    # Subtype fallback requires a separate exhaustive subtype-domain audit.
    if any(e.get("subtype") for e in leaves):
        raise ValueError("Subtype-partition domain review required")
    families = ["C"] if label == "contributions" else ["E", "O", "OA", "OD", "OR"]
    for family in families:
        windows = sorted((e for e in partitions if e["transactionType"] == family), key=lambda e: e["start"])
        expected_start = START
        for e in windows:
            if e["start"] != expected_start:
                raise ValueError(f"Partition gap/overlap: {family} {expected_start}")
            expected_start = (date.fromisoformat(e["end"]) + timedelta(days=1)).isoformat()
        if expected_start != (date.fromisoformat(END) + timedelta(days=1)).isoformat():
            raise ValueError(f"Incomplete partition: {family}")
    if sum(e["count"] for e in leaves) != expected_count:
        raise ValueError("Manifest count mismatch")
    return source, partitions, {"file": str(source.relative_to(ROOT)), "sha256": actual_hash, "expected_rows": expected_count, "raw_files": sum(e["status"] == "complete" for e in leaves), "manifest_sha256": digest(folder / "manifest.json"), "retrieval_start": min(e["retrievedAt"] for e in leaves), "retrieval_end": max(e["retrievedAt"] for e in leaves), "partitions": partitions}

def run():
    WORK.mkdir(parents=True, exist_ok=True)
    output = WORK / "normalized.parquet"
    writer = None
    batch, audits, all_ids, original_ids, filers, subtypes = [], [], set(), set(), set(), Counter()
    raw_rows = []
    for label, expected_hash, expected_count in INPUTS:
        source, partitions, audit = audit_source(label, expected_hash, expected_count)
        count = 0
        with source.open(newline="", encoding="utf-8-sig") as f:
            reader = csv.reader(f)
            headers = next(reader)
            if len(headers) != 46 or len(set(headers)) != 46:
                raise ValueError("Unexpected source schema")
            for line, values in enumerate(reader, 2):
                if len(values) != len(headers):
                    raise ValueError(f"Invalid row width: {source.name}:{line}")
                r = dict(zip(headers, values))
                txid, original = r["Tran Id"].strip(), r["Original Id"].strip()
                if not txid or txid in all_ids:
                    raise ValueError(f"Duplicate/empty transaction id: {txid}")
                if original and original in original_ids:
                    raise ValueError(f"Repeated current original id: {original}")
                all_ids.add(txid)
                if original:
                    original_ids.add(original)
                filers.add(r["Filer Id"])
                day = iso(r["Tran Date"])
                if not day or not START <= day <= END:
                    raise ValueError(f"Out-of-range transaction: {txid}")
                subtype = r["Sub Type"]
                if subtype not in SEMANTICS:
                    raise ValueError(f"Unreviewed financial subtype: {subtype}")
                basis, direction, cash_sign = SEMANTICS[subtype]
                entity, identity_status = identity(r)
                family = {"Contribution": "C", "Expenditure": "E", "Other": "O", "Other Account Receivable": "OA", "Other Disbursement": "OD", "Other Receipt": "OR"}[r["Transaction Type"]]
                partition = next(e for e in partitions if e["transactionType"] == family and e["start"] <= day <= e["end"])
                filed = iso(r["Filed Date"])
                record = {
                    "transaction_id": txid, "original_id": original or None,
                    "transaction_date": day, "filed_date": filed, "status": r["Tran Status"],
                    "committee_id": r["Filer Id"].strip(), "committee_name": r["Filer"],
                    "entity_id": entity, "entity_name": r["Contributor/Payee"], "identity_status": identity_status,
                    "counterparty_committee_id": r["Contributor/Payee Committee ID"].strip() or None,
                    "is_disclosure_category": identity_status == "disclosure_category",
                    "subtype": subtype, "family": r["Transaction Type"], "basis": basis, "direction": direction,
                    "amount_cents": cents(r["Amount"]), "cash_sign": cash_sign,
                    "book_type": r["Book Type"] or "Unspecified",
                    "city": norm(r["City"]), "state": norm(r["State"]), "county": norm(r["County"]),
                    "employer": r["Emp Name"], "occupation": r["Occptn Txt"],
                    "purpose_codes": r["Purpose Codes"], "purpose_description": r["Purp Desc"],
                    "filed_lag_days": (date.fromisoformat(filed) - date.fromisoformat(day)).days if filed else None,
                    "source_dataset": label, "source_row": line, "source_raw_file": partition["rawFile"],
                    "retrieved_at": partition["retrievedAt"],
                }
                batch.append(record)
                raw_rows.append({"transaction_id": txid, "source_record_json": json.dumps(r, ensure_ascii=False)})
                subtypes[subtype] += 1
                count += 1
                if len(batch) >= 10000:
                    table = pa.Table.from_pylist(batch)
                    if writer is None:
                        writer = pq.ParquetWriter(output, table.schema)
                    writer.write_table(table.cast(writer.schema))
                    batch.clear()
        if count != expected_count:
            raise ValueError(f"Source row count mismatch: {label}")
        audit.update({"rows": count, "row_width": len(headers)})
        audits.append(audit)
    if batch:
        table = pa.Table.from_pylist(batch)
        writer.write_table(table.cast(writer.schema))
    writer.close()
    pq.write_table(pa.Table.from_pylist(raw_rows), WORK / "original-records-private.parquet")
    assert len(all_ids) == 316926 and len(filers) == 1888
    # Each code revision gets a new DB file, never overwriting a running reader.
    build_hash = hashlib.sha256((digest(output) + digest(Path(__file__)) + digest(Path(__file__).with_name("common.py"))).encode()).hexdigest()[:16]
    dbfile = WORK / f"analysis-{build_hash}.duckdb"
    if not dbfile.exists():
        con = duckdb.connect(str(dbfile))
        con.execute("SET threads=2; SET memory_limit='2GB'")
        con.execute("CREATE TABLE transactions AS SELECT * FROM read_parquet(?)", [str(output)])
        con.execute("CREATE UNIQUE INDEX transaction_pk ON transactions(transaction_id)")
        con.execute("CREATE INDEX filer_idx ON transactions(committee_id)")
        con.execute("CREATE INDEX entity_idx ON transactions(entity_id)")
        con.execute("CREATE TABLE committees AS SELECT committee_id, arg_max(committee_name, transaction_date) AS name, min(transaction_date) first_observed, max(transaction_date) last_observed, count(*) records FROM transactions GROUP BY committee_id")
        con.execute("CREATE TABLE entities AS SELECT entity_id, arg_max(entity_name, transaction_date) AS name, any_value(identity_status) identity_status, min(transaction_date) first_observed, max(transaction_date) last_observed, count(*) records FROM transactions GROUP BY entity_id")
        con.execute("CREATE TABLE aliases AS SELECT entity_id, entity_name AS name, min(transaction_date) first_observed, max(transaction_date) last_observed, count(*) records FROM transactions GROUP BY entity_id, entity_name")
        con.execute("CREATE TABLE transfer_candidates AS SELECT r.transaction_id receipt_id, p.transaction_id payment_id, r.counterparty_committee_id sender_id, r.committee_id recipient_id, r.amount_cents, r.transaction_date receipt_date, p.transaction_date payment_date, abs(date_diff('day', cast(r.transaction_date AS DATE), cast(p.transaction_date AS DATE))) day_gap FROM transactions r JOIN transactions p ON r.counterparty_committee_id=p.committee_id AND r.committee_id=p.counterparty_committee_id AND r.amount_cents=p.amount_cents WHERE r.basis='cash_contribution' AND p.basis='cash_payment' AND r.amount_cents>0 AND abs(date_diff('day',cast(r.transaction_date AS DATE),cast(p.transaction_date AS DATE)))<=7")
        con.execute("CREATE TABLE transfers AS SELECT *, CASE WHEN day_gap=0 AND count(*) OVER (PARTITION BY receipt_id)=1 AND count(*) OVER (PARTITION BY payment_id)=1 THEN 'strict_unique_same_day' ELSE 'review_candidate' END AS match_status FROM transfer_candidates")
        con.execute("CREATE TABLE metadata AS SELECT ? AS snapshot, ? AS semantics_version, ? AS identity_version", [SNAPSHOT, SEMANTICS_VERSION, IDENTITY_VERSION])
        con.execute("CHECKPOINT")
        con.close()
    manifest = {"version": 1, "snapshot": SNAPSHOT, "start": START, "end": END, "rows": len(all_ids), "filers": len(filers), "semantics_version": SEMANTICS_VERSION, "identity_version": IDENTITY_VERSION, "database": str(dbfile.relative_to(ROOT)), "database_sha256": digest(dbfile), "normalized_sha256": digest(output), "source_files": audits, "subtypes": dict(subtypes), "checks": {"source_hashes": "passed", "raw_hashes": "passed", "partition_coverage": "passed", "row_widths": "passed", "unique_transaction_ids": "passed", "unique_current_original_ids": "passed", "date_coverage": "passed"}, "limits": ["Count agreement is not proof of complete underlying disclosure.", "Deleted and expired versions excluded; initial-disclosure history unavailable.", "November–December 2024 omitted; not a full election-cycle ledger.", "Recent transactions may not yet have been filed."]}
    write_json(WORK / "manifest.json", manifest)
    write_json(RESEARCH / "snapshot-manifest.json", manifest)
    write_json(RESEARCH / "transaction-semantics.json", {"version": SEMANTICS_VERSION, "source": "https://sos.oregon.gov/elections/documents/orestartransfiling.pdf", "fields": ["basis", "direction", "cash_sign"], "subtypes": SEMANTICS, "notes": ["Loan payment amounts are not split into principal and interest without association detail.", "Cash signs describe reported cash effects, not verified bank balances.", "Lost checks and cash adjustments are separate from cash raised.", "The export's Aggregate Amount is not an additive transaction amount."]})
    print(json.dumps({k: manifest[k] for k in ["snapshot", "rows", "filers", "database", "checks"]}, indent=2))

if __name__ == "__main__":
    run()
