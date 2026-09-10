"""Build traceable audit tables; no application mutations or network access."""
import csv, json, hashlib, shutil
from urllib.parse import quote
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
SRC=Path('/private/tmp/portland-permits-audit-20260909/source')
COMMIT='23b4670d8d26b9093f6e401bb89d9d6f30d8506d'
BASE=f'https://github.com/ekrolewicz6/portland-civic-labs/blob/{COMMIT}/'
inventory=json.loads((ROOT/'evidence/catalog-verification.json').read_text())
def csvout(name,rows):
    with (ROOT/name).open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
sources=[]
def official(id,title,url,version,note):
    sources.append(dict(id=id,kind='official',title=title,url=url,accessed='2026-09-09',version_or_date=version,evidence_scope=note))
official('O01','DevHub FAQs','https://www.portland.gov/ppd/devhub-faqs','Current page; accessed 2026-09-09','Existing digital baseline: eligible no-plan-review purchases, submissions, corrections and payments. Not proof of every possible automated decision.')
official('O02','Submit and pay by permit type','https://www.portland.gov/ppd/submit-and-pay-application-permit-type','Current page','Different intake channels and trade plan-review paths.')
official('O03','Getting your permit','https://www.portland.gov/ppd/development-permit-processes/step-4-getting-your-permit','Current page','Issuance includes fees and approved permit materials; approval is an intermediate state.')
official('O04','Check permit status','https://www.portland.gov/ppd/get-permit/check-permit-status','Current page','Intake, review and preissuance are distinct stages.')
official('O05','Fence permits','https://www.portland.gov/ppd/residential-permitting/home-projects/fence-permits','Current page','Building-permit exemptions depend on construction and height; zoning and pool-barrier rules remain.')
official('O06','FIR program','https://www.portland.gov/ppd/residential-permitting/field-issuance-remodel-program','Current page; closure described as March 2026','Restricted enrollment, inspector involvement and field workflow; not a general under-$50,000 auto-issue program.')
official('O07','Solar permits','https://www.portland.gov/bds/services/solar-permits','Current service guidance','Prescriptive versus engineered structural submissions, electrical permit and inspections.')
official('O08','Commercial mechanical permits','https://www.portland.gov/ppd/commercial-permitting/commercial-permit-inspections/commercial-mechanical-permits','Includes July 10, 2026 change','Scope-specific plan-review exclusions, including narrow low-rise ductless mini-split criteria.')
official('O09','Commercial permit requirements','https://www.portland.gov/ppd/commercial-permitting/commercial-requirements','Current page','Separate trade requirements and medical-gas plumbing plan review.')
official('O10','ADUs','https://www.portland.gov/ppd/residential-permitting/home-projects/accessory-dwelling-units','Current page','New and conversion paths; construction permit and inspection obligations.')
official('O11','Oregon Structural Specialty Code adoption','https://www.oregon.gov/bcd/codes-stand/Pages/ossc-adoption.aspx','2025 OSSC effective Oct 1, 2025; mandatory construction provisions Apr 1, 2026','Current commercial code baseline; project applicability and other specialty-code editions must be pinned separately.')
official('O12','Portland seismic code','https://www.portland.gov/code/24/85','Current code; temporary suspension until Jan 1, 2029','Section-specific suspension does not remove all seismic requirements.')
official('O13','Temporary code suspensions announcement','https://www.portland.gov/community-economic-dev/news/2025/9/24/portland-city-council-approves-temporary-code-suspensions-0','Published Sep 24, 2025; effective Oct 24, 2025','Narrow additions/alterations relief; new construction excluded.')
official('O14','Code Alignment Project','https://www.portland.gov/permitimprovement/code-alignment-project','Current page','Scope and prior conditions limit suspension applicability.')
official('O15','Current fee schedules','https://www.portland.gov/ppd/current-fee-schedules','Effective July 10, 2026','App July 2025 fee constants are not current.')
official('O16','Temporary housing SDC exemption','https://www.portland.gov/ppd/current-fee-schedules/housing-sdc-exemption','Eligible issuance Aug 15, 2025-Sep 30, 2028','New-unit eligibility, acknowledgement, inspection milestone or guarantee, recapture; ADU program separate.')
official('O17','Land use review procedures','https://www.portland.gov/bds/article/204690','Current guidance; verify exact review type and vested rules','Notice, decision and appeal requirements vary by type; no blanket instant land-use approval.')
official('O18','Type II land use procedure','https://www.portland.gov/bds/documents/type-ii-land-use-review-procedure/download','Published procedure; accessed Sep 9, 2026','Public notice and appeal periods; deadline model must preserve applicable clock.')
official('O19','Residential demolition permits','https://www.portland.gov/ppd/residential-permitting/home-projects/residential-demolition-permits','Current page','Conditional delay, deconstruction, notifications and field safeguards.')
official('O20','Demolition code guide','https://www.portland.gov/ppd/codes-rules-and-guides/bod-24-02-demolition','BOD 24-02','Demolition and replacement-building sequencing, site closeout obligations.')
official('O21','Do I need a tree permit?','https://www.portland.gov/ppd/tree-permits/do-i-need-tree-permit','Current page; fee changes July 1, 2025','Street/private/development distinctions and exemptions.')
official('O22','Tree permits code','https://www.portland.gov/code/11/40','Current adopted code','Type A/B, regulated work, notice and judgment; proposed 2026 changes are not treated as law.')
official('O23','Private-tree removal','https://www.portland.gov/ppd/tree-permits/removal-and-replanting-permits/do-i-need-permit-remove-trees-private-property','Current page','Size, overlay, heritage and prior-development conditions affect requirements.')
official('O24','Street-tree non-removal application','https://www.portland.gov/trees/treepermits/documents/street-tree-permit-application-non-removal/download','Current linked application; accessed Sep 9, 2026','Limited pruning path versus work needing inspection or arborist review.')
official('O25','Temporary street use','https://www.portland.gov/transportation/permitting/temporary-street-use-permitting-tsup','Includes Aug 4, 2026 advisory','Live street restrictions and conflict review affect eligibility and timing.')
official('O26','Apply/change temporary street use permit','https://www.portland.gov/transportation/permitting/apply-renew-or-change-temporary-street-use-permit','Current page','Online intake already exists; scope and lead time vary.')
official('O27','Encroachment permits','https://www.portland.gov/transportation/permitting/encroachment-permits','Current guidance / TRN 8.08','Revocable right-of-way permission requires scope-specific assessment.')
official('O28','Public assembly fire permits','https://www.portland.gov/fire/permits-inspections/public-assembly-permit-requirements','Current page','Capacity, event layout, inspection and staffing requirements.')
official('O29','Annual special-event fire permit','https://www.portland.gov/fire/permits-inspections/documents/30008an-annual-permit-public-special-events-0/download','Posted administrative material; accessed Sep 9, 2026','Inspection/approval requirements; operational permits are not purely form checks.')
official('O30','Fire protection design manual','https://www.portland.gov/fire/permits-inspections/documents/design-manual-fire-protection-systems-and-processes/download','Legacy manual; current specialty code controls','Evidence of engineering and field testing; not relied on for current numerical design limits.')
official('O31','Signs and awnings','https://www.portland.gov/ppd/sign-permits','Portable registration removed July 25, 2026','Permanent/temporary/exempt distinctions; sign geometry, structural and electrical requirements.')
official('O32','Portable signs','https://www.portland.gov/transportation/permitting/portable-signs-boards','Current post-July 25, 2026 guidance','Placement and size rules remain after registration removal.')
official('O33','UR and UC permits','https://www.portland.gov/ppd/infrastructure/ur-and-uc-permits','Current guidance; fees July 10, 2026','Private versus public ROW sewer work, insurance/bond/inspection dependencies.')
official('O34','UC permit','https://www.portland.gov/ppd/infrastructure/ur-and-uc-permits/uc-permit','Current page','Existing process includes DevHub payment, staff release and PBOT inspections.')
official('O35','Sewer/stormwater requirements','https://www.portland.gov/ppd/infrastructure/sewer-stormwater-permit-requirements','Current page','Development-specific sewer and stormwater review and separate permits.')
official('O36','DEQ construction stormwater permit','https://www.oregon.gov/deq/wq/Documents/1200CPermit.pdf','2025 1200-C permit','State construction stormwater authorization is separate; does not govern every industrial-discharge case.')
official('O37','ASTR before applying','https://www.portland.gov/bds/astr-permits/before-you-apply','Current service guidance','Type A/B, residency, notice and sleeping-room compliance. Read alongside specific administrative inspection rule.')
official('O38','ASTR compliance rule','https://www.portland.gov/policies/environment-built/permitting-development-administrative-policies-procedures/enb-1302','Amended Aug 27, 2024','Self-certification and 10% sampled preissuance inspections for Type A; renewals differ. Current implementation should be confirmed with bureau.')
official('O39','Home occupation permits','https://www.portland.gov/ppd/home-occupation-permit','Current page','Type A versus Type B; visitor/employee and location criteria.')
official('O40','Food cart licenses','https://multco.us/services/food-cart-license','Current Multnomah County page','County license and plan review; separate from city site permissions.')
official('O41','Disabled parking permits','https://www.oregon.gov/odot/dmv/pages/driverid/disparking.aspx','Current Oregon DMV page','State issuance and healthcare-provider certification.')
official('O42','Portland cannabis program','https://www.portland.gov/ppd/cannabis','Current page','City regulatory license is separate from state licensing.')
official('O43','OLCC cannabis','https://www.oregon.gov/olcc/marijuana/Pages/default.aspx','Current page','State agency authority; no City-only completion.')
official('O44','Revenue Division','https://www.portland.gov/revenue','Current page','Portland Revenue Online already supports official filing/payment.')
official('O45','Clean River Rewards','https://www.portland.gov/bes/grants-incentives/clean-river-rewards','Current page','Registration and utility-bill discount, not a construction permit.')
official('O46','Environmental grants and incentives','https://www.portland.gov/bes/grants-incentives','Current directory','Distinct funding and incentive programs; current program eligibility not exhaustively audited.')
official('O47','FY2024-25 cumulative workload','https://www.portland.gov/ppd/drac/documents/2025-02-fy2024-25-major-workload-parameters-cumulative/download','March 20, 2025; Jul 1, 2024-Feb 28, 2025','Visually verified one-page table. Historical eight-month counts, not FY2026 actuals.')
official('O48','Permit improvement Q1 2025','https://www.portland.gov/permitimprovement/documents/q1-2025-permit-improvement-quarterly-update-january-march-2025/download','Jan-Mar 2025 report','Timeline cohorts and approved-to-issue distinction; small samples and existing improvements.')
official('O49','FY2026-27 budget submission','https://www.portland.gov/budget/2026-2027-budget/documents/fy-26-27-comm-econ-dev-current-service-level-submission/download','FY2026-27 current-service submission','FY2024-25 workload changed; old volumes must not be presented as current forecasts.')
code_specs=[
('C01','Catalog loader','src/lib/form-engine/loader.ts','export function getFormCatalog'),
('C02','Applicant UI wiring','src/app/(public)/apply/[slug]/client.tsx','handleSubmit'),
('C03','Server submission and draft saving','src/actions/applications.ts','export async function submitApplication'),
('C04','Client validation','src/lib/form-engine/schema-to-zod.ts','case "file-upload"'),
('C05','File uploader','src/components/forms/field-renderer.tsx','storagePath'),
('C06','Completeness rules','src/lib/review-pipeline/stages/completeness.ts','export function'),
('C07','Document validation','src/lib/review-pipeline/stages/document-validation.ts','export function'),
('C08','Six auto-approval paths','src/lib/review-pipeline/auto-approve.ts','export function checkAutoApproval'),
('C09','Deterministic rule stage','src/lib/review-pipeline/stages/rules-engine.ts','export function'),
('C10','Discipline routing','src/lib/review-pipeline/disciplines.ts','const PERMIT_DISCIPLINES'),
('C11','Pipeline persistence','src/actions/pipeline.ts','export async function executePipeline'),
('C12','Pipeline orchestration','src/lib/review-pipeline/pipeline.ts','export function runPipeline'),
('C13','Discipline completion','src/actions/discipline-review.ts','export async function completeDisciplineReview'),
('C14','Checkout','src/actions/payments.ts','export async function createCheckoutSession'),
('C15','Payment webhook','src/app/api/webhooks/stripe/route.ts','export async function POST'),
('C16','Printable application','src/app/api/applications/[id]/pdf/route.ts','export async function GET'),
('C17','Authentication','src/lib/workos/helpers.ts','DISABLE_DEV_PERSONAS'),
('C18','Development cookie route','src/app/api/dev-auth/route.ts','export async function POST'),
('C19','Upload route','src/app/api/upload/route.ts','export async function POST'),
('C20','Download route','src/app/api/download/route.ts','export async function GET'),
('C21','Database adapter','src/lib/db/index.ts','function createDb'),
('C22','Database schema','src/lib/db/schema.ts','export const applications'),
('C23','Zoning public action','src/actions/zoning.ts','export async function performZoningCheck'),
('C24','GIS client','src/lib/zoning/gis-client.ts','export async function queryEnvironmentalZones'),
('C25','Zoning standards','src/lib/zoning/rules-engine.ts','export function analyzeZoning'),
('C26','Fee calculator','src/lib/fees/calculator.ts','export function calculateFees'),
('C27','Synthetic AI pre-review','src/lib/review-pipeline/stages/ai-pre-review.ts','export function'),
('C28','Optional live AI advisor','src/lib/ai/routing.ts','export async function analyzeApplication'),
('C29','Notifications','src/lib/notifications/triggers.ts','export async function notifyStatusChange'),
('C30','Coordination view','src/actions/coordination.ts','export async function getProjectGroups'),
('C31','Trade bundles','src/actions/bundling.ts','export async function generateTradePermits'),
('C32','Correction response UI','src/components/applications/correction-panel.tsx','handleSubmitResponse'),
('C33','Apply route draft lookup','src/app/(public)/apply/[slug]/page.tsx','getLatestDraft(slug)'),
('C34','Homepage claims','src/lib/homepage/transformation-metrics.ts','instant_today'),
('C35','Timeline strategy model','docs/strategy/Portland_Permitting_Timeline_Reduction_Analysis.md','48,590'),
('C36','Timeline estimator','src/lib/timeline/estimator.ts','export function'),
('C37','Deadline semantics','src/lib/review-pipeline/sla.ts','export function'),
('C38','Homepage catalog claim','src/app/(public)/page.tsx','175'),
('C39','Seed/demo records','scripts/seed.ts','async function'),
]
for id,title,path,anchor in code_specs:
    p=SRC/path
    if not p.exists():
        hits=list((SRC/'src').rglob(Path(path).name));assert len(hits)==1,(path,hits);p=hits[0];path=str(p.relative_to(SRC))
    lines=p.read_text().splitlines();line=next((i+1 for i,x in enumerate(lines) if anchor in x),1)
    sources.append(dict(id=id,kind='source-code',title=title,url=BASE+quote(path,safe='/')+f'#L{line}',accessed='2026-09-09',version_or_date=COMMIT,evidence_scope=f'{path}:{line}; source inspection and isolated tests, not proof of production configuration'))
