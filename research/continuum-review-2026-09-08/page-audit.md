# Continuum page: source and narrative audit

Reviewed September 8, 2026. Scope: current route, rendered component definitions, data structures, and the existing research memo. No application code changed. The parent review separately inspects the live page and checks primary documents; this audit distinguishes demonstrable internal problems from claims requiring source verification.

## Assessment

The page already contains unusually extensive research, thirteen pathways, a fourteen-part service map, costs, operational hours, accountability, and an explicit unknown-data vocabulary. Its limitation is not missing volume. It is that a reader must learn the author's whole taxonomy before understanding the system's few consequential failures, and several prominent visual comparisons imply more than the data establish.

The highest-value redesign is a short, forceful explanation of **how people get stuck and what would let them move**, followed by the existing material as an inspectable reference. A compelling opening can rest on one properly sourced shelter-outcomes chart and one clear system map. More facts should improve the diagnosis, not add another long board.

## What currently works and should survive

- The framing “A referral is not an exit” is memorable, useful, and already supported by a clear proposed operating definition.
- The page recognizes that the suitability of an offer, transport, receiving-site acceptance, and arrival matter. The refusal discussion is more useful than a blanket “service refusing” label.
- The local operating-hours chart is a strong visual premise. Its 2 a.m. test makes administrative fragmentation tangible.
- A named owner, action, and measure are attached to each service function. This is a better starting point than generic calls for coordination.
- Dates, source links, and badges for estimates exist in the data. They need to be visible at the point where a reader interprets a number.
- The stage explorer is a valuable reference layer. The source registry and methodological caveats can support a serious public resource.

Relevant implementation: `src/app/(public)/deep-dives/continuum/page.tsx`; `src/components/deep-dives/homeless/{PathwayExplorer,SystemBalance,LeakChart,DoorsOpen,CostChart,StageExplorer,FixBoard}.tsx`; `src/lib/homeless/continuum.ts`.

## Corrections to make before amplifying the page

### P0: The visual model contradicts its own central rule

`PRINCIPLES` says one person occupies one physical stage, while queues and housing matches are overlays (`continuum.ts:25`). But the fourteen “places” include prevention, diversion, outreach, institutional in-reach, assessment and match, and retention. These are services, activities, or tracking functions. A person can be outside, assessed, receiving outpatient treatment, and waiting for a voucher simultaneously. A housed person can receive supportive housing and retention support simultaneously.

`PathwayExplorer.tsx` nevertheless labels its map “the fourteen stages in order,” uses a uniform two-row grid, and renders each selected sequence with arrows. This teaches a linear staircase. For substance use and serious mental illness, selected paths highlight sobering/withdrawal before housing even where the accompanying prose correctly calls those optional detours. Families run through “rapid rehousing” although the evidence paragraph argues for a permanent subsidy.

**Change:** Draw housing situation as the main track: at risk → outside or temporary shelter → permanent home → retained home. Place acute care, medication, outreach, legal help, assessment, and navigation beside or beneath it as concurrent supports. Draw acute clinical stabilization as a branch, with a return connection, only when clinically indicated. Add ordinary permanent rent assistance as a distinct destination from permanent supportive housing. Keep the fourteen functions available in a reference explorer, not as fourteen mandatory physical stops.

### P0: Several percentages are not valid conversion or coverage measures

The current chart grammar presents each row as people → support → coverage, and uses red for percentages under 20%. But the percentages represent fundamentally different things: a year of new outreach engagements divided by a historical one-night unsheltered estimate; placements divided by assessments; licensed beds divided by a modeled regional need; current capacity divided by a planned future facility; and historical high-utilizer housing enrollment.

Specific demonstrable issues in `continuum.ts:624–714`:

| Current item | Problem | Required correction |
|---|---|---|
| 640 new outreach engagements / 6,912 January 2025 unsheltered people = 9% | Numerator covers a county-contracted program during FY2026; denominator is a historical snapshot, not that program's eligible or reached cohort. It excludes ongoing clients and other outreach. | Do not call it annual population coverage or conclude that the other eleven out of twelve were left outside. Publish the two facts separately until matched population and engagement definitions exist. |
| 5,800 first-time presenters annually | This multiplies first-time homelessness prevalence among tri-county street-survey respondents by a Multnomah annual inflow estimate constructed from one January monthly figure. Survey prevalence, annual entry incidence, geography, and seasonality differ. | Replace with an explicitly unvalidated planning assumption, or obtain actual first-time entries by month and county. Do not call it the largest local cohort as an observed finding. |
| 361 camps visited → 3 placements | Camps and people are different units; repeated visits may exist. | A useful activity/output contrast, but not a 0.8% person placement rate. Label the units explicitly and obtain offers/unique people/arrivals before drawing a funnel. |
| 4,853 assessed − 484 placed = 4,369 waiting | Annual assessments and annual placements need not be the same cohort; subtraction is not a verified waiting-list stock. | Use “assessments and placements reported in FY2024” until a cohort-level match and current queue are obtained. |
| ~200 open county beds / 6,912 outside = 5% | The displayed arithmetic is wrong: 200/6,912 is about 2.9%. More fundamentally, occupancy from the FY2025 shelter review is applied to a later, reduced inventory. Vacant is not necessarily staffed, reservable, eligible, or available at 2 a.m. | Remove the live vacancy claim. Request nightly available capacity by site and eligibility; any planning illustration must show its hypothetical inputs. |
| 13 sobering stations = 28% coverage | 47 is the planned future center's capacity, not an assessed demand denominator. | Show “13 current; 47 planned” as a capacity timeline, not service coverage. |
| 139 regional withdrawal beds beside 3,112 Hooper clients annually | Different geography, units, and time concepts. The 33% actually uses 139/424, a third denominator. | Compare licensed beds with modeled need in a dedicated capacity chart; show throughput and open slots separately. |
| 6,973 tri-county PSH beds beside 1,088 unhoused high utilizers from 2018 | The displayed 21% is actually 283/1,371 from the old match, not the adjacent 6,973 and 1,088. Geography, date, stock, and target group differ. | Present the 2018 matched cohort as historical evidence, with a prominent date and repeat-study request. |
| 938 placements / 1,670 “planned” = 56% | 1,670 is reconstructed from delivered placements plus an estimated effect of a budget cut, rather than a verified original cohort or target. Elsewhere the page lists the actual goal as 357. | Separate adopted target, actual placements, and estimated foregone capacity. Do not describe a counterfactual sum as measured conversion. |

The parent review additionally found inconsistent shelter totals within the primary report: a headline housing count of 841 versus the site's 834, with inconsistent exit denominators in different report sections. The site's 834 is almost exactly 16% of 5,213; do not manufacture a precise integer from a rounded percentage. Use a reconciled official table and disclose the report discrepancy.

**Rule for the redesign:** A funnel must follow the same people, within the same geography and observation window, with named denominators at every step. These existing rows cannot be stitched into a single proportional Sankey. Use separated evidence panels when cohorts cannot be linked.

### P0: Costs are not yet comparable “actual prices”

The section title “The money is mostly in the wrong stage” and its $47,000 shelter versus $16,000 supportive-housing comparison are stronger than the demonstrated accounting (`page.tsx:164`; `CostChart.tsx:61–69`; `continuum.ts:676–690`). The first is a bed-year operating figure; the other is described as a person-year figure from a county release. The chart does not establish which rent subsidies, capital, services, health spending, or other agencies' contributions each includes, nor differences in the people served.

Other issues:

- $9.3M / 4,853 assessments is labeled a $1,900 “housing assessment,” although the budget may fund assessment, navigation, and placement together. A program expenditure/output ratio is not a quoted service price.
- $8.7M / 732 foregone placements is labeled a $11,900 rapid-rehousing placement. This depends on a budget-cut counterfactual, not actual expenditures for a measured cohort.
- $3.5M / 500 families is a budgeted average, not observed actual cost.
- Old San Francisco encounter costs and a 2026 campaign's assumed annual lane costs are placed in the same visual vocabulary as local published expenditures. Badges help, but the headline visually overrules them.
- “Never published” and “nobody has ever published” go beyond an incomplete source search. “Not found in the public records reviewed as of September 8” is supportable.

