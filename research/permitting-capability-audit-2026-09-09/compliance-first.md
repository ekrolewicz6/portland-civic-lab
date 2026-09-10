# Revised priority: an independent, evidence-based compliance checker

September 9, 2026. This direction supersedes the original audit's implementation sequencing. The user has clarified that payments and government-system connections are deferred. The immediate product objective is to perform substantive code and zoning checking correctly, whether or not a government ever grants system access. The original operational findings remain valid, but they are not the present development gate.

## The actual product to build

Given a project description, location, applicable code date and sufficient plans/evidence, produce a reproducible assessment of every applicable requirement: what complies, what conflicts, what evidence is missing, what is outside implemented coverage, and what requires an interpretive or discretionary determination. Each conclusion must identify the governing provision, factual inputs, source evidence, exceptions and calculation or reasoning path.

The independent output is a technical compliance report. It can support an applicant correcting a design before submission, a designer checking a plan set, or a reviewer checking work. Government permission to issue permits or access a case-management API is not needed to build and validate this product. A government connector can later transport the same report and evidence.

**The current app does not yet do this comprehensively.** Its main shortcomings are substantive: a small set of checks, incomplete applicability logic, missing or mismatched facts, disconnected zoning evidence, metadata-only document checks and heuristic review suggestions. Removing the payment/issuance requirements from the audit does not remove these gaps.

**Eligibility for a permit without plan review is not proof that the proposed work complies with all codes.** The trade-permit shortcuts therefore cannot stand in for full electrical, mechanical or plumbing design checking. A fence exemption is similarly one requirement determination, not an all-code certificate for its location or construction.

## What accuracy requires

The target should be complete and correct coverage of a declared supported scope. It must not become a broad guarantee about arbitrary drawings, hidden site conditions or every possible legal interpretation.

Six separate questions must be answered:

1. **Source completeness:** have all governing provisions and incorporated dependencies been identified for the scope, including definitions, amendments and exceptions?
2. **Applicability correctness:** have we selected the correct jurisdiction, specialty codes, versions, project/occupancy class, overlays and other triggers?
3. **Evidence completeness:** are every required fact and measurement available, in consistent units, attached to the correct property and drawing revision?
4. **Evaluation correctness:** does each executable rule correctly implement the provision, including boundaries and exceptions?
5. **Coverage honesty:** are missing implementations and unresolved inputs explicitly visible rather than omitted from the result?
6. **Change correctness:** do altered plans, revised facts or applicable rule changes invalidate and rerun affected conclusions?

Passing 100% of implemented checks is insufficient if some applicable requirements have never been implemented. A passing unit test is insufficient if the test's expected result repeats the same mistaken interpretation as the code.

### Result contract

Keep rule applicability and rule result separate:

- Applicability: applicable, not applicable with an explicit reason, or unresolved.
- Result: satisfied, violated, insufficient evidence, determination required, or not implemented.

An overall **complete compliance result for a stated scope** is allowed only when the applicable requirement inventory has been reconciled, all applicable checks have supported satisfying results, and no applicability question, missing evidence, unimplemented requirement or required determination remains open. Show the exact scope and factual assumptions with the result. A known violation remains visible even if other checks are unresolved.

Evidence has its own status: applicant-declared, extracted/unconfirmed, confirmed against a cited document, authoritative public record, or professionally certified. Do not silently treat a declared property line or AI-read dimension as surveyed truth. A calculation may be correct conditional on that input while independent physical verification remains outstanding.

The interface should say, for example, “This measurement satisfies the stated limit in this code version, based on the cited plan,” rather than imply verification of something the system did not observe.

Returning unknown for everything would avoid unsupported passes but would not solve the user's problem. Measure both incorrect conclusions and the proportion of representative work the checker actually resolves. Completion means useful, tested coverage of the declared scope, not abstention alone.

## Work that can proceed without government access

