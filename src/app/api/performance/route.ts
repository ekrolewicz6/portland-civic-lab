import { NextRequest, NextResponse } from "next/server";
import { buildPerformanceDecisionSuite } from "@/lib/performance/decision-tools";
import { getPerformanceSnapshot } from "@/lib/performance/service";
import { internalPerformanceOnlyResponse, isInternalPerformanceRequest } from "./_internal";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isInternalPerformanceRequest(request)) return internalPerformanceOnlyResponse();

  const includeTools = request.nextUrl.searchParams.get("includeTools") === "1";

  try {
    const snapshot = await getPerformanceSnapshot();
    return NextResponse.json({
      ok: true,
      snapshot,
      decisionTools: includeTools ? buildPerformanceDecisionSuite(snapshot) : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Performance snapshot failed",
      },
      { status: 500 },
    );
  }
}
