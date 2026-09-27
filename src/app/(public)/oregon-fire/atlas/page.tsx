import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import Link from "next/link";
import FireAtlasSection from "@/components/oregon-fire/FireAtlasSection";
import FireGuide from "@/components/oregon-fire/FireGuide";
import FireStories from "@/components/oregon-fire/FireStories";
import FireComparison from "@/components/oregon-fire/FireComparison";
import FireDecisions from "@/components/oregon-fire/FireDecisions";
import { pageMeta } from "@/lib/page-meta";
import "../fire.css";
import "../guide.css";
import "../editorial.css";
import "../long-guide.css";

const font=localFont({src:"../../../../lib/oregon-fire/fonts/CormorantGaramond-Medium.ttf",variable:"--font-editorial",weight:"500",display:"swap"});
export const dynamic="force-dynamic";
export const metadata:Metadata=pageMeta({title:"Oregon Fire Atlas: Burns, Wildfire History & Recent Scars",description:"Investigate Oregon’s documented burns, planned work, wildfire perimeters and recent scars. Filter records by place, year, agency and method, with source links.",path:"/oregon-fire/atlas"});
export default function FireAtlasPage(){return <article className={`fire-page ${font.variable}`}><header className="fire-atlas-hero"><Link href="/oregon-fire">← Read the illustrated guide</Link><h1>The Oregon fire atlas</h1><p>Find a place, inspect documented work and compare it with wildfire history. The guide explains how to interpret the boundaries, observations and treatment records you see here.</p></header><Suspense fallback={<div className="fire-shell"><p>Loading source coverage…</p></div>}><FireAtlasSection/></Suspense><div className="fire-shell"><FireGuide/><FireStories/><FireComparison/><FireDecisions/></div></article>}