| Dependency | Independent approach now | Limitation to surface |
|---|---|---|
| Governing codes | Versioned source register from adopted codes, amendments, interpretations and referenced standards; lawful public or licensed access. | A code-summary webpage or unavailable incorporated standard is not complete coverage. |
| Zoning/property | Public GIS/map records and dated exports; user-supplied survey and site plans; explicit parcel matching. | Missing/private prior decisions or ambiguous parcel geometry remain unresolved until evidence is supplied. |
| Project facts | Structured measurements and scope questionnaire; plan schedules and calculations; manual confirmation of extracted facts. | An answer is not necessarily independently verified physical truth. |
| Plan checking | Document parsing, drawing/schedule extraction, geometry and unit validation, cross-sheet consistency checks, deterministic technical calculations. | Poor scans, missing details and engineering facts cannot be assumed from filenames or narrative summaries. |
| Review expertise | Independently commissioned qualified plan/code reviewers; published interpretations and decisions; adjudicated validation cases. | Interpretive disagreement needs documented resolution; the software should not manufacture certainty. |
| Workflow | Local, revisioned project/evidence/rule results and reproducible report exports. | Official issuance is outside the current product endpoint and does not gate technical evaluation. |
| Failure testing | Frozen public-data fixtures, unavailable-service simulations and synthetic/adversarial plans. | Test fixtures must model realistic project conditions and code versions. |

