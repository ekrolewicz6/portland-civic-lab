import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projectById, publishedProjects } from "@/lib/oregon-fire/projects";
import FireEditorialShell from "@/components/oregon-fire/FireEditorialShell";
import ProjectDossier from "@/components/oregon-fire/ProjectDossier";
import { FIRE_AUTHORS, FIRE_URL } from "@/lib/oregon-fire/metadata";
export function generateStaticParams() { return publishedProjects().map((p) => ({ slug: p.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const p = projectById(slug); if (!p) return {};
  const url = `${FIRE_URL}/projects/${p.id}`;
  return { title: `${p.title} | Fire in Oregon`, description: p.summary, alternates: { canonical: url }, authors: FIRE_AUTHORS.map((name) => ({ name })), openGraph: { title: p.title, description: p.summary, url, images: ["https://www.portlandciviclab.org/api/oregon-fire/social"] }, twitter: { card: "summary_large_image", title: p.title, description: p.summary, images: ["https://www.portlandciviclab.org/api/oregon-fire/social"] } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const p = projectById(slug); if (!p) notFound();
  return <FireEditorialShell className="fire-project-page" eyebrow={`Project record / ${p.location}`} title={p.title} intro={p.summary} navLabel="Project chapters" nav={[["objectives", "The decision"], ["timeline", "The work"], ["outcomes", "The evidence"], ["costs", "The costs"], ["evidence", "The open record"]].map(([id, label], i) => ({ id, label, number: `0${i + 1}` }))}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.summary, url: `${FIRE_URL}/projects/${p.id}`, datePublished: "2026-09-26", dateModified: p.version, author: FIRE_AUTHORS.map((name) => ({ "@type": "Person", name })), citation: p.evidence.filter((e) => e.approved).map((e) => e.url) }).replace(/</g, "\\u003c") }} />
    <p className="fire-project-manager">Manager: {p.manager}. {p.geometryMeaning}</p><ProjectDossier project={p} />
  </FireEditorialShell>;
}
