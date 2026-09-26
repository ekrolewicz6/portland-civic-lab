import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { FIRE_AUTHORS } from "@/lib/oregon-fire/metadata";
export const runtime = "nodejs";
export const alt = "Why burn this place? Follow the objective, the work, and the evidence. Fire in Oregon, Portland Civic Lab.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  const font = await readFile(join(process.cwd(), "src/lib/oregon-fire/fonts/CormorantGaramond-Medium.ttf"));
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: "#203e30", color: "#f4f2e8", padding: "56px", position: "relative", flexDirection: "column" }}>
    <div style={{ display: "flex", fontSize: 20, letterSpacing: "0.16em", color: "#ceba88" }}>FIRE IN OREGON / PORTLAND CIVIC LAB</div>
    <div style={{ display: "flex", fontFamily: "Editorial", fontSize: 106, lineHeight: 1.02, maxWidth: 880, marginTop: 44 }}>Why burn this place?</div>
    <div style={{ display: "flex", fontSize: 28, color: "#d6ddc7", marginTop: 24 }}>Follow the objective. The work. The evidence.</div>
    <div style={{ display: "flex", gap: 14, marginTop: 42 }}>{["PLACE", "CHOICES", "WORK", "OUTCOMES"].map((label,i) => <div key={label} style={{ display: "flex", borderTop: "2px solid #ceba88", paddingTop: 16, width: 245, fontSize: 19, color: "#d6ddc7" }}>{`0${i+1} / ${label}`}</div>)}</div>
    <div style={{ display: "flex", position: "absolute", bottom: 42, left: 56, fontSize: 19, color: "#ceba88" }}>{FIRE_AUTHORS.join(" · ")}</div>
  </div>, { ...size, fonts: [{ name: "Editorial", data: font, weight: 500, style: "normal" }] });
}
