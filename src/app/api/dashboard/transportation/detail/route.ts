import { NextResponse } from "next/server";
import sql from "@/lib/db-query";

export const dynamic = "force-dynamic";

// ── Types ─────────────────────────────────────────────────────────────

interface RouteByType {
  type: string;
  count: number;
}

interface SampleRoute {
  routeName: string;
  routeType: string;
  routeColor: string;
}

interface RidershipYear {
  fiscalYear: number;
  bus: number;
  maxRail: number;
  wes: number;
  streetcar: number;
  total: number;
}

interface CrashYear {
  year: number;
  fatalities: number;
  seriousInjuries: number;
  pedestrianFatalities: number;
  cyclistFatalities: number;
  motorcyclistFatalities: number;
  vehicleOccupantFatalities: number;
  totalReportedCrashes: number;
  source: string;
}

interface CommuteModeYear {
  year: number;
  droveAlone: number;
  carpooled: number;
  transit: number;
  bicycle: number;
  walked: number;
  wfh: number;
  droveAlonePct: number;
  carpooledPct: number;
  transitPct: number;
  bicyclePct: number;
  walkedPct: number;
  wfhPct: number;
}

interface TransportationDetailResponse {
  dataStatus: string;
  dataAvailable: boolean;
  routesByType: RouteByType[];
  sampleRoutes: SampleRoute[];
  totalRoutes: number;
  totalStops: number;
  ridershipTrend: RidershipYear[];
  crashTrend: CrashYear[];
  commuteModeTrend: CommuteModeYear[];
  ridershipRecovery: {
    prePandemic: number;
    lowest: number;
    latest: number;
    recoveryPct: number;
  } | null;
  visionZeroSummary: {
    visionZeroAdopted: number;
    latestYear: number;
    latestFatalities: number;
    peakYear: number;
    peakFatalities: number;
    changeFromPeak: number;
  } | null;
}

