import type { Metadata } from "next";
import { Suspense } from "react";
import FireAtlasSection from "@/components/oregon-fire/FireAtlasSection";
import FireEditorialShell from "@/components/oregon-fire/FireEditorialShell";
import FireGuide from "@/components/oregon-fire/FireGuide";
import FireStories from "@/components/oregon-fire/FireStories";
import FireComparison from "@/components/oregon-fire/FireComparison";
import FireDecisions from "@/components/oregon-fire/FireDecisions";
import { pageMeta } from "@/lib/page-meta";

export const dynamic = "force-dynamic";
export const metadata: Metadata = pageMeta({ title: "Oregon Fire Atlas: Burns, Wildfire History & Recent Scars", description: "Investigate Oregon’s documented burns, planned work, wildfire perimeters and recent scars. Filter records by place, year, agency and method, with source links.", path: "/oregon-fire/atlas" });

export default function FireAtlasPage() {
  return <FireEditorialShell
    className="fire-atlas-page"
    eyebrow="The records · burns, plans and wildfire history"
    title="The Oregon fire atlas"
    intro="Find a place, inspect documented work and compare it with wildfire history. The guide explains how to interpret the boundaries, observations and treatment records you see here."
    back={{ href: "/oregon-fire", label: "Read the illustrated guide" }}
    byline={false}
    navLabel="In the atlas"
    nav={[{ id: "find-place", label: "Find a place" }, { id: "explore", label: "The map" }, { id: "understand", label: "Four landscapes" }, { id: "fire-stories", label: "Three stories" }, { id: "through-time", label: "From orbit" }, { id: "burn-windows", label: "Why not burn more?" }, { id: "what-success-means", label: "What counts as success" }]}
  >
    <Suspense fallback={<div className="fire-atlas-loading"><p>Loading source coverage…</p></div>}><FireAtlasSection /></Suspense>
    <FireGuide /><FireStories /><FireComparison /><FireDecisions />
  </FireEditorialShell>;
}
