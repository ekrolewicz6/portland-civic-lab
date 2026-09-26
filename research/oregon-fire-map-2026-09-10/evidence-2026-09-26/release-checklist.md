# Release evidence — September 26, 2026

## Implemented and acquired

- Server-rendered `/oregon-fire/stories/why-burn`, five anchored chapters; Woodpecker dossier at `/oregon-fire/projects/woodpecker`.
- Public objectives, implementation timeline, explicit evidence gaps, glossary, documented-purpose metrics, region profiles and source/correction links. Photography remains held pending rights; first chapter uses an original explanatory graphic.
- Mechanical classification/filter; complete 71,970-ID inventory fetched, 63,364 public Oregon-intersecting mechanical source records. These are activities, not distinct burns.
- BLM refresh: complete 36,966-ID inventory, 36,675 public and 25 held records; added project/treatment identifiers preserved.
- WFIGS 2025 backfill: 2,518 public Oregon-intersecting occurrence records, reconciled by verified IRWIN identity. Current WFIGS includes 110 records with positive to-date estimates and a report timestamp; these are provisional incident estimates.
- All four ODF feeds refreshed successfully with valid empty responses. Earlier observations are retained.
- TWIG/Common Attributes: metadata plus 100-row, allowlisted reconciliation samples saved outside Git; not additional public records or a complete coverage finding.
- 108-link source audit: 97 working, six redirected, four access-blocked, one unverified; no confirmed missing links. See link-checks.json for timestamps and limitations.
- Existing sent log reconciled; new targeted drafts unsent. No outreach messages sent during implementation.

## Verification

- Application and ingestion TypeScript checks passed.
- Full repository ESLint passed.
- Production Next.js build passed, including the isolated Fire in Oregon checkout.
- 21 ingestion assertions passed: geographic intersection, IDs/pagination, repeated activity, date/classification/acreage semantics, aggregation holds, public evidence validation and costs.
- Storage integration passed: repeat imports, changed geometry, JSON representation, private holds, atomic publication, failure retention.
- Rolling lookup integration passed: successful publication, valid-empty retention, rollback-only cleanup; no fixtures left behind.
- Focused Playwright: 13/14 passed in the complete real-data run; the remaining contact-confirmation assertion was updated to the existing queued-delivery wording and passed separately. All 14 scenarios passed; no real contact request was sent.
- Manual browser: desktop/mobile story, chapter navigation and console; OG image rendered and visually checked. Mobile byline contrast corrected.
- Default real-data query returned 50 records and 11,367 matching map/list records in approximately 2.3 seconds during the final benchmark; this is a local observation, not a latency guarantee.

## Public claims and visuals

- Woodpecker: OSU public account, site-selection/planning/implementation paragraphs; public catalog stores evidence locators and limitations.
- Western fire history: Oakridge-area OSU study summary; scoped locally, not a statewide interval.
- Ecological definitions: OSU EM 9340 and planning guide; glossary links original publications.
- Egley and Finley remain separate cases; no Woodpecker outcome is inferred from them.
- Social card and decision diagram: original editorial graphics, not historical evidence. NASA imagery retains dates/credits. PNW-GTR-315 image pair remains unpublished and rights unresolved.
- Every future project claim requires approved evidence references; approved project parser rejects unsupported references. Unapproved projects/evidence are absent from public catalog/API/export.

## Remaining acquisition and review gates

Independent ecological review and Edan/Dominic review are pending before production promotion. Woodpecker geometry, decision alternatives, monitoring, itemized costs and photo rights remain outstanding. Broader permit imports, reviewed treatment-cost comparisons, quantitative RAVG/LCMS products, vegetation/watershed/habitat layers, smoke attribution and additional place profiles require the source-specific work in the registry and acquisition queue. No statewide effectiveness score or savings estimate is published.

Private interview, identity and analysis stay outside the repository, application database, public assets and build inputs. Research and raw runtime data are excluded from deployment. The preview checkout contains only Fire in Oregon changes; concurrent unrelated work is preserved separately.

## Review deployment

Preview: https://portland-dashboard-dhv8rrfi2-ekrolewicz6s-projects.vercel.app/oregon-fire/stories/why-burn

Vercel remote production build succeeded. Deployed story HTML and Woodpecker API verified; record links remain empty because geometry/crosswalks are unverified. Deployed social endpoint returned a valid 1200 × 630 PNG. Private transcript/attachment paths were absent from local server file traces. Promotion to the public production domain is pending the plan's co-author/ecological reviews; no approval or endorsement is implied.

Deployed mechanical API verified against real data: 50 paginated records, 17,843 matching 2021–present records, and matching aggregated map total. Activity CSV returned its provenance/date-precision fields. These are source-specific record counts, not unique fires.
