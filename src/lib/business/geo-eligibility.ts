/**
 * Geographic eligibility: does this address open or close this programme?
 *
 * Deliberately pure and client-safe — no `server-only`, no data imports — so
 * the same logic can run in a server route and be reasoned about in tests.
 * The geography itself is resolved elsewhere (src/lib/business/geography.ts).
 *
 * The important design choice is that this returns THREE outcomes, not two.
 * "We could not check" is not "you qualify." Collapsing those two is precisely
 * the failure mode that produces confident, wrong advice — telling a business
 * it might collect $75,000 from a programme its address rules out.
 */

export interface GeoPredicate {
  /** Human-readable, always shown. Survives from the old free-text field. */
  label: string;
  /** true = must be in any TIF district; string[] = must be in one of these. */
  requiresTifDistrict?: boolean | string[];
  requiresBusinessDistrict?: boolean;
  /** Venture Portland money flows through member associations only. */
  requiresVenturePortlandMember?: boolean;
  requiresLmiTract?: boolean;
  cityOfPortlandOnly?: boolean;
}

/** The subset of resolved geography this module needs. */
export interface GeoFacts {
  inPortland: boolean;
  tifDistrict: string | null;
  businessDistricts: Array<{ name: string; venturePortlandMember: boolean }>;
  censusTract: string | null;
  unresolved: string[];
}

export type GeoStatus = "eligible" | "ineligible" | "unknown";

export interface GeoVerdict {
  status: GeoStatus;
  /** Plain-language reason, written to be read by the business owner. */
  reason: string;
}

/** Programmes with no geographic gate pass without comment. */
const OPEN: GeoVerdict = { status: "eligible", reason: "" };

export function evaluateGeography(
  predicate: GeoPredicate | undefined,
  facts: GeoFacts | null,
): GeoVerdict {
  if (!predicate) return OPEN;

  // Legacy rows stored geography as a bare string. Such a row has no readable
  // gate, and treating "unreadable" as "open" is the precise bug this module
  // exists to prevent — it would silently re-admit every programme we just
  // learned to filter. Fail to unknown, loudly, until the row is migrated.
  if (typeof predicate === "string") {
    return {
      status: "unknown",
      reason: `This programme's location rule hasn't been converted to a checkable form yet (it still reads "${predicate}"), so we can't test your address against it.`,
    };
  }

  const gated =
    predicate.requiresTifDistrict !== undefined ||
    predicate.requiresBusinessDistrict ||
    predicate.requiresVenturePortlandMember ||
    predicate.requiresLmiTract ||
    predicate.cityOfPortlandOnly;

  if (!gated) return OPEN;

  if (!facts) {
    return {
      status: "unknown",
      reason: "We haven't checked this address yet, so we can't tell whether this one applies.",
    };
  }

  if (predicate.cityOfPortlandOnly && !facts.inPortland) {
    return { status: "ineligible", reason: "This programme is limited to businesses inside Portland." };
  }

  // ── tax increment district ──
  if (predicate.requiresTifDistrict !== undefined) {
    if (facts.unresolved.includes("tax increment district")) {
      return {
        status: "unknown",
        reason: "We couldn't check tax increment districts for this address.",
      };
    }
    const wanted = predicate.requiresTifDistrict;
    if (!facts.tifDistrict) {
      return {
        status: "ineligible",
        reason:
          "This address is not inside a tax increment finance district, and this money only reaches addresses that are.",
      };
    }
    if (Array.isArray(wanted) && !wanted.includes(facts.tifDistrict)) {
      return {
        status: "ineligible",
        reason: `This programme covers ${wanted.join(", ")}. This address is in ${facts.tifDistrict}.`,
      };
    }
  }

  // ── business district association ──
  if (predicate.requiresBusinessDistrict || predicate.requiresVenturePortlandMember) {
    if (facts.unresolved.includes("business district")) {
      return { status: "unknown", reason: "We couldn't check business districts for this address." };
    }
    if (!facts.businessDistricts.length) {
      return {
        status: "ineligible",
        reason: "This address isn't inside a business district association's boundary.",
      };
    }
    if (predicate.requiresVenturePortlandMember) {
      const members = facts.businessDistricts.filter((d) => d.venturePortlandMember);
      if (!members.length) {
        const names = facts.businessDistricts.map((d) => d.name).join(" and ");
        return {
          status: "ineligible",
          reason: `This money flows through Venture Portland member associations. ${names} ${
            facts.businessDistricts.length > 1 ? "are" : "is"
          } not currently a member.`,
        };
      }
    }
  }

  // ── low-to-moderate-income tract ──
  if (predicate.requiresLmiTract) {
    // We can resolve the tract but have not verified a income-classification
    // source, so this is honestly unknown rather than assumed either way.
    return {
      status: "unknown",
      reason: facts.censusTract
        ? `This depends on whether census tract ${facts.censusTract} is classified low-to-moderate income. Worth confirming with the funder — it's often the deciding factor.`
        : "This depends on the income classification of your census tract, which we couldn't determine.",
    };
  }

  return OPEN;
}

/**
 * The affirmative version — what this address unlocks, phrased as an
 * opportunity rather than a filter. Used on the public check, where the
 * useful output is "here is the door" not "here is the rule."
 */
export function geographicOpenings(facts: GeoFacts): string[] {
  const out: string[] = [];
  if (facts.tifDistrict) {
    out.push(
      `You're inside the ${facts.tifDistrict} tax increment district — the gate on Prosper Portland's largest matching grants for tenant and building improvements.`,
    );
  }
  const members = facts.businessDistricts.filter((d) => d.venturePortlandMember);
  for (const d of members) {
    out.push(
      `${d.name} is a Venture Portland member, so district grant money can reach your block through it.`,
    );
  }
  const nonMembers = facts.businessDistricts.filter((d) => !d.venturePortlandMember);
  for (const d of nonMembers) {
    out.push(
      `${d.name} covers you but isn't a Venture Portland member — that route to district funding is closed unless the association joins.`,
    );
  }
  return out;
}
