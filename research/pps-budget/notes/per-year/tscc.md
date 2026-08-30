# TSCC series extraction worksheet (Portland Public Schools)

Corpus files (form-feed pages = 1-indexed PDF pages cited below):
- `tscc-review-fy2026.txt` — FY2025-26 budget review, 19 pp (richest edition)
- `tscc-review-fy2025.txt` — FY2024-25 budget review, 19 pp. **Title page misprints "Budget Review 2023-24"** — content is unambiguously the FY2024-25 review.
- `tscc-review-fy2024.txt` — FY2023-24 budget review, 19 pp
- `tscc-annual-report-2024-25-summaries.txt` — 160 pp; PPS at pp.82-85; other school districts pp.78-113
- `tscc-annual-report-2024-25-general.txt` — 121 pp; comparative tables (staffing p.28, permanent rates p.43, compression p.50, outstanding debt pp.77-79)
- `tscc-measure-26-259-review.txt` — 2025 $1.83B bond review, 10 pp
- `tscc-measure-26-215-review.txt` — 2020 $1.208B bond review, 12 pp

Fragments written to `research/pps-budget/data/fragments/tscc/`: all_funds_by_fund, gf_revenue, gf_requirements_function, fte_by_function, tax_rates, enrollment, reserves, debt, ssf, levy, bond_projects. **gf_requirements_object not written** — TSCC prints no GF-by-object table (all-funds only; see below).

## Column layout of the review tables (rule 3 applied)
Each review prints four year-columns; a row was emitted per column:
- FY26 review: 2022-23 Actual, 2023-24 Actual, 2024-25 Revised, 2025-26 Approved
- FY25 review: 2021-22 Actuals, 2022-23 Actuals, 2023-24 Revised, 2024-25 Approved
- FY24 review: 2020-21 Actuals, 2021-22 Actuals, 2022-23 **Adopted** (resources/objects tables, pp.5/9) or 2022-23 **Revised** (property-tax p.6, GF-requirements p.14, and all summary pages) — mixed labeling within one document; fragments follow the summary-page label (revised) since the emitted rows cite pp.17-19.
Together the three reviews + annual report give budgetary actuals 2020-21 through 2023-24 and budget-stage figures 2022-23 through 2025-26.

## Tables with NO fragment schema (recorded here only)
The TSCC reviews print **all-funds** requirements by object and by function, and all-funds resources by category. The shared schemas only cover GF (gf_requirements_*) or fund totals (all_funds_by_fund), so these live here.

### All-funds requirements by object ($000, native whole dollars)
| object | 2020-21 A | 2021-22 A | 2022-23 A | 2023-24 A | 2022-23 Rev | 2023-24 Rev | 2024-25 Rev | 2023-24 App | 2024-25 App | 2025-26 App |
|---|---|---|---|---|---|---|---|---|---|---|
| Personnel Services | 648,714 | 692,463 | 735,395 | 787,147 | 783,727* | 788,967 | 796,596 | 788,967 | 796,596 | 821,241 |
| Materials & Services | 194,100 | 241,552 | 249,021† | 243,272 | 371,841* | 407,882 | 394,500‡ | 407,883 | 394,501 | 331,819§ |
| Capital Outlay | 234,548 | 174,906 | 216,049 | 249,085 | 394,311* | 656,042 | 822,730 | 656,042 | 822,730 | 489,669 |
| Debt Service | 246,806 | 641,907 | 254,443 | 273,755 | 228,898* | 252,744 | 296,376 | 252,744 | 296,376 | 308,953 |
| Fund Transfers | 2,466 | 1,825 | 1,901 | 1,506 | 1,923 | 1,694 | 16,516 | 1,694 | 16,516 | 41,757 |
| Contingencies | 0 | 0 | 0 | 0 | 56,024 | 48,414 | 44,738 | 48,414 | 44,738 | 41,679 |
| Ending Fund Balance | 906,725 | 672,720 | 895,164 | 624,938 | 46,536 | 26,313 | 22,423 | 26,313 | 22,423 | 0 |
| TOTAL | 2,233,359 | 2,425,373 | 2,351,973 | 2,179,703 | 1,883,260 | 2,182,056 | 2,393,879 | 2,182,057 | 2,393,880 | 2,035,118 |

