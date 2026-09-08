# Continuum rebuild — September 8, 2026

Implemented at `/deep-dives/continuum` in the local project. Production publishing is not part of this change.

## What changed

- Organized the page into eight sections: usable capacity, a diagnosis of fourteen functions, illustrative journeys, reported outcomes, costs, proposed changes, investigation requests, and an expandable reference atlas.
- Added a matched-date capacity comparison: 10,526 people experiencing homelessness versus 4,187 year-round shelter/transitional beds in Multnomah County in January 2025. The 6,339 arithmetic gap is explicitly historical, not a current construction target. Surveyed and administratively presumed unsheltered counts remain distinct.
- Separated listed, staffed, vacant, suitable and accepting capacity. Showed current admissions restrictions, confirmed closures and future reductions, without summing overlapping City/County scopes.
- Made a fourteen-function diagnostic board the primary failure display. Seven dimensions distinguish places, workers, funding, access, handoffs, execution and outcomes. Each expandable row identifies its dated evidence, consequence, investigation, records and responsible organizations. Red findings, access boundaries, unresolved questions and unassigned cells remain distinct.
- Highlighted staffing-constrained shelter capacity, delayed housing-unit turnovers and unresolved oversight in three prominent cards. Added the latest SHS operational findings, Letty Owings admissions/closure updates and the adopted FY27 housing-placement initiative; historical detox-transfer findings include subsequent treatment expansion.
- Kept the conceptual system map in an optional disclosure, with six selectable barriers and proposed repairs. Housing work and support run alongside the route; shelter is optional.
- Added three illustrative journeys and a comparison between a bottleneck and a better handoff. They are explicitly not actual case records or predicted outcomes.
- Displayed two City weekly reports as separately reported totals. No unsupported person-level conversion rate or inferred reason for the differences is shown.
- Separated FY25 shelter operating costs, 2026 Home Forward rent benchmarks and FY27 adopted budgets. Removed the unsupported $16,000 supportive-housing comparison and manufactured per-placement prices from the active page.
- Added six proposed actions with responsible organizations and suggested measures. Recognized existing programs, including case conferencing, housing problem solving and the funded Medicaid rent-assistance team.
- Kept fourteen service definitions available in collapsed reference groups, with 25 primary sources and corrections. The route and its homelessness-page teaser no longer import the legacy continuum dataset.
- Added seven selectable records-request templates covering capacity, staffing, outreach, handoffs, housing/funding, execution and lasting outcomes. Requests seek existing public aggregate or redacted records. Copying does not send a request or authorize fees.
- Added mobile layouts, sticky section navigation, a copyable original quotation and updated social metadata and referring-page descriptions.
- Hid the redundant header Support shortcut below 380px so the wordmark and mobile menu remain usable; Support remains available elsewhere in the site navigation.

## Validation

- Repository TypeScript check passed: `npx tsc --noEmit --incremental false`.
- Targeted ESLint passed for every changed TSX file; whitespace checks passed.
- A separate production snapshot built successfully at `/private/tmp/continuum-final-production-build-dvfpmmsk`, without altering the existing development server’s `.next` directory: compilation, lint/types, and generation of all 116 static pages passed. The continuum route was statically rendered, with a 28.5 kB route bundle and 135 kB first-load JavaScript.
- That production build preceded final narrow scope/copy corrections, sticky matrix-header alignment and direct-link reveal behavior. These final changes passed repository TypeScript, targeted lint and live browser checks.
- Browser verification covered all six map selections and both map modes; all three journeys and their comparison controls; annual/daily shelter prices; all three unit-size rent calculations; adopted budgets; both reporting weeks; source and action disclosures; quotation copying; keyboard activation; and responsive layouts at 320, 390, 768 and desktop widths.
- The expanded diagnosis was checked at 320, 390, 768 and 1440 pixels, including all seven filters, all fourteen default rows, filtered-row reveal, direct hash navigation, keyboard disclosure activation, adopted-budget source links, all seven investigation selections, request preview and clipboard success feedback. Sticky matrix headers stay visible above the selected row on desktop; mobile shows labeled constraint badges.
- No broken in-page anchors or duplicate IDs were found. No horizontal overflow was found at the checked widths. Final browser error/warning logs were empty.

## Evidence boundaries

The existing research files retain the audit and source detail. Figures on the page identify their reporting periods; September 8 is the review date, not the date of every observation. Historical operating costs, administrative rent standards, adopted budgets, forecasts and proposals remain distinct. Missing outcomes are shown as unknown, never counted as returns to homelessness. The source’s inconsistent shelter-exit totals are explained in the reference methods.

The production build emitted nonfatal warnings from existing WorkOS Edge dependencies, Node/webpack tooling and intentionally absent database configuration in the isolated snapshot. No application credentials were copied into the snapshot and no ingestion, migration or database-writing tasks were run.
