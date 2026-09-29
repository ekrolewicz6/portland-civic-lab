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
    position: "Incentives are intended to attract investment and employment.",
    evidence: "Its June presentation compares separate programs. That comparison documents program use and reported outcomes; it does not establish every project's causal dependence on an incentive.",
    sourceId: "businessOregonRoi" },
  { who: "City of Hillsboro", org: "Published enterprise-zone explanation", camp: "local-gov",
    position: "The city describes applications as administered under its established program rules.",
    evidence: "This is the government's explanation of the approvals, not an adjudication of the lawsuit. Its separate land-use process should not be conflated with enterprise-zone authorization.",
    sourceId: "hillsboroResponse" },
  { who: "Robert Echenrode", org: "Umatilla Electric Cooperative", camp: "utility",
    position: "Local governance and tailored arrangements can protect existing members.",
    evidence: "The co-op argues it has experience insulating existing customers from data-center costs. Evaluate those claims against the applicable contracts, cost allocation and future supply obligations.",
    sourceId: "uecPresentation" },
  { who: "Amazon Web Services", org: "March water presentation", camp: "industry",
    position: "AWS emphasizes cooling efficiency and investment in community water systems.",
    evidence: "These are company-reported benefits. Basin and seasonal accounting are still necessary to establish the effect on water availability; a replenishment claim alone does not establish equivalence in place or time.",
    sourceId: "awsWater" },
  { who: "Jody Wiser", org: "Tax Fairness Oregon", camp: "advocate",
    position: "The organization advocates ending data-center property-tax incentives.",
    evidence: "Its testimony challenges the need for subsidies and the distribution of benefits. We treat that as an advocated policy, not a finding that every unsubsidized project would proceed.",
    sourceId: "taxFairness" },
  { who: "Trustee Lisa Ganuelas", org: "Confederated Tribes of the Umatilla Indian Reservation", camp: "tribal",
    position: "A presentation to an advisory committee is distinct from government-to-government consultation.",
    evidence: "The statement calls for consultation on recommendations. Tribal sovereignty and treaty-resource concerns should be addressed through the appropriate process rather than folded into a generic stakeholder tally.",
    sourceId: "tribalStatement" },
];
export interface RecordFinding { claim: string; detail: string; attribution: string; sourceId: keyof typeof SOURCES; }
export const RECORD_FINDINGS: RecordFinding[] = [
  { claim: "Program totals and data-center totals are different",
    detail: "The June program table's $233.6M of $240.9M refers to data centers within the long-term rural program. It is not a statewide total across all incentive programs.",
    attribution: "Business Oregon · June 26, 2026 · slide 4", sourceId: "businessOregonRoi" },
  { claim: "Exemptions, taxes collected and fees need separate columns",
    detail: "The Morrow County assessor reports $123.6M in exempted taxes, $72.3M collected countywide and $23.9M in negotiated fees. These are different quantities; exempted tax is not an assessed-value tax base or a causal estimate of recoverable revenue.",
    attribution: "County assessor presentation · June 26, 2026", sourceId: "morrowAssessor" },
  { claim: "Electricity projections are scenarios",
    detail: "ECONorthwest projects data-center consumption rising from 14.0 TWh in 2025 to 24.8 TWh in 2030. The presentation labels its analysis preliminary; future load depends on projects, utilization and efficiency.",
    attribution: "ECONorthwest · July 31, 2026 · preliminary analysis", sourceId: "econw" },
  { claim: "Permitted backup capacity is not continuous generation",
    detail: "DEQ's inventory describes 2,482 generators and 6,328 MW of permitted capacity across 39 campuses. Capacity alone cannot determine annual emissions: operating hours, fuel, controls and permit conditions also matter.",
    attribution: "DEQ · July 31, 2026", sourceId: "deqAir" },
  { claim: "School equalization has exceptions",
    detail: "ODE distinguishes operating revenues in the formula from capital bonds and certain local-option revenues, and identifies districts whose local revenues exceed formula funding. A site-level assessment must identify the affected levies.",
    attribution: "ODE · July 31, 2026 · slides 5 and 12", sourceId: "odeSchoolFunding" },
  { claim: "The September document leaves policy questions open",
    detail: "The committee is seeking input before final recommendations. A question or area of agreement in a preliminary report is not an enacted requirement.",
    attribution: "DCAC · September 10, 2026", sourceId: "preliminary" },
];
export const STRUCTURAL_FACTORS = [
  { title: "Authority is divided",
    detail: "Tax authorizations, utility tariffs, land use and environmental permits follow different processes. An enforceable proposal must name the institution responsible for each term." },
  { title: "Benefits and costs cross boundaries",
    detail: "A host area's receipts, statewide school-funding effects and basin or grid impacts need different accounting boundaries. Local support and statewide concern can coexist." },
  { title: "Participation does not establish representativeness",
    detail: "A hearing record shows the positions submitted, not a representative poll. Committee membership, public testimony and tribal consultation are distinct forms of participation." },
  { title: "Political predictions remain judgments",
    detail: "Public opposition and competing policy proposals do not establish which changes will pass. The reviewed record does not justify declaring a moratorium constituency absent or reform inevitable." },
];