Oregon BCD maintains specialty-code programs, adopted-code access, interpretations and site-specific design-criteria resources. These are appropriate starting points for a controlled source register, rather than a single generic “building code” source. [Oregon State Building Code](https://www.oregon.gov/bcd/codes-stand/Pages/index.aspx).

Portland's Title 33 directory separates base zones, additional development regulations, overlays, plan districts and other provisions. On this audit date it links a full code effective July 1, 2026 and separately lists a November 1, 2026 upcoming ordinance. The checker must distinguish effective rules from future changes. [Title 33 Planning and Zoning](https://www.portland.gov/code/33).

No complete provision inventory has yet been built for these sources. The directory is a starting point, not a claim that this audit has encoded or verified every provision.

## Architecture and acceptance requirements

### 1. Build a provision-by-provision coverage ledger

For each supported project path, record: provision ID, source/version/effective period, applicability trigger, cross-references and exceptions, required facts, evaluation method, implementation status, test IDs and unresolved interpretation. Traverse references, definitions, tables, footnotes and alternative compliance paths. Classify every relevant provision as executable, evidence/attestation dependent, interpretive/discretionary, administrative, or not applicable with rationale.

Do not use the 180-form count, 28-zone count or six-path allowlist as the denominator. The denominator is the independently reviewed set of applicable requirements for the declared project class. Coverage percentages remain unknown until that inventory exists.

Candidate source families include Portland zoning and local building provisions, the applicable Oregon structural/residential/trade/energy/fire provisions, trees, signs, stormwater/site requirements and referenced design standards. Include these only where the project triggers them. Cross-bureau rules still matter even when their systems are not connected.

### 2. Replace loosely named form fields with a canonical project model

Use typed project, parcel, building, space, assembly, equipment, measurement and document-revision entities. Every quantity needs units and a source. Model occupancy/use, existing versus proposed conditions, new units, alterations, structures, property boundaries, overlays and construction scope explicitly. Form schemas map into this model through validated adapters.

Immediately address the reproduced material/mount/valuation key mismatches, false certification handling, unsupported enum values, document object/ID mismatch and legacy conditional expressions. Missing height, material, site data or professional evidence must not become a passing default.

### 3. Separate applicability from evaluation

Determine which rules govern before testing facts against them. Record why a requirement applies or is excluded. A base zone is only one input. Dates, overlays, plan districts, use, existing decisions, project scope, exceptions and specialty-code applicability can change the governing rule set.

No network response or missing record must ever mean “no restriction.” Cache and uploaded exports must retain provenance and effective dates. Use fixtures so engine development continues even when public services are unavailable.

### 4. Read substantive evidence

First support reliable structured inputs and deliberately chosen plan formats. Add extraction from drawings/schedules with page/region citations, units and confidence. Compare the same fact across sheets, the form and calculations. Require confirmation or return insufficient evidence when extraction is uncertain.

Examples of actual checking: the dimension used for a setback must come from the correct property boundary; an exit-width fact must correspond to the relevant space and occupant load; a solar load check needs actual roof/system/design facts. Uploading a file named “site plan” does none of that.

AI may propose facts or candidate rules. Deterministic validated rules consume confirmed facts. A model's general opinion that plans look compliant must never bypass missing requirements or unknown evidence.

### 5. Preserve conclusions through revisions

Bind every result to a project revision, evidence hashes, rule-pack version and evaluation-engine version. Changing material, dimensions, occupancy, equipment or drawings invalidates affected results. A report must be reproducible without the original live GIS/API being available.

This revision work remains a priority even though payment/issuance integration is deferred: it is part of technical correctness, not merely departmental administration.

### 6. Validate with an independent answer key

Each rule needs positive, negative, threshold, unit-conversion, exception and missing-input cases. Cross-rule tests must cover contradictions and combined triggers. Use property/metamorphic tests where the expected relationship is valid for that rule; do not assume all code relationships are monotonic. Mutation testing should establish that changing a limit or exception actually makes a test fail.

Create expert-adjudicated complete cases that were not authored by copying the implementation. Review disagreements and supporting provisions. Include realistic scans, missing sheets, inconsistent measurements and alternative compliance paths. Report false compliance, false violation, applicability errors, unimplemented requirements and unresolved evidence separately.

Initial gates: no known unsupported pass; all provisions accounted for in the supported scope; all required test classes represented; independent validation complete; rule/input/evidence provenance complete; and meaningful resolved coverage on representative cases. Zero observed errors does not prove universal 100% accuracy, so publish the validation scope and uncertainty rather than an unlimited guarantee.

## Revised sequencing

**First: the correctness foundation and source/coverage inventory.** Fix the current failing contracts, define explicit unknowns, establish versioned rules and canonical evidence, and prevent a partial check from producing an all-code conclusion. In parallel, inventory the substantive requirements for the construction paths already advertised.

**First complete vertical slice: fence compliance for a precisely declared site/project class.** Evaluate material, height, location, visibility, applicable zoning, pool/protected-site triggers and other identified requirements. Produce distinct exemption and compliance findings. Include exceptions and excluded site classes in tests, not in an assumed generic pass. A real geometric/evidence-aware fence report is a better foundational demonstration than a successful approval flag. [Portland fence guidance](https://www.portland.gov/ppd/residential-permitting/home-projects/fence-permits).

**Next: a bounded residential/ADU compliance path.** Extend the same machinery to actual zoning geometry and a documented prescriptive building scope, including every triggered discipline and required trade interface in the coverage ledger. Building, fire/life safety, energy and trade requirements not yet implemented must remain visible. Do not label the whole ADU compliant after checking setbacks and height alone. This is the test of whether the architecture scales beyond simple thresholds.

**Then: narrow technical trade and solar rule packs, followed by additional residential and commercial paths.** Check the underlying design requirements, not just no-plan-review eligibility. Select expansion using rule reuse, actual user projects, availability of credible evidence and independently testable completeness. Engineering/alternative-method and discretionary paths can have well-defined supported checks without a false overall conclusion.

The order is a development strategy, not permission to advertise narrow coverage as comprehensive. Every user-facing project report must display its real supported scope and outstanding requirements. Government access is not a prerequisite for any of the engine, corpus, evidence or validation work above.

## Current audit findings that matter most now

| Priority | Existing evidence | Immediate technical consequence |
|---|---|---|
| Unsupported automatic conclusions | Trade scope gaps and actual UI-field mismatches in fence/solar/FIR. | Replace approval-by-slug with requirement-level evaluation and explicit coverage. |
| Unknown facts treated as clear | Missing numeric defaults, failed overlay calls and dropped review warnings. | Introduce applicability/evidence states and prevent all-code pass on unknowns. |
| Incomplete zoning wiring | Submission lacks reliable canonical parcel and full development standards. | Evaluate a versioned property/project snapshot consistently in every entry point. |
| No substantive plan checking | One-byte declared plans pass document metadata checks. | Parse/confirm actual content and bind measurements to the correct drawing revision. |
| Missing source/exception/version coverage | Narrow checks and overly broad suspension logic. | Build the source/requirement ledger before claiming completeness. |
| Results survive changed facts | Approved application edits and problematic resubmission behavior. | Invalidate technical results and recompute dependency-linked checks. |

Evidence remains in [rules coverage](rules-coverage.csv), [isolated results](test-results.csv), and [immutable code source links](sources.md). This revision changes priorities and acceptance criteria; it does not assert the implementation is complete. No application code was modified in preparing this revised assessment.

Payments, finance reconciliation, City write APIs and official permit issuance are deferred. Secure handling of real plans/personal information remains necessary if such data is used, but those production controls do not prevent offline development with synthetic or appropriately shared evidence.
