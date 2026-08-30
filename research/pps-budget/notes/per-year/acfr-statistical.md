# ACFR Statistical Sections — table map and extraction worksheet

Source files (form-feed page-delimited text of official PDFs; pages below are 1-indexed PDF pages):

- `runtime-data/pps-budget/text/acfr-fy2025.txt` — FY2025 ACFR, statistical section covers FY2016–FY2025 (GO-debt table extends to FY2013)
- `runtime-data/pps-budget/text/acfr-fy2020.txt` — FY2020 CAFR, statistical section covers FY2011–FY2020
- `runtime-data/pps-budget/text/acfr-fy2016.txt` — FY2016 CAFR, statistical section covers FY2007–FY2016 (mapped, not extracted — FY2011+ already anchored by the two later reports)

Fragments written to `research/pps-budget/data/fragments/acfr-statistical/` with basis `actual-acfr`.
Overlapping years were extracted from BOTH reports on purpose (doc_id disambiguates) so restatements are visible.

## acfr-fy2025 — statistical section map (PDF pages)

| Schedule | Title | PDF page(s) | Extracted to |
|---|---|---|---|
| contents | Statistical Section contents | 121 | — |
| 1 | Condensed Statement of Net Position (10 yrs) | 122–123 | — |
| 2 | Changes in Net Position (10 yrs) | 124–125 | — |
| 3 | Fund Balances of Governmental Funds (10 yrs) | 126 (2022–25), 127 (2016–21) | reserves.csv |
| 4 | Changes in Fund Balances of Governmental Funds (10 yrs) | 128 (2022–25), 129 (2016–21) | gf_revenue.csv (revenues); debt.csv (debt-service components) |
| 5 | Assessed Values of Taxable Property | 130 (gross AV), 131 (net AV, direct rate, net levy) | tax_rates.csv (AV) |
| 6 | Direct and Overlapping Property Tax Rates | 132 | tax_rates.csv (rates) |
| 7–8 | Principal Property Tax Payers | 133–134 | — |
| 9 | Property Tax Levies and Collections | 135 | levy.csv |
| 10 | Ratios of Outstanding Debt by Type | 136 (GO table extends to FY2013), 137 (net AV col + totals) | debt.csv |
| 11 | Direct and Overlapping Governmental Activities Debt (June 30, 2025) | 138 | — |
| 12 | Legal Debt Margin (10 yrs; RMV for current calc) | 139 | tax_rates.csv (rmv, FY2025 only) |
| 13–14 | Demographic & Economic / Principal Employers | 140–141 | — |
| 15 | FTE Employees by Assignment/Function | 142 (2022–25), 143 (2016–21) | fte_by_function.csv |
| 16 | Meal and Transportation Services | 144 | — |
| 17 | School Building and Student Enrollment (incl. ADMw) | 145–146 (totals + ADMw on 146) | enrollment.csv |

## acfr-fy2020 — statistical section map (PDF pages)

| Schedule | Title | PDF page(s) | Extracted to |
|---|---|---|---|
| contents | Statistical Section contents | 114 | — |
| 1 | Condensed Statement of Net Position | 115–116 | — |
| 2 | Changes in Net Position | 117–118 | — |
| 3 | Fund Balances of Governmental Funds | 119 (2011–14), 120 (2015–20) | reserves.csv |
| 4 | Changes in Fund Balances of Governmental Funds | 121 (2011–14), 122 (2015–20) | gf_revenue.csv; debt.csv (debt-service components) |
| 5 | Assessed Values of Taxable Property | 123 (gross AV), 124 (net AV, direct rate, net levy) | tax_rates.csv (AV) |
| 6 | Direct and Overlapping Property Tax Rates | 125 | tax_rates.csv (rates) |
| 7–8 | Principal Property Tax Payers | 126–127 | — |
| 9 | Property Tax Levies and Collections | 128 | levy.csv |
| 10 | Ratios of Outstanding Debt by Type | 129–130 | debt.csv |
| 11 | Direct and Overlapping Governmental Activities Debt (June 30, 2020) | 131 | — |
| 12 | Legal Debt Margin (RMV for FY2020 calc) | 132 | tax_rates.csv (rmv, FY2020 only) |
| 13–14 | Demographic & Economic / Principal Employers | 133–134 | — |
| 15 | FTE Employees by Assignment/Function | 135 (2011–15), 136 (2016–20) | fte_by_function.csv |
| 16 | Meal and Transportation Services | 137 | — |
| 17 | School Building and Student Enrollment (incl. ADMw) | 139–140 (totals + ADMw on 140) | enrollment.csv |

