import type { IssueLine } from "../types";
import { packs } from "./packs";

/**
 * Authored ≤14-word issue lines, one per filled analysis.issues slot.
 * See race-sheet.md §9.
 *
 * Rules applied to every line:
 * - Parent is the PUBLISHED position (after withCouncilAnalysis merges
 *   campaign-site supplements over pamphlet positions), never the raw file.
 * - ≤14 words; an attribution verb first (supports, opposes, would, wants,
 *   proposes, rejects, sets); never a reporting verb (emphasizes, calls for,
 *   prioritizes, describes, argues, says).
 * - A line may omit, never add. Hedges stay only where dropping them would
 *   change what a reader believes; the card shows the full position.
 * - No vote language. An incumbent's line carries only the stated position.
 * - Standards and emphases (Beaudoin, Landgraver, Tucker, Sollitt, Torres on
 *   money) render as "Wants …" lines, never as a commitment or a cuts claim
 *   (§9, amended September 19, 2026).
 * - Plain words: zoning, permitting, social housing, PCEF, unarmed response
 *   and the rest of the §9 list appear only with a two-word gloss.
 * Alphabetical by candidate id within each race, then by issue.
 */

const reviewed = { reviewedBy: "pending", reviewedOn: "2026-09-19" } as const;

const line = (candidateId: string, issue: IssueLine["issue"], text: string): IssueLine => ({
  candidateId,
  issue,
  line: text,
  from: `analysis.issues.${issue}.position`,
  ...reviewed,
});

