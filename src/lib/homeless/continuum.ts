import type { CountField, CountRule, GapSignal, Pathway, Phase, Stage, StalenessBand } from "./continuum-types";

/**
 * The continuum-of-care model for the homelessness deep dive and the
 * dedicated continuum page. Distilled from research/homelessness-continuum
 * (September 2026): three independent drafts (clinical, housing-system, and
 * field-worker lenses), judged, synthesized, then challenged claim by claim.
 * Twelve load-bearing claims were tested against primary documents; eleven
 * held, one was corrected (the sobering door's referral rules). Every
 * "exists" and "gap" string cites a source id in that memo's sources.md.
 */

export const PHASES: { key: Phase; label: string; sub: string; color: string }[] = [
  { key: "prevent", label: "Prevent", sub: "keep the door shut", color: "var(--color-fern)" },
  { key: "find", label: "Find", sub: "know who is where", color: "var(--color-river)" },
  { key: "stabilize", label: "Stabilize", sub: "hours to weeks", color: "var(--color-clay)" },
  { key: "shelter", label: "Shelter & bridge", sub: "days to months", color: "var(--color-ember)" },
  { key: "house", label: "House", sub: "a lease", color: "var(--color-canopy-light)" },
  { key: "sustain", label: "Sustain", sub: "stay housed", color: "var(--color-canopy)" },
];

/** The four rules that hold the design together. */
export const PRINCIPLES = [
  { rule: "One person, one physical stage.", body: "A person is in exactly one stage at a time, set by their last verified living situation plus days since contact. Queues and housing matches are overlays and never add to a headcount." },
  { rule: "A referral is not an exit.", body: "Someone leaves a stage only when the receiving site records their arrival. Every yes carries a timestamp, so a yes at 2 a.m. with no door to open is a counted event, not an anecdote." },
  { rule: "Stabilization is a first placement, never the ticket.", body: "People may pass through sobering, detox, treatment, or respite, but no one has to complete a stage to be offered a lease. The trials show housing works without preconditions." },
  { rule: "Transitions are where people are lost.", body: "Every institutional exit and every stabilization discharge carries a named lead, a next place already held, and a confirmed handoff within seven days." },
] as const;

// ── The fourteen stages ───────────────────────────────────────────