csvout('sources.csv',sources)
source_by_id={x['id']:x for x in sources}

# Family templates are workflow descriptions, not an assertion of codified coverage.
# Effort bands refer to explicit hypothetical budgets in effort-models.csv; unknown where no defensible model exists.
families={}
def fam(id,name,workflow,remaining,software,limit,models,sources):
    families[id]=dict(id=id,name=name,workflow=workflow,remaining=remaining,software=software,limit=limit,models=models,sources=sources)
fam('TR','Trades','Scope/contractor/jurisdiction -> plan-review eligibility -> drawings/review if required -> assessed payment -> official trade permit -> installation inspections/reinspection -> final','Applicant supplies scope and licenses; reviewers handle plan-required work; licensed installers and inspectors perform work.','Canonical scope taxonomy; license registry; current fixture/equipment fees; DevHub issue adapter; inspection link.','No-plan-review and plan-review scopes differ; unknown licenses/site data must route to staff.','M1;M2','O01;O02;O08;O09')
fam('FE','Fences','Determine exemption -> zoning/vision/pool/site requirements -> engineering/review if needed -> fees and issuance if permit needed -> construction and final','Applicant dimensions, materials and surveyed placement; structural/site review where required; physical inspection.','Exemption decision separate from issuance; geometry, material thresholds, pool barriers, overlays, corner visibility.','Below building-permit thresholds does not mean all zoning rules pass.','M2','O05')
fam('SO','Solar','Prescriptive/engineered routing -> roof/site plans and structural assessment -> electrical coordination -> review/fees/issue -> installation and trade/final inspections','Roof condition, design, licensed work, engineering when required, field verification and utility coordination.','Typed roof/system model; signed worksheet; prescriptive eligibility; geometry/load checks; electrical fee/permit linkage.','Ground mounts, engineered designs and inadequate roof evidence cannot use a generic <=25kW rule.','M2','O07;O01')
fam('FI','FIR','Confirm existing FIR participant -> inspector consultation/site assessment -> eligible scope/plan review -> fee/field issuance -> inspection and final','FIR staff and registered participants must perform field and review duties.','Participant registry; inspector case scheduling; work order, approved scope, fees and inspection records.','Program enrollment closed as described March 2026; software does not create inspector capacity or remove field review.','M3','O06')
fam('RE','Residential construction','Jurisdiction/legal use -> scope and zoning -> complete plans -> required disciplines/corrections -> preissuance fees/conditions -> building and linked trades -> staged inspections -> final/occupancy if applicable','Designer and applicant prepare plans; staff review judgment/engineering/site issues; inspectors verify constructed work.','Structured project model; parcel geometry and prior conditions; code-version rules; document revision control; review and trade dependency graph; issue/inspection interfaces.','New build, addition, alteration and conversion must be separate paths; physical conditions and professional design remain.','M2;M3','O02;O10;O11;O14')
fam('CO','Commercial construction','Occupancy/use classification -> plans and site analysis -> structural/life safety/fire/zoning/infrastructure review -> corrections -> preissuance and trade permits -> inspections/special tests -> certificate of occupancy when required','Design professionals, reviewers, fire/site teams and inspectors remain; land-use or infrastructure approvals may gate issuance.','Versioned BIM/structured plan data; occupancy/egress/accessibility/energy checks; rated assemblies; calculations; dependency and condition tracking.','TI cosmetic work, change of occupancy and new/multifamily projects have materially different requirements.','M3;M4','O02;O09;O11;O14')
fam('DE','Demolition','Historic/deconstruction classification -> notices and applicable delay -> utility/environmental clearances -> permit -> deconstruction/demolition with inspections -> site restoration/final','Specialists handle hazards; crews demolish; inspector and relevant agencies clear work.','Property age/status; notice recipients and clocks; clearance attestations; deconstruction contractor; sequencing with replacement permit.','Applicable notice/delay and physical hazard abatement do not disappear with faster software.','M3','O19;O20')
fam('LU','Land use','Classify review/vesting -> preapplication if required -> completeness -> public notice -> staff analysis/hearing as applicable -> reasoned decision -> appeal/finality -> conditions tied to development','Applicants revise proposals; planners exercise judgment; public/hearing and appeal processes remain.','Versioned criteria and clocks; mail lists; complete exhibits; notice evidence; hearing records; decision templates and condition ledger.','Objective checks may be deterministic; discretionary findings, testimony and statutory opportunities cannot be replaced by a pass flag.','M4','O17;O18')
fam('TC','Tree work','Ownership/street/private/heritage/development classification -> species/size/site -> exempt/Type A/Type B/special route -> inspection/notice/replanting conditions -> decision -> work -> replanting/compliance closeout','Arborist/site assessment, discretion and public process depend on path; physical work/replanting remain.','Tree inventory, species/DBH and location evidence; hazard/photo review; adopted Title 11 criteria; notices, replacement and mitigation ledger.','Pruning exemptions and routine pruning differ from removal, heritage work and waivers.','M2;M3;M4','O21;O22;O23;O24')
fam('FR','Fire operations','Activity/hazard classification -> layout/equipment/safety plan -> fire review and required site inspection -> fee/permission -> monitored event/operation -> renewal or closeout','Fire officer judgment, safe operation, trained personnel and site checks remain.','Hazard-specific checklists, capacity and separation rules, credential validation, inspection calendar, event/renewal records.','One general fire form is not a universal approval criterion for propane, hot work, lasers or pyrotechnics.','M3','O28;O29')
fam('FS','Fire systems','System/scope classification -> professional plans/calculations -> fire review -> installation permit -> acceptance/pressure/functional tests -> approval/final','Designer and installer; fire review; witnessed acceptance tests.','Equipment compatibility, hydraulic/coverage and circuit rule models; licensed signatures; test forms and inspection integration.','Minor modifications and affidavits must follow their own authorized route; field system performance cannot be inferred from an upload.','M3','O30;O09')
fam('SI','Signs/awnings','Exempt/registration/permanent classification -> site sign inventory and geometry -> zoning/structural/electrical checks -> issue/register when required -> installation inspection/removal at expiry','Applicant drawings and measurements; engineer/electrician where required; inspector.','Current Title 32 criteria; façade/sign inventory; structural attachment; permit-type-specific fees and electrical linkage.','Portable registration ended July 25, 2026; placement compliance remains; historic or land-use conditions may require review.','M2','O31;O32')
fam('ST','Site/erosion','Earthwork/drainage/geotechnical scope -> site plans and applicable agency permits -> infrastructure/environmental reviews -> fee/security/issue -> erosion/site inspections -> stabilization/as-built closeout','Civil/geotechnical design; bureau coordination; construction, monitoring and inspections.','Terrain/soil/drainage data; disturbance geometry; checklist and performance calculations; state permit linkage; inspection/as-built records.','Slope stability, contamination and water-quality observations require professional or physical evidence.','M3','O35;O36')
fam('SE','Septic','Confirm onsite authority and sewer availability -> site/soil evaluation -> new/repair design -> health/environmental approval -> install -> inspect/final and operation records','Authorized onsite agency and qualified site evaluator; installation and inspection.','Authority/service boundaries; soil and prior-system records; repair-vs-new rules and external case adapter.','Do not treat a Portland catalog entry as proof that City staff control a septic authorization; site-specific authority unverified.','unknown','O02;O35')
fam('RW','Right-of-way construction/use','Location/space/date -> traffic/access and utility conflict checks -> plans/insurance/bonds -> approvals/fees -> ROW permission -> field setup/work/inspections -> restoration and release','Traffic/civil reviewer and field crews; utility owners and public-safety constraints.','Live street inventory/conflict calendar; detours/ADA routes; credentials/security; geospatial project graph; inspector and restoration ledger.','Parking-only reservations differ from lane/sidewalk closures, encroachments and excavation.','M2;M3','O25;O26;O27')
fam('UT','Water/sewer works','Service/capacity and ROW/private classification -> engineering/backflow/sewer review -> fees/bonds/permission -> connection or repair -> pressure/other tests and inspections -> billing/as-builts/final','Bureau designers, licensed contractors, inspectors and sometimes utility crews.','Meter/service inventory; hydraulic capacity; contractor/insurance/bond verification; DevHub/billing/field work adapters.','UC/UR and private plumbing are distinct; software cannot install meters or verify buried work alone.','M3','O33;O34;O35')
fam('WD','Water/discharge operations','Classify use/discharge -> capacity/quality data -> utility or environmental review -> conditions/fees -> authorization -> testing/reporting and renewals','Water/industrial wastewater staff and state agencies; laboratory/field work where required.','Account and asset IDs; lab reports; flow limits; approved points; monitoring schedules; bureau/DEQ adapters.','Industrial NPDES is a separate program from construction 1200-C; applicable authority and permit rule pack need confirmation.','unknown','O35;O36')
fam('IN','Information/early assistance','Identify property/project -> request/schedule -> data or staff advice -> response record','Staff consultation or current asset/model retrieval; applicant follows advice with actual applications.','Authoritative lookup/scheduling and response export; project link; distinguish estimates from capacity commitments.','An information response or fee statement is not authorization to build, connect or operate.','unknown','O02;O35')
fam('SP','Supporting document','Identify parent case -> submit certification/notice/affidavit -> validate signer and content -> reviewer acceptance -> satisfy parent condition','Applicant or professional attests truth; staff resolves exceptions and parent decision.','Parent/revision binding; signatory authority; document hash; acceptance criteria; expiring-condition tracking.','Not an independent permit or additional case to count in impact totals.','unknown','O02;O22;O30')
fam('AS','Short-term rental','Type A/B and legal bedrooms/residency -> notice and certification -> sampled inspection or conditional-use route -> fees/permit -> renewal/enforcement','Resident evidence, bureau verification, inspections where selected/required; Type B discretionary decision.','Residency/bedroom registry; Type A certification and random inspection selection; Type B land-use link; notice and renewal service.','Service guidance and administrative inspection rule must be reconciled operationally; do not assume every Type A needs inspection or none do.','M2;M4','O37;O38')
fam('HO','Home occupation','Classify Type A/no permit versus Type B -> location/activity/customer limits -> notice/review -> permit where required -> ongoing compliance/renewal','Applicant disclosures; bureau checks, exceptions and complaints.','Adopted visitor/employee/use limits; Type A guidance; Type B notice and validation workflow.','Not every home business needs a permit; inspections or discretionary exceptions prevent blanket zero-touch claims.','M2','O39')
fam('BL','Business/regulatory licenses','Identify licensing authority and scope -> identity/site/credential/background or safety checks -> external recommendations -> fee/license -> renewals/enforcement','Regulator and external agencies determine eligibility; inspections/hearings depend on license.','Per-license rule packs; license/background registries; renewal events and agency handoffs.','Catalog labels are not evidence of City authority; OLCC, county and state permissions remain separate.','unknown','O40;O42;O43')
fam('TX','Tax filings/accounts','Identify tax/account/period -> calculate or collect return -> validate schedules -> authorized filing/payment -> ledger/reconciliation -> amendments/refunds/audit','Taxpayer supplies truthful records; authority resolves audits, discretionary relief and contested assessments.','Tax-year rule engine; official account/filing API; exact rates and thresholds; signed declarations and payment ledger.','A local application record is not a filed return or remitted tax; current-year coverage is unaudited.','unknown','O44')
fam('PA','Parking/access entitlement','Zone/account/eligibility -> evidence and quota validation -> fee -> plate/permit/account activation -> renewal/cancellation','Applicant residence/vehicle evidence; authority exceptions and enforcement.','Live zones/quotas/plates; residency and benefits validation; permit ledger and enforcement-system sync.','Annual business, resident and income-qualified programs differ; disabled placards are a state/healthcare path.','M2','O01;O41')
fam('PK','Parks reservations/events','Inventory/date selection -> eligibility/conflict/access/safety review -> agreement/deposit/payment -> confirmed booking -> event/use -> damage/deposit closeout','Parks staff resolve special uses; users conduct events; maintenance/site checks remain.','Real inventory with atomic reservations; pricing/deposits/refunds; event checklists and asset work orders.','A generic form without a reservation backend does not reserve a venue; eight schemas have incompatible condition shapes.','M2;M3','O28')
fam('GR','Grants','Program intake window -> eligibility -> merits/scoring/budget selection -> award agreement -> disbursement -> evidence/reporting/closeout','Program panel and funder decisions; recipient work, inspections/audit as required.','Program-specific application/scoring support, budget encumbrance, agreements, reporting and finance adapter.','Funding availability and selection are not code-compliance permit decisions; current program intake status unverified.','unknown','O46')
fam('LN','Loans','Program/property/borrower eligibility -> financial verification and underwriting -> funding/closing/security -> disbursement -> work verification/repayment/release','Lender/borrower, title/credit process and field verification remain.','Underwriting rules, identity/consent, servicing/finance/title interfaces and lien/repayment records.','Approval is not funding; credit, title and scarce program funds are external dependencies.','unknown','O46')
fam('RB','Rebates/assistance','Eligibility/account -> proof of qualifying purchase/work/income -> validation -> credit/payment/exemption -> audit/recapture/renewal','Applicant purchases/installs or provides financial evidence; program staff handle exceptions.','Utility account/benefits integration; receipt/model validation; budget and credit ledger; recapture obligations.','Some incentives require physical work; SDC exemptions have continuing conditions; current eligibility needs a program-specific audit.','M2','O16;O45;O46')
fam('AP','Appeals/claims','Identify decision/standing/deadline -> admissibility and record -> response/hearing/investigation -> independent decision -> remedy/payment/compliance','Decision-maker, claimant and other parties; hearings, evidence and legal judgment remain.','Deadline/fee/record assembly; status and scheduling; conflict-free assignments and outcome accounting.','Automating intake cannot automate discretionary or contested merits under unchanged policy.','M4','O17;O18')
fam('RP','Reports/field service','Receive location/evidence -> triage/jurisdiction/duplicate check -> dispatch -> investigation/physical work -> verify/close and notify','Investigators, responders or maintenance crews perform and verify the work.','311/work-order integrations; asset and incident IDs; prioritization, duplicate matching and SLA/escalation.','No outage, pothole or complaint is resolved merely because its form has been submitted.','unknown','O02')
fam('UP','Account updates/registration','Verify identity/authority -> validate requested update -> update authoritative systems -> confirmation and exceptions','Customer and owner agency; physical service transfer if needed.','Account/identity matching; consent scope; exact agency API; audit and rollback.','No single citywide address/contractor registry is proven connected; private/state registries may own the record.','unknown','O44')

