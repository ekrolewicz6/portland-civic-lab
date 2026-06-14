import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ORG_TREE,
  ORG_AS_OF,
  ORG_SOURCES,
  SERVICE_AREAS,
} from "@/data/org-structure";
import {
  BUREAU_PERSONNEL,
  PERSONNEL_FY,
  PERSONNEL_SOURCE,
} from "@/data/org-personnel";
import {
  flattenTree,
  operatingUnits,
  orgStats,
  reorgMoves,
} from "@/lib/org/queries";

// Public, read-only API for the City of Portland org structure. Lets the chart
// (and anyone else) query the hierarchy as JSON.
//   /api/org                -> { asOf, sources, serviceAreas, stats, tree }
//   /api/org?format=flat    -> + flat[] (one row per unit, with parent + depth)
//   /api/org?view=reorg     -> only the 2025-reorg moves
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");
    const view = searchParams.get("view");

    const base = {
      asOf: ORG_AS_OF,
      sources: ORG_SOURCES,
      serviceAreas: SERVICE_AREAS,
      stats: orgStats(),
    };

    if (view === "reorg") {
      return NextResponse.json({ ...base, reorgMoves: reorgMoves() });
    }

    if (view === "personnel") {
      return NextResponse.json({
        ...base,
        personnelFiscalYear: PERSONNEL_FY,
        personnelSource: PERSONNEL_SOURCE,
        personnel: BUREAU_PERSONNEL,
      });
    }

    const payload =
      format === "flat"
        ? { ...base, flat: flattenTree(), units: operatingUnits() }
        : { ...base, tree: ORG_TREE };

    return NextResponse.json(payload, {
      headers: {
        // Reference data; safe to cache at the edge for an hour.
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[api/org] Error:", error);
    return NextResponse.json(
      { error: "Failed to load org structure" },
      { status: 500 },
    );
  }
}
