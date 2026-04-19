import { NextResponse } from "next/server";
import sql, { getCachedData, setCachedData } from "@/lib/db-query";

export const dynamic = "force-dynamic";

const CACHE_KEY = "quality_detail";
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6h

// Single round-trip: json_build_object avoids pooler deadlocks.
const COMBINED_QUERY = `
  SELECT json_build_object(
    -- Parks summary
    'park_summary', (
      SELECT row_to_json(t) FROM (
        SELECT count(*)::int AS total_parks,
               COALESCE(round(sum(acres)::numeric, 0), 0)::int AS total_acres,
               COALESCE(round(avg(acres)::numeric, 1), 0) AS avg_acres
        FROM quality.parks
      ) t
    ),
    -- Largest park
    'largest_park', (
      SELECT row_to_json(t) FROM (
        SELECT name, acres
        FROM quality.parks
        ORDER BY acres DESC NULLS LAST
        LIMIT 1
      ) t
    ),
    -- Parks by type
    'parks_by_type', (
      SELECT COALESCE(json_agg(t ORDER BY t.count DESC), '[]'::json) FROM (
        SELECT park_type AS type, count(*)::int AS count,
               COALESCE(round(sum(acres)::numeric, 0), 0)::int AS acres
        FROM quality.parks
        WHERE park_type IS NOT NULL AND park_type != ''
        GROUP BY park_type
      ) t
    ),
    -- Pavement summary
    'pavement_summary', (
      SELECT row_to_json(t) FROM (
        SELECT
          round(avg(pci)::numeric, 0)::int AS avg_pci,
          COALESCE(count(*) FILTER (WHERE pci > 70), 0)::int AS good,
          COALESCE(count(*) FILTER (WHERE pci >= 40 AND pci <= 70), 0)::int AS fair,
          COALESCE(count(*) FILTER (WHERE pci < 40), 0)::int AS poor,
          count(*)::int AS total_segments
        FROM quality.pavement_condition
      ) t
    ),
    -- Pavement by functional class
    'pavement_by_class', (
      SELECT COALESCE(json_agg(t ORDER BY t.avg_pci), '[]'::json) FROM (
        SELECT functional_class AS class,
               round(avg(pci)::numeric, 0)::int AS avg_pci,
               count(*)::int AS segments
        FROM quality.pavement_condition
        WHERE functional_class IS NOT NULL AND functional_class != ''
        GROUP BY functional_class
      ) t
    ),
    -- Worst streets (lowest PCI, at least some length)
    'worst_streets', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        SELECT street_name, pci, surface_type, functional_class,
               round(length::numeric, 0)::int AS length_ft
        FROM quality.pavement_condition
        WHERE pci IS NOT NULL AND street_name IS NOT NULL AND street_name != ''
        ORDER BY pci ASC
        LIMIT 10
      ) t
    ),
    -- Library trend (all years)
    'library_trend', (
      SELECT COALESCE(json_agg(t ORDER BY t.fiscal_year), '[]'::json) FROM (
        SELECT fiscal_year,
               visits::int AS visits,
               circ_total::int AS circulation,
               programs_total::int AS programs,
               program_attendance_total::int AS attendance,
               registered_users::int AS registered_borrowers,
               hours_open_year::int AS hours_open,
               branches::int AS branches,
               collection_books::int AS collection_books,
               circ_physical::int AS circ_physical,
               circ_econtent::int AS circ_econtent
        FROM quality.library_stats
        ORDER BY fiscal_year
      ) t
    ),
    -- Park amenities summary
    'amenities_summary', (
      SELECT COALESCE(json_agg(t ORDER BY t.count DESC), '[]'::json) FROM (
        SELECT equipment_type, count(*)::int AS count,
               min(install_year) AS earliest_install,
               max(install_year) AS latest_install
        FROM quality.park_amenities
        WHERE equipment_type IS NOT NULL AND equipment_type != ''
        GROUP BY equipment_type
      ) t
    ),
    -- Total amenities
    'amenities_total', (
      SELECT count(*)::int FROM quality.park_amenities
    ),
    -- Parks with most amenities
    'parks_most_amenities', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        SELECT park_name, count(*)::int AS amenity_count
        FROM quality.park_amenities
        WHERE park_name IS NOT NULL AND park_name != ''
        GROUP BY park_name
        ORDER BY amenity_count DESC
        LIMIT 10
      ) t
    )
  ) AS payload
`;

