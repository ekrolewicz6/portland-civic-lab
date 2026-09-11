# Verification — September 11, 2026

Implementation checks passed against the local production build and the actual imported database. Edan authorized production release on September 11, 2026. Representative-record review with Jenna and Dominic remains an editorial follow-up. No outreach emails were sent; the contact submission test was intercepted in Playwright and never reached the server.

## Checks completed

| Check | Result |
|---|---|
| Application typecheck: `npx tsc --noEmit` | Passed |
| Ingestion typecheck: `npx tsc -p ingest --noEmit` | Passed |
| Repository lint: `npm run lint` | Passed. Excluded generated files inside `.claude/worktrees/` from the lint scope. |
| Production build: `npm run build` | Passed. Existing WorkOS Edge-runtime compatibility warnings remain; no Oregon Fire build errors. |
| Focused ingestion tests: `npx tsx --test ingest/oregon-fire/oregon-fire.test.ts` | 14 passed |
| Database storage check: `npx tsx --env-file=.env.local ingest/oregon-fire/storage-check.ts` | Passed; all private temporary records removed |
| Browser tests: `OREGON_FIRE_LIVE_CHECK=1 npx playwright test e2e/oregon-fire.spec.ts --workers=1` | 5 passed against the local production build in 18.9 seconds |
| Browser visual check | Desktop and 390px mobile layout inspected; no page errors. Map, list, source table and attribution render. |
| FPA FOD archive | Official edition-seven SHA256 matches; 78,895 Oregon rows extracted |
| Import record integrity | All active nonempty record sets contain JSON objects, not encoded strings; ordered source-record checksum summaries saved in `import-evidence.json` |
| Repeat imports | PNW 1,117 regional features re-imported; 593 Oregon records retain stable IDs. Empty ODF snapshots also re-imported successfully. |

The focused tests cover: Washington-only exclusion and crossing polygons; wildfire-consumed treatment classification; pile/treatment acreage distinction; repeated ignitions; missing native IDs; year-only and unverified placeholder years; cultural-record holds; ArcGIS error bodies, complete ID inventories, response splitting, actual returned-ID matching and disappearing records; invalid bounds and CSV formula handling.

The database check verifies idempotent replays, changed geometry and bounding boxes, JSON representations, private holds, atomic publication and retention of an earlier successful snapshot after an intentional partial failure. Its records are private throughout and removed in `finally`.

The browser tests cover synchronized record selection, map movement, preserved URL filters/selection, reload, source links, CSV export, keyboard layer controls, mobile overflow, explicit unavailable states, and source-resolved correction prefilling with evidence/publication preference. The live-data subset is opt-in so ordinary CI does not depend on downloading national datasets.

## Actual initial coverage

| Source | Public records after checks | Additional interpretation |
|---|---:|---|
| BLM treatments | 36,675 | 25 identified cultural/tribal records held; 266 source features do not intersect the generalized Oregon boundary |
| FACTS fire treatments | 19,317 | 1,206 source features lack geometry and are retained privately; eight further source features do not intersect Oregon |
| PNW tracker | 593 | Oregon subset of 1,117 regional records; mixed planning/monitoring/completion statuses |
| Oregon Explorer recent perimeters | 4,606 | 2000–2025; two source features excluded by intersection |
| Oregon Explorer early perimeters | 4,844 | Earlier history, including unverified source dates; not unique fire occurrences |
| FPA FOD v7 | 78,781 | 1992–2024; 114 source-coded Oregon points fail the generalized boundary intersection and need discrepancy review |
| WFIGS recent occurrences | 1,802 | 2026 provisional records; two source points fail intersection |
| ODF four rolling feeds | 0 in each | Successful empty snapshots; no inference that no Oregon burning occurred |

Counts are source records, not additive unique-fire totals. Exact import timestamps, failed attempts, source metadata, checksum summaries and coverage appear in the evidence JSON and coverage CSV. Original source years such as 8888 and 1001 are retained in attributes and marked unverified in normalized dates; they are not plotted as timeline years.

## Remaining review and acquisition

- Edan authorized production release on September 11, 2026. Jenna and Dominic have not yet reviewed representative records. Production database identity and presence of the production cron secret were verified before deployment; no credentials were included in evidence.
- ODF SDS history, actual DEQ/LRAPA/ODA permits and accomplishments, additional refuge/park histories, LTDL and unit-to-plan crosswalks still need acquisition. All outreach remains draft status in the ledger.
- No steward has confirmed complete jurisdiction coverage or every field interpretation. Generalized-boundary exclusions need particular care around approximate source points and borders.
- The 2025 occurrence gap between FOD’s final year and the current WFIGS feed remains; Explorer supplies 2025 perimeters, not a complete small-fire occurrence history.
- The Woodpecker story is documented and linked, but unit geometry has not been verified. It has no map pin.
- Public explanation rows require evidence, attribution, review date and explicit approval. No contributor explanation has been approved by these tests. Tribal/cultural publication requires the program-specific agreement.
- Existing source-record histories are retained, but publisher retention policies remain unconfirmed. A missing planning record is not treated as a cancellation or completion.

Local preview: `http://localhost:3100/oregon-fire`. The previously hosted Claude sourcebook remains a separate, unchanged copy.

## Production release and sharing

The initial release is live at https://www.portlandciviclab.org/oregon-fire (commit `c4a20cc`, Vercel deployment `dpl_JBhPCVhKCg3BLRq3uaedjMTCvKas`). All five focused browser checks passed against that public deployment in 41.9 seconds. The page, homepage and source endpoint returned HTTP 200; the unauthenticated cron request returned 401. Vercel confirmed the six-hour Oregon Fire schedule is enabled.

The follow-up sharing update adds a dedicated 1200 × 630 PNG card, descriptive search/Open Graph/Twitter text, all three authors, and CollectionPage/breadcrumb structured data. The image uses a simplified Census-derived Oregon outline; interior curves are decorative and do not represent terrain or burn locations. Cormorant Garamond and DM Sans fonts are bundled with their OFL licenses, so image rendering needs no external font service. The card was rendered and visually inspected locally, and the crawler-facing metadata was checked before deployment.