export const CONTINUUM: Stage[] = [
  {
    id: "prevention", name: "Prevention", phase: "prevent",
    purpose: "Keep a household in its unit, or move it straight to another one, before it enters homelessness. Speed is the whole intervention: an Oregon nonpayment notice gives 10 or 13 days.",
    entry: "Eviction filing, nonpayment notice, two months of arrears, or a scheduled institutional discharge with no address; screened at one front door within 72 hours.",
    exit: "Crisis resolved and the household confirmed housed at 6 and 12 months; or the household enters homelessness, counted as a prevention failure and as first-time inflow.",
    duration: "Payment within 5 business days; resolved within 10 days; followed at 6 and 12 months.",
    cohorts: ["economic-shock", "families", "vehicle-homeless", "dv-trafficking", "youth", "justice-involved"],
    capacityUnit: "Flexible-assistance dollars and households paid per month; navigator and legal-aid caseload; HRSN rent-benefit slots.",
    count: { what: "Open requests by days waiting; median days request-to-payment; share still housed at 6 and 12 months of all paid; first-time entries per 10,000 renter households against eviction filings.", source: "HMIS prevention enrollments with follow-up; Evicted in Oregon filings; HUD measure 5; provider payment ledgers.", cadence: "Weekly speed; monthly first-time entries; quarterly 6- and 12-month cohorts.", portlandToday: "1,806 people, FY2026", status: "partial" },
    exists: "SHS eviction prevention reached 1,806 people in 1,217 households in FY2026 (goal 700); FY2027 adds $3.5M for 500 families; the Medicaid rent benefit reached 4,490 members statewide through June 2025.",
    gap: "No speed metric, no first-time-entry rate, no 6- or 12-month stability check. Every FY2026 prevention measure is an output, so the county cannot show a single averted episode. The state funded $33.6M against a $173M request.", gapSource: "meieran-appendix-a",
  },
  {
    id: "diversion", name: "Diversion at first contact", phase: "prevent",
    purpose: "At the first request for shelter or the first street contact, find a safe alternative with a small payment and a problem-solving conversation, so the person never enters a bed or a queue. The largest and cheapest cohort, and the region has no count for it.",
    entry: "First request for shelter or first outreach contact by someone with no HMIS enrollment in the prior 24 months.",
    exit: "Diverted to a verified safe arrangement (an exit to housing); or entered shelter or the unsheltered list within 14 days (diversion failed).",
    duration: "Same day to 14 days.",
    cohorts: ["economic-shock", "families", "youth", "vehicle-homeless"],
    capacityUnit: "Problem-solving conversations per week at every intake and outreach team; a flexible-cash pool.",
    count: { what: "First-time presenters per week; conversations held; diversions to a verified arrangement; share who enter shelter within 14 days anyway; returns within 6 months.", source: "HMIS diversion enrollment at every intake with exit destination; HUD measure 5 for the denominator.", cadence: "Weekly; monthly rate; quarterly returns.", portlandToday: "no count exists", status: "unknown" },
    exists: "Nothing published as a diversion function. Intake runs site by site: families through 211, youth through Janus, survivors through Call to Safety, adults through the CHAT warmline. The 2024 city audit found no single adult entry point.",
    gap: "No count of diversion attempts or successes. About 80% of shelter users nationally are transitional and 38% of tri-county street respondents said 2025 was their first episode; the stage for them does not exist.", gapSource: "city-audit-2024",
  },
  {
    id: "unsheltered-active", name: "Verified unsheltered", phase: "find",
    purpose: "Know, by name and location, everyone sleeping outside or in a vehicle, and convert each from identified (seen, no lead) to engaged (a named worker, a documented next step, and a yes with a clock).",
    entry: "Physical contact confirming street, vehicle, or place not meant for habitation, with consent or a tracked non-consent record.",
    exit: "Arrival at any other stage confirmed by the receiving site; or 30 days without re-verification (presumed), 90 days (inactive). Institutional stays of 90 days or less keep a person active.",
    duration: "Named lead within 7 days; documented next step within 14; shelter arrival within 24 hours of a yes.",
    cohorts: ["chronic-stable", "sud", "smi", "dual-diagnosis", "service-refusing", "vehicle-homeless", "justice-involved", "medical-fragile", "youth", "economic-shock", "dv-trafficking", "families"],
    capacityUnit: "Outreach workers per mapped beat with a named-lead caseload; safe-parking spaces; 24/7 clinical consultation coverage.",
    count: { what: "People whose last confirmed situation is unsheltered, in staleness bands, split by assigned lead and next-step status; every yes and whether an arrival followed within 24 hours, by hour; declines with a one-word reason.", source: "HMIS outreach contacts (living situation 4.12), an assigned-lead field, referral events (4.20) plus a local arrival field; Portland Street Response and city camp-worker contacts as hashed rows; Medical Examiner deaths.", cadence: "Daily huddle on open holds; weekly table; monthly official number.", portlandToday: "1,822 surveyed + 5,090 presumed (Jan 2025)", status: "partial" },
    exists: "Portland Street Response (52 staff, 15,353 calls a year, 6 a.m. to midnight), 113 city camp workers, county-contracted outreach (640 newly engaged in FY2026), the county by-name list (~18,000 people, anyone who touched a service).",
    gap: "The county grades itself No on mapped coverage, 90% unsheltered confidence, non-consent tracking, and a status field with a date. Its 10 navigation workers were cut to zero in FY2026. In one August 2026 week, 361 camp visits produced 3 bed placements; of 728 camping-ban offers, 324 were accepted and the 404 declines had no follow-up.", gapSource: "multco-bfz-scorecard",
  },
  {
    id: "institutional-exit", name: "Institutional in-reach", phase: "find",
    purpose: "Find people who are homeless while they are inside a jail, hospital, psychiatric unit, the state hospital, or foster care, attach a worker before the exit, and arrange the next stage before the door opens.",
    entry: "Booking, admission, or placement with housing status recorded as homeless; flagged to an in-reach worker within 72 hours; state-hospital ready-for-discharge status.",
    exit: "Release with a dated, confirmed arrival at a named next stage; or release to the street, self-care, or a shelter with no placement, counted as a discharge-to-street event attributed to the institution.",
    duration: "The institution's clock: jail reach-in up to 120 days before release; hospital admission to discharge; state-hospital waits averaged about 200 days in early 2026.",
    cohorts: ["justice-involved", "smi", "medical-fragile", "dual-diagnosis", "sud", "youth"],
    capacityUnit: "In-reach workers per facility; release-day beds and units held per week.",
    count: { what: "People inside each institution flagged homeless, by expected release date and whether a destination is confirmed; releases per month by destination; share with a worker before exit and arrival within 7 days; returns within 30 and 90 days.", source: "Jail booking and release records, hospital discharge dispositions for homeless-flagged patients, the state-hospital discharge-ready list, matched monthly to HMIS by hashed identifier under data-use agreements. The 2018 FUSE match did this once.", cadence: "Weekly release list; monthly destination table; annual three-system match.", portlandToday: "unknown", status: "unknown" },
    exists: "ARC Transition Services reach-in up to 120 days before release (capacity unpublished); a planned $160,000 reentry hub; Unity's bridge clinic; the Recuperative Care Program as the only hospital step-down.",
    gap: "The Sheriff publishes no housing status at booking and no release destination; Unity publishes no discharge destinations; 41 state-hospital patients were ready for discharge with nowhere to go; the Reentry Council no longer meets. A new channel opened June 1, 2026: defendants found unable to aid and assist on misdemeanors are released within seven days with no agency owning where they go.", gapSource: "fuse-multco",
  },
  {
    id: "intake-match", name: "Assessment and match queue", phase: "find",
    purpose: "Convert a known person into a housing referral and a move-in date, and make the wait visible as a queue in days, not a count of assessments completed. An overlay: people here are also counted in the physical stage they wait in.",
    entry: "On the unsheltered list, in shelter, in a stabilization stage, or in an institution, with an assessment complete.",
    exit: "Referral accepted and move-in dated; or referral rejected, expired, or declined with reason; or inactive.",
    duration: "Assessment within 7–10 days of referral; housing referral within 90 days; supportive housing within 150.",
    cohorts: ["economic-shock", "vehicle-homeless", "families", "youth", "dv-trafficking", "sud", "smi", "dual-diagnosis", "medical-fragile", "chronic-stable", "justice-involved", "service-refusing"],
    capacityUnit: "Assessors and navigators; open vouchers and units by type; landlord units under agreement.",
    count: { what: "People waiting by days since assessment, housing type matched, and the stage they wait in; referrals made, accepted, rejected (by whom, why), expired; days from match to move-in; vouchers issued but not leased.", source: "HMIS coordinated-entry events (4.20) and housing move-in date (3.20); Home Forward voucher issuance.", cadence: "Weekly queue over 14, 30, 90 days; monthly medians by housing type.", portlandToday: "4,853 assessed, 484 placed (FY2024)", status: "partial" },
    exists: "County Coordinated Access using the Multnomah Services and Screening Tool; population-specific access lines; placement and in-reach programs that produced 33% of FY2025 shelter-to-housing exits.",
    gap: "Coordinated Access assessed 4,853 people in FY2024 and placed 484; the FY2026 budget cut the target to 1,500 assessments and 200 placements as funding fell from $9.3M to $4.7M. Days waiting, rejections, and match-to-move-in time are not published. The queue is being shortened by defunding the door.", gapSource: "meieran-appendix-outreach",
  },
  {
    id: "crisis-sobering", name: "Crisis stabilization and sobering", phase: "stabilize",
    purpose: "Resolve acute intoxication or a psychiatric crisis somewhere other than an emergency department or a jail cell, start medication for opioid use in the same encounter where indicated, and hand the person to a next stage with a confirmed arrival.",
    entry: "Acute intoxication or psychiatric crisis brought by police, Portland Street Response, EMS, outreach, or walk-in. Today the sobering stations are referral-only: no walk-in and no self-referral.",
    exit: "Disposition recorded at exit (community with follow-up, withdrawal management, shelter, respite, hospital, jail) with a warm handoff and follow-up within 7 days. Discharge to the street with no next step is a failed exit.",
    duration: "Sobering under 24 hours; crisis stabilization up to 72 hours.",
    cohorts: ["sud", "smi", "dual-diagnosis", "justice-involved", "service-refusing"],
    capacityUnit: "Sobering stations and crisis beds staffed and open tonight, by referral rule (who may open the door).",
    count: { what: "Admissions per day by entry source; occupancy and turn-aways; disposition split; MOUD started; share with confirmed next-stage arrival within 7 days; 30- and 90-day repeat crisis contacts; decline rules and decline counts for referral-only doors.", source: "Facility census and disposition logs (Coordinated Care Pathway Center, Behavioral Health Resource Center, Unity psychiatric emergency) written as person-date-situation rows; 988 and Portland Street Response call data for demand.", cadence: "Daily census; weekly disposition table; monthly repeat-crisis rate.", portlandToday: "13 sobering stations · 606 deflection referrals, 113 completions (year one)", status: "partial" },
    exists: "Coordinated Care Pathway Center at 980 SE Pine: 13 sobering stations open 24/7 since April 2025; since June 24, 2025 they accept referrals from Portland Street Response, Fire CHAT, Project Respond, and named outreach and peer teams as well as police. The deflection program itself remains law-enforcement or district-attorney referral only. Behavioral Health Resource Center: 33 shelter and 19 bridge beds at $111,797 per bed. Unity: 24-hour psychiatric emergency, 80 adult inpatient beds.",
    gap: "Zero sobering capacity from December 2019 to April 2025; 13 stations now against a 47-bed center due in late 2027; no walk-in or self-referral door; admissions counted, dispositions not. The deflection funnel ran 79 referrals to 9 completions in the first quarter of 2026. No county mobile-crisis response-time data is published, though state rule requires it be tracked.", gapSource: "deflection-annual",
  },
  {
    id: "withdrawal-management", name: "Withdrawal management", phase: "stabilize",
    purpose: "Medically supervised withdrawal with medication induction and the next place arranged before day three. Detox without a next stage returns a person to the street with lowered tolerance. The stage's number is the match rate: level recommended at discharge versus level actually placed within 7 days.",
    entry: "Medically indicated withdrawal, by walk-in or from sobering, hospital, jail, or outreach; no requirement to have a residential bed lined up first.",
    exit: "To residential treatment, outpatient with medication started, recovery housing, or shelter with a dated arrival. Recommended residential, placed nowhere, is the failed exit.",
    duration: "3–8 days.",
    cohorts: ["sud", "dual-diagnosis", "justice-involved"],
    capacityUnit: "Staffed withdrawal beds and open beds tonight; intake hours per week.",
    count: { what: "Occupied and open beds each morning; people turned away; level recommended versus level placed with date; exits by destination; active medication at exit.", source: "Facility census reported as a condition of payment; two codes added to the discharge summary the clinician already writes; OHA licensed-bed roster. Substance-use records require patient consent under 42 CFR Part 2, so this feed needs a consent workflow, not just a data agreement.", cadence: "Daily open beds; weekly exits and match rate; monthly placement rate.", portlandToday: "3,112 served at Hooper (2025) · 139 beds in the region", status: "partial" },
    exists: "Hooper Detoxification Stabilization Center served 3,112 people in 2025, with walk-in triage one hour on weekday mornings; the region has 139 licensed withdrawal beds with 16 pending; 29 more are planned at the 2027 center.",
    gap: "The region needs 424 beds. In 2022, 56% of Hooper's 2,772 assessments were recommended for residential treatment and 17% of those were placed; about a quarter were turned away needing a higher level of care. No facility publishes open beds, and a one-hour weekday window turns a Friday yes into a Monday wait.", gapSource: "ccc-beds",
  },
  {
    id: "residential-treatment", name: "Residential and inpatient treatment", phase: "stabilize",
    purpose: "Clinical care that cannot be delivered in housing: residential substance-use treatment, inpatient psychiatric stabilization, secure residential treatment, run as a managed flow with step-down planned at admission and a transition worker assigned before any psychiatric discharge.",
    entry: "Clinical placement criteria met; referred from withdrawal management, crisis, hospital, jail, or civil commitment; medication-inclusive; no housing prerequisite.",
    exit: "Step-down with a dated arrival at recovery housing, bridge, or a lease, and follow-up within 7 days; or early exit with destination recorded. Clinically ready but waiting is a separate counted state.",
    duration: "Residential 30–90 days; inpatient days to weeks; secure residential months. The measured interval is days from ready-for-discharge to actual discharge.",
    cohorts: ["sud", "smi", "dual-diagnosis", "justice-involved"],
    capacityUnit: "Licensed, staffed, and open beds by facility and level of care.",
    count: { what: "Licensed versus staffed versus occupied beds by facility; admissions by source; waitlist by days and by where the person is physically waiting; planned versus actual stay; exits by destination; the discharge-ready backlog.", source: "OHA licensing roster; facility daily census as a payment condition; the state-hospital discharge-ready list; HMIS institutional living situation and exit destination.", cadence: "Weekly open beds and backlog; monthly destinations; quarterly returns.", portlandToday: "639 residential SUD · 311 inpatient psychiatric · 127 secure residential", status: "partial" },
    exists: "Regional residential providers; 16× Burnside added 74 beds in May 2025; the county added 256 recovery and stabilization beds 2024–26; Unity inpatient; 127 secure residential beds; the state hospital.",
    gap: "The Portland region needs 1,793 residential substance-use beds, 540 inpatient psychiatric, and 220 secure residential. The state counts licensed beds, not staffed or open ones; the $7M state bed-coordination center produced about 30 activations in 16 months; 41 state-hospital patients waited an average of about 200 days for community beds that do not exist.", gapSource: "oha-facility-study",
  },
  {
    id: "medical-respite", name: "Medical respite and hospital step-down", phase: "stabilize",
    purpose: "A bed with clinical oversight for people too sick for shelter and not sick enough for a hospital, arranged before discharge with a housing worker attached at admission. The alternative is the discharge to self-care that is how most homeless patients leave Oregon hospitals.",
    entry: "Hospital or emergency discharge of a patient flagged homeless who needs recuperation; the receiving program confirms a bed before the patient leaves.",
    exit: "To a lease, supportive housing, adult foster or assisted living, or shelter with primary care linked. Readmission within 30 and 90 days and exit to the street are failures.",
    duration: "2–6 weeks; longer while awaiting long-term care.",
    cohorts: ["medical-fragile", "smi", "sud", "chronic-stable", "dual-diagnosis"],
    capacityUnit: "Respite beds staffed and open; homeless-flagged hospital patients ready for discharge with no destination.",
    count: { what: "Occupied and open respite beds; referrals received, admitted, declined for capacity; homeless-flagged discharges per month by disposition and hospital; 30- and 90-day readmissions; exits to stable housing.", source: "Recuperative Care Program census; hospital discharge dispositions for homeless-flagged patients (diagnosis flags catch about a third of homeless patients, so a housing-status question at admission is the fix); CCO claims for readmission.", cadence: "Daily beds; monthly dispositions by hospital; quarterly readmissions.", portlandToday: "51 beds", status: "partial" },
    exists: "Central City Concern's Recuperative Care Program: 51 beds, 60%+ exiting to stable housing; Unity's bridge clinic; hospital social work. The only medical respite in the county.",
    gap: "Homeless patients leave Oregon hospitals to home or self-care 73% of the time; the 40-unit behavioral-health step-down motel closed in FY2027; no hospital-to-respite protocol, no discharge-to-street rule, no published dispositions. The Legislature's task force recommended statewide respite as a Medicaid benefit in November 2024.", gapSource: "discharge-taskforce",
  },
  {
    id: "emergency-shelter", name: "Emergency shelter", phase: "shelter",
    purpose: "Short-term safety off the street with a documented exit plan: a bridge, not a destination, judged by where people go next and whether they come back. Population-specific doors: same-day non-congregate for families and survivors, youth-only under 25, sites that take pets, partners, and belongings.",
    entry: "Literally homeless and an open bed the person is eligible for; family and survivor placement same day; youth within 24–72 hours; referral to arrival under 24 hours.",
    exit: "Dated exit with destination: permanent housing, rapid rehousing, bridge, treatment, institution, another shelter, unsheltered, or unknown. An unknown share above 10% fails the site on data before it is judged on outcomes.",
    duration: "Population-specific median stay, falling quarter over quarter. Today: 73 days on average, 160 for exits to permanent housing.",
    cohorts: ["economic-shock", "families", "dv-trafficking", "youth", "chronic-stable", "vehicle-homeless", "service-refusing", "justice-involved", "medical-fragile", "smi", "sud"],
    capacityUnit: "Funded, staffed, occupied, and open-tonight beds by site and model, with each site's decline rules, reported with the bed-night bill.",
    count: { what: "Nightly census and open beds by site; median stay by model; exits to permanent housing per bed; exit-destination completeness; returns within 6 months; avoidable vacancy; cost per housing exit by site; declines by reason.", source: "Operator bed-night billing as the capacity row; HMIS project entry, exit, and destination; city shelter dashboards; the annual Adult Shelter Review.", cadence: "Nightly beds; weekly exits; quarterly stay, destination, and returns; annual cost per exit.", portlandToday: "~1,667 county + 580 city overnight + 718 city alternative units", status: "partial" },
    exists: "After the FY2027 cuts: about 1,667 county-funded units (from 2,362), 580 city overnight beds (from 876), 718 city alternative-site units (from 867), Bybee Lakes 225 with sobriety required, 200 winter beds. FY2025: 31 adult shelters, $98M, $47,000 per bed, 88% full.",
    gap: "54% of shelter exits have no recorded destination, 93% of those from congregate sites. 16% of exits reach permanent housing (0.39 per bed a year). Motel shelters place 38% into housing; congregate 12%; the motel model is the one being closed. 1,566 units were cut in one budget cycle while the count rose 21%. No unified adult entry point and no real-time bed availability, two years after the auditor asked for both.", gapSource: "multco-shelter-review",
  },
  {
    id: "bridge-transition", name: "Bridge and transitional housing", phase: "shelter",
    purpose: "A time-limited, staffed, non-congregate setting for people who have a next step but not yet a unit, or who chose an abstinence-based recovery setting, with a named lead following them to the lease. The step-down that makes detox and treatment off-ramps instead of revolving doors.",
    entry: "Stabilized from a crisis, withdrawal, or treatment stage, or released from an institution, with a housing referral open; recovery housing by choice, never as a housing condition; medication for opioid use is not a bar.",
    exit: "Lease signed with a move-in date; or exit to shelter, unsheltered, institution, or unknown, counted against the site with reason.",
    duration: "Behavioral-health transitional shelter days to weeks; jail-release bridge 30–90 days; recovery and youth transitional housing 6–24 months.",
    cohorts: ["sud", "dual-diagnosis", "smi", "justice-involved", "youth", "chronic-stable", "vehicle-homeless", "service-refusing"],
    capacityUnit: "Beds and units by type (recovery, transitional, bridge, safe park) with planned exit date per resident and open-tonight status.",
    count: { what: "An inventory by type and operator (none exists today); census by site; planned versus actual exit; entries by source stage; exits by destination; share arriving at a lease; housing status 6 and 12 months after exit.", source: "A county recovery-housing registry built from contracts and state certification lists; HMIS transitional-housing enrollments; Oxford House and recovery-housing census by monthly match, or shown as capacity with unknown occupancy.", cadence: "Quarterly inventory; weekly census and overdue exits; monthly destinations.", portlandToday: "no inventory exists", status: "unknown" },
    exists: "Blackburn's 124 special-needs units and 27 stabilization beds; about 139 county-funded culturally specific recovery beds; 24 youth transitional beds at The Moxie; 19 bridge beds at the Behavioral Health Resource Center; one referral-only RV safe park; Oxford Houses in the dozens with no county total.",
    gap: "The state's 2024 capacity study omits recovery housing entirely. Meieran's 2024 expert group named long-term transitional recovery housing at scale the highest-priority investment; her budget moves bridge housing from about $1M to $15M. The jail-release bridge and hospital step-down shelter remain proposals. People who finish treatment fall through to shelter or the street uncounted.", gapSource: "meieran-sud-report",
  },
  {
    id: "rapid-rehousing", name: "Rapid rehousing", phase: "house",
    purpose: "A lease in the tenant's name plus a subsidy that steps down over 6–24 months and light navigation, with a step-up to a permanent subsidy when income does not recover. Right for the large low-to-moderate acuity group; wrong as the family solution or as a substitute for supportive housing.",
    entry: "Matched from the queue or diverted from shelter or a bridge; prioritized by time homeless and household, not a retired vulnerability score; move-in dated.",
    exit: "Subsidy ends with the tenant keeping the unit; transfer to a permanent subsidy; or return to homelessness within 6, 12, or 24 months, counted as returned-from-housing inflow attributed to the placing program.",
    duration: "Placement under 90 days from referral; 6–24 months of subsidy; followed 24 months after.",
    cohorts: ["economic-shock", "families", "vehicle-homeless", "dv-trafficking", "youth"],
    capacityUnit: "Subsidy slots, navigator caseload, landlord units under agreement with risk mitigation.",
    count: { what: "Households enrolled with move-in date and months of subsidy left; lease-ups per month and days match-to-move-in; households converted to a permanent subsidy; returns within 6, 12, 24 months on all placed.", source: "HMIS rapid-rehousing enrollments, move-in date, exit destination, and re-entry into any project (HUD measure 2).", cadence: "Monthly placements; quarterly returns cohorts.", portlandToday: "938 people placed, FY2026", status: "partial" },
    exists: "SHS rapid rehousing placed 938 people in FY2026 (goal 357); the tri-county inventory lists 2,663 rapid-rehousing beds; Regional Long-term Rent Assistance; the Medicaid six-month rent benefit.",
    gap: "A mid-year $8.7M cut removed roughly 732 planned placements. Retention after the subsidy ends is not reported; the action plan's returns indicator has no target. Time-limited subsidies decay (the VA study's effect fell from −12.9 points at day 120 to −2.4 at three years), so a stage that does not track month 25 cannot see its own failure mode.", gapSource: "ssvf-2025",
  },
  {
    id: "permanent-supportive-housing", name: "Permanent supportive housing", phase: "house",
    purpose: "A lease with indefinite services for people with a disabling condition and long or repeated homelessness: rent at or below 30% of income, no treatment or sobriety precondition, harm reduction, services separate from tenancy, an ACT team for the highest need, under 20% of units in any one building, plus master leasing and a risk-mitigation fund for the tenants landlords otherwise refuse.",
    entry: "Disabling condition plus chronic or high-acuity status, from the queue, an institution, or a stabilization stage; a unit offered; move-in dated. Stabilization may precede but never gates the offer.",
    exit: "Move to less intensive housing (appropriate); death; or exit to shelter, street, or institution (failure, counted as returned from housing). Institutional stays under 90 days are not exits.",
    duration: "Indefinite; match-to-move-in under 150 days; retention at 6, 12, 24 months and annually.",
    cohorts: ["chronic-stable", "smi", "dual-diagnosis", "sud", "medical-fragile", "justice-involved", "service-refusing"],
    capacityUnit: "Units plus service slots by intensity (ACT at 1:10, intensive case management), with vacancy days per turnover.",
    count: { what: "Occupied and vacant units with days vacant; move-ins and exits by destination; retention at 6, 12, 24 months on all placed; fidelity score by program; acuity match rate; post-placement jail and emergency use for the high-utilizer cohort.", source: "HMIS permanent-housing enrollments with move-in date and exit destination; annual fidelity self-assessment audited; unit rosters as a capacity row; annual hashed match to jail bookings and Medicaid claims.", cadence: "Weekly vacancy; monthly exits; quarterly retention; annual fidelity and utilization match.", portlandToday: "6,973 beds tri-county · 439 newly placed FY2026", status: "partial" },
    exists: "6,973 supportive-housing beds tri-county; 439 people newly placed in FY2026 (goal 248); about 9,000 people sustained; Metro bond 393+ units; the $37.7M federal grant that funds subsidies; a master-leasing and landlord-engagement solicitation.",
    gap: "The county's own review prices supportive housing at about $16,000 per person against $47,000 per shelter bed, yet vacancy, turnover, fidelity, and acuity match are unpublished, ACT capacity is unpublished, the 2018 match that found 1,088 tri-system users outside supportive housing was never repeated, the federal grant is in litigation, and the bond pipeline slows to 104 units in 2026. The best-performing stage on cost and the least-measured on quality.", gapSource: "multco-shelter-release",
  },
  {
    id: "retention", name: "Housed and followed", phase: "sustain",
    purpose: "Verify that people placed stay housed, catch tenancy trouble before eviction with a rapid response team, step services down as stability holds, and count every return as inflow attributed to the placing program, so the front of the system sees the back.",
    entry: "A housing move-in date in any housing stage; escalation on any trigger (missed rent, crisis contact, jail booking, hospital admission, landlord complaint).",
    exit: "24 months stable (graduated, still counted annually); appropriate transition; or return to homelessness, which restarts the count as returned from housing.",
    duration: "Checkpoints at 6, 12, 24 months; tenancy response within 72 hours of an alert.",
    cohorts: ["economic-shock", "vehicle-homeless", "families", "youth", "dv-trafficking", "sud", "smi", "dual-diagnosis", "medical-fragile", "chronic-stable", "justice-involved", "service-refusing"],
    capacityUnit: "Tenancy-support and rapid-response caseload by acuity tier; risk-mitigation fund balance.",
    count: { what: "People housed by months since move-in; retention at 6, 12, 24 months on all placed; returns by prior stage, cohort, and placing program; eviction filings against subsidized tenants; trigger events and response time.", source: "HMIS move-in date, exit destination, and subsequent project entries (HUD measure 2); eviction filings matched to subsidized addresses; provider alert logs; monthly hashed match to shelter, jail, emergency, and Medical Examiner records.", cadence: "Monthly returns and triggers; quarterly move-in cohorts; annual against the plan's 75%-at-24-months goal.", portlandToday: "1,417 'sustained' in PSH (Q1 FY2026), no rate", status: "unknown" },
    exists: "SHS 'sustained in housing' counts; case management inside supportive-housing contracts; the Medicaid tenancy-support benefit; Domicile Unknown death review; a $6M one-time shelter-to-housing fund in FY2027.",
    gap: "The action plan set 75% retention at 24 months; the county reports people sustained but no rate on all placed; the December 2025 returns indicator has no target; retention after rapid rehousing is unreported. Without this loop the region cannot tell a housing system that works from one that recycles people into the shelter count. A quarterly cohort table is the cheapest missing report in the system.", gapSource: "hrap-kpis",
  },
];

