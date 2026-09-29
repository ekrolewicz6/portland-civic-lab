"""Publish reproducible, privacy-safe Portland campaign timeline and donor summaries.

Run from the repository root. Source CSVs are the frozen September 27 research
snapshot; no network request or new identity matching is performed here.
"""

import csv
import hashlib
import json
import math
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
RESEARCH = ROOT / "research/campaign-finance/investigation"
PORTLAND = RESEARCH / "portland"
LIB = ROOT / "src/lib/campaign-finance"
PUBLIC = ROOT / "public/data/campaign-finance/story"


def read_csv(path):
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_csv(path, rows, fields):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def main():
    weeks_path = PORTLAND / "candidate-weeks.csv"
    daily_path = PORTLAND / "candidate-daily-nonmatching.csv"
    ledger_path = PORTLAND / "donor-candidate-complete-ledger.csv"
    weeks = read_csv(weeks_path)
    daily = read_csv(daily_path)
    ledger = read_csv(ledger_path)
    context = read_json(RESEARCH / "portland-context.json")
    added = read_json(RESEARCH / "active-campaign-events.json")
    facts = read_json(LIB / "candidate-facts.json")
    geo = read_json(LIB / "district-address-data.json")
    matrix = read_json(LIB / "major-donor-matrix.json")
    assert facts["snapshot"] == geo["snapshot"] == matrix["snapshot"]

    candidates = matrix["candidates"]
    ids = {item["committeeId"] for item in candidates}
    assert len(ids) == 17
    metrics = ["cash_cents", "public_cents", "nonmatching_cents", "individual_itemized_cents", "unidentified_cents"]
    by_candidate = defaultdict(list)
    for row in weeks:
        if row["committee_id"] in ids:
            by_candidate[row["committee_id"]].append(row)
    weekly = []
    for candidate in candidates:
        cid = candidate["committeeId"]
        tally = {key: 0 for key in metrics}
        for row in sorted(by_candidate[cid], key=lambda item: item["week_start"]):
            for key in metrics:
                tally[key] += int(row[key])
            weekly.append({"committeeId": cid, "weekStart": row["week_start"],
                           "weekEnd": min(date.fromisoformat(row["week_start"]) + timedelta(days=6), date(2026, 9, 27)).isoformat(),
                           "weekly": {key: int(row[key]) for key in metrics}, "cumulative": dict(tally)})
        reported = facts["committees"][cid]
        assert tally["cash_cents"] == reported["cashCents"], (cid, "cash")
        assert tally["public_cents"] == reported["publicCents"], (cid, "public")
        assert tally["nonmatching_cents"] == reported["nonmatchingCents"], (cid, "nonmatching")
        assert tally["public_cents"] + tally["nonmatching_cents"] == tally["cash_cents"]

    by_week = defaultdict(int)
    for row in weekly:
        if "2026-01-01" <= row["weekStart"] <= "2026-09-27":
            by_week[row["weekStart"]] += row["weekly"]["nonmatching_cents"]
    pace = sorted(by_week.items())
    transformed = [math.log1p(cents / 100) for _, cents in pace]

    def segment_error(start, end):
        values = transformed[start:end]
        average = sum(values) / len(values)
        return sum((value - average) ** 2 for value in values)

    minimum = 6
    _, first_break, second_break = min(
        (segment_error(0, i) + segment_error(i, j) + segment_error(j, len(pace)), i, j)
        for i in range(minimum, len(pace) - 2 * minimum + 1)
        for j in range(i + minimum, len(pace) - minimum + 1)
    )
    pace_segments = []
    for start, end in ((0, first_break), (first_break, second_break), (second_break, len(pace))):
        pace_segments.append({"start": pace[start][0], "end": pace[end - 1][0],
                              "weeks": end - start,
                              "meanWeeklyNonmatchingCents": round(sum(cents for _, cents in pace[start:end]) / (end - start))})

    # Event date is excluded. An incomplete post-window is null, not extrapolated.
    daily_by_candidate = defaultdict(dict)
    for row in daily:
        if row["committee_id"] in ids:
            daily_by_candidate[row["committee_id"]][row["date"]] = row
    events = []
    seen = set()
    for item in context["events"] + added["events"]:
        key = (item["date"], item["label"])
        if key in seen:
            continue
        seen.add(key)
        category = item.get("category") or ("moda" if "Moda" in item["label"] else "campaign" if any(word in item["label"].lower() for word in ("billboard", "tweets", "endorsement", "ballot")) else "city")
        anchor = date.fromisoformat(item["date"])
        comparisons = []
        for candidate in candidates:
            cid = candidate["committeeId"]
            before_dates = [(anchor - timedelta(days=day)).isoformat() for day in range(1, 8)]
            after_dates = [(anchor + timedelta(days=day)).isoformat() for day in range(1, 8)]
            before = sum(int(daily_by_candidate[cid].get(day, {}).get("nonmatching_cents", 0)) for day in before_dates)
            complete = anchor + timedelta(days=7) <= date(2026, 9, 27)
            after = sum(int(daily_by_candidate[cid].get(day, {}).get("nonmatching_cents", 0)) for day in after_dates) if complete else None
            comparisons.append({"committeeId": cid, "beforeCents": before, "afterCents": after})
        events.append({"date": item["date"], "label": item["label"], "category": category,
                       "dateKind": item["date_kind"], "sourceUrl": item["url"],
                       "limitation": item.get("limitation"), "comparisons": comparisons})
    events.sort(key=lambda item: (item["date"], item["label"]))

    portfolio = defaultdict(list)
    donor_by_candidate = defaultdict(list)
    for row in ledger:
        if row["committee_id"] not in ids:
            continue
        support = {"entityId": row["entity_id"], "name": row["reported_name"],
                   "identityStatus": row["identity_status"], "bookType": row["book_type"],
                   "committeeId": row["committee_id"], "grossCents": int(row["gross_cents"]),
                   "refundCents": int(row["observed_refund_cents"]),
                   "records": int(row["contribution_records"]),
                   "dates": int(row["distinct_reported_dates"]),
                   "firstDate": row["first_date"], "lastDate": row["last_date"]}
        portfolio[row["entity_id"]].append(support)
        donor_by_candidate[row["committee_id"]].append(support)

    lists = {item["organization"]: set(item["candidates"]) for item in context["endorsements"]}
    reviewed_by_name = {item["name"]: item["committeeId"] for item in candidates}
    a = {reviewed_by_name[name] for name in lists["Portland for All"] if name in reviewed_by_name}
    b = {reviewed_by_name[name] for name in lists["United for Portland"] if name in reviewed_by_name}
    assert a.isdisjoint(b)
    mixed_ids = {entity for entity, supports in portfolio.items()
                 if {support["committeeId"] for support in supports} & a
                 and {support["committeeId"] for support in supports} & b}
    cross_list = []
    for entity in mixed_ids:
        supports = portfolio[entity]
        cross_list.append({"entityId": entity, "name": supports[0]["name"],
                           "bookType": supports[0]["bookType"], "identityStatus": supports[0]["identityStatus"],
                           "grossCents": sum(s["grossCents"] for s in supports),
                           "support": [{"committeeId": s["committeeId"], "grossCents": s["grossCents"],
                                        "refundCents": s["refundCents"]} for s in sorted(supports, key=lambda s: -s["grossCents"])]})
    cross_list.sort(key=lambda row: (-row["grossCents"], row["name"]))

    geo_by_id = {item["committeeId"]: item for item in geo["candidates"]}
    dossiers = []
    for candidate in candidates:
        cid = candidate["committeeId"]
        supports = sorted(donor_by_candidate[cid], key=lambda item: (-item["grossCents"], item["name"]))
        visible = sum(s["grossCents"] for s in supports)
        categories = geo_by_id[cid]["categories"]
        inside = ["address_inside", "zip_inside"]
        outside = ["address_outside", "state_outside", "zip_outside"]
        sum_cat = lambda keys, field: sum(categories[key][field] for key in keys)
        dossiers.append({**candidate,
                         "cashCents": facts["committees"][cid]["cashCents"],
                         "publicCents": facts["committees"][cid]["publicCents"],
                         "nonmatchingCents": facts["committees"][cid]["nonmatchingCents"],
                         "visibleItemizedCents": visible, "visibleGroups": len(supports),
                         "topFiveVisibleShare": round(sum(s["grossCents"] for s in supports[:5]) / visible, 5) if visible else None,
                         "topTenVisibleShare": round(sum(s["grossCents"] for s in supports[:10]) / visible, 5) if visible else None,
                         "effectiveVisibleGroups": round(visible ** 2 / sum(s["grossCents"] ** 2 for s in supports), 2) if visible else None,
                         "mixedListGroupCents": sum(s["grossCents"] for s in supports if s["entityId"] in mixed_ids),
                         "mixedListGroups": sum(s["entityId"] in mixed_ids for s in supports),
                         "geography": {"insideCents": sum_cat(inside, "cents"), "insideRecords": sum_cat(inside, "records"),
                                       "outsideCents": sum_cat(outside, "cents"), "outsideRecords": sum_cat(outside, "records"),
                                       "uncertainCents": categories["uncertain"]["cents"], "uncertainRecords": categories["uncertain"]["records"]},
                         "topDonors": [{**s, "otherSupport": [{"committeeId": other["committeeId"],
                                                                 "grossCents": other["grossCents"], "refundCents": other["refundCents"]}
                                                                for other in portfolio[s["entityId"]] if other["committeeId"] != cid]}
                                       for s in supports[:15]]})
        assert visible <= facts["committees"][cid]["nonmatchingCents"]
        assert sum_cat(inside + outside + ["uncertain"], "cents") == facts["committees"][cid]["nonmatchingCents"]

    output = {"version": "campaign-dynamics-v1", "snapshot": facts["snapshot"], "start": "2025-01-01", "end": "2026-09-27",
              "definitions": {"weekly": "Gross cash by reported transaction date, grouped Monday–Sunday. Cumulative lines include all observed receipts since January 1, 2025, even when a shorter display window is chosen. City matching is separate from nonmatching cash; neither is a unique-donor count.",
                              "eventWindows": "Seven calendar days before and after each dated anchor, excluding the anchor date. Incomplete post-windows are null. Dates may be publication dates, not action dates. Comparisons are descriptive, not causal.",
                              "donors": "Visible itemized source record groups only. Gross direct contributions before observed refunds; public deposits, loans, in-kind support and aggregate/unidentified source labels excluded. Noncommittee identities are provisional; all linked candidate histories in this window are included.",
                              "geography": geo["method"] + " " + geo["limitation"],
                              "mixedLists": "Source groups contributing to at least one reviewed Portland for All candidate and one reviewed United for Portland candidate. These are endorsement-list portfolios, not ideological classifications, endorsements by the donor or proof of motive.",
                              "paceSegments": "Descriptive three-segment fit to log(1 + total nonmatching dollars per week) for the 17 reviewed committees, 2026 weeks only. Two boundaries minimize within-segment squared error, with at least six weeks per segment. The fit is not a significance test or a claim about campaign launch dates."},
              "sourceSha256": {path.name: sha(path) for path in (weeks_path, daily_path, ledger_path, RESEARCH / "portland-context.json", RESEARCH / "active-campaign-events.json")},
              "paceSegments": pace_segments, "candidates": dossiers, "weekly": weekly, "events": events, "crossList": cross_list}
    PUBLIC.mkdir(parents=True, exist_ok=True)
    (LIB / "campaign-dynamics.json").write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    (PUBLIC / "campaign-dynamics.json").write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    write_csv(PUBLIC / "candidate-cumulative-weekly.csv", [
        {"committee_id": row["committeeId"], "candidate": next(c["name"] for c in candidates if c["committeeId"] == row["committeeId"]),
         "week_start": row["weekStart"], "week_end": row["weekEnd"],
         **{key: row["weekly"][key] for key in metrics}, **{"cumulative_" + key: row["cumulative"][key] for key in metrics}}
        for row in weekly], ["committee_id", "candidate", "week_start", "week_end"] + metrics + ["cumulative_" + key for key in metrics])
    write_csv(PUBLIC / "active-campaign-events.csv", [
        {"date": item["date"], "event": item["label"], "category": item["category"],
         "date_kind": item["dateKind"], "source_url": item["sourceUrl"], "limitation": item["limitation"] or ""} for item in events],
        ["date", "event", "category", "date_kind", "source_url", "limitation"])
    print(f"Published {len(weekly)} weekly records, {len(events)} event anchors, {len(dossiers)} candidate dossiers, {len(cross_list)} cross-list source groups")


if __name__ == "__main__":
    main()
