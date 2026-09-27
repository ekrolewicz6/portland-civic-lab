import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import FireLongGuide from "@/components/oregon-fire/FireLongGuide";
import FireAtlasSection from "@/components/oregon-fire/FireAtlasSection";
import { pageMeta } from "@/lib/page-meta";
import { FIRE_TITLE, FIRE_DESCRIPTION, FIRE_AUTHORS, fireStructuredData } from "@/lib/oregon-fire/metadata";
import "./fire.css";
import "./guide.css";
import "./editorial.css";
import "./long-guide.css";

const editorial = localFont({ src: "../../../lib/oregon-fire/fonts/CormorantGaramond-Medium.ttf", variable: "--font-editorial", weight: "500", display: "swap" });
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  ...pageMeta({ title: FIRE_TITLE, description: FIRE_DESCRIPTION, path: "/oregon-fire", type: "article" }),
  authors: FIRE_AUTHORS.map(name => ({ name })),
  keywords: ["Oregon fire", "Oregon fire map", "fire ecology", "prescribed fire", "wildfire history", "fire treatment effectiveness", "fire management costs", "Oregon fire education"],
};
export default async function OregonFirePage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const params=await searchParams;
  if(["story","stage","factor","goal","compare","landscape","season"].some(key=>params[key]!==undefined)) {
    const query=new URLSearchParams();
    for(const [key,value] of Object.entries(params)) {
      if(Array.isArray(value)) value.forEach(item=>query.append(key,item));
      else if(value!==undefined) query.set(key,value);
    }
    redirect(`/oregon-fire/atlas?${query}`);
  }
  return <article className={`fire-page fire-long-guide ${editorial.variable}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fireStructuredData).replace(/</g, "\\u003c") }} />
    <FireLongGuide />
    <Suspense fallback={<div className="fire-shell fire-atlas-loading"><h2>Explore the records</h2><p>Loading source coverage for the atlas… The guide above is ready to read.</p></div>}><FireAtlasSection /></Suspense>
  </article>;
}