**Change:** Create a cost ledger with columns for amount, unit, fiscal year, population, payer, included/excluded cost, source page, and status. Give observed local figures the main chart. Keep budget assumptions, derived averages, and outside-city examples in separate views. Show fully comparable cost per occupied bed-night and per household-month where possible; show durable housing outcomes only with a matched follow-up denominator. Budget savings require explicit assumptions about released capacity and spending that can actually be avoided.

### P1: Historical data are presented as a current operating dashboard

The hero says seven thousand people “will sleep outside tonight” (`page.tsx:81`). `TONIGHT` labels the January 2025 PIT as tonight's count, an estimated vacancy calculation as beds open, and a mix of older studies and planned inventory as one snapshot. The table suppresses its own `basis` field, so the “counted/estimate” distinction is less visible there than elsewhere.

**Change:** Lead with “latest published estimate, January 2025” and the collection method. Use “open tonight” only with a current timestamp and verified operational feed. Give each metric its own observation period, publication date, geography, and retrieval date. The page can be current research without pretending its underlying datasets are real time.

### P1: Old typology evidence is converted into current clinical acuity

`LanesVisual.tsx:9–11` hard-codes 80/10/10 widths from a 1998 shelter-use typology, with annual people and costs from a candidate proposal. The typology is about patterns of shelter use, not measured current Portland clinical need. The actual headcount ranges displayed do not have 80/10/10 proportions. Their midpoints are roughly 74/21/5. The prose “a tenth of the people ... need to be stabilized first” also changes a shelter-use pattern into a clinical prescription.

**Change:** Describe support needs without unverified population shares. Show a future local acuity distribution only when it is measured. Keep the historical study in an evidence note explaining why a small group can account for disproportionate service use. Do not label the current public as 80% cash-only, 10% transition, 10% stabilization based on this evidence.

### P1: Evidence labels imply proof of an entire pathway

`PathwayExplorer.tsx` says “strongest evidence for this order: RCT.” Several cited studies test one intervention, not the complete proposed sequence of prevention, diversion, shelter, assessment, bridge, and lease. The youth row acknowledges this well, but that qualification is not applied consistently.

**Change:** Label “Evidence for this intervention,” name the tested intervention and population, and separate local design judgment from trial findings. Trial-backed supportive housing does not validate a mandatory bridge or detox sequence. Absolute eligibility or outcome claims need their own precise source, not a generic source cluster.

### P1: Missing public data are repeatedly equated with nonexistent services

Examples include “0 diversion slots or navigators,” “no in-reach,” “nobody counts,” “no arrival field,” and “no retention rate.” A missing public report, the removal of a particular county budget line, a missing standard HMIS field, and a genuinely nonexistent service are different findings.

The code itself illustrates the distinction: the caveat “The jail housing-status field is unverified” says the booking form has not been obtained (`continuum.ts:874`), while the operating text confidently says there is no housing question at booking. The `SystemBalance` footer says five stages cannot be placed on the board, while `CONTINUUM` marks four unknown and displays all fourteen rows.

**Change:** Use separate statuses: verified zero; not publicly reported; source not current; local estimate; service exists but access is limited. Ask the responsible organization to confirm the exact operational gap before publishing a zero. Unknown should have its own neutral/hatch encoding; red should mean a measured missed target or failure.

### P1: Operational, legal, and reviewer authority need provenance

The page promises that six questions “get to the right first door,” claims to show “every door in the county,” and supplies detailed medical and legal instructions (`page.tsx:183–191`). Within `FIRST_DOOR`, “never a cell ... which is Oregon law” is contradicted by the same row describing a jail fallback under that statute. These should be reconciled with current official protocols and qualified reviewers before being framed as a responder tool. The service-hours chart should distinguish hours of operation from hours accepting new admissions, referral-only access, actual bed availability, age/access needs, and day-of-week variation. On mobile its hour labels are hidden, leaving bars without a readable time scale (`DoorsOpen.tsx`).

The page also claims that seven people working the front line reviewed the design (`page.tsx:217,231`). The repository memo repeats that claim but does not identify people, credentials, dates, interviews, or a review record. The component calls the section “What the front line will say” and presents forty role-based objections in quotation marks. **This audit cannot verify whether these were human expert reviews, simulated perspective reviews, or another process.** Obtain provenance and consent for attribution; if they are constructed objections, label them as such and remove the implied quotations from real practitioners. Do not assert they are fabricated without checking.

## Why the current experience overwhelms

