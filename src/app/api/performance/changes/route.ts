import { NextRequest, NextResponse } from "next/server";
import { getPerformanceSnapshot } from "@/lib/performance/service";
import { internalPerformanceOnlyResponse, isInternalPerformanceRequest } from "../_internal";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isInternalPerformanceRequest(request)) return internalPerformanceOnlyResponse();

  try {
    const snapshot = await getPerformanceSnapshot();
    return NextResponse.json({
      ok: true,
      fetchedAt: snapshot.fetchedAt,
      changes: snapshot.changes,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Performance change log failed",
      },
      { status: 500 },
    );
  }
}
