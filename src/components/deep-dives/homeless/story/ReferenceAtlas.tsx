import { BH_SOURCES, BH_CARE_SETTINGS } from "@/lib/homeless/behavioral-health";
import { DIAGNOSIS_SOURCES } from "./diagnosis-data";
import styles from "./ReferenceAtlas.module.css";

const SOURCES = {
  council: { title: BH_SOURCES.slides.title, date: BH_SOURCES.slides.date, url: BH_SOURCES.slides.url, scope: "Council briefing: reported associations and clinical-capacity proposals; not an adopted policy or live vacancy inventory." },
  pathways: {
    title: "PSU Pathways: housing experiences and preferences",
    date: "April 9, 2026 · survey fieldwork in 2025",
    url: "https://hsd.multco.us/wp-content/uploads/2026/04/Pathways-Survey-Findings-Published-4.9.2026.pdf",
    scope: "Methods and sample, pp. 20–28; housing preferences, pp. 44–49. A purposive sample, not a population census.",
  },
  shelter: {
    title: "Multnomah County Adult Shelter Review FY25",
    date: "January 2026 · July 2024–June 2025 operations",
    url: "https://hsd.multco.us/wp-content/uploads/2026/01/Adult-Shelter-Review-FY25.pdf",
    scope: "31 reviewed programs; costs and housing resources. Exit totals differ across sections; see the method note below.",
  },
  access: {
    title: "Coordinated Access policies and procedures",
    date: "Version 1.1 · November 2025",
    url: "https://hsd.multco.us/wp-content/uploads/2025/12/1.0_CA_Policies_FINAL_2025.pdf",
    scope: "Housing problem solving, assessment, matching preferences, provider responsibilities and denial tracking.",
  },
  street: {
    title: "Portland Street Services weekly report",
    date: "August 3–9, 2026 · published August 11",
    url: "https://www.portland.gov/homelessness-impact-reduction/news/2026/8/11/weekly-street-services-report-august-3-9-2026",
    scope: "Campsite activity and shelter-referral measures have different units. Weekly totals are not a linked person-level journey.",
  },
  rent: {
    title: "Home Forward voucher payment standards",
    date: "Effective January 1, 2026",
    url: "https://www.homeforward.org/wp-content/uploads/2026/04/1_2026-Payment-Standard-Voucher-Issuance.pdf",
    scope: "Administrative gross-rent benchmarks by bedroom size; not available listings, average subsidies or service costs.",
  },
  budget: {
    title: "Homeless Services Department adopted budget",
    date: "FY2027 · July 2026–June 2027",
    url: "https://multco.us/file/homeless_services_department-0/download",
    scope: "Appropriations and targets, including access/navigation and bridge housing; not actual expenditures or outcomes.",
  },
  city: {
    title: "Changes for Portland’s city shelter services",
    date: "July 21, 2026 · updated August 24",
    url: "https://www.portland.gov/shelter-services/news/2026/7/21/changes-city-shelter-services",
    scope: "Announced site changes and effective dates. Future inventory is not current availability.",
  },
  conferencing: {
    title: "Cross Sector Case Conferencing",
    date: "County information · reviewed September 8, 2026",
    url: "https://hsd.multco.us/cross-sector-case-conferencing/",
    scope: "An existing link between housing, health and disability providers. The conferencing program itself supplies no housing resources.",
  },
  respite: {
    title: "Central City Concern Recuperative Care",
    date: "Provider information · reviewed September 8, 2026",
    url: "https://centralcityconcern.org/health-care-location/recuperative-care/",
    scope: "Referral process and program fit, including independence in daily activities and medication management.",
  },
  retention: {
    title: "HSD budget worksession follow-up: housing retention",
    date: "May 14, 2025 · slide 11",
    url: "https://multco.us/file/fy_2026_homeless_services_department_budget_worksession_follow-up/download",
    scope: "Retention reporting and missing follow-up information; percentages refer to differently described cohorts.",
  },
  hooper: {
    title: "Central City Concern Hooper Detoxification Stabilization Center",
    date: "Provider information · reviewed September 8, 2026",
    url: "https://centralcityconcern.org/recovery-location/hooper-detoxification-stabilization-center/",
    scope: "Inpatient and outpatient services, access and transition planning. Program hours and admission windows differ.",
  },
  facilities: {
    title: "OHA Behavioral Health Residential+ Facility Study",
    date: "June 2024 final report · historical planning study",
    url: "https://www.oregon.gov/oha/HSD/AMH/DataReports/Behavioral-Health-Residential-Facility-Study-June-2024.pdf",
    scope: "Facility types and modeled need. Its Portland/North Coast area extends beyond the three metro counties.",
  },
  sobering: {
    title: "Multnomah County sobering services",
    date: "County page last reviewed July 13, 2026",
    url: "https://multco.us/info/sobering-services",
    scope: "Referral partners, voluntary access and program scope. Published capacity does not establish an available place now.",
  },
  prevention: {
    title: "County Human Services adopted budget",
    date: "FY2027 · prevention programs, pp. 119–120",
    url: "https://multco.us/file/county_human_services_including_preschool_for_all-0/download",
    scope: "Eviction-prevention and in-reach appropriations with output targets. Budgeted help is not yet a verified housing outcome.",
  },
} as const;

