import { SOURCES } from "./data";
export type Camp = "industry" | "utility" | "local-gov" | "labor" | "tribal" | "advocate" | "agency" | "academic";
export interface Voice {
  who: string; org: string; camp: Camp; position: string; evidence: string;
  sourceId: keyof typeof SOURCES;
}
export const CAMP_LABEL: Record<Camp, string> = {
  industry: "Industry", utility: "Utilities", "local-gov": "Local government", labor: "Labor",
  tribal: "Tribal", advocate: "Advocates", agency: "State agencies", academic: "Academic / expert",
};
/** Selected published positions. Paraphrases, not new interviews or independent verification. */
export const VOICES: Voice[] = [
  { who: "Business Oregon", org: "State economic development agency", camp: "agency",
    position: "The agency says tax breaks are meant to attract investment and jobs.",
    evidence: "Its June presentation shows which programs businesses use and the investment and jobs reported. Those figures do not tell us whether each project would have happened without a tax break.",
    sourceId: "businessOregonRoi" },
  { who: "City of Hillsboro", org: "Published enterprise-zone explanation", camp: "local-gov",
    position: "The city says staff handled tax-break applications under its existing rules.",
    evidence: "This is the city’s account of the approvals; a court must decide the legal challenge. Approval for a tax break is also separate from permission to develop a site.",
    sourceId: "hillsboroResponse" },
  { who: "Robert Echenrode", org: "Umatilla Electric Cooperative", camp: "utility",
    position: "The cooperative says its locally governed contracts can protect existing customers.",
    evidence: "The cooperative is owned by its members. It says it has experience keeping data-center costs from falling on other customers. To assess that claim, examine the contracts, who pays each cost, and how future electricity will be supplied.",
    sourceId: "uecPresentation" },
  { who: "Amazon Web Services", org: "March water presentation", camp: "industry",
    position: "Amazon Web Services says it is reducing water use for cooling and investing in community water systems.",
    evidence: "These benefits are reported by the company. To assess the effect on local supplies, compare water taken and water restored in the same area and season. Restoring water elsewhere or at another time may not address a local shortage.",
    sourceId: "awsWater" },
  { who: "Jody Wiser", org: "Tax Fairness Oregon", camp: "advocate",
    position: "The organization wants to end property-tax breaks for data centers.",
    evidence: "Its testimony questions whether the breaks are needed and who benefits from them. That is a policy position; it does not prove that every project would go ahead without a break.",
    sourceId: "taxFairness" },
  { who: "Trustee Lisa Ganuelas", org: "Confederated Tribes of the Umatilla Indian Reservation", camp: "tribal",
    position: "The statement calls for formal consultation between the state and tribal governments.",
    evidence: "Tribes are governments with their own authority and rights under treaties. A representative’s participation at a public meeting does not replace formal consultation about recommendations that affect those rights and resources.",
    sourceId: "tribalStatement" },
];
export interface RecordFinding { claim: string; detail: string; attribution: string; sourceId: keyof typeof SOURCES; }
export const RECORD_FINDINGS: RecordFinding[] = [
  { claim: "Check which tax-break program a total describes",
    detail: "Business Oregon’s June table reports $233.6 million in data-center tax breaks out of $240.9 million for the long-term rural program. That amount covers one program, not all data-center tax breaks in Oregon.",
    attribution: "Business Oregon · June 26, 2026 · slide 4", sourceId: "businessOregonRoi" },
  { claim: "Keep tax breaks, taxes paid and fees separate",
    detail: "The Morrow County assessor reports $123.6 million in taxes companies did not have to pay, $72.3 million in taxes collected across the county, and $23.9 million in negotiated fees. These figures measure different things. The tax-break total is not the value of the property, nor does it show how much the county would collect if projects chose to build elsewhere.",
    attribution: "County assessor presentation · June 26, 2026", sourceId: "morrowAssessor" },
  { claim: "Future electricity use is an estimate",
    detail: "ECONorthwest estimates that data-center electricity use could rise from 14.0 terawatt-hours in 2025 to 24.8 in 2030. One terawatt-hour is one billion kilowatt-hours, the unit used on electricity bills. The estimate is preliminary: actual use depends on what gets built, how much it runs, and how efficiently it operates.",
    attribution: "ECONorthwest · July 31, 2026 · preliminary analysis", sourceId: "econw" },
  { claim: "Backup generators do not all run all the time",
    detail: "The Oregon Department of Environmental Quality lists 2,482 generators at 39 data-center sites. Their permits allow a combined 6,328 megawatts of generating capacity; a megawatt measures how much power equipment can produce at a given time. To estimate annual pollution, we also need their hours of use, fuels, pollution controls and permit limits.",
    attribution: "DEQ · July 31, 2026", sourceId: "deqAir" },
  { claim: "School tax losses affect districts differently",
    detail: "The Department of Education describes different rules for everyday school funding, taxes for construction debt and some extra voter-approved taxes. Districts with enough local revenue to exceed their formula funding also receive different treatment. A project review needs to identify exactly which taxes would be reduced.",
    attribution: "ODE · July 31, 2026 · slides 5 and 12", sourceId: "odeSchoolFunding" },
  { claim: "The committee has not finished its recommendations",
    detail: "The committee is asking for public input before issuing final recommendations. Its September report records questions and areas of agreement, but does not itself create new legal requirements.",
    attribution: "DCAC · September 10, 2026", sourceId: "preliminary" },
];
export const STRUCTURAL_FACTORS = [
  { title: "Different agencies make different decisions",
    detail: "Tax breaks, electricity rates, permission to build and environmental permits have separate approval processes. A proposal needs to identify who can set each requirement and who can enforce it." },
  { title: "A local decision can affect people elsewhere",
    detail: "A community may gain tax payments while effects on school funding, water supplies or the electricity system reach other places. Each of those effects needs to be measured. A local benefit does not settle the question for the rest of Oregon." },
  { title: "Hearing speakers do not speak for everyone",
    detail: "A public hearing tells us what its participants said, not what everyone in Oregon thinks. Serving on the committee, submitting a comment and taking part in formal tribal consultation are different ways to participate." },
  { title: "The record cannot tell us which proposals will pass",
    detail: "Public opposition and competing proposals show that people disagree about policy. They do not prove that a particular change is certain to pass or that nobody supports a pause on development." },
];
