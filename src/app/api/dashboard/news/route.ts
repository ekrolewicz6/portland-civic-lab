import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db-query";

export const dynamic = "force-dynamic";

// Fed by the weekly cron at /api/cron/fetch-auditor-news (Mondays 08:00 UTC,
// see vercel.json), which scrapes portland.gov/auditor/news into
// content.news_context. Consumed by src/components/dashboard/NewsContext.tsx,
// which reads only the `stories` key; keep that key stable.

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");

  try {
    const rows = category
      ? await sql`
          SELECT id, category, headline, source, url, published_date,
                 summary, relevance, created_at
          FROM content.news_context
          WHERE category = ${category}
          ORDER BY published_date DESC
          LIMIT 5
        `
      : await sql`
          SELECT id, category, headline, source, url, published_date,
                 summary, relevance, created_at
          FROM content.news_context
          ORDER BY published_date DESC
          LIMIT 10
        `;

    // Feed freshness: when the ingest cron last wrote anything, regardless
    // of the category filter. Lets consumers distinguish "no stories in this
    // category" from "the feed itself is stale".
    const freshness = await sql`
      SELECT max(created_at) AS last_ingested FROM content.news_context
    `;
    const lastIngested = freshness[0]?.last_ingested ?? null;

    return NextResponse.json({
      stories: rows,
      headline: rows.length > 0 ? rows[0].headline : null,
      dataStatus: "live",
      lastUpdated: lastIngested
        ? new Date(lastIngested as string).toISOString()
        : null,
    });
  } catch (error) {
    // Do not mask DB failures as "no news": report status so an outage is
    // distinguishable from an empty category.
    console.error("[news] DB query failed:", error);
    return NextResponse.json({
      stories: [],
      headline: null,
      dataStatus: "unavailable",
      lastUpdated: null,
    });
  }
}
