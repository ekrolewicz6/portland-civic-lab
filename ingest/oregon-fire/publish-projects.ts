/** npx tsx --env-file=.env.local ingest/oregon-fire/publish-projects.ts [--dry-run]
 * Validated public-source catalog only; no transcript/file argument is accepted.
 */
import { publishedProjects, projectSchema } from "../../src/lib/oregon-fire/projects";
import sql from "../../src/lib/db-query";
async function main() {
  const projects = publishedProjects().map((p) => projectSchema.parse(p));
  if (process.argv.includes("--dry-run")) { console.log(JSON.stringify({ valid: true, projects: projects.map((p) => ({ id: p.id, version: p.version })) })); return; }
  await sql.begin(async (tx) => {
    for (const p of projects) {
      await tx.unsafe("UPDATE fire.projects SET active=false WHERE id=$1", [p.id]);
      await tx.unsafe("INSERT INTO fire.projects(id,version,data,publication_approved,active) VALUES($1,$2,$3::text::jsonb,true,true) ON CONFLICT(id,version) DO UPDATE SET data=excluded.data,publication_approved=true,active=true", [p.id,p.version,JSON.stringify(p)]);
      await tx.unsafe("DELETE FROM fire.project_evidence WHERE project_id=$1 AND version=$2", [p.id,p.version]);
      await tx.unsafe("DELETE FROM fire.project_items WHERE project_id=$1 AND version=$2", [p.id,p.version]);
      for (const e of p.evidence.filter((e) => e.approved)) await tx.unsafe("INSERT INTO fire.project_evidence(project_id,version,id,data,publication_approved) VALUES($1,$2,$3,$4::text::jsonb,true)", [p.id,p.version,e.id,JSON.stringify(e)]);
      const items = [...p.activities.map((data) => ({ kind: "activity", id: data.id, data })), ...p.outcomes.map((data,i) => ({ kind: "observation", id: String(i), data })), ...p.costs.map((data,i) => ({ kind: "cost", id: String(i), data })), ...p.objectives.map((data) => ({ kind: "claim", id: data.id, data }))];
      for (const item of items) await tx.unsafe("INSERT INTO fire.project_items(project_id,version,id,kind,data,publication_approved) VALUES($1,$2,$3,$4,$5::text::jsonb,true)", [p.id,p.version,item.id,item.kind,JSON.stringify(item.data)]);
    }
  });
  console.log(JSON.stringify({ published: projects.map((p) => p.id), version: projects[0]?.version }));
}
main().then(() => process.exit(0)).catch((e) => { console.error(e instanceof Error ? e.message : "Project publication failed"); process.exit(1); });