# Explicit assignment of all 180 entries. Text after the family is the key case distinction.
mapping='''
abandoned-vehicle-report|RP|PBOT enforcement; investigate ownership and removal criteria before field action.
accessory-str-permit|AS|Overlaps short-term-rental; ASTR is not simply a separate accessory-versus-primary license.
address-change|UP|Choose actual agencies/accounts; notification here does not update them.
adu-permit|RE|Split detached new ADU from attached ADU and conversion; separate SDC waiver obligations.
amusement-devices-permit|BL|Device/site licensing path requires authority and current fee validation.
annual-liquor-renewal|BL|City recommendation/renewal role versus OLCC license; do not count both as independent city issuance.
annual-parking-permit|PA|Business/nonprofit quota and employee eligibility differ from resident permits.
area-parking-permit|PA|Overlaps resident zone permit; identify zone, plate, cap and household rules.
arts-tax-filing|TX|Annual Arts Tax filing and payment must reach Revenue; account/year/exemptions required.
athletic-field-permit|PK|Recurring field allocation, capacity, sport and season conflicts.
attic-basement-garage-conversion|RE|Habitable-space conversion versus new dwelling; existing legality, egress, height, energy and trade work.
backflow-prevention|UT|Approved assembly/tester and actual backflow test; installation and ongoing compliance differ.
bike-locker-rental|PK|Locker availability and contract/renewal; confirm asset owner/operator.
bike-rack-sidewalk|RW|Site clearance/accessibility and property interface; public installation after acceptance.
bike-rack-street|RW|Curb-space design and traffic approval; capital installation is additional work.
bike-registration|UP|Confirm registry operator and stolen-bike interface; a local record is not external registration.
brownfield-grant|GR|Contaminated-site eligibility, owner authorization and environmental assessment funding.
business-license-temp|BL|Verify the existence and legal scope of this generic temporary-license product before accepting fees.
business-tax-registration|TX|Overlaps tax-account-registration; map city/county/Metro obligations, not a general license to operate.
business-tax-return-corp|TX|Corporate entity return; period, apportionment, deductions and schedules need a tax-year rule pack.
business-tax-return-partnership|TX|Partnership entity/allocation rules are distinct from corporate and individual returns.
business-tax-return-sole-prop|TX|Sole proprietor income/apportionment; verify applicable exemptions and filing obligations.
campsite-report|RP|Dispatch and response policy, outreach and field conditions; report closure is not housing placement.
cannabis-business-registration|BL|Overlaps city cannabis licensing; city license and OLCC authorization are separate.
cannabis-license|BL|Retail scope, local regulatory license and state license; no current eligibility verification adapter.
ceremonial-bonfire-permit|FR|Site, fuel, burn restrictions and supervision; real-time fire conditions matter.
change-of-use-permit|CO|Occupancy classification and load changes can trigger accessibility, fire, seismic and site requirements.
chemical-treatment-permit|TC|Tree location/ownership, chemical scope and qualified applicator; environmental restrictions.
city-claim|AP|Risk Management/counsel, evidence, liability and settlement authority; not an automatic payout.
clean-energy-incentive|RB|PCEF community-partner referral, not a guaranteed individual rebate or grant award.
clean-river-rewards|RB|Overlaps stormwater-discount; utility-account discount after program validation.
close-business-account|TX|Revenue account closure does not dissolve a state-registered entity or erase liabilities.
code-enforcement-report|RP|Violation triage/investigation, notice, enforcement and compliance verification.
code-violation-appeal|AP|Underlying code decision determines standing, deadlines, hearing and remedy.
commercial-building-permit|CO|Split new nonresidential, multifamily/mixed use, addition, alteration and change of occupancy.
commercial-electrical-permit|TR|Commercial scope: classify plan-required versus permitted no-review work; separate from electrical-permit slug.
commercial-mechanical-permit|TR|Commercial engineered work versus narrow exempt-from-plan-review classes; July 2026 rule update relevant.
commercial-water-meter|UT|Demand/size and capacity design; fees and physical meter installation.
contractor-registration-update|UP|City profile versus state CCB/BCD license; no state credential change by editing this form.
deck-permit|RE|Exempt low deck versus permitted elevated/attached/engineered deck; zoning remains.
deconstruction-contractor|BL|Certification/training and program registry; not the actual demolition permit.
demolition-permit|DE|Split residential with delay/deconstruction, applicable exceptions, and commercial/historic cases.
development-tree-plan|SP|Tree protection/removal/replanting plan attached to development; independent tree work may also require permission.
disabled-parking-permit|PA|Oregon DMV, healthcare certification and placard delivery; City permitting department cannot issue it alone.
discrimination-complaint|AP|Civil-rights jurisdiction, confidential investigation and reasoned determination.
down-payment-assistance|LN|Income/homebuyer eligibility, underwriting, purchase closing and repayment restrictions.
driveway-approach-permit|RW|Driveway geometry, sidewalk accessibility, drainage and street classification; field construction/inspection.
driveway-clearance-painting|RW|Curb-marking eligibility and physical painting; title is not proof of an implemented PBOT work order.
electrical-permit|TR|No-plan-review residential/minor scope versus engineered/service/special-use work; validate homeowner/contractor eligibility.
employer-withholding-filing|TX|Employer, payroll period, liabilities and remittance reconciliation.
employer-withholding-registration|TX|Tax account creation and withholding obligations; actual Revenue-system activation.
encroachment-permit|RW|Revocable ROW use, geometry/access, insurance and conditions; site-specific discretion.
erosion-control-permit|ST|Disturbance and site risk; construction 1200-C when applicable and stabilization inspections.
estimated-tax-payment|TX|Taxpayer/account/period allocation; payment alone is not a filed final return.
fabric-awning-permit|SI|Permanent awning application with structure/attachment and clearance; overlaps sign-permit scope.
facility-reservation|PK|Real room inventory, agreement, deposits, accessibility and after-use charges.
fence-permit|FE|Building-permit-exempt versus tall/masonry/pool-barrier requiring permission; front/corner/overlay zoning independent.
field-issuance-remodel|FI|Existing enrolled participants, actual FIR scope and inspector workflow; not unrestricted under-$50,000 approval.
film-photography-permit|PK|Parks site permission, crew/impact conditions and related traffic/fire permits.
fire-alarm-alteration|SP|Affidavit/minor-work route eligibility must be verified; not a blanket new-system approval.
fire-alarm-installation|FS|New system plans/device compatibility, installation and witnessed functional tests.
fire-art-performer-permit|FR|Performer credentials and event/site-specific conditions remain.
fire-code-permit|FR|Broad hazardous activities must split into distinct operating permit classes.
fire-flow-request|IN|Hydraulic data response; capacity information is not approval of building or service design.
food-cart-pod|BL|City site/building/utility/fire plus county pod/health licensing; bundled multi-authority project.
garbage-recycling-setup|UP|Service-provider account and route activation; private hauler integration required.
graffiti-report|RP|Property/owner jurisdiction and removal crew; report does not perform cleanup.
heritage-tree-permit|TC|Protected-tree status and sensitive work/decision path; arborist and authority review.
home-fire-safety|RP|Visit scheduling and physical home assessment; findings and follow-up.
home-occupation-permit|HO|Type A/no-permit guidance and Type B permit with location/visitor/employee limits.
home-repair-grant|GR|Program income/property/repair eligibility, scarce funding and completed-work evidence.
home-repair-loan|LN|Underwriting, property security, contractor draw inspection and repayment.
hydrant-permit|WD|Authorized hydrant, meter/backflow, nonpotable use conditions, deposit/use accounting and return.
illegal-dumping-report|RP|Ownership, evidence, response priority, cleanup and possible enforcement.
industrial-wastewater-permit|WD|BES pretreatment/discharge conditions, industrial process data, sampling and renewal.
land-use-appeal|AP|City appeal versus state LUBA path; standing, filing deadline and administrative record.
land-use-review|LU|Split objective administrative criteria, Type II discretionary cases and hearing/legislative paths.
laser-permit|FR|Equipment/operator and audience/site safety restrictions; actual authority criteria need encoding.
lead-hazard-grant|GR|Income/occupancy and hazard eligibility; testing, abatement and clearance evidence.
leap-parking-permit|PA|Income and eligible facility/time access; account/facility activation.
liquor-license-recommendation|BL|City recommendation is one stage of OLCC licensing, not the final liquor license.
lockbox-permit|FR|Fire access/box placement and key handling; field installation/verification.
major-residential-alteration|RE|Underlying residential alteration plus applicable notification/demolition-classification requirements; avoid counting twice.
mechanical-permit|TR|Minor residential equipment versus engineered/commercial/hood scope; explicit capacity and site eligibility.
mobile-food-unit|BL|Multnomah County Health license and plan review; city utility/site permissions separate.
noise-complaint|RP|Evidence and investigation; noise event/measurement and enforcement remain.
noise-variance|AP|Prospective exception, not complaint; notice, conditions and authorized discretionary decision.
non-park-use-permit|PK|Special access/construction/use of park land; site restoration, agreement and staff approval.
nuisance-complaint|RP|Property complaint investigation and actual corrective/enforcement work.
occupant-load-posting|FR|Approved use/layout, exits and capacity calculation; posting does not legalize an unapproved occupancy.
original-art-mural-permit|BL|Mural eligibility/site agreement/notice versus sign regulation; applicant painting remains.
ornamental-tree-lights|TC|Tree ownership/attachment/electrical safety, installation and removal conditions.
outdoor-tent-permit|FR|Area/occupancy, exits, flame resistance, anchors and site inspection; event-specific weather risks.
oversize-load-permit|RW|Vehicle/load/route/bridge clearance and escort conditions; possible state route authority.
park-maintenance-report|RP|Parks work order and field repair; not a reservation or permit.
parking-citation-appeal|AP|Citation issuer/court authority, evidence and hearing; no guaranteed dismissal.
parking-day-permit|RW|Event-specific temporary curb-space activation; date, access and permitted uses.
payday-lender-permit|BL|Local and state financial licensing requirements; do not infer approval from basic business fields.
pcef-grant|GR|Funding round, merits selection, agreement, disbursement and performance reporting.
permanent-sign-permit|SI|Permanent geometry/structure/illumination route; overlaps broad sign-permit.
personal-income-tax|TX|Applicable local/Metro/Multnomah tax programs and tax year; not federal/state general income tax.
picnic-reservation|PK|Shelter inventory/date/capacity and confirmed reservation/payment; live first page renders only.
plumbing-permit|TR|Fixture/minor no-plan-review scope versus medical-gas and other plan-required work.
police-alarm-permit|BL|Alarm account/location, fees and false-alarm administration; official registry needed.
portable-propane-permit|FR|Cylinder/appliance quantity, separation, approved equipment and operation conditions.
portable-sign-registration|SI|Retire registration workflow: City removed portable-sign registration July 25, 2026; retain compliance guidance.
portable-storage-permit|RW|Container footprint, parking/traffic conflicts, dates and site restrictions.
pothole-report|RP|Road ownership, triage, crew work and repair verification.
pre-application-conference|IN|Scheduling and coordinated advice, not a binding land-use or construction approval.
programmatic-tree-permit|TC|Organization-wide approved work standards, monitoring and reporting; discretionary program conditions.
public-assembly-fire-permit|FR|Event capacity, exits, access, plans and required inspection/standby staff.
public-event-parks|PK|Parks agreement plus public safety/traffic/fire permits as applicable; event work remains.
pyrotechnic-permit|FR|Operator certification, site separation, weather and fire oversight; possible state authorization.
replanting-waiver|TC|Exceptional relief/mitigation decision; no deterministic blanket waiver from a checkbox.
reroof-permit|RE|Exempt maintenance versus structural/material/weight or commercial reroof permit; verify actual scope.
research-park-permit|PK|Research purpose, resource impact/collection, access and reporting conditions.
residential-building-permit|RE|Split new detached/townhouse, addition, alteration, accessory structure and conversion; code applicability differs.
residential-parking-permit|PA|Overlaps area-parking-permit for resident zone permits; address/vehicle/quota and renewal.
residential-water-meter|UT|Domestic service demand/size, approved connection, fees, physical installation and billing.
retaining-wall-permit|RE|Exempt versus height/surcharge/slope-dependent structural wall; geotechnical/site review.
right-of-way-permit|RW|Broad form must split temporary occupancy, excavation, utility work and permanent encroachment.
sdc-exemption|RB|Supporting financial determination; ADU waiver versus temporary new-housing exemption and affordable housing paths.
secondhand-dealer-permit|BL|Dealer/owner eligibility, regulated item reporting and enforcement/renewal requirements.
septic-permit-new|SE|New system site/soil/design; determine actual authorized onsite agency before routing.
septic-permit-repair|SE|Repair/alteration versus replacement, existing-system records and soil capacity.
sewer-access-permit|WD|Confined-space/access safety and approved inspection/cleaning; contractor field operation.
sewer-backup-report|RP|Incident triage, safety, utility investigation and physical response.
sewer-connection-loan|LN|Overlaps sewer-loan; financial assistance does not authorize sewer construction.
sewer-lateral-connection|UT|UC public-ROW connection, insurance/bonds and PBOT inspection; private portion may need plumbing permit.
sewer-lateral-repair|UT|UR repair versus new connection; ROW restoration/inspection and utility records.
sewer-loan|LN|Overlaps sewer-connection-loan; program underwriting, construction draws and repayment.
short-term-rental|AS|Type A versus Type B conditional use; overlaps accessory-str-permit.
sidewalk-cafe-permit|RW|Outdoor dining/ROW space, ADA route, location conflicts and agreement; distinct food/health permissions.
sidewalk-hazard-report|RP|Inspection/owner notice/repair verification; report is not a completed sidewalk repair.
sign-permit|SI|Umbrella form overlaps permanent/temporary/awning; separate each authorization and exemption.
site-development-permit|ST|Geotechnical/earthwork/drainage and bureau conditions; construction closeout required.
social-games-permit|BL|Local gaming activity eligibility, premises and other licensing dependencies.
solar-permit|SO|Prescriptive roof-mounted versus engineered/ground/commercial; supporting structural/electrical documents missing in UI.
special-event-liquor|BL|OLCC temporary license and applicable local recommendation; not a City-only permit.
special-event-permit|RW|Multi-street/event impacts, transit/emergency access, insurance and additional permits.
sprinkler-system-minor|FS|Validate limited-modification route versus redesign; installation and required testing still apply.
sprinkler-system-permit|FS|New/major fire suppression system design, hydraulic review, installation and acceptance tests.
stairs-construction-permit|RE|Rise/run/width/landing/guard and structural details; existing legality and inspections.
storm-damage-repair|RE|Like-for-like emergency repair versus structural replacement; hazardous conditions and inspections.
stormwater-discount|RB|Overlaps clean-river-rewards; verify account/impervious area and program credit.
stormwater-npdes-permit|WD|Industrial stormwater program/DEQ or delegated authority; not the construction 1200-C path.
street-closure-permit|RW|TSUP scope, live conflict calendar, traffic-control plan, lead time and restoration.
street-tree-planting|TC|Approved species/location/utilities; physical planting and establishment remain.
streetlight-report|RP|Asset/operator identification, work dispatch and electrical field repair.
tax-account-registration|TX|Overlaps business-tax-registration; canonical Revenue account, entity and jurisdiction.
tax-extension-request|TX|Tax-year extension criteria; extension to file does not necessarily extend payment time.
tax-penalty-waiver|AP|Revenue relief request with evidence and authorized discretion; not automatic forgiveness.
tax-refund-request|TX|Return/account reconciliation and authorized repayment; fraud/exception review.
temporary-sign-permit|SI|Temporary banner registration versus exempt sign classes; duration/location rules.
tenant-improvement|CO|No change of use/simple interior versus structural, occupancy, food service or complex life-safety work.
toilet-rebate|RB|Eligible account/product/purchase and installation evidence; utility credit and funding status.
traffic-safety-report|RP|Engineering investigation and priority/capital decision; a report cannot redesign the street.
transient-lodging-registration|TX|Operator/property tax account registration separate from lawful rental/use permit.
transient-lodging-report|TX|Tax period, rental receipts, exemptions, platform remittance and reconciliation.
tree-attachment-permit|TC|Tree ownership, attachment method/duration and health impacts; physical removal/inspection.
tree-permit-appeal|AP|Title 11 decision type, standing, deadline and independent review.
tree-pruning-private|TC|Ordinary private pruning often exempt; protected/regulated sites require separate treatment.
tree-pruning-street|TC|Limited routine pruning versus large limbs/heritage/complex arborist assessment.
tree-removal-neighborhood-notice|SP|Evidence of required neighborhood notice linked to removal decision; not the removal permit itself.
tree-removal-permit|TC|Street/private/Type A/Type B/heritage/development split; species/size and replanting conditions.
tree-root-pruning|TC|Root zone, extent and stability/arborist review; utility/sidewalk conflicts.
treebate|RB|Overlaps yard-tree-planting label; eligible planting/purchase and utility credit, not tree installation.
urban-forestry-early-assistance|IN|Tree advice/meeting for planned development; does not approve tree work.
utility-bill-appeal|AP|Utility account and meter/usage/charge evidence; decision and adjusted billing.
utility-bill-assistance|RB|Income/household/account eligibility, available benefit and utility posting.
utility-locate-request|RP|Locate-center/utility-owner ticket and physical markings; request is not excavation clearance.
utility-service-transfer|UP|Account identity and effective date, final/initial readings and billing; physical changes if required.
w6-fee-statement|IN|Water engineering/fee information; statement is not a paid meter/connection permit.
waste-hauler-license|BL|Jurisdiction, franchise/collection authority, equipment and reporting/renewal requirements.
water-pressure-report|RP|Service/asset investigation and field measurement/repair.
water-quality-report|RP|Water Bureau response, sampling/lab work and confirmed resolution.
watershed-grant|GR|Project eligibility and funding selection; recipient work, monitoring and closeout.
wedding-reservation|PK|Venue/date, guest capacity, agreement and any event conditions.
welding-hot-work-permit|FR|Site combustibles, fire watch, operator/equipment and actual safe work/inspection.
yard-tree-planting|RB|Catalog calls this Treebate; overlap with treebate and distinguish reimbursement from City planting service.
'''
mapping={a:(b,c) for a,b,c in (l.split('|',2) for l in mapping.strip().splitlines())}
assert set(mapping)=={x['slug'] for x in inventory},(set(mapping)-{x['slug'] for x in inventory},{x['slug'] for x in inventory}-set(mapping))

