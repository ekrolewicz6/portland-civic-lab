"""Regression checks for the published, privacy-safe campaign dynamics edition."""

import csv
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
PUBLIC = ROOT / "public/data/campaign-finance/story"
DATA = json.loads((ROOT / "src/lib/campaign-finance/campaign-dynamics.json").read_text())


class CampaignDynamicsTest(unittest.TestCase):
    def test_snapshot_and_reconciliation(self):
        self.assertEqual(DATA["snapshot"], "orestar-20250101-20260927-v1")
        self.assertEqual(len(DATA["candidates"]), 17)
        self.assertEqual(len(DATA["weekly"]), 1547)
        for candidate in DATA["candidates"]:
            rows = [row for row in DATA["weekly"] if row["committeeId"] == candidate["committeeId"]]
            self.assertEqual(rows[-1]["cumulative"]["cash_cents"], candidate["cashCents"])
            self.assertEqual(candidate["publicCents"] + candidate["nonmatchingCents"], candidate["cashCents"])
            self.assertEqual(sum(candidate["geography"][key] for key in ("insideCents", "outsideCents", "uncertainCents")), candidate["nonmatchingCents"])
            self.assertLessEqual(candidate["visibleItemizedCents"], candidate["nonmatchingCents"])

    def test_event_coverage_and_provisional_window(self):
        self.assertEqual(len(DATA["events"]), 29)
        self.assertEqual(len({(event["date"], event["label"]) for event in DATA["events"]}), 29)
        self.assertEqual(len(DATA["paceSegments"]), 3)
        self.assertEqual([item["start"] for item in DATA["paceSegments"]], ["2026-01-05", "2026-03-23", "2026-07-13"])
        zenith = next(event for event in DATA["events"] if event["date"] == "2026-09-23")
        self.assertTrue(all(item["afterCents"] is None for item in zenith["comparisons"]))

    def test_donor_groups_are_not_aggregate_labels(self):
        self.assertEqual(len(DATA["crossList"]), 4)
        for candidate in DATA["candidates"]:
            for donor in candidate["topDonors"]:
                self.assertIn(donor["identityStatus"], ("authoritative_committee_id", "provisional_record_group"))
                self.assertNotIn(donor["name"].lower(), ("anonymous", "miscellaneous", "unitemized"))
        for group in DATA["crossList"]:
            self.assertGreaterEqual(len(group["support"]), 2)

    def test_downloads_agree(self):
        with (PUBLIC / "candidate-cumulative-weekly.csv").open(newline="") as handle:
            rows = list(csv.DictReader(handle))
        self.assertEqual(len(rows), len(DATA["weekly"]))
        self.assertEqual(sum(int(row["cash_cents"]) for row in rows), sum(item["cashCents"] for item in DATA["candidates"]))
        with (PUBLIC / "active-campaign-events.csv").open(newline="") as handle:
            self.assertEqual(len(list(csv.DictReader(handle))), len(DATA["events"]))


if __name__ == "__main__":
    unittest.main()
