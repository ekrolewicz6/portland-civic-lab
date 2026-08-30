# Phase-1 research appendices (archived from the planning file, 2026-08-29)

These are the three exploration reports that seeded the corpus registry, the
research document, and the recommendations: A (codebase and reusable
machinery), B (the complete PPS budget document census, every URL), and
C (governance and funding rules research). Working copies; the corpus and
the two published documents supersede them where they conflict.

---

# APPENDIX A — Codebase map (Explore agent report, 2026-08-29)

## A1. Existing education data in the repo

**API routes** (both cached via `getCachedData/setCachedData` from `@/lib/db-query`):
- `src/app/api/dashboard/education/route.ts` (186 ln) — queries `education.enrollment`, `education.graduation_rates`, `education.test_scores`; cache key `"education"`.
- `src/app/api/dashboard/education/detail/route.ts` (367 ln) — adds `education.chronic_absenteeism`, `education.staffing`. 9 payload blocks incl. `absenteeism_equity` (PPS-only by `student_group`). Cache key `"education-detail"`. Districts hardcoded lines 8–24: Portland SD 1J, Parkrose SD 3, David Douglas SD 40, Riverdale SD 51J, Reynolds SD 7, Centennial SD 28J. Quirk at lines 70–74: `test_scores` lacks `participation_pct`/`n_tested`; NULL-aliased.

**Schema** (`src/db/introspected/schema.ts`):
| Table | Key columns | Line |
|---|---|---|
| `education.enrollment` | school_year, district_name, grade_level, enrollment, demographic_group/count/pct | 1820 |
| `education.graduation_rates` | school_year, district_name, rate_4yr, rate_5yr | 1837 |
| `education.test_scores` | school_year, district_name, subject, grade_level, proficiency_pct | 1849 |
| `education.chronic_absenteeism` | school_year, district_name, institution_name/type, student_group, chronically_absent_pct, students_included | 1628 |
| `education.staffing` | school_year, district_name, enrollment, teachers_fte, pupil_teacher_ratio (NCES CCD via Urban Institute) | 1874 |
| `education.per_pupil_spending` | school_year, district_name (default 'Portland SD 1J'), total_per_pupil | 426 |
| `education.class_size` | school_year, district_name, avg_class_size, subject | 372 |
| `education.school_enrollment` | school_year, school_name, school_type, enrollment_current/prior | 436 |

**`per_pupil_spending`, `class_size`, `school_enrollment` are ingested but never read by any route/component** — the only fiscal education rows that exist today (per_pupil only 2 years: 2022-23, 2023-24, district-level).

**Ingest scripts** (all manual `npx tsx`; no cron, no npm script):
- `ingest/fetch-education.ts` — ODE fall membership XLSX `oregon.gov/ode/reports-and-data/students/Documents/fallmembershipreport_YYYYYYYY.xlsx`, 2023-24→2025-26.
- `ingest/parse-education.ts` — local ODE enrollment XLSX **2016-17→2025-26 (10 files)**; grad rates hardcoded literal (line 210); test scores placeholders (line 231).
- `ingest/seed-education-data.ts` — ODE OSAS district XLSX `TestResults{YY}/pagr_Districts_{ELA,MATH}_{YY}.xlsx`, 2018-19→2024-25 (gaps).
- `ingest/fetch-education-extended.ts` (947 ln) — ODE Regular Attenders; **ODE Fiscal Transparency "School Level Spending Report"** (`/ode/schools-and-districts/FiscalTransparency/Documents/…`); class size; grad cohort files.
- `ingest/seed-attendance-data.ts` — local regularattenders XLSX back to 2014-15; creates the CURRENT chronic_absenteeism columns.
- `ingest/parse-education-schools.ts` — PPS-only school-level enrollment 2023-24→2025-26.
- `ingest/fetch-staffing-data.ts` — Urban Institute Education Data API `educationdata.urban.org/api/v1/school-districts/ccd/directory/{year}/?leaid=`, 2018–2023, with hardcoded NCES fallback.

