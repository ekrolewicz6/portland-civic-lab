import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { registerSources, syncSource } from "@/lib/oregon-fire/ingest";
import { FIRE_SOURCES } from "@/lib/oregon-fire/sources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const start = Date.now(),
    results: unknown[] = [];
  let failed = false;
  try {
    await registerSources();
    // Short-lived sources first. Longer imports checkpoint and resume next run.
    for (const source of [...FIRE_SOURCES]
      .filter((s) => s.endpoint)
      .sort((a, b) => (a.cadenceHours ?? 0) - (b.cadenceHours ?? 0))) {
      if (Date.now() - start > 230000) break;
      try {
        results.push(
          await syncSource(
            source.id,
            Math.min(90000, 240000 - (Date.now() - start)),
          ),
        );
      } catch (e) {
        failed = true;
        results.push({
          sourceId: source.id,
          error: e instanceof Error ? e.message : "Import failed",
        });
      }
    }
    return NextResponse.json(
      { ok: !failed, results },
      { status: failed ? 502 : 200 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Fire import unavailable" },
      { status: 503 },
    );
  }
}