// ── Pathways: the ordered stages each cohort should move through ─

export const PATHWAYS: Pathway[] = [
  { cohort: "economic-shock", steps: ["prevention", "diversion", "emergency-shelter", "rapid-rehousing", "retention"], evidence: "RCT", evidenceSource: "santa-clara-rct", why: "Cash inside the 10-day notice clock beats shelter: Santa Clara's randomized trial cut homelessness 81% at six months on an average $4,442; Chicago emergency assistance cut shelter entry 76%. Shelter is a short motel bridge only if diversion fails; the clinical stages are skipped on purpose." },
  { cohort: "vehicle-homeless", steps: ["prevention", "unsheltered-active", "intake-match", "bridge-transition", "rapid-rehousing", "retention"], evidence: "observational", evidenceSource: "safe-parking-sd", why: "A working household in a vehicle is self-sheltered until the vehicle is towed. Safe parking with sanitation is the bridge; San Diego's program produced housing exits at about four times the rate of bridge shelter. Locally the only safe park is referral-only, so the named lead is the gate." },
  { cohort: "families", steps: ["prevention", "diversion", "emergency-shelter", "rapid-rehousing", "retention"], evidence: "RCT", evidenceSource: "family-options", why: "Same-day non-congregate placement keeps children in school; the Family Options trial found a permanent subsidy halved homelessness and cut shelter stays 75% at 37 months while rapid rehousing showed no stability gain. So the rapid-rehousing stage must convert to a permanent voucher, and retention is where that is verified." },
  { cohort: "youth", steps: ["diversion", "emergency-shelter", "bridge-transition", "rapid-rehousing", "retention"], evidence: "RCT", evidenceSource: "chez-soi-youth", why: "Diversion is a safety-screened family-reconnection conversation; shelter must be youth-only within 24–72 hours, never the adult queue; transitional living is the bridge; then a youth-tailored subsidy. Housing First improved stability for 18–24-year-olds with mental illness in the At Home/Chez Soi subgroup; host-home evidence is practice reports only." },
  { cohort: "dv-trafficking", steps: ["prevention", "emergency-shelter", "rapid-rehousing", "retention"], evidence: "quasi-experimental", evidenceSource: "dvhf-2022", why: "Survivor choice and safety first: flexible cash can prevent the episode; when it cannot, a confidential non-congregate placement the same day, then flexible-funding rapid rehousing with a mobile advocate. Washington's evaluation found better stability, safety, and mental health holding at two years. Survivor records stay in the confidential database and reach the count as flags only." },
  { cohort: "sud", steps: ["unsheltered-active", "crisis-sobering", "withdrawal-management", "residential-treatment", "bridge-transition", "permanent-supportive-housing", "retention"], evidence: "RCT", evidenceSource: "cm-meta", why: "Survival and engagement in that order: naloxone and same-day buprenorphine or methadone on the street, sobering instead of the emergency room, withdrawal management with the next bed held before day three, residential only when the assessment indicates it, recovery housing by choice, and a lease not conditioned on abstinence. Where the person declines abstinence settings the path skips to supportive housing with medication and harm reduction. Stabilization is the first placement, not the ticket." },
  { cohort: "smi", steps: ["unsheltered-active", "crisis-sobering", "permanent-supportive-housing", "retention"], evidence: "RCT", evidenceSource: "chez-soi-2015", why: "The shortest evidence-backed path is from the street to a lease with an ACT team, with crisis stabilization as a detour when needed and inpatient care in parallel, not as a prerequisite: 73% of days stably housed versus 32% over 24 months, sustained at 5.5 years. If hospitalized, the path re-enters through in-reach with a transition worker assigned before discharge." },
  { cohort: "dual-diagnosis", steps: ["unsheltered-active", "crisis-sobering", "withdrawal-management", "bridge-transition", "permanent-supportive-housing", "retention"], evidence: "RCT", evidenceSource: "pathways-2004", why: "One team, one plan. The Pathways trial sample was dual-diagnosis: housing without prerequisites produced earlier and more stable tenancies with no difference in substance use at 48 months. A days-to-weeks behavioral-health transitional shelter holds the person only while a unit is found; the lease comes with an integrated team offering medication and contingency management. The failure to design out is serial systems that each say get the other thing fixed first." },
  { cohort: "medical-fragile", steps: ["institutional-exit", "medical-respite", "permanent-supportive-housing", "retention"], evidence: "quasi-experimental", evidenceSource: "kertesz-2009", why: "Never a discharge to the street: the housing worker is attached at admission, respite is arranged before discharge, and the exit from respite is a lease or a long-term-care placement with in-home supports. Respite roughly halved 90-day readmission odds; housing plus case management cut hospitalizations 29% in a randomized trial." },
  { cohort: "chronic-stable", steps: ["unsheltered-active", "intake-match", "emergency-shelter", "permanent-supportive-housing", "retention"], evidence: "observational", evidenceSource: "kuhn-culhane", why: "Long-term homeless without an acute crisis: verified with a named lead, assessed and matched within 90 days, held in low-barrier shelter or a village only while documents and the unit come together, then supportive housing. The chronic 10% used half of all shelter days in the typology study; the county prices supportive housing at $16,000 per person against $47,000 per shelter bed." },
  { cohort: "justice-involved", steps: ["institutional-exit", "bridge-transition", "permanent-supportive-housing", "retention"], evidence: "RCT", evidenceSource: "urban-denver", why: "The placement is arranged inside the jail and the person walks out to a unit and a worker, with a bridge only when the unit is not ready and sobering or detox as detours on release day, never as conditions. Just in Reach: 82% housed at 12 months; Denver's randomized trial: 81% at two years; NYC FUSE: 40% fewer jail days." },
  { cohort: "service-refusing", steps: ["unsheltered-active", "bridge-transition", "permanent-supportive-housing", "retention"], evidence: "observational", evidenceSource: "abt-encampments", why: "Refusal is usually a refusal of a specific offer. The same small team returns repeatedly, backed by a clinical line to tell refusal from untreated psychosis or withdrawal, and makes a documented non-congregate offer that takes the pet, the partner, and the belongings, then a lease. The count records the decline reason rather than the label." },
];