Sources: FY26 review p.10 (2022-23 A…2025-26 App; expenditure rows) & p.18 (summary incl. contingency/EFB; total printed 2,035,117 there); FY25 review p.9/pp.17-18; FY24 review p.9/p.18 (2022-23 columns labeled Adopted on p.9, Revised on p.18); annual report summaries p.84 (2024-25 Adopted column identical to FY25-review Approved). \* = "2022-23 Adopted" label (FY24 review p.9). † FY25 review prints 249,017 for 2022-23 actual M&S; FY26 review prints 249,021. ‡ p.10 prints 394,500; summary p.18 prints M&S 331,818 for 2025-26. § p.10 prints 331,819.

### All-funds requirements by function ($000) — printed only in FY24/FY25 reviews + pie charts
| function | 2020-21 A | 2021-22 A | 2022-23 A | 2022-23 Rev | 2023-24 Rev | 2023-24 App | 2024-25 App | 2025-26 App (pie, p.9 FY26) |
|---|---|---|---|---|---|---|---|---|
| Instruction | 417,111 | 460,823 | 471,425 | 536,615 | 524,904/524,905 | 524,905 | 536,298 | 545,150 |
| Support Services | 348,539 | 383,453 | 435,963 | 463,765 | 459,140 | 459,139 | 453,735 | 451,464 |
| Enterprises & Community Svcs | 23,914 | 30,630 | 34,878 | 36,048 | 37,139 | 37,139 | 33,312 | 42,469 |
| Facilities Acq. & Construction | 287,785 | 256,689 | 285,718 | 514,050 | 831,708 | 831,707 | 1,027,836 | 639,909 |
| Debt Service | 246,806 | 619,233 | 226,733 | 228,298 | 252,745 | 252,744 | 259,438 | 272,690 |
| Transfers Out | 2,466 | 1,825 | 1,900 | 1,923 | 1,694 | 1,694 | 16,516 | 41,757 (object row) |
| Contingencies | 0 | 0 | 0 | 56,024 | 48,414 | 48,414 | **44,321** | 41,679 (object row) |
| Ending Fund Balance | 906,738 | 672,720 | 895,164 | 46,536 | 26,313 | 26,313 | 22,423 | 0 |
| TOTAL | 2,233,359 | 2,425,373 | 2,351,781 | 1,883,259 | 2,182,057 | 2,182,055 | 2,393,879 | — |

