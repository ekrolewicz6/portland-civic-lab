import unittest

from publish_governor import BANDS, band_for, kind_for, purpose_label, safe, week_start


class GovernorHelpers(unittest.TestCase):
    def test_bands_cover_every_amount_once(self):
        self.assertEqual(band_for(0), 'under_1k')
        self.assertEqual(band_for(99_999), 'under_1k')
        self.assertEqual(band_for(100_000), '1k_10k')
        self.assertEqual(band_for(9_999_999), '10k_100k')
        self.assertEqual(band_for(10_000_000), '100k_1m')
        self.assertEqual(band_for(100_000_000), '1m_plus')
        for (_key, _label, low, high), following in zip(BANDS, BANDS[1:]):
            self.assertEqual(high, following[2])
            self.assertLess(low, high)

    def test_weeks_start_on_monday(self):
        self.assertEqual(week_start('2025-01-01'), '2024-12-30')
        self.assertEqual(week_start('2026-07-27'), '2026-07-27')
        self.assertEqual(week_start('2026-08-02'), '2026-07-27')

    def test_purposes_keep_reported_codes_apart(self):
        self.assertEqual(purpose_label(''), 'No purpose code reported')
        self.assertEqual(purpose_label('Surveys and Polls'), 'Surveys and polls')
        self.assertEqual(purpose_label('Online and Social Media Advertising; Preparation and Production of Advertising'),
                         'Advertising, more than one code')
        self.assertEqual(purpose_label('Surveys and Polls; Travel Expenses (need description)'), 'More than one purpose code')
        self.assertEqual(purpose_label('Something New'), 'Other reported purposes')

    def test_reviewed_sponsor_never_overrides_people_or_combined_entries(self):
        reviewed = {'committee:33': {'kind': 'labor'}}
        row = {'hidden': False, 'book_type': 'Political Committee', 'entity_id': 'committee:33'}
        self.assertEqual(kind_for(row, reviewed), 'labor')
        self.assertEqual(kind_for({**row, 'entity_id': 'committee:99'}, reviewed), 'other')
        self.assertEqual(kind_for({**row, 'book_type': 'Individual'}, reviewed), 'individual')
        self.assertEqual(kind_for({**row, 'hidden': True}, reviewed), 'small')
        self.assertEqual(kind_for({'hidden': False, 'book_type': 'Business Entity', 'entity_id': 'record:x'}, reviewed), 'business')
        self.assertEqual(kind_for({'hidden': False, 'book_type': 'Labor Organization', 'entity_id': 'record:y'}, reviewed), 'labor')

    def test_spreadsheet_formulas_are_neutralized(self):
        self.assertEqual(safe('=SUM(A1)'), "'=SUM(A1)")
        self.assertEqual(safe('Plain name'), 'Plain name')
        self.assertEqual(safe(12), 12)


if __name__ == '__main__':
    unittest.main()