// ── The shared first-door protocol ────────────────────────────────

export interface FirstDoorStep {
  n: number;
  ask: string;
  /** What any responder can observe to answer it, without a diagnosis. */
  observe: string;
  ifYes: string;
  door: string;
  stageId: string;
  /** Local door today, named. */
  today: string;
}

/**
 * Six questions, in order, that a police officer, paramedic, outreach worker,
 * emergency department, or jail release planner can answer at the scene with
 * what they can see. Each yes names the first door. The order matters:
 * safety, then stabilization, then population, then history.
 */
export const FIRST_DOOR: FirstDoorStep[] = [
  { n: 1, ask: "Is there an immediate danger to life?", observe: "Overdose signs, unresponsive, severe injury or illness, active suicidal or homicidal statements, violence in progress.", ifYes: "Medical or psychiatric emergency first. This is not yet a homelessness decision; the homelessness decision starts at discharge, with a housing worker attached at admission.", door: "EMS, emergency department, or psychiatric emergency", stageId: "institutional-exit", today: "911; Unity Center 24-hour psychiatric emergency (walk-in or drop-off); any emergency department." },
  { n: 2, ask: "Intoxicated or in withdrawal, without a medical emergency?", observe: "Impaired, unsteady, sedated, or agitated from a substance; withdrawal symptoms; unable to hold a coherent conversation about a plan right now.", ifYes: "Sobering or crisis stabilization, never a cell or a waiting room. Offer medication for opioid use in the same encounter. Hold the next stage before discharge.", door: "Sobering station or 23-hour crisis stabilization", stageId: "crisis-sobering", today: "Coordinated Care Pathway Center sobering (13 stations, 24/7) by referral from police, Portland Street Response, Fire CHAT, Project Respond, or named outreach teams. No walk-in. Detox: Hooper, weekday-morning intake only." },
  { n: 3, ask: "Psychiatric crisis below the danger threshold?", observe: "Disorganized speech or behavior, apparent psychosis, acute distress, cannot make a decision today but is not a danger to self or others.", ifYes: "Crisis stabilization with a warm handoff and a transition worker. Jail is a failure of this step. If the person has a disabling condition and a long history outside, the lease offer is made from here, not after treatment.", door: "Mobile crisis or crisis stabilization", stageId: "crisis-sobering", today: "County crisis line 503-988-4888 dispatches Project Respond; Portland Street Response 6 a.m. to midnight; Unity psychiatric emergency." },
  { n: 4, ask: "Children present, under 25, or fleeing violence?", observe: "Minor children with the household; a young adult alone; disclosure of intimate-partner or sexual violence or trafficking, or visible fear of a specific person.", ifYes: "The population door the same day, non-congregate, never the adult queue. For survivors, confidential placement and survivor choice; records stay in the confidential database.", door: "Family, youth, or survivor system", stageId: "emergency-shelter", today: "Families: 211. Youth: Janus Youth Access Center (Porch Light, Street Light). Survivors: Call to Safety 503-235-5333, 24/7." },
  { n: 5, ask: "First time, or recently housed?", observe: "Lost housing within roughly 90 days; no prior enrollment in homeless services; still has belongings, documents, income, or a lease history; can name a person or place they could return to with help.", ifYes: "Diversion and prevention cash before any bed: a problem-solving conversation, a payment inside days, a landlord call. Rapid rehousing if a unit is needed. Do not enter this person into a queue built for chronic cases.", door: "Diversion with flexible cash, then rapid rehousing", stageId: "diversion", today: "No diversion function exists. SHS eviction prevention and the Medicaid six-month rent benefit are the closest tools, neither available at the point of first contact." },
  { n: 6, ask: "None of the above: long-term outside, or leaving an institution?", observe: "Months or years outside; repeated episodes; a disabling condition apparent or documented; or inside a jail, hospital, or treatment program with a release date.", ifYes: "Verify on the list with a named lead within 7 days, assess within 10, match within 90. Offer a lease with services matched to acuity; use stabilization and bridge stages as first placements, never as conditions. From an institution, arrange the next place before the door opens.", door: "Verified list and housing match; institutional in-reach", stageId: "unsheltered-active", today: "County Coordinated Access (CHAT warmline 844-765-9384 for adults); ARC reach-in up to 120 days before jail release; no in-reach from hospitals; no shared release list." },
];

export const FIRST_DOOR_RULES = [
  "Record one living-situation code and one referral result. That is the entire data burden at the scene.",
  "Every yes gets a hold, transport, and an arrival confirmed by the receiving site. Until then the person has not left the stage.",
  "A named lead within 7 days for anyone verified outside. Identified is not engaged.",
  "A decline is coded with its reason (pets, partner, congregate, sobriety rule, referral-only, distance, warrant, no bed), never as \"service-refusing.\"",
  "The lane is provisional at first contact and re-scored at every handoff. It decides the first door, not eligibility for any later one.",
] as const;

// ── The three acuity lanes ────────────────────────────────────────

