import { PlugZap, Leaf, Droplets, Coins, GraduationCap, ScanEye } from "lucide-react";
import { SOURCES, WIN_WIN_CONDITIONS } from "@/lib/datacenters/data";
const short = [
  {title:"Protect other customers",text:"Require the project to cover the electricity costs it creates, including costs left behind if it closes early.",icon:PlugZap},
  {title:"Plan for clean power",text:"Identify where the extra electricity will come from and when it will be available. Explain how the supply will meet clean-energy requirements.",icon:Leaf},
  {title:"Set local resource limits",text:"Set measurable limits on water use, pollution and noise. Explain what happens during a drought or periods of highest demand.",icon:Droplets},
  {title:"Show the money works",text:"Compare public payments and costs with and without the tax break. Include realistic alternative uses of the land.",icon:Coins},
  {title:"Account for schools",text:"Explain how the deal affects local and statewide school funding, and how added public services will be paid for.",icon:GraduationCap},
  {title:"Make the terms public",text:"Publish the agreement and the evidence supporting it. Identify who will check each promise and what happens if it is broken.",icon:ScanEye}
];
export default function ConditionsScorecard() {
  return <><div className="dc-condition-summary"><div className="dc-status-dots" aria-hidden="true">{short.map(c=><i key={c.title}/>)}</div><span><b>2</b> have some protections in place</span><span><b>4</b> lack evidence of statewide protection</span></div>
    <div className="dc-condition-grid">{WIN_WIN_CONDITIONS.map((c,i)=>{const Icon=short[i].icon;return <article key={c.condition} className={"dc-condition "+(c.status==="partial"?"is-partial":"")}>
      <div className="dc-condition-top"><Icon aria-hidden="true"/><span className={"dc-tag "+(c.status==="partial"?"amber":"slate")}>{c.status==="partial"?"Some protections in place":"Needs further evidence"}</span></div>
      <h3>{short[i].title}</h3><p>{short[i].text}</p>
      <details className="dc-disclosure"><summary>What the records show and what to require</summary><div className="dc-detail-body">
        <p>{c.evidence} <a href={SOURCES[c.sourceId].url}>Read the source ↗</a></p>
        <dl>{[["Who is responsible",c.authority],["What to require",c.requirement],["What to report",c.reporting],["If a promise is missed",c.enforcement]].map(([t,v])=><div key={t}><dt>{t}</dt><dd>{v}</dd></div>)}</dl>
      </div></details>
    </article>})}</div>
  </>;
}
