"""Guardrails for the automatically refreshed, reviewed-committee timeline."""
import unittest

from daily_dashboard import is_public_receipt, matching_rules


def row(txid, name, committee="23208"):
    return {"Tran Id": txid, "Filer Id": committee, "Contributor/Payee": name,
            "Book Type": "Individual", "Addr Line1": "", "Addr Line2": "",
            "City": "", "State": "", "Zip": "", "Country": "",
            "Contributor/Payee Committee ID": ""}


class DailyDashboardTest(unittest.TestCase):
    def test_reviewed_receipts_remain_public(self):
        ids, pairs = matching_rules()
        self.assertIn("5521037", ids)
        self.assertTrue(is_public_receipt(row("5521037", "City of Portland"), ids, pairs))

    def test_new_possible_public_payor_halts_publication(self):
        with self.assertRaisesRegex(ValueError, "review before publication"):
            is_public_receipt(row("new", "City of Portland Small Donor Elections"), set(), set())

    def test_ordinary_gift_is_not_public_match(self):
        self.assertFalse(is_public_receipt(row("new", "Example Donor"), set(), set()))


if __name__ == "__main__":
    unittest.main()