export interface Lane {
  id: "lane1" | "lane2" | "lane3";
  name: string;
  who: string;
  /** Observable, not diagnostic. */
  criteria: string[];
  firstDoor: string;
  housingFirst: string;
  successLooksLike: string;
  scale: string;
  cohorts: string[];
  color: string;
}

export const LANES: Lane[] = [
  {
    id: "lane1", name: "Lane 1 · Prevent and resolve", who: "Low to moderate acuity. Housing loss is the problem; the person can hold a lease tomorrow.",
    criteria: ["Housed within the last ~90 days, or first episode", "No intoxication or psychosis impairing consent today", "Can complete a lease conversation and name a next step", "Includes most families, most young adults, and working households in vehicles"],
    firstDoor: "Cash and a conversation before any bed: prevention payment, diversion, rapid rehousing. A motel bridge only if diversion fails.",
    housingFirst: "Housing is the whole intervention. Services beyond light navigation are wasted here; a permanent subsidy is the fix for families.",
    successLooksLike: "First-time entries falling; payment inside 5 business days; 85% still housed at 12 months.",
    scale: "About 80% of shelter users nationally; 38% of tri-county street respondents were first-time. Meieran budgets 14,000–17,000 people a year at $5,000–6,000 each.",
    cohorts: ["economic-shock", "families", "vehicle-homeless", "youth", "dv-trafficking"], color: "var(--color-fern)",
  },
  {
    id: "lane2", name: "Lane 2 · Supported transition", who: "Moderate to high acuity. Can succeed in housing with ongoing support; fails without it.",
    criteria: ["Repeated episodes, or a long one", "Treatable mental-health or substance-use need that flares under stress", "Can accept a unit and a weekly visit today", "Time-limited help has failed before, or would"],
    firstDoor: "A unit with intensive case management from day one, and a transition worker at every institutional exit. A bridge setting only while the unit is found.",
    housingFirst: "Works, with the support attached and not expiring on a calendar. Bare rapid rehousing is the failure mode; so is over-placing in supportive housing someone else needed.",
    successLooksLike: "Shorter bridge stays; 70–80% retained at 12–24 months; fewer returns to shelter.",
    scale: "Roughly 10% of shelter users. Meieran budgets 4,000–5,000 people a year at $18,000–24,000 each.",
    cohorts: ["chronic-stable", "youth", "justice-involved", "vehicle-homeless"], color: "var(--color-river)",
  },
  {
    id: "lane3", name: "Lane 3 · Stabilize first, then house", who: "Highest acuity. Severe mental illness, severe substance use, or both; frequent emergency and jail contact; unsafe behavior or unable to consent today.",
    criteria: ["Cannot make a housing decision right now because of intoxication, withdrawal, or psychosis", "Frequent emergency, jail, or crisis contacts", "Medically fragile enough that a shelter cannot keep them safe", "Documented refusals of specific offers, usually for a nameable reason"],
    firstDoor: "Stabilization is the first placement: sobering, withdrawal management, crisis stabilization, or medical respite, with the next place held before discharge and a named lead who follows the person to a lease.",
    housingFirst: "Works once the person can consent, with an ACT team, medication, harm reduction, and the tolerance tools landlords need. Stabilization precedes the offer by hours or days; it never becomes a condition of the lease.",
    successLooksLike: "Fewer unsheltered days, deaths, overdoses, emergency visits, and jail bookings; engagement in treatment; progression to Lane 2; retention once housed.",
    scale: "Roughly 10% of shelter users but half of shelter nights. Meieran budgets 900–1,200 people a year at $45,000–65,000 each, capped and managed.",
    cohorts: ["sud", "smi", "dual-diagnosis", "medical-fragile", "service-refusing", "justice-involved"], color: "var(--color-clay)",
  },
];

// ── When Housing First works, and when it does not ────────────────

export interface HfRule {
  verdict: "works" | "works-with-conditions" | "not-by-itself";
  who: string;
  finding: string;
  evidence: string;
  source: string;
}

export const HOUSING_FIRST: HfRule[] = [
  { verdict: "works", who: "Chronic homelessness with serious mental illness", finding: "Offer the lease now, with an ACT team for high need and intensive case management for moderate need. Treatment-first halves housing time without improving clinical outcomes.", evidence: "At Home/Chez Soi RCT: 73% of days stably housed vs 32% over 24 months; sustained at 5.5 years. ACT beat standard case management in 8 of 10 trials.", source: "chez-soi-2015" },
  { verdict: "works", who: "Co-occurring mental illness and substance use", finding: "Housing without prerequisites, one integrated team, medication and contingency management available. Serial systems that each demand the other problem be fixed first leave the person outside.", evidence: "Pathways RCT (dual-diagnosis sample): earlier, more stable housing; no difference in substance use at 48 months.", source: "pathways-2004" },
  { verdict: "works", who: "Frequent jail users", finding: "Supportive housing arranged inside the jail, walking out to a unit and a worker. Supervision conditions that void the tenancy undo it.", evidence: "Just in Reach: 82% housed at 12 months, 24 fewer jail days. Denver RCT: 81% housed at two years. NYC FUSE: 40% fewer jail days, 91% fewer shelter days.", source: "urban-denver" },
  { verdict: "works", who: "Young adults 18–24 with mental illness", finding: "Scattered-site housing with youth-tailored support, never the adult shelter queue.", evidence: "At Home/Chez Soi youth subgroup: Housing First improved housing stability.", source: "chez-soi-youth" },
  { verdict: "works-with-conditions", who: "Families with children", finding: "Housing works, but the intervention is a permanent subsidy, not services and not a time-limited subsidy.", evidence: "Family Options RCT: a subsidy halved homelessness or doubling-up and cut shelter stays 75% at 37 months; rapid rehousing showed no stability gain at 37 months.", source: "family-options" },
  { verdict: "works-with-conditions", who: "Any program calling itself Housing First", finding: "Only at fidelity: standard lease, rent at or below 30% of income, services separate from tenancy, no readiness test, harm reduction, under 20% of a building program-leased, ACT caseloads of ten or fewer. Concentrated, under-staffed buildings fail, and that failure gets blamed on the model.", evidence: "Pathways fidelity scale items 4, 5a, 7, 16; the myths section's out-of-control-building cases are fidelity failures.", source: "hf-fidelity" },
  { verdict: "works-with-conditions", who: "The highest-acuity few in a scarce market", finding: "Landlords will not take them without system-level risk management: master leasing where the system holds the lease, a damage and vacancy fund, and a rapid tenancy-response team. Per-person cost is higher; volume is capped.", evidence: "Meieran's acuity model: Lane 3 at $45,000–65,000 per person, 900–1,200 people, offset by fewer emergency, jail, and shelter cycles.", source: "meieran-acuity" },
  { verdict: "not-by-itself", who: "As a treatment for substance use", finding: "Housing First keeps people housed and out of emergency rooms. It does not change substance use in either direction. Pair it with medication and contingency management, and judge it on housing and harm, not abstinence.", evidence: "Housing First meta-analysis: stability and reduced emergency use improve; substance use unchanged. Padgett 48-month follow-up: no difference in use.", source: "baxter-meta" },
  { verdict: "not-by-itself", who: "Someone who cannot consent today", finding: "In acute intoxication, withdrawal, or psychosis, stabilization comes first, for hours or days, with the lease offer made from the stabilization bed. The order is clinical; the offer is not conditional on completing anything.", evidence: "Meieran's Lane 3 sequence with the trial guardrail from Pathways fidelity item 7 (no housing-readiness requirement).", source: "meieran-acuity" },
  { verdict: "not-by-itself", who: "Someone too sick for a shelter", finding: "A lease cannot deliver wound care. Medical respite first, arranged before hospital discharge, with the housing worker attached at admission.", evidence: "Respite discharge halved 90-day readmission odds; housing plus case management cut hospitalizations 29% in a randomized trial.", source: "kertesz-2009" },
  { verdict: "not-by-itself", who: "Time-limited rapid rehousing as a Housing First substitute", finding: "The subsidy ends before income recovers and the person returns. Track month 25 or the failure is invisible.", evidence: "VA target-trial emulation: instability effect −12.9 points at day 120, −2.4 at three years.", source: "ssvf-2025" },
  { verdict: "not-by-itself", who: "Compulsory treatment as the route in", finding: "Forcing treatment does not produce housing or recovery. Civil commitment belongs to a narrow legal standard with intensive services attached; the order alone does nothing.", evidence: "Werb systematic review: no benefit, potential harm in 78% of studies; Massachusetts data: 1.4× overdose death after involuntary commitment; NC RCT: outpatient commitment helped only with sustained intensive services.", source: "commitment-review" },
  { verdict: "not-by-itself", who: "A region with no units", finding: "Housing First is a placement rule, not a plan. Where the queue over 90 days grows and vouchers sit unleased, the constraint is supply and landlords, and the count should say so rather than blame the model.", evidence: "Coordinated Access assessed 4,853 and placed 484 in FY2024; 1,088 of 1,371 tri-system users were outside supportive housing in the last match.", source: "fuse-multco" },
];

// ── Gap diagnostic: what the counts would say ─────────────────────

