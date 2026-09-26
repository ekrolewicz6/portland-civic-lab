import { NextResponse } from "next/server";
import { publishedProjects, documentationCoverage } from "@/lib/oregon-fire/projects";
import { z } from "zod";
const query = z.object({ place: z.string().regex(/^\d{7}$/).optional(), bbox: z.string().optional().refine((v) => !v || (v.split(",").length === 4 && v.split(",").every((n) => Number.isFinite(Number(n))) && Number(v.split(",")[0]) < Number(v.split(",")[2]) && Number(v.split(",")[1]) < Number(v.split(",")[3]))) });
export async function GET(request: Request) {
  const p = query.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!p.success) return NextResponse.json({ error: "Invalid project filters" }, { status: 400 });
  const b = p.data.bbox?.split(",").map(Number);
  const projects = publishedProjects().filter((project) => (!p.data.place || project.placeIds.includes(p.data.place)) && (!b || (project.bbox[0] <= b[2] && project.bbox[2] >= b[0] && project.bbox[1] <= b[3] && project.bbox[3] >= b[1])));
  return NextResponse.json({ projects, coverage: documentationCoverage(), provenance: "Version-controlled public-source editorial catalog; regional bounds are context, not verified unit geometry." });
}
