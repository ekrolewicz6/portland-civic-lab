# Homelessness figures: refresh and relabel (October 2026)

## Why

On October 5, 2026, Dr. Minji Cho (PSU Homelessness Research & Action Collaborative) reviewed the County Chair voter-guide page at the Lab's request. HRAC holds only the HUD Point-in-Time (PIT) and Housing Inventory Count (HIC) data, so it could not check most figures. Her substantive point: the Lab's figures of about 18,000 people homeless and 8,800 unsheltered come from Multnomah County's by-name list, whose method differs from the PIT count, so the two cannot be compared one to one. HUD requires the unsheltered PIT every two years; the latest unsheltered PIT in Multnomah County was January 2025. She pointed to HRAC's "2025 Oregon Statewide Homelessness Estimates" (January 2026) for PIT-based figures and HUD definitions.

The first fix shipped October 7 (PR #97): the city-county agreement item on the County Chair and District 2 pages now names the by-name list. This plan covers the rest.

## Goals

1. Every homelessness count on the site says which measure it is (by-name list, PIT, HIC) and what date it describes.
2. No page compares a by-name figure with a PIT figure as if they measured the same thing.
3. Each measure is defined once, in plain words, and that definition is reachable wherever a figure appears.
4. Figures are the newest published: the latest by-name month, the 2025 PIT (sheltered, unsheltered, chronic), the 2025 HIC, and any January 2026 sheltered PIT.

## Steps

1. Data (research agent): newest primary figures with URLs, periods, definitions and quotes, written to `sources.md` in this folder.
2. Inventory (research agent): every occurrence of a homelessness count on the site, its wording, measure, date and source.
3. Definitions: one shared set of plain-language definitions in `src/lib/homeless/` for the by-name list, PIT (sheltered, unsheltered), HIC and chronic homelessness, with the HUD and county sources.
4. Data file: update `src/lib/homeless/data.ts` (and dependents such as `engine.ts`, `continuum.ts`) with the newest figures and as-of dates; retire stale ones (the 2023 chronic share) where 2025 figures exist.
5. Copy: relabel every occurrence from the inventory; where a by-name figure sits next to a PIT figure, say the methods differ and why.
6. Voter guide: re-check the County Chair "Decisions ahead" items 1–4 and 6 and their matching boards against the newest data.
7. Verify: type-check, unit tests, build, Playwright specs for the homelessness pages and voter guide, headless desktop and phone checks, no text under 12px, no horizontal scroll.
8. Ship: research-log entry, PR, production check.
9. Follow-up with HRAC: share the changes in the meeting thread; ask Dr. Cho to look at the definitions.

## Not in scope

- Filing the records requests listed in the continuum memo.
- Re-analysis of the continuum model beyond swapping in updated inputs.

## Status, October 7, 2026

Done in code (PR to follow):
- `src/lib/homeless/measures.ts`: one set of definitions for the Point-in-Time count, the by-name list, the Housing Inventory Count and chronic homelessness, each with its newest dated figure, its main caveat and its sources. Shown as "What these numbers measure" (`MeasureKey`) under the homelessness deep dive's stat band.
- Deep dive: stat band names each measure and date; the "+67%" tile is labelled as Multnomah's Point-in-Time count (it had said "tri-county") and notes the 5,090 people added from county records; chronic share updated from 41% (2023) to 49% (HUD 2025, 5,158 of 10,526); triage tool uses the 2025 count; the cost calculator's top preset is now the 3,735 chronically homeless people counted unsheltered (it had used all 6,912 unsheltered under a "chronically homeless" label); the simulator dates its starting figure.
- Continuum page: "the same January 2025 count" now names the Point-in-Time count.
- Dashboard (code): headline names the count and year and says "from" the prior year; the prevalence note no longer compares a one-night count with a 2017-based annual estimate; the method notes describe the 2025 change and the by-name list's outflow and coming restatement; methodology page frequency now "at least every two years".
- Voter guide: Gresham figures corrected (155 → 156 housed; "20 unsheltered" → fewer than 40, KPTV); Heart Free Pham's line follows her own wording; research-log entries hrac-2026-10-07 and homelessness-figures-2026-10-07.
- Seeds: `seed-homelessness.ts` 2025 split and `fetch-hud-pit.ts` 2023 row corrected, so a reseed cannot bring the errors back.

Needs Edan's approval (writes to the production database):
- `npx tsx ingest/fix-homelessness-pit-2026-10.ts --apply`: sets the 2025 split to 3,614 / 6,912, sets 2023 to 6,297 (2,353 / 3,944), deletes the 2024 row. The dry run on October 7 showed the live rows: 2023 = 6,070 (unsourced), 2024 = 6,297, 2025 = 4,525 / 7,509. Until it runs, the dashboard headline reads "up 67% from 2024".
- Optional `--drop-2020`: the 2020 row repeats 2019's total (4,015) with a different split; no source on file.

Open:
- 2017, 2019 and 2022 sheltered/unsheltered splits in the database are unverified (2022 may be 2,171 / 3,057 per the research; not confirmed against HUD's 2022 report).
- Dashboard "MultCo shelter beds" uses HRAC's 4,008; the continuum page uses HUD's 4,187. The sources disagree; reconcile or label both.
- By-name list: the county dashboard was offline as of October 7, 2026 and the series will be restated about 20% lower. Recheck when it returns and update `STATS.byNameTotal`, `MEASURES` and the voter-guide item.
- Data-transparency text in the database ("approximately 6,000 to 8,800 ... 47%") mixes editions; check against OPB and the county series.
- Unused components that import `continuum.ts` still carry older wording ("the county list counted"); not shown on any page.

## Status, October 8, 2026

Dr. Cho answered both follow-up questions and sent the *2025 Oregon Statewide Homelessness Estimates* PDF (archived; `research/source-archive/2026-10-08.md`).

What she said:
- The official figures for Multnomah County remain the January 2025 Point-in-Time count: 10,526 homeless, 6,912 unsheltered. Unsheltered counts are required in odd years only, and the county did not hold one in 2026.
- The by-name list figures (about 18,000; 8,800 unsheltered) and the Point-in-Time figures should not be set side by side as comparable or used to judge change over time; the gap may come from the methods alone. Writers may choose which figures to use.
- She described the by-name list's role in the count as deduplication only, which does not match the Tri-County report's 5,090 presumed-unsheltered people (sources.md, conflict 11). Asked in a reply drafted for Edan.
- HRAC runs Evicted in Oregon, the source of the dashboard's eviction data; Edan's meeting request is with her team.

Done (PR to follow):
- The County Chair item stays as it is (by-name figures only, named as such); no Point-in-Time figures added beside it. Research-log entry `hrac-2026-10-08`.
- `ingest/homelessness/hrac-statewide-2025.ts` holds every HRAC table the dashboard uses, for all 36 counties; `verify-hrac-statewide.ts` checks it against the PDF (all match). `seed-statewide-homelessness.ts` now reads it, dry-runs by default, saves the current rows before `--apply` and clears the dashboard cache.
- Dashboard: statewide beds and coverage come out right once all counties are loaded (12,607; 46%); the student figure uses the deduplicated statewide row (21,122) and adds Multnomah's 2,903; doubled-up adds Multnomah's 3,477 (plus or minus 960); racial disparities keep only HRAC's stated ratios and say why Hispanic and Asian Oregonians have none; HRAC's 4,008 beds sit beside HUD's 4,187; the 34.9% statewide rise carries HRAC's method caveat; "Prevalence Gap" became "Two Different Counts" without the by-name number; the by-name chart notes wider reporting and the coming restatement, and its source link points to HSD instead of the retired JOHS page.
- Data transparency: the city-county dispute summary no longer gives a 47% rise from a rounded 6,000 (the county's list showed 6,275 in January 2025) or calls its basis "by-name list and PIT count"; a source card for HRAC's statewide estimates; the Point-in-Time card's scope says Multnomah and odd-year unsheltered counts. The seed now holds the live rows, so a reseed cannot undo the October 7 fixes.
- `measures.ts`: the by-name caveat says the gap is not evidence of growth; the PIT caveat says 2025 stays the latest official figure until January 2027; the inventory card notes HRAC's 4,008.

Needs Edan's approval: merge the PR, then run `seed-statewide-homelessness.ts --apply` and `seed-data-transparency.ts --apply` (both dry-run cleanly: 71 and 7 changes). Order matters: the old dashboard code would add the new statewide student row to the county rows.

Open:
- The deep dive's headline "+67%" tile (Multnomah PIT, 2023 to 2025) and the hero's "14,361 → ~18,000 in one year" both describe change across a method change. Each is labeled with its measure, but Dr. Cho's caution argues for leading with levels. Edan's call.
- Reply to Dr. Cho about the 5,090 people and the meeting.
