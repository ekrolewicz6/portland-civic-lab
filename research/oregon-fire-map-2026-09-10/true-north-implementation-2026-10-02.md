# Fire in Oregon · true-north implementation

Updated October 2, 2026. This records the first public-guide release and the evidence gate for the landscape investigation; it does not claim the 90-day project is finished.

## Public changes prepared

- The main page now leads with eight connected chapters and a linked question index. It connects mechanics, place, history, choices, money, research evidence, aftermath, and action without requiring the atlas or video to understand the argument.
- The most prominent money example is the Oregon Department of Forestry's actual calendar-2025 implementation account: $50,984,180 expended through thirteen programs. The graphic shows Forest Legacy, Federal Forest Restoration, Landscape Resiliency, and the remainder separately. It is not labeled a burn budget or a project invoice. The hypothetical teaching calculator remains on the deeper economics page.
- A maintenance visual uses the published Davis et al. treatment-age comparison, with the study population and limits visible. A separate explanation distinguishes the Pacific Northwest federal suppression-cost study from a western avoided-damages analysis.
- The new `/oregon-fire/landscapes` page introduces the investigation, its three candidate areas, the records needed to choose one, and the current unqualified status. It has a canonical page description, Article metadata, source links, and a correction/record-submission path.
- The charter, one-page brief, question/claim register, candidate screen, and acquisition/delivery register are linked from this directory's README. Private interview materials, correspondence and receipts remain outside the repository and build inputs.

## Source checks

- [ODF's official report, pages 1 and 8–9](https://www.oregon.gov/odf/aboutodf/documents/2025-odf-sb83-landscape-resilency-strategy-implementation-report.pdf) supplies the total and program amounts. The report's page 6 describes ODF tracking work; our investigation is intended to complement, not duplicate, it.
- [Davis et al., Figure 3 and section 3.2.1](https://research.fs.usda.gov/download/treesearch/67659.pdf) reports mean relative severity reductions of 66% when wildfire reached treatments within ten years and 28% after more than ten years across the analyzed groups. These are not a maintenance deadline or local forecast.
- The [Economic Journal study](https://doi.org/10.1093/ej/ueag037) concerns federal suppression costs for the studied Pacific Northwest Forest Service settings. The [separate western avoided-damages account](https://www.perc.org/2026/05/07/beyond-wildfire-suppression/) has a different outcome and research population. Neither multiplier is applied to a pilot.

## Outreach and selection

The ODF records request and DEQ ecological-permit exchange are active; do not duplicate them. Two focused new requests for a completed unit and attributable spending record were submitted September 30 to Ashland and the Deschutes Collaborative. Gmail Sent and the required shared send gate recorded both submissions; delivery and response are unconfirmed. Exact messages, contact evidence, hashes, and receipts are held privately. Wallowa Resources has a separate October 2 meeting in Edan's reporting trip, so no new cold request was sent to that organization.

No landscape currently passes all three selection conditions: project boundary, completed activity tied to expenditure, and a custodian able to clarify the records. Reassess when written records arrive. Do not publish a dossier, local savings number, or scenario on the basis of candidate status alone.

## Verification

`npx tsc --noEmit --incremental false`, `npm run lint`, and `npm run build` passed. The build's ORESTAR preflight passed separately. The focused Playwright guide test passed for question navigation, the documented spending example, moving the hypothetical calculator out of the main narrative, landscape status, and mobile horizontal fit. The desktop opening, spending chapter, and landscape introduction received a screenshot review; the landscape headline was reduced afterward and the production build and focused browser tests were rerun.

Before a full pilot release, still required: linked expenditure and unit records, method review for any local modeling, community and scientific review of substantive interpretation, versioned calculations and exports, and a five-reader comprehension test. These are dependencies, not features to fabricate for an early launch.
