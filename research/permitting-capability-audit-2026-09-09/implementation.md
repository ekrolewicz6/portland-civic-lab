# Compliance implementation — September 9, 2026

This change replaces unsafe automatic approval with explicit, evidence-dependent requirement results and adds a working public review workspace at `/compliance`. It also connects supported facts to the fence and ADU application forms and the server review pipeline. It does **not** complete the eleven-item compliance backlog or establish 100% accuracy across Portland permitting.

The accompanying `compliance-first.md`, `compliance-backlog.csv`, `rules-coverage.csv`, `test-results.csv` and `sources.md` are the prior baseline audit, preserved for comparison. New test evidence is in `implementation-evidence/`.

Baseline: `ekrolewicz6/portland-civic-labs`, commit `23b4670d8d26b9093f6e401bb89d9d6f30d8506d`. Implementation branch: `codex/compliance-engine`. No production applications, payments, notifications or department records were used for testing. This branch does not deploy or migrate production.

## What works now

1. **Requirement-level results.** Each supported check reports its source, inputs, calculation where applicable, and a distinct result: satisfied, violated, missing evidence, determination required, not implemented, or not applicable. Every report explicitly states that the complete requirement inventory has not been established. Missing code never becomes a pass; the six former automatic-approval paths are disabled.
2. **A usable public workspace.** Select any of the 180 catalog entries, enter relevant project facts, evaluate selected fence or ADU provisions, inspect a PDF, export the evidence report, save a project revision and reload it. An edited project recalculates results and marks the saved review outdated. This workflow does not require city-system access or login.
3. **Application-to-review wiring.** Fence and ADU forms include optional property/design evidence. The server uses the same compliance evaluator. Incomplete intake returns for information; complete intake with uncovered requirements routes to staff. It does not become an approved permit.
4. **Stricter intake.** Shared schema validation checks actual options, finite numbers, required certifications, dates, nested addresses, conditional visibility and upload objects. Supported legacy condition operators normalize consistently. Invalid operators fail explicitly. The ADU intake no longer blocks every application above 800 square feet before checking a potentially applicable basement exception.
5. **Actual PDF parsing.** The browser worker parses PDF bytes and extracts text with page and coordinate references. Explicitly labelled fence dimensions are candidates, never automatically verified evidence. It reports conflicting values and pages needing visual review. Results include a SHA-256 byte hash. Invalid/empty files and resource limits produce errors. The browser example follows the same worker path as a selected file.
6. **Conservative GIS behavior.** HTTP-success responses carrying ArcGIS errors and missing/invalid counts are errors, not evidence that an overlay is absent. Cached point data is not imported as confirmed parcel-wide evidence.
7. **Revision and review guards.** Stable report hashing, dependency comparison, serialized pipeline execution, immutable prior pipeline runs, snapshots of superseded findings/reviews, and unique review-assignment IDs prevent known replay and stale-review failures. Staff approval requires a nonempty completed assignment set and no unresolved findings. Generic status/stage actions cannot bypass review to approve or issue. Approved applications cannot be edited through the draft action.
8. **Claims and authentication.** Homepage instant-approval and quantified-savings claims are removed. The catalog count is corrected. Production ignores demo persona cookies; local demo personas remain available for isolated development. Unknown zoning limits are no longer displayed as “no limit” or “no minimum” in the zoning results component.

## Exact rule scope

These are **conditional checks against supplied facts**, not independent verification that the facts describe the site or drawings. A person confirming a fact is not equivalent to an authoritative survey or a complete plan review.

