import { NextResponse } from "next/server";
import { projectById } from "@/lib/oregon-fire/projects";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const project = projectById(id);
  return NextResponse.json(project ? { project, provenance: "Version-controlled public-source editorial catalog" } : { error: "Published project not found" }, { status: project ? 200 : 404 });
}