export const GAP_SIGNALS: GapSignal[] = [
  { stageId: "prevention", signal: "First-time entries rising while households paid also rises; median request-to-payment over 10 days; no stability cohort published.", likelyGap: "Assistance arrives after the move-out or is not targeted to filed evictions and discharges. Rising filings with rising payments means targeting; rising payments with slow speed means process.", portlandReading: "1,806 served against a 700 goal, but no speed, first-time, or follow-up measure. Outcome unknown; likely under-targeted and slow." },
  { stageId: "diversion", signal: "Share of first-time presenters diverted unreported or near zero; first-time entrants appear in shelter census within days of first contact.", likelyGap: "The stage does not exist: no conversation, no cash at the door, no single entry point where it could happen.", portlandReading: "No diversion count; no unified adult entry point. The largest, cheapest cohort has no stage." },
  { stageId: "unsheltered-active", signal: "Presumed and inactive bands large; many identified, few with a lead; contacts up while newly engaged is flat; yes-to-arrival failures clustered at night or by cohort.", likelyGap: "Coverage (no saturation mapping) if presumed is large; conversion capacity (navigators cut) if next steps are rare; downstream doors or eligibility rules if arrivals fail by hour or by cohort.", portlandReading: "6,327 contacts produced 212 newly engaged in one quarter; 10 navigators cut to zero; 361 camps to 3 beds. Coverage, conversion, and offer quality all fail, and the current metrics cannot tell which dominates." },
  { stageId: "institutional-exit", signal: "Exits to street unreported; many newly identified people had a release or discharge in the prior 30 days; the discharge-ready backlog grows; the same person keys recur in bookings quarter after quarter.", likelyGap: "No housing question at booking or admission, no reserved release-day beds, no worker before exit. If a worker is recorded and exits still go to the street, the gap is the bed; if no worker is ever recorded, the gap is the feed and the role.", portlandReading: "Wholly unknown. No housing status at booking, no discharge destinations, 41 state-hospital patients waiting about 200 days, no repeated three-system match. The stage with the best source data and the worst connection to the count." },
  { stageId: "intake-match", signal: "Assessments high but people waiting over 90 days growing; referrals rejected without reasons; vouchers unleased; assessments falling because assessors were cut.", likelyGap: "Assessments above vouchers means subsidy supply; unleased vouchers means landlords and risk; expiring matches means navigator capacity; provider rejections mean screening.", portlandReading: "4,853 assessed, 484 placed in FY2024; targets cut to 1,500 and 200 as funding fell from $9.3M to $4.7M. The queue is being shortened by defunding the door." },
  { stageId: "crisis-sobering", signal: "Admissions counted but dispositions missing; entry source almost all police; dispositions heavy on emergency and jail; low 7-day follow-up; repeat crises concentrated in a few hundred people.", likelyGap: "No door (capacity), a door with the wrong lock (referral-only), or no handoff out. The entry-source mix says which.", portlandReading: "13 referral-only stations against a 47-bed center due late 2027; 79 deflection referrals to 9 completions in one quarter; dispositions unpublished. The lock and the funnel after the door, then capacity." },
  { stageId: "withdrawal-management", signal: "Turn-aways logged against a fixed weekday hour; discharges with no destination; match rate under 50%; open beds unavailable to anyone placing.", likelyGap: "Downstream residential and recovery-housing shortage showing up as detox failure; then intake windows built for the facility rather than the moment of willingness.", portlandReading: "56% recommended residential, 17% of those placed; one-hour weekday intake; 139 beds against 424 needed; no open-bed status. The binding constraint is the next stage, then hours, then beds." },
  { stageId: "residential-treatment", signal: "Licensed beds far above staffed; waitlist days rising while beds are reported available; people waiting in jail or emergency rooms; exits by destination unknown.", likelyGap: "Licensed-versus-staffed beds the state counts that no worker can place into, and a missing step-down so completions end in shelter or the street.", portlandReading: "639 residential beds against 1,793 needed; licensed counts only; 30 activations from a $7M coordination center. Real shortage, and the beds that exist cannot report where people go next." },
  { stageId: "medical-respite", signal: "Homeless-flagged discharges to self-care high; respite referrals declined for capacity; readmissions well above the general rate; shelters reporting medically unmanageable guests.", likelyGap: "Too few respite beds and no protocol obligating a discharge plan, so the hospital is the only stage with a bed and the street is the destination. Both are payer gaps until respite is a Medicaid benefit.", portlandReading: "51 beds; 73% of homeless patients discharged to self-care statewide; the only step-down motel closed; no discharge rule. Capacity, protocol, and payer all absent." },
  { stageId: "emergency-shelter", signal: "Occupancy near capacity with long stays, few exits to housing per bed, and a large unknown-destination share; returns within 6 months high; beds open at 5 p.m. no worker can fill at 11 p.m.", likelyGap: "High occupancy with short stays and good exits means beds; high occupancy with long stays and poor exits means downstream housing. A blank destination field means the worst-reporting sites are the likeliest to be recycling people to the street.", portlandReading: "88% full, 73-day stays, 16% to housing, 54% unknown destinations; then 1,566 units cut while the count rose 21%, including the motel model that performs best. The gap is behind the shelter, in housing and exit data." },
  { stageId: "bridge-transition", signal: "No inventory; recovery beds shown with unknown occupancy; people exit treatment or jail to shelter or street; stabilization stages record 'no bed to send to.'", likelyGap: "The stage is missing at scale and invisible where it exists, so it cannot be managed or expanded on evidence.", portlandReading: "Blackburn, about 139 recovery beds, 24 youth beds, 19 bridge beds, one referral-only safe park, Oxford Houses uncounted; the state study omits recovery housing entirely. The largest structural hole in the stabilize-first lane; a registry is the first deliverable." },
  { stageId: "rapid-rehousing", signal: "Placements meet goals but returns after subsidy end are unreported or high; exits cluster at the end of the subsidy; conversions to a permanent voucher near zero; placements swing with mid-year budget actions.", likelyGap: "Subsidy ending before income catches up, no conversion path, and a returns measure with no target so the failure is invisible.", portlandReading: "938 placed against a 357 goal, then an $8.7M cut removing about 732 placements; retention after subsidy unreported. Works on intake, blind on exit." },
  { stageId: "permanent-supportive-housing", signal: "Vacancy days per turnover high; exits to shelter among high-acuity tenants; fidelity unassessed; acuity match unreported; landlords declining; pipeline slowing.", likelyGap: "Lease-up friction, service intensity mismatched to acuity, fidelity drift toward treatment conditions, or the tolerance tools missing for the highest-acuity few.", portlandReading: "6,973 beds, 439 new placements against a 248 goal, $16,000 per person against $47,000 per shelter bed, and no vacancy, turnover, fidelity, or acuity reporting. Best on cost, least measured on quality." },
  { stageId: "retention", signal: "Returns within 6, 12, 24 months unreported or above 20%; sustained counts without a denominator; eviction filings against subsidized tenants rising; returned-from-housing inflow growing.", likelyGap: "Success defined at move-in so nobody owns the tenancy after it: no response capacity, no risk fund, no follow-up cohorts.", portlandReading: "1,417 sustained in PSH with no rate on all placed; the returns indicator has no target. The loop that would validate every other stage is open." },
];

// ── What the critique found that the design does not yet cover ────

export interface Caveat {
  kind: "cohort" | "legal" | "data" | "governance" | "risk";
  title: string;
  body: string;
  source?: string;
}

export const CAVEATS: Caveat[] = [
  { kind: "cohort", title: "Veterans have no cohort", body: "771 counted tri-county in 2025, up 36%, with a parallel federal by-name system (HUD-VASH, SSVF) the county already links to. They are the readiest working model of inflow and outflow, and VA beds are absent from every capacity row." },
  { kind: "cohort", title: "Older adults have no cohort", body: "Roughly one in four homeless Oregonians is over 55. The medical-fragile pathway ends in adult foster or assisted living, but no stage counts long-term-care placements, the 90-to-100-day guardianship waits, or adult foster home capacity." },
  { kind: "cohort", title: "Doubled-up households and students are outside every denominator", body: "Oregon counted 21,122 students experiencing homelessness in 2024–25. The prevention denominator (renter households and eviction filings) misses the largest at-risk pool, which is not renting and not in court; school-district liaisons are an identification channel no stage uses." },
  { kind: "cohort", title: "Immigrant households, and the consent climate", body: "HUD signed a data-sharing agreement with DHS in March 2025 and a July 2025 executive order says HUD may require grantees to share data with law enforcement. A list that pursues 90% coverage and tracks non-consent will push the most exposed households off it. Coverage will be capped by refusal, not effort." },
  { kind: "cohort", title: "A new discharge channel opened June 1, 2026", body: "Under the state-hospital order, defendants found unable to aid and assist on misdemeanors are released within seven days and the state hospital admits only felony defendants. The three metro district attorneys say no agency owns where those people go. The courts already generate this count monthly." },
  { kind: "legal", title: "Survivor records cannot enter the shared key", body: "Federal rules bar victim-service providers from entering identifying information into HMIS even hashed. For the cohort that 56% of respondents name as the cause of their homelessness, the one-person-one-stage rule can only be enforced with aggregate flags, so survivors will be undercounted or double-counted depending on the door they use." },
  { kind: "legal", title: "Substance-use treatment records need patient consent", body: "42 CFR Part 2 requires written consent before a treatment program shares a record with a housing system, and the 2024 rule's compliance date was February 2026. The detox and residential match rates need a consent workflow, not just a data-use agreement, or those stages will show mostly unknown for years." },
  { kind: "legal", title: "Hospital homeless flags catch about a third of patients", body: "Diagnosis-code flags for homelessness had 28% sensitivity in a linkage study. A discharge-to-street rate built on them reports a third of the truth and varies by coding practice. The fix is a housing-status question at admission, as California's SB 1152 requires with a discharge log, and as Oregon already requires on death certificates." },
  { kind: "data", title: "A real-time hospital feed already exists", body: "Every Oregon hospital pushes admission and discharge notices to health plans and behavioral-health providers through EDIE, and it supports homelessness tags. Meieran's plan names it; the monthly hashed match should be the fallback, not the design." },
  { kind: "data", title: "The county already has an inactive rule", body: "The January 2026 Street Outreach Handbook defines inactive as three months with no service transaction plus three documented contact attempts and directs quarterly auto-exit. The 30- and 90-day bands sit on top of a rule that exists; the change is publishing it and reporting the bands." },
  { kind: "data", title: "The jail housing-status field is unverified", body: "No public document shows a housing question on the booking form; the 2018 match used address matching. Until the Sheriff adds the field, the institutional-exit count is a records request plus a form change the county board does not control." },
  { kind: "data", title: "Deaths cannot be reported monthly as designed", body: "Homeless status at death is determined annually by Medical Examiner review with a 12-month lag and documented misclassification. Monthly deaths by last stage would be a different, uncertified number or would not appear." },
  { kind: "governance", title: "The single system of record does not exist yet", body: "The three counties chose one vendor in July 2025 and said full rollout will take a few more years. The city runs its own shelters and its outreach data live in city systems with no published link. The first years of this design are a migration and a bilateral data negotiation, and every published trend is a series break." },
  { kind: "governance", title: "Tri-county in name, Multnomah in data", body: "Washington County has met the Built for Zero quality-data standard for chronic single adults since August 2020; Clackamas runs its own coordinated access; the SHS Regional Policy and Oversight Committee became the regional body on April 1, 2026. Only Multnomah uses its list as its official count. A regional stage table built from one county's data will be read as that county's problem exported." },
  { kind: "governance", title: "Federal money now scores the opposite of the fidelity rule", body: "The July 2025 executive order directs HUD to end support for Housing First and to require treatment participation as a condition. The $37.7M grant that funds the region's supportive housing is in litigation over exactly this. A region publishing fidelity scores is documenting non-compliance with whatever HUD reissues." },
  { kind: "risk", title: "Baseline shock", body: "Switching the official number from the list (about 8,800 unsheltered, 18,000 total) to a physically verified 30-day count would land near the 1,822 people the 2025 street survey found, in the middle of a city-county fight over inflated data and a chair's race in which the plan's author is a candidate. Publish the old and new series side by side for at least a year, or the method change will be read as a political act." },
  { kind: "risk", title: "The headline metric rewards seeing less", body: "A verified count falls whenever verification capacity falls. The county cut its navigators to zero and its outreach handbook auto-exits after three quiet months; under this design every such cut reads as outflow and the balance check passes. Publish coverage and reliability beside the headline, and add the companion: unsheltered-to-housing arrivals as a share of all outflow." },
  { kind: "risk", title: "A designed-to-fail metric for thirteen months", body: "Yes-to-arrival within 24 hours is red by construction until the 47-bed sobering and withdrawal center opens in late 2027, and a metric that penalizes a 2 a.m. yes with no door removes the incentive to log the yes. Report it as a capacity finding with the missing door named, not as a worker or program score." },
  { kind: "risk", title: "Diversion can become the screen-out federal rules forbid", body: "Coordinated entry may not screen people out for resistance to services or substance use, and people may refuse questions without losing access. A diversion stage judged on how many first-time presenters enter shelter anyway rewards keeping people out of beds. The evidence came from cash offered to people who asked for help, not from gatekeeping." },
];

