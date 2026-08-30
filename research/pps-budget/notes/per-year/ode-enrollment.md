# ODE / enrollment extraction worksheet — state funding, SIA/HSS, levy reviews

Fragments directory: `research/pps-budget/data/fragments/ode-enrollment/`

## Sources assigned vs. sources present

| Assigned file | Status |
|---|---|
| `ode-ssf-estimates-fy2026-27.txt`, `ode-ssf-estimates-fy2025-26.txt` | **ABSENT from corpus** (checked text/, pdf/, xlsx/, html/, harvest.txt) |
| `ode-admw-breakout-fy2026-27.txt`, `ode-admw-breakout-fy2025-26.txt` | **ABSENT from corpus** |
| `psu-forecast-2024.txt`, `psu-forecast-2022.txt`, `psu-forecast-2012.txt` | **ABSENT from corpus** |
| `ode-sia-allocation-25-27.txt` (15 pp) | present — extracted |
| `ode-hss-allocation-25-27.txt` (12 pp) | present — extracted |
| `lro-5-24-equalization.txt` (19 pp) | present — notes only, per instructions |
| CBRC local-option levy reviews | four found and extracted: `cbrc-2021-22-cbrc-local-option-review` (3 pp), `cbrc-2022-23-cbrc-local-option-levy-review` (2 pp), `cbrc-2023-24-cbrc-local-option-levy-review` (2 pp), `cbrc-2024-25-cbrc-local-option-levy-review` (2 pp) |

Consequence: **ssf.csv was not written** (no SSF district-estimate source in the corpus; SSF total / General Purpose Grant / local revenue offset for FY2025-26 and FY2026-27 unavailable), the ADMw weight-category breakout could not be built, and enrollment.csv has no PSU historical/forecast series — only one audited-enrollment data point from the CBRC staffing table.

## Tables written

- **admw_breakout.csv** (2 rows) — the only page-citable PPS ADMw in the assigned sources, both tied to **2024-25 State School Fund data** as used for 2025-27 grant distribution:
  - total ADMw **53,745.11** (`ode-sia-allocation-25-27` p9). Caveat: SIA distributes on ADMw **with poverty weights doubled** (`lro-5-24-equalization` p17), so this may not equal the SSF-formula ADMw; district row's allocation includes sponsored charters (charter ADMw printed separately: Emerson 134.25, Le Monde 384.14, Arthur Academy 185.25, Portland Village 423.50, Cottonwood 199.83).
  - grades 9-12 ADMw **17,291.66** (`ode-hss-allocation-25-27` p7).
  - Cross-check: budget-book fragments (fy2024-25/enrollment.csv) carry SSF-formula ADMw ~53,500 (2021-22) — same order of magnitude as 53,745.11, consistent with the doubled-poverty-weight caveat being small for PPS.
- **sia_hss.csv** (4 rows, custom table — no schema slot exists for SIA/HSS): SIA $43,680.64k (25-26) / $45,463.53k (26-27); HSS $12,623.37k (25-26) / $13,138.61k (26-27). ODE preliminary allocations dated 2025-09-16; basis `proposed`. Kairos PDX (PPS-sponsored independent charter) gets a separate direct SIA allocation (p13), excluded from PPS rows.
- **levy.csv** (9 rows, FY2019-20 → 2025-26) from the four CBRC reviews. Receipts are as-of-April-1 partial-year figures; positions for the review's current year are projections from receipts ÷ average teacher cost. Imposed amounts are not printed in CBRC reviews (see budget-book fragments for levied amounts, e.g. fy2024-25/levy.csv p210).
- **enrollment.csv** (1 row): FY20-21 audited enrollment 44,186 (`cbrc-2021-22-cbrc-local-option-review` p3, All PPS row).

## Levy series assembled (CBRC reviews)

