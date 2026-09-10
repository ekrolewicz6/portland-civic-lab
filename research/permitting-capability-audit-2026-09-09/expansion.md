# Code and geometry expansion — September 9, 2026

This tranche adds usable checks and source collection without government credentials. It does not complete the overhaul. No permit family has a verified complete code pack, and `allCodeCompliance` remains false. No production release is included.

## Delivered

- Collected 183 PDFs from nine Portland Title 33 group indexes. Stored original URLs, download dates, SHA-256 hashes, failures and page counts. Indexed 1,492 distinct section references, including cross-references, contents and deleted provisions. Neither count measures executable coverage.
- Added a searchable source inventory at `/compliance/coverage`. Downloaded sources remain marked unreviewed until provision-level reconciliation; existing checks carry selected source hashes in reports. Changed source hashes and removed rules invalidate prior review.
- Expanded ADU eligibility: zone/dwelling/unit-count paths, both minimum-lot tables, detached-unit configuration, frontage exceptions and short-term-rental restrictions. Legal primary-structure eligibility and Type B rental determinations still require evidence/review.
- Added selected single-dwelling accessory rules: height, combined and individual footprint limits, bounded detached-structure setback exception, F2 screening, roof/trim/eave alternatives, uncovered-deck encroachment and detached mechanical-equipment setback conditions. Contradictory footprint totals cannot pass. Required base setbacks are inputs, not derived from the complete zoning code.
- Added Oregon R310.1 escape-opening applicability and access-path checks for one identified room, including bounded mechanical-basement and storm-shelter exceptions. Opening sizes, wells, operation, all-room coverage and sprinkler alternatives remain incomplete.
- Added explicit unit conversion for dimensional facts; incompatible units become unknown. Tests exercise inclusive thresholds and metric/imperial conversions.
- Added supplied-plan polygon measurement: areas, footprint containment, minimum distance to classified parcel edges, self-intersection rejection and concave-boundary crossing detection. Input is a single local-feet parcel ring and footprint ring, not an independently verified survey or drawing interpretation. A synthetic example and SVG preview are available.
- Added public parcel lookup followed by whole-polygon queries of six mapped layers: zoning, historic, environmental conservation/protection, design and plan district. Wrong coordinate systems, ambiguous parcels, API errors and truncated results do not become absence of constraints. These layers are not the complete site-constraint inventory.
- Added optional evidence fields to ADU, deck, mechanical, residential-building, FIR and conversion forms. The shared evaluator consumes them; no automatic approval is enabled.

## Verification

375 unit/regression tests pass, including 180 catalog smoke cases. Fifteen isolated action/database integration checks pass with external effects disabled. Production build, TypeScript and focused lint pass. Test totals establish tested behavior, not professional validation or complete regulatory accuracy.

Browser verification on localhost:3107 confirmed the synthetic parcel area of 5,000 sq ft, footprint of 400 sq ft, and front/side/rear distances of 45/5/35 ft. The geometry-use action ran on the ADU workspace. Public City Hall coordinates (-122.679071373584, 45.515004690242) returned parcel R246102 and six successful queries: zoning 1, historic 1, environmental conservation 0, environmental protection 0, design 1, plan district 1. The displayed zoning was CX/d/CC. This is a connectivity/example check, not independent verification of City GIS accuracy. Source-inventory navigation rendered 183 PDFs and 1,492 references.

A label-based service selector failed in browser automation; its accessible combobox selector succeeded. Native file-picker automation was not independently verified in this tranche. Project export preserves confirmed facts and their source references; raw site-query/geometry context is included in the evidence report, but is not restored by project-only import. Switching or importing a project clears old report-side evidence to prevent stale association.

The earlier full-repository lint baseline has five unrelated errors. GitHub Actions previously could not start due the account billing/spending-limit block. Earlier Vercel preview builds succeeded but were login-protected; current local results are recorded separately from hosted verification.

## Source basis and reproducibility

Primary source links:

- [Portland Title 33 index](https://www.portland.gov/code/33), plus its nine chapter-group indexes.
- [ADU chapter](https://www.portland.gov/sites/default/files/code/205-acc-dwelling-unit_0.pdf); eligibility compared with pages 205-1/2 in [Update 214](https://www.portland.gov/sites/default/files/changes/2025/060125_packet214_MPAP_web-complete.pdf).
- [Single-dwelling chapter](https://www.portland.gov/sites/default/files/code/110-sd-zone_2.pdf), selected accessory pages 110-23 through 110-27.
- [Screening chapter](https://www.portland.gov/sites/default/files/code/248-landscape.pdf), selected F2 provision.
- [Oregon R310 amendment](https://www.oregon.gov/bcd/codes-stand/Documents/23orsc-R310-amend.pdf), effective October 1, 2024.
- [Oregon electrical code hub](https://www.oregon.gov/bcd/codes-stand/Pages/electrical.aspx). The amendment table is not the complete NEC and contains redline text; it was not converted into an electrical rule pack.

Original PDFs and extracted page text are stored locally at `/Users/edankrolewicz/portland-permits-code-corpus/2026-09-09`. Git contains manifests and the section index, not the full PDF corpus. Download timestamps are UTC (September 10), corresponding to September 9 locally. Reproduce from the app checkout:

```sh
python3 scripts/compliance/collect_sources.py /path/to/code-cache
node scripts/compliance/index_sources.mjs
npm test
npm run test:integration
npm run typecheck
npm run build
```

Recollection can change manifest bytes; do not update executable source hashes until changes have been reviewed. Section detection is text-based and does not interpret tables, figures, cross-reference scope, exceptions or legal effect. The corpus is not a reconciled July 2026 consolidated enactment. Future-dated amendments must not activate merely because they are downloadable.

## Remaining work, in priority order

1. Reconcile enacted code/errata against every downloaded chapter; inventory atomic obligations, exceptions, cross-references and effective-date elections. Review hashes are necessary but not proof of current law.
2. Finish one bounded fence/ADU pack: base setbacks and measurements, primary-structure eligibility, all accessory design standards, overlay/plan-district overrides, site coverage and referenced construction provisions. Build an independently reviewed answer set before enabling any complete result.
3. Extend property evidence to all required hazards, trees, easements and prior conditions; support survey multipolygons/holes and coordinate transformations with accuracy provenance. Public parcel geometry alone cannot establish a legal boundary.
4. Make project evidence a unified, persistent revision including documents, geometry and query responses. Finish private document storage and ownership/byte-existence checks.
5. Expand technical building, electrical, mechanical, plumbing and solar packs using complete lawful source access, diagrams and referenced standards. Oregon amendments alone are insufficient. Do not flatten redlined deletions into active requirements.
6. Develop room/opening/member/equipment inventories and consistent plan extraction, then independently validate them. PDF text extraction and supplied JSON geometry do not establish what an arbitrary plan actually proposes.

These are engineering and validation needs, not payment-system dependencies. Much more can be codified from published sources, but no defensible percentage of total compliance or staff savings exists until the requirement denominator and independently tested project cohorts exist.
