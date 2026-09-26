import { NextResponse } from "next/server";
import sql from "@/lib/db-query";
import { SOURCE_BY_ID } from "@/lib/oregon-fire/sources";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const p = new URL(request.url).searchParams, source = p.get("source"), cursor = Number(p.get("cursor") ?? 0);
  if (!source || !SOURCE_BY_ID[source] || !Number.isInteger(cursor) || cursor < 0 || cursor > 1000000 || SOURCE_BY_ID[source].publication === "reconciliation") return NextResponse.json({error:"Invalid unlocated-record query"},{status:400});
  try {
    const rows = await sql`SELECT r.native_id,r.reason,r.attributes->>'activity_unit_name' AS name,r.attributes->>'state_abbr' AS reported_state FROM fire.rejections r JOIN fire.sources s ON s.active_run=r.run_id WHERE s.id=${source} AND r.attributes::text !~* '(tribal|tribe|cultural|bureau of indian)' ORDER BY r.native_id LIMIT 51 OFFSET ${cursor}`;
    return NextResponse.json({ records: rows.slice(0,50).map((r)=>({sourceId:source,nativeId:r.native_id,name:r.name ?? "Unlocated source record",reportedState:r.reported_state,reason:r.reason,sourceUrl:SOURCE_BY_ID[source].url})), nextCursor:rows.length>50 ? String(cursor+50) : null, coverage:"Discovery records only. Missing geometry prevents Oregon intersection verification; these are not mapped or added to located counts." });
  } catch { return NextResponse.json({error:"Unlocated-record inventory unavailable"},{status:503}); }
}
