import { PlugZap, Leaf, Droplets, Coins, GraduationCap, ScanEye } from "lucide-react";
import { SOURCES, WIN_WIN_CONDITIONS } from "@/lib/datacenters/data";
const short = [
  {title:"Protect other customers",text:"Make the project pay for its power needs—and the risk it closes.",icon:PlugZap},
  {title:"Plan for clean power",text:"Show where new electricity will come from and when it can arrive.",icon:Leaf},
  {title:"Set local resource limits",text:"Measure water, pollution and noise. Plan for drought and peak demand.",icon:Droplets},
  {title:"Show the money works",text:"Compare the deal with no break, including costs and other uses of the land.",icon:Coins},
  {title:"Account for schools",text:"Show which budgets gain, which lose and how services are paid for.",icon:GraduationCap},
  {title:"Make the terms public",text:"Publish the agreement, the evidence and who enforces each promise.",icon:ScanEye}
];
export default function ConditionsScorecard() {
  return <><div className="dc-condition-summary"><div className="dc-status-dots" aria-hidden="true">{short.map(c=><i key={c.title}/>)}</div><span><b>2</b> partly covered</span><span><b>4</b> not established statewide</span></div>
    <div className="dc-condition-grid">{WIN_WIN_CONDITIONS.map((c,i)=>{const Icon=short[i].icon;return <article key={c.condition} className={"dc-condition "+(c.status==="partial"?"is-partial":"")}>
      <div className="dc-condition-top"><Icon aria-hidden="true"/><span className={"dc-tag "+(c.status==="partial"?"amber":"slate")}>{c.status==="partial"?"Partial coverage":"Still an open test"}</span></div>
      <h3>{short[i].title}</h3><p>{short[i].text}</p>
      <details className="dc-disclosure"><summary>Evidence & enforcement</summary><div className="dc-detail-body">
        <p>{c.evidence} <a href={SOURCES[c.sourceId].url}>Read the source ↗</a></p>
        <dl>{[["Who is responsible",c.authority],["What to require",c.requirement],["What to report",c.reporting],["If a promise is missed",c.enforcement]].map(([t,v])=><div key={t}><dt>{t}</dt><dd>{v}</dd></div>)}</dl>
      </div></details>
    </article>})}</div>
  </>;
}
