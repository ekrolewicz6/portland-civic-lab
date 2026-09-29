"""Validate two current ORESTAR exports and atomically promote a chart snapshot.

This refreshes descriptive transaction-date curves. Reviewed narrative, donor
identity links, geocoding, and certified public-finance records stay frozen.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

from common import SEMANTICS, aggregate_label, cents, identity, iso

ROOT = Path(__file__).resolve().parents[3]
BASE = ROOT / "runtime-data/orestar-daily"
FROZEN = ROOT / "src/lib/campaign-finance/campaign-dynamics.json"
MATCHING = ROOT / "public/data/campaign-finance/public-matching-receipts.csv"
START = date(2025, 1, 1)
METRICS = ("cash_cents", "public_cents", "nonmatching_cents", "individual_itemized_cents", "unidentified_cents")


def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def verified_source(end: str, label: str):
    folder = BASE / "runs" / end / label
    source = folder / f"orestar-{label}-2025-01-01_{end}.csv"
    metadata = json.loads((folder / "metadata.json").read_text())
    manifest = json.loads((folder / "manifest.json").read_text())
    if metadata["startDate"] != "2025-01-01" or metadata["endDate"] != end:
        raise ValueError(f"Wrong source dates: {label}")
    if metadata.get("includeDeleted") is not False or metadata.get("includeExpired") is not False:
        raise ValueError(f"Unexpected transaction-version settings: {label}")
    if metadata["mergedRows"] != metadata["finalTotal"] or metadata["mergedRows"] != manifest["finalTotal"]:
        raise ValueError(f"ORESTAR count mismatch: {label}")
    if digest(source) != metadata["sha256"]:
        raise ValueError(f"Source checksum mismatch: {label}")
    if any(entry["status"] == "failed" for entry in manifest["entries"].values()):
        raise ValueError(f"Unresolved source partition: {label}")
    return source, metadata


def matching_rules():
    ids = set()
    pairs = set()
    with MATCHING.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            ids.add(row["transaction_id"])
            pairs.add((row["committee_id"], row["entity_id"]))
    return ids, pairs


def is_public_receipt(row: dict, known_ids: set[str], known_pairs: set[tuple[str, str]]) -> bool:
    if row["Tran Id"] in known_ids:
        return True
    entity_id, _ = identity(row)
    if (row["Filer Id"], entity_id) in known_pairs:
        return True
    name = row["Contributor/Payee"].upper()
    if "SMALL DONOR ELECTION" in name or "CITY OF PORTLAND" in name or "OPEN AND ACCOUNTABLE ELECTION" in name:
        raise ValueError(f"New possible City matching payor for reviewed committee {row['Filer Id']} transaction {row['Tran Id']}; review before publication")
    return False


def build(end: str):
    ending = date.fromisoformat(end)
    if ending < START:
        raise ValueError("End date precedes snapshot start")
    frozen = json.loads(FROZEN.read_text())
    candidates = {row["committeeId"]: row for row in frozen["candidates"]}
    known_ids, known_pairs = matching_rules()
    source_info = []
    seen_ids, seen_originals = set(), set()
    daily = defaultdict(lambda: {key: 0 for key in METRICS})
    candidate_totals = defaultdict(lambda: {key: 0 for key in METRICS})
    total_rows = 0
    for label in ("contributions", "non-contributions"):
        source, meta = verified_source(end, label)
        source_info.append({"dataset": label, "sha256": meta["sha256"], "rows": meta["mergedRows"], "retrievedAt": meta["generatedAt"]})
        count = 0
        with source.open(newline="", encoding="utf-8-sig") as handle:
            reader = csv.reader(handle)
            headers = next(reader)
            if len(headers) != 46 or len(set(headers)) != 46:
                raise ValueError(f"Unexpected export schema: {label}")
            for values in reader:
                if len(values) != len(headers):
                    raise ValueError(f"Wrong CSV row width: {label}:{count + 2}")
                row = dict(zip(headers, values))
                txid, original = row["Tran Id"].strip(), row["Original Id"].strip()
                if not txid or txid in seen_ids:
                    raise ValueError(f"Duplicate or blank transaction ID: {txid}")
                if original and original in seen_originals:
                    raise ValueError(f"Two current versions of original ID: {original}")
                seen_ids.add(txid)
                if original:
                    seen_originals.add(original)
                day = iso(row["Tran Date"])
                if not day or not "2025-01-01" <= day <= end:
                    raise ValueError(f"Out-of-range transaction date: {txid}")
                if row["Sub Type"] not in SEMANTICS:
                    raise ValueError(f"Unreviewed accounting subtype: {row['Sub Type']}")
                if label == "contributions" and row["Transaction Type"] != "Contribution":
                    raise ValueError(f"Wrong export family: {txid}")
                if label == "non-contributions" and row["Transaction Type"] == "Contribution":
                    raise ValueError(f"Wrong export family: {txid}")
                count += 1
                cid = row["Filer Id"].strip()
                if cid not in candidates or row["Sub Type"] != "Cash Contribution":
                    continue
                amount = cents(row["Amount"])
                public = is_public_receipt(row, known_ids, known_pairs)
                targets = (daily[(cid, day)], candidate_totals[cid])
                for target in targets:
                    target["cash_cents"] += amount
                    target["public_cents" if public else "nonmatching_cents"] += amount
                    if not public:
                        if row["Book Type"] == "Individual" and not aggregate_label(row["Contributor/Payee"]):
                            target["individual_itemized_cents"] += amount
                        if aggregate_label(row["Contributor/Payee"]) or not row["Contributor/Payee"].strip():
                            target["unidentified_cents"] += amount
        if count != meta["mergedRows"]:
            raise ValueError(f"CSV row count mismatch: {label}")
        total_rows += count
    # Every Sunday or final partial week is represented, including zero-activity weeks.
    first_monday = START - timedelta(days=START.weekday())
    weeks = []
    cursor = first_monday
    while cursor <= ending:
        last = min(cursor + timedelta(days=6), ending)
        weeks.append((cursor, last))
        cursor += timedelta(days=7)
    weekly = []
    for cid in candidates:
        tally = {key: 0 for key in METRICS}
        for first, last in weeks:
            values = {key: 0 for key in METRICS}
            cursor = max(first, START)
            while cursor <= last:
                for key, value in daily[(cid, cursor.isoformat())].items():
                    values[key] += value
                cursor += timedelta(days=1)
            for key, value in values.items():
                tally[key] += value
            weekly.append({"committeeId": cid, "weekStart": first.isoformat(), "weekEnd": last.isoformat(), "weekly": values, "cumulative": dict(tally)})
        if tally != candidate_totals[cid]:
            raise ValueError(f"Weekly totals do not reconcile: {cid}")
        if tally["cash_cents"] != tally["public_cents"] + tally["nonmatching_cents"]:
            raise ValueError(f"Cash categories do not reconcile: {cid}")
    events = []
    for event in frozen["events"]:
        anchor = date.fromisoformat(event["date"])
        comparisons = []
        for cid in candidates:
            before = sum(daily[(cid, (anchor - timedelta(days=n)).isoformat())]["nonmatching_cents"] for n in range(1, 8))
            after = None if anchor + timedelta(days=7) > ending else sum(daily[(cid, (anchor + timedelta(days=n)).isoformat())]["nonmatching_cents"] for n in range(1, 8))
            comparisons.append({"committeeId": cid, "beforeCents": before, "afterCents": after})
        events.append({**event, "comparisons": comparisons})
    hash_input = json.dumps({"end": end, "source_hashes": [item["sha256"] for item in source_info], "matching": digest(MATCHING), "frozen": digest(FROZEN), "code": digest(Path(__file__))}, sort_keys=True).encode()
    snapshot = f"orestar-20250101-{end.replace('-', '')}-{hashlib.sha256(hash_input).hexdigest()[:12]}"
    return {"version": "orestar-daily-timeline-v1", "snapshot": snapshot, "start": "2025-01-01", "end": end,
            "generatedAt": datetime.now(timezone.utc).isoformat(), "sourceRows": total_rows, "sourceFiles": source_info,
            "definitions": {"weekly": "Gross cash on reported transaction dates in Monday-Sunday weeks; final week may be partial. City matching uses previously reviewed ORESTAR payor record groups, not a new official City disbursement reconciliation.", "scope": "Only 17 previously reviewed candidate committees and previously reviewed event anchors. Geographic, donor identity, endorsement and editorial findings are not refreshed."},
            "weekly": weekly, "events": events, "candidateTotals": candidate_totals}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--end", required=True)
    args = parser.parse_args()
    data = build(args.end)
    out = BASE / "snapshots"
    out.mkdir(parents=True, exist_ok=True)
    artifact = out / f"{data['snapshot']}.json"
    payload = (json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n").encode()
    if artifact.exists():
        previous = json.loads(artifact.read_text())
        comparable = lambda value: {key: item for key, item in value.items() if key not in ("generatedAt", "sourceFiles")}
        if comparable(previous) != comparable(data):
            raise ValueError("Existing content-addressed chart differs from recalculation")
        data = previous
    else:
        temporary = artifact.with_suffix(".json.tmp")
        temporary.write_bytes(payload)
        temporary.replace(artifact)
    pointer = {"snapshot": data["snapshot"], "end": data["end"], "sourceRows": data["sourceRows"], "sha256": digest(artifact), "publishedAt": data["generatedAt"], "lastCheckedAt": datetime.now(timezone.utc).isoformat()}
    current = BASE / "current.json"
    current_tmp = BASE / "current.json.tmp"
    current_tmp.write_text(json.dumps(pointer, indent=2) + "\n")
    current_tmp.replace(current)
    print(f"Promoted {data['snapshot']}: {data['sourceRows']:,} validated transactions; {len(data['weekly'])} weekly chart points")


if __name__ == "__main__":
    main()
