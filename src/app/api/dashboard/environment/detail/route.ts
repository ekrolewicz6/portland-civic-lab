import { NextResponse } from "next/server";
import sql, { getCachedData, setCachedData } from "@/lib/db-query";

export const dynamic = "force-dynamic";

const CACHE_KEY = "environment_detail";
const CACHE_TTL = 60 * 60 * 1000; // 1h (AQI updates hourly)

interface AqiReading {
  pollutant: string;
  aqi: number;
  category: string;
  date: string;
  hour: number;
  reporting_area: string;
}

interface ForecastReading {
  pollutant: string;
  aqi: number;
  category: string;
  date_forecast: string;
  action_day: boolean;
  discussion: string | null;
}

interface EnvironmentDetailResponse {
  currentAqi: AqiReading[];
  forecast: ForecastReading[];
  aqiTrend: { date: string; value: number }[];
  dataStatus: string;
  lastSynced: string | null;
}

export async function GET(): Promise<NextResponse<EnvironmentDetailResponse>> {
  try {
    // Check cache first
    const cached = await getCachedData<EnvironmentDetailResponse>(CACHE_KEY, CACHE_TTL);
    if (cached) return NextResponse.json(cached);

    // Latest reading per pollutant
    const currentRows = await sql`
      SELECT DISTINCT ON (pollutant)
        pollutant, aqi::int, category, date::text, hour::int, reporting_area
      FROM environment.airnow_aqi
      ORDER BY pollutant, date DESC, hour DESC
    `;

    const currentAqi: AqiReading[] = currentRows.map((r) => ({
      pollutant: r.pollutant as string,
      aqi: Number(r.aqi),
      category: r.category as string,
      date: r.date as string,
      hour: Number(r.hour),
      reporting_area: r.reporting_area as string,
    }));

    // Forecast (tomorrow or latest available)
    let forecast: ForecastReading[] = [];
    try {
      const forecastRows = await sql`
        SELECT pollutant, aqi::int, category, date_forecast::text,
               action_day, discussion
        FROM environment.airnow_forecast
        WHERE date_forecast >= CURRENT_DATE
        ORDER BY date_forecast ASC, pollutant
      `;
      forecast = forecastRows.map((r) => ({
        pollutant: r.pollutant as string,
        aqi: Number(r.aqi),
        category: r.category as string,
        date_forecast: r.date_forecast as string,
        action_day: Boolean(r.action_day),
        discussion: (r.discussion as string) || null,
      }));
    } catch {
      // Forecast table may not exist yet — not fatal
    }

    // Daily average PM2.5 AQI — last 14 days
    const trendRows = await sql`
      SELECT date::text AS date, ROUND(AVG(aqi))::int AS avg_aqi
      FROM environment.airnow_aqi
      WHERE pollutant = 'PM2.5'
        AND date >= CURRENT_DATE - INTERVAL '14 days'
      GROUP BY date
      ORDER BY date
    `;

    const aqiTrend = trendRows.map((r) => ({
      date: String(r.date).slice(5), // MM-DD
      value: Number(r.avg_aqi),
    }));

    // When was the last sync?
    const syncCheck = await sql`
      SELECT MAX(created_at)::text as last_synced FROM environment.airnow_aqi
    `;
    const lastSynced = (syncCheck[0]?.last_synced as string) || null;

    const responseData: EnvironmentDetailResponse = {
      currentAqi,
      forecast,
      aqiTrend,
      dataStatus: currentAqi.length > 0 ? "live" : "unavailable",
      lastSynced,
    };

    if (currentAqi.length > 0) {
      await setCachedData(CACHE_KEY, responseData);
    }
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[environment/detail] DB query failed:", error);
    return NextResponse.json({
      currentAqi: [],
      forecast: [],
      aqiTrend: [],
      dataStatus: "unavailable",
      lastSynced: null,
    });
  }
}
