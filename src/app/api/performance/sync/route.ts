import { NextRequest, NextResponse } from "next/server";
import { syncPerformanceSnapshot } from "@/lib/performance/service";
import { internalPerformanceOnlyResponse, isInternalPerformanceRequest } from "../_internal";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  if (!isInternalPerformanceRequest(request)) return internalPerformanceOnlyResponse();

  const startedAt = Date.now();

  try {
    const { runId, snapshot } = await syncPerformanceSnapshot();

    return NextResponse.json({
      ok: true,
      runId,
      ms: Date.now() - startedAt,
      counts: snapshot.counts,
      fetchedAt: snapshot.fetchedAt,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        ms: Date.now() - startedAt,
        error: error instanceof Error ? error.message : "Performance sync failed",
      },
      { status: 500 },
    );
  }
}
