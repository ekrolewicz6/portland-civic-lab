import { NextResponse } from "next/server";
import { placeContext } from "@/lib/oregon-fire/projects";
import places from "@/lib/oregon-fire/places.json";
export async function GET(_request: Request, { params }: { params: Promise<{ geoid: string }> }) {
  const { geoid } = await params;
  if (!places.some((p) => p.id === geoid)) return NextResponse.json({ error: "Place not found" }, { status: 404 });
  return NextResponse.json(placeContext(geoid));
}
