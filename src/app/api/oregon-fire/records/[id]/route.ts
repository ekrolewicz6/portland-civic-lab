import { NextResponse } from "next/server";
import { recordDetail } from "@/lib/oregon-fire/query";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (id.length > 150)
    return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
  try {
    const data = await recordDetail(id);
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