## acfr-fy2016 — statistical section map (PDF pages; different schedule numbering — only ONE principal-taxpayers schedule, so everything after Schedule 7 shifts down by one vs. later years)

| Schedule | Title | PDF page(s) |
|---|---|---|
| 1 | Condensed Statement of Net Position | 142–143 |
| 2 | Changes in Net Position | 144–145 |
| 3 | Fund Balances of Governmental Funds | 146–147 |
| 4 | Changes in Fund Balances of Governmental Funds | 148–149 |
| 5 | Assessed Values of Taxable Property | 150 |
| 6 | Direct and Overlapping Property Tax Rates | 151 |
| 7 | Principal Property Tax Payers (Multnomah County) | 152 |
| 8 | Property Tax Levies and Collections | 153 |
| 9 | Ratios of Outstanding Debt by Type | 154 |
| 10 | Direct and Overlapping Governmental Activities Debt (June 30, 2016) | 155 |
| 11 | Legal Debt Margin | 156 |
| 12 | Demographic and Economic Statistics | 157 |
| 13 | Principal Employers | 158 |
| 14 | FTE Employees by Assignment/Function (Last FIVE Fiscal Years only) | 159 |
| 15 | Meal and Transportation Services | 160 |
| 16 | School Building and Student Enrollment | 161–170 |

Not extracted: FY2011–FY2016 are already covered by acfr-fy2020's statistical section, and the fy2016 FTE schedule only carries five years. Use this map if pre-2011 anchors are ever needed (Schedules 3–8 there run FY2007–FY2016).

## Audit firms (Independent Auditor's Report)

| ACFR | Firm | Citation |
|---|---|---|
| acfr-fy2016 (FY ending 6/30/2016) | Talbot, Korvola & Warwick, LLP | Transmittal letter p18 ("The auditors selected by the Board of Education, Talbot, Korvola & Warwick, LLP"); the auditor's-report pages themselves (p26–29, p174–175) are scanned images with no extractable text |
| acfr-fy2020 (FY ending 6/30/2020) | Talbot, Korvola & Warwick, LLP | Independent Auditor's Report letterhead p23; Oregon-regulations report p144 |
| acfr-fy2025 (FY ending 6/30/2025) | Talbot, Korvola & Warwick, LLP | Independent Auditor's Report p23–26, signed "For Talbot, Korvola & Warwick, LLP", dated January 28, 2026 |

**Finding: no auditor turnover across the three ACFRs examined (FY2016, FY2020, FY2025) — TKW throughout, i.e. at least a decade with the same firm.** (The intervening years FY2017–FY2024 were not checked here; a continuous-tenure claim beyond these three anchor years needs those reports.)

## Extraction decisions

