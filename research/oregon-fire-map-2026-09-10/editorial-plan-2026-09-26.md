# Fire in Oregon: explain the decisions — September 26, 2026

Status: proposed editorial and implementation plan. This pass changes research documents only. No site code, public story, dataset, email or deployment has been changed. Public credits remain Edan Krolewicz and Dominic Kuklawood.

## What the next version should accomplish

A visitor should be able to explain why a particular place might be burned, why another place might need a different approach, what people are trying to protect, and what evidence would establish success. The map already shows records, recent wildfire boundaries and severity; the next step is connecting those observations to a documented decision.

The central question should be **“What are we trying to protect—and what would show that the work helped?”** Our editorial recommendation is to organize around that question. The site should investigate management choices rather than assume that every treatment, every wildfire, or every unburned forest has the same value.

## What changes in the existing site

| Existing feature | Proposed improvement | Evidence or acquisition gate |
|---|---|---|
| Four landscape cards | Keep them; revise the western-forest card to include diverse histories and new tree-ring evidence. Add a short explanation of Indigenous stewardship, fire exclusion and changing climate. | Study geography and time span must be visible; no statewide fixed burn interval. |
| Place search | Add reviewed place profiles: vegetation, public land manager, water/community/habitat objectives and linked projects. | Verify each spatial intersection; a town reference point is not a vegetation classification. |
| Three stories | Keep the case studies and add one connected decision story with accessible stages. | Independently public documents and permission-cleared assets; no composite person or invented scene. |
| Satellite comparison | Retain it as a regional observation; add a separate historical ground-photo pair. | Actual dated, matched viewpoints, original captions, rights and a contemporary repeat image if available. |
| Burn-window guide | Connect weather, smoke, crew and preparation constraints to a documented project timeline. | Only name a delay reason if a source records it. |
| Management-objective panel | Add an “objective → action → observed result → still unknown” project record. | Observations and causal conclusions remain distinct. |
| Forest-area graphic | Keep area context; add a narrowly defined progress measure for one reviewed project or data-review program. | Define target, denominator, date and overlap rules before displaying a percentage. |
| Source records | Add treatment sequences, cost definitions, original identifiers and explicit match confidence. | Preserve original activities; don't merge overlapping polygons by appearance. |

## First story: a forest through time and a decision today

Working title: **“Why burn a forest?”** This is an editorial explainer grounded in public evidence, not a personal testimony.

Opening draft, subject to ecological review:

> A fire map can show where a boundary was drawn. It cannot, by itself, tell us what people hoped to protect or what happened to the plants, water, wildlife and communities inside it. Those questions need a closer look at the place, the work and the evidence.
>
> Begin with the landscape. In many dry pine forests, recurring fire helped maintain a more open structure. Other Oregon ecosystems have different histories and needs. Today's choices also face a changing climate and the needs of people who live nearby. [OSU ecological overview](https://extension.oregonstate.edu/catalog/pub/em-9340-ecological-effects-fire)

Five scenes:

1. **What changed here?** A documented historical photograph and its repeat view, with dates and visible changes annotated. Put an uncertainty label alongside the image: photographs alone do not establish why a change occurred. Pair with a tree-ring or stand-history explanation where it concerns the same place; otherwise label it as a separate example.
2. **What matters here?** Readers select trees, water, wildlife or community. Show the project's actual objectives and whose objectives they are. Selecting an interest changes the explanation, not an invented suitability score.
3. **What choices were available?** Compare the alternatives in the public decision document, including deferral/no action where considered. Explain the proposed treatment sequence, likely burdens and evidence gaps. Do not generate a simulated outcome or operational burn recommendation.
4. **What happened?** Align dates for preparation, ignition, accomplishment, later wildfire and observations. Prescribed-fire boundaries, wildfire perimeters and ecological assessments get different legends. A wildfire can produce varied effects within one perimeter; a spatial overlap is not proof of treatment effectiveness.
5. **Did the work help?** Show observations against the stated objectives, costs with their accounting scope, shortcomings and the next measurement needed. Link back to the existing Egley study as a separate evidence example, not as proof for a different project.

