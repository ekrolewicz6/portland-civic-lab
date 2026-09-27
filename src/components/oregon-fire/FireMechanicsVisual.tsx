function Pine({ x, y = 62, scale = 1, pale = false }: { x: number; y?: number; scale?: number; pale?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-7 110 L-10 190 L10 190 L6 110Z" fill="#80604a" />
    <path d="M0 0 L-37 71 L-23 67 L-52 111 L-29 106 L-64 149 Q0 164 64 149 L29 106 L52 111 L23 67 L37 71Z" fill={pale ? "#6b8060" : "#284d3c"} />
    <path d="M0 4 L0 144 L31 150 L19 108 L34 112 L16 68 L24 73Z" fill={pale ? "#7e906e" : "#3c6550"} />
  </g>;
}
function Flame({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M0 0 C-18-11-15-25-9-34 C-8-24-1-23-2-37 C-1-49 9-56 10-67 C26-49 15-39 23-30 C36-14 21 1 0 0Z" fill="#c87539" /><path d="M6-3 C-5-9 0-20 7-29 C6-17 20-16 15-7Z" fill="#e9b45c" /></g>;
}
function Scene({ dense }: { dense: boolean }) {
  return <svg viewBox="0 0 480 300" role="img" aria-label={dense ? "Dry forest diagram: small trees and shrubs connect flames on the ground to higher branches." : "Dry forest diagram: fewer small trees leave a gap between low flames and taller tree crowns."}>
    <rect width="480" height="300" fill={dense ? "#e9e4d7" : "#e6eadc"} />
    <circle cx="390" cy="65" r="38" fill="#d6d8be" />
    <path d="M0 150Q95 90 175 145T340 132T480 144V300H0Z" fill="#d0d8c4" />
    <path d="M0 259 Q130 245 240 261 T480 251 V300H0Z" fill="#b6bea3" />
    <Pine x={110} y={30} scale={1.15} /><Pine x={340} y={55} scale={1.04} pale />
    {dense ? <><Pine x={192} y={133} scale={.61} pale /><Pine x={265} y={119} scale={.72} /><Pine x={395} y={170} scale={.45} /><Pine x={58} y={184} scale={.37} /></> : <Pine x={407} y={224} scale={.2} pale />}
    <path d={dense ? "M15 272q17-32 35-4q18-42 41-5q22-30 40 5q23-47 45-4q16-28 38 6q19-38 46-9q20-35 37 7q17-29 42 2q23-45 45-8q23-29 48 7" : "M20 272q10-15 25-3m137 0q10-14 23 0m197 0q10-13 21-1"} fill="none" stroke="#667956" strokeWidth="8" strokeLinecap="round" />
    <path d="M16 278L44 280M72 276l22 4m49-4l30 3m61-1l31 2m57-3l23 3m67-4l29 4" stroke="#8b7152" strokeWidth="3" strokeLinecap="round" />
    {dense ? <><Flame x={170} y={275} scale={.9} /><Flame x={251} y={247} scale={1.35} /><Flame x={291} y={184} scale={1.25} /><path d="M232 270C221 239 219 211 235 183S277 151 304 119" stroke="#b25d32" strokeWidth="3" strokeDasharray="5 6" fill="none" /><path d="M293 120l13-4-3 14" fill="none" stroke="#b25d32" strokeWidth="3" /></> : <><Flame x={163} y={280} scale={.5} /><Flame x={223} y={281} scale={.4} /><Flame x={271} y={279} scale={.5} /><path d="M217 207V160M208 165l9-9 9 9M208 202l9 9 9-9" stroke="#53684c" strokeWidth="2" fill="none" strokeLinecap="round" /></>}
  </svg>;
}
export default function FireMechanicsVisual() {
  return <figure className="fire-mechanics">
    <div className="fire-mechanics-pair">
      <div><span className="fire-visual-label">More connected fuel</span><Scene dense /><h3>Flames have a path upward.</h3><p>Shrubs and small trees can carry fire into higher branches. These are called <strong>ladder fuels</strong>.</p></div>
      <div><span className="fire-visual-label">Fewer connections</span><Scene dense={false} /><h3>More space below the crowns.</h3><p>Removing some small trees and burning surface fuel can reduce that path. Keeping flames low still depends on the conditions.</p></div>
    </div>
    <figcaption>Wind, slope, and fuel moisture also affect fire behavior. <a href="https://extension.oregonstate.edu/catalog/em-9341-fire-behavior">How fire behaves: OSU Extension ↗</a></figcaption>
  </figure>;
}
export function HabitatTree({ kind }: { kind: "oak" | "pine" }) {
  return <svg viewBox="0 0 320 230" role="img" aria-label={kind === "oak" ? "Illustration of an oak with a broad spreading crown" : "Illustration of a ponderosa pine with space beneath its crown"}>
    <rect width="320" height="230" fill={kind === "oak" ? "#e2e7d3" : "#e8e2d5"} />
    <circle cx="254" cy="49" r="28" fill="#cfceb0" />
    <path d="M0 203Q90 180 185 197T320 195V230H0Z" fill="#b6bea3" />
    {kind === "oak" ? <><path d="M145 202L150 117L113 89M153 148l46-65M150 164l-48-41" fill="none" stroke="#80604a" strokeWidth="13" /><path d="M87 126C41 122 34 80 67 65C49 23 104 7 128 33C157 6 203 14 211 50C259 43 273 99 231 116C225 144 176 152 157 127C137 153 102 150 87 126Z" fill="#60754a" /><path d="M77 82Q144 37 209 78Q172 107 135 113" fill="#778852" /></> : <Pine x={162} y={14} scale={.99} />}
    <path d="M28 207l5-14 6 14m54-3l5-13 4 13m126 1l5-15 5 15m31 0l5-10 3 10" fill="none" stroke="#738057" strokeWidth="2" />
  </svg>;
}