# Transparent counterfactual labor budgets, not empirical savings or percentages of code coverage.
models=[
dict(id='M1',case='Eligible no-plan-review trade issuance',baseline_issue_minutes=30,save_issue_low=24,save_issue_high=30,baseline_postissue_minutes=60,save_postissue_low=3,save_postissue_high=10,issue_budget='20 intake/eligibility + 10 assessment/issuance',postissue_budget='50 field/travel/inspection + 10 records/scheduling',conditions='Verified scope, identity/license, current fees, payment and authoritative issue connector; existing DevHub baseline may already remove much of this labor.',band_issue='80-100%',band_full='25-50%'),
dict(id='M2',case='Routine objective permit with limited technical review',baseline_issue_minutes=90,save_issue_low=30,save_issue_high=60,baseline_postissue_minutes=90,save_postissue_low=5,save_postissue_high=15,issue_budget='30 intake/issuance + 60 technical checking/corrections',postissue_budget='75 field work + 15 scheduling/records',conditions='Structured plans and objective accepted rule pack; human-only exceptions excluded; not all slugs mapped to this model qualify.',band_issue='25-50% (33-67% modeled)',band_full='25-50% (19-42% modeled)'),
dict(id='M3',case='Standard building/site/system permit',baseline_issue_minutes=600,save_issue_low=150,save_issue_high=300,baseline_postissue_minutes=600,save_postissue_low=30,save_postissue_high=90,issue_budget='120 administration + 300 technical checking + 180 corrections/coordination',postissue_budget='480 inspection/travel + 120 scheduling/records/final administration',conditions='Shared intake, repeatable technical checks and review/version workflow; complex design judgment and field verification remain.',band_issue='25-50%',band_full='25% (15-33% modeled)'),
dict(id='M4',case='Discretionary/complex review or hearing case',baseline_issue_minutes=1800,save_issue_low=180,save_issue_high=450,baseline_postissue_minutes=300,save_postissue_low=15,save_postissue_high=60,issue_budget='300 administration + 900 analysis/judgment + 600 hearing/corrections/coordination',postissue_budget='240 compliance/inspection + 60 records',conditions='Administrative record and fact checking automated; merits judgment, public participation and legal waiting periods remain.',band_issue='25% (10-25% modeled)',band_full='25% (9-24% modeled)'),
]
for m in models:
    m['issue_reduction_low_pct']=round(100*m['save_issue_low']/m['baseline_issue_minutes'],1)
    m['issue_reduction_high_pct']=round(100*m['save_issue_high']/m['baseline_issue_minutes'],1)
    total=m['baseline_issue_minutes']+m['baseline_postissue_minutes']
    m['full_reduction_low_pct']=round(100*(m['save_issue_low']+m['save_postissue_low'])/total,1)
    m['full_reduction_high_pct']=round(100*(m['save_issue_high']+m['save_postissue_high'])/total,1)
    m['evidence_quality']='Illustrative audit assumption; not observed staff times, not a measured forecast. Replace with time study.'
