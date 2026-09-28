import Image from "next/image";
import { HabitatTree } from "./FireMechanicsVisual";
import LandscapeIllustration from "./LandscapeIllustration";
import { LESSON_SOURCES, TREATMENT_REVIEW } from "@/lib/oregon-fire/lesson";

export function GuidePanorama() {
  return <svg viewBox="0 0 1200 360" role="img" aria-label="Illustrated Oregon landscapes: mountain forests, open woodland, prairie and a community">
    <rect width="1200" height="360" fill="#203e30" />
    <circle cx="925" cy="80" r="45" fill="#d6b97b" />
    <path d="M0 206 156 85 242 141 388 30 528 180 670 110 800 204 974 169 1200 229V360H0Z" fill="#47634f" />
    <path d="m324 87 64-57 67 72-39-13-25-27-30 40Z" fill="#d9deca" />
    <path d="M0 270Q180 151 370 243T736 243T1200 237V360H0Z" fill="#678064" />
    <path d="M0 299Q140 227 327 296T698 289T1200 289V360H0Z" fill="#8d9871" />
    {[40,95,150,216,280,410,485,550].map((x,i) => <g key={x} transform={`translate(${x} ${175+(i%3)*17})`}><path d="M0 10V120" stroke="#ab8962" strokeWidth="7" /><path d={`M0 ${i%2?-25:-45} -36 47 -22 43 -47 85 47 85 22 43 36 47Z`} fill={i%2?"#214434":"#2c503b"} /><path d="M0-35 0 78 27 84 12 43 25 47Z" fill="#3d6146" /></g>)}
    <g transform="translate(750 260)"><path d="M0 55V-10M0 20l-28-35m28 40 30-36" stroke="#8b6747" strokeWidth="9" /><ellipse cx="0" cy="-25" rx="62" ry="34" fill="#395b40" /><ellipse cx="-23" cy="-37" rx="32" ry="30" fill="#526e45" /></g>
    <path d="M937 291V243l42-27 44 27v48Z" fill="#e5d9bb" /><path d="m927 248 52-38 56 38" fill="none" stroke="#765c43" strokeWidth="8" /><path d="M968 291v-30h20v30" fill="#436552" />
    <path d="M1068 295v-38l30-20 32 20v38Z" fill="#c9c9a5" /><path d="m1060 259 38-28 40 28" fill="none" stroke="#765c43" strokeWidth="6" />
    {Array.from({length:24},(_,i)=><path key={i} d={`M${575+i*25} ${328+(i%3)*7}v-15m0 9-6-9m6 9 6-7`} stroke="#dbcea0" fill="none" strokeWidth="2" />)}
    <path d="M0 345Q350 328 650 348T1200 341V360H0Z" fill="#294a38" />
  </svg>;
}

const landscapeExamples = [
  { kind:"pine", name:"Dry pine forests", question:"Keep large trees", text:"Lower surface fire can leave big trees standing. Connected fuels may carry flames upward." },
  { kind:"wet", name:"Western forests", question:"Read the local history", text:"Some places burned often; others seldom did. Moisture and terrain make a difference." },
  { kind:"oak", name:"Oak & prairie", question:"Keep habitat open", text:"Fire can hold back woody plants. More trees would not always be a better outcome." },
  { kind:"sage", name:"Sagebrush", question:"Watch repeated fire", text:"Invasive annual grasses can feed more frequent fire and alter habitat." },
];
export function LandscapeOverview() {
  return <figure className="fire-landscape-overview"><div className="fire-landscape-strip">{landscapeExamples.map((l,i)=><div key={l.kind}><LandscapeIllustration kind={l.kind} /><span className="fire-landscape-number">{String(i+1).padStart(2,"0")} / {l.question}</span><h3>{l.name}</h3><p>{l.text}</p></div>)}</div><figcaption>Four starting points. The right goal depends on the vegetation, history and people at the actual place.</figcaption></figure>;
}

