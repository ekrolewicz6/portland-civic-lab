import { NextResponse } from "next/server";
import { filterSchema, exportRows, csvCell } from "@/lib/oregon-fire/query";
import { coverage } from "@/lib/oregon-fire/query";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const parsed = filterSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid filters" }, { status: 400 });
  try {
    const sources = await coverage();
    if (!sources.some((s) => s.lastSuccess))
      return NextResponse.json({ error: "Data unavailable" }, { status: 503 });
    const rows = await exportRows(parsed.data);
    const fields = [
      "id",
      "sourceId",
      "nativeId",
      "name",
      "kind",
      "recordKind",
      "agency",
      "county",
      "method",
      "purpose",
      "status",
      "date",
      "datePrecision",
      "reportedYear",
      "reportedDate",
      "dateNote",
      "year",
      "treatmentAcres",
      "burnedAcres",
      "polygonAcres",
      "geometryMeaning",
      "accuracy",
      "sourceUrl",
      "sourceUpdatedAt",
      "lastObservedAt",
      "inLatestFeed",
      "coverageNote",
    ];
    const text = [
      fields.join(","),
      ...rows.map(({ data }) => fields.map((k) => csvCell(data[k])).join(",")),
    ].join("\r\n");
    return new Response(text, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="oregon-fire-records.csv"',
      },
    });
  } catch {
    return NextResponse.json({ error: "Export unavailable" }, { status: 503 });
  }
}
