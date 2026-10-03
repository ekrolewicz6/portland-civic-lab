import { ImageResponse } from "next/og";
import map from "@/lib/oregon-fire/og-map.json";

export const runtime = "edge";
export const alt = "Fire in Oregon: from a landscape plan to funded work and measured results";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [serifData, sansData] = await Promise.all([
    fetch(new URL("../../../../lib/oregon-fire/fonts/CormorantGaramond-Medium.ttf", import.meta.url)).then(r => r.arrayBuffer()),
    fetch(new URL("../../../../lib/oregon-fire/fonts/DMSans-Regular.ttf", import.meta.url)).then(r => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#203e30", color: "#f4f2e8", fontFamily: "DM Sans", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "44px 54px 0", fontSize: 16, letterSpacing: "0.15em", color: "#d5c49b" }}>
        <span>PORTLAND CIVIC LAB</span><span>FIRE IN OREGON / THE LANDSCAPE INVESTIGATION</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", margin: "76px 0 0 54px", width: 660, zIndex: 2 }}>
        <span style={{ fontSize: 17, letterSpacing: "0.18em", color: "#c69a66" }}>FOLLOW THE WORK</span>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Cormorant", fontSize: 80, lineHeight: 0.93, letterSpacing: "-0.035em", marginTop: 18 }}><span>A plan is only</span><span>the beginning.</span></div>
        <span style={{ fontSize: 25, lineHeight: 1.4, color: "#dce2d1", marginTop: 25 }}>What does it take to make an Oregon landscape more resilient?</span>
      </div>
      <svg width="460" height="420" viewBox="-10 -20 570 460" style={{ position: "absolute", right: 5, top: 125, opacity: 0.92 }}>
        <defs><clipPath id="oregon-landscape"><path d={map.path} /></clipPath></defs>
        <path d={map.path} fill="#315541" stroke="#c7b385" strokeWidth="3" />
        <g clipPath="url(#oregon-landscape)">
          {Array.from({ length: 15 }, (_, i) => <path key={i} d={`M-30 ${45 + i * 27} C80 ${-25 + i * 20},190 ${150 + i * 13},300 ${80 + i * 24} S460 ${180 + i * 15},610 ${80 + i * 27}`} fill="none" stroke={i % 3 === 0 ? "#c7b385" : "#88a783"} strokeWidth={i % 3 === 0 ? 2 : 1} opacity="0.58" />)}
        </g>
      </svg>
      <div style={{ display: "flex", position: "absolute", left: 54, right: 54, bottom: 55, borderTop: "1px solid #819781", paddingTop: 17, gap: 19, fontSize: 17, color: "#e9e4d3" }}>
        <span>DECISION</span><span style={{ color: "#c69a66" }}>→</span><span>FUNDING</span><span style={{ color: "#c69a66" }}>→</span><span>CREWS &amp; TIME</span><span style={{ color: "#c69a66" }}>→</span><span>RESULTS</span>
      </div>
    </div>,
    { ...size, fonts: [
      { name: "Cormorant", data: serifData, weight: 500, style: "normal" },
      { name: "DM Sans", data: sansData, weight: 400, style: "normal" },
    ] },
  );
}