export async function GET(): Promise<NextResponse<TransportationDetailResponse>> {
  let routesByType: RouteByType[] = [];
  let sampleRoutes: SampleRoute[] = [];
  let totalRoutes = 0;
  let totalStops = 0;
  let ridershipTrend: RidershipYear[] = [];
  let crashTrend: CrashYear[] = [];
  let commuteModeTrend: CommuteModeYear[] = [];
  let ridershipRecovery: TransportationDetailResponse["ridershipRecovery"] = null;
  let visionZeroSummary: TransportationDetailResponse["visionZeroSummary"] = null;

  // 1. Routes by type (GTFS)
  try {
    const rows = await sql`
      SELECT route_type_name, count(*)::int AS cnt
      FROM downtown.trimet_routes
      GROUP BY route_type_name
      ORDER BY cnt DESC
    `;
    routesByType = rows.map((r) => ({
      type: r.route_type_name as string,
      count: Number(r.cnt),
    }));
  } catch { /* table may not exist */ }

  // 2. Total routes
  try {
    const rows = await sql`SELECT count(*)::int AS cnt FROM downtown.trimet_routes`;
    totalRoutes = Number(rows[0].cnt);
  } catch { /* table may not exist */ }

  // 3. Total stops
  try {
    const rows = await sql`SELECT count(*)::int AS cnt FROM downtown.trimet_stops`;
    totalStops = Number(rows[0].cnt);
  } catch { /* table may not exist */ }

  // 4. Sample routes (non-bus: MAX, Streetcar, WES)
  try {
    const rows = await sql`
      SELECT route_name, route_type_name, route_color
      FROM downtown.trimet_routes
      WHERE route_type_name != 'Bus'
      ORDER BY route_type_name, route_name
    `;
    sampleRoutes = rows.map((r) => ({
      routeName: r.route_name as string,
      routeType: r.route_type_name as string,
      routeColor: r.route_color as string,
    }));
  } catch { /* table may not exist */ }

  // 5. Ridership trend — pivot by fiscal year
  try {
    const rows = await sql`
      SELECT
        fiscal_year,
        COALESCE(SUM(CASE WHEN mode = 'Bus' THEN boardings END), 0)::bigint AS bus,
        COALESCE(SUM(CASE WHEN mode = 'MAX Light Rail' THEN boardings END), 0)::bigint AS max_rail,
        COALESCE(SUM(CASE WHEN mode = 'WES Commuter Rail' THEN boardings END), 0)::bigint AS wes,
        COALESCE(SUM(CASE WHEN mode = 'Streetcar' THEN boardings END), 0)::bigint AS streetcar,
        COALESCE(SUM(boardings), 0)::bigint AS total
      FROM transportation.ridership
      GROUP BY fiscal_year
      ORDER BY fiscal_year ASC
    `;
    ridershipTrend = rows.map((r) => ({
      fiscalYear: Number(r.fiscal_year),
      bus: Number(r.bus),
      maxRail: Number(r.max_rail),
      wes: Number(r.wes),
      streetcar: Number(r.streetcar),
      total: Number(r.total),
    }));

    // Compute recovery metrics
    if (ridershipTrend.length > 0) {
      const fy2019 = ridershipTrend.find((r) => r.fiscalYear === 2019);
      const lowest = ridershipTrend
        .filter((r) => r.fiscalYear >= 2020)
        .reduce((min, r) => (r.total < min.total ? r : min), ridershipTrend[ridershipTrend.length - 1]);
      const latest = ridershipTrend[ridershipTrend.length - 1];

      if (fy2019) {
        ridershipRecovery = {
          prePandemic: fy2019.total,
          lowest: lowest.total,
          latest: latest.total,
          recoveryPct: Math.round((latest.total / fy2019.total) * 1000) / 10,
        };
      }
    }
  } catch { /* table may not exist */ }

  // 6. Crash/fatality trend
  try {
    const rows = await sql`
      SELECT
        year, fatalities, serious_injuries,
        pedestrian_fatalities, cyclist_fatalities,
        motorcyclist_fatalities, vehicle_occupant_fatalities,
        total_reported_crashes, source
      FROM transportation.crashes
      ORDER BY year ASC
    `;
    crashTrend = rows.map((r) => ({
      year: Number(r.year),
      fatalities: Number(r.fatalities),
      seriousInjuries: Number(r.serious_injuries),
      pedestrianFatalities: Number(r.pedestrian_fatalities),
      cyclistFatalities: Number(r.cyclist_fatalities),
      motorcyclistFatalities: Number(r.motorcyclist_fatalities),
      vehicleOccupantFatalities: Number(r.vehicle_occupant_fatalities),
      totalReportedCrashes: Number(r.total_reported_crashes),
      source: r.source as string,
    }));

    // Vision Zero summary (adopted 2015, goal: zero by 2025)
    if (crashTrend.length > 0) {
      // Exclude partial year (2025) for peak/latest analysis
      const fullYears = crashTrend.filter((c) => c.year < 2025);
      if (fullYears.length > 0) {
        const peak = fullYears.reduce((max, c) => (c.fatalities > max.fatalities ? c : max), fullYears[0]);
        const latest = fullYears[fullYears.length - 1];
        visionZeroSummary = {
          visionZeroAdopted: 2015,
          latestYear: latest.year,
          latestFatalities: latest.fatalities,
          peakYear: peak.year,
          peakFatalities: peak.fatalities,
          changeFromPeak:
            Math.round(((latest.fatalities - peak.fatalities) / peak.fatalities) * 1000) / 10,
        };
      }
    }
  } catch { /* table may not exist */ }

  // 7. Commute mode trend — pivot by year
  try {
    const rows = await sql`
      SELECT
        year,
        COALESCE(MAX(CASE WHEN mode = 'Drove Alone' THEN count END), 0)::int AS drove_alone,
        COALESCE(MAX(CASE WHEN mode = 'Carpooled' THEN count END), 0)::int AS carpooled,
        COALESCE(MAX(CASE WHEN mode = 'Public Transit' THEN count END), 0)::int AS transit,
        COALESCE(MAX(CASE WHEN mode = 'Bicycle' THEN count END), 0)::int AS bicycle,
        COALESCE(MAX(CASE WHEN mode = 'Walked' THEN count END), 0)::int AS walked,
        COALESCE(MAX(CASE WHEN mode = 'Work From Home' THEN count END), 0)::int AS wfh,
        COALESCE(MAX(CASE WHEN mode = 'Drove Alone' THEN pct END), 0)::numeric AS drove_alone_pct,
        COALESCE(MAX(CASE WHEN mode = 'Carpooled' THEN pct END), 0)::numeric AS carpooled_pct,
        COALESCE(MAX(CASE WHEN mode = 'Public Transit' THEN pct END), 0)::numeric AS transit_pct,
        COALESCE(MAX(CASE WHEN mode = 'Bicycle' THEN pct END), 0)::numeric AS bicycle_pct,
        COALESCE(MAX(CASE WHEN mode = 'Walked' THEN pct END), 0)::numeric AS walked_pct,
        COALESCE(MAX(CASE WHEN mode = 'Work From Home' THEN pct END), 0)::numeric AS wfh_pct
      FROM transportation.commute_mode
      GROUP BY year
      ORDER BY year ASC
    `;
    commuteModeTrend = rows.map((r) => ({
      year: Number(r.year),
      droveAlone: Number(r.drove_alone),
      carpooled: Number(r.carpooled),
      transit: Number(r.transit),
      bicycle: Number(r.bicycle),
      walked: Number(r.walked),
      wfh: Number(r.wfh),
      droveAlonePct: Number(r.drove_alone_pct),
      carpooledPct: Number(r.carpooled_pct),
      transitPct: Number(r.transit_pct),
      bicyclePct: Number(r.bicycle_pct),
      walkedPct: Number(r.walked_pct),
      wfhPct: Number(r.wfh_pct),
    }));
  } catch { /* table may not exist */ }

  const hasTrimetData = totalRoutes > 0 || totalStops > 0;
  const hasRidership = ridershipTrend.length > 0;
  const hasCrashes = crashTrend.length > 0;
  const hasCommute = commuteModeTrend.length > 0;
  const dataAvailable = hasTrimetData || hasRidership || hasCrashes || hasCommute;

  return NextResponse.json({
    dataStatus: dataAvailable ? "live" : "unavailable",
    dataAvailable,
    routesByType,
    sampleRoutes,
    totalRoutes,
    totalStops,
    ridershipTrend,
    crashTrend,
    commuteModeTrend,
    ridershipRecovery,
    visionZeroSummary,
  });
}
