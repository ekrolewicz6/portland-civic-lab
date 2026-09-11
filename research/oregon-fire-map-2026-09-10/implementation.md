# Implementation and operating notes

The page lives at `/oregon-fire` in the existing Next.js application. It uses a client-only React Leaflet map, the existing design vocabulary and Postgres connection helper. It is credited to Edan Krolewicz, Jenna Knobloch and Dominic Kuklawood. Edan authorized production deployment on September 11, 2026; see verification.md for release results. The old hosted Claude artifact has not been modified.

## Files and endpoints

- `drizzle/0014_oregon_fire.sql`: additive `fire` schema, source catalog, immutable import versions, normalized records, private rejected records, verified links, approved explanations and boundary reference. RLS prevents anonymous direct table reads.
- `src/lib/oregon-fire/`: source registry, classification, geometry checks, ArcGIS pagination, resumable imports and read queries.
- `src/components/oregon-fire/`: client-only map, filters, list and details. URL query parameters preserve year, layer, search, agency, method, purpose, status, bounds, zoom, list cursor and selection.
- `GET /api/oregon-fire/records`: filtered list (50 per page), full matching count, source counts, aggregated statewide map or individual geometries, options and data status. Pagination is explicit through `nextCursor`.
- `GET /api/oregon-fire/records/[id]`: geometry, meaning, original sanitized attributes, date precision, separately reported acreages, observed history, verified related records and approved explanations.
- `GET /api/oregon-fire/sources`: per-source coverage, actual last success, overdue state, import counts, unlocated and held records.
- `GET /api/oregon-fire/export`: all filtered source records as CSV, including provenance, observed timestamps and coverage note. Exports do not stop at the list page or map display limit. Formula-leading cells are escaped.
- `GET /api/cron/sync-oregon-fire`: existing cron authorization; six-hour schedule configured in `vercel.json`. Long imports checkpoint and resume; BLM/FACTS refresh when weekly cadence is due.

## Run locally

Use Node’s environment-file loader so quoted values in `.env.local` are interpreted correctly. Never print the environment or connection string.

```sh
npx tsx --env-file=.env.local ingest/apply-migration.ts drizzle/0014_oregon_fire.sql
npx tsx --env-file=.env.local ingest/oregon-fire/sync.ts
python3 ingest/oregon-fire/prepare-fod.py
npx tsx --env-file=.env.local ingest/oregon-fire/fod.ts
npx tsx --env-file=.env.local ingest/oregon-fire/evidence.ts
npm run dev -- --port 3100
```

The migration has already been applied to the configured database. Apply migrations before starting imports. The CLI supports repeated `--source` flags and `--force`. A leased run is already owned by another worker; do not start concurrent workers for the same source. A failed source should be retried with the same command after its issue is resolved. The CLI reports a failed source and exits; other selected sources can be run independently. Cron records failures and continues within its bounded invocation.

FOD uses the official seventh-edition SQLite archive, verifies the catalog SHA256, then produces an Oregon JSONL extract and manifest in `runtime-data/oregon-fire/` (ignored by Git). It imports 1992–2024 occurrence points. Source coordinates are approximate; the Census generalized Oregon boundary check can exclude source-coded Oregon points outside that geometry. The original release remains the reference when reviewing such discrepancies.

ArcGIS imports first capture a complete object-ID inventory. Requests explicitly ask for WGS84 coordinates and only allowlisted public fields. Oversized queries and transfer-limited responses are split. All IDs must be retrieved; the final inventory and source edit timestamp must match before publishing. Short transient service failures get bounded retries. Genuine empty inventories can publish successfully. Missing source geometry is retained privately in `fire.rejections` and reported in coverage. It is never given an invented point.

The importer records source schemas, coordinate metadata, query scope, retrieval dates, per-record SHA256 hashes and failures. An active-source pointer changes transactionally only when the import succeeds. Read queries retain the previous successful source snapshot after a failure. Rolling sources keep observed history even when a record disappears; an archived observation is labeled as absent from the latest feed, without inferring cancellation. Full-inventory history remains in storage and in a selected record’s observed history.

## Interpretation rules

BLM and FACTS polygons are treatment areas, not measured burned footprints. FACTS activities consumed by wildfire appear in wildfire context. Pile-burning methods are prominent. PNW status codes are retained, and “In Progress” remains ambiguous. No statewide unique-fire total is presented.

Verified IRWIN IDs can connect occurrences; FOD takes precedence over a matching recent WFIGS occurrence. Historical perimeters remain a separate view. ODF occurrence/NWCC enrichment and uncertain spatial matching are not blindly added to counts. Verified project/unit/document links can be added to `fire.links` with an evidence URL; no inferred NEPA URL is presented as verified.

Original attributes and geometry are preserved alongside normalized fields and simplified display geometry. Acres reported for treatment, reported fire size and mapped polygon area stay separate. Source-reported years outside 1800 through five years beyond the current year are retained as unverified dates, with the original year visible in details, rather than entering the timeline. This handles observed values such as 8888 and 1001 without deleting records.

Future acquired data can use distinct `registration`, `permit`, `ignition` and `accomplishment` record kinds. Source-specific adapters and verified join keys are required before importing those records; the public catalog currently labels these acquisitions as pending.

## Contributions and editorial review

The existing contact form is prefilled from a verified record ID with its source URL, proposed correction/explanation, supporting evidence, contributor connection and publication preference. The server resolves the source itself rather than trusting a supplied URL. Contact submissions remain private in the existing workflow. No new public write endpoint was added.

An editor reviews evidence, accuracy, permission, attribution and geometry meaning. Approved text can be entered into `fire.explanations` with its supporting URL, attribution, reviewed date and `publication_approved=true`; the public query returns only approved rows. The Woodpecker account is a source-linked story without a map pin pending verified unit geometry. Identified tribal/cultural prescribed-burn records are held from public queries; do not override those holds without the agreed program review. Detection depends on source fields, so stewards must still review coverage and attribution.

## Release and operational limits

- Edan authorized release on September 11, 2026. Representative-record review with Jenna and Dominic is outstanding. Inspect examples of pile burns, wildfire-consumed treatments, planned/monitoring units, old occurrence points, perimeters, unknown dates, and the Woodpecker story.
- ODF SDS history, DEQ/LRAPA permits, ODA fields, refuge/park histories and LTDL are acquisition workstreams, not completed imports. No request has been sent.
- ODF’s rolling feed returned zero rows in the verified snapshots; this does not establish that no Oregon burning occurred.
- Six-hour archives run only after deployment with the existing cron secret and a hosting plan supporting the configured schedule and 300-second invocation. Large first imports should use the CLI; weekly imports may span scheduled invocations.
- Source counts and dates come from successful imports. They establish extraction coverage, not jurisdiction-wide completeness. Current WFIGS covers 2026; missing 2025 occurrence history needs the relevant archive beyond the FOD baseline, though Explorer has 2025 perimeters.
- Generalized boundary checks preserve intersecting cross-border polygons but may reject approximate points near a border. Review those source discrepancies before making jurisdiction-level totals.
- Preserve runtime downloads and database backups separately from this repository. The committed evidence file is a review snapshot, not a replacement for those archives.
