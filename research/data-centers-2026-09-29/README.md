# Data-center article revision — September 29, 2026

Scope: `/deep-dives/data-centers`, its article-specific components and model, plus its teaser on the deep-dive index. This is a local editorial and calculator revision. Production publication is authorized and follows the final checks. No outreach is included. Unrelated working-tree changes were preserved.

## Editorial corrections and evidence

| Issue | Revision | Record checked |
| --- | --- | --- |
| Economic output confused with taxpayer payback | Separates output ROI, employee-income-tax ROI and incentive additionality. Uses net-return definitions; reproduces the rural calculation from Figure 20. | [February 2022 impact study](https://www.oregon.gov/biz/Publications/Property_Tax_Incentivies_Impact_Study.pdf), figures 17 and 20, section 9.1 |
| Investment denominator | $15.4B/$15.8B describes data centers within the long-term rural program, not its share of all Oregon data-center investment. | [Business Oregon, June 26](https://www.oregon.gov/energy/get-involved/Documents/08-Alex-Albertine-Michael-Held-DCAC.pdf), slide 4 |
| Employment definitions | Reports the 7,600 direct-contribution jobs for 2025 and 2,630 on-site operating jobs using 2024 data separately. Removes the unsupported explanation that construction and multipliers reconcile them. | Business Oregon slide 2; [ECONorthwest preliminary analysis](https://www.oregon.gov/energy/get-involved/Documents/2026-07-31-ECONW-Understanding-Data-Center-Industry.pdf), employment slides |
| Historical subsidy per job | Dates the audit comparison to 2016 using 2015 observations; does not call it the current causal price of a new job. | [February 2023 reporting on the audit](https://www.governing.com/finance/oregon-tax-breaks-to-big-tech-not-always-beneficial). Secondary attribution is explicit. |
| Tax-program coverage | Distinguishes the standard-zone authorization pause from long-term rural zones and SIP. | Business Oregon slide 4 |
| Electricity protections | Limits claims to covered utilities and their implementation. Uses PGE's reported +29.7% data-center and −1.3% residential average rate changes effective July 8. | [PUC presentation](https://www.oregon.gov/energy/get-involved/Documents/01-Nolan-Moser-Bret-Stevens-DCAC.pdf); [PGE SEC filing](https://www.sec.gov/Archives/edgar/data/784977/000119312526326379/por-20260630.htm) |
| Hillsboro procedures and pause | Presents allegations as allegations, includes the city's published administrative explanation and distinguishes the July 27 land-use pause from state tax rules. Previously submitted projects can continue. | [City Q&A](https://www.hillsboro-oregon.gov/Home/Components/News/News/17404/); [July 27 announcement](https://www.hillsboro-oregon.gov/Home/Components/News/News/17551/). City pages were accessible through indexed text when direct requests failed. |
| School-funding effects | Explains equalization and exceptions for districts above formula funding, capital bonds and certain local-option receipts. | [ODE presentation](https://www.oregon.gov/energy/get-involved/Documents/2026-07-31-OR-Dept-Education-Revenue-Impact-Presentation.pdf), slides 5 and 11–13 |
| Regional verdicts and conditions | Replaces unsupported regional probabilities with evidence questions. Six conditions are explicitly proposed standards, with authorities, reporting and remedies. | Source links accompany each condition; the recommendations are editorial judgments, not universal current law. |
| Participation | Replaces expired event guidance with the October 24, 5 p.m. written-comment deadline and final recommendations expected before year end. | [Official committee page](https://www.oregon.gov/energy/get-involved/pages/oregon-data-center-advisory-committee.aspx); [September 10 preliminary report](https://www.oregon.gov/energy/get-involved/Documents/2026-09-10-DCAC-Preliminary-Learnings.pdf), page 2 |
| Reporting provenance | Adds source links for selected published positions, a dated methodology and correction history. Removes assertions that every recording was reviewed or that testimony establishes representativeness. | Selected committee documents, not new interviews. |

## Contract checks

The [signed 2021 The Dalles/Wasco agreement](https://www.opb.org/pdf/AGR%202021%20Wasco%20County%20City%20of%20The%20Dalles%20SIP%20for%20Google%20Design%20LLC_1769200135514.pdf), definitions and Exhibit A, provides an arithmetic check: $600M × 1.10% = $6.6M hypothetical full tax. Project 1 pays the greater of 50% and $3M, giving $3.3M. Project 2's share is 60%. These totals already include the specified taxes and fees. Tests cover the share and minimum without double-counting.

The [Morrow County April 5, 2023 minutes](https://www.morrowcountyor.gov/sites/default/files/fileattachments/board_of_commissioners/meeting/16576/4-5-23_board_minutes_9-00_am.pdf), page 6, establish selected SIP terms, not a full annual cash-flow schedule. The article explicitly declines to present either case as a verified forecast of actual collections.

## Model boundaries

- Local public receipts exclude state income tax. Combined Oregon receipts add modeled employee income tax and state construction receipts.
- Both outcomes have editable construction probabilities, a no-build land-revenue baseline and a common operating life.
- Analysis can extend beyond abatement, with full property tax in later operating years.
- Fixed annual total or tax-share payment with a floor; optional upfront payment and a share that changes in a later year.
- Entered annual public costs and construction receipts are probability-weighted and discounted.
- Results are real-dollar present values with constant assessments, receipts and costs. Year 1 simplifies construction and upfront timing.
- School-funding redistribution, alternative development, assessment schedules, environmental costs, cleanup, corporate taxes and utility franchise fees are not fully modeled.
- Zero costs mean unpriced, not no cost. A positive fiscal result does not establish environmental or legal acceptability.
- No-build probabilities are illustrative assumptions, not geographic measurements.
- The cash-flow CSV includes the inputs, perspective, annual flows and expected-value totals.

## Verification

- `npx vitest run tests/datacenters-engine.test.ts`: 13 meaningful calculation tests, including stepped payments and chart endpoints.
- `npx tsc --noEmit`: project type check.
- `npx eslint 'src/app/(public)/deep-dives/data-centers' src/components/deep-dives/datacenters src/lib/datacenters tests/datacenters-engine.test.ts`: scoped lint.
- Initial headless `agent-browser` check: article loads with meaningful content, expected controls and no framework overlay.
- `node research/data-centers-2026-09-29/verify-browser.cjs`: calculator perspectives, probability changes, post-abatement years, contract arithmetic, CSV parity, cost edge case, reset, all article navigation anchors, disclosures and mobile layouts. The script asserts no page/console errors or same-origin HTTP errors.
- Redesign preview: `http://127.0.0.1:3166`. Override with `DC_PREVIEW_URL`.
- Browser evidence defaults to `/tmp/data-centers-redesign`; override with `DC_VERIFY_OUTPUT`. Viewports: 1440px, 1024px, 768px, 390px and 320px.
- Generated social preview: exact metadata URL returned HTTP 200 with an image/png response; visually inspected.
- Full production build and production deployment are outside this verification.

## Remaining reporting work

Reconcile the employment estimates with their authors; obtain complete project valuation and payment schedules; check subsequent court dispositions and utility orders; obtain new responses if original reporting is commissioned. These gaps are disclosed in the article. No new responses or undocumented evidence were invented to fill them.


## Visual redesign requested before publication

The user asked for a more visual, easier-to-read article and clickable real-world examples. The page now uses an original bargain diagram, two possible-future paths, a sourced Morrow County revenue waffle, a school-funding flow, water questions, distinct ROI charts, an investment-share bar, jobs-definition comparisons and six concise agreement tests. Longer explanations remain in native disclosures.

The calculator starts from the signed The Dalles agreement's Project 1 illustration, with Project 2 and a Hillsboro program illustration one click away. Each selection replaces the entire input set. Sourced terms, assumptions and user edits are labeled. All examples begin with the same build probabilities; they are not estimates of a site's bargaining power. No result is presented as an audited project return.

The Hillsboro example uses the published maximum city fee of 33% in years 1–3, then 50% plus 15% school support in years 4–5. Value and rate are assumed and the application fee is omitted. The source is the City of Hillsboro's [data-center program explanation](https://www.hillsboro-oregon.gov/community/data-centers). These fee ceilings do not establish an actual project's payment or current eligibility.

Results include expected-value comparison bars, a probability cutoff with an exact break-even control, and cumulative discounted receipts. The break-even point is a probability threshold, not a payback year. The shaded years identify the incentive period. Mobile links connect the assumptions and result panels. CSV downloads include every input and yearly payment, allowing the stepped rule and contract examples to be checked independently.
