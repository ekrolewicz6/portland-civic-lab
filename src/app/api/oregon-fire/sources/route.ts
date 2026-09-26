import { NextResponse } from "next/server";
import { coverage } from "@/lib/oregon-fire/query";
import { ASSESSMENT_MANIFEST } from "@/lib/oregon-fire/assessment-availability";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({ sources: await coverage(), assessments: ASSESSMENT_MANIFEST });
}
