import { NextResponse } from "next/server";
import sql, { getCachedData, setCachedData } from "@/lib/db-query";

export const dynamic = "force-dynamic";

const CACHE_KEY = "housing_journey";

interface JourneyPhase {
  phase: string;
  median_day: number;
  median_step_duration: number;
  permits_affected: number;
}

interface JourneyByType {
  permit_type: string;
  label: string;
  permits: number;
  phases: { phase: string; median_day: number }[];
  total_days: number;
}

interface PhaseTrend {
  period: string;
  [key: string]: string | number;
}

interface JourneyResponse {
  phases: JourneyPhase[];
  byType: JourneyByType[];
  trend: PhaseTrend[];
  correctionStats: {
    pctWithCorrections: number;
    avgRounds: number;
    totalPermits: number;
  };
  dataStatus: string;
}

// Simplified permit type labels
const TYPE_MAP: Record<string, string> = {
  "Residential Bldg/Trade PermitSingle Family DwellingNew Construction": "Single Family (New)",
  "Residential Bldg/Trade PermitSingle Family DwellingAlteration": "Single Family (Remodel)",
  "Residential Bldg/Trade PermitSingle Family DwellingAddition": "Single Family (Addition)",
  "Residential Bldg/Trade PermitTownhouse (3 or more units)New Construction": "Townhouse (New)",
  "Residential Bldg/Trade PermitAccessory Dwelling UnitNew Construction": "ADU (New)",
  "Commercial Building PermitApartments/Condos (3 or more units)New Construction": "Apartment/Condo (New)",
  "Commercial Building PermitApartments/Condos (3 or more units)Alteration": "Apartment/Condo (Remodel)",
  "Commercial Building PermitBusinessAlteration": "Commercial (Remodel)",
  "Commercial Building PermitBusinessNew Construction": "Commercial (New)",
  "Commercial Building PermitUtilityAlteration": "Utility (Alteration)",
  "Commercial Building PermitUtilityNew Construction": "Utility (New)",
  "Commercial Building PermitAssemblyAlteration": "Assembly (Remodel)",
  "Commercial Building PermitStorageAlteration": "Storage (Remodel)",
  "Commercial Building PermitStorageNew Construction": "Storage (New)",
  "Commercial Building PermitMercantileAlteration": "Retail (Remodel)",
  "Commercial Building PermitFactory/IndustrialAlteration": "Industrial (Remodel)",
  "Commercial Building PermitBusinessDemolition": "Commercial (Demolition)",
  "Commercial Building PermitStorageDemolition": "Storage (Demolition)",
  "Commercial Building PermitEducationalAlteration": "Educational (Remodel)",
  "Residential Bldg/Trade PermitSingle Family DwellingInterior Alteration Only": "Single Family (Interior Only)",
  "Residential Bldg/Trade PermitSingle Family DwellingDemolition": "Single Family (Demolition)",
  "Residential Bldg/Trade PermitGarage/CarportDemolition": "Garage/Carport (Demolition)",
  "Residential Bldg/Trade PermitGarage/CarportAlteration": "Garage/Carport (Remodel)",
  "Residential Bldg/Trade PermitGarage/CarportNew Construction": "Garage/Carport (New)",
  "Residential Bldg/Trade PermitAccessory StructureNew Construction": "Accessory Structure (New)",
  "Residential Bldg/Trade PermitAccessory StructureAlteration": "Accessory Structure (Remodel)",
  "Residential Bldg/Trade PermitAccessory StructureDemolition": "Accessory Structure (Demolition)",
  "Residential Bldg/Trade PermitAccessory Dwelling UnitAlteration": "ADU (Remodel)",
  "Residential Bldg/Trade PermitDecks, Fences, Retaining WallsAlteration": "Decks/Fences (Remodel)",
  "Residential Bldg/Trade PermitDecks, Fences, Retaining WallsAddition": "Decks/Fences (Addition)",
  "Residential Bldg/Trade PermitDecks, Fences, Retaining WallsNew Construction": "Decks/Fences (New)",
  "Residential Bldg/Trade PermitDuplex/Two Family DwellingAlteration": "Duplex (Remodel)",
  "Residential Bldg/Trade PermitDuplex/Two Family DwellingNew Construction": "Duplex (New)",
  "Residential Bldg/Trade PermitTownhouse (3 or more units)Alteration": "Townhouse (Remodel)",
  "Residential Bldg/Trade PermitTownhouse (2 Units)New Construction": "Townhouse 2-Unit (New)",
};

const KEY_PHASES = [
  "Application",
  "Planning and Zoning",
  "Structural",
  "Life Safety",
  "Fire Review",
  "Environmental Services",
  "Issuance",
  "Building Inspections",
  "Electrical Inspections",
  "Plumbing Inspections",
  "Mechanical Inspections",
  "Final Permit",
];

