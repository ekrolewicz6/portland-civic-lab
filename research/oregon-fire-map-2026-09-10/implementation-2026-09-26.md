# Fire in Oregon implementation — September 26, 2026

## Public delivery

The next edition follows place → objective → choices → work → evidence. `/oregon-fire/stories/why-burn` is a server-rendered five-chapter story; `/oregon-fire/projects/woodpecker` is its source-based dossier. Woodpecker has regional context only. A new unit pin, long-term monitoring, alternatives, costs and photos require supporting records. Historical photography and Egley remain separate examples.

The atlas links the story, project, glossary and curated documentation coverage. Western-forest wording now recognizes local fire-history variability. Place profiles for Corvallis and Burns link documented examples; no ecology is assigned to a Census point. NASA imagery has a side-by-side alternative to the keyboard-accessible slider. Shared map/story URLs remain supported. Story/project metadata, social imagery, structured data, sitemap and correction prefilling are included.

## Data and interfaces

New mechanical classification, FACTS mechanical source, 2025 WFIGS backfill, BLM NFPORS/project fields, FACTS preparation/funding/cost/project fields and dated WFIGS cost estimates extend the existing complete-run importer. TWIG and FACTS Common Attributes remain unscheduled, held reconciliation pilots. Costs remain dated cumulative/projected estimates; missing cost is not zero.

Additive migration `0017_oregon_fire_projects.sql` stores versioned public projects, evidence and activities/observations/costs/media/claims, plus explicit candidate relationships. The catalog is version-controlled and validated; `publish-projects.ts --dry-run` verifies it, and publication is transactional. Public endpoints expose projects, individual dossiers, place context, activity CSV and assessment availability. Record details paginate related records and expose only explicitly linked project IDs. No spatial/name resemblance creates a verified project link.

MTBS availability is reviewed separately from advertised layers. Newer/test layers are not approved merely because capabilities lists them. Fire year is distinct from assessment date; unmapped ground and upstream failure are explicit. Quantitative raster summaries and RAVG/LCMS overlays remain gated on verified inputs; display tiles are never used for area calculations.

Interactive reads use one repeatable-read snapshot and one filtered result for counts, map cells and paginated rows. Migrations 0018–0019 add a rolling-record lookup maintained atomically by a database trigger and an index for run/kind/year filters. The trigger supports both old and new importer deployments. Import invocations own dedicated connections. Transient upstream fetch timeouts retry without changing publication rules.

## Acquisition and source evidence

- `endpoint-registry-2026-09-26.json`: master source registry, query recipes, stages, limitations and rights/approval states.
- `evidence-2026-09-26/endpoint-probes.json`: dated metadata/sample evidence; bounded samples do not establish complete coverage.
- `acquisition-queue-2026-09-26.md`: packet checklist and targeted unsent requests.
- `outreach-ledger.csv`: actual sent dates and ODF portal status reconciled against the September 24 log.
- `editorial-sources-2026-09-26.json`: historical-photo inspection and TWIG coverage corrected.
- `coverage-matrix.csv`: actual completed imports with original last-success timestamps; prior matrix preserved in the evidence directory.

The historical PNW-GTR-315 PDF is stored outside Git in runtime-data, with checksum/provenance. Front-matter rights need per-image resolution. No generated historical imagery is used. Public narrative comes from independent public documents; private background material stays outside the repo, database, media and deployment.

## Refresh and operations

Six-hour cron retains rolling feed observations. Weekly sources use bounded resumable imports; monthly histories refresh without replacing good snapshots on failure. Reconciliation pilots require explicit invocation. Project/evidence/asset changes require review. Link checks distinguish 404, soft-404, redirects, blocked access and transient failure.

## Remaining external dependencies

ODF’s September 24 portal request, ODA and September 24 custodian requests remain active. DEQ/LRAPA/Crater Lake and new targeted drafts are unsent. No fees or partnerships are implied. Woodpecker’s unit geometry, formal alternatives, repeat measurements and itemized costs are unavailable. Photo reuse, tribal/cultural disclosure and independent ecological review remain pending. These gaps are visible in the edition; no placeholder dataset or invented outcome fills them.

Broader RAVG/LCMS summaries, LANDFIRE vegetation, ownership/priority layers, HUC12/drinking-water context, habitat, verified smoke attribution and additional permit imports can be added through the same framework after acquisition. The registry specifies source endpoints and next actions; the implementation does not claim those records have arrived.

## Verification and release

Acceptance covers complete inventory pagination, geographic intersection, classification, repeated activities, privacy, cost/date semantics, publication filtering, related-record pagination, unavailable data, source links, mobile layout, keyboard access, shared URLs, metadata, exports and contact prefilling. Run application/ingestion typechecks, lint, production build, node ingestion tests, storage integration check and focused Playwright. Use preview for Edan/Dominic and ecological review before promoting the new narrative.

See the dated release-evidence file for actual command results, import counts and preview status. No real outreach is sent by acquisition or tests.
