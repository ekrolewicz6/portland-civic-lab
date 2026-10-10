"""Read-only checks for the one currently served campaign-finance database."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import duckdb

ROOT = Path(__file__).resolve().parents[3]
MANIFEST = ROOT / "research/campaign-finance/active-snapshot-manifest.json"


REVIEWED = ROOT / "research/campaign-finance/reviewed-amendments.json"


def reviewed_ids() -> set[str]:
    """Records an approved amendment was allowed to change or replace."""
    if not REVIEWED.exists():
        return set()
    approved = [item for item in json.loads(REVIEWED.read_text())["amendments"] if item["decision"] == "approved"]
    return {item.get("transactionId") or item["existingTransactionId"] for item in approved}


def verify(manifest_path: Path = MANIFEST) -> dict:
    manifest = json.loads(manifest_path.read_text())
    database = ROOT / manifest["database"]
    with database.open("rb") as source:
        if hashlib.file_digest(source, "sha256").hexdigest() != manifest["database_sha256"]:
            raise ValueError("Active database checksum mismatch")
    con = duckdb.connect(str(database), read_only=True)
    try:
        count, distinct_ids, filers, latest = con.execute(
            "SELECT count(*),count(DISTINCT transaction_id),count(DISTINCT committee_id),max(transaction_date) FROM transactions"
        ).fetchone()
        if (count, distinct_ids, filers) != (manifest["rows"], manifest["rows"], manifest["filers"]):
            raise ValueError("Active database totals differ from manifest")
        if latest > manifest["end"]:
            raise ValueError("Transaction date exceeds active snapshot end")
        if con.execute("SELECT count(*)-count(DISTINCT original_id) FROM transactions WHERE original_id IS NOT NULL").fetchone()[0]:
            raise ValueError("More than one current version of an Original Id")
        if con.execute("SELECT count(*) FROM transactions WHERE is_disclosure_category AND entity_id NOT LIKE 'disclosure:%'").fetchone()[0]:
            raise ValueError("Aggregate label linked as a donor identity")
        if con.execute("SELECT snapshot FROM metadata").fetchone()[0] != manifest["snapshot"]:
            raise ValueError("Database metadata snapshot mismatch")
        facts = con.execute("SELECT committee_id,CAST(facts_json AS VARCHAR) FROM candidate_finance_facts").fetchall()
        if len(facts) < 17:
            raise ValueError("Candidate facts table is missing reviewed committees")
        for committee_id, payload in facts:
            published = json.loads(payload)
            actual = con.execute("SELECT count(*),coalesce(sum(amount_cents),0) FROM transactions WHERE committee_id=? AND basis='cash_contribution'", [committee_id]).fetchone()
            if actual != (published['cashRecords'], published['cashCents']):
                raise ValueError(f"Candidate cash facts do not reconcile: {committee_id}")
            public = con.execute("SELECT coalesce(sum(t.amount_cents),0) FROM transactions t JOIN reviewed_matching_ids m USING(transaction_id) WHERE t.committee_id=?", [committee_id]).fetchone()[0]
            if public != published['publicCents']:
                raise ValueError(f"Candidate public matching facts do not reconcile: {committee_id}")
        if manifest.get("base_snapshot"):
            base = json.loads((ROOT / "research/campaign-finance/snapshot-manifest.json").read_text())
            base_path = ROOT / base["database"]
            con.execute(f"ATTACH '{str(base_path).replace(chr(39), chr(39)*2)}' AS prior (READ_ONLY)")
            # Frozen base rows may differ only where a reviewed, approved amendment replaced or changed them.
            changed = {row[0] for row in con.execute("SELECT transaction_id FROM (SELECT * FROM prior.transactions EXCEPT ALL SELECT * FROM transactions)").fetchall()}
            unreviewed = changed - reviewed_ids()
            if unreviewed:
                raise ValueError(f"{len(unreviewed)} frozen base rows changed or disappeared without a reviewed amendment")
        return {"snapshot": manifest["snapshot"], "rows": count, "filers": filers, "candidate_facts": len(facts), "latest_transaction": latest,
                "source_count_verified": manifest.get("source_count_verified", False),
                "completeness_verified": manifest.get("completeness_verified", False)}
    finally:
        con.close()


if __name__ == "__main__":
    print(json.dumps(verify(), indent=2))
