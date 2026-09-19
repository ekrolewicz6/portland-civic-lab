import logo from "@/lib/og-logo.json";
import { ImageResponse } from "next/og";
import type { ReactElement } from "react";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const EMBER = "#c8956c";
export interface OgStat { value: string; label: string }
export interface OgProps {
  eyebrow: string;
  headline: string;
  description?: string;
  stats?: OgStat[];
  accent?: string;
  footerLeft?: string;
  motif?: "city" | "data" | "research" | "people" | "places";
}
type Fonts = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"];

/** The optional fonts argument lets Node image routes use local file buffers. */
export async function ogImage(props: OgProps, fonts?: Fonts) {
  if (!fonts) {
    const [serif, sans] = await Promise.all([
      fetch(new URL("./oregon-fire/fonts/CormorantGaramond-Medium.ttf", import.meta.url)).then(r => r.arrayBuffer()),
      fetch(new URL("./oregon-fire/fonts/DMSans-Regular.ttf", import.meta.url)).then(r => r.arrayBuffer()),
    ]);
    fonts = [
      { name: "Cormorant", data: serif, weight: 500, style: "normal" },
      { name: "DM Sans", data: sans, weight: 400, style: "normal" },
    ];
  }
  return new ImageResponse(ogFrame(props), { ...OG_SIZE, fonts });
}

/** Decorative line art, not a chart or a geographic map. */
function Illustration({ motif, accent }: { motif: NonNullable<OgProps["motif"]>; accent: string }) {
  return <svg width="330" height="355" viewBox="0 0 330 355">
    <circle cx="165" cy="166" r="143" fill="none" stroke="#68826b" strokeWidth="1" />
    {motif === "city" ? <g fill="none" strokeLinecap="round">
      <circle cx="236" cy="88" r="29" fill={accent} stroke="none" />
      <path d="M21 267 Q85 246 150 267 T312 267 M18 283 Q85 262 150 283 T315 283 M38 299 Q105 279 173 299 T290 299" stroke="#7d9b86" strokeWidth="2" />
      <path d="M25 222H305 M25 231H305 M78 222V103H96V222 M232 222V103H250V222 M90 112Q165 225 240 112 M25 190Q57 178 86 112 M244 112Q275 176 305 190" stroke="#f1e7d4" strokeWidth="3" />
      {[112,138,164,190,216].map((x,i)=><path key={x} d={`M${x} ${[144,164,172,164,144][i]}V220`} stroke="#f1e7d4" strokeWidth="1.5" />)}
      <path d="M47 102L63 93L79 102 M121 75L133 68L145 75" stroke={accent} strokeWidth="2" />
    </g> : motif === "data" ? <g>
      {[0,1,2].map((i)=><g key={i} transform={`translate(${48+i*12} ${66+i*72})`}>
        <rect width="218" height="62" rx="11" fill="#254d3d" stroke={i===1?accent:"#8ca28b"} strokeWidth="1.5" />
        <circle cx="29" cy="31" r="10" fill={i===1?accent:"#b8c7aa"} />
        <path d="M54 23H184M54 39H142" stroke="#e1e5d3" strokeWidth="3" strokeLinecap="round" />
      </g>)}
    </g> : motif === "research" ? <g fill="none" stroke="#e7e4d3" strokeWidth="2">
      <rect x="56" y="53" width="175" height="222" rx="8" transform="rotate(-9 144 164)" stroke="#78997e" />
      <rect x="77" y="64" width="175" height="222" rx="8" fill="#254d3d" />
      <path d="M101 97H214M101 119H197M101 154H224M101 176H212M101 198H178M101 220H149" strokeWidth="3" strokeLinecap="round" />
      <circle cx="224" cy="244" r="43" fill="#173c30" stroke={accent} strokeWidth="3" /><path d="M254 275L283 306" stroke={accent} strokeWidth="8" strokeLinecap="round" />
    </g> : motif === "people" ? <g fill="#254d3d" stroke="#d4dfca" strokeWidth="2">
      <path d="M165 167L80 91M165 167L250 91M165 167L65 244M165 167L265 244M165 167V300" stroke="#76937b" />
      {[[80,91],[250,91],[65,244],[265,244],[165,291]].map(([x,y])=><g key={x+":"+y}><circle cx={x} cy={y} r="28" /><circle cx={x} cy={y-6} r="7" fill="#d4dfca" stroke="none" /><path d={`M${x-13} ${y+14}Q${x} ${y-3} ${x+13} ${y+14}`} /></g>)}
      <circle cx="165" cy="166" r="43" fill="#173c30" stroke={accent} /><path d="M144 164L160 180L189 150" fill="none" stroke={accent} strokeWidth="3" />
    </g> : <g fill="none" strokeWidth="2">
      <path d="M51 96L143 53L276 103V251L182 301L51 254Z" stroke="#b8c9b0" />
      <path d="M143 53V201L51 254M143 201L276 251M182 78V226L90 277M51 147L182 198L276 150M51 199L182 249L276 201" stroke="#779a81" />
      <path d="M108 134L155 111L199 129V183L152 207L108 188Z" fill="#315b44" stroke={accent} strokeWidth="2.5" />
      <path d="M108 134L152 152L199 129M152 152V207" stroke={accent} />
      <circle cx="240" cy="91" r="16" fill={accent} stroke="none" />
    </g>}
  </svg>;
}