const ADDITIONAL_SOURCES = [
  {
    title: "2025 Tri-County Point-in-Time Count report",
    date: "November 4, 2025 · January 2025 count",
    url: "https://hsd.multco.us/wp-content/uploads/2025/11/2025-Tri-County-PITC-Report-11.04.25.pdf",
    scope: "Multnomah County totals, pp. 23–25, including sheltered, surveyed unsheltered and presumed unsheltered categories. This is a dated estimate, not a count of people outside today.",
  },
  {
    title: "HUD 2025 Housing Inventory Count: Portland / Gresham / Multnomah County",
    date: "2025 inventory · CoC OR-501, p. 1",
    url: "https://files.hudexchange.info/reports/published/CoC_HIC_CoC_OR-501-2025_OR_2025.pdf",
    scope: "Year-round emergency, safe-haven and transitional beds for the capacity comparison. Inventory is not the number of vacant, staffed or suitable beds.",
  },
  {
    title: "Multnomah County shelter updates",
    date: "Published May 6, 2026 · closure schedule reviewed September 8",
    url: "https://hsd.multco.us/2026/05/06/shelter-updates/",
    scope: "Shelter closure dates, transition plans and intake changes. Announced reductions and completed closures must be distinguished.",
  },
  {
    title: "Multnomah County shelter directory and access rules",
    date: "County information · reviewed September 8, 2026",
    url: "https://hsd.multco.us/emergency-shelters/list-of-shelters/",
    scope: "Published referral routes and program conditions, including referral-only and approved-housing-placement requirements. A listing is not a live vacancy offer.",
  },
  {
    title: "Multnomah County Supportive Housing Services report: FY26 Q4",
    date: "April–June 2026 · updated August 28, 2026",
    url: DIAGNOSIS_SOURCES.quarter.href,
    scope: "Outreach reporting and Housing Only referral capacity, pp. 5–6; supportive-housing vacancies, property management, staffing and service costs, pp. 7 and 9. These findings concern the reported programs and period.",
  },
  {
    title: "Multnomah County approach to unsheltered homelessness",
    date: "County information · reviewed September 8, 2026",
    url: DIAGNOSIS_SOURCES.outreach.href,
    scope: "Existing outreach and coordinated placement practices. Describing a service does not establish complete geographic coverage, adequate staffing or successful arrivals.",
  },
  {
    title: "Central City Concern: meeting the region’s need for treatment beds",
    date: "November 12, 2024 · Hooper assessments in 2022",
    url: DIAGNOSIS_SOURCES.treatment.href,
    scope: "1,554 assessments recommended residential care and 264 led to residential placement at discharge. Assessments need not be unique people; the historical result is not a current system-wide rate.",
  },
  {
    title: "Central City Concern 16 x Burnside Recovery Center",
    date: "Opened May 2025 · provider page reviewed September 8, 2026",
    url: DIAGNOSIS_SOURCES.burnside.href,
    scope: "Subsequent treatment-capacity addition and published levels of care. Added beds alone do not demonstrate improved recommendation-to-admission outcomes.",
  },
  {
    title: "Central City Concern Letty Owings Center closure FAQ",
    date: "Updated September 1, 2026 · closure announced for October 31",
    url: DIAGNOSIS_SOURCES.letty.href,
    scope: "Admissions pause, provider-stated care, workforce and funding challenges, and transition plans. Listed alternatives do not establish a suitable place is available for every family.",
  },
  {
    title: "Multnomah County FY27 adopted-budget announcement",
    date: "June 5, 2026",
    url: DIAGNOSIS_SOURCES.benefits.href,
    scope: "One-time mobile eviction-prevention funding and expected Medicaid rent assistance. The forecast is not a record of benefits delivered or evictions prevented.",
  },
  {
    title: "County Auditor request to implement audit recommendations",
    date: "Memorandum to the Board · April 21, 2026, pp. 3–4",
    url: DIAGNOSIS_SOURCES.oversight.href,
    scope: "The Auditor’s assessment of high-risk provider monitoring and the unresolved advocacy/oversight role conflict. The memo does not establish that all providers misuse funds or explain every service disruption.",
  },
];