csvout('effort-models.csv',models)

rows=[]
for x in inventory:
    fid,distinction=mapping[x['slug']];f=families[fid];meta=x['catalog_metadata'];result=x['fixture_result'];blocks=[]
    if x['client_file_shape_mismatch']:blocks.append('Client upload object/string-array validation mismatch reproduced')
    if x['client_exception'] or x['empty_form_exception']:blocks.append('Legacy conditional-schema exception reproduced; not proof first UI page cannot render')
    if x['unmatchable_document_keys']:blocks.append('Pipeline expects absent document keys: '+', '.join(x['unmatchable_document_keys']))
    if not x['default_disciplines']:blocks.append('No default discipline assignment; manual triage required')
    if result['autoApproved']:blocks.append('Synthetic auto-approval demonstrated; eligibility unsafe; no official issuance')
    if x['slug']=='portable-sign-registration':blocks.append('Registration requirement removed July 25, 2026; form should be retired/replaced with guidance')
    nature={'SP':'supporting document','IN':'information/consultation','TX':'tax/account transaction','AP':'appeal/claim/variance','RP':'report/field service','UP':'account update/registration','GR':'funding application','LN':'loan','RB':'rebate/benefit/exemption','PK':'reservation/use permission'}.get(fid,'permit/license or conditional exemption')
    auth=meta.get('department') or 'Agency named in schema; assignment not independently confirmed'
    if x['slug']=='disabled-parking-permit':auth='Oregon DMV + certifying healthcare provider'
    if x['slug']=='mobile-food-unit':auth='Multnomah County Health; City for related site/trade approvals'
    if fid=='AS':auth='Portland PP&D; Type B land-use decision process'
    if fid=='SI':auth='Portland PP&D; PBOT for ROW/portable-sign compliance'
    if fid=='TC':auth='Portland PP&D tree permitting; associated bureaus/land-use authority as applicable'
    if fid=='TX':auth='Portland Revenue Division for applicable City/County/Metro program; verify tax-year scope'
    if 'liquor' in x['slug']:auth='OLCC + applicable Portland local recommendation'
    if 'cannabis' in x['slug']:auth='Portland PP&D regulatory license + OLCC/state authorization'
    if fid=='SE':auth='Authorized onsite wastewater agency; verify by location (not established by catalog)'
    current='Public form schema/route implemented; original pipeline fixture reaches '+result['stage']+'. '+(' '.join(blocks) if blocks else 'Generic local intake and reviewer shell; no service-specific completion adapter found.')
    rows.append(dict(slug=x['slug'],title=x['title'],category=x['category'],service_nature=nature,family=f['name'],authority=auth,authority_confidence='Medium where official family source applies; otherwise catalog attribution only',scope_split_or_overlap=distinction,workflow_through_closeout=f['workflow'],current_capability=current,current_classification='partial' if not x['empty_form_exception'] else 'partial / exception in isolated validation',live_route='https://www.portlandpermits.org/apply/'+x['slug'],source_schema=BASE+x['source_path'],default_disciplines=';'.join(x['default_disciplines']) or 'none',remaining_human_or_external_work=f['remaining'],as_deployed_staff_effort_issue='Unknown; no measured department use',as_deployed_staff_effort_full='Unknown; no measured department use',as_deployed_zero_touch_issue='0 demonstrated authoritative completions; no City issuing adapter',as_deployed_zero_touch_full='0 demonstrated authoritative completions',as_deployed_elapsed_reduction='Unknown; no matched outcome cohort',tomorrow_use='Guidance or supervised comparison only. Staff must verify rules and enter/complete official systems; real sensitive intake requires P0 fixes first.',tomorrow_staff_effort_issue='Unknown; potential clerical benefit offset by duplicate entry',tomorrow_staff_effort_full='Unknown; field work and official-system work remain',tomorrow_zero_touch_issue='0 via this app alone',tomorrow_zero_touch_full='0 via this app alone',tomorrow_elapsed_reduction='Unknown; no proven critical-path reduction',software_only_implementation=f['software'],software_effort_models=f['models'],software_staff_effort_issue='Unknown empirically; conditional budgets '+f['models'],software_staff_effort_full='Unknown empirically; conditional budgets '+f['models'],software_zero_touch_issue='Conditional 100% only eligible no-plan-review trade class; plan-required share unknown' if fid=='TR' else 'Unknown case share; see path splits and remaining limits',software_zero_touch_full='0 for classes requiring staff inspection/merits decision; otherwise unknown',software_elapsed_reduction='Administrative queues/corrections may shrink; required waits, applicant work and physical work remain; no validated percentage',remaining_limits=f['limit'],missing_shared_implementation='P0 security/schema/state/payment correctness; official case/fee/document/notification adapters; durable jobs, recovery and audit; see backlog',impact_volume='No audited per-slug annual count; do not allocate broad official totals to this row',impact_effort_and_delay='Family-specific models and shared volume sensitivity only; no additive per-form savings',confidence='High source wiring; medium workflow-family; low/unmeasured impact',official_source_ids=f['sources'],official_source_urls=';'.join(source_by_id[k]['url'] for k in f['sources'].split(';')),test_evidence='evidence/catalog-verification.json#'+x['slug']))
