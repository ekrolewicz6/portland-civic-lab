import { z } from "zod";

const publicUrl = z.string().url().refine((url) => url.startsWith("https://"));
export const evidenceSchema = z.object({
  id: z.string(), title: z.string(), publisher: z.string(), url: publicUrl,
  locator: z.string(), publishedAt: z.string().nullable(), retrievedAt: z.string(),
  scope: z.string(), rights: z.string(), approved: z.boolean(),
});
export const projectSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), title: z.string(), location: z.string(),
  manager: z.string(), summary: z.string(), approved: z.boolean(), version: z.string(),
  review: z.string(), placeIds: z.array(z.string()), recordIds: z.array(z.string()),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  documentation: z.object({ unitGeometryVerified: z.boolean(), monitoringReportObtained: z.boolean() }),
  geometryMeaning: z.string(), objectives: z.array(z.object({
    id: z.string(), title: z.string(), text: z.string(), evidenceIds: z.array(z.string()),
  })),
  selection: z.string(), alternatives: z.string(),
  activities: z.array(z.object({
    id: z.string(), label: z.string(), date: z.string(),
    precision: z.enum(["day", "month", "year", "unknown"]),
    type: z.string(), status: z.string(), text: z.string(), evidenceIds: z.array(z.string()),
  })),
  outcomes: z.array(z.object({
    objective: z.string(), observation: z.string(), limitation: z.string(), evidenceIds: z.array(z.string()),
  })),
  costs: z.array(z.object({
    amount: z.number().nonnegative(), currency: z.literal("USD"), dollarYear: z.number().int().nullable(),
    scope: z.string(), basis: z.string(), reportedAt: z.string(),
    status: z.enum(["estimated-to-date", "projected-final", "final", "recorded-unit-cost"]),
    unit: z.string(), evidenceIds: z.array(z.string()), flags: z.array(z.string()),
  })),
  unknowns: z.array(z.string()), evidence: z.array(evidenceSchema),
}).superRefine((p, ctx) => {
  const ids = new Set(p.evidence.filter((e) => e.approved).map((e) => e.id));
  for (const item of [...p.objectives, ...p.activities, ...p.outcomes, ...p.costs]) {
    if (p.approved && (!item.evidenceIds.length || item.evidenceIds.some((id) => !ids.has(id))))
      ctx.addIssue({ code: "custom", message: "Published project contains unsupported evidence references" });
  }
});
export type FireProject = z.infer<typeof projectSchema>;

const retrievedAt = "2026-09-26";
const woodpecker = projectSchema.parse({
  id: "woodpecker", title: "Woodpecker: two units, two restoration goals",
  location: "McDonald-Dunn Research Forest · near Corvallis", manager: "Oregon State University Research Forests",
  summary: "A documented example of choosing a burn for a particular place. OSU’s published account explains the objectives; unit maps and long-term monitoring remain acquisition needs.",
  approved: true, version: retrievedAt, review: "Editorial source check completed September 26, 2026. Independent ecological review pending.",
  placeIds: ["4115800"], recordIds: [], bbox: [-123.5, 44.5, -123.15, 44.85],
  documentation: { unitGeometryVerified: false, monitoringReportObtained: false },
  geometryMeaning: "Regional context only. No verified burn-unit geometry; no project pin or burned footprint is shown.",
  objectives: [
    { id: "oak", title: "Oak & madrone", text: "One unit was selected to release Oregon white oak and Pacific madrone.", evidenceIds: ["osu-woodpecker"] },
    { id: "pine", title: "Valley ponderosa pine", text: "The other unit supported a stand of Willamette Valley ponderosa pine.", evidenceIds: ["osu-woodpecker"] },
  ],
  selection: "OSU identifies restoration potential as the reason these two units were chosen. Their different vegetation objectives make site selection concrete.",
  alternatives: "A comparative decision document has not been obtained. We cannot reconstruct which alternatives were formally considered or rejected.",
  activities: [
    { id: "prepare", label: "Prepare", date: "Before October 2025", precision: "unknown", type: "Preparation", status: "Described by OSU", text: "Students developed plans; forest staff communicated with nearby residents.", evidenceIds: ["osu-woodpecker"] },
    { id: "burn", label: "Burn", date: "October 2025", precision: "month", type: "Prescribed fire", status: "Burn described in published account", text: "Two units burned. The account describes damp fuels and patchy effects.", evidenceIds: ["osu-woodpecker"] },
  ],
  outcomes: [{ objective: "Support the intended vegetation", observation: "OSU reports implementation and describes the initial effects.", limitation: "Repeated vegetation measurements have not been obtained. This is an implementation account, not a long-term outcome assessment.", evidenceIds: ["osu-woodpecker"] }],
  costs: [], unknowns: ["Verified unit boundaries", "Burn plans and permit identifiers", "Actual burned acreage and ignition dates", "Repeated vegetation measurements", "Itemized costs and funding", "Documented alternatives"],
  evidence: [{ id: "osu-woodpecker", title: "Fire on purpose: learning, restoration and the Woodpecker Harvest", publisher: "OSU College of Forestry", url: "https://www.forestry.oregonstate.edu/news/fire-purpose", locator: "Site selection, planning, and implementation paragraphs", publishedAt: "2026-04-03", retrievedAt, scope: "Two Woodpecker units, October 2025; not all McDonald-Dunn treatments", rights: "Link and paraphrase only; photographs not cleared for reuse", approved: true }],
});
// Only independently public, explicitly approved material belongs here.
export const PUBLIC_PROJECTS: FireProject[] = [woodpecker];
export function publishedProjects(projects = PUBLIC_PROJECTS) {
  return projects.filter((p) => p.approved).map((p) => projectSchema.parse(p)).map((p) => ({ ...p, evidence: p.evidence.filter((e) => e.approved) }));
}
export function projectById(id: string) {
  return publishedProjects().find((p) => p.id === id) ?? null;
}
export function projectsForRecord(id: string) {
  return publishedProjects().filter((p) => p.recordIds.includes(id));
}
export function documentationCoverage(projects = publishedProjects()) {
  return { denominator: projects.length, purpose: projects.filter((p) => p.objectives.length).length,
    verifiedGeometry: projects.filter((p) => p.documentation.unitGeometryVerified).length, monitoring: projects.filter((p) => p.documentation.monitoringReportObtained).length, version: retrievedAt,
    meaning: "Reviewed project documentation coverage; not statewide burn coverage or ecological success." };
}
export function placeContext(id: string) {
  const profiles: Record<string, { name: string; description: string; links: { title: string; url: string }[] }> = {
    "4115800": { name: "Corvallis", description: "Woodpecker and the Finley refuge story offer different examples in the surrounding Willamette Valley. This profile does not classify vegetation at a town reference point.", links: [{ title: "Finley refuge management", url: "https://www.fws.gov/refuge/william-l-finley/what-we-do" }] },
    "4109800": { name: "Burns", description: "The Egley study examines a wildfire and earlier treatments in the Malheur National Forest region. The study boundary is separate from the community and today’s source records.", links: [{ title: "Egley field and satellite study", url: "https://research.fs.usda.gov/treesearch/59149" }] },
  };
  return { geoid: id, profile: profiles[id] ?? null, projects: publishedProjects().filter((p) => p.placeIds.includes(id)),
    version: retrievedAt, coverage: "Curated public-document context. Vegetation, watershed, smoke and community-plan summaries await verified spatial inputs." };
}