| Implemented subset | Inputs and supported behavior | Important exclusions |
|---|---|---|
| Fence building-permit trigger | Material, measured height, pool use, typical field-fence classification; wood 7 ft, masonry/concrete 4 ft, typical wire/chain-link 8 ft exception thresholds; pool fence requires permit | This determines the checked building-permit exception, not zoning compliance or issuance. Unknown materials and classification remain unresolved. |
| Single-dwelling fence height | RF/R20/R10/R7/R5/R2.5, regulated front area, side/rear setbacks, corner alternative, entrance orientation and pedestrian-connection width | Other zones, fences outside setbacks, complete parcel geometry and overriding site conditions are not implemented. Every fence segment needs a separate assessment. |
| Fence measurement and boundary assertions | Posts/lattice included, grade basis, all components inside property; retaining walls trigger review | No survey verification, wall geometry, easement or utility determination. |
| Fence prescriptive dimensions | Supported wood/metal/wire over 7 through 8 ft: spacing ≤6 ft, footing diameter ≥18 in, embedment ≥3 ft | Three dimensions only. Alternate engineering remains reviewable rather than automatically invalid. Complete structure/material/construction review is absent. |
| ADU living area, 33.205.040.C.1 | Lesser of 800 sq ft or 75% of primary living area after project; larger primary duplex unit used; qualifying basement conversion size exception | Does not establish ADU allowed use, lot legality, unit-count eligibility, base-zone FAR or building compliance. Living-area exclusions must be confirmed. |
| ADU placement, C.2 | Detached/connected ADU at least 40 ft from front lot line or behind defined primary rear wall | No automatic interpretation of drawings, lot orientation, easements, setbacks or building separation. |
| ADU visitability, C.4 | Specified unit-count triggers; lot slope, grade rise and qualifying conversion exceptions; one-unit circular-bathroom path, accessible route, living area and doors | Rectangular bathroom alternative needs geometry review; full accessibility/building-code compliance is not implied. |

Sources reviewed during implementation:

