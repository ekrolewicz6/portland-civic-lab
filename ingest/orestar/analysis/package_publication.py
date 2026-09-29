"""Build a privacy-minimized, self-contained server bundle from the verified ledger.

Run locally, never in a hosted build. Original exports, addresses, free-text
descriptions, collection logs and research notes are not publication inputs.
"""
import argparse
import csv
import hashlib
import json
from pathlib import Path
import tempfile

import duckdb

ROOT = Path(__file__).resolve().parents[3]
TRANSACTION_COLUMNS = "transaction_id original_id transaction_date filed_date status committee_id committee_name entity_id entity_name identity_status subtype basis direction amount_cents city state purpose_codes source_dataset source_row retrieved_at family book_type is_disclosure_category".split()
TABLE_COLUMNS = {
    "transactions": TRANSACTION_COLUMNS,
    "entities": "entity_id name identity_status first_observed last_observed records".split(),
    "aliases": "entity_id name first_observed last_observed records".split(),
    "committees": "committee_id name first_observed last_observed records".split(),
    "reviewed_matching_ids": ["transaction_id"],
    "candidate_finance_facts": ["committee_id", "facts_json"],
}


def digest(path):
    return hashlib.file_digest(path.open("rb"), "sha256").hexdigest()


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n")


def package(output):
    manifest = json.loads((ROOT / "research/campaign-finance/active-snapshot-manifest.json").read_text())
    source = ROOT / manifest["database"]
    assert digest(source) == manifest["database_sha256"], "Source database checksum mismatch"
    destination = output / "server-data/campaign-finance"
    destination.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="finance-publication-") as temp:
        candidate = Path(temp) / "finance.duckdb"
        db = duckdb.connect(str(candidate))
        db.execute("SET threads=2")
        db.execute("ATTACH '" + str(source).replace("'", "''") + "' AS source (READ_ONLY)")
        for table, columns in TABLE_COLUMNS.items():
            db.execute(f"CREATE TABLE {table} AS SELECT {','.join(columns)} FROM source.{table}")
        assert db.execute("SELECT count(*),count(DISTINCT transaction_id) FROM transactions").fetchone() == (manifest["rows"], manifest["rows"])
        expected = db.execute("SELECT basis,count(*),sum(amount_cents) FROM source.transactions GROUP BY basis ORDER BY basis").fetchall()
        assert db.execute("SELECT basis,count(*),sum(amount_cents) FROM transactions GROUP BY basis ORDER BY basis").fetchall() == expected
        for committee, serialized in db.execute("SELECT committee_id,facts_json FROM candidate_finance_facts").fetchall():
            facts = json.loads(serialized)
            amount, records = db.execute("SELECT sum(amount_cents),count(*) FROM transactions WHERE committee_id=? AND basis='cash_contribution'", [committee]).fetchone()
            assert (amount, records) == (facts["cashCents"], facts["cashRecords"])
        db.execute("CHECKPOINT")
        db.close()
        # Fresh database: excluded source columns cannot remain in free pages.
        target = destination / "finance.duckdb"
        import shutil
        shutil.copyfile(candidate, target)
    public_manifest = {key: manifest[key] for key in ("snapshot", "start", "end", "rows", "semantics_version", "completeness_verified")}
    public_manifest.update({"database": "server-data/campaign-finance/finance.duckdb", "database_sha256": digest(target),
                           "source_files": [{key: item[key] for key in ("sha256", "retrieval_end", "method", "new_rows") if key in item} for item in manifest["source_files"]]})
    write_json(destination / "manifest.json", public_manifest)
    write_json(output / "src/lib/campaign-finance/active-publication.json", {key: public_manifest[key] for key in ("snapshot", "start", "end", "rows", "completeness_verified")})
    editorial = json.loads((ROOT / "research/campaign-finance/snapshot-manifest.json").read_text())
    write_json(output / "src/lib/campaign-finance/editorial-manifest.json", {"snapshot": editorial["snapshot"], "source_files": [{"name": "Contributions" if "non-contributions" not in item["file"] else "Other transactions", "rows": item["rows"], "sha256": item["sha256"]} for item in editorial["source_files"]]})

    # Operational errors can contain machine paths and request headers. Publish
    # only a summary, while keeping the complete retry history locally.
    failures = json.loads((ROOT / "research/campaign-finance/failure-register.json").read_text())
    write_json(output / "public/data/campaign-finance/failure-register.json", {
        "version": "public-failure-summary-v1", "snapshot": failures["snapshot"],
        "recordedAcquisitionFailures": len(failures.get("events", [])),
        "gaps": json.loads((ROOT / "src/lib/campaign-finance/gaps.json").read_text()),
        "note": "Detailed request traces, local verification logs and retry history are retained in the private research archive. Missing evidence is not treated as zero activity.",
    })
    # Free-text descriptions can include personal location details. The public
    # supplier ledger needs purpose codes, not unrestricted raw descriptions.
    ledger = output / "public/data/campaign-finance/suppliers/cash-payments.csv"
    with ledger.open(newline="") as handle:
        reader = csv.DictReader(handle)
        fields = [key for key in reader.fieldnames if key not in ("source_raw_file", "purpose_description")]
        rows = [{key: row[key] for key in fields} for row in reader]
    with ledger.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    for path in (output / "src/lib/campaign-finance/supplier-data.json", output / "public/data/campaign-finance/suppliers/data.json"):
        data = json.loads(path.read_text())
        data["evidence"]["payments"]["sha256"] = digest(ledger)
        write_json(path, data)
    print(json.dumps({"snapshot": manifest["snapshot"], "rows": manifest["rows"], "databaseBytes": target.stat().st_size, "tables": TABLE_COLUMNS, "output": str(output)}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=ROOT)
    args = parser.parse_args()
    package(args.output.resolve())
