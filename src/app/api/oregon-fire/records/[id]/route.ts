import { NextResponse } from "next/server";
import { recordDetail } from "@/lib/oregon-fire/query";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (id.length > 150)
    return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
  try {
    const cursor = Number(new URL(request.url).searchParams.get("relatedCursor") ?? 0);
    if (!Number.isInteger(cursor) || cursor < 0 || cursor > 1000000) return NextResponse.json({ error: "Invalid related cursor" }, { status: 400 });
    const data = await recordDetail(id, cursor);
    return NextResponse.json(data ?? { error: "Record not found" }, {
      status: data ? 200 : 404,
    });
  } catch {
    return NextResponse.json(
      { error: "Record details unavailable" },
      { status: 503 },
    );
  }
}
