import { NextResponse } from "next/server";
import { filterSchema, listRecords } from "@/lib/oregon-fire/query";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const parsed = filterSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  try {
    return NextResponse.json(await listRecords(parsed.data));
  } catch {
    return NextResponse.json(
      {
        dataStatus: "unavailable",
        error:
          "Fire records are temporarily unavailable. Coverage and source links remain available.",
      },
      { status: 503 },
    );
  }
}