- [Portland 24.10.072](https://www.portland.gov/code/24/10/072).
- [Single-dwelling zoning chapter, 33.110](https://www.portland.gov/sites/default/files/code/110-sd-zone_2.pdf), selected fence pages 110-48/49 dated March 1, 2025 and January 1, 2025.
- [Portland residential fence construction guidance](https://www.portland.gov/ppd/residential-permitting/b3-residential-fences-decks-outdoor-projects).
- [ADU chapter, 33.205](https://www.portland.gov/sites/default/files/code/205-acc-dwelling-unit_0.pdf), selected pages 205-3 through 205-5 dated October 1, 2024. [Update packet 214](https://www.portland.gov/sites/default/files/changes/2025/060125_packet214_MPAP_web-complete.pdf), effective June 1, 2025, replaces pages 205-1/2 rather than these selected development-standard pages.
- [Oregon adopted specialty codes](https://www.oregon.gov/bcd/codes-stand/Pages/index.aspx), used as the unresolved edition/code-family reference, not as evidence of implemented specialty-code coverage.

The source registry records references and versions; it is not yet a complete frozen code corpus. A review date different from the reviewed snapshot causes an explicit determination requirement and suppresses the permit-exception conclusion. This conservative behavior needs replacement with verified effective-date and election logic before routine operational use.

## Verification and its limits

Reproduce with `npm ci`, `npm test`, `npm run test:integration`, `npm run typecheck` and `npm run build`. The new GitHub workflow runs the regression suite, focused lint, production build and type checks. Unit tests include **180 catalog smoke cases**; they do not represent 180 full substantive permit reviews. See the saved logs in `implementation-evidence/` for final counts and results.

The integration harness runs the actual actions against isolated in-memory PostgreSQL. It disables network requests and substitutes external notifications/authentication. It checks anonymous and cross-owner requests, incomplete intake, real form submission, duplicate execution/submission, required certification, immutability of an approved application, corrections, replacement of active review assignments, stale staff decisions, unresolved findings and consequential status bypasses.

Browser verification on the local application:

- A 7-foot wood fence in the front regulated area receives a zoning-height conflict while the checked building-permit exception remains distinct. Changing to 3.5 feet updates the individual result. Saving and changing a revision displays invalidation.
- The synthetic PDF produces separate 7-foot and 9-foot fence-height candidates, page references and a conflict warning. Browser verification found and fixed worker protocol messages being mistaken for completed PDF analysis.
- An ADU area of 751 sq ft with 1,000 sq ft primary living area fails the checked size provision; 750 sq ft satisfies it. Whole-project review stays incomplete.
- The homepage loads with the revised capability descriptions. The narrow browser viewport was visually inspected; controls fit and are readable. Browser logs showed no application errors in these journeys.

The browser automation file chooser failed/stalled; the built-in example was successfully inspected through the same `File`/worker/parser path. A normal operating-system file-selection journey was therefore not independently demonstrated. JSON save was exercised, but import/export round-trip and arbitrary real-world drawing sets still need broader browser acceptance testing. Production integrations and actual staff decisions were not tested. Passing these tests is not a measured real-world accuracy rate.

Full-repository lint has pre-existing failures in the seed script, navigation provider, translation widget and notification bell; focused checks on the changed implementation are recorded separately. These failures are not evidence that the production build failed.

## Remaining work that matters for the user's objective

The detailed status is in [implementation-status.csv](implementation-status.csv). No payment or government integration is necessary to continue the following work:

1. **Establish complete coverage for a bounded fence class.** Inventory every triggered provision, definition, exception and incorporated standard, then independently reconcile that inventory. Finish pool/vision/site/construction requirements or explicitly exclude those cases with enforceable evidence requirements. Only then add a complete-compliance result for that precise class.
2. **Make evidence authoritative and revision-safe.** Add per-fact typed units and provenance requirements; resolve contradictory candidates with a recorded explanation; bind actual plan bytes to application revisions. The current standalone workspace and authenticated application are not yet one persisted evidence system. The existing server upload/download and document-registration paths still need ownership, byte-existence, private-storage and content-validation hardening before sensitive production use. Metadata-only documents continue to block substantive approval.
3. **Replace legacy zoning summaries with versioned applicability.** The old public zoning tables, scenario readiness scores and broader timeline models still contain simplified/unvalidated assumptions. The new pipeline no longer trusts those tables as governing law. A warning label does not correct every old numerical statement. Replace them with provision-backed calculations, parcel polygons, supplied survey/decision imports and explicit uncertainty.
4. **Finish ADU eligibility before expanding claims.** Encode legal-lot, zone/use, primary-building, allowed unit-count, access/frontage and all base/overlay provisions, then the applicable residential, structural, fire, energy and trade code families. The three new ADU checks are not a complete ADU review.
5. **Expand trades and solar through reusable technical packs.** Equipment schedules, listings, loads, capacities, circuits, venting, plumbing sizing, clearances and structural dependencies require actual technical checks. No-plan-review eligibility is not a substitute for design compliance.
6. **Validate with independent answer keys.** Use qualified reviewers to establish expected results for representative plans, exceptions and adverse cases. Measure false passes, false violations, abstentions, evidence sufficiency and staff minutes. Add mutation tests to prove missing/incorrect rules are detected. There is no defensible percentage of full automation or whole-project accuracy yet.
7. **Separate civic-service workflows.** The generic legacy pipeline is not validated for every tax, complaint, grant or administrative catalog entry. The all-catalog matrix reports that limitation; it does not imply building-code review is appropriate for those services. Assign agency-specific rules and routing before operational adoption.

A technically credible “100%” result must specify a complete supported case class, complete provision inventory, known governing versions, sufficient verified evidence and an independently tested evaluator. It cannot include hidden physical conditions, required field inspections or discretionary determinations merely because software records them. This implementation makes incompleteness visible and prevents the known automatic false-approval paths; it does not remove those limits.

## Delivery

[Draft PR #1](https://github.com/ekrolewicz6/portland-civic-labs/pull/1), commit `8d8c5e3b8818aef105ca21251fb01422cf358a87`. Both Vercel preview builds succeeded. GitHub Actions could not start because of an account billing/spending-limit issue. The protected preview requires Vercel login; runtime browser tests were local. Production has not been changed.