The page gives equal visual weight to 14 stages, 13 personas, 6 triage questions, 3 acuity lanes, 4 principles, 9 headline measures, 10 navigation sections, plus many objections and caveats. Visitors have to choose a persona before understanding the main conclusion. After the first pathway picker, they meet fourteen balance rows, nine leak rows, cost bars, fourteen fixes, and another fourteen-stage selector.

Large green section backgrounds, small uppercase labels, tightly packed rows, and source toggles make most content feel like the same category of evidence. The fastest route to understanding is obscured by repeated frameworks. “Four rules” appear both above the story and in the fix section. Case pathways and stage panels are stored only in local React state, so a reader cannot link directly to a selected insight. An important source takes two clicks to inspect. There is no per-claim share or export view.

## Proposed story: six acts, one map, three people

1. **Start with what the system can and cannot show.** One strong, reconciled local shelter-outcomes visual: known housing, other known destinations, and destination unknown. Headline: “We can count shelter exits. Too often, we cannot say what happened next.” Dates and cohort are visible.
2. **Explain the whole mechanism in one screen.** Housing loss and institutional discharge feed the system; support, temporary safety, and housing placement operate together; a lease and long-term stability are the outcome; returns reconnect to inflow. Mark three kinds of break: no suitable option, failed handoff, outcome not known.
3. **Follow three illustrative people.** An income shock, a person with ongoing support needs, and a person leaving hospital/detox/jail. Label them illustrative rather than reported individual cases. Each gets a “what should happen” versus “where local evidence shows friction” comparison. Show elapsed time and blocked gates, not a mandatory fourteen-step itinerary.
4. **Show the binding constraints.** Only the best-supported three or four failures: suitable intake and arrival; discharge/step-down; housing lease-up/retention; prevention speed. Every failure panel contains one fact, one mechanism, one missing measurement, and one decision that changes it. Do not imply data completeness alone creates homes or staffing.
5. **Price the remedy.** An honest local cost ledger and a small, labeled scenario: if verified capacity, staffing, and move-in assumptions change, how many additional completed arrivals or housing placements might result? Separate one-time/startup money, annual operating money, and rent/services/clinical funding. Do not display fake precise savings.
6. **Give the public an action standard.** A prioritized 30/90/365-day agenda with owner, prerequisite, cost basis, output and outcome, deadline, and evidence needed. Keep the complete service atlas, sources, protocols, and debates below as optional reference material.

## Highest-impact visuals

1. **One cohort's destinations:** a 100-person dot grid or 100% stacked bar for shelter exits. Unknown remains visually distinct from street return. Include exact count and denominator; accessible table and downloadable source note. This is the strongest near-term quotable graphic.
2. **The same person's handoff:** an offer → accepted → transport arranged → arrival confirmed → next placement sequence. Show what an incomplete record leaves unknown, then the fields a functioning system would capture. This is an explanatory diagram unless real linked data exist.
3. **A usable-bed filter:** funded → staffed → open → appropriate for this person → accepting now → reachable → arrival. Use conceptual gates until actual counts are obtained; do not invent descending numbers. This explains why aggregate bed inventory cannot answer a responder's question.
4. **Parallel housing and care journey:** housing work continues while healthcare proceeds. A visible “housing search continues here” rail corrects the staircase interpretation and explains why treatment capacity and housing supply both matter.
5. **Cost components rather than slogan bars:** rent, support, operations, healthcare, and capital separated, with matched annual or episode units and current local source dates. Optional shelter model comparisons should include case mix and destination completeness.

Avoid a comprehensive proportional Sankey assembled from today's unmatched aggregate counts. It would look authoritative while fabricating person-level flow.

## Quotable editorial lines

These are proposed Portland Civic Lab explanations, not quotations attributed to officials or researchers:

- “A referral is not an arrival.”
- “A vacant bed is useful only if the person can actually enter it.”
- “Unknown is a data failure. It is not proof that a person returned to the street.”
- “The test is not how many handoffs we made. It is how many people reached the next place.”
- “Housing work should continue while healthcare happens.”

Each share card should preserve the source, date, geography, denominator, and one-sentence caveat. Deep links should encode the selected case, failure, stage, and evidence view. The main narrative should remain complete without requiring a click.
