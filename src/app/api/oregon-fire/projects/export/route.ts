import { publishedProjects } from "@/lib/oregon-fire/projects";
import { csvCell } from "@/lib/oregon-fire/query";
export async function GET() {
  const header = ["projectId","version","activityId","type","status","date","datePrecision","description","evidenceUrls","geometryMeaning"];
  const lines = publishedProjects().flatMap((p) => p.activities.map((a) => [p.id,p.version,a.id,a.type,a.status,a.date,a.precision,a.text,a.evidenceIds.map((id) => p.evidence.find((e) => e.id === id)?.url).join("; "),p.geometryMeaning].map(csvCell).join(",")));
  return new Response([header.join(","), ...lines].join("\r\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=oregon-fire-project-activities.csv" } });
}