// ── Headline metrics ──────────────────────────────────────────────

export const HEADLINE_METRICS = [
  { name: "Verified actively unsheltered", def: "People physically confirmed outside within 30 days, by county, with net monthly change and the three-month reliability percentage. The system passes only if this falls, and only if coverage did not." },
  { name: "Inflow, split", def: "First-time entries per 10,000 renter households; returned from housing; returned from inactive; discharge-to-street events by institution." },
  { name: "Yes to arrival within 24 hours", def: "Share of documented yeses that end in a confirmed arrival at any stage within a day, by cohort and hour of the yes. Reported as a capacity finding: which door was missing." },
  { name: "Days to a next step", def: "Median days from identification to a documented next step (target: 60–70% within 14 days); the queue waiting over 14, 30, and 90 days for a housing match." },
  { name: "Shelter throughput by model", def: "Median stay; exits to permanent housing per funded bed per year (today 0.39); share of exits to housing (target 35–50% by model); unknown destinations (today 54%; target under 10%)." },
  { name: "Stabilization handoff", def: "Share leaving sobering, detox, treatment, or respite with a confirmed arrival within 7 days; the level-recommended-versus-placed match rate (baseline 17%); 30- and 90-day repeat crisis contacts." },
  { name: "Returns and retention", def: "Returns within 6, 12, 24 months of any housing exit on all placed (target under 20% at 6 months); retention at 6, 12, 24 months (targets 85, 80, 75%)." },
  { name: "Open capacity tonight", def: "Staffed and open beds by stage, each door labeled with who can open it; days vacant per turnover in supportive housing." },
  { name: "Data reliability", def: "Balance-check error (under 15%); share of funded programs submitting within 72 hours (target 90%); share of the estimated unsheltered population on the verified list (target 90%, audited quarterly); whether the jail, hospital, and state-hospital feeds ran this month." },
] as const;

// ── Counting each bucket ──────────────────────────────────────────

export const COUNT_FIELDS: CountField[] = [
  { n: 1, name: "Person key", what: "Name and date of birth, hashed into one regional ID so a person is one row across three counties. Survivor records are the exception: aggregate flags only.", alreadyExists: "HMIS 3.01, 3.03; the tri-county move to one Bitfocus system" },
  { n: 2, name: "Contact date and source", what: "Which program saw the person and when. Every funded touch writes one row.", alreadyExists: "HMIS 4.12 information date plus project ID" },
  { n: 3, name: "Living situation at contact", what: "One code, collapsed into a stage: street, vehicle, overnight shelter, 24-hour shelter, detox or treatment, jail, hospital, transitional or recovery housing, housed with subsidy, housed without, deceased. This single field is the stage count.", alreadyExists: "HMIS 4.12 living-situation list (outreach, night-by-night shelter, coordinated entry); entry/exit projects use 3.10 and 3.12" },
  { n: 4, name: "Stage entry, exit, destination, move-in", what: "Placements and returns become dated events instead of inferences.", alreadyExists: "HMIS 3.10, 3.11, 3.12, 3.20" },
  { n: 5, name: "Cohort flags", what: "Disabling condition, veteran, household composition, age, domestic violence via the separate confidential database. Chronic status is derived from contact history, never asked.", alreadyExists: "HMIS 3.08, 3.07, 3.15; DV comparable database" },
  { n: 6, name: "Referral event, result, and arrival", what: "Type, date, accepted or rejected by whom, result date, plus one local field the federal standard lacks: arrival confirmed by the receiving site. This is the funnel step, and it makes open beds a by-product of the transaction.", alreadyExists: "HMIS 4.20 for the referral; arrival is a one-field local addition" },
  { n: 7, name: "Capacity per site per day", what: "Licensed, funded, staffed, occupied, open tonight, turned away, and decline rules in plain words, reported by the operator with the bed-night bill rather than into a separate registry.", alreadyExists: "The bed-night invoice; the site's own five bed layers" },
];

export const STALENESS_BANDS: StalenessBand[] = [
  { label: "Known", days: "0–30 days", meaning: "Seen in the last month. Counted in the stage of that contact.", color: "var(--color-fern)" },
  { label: "Presumed", days: "31–90 days", meaning: "Shown, but flagged. Outreach owes a re-verification.", color: "var(--color-ember)" },
  { label: "Inactive", days: "90+ days", meaning: "Not counted as anywhere. Returns count as inflow, not as new.", color: "var(--color-storm)" },
];

export const COUNT_RULES: CountRule[] = [
  { rule: "The worker at the point of contact enters it, inside the system of record.", why: "Never a side spreadsheet. Jail, emergency departments, Portland Street Response, and treatment providers contribute fields 1–3 through a monthly hashed match under a data-use agreement, with the hospital feed through EDIE in real time; treatment records need patient consent first." },
  { rule: "A stage is last known situation plus days since contact, never a guess.", why: "The county's own outreach handbook already auto-exits after three quiet months; Charlotte-Mecklenburg uses 90 days; Meieran uses 30 for unsheltered status. Publish the threshold and report the bands." },
  { rule: "Degrade gracefully.", why: "A missing living situation defaults to unknown, never to unsheltered or housed. A provider that stops reporting becomes a visible coverage hole, not a smaller count." },
  { rule: "Self-check every period.", why: "Active this week equals active last week plus inflow minus outflow. Publish the error and hold it under Built for Zero's 15% standard. A week that fails is published as failing." },
  { rule: "Count people, not enrollments or calls.", why: "One ID per person. Jail and hospital are a stage, not an exit, so nobody is simultaneously housed and in custody." },
  { rule: "Separate the who-is-here list from the who-gets-what queue.", why: "The count is contact-driven. Prioritization assessments are optional enrichment, never a precondition for being counted, and federal coordinated-entry rules forbid screening people out for refusing them." },
  { rule: "Close the loop from the institutions that already have perfect data.", why: "Jail release, psychiatric emergency registrations, and Medical Examiner deaths flow back as stage transitions with a reason. Deaths are annual and certified; do not fake a monthly number." },
  { rule: "Publish weekly as a fixed table, keep the monthly number official, and run the old series beside the new one for a year.", why: "Stage by staleness band by cohort by county, with the reliability percentage and coverage list. A method change that cuts the headline by three quarters must be visible as a method change." },
];

/** Multnomah County's own Built for Zero scorecard, October 2024 (All Singles Adult, Population A). */
export const SCORECARD = {
  score: 20,
  of: 29,
  caption: "Built for Zero quality-data scorecard, single adults, October 2024, the most recent the county has published. Red items are the conditions the county reports it does not meet.",
  source: "multco-bfz-scorecard",
  items: [
    { id: "1A", met: false, text: "Outreach geographic coverage mapped, data-informed, and regularly assessed" },
    { id: "1B", met: false, text: "Outreach teams deployed where and when they engage people, without duplication" },
    { id: "1C", met: false, text: "A documented outreach policy stating deployment and hand-offs" },
    { id: "1D", met: false, text: "Confidence that at least 90% of the unsheltered population is on the list" },
    { id: "2A", met: false, text: "90% of funded and non-funded providers report into the list" },
    { id: "2B", met: false, text: "90–100% of currently homeless single adults served are on the list" },
    { id: "3A", met: true, text: "Can capture people sleeping outside, in vehicles, in camps" },
    { id: "3B", met: true, text: "Can capture people in shelters, overflow beds, hotels" },
    { id: "3C", met: true, text: "Can capture people in transitional housing" },
    { id: "3D", met: true, text: "Can capture people fleeing domestic violence" },
    { id: "4A", met: true, text: "A written inactive policy with a day threshold and location attempts" },
    { id: "4B", met: true, text: "Inactive on verified absence (reunification, death) before the threshold" },
    { id: "4C", met: true, text: "Handles stays in jail or hospital of 90 days or fewer" },
    { id: "5", met: false, text: "A way to track actively homeless people who have not consented to services" },
    { id: "6", met: false, text: "Policies for keeping the list current: provider submission timelines and quality assurance" },
    { id: "7", met: false, text: "Tracks homeless / inactive / housed status with the date it last changed" },
    { id: "8", met: true, text: "A unique identifier per person" },
    { id: "9", met: true, text: "Tracks newly identified people each month" },
    { id: "10", met: true, text: "Tracks returns to active homelessness" },
    { id: "11A", met: true, text: "Tracks moves into permanent housing" },
    { id: "11B", met: true, text: "Tracks moves to inactive per the policy" },
    { id: "11C", met: true, text: "Tracks people who no longer meet the single-adult criteria" },
    { id: "12A", met: true, text: "Tracks veteran, chronic, youth, family statuses" },
    { id: "12B", met: true, text: "Supports multiple concurrent statuses" },
    { id: "12C", met: true, text: "Tracks historical status changes" },
    { id: "12D", met: true, text: "Identifies people who become chronic after entry" },
    { id: "12E", met: true, text: "Adjusts statuses when criteria are no longer met" },
    { id: "13A", met: true, text: "Reports race and ethnicity for outcome analysis" },
    { id: "13B", met: true, text: "Respects self-identification" },
  ],
} as const;

// ── Sources shown on the page (the full registry is research/homelessness-continuum/sources.md) ──

