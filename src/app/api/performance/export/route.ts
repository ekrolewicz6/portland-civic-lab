import { NextRequest, NextResponse } from "next/server";
import { getPerformanceSnapshot } from "@/lib/performance/service";
import { snapshotToCsv } from "@/lib/performance/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const rawMeasureId = request.nextUrl.searchParams.get("measureId") ?? undefined;
  // Only allow safe characters in the id — it ends up in a response header.
  const measureId =
    rawMeasureId && /^[\w.-]+$/.test(rawMeasureId) ? rawMeasureId : undefined;

  try {
    const snapshot = await getPerformanceSnapshot();
    const csv = snapshotToCsv(snapshot, measureId);
    const filename = measureId
      ? `performance-portland-${measureId}.csv`
      : "performance-portland-scorecards.csv";

    return new NextResponse(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[performance/export]", error);
    return NextResponse.json(
      { ok: false, error: "Performance CSV export failed" },
      { status: 500 },
    );
  }
}
