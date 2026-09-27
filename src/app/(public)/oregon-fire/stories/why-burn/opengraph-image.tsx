import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { FIRE_AUTHORS } from "@/lib/oregon-fire/metadata";
export const runtime = "nodejs";
export const alt = "Why burn this place? How fire moves, why we burn, and what it costs. Fire in Oregon, Portland Civic Lab.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  const font = await readFile(join(process.cwd(), "src/lib/oregon-fire/fonts/CormorantGaramond-Medium.ttf"));
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: "#203e30", color: "#f4f2e8", padding: "56px", position: "relative", flexDirection: "column" }}>
    <div style={{ display: "flex", fontSize: 20, letterSpacing: "0.16em", color: "#ceba88" }}>FIRE IN OREGON / PORTLAND CIVIC LAB</div>
    <div style={{ display: "flex", fontFamily: "Editorial", fontSize: 106, lineHeight: 1.02, maxWidth: 720, marginTop: 44 }}>Why burn this place?</div>
    <div style={{ display: "flex", fontSize: 28, color: "#d6ddc7", marginTop: 24 }}>How fire moves. Why we burn. What it costs.</div>
    <svg width="250" height="260" viewBox="0 0 250 260" style={{ position: "absolute", right: 65, top: 118 }}>
      <circle cx="191" cy="51" r="30" fill="#3a5640" />
      <path d="M0 236Q95 210 250 232V260H0Z" fill="#3c5943" />
      <path d="M61 123L58 235H76L72 123M173 127L171 235H188L184 127" fill="#b3956a" />
      <path d="M67 8L34 67L46 65L22 106L40 103L10 154Q66 168 124 154L94 103L111 107L88 65L100 69Z" fill="#81986b" />
      <path d="M178 34L151 85L162 82L142 118L155 115L130 159Q178 173 227 159L201 115L215 118L195 82L204 85Z" fill="#a5b58a" />
      <path d="M120 246C97 233 116 221 117 209C129 218 124 225 137 229C151 240 136 251 120 246Z" fill="#d99c50" />
      <path d="M93 247C76 237 87 229 89 221C99 231 98 236 107 239C111 247 104 251 93 247Z" fill="#bf7741" />
    </svg>
    <div style={{ display: "flex", gap: 14, marginTop: 42 }}>{["FIRE", "WHY HERE?", "COSTS", "RESULTS"].map((label,i) => <div key={label} style={{ display: "flex", borderTop: "2px solid #ceba88", paddingTop: 16, width: 245, fontSize: 19, color: "#d6ddc7" }}>{`0${i+1} / ${label}`}</div>)}</div>
    <div style={{ display: "flex", position: "absolute", bottom: 42, left: 56, fontSize: 19, color: "#ceba88" }}>{FIRE_AUTHORS.join(" · ")}</div>
  </div>, { ...size, fonts: [{ name: "Editorial", data: font, weight: 500, style: "normal" }] });
}
