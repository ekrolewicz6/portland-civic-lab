# ppsdata.info: school-level dataset (banked 2026-08-30)

Edan pointed at https://ppsdata.info — "Portland Public Schools Data Explorer," built by Alex
Meub (alexmeub.com), **open source at https://github.com/meub/pps-data**. The whole site loads
from one file, https://ppsdata.info/data.json, banked verbatim at
`research/pps-budget/data/ppsdata-info-2026-08-30.json` (380KB).

## What it is
74 in-scope schools (elementary / K-8 / middle / alternative; high schools mostly out of scope)
× ~97 fields each, plus 5 charters. Self-documenting: `meta` carries label/desc/source for every
field. Sources per field: ODE Fall Membership (enrollment 2024-25, 2025-26), NCES CCD
(2018-2023 enrollment, teacher FTE, students-per-teacher), **PPS Long-Range Facility Plan 2021
Vol 1 (functional capacity — the district's own planning number, with set-asides documented)**,
Holmes 2024 seismic ROM estimates (retrofit cost remaining, URM-only scope, funded/unfunded vs
2025 bond), CRDC 2020-21 (support staff, suspensions, chronic absence), FRL/direct cert,
demographics, PortlandMaps permits + affordable-housing pipeline within 1 mile, OSRM
drive-distance to nearest same-level school for the 20 smallest, PSU-derived 10-yr enrollment
scenarios, Willamette Week's 15-lowest-enrollment list (explicitly labeled NOT a PPS closure
list; PPS list expected Nov 2026, board vote Dec 2026).

## Headline derivations (computed from the banked file, 70 schools with utilization data)
- **Median building utilization 2025-26: 61.3%** (enrollment ÷ 2021 functional capacity)
- **16 schools under 50%**: Rosa Parks, Whitman, Creston, Woodmere, Arleta, Peninsula, Chief
  Joseph, Lent, Irvington, Forest Park, Beach, Boise-Eliot, Buckman, Harrison Park, Rigler, Sabin
- **Empty seats: 16,511 of 42,988 functional capacity (38.4%)** across those 70 schools
- **18 URM (unreinforced masonry) buildings; ~$814M seismic retrofit exposure not covered by
  any current bond** (Holmes 2024 ROM, per the site's funded/unfunded split vs the 2025 bond)

## Why it matters for the flagship page
Our empty-seats section is district-level only ("~80 schools, enrollment down 16%"). This gives
the school-level floor under it: named schools, seat counts, drive distances if closed, Title I
and demographic overlays (who closures would land on), and the seismic-cost dimension that
interacts with the closure decision (closing a URM school avoids a retrofit; keeping it open
implies one).

## VERIFICATION RESULT (agent pass, 2026-08-30): PASSED — safe to cite with attribution
Every spot-checked load-bearing number matched its primary exactly:
- **Enrollment 6/6 exact** (Rosa Parks 160, Buckman 283, Harrison Park 420, Ainsworth 565,
  Lent 256, West Sylvan 685) vs ODE Fall Membership 2025-26 school-level xlsx (posted
  2/12/2026): https://www.oregon.gov/ode/reports-and-data/students/Documents/fallmembershipreport_20252026.xlsx
  — banked at `data/benchmarks-raw/fallmembership_2025_26.xlsx`.
- **Functional capacity 6/6 exact** vs PPS LRFP 2021 Vol 1 pp.53/60:
  https://www.pps.net/fs/resource-manager/view/84245cbd-4298-4803-8ba9-d26fb13a9c7a
  — banked at `runtime-data/pps-budget/lrfp-2021-vol1.pdf` (Vol 2 too large to bank; URL
  .../view/2b1b30e4-1e55-4a5c-9135-d4c08c5bf1b9).
- **Holmes 2024 seismic CONFIRMED**: "2024 PPS Seismic Assessments All Schools," Holmes,
  v1.0, 5/15/2024, ROM pricing, 365pp. 6/6 cost figures verbatim (e.g. Buckman URM $19.75M /
  full $21.35M). PPS boardbook copy:
  https://meetings.boardbook.org/Public/File/915?file=f8bb4ec8-99ca-40d8-a4c9-0b07ad1a3e6e
  (400s to curl, works in browser); DocumentCloud mirror:
  https://www.documentcloud.org/documents/25929111-2024-pps-seismic-assessment-combined-1/
  CAVEATS: ROM = rough-order-of-magnitude, excludes soft costs. URM count: 19 facilities per
  WW/Holmes incl. Columbia Regional at Wilcox (not a school) → 18 in-scope schools is correct.
  WW URM article: https://www.wweek.com/news/schools/2025/05/10/here-are-the-19-pps-elementary-and-middle-schools-in-unreinforced-masonry-buildings/
- **WW 15-lowest list CONFIRMED** (2026-03-18, Rosa Parks #1; JSON correctly uses ODE
  enrollment where WW's table drifts by a few students):
  https://www.wweek.com/news/schools/2026/03/18/heres-what-pps-will-consider-as-it-selects-schools-to-close/
- **PSU PRC per-school forecasts (Table 5.5): UNVERIFIED** — 2025 report PDF not publicly
  posted (pdxscholar stops at 2024: https://pdxscholar.library.pdx.edu/enrollmentforecasts/;
  district totals corroborated by WW 2025-08-07). Do not cite per-school forecast fields until
  the primary is obtained.
- Pipeline (github.com/meub/pps-data): four idempotent stages fetching primaries directly;
  MIT-licensed code; maintained by Alex Meub.

## Verification stance before anything reaches the page
Third-party compilation, but pipeline is public (github.com/meub/pps-data) and field-level
sourced. Before citing on portlandciviclab.org:
1. Spot-check 3-5 schools' 2025-26 enrollment against ODE Fall Membership directly.
2. Spot-check functional capacity against PPS LRFP 2021 Vol 1 (fetch into corpus; not currently
   registered).
3. Cite as "compiled by ppsdata.info from [primary]" or verify-and-cite-primary per figure.
4. Caveats the site itself flags and we must carry: 19 schools had boundary/grade redraws
   inside the 2018-2025 window (DBRAC 2018, SEGC 2023); capacity predates recent bond
   expansions; utilization uses 2021 capacity; the 15-lowest list is WW's, not PPS's.