- **fy format**: plain "2025" = fiscal year ending June 30, 2025, matching how the statistical schedules label columns.
- **reserves.csv**: General Fund TOTAL ending fund balance (GAAP, modified accrual, Sch 3). No contingency column — contingency is a budget-basis concept absent from the ACFR statistical section. GASB 54 classification detail is in notes.
- **gf_revenue.csv**: scope is ALL governmental funds (Sch 4), noted on every row — the ACFR statistical section has no GF-only revenue trend table. "Total revenues" included as a row.
- **tax_rates.csv**: av_billions = Total NET Assessed Value (after urban-renewal excess and nonprofit housing, Sch 5 second page) — the base the total direct rate is applied to. RMV only where printed (Sch 12 current-year calc: FY2025 and FY2020). compression_loss_k left empty: Sch 5's "Reduction and Adjustments" bundles compression with other adjustments and is carried in notes instead. No gap levy exists in FY2011–FY2025.
- **levy.csv**: imposed_k = "Net Taxes Levied for the Fiscal Year" (net levy after M5/M50); collected_k = collected within the fiscal year of the levy; subsequent-year collections and total-to-date in notes.
- **debt.csv**: go_outstanding_k = GO bonds at par (excl. unamortized premium); net-of-premium figure, full-faith-&-credit, recovery zone, QZAB, SSELP and lease/subscription balances in notes. debt_service_k is the sum of the two printed Sch 4 lines (principal + interest), components cited in notes. FY2013–FY2015 GO rows come from acfr-fy2025's extended Sch 10 table.
- **enrollment.csv**: enrollment = Sch 17 "Total All" unduplicated October headcount (includes charters, community-based, special services); admw = Extended ADMw as used for SSF allocation; ADMr not in the statistical section.
- **fte_by_function.csv**: Sch 15 assignment groups verbatim; values are FTE positions, not dollars.

## Anomalies

1. **acfr-fy2025 Sch 17 FY2023 enrollment is misprinted in the source**: Total All 52,380 (vs 45,497 in FY2022 and 44,771 in FY2024); the Irvington (2,514) and Kelly (2,830) rows are implausible vs their own adjacent years (~235–420) and inflate the elementary and grand totals. Written as printed with an anomaly note; verify FY2023 against acfr-fy2023's own statistical section.
2. **ADMw restatement**: FY2020 ADMw is 57,624 (preliminary) in acfr-fy2020 but 57,825 in acfr-fy2025. Both written; each ACFR flags its two most recent years as preliminary.
3. **Net AV discrepancy inside acfr-fy2025**: Sch 10 continuation (p137) prints FY2020 net AV as 53,703,299 while Sch 5 (p131) and acfr-fy2020 print 53,703,209 — 90k transposition. Sch 5 value used.
4. **acfr-fy2020 Sch 5 (p124) prints the FY2012 total direct rate as "7"** (truncated); Sch 6 (p125) shows 7.2681. Sch 6 value used.
5. **acfr-fy2025 Sch 12 header says "Legal Debt Margin Calculation for Fiscal Year 2024"** but the figures (debt limit 12,037,901; net debt 1,298,946) match the FY2025 row — header misprint. RMV 151,420,136k recorded as FY2025 with note.
6. **GF fund-balance classification differs between reports for FY2016–FY2017**: acfr-fy2020 shows assigned 7,200 + unassigned (30,249 / 12,544); acfr-fy2025 shows the whole balance as assigned with zero unassigned. Totals agree; classification reclassified in later presentation.
7. **Rounding flips of ±1k between the two reports** for overlapping FY2015–FY2017 revenue lines (e.g. property taxes 287,035 vs 287,036; extracurricular 7,904 vs 7,905) — both kept under their own doc_id.
8. **Sch 15 FTE**: beginning FY2020, SPED staff moved from District Level Administration to School Level Administration (explains District Level Admin dropping 16.0 → 4.0).
9. **acfr-fy2016's Independent Auditor's Report is a scanned image** — no text extractable from the report pages; firm identified from the transmittal letter instead.
10. **acfr-fy2020 Sch 17 rows carry a stray leading value** (e.g. "Total All ... 46,596" before the ten year-columns) — appears to be a layout artifact of an eleventh (FY2010?) column; the clean ten-column summary block at the bottom of p140 was used.
11. **Contingency and ADMr do not appear** in ACFR statistical sections (budget-book concepts) — those columns are intentionally empty, not missing data.
12. **Full faith & credit obligations** have no dedicated column in the shared debt.csv schema — balances preserved in per-row notes along with SSELP, recovery zone, QZAB, and lease/subscription debt.