Sources: FY25 review p.17 (2021-22 A, 2022-23 A, 2023-24 Rev, 2024-25 App); FY24 review p.18 (2020-21 A, 2021-22 A, 2022-23 Rev, 2023-24 App); FY24-25 by-function pie FY25 review p.8 (labeled "2023-24 Requirements by Function" but repeats the FY24 review's 2023-24 pie: Instruction 524,905 / Support 459,139 / E&CS 37,139 / FA&C 831,707 / Debt 252,744); FY26 review p.9 pie for 2025-26. Note function-basis contingency 44,321 vs object-basis 44,738 for 2024-25 App (FY25 review pp.17-18, unexplained).

### All-funds resources by category ($000)
| source | 2020-21 A | 2021-22 A | 2022-23 A | 2023-24 A | 2022-23 Adopted | 2023-24 Rev | 2024-25 Rev | 2023-24 App | 2024-25 App | 2025-26 App |
|---|---|---|---|---|---|---|---|---|---|---|
| Property Taxes | 520,574 | 553,417 | 574,822 | 615,286 | 577,592 | 610,660 | 624,858 | 610,660 | 624,858 | 648,935 |
| Other Taxes | 3,446 | 5,436 | 4,190 | 1,786 | 5,505 | 5,451 | 2,001 | 5,451 | 2,001 | 1,500 |
| Intergovernmental | 394,679 | 469,926 | 507,575 | 502,372 | 515,650 | 445,012¹ | 451,639 | 445,012 | 451,639 | 489,360 |
| Fees & Charges | 63,201 | 84,925 | 91,971² | 92,214 | 94,521 | 100,303³ | 102,218 | 100,303 | 124,077⁴ | 102,161 |
| Other Income | 15,406 | 2,281 | 33,962⁵ | 71,375 | 22,441 | 39,341³ | 75,558 | 39,341 | 53,698⁴ | 57,950⁶ |
| Debt Proceeds | 450,635 | 400,839 | 464,832 | 0 | 2,300 | 415,560³ | 429,346 | 415,560 | 429,346 | 85,000 |
| Beginning Fund Balance | 782,952 | 906,724 | 672,720 | 895,164 | 663,328 | 564,036 | 691,743 | 564,036 | 691,743 | 608,455 |
| Transfers In | 2,466 | 1,825 | 1,901 | 1,506 | 1,923 | 1,694 | 16,516 | 1,694 | 16,516 | 41,757 |
| TOTAL RESOURCES | 2,233,359 | 2,425,373 | 2,351,973⁷ | 2,179,703 | 1,883,260 | 2,182,057 | 2,393,879 | 2,182,057 | 2,393,878 | 2,035,118⁷ |

Sources: FY26 p.6/p.18; FY25 p.6/p.17; FY24 p.5/pp.17-18; summaries p.84. ¹ FY25 review summary p.17 prints 458,318 for 2023-24 Revised intergovernmental (vs 445,012 in its own p.6 table and the FY24 review) — annual report p.84 also prints 458,318. ² FY25 review prints 91,970. ³ FY25 summary p.17 prints Fees 92,230 / Other Income 35,008 / Debt Proceeds 414,660 for 2023-24 Revised (conflicts with its own p.6). ⁴ 2024-25 Approved Fees 124,077 / Other Income 53,698 (FY25 review) vs 2024-25 Revised 102,218 / 75,558 (FY26 review) — big swings between approved and revised. ⁵ FY25 review prints 33,956. ⁶ Summary p.18 prints 57,949. ⁷ FY25 review prints TOTAL 2,351,966 for 2022-23 actual; summary pages print 2,035,117 for 2025-26.

### All-funds property tax breakdown ($000) — local-option rows also in levy.csv
| component | 2020-21 A | 2021-22 A | 2022-23 A | 2023-24 A | 2022-23 Rev | 2023-24 Rev | 2024-25 Rev | 2023-24 App | 2024-25 App | 2025-26 App |
|---|---|---|---|---|---|---|---|---|---|---|
| Permanent Rate (incl. Gap Tax) | 281,752 | 300,100¹ | 312,281 | 339,809 | 314,766 | 330,115² | 352,328 | 330,115 | 352,328 | 359,837 |
| Local Option Levy | 100,955 | 104,719 | 109,213 | 106,896 | 109,951 | 114,676 | 104,608 | 114,676 | 104,608 | 109,222 |
| GO Debt | 131,818 | 142,032 | 145,774 | 158,490 | 146,945 | 159,452 | 161,337 | 159,452 | 161,337 | 173,708 |
| Prior Years | 5,537 | 6,049 | 7,008 | 8,423³ | 5,530 | 5,967⁴ | 6,135 | 5,967 | 6,135 | 5,718 |
| Payments in Lieu | 512 | 517 | 546 | 668 | 400 | 450 | 450 | 450 | 450 | 450 |
| TOTAL | 520,574 | 553,417 | 574,822 | 615,286³ | 577,592 | 610,660 | 624,858 | 610,660 | 624,858 | 648,935 |

Sources: FY26 review p.7/p.18; FY25 review p.6/p.16(p.17 table); FY24 review p.6/p.17; summaries p.84. ¹ FY25 summary p.17 prints 330,100 for 2023-24 Revised permanent (vs 330,115 on its p.6) and annual report p.84 also prints 330,100. ² see ¹. ³ FY26 p.7 prints Prior Years 8,423 and TOTAL 614,286 for 2023-24 actual; FY26 p.18 prints 9,423 and 615,286 (internal conflict; resources tables use 615,286). ⁴ FY25 summary p.17 prints 5,982. Note: annual report p.84 PPS breakdown omits the GO Debt row entirely (its TOTAL 624,858 for 2024-25 nonetheless matches the all-rows total elsewhere — the printed component rows there do not sum to the printed total).

### GO debt service requirements schedule (26-215 review p.4, as of 6-30-20, $ millions)
Series (par): 2013B $145M, 2015B $245M, 2017A $169M, 2017B $253M, 2020 $441M.
| FY | 2013B | 2015B | 2017A | 2017B | 2020 | Total |
|---|---|---|---|---|---|---|
| FY19 | 5 | 28 | 78 | 9 | — | 120 |
| FY20 | 5 | 29 | 19 | 72 | — | 124 |
| FY21 | 5 | 43 | — | 8 | 55 | 111 |
| FY22 | 5 | 11 | — | 8 | 60 | 84 |
| FY23 | 5 | 11 | — | 9 | 53 | 77 |
| FY24 | 5 | 11 | — | 9 | 54 | 80 |
| FY25 | 6 | 11 | — | 9 | 56 | 82 |
| FY26 | 6 | 12 | — | 9 | 36 | 63 |
(Projection as of Sept 2020; FY21+ superseded by later issuances — not written to debt.csv.)

### Bond election results & issuance (26-215 review p.2)
- May 2011, 26-121, $548M: 60,337 yes / 61,005 no (49.7%) — **failed**
- Nov 2012, 26-144, $482M: 161,603 / 82,485 (66.2%) — passed
- May 2017, 26-193, $790M: 80,111 / 41,254 (66.0%) — passed
- Nov 2020, 26-215, $1.208B — passed 75%/25% (26-259 review p.7 says "November 2020, $1.2 billion – 75% yes"; also lists "May 2017 … 66% yes, 44% no" and "Nov 2012 … 66% yes, 44% no" — percentages sum to 110%, sloppy in source)
- May 2025, 26-259, $1.83B (measure under review)

2012-bond issuance: 2013A 76,265k; 2013B 68,575k; 2015A 30,300k; 2015B 244,700k; 2017B 62,160k = 482,000k. 2017-bond issuance: 2017A 168,950k; 2017B 179,730k; 2020 441,320k = 790,000k.

### 2020 bond options considered (26-215 p.6, $M): Option 1 $584 / Option 2 $785 / Option 3 $1,051 / final measure $1,208. Final vs Option 3: Educational +$68 (42%), H&S −$15, Modernizations +$79, Management +$19, Contingency +$6.

### PPS outstanding long-term debt, all types (general report p.79, $M)
6/30/2014: 588 · 6/30/2023: 1,970 · 6/30/2024: 1,434 (exact 1,433,611,215 per summaries p.82). One-year change −27%, ten-year +144%. Countywide table also covers City of Portland, Port, Metro, TriMet, County, PCC.

## Cumulative-cuts sequence (narrative only — the FY26 review's four-year reduction summary table is IMAGE-ONLY, p.4)
- FY2023-24 (FY24 review p.1): no explicit "gap" headline; ~281 FTE cut from prior adopted (net −280.78 after +47.0 FTE at approval, p.11); gap filled with one-time state/federal resources and reserves.
- FY2024-25 (FY25 review pp.1,4): **$30.0M gap** — $15.0M central office + $15.0M school-based cuts; ~90 licensed positions cut (≈40% vacant); net FTE change −227.88 (incl. +24.97 SpEd, +21.57 paraeducators at approval, p.10); staffing back to 2021-22 ratios.
- FY2025-26 (FY26 review pp.1,4): **$40.0M gap** — $17.0M central office + $23.0M school-based cuts; ~183 licensed positions cut (p.11); FTE 6,018.09 → 5,835.46 (−182.63); central-office reductions "over the last three fiscal years"; IB supports eliminated at elementary/K8; Title 1 middle-school supplemental cut 2.0→1.0 FTE.

## Other year-by-year narrative figures
- Arts Tax to GF: FY23-24 $4.5M (−$80K, FY24 review p.13); FY24-25 just under $4.8M (+$255K, FY25 review p.12); FY25-26 $5.3M (+$541K, FY26 review p.13).
- PERS (FY26 review pp.9-10): blended contribution 4.20% assumed (SB 849 would cut 1.68%); UAL fringe 17.39%; PERS Rate Stabilization Fund transfers ~$24.0M (23,962k) to GF.
- ESSER: $36.3M available FY23-24 (FY24 review p.7); remainder spent by Q1 FY24-25 (FY25 review p.6); eliminated by FY25-26.
- PCEF Climate Investment Plan award: $19,930,833 over 5 years ($16,930,833 physical + $3,000,000 student-led) (FY25 review p.10).
- Compliance: all three reviews pass all 7 checklist items; no certification objections any year. FY24-25 Adopted had erroneous $165K contingency in Debt Service Fund (FY26 review p.17). FY23-24 GO levy initially assumed a 92.6% collection rate vs stated 96% — resolved without amendment (FY24 review pp.5,16). FY24-25 Proposed had FY22-23 actual errors in one fund (FY25 review p.16).
- Countywide context (general report): total property taxes imposed in Multnomah County FY24-25 $2,418M, schools share $931M (p.45); PPS permanent rate 5.2781 highest of county K-12 (p.43); PPS is the largest local-option compression loser in the county (p.50).

## Image-only content (figures NOT extractable — do not trust derived values)
1. FTE-by-function charts in all three reviews (FY26 pp.10-11, FY25 pp.8-9, FY24 pp.9-10): "FTE Chart Continued on Next Page" with no table text. FY25 review notes its chart is from the *proposed* book.
2. FY26 review p.4: four-year cuts summary table.
3. "Approved Budget Tax Levies / Impact on Average Homeowner" tables (FY26 p.8, FY25 p.6, FY24 p.6).
4. District debt-payment schedule charts (FY26 p.16, FY25 pp.15-16, FY24 pp.15-16) — only narrative totals extracted.
5. 26-259 review: enrollment forecast tables (PSU PRC, p.4), Piper Sandler levy/debt analysis (p.6), January staff-memo project cost breakout (p.8), homeowner impact detail (p.10 — only $688/yr @ $275K AV narrative).
6. ESSER planned-amount chart (FY24 review p.7).

## Anomaly log (cross-document contradictions)
1. **PPS FTE 2021-22/2022-23**: 6,274/6,520 (FY26 review p.3, annual report pp.28/83, 26-259 p.3) vs **6,212/6,530** (FY25 review p.3, FY24 review p.3). Same-labeled table, different editions.
2. **ADMw 2022-23**: 53,581 (FY26 review p.4, 26-259 p.3) vs 53,518 (summaries p.83).
3. **2024-25 debt service rate**: 2.3338 (FY26 review p.3, 26-259 p.3) vs 2.3838 (summaries p.83).
4. **Prior-year property taxes 2023-24 actual**: 8,423k (FY26 p.7) vs 9,423k (FY26 p.18) — same document; total property tax 2023-24 printed 614,286k on p.7 but 615,286k on pp.6/18.
5. **Special Revenue Fund 2022-23 actual**: 249,354k (FY26 p.19) vs 249,169k (FY25 p.18) vs 249,357k (summaries p.84).
6. **Grand totals 2022-23 actual**: 2,351,973 / 2,351,969 / 2,351,781 / 2,351,966 across tables.
7. FY25 review title page says "Budget Review 2023-24" (copy of prior-year title).
8. FY25 review debt status "as of June 20, 2023" — stale date (FY24 review uses the same date); amounts differ ($1.8B vs $1.97B).
9. Enrollment-chart series changes definition across editions: FY24 chart prints 46,937/45,005 for 2020-21/2021-22; FY25 chart 46,649/44,747; FY26 chart 46,649/44,861. FY25 chart values track ADMr; FY26 chart is a different (headcount-like) series.
10. 26-215 p.4 prints FY20 permanent rate 5.2771 (elsewhere 5.2781) and total 9.6724 in the box vs 9.6742 in text.
11. David Douglas M5 impact 2021-22..2023-24 printed "$-27 / $-32 / $-34" — garbled/truncated; omitted from tax_rates.csv. Centennial 2024-25 printed "$-68.927" (decimal point for comma).
12. Multnomah ESD FTE FY22-24: 641/676/710 (general p.28) vs 712/746/778 (summaries p.79).
13. FY24 review labels its 2022-23 prior-year column "Adopted" in some tables and "Revised" in others.
14. FY25 review 2024-25 Approved contingency: 44,321 (by-function p.17) vs 44,738 (by-object p.18).
15. GF Instruction/contingency 2024-25: Approved 437,284/42,656 (FY25 review, pre-amendment) vs Adopted 439,084/40,856 (annual report p.85; FY26 review p.19 "Revised" column) — the $1.8M last-minute RESJ-contract amendment (FY25 review p.1).
16. FY26 review p.16 "TOTAL ALL FUNDS … 1.7%" — % column wrong for the total row (actual change −15.0%).
17. FY26 review p.16 repeats the Measure 98 sub-fund paragraph under the "Internal Service Funds" heading (belongs to Special Revenue; correctly stated on p.6).
18. Fund-total variants: Capital Projects 2025-26 643,773 (p.19) vs 643,774 (p.16); 2023-24 834,105 (FY24 p.18) vs 834,106 (FY25/summaries) vs 834,107 (FY24 p.15); Debt Service Fund 2022-23 84,467 vs 84,474; GB/others unaffected.
19. 26-259 outstanding debt "~$1.8B" (May 2025) vs annual report $1,434M at 6/30/24 — different as-of dates/scopes; FY26 review says ~$1.7B at June 20, 2025.