csvout('catalog-matrix.csv',rows)

reconciliation=[]
from collections import Counter
for cat,count in Counter(x['category'] for x in inventory).items():
    subset=[x for x in inventory if x['category']==cat]
    reconciliation.append(dict(category=cat,actual_entries=count,registry_present=sum(x['registry_present'] for x in subset),upload_forms=sum(bool(x['upload_fields']) for x in subset),upload_contract_failures=sum(x['client_file_shape_mismatch'] for x in subset),condition_exceptions=sum(bool(x['empty_form_exception']) for x in subset),no_default_discipline=sum(not x['default_disciplines'] for x in subset)))
csvout('catalog-reconciliation.csv',reconciliation)

tests=json.loads((ROOT/'evidence/test-results.json').read_text())
csvout('test-results.csv',[{**r,'observed':json.dumps(r['observed'],ensure_ascii=False)} for r in tests['results']])
manifest=[]
for path in sorted(SRC.rglob('*')):
    if path.is_file() and not any(p in path.parts for p in ['node_modules','.next','local-db','.git']) and path.suffix in ['.ts','.tsx','.json','.md']:
        manifest.append(dict(path=str(path.relative_to(SRC)),sha256=hashlib.sha256(path.read_bytes()).hexdigest()))
csvout('evidence/source-file-hashes.csv',manifest)
for old,new in [('lint.txt','lint.txt'),('typecheck.txt','typecheck.txt'),('build.txt','build-initial-network-failure.txt')]:
    p=SRC.parent/old
    if p.exists():shutil.copyfile(p,ROOT/'evidence'/new)
(ROOT/'evidence/harness-error.txt').unlink(missing_ok=True)
print(json.dumps({'catalog_rows':len(rows),'sources':len(sources),'tests':tests['total'],'gaps':tests['gaps'],'models':len(models)}))
