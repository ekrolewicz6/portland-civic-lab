import { NextResponse } from "next/server";
import sql from "@/lib/db-query";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { resolveBusinessGeography, BOUNDARY_PROVENANCE } from "@/lib/business/geography";
import { evaluateGeography, geographicOpenings, type GeoFacts } from "@/lib/business/geo-eligibility";
import type { OpportunityEligibility } from "@/lib/business";

/**
 * Public address check. No auth, no business profile, no stored data.
 *
 * It answers one question: given this address, which funding programmes are
 * geographically open, which are positively closed, and which we could not
 * check. Everything that needs the business profile — match scores, drafts,
 * tracking — stays behind registration.
 *
 * Returns programmes in three buckets rather than two on purpose. "Couldn't
 * check" is not "you qualify", and collapsing them is how a benefits list ends
 * up confidently promising money an address rules out.
 */

export const dynamic = "force-dynamic";

const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;

interface CatalogRow {
  slug: string;
  name: string;
  funder: string;
  category: string;
  amount_min: number | null;
  amount_max: number | null;
  value_type: string;
  url: string | null;
  description: string | null;
  eligibility: OpportunityEligibility | null;
  verification_status: string;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`geo-check:${ip}`, RATE_LIMIT, WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many lookups. Wait a minute and try again." },
      { status: 429 },
    );
  }

  let address = "";
  try {
    const body = (await request.json()) as { address?: unknown };
    address = typeof body.address === "string" ? body.address.slice(0, 200) : "";
  } catch {
    return NextResponse.json({ error: "Send an address." }, { status: 400 });
  }

  const geography = await resolveBusinessGeography(address);
  if (geography.error) {
    return NextResponse.json({ geography, error: geography.error }, { status: 200 });
  }

  const facts: GeoFacts = {
    inPortland: geography.inPortland,
    tifDistrict: geography.tifDistrict,
    businessDistricts: geography.businessDistricts,
    censusTract: geography.censusTract,
    unresolved: geography.unresolved,
  };

  let rows: CatalogRow[] = [];
  try {
    rows = (await sql`
      SELECT slug, name, funder, category, amount_min, amount_max, value_type,
             url, description, eligibility, verification_status
      FROM funding_opportunities
      ORDER BY amount_max DESC NULLS LAST
    `) as CatalogRow[];
  } catch (error) {
    console.error("[geo-check] catalog query failed:", error);
    return NextResponse.json(
      { geography, error: "We resolved the address but couldn't load the programme list." },
      { status: 200 },
    );
  }

  const open: unknown[] = [];
  const closed: unknown[] = [];
  const unknown: unknown[] = [];

  for (const row of rows) {
    const verdict = evaluateGeography(row.eligibility?.geography, facts);
    const entry = {
      slug: row.slug,
      name: row.name,
      funder: row.funder,
      category: row.category,
      amountMin: row.amount_min,
      amountMax: row.amount_max,
      valueType: row.value_type,
      url: row.url,
      description: row.description,
      where: row.eligibility?.geography?.label ?? null,
      verificationStatus: row.verification_status,
      reason: verdict.reason || null,
    };
    if (verdict.status === "eligible") open.push(entry);
    else if (verdict.status === "ineligible") closed.push(entry);
    else unknown.push(entry);
  }

  return NextResponse.json({
    geography,
    openings: geographicOpenings(facts),
    open,
    closed,
    unknown,
    provenance: BOUNDARY_PROVENANCE,
    // Stated plainly so the number is never mistaken for a personalised total.
    note:
      "This checks location only. Programmes also gate on ownership, size, industry and timing — register a business to check those.",
  });
}