Choose the pilot by documentary completeness, not dramatic imagery. Woodpecker remains useful for purpose and implementation; its geometry, repeated measurements and costs are still acquisition needs. Do not pretend a historical photo collection depicts Woodpecker. Until a full pilot is available, publish the general explanation and linked existing cases as distinct examples.

## Specific public evidence that changes the plan

**Western forests need a more nuanced card.** The Oakridge-area study summary reports 16 sampled sites with site-average historical intervals from 6 to 165 years. That supports explaining variability and Indigenous stewardship, not assigning a universal 5–20-year schedule. Suggested revision: “Western Oregon forests have varied fire histories. Some wet forests had long intervals; research also documents frequent fire in parts of the western Cascades, including landscapes shaped by Indigenous stewardship. A local history and present-day conditions matter more than an east-versus-west rule.” [OSU study summary](https://news.oregonstate.edu/news/western-cascades-landscapes-oregon-historically-burned-more-often-previously-thought)

**The historical images exist.** Start with [Blue Mountains repeat photography](https://research.fs.usda.gov/treesearch/25667) and [northeastern Oregon high-mountain repeat photography](https://research.fs.usda.gov/treesearch/3079). The latter includes Wallowa, Elkhorn and Greenhorn locations. These are acquisition candidates, not cleared assets: inspect the actual plates, original dates, camera locations and per-image credits. Their repeat observations end in 1992 and 1999 respectively, not today. Historical conditions are context, not a guarantee of future suitability.

**There is another treatment-data source to evaluate.** [TWIG](https://reshapewildfire.org/resources/twig-data-resources/) aggregates activity records and documents duplicate, cost and unit flags. Evaluate it against existing FACTS/BLM imports before adding records. Its documentation contains integration roadmaps whose scheduled dates have passed; verify actual delivered coverage. The [live layer](https://gis.reshapewildfire.org/arcgis/rest/services/Hosted/Treatment_Index_View/FeatureServer/0) exposes cost and provenance fields. No Oregon records were imported in this pass. The linked [NFT/GARP explorer](https://nft.garphub.org/) returned 403; request an authorized export rather than assuming access or coverage.

## Cost storytelling: make comparisons meaningful

Proposed panel: **“What does this number pay for?”** Put preparation, treatment delivery, repeat maintenance, incident response and measured losses in separate categories. Show gross expenditure and receipts separately. Appropriations, obligations and actual expenditure must not share an unlabeled axis. Report original dollars and dollar year; use a named inflation series only for comparisons that need it.

The [ICS-209 instructions](https://www.nifc.gov/sites/default/files/NICC/2-Predictive%20Services/Intelligence/ICS%20209%20Fillable%20PDF%20Form.pdf) distinguish estimated incident cost to date from projected final cost and exclude damage assessments from those response-cost fields. The [national suppression table](https://www.nifc.gov/fire-information/statistics/suppression-costs) is federal suppression spending, not Oregon's total fire bill. Its parsed table ended in 2023 at this check; do not label it a current-year total.

Cost-per-acre is a descriptive ratio, not a savings estimate or measure of success. Match cost and area to the same geography, reporting time and activity. Use actual accomplished acres where documented; never quietly substitute permitted or polygon acreage. Never sum successive cumulative cost reports. A project that did not encounter wildfire cannot be assigned observed avoided-loss savings. Include smoke/health burdens, response safety and ecological effects when evidence exists; otherwise mark them unmeasured.

For one pilot, request an itemized ledger, staff/in-kind accounting, funding sources, activity dates, treatment acreage definition, maintenance schedule and a final cost reconciliation. Compare treatment alternatives within that documented context before attempting comparisons with emergency response.

## Implementation order and completion criteria

**1. Editorial update and story outline.** Revise the landscape wording, develop the five scenes, add plain-language definitions for intensity, severity, fire regime and old growth using reviewed sources. Keep the opening short. Completion: every factual paragraph has a source, geographic scope and review status; no invented targets or implicit agency endorsement.

**2. One evidence-rich visual case.** Acquire two or three real historical/repeat photographs, one project decision and its observations. Request permission for any personal account separately. Completion: dates, credits, rights and location certainty are recorded; story stages and map/list views share URLs; no unverified burn pin; mobile and keyboard interactions work without forced scrolling.

**3. Treatment and cost reconciliation pilot.** Inspect TWIG metadata and an Oregon sample, classify methods, compare stable source identifiers, and investigate flagged values. Completion: one documented project sequence with reconciled costs and unknowns; pagination, repeat treatments, changed source records, duplicate/uncertain matches and missing costs handled explicitly. Missing cost never becomes zero.

**4. Local accountability view.** Extend reviewed place profiles, connect monitoring, and add a defined progress measure. Example: “Monitoring reports found for X of Y completed burn records reviewed,” clearly labeled as documentation coverage, not ecological success. Completion: reproducible denominator, source/date and deduplication policy; no statewide “good fire” percentage.

## Implementation notes for this repository

Reuse `FireGuide`, `FireStories`, `FireComparison`, `FireDecisions`, `PlaceFinder` and the current map; do not add a second mapping stack. Put detailed narrative on a dedicated story route linked from the guide if the main page becomes too long. Preserve current filters, selected records, accessible chapter links and reduced-motion behavior.

Extend the public evidence model with: claim ID, supported text, public source URL and locator, geographic/time scope, review status, uncertainty, reviewer/date, related record IDs and match basis. Add photo fields for observation date, photographer, rights, viewpoint, geometry precision and transformations. Add cost fields for incident/project/activity ID, reporting date, accounting basis, cost scope, currency/year, original units, acres basis, cumulative/final status and quality flags. Store protected source material outside the public application and repository; public evidence records contain only material cleared for publication.

Proposed tests: accepted-versus-unreviewed evidence visibility; source/date preservation; no private material in builds/exports; cost units and cumulative reporting; overlapping treatment IDs; missing observations; direct story links/back navigation; mobile photo controls; source links and map synchronization. Do not add numerical fire simulations without an appropriate validated model and explanatory limits.

## Acquisition and review queue

- **Andrew Merschel / OSU Tree Ring Lab:** request study-specific interpretation, site boundaries and reusable fire-history figures. Public contact: andrew.merschel@oregonstate.edu, listed on the [lab projects page](https://treeringlab.forestry.oregonstate.edu/trl-projects).
- **Kori Blankenship / TNC LANDFIRE:** request Oregon coverage guidance and treatment-data crosswalks; public contact kblankenship@tnc.org, listed in [publisher guidance](https://www.conservationgateway.org/collections/land/modifying-landfire-geospatial-data-local-applications/). Keep public-data inquiry separate from source attribution.
- **TWIG/ReSHAPE stewards:** confirm versions, delivered sources, cost definitions and error flags; ask for a small sample and crosswalk before bulk ingestion.
- **Thomas Stokely / TNC Oregon lead:** seek ecological/wildlife review. The [2023 TNC report](https://www.nature.org/content/dam/tnc/nature/en/documents/ImpactReportScienceFinal2023.pdf) confirms historical association; current role and direct contact need checking.
- **Historical photo custodians:** request original plates, reuse terms and any newer repeat views. No automatic assumption that every image in a government report is government-owned.
- **District project staff and cost custodians:** request an existing full project packet, not a generic endorsement. Ask for a fee estimate before chargeable work.
- **Tribal programs, smoke/public-health expertise, community/water representatives and independent ecological reviewers:** invite review of the particular story and its values, including alternative interpretations. Indigenous knowledge and locations require agreed disclosure.

Check the existing outreach ledger and September 24 sent log first. No new messages have been sent. Preserve the active ODF acquisition path; do not replace it on the strength of an opinion about missing spatial data.

See [the dated source manifest](editorial-sources-2026-09-26.json) for inspection depth, access failures and limits. This is a targeted research pass, not a complete scientific, legal or economic review.
