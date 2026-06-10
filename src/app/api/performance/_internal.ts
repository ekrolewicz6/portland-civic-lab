import { NextRequest, NextResponse } from "next/server";

export function isInternalPerformanceRequest(request: NextRequest): boolean {
  const token = process.env.PERFORMANCE_API_TOKEN ?? process.env.CRON_SECRET;

  if (!token) return false;

  return (
    request.headers.get("authorization") === `Bearer ${token}` ||
    request.headers.get("x-performance-api-token") === token
  );
}

export function internalPerformanceOnlyResponse() {
  return NextResponse.json(
    {
      ok: false,
      error: "Performance JSON endpoints are internal only.",
    },
    { status: 404 },
  );
}
