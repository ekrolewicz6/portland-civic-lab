import { ImageResponse } from "next/og";
import logo from "@/lib/og-logo.json";
import { guideCards, type GuideCard } from "@/lib/voters-guide/metadata";

export const runtime = "edge";

export async function GET(_request: Request, { params }: { params: Promise<{ card: string }> }) {
  const { card } = await params;
  if (!Object.hasOwn(guideCards, card)) return new Response("Image not found", { status: 404 });
  const data = guideCards[card as GuideCard];
  const [serif, sans] = await Promise.all([
    fetch(new URL("../../../../../lib/oregon-fire/fonts/CormorantGaramond-Medium.ttf", import.meta.url)).then(r => r.arrayBuffer()),
    fetch(new URL("../../../../../lib/oregon-fire/fonts/DMSans-Regular.ttf", import.meta.url)).then(r => r.arrayBuffer()),
  ]);
  const green = "#173c30", cream = "#f5f1e7", gold = "#d2aa76";
  const supporting = card === "standards" ? ["Fair to candidates.", "Accountable to the evidence."]
    : card === "research" ? ["Follow the evidence.", "See what changed."]
    : ["Compare candidates.", "Understand their choices."];
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: cream, color: green, fontFamily: "DM Sans", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", width: 800, padding: "46px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24 }}>
          {/* Embedded brand asset, not a remote fetch. Satori requires native img. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={45} height={45} alt="" />
          Portland Civic Lab
        </div>
        <div style={{ display: "flex", fontSize: 20, letterSpacing: "0.1em", marginTop: 40, color: "#52634e" }}>{data.eyebrow}</div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Cormorant", fontSize: 112, lineHeight: 0.93, letterSpacing: "-0.045em", marginTop: 18 }}>
          <span>Portland</span><span>Voter Guide</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 25, fontSize: 29, lineHeight: 1.35, color: "#40594b" }}>
          {supporting.map(line => <span key={line}>{line}</span>)}
        </div>
        <div style={{ position: "absolute", display: "flex", left: 60, bottom: 43, width: 675, paddingTop: 20, borderTop: "1px solid #bac3b2", alignItems: "center", justifyContent: "space-between", fontSize: 21 }}>
          <span>NOVEMBER 3, 2026</span><span style={{ color: "#52634e" }}>Free & nonpartisan</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 400, height: "100%", background: green, color: cream, alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 28, right: 28, bottom: 28, left: 28, border: "1px solid #56735b", borderRadius: "180px 180px 0 0" }} />
        {data.district ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <span style={{ marginTop: 110, fontSize: 23, letterSpacing: "0.18em", color: gold }}>DISTRICT</span>
          <span style={{ fontFamily: "Cormorant", fontSize: 260, lineHeight: 1, marginTop: -42, transform: data.district === "3" ? "translateY(-60px)" : "translateY(0px)" }}>{data.district}</span>
          <span style={{ fontSize: 25, marginTop: 22, color: gold }}>Three seats. Your say.</span>
        </div> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ marginTop: 106 }}><rect x="5" y="5" width="54" height="54" rx="6" fill="none" stroke={gold} strokeWidth="2"/><path d="M18 31L28 41L47 21" fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Cormorant", fontSize: 62, lineHeight: 1.05, marginTop: 31 }}><span>Your city.</span><span>Your choice.</span></div>
          <span style={{ fontSize: 23, marginTop: 30, color: gold }}>Election 2026</span>
        </div>}
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", bottom: 57, fontSize: 19, lineHeight: 1.5, color: "#d2ddc8" }}>
          <span>Plans · Experience · Record</span>
          <span style={{ marginTop: 18, fontSize: 17 }}>portlandciviclab.org</span>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630, fonts: [
      { name: "Cormorant", data: serif, weight: 500, style: "normal" },
      { name: "DM Sans", data: sans, weight: 400, style: "normal" },
    ], headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000" } },
  );
}
