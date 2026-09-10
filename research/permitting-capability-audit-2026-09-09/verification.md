# Verification record and limits

Audit date: September 9, 2026. Source commit: `23b4670d8d26b9093f6e401bb89d9d6f30d8506d` in `ekrolewicz6/portland-civic-labs`. This is a different repository from the civic-dashboard workspace in which these deliverables are saved.

## Scope and isolation

The exact target source archive was downloaded and extracted under `/private/tmp/portland-permits-audit-20260909/source`. Pinned dependencies were installed with `npm ci --ignore-scripts --no-audit --no-fund` (742 packages). No target application source was patched. Build-generated files and synthetic audit databases were confined to temporary/audit locations. No application was created in production, no production attachment was uploaded, no payment was charged and no notification was sent.

The [deployment record](evidence/deployment.json) preserves the production deployment ID, alias, repository and commit observed through the Vercel connector. The deployment was READY. Runtime-log requests under the team scope returned access errors; private runtime/service configuration was not established. This is an evidence-access limitation, not proof that a service is disconnected. Source fallbacks and missing adapters are assessed separately.

## Read-only public production observations

Browser inspection used Chrome through the computer-use browser API. The agent-browser CLI was unavailable. No authentication/persona mutation or sensitive-record access was attempted.

| Surface | Observation | Limit |
|---|---|---|
| [Homepage](https://www.portlandpermits.org) | Loaded; explicit independent-demo notice; public tools and navigation; advertised 175 form types, 14 categories and selected automation/time claims. | Does not demonstrate backend completion or legal accuracy. |
| [All forms](https://www.portlandpermits.org/forms) | Loaded; displayed 180 entries and category totals consistent with source inventory. | No state-changing form journeys performed in production. |
| [Parks category](https://www.portlandpermits.org/forms/parks-recreation) | Eight forms linked from the category. | Links do not prove successful conditional branch validation or booking integration. |
| [Picnic application](https://www.portlandpermits.org/apply/picnic-reservation) | First page rendered contact fields and wizard controls; no browser error messages observed in the checked log slice. | The eight-schema condition failure is reproduced by evaluating conditions in isolation; the report does not claim the initial public page necessarily crashes. |
| [Zoning](https://www.portlandpermits.org/zoning) | Screen rendered. A read-only lookup of the public City building address `1900 SW 4th Ave, Portland, OR` returned “Address not found” / “Could not check zoning”; no error entries appeared in the checked browser log slice. | One failed lookup is not proof all addresses fail. A successful live GIS result was not demonstrated. Public lookup is also distinct from evidence passed into submitted applications. |

The tool could not export a browser page through the browser-content export method; structured DOM observations were used instead. Public observations above are a contemporaneous audit record, not archived screenshots of every page. The report does not claim all 180 routes were manually navigated in production.

## Isolated functional harness

[run-audit.cjs](evidence/run-audit.cjs) loads original TypeScript functions using the pinned TypeScript transpiler in memory. It substitutes only database connection, synthetic cookies, network blocking, notifications, and Stripe contract responses. The real schema, form loader, validators, pipeline, server actions, authorization helpers, query logic and webhook handler run against synthetic records. Schema creation SQL is taken from the original seed script; only synthetic identities/forms/applications are inserted. No production connection string is used.

The harness uses PGlite in memory and Drizzle. This exercises query/write behavior but is not a concurrency, multi-instance serverless, storage durability or production PostgreSQL test. It does not run a browser against the isolated app. Representative journeys invoke the original server actions and inspect their persisted results; browser-level wizard validation is evaluated separately through the original schema converter. Stripe signature verification and external settlement are mocked. Webhook tests prove application contract/state defects, not acceptance by a live processor.

Reproduce with an exact baseline checkout and its pinned dependencies:

```sh
node /Users/edankrolewicz/portland-civic-lab/research/permitting-capability-audit-2026-09-09/evidence/run-audit.cjs /absolute/path/to/baseline-checkout
```

An optional third argument changes the evidence output directory. The harness blocks network access and suppresses notification effects. It deliberately enables synthetic development personas inside the isolated process to exercise the original auth helpers.

### Results

- **180 schemas/catalog entries** reconciled with registry presence. Category counts are in [catalog-reconciliation.csv](catalog-reconciliation.csv).
- **69 individual recorded scenarios: 34 gaps and 35 controls/within-scope operations.** [Machine-readable JSON](evidence/test-results.json), [CSV](test-results.csv).
- **119 upload-containing forms; 105 reproduce the client file-object/string-ID mismatch.** This is a conservative reproduced count, not proof the other 14 are correct. Conditional branches/exceptions and fixture choices affect which validation is reached.
- **8 condition-schema exceptions:** athletic-field-permit, facility-reservation, film-photography-permit, non-park-use-permit, picnic-reservation, public-event-parks, research-park-permit, wedding-reservation.
- **6 document-contract mismatches:** adu-permit, commercial-building-permit, demolition-permit, land-use-review, residential-building-permit, solar-permit.
- **165 no-default-review results** under empty context; 162 slugs absent from the explicit mapping and 3 intentionally empty trade entries.
- Empty-form checks did not pass for any entry. **Eight threw rather than returning an actionable validation result.** Do not report this as 180 cleanly validated error paths.

Generated complete-field fixtures are synthetic coverage probes, not legally valid applications or browser-valid final submissions. They fill fields to expose wiring and pipeline behavior; some exceed text-length guidance or choose conditional combinations that require review. Thus 167 human-review results, 8 exceptions and 5 automatic approvals describe these fixtures, not expected real-world permit mix.

### Important scenario coverage

| Requirement | Evidence | Result/limit |
|---|---|---|
| All six auto paths, positive and empty cases | `BASE-*`, `EMPTY-*` | Five baseline autoapprove; solar document mismatch blocks. Empty fixtures never autoapprove. |
| Fence material/height boundaries | `FENCE-WOOD-*`, `FENCE-MASONRY-*`, `FENCE-CHAIN-*`, `FENCE-POOL` | Internal numerical criteria work when engine-specific keys are supplied; actual UI material/location cases demonstrate gaps. |
| Solar and FIR boundaries | `SOLAR-25`, `SOLAR-OVER`, `SOLAR-GROUND-INTERNAL`, `FIR-50000`, `FIR-OVER`, `FIR-STRUCTURAL-INTERNAL` | Correct encoded comparisons are controls, not validation of the legal criterion. Real form fields differ. |
| Out-of-scope trades and certifications | `PLUMB-MEDICAL`, `MECH-COMMERCIAL`, `ELECTRIC-LICENSE`, `CERT-FALSE`, `BAD-EMAIL` | Missing scope/license and server type/attestation enforcement reproduced. Mechanical eligibility still requires exact scope interpretation. |
| Missing/unavailable property evidence | `GIS-OUTAGE`, `OVERLAY-DROPPED`, baseline cases without zoning | Failed overlay requests become empty/false; automatic path can discard discipline routing despite warnings. Source also shows missing development-standard wiring. |
| Documents | `DOC-CONTENT`, `DOC-EMPTY`, `DOC-MIME`, per-catalog mismatches | One-byte declared PDFs accepted; zero-byte/wrong declared MIME rejected. No actual content parser exists to test design correctness. |
| Applicant-to-reviewer persistence | `JOURNEY-adu-permit`, residential, commercial, demolition, land-use, TI, sewer UC | First six create local review records; UC creates none. These are action-level journeys, not full verified browser-to-City flows. |
| Corrections and amendments | `CORRECTION-RESUME`, `CORRECTION-REVIEW-REPLAY`, `EDIT-AFTER-APPROVAL` | Correction case not loaded by draft route; 4 ADU reviews become 8 on resubmission; approved data can be overwritten. |
| Unresolved/pending reviews | `REVIEW-BLOCKER`, `REVIEW-NO-ROWS`, `REVIEW-PENDING-CONTROL` | Blocker and empty-set gaps; an actual second pending review correctly keeps case in review. |
| Authorization | `OWNERSHIP-DRAFT`, `REVIEW-ROLE-CONTROL`, `ACTION-NO-AUTH`, `PDF-NO-AUTH` | Good ownership/reviewer-role controls coexist with unguarded pipeline/print handlers. No live exploit attempted. |
| Duplicate submissions/work | `SUBMIT-REPLAY`, `PIPELINE-REPLAY` | Same residential submission increases document links from 5 to 10; repeated pipeline creates more runs/work. |
| Payment amount, ordinary events and retries | `PAYMENT-*` | Caller price accepted by application contract; approved case remains paid/approved in modeled ordinary sequence; other path issues draft; replay/history and late failure defects. No live charge/signature test. |

Not every conditional branch of every form was exhaustively tested. That comprehensive requirement belongs in the acceptance suite before each service is enabled. No production settlement, deliverability, concurrency/load, restore drill, real document engineering validation, live City adapter or end-to-end inspection/occupancy test was possible from the present implementation/access. Missing workflow families are classified as missing rather than represented by fabricated test success.

## Existing engineering checks

| Check | Result |
|---|---|
| `npx tsc --noEmit` | Passed; output log empty. [Log](evidence/typecheck.txt). |
| `npm run lint` | Failed: **5 errors, 60 warnings**. [Full log](evidence/lint.txt). Includes script typing and application lint issues; not all warnings are runtime faults. |
| `npm run build`, restricted network | Failed to fetch Google Inter font. Environmental fetch failure, not proof the source cannot compile. [Log](evidence/build-initial-network-failure.txt). |
| `npm run build`, approved network retry | **Exit code 0; compiled, TypeScript ran, and 36 static pages generated.** It also emitted repeated PGlite/WASM `Aborted()`/`unreachable` errors during page-data/static work, and an edge-runtime static-generation warning. This was not a clean runtime-health result. [Recorded outcome](evidence/build-verification.txt). |
| Existing application test suite | No dedicated test script/suite found for these permit/finance/lifecycle behaviors. The audit harness is a new external verification artifact, not a modification to application tests. |

Build success does not resolve the isolated functional defects. The runtime messages reinforce the need to prove the configured production database path and fail closed rather than silently select local PGlite. The audit does not infer that production currently uses that fallback.

## Historical analysis review

The target strategy document was inspected at the immutable baseline. Its underlying dated 48,590-permit/5.9-million-activity snapshot and exact cohort computation were not bundled with the target repo. Consequently those totals, correction rates and derived predictions were not independently reproduced.

The related current civic-dashboard scripts were read as contextual methodology evidence, not treated as the exact immutable source of the target app’s claims:

- [analyze-permit-bottlenecks.ts](/Users/edankrolewicz/portland-civic-lab/ingest/analyze-permit-bottlenecks.ts): positive completed elapsed observations, row-weighted review medians, distinct permit counts, duration-ranked “last” review, correction-received row counting. No actual staff-minute measurement; no uniform application cohort date filter in the shown aggregate.
- [analyze-permits.ts](/Users/edankrolewicz/portland-civic-lab/ingest/analyze-permits.ts): aggregate processing-day summaries with its own filters.
- [create-housing-matviews.ts](/Users/edankrolewicz/portland-civic-lab/ingest/create-housing-matviews.ts): other stage-day aggregates exist; these were not conflated with a validated causal model.

These scripts can create/update database objects, so they were not executed as part of this read-only methodology review. No claim is made that their current database matches the strategy’s March 2026 snapshot. A future baseline extraction should use read-only queries, explicit source hashes/dates and matched per-case endpoints.

The official eight-month workload PDF was downloaded from its public source and rendered with Poppler. The complete one-page table was visually inspected. The parsed counts used in the impact model match the visual table. Annualization and saved-minute/coverage assumptions are separately labeled. This report does not treat proposed tree-code changes or draft SDC rules as adopted law, and does not use legacy fire design guidance as a current numerical code specification.

## Rebuilding the tables and report

```sh
python3 research/permitting-capability-audit-2026-09-09/evidence/build-deliverables.py
python3 research/permitting-capability-audit-2026-09-09/evidence/build-registers.py
python3 research/permitting-capability-audit-2026-09-09/evidence/finalize-report.py
```

The first builder expects the temporary baseline source path described above. If that directory has been removed, restore the exact source archive there or change `SRC` to an exact baseline checkout. Source hashes are in [source-file-hashes.csv](evidence/source-file-hashes.csv). IDs in the registers link to [sources.csv](sources.csv); schema URLs in every matrix row are pinned to the commit. A compact evidence manifest and QA results accompany the final artifact.
