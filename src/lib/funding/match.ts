import sql from "@/lib/db-query";
import { evaluateGeography, type GeoFacts } from "@/lib/business/geo-eligibility";
import type { Business, OpportunityEligibility } from "@/lib/business";

/**
 * Rules-based matching between a business profile and the funding catalog.
 *
 * Deliberately deterministic rather than model-generated: an owner is being
 * shown dollar figures about their own business, so the same profile must
 * always produce the same answer and every rationale must trace to a rule
 * that actually fired. Structured eligibility decides *eligible*; the
 * rationale explains *why it fits*.
 */

interface CatalogRow {
  id: number;
  slug: string;
  name: string;
  funder: string;
  level: string;
  category: string;
  amount_min: number | null;
  amount_max: number | null;
  value_type: string;
  unit_label: string | null;
  effort_level: number | null;
  success_probability: string | null;
  rolling: boolean;
  eligibility: OpportunityEligibility | null;
  verification_status: string;
}

/**
 * Industry tags derived from what the owner told us. NAICS is authoritative
 * when present; most owners leave it blank, so the description is scanned as
 * a fallback.
 */
export function deriveBusinessTypes(business: Business): string[] {
  const types = new Set<string>();
  const naics = business.naics_code ?? "";
  const text = `${business.name} ${business.description ?? ""}`.toLowerCase();

  if (naics.startsWith("722") || /\b(coffee|caf[eé]|espresso|restaurant|bakery|brewery|pub|food|kitchen|deli|bar)\b/.test(text)) {
    types.add("food_service");
  }
  if (naics.startsWith("45121") || naics.startsWith("459210") || /\b(bookstore|book shop|bookshop|books)\b/.test(text)) {
    types.add("bookstore");
  }
  if (naics.startsWith("44") || naics.startsWith("45") || /\b(retail|storefront|shop|boutique)\b/.test(text)) {
    types.add("retail");
  }
  if (business.entity_type === "nonprofit") types.add("nonprofit");

  return [...types];
}

function overlaps(required: string[] | undefined, held: string[]): boolean {
  if (!required || required.length === 0) return true; // no constraint
  return required.some((r) => held.includes(r));
}

export interface MatchDecision {
  /** Geographic outcome, kept distinct so "unchecked" never reads as "qualifies". */
  geoStatus?: "eligible" | "ineligible" | "unknown";
  geoReason?: string;
  eligible: boolean;
  score: number;
  rationale: string;
}

export function evaluateMatch(
  business: Business,
  opp: CatalogRow,
  geo?: GeoFacts | null,
): MatchDecision {
  const e = opp.eligibility ?? {};
  const ownership = business.ownership_attributes ?? [];
  const mission = business.mission_tags ?? [];
  const types = deriveBusinessTypes(business);

  const ownershipRequired = (e.ownershipAttributes ?? []).length > 0;
  const typeRequired = (e.businessTypes ?? []).length > 0;
  const missionRequired = (e.missionTags ?? []).length > 0;

  const ownershipOk = overlaps(e.ownershipAttributes, ownership);
  const typeOk = overlaps(e.businessTypes, types);
  const missionOk = overlaps(e.missionTags, mission);
  const sizeOk =
    e.maxEmployees == null ||
    business.employee_count == null ||
    business.employee_count <= e.maxEmployees;

  if (!ownershipOk || !typeOk || !missionOk || !sizeOk) {
    return { eligible: false, score: 0, rationale: "" };
  }

  // Geography is evaluated last because it is the only gate that can come back
  // "we don't know". An unresolved layer must not silently pass as eligible —
  // that is how an address-blind list ends up promising money the address rules
  // out. Unknown stays in the list, flagged; ineligible drops out with a reason.
  const geoVerdict = evaluateGeography(e.geography, geo ?? null);
  if (geoVerdict.status === "ineligible") {
    return {
      eligible: false,
      score: 0,
      rationale: "",
      geoStatus: "ineligible",
      geoReason: geoVerdict.reason,
    };
  }

  // Score: targeted programs beat generic ones, then adjust for how likely
  // and how much work it is.
  let score = 50;
  if (ownershipRequired) score += 15;
  if (typeRequired) score += 10;
  if (missionRequired) score += 8;
  if (opp.verification_status === "verified") score += 8;
  if (opp.success_probability === "high") score += 10;
  else if (opp.success_probability === "low") score -= 10;
  score += (3 - (opp.effort_level ?? 3)) * 3;
  score = Math.max(5, Math.min(100, score));

  if (geoVerdict.status === "unknown") score -= 5;
  score = Math.max(5, Math.min(100, score));

  return { eligible: true, score, geoStatus: geoVerdict.status,
    geoReason: geoVerdict.reason || undefined,
    rationale: buildRationale(business, opp, {
    ownershipRequired,
    typeRequired,
    missionRequired,
  }) };
}

