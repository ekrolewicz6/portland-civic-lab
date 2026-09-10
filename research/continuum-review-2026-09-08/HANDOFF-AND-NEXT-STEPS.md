# Continuum page: handoff and remaining work

Last updated: September 8, 2026

## Status at handoff

The rebuild is complete and live at https://www.portlandciviclab.org/deep-dives/continuum. There is no remaining merge or deployment work for the page changes in this task.

- [x] Research, redesign and implementation, including the expanded operational diagnosis.
- [x] Fourteen functions mapped across capacity, workforce, funding, access, handoffs, execution and outcomes.
- [x] Dated capacity comparison, current closure information, cost comparisons, illustrative journeys and expandable sources.
- [x] Seven copyable records-request templates; copying does not send a request.
- [x] Changes committed and pushed on top of existing `main`, without force-pushing or reverting existing work.
- [x] Both connected Vercel deployments succeeded. The public domain was verified on final commit `4f3605f0bc28fd288726ecb6d26eae4a3ebd1f18`.
- [x] Full CI passed, including 42 smoke tests. A stale proposals-page heading assertion was corrected without changing the page's newer wording.
- [x] Desktop/mobile and keyboard verification; live filters, evidence disclosures, budgets and investigation controls checked. No browser errors or production error-log entries were found during verification.

Implementation commit: `fd92501951a5a833176aba591f1582191b95c22e`. Final CI run: https://github.com/ekrolewicz6/portland-civic-lab/actions/runs/34284401497.

**Still outstanding:** records collection, verification of recent operational changes, reader comprehension testing and ongoing evidence maintenance. These are follow-up investigations, not known unfinished implementation defects. No records requests have been sent, interviews conducted, reader tests completed or recurring monitoring scheduled by this task.

## First actions when this work resumes

- [ ] Assign a lead for the evidence follow-up and a lead for reader testing. Suggested coordinator: Edan / Portland Civic Lab; no assignments have been confirmed.
- [ ] Start a records-request tracker with request category, receiving agency, submission date, acknowledgment/reference number, response status, fee estimate, response files and next action.
- [ ] Prioritize usable capacity, workforce coverage and housing vacancies. Use those answers to distinguish missing supply from capacity that exists but cannot be used.
- [ ] Select recipients and send the prepared requests. This handoff does not send messages or approve fees; obtain authorization before either action.
- [ ] Run a small reader test in parallel with the records work.

## Evidence investigations

All seven request templates are available at https://www.portlandciviclab.org/deep-dives/continuum#investigate and in `src/components/deep-dives/homeless/story/InvestigationRequests.tsx`.

The templates currently request September 2025–August 2026, plus the latest available status as of September 8, 2026. Update the reporting window when resuming. Seek existing public aggregates and redacted documents, not individual client, staff or medical records. Request a fee estimate before chargeable work.

| Priority | Unfinished question | Likely records holders | Records / completion criterion |
| --- | --- | --- | --- |
| 1 | How many places can someone actually enter today? | City Shelter Services; County Homeless Services Department (HSD) and Health; Oregon Health Authority (OHA); operators through public funders | Reconcile designed/licensed, funded, staffed, occupied, reserved and closed capacity by site and service. Add admission hours, referral routes, household/access/care criteria and turnaway reasons. Produce a dated usable-capacity table with clear units and remaining unknowns. |
| 1 | Are funded services staffed to deliver the work? | County HSD and Health; City Shelter Services; public contract managers | Compare funded versus filled full-time-equivalent positions, vacancy duration, turnover, planned/actual shifts and caseloads by program and role. Identify demonstrable service reductions. Do not substitute county administrative staffing for provider staffing. |
| 1 | Are moves blocked by units, funding or support? | County HSD; Home Forward; City housing/shelter programs; public housing funders | Compare appropriated, contracted and spent funding; funded housing slots, assistance issued, leases and move-ins; vacant-unit days and delay reasons. Distinguish repair/property-management delays, matching, staffing and missing service funding. |
| 2 | What follows an outreach contact? | City Street Services; County HSD; contracted outreach teams through funders | Obtain definitions and monthly counts of visits, attempts, unique people, new engagement, ongoing support, specific offers and outcomes. Establish coverage and repeat-count rules. Do not calculate a person-level conversion rate from campsite visits or unmatched totals. |
| 2 | Where do accepted referrals stop becoming arrivals? | County HSD; City referral programs; public health and corrections agencies | Seek existing summaries following the same referral group through provider acceptance, reservation, transport, arrival, cancellation and unknown outcome, with delay bands and follow-up responsibility. Include institutional discharge programs where records exist. |
| 2 | Were oversight fixes and contract checks implemented? | County HSD; County CFO/contract oversight; City funders; relevant Auditor's Office | Obtain recommendation trackers, completion evidence, risk classifications, required/completed reviews, corrective actions, target-change approvals and service-continuity plans. Distinguish an announced repair from independent evidence of implementation. |
| 2 | Did people reach housing, and did it last? | County HSD; City shelter/housing programs; providers through funders | Reconcile the FY25 shelter review's inconsistent exit totals. Seek move-in cohorts with follow-up due, confirmed housed, observed returns, other outcomes and unknown status at 3/6/12 months. Publish denominators, coverage and whether retention is confirmed or inferred. |