const BIBLIOGRAPHY = Array.from(
  new Map([...Object.values(SOURCES), ...ADDITIONAL_SOURCES, ...Object.values(BH_SOURCES).map((source) => ({ ...source, scope: "September 9 update: see the clinical section for claim-level qualifications and source locations." }))].map((source) => [source.url, source])).values(),
);

type AtlasFunction = {
  name: string;
  definition: string;
  resource: string;
  source: keyof typeof SOURCES;
  measure: string;
};

const GROUPS: { title: string; description: string; items: AtlasFunction[] }[] = [
  {
    title: "Keep a housing crisis from becoming homelessness",
    description: "Prevention · housing problem solving",
    items: [
      { name: "Prevention", definition: "Help a household keep its housing through timely financial assistance, benefits, negotiation or other support.", resource: "The County funds eviction-prevention assistance and an in-reach team to help eligible households access support.", source: "prevention", measure: "Days from request to payment; housing status after assistance; how many outcomes remain unknown." },
      { name: "Housing problem solving and diversion", definition: "Explore safe housing options with the household, including help to preserve or restore an arrangement they choose.", resource: "Coordinated Access policies already include housing problem solving, with mediation and limited financial help.", source: "access", measure: "People receiving help; time to a verified arrangement; subsequent homelessness, with follow-up coverage disclosed." },
    ],
  },
  {
    title: "Make contact and connect the next place",
    description: "Outreach · institutional transitions · assessment and matching",
    items: [
      { name: "Outreach and engagement", definition: "Build a working relationship, understand what someone wants and connect them with suitable help.", resource: "City Street Services reports campsite activity, interest in shelter referrals, accepted referrals and initial bed use.", source: "street", measure: "Unique people reached; suitable offers; completed arrivals; reasons an accepted offer did not become a placement." },
      { name: "Institutional in-reach and discharge coordination", definition: "Connect housing and support before and after a person leaves a hospital, jail or treatment setting.", resource: "County case conferencing connects housing, healthcare and disability providers. Housing resources must still be secured.", source: "conferencing", measure: "Confirmed receiving place and support; completed arrivals; unsuccessful handoffs by reason and release setting." },
      { name: "Assessment and housing matching", definition: "Match a household’s preferences and support needs to an appropriate, funded resource while housing search continues.", resource: "Coordinated Access policies set matching and provider responsibilities, including preferences and denial tracking.", source: "access", measure: "Time from assessment to funded match and move-in; pending cases; rejected matches and their reasons." },
    ],
  },
  {
    title: "Provide care alongside the housing plan",
    description: "Crisis support · psychiatric care · withdrawal and addiction treatment · medical respite",
    items: [
      { name: "Crisis stabilization and sobering", definition: "Different services respond to urgent mental-health needs and intoxication. They have different staffing and admission criteria.", resource: "The County’s sobering program is one specific referral-based, voluntary service; it is not a substitute for emergency care.", source: "sobering", measure: "Appropriate referrals; arrivals; declined admissions by reason; confirmed next connections after discharge." },
      { name: "Withdrawal management", definition: "Clinician-directed support for withdrawal, with ongoing treatment and housing connections planned together.", resource: "Hooper provides inpatient and outpatient care and describes transition planning among its services.", source: "hooper", measure: "Time to suitable care; access barriers; continuity of treatment; the person’s destination after the episode." },
      { name: "Residential substance-use treatment", definition: "Care in an appropriate treatment setting when indicated, with a plan for housing and support afterward.", resource: "OHA’s facility study distinguishes psychiatric, residential and withdrawal-care settings and their staffing needs.", source: "facilities", measure: "Staffed and usable capacity by care level; wait time; discharge-ready delays; completed follow-on connections." },
      ...BH_CARE_SETTINGS.filter((care) => ["inpatient", "subacute", "psychiatric-respite"].includes(care.id)).map((care): AtlasFunction => ({ name: care.name, definition: care.purpose, resource: care.boundary, source: "council", measure: care.measure })),
      { name: "Medical respite after physical illness or injury", definition: "A place to recover with support after illness or injury, matched to the person’s actual daily care needs.", resource: "CCC Recuperative Care publishes its referral and independence criteria; people needing more assistance require a different match.", source: "respite", measure: "Referrals accepted or declined and why; time to an appropriate setting; housing and care continuity afterward." },
    ],
  },
  {
    title: "Offer a suitable place during the transition",
    description: "Emergency shelter · bridge and transitional housing",
    items: [
      { name: "Emergency shelter", definition: "Temporary safety with a practical route to housing, in a setting that can meet the household’s needs.", resource: "The County’s FY25 review examines shelter models, operating costs, outcomes and access to additional housing resources.", source: "shelter", measure: "Usable capacity; housing resources attached; length of stay; destinations, with unknown outcomes shown separately." },
      { name: "Bridge and transitional housing", definition: "An interim setting while a longer-term housing and support arrangement is secured. Program models and eligibility vary.", resource: "The FY27 adopted HSD budget includes Bridge Housing program 30207, with funding and a unit target.", source: "budget", measure: "Operating capacity; who can use it; time to a suitable longer-term placement; outcomes after leaving." },
    ],
  },
  {
    title: "Reach a home and help it last",
    description: "Rapid rehousing · permanent housing and support · retention",
    items: [
      { name: "Rapid rehousing", definition: "Housing search and time-limited rental assistance, with support and reassessment as the household’s circumstances change.", resource: "HSD funds housing-placement programs; its budget follow-up includes rapid-rehousing retention reporting.", source: "retention", measure: "Time to move-in; assistance received; housing status after the subsidy ends; transfers to ongoing support." },
      { name: "Permanent housing with ongoing assistance", definition: "A lasting home with rent assistance when needed. Supportive housing also connects tenancy with ongoing services.", resource: "Coordinated Access connects households to housing programs. The rent subsidy, unit and service capacity are separate resources.", source: "access", measure: "Funded matches; vacant-unit delays; move-ins; services available; housing outcomes by support need." },
      { name: "Housing retention and tenancy support", definition: "Respond to tenancy problems and changing support needs after move-in, and establish whether the person remains housed.", resource: "County reporting already includes retention measures and identifies missing follow-up information.", source: "retention", measure: "Confirmed housing, observed returns, other outcomes and unknown status at 3, 6 and 12 months." },
    ],
  },
];