export const CONTINUUM_SOURCES: { title: string; org: string; url: string; kind: "primary" | "research" | "news" }[] = [
  { title: "Comprehensive Multnomah County Turnaround Plan (Feb. 6, 2026 update)", org: "Sharon Meieran", url: "https://www.sharonforchair.com/s/Comprehensive-Multnomah-County-Turnaround-Plan-2-6-26-update.pdf", kind: "primary" },
  { title: "Establishment of a True By-Name System", org: "Sharon Meieran", url: "https://docs.google.com/document/d/1uijr3Srf0Go9QbZZ5HckMd3WjTV5lz_kxrgPLZwqJ9k/edit?usp=sharing", kind: "primary" },
  { title: "Accounting for Serious Mental Illness, Addiction and Housing Scarcity: an acuity-based model", org: "Sharon Meieran", url: "https://docs.google.com/document/d/1lQNYIVTCr_XSG3yi62hhXw7bdPVHPwX38BWgpOAnICI/edit?usp=sharing", kind: "primary" },
  { title: "Behavioral Health System Turnaround Plan", org: "Sharon Meieran", url: "https://docs.google.com/document/d/e/2PACX-1vTNY_sTVl6y8sCt1lINhS4-NDnF8P0sdlPXzbQrFa2onhk8xzsGkDvaouz6Xj-5qpkeKt1fnnQ3Nqjy/pub", kind: "primary" },
  { title: "Substance Use Disorder Continuum of Care: Voices from the Front Line (expert group, March 2024)", org: "Convened by Commissioner Meieran", url: "https://drive.google.com/file/d/1uZhDgD_cAOhBMxQO5JN4aRuTl4cOGnoj/view", kind: "primary" },
  { title: "Built for Zero scorecard for Multnomah County, October 2024 (20 of 29)", org: "Multnomah County HSD", url: "https://hsd.multco.us/wp-content/uploads/2024/10/Current-Scorecard-Score-for-Multnomah-County-All-Singles-Adult-Population-A-2.pdf", kind: "primary" },
  { title: "Adult Shelter Review FY25", org: "Multnomah County HSD", url: "https://hsd.multco.us/wp-content/uploads/2026/01/Adult-Shelter-Review-FY25.pdf", kind: "primary" },
  { title: "2025 Tri-County Point-in-Time Count Report", org: "PSU Homelessness Research & Action Collaborative", url: "https://hsd.multco.us/wp-content/uploads/2025/11/2025-Tri-County-PITC-Report-11.04.25.pdf", kind: "research" },
  { title: "FY 2026 SHS Quarter 4 Report", org: "Multnomah County HSD", url: "https://hsd.multco.us/wp-content/uploads/2026/09/Q4-FY26-SHS-Report-FINAL-Updated-8.28.26.pdf", kind: "primary" },
  { title: "Street Outreach Handbook (January 2026)", org: "Multnomah County HSD", url: "https://hsd.multco.us/wp-content/uploads/2026/01/Street-Outreach-Handbook_January-2026.pdf", kind: "primary" },
  { title: "Sobering services at the Coordinated Care Pathway Center; referral access expanded June 24, 2025", org: "Multnomah County", url: "https://multco.us/info/sobering-services", kind: "primary" },
  { title: "Deflection Program 2024–2025 Annual Report", org: "Multnomah County", url: "https://multco.us/file/deflection_program_2024-2025_annual_report/download", kind: "primary" },
  { title: "Program offer 30210B, FY2026 adopted (navigation workers cut to zero)", org: "Multnomah County", url: "https://multco.us/file/30210b-26_adopted.pdf/download", kind: "primary" },
  { title: "Behavioral Health Residential+ Facility Study (June 2024)", org: "Oregon Health Authority / Public Consulting Group", url: "https://www.oregon.gov/oha/HSD/AMH/DataReports/Behavioral-Health-Residential-Facility-Study-June-2024.pdf", kind: "research" },
  { title: "Meeting our region's need for more treatment beds (Hooper 2022 data)", org: "Central City Concern", url: "https://centralcityconcern.org/blog/meeting-our-regions-need-for-more-treatment-beds/", kind: "primary" },
  { title: "Joint Task Force on Hospital Discharge Challenges: Report and Recommendations (Nov. 2024)", org: "Oregon Legislature", url: "https://www.oregonlegislature.gov/lpro/Publications/Joint%20Task%20Force%20on%20Hospital%20Discharge%20Challenges%20-%20Report%20and%20Recommendations%20(2024).pdf", kind: "primary" },
  { title: "Frequent Users Systems Engagement data match (2018 data)", org: "CSH with Health Share, JOHS, LPSCC, MCSO", url: "https://www.multco.us/multnomah-county/news/report-revealing-frequent-crossover-jail-homeless-and-health-systems-serve", kind: "research" },
  { title: "Multnomah, Clackamas, and Washington County DAs on the June 1, 2026 state-hospital order", org: "Multnomah County District Attorney", url: "https://www.mcda.us/index.php/news/multnomah-clackamas-washington-county-das-sound-the-alarm-on-failing-mental-health-system-demand-help-from-the-governor-and-lawmakers", kind: "primary" },
  { title: "FY2026 HMIS Data Dictionary", org: "U.S. Department of Housing and Urban Development", url: "https://files.hudexchange.info/resources/documents/HMIS-Data-Dictionary.pdf", kind: "primary" },
  { title: "Coordinated Entry requirements, Notice CPD-17-01", org: "U.S. Department of Housing and Urban Development", url: "https://www.hud.gov/sites/documents/17-01cpdn.pdf", kind: "primary" },
  { title: "System Performance Measures Introductory Guide", org: "U.S. Department of Housing and Urban Development", url: "https://files.hudexchange.info/resources/documents/System-Performance-Measures-Introductory-Guide.pdf", kind: "primary" },
  { title: "Quality by-name data standards and the single-adults scorecard", org: "Community Solutions / Built for Zero", url: "https://community.solutions/quality-by-name-data/", kind: "research" },
  { title: "National Guidelines for a Behavioral Health Coordinated System of Crisis Care (2025)", org: "SAMHSA", url: "https://988crisissystemshelp.samhsa.gov/sites/default/files/2025-04/national-guidelines-crisis-care-pep24-01-037.pdf", kind: "primary" },
  { title: "Pathways Housing First Fidelity Scale (ACT version)", org: "Tsemberis & Stefancic", url: "https://housingfirsttoolkit.ca/wp-content/uploads/Pathways_Housing_First_Fidelity_Scale_ACT_2013.pdf", kind: "research" },
  { title: "Critical Time Intervention model", org: "Center for the Advancement of CTI", url: "https://www.criticaltime.org/cti-model/", kind: "research" },
  { title: "Comparable Database 101 (VAWA / FVPSA rules for survivor records)", org: "Safety Net Project, NNEDV", url: "https://www.techsafety.org/comparable-database-101", kind: "primary" },
  { title: "42 CFR Part 2, confidentiality of substance use disorder patient records", org: "U.S. Department of Health and Human Services", url: "https://www.hhs.gov/hipaa/part-2/index.html", kind: "primary" },
  { title: "Applying Cluster Analysis to Test a Typology of Homelessness (Kuhn & Culhane, 1998)", org: "American Journal of Community Psychology", url: "https://www.homelesshub.ca/resource/applying-cluster-analysis-test-typology-homelessness-pattern-shelter-utilization-results", kind: "research" },
  { title: "Do Homelessness Prevention Programs Prevent Homelessness? (Santa Clara RCT)", org: "Review of Economics and Statistics, 2023", url: "https://direct.mit.edu/rest/article/doi/10.1162/rest_a_01344/116185/Do-Homelessness-Prevention-Programs-Prevent", kind: "research" },
  { title: "Effect of scattered-site housing using rent supplements and intensive case management (At Home/Chez Soi)", org: "JAMA, 2015", url: "https://pubmed.ncbi.nlm.nih.gov/25734732/", kind: "research" },
  { title: "Housing First, consumer choice, and harm reduction for homeless individuals with a dual diagnosis (Pathways RCT)", org: "American Journal of Public Health, 2004", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1448313/", kind: "research" },
  { title: "Family Options Study: 3-Year Impacts", org: "HUD Office of Policy Development and Research", url: "https://www.huduser.gov/portal/sites/default/files/pdf/family-options-study-full-report.pdf", kind: "research" },
  { title: "Comparative efficacy of psychosocial interventions for stimulant use (50-RCT network meta-analysis)", org: "PLOS Medicine, 2018", url: "https://journals.plos.org/plosmedicine/article?id=10.1371%2Fjournal.pmed.1002715", kind: "research" },
  { title: "Effectiveness of compulsory drug treatment: a systematic review (Werb et al.)", org: "International Journal of Drug Policy, 2016", url: "https://pubmed.ncbi.nlm.nih.gov/26790691/", kind: "research" },
  { title: "Post-hospital medical respite care and readmission (Kertesz et al.)", org: "Journal of Prevention & Intervention in the Community, 2009", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2702998/", kind: "research" },
  { title: "Just in Reach Pay for Success evaluation", org: "RAND", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10187556/", kind: "research" },
  { title: "Denver Supportive Housing Social Impact Bond: final outcome payments", org: "Urban Institute", url: "https://www.urban.org/research/publication/denver-supportive-housing-social-impact-bond-initiative-final-outcome-payments", kind: "research" },
  { title: "Domestic Violence Housing First demonstration, 24-month findings", org: "HHS ASPE", url: "https://aspe.hhs.gov/sites/default/files/documents/eb0cdf65b491681cf9b6db2f6d4d8df5/dvhf-24-month-exec-summary.pdf", kind: "research" },
  { title: "Rapid re-housing and housing instability among veterans (target-trial emulation)", org: "PMC, 2025", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12052498/", kind: "research" },
  { title: "Behind Portland's homelessness data, a familiar political fight emerges", org: "OPB", url: "https://www.opb.org/article/2026/04/01/behind-portlands-homelessness-data-familial-political-fight-emerges/", kind: "news" },
  { title: "1,566 fewer beds: the full extent of recent Portland shelter closures and proposed cuts", org: "Street Roots", url: "https://www.streetroots.org/news-stories/2026/05/27/1566-fewer-beds-the-full-extent-of-recent-portland-shelter-closures-and-proposed-cuts/", kind: "news" },
  { title: "Some patients at Oregon State Hospital stuck there for months", org: "Street Roots", url: "https://www.streetroots.org/news-stories/2026/04/01/some-patients-at-oregon-state-hospital-stuck-there-for-months/", kind: "news" },
];
