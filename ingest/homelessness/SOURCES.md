# Homelessness dashboard: where each number comes from, and how to refresh it

The tables behind `/dashboard/homelessness` live in the production database (schema `homelessness`). Each one, its exact source, how often that source publishes and how to reload it are listed in `sources.ts` in this folder. This page is the readable version and the routine.

## The monthly check

```sh
set -a && source .env.local && set +a
npx tsx ingest/homelessness/check-freshness.ts
```

It reads the newest period in each table and flags any table whose source should have published something newer. It changes nothing. It exits with code 1 when something is due, so it can run on a schedule.

For each flagged table, follow the `refresh` line in `sources.ts`. Every loader prints what it would change and writes only with `--apply`. Before running one:

1. Save the raw download in `runtime-data/source-archive/<date>/` and add it to `research/source-archive/<date>.md`.
2. Run the loader without `--apply` and compare its output with the source.
3. Run it with `--apply`, then update `loadedThrough` and `refreshedOn` in `sources.ts`.

## What refreshes itself

- **Campsite reports** (`irp_campsite_reports`): the nightly `/api/cron/sync-campsites` job. Keyed on `report_id`; the city's OBJECTID is renumbered when it republishes the layer, which is why loading stalled from April 15 to October 7, 2026.

Everything else is loaded by hand.

## Monthly

- **Eviction filings**: `npx tsx ingest/fetch-hsd-dashboard.ts --apply`. Evicted in Oregon updates around the 15th. The script finds the newest chart version, reads the period printed on the chart page and dates the CSV's year-less month columns from it; it refuses to load if they disagree.
- **Home Forward vacancy**: read https://www.homeforward.org/performance-dashboard/ in a browser (it shows only the current figure), save a screenshot to the archive, and add a row.
- **By-name list**: the county's dashboard (https://hsd.multco.us/data-dashboard/) was offline for maintenance as of October 7, 2026. When it returns, the county will have restated every month back to January 2024 under a shorter inactivity rule (about 20% lower). Replace the whole series, not just the new months, and update `MEASURES` in `src/lib/homeless/measures.ts` and the voter guide's county items.

## When each source publishes

| Table | Source | When |
|---|---|---|
| `pit_counts` | HUD's OR-501 Homeless Populations and Subpopulations report | Full count every two years in late January (next: January 2027); HUD posts the report about 11 months later. Only full-count years are stored. |
| `housing_placements` | Multnomah County release and HSD SHS annual report | November, for the fiscal year that ended in June |
| `shs_funding` | Metro SHS reports | Year-end memo in September; audited annual report in February or March |
| `overdose_deaths` | Domicile Unknown, Multnomah County Health Department | About December, for the year before last |
| `doubled_up` | Census ACS 1-year microdata, HRAC method | Normally September; the 2025 release is delayed |
| `statewide_*`, `racial_disparities`, `shelter_bed_inventory` | HRAC statewide estimates | After each full Point-in-Time count |
| `shelter_capacity` | HSD quarterly data dashboard | Frozen since April 16, 2025 (data through June 2024) |

## Known gaps, October 2026

- HRAC counts 4,008 shelter beds in Multnomah County for January 2025; HUD's Housing Inventory Count for the same night has 4,187. The dashboard's "38% coverage" uses HRAC's; the continuum page uses HUD's.
- The 51 `context_stats` rows have not all been rechecked. One held the city's 1,566-bed goal as if it were current beds until October 7, 2026.
- Newer shelter figures (SHS-funded units, the county's post-cut 1,742 units or 1,667 beds) measure different things and are not mixed into `shelter_capacity`.

Sources and quotes for every figure loaded on October 7, 2026: `research/homelessness-data-2026-10/sources.md` and `dashboard-refresh.md`.
