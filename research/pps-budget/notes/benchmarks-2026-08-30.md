# Benchmarks: per-student spending and teacher pay (research pass, 2026-08-30)

Two agent research passes, verified at primary sources. Raw files banked in
`research/pps-budget/data/benchmarks-raw/` (ODE NOE xlsx, Census F-33 xlsx ×2, SCTA/UESF/NCTQ
salary PDFs) and `runtime-data/pps-budget/` (`qem-2026.pdf` + text layer). Everything below
feeds the flagship page's "Is it a lot?" section.

## A. Per-student spending

### A1. The "should" anchor: Oregon Quality Education Model, 2026 report (Aug 2026)
- Report: https://www.oregon.gov/ode/reports-and-data/taskcomm/Documents/Quality%20Education%20Commission%20QEM%20Report%202026.pdf
- Exec summary: https://www.oregon.gov/ode/reports-and-data/taskcomm/Documents/2026%20Quality%20Education%20Model%20Report%20Executive%20Summary.pdf
- Index: https://www.oregon.gov/ode/reports-and-data/taskcomm/pages/qemreports.aspx

Verified (2027-29 biennium, Exhibit 1 / Findings §3): Scenario 1 (status quo, all sources)
$24,754.8M; Scenario 2 (full QEM) $27,186.8M; state-basis gap **$2.42B/biennium** vs status quo,
$3.65B vs SSF current service level. Derived per-student (÷2 yr ÷ 545,088 fall enrollment,
Exhibit 10 — OUR derivation, not the report's): full QEM ≈ **$24,900/student/yr** all sources,
status quo ≈ $22,700. Cross-check in report (AIR evaluation section): 2022-23 QEM adequacy
$18,829/pupil, AIR model $22,210, actual state+local $17,136. Findings §4: Oregon 20th in
state-sourced per-pupil funding; full QEM ≈ 12th. NOT USABLE: press "$19,700/student QEC"
figure — no page cite found in report text.

### A2. In-state peers, same accounting: ODE Net Operating Expenditures per ADMr, 2023-24
- Portal: https://www.oregon.gov/ode/schools-and-districts/FiscalTransparency/Pages/FiscalTransparencyHome.aspx
- File: https://www.oregon.gov/ode/schools-and-districts/grants/Documents/Net%20Operating%20Expenditures%20per%20ADMr%20by%20district%20w%2023-24%20data%20as%20of%208-26-25.xlsx
- Definition: OAR 581-023-0041 (GF instruction + support services, net of specified revenues).

| District | NOE/ADMr 2023-24 |
|---|---|
| **Portland SD 1J** | **$16,503** (NOE $724.2M ÷ 43,881.7 ADMr) — **+27.1% vs state** |
| Beaverton 48J | $13,135 |
| Oregon statewide | $12,989 |
| Salem-Keizer 24J | $12,958 |
| David Douglas 40 | $12,924 |

### A3. National peers: Census Annual Survey of School System Finances, FY2024
- Unit file: https://www2.census.gov/programs-surveys/school-finances/tables/2024/secondary-education-finance/elsec24.xlsx
- Summary tables 8/18: https://www2.census.gov/programs-surveys/school-finances/tables/2024/secondary-education-finance/elsec24_sumtables.xlsx
- Release: https://www.census.gov/newsroom/press-releases/2026/school-system-finances.html
- Basis: per-pupil CURRENT spending (all funds incl. food service; excludes capital + debt). Never
  mix with the ODE series.

SF $25,173 · Minneapolis $24,469 (derived) · Sacramento City $22,771 (derived) · **PPS $22,237**
(derived: TCURELSC $979,307k ÷ V33 44,039; district not in top-100 table) · Seattle $22,227 ·
Denver $17,972 · Oregon avg $18,083 · **US avg $17,619**. Derivation method reproduces published
Table 18 rows exactly (Seattle, SF), ≤0.3% (Denver). PPS = +26.2% vs US, +23.0% vs Oregon.

### A4. Composition
8pp instructional-share gap (53% vs 61% NCES per CBRC) × $26,300 all-funds operating ≈
**$2,100/student ≈ $92M/yr** (at 43,882 ADMr); on Census base 8pp × $22,237 ≈ $1,780/student ≈
$78M. FY2024 Census-derived corroboration: PPS instruction share 51.1% ($500,686k/$979,307k) vs
US 58.7% (Table 8) — 7.6pp gap, same story.

### A5. Verdict + caveats (for page)
"A lot in total, allocated unusually far from the classroom, not underfunded relative to Oregon
norms." Caveats: two incompatible accounting bases; year mismatches (ODE 23-24, Census FY24, QEM
27-29 projection, PPS GF FY27); no COL adjustment across states; QEM per-student is our
derivation and measures statewide state-funding adequacy, not PPS specifically; PPS/Mpls/Sac
Census figures derived from unit file; instruction-share bases differ (53/61 vs 51.1/58.7);
denominator zoo (ADMr 43,882 / V33 44,039 / corpus 41,700-43,500) — one per table, labeled.