export function ogFrame({ eyebrow, headline, description, stats, accent = EMBER, footerLeft = "Public knowledge. A stronger city.", motif }: OgProps): ReactElement {
  const key = eyebrow.toLowerCase();
  const art = motif ?? (/data|dashboard|budget|pension|money|tax|performance/.test(key) ? "data" : /property|housing|venue|timber|development|commercial/.test(key) ? "places" : /about|support|volunteer|government|institution|business|contact|independence/.test(key) ? "people" : "research");
  // Reserve a stable reading area above the description. Estimate word wrapping
  // conservatively so a long word cannot push the title into the next block.
  const headlineSize = [96, 84, 76, 70, 64, 58, 52].find(size => {
    let lines = 1, used = 0;
    for (const word of headline.split(/\s+/)) {
      const width = word.length * size * .52;
      if (used && used + size * .26 + width > 670) { lines++; used = width; }
      else used += (used ? size * .26 : 0) + width;
    }
    return lines * size * 1.05 <= 224;
  }) ?? 52;
  return <div style={{ display: "flex", width: "100%", height: "100%", background: "#f5f1e7", color: "#173c30", fontFamily: "DM Sans", position: "relative" }}>
    <div style={{ display: "flex", flexDirection: "column", width: 790, padding: "46px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24 }}>
        {/* Satori renders embedded image data directly. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" width={45} height={45} />Portland Civic Lab
      </div>
      <div style={{ display: "flex", fontSize: eyebrow.length > 40 ? 17 : 20, letterSpacing: ".09em", color: "#56664e", marginTop: 37, textTransform: "uppercase" }}>{eyebrow}</div>
      <div style={{ display: "flex", marginTop: 22, fontFamily: "Cormorant", fontSize: headlineSize, lineHeight: .98, letterSpacing: "-.035em", maxWidth: 675 }}>{headline}</div>
      {stats?.length ? <div style={{ display: "flex", position: "absolute", top: 437, left: 60, width: 670, gap: 28 }}>
        {stats.slice(0,3).map((stat)=><div key={stat.label} style={{ display: "flex", flexDirection: "column", flex: 1 }}><span style={{ fontSize: stat.value.length>10?29:39, color: "#173c30" }}>{stat.value}</span><span style={{ fontSize: 16, lineHeight: 1.3, marginTop: 6, color: "#596751" }}>{stat.label}</span></div>)}
      </div> : description ? <div style={{ display: "flex", position: "absolute", top: 431, left: 60, width: 668, fontSize: 22, lineHeight: 1.3, color: "#50614e" }}>{description}</div> : null}
      <div style={{ display: "flex", position: "absolute", left: 60, bottom: 39, width: 670, paddingTop: 18, borderTop: "1px solid #bcc6b4", fontSize: 17, color: "#52654e" }}>{footerLeft}</div>
    </div>
    <div style={{ display: "flex", width: 410, height: "100%", background: "#173c30", position: "relative", alignItems: "center", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", position: "absolute", left: 27, right: 27, top: 28, bottom: 28, border: "1px solid #58775d", borderRadius: "180px 180px 0 0" }} />
      <div style={{ display: "flex", marginTop: 120 }}><Illustration motif={art} accent={accent} /></div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "absolute", bottom: 63, color: "#d4dfc9", fontSize: 18, gap: 13 }}><span>Understand. Explore. Participate.</span><span style={{ fontSize: 17, color: "#d1b286" }}>portlandciviclab.org</span></div>
    </div>
  </div>;
}