| FY | Receipts (as of Apr 1) | Positions | Avg teacher cost | Source page |
|---|---|---|---|---|
| 2019-20 | $97.4M (narrative) | 916+ | $106,000 | cbrc-2024-25 p1 |
| 2020-21 | — | 873.00 (staffing table) | — | cbrc-2021-22 p3 |
| 2021-22 | — | 851 (retrospective) | — | cbrc-2022-23 p1 |
| 2022-23 | $106,511,980 | ~851 (projected) / **922 retrospective** | $125,161 | cbrc-2022-23 p1 / cbrc-2023-24 p1 |
| 2023-24 | $108,840,000 | ~802 | $135,739 | cbrc-2023-24 p1 |
| 2024-25 | $104.6M | 744 (projected) | $141,000 | cbrc-2024-25 p1 |
| 2025-26 | $109.2M (projected) | ~718 (projected) | $152,000 (projected) | cbrc-2024-25 p1 |

Levy mechanics per the reviews: Measure 26-161 (Nov 2014) → renewed Nov 2019 (26-207) → renewed May 2024 (26-246); funds sit in a dedicated GF sub-account restricted to teacher salaries/benefits (procedure dating to FY13-14); projected 13% of the General Fund in 2025-26; position goal stated variously as "825 average per year" (2021-22 and 2023-24 reviews) vs "at least the 851 initially projected" (2022-23 review) vs "approximately 660 annually" (2024-25 review, reflecting the renewed 26-246 levy).

## LRO 5-24 equalization notes (formula parameters — notes only, no number rows)

- Formula revenue = SSF grant + statutorily defined local revenue; **SSF grant = district formula revenue − local revenue** (the local-revenue offset mechanism), p7. Local option levy taxes and voluntary contributions sit **outside** equalization (p8) — which is why the PPS levy is additive on top of SSF.
- State share of formula revenue: <30% pre-1990-91 → ~70% 1999-2000 → **66.5% for 2023-25** (p4). K-12 districts get 95.5% / ESDs 4.5% of formula revenue since 2011-12 (p4).
- General Purpose Grant = ADMw × (statutory $4,500 target + teacher-experience adjustment) × balancing ratio; ratio ~**188% in 2019-20** (≈ $8,460/ADMw), p10. Teacher-experience adjustment: ±$25 per year vs statewide average (p10).
- ADMw: IEP weight +1.0 (11% cap without ODE approval); poverty/foster/neglected are group counts outside the 2.0/student cap; **extended ADMw = higher of current-year or prior-year ADMw** (p9). The numeric weight table on p9 is an image with no text layer — individual weight values not extractable.
- Transportation grant: 70/80/90% of approved costs by cost-per-student decile rank (p10-11). High Cost Disabilities grant: costs above $30,000 per eligible student, statewide pool (~$55M reference, p12). GP grant ≈ 95% of formula revenue; Transportation < 4% (p12).
- SIA (HB 3427) distributes on **ADMw with poverty weights doubled** (p17). Statewide ELL program: $12.5M/biennium set-aside from SSF (p17).

## Anomalies

1. Five assigned source files are absent from the corpus (both SSF estimate files, both ADMw breakout files, all three PSU forecasts) — ssf.csv not written; admw_breakout.csv holds only grant-table ADMw, not a weight-category breakout; enrollment.csv holds no PSU historical/forecast series.
2. 2022-23 levy positions conflict: ~851 (projected, May 2023 review p1) vs 922 (retrospective, May 2024 review p1). Both rows written to levy.csv.
3. Levy position goal drifts across reviews: 825/yr (2021-22, 2023-24 reviews) vs "at least 851 initially projected" (2022-23 review) vs ~660/yr (2024-25 review under renewed Measure 26-246).
4. `cbrc-2021-22-cbrc-local-option-review` PDF pages 1-2 have no text layer (review narrative likely scanned); only the p3 staffing table extractable.
5. SIA/HSS allocations have no slot in the fragment schema; wrote custom `sia_hss.csv` (program,amount_k,fy,basis,doc_id,page,notes).
6. SIA district-row ADMw (53,745.11) uses SIA weighting (poverty doubled) and bundles sponsored charters — treat as approximately, not exactly, the SSF formula ADMw for 2024-25.