interface QualityDetailResponse {
  parkStats: {
    totalParks: number;
    totalAcres: number;
    avgAcres: number;
    largestPark: { name: string; acres: number } | null;
  };
  parksByType: { type: string; count: number; acres: number }[];
  pavementSummary: {
    avgPci: number;
    good: number;
    fair: number;
    poor: number;
    totalSegments: number;
  };
  pavementByClass: { class: string; avgPci: number; segments: number }[];
  worstStreets: {
    street_name: string;
    pci: number;
    surface_type: string;
    functional_class: string;
    length_ft: number;
  }[];
  libraryTrend: {
    fiscal_year: number;
    visits: number;
    circulation: number;
    programs: number;
    attendance: number;
    registered_borrowers: number;
    hours_open: number;
    branches: number;
    collection_books: number;
    circ_physical: number;
    circ_econtent: number;
  }[];
  amenitiesSummary: {
    equipment_type: string;
    count: number;
    earliest_install: number | null;
    latest_install: number | null;
  }[];
  amenitiesTotal: number;
  parksMostAmenities: { park_name: string; amenity_count: number }[];
  heroStats: {
    totalParks: number;
    avgPci: number;
    pciLabel: string;
    latestVisits: number;
    latestFiscalYear: number | null;
  };
  topInsights: string[];
  dataStatus: string;
}

