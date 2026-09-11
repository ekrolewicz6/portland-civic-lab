import { NextResponse } from "next/server";
import { coverage } from "@/lib/oregon-fire/query";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({ sources: await coverage() });
}