function DisclosureTitle({ title, description }: { title: string; description: string }) {
  return (
    <summary className={styles.summary}>
      <span>
        <span className={styles.summaryTitle}>{title}</span>
        <span className={styles.summaryDescription}>{description}</span>
      </span>
      <span className={styles.toggle} aria-hidden="true">+</span>
    </summary>
  );
}

/** The reference layer describes concurrent functions, never a mandatory sequence. */
export default function ReferenceAtlas() {
  return (
    <div className={styles.atlas}>
      <p className={styles.intro}>
        Overlapping functions, grouped by what they do. A person can use several at once:
        living in shelter, looking for a home and receiving care. These are not mandatory
        steps someone must complete.
      </p>
      <div className={styles.groups}>
        {GROUPS.map((group) => (
          <details className={styles.disclosure} key={group.title}>
            <DisclosureTitle title={group.title} description={group.description} />
            <div className={styles.functionGrid}>
              {group.items.map((item) => (
                <article className={styles.function} key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.definition}</p>
                  <div className={styles.resource}>
                    <span className={styles.label}>Source context and limits</span>
                    <p>{item.resource}</p>
                    <a href={SOURCES[item.source].url}>{SOURCES[item.source].title}</a>
                  </div>
                  <div className={styles.measure}>
                    <span className={styles.label}>Proposed measure</span>
                    <p>{item.measure}</p>
                  </div>
                </article>
              ))}
            </div>
          </details>
        ))}
      </div>
      <div className={styles.evidence}>
        <details className={styles.disclosure}>
          <DisclosureTitle title="Sources you can inspect" description={`${BIBLIOGRAPHY.length} primary reports, policies, budgets and provider documents`} />
          <ol className={styles.sources}>
            {BIBLIOGRAPHY.map((source) => (
              <li key={source.url}>
                <a href={source.url}>{source.title}</a>
                <p className={styles.sourceDate}>{source.date}</p>
                <p>{source.scope}</p>
              </li>
            ))}
          </ol>
          <p className={styles.sourceNote}>
            Reviewed September 8, 2026. These sources document a program or a reporting
            period; they do not establish whether a place is available today.
          </p>
        </details>
        <details className={styles.disclosure}>
          <DisclosureTitle title="How to read the evidence" description="Facts, proposals, unknowns and the September 8, 2026 revision" />
          <div className={styles.methods}>
            <dl className={styles.evidenceTypes}>
              <div><dt>Documented</dt><dd>A finding or program rule in a named source, limited to its population, place and reporting period.</dd></div>
              <div><dt>Proposed</dt><dd>Portland Civic Lab’s recommendation or illustrative journey. A suggested connection is not a measured result.</dd></div>
              <div><dt>Unknown</dt><dd>The reviewed evidence does not establish the answer. Missing data do not prove a service is absent or a person returned to the street.</dd></div>
            </dl>
            <div className={styles.methodNote}>
              <h3>A source conflict remains open</h3>
              <p>
                The FY25 shelter review gives different exit totals and unreported-destination
                shares in different sections, including pages 13 and 35. It supports the
                finding that roughly half of exits had unreported destinations. An exact
                outcome diagram needs a reconciled worksheet; this page does not turn a
                rounded percentage into an exact number of people.
              </p>
              <a href={SOURCES.shelter.url}>Inspect the Adult Shelter Review</a>
            </div>
            <div className={styles.methodNote}>
              <h3>Compare the same thing</h3>
              <p>
                Campsites are not people. Annual program outputs are not a current waiting
                list. A facility’s licensed capacity is not its available capacity. A
                published budget is not actual spending. Cost comparisons need the same
                unit, period and included services; rates need a defined denominator.
              </p>
            </div>
            <div className={styles.methodNote}>
              <h3>From a question to records</h3>
              <p>
                The investigation templates ask for public, aggregate or de-identified
                records that could test a specific explanation. Likely record holders
                are starting points, not confirmation that a complete dataset exists.
                Copying a template does not send a request. No personal case files or
                identifying health information are requested.
              </p>
            </div>
            <div className={styles.revision}>
              <h3>Updated September 9, 2026</h3>
              <p>Added shared Council evidence, separate psychiatric care settings, a psychiatric-transition example, operating-finance distinctions and five draft evidence requests. Council proposals and unresolved estimates remain explicitly attributed.</p>
              <h4>September 8 foundation retained</h4>
              <p>
                Restored a diagnosis for all fourteen overlapping housing and care
                functions, with dated findings on capacity, staffing, funding, access,
                handoffs, execution and outcomes. Added a historical capacity comparison,
                current announced service changes and records-request templates. Removed
                unsupported coverage calculations and the unverified $16,000 supportive-housing
                comparison. Kept observed costs, budgets and rent benchmarks separate,
                and made source conflicts and missing follow-up explicit.
              </p>
              <p>
                Illustrative journeys are fictional examples. Editorial lines are Portland
                Civic Lab’s own. The proposed design is an analysis of the cited public
                records, not a clinical or legal protocol.
              </p>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