function humanList(values: string[]): string {
  const words = values.map((v) => v.replace(/_/g, " "));
  if (words.length <= 1) return words[0] ?? "";
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

function buildRationale(
  business: Business,
  opp: CatalogRow,
  fired: { ownershipRequired: boolean; typeRequired: boolean; missionRequired: boolean }
): string {
  const parts: string[] = [];
  const e = opp.eligibility ?? {};

  // Why you're eligible.
  if (fired.ownershipRequired) {
    const matched = (e.ownershipAttributes ?? []).filter((a) =>
      (business.ownership_attributes ?? []).includes(a)
    );
    parts.push(
      `Reserved for ${humanList(matched)} businesses, which you told us applies to ${business.name}.`
    );
  } else if (fired.typeRequired) {
    parts.push(
      `Specific to ${humanList(e.businessTypes ?? [])} businesses — money a general small-business search would never surface.`
    );
  } else if (fired.missionRequired) {
    const matched = (e.missionTags ?? []).filter((t) =>
      (business.mission_tags ?? []).includes(t)
    );
    parts.push(
      `Funds ${humanList(matched)} work, which is already part of what you do.`
    );
  } else {
    parts.push(`Open to Portland small businesses like yours.`);
  }

  // What it's worth, framed by how it pays out.
  if (opp.value_type === "recurring_annual") {
    parts.push("This one repeats every year, so it compounds rather than arriving once.");
  } else if (opp.value_type === "per_unit" && opp.unit_label) {
    parts.push(`Paid ${opp.unit_label}, so it scales as you grow.`);
  }

  // How much work, and how likely.
  if ((opp.effort_level ?? 3) <= 2 && opp.success_probability === "high") {
    parts.push("Low effort and a strong likelihood — worth doing early.");
  } else if ((opp.effort_level ?? 3) >= 4) {
    parts.push("A heavier application; PCL does the assembly.");
  } else if (opp.success_probability === "low") {
    parts.push("A long shot, but cheap to enter.");
  }

  if (opp.verification_status !== "verified") {
    parts.push("PCL is confirming current amounts and deadlines with the funder.");
  }

  return parts.join(" ");
}

/**
 * Score a business against the whole catalog and store the eligible matches.
 *
 * Existing rows are left untouched (ON CONFLICT DO NOTHING): hand-curated
 * matches and any pipeline progress an owner has made always win over a
 * regenerated one.
 */
export async function generateMatchesForBusiness(
  businessId: number
): Promise<number> {
  const [business] = (await sql`
    SELECT * FROM businesses WHERE id = ${businessId} LIMIT 1
  `) as unknown as Business[];
  if (!business) return 0;

  const catalog = (await sql`
    SELECT id, slug, name, funder, level, category, amount_min, amount_max,
           value_type, unit_label, effort_level, success_probability, rolling,
           eligibility, verification_status
    FROM funding_opportunities
  `) as unknown as CatalogRow[];

  // Resolve the address once, not once per programme. A business whose address
  // we cannot resolve still gets matched — geographic gates then come back
  // "unknown" and stay visible with that caveat, rather than being silently
  // dropped or silently admitted.
  let geo: GeoFacts | null = null;
  const street = [business.address_street, business.address_city, business.address_zip]
    .filter(Boolean)
    .join(", ");
  if (street) {
    try {
      const { resolveBusinessGeography } = await import("@/lib/business/geography");
      const g = await resolveBusinessGeography(street);
      if (!g.error) {
        geo = {
          inPortland: g.inPortland,
          tifDistrict: g.tifDistrict,
          businessDistricts: g.businessDistricts,
          censusTract: g.censusTract,
          unresolved: g.unresolved,
        };
      }
    } catch (err) {
      // Leave geo null; gated programmes report "unknown" rather than passing.
      // Log it — a silently swallowed geography failure is indistinguishable
      // from "this address has no restrictions", which is the exact confusion
      // this whole module exists to remove.
      console.warn(
        `[match] geography unresolved for business ${businessId}:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  let inserted = 0;
  for (const opp of catalog) {
    const decision = evaluateMatch(business, opp, geo);
    if (!decision.eligible) continue;

    const rows = await sql`
      INSERT INTO opportunity_matches (
        business_id, opportunity_id, fit_score, fit_rationale, status
      ) VALUES (
        ${businessId}, ${opp.id}, ${decision.score},
        ${[decision.rationale, decision.geoReason].filter(Boolean).join(" ")},
        'identified'
      )
      ON CONFLICT (business_id, opportunity_id) DO NOTHING
      RETURNING id
    `;
    inserted += rows.length;
  }
  return inserted;
}