// All four reads collapsed into a single round trip via json_build_object,
// each pulling from a precomputed materialized view (see
// scripts/create-housing-matviews.ts). Previously these queries hit
// housing.permit_activities (5.9M rows) with PERCENTILE_CONT and took
// 30-60 seconds — well past Vercel's function timeout.
const COMBINED_QUERY = `
  SELECT json_build_object(
    'phases', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        SELECT activity_type, median_day, median_step_duration, permits_affected
        FROM housing.mv_permit_phase_summary
      ) t
    ),
    'by_type', (
      SELECT COALESCE(json_agg(t ORDER BY permits DESC), '[]'::json) FROM (
        SELECT permit_type, permits, structural, life_safety, issuance, building_insp, final_permit
        FROM housing.mv_permit_journey_by_type
        ORDER BY permits DESC
        LIMIT 10
      ) t
    ),
    'trend', (
      SELECT COALESCE(json_agg(t ORDER BY period), '[]'::json) FROM (
        SELECT period, permits, structural_days, issuance_days, inspection_days, final_days
        FROM housing.mv_permit_journey_trend
      ) t
    ),
    'corrections', (
      SELECT row_to_json(t) FROM (
        SELECT total_permits, with_corrections, avg_rounds
        FROM housing.mv_permit_correction_stats
        WHERE id = 1
      ) t
    )
  ) AS payload
`;

type Row = Record<string, unknown>;

export async function GET(): Promise<NextResponse<JourneyResponse>> {
  try {
    const cached = await getCachedData<JourneyResponse>(CACHE_KEY, 24 * 60 * 60 * 1000);
    if (cached) return NextResponse.json(cached);

    const t0 = Date.now();
    const result = await sql.unsafe(COMBINED_QUERY);
    const payload = (result[0]?.payload ?? {}) as Record<string, unknown>;
    console.log(`[housing/journey] combined matview query: ${Date.now() - t0}ms`);

    const phaseRows = (payload.phases as Row[]) ?? [];
    const typeRows = (payload.by_type as Row[]) ?? [];
    const trendRows = (payload.trend as Row[]) ?? [];
    const corr = (payload.corrections as Row | null) ?? null;

    const phases: JourneyPhase[] = KEY_PHASES
      .map((phase) => {
        const row = phaseRows.find((r) => r.activity_type === phase);
        if (!row) return null;
        return {
          phase,
          median_day: Number(row.median_day),
          median_step_duration: Number(row.median_step_duration),
          permits_affected: Number(row.permits_affected),
        };
      })
      .filter(Boolean) as JourneyPhase[];

    const byType: JourneyByType[] = typeRows.map((r) => {
      const raw = r.permit_type as string;
      const label = TYPE_MAP[raw] ?? raw.replace(/Residential Bldg\/Trade Permit|Commercial Building Permit/g, "").trim();
      const phasesArr = [
        { phase: "Reviews", median_day: Math.min(Number(r.structural) || 999, Number(r.life_safety) || 999) },
        { phase: "Permit Issued", median_day: Number(r.issuance) || 0 },
        { phase: "Construction", median_day: Number(r.building_insp) || 0 },
        { phase: "Final", median_day: Number(r.final_permit) || 0 },
      ].filter((p) => p.median_day > 0 && p.median_day < 999);
      return {
        permit_type: raw,
        label,
        permits: Number(r.permits),
        phases: phasesArr,
        total_days: Number(r.final_permit) || Number(r.building_insp) || 0,
      };
    });

    const trend: PhaseTrend[] = trendRows.map((r) => ({
      period: r.period as string,
      "Review Complete": Number(r.structural_days) || 0,
      "Permit Issued": Number(r.issuance_days) || 0,
      "Inspections Done": Number(r.inspection_days) || 0,
      "Final Permit": Number(r.final_days) || 0,
    }));

    const totalPermits = Number(corr?.total_permits ?? 0);
    const withCorr = Number(corr?.with_corrections ?? 0);

    const responseData: JourneyResponse = {
      phases,
      byType,
      trend,
      correctionStats: {
        pctWithCorrections: totalPermits > 0
          ? Math.round((withCorr / totalPermits) * 1000) / 10
          : 0,
        avgRounds: Number(corr?.avg_rounds ?? 0),
        totalPermits,
      },
      dataStatus: "live",
    };

    await setCachedData(CACHE_KEY, responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[housing/journey] DB query failed:", error);
    return NextResponse.json({
      phases: [],
      byType: [],
      trend: [],
      correctionStats: { pctWithCorrections: 0, avgRounds: 0, totalPermits: 0 },
      dataStatus: "unavailable",
    });
  }
}
