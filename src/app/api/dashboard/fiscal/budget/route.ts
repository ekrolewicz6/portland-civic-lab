import { NextResponse } from "next/server";
import { budgetData } from "@/data/general-fund-budget";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(budgetData);
  } catch (error) {
    console.error("[fiscal/budget] Error:", error);
    return NextResponse.json(
      { error: "Failed to load budget data" },
      { status: 500 },
    );
  }
}
