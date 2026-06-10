import { NextRequest, NextResponse } from "next/server";
import { syncPerformanceSnapshot } from "@/lib/performance/service";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

function isAuthorized(request: NextRequest): boolean {
  return isAuthorizedCronRequest(request);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

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