For each response:

- [ ] Save the original records and provenance in the research folder.
- [ ] Record geography, service scope, observation period, units, definitions and limitations.
- [ ] Update the appropriate diagnostic row, source link and proposed action; change evidence colors only when justified.
- [ ] If records do not exist, distinguish an agency-confirmed reporting gap from information this review simply has not located.
- [ ] Publish a short dated finding and the practical decision it supports, rather than adding an unstructured text wall.

## Dated developments to verify

These are follow-up checkpoints, not scheduled reminders. Check whether plans changed before describing them as completed.

- [ ] Verify whether Northrup's planned September 18, 2026 closure occurred, and update the City's projected winter capacity with an actual dated operating inventory when available.
- [ ] Verify Roseway's planned October 30, 2026 closure and its intake status; update the capacity section accordingly.
- [ ] Verify Letty Owings' announced October 31, 2026 closure, successor arrangements and family-compatible treatment alternatives. Its July admissions pause and planned closure are separate events.
- [ ] Reconcile the County's FY27 plan to cut 605 adult shelter units and 90 family scattered-site vouchers against implementation. Do not add these to overlapping City reductions or mix beds, units, rooms and people.
- [ ] Check results of FY27 program 30302B: $7.13m in placement services, including up to $2.1m for recovery housing; a 465-placement target excluding recovery housing. Targets are not achieved placements.
- [ ] Follow up on the latest SHS report's property-management delays and veteran placement backlog, restrictions on new SHS Housing Only referrals, and smaller supportive-housing sites' staffing/funding constraints.
- [ ] Check whether the planned FY27 review of actual supportive-housing operating costs produces findings and operational changes.
- [ ] Track the $565k team intended to help eligible Home Forward households access Medicaid rent benefits: applications, approvals, payments and continued housing. The $7.8m estimate is a forecast, not realized benefits or savings.
- [ ] Obtain updated detox-to-treatment transition outcomes after subsequent capacity additions. The page's 17% Hooper transfer example describes 2022 assessments and must not become a claim about today's transfer rate.
- [ ] Follow up on the April 21, 2026 Auditor's oversight findings with implementation evidence and dates.

## Reader comprehension and engagement

Proposed next design check: recruit about five readers with differing familiarity with homelessness services. No recruitment or testing has happened yet.

- [ ] Give readers the live page without explaining the intended argument first.
- [ ] Ask them to identify three documented failures, locate each in the continuum and explain what evidence supports it.
- [ ] Ask whether a listed bed is necessarily usable, whether the 2025 capacity gap is a current count, and whether we know today's total staffing shortfall.
- [ ] Ask them to distinguish a documented problem, an access boundary and an unanswered question.
- [ ] Ask them to find one proposed response, the office involved and the records needed to evaluate it.
- [ ] Record misunderstandings, missed visuals, navigation problems and time needed. Include a phone reader and keyboard navigation.
- [ ] Revise labels, visual hierarchy and explanations where readers struggle, then repeat the affected tasks. Keep source detail available through disclosures.
- [ ] Decide whether lightweight engagement measurement is useful. First inspect existing analytics; new event tracking was not implemented or verified in this task. Potential measures: section navigation, diagnosis disclosure/filter use and records-request copying. Treat clicks as engagement, not proof of comprehension.

## Evidence and cost maintenance

- [ ] Assign a review owner and cadence; review after material closures, adopted budget changes and new quarterly reports. No automation currently does this.
- [ ] Replace FY25 operating costs when comparable newer actual costs are published. Keep annual/day operating costs, capital spending, rent benchmarks, budgets and forecasts separate.
- [ ] Refresh the 2026 rent benchmarks when successor standards take effect, retaining household/unit assumptions and what each figure covers.
- [ ] Check primary-source links and retain source versions/page references when reports move or change.
- [ ] Maintain a small public correction/update history for material numerical changes and preserve historical dates.
- [ ] Recheck responsive layouts, keyboard controls, source links and live behavior after future changes; confirm the deployed commit follows the latest `main` and all required checks pass.

## Where to resume

- Page route: `src/app/(public)/deep-dives/continuum/page.tsx`.
- Main evidence and investigation questions: `src/components/deep-dives/homeless/story/diagnosis-data.ts`.
- Visual diagnosis: `DiagnosticBoard.tsx`; capacity comparison: `CapacityDiagnosis.tsx` in the same directory.
- Request text: `InvestigationRequests.tsx`; costs: `CostExplorer.tsx`; definitions and sources: `ReferenceAtlas.tsx`.
- Supporting research in this folder: `capacity-diagnosis.md`, `workforce-execution-diagnosis.md`, `costs-evidence.md`, `placement-evidence.md`, `rebuild-depth-audit.md` and `implementation-notes.md`.

**Suggested restart instruction:** “Continue the continuum evidence follow-up using HANDOFF-AND-NEXT-STEPS.md. Start with usable capacity, workforce and housing-vacancy records; preserve all existing site changes and dated evidence distinctions. Check request status before sending anything, and obtain authorization for outgoing requests or fees.”

This document is sufficient to archive the conversation and resume later. Archiving the task does not mean the unanswered evidence questions have been resolved.