export function HistoryVisual() {
  return <figure className="fire-history-visual">
    <div className="fire-tree-rings"><svg viewBox="0 0 360 360" role="img" aria-label="Illustrated tree cross-section with growth rings and a fire scar; tree rings can provide dated evidence of past fire">
      <path d="M174 19C275 9 340 90 335 182C346 270 272 344 174 335C79 345 13 269 23 172C11 81 80 15 174 19Z" fill="#d5b98a" stroke="#86664b" strokeWidth="12" />
      {[145,127,110,91,74,59,43,26].map((r,i)=><ellipse key={r} cx="177" cy="177" rx={r} ry={r*.96} fill="none" stroke={i%2?"#9a7c56":"#b79562"} strokeWidth="2" transform={`rotate(${i*7} 177 177)`} />)}
      <path d="M292 265Q254 278 238 258Q231 234 253 208Q269 192 305 194Q304 234 292 265Z" fill="#76553c" />
      <path d="M253 216Q238 247 258 259Q276 268 295 254" fill="none" stroke="#f0d6a1" strokeWidth="3" />
      <circle cx="177" cy="177" r="6" fill="#8e6c49" />
    </svg><p><strong>A scar can record a past fire.</strong> Dated tree rings help researchers reconstruct a site’s fire history.</p></div>
    <ol className="fire-history-threads">
      <li><h3>People used fire.</h3><p>Indigenous stewardship shaped plants, habitats and cultural relationships.</p></li>
      <li><h3>Land use changed.</h3><p>Colonization, grazing, logging, roads and settlement changed many landscapes.</p></li>
      <li><h3>Recurring fire was excluded.</h3><p>In many frequent-fire forests, vegetation and fuels accumulated differently.</p></li>
      <li><h3>Today’s conditions keep changing.</h3><p>Climate, weather and community exposure shape present-day decisions.</p></li>
    </ol>
    <figcaption>These influences differ by place and interact. Local records and sampled fire histories help establish what happened where.</figcaption>
  </figure>;
}

