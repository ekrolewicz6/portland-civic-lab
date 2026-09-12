import { ImageResponse } from "next/og";
import map from "@/lib/oregon-fire/og-map.json";
import { FIRE_AUTHORS } from "@/lib/oregon-fire/metadata";

export const runtime = "edge";
export const alt =
  "Fire in Oregon — an atlas of prescribed burns, wildfire history, and the reasons behind them. An Oregon silhouette in forest green and warm gold.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const serif = fetch(
  new URL("../../../lib/oregon-fire/fonts/CormorantGaramond-Medium.ttf", import.meta.url),
).then((r) => r.arrayBuffer());
const sans = fetch(
  new URL("../../../lib/oregon-fire/fonts/DMSans-Regular.ttf", import.meta.url),
).then((r) => r.arrayBuffer());

export default async function Image() {
  const [serifData, sansData] = await Promise.all([serif, sans]);
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#f4f2e8", color: "#173c30", fontFamily: "DM Sans", position: "relative" }}>
      <div style={{ position: "absolute", left: 642, top: 0, bottom: 0, width: 558, display: "flex", background: "#173c30" }} />
      <div style={{ display: "flex", flexDirection: "column", width: 642, padding: "48px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 17, letterSpacing: "0.14em" }}>
          <svg width="22" height="28" viewBox="0 0 24 32"><path d="M13 1C15 10 3 10 3 21a9 9 0 0 0 18 0c0-6-5-9-5-13 0 6-4 7-4 10C5 12 17 9 13 1Z" fill="#b97540" /></svg>
          PORTLAND CIVIC LAB
        </div>
        <div style={{ display: "flex", marginTop: 40, color: "#738264", fontSize: 15, letterSpacing: "0.22em" }}>A LIVING ATLAS</div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Cormorant", fontSize: 113, lineHeight: 0.9, letterSpacing: "-0.045em", marginTop: 17 }}>
          <span>Fire in</span><span>Oregon</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 25, lineHeight: 1.4, marginTop: 29, color: "#52634e" }}>
          <span>Prescribed burns. Wildfire history.</span>
          <span>The reasons behind them.</span>
        </div>
        <div style={{ position: "absolute", left: 56, top: 531, width: 530, height: 1, background: "#cbd0bd" }} />
        <div style={{ position: "absolute", left: 56, top: 550, display: "flex", flexDirection: "column", fontSize: 17, lineHeight: 1.4, color: "#52634e" }}>
          <span>Co-authors</span>
          <span>{FIRE_AUTHORS.join(" · ")}</span>
        </div>
      </div>
      <div style={{ position: "absolute", right: 44, top: 51, display: "flex", fontSize: 14, letterSpacing: "0.18em", color: "#b7c4a1" }}>WHERE IT HAPPENS. WHY IT MATTERS.</div>
      {/* Census-derived outline. Interior lines are decorative, not terrain or burn data. */}
      <svg width="500" height="440" viewBox="-10 -20 570 460" style={{ position: "absolute", left: 666, top: 113 }}>
        <defs><clipPath id="oregon"><path d={map.path} /></clipPath></defs>
        <path d={map.path} fill="#2d5140" stroke="#b6c5a0" strokeWidth="2" />
        <g clipPath="url(#oregon)">
          {Array.from({ length: 17 }, (_, i) => (
            <path key={i} d={`M-50 ${30 + i * 26} C80 ${-70 + i * 22},115 ${140 + i * 18},235 ${70 + i * 24} S390 ${200 + i * 19},600 ${80 + i * 26}`} fill="none" stroke={i % 4 === 0 ? "#bea773" : "#88a582"} strokeWidth={i % 4 === 0 ? 1.5 : 0.8} opacity="0.55" />
          ))}
        </g>
        <path d={map.path} fill="none" stroke="#d1bb86" strokeWidth="2" />
      </svg>
      <div style={{ position: "absolute", left: 688, bottom: 44, display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ color: "#b7c4a1", fontSize: 14, letterSpacing: "0.16em" }}>PUBLIC RECORDS. SHARED LANDSCAPE.</span>
        <span style={{ color: "#f0e4c7", fontSize: 19 }}>portlandciviclab.org/oregon-fire</span>
      </div>
    </div>,
    { ...size, fonts: [
      { name: "Cormorant", data: serifData, weight: 500, style: "normal" },
      { name: "DM Sans", data: sansData, weight: 400, style: "normal" },
    ] },
  );
}
