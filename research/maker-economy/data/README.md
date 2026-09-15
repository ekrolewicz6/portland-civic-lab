# Evidence dictionary

All CSVs use a header row; blank numeric cells mean unknown or suppressed, never zero. Every evidence row includes `doc_id` (source registry identifier) and `locator` (PDF page, webpage section, or exact source-row filter). Semicolon-delimited source identifiers indicate multiple supporting records.

## qcew.csv

Annual-average private-sector establishments and covered payroll jobs for Multnomah County, FIPS 41051. `annual_payroll_usd` is a total; `average_annual_pay_usd` is the BLS-published average, not recalculated from rounded employment. `employment_location_quotient` is the BLS-published relative concentration measure. `disclosure_code` is preserved. When employment is suppressed, jobs/pay/LQ are blank even if the raw file encodes them as zero; published establishment counts remain available. `naics_vintage` identifies 2017 or 2022 classification. `tier` is our analytical label, not a BLS designation.

## nonemployers.csv

2023 county businesses with no paid employees in the Census NES universe. County assignment usually reflects the administrative business mailing address, not a verified production location. `establishments` is a business measure, not people. `receipts_usd` converts raw thousands to dollars. Disclosure flags are retained separately. `noise_flag=G` indicates less than 2% disclosure noise; it is not total-error uncertainty. Codes reflect available publication detail and cannot be equated with narrower QCEW codes. `00` is the all-industry benchmark and must not be added to its components.

## observations.csv

Curated values from studies and operator webpages. `unit`, `period`, `geography`, `coverage`, and `notes` must travel with a value. Dollars in WESTAF's report were published rounded; storing them as integers does not imply added precision. Operator counters have unspecified reporting periods. AEP6 modeled jobs are not payroll counts.

## ecosystem.csv

A purposive discovery inventory, not a city census. `operating_status_evidence` describes visible evidence and must not be upgraded to independent field verification. `access_costs` retains offer conditions; blank/unknown costs do not mean free. Public business addresses are source-reported, not GIS-certified. The home-based example has no street address and an explicit boundary limitation. `participation` distinguishes operator-reported counts, capacity, event attendances, and unknowns.

## Derived files

- `employment-comparison.csv`: 2019–2025 job changes; 2025 shares, relative pay, and published concentration. Jobs changes are descriptive, not causal; pay is nominal.
- `nonemployer-context.csv`: means and shares within the same 2023 county universe. Mean receipts are not personal income or median earnings.
- `definition-sensitivity.csv`: overlapping alternative industry baskets. Neither bound nor estimate of maker employment. Do not sum rows.
- `study-checks.csv`: arithmetic verification of study response coverage.
- `tables.md`: readable tables generated from the same inputs.

Every derived row retains source IDs and a locator. Calculation formulas and classification rules are documented in the methodology and executable build script.
