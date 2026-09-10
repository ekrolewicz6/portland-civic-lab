# Evidence integrity and additional facade checks

Implemented September 9, 2026, following the code/geometry expansion. This is additional implementation, not completion of the full code inventory or technical review system.

## Changes

- Project revisions now export/import a versioned evidence bundle containing facts, geometry/query snapshots and PDF extraction. SHA-256 verifies the serialized payload against accidental changes. A checksum is not a signature or proof of truthful evidence. Original PDF bytes are not embedded. Legacy project-only files remain readable.
- Imports reject unexpected schema versions, invalid document page references, excessive nesting, dangerous object keys and claims that PDF extraction verifies substantive compliance. Imported site snapshots remain inert report data; they are not trusted as new GIS answers or recomputed decisions.
- Project switching cancels PDF workers and remounts geometry/query controls. Late callbacks from a prior project are ignored. Replacing geometry marks its prior derived facts unconfirmed. Failed/restarted parcel queries replace stale report snapshots with unavailable/pending state.
- Uploads require authentication. New files use account-scoped, immutable object names containing their byte hash. The server identifies PDF/PNG/JPEG signatures and rejects empty/unsupported/oversized files. Header detection does not prove complete format validity, malware absence or plan correctness.
- Production storage must be a private Supabase bucket. Local development stores files outside public assets. Download checks account ownership and verifies stored bytes before serving an attachment. Existing public upload paths are not accepted by this new workflow; old files were not deleted or migrated. Reviewer delegation/sharing is not implemented by the owner-only endpoint.
- Document metadata registration checks the actual owned file. Attachment checks both document and application ownership, locks the application row, allows only draft/info-requested/corrections-needed states, verifies the bytes and avoids duplicate links. Existing application JSON file references still need a full migration to document IDs; this change does not make client metadata authoritative.
- Added accessory siding material/pattern/board-width and street-facing window orientation checks for the bounded over-15-foot accessory path. The source is Portland 33.110.245.C.4.a/d, page 110-25 of the hashed single-dwelling chapter. Windows require a declared complete inventory and all height/width ratios, or matching orientations. These declarations still need independent plan verification. Existing-addition exceptions remain review-required.

## Verification

393 tests pass, including bundle round trips/tampering, document ownership/hash changes, siding boundaries, missing window inventories and malformed ratios. 22 isolated action/database checks pass, including cross-account registration/attachment rejection, duplicate attachment and active-review mutation rejection. Production build, TypeScript and focused lint pass. Browser checked geometry retention, reset on project switch and the save action. Native file import and remote private-bucket operation were not browser-tested; bundle import/export was exercised through unit tests, and storage/action journeys used synthetic local bytes and an isolated PostgreSQL database. No production records were changed.

## Limits and next requirements

The source inventory is still not a complete reconciled obligation inventory. Complete structural, electrical, mechanical, plumbing, solar, fire and site packs remain unimplemented; comprehensive plan interpretation, room/member/equipment schedules and independent reviewer answer keys remain necessary. No end-to-end 100% compliance conclusion is enabled. All-code compliance remains false even if the selected checks pass.

The 25 MB upload limit is an application limit, not a guarantee that the deployment proxy accepts that size. A production large-file path still requires an authenticated direct-upload or multipart workflow with server verification. Staff document access must be explicitly linked to authorized review assignments. Public legacy documents need a separately reviewed migration. Unified authenticated application/evidence revisions, original document retention policies and a complete requirement-to-evidence matrix remain unfinished.