export function WorkVisual() {
  return <div className="fire-work-visual">
    <figure className="fire-goal-pair"><div><HabitatTree kind="oak" /><span>Woodpecker / one unit</span><h3>Give oak and madrone room.</h3></div><div><HabitatTree kind="pine" /><span>Woodpecker / the other unit</span><h3>Support valley ponderosa pine.</h3></div><figcaption>Two objectives described in OSU’s account of the October 2025 burns.</figcaption></figure>
    <ol className="fire-work-path" aria-label="Parts of a prescribed-fire project">{[
      ["Choose", "Define what should change."], ["Prepare", "Arrange fuels and boundaries."], ["Wait", "Match weather, smoke and capacity."], ["Burn", "Record what actually happened."], ["Revisit", "Measure results and maintain."],
    ].map(([title,text],i)=><li key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
    <details className="fire-unit-explanation"><summary>Why “units burned” and “ignitions” are different numbers</summary><p>ODF’s 2025 forestland smoke report lists <strong>2,717 burned units</strong> and <strong>3,941 ignitions</strong>. A unit can have more than one ignition. The report also records 179,230 acres; acreage and burn-method definitions matter when comparing work. <a href={LESSON_SOURCES.smoke.url}>Read the report, page 2 ↗</a></p></details>
  </div>;
}

export function TreatmentEvidence() {
  return <figure className="fire-treatment-evidence">
    <div className="fire-research-heading"><span><strong>{TREATMENT_REVIEW.studies}</strong> studies in a 2024 review</span><p>How much lower was severity in the analyzed treated areas reached by wildfire?</p></div>
    <div className="fire-review-bars">{TREATMENT_REVIEW.values.map(d=><div key={d.method} className="fire-review-row"><div><span>{d.method}</span><strong>{d.value}%</strong></div><div className="fire-review-track"><div style={{width:`${d.value}%`}} /></div></div>)}<div className="fire-review-axis" aria-hidden="true"><span>0%</span><span>100% reduction</span></div></div>
    <figcaption><strong>Reported mean relative reductions in severity.</strong> Analyzed seasonally dry western US conifer forests. These percentages describe severity measures where wildfire followed treatment. They are not percentages of fires prevented. <a href={LESSON_SOURCES.synthesis.url}>Davis and colleagues, section 3.2.1 and Figure 3 ↗</a></figcaption>
    <details><summary>How to read these averages</summary><p>The review combines several severity measures. Individual results vary; the full paper provides uncertainty intervals and methods. It did not establish statistically different overall effects among these three treatment categories. The bars show reported means, not a forecast for an individual project.</p><table><caption>Reported average relative severity reductions</caption><thead><tr><th scope="col">Treatment</th><th scope="col">Mean reduction</th></tr></thead><tbody>{TREATMENT_REVIEW.values.map(d=><tr key={d.method}><th scope="row">{d.method}</th><td>{d.value}%</td></tr>)}</tbody></table></details>
  </figure>;
}

export function AftermathVisual() {
  return <figure className="fire-aftermath-visual"><div className="fire-aftermath-images">
    <div><Image src="/images/oregon-fire/oregon-2020-07-19.webp" width={700} height={700} sizes="(max-width: 700px) calc(100vw - 40px), 50vw" alt="Western Oregon in Terra MODIS false color on July 19, 2020, before the September fires" /><span>July 19, 2020 / before</span></div>
    <div><Image src="/images/oregon-fire/oregon-2020-09-27.webp" width={700} height={700} sizes="(max-width: 700px) calc(100vw - 40px), 50vw" alt="The same western Oregon extent on September 27, 2020, with newly visible dark and red fire scars and some clouds" /><span>September 27, 2020 / after</span></div>
    </div><figcaption>Same western Oregon extent · NASA GIBS / Terra MODIS, bands 7–2–1. Vegetation appears green; scars can appear dark or red. Clouds, other surfaces and the difference in seasons also affect the view. <a href={LESSON_SOURCES.nasa.url}>NASA’s 2020 explanation ↗</a></figcaption>
    <div className="fire-reading-layers"><div><span>01 / Boundary</span><h3>Where was the event?</h3><p>A perimeter may include ground that did not burn.</p></div><div><span>02 / Severity</span><h3>What changed?</h3><p>Assessments describe effects using a particular method and date.</p></div><div><span>03 / Follow-up</span><h3>What came next?</h3><p>Field visits show which trees, plants and habitat remain.</p></div></div>
  </figure>;
}

export function CommunityVisual() {
  return <figure className="fire-community-visual"><svg viewBox="0 0 1000 330" role="img" aria-label="Embers can travel from a vegetation fire toward buildings. Landscape preparation and reducing building ignition vulnerabilities address different parts of the path.">
    <rect width="1000" height="330" fill="#e4e7d8" /><circle cx="795" cy="62" r="29" fill="#d5ba80" /><path d="M0 202Q180 110 380 199T700 189T1000 210V330H0Z" fill="#bec9b0" /><path d="M0 264Q180 204 360 263T690 254T1000 263V330H0Z" fill="#8b9a79" />
    {[60,150,235].map((x,i)=><g key={x}><path d={`M${x} 152V290`} stroke="#927052" strokeWidth="8"/><path d={`M${x} ${60+i*23}l-36 82h17l-34 61h106l-34-61h17Z`} fill="#365b43"/></g>)}
    <path d="M145 293C104 281 118 248 137 229C140 249 153 247 151 214C176 237 171 249 184 259C202 280 169 298 145 293Z" fill="#ba6b38" />
    <path d="M160 166Q325 4 614 80T842 115" stroke="#a96939" strokeWidth="3" strokeDasharray="6 9" fill="none" />
    {[270,355,446,548,654,750,830].map((x,i)=><ellipse key={x} cx={x} cy={100+(i>3?(i-3)*7:20-i*13)} rx="5" ry="3" fill="#b46c36" transform={`rotate(-23 ${x} 100)`} />)}
    <path d="M630 281V172l78-55 84 55v109Z" fill="#eee5cd" /><path d="m615 176 93-68 99 68" stroke="#715843" fill="none" strokeWidth="11" /><path d="M695 281v-67h33v67" fill="#446550" /><path d="M650 198h25v25h-25m91-25h25v25h-25" fill="#819b8a" />
    <path d="M855 279v-82l55-37 58 37v82Z" fill="#d4d3af" /><path d="m843 200 67-49 70 49" stroke="#715843" strokeWidth="9" fill="none" />
    <path d="M0 308H1000" stroke="#526b50" strokeWidth="3" />
  </svg><div className="fire-community-labels"><div><strong>On the landscape</strong><p>Manage habitat and fuel objectives.</p></div><div><strong>Around buildings</strong><p>Reduce routes for embers and flames to cause ignition.</p></div><div><strong>Across the community</strong><p>Plan for response, smoke and evacuation.</p></div></div><figcaption><a href={LESSON_SOURCES.homes.url}>NIST explains how fire reaches and spreads between buildings ↗</a></figcaption></figure>;
}