const councilLines: IssueLine[] = [
  /* ── Portland City Council, District 3 ─────────────────────────────── */

  line("ali-beaudoin", "housing", "More supply, simpler permits, workforce housing and rate help for first-time buyers."),
  line("ali-beaudoin", "safety", "Enforcement for crime, prevention through services, non-police care where needed."),
  line("ali-beaudoin", "climate", "Street maintenance, sidewalks, safer crossings and reliable buses first; keeps bike work."),
  line("ali-beaudoin", "money", "Wants spending reviewed for waste and program results measured, before new policies."),

  line("joel-corcoran", "money", "Proposes independent Council budget and legal offices, monthly budget reviews, contract audits."),
  line("joel-corcoran", "climate", "Supports expanded public utility options."),

  line("guy-frankenstein", "money", "Wants billion-dollar companies to contribute more."),

  line("matthias-hallett", "housing", "Supports faster building permits and deadlines when applications stall."),
  line("matthias-hallett", "safety", "Wants two police officers per 1,000 residents, without raising taxes."),
  line("matthias-hallett", "money", "Wants audits, limits on unaccountable spending, lighter business burdens, a deal keeping the Blazers."),

  line("patrick-hilton", "housing", "Wants adaptive reuse (converting existing buildings), community land trusts and co-housing, with ownership pathways."),
  line("patrick-hilton", "safety", "Supports safe-sleeping infrastructure alongside consistent rules for public space."),
  line("patrick-hilton", "money", "Proposes taxes on vacant units and polluters, and shifting money from consultants."),

  line("larry-kelly", "housing", "Supports expanding housing choices and removing unnecessary barriers."),
  line("larry-kelly", "safety", "Supports Portland Street Response, addiction treatment and permanent housing."),
  line("larry-kelly", "money", "Wants government to be easier for small businesses to work with."),

  line("tiffany-koyama-lane", "housing", "Supports publicly owned housing as an alternative to for-profit landlords, and rental assistance."),
  line("tiffany-koyama-lane", "money", "Supports public services, stronger union contracts, regulating corporations, and lower burdens on working families."),
  line("tiffany-koyama-lane", "climate", "Wants Vision Zero (no traffic deaths), bike and transit infrastructure, trees, a data-center moratorium."),

  line("kenneth-kent-r-landgraver-iii", "money", "Wants tax dollars to support public work."),

  line("keir-legree", "housing", "Supports more housing supply, faster permits, and more government-owned affordable homes."),
  line("keir-legree", "safety", "Wants more police and dispatchers; shelter and treatment judged by measurable results."),
  line("keir-legree", "money", "Would cut project delivery costs through competitive bidding, independent estimates, scope control."),
  line("keir-legree", "climate", "Supports lower emissions and walking, biking, transit and driving improvements where need is shown."),

  line("esther-leon", "housing", "Would expand social (public or nonprofit) housing, simplify land-use rules, tax large landlords' vacancies."),
  line("esther-leon", "safety", "Would fund Street Response, expand unarmed (non-police) specialists, reduce armed responses; opposes camp sweeps."),
  line("esther-leon", "money", "Proposes land-value taxes, targeted taxes on vacant property, and exploring basic income for artists."),
  line("esther-leon", "climate", "Supports protected bikeways, car-free plazas, later transit service, regional transit funding; opposes Waymo robotaxis."),

  line("darren-mccormick", "safety", "Wants more police and jail for people he calls dangerous and drug-affected."),

  line("angelita-morillo", "housing", "Supports stronger tenant rights and shelter design involving unhoused residents."),
  line("angelita-morillo", "safety", "Supports Street Response, violence prevention and police accountability."),
  line("angelita-morillo", "money", "Wants public investment to come first."),
  line("angelita-morillo", "climate", "Supports transit, bike lanes and sidewalks; opposes oil-train and data-center expansion."),

  line("steve-novick", "housing", "Supports faster building permits, attracting housing investment, stronger mental-health and addiction services."),
  line("steve-novick", "safety", "Would add property-crime detectives, shift welfare checks to non-police responders, remove hazardous camps only."),
  line("steve-novick", "money", "Wants lower Council office budgets, fair Moda deal, Arts Tax replacement preserving arts funding."),
  line("steve-novick", "climate", "Supports using PCEF (clean-energy fund) for transit and possibly water filtration, offsetting rate increases."),

  line("cristal-otero", "housing", "Supports homes across incomes; would move 5–20% of city-regulated affordable rentals to co-ops."),
  line("cristal-otero", "safety", "Supports emergency response alongside prevention, behavioral health and housing stability."),
  line("cristal-otero", "money", "Would test program results; for new revenue, prefers taxing wealthiest households and largest corporations."),
  line("cristal-otero", "climate", "Wants Portland Clean Energy Fund spending to remain tied to climate purposes."),

  line("terry-parker", "safety", "Supports police and fire staffing and long-term support for unhoused people."),
  line("terry-parker", "money", "Would maintain streets and parks before funding new projects."),
  line("terry-parker", "climate", "Opposes business-access-and-transit lanes on 82nd Avenue."),

  line("heart-free-pham", "housing", "Supports hempblock (hemp-based building block) construction to reduce building and energy costs."),
  line("heart-free-pham", "safety", "Supports civil-commitment (involuntary treatment) reform, consequences for refusing available services; opposes criminalizing homelessness itself."),
  line("heart-free-pham", "money", "Would require cost-benefit accounting before new taxes or spending; would examine the tax base."),

  line("tom-sollitt", "housing", "Would preserve existing affordable housing first and score every major Housing Bureau investment."),
  line("tom-sollitt", "safety", "Would assign each call type to police, Fire, Street Response or health teams."),
  line("tom-sollitt", "money", "Would restore the Auditor’s performance audits before asking Portlanders for more money."),
  line("tom-sollitt", "climate", "Would maintain streets before new projects and restrict projects without funding or results."),

  line("john-sweeney", "housing", "Would build homes to the price residents can afford, using low-cost designs."),
  line("john-sweeney", "safety", "Wants the County to assume primary responsibility for homelessness services."),
  line("john-sweeney", "money", "Opposes spending to keep the Blazers; puts preserving city services first as revenue declines."),

  line("kellie-torres", "housing", "Wants 4,000 homes a year through fewer code barriers and faster building permits."),
  line("kellie-torres", "safety", "Supports police capacity for investigations, faster emergency responses, connecting people in crisis with services."),
  line("kellie-torres", "money", "Wants more public-private partnerships, philanthropy and sponsorships; proposes a reimagined Tom McCall Waterfront Bowl."),
  line("kellie-torres", "climate", "Wants parks, trails, river access and habitat restoration through public and private partnerships."),

  line("kimberly-tucker", "safety", "Would add armed officers plus specialists for non-criminal calls, with a plain-language police budget."),
  line("kimberly-tucker", "money", "Wants stronger cost-benefit analysis and clearer explanations for program funding decisions."),

  line("martin-ward", "housing", "Would test government-owned housing, build permanent shelter, and oppose demolishing Lloyd Center."),
  line("martin-ward", "safety", "Would add police officers, cameras at every intersection and non-lethal equipment."),
  line("martin-ward", "money", "Rejects Moda Center renovations and proposes large spending cuts."),

  /* ── Portland City Council, District 4 ─────────────────────────────── */

  line("timothy-tj-anderson", "housing", "Wants more housing through a more investable city and reuse of city assets."),
  line("timothy-tj-anderson", "safety", "Wants faster police response: more officers, with cadets and volunteers on lesser calls."),
  line("timothy-tj-anderson", "money", "Would audit city spending and assets first; no new taxes or fees until done."),
  line("timothy-tj-anderson", "climate", "Wants climate steps that also help business, plus more transit and trains."),
  line("eli-arnold", "housing", "Proposes filling subsidized vacancies faster, incentives for small builders, deferring development charges until occupancy."),
  line("eli-arnold", "safety", "Would add police-clinician behavioral-health units, more detective and traffic staffing, expand neighborhood response teams."),
  line("eli-arnold", "money", "Proposes raising the small-business exemption to $150,000, a tax holiday for new small businesses."),
  line("eli-arnold", "climate", "Supports phased fareless transit and incremental safety improvements at the CEI Hub fuel-storage area."),

  line("olivia-clark", "housing", "Would speed up permits, reduce development fees for affordable housing, and seek federal funding."),
  line("olivia-clark", "safety", "Would remove street camping and public drug use while adding shelter, treatment, sobering capacity."),
  line("olivia-clark", "money", "Wants core services and business recovery to come first."),
  line("olivia-clark", "climate", "Wants water, sewer and street systems that withstand heat, drought and extreme weather."),

  line("jayne-cronlund", "housing", "Hold housing nonprofits accountable; speed downtown office-to-housing conversions."),
  line("jayne-cronlund", "safety", "Modest police increase tied to response times; closer checks on housing nonprofits."),
  line("jayne-cronlund", "money", "Supports living-wage jobs, a creative and sustainable economy, and regular reporting on government goals."),
  line("jayne-cronlund", "climate", "Wants parks, trails, natural areas and business districts to come first."),

  line("jamey-evenstar", "housing", "Would lay foundations for permanently affordable social (public or nonprofit) housing and housing stability."),
  line("jamey-evenstar", "safety", "Supports expanded unarmed (non-police) crisis response and stronger state and county mental-health services."),
  line("jamey-evenstar", "money", "Supports earlier transparent budgets, participatory (resident-directed) budgeting, worker-owned businesses, investment across commercial corridors."),
  line("jamey-evenstar", "climate", "Proposes lower-cost transit for people under 25, buses separated from traffic, more southwest transit."),

  line("mitch-green", "housing", "Supports permanently affordable social (public or nonprofit) housing, income-linked rents, tenant unions helping govern."),
  line("mitch-green", "safety", "Would protect and expand Street Response and defend unarmed responders from budget cuts."),
  line("mitch-green", "money", "Wants public dollars in public assets and cooperative ownership; counts preschool as economic development."),
  line("mitch-green", "climate", "Would expand PCEF (clean-energy fund) for transit, not Moda or added policing."),

  line("josh-leake", "housing", "Would combine public, private and federal resources to develop housing."),
  line("josh-leake", "safety", "Would combine crime and disorder responses with behavioral-health services and dignity for unhoused people."),
  line("josh-leake", "money", "Supports creative and technology industries and activating public spaces."),

  line("john-mcdonald", "safety", "Would limit new homelessness contracts and scrutinize existing providers."),
  line("john-mcdonald", "money", "Supports modernizing Moda Center and retaining the Trail Blazers."),
  line("john-mcdonald", "climate", "Supports continuing the Interstate Bridge Replacement (new I-5 bridge)."),

  line("matt-schulte", "safety", "Proposes ReBoot, connecting volunteers and professionals to help people navigate services."),
  line("matt-schulte", "money", "Proposes the Grid-Connected Core with downtown building owners to attract economic activity."),
  line("matt-schulte", "climate", "Would reuse downtown buildings and electrical capacity as energy infrastructure."),

  line("jeremy-beausoleil-smith", "housing", "Supports social (public or nonprofit) housing, a renters' bill of rights, treatment-linked housing."),
  line("jeremy-beausoleil-smith", "safety", "Supports expanded Portland Street Response."),
  line("jeremy-beausoleil-smith", "money", "Would protect the Portland Clean Energy Fund."),
  line("jeremy-beausoleil-smith", "climate", "Proposes a four-year AI data-center ban, better walking and cycling, addressing CEI Hub risks."),

  line("eric-zimmerman", "housing", "Supports housing production and shelter."),
  line("eric-zimmerman", "safety", "Would combine police, Street Response, camp cleanups, enforcement and treatment."),
  line("eric-zimmerman", "money", "Opposes several tax and fee increases; would put police, fire and maintenance first."),
];

/** Council lines plus every published pack's lines. */
export const issueLines: IssueLine[] = [...councilLines, ...packs.flatMap((p) => p.lines)];