## B. Teacher pay, cost-of-living adjusted

### B1. PPS anchor (corpus)
PAT CBA Appendix A-3, FY2025-26, 193-day: entry **$57,206** (BA+15 step A — no plain-BA lane;
Oregon 5th-year licensure, §12.2.1.1); top **$111,314** (BA+105/MA+45 step M); MA-lane top step
$97,526; 7 lanes × 13 steps; +$2,000 doctorate, +$1,500 National Board; 202-day extended tops
$116,506. CBRC: avg levy teacher COST $141K FY24-25 → $152K FY25-26 (salary+taxes+benefits).
Strike settlement 13.8% cumulative COLA (press); +2% Jan 1 2027.

### B2. Peer schedules (all 2025-26 primary except SF eff. 1/1/25, successor unconfirmed)
| District | Start | Top | RPP 2024 | Adj start | Adj top | Source |
|---|---|---|---|---|---|---|
| Seattle (189d) | $74,730 total ($63,117 base) | $146,087 total PhD/15 ($121,632 base) | 111.1 | $67,244 | $131,452 | https://www.seattleschools.org/wp-content/uploads/2025/07/FINAL-Certificated-Non-Supervisory-2.5-2025-26.pdf |
| Sacramento City (192d) | $64,225 | $135,137 (E/20) | 106.7 | $60,209 | $126,687 | https://sacteachers.org/wp-content/uploads/2025/10/scta_salary_sched_2025-26_eff_712025_updated_09182025.pdf |
| Denver (186d) | $57,666 | $124,233 (Doct/20) | 105.8 | $54,514 | $117,442 | https://denverteachers.org/wp-content/uploads/2025/09/25-26-DCTA-Step-and-Grade-Schedule-Effective-8-1-2025.pdf |
| San Francisco (184-186d) | $79,468 (incl. add-ons) | $131,654 (B8/26-28) | 115.6 | $68,736 | $113,875 | https://teacherquality.nctq.org/dmsView/SFUSD_23-24_schedules · https://www.sfusd.edu/information-employees/labor-relations/labor-partners/uesf-certificated |
| **Portland (193d)** | **$57,206** | **$111,314** | 105.4 | $54,264 | $105,590 | corpus CBA A-3 |
| Minneapolis | $54,702 | $114,306 (PhD/28) | 104.8 | $52,186 | $109,048 | https://www.mfe59.org/contracts |

RPP: BEA all-items metro RPPs 2024 via FRED (RPPALL38900 Portland, 42660 Seattle, 19740 Denver,
41860 SF, 33460 Minneapolis, 40900 Sacramento), e.g. https://fred.stlouisfed.org/series/RPPALL38900.
Adjusted = salary ÷ RPP × 100.

### B3. State context (NEA Rankings & Estimates 2024-25)
https://www.nea.org/resource-library/educator-pay-and-student-spending-how-does-your-state-rank/teacher
Oregon avg $81,657 (10th) · national $74,495 · WA $96,589 (3rd) · CA $103,552 (1st) ·
MN $76,234 (15th) · CO $72,781 (19th). PPS MA-lane top $97,526 ≈ $16K above Oregon mean.

### B4. Verdict + caveats (for page)
COL-adjusted salary is **middling-to-low in the peer set at every scale point** (adjusted top
dead last except Minneapolis; adjusted start ties Denver, beats only Minneapolis). But employer
COST is high: PERS ~4%→23% + benefits ride on top. The wedge line: expensive without being
especially well paid. Caveats: salary-only table vs cost anchors; Seattle "total" includes 9
supplemental days + stipend; Denver excludes ProComp incentives; SF includes parcel-tax add-ons;
PhD-lane tops flatter Seattle/Denver/Mpls (PPS tops at MA+45); contract days differ (184-193);
SF year unconfirmed; RPP metro-wide all-items 2024 applied to 25-26 salaries; no primary source
for PPS *average* salary (only cost); NEA figures are estimates.