export async function GET(): Promise<NextResponse<QualityDetailResponse>> {
  try {
    const cached = await getCachedData<QualityDetailResponse>(CACHE_KEY, CACHE_TTL);
    if (cached) return NextResponse.json(cached);

    const result = await sql.unsafe(COMBINED_QUERY);
    const p = (result[0]?.payload ?? {}) as Record<string, unknown>;

    // --- Parks ---
    const parkSummary = (p.park_summary as { total_parks: number; total_acres: number; avg_acres: number }) ?? {
      total_parks: 0,
      total_acres: 0,
      avg_acres: 0,
    };
    const largestParkRaw = p.largest_park as { name: string; acres: number } | null;

    const parkStats = {
      totalParks: Number(parkSummary.total_parks),
      totalAcres: Number(parkSummary.total_acres),
      avgAcres: Number(parkSummary.avg_acres),
      largestPark: largestParkRaw
        ? { name: largestParkRaw.name, acres: Number(largestParkRaw.acres) }
        : null,
    };

    const parksByType = (
      (p.parks_by_type as { type: string; count: number; acres: number }[]) ?? []
    ).map((r) => ({
      type: r.type,
      count: Number(r.count),
      acres: Number(r.acres),
    }));

    // --- Pavement ---
    const pavRaw = (p.pavement_summary as Record<string, number>) ?? {};
    const pavementSummary = {
      avgPci: Number(pavRaw.avg_pci ?? 0),
      good: Number(pavRaw.good ?? 0),
      fair: Number(pavRaw.fair ?? 0),
      poor: Number(pavRaw.poor ?? 0),
      totalSegments: Number(pavRaw.total_segments ?? 0),
    };

    const pavementByClass = (
      (p.pavement_by_class as { class: string; avg_pci: number; segments: number }[]) ?? []
    ).map((r) => ({
      class: r.class,
      avgPci: Number(r.avg_pci),
      segments: Number(r.segments),
    }));

    const worstStreets = (
      (p.worst_streets as {
        street_name: string;
        pci: number;
        surface_type: string;
        functional_class: string;
        length_ft: number;
      }[]) ?? []
    ).map((r) => ({
      street_name: r.street_name,
      pci: Number(r.pci),
      surface_type: r.surface_type ?? "",
      functional_class: r.functional_class ?? "",
      length_ft: Number(r.length_ft),
    }));

    // --- Library ---
    const libraryTrend = (
      (p.library_trend as Record<string, number>[]) ?? []
    ).map((r) => ({
      fiscal_year: Number(r.fiscal_year),
      visits: Number(r.visits ?? 0),
      circulation: Number(r.circulation ?? 0),
      programs: Number(r.programs ?? 0),
      attendance: Number(r.attendance ?? 0),
      registered_borrowers: Number(r.registered_borrowers ?? 0),
      hours_open: Number(r.hours_open ?? 0),
      branches: Number(r.branches ?? 0),
      collection_books: Number(r.collection_books ?? 0),
      circ_physical: Number(r.circ_physical ?? 0),
      circ_econtent: Number(r.circ_econtent ?? 0),
    }));

    // --- Amenities ---
    const amenitiesSummary = (
      (p.amenities_summary as {
        equipment_type: string;
        count: number;
        earliest_install: number | null;
        latest_install: number | null;
      }[]) ?? []
    ).map((r) => ({
      equipment_type: r.equipment_type,
      count: Number(r.count),
      earliest_install: r.earliest_install ? Number(r.earliest_install) : null,
      latest_install: r.latest_install ? Number(r.latest_install) : null,
    }));

    const amenitiesTotal = Number(p.amenities_total ?? 0);

    const parksMostAmenities = (
      (p.parks_most_amenities as { park_name: string; amenity_count: number }[]) ?? []
    ).map((r) => ({
      park_name: r.park_name,
      amenity_count: Number(r.amenity_count),
    }));

    // --- Hero stats ---
    const pciLabel =
      pavementSummary.avgPci >= 70
        ? "Good"
        : pavementSummary.avgPci >= 40
          ? "Fair"
          : "Poor";

    const latestLib = libraryTrend.length > 0 ? libraryTrend[libraryTrend.length - 1] : null;

    const heroStats = {
      totalParks: parkStats.totalParks,
      avgPci: pavementSummary.avgPci,
      pciLabel,
      latestVisits: latestLib ? latestLib.visits : 0,
      latestFiscalYear: latestLib ? latestLib.fiscal_year : null,
    };

    // --- Insights ---
    const topInsights: string[] = [];

    topInsights.push(
      `${parkStats.totalParks} parks totaling ${parkStats.totalAcres.toLocaleString()} acres across Portland.`
    );

    if (parkStats.largestPark) {
      topInsights.push(
        `Largest park: ${parkStats.largestPark.name} at ${Math.round(parkStats.largestPark.acres).toLocaleString()} acres.`
      );
    }

    topInsights.push(
      `Average pavement condition index is ${pavementSummary.avgPci} (${pciLabel}) across ${pavementSummary.totalSegments.toLocaleString()} street segments.`
    );

    const total = pavementSummary.totalSegments || 1;
    const poorPct = Math.round((pavementSummary.poor / total) * 100);
    if (poorPct > 0) {
      topInsights.push(
        `${poorPct}% of street segments (${pavementSummary.poor.toLocaleString()}) are rated Poor (PCI < 40).`
      );
    }

    if (latestLib) {
      topInsights.push(
        `${latestLib.visits.toLocaleString()} library visits in FY${latestLib.fiscal_year} with ${latestLib.circulation.toLocaleString()} items circulated.`
      );

      if (libraryTrend.length >= 2) {
        const priorLib = libraryTrend[libraryTrend.length - 2];
        if (priorLib.visits > 0) {
          const visitChange = Math.round(
            ((latestLib.visits - priorLib.visits) / priorLib.visits) * 100
          );
          const dir = visitChange > 0 ? "up" : "down";
          topInsights.push(
            `Library visits ${dir} ${Math.abs(visitChange)}% from FY${priorLib.fiscal_year}.`
          );
        }
      }
    }

    if (amenitiesTotal > 0) {
      topInsights.push(
        `${amenitiesTotal.toLocaleString()} playground amenities tracked across Portland parks.`
      );
    }

    const responseData: QualityDetailResponse = {
      parkStats,
      parksByType,
      pavementSummary,
      pavementByClass,
      worstStreets,
      libraryTrend,
      amenitiesSummary,
      amenitiesTotal,
      parksMostAmenities,
      heroStats,
      topInsights,
      dataStatus: "live",
    };

    await setCachedData(CACHE_KEY, responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[quality/detail] DB query failed:", error);
    return NextResponse.json({
      parkStats: { totalParks: 0, totalAcres: 0, avgAcres: 0, largestPark: null },
      parksByType: [],
      pavementSummary: { avgPci: 0, good: 0, fair: 0, poor: 0, totalSegments: 0 },
      pavementByClass: [],
      worstStreets: [],
      libraryTrend: [],
      amenitiesSummary: [],
      amenitiesTotal: 0,
      parksMostAmenities: [],
      heroStats: { totalParks: 0, avgPci: 0, pciLabel: "N/A", latestVisits: 0, latestFiscalYear: null },
      topInsights: ["Data temporarily unavailable."],
      dataStatus: "unavailable",
    });
  }
}
