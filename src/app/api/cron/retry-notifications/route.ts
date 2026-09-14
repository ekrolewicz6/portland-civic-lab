import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { notifyIntake, type IntakeSource } from "@/lib/intake-notifications";
import sql from "@/lib/db-query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const rows = await sql`select source, source_id from intake_notifications where status in ('pending','sending') and next_attempt_at <= now() order by created_at limit 10`;
    const started = Date.now();
    let sent = 0;
    for (const row of rows) {
      if (Date.now() - started > 35000) break;
      if (await notifyIntake(row.source as IntakeSource, row.source_id)) sent++;
    }
    const [counts] = await sql`select count(*) filter (where status in ('pending','sending'))::int as pending, count(*) filter (where status = 'failed')::int as failed from intake_notifications`;
    const ok = counts.pending === 0 && counts.failed === 0;
    return NextResponse.json({ ok, sent, ...counts }, { status: ok ? 200 : 503 });
  } catch (error) {
    console.error("[retry-notifications] failed", error);
    return NextResponse.json({ ok: false, error: "Notification queue unavailable" }, { status: 503 });
  }
}