**Dashboard UI**: `src/lib/questions.ts:32` (education = "Are Kids Learning?", #3d7a5a); `src/components/dashboard/education/EducationDetail.tsx` (~1280 ln client) using chart primitives in `src/components/charts/` (StatGrid, ComparisonBarChart, MultiLineChart, TrendChart) + DataNeeded, NewsContext.

**PPS budget/finance in repo: NOTHING.** Only leads: `docs/data-source-inventory.md:685` lists `https://www.pps.net/budget` [VERIFY] as a candidate; `:265` lists Oregon Socrata `acp7-jb3d` (ESD revenue by year/fund/source), unused. `src/lib/city-budget/` is the CITY budget, `src/lib/fpdr/` is city pension — not schools.

## A2. Reusable deep-dive machinery

**Venue data-layer pattern** (`src/lib/venues/`): `data.ts` — `Source{id,title,org,url,kind:"primary"|"news"|"analysis"|"book",year?}`, `SOURCES` literal → `SourceId = keyof typeof SOURCES`, `HEADLINE` const of every load-bearing number, then typed section consts. House rule in file header: every load-bearing number in HEADLINE with a source; judgments cite `pclAnalysis`; untraceable figures go in Method. `engine.ts` — `annualDebtService(P,r,n)`, `fmtMoney/fmtMillions/fmtPct/fmtCount`. `arguments.ts` — `Debate{id,title,stakes,a,b,adjudication,sourceIds}`.

**Page shell** (`src/app/(public)/deep-dives/venue-portfolio/page.tsx`, 1014 ln): pageMeta type:"article"; NAV chips; `Src({id})`/`DarkSrc` inline citations; `dedupeSources()` (kind rank primary:0, analysis:1, book:2, news:3); `IndependenceNote`; hero pattern (canopy noise-overlay, editorial h1 + italic ember second line, "short version" aside, 4-cell mono stat strip); sticky nav + `ReadingProgress`; sections from `src/components/deep-dives/shared.tsx` (`Section{id,eyebrow,title,lead,tone:"default"|"warm"|"dark"|"darker",aside}`, `DIVE_CONTAINER`); closing `MethodBlock` ("Not yet verifiable…" → ours-vs-sourced → source cards). `opengraph-image.tsx` clones `ogFrame` from `@/lib/og-template` (venue accent #b85c3a).

**Component adaptability shortlist**:
- Drop-in: `Debate.tsx`, `ReadingProgress.tsx`, shared.tsx, Src/DarkSrc/dedupeSources/MethodBlock, ogFrame, engine formatters + annualDebtService.
- Adapt with new data: `CapitalCliff.tsx` (456 ln; committed/framework/range/**unknown** encodings, anti-summing — fits bond program + deferred maintenance + ESSER cliff), fpdr `PersonalCostCalculator` (**assessed value → your school-levy cost — most transferable**), `AffordabilityCalculator`, rose-quarter `CostEscalation` (bond cost growth; draws not-comparable estimates differently), `GovernanceGrade` (board/supt/ODE/oversight table + letter grade), `RankingMatrix` + `PortfolioQuadrant` (school-by-school: enrollment trend × condition × per-pupil cost), `UtilizationChart`/`WideUtilization` (share-of-enrollment vs share-of-spending; "Not published" honesty + `SourceLinks` helper), `PhaseTimeline`, `FinancingSources` (revenue streams w/ best-for/risk/guardrail), `OwnerDataModel` (what PPS should publish + records plan), `DoctrineCard`, fpdr `ReformSimulator`/`ReformMenu` (closure/consolidation or levy scenarios), city-budget `Priorities`/`GeneralFundBridge`/`MoneyLadder` (all-spending vs discretionary framing; nested `<details>` program ladder; reconciling competing "General Fund" numbers), `FlowDiagram` (Sankey), `PeerCities` (per-capita table with scope strips resisting misuse).
- Build fresh: entire `src/lib/pps-budget/` data layer; PPS budget PDF/CSV ingest modeled on `ingest/budget/` pipeline; ADMw enrollment→revenue engine; school-closure scenario tool; PERS/labor-cost share visual; bond schedule-and-cost tracker; per-pupil-spending-vs-outcomes join.

**City-budget PDF pipeline = closest precedent for a PPS budget build**: `ingest/budget/sources.ts` (per-PDF url/file registry, `runtime-data/budget/fy{FY}` with `pdf/ text/ parsed/ reports/`, committed `checksums.lock.json`, PDFs gitignored) → `fetch-books.ts` → `parse-vol1-funds.ts`/`parse-vol2-programs.ts`/`parse-citywide.ts` (helpers `ingest/budget/lib/{columns,labels,numbers,pages,table}.ts`) → `reconcile.ts` → `build-dataset.ts` → `@/data/budget/fy2026-27.json`. npm scripts `budget:fetch|inspect|parse|verify|build`.

**Registration**: `src/app/(public)/deep-dives/page.tsx` `DIVES` array (11 entries, line 27; `{href,eyebrow,title,blurb,stat,statLabel,icon,available}`); `src/app/sitemap.ts` manual literal per dive (flagship = priority 0.9/weekly).

**Design tokens** (`src/app/globals.css`, Tailwind v4 :root vars): canopy #0f2419, canopy-mid #1a3a2a, canopy-light #24503a, canopy-deep #1c1410, fern #3d7a5a, sage #7fa88e, paper #f7f3ed, paper-warm #faf6f0, parchment #ebe5da, ink #1c1917, ink-light #44403c, ink-muted #78716c, ember #c8956c, ember-bright #e0a870, clay #b85c3a, sage-tint #f3fbf5, clay-tint #fff7f2. Fonts: Bricolage Grotesque display (`.font-editorial`/`.font-editorial-normal`), DM Sans body, JetBrains Mono for eyebrows/stats (`text-[10px] uppercase tracking-[0.18em]`), `rounded-sm` everywhere, `tabular-nums`.

---

# APPENDIX B — PPS public budget document census (Explore agent report, 2026-08-29)

## B0. Critical sourcing traps
1. **Name collision**: `portlandschools.org` / `portlandk12.org` = Portland MAINE; `portlandps.org` = Portland MI; Pittsburgh is also "PPS". Oregon = `pps.net` only. The "$171.8M/$179.3M city-council-approved school budget" figures in search results are Maine. Domain-verify every dollar figure.
2. **URL instability**: PPS migrated to Finalsite. Legacy `pps.net/Page/NNNN` mostly 404/301 (confirmed `/Page/14446`, `/Page/464` dead). Live docs at opaque `https://www.pps.net/fs/resource-manager/view/<uuid>` → redirect to `resources.finalsite.net/images/v<ts>/ppsnet/<hash>/<file>.pdf`. **Archive everything immediately** (Wayback + local).
3. **Bond content split to `bond.pps.net`** (301 confirmed).

## B1. Budget books — FY2006-07 → FY2026-27 (21 consecutive years)
- Master archive: `https://www.pps.net/departments/budget-grant-accounting/annual-budgets`
- Dept main: `https://www.pps.net/departments/budget-grant-accounting/budget-grant-accounting-main`
- Per-year process pages: `/departments/budget-grant-accounting/{2021-22…2026-27}-budget-process-and-documents`; narrative: `https://www.pps.net/about/2026-27-budget-process/2026-27-budget-process`
- Two-volume format from FY2020-21 (Vol1 narrative/summary, Vol2 line-item/fund schedules). FY2010-11 posted as "Amended Budget". Pre-2020 not consistently labeled Adopted vs Proposed.
- Resource-manager UUIDs (prefix `https://www.pps.net/fs/resource-manager/view/`):
  - FY2026-27: Vol1 Adopted `0defe213-e66e-4416-adaf-97add47ed00f`; Vol2 `resources.finalsite.net/images/v1778178861/ppsnet/qkwu0qka1hre112vdb2b/2026-27ProposedBudgetVolume2-Updated20260506.pdf`
  - FY2025-26: Vol1 Adopted `a4e960fb-e321-4297-bd2e-587394969d50`; Vol2 `8a8b05ec-4ba4-4c3f-acbb-fbab70f3b435`
  - FY2024-25: Vol1 `38bf7c33-3420-459b-93f4-09e789fa9ed1`; Vol2 `b6c7ffc2-b268-42c3-8537-2528c27878ed`
  - FY2023-24: Vol1 `27c166f6-c6e0-4ea7-920f-2c2750cbf9e9`; Vol2 `a7f62c8e-563c-44b8-b42d-34fa7471b297`
  - FY2022-23: Vol1 `dfc773b4-7ef2-4ede-8b78-68ce71989e1b`; Vol2 `fc004c0a-4ce1-4381-810e-e7b7f76f8472`
  - FY2021-22: Vol1 `7e4b175c-db12-421e-b034-82bcff61259b`; Vol2 `f3e11cbc-86ba-4e88-8cda-041114995978`
  - FY2020-21: Vol1 `07f9bdbb-f17e-4043-ba96-246f4e14011f`; Vol2 `33458ded-caed-4f72-b869-18d5219fbb3e`
  - Single-vol: 2019-20 `bd231239…`; 2018-19 `53406686…`; 2017-18 `5cc21719…`; 2016-17 `a925b56b…`; 2015-16 `d56bda9f…`; 2014-15 `7ffb9717…`; 2013-14 `af4111de…`; 2012-13 `3b87980a…`; 2011-12 `50a90489…`; 2010-11 `5f55529a…`; 2009-10 `dbdf9dfa…`; 2008-09 `b862fb49…`; 2007-08 `164416d4…`; 2006-07 `d351fbda…` (truncated UUIDs — re-harvest full ids from the archive page during ingest)
- **FY2026-27 process artifacts**: Supt Proposed Budget Message `51380314-e6ee-4177-a0e8-b8d5e17964ee`; Proposed Vol1 `51c9ff15-6f8c-4634-adef-ee98898ffaae` (= `resources.finalsite.net/images/v1777476167/ppsnet/cjslvvkzotwvwencttvx/2026-27ProposedBudget-Volume1.pdf`); Proposed Vol2 `350fb1d2-f3ff-42b5-871f-0cba3319eb86`; **LB-1 Notice of Budget Hearing & Summary** (cleanest one-page fund totals + tax rates) `c3920faf-5257-4af4-81f4-78a245a335c1`; Notice of Budget Committee Mtg `5c455955-32c8-4184-89d7-850210e7cbef`; AMENDED Budget Calendar `80abecd4-dec9-4383-8c9a-5dee678ae7ed` (mid-cycle amendment = finding); Budget Development Preliminary Report Oct 2025 on Google Drive (fragile): `https://drive.google.com/file/d/1VCUus02rJN_pavvGHQw6apIdDsLDmntv/view`
- **FY2025-26 artifacts**: Proposed Vol1 `59d80019-d7da-4cc2-9bbc-0601814d85a6`; Proposed Vol2 `eab55b04-4d27-4b05-85b6-9d8c06ba32a7`; Hearing Notice+Summary `4b439b90-e823-489e-b28c-be4142cd5597`; Committee Notice `e369768f-ad1d-4f41-957f-c817330e311d`; Calendar `4e3efb67-45d6-4095-9692-b302e03a1458`
- **Headlines**: FY2025-26 adopted $2.0B (−$358.8M YoY; TSCC FY26 review), 200+ job cuts. FY2024-25 $2.4B (+$211.8M; TSCC FY25). FY2026-27 ADOPTED June 25-26, 2026 (six-hour meeting, one abstention: Dir. Engelsman): **$2.77B total; $56.3M GF deficit closed** (Oct 2025 preliminary was $50M); **322 FTE eliminated** (proposal was 336: 112 school-based, 101 specialized programs, 74 central office, 48 building supports; 87 student-facing per final); reserves ≈$41M (Chase-Miller amendment to tap them failed — 5% floor); projected FY2027-28 deficit ~$65M; ~$115.5M cut since FY2023-24. ⚠️ $2.0B→$2.77B jump is almost certainly the 2025 bond capital fund landing, not operating growth — verify at fund level; "$2.77B budget" press framing likely misleading.
- Gap: no consolidated multi-year trend doc — build the 10-year series ourselves from 21 PDFs.

## B2. Audited financials (ACFR/CAFR)
- ACFR index: `https://www.pps.net/board/board-of-education/pps-audit-reports/annual-comprehensive-financial-reports` — FY2009→FY2025. UUIDs: FY2025 `341b8773-a285-4c2b-ba40-103391aed82b`; FY2024 `f1364b25-fc32-42e9-af00-4f6e32d5ea73`; FY2023 `9b1d1b65-3a9f-42e7-85cb-d6b021f33930`; FY2022 `751d6f23…`; FY2021 `9af64a93…`; FY2020 `d4be7e6c…`; FY2019 `02bfa97f…`; FY2018 `b22fde3c…`; FY2017 `d8bb02ad…`; FY2016 `f2be44e2…`; FY2015 `343b9ab7…`; FY2014 `a228fd28…`; FY2013 `68c7f4d5…`; FY2012 `4021bee5…`; FY2011 `e7c28788…`; FY2010 `a5c0a3cd…`; FY2009 `7f9db080…`
- Deeper archive: `https://www.pps.net/departments/finance/financial-reports` — ACFRs FYE **2002→2025 (23 years)** + Federal Awards reports 2018–2023 + OMB A-133 single audits 2002–2017.
- Auditor firm NOT named on index pages — identify from each ACFR's Independent Auditor's Report (~pp.13-16); auditor turnover itself a story.
- Oregon Municipal Audit Law filings: `https://secure.sos.state.or.us/muni/public.do`; program `https://sos.oregon.gov/audits/muniaudits/Pages/default.aspx`
- Gaps: no EMMA/continuing-disclosure links; **no monthly/quarterly interim financials published** (see G2).

## B3. TSCC (Tax Supervising & Conservation Commission) — best independent standardized YoY read
- `https://www.tsccmultco.com/` | reviews `/district-reviews/` | `/districts/` | `/publications/` | `/annual-budget-preparation-documentation/`
- PPS budget reviews: FY2025-26 `https://www.tsccmultco.com/wp-content/uploads/Portland-Public-School-District-FY-26-Budget-Review.pdf`; FY2024-25 `.../PPS-A-FY25-Budget-Review.pdf`; FY2023-24 `.../FY24-Portland-Public-Schools-Budget-Review.pdf`; **2025 bond Measure 26-259 review** `.../PPS-Bond-Levy-Review-May-2025.pdf`
- Hearing-minutes series exists (pattern: `.../28-City-of-Portland-FY26-Budget-Hearing-Minutes-FINAL.pdf`) — enumerate `/wp-content/uploads/` for the PPS ones.
- Annual Reports (all districts, comparative): 2011-12→2024-25 online, split General Information + Budget Summaries (e.g. `.../2024-25-General-Information-Section-Annual-Report.pdf`, `.../2024-25-Budget-Summaries-Section-Annual-Report.pdf`); FY2025-26 TOC `.../1_25-26-Table-of-Contents-About-TSCC.pdf`. **1921→2010-11 on request only.**
- Gaps: no per-district archive index; FY2026-27 PPS review/certification not yet located (likely summer 2026 — check or request).

## B4. CBRC (Community Budget Review Committee)
- Main: `https://www.pps.net/departments/budget-grant-accounting/cbrc-community-budget-review-committee`; **archive**: `…/archived-materials`
- Holdings: 2025-26 Proposed Budget Review + Board presentation; 2024-25 same + Local Option Levy Review; 2023-24 same + **Nov 14 2023 Co-Chair Letter to Board**; 2022-23; 2021-22 + **May 21 2021 letter to Oregon Joint Ways & Means**. Agendas/minutes/YouTube 2019-20→2024-25.
- Legacy live PDFs: `https://www.pps.net/cms/lib/OR01913224/Centricity/Domain/214/CBRC%20Local%20Option%20Review%202020-21.pdf`; 2025 levy review `https://resources.finalsite.net/images/v1751568439/ppsnet/ejrvlqztarrafgfxwcvn/finallocaloptionreview.pdf`
- **FY2026-27 CBRC report is load-bearing** (per OPB 2026-05-13, WW 2026-05-14): "unrealistically optimistic assumptions" on revenues/expenditures; flagged third-party contract growth; "students may be receiving meaningfully fewer instructional resources than the district's substantial per-pupil spending would imply." **Report itself not on archive page — likely BoardBook-only. Chase it.**
- Gap: archive page doesn't expose stable per-doc URLs (harvest hrefs); pre-2019-20 reports not posted.

## B5. ODE finance data
- **Fiscal Transparency portal (workhorse)**: `https://www.oregon.gov/ode/schools-and-districts/FiscalTransparency/Pages/FiscalTransparencyHome.aspx` — NOE per ADMr by district, School-Level Expenditure Reports (fed vs state/local), District Revenue & Expenditure Dashboard, Federal Funding by District, Budget-to-Actuals, Audit Findings. Coverage 2017-18→2023-24 (~2-yr lag; 2023-24 NOE updated 2025-08-26).
- Finance home: `https://www.oregon.gov/ode/schools-and-districts/finance/Pages/default.aspx`
- Program Budgeting & Accounting Manual (chart of accounts, needed to reconcile function/object codes): `/ode/schools-and-districts/FiscalTransparency/Pages/Program-Budgeting-and-Accounting-Manual.aspx`
- **SSF/ADMw**: `https://www.oregon.gov/ode/schools-and-districts/grants/pages/school-district-and-esd-payment-statements.aspx` — District Estimates + ADMw Breakout spreadsheets, multiple revisions/yr (2026-27 est. dated 6/15/26; 2025-26 dated 5/1/26). Formula ORS 327.013; charter ORS 338.155. Cite revision dates.
- At-A-Glance profiles: `https://www.oregon.gov/ode/schools-and-districts/reportcards/reportcards/pages/default.aspx`; report tool `https://www.ode.state.or.us/data/reportcard/reports.aspx`; PPS mirror `https://www.pps.net/departments/dataaccountability/data-and-accountability/accountability/ode-report-cards`; 2024-25 release `https://content.govdelivery.com/accounts/ORED/bulletins/3fc2808`
- SIA allocations 25-27: `https://www.oregon.gov/ode/StudentSuccess/Documents/25-27%20SIA%20Allocation.pdf`
- Data hub: `https://www.oregon.gov/ode/reports-and-data/dataresources/Pages/default.aspx`

## B6. Oregon Secretary of State audits
- **Audit 2019-01 (Jan 2019), joint ODE+PPS**: `https://sos.oregon.gov/audits/Documents/2019-01.pdf` — findings: budget has "limited program detail, few performance measures, no benchmarking against other districts, little detail on changes in staffing and spending over time"; weak contract oversight; P-card issues. 26 recommendations, all accepted.
- 2022 follow-up + district response: PPS index `https://www.pps.net/board/board-of-education/pps-audit-reports/secretary-of-state-sos-audit-services` (report `f1b59ce8-400f-4784-aabb-812676ac0ab3`; follow-up `afc593a0-112e-442a-815e-751a32b8197c`); response page `/board/board-of-education/pps-audit-reports/districts-response-to-the-sos-recommendation-follow-up-report`
- Legislative presentation: `https://apps.oregonlegislature.gov/liz/2019R1/Downloads/CommitteeMeetingDocument/201043`
- **No SoS performance audit of PPS since 2019** (G3).

## B7. Bond program (2012 / 2017 / 2020 / 2025)
- Sites: `https://bond.pps.net/`, `/about`, `/office-of-school-modernization`; 2025 bond `https://www.pps.net/domain/62`
- **Annual performance audits (Sjoberg Evashenk)**: index `https://www.pps.net/board/board-of-education/pps-audit-reports/external-bond-performance-audits`. UUIDs: 2017/2020 Yr6(2025) `360be54d-7d9e-4919-9bbc-50a519481c2c`; Yr5(2024) `ae95a8fd-3b93-46c2-af67-4e6e55a92b43`; Yr4(2023) `69866af5-9563-4541-ba81-e11df7a40587`; 2017 Yr3(2021) `6e2cfcdb-75af-44d5-9968-eba5a27fe06f`; Yr2(2020) `a81110d7-84a8-4826-b61b-55556808286f`; Yr1(2019) Ph2 `7b20b9bf-f64e-4c72-9221-587862d990f5`, Ph1 `3bed472c-29a8-4aa8-a084-283f16a34610`; 2012 bond audits 4of4(2017) `b8dd42fe-3143-47ba-9959-614de8d9b432`, 3of4(2016) `d2b6a123-3d81-41a4-9165-308d0d835ad4`, 2of4(2015) `c4858190-d88c-4df1-8bc8-1ba726a5afe6`, 1of4(2014) `f79b1446-13a7-477f-8ba1-bce0abd64e61`. **Audit-year-2022 report missing from index** though auditor's site confirms it exists: `https://secteam.com/2023/02/15/portland-public-schools-annual-bond-performance-audit-fiscal-year-2021-2022/` (G5 — records request).
- **BAC (Bond Accountability Committee)**: `https://bond.pps.net/about/oversight-and-accountability/bond-accountability-committee-bac` + profiles `…/community-oversight/bond-accountability-committee-profiles`. Chair Greg DiLoreto (term to 12/2026); quarterly; agendas/presentations/minutes/video/quarterly project status + BAC quarterly reports; charter posted.
- **2025 bond Measure 26-259**: $1.83B GO, approved 2025-05-20, rate held ~$2.50/$1,000 AV; rebuilds Cleveland, Ida B. Wells, Jefferson + seismic/repairs. `https://multco.us/info/ballot-measure-26-259-portland-school-district-1j`; `https://multco.us/info/notice-measure-referral-portland-school-district-may-2025`; `https://ballotpedia.org/Portland_School_District_1J,_Oregon,_Measure_26-259,_Facilities_Bond_Measure_(May_2025)`; LWV `https://lwvpdx.org/wp-content/uploads/2025/04/2025-Special-Election_-MultCo-Ballot-Measure-26-259-Portland-Public-Schools-bond-250411-version-.pdf`; Cascade Policy critique `https://cascadepolicy.org/education/pps-bond-m26-259/`
- **Overruns**: 2017 bond $790M (Benson, Lincoln, McDaniel, Kellogg, MPG); BAC projected **$190M over** (KATU `https://katu.com/news/local/report-shows-portland-public-schools-is-200-million-overbudget-for-work-within-2017-bond`). **Benson: ~$410M vs $269M budgeted (+$141M), litigation w/ Andersen Construction** `https://www.constructionowners.com/news/pps-andersen-clash-over-benson-high-costs`. 2020 bond funds redirected to finish Benson.
- **⚠️ G1: no Official Statements/continuing disclosure anywhere on PPS sites — MSRB EMMA only (`https://emma.msrb.org`, search "Portland School District 1J"/"Multnomah County School District 1J"). Also TSCC Debt Registry for Multnomah County governments.**

## B8. Local option levy & Arts Tax
- Levy pages: 2024 renewal `https://www.pps.net/about/portland-public-schools-information/proposed-2024-local-option-levy-renewal` (legacy `/Page/21879`); 2019 archive `/Page/14142`
- History: Measure 26-2 `https://multco.us/info/portland-school-district-measure-no-26-2`; 2014 approval (~825 teaching positions/yr); 2019 renewal Measure 26-207, 77% yes, $1.99/$1,000 `https://multco.us/info/measure-26-207-november-2019-special-election`; 2024 renewal Measure 26-246, 5 yrs @ $1.99, est. $101.5M yr1, ~660 positions `https://multco.us/info/ballot-measure-26-246-portland-public-school-district`; `https://ballotpedia.org/Portland_Public_School_District,_Oregon,_Measure_26-246,_Property_Tax_Levy_Renewal_(May_2021)` (**slug says 2021, titled May 2024 — verify date**)
- CBRC 2025 levy review: **$104.6M received FY2024-25 (as of 4/1/25); avg teacher cost $141,000; 744 positions** (vs campaign ~660 — tension) — `https://resources.finalsite.net/images/v1751568439/ppsnet/ejrvlqztarrafgfxwcvn/finallocaloptionreview.pdf`
- Campaign (advocacy): `https://renewteacherslevy.com/about-the-levy/`
- **Arts Tax** (City, ~$12M/yr, arts/music teachers in 6 districts): `https://www.portland.gov/arts/arts-access-fund`; mechanics `/arts/arts-access-fund/how-does-arts-access-fund-work`; recipients `/arts/arts-access-fund/schools-and-organizations-receive-arts-tax-funds`; **numbers page** `https://www.portland.gov/revenue/arts-tax-disbursements`; oversight report FY23-24 `https://www.portland.gov/arts/arts-access-fund/documents/draft-arts-access-fund-oversight-report-fy23-24/download`; **City Auditor audit 2026-03-18** `https://www.portland.gov/auditor/audit-services/news/2026/3/18/arts-tax-city-needs-make-improvements-deliver-voter-approved` + OPB `https://www.opb.org/article/2026/03/18/poor-management-plagues-portland-arts-tax-audit-finds/`, `https://www.opb.org/article/2026/03/26/city-of-portland-how-arts-tax-is-spent-each-year/`. Numbers: $8.1M to districts 2025-26; avg ~$7.2M/yr; 1 FTE per 500 K-5 students; K-5 arts FTE 31→111 (2023-24); $33M+ to arts orgs since 2012.

## B9. Labor contracts & compensation
- Hub: `https://www.pps.net/departments/human-resources/employee-and-labor-relations` (per-union pages; legacy `/pps.net/pat`)
- Current CBAs (UUIDs): PAT 2023-2026 `70c9aeed-2057-4603-bbef-d0f72360dbee` (extended to 6/30/2027, 2% COLA 1/1/27); PAT Subs 2024-2026 `63066ef8-c9b5-4903-8087-15eef6e811c1`; PFSP 2023-2026 `4ba7c362-5990-4ffb-ab37-b8dd0965c7fc`; SEIU 2023-2026 `95a786dc-43d3-4202-93a6-82e3aa…` (re-verify: `95a786dc-43d3-4202-93a6-82e3a…` — harvest exact); DCU 2026-2027 `56e467d9-f57d-4eae-9fc6-a1032ae6fb77`; ATU 2025-2028 `572b67d1-e95e-4d24-a3b0-fb6a5bfe6d11`
- Historic PAT contracts posted: 2006-08, 2008-11, 2013-16, 2016-19, 2019-20, 2020-22, 2022-23 (**2011-13 missing** — G9). MOUs: Extended Responsibility (Nov 2025), Article 18 Transfers (June 2026), Restorative Justice TA (2/19/25), staffing/health-safety MOAs.
- Salary schedules: `https://www.pps.net/departments/human-resources/classification-and-compensation/salary-schedules`
- Union side: `https://www.pdxteachers.org/know_your_contract`
- **2023 strike** (Nov 1-26, 2023, ~4 wks, 40k+ students): settlement 13.8% cumulative COLA/3yrs + class-size committees + planning time; district-stated cost **~$175M/3yrs** (press-only, no posted cost model — G9). `https://www.opb.org/article/2023/11/29/portland-teachers-get-from-strike-faq/`; `https://www.opb.org/article/2023/11/26/portland-public-schools-teachers-strike/`; `https://www.opb.org/article/2024/11/01/portland-public-schools-strike-anniversary/`; `https://en.wikipedia.org/wiki/2023_Portland_Association_of_Teachers_strike`
- May 2026 one-year CBA: `https://www.kptv.com/2026/05/27/pps-teachers-union-agree-1-year-collective-bargaining-agreement/`. Feb 2026 furloughs-or-layoffs offer (~$10M mid-year gap): WW 2026-02-27.
- PERS employer rates: not on PPS site — Oregon PERS employer rate tables.

## B10. Enrollment
- **PSU Population Research Center forecasts (authoritative, annual)**: `https://pdxscholar.library.pdx.edu/enrollmentforecasts/` — PPS items incl. `/enrollmentforecasts/151/` (2024-25→2033-34), `/150/` (2022-23→2036-37), `/78/` (2012-13→2025-26). School-by-school forecasts under multiple scenarios.
- PPS: `https://www.pps.net/departments/research-assessment-and-accountability/analytics` (Oct enrollment by school/grade/program/ethnicity) + `/departments/research-assessment-and-accountability/data-and-reports/enrollment-projections`
- Third-party closure-debate dashboard (unofficial, lead generator): `https://ppsdata.info/` — per-school enrollment, utilization, seismic, condition, bond investment, ratios, DLI strands.
- Numbers: 2025-26 ≈ **42,622**; PSU projects **36,763 by 2035-36 (−14%)**; fell 200+ fall'24→fall'25; K capture ~71% (fall 2024); 2023-24: 44,771 across 86 schools. **Consolidation process began fall 2026 targeting closure of up to 10 elementary/middle schools.**

## B11. Comparative finance
- NCES CCD PPS LEA 4110040: `https://nces.ed.gov/ccd/districtsearch/district_detail.asp?Search=2&details=1&ID2=4110040&DistrictID=4110040`
- F-33 finance survey: `https://nces.ed.gov/ccd/f33agency.asp`; SY2022-23 doc `https://ies.ed.gov/use-work/resource-library/data/data-file/documentation-nces-common-core-data-school-district-finance-survey-f-33-school-year-2022-23-fiscal`
- Context tables: `https://nces.ed.gov/pubs2024/2024303.pdf`, `https://nces.ed.gov/pubs2024//2024309.pdf`, `https://nces.ed.gov/pubs2020/2020303.pdf`
- In-state comparisons: prefer ODE NOE-per-ADMr (same chart of accounts). Never mix F-33 and NOE in one chart without a footnote.
- Sanity check only: ~$18,903/student, revenue ~$1.03B (U.S. News 2023-24, secondary).

## B12. Board materials
- **BoardBook Premier org 915 (system of record)**: `https://meetings.boardbook.org/public/Organization/915`; audit-committee view `…?u=1458&show=Meetings`; packet PDF form `https://meetings.boardbook.org/Documents/DownloadPDF/<uuid>?org=915`
- Board main `https://www.pps.net/board/board-of-education/board-main-page`; **Public Notices** `https://www.pps.net/board/board-of-education/publicnotices`; video YouTube `@ppsboardofeducation`
- Budget adoption/appropriation resolutions + supplemental budgets live in BoardBook only (weak search, no stable deep links) — plan month-by-month packet harvest FY2023-24→present (G12).

## B13. Internal audit / audit committee
- **OIPA (est. 2019)**: `https://www.pps.net/board/board-of-education/pps-audit-reports/pps-office-of-internal-performance-auditors-oipa` — 2020 Contracts; 2020 ACH Pt1 (no findings); 2021 PCard; 2021 Health & Safety (no findings); 2022 ACH Pt2 (no findings); 2023 Hardship Petition Transfer; 2024 Student Body Funds; 2026 Multilingual Learners/ELD ETA Fall 2026 (unissued). **Pre-OIPA internal audits ~1998-2016 also posted** incl. administrative spending — relevant to central-office growth question.
- Audit Committee: `https://www.pps.net/board/board-of-education/board-committees/audit-committee-2024-25` (chair Dir. Patte Sullivan; DePass, La Forte; community: Zavitkovski, Samuels) — Work Plan, Charter, District Performance Auditing Policy 1.0.040-P. Page year-stamped 2024-25; verify currency.
- Hub: `https://www.pps.net/board/board-of-education/pps-audit-reports`
- Finding (G4): ~1 report/yr, several no-findings, nothing on budget accuracy/forecasting/position control/central-office cost.

## B14. Load-bearing news citations
1. WW 2025-10-29 first $50M FY27 shortfall: `https://www.wweek.com/news/schools/2025/10/29/pps-forecasts-preliminary-50-million-budget-shortfall-for-202627-fiscal-year/`
2. OPB 2026-02-24 mid-year cuts "just-discovered shortages": `https://www.opb.org/article/2026/02/24/portland-public-schools-mid-year-cuts-shortages/`
3. WW 2026-02-27 furloughs-or-layoffs ~$10M: `https://www.wweek.com/news/schools/2026/02/27/pps-offers-unions-furloughs-or-layoffs-to-patch-10-million-mid-year-budget-gap/`
4. WW 2026-03-10 mid-year deficit growing: `https://www.wweek.com/news/schools/2026/03/10/pps-scrambles-to-patch-growing-mid-year-deficit/`
5. OPB 2026-03-13 hole deepens: `https://www.opb.org/article/2026/03/13/portland-public-schools-facing-steep-cuts-budget-hole/`
6. **WW 2026-04-28 $56M deficit, 336 layoffs; admin grew 88% (2000-2019) vs 9% teachers, 8% students**: `https://www.wweek.com/news/schools/2026/04/28/portland-public-schools-faces-56-million-budget-deficit-as-superintendent-proposes-336-layoffs/`
7. OPB 2026-04-29 $2.77B proposed: `https://www.opb.org/article/2026/04/29/portland-public-schools-budget-gap-deep-cuts/`
8. **OPB 2026-05-13 purchased services +61.9% ($269.9M→$437.0M, ~2/3 capital)**: `https://www.opb.org/article/2026/05/13/portland-public-schools-spending-third-party-contracts-balloons-proposed-budget/`
9. WW 2026-05-14 CBRC recommendations: `https://www.wweek.com/news/schools/2026/05/14/community-budget-committee-presents-pps-with-a-mountain-of-suggestions/`
10. **WW 2026-05-06 one-time-money reckoning (ESSER)**: `https://www.wweek.com/news/schools/2026/05/06/pps-spent-years-looking-to-one-time-dollars-for-budget-relief-it-now-faces-a-reckoning/`
11. OPB 2026-06-25 board passes $2.77B, 322 FTE, $41M reserves: `https://www.opb.org/article/2026/06/25/portland-public-schools-budget-painful-layoffs/`
12. Axios 2026-04-29 `https://www.axios.com/local/portland/2026/04/29/portland-public-schools-budget-deficit-job-cuts`; KOIN adoption `https://www.koin.com/news/portland/pps-board-adopts-new-budget-2026-27-school-year-layoffs/`
13-16. Bonds: KATU $190M over (link in B7); OPB 2025-05-11 bond explainer `https://www.opb.org/article/2025/05/11/oregon-education-portland-public-schools-2025-bond-budget-building-improvements/`; WW 2025-05-20 `https://www.wweek.com/news/schools/2025/05/20/voters-on-track-to-pass-183-billion-portland-public-schools-bond/`; Benson litigation (B7)
17-19. Enrollment: WW 2026-08-24 `https://www.wweek.com/news/schools/2026/08/24/latest-pps-enrollment-forecasts-indicate-trouble-is-coming-for-its-upper-grades/`; WW 2025-08-07 `/2025/08/07/enrollment-forecasts-for-portland-public-schools-project-continued-decline/`; WW 2025-08-14 `/2025/08/14/enrollment-projections-for-portland-schools-sound-wider-alarms/`; WW 2025-01-23 `/2025/01/23/preliminary-enrollment-forecasts-show-steeper-decline-to-come-for-portland-public-schools/`; WW 2024-10-24 `https://www.wweek.com/news/schools/2024/10/24/portland-public-schools-enrollment-declines-again-slightly-more-steeply-than-projected/`
20. Audits: OPB 2019 `https://www.opb.org/news/article/state-audit-problems-portland-public-schools-oregon-department-of-education/`; 1-yr-later `https://www.opb.org/news/article/portland-public-schools-audit-1-year-later/`; 2022 follow-up `https://www.opb.org/article/2022/03/09/portland-public-schools-audit-inequity-oregon-secretary-of-state/`
- Adversarial/advocacy: Cascade Policy TSCC testimony `https://cascadepolicy.org/education/testimony-testimony-to-tax-supervising-and-conservation-commission-on-pps-budget/`; LWV bond analysis (B7).

## B15. Gaps & findings (the "what we can't know" backbone)
| # | Gap | Significance |
|---|---|---|
| G1 | No bond Official Statements/continuing disclosure on PPS sites — EMMA only | Debt service, ratings, risk disclosures invisible via PPS channels |
| G2 | No public monthly/quarterly interim financials | Explains "just discovered" $10M mid-year shortfall (OPB 2026-02-24). Strong story |
| G3 | No SoS performance audit since 2019-01 | 7-year state oversight gap during deficit era |
| G4 | OIPA output minimal; nothing on budgeting/forecasting/position control/central office | $2.7B district, near-silent internal audit |
| G5 | Bond audit for audit-year 2022 missing from PPS index (exists per auditor site) | Records request |
| G6 | FY2026-27 CBRC report not on archive page | Most critical independent doc of cycle may be BoardBook-only |
| G7 | TSCC FY26-27 PPS review not yet located; pre-2011-12 annual reports offline | Long-run trend needs records request |
| G8 | No budget-in-brief/multi-year trend doc | Exact deficiency SoS 2019-01 named — **still unremediated 7 years later. Testable, publishable claim** |
| G9 | No published cost model for 2023 PAT settlement ($175M press-only); PAT 2011-13 contract missing | |
| G10 | ODE comparative finance lags ~2 yrs (thru 2023-24) | No peer comparison for deficit years yet |
| G11 | Legacy URLs dying; docs behind opaque UUIDs | Snapshot to Wayback + local now |
| G12 | No index of budget amendments/supplementals | Reconstruct from BoardBook |

## B16. Headline numbers bank
| Figure | Value | Source | Year |
|---|---|---|---|
| Adopted budget | $2.77B | OPB 2026-06-25 | FY2026-27 |
| Adopted budget | $2.0B (−$358.8M) | TSCC FY26 review | FY2025-26 |
| Adopted budget | $2.4B (+$211.8M) | TSCC FY25 review | FY2024-25 |
| Op revenue: prop tax + intergovt | ~$1.1B = 65.3% | TSCC FY24 review | FY2023-24 |
| GF deficit closed | $56.3M (from $50M prelim) | WW 04-28 / 10-29 | FY2026-27 |
| FTE cut | 322 adopted (336 proposed: 112 school, 101 specialized, 74 central, 48 building) | OPB/WW | FY2026-27 |
| Cumulative cuts since FY24 | ~$115.5M | WW 2026-04-28 | 2023-26 |
| Next deficit | ~$65M | WW 2026-04-28 | FY2027-28 |
| Reserves | $41M, 5% floor | OPB 2026-06-25 | FY2026-27 |
| Purchased services | $269.9M→$437.0M (+61.9%), ~2/3 capital | OPB 2026-05-13 | FY27 proposed |
| Enrollment | 42,622; forecast 36,763 by 2035-36 (−14%) | PSU PRC via WW | 2025-26 |
| K capture | ~71% | PSU PRC | fall 2024 |
| Levy | $1.99/$1,000; $104.6M received; 744 teachers @ avg $141,000 | CBRC 2025 levy review | FY2024-25 |
| 2025 bond | $1.83B @ ~$2.50/$1,000; Cleveland/IBW/Jefferson | M26-259 / multco.us | May 2025 |
| 2017 bond | $790M; BAC projected $190M over | KATU/BAC | 2017-24 |
| Benson | ~$410M vs $269M budgeted (+$141M), litigation | constructionowners.com | 2024 |
| PAT settlement | ~$175M/3yrs; 13.8% cumulative COLA | OPB | Nov 2023 |
| ESSER | ~$115M total (I $7.5M, II $30M, III $70M); $36.3M left 2023-24 | pps.net ESSER page | 2020-24 |
| Arts Tax | $8.1M to districts 2025-26; ~$7.2M/yr avg; K-5 FTE 31→111 | portland.gov | 2012-26 |
| Admin growth | +88% admin (2000-2019) vs +9% teachers, +8% students | WW 2026-04-28 | 2000-19 |
| Per-pupil (rough) | ~$18,903 | U.S. News (secondary) | 2023-24 |

**Arithmetic tensions to chase**: (a) $2.0B→$2.77B while cutting $56M — reconcile at fund level (2025 bond capital fund likely; press "$2.77B budget" framing then misleading). (b) Levy teacher counts: campaign ~660 vs CBRC 744.

---

# APPENDIX C — Governance & funding rules (Explore agent report, 2026-08-29)

⚠️ Same Maine contamination warning as Appendix B: `portlandschools.org`/`portlandk12.org` = Portland MAINE (their "$179.3M FY2027 voter-approved budget" is not ours; Oregon school budgets never go to referendum). Oregon PPS = `pps.net`.

## C1. Oregon Local Budget Law (ORS ch. 294) — procedural spine
- Sequence: budget officer prepares → notice → budget committee ≥1 public meeting → **committee approves budget + sets levy** → publish hearing notice + summary → governing body public hearing → **adopt, appropriate, impose/categorize taxes by June 30** → certify to assessor by July 15. `https://www.oregon.gov/dor/programs/property/pages/local-budget.aspx`
- Local Budgeting Manual 150-504-420: `https://www.oregon.gov/dor/programs/property/Documents/Local%20Budgeting%20Manual,%20150-504-420.pdf`; companion 150-504-400; OSBA Budget Committee Handbook (2024): `https://osba.enviseams.com/docs/default-source/default-document-library/2024_budgetcommitteehandbook_fillable.pdf`
- **ORS 294.414** (general rule): committee = governing body + equal number of appointed electors (unpaid, 3-yr staggered): `https://oregon.public.law/statutes/ors_294.414`
- **ORS 294.423 — THE PPS EXCEPTION (major finding)**: in a municipal corporation >200,000 pop. in a TSCC county, **the governing body IS the budget committee** unless it opts to create one. So the **7 elected board members are the whole budget committee — no citizen half**. PPS confirms on its annual-budgets page. **PPS residents have no statutory seat at the budget table**; CBRC is the voluntary advisory substitute. `https://oregon.public.law/statutes/ors_294.423`; OAR 581-024-0262 `https://oregon.public.law/rules/oar_581-024-0262`
- **Approved vs Adopted**: Approved = committee's budget + levy → filed with TSCC. Adopted = board resolution post-TSCC-hearing (appropriation + tax resolutions). **ORS 294.456**: pre-adoption changes capped at greater of $5,000 or 10% per fund without republishing; can't tax above published amount. Appropriations = legal ceilings; school districts appropriate **by major function** (instruction, support services, enterprise/community, facilities acquisition, debt service, transfers, contingency). Overexpenditure unlawful. `https://oregon.public.law/statutes/ors_294.456`
- Contingency only in operating funds: OAR 150-294-0430 `https://oregon.public.law/rules/oar_150-294-0430`
- **Supplemental budgets**: ORS 294.471 (occurrences not known at adoption; cannot raise property tax) `https://oregon.public.law/statutes/ors_294.471`; **ORS 294.473**: fund change >10% requires public hearing, <10% adopted at regular meeting `https://oregon.public.law/statutes/ors_294.473`; OAR 150-294-0550 `https://oregon.public.law/rules/oar_150-294-0550`. Transfers >15% of a fund's appropriation require supplemental.
- **TSCC certification** (Multnomah County extra step): TSCC created 1919; 5 Governor-appointed commissioners, 2 staff, oversees 36 of 43 districts. **ORS 294.635**: file approved budget with TSCC by **May 15** (parallel columns: 2 prior actuals, current estimate, proposed). TSCC holds its own public hearing, issues certification letter (recommendations/objections advisory, but certification precedes adoption). `https://www.tsccmultco.com/about-tscc/`; `https://oregon.public.law/statutes/ors_294.635`
- TSCC FY26 compliance checklist on PPS: all "Yes"; certification letter had no recommendations/objections (FY26 review pp.17-18).
- FY27 timing: TSCC hearing June 23, 2026, board hearing + adoption same day (~6-hr session).
- **Debt limit**: ORS 328.245 caps school GO debt at **7.95% of RMV**. PPS FY2025: RMV $151.42B → capacity $12.04B; outstanding subject to limit $1.269B = **10.54% of capacity used** (TSCC M26-259 review p.6).

## C2. State School Fund & equalization — why local taxes don't help PPS
Primary: **LRO Research Report #5-24 "K-12 School Funding Equalization" (Aug 2024)**: `https://www.oregonlegislature.gov/lro/Documents/K-12%20and%20ESD%20Finance%20RR%20August%2024%20Final.pdf`
- Formula adopted **1991**, structurally unchanged. Identities: District Formula Revenue = SSF Grant + Local Revenue = GP Grant + Transportation + High Cost Disabilities. **SSF grant = formula revenue − local revenue** ("if local revenues are high, state aid is low").
- ~1% SSF carve-outs off the top; remainder split **95.5% districts / 4.5% ESDs**. State share of formula revenue 66.5% (2023-25). Federal ≈10% of operating. Payments: 16⅔% Jul 15, 8⅓% monthly Aug-May.
- **GP Grant = ADMw × [($4,500 + Teacher Experience Adj) × Balance Ratio]**; balance ratio ~188% (2019-20) → ~$8,460/ADMw actual. Teacher Experience Adj = $25 × (district avg − statewide avg). GP ≈ 95%+ of formula revenue.
- **ADMw weights** (ORS 327.013 `https://oregon.public.law/statutes/ors_327.013`): SPED +1.00 (**capped 11% of ADM**); ELL +0.50; pregnant/parenting +1.00; poverty +0.25 (group count); neglected/delinquent +0.25; foster +0.25; half-day K −0.50; K-8-only district −0.10; union high +0.20; small/remote small school varies (ORS 327.077; >8mi rule; 1995/2009 grandfathering). Max +2.0/student excl. group counts. **"Extended ADMw" = higher of current or prior year.** YCEP 2.0 / JDEP 1.5. **NO "pensioner" weight exists — drop from framing** (confusion with PERS side accounts).
- Transportation Grant: 90%/80%/70% tiers; PPS almost certainly 70%. High Cost Disabilities: costs >$30k/student, statewide cap **$55M/yr since 2020-21**, prorated; the $55M comes out of the GP pool.
- **Local revenue subtraction (ORS 327.011** `https://oregon.public.law/statutes/ors_327.011`): offsets include property taxes received (~95%), **Common School Fund**, county school fund, state forestland revenue, in-lieu payments, supplantable federal funds, **uncertified tax capacity** (charged as if full permanent rate levied), prior-yr ESD distributions. LRO: equalization "overrides whatever formula may exist" for these streams. HB 2009 (2023) enterprise-zone school support fee counts as local revenue from 2027-28.
- **OUTSIDE the formula (the only real levers)**: **local option levy** — excluded up to least of (i) actual receipts, (ii) 25% of GP+Transp+HCD grants, (iii) **$2,000/extended ADMw escalating 3%/yr** (above cap = offset dollar-for-dollar); **Gap Tax** (2009 legislature; TSCC FY26 p.7); **GO bond debt service** (also outside Measure 5 caps); **construction excise tax** (ORS 320.170/320.176: $1.00/sqft res, $0.50/sqft non-res cap $25k/project, ENR-indexed — PPS's adopted rate not located); gifts/fees; non-supplantable federal (Title I, IDEA, ESSER); **SSA/SIA** (CAT-funded, ADMw with poverty weights DOUBLED); **High School Success/M98**; City **Arts Tax** (PPS budgeted $5.3M FY26; `https://www.portland.gov/code/5/73`); County SUN schools + **Preschool for All** (PPS hosts 120 of first 507 seats, `https://multco.us/info/about-preschool-all`). Common School Fund is IN/offset (PPS $6.6M 2025; statewide $76.8M: `https://www.oregon.gov/dsl/Newsroom%20Documents/NewsRelease_CommonSchoolFund_2025Distribution.pdf`, `https://www.oregon.gov/dsl/Documents/2025_CommonSchoolFund_DistrictDistributions.pdf`).
- **⚠️ Cap headroom question (potentially significant story)**: PPS LO collections $109.2M budgeted FY26 vs ~52k ADMw → flat $2,000/ADMw cap ≈ $104-107M (3% escalator raises it). If PPS exceeds the exclusion ceiling, marginal levy dollars are redistributed statewide. **Get ODE's computed exclusion limit for Portland SD 1J.** (Older LRO #4-04 "$750/ADMw or 15%" is SUPERSEDED: `https://www.oregonlegislature.gov/lro/Documents/rr4_4school_propertytax.pdf`)
- Carve-outs list (LRO 5-24 pp.17-18): Educator Advancement Fund $42.9M/23-25; ELL Program $12.5M/bi; Healthy School Facilities $2M + Office ≤$6M; Safety ≤$3M; Small School Supplement $2.5M/yr; state SPED programs; At-Risk Youth (Military Dept); TAG ≤$350k; speech ≤$150k; gr-10 testing $968k; Virtual SD $1.6M; **local option equalization grants ORS 327.339 — PPS NOT eligible** (high AV); charter closure fund.

## C3. Property tax mechanics
- **Measure 5 (1990)**: education capped $5.00/$1,000 **RMV**; **compression hits local option FIRST (to zero)**, then permanent rate proportionately; **GO bonds exempt**. `https://www.orcities.org/application/files/2216/8685/9599/FAQonMeasures5and_50-updated5-23.pdf`; `https://multco.us/info/how-your-property-taxes-are-calculated`
- **Measure 50 (1997)**: AV = 1995-96 RMV −10%, growth capped 3%/yr; permanent rates fixed. `https://www.oregon.gov/DOR/programs/gov-research/Documents/303-405-1.pdf`
- Gap = ($5×RMV) − (school-sector permanent rates×AV); local option lives in the gap; legislative approval required; operating LO ≤5yrs, capital ≤10yrs (LRO #4-04 pp.2-3). **When RMV falls, the gap shrinks and compression spikes** — PPS RMV fell $157.078B (2022-23) → $151.420B (2024-25) while AV rose $62.494B → $71.052B.
- **Actual PPS rates** (TSCC M26-259 review p.3; FY26 review p.3): permanent **4.7743** + Gap Tax **0.5038** = "Operations" **5.2781**; Local Option **1.9900**; Bond 2.3335 (21-22) → 2.4724 (25-26 proj); TOTAL 9.6016 → 9.7405 /$1,000 AV. AV $59.615B (21-22) → $71.052B (24-25); RMV $147.264B → $151.420B.
- **Compression loss: −$24.82M (21-22) → −$42.56M (24-25), +72% in 3 years; ~88% borne by the local option levy** (TSCC FY24 review). **The renewed $1.99 levy does not deliver $1.99 — arguably the most under-covered structural fact in PPS finance.**
- ADMr 44,748→43,302; ADMw 53,500→52,114; FTE 6,274→6,018 over same span.
- Homeowner at $300k AV: ≈$2,880 (21-22) → $2,922 (25-26 proj).
- **Levy history**: passed 2011, 2014, 2019 (M26-207, 77% yes), **2024 (M26-246, May 21, 2024: $1.99, 5 yrs from 2025, ~660 positions; est. $101.5M→$112.5M/yr)** `https://multco.us/info/ballot-measure-26-246-portland-public-school-district`. Actual collections lag (compression): FY23 $109.2M → FY24 $106.9M → FY25 rev $104.6M → FY26 appr $109.2M (TSCC FY26 p.18). Prior review: M26-215 Nov 2020 `https://www.tsccmultco.com/wp-content/uploads/26-215-PPS-Nov-2020-Property-Tax-Measure-Review.pdf`
- **GO bonds**: Nov 2012 $482M (66%); May 2017 $790M (66%); Nov 2020 $1.2B (75%); **May 2025 $1.83B M26-259**. 2025 composition: rebuilds $1.15B (Jefferson, Cleveland, Ida B. Wells + elem/middle); ed materials/tech $311M (tech $176M, curriculum $56M, athletics $79M); updates/repairs $200M; admin $83.05M + contingency $83.05M = $1,827.1M. Combined bond rate target ≤**$2.50/$1,000** (since 2017); new-bond portion ~$1.17 (Piper Sandler). **Outstanding debt ≈$1.7B (6/20/2025); FY26 debt service $272.7M (65.6% GO).** BAC + annual perf audits; auditors flagged **Center for Black Student Excellence (2020 bond) behind schedule**.

## C4. Who decides inside PPS
- **Board**: 7 members, elected district-wide with zone residency, 4-yr terms, UNPAID. Current: Z1 Christy Splitt (25-27); Z2 **Michelle DePass VC** (23-27); Z3 Patte Sullivan (23-27); Z4 Rashelle Chase-Miller (25-29); Z5 Virginia La Forte (25-29); Z6 Stephanie Engelsman (25-29); Z7 **Eddie Wang, Chair** (23-27); Student Rep Rose Sandell (26-27). ⚠️ Julia Brim-Edwards left (now County Commissioner) — Ballotpedia/Wikipedia stale. **May 2025 election seated four new members (majority turnover)**: `https://www.wweek.com/news/schools/2025/09/17/portland-school-board-leaders-want-to-try-a-new-style-of-governance/`
- **The board IS the budget committee** (C1). FY27 adopted June 23, 2026, one abstention (Engelsman); amendments passed: **pause on new AI contracts; freeze on discretionary board/leadership travel**; failed: restore $13.1M for laid-off staff (+2 others).
- **Superintendent = budget officer in practice**: **Dr. Kimberlee Armstrong** since July 2024 (`https://www.opb.org/article/2024/06/04/portland-public-schools-kimberlee-armstrong-next-superintendent/`). Chain: Carole Smith (resigned 2016, lead-in-water — ⚠️ dates unverified) → interim → **Guadalupe Guerrero Oct 2017–Feb 2024** (left mid-year for Partnership for LA Schools) → Sandy Husk interim → Armstrong. Proposed budgets released: FY26 Apr 22 2025; FY27 Apr 28 2026.
- **CBRC**: 8-12 volunteers, board-appointed, 3-yr terms (17 served 2026) + student member; monthly Oct-Jun; advisory on proposed budget + **statutorily tasked with local option levy monitoring**. **2026 report critical**: 1% COLA assumption "significantly lower than any COLA negotiated in recent memory"; **nine working days to review** ("symbolic rather than substantive" risk); ELD cuts flagged; contracted management/non-instructional services growth flagged. **The only citizen body in the process: purely advisory, appointed by the board it reviews, ~9 days.**
- **Board policy framework**: 2019 reserve policy **5-10% of GF resources, goal 10%** (TSCC FY26 p.10); FY25-26 held at 5% floor; **PERS Stabilization Reserve fully drained ($24M)** "one-year solution to a multi-year challenge" (`https://www.pps.net/about/2026-27-budget-process/2025-2026-frequently-asked-questions`). **Racial Educational Equity Policy 2.10.010-P** (June 13, 2011, unanimous) → equity lens + Equity Funding Policy (`https://www.pps.net/policies`). Strategic plan: Graduate Portrait etc. (TSCC FY26 p.3). **Student Outcomes Focused Governance**: CGCS consultant since ~Feb 2025, "policy diet"; backed by Wang + Armstrong. ⚠️ formal adoption unverified; outcomes falling short of board goals (`https://www.wweek.com/news/schools/2025/10/30/pps-student-outcomes-fall-short-of-school-board-goals/`). **Angle: SOFG narrows board attention away from operational detail exactly when the deepest cuts/closures are happening.**

## C5. Pre-committed spending
- **Personnel: 79.6% of General Fund requirements (FY26, TSCC)** — the defensible figure ("85%" is the statewide QEM/SSF figure, not PPS). All-funds personnel $821.2M = 42.1% (inflated by ~$490M capital outlay). FY26 personnel +3.1% while FTE fell 6,018→5,835 (−183).
- **2023 PAT strike** (first in PPS history, Nov 2023): ≈**$175M/3yrs (~$58M/yr)**, 13.8% cumulative COLA (PAT sought 23%, district offered 10.9%); district said contract required $126M+ cuts, reserves $105.5M→$42.7M. `https://en.wikipedia.org/wiki/2023_Portland_Association_of_Teachers_strike`; `https://www.wweek.com/news/2023/12/06/how-can-portland-public-schools-afford-its-new-teacher-contract-with-these-taxes-and-layoffs/`
- **PAT counter-narrative** (contested-facts section): PPS underreports revenue; could spend $53M of GF balance over 3 yrs within policy; freezing admin salaries at 22-23 levels frees $6.2M; **PPS added 149 central-office admin/professional positions 2019-2024 (~$15.4M FY23-24)**: `https://www.pdxteachers.org/fundingmemo`
- **PERS**: 2025-27 school rates cut 1.68pts (SB 849): `https://www.oregon.gov/pers/emp/pages/contribution-rates.aspx`; `https://www.oregon.gov/pers/Documents/Financials/Actuarial/2024/Adoption%20of%202025-2027%20Employer%20Contribution%20Rates.pdf`; `https://www.opb.org/article/2025/06/04/oregon-schools-pers-budget-season/`. **PPS FY26: blended 4.20% + UAL fringe 17.39%**; avg increase 6.5pts = **$32M impact FY26 alone** (PPS FAQ); OPB: "from just over 4% to just over 20%". **Pension obligation bonds: Oct 2002 $156.58M, Apr 2003 $156.37M, Jul 2021 $399.39M; outstanding $510.3M (6/30/25); serviced via internal fringe charges** (TSCC FY26 pp.16-17).
- **Instructional time** (OAR 581-022-2320): ≥92% of students district-wide and ≥80% per school at 966/990/900 hrs (gr12/9-11/K-8); ≥265-day span. **Oregon has NO statutory class-size cap** — class size is bargained (key 2023 strike issue), OAR 581-022-2335 is reporting-only. ⚠️ **Executive Order 26-06 on Instructional Time** may change this — unread: `https://www.oregon.gov/ode/rules-and-policies/staterules/pages/instructional-time.aspx`
- **SPED MOE** (IDEA Part B + ESEA): `https://www.oregon.gov/ode/rules-and-policies/pages/policies-and-procedures-for-special-education.aspx`; `https://www.oregonlegislature.gov/lpro/Publications/Special-Education-Background-Brief.pdf`; `https://www.oregon.gov/ode/schools-and-districts/grants/ESEA/Pages/MOE.aspx`. Squeeze: 11% ADM weight cap + $55M prorated HCD vs actual costs; GF absorbs the difference and MOE prevents cutting it → **special ed = least-cuttable large line**. FY26 FTE: Special Programs 1,061→1,094 (+3.3%) while Regular Instruction 2,310→2,167.
- **ESSER cliff**: PPS ESSER I $7.5M, II $30M, III $70M ≈ $107.5M (~$115M w/ partners): `https://www.pps.net/departments/budget-grant-accounting/esser-federal-funds-overview`. ESSER III obligation deadline Sep 30, 2024; **$36.3M still unspent Feb 2024**; **braided with SIA** for ongoing programs (learning acceleration, mental health, summer) → cliff hit programs, not one-time buys. **Cumulative cuts $115.5M since 2023-24**: FY23 $30M central office; FY24 hiring freeze + $10M; FY25 $15M; FY26 $40M; FY27 $56.3M (TSCC FY26 p.5).

## C6. State-level actors
- **SSF appropriations**: 2023-25 **$10.2B** (GF $8,810.2M + FSS $702.0M + Lottery $646.5M + marijuana $40.8M); **2025-27 $11.36B** (+11%, ~current service level; 49/51 split): `https://www.osba.org/state-school-fund-set-at-11-36-billion/`. 2025 session core K-12 total $13.6B: `https://www.betteroregon.org/news-story/what-happened-for-k-12-education-in-oregons-2025-legislative-session`. **PPS FY26 SSF share: $291.0M** (+$25.5M). Legislative docs: `https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/293759`
- **QEM**: 11-member commission (2001): `https://www.oregon.gov/ode/reports-and-data/taskcomm/pages/qemreports.aspx`. 2024 gap: $1.514B/yr (23-25), $1.126B/yr (25-27). **2026 report (27-29): +$2.5B just to maintain current service (+22%); +$5B to hit new targets (+41%); compensation ~85% of SSF dollars**: `https://www.opb.org/article/2026/08/12/oregon-committee-recommends-increase-school-spending/`; `https://oregoncapitalchronicle.com/2026/08/12/oregon-education-funding-committee-recommends-increase-school-spending/`. Never funded to QEM: `https://www.osba.org/quality-education-model-achievement-raises-bigger-questions/`. JPEA adequacy report Nov 19 2025: `https://www.oregonlegislature.gov/citizen_engagement/Reports/2025JPEAReportontheAdequacyofPublicEducationAppropriations-FINAL.pdf`. **State never asked researchers to analyze how districts spend**: `https://www.wweek.com/news/schools/2025/05/15/state-did-not-ask-education-researchers-to-analyze-how-school-districts-currently-spend-funds/`
- **Education Stability Fund**: constitutional (2002); 18% of lottery; cap 5% of GF revenue; principal spendable only on recession triggers + 3/5 both chambers (or Governor emergency + 3/5). **The reserve PPS demanded be tapped spring 2026 — state refused** (DePass: "There's no hope in Salem right now"): `https://www.wweek.com/news/schools/2026/04/30/calls-to-tap-state-education-reserves-continue-as-pps-proposes-hundreds-of-layoffs/`; `https://katu.com/news/local/portland-public-schools-calls-on-lawmakers-to-use-reserve-funds-to-fill-budget-gap`
- **ODE/SSA**: Integrated Guidance braids 6 initiatives (HSS, SIA, School Improvement, CTE, Early Literacy, EIIS): `https://www.oregon.gov/ode/studentsuccess/pages/default.aspx`. **PPS Integrated Grant 2025-26 ≈ $63.0M** (TSCC FY26 p.8). **CAT 2025-27 ~$3.1B projected, ~$2.1B distributable; SIA ≥50%, Statewide ≤30%, Early Learning ≥20%; SIA distributed on ADMw with poverty DOUBLED.**
- **PPS SIA 2025-27** (ODE alloc 9/16/2025 `https://www.oregon.gov/ode/StudentSuccess/Documents/25-27%20SIA%20Allocation.pdf`): statewide $1,104,279,339.59 @ $1,659.31/ADMw; **Portland SD 1J ADMw 53,745.11 → $43,680,643.99 (25-26); $45,463,527.42 (26-27)** incl. charters (Emerson, Le Monde, Arthur Academy, Portland Village, Cottonwood, Ivy).
- **PPS HSS/M98 2025-27** (`https://www.oregon.gov/ode/StudentSuccess/Documents/25-27%20HSS%20Allocation.pdf`): statewide $333,007,734.23 @ $1,489.85/9-12 ADMw (vs M98's original $800 intent); **PPS 9-12 ADMw 17,291.66 → $12,623,373.64 / $13,138,613.38**. PPS created a new M98 sub-fund FY26 per ODE guidance (previously commingled — **probe what M98 money was doing before**). TSCC FY26 pp.6,16.

## C7. Values debates driving allocation
- **Enrollment (master variable)**, TSCC FY26 p.4: 2019-20 **48,653** → 44,861 (21-22) → 44,005 (23-24) → 42,471F (25-26) → 41,450F (26-27) → **39,945F (28-29)**. −12.7% from pre-pandemic; peak 48,708 (2018-19). K-5: 24,555 (2014) → 19,813 (2023); K alone 4,134→2,995; elementary −17.3%/5yrs (`https://www.opb.org/article/2023/04/18/why-portland-elementary-school-enrollment-is-declining/`). Drivers: birth decline since ~2008; K capture ~80% (2019) → 70% (2020) (PAT). PSU PRC: decline through 2029-30 then level ~38,600. **Mechanism: SSF is per-ADMw; buildings/principals/custodians are fixed per school → 81 schools/100+ campuses/152 sqmi with rising per-student overhead.** Statewide: `https://www.opb.org/article/2025/11/13/oregon-school-education-enrollment-attendance-students-data/`; KGW births `https://www.kgw.com/article/news/local/portland-public-schools-enrollment-falling-birth-rates-oregon/283-02ef0fa3-be27-4f35-84d7-f754e68afc31`
- **Rightsizing/closures**: launched 2026; initially 5-10 schools; **Aug 26, 2026: Armstrong says up to 20 could close/consolidate; recommendations end of 2026; effective 2027-28**: `https://www.wweek.com/news/schools/2026/08/26/pps-superintendent-says-district-could-close-up-to-20-schools/`; `https://www.opb.org/article/2026/04/23/portland-public-schools-closing-schools/`; criteria `https://www.wweek.com/news/schools/2026/03/18/heres-what-pps-will-consider-as-it-selects-schools-to-close/`; equity flashpoint (James John/North Portland) `https://www.kptv.com/2026/04/23/portland-parents-air-concerns-board-over-potential-school-closures/`; KATU rightsizing `https://katu.com/news/local/portland-public-schools-starts-district-rightsizing-amid-budget-gap-declining-enrollment-aging-buildings`
- **Equity staffing formula + federal lawsuit**: since 2013, ~8% of GF staffing set aside; K-8: 4% of teacher allocation (2% SES via >20% direct-cert, 2% "Combined Historically Underserved" via 40% meeting ≥1 of SPED/LEP/direct-cert/**race categories**). FY26: "not changing" (TSCC p.5). **Oct 2025 CIR federal civil-rights suit alleging racial discrimination**: `https://www.wweek.com/news/schools/2025/10/20/federal-civil-rights-lawsuit-alleges-ppss-staffing-formula-is-racially-discriminatory/`; `https://cir-usa.org/cases/stopping-race-based-funding-and-restoring-fairness-in-portland-public-schools/`; critiques `https://cascadepolicy.org/tax-and-budget/equity-funding-has-not-closed-the-racial-achievement-gap-in-portland-schools/`, `https://sites.google.com/view/reform-pps-funding/home`, `https://ppsequity.org/`. ⚠️ litigation status needs docket check.
- **Central office vs schools**: FY26 cuts $17M central vs $23M school; FY27 ~$20M vs ~$23M (+$3.5M restored after input, incl. ≥1 counselor/school). FY27 FTE cuts: central 74, school 112, specialized 101, transport/facilities 48; adopted 320-322 (87 student-facing). **FTE by function FY22→FY26: Regular instruction 2,467.62→2,166.69 (−12.2%); Special programs +3.3%; Facilities acq/construction 39.55→46.25 (+17%); total 6,274→5,835.** **Finding: regular instruction cut ~4× faster in % terms than central business support; facilities staffing GREW (bond-funded, legally unmovable to classrooms).**
- **Contracting explosion**: purchased services $269.9M→$437.0M (+61.9%) FY27 proposed; ~2/3 capital-funded; **~$147M operational**; incl. **$61.5M/5yr Procedeo contract**. CBRC: students may get "meaningfully fewer instructional resources than the substantial per-pupil spending would imply."
- Fund for PPS underperforming: `https://www.wweek.com/news/schools/2025/10/01/the-fund-for-pps-underperforms-former-model/`
- **The "$2.77B vs $868M" framing problem (essential)**: FY26 all funds $2.035B = GF **$868.6M (42.7%)** + Special Revenue $224.8M + Pension Debt Svc $93.8M + GO Debt Svc $178.9M + **Capital Projects $643.8M** + Internal Svc $25.3M. FY26 resources include **$608.5M beginning fund balance (30%), of which $514.7M (84.6%) is unspent bond money** — legally unusable for teachers. Requirements by object: Personnel 41%, M&S 16%, **Capital Outlay 24%**, Debt Svc 15%. By function: Instruction 28%, Support 23%, **Facilities 33%**, Debt 14%. GF resources: property taxes $474.9M (56.2%) + intergovernmental $306.0M (36.2%) + BFB $45.0M + transfers $24.0M + fees/other $18.8M. GF requirements: Instruction 52.78%, Support 39.97%, contingency $41.2M (4.74%). **FY27 $2.77B total = capital ramp on 2025 bond while GF FELL $6.5M.** ⚠️ FY27 GF exact total unresolved ($868.6M KOIN vs $862M implied) — verify in adopted book. Next: −$65.2M needed FY28. Fact-check on "PPS hides state money": `https://www.kgw.com/article/news/verify/claims-portland-public-schools-budget-omits-state-funding-need-context/283-c80818ce-dc2a-490c-9682-6d73b3cffd58`

## C8. Flagged/unverified — follow-ups
1. No "pensioner" ADMw weight — drop. 2. TSCC FY27 PPS review not online — request. 3. FY27 GF total ($868.6M vs ~$862M) — resolve in adopted book (Vol1 PDF >10MB: `https://resources.finalsite.net/images/v1777476167/ppsnet/cjslvvkzotwvwencttvx/2026-27ProposedBudget-Volume1.pdf` — download locally). 4. PPS CET rate/yield not located. 5. **Local option exclusion headroom** — get ODE's computed limit for Portland SD 1J (determines if 2024 levy is fully additive). 6. SOFG adoption status + policy-diet outcome. 7. CIR lawsuit docket status. 8. EO 26-06 instructional time — unread. 9. Carole Smith dates unverified. 10. FY27 budget calendar dates from BoardBook. 11. FY27 salaries+benefits % of GF — use FY26's 79.6% until book checked.

---

