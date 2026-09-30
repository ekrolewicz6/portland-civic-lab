import { SOURCES } from "@/lib/datacenters/data";

export function BargainDiagram() {
  return <figure className="dc-hero-graphic">
    <div className="dc-bargain-labels"><span>Land + tax terms</span><span>Taxes + fees</span></div>
    <svg viewBox="0 15 480 275" role="img" aria-label="A data center connects public resources with company payments and jobs. The agreement determines the balance.">
      <circle cx="240" cy="155" r="130" fill="none" stroke="#51755f" strokeDasharray="3 7" />
      <path d="M78 75H155V127 M78 242H155V187 M325 127V75H405 M325 187V242H405" stroke="#92b39a" strokeWidth="2" fill="none" />
      <g fill="#d7b07f"><circle cx="78" cy="75" r="5" /><circle cx="78" cy="242" r="5" /><circle cx="405" cy="75" r="5" /><circle cx="405" cy="242" r="5" /></g>
      <rect x="135" y="102" width="210" height="125" rx="12" fill="#193a2c" stroke="#94ae95" />
      {[153,217,281].map(x => <g key={x}><rect x={x} y="119" width="46" height="89" rx="4" fill="#355a45" stroke="#769c7e" />{[134,154,174].map(y => <g key={y}><rect x={x+8} y={y} width="29" height="10" rx="2" fill="#183a2b" /><circle cx={x+31} cy={y+5} r="2" fill="#dab27e" /></g>)}<path d={`M${x+9} 198h28`} stroke="#8db39b" /></g>)}
    </svg>
    <div className="dc-bargain-labels"><span>Power + water</span><span>Jobs + investment</span></div>
    <figcaption><strong>What does the public get back?</strong><p>The agreement sets what the company pays.<br />Public costs also depend on its electricity, water and service needs.</p></figcaption>
  </figure>;
}
export function CountyTaxVisual() {
  return <figure>
    <div className="dc-waffle-layout">
      <div className="dc-waffle" aria-hidden="true">{Array.from({length:100},(_,i)=><i key={i} className={i<32?"filled":""} />)}</div>
      <div><strong className="dc-big-number">32%</strong><p className="dc-stat-caption">of the property taxes collected in Morrow County came from data centers, according to ECONorthwest’s July 2026 analysis.</p></div>
    </div>
    <figcaption className="dc-fine" style={{marginTop:17}}>That is about $22.96 million shared among local governments and public districts. Negotiated company fees are additional and are not included here. Each square represents roughly 1% of the taxes collected.</figcaption>
    <a href={SOURCES.econw.url} className="dc-source">ECONorthwest · July 2026 preliminary analysis, slide 22 ↗</a>
  </figure>;
}
export function ReturnsVisual() {
  return <><p className="dc-small" style={{ color: "#d0ddd4", marginBottom: 20 }}>The charts compare three programs. “Standard” means standard enterprise zones; “Rural” means long-term rural enterprise zones; and “SIP” means the Strategic Investment Program. All three offer property-tax breaks under different rules.</p><p className="dc-small" style={{ color: "#d0ddd4", marginBottom: 20 }}>The study adjusts the cost of the tax breaks to account for required fees and other included payments that governments still receive. The charts use that adjusted cost in both comparisons.</p><div className="dc-evidence-grid">
    <figure className="dc-evidence-card">
      <span className="dc-kicker">Economic activity</span><h3>What businesses produce</h3><p>The study estimated the value of goods and services produced by activity linked to each tax-break program. It compared that value with the program’s adjusted tax-break cost.</p>
      <div className="dc-mini-bars" role="img" aria-label="Estimated business activity divided by adjusted tax-break cost, minus one: standard enterprise zones 29.16, long-term rural enterprise zones 1.18, Strategic Investment Program 6.24.">
        {[["Standard",29.16],["Rural",1.18],["SIP",6.24]].map(([name,value])=><div key={name}><span>{name}</span><i><span style={{width:Number(value)/29.16*100+"%"}} /></i><strong>{value}</strong></div>)}
      </div>
      <figcaption className="dc-fine">Each number is the estimated business activity divided by the adjusted cost of tax breaks, minus one. For example, 1.18 means $2.18 of activity per $1 of cost. Business activity is not money collected by the government.</figcaption>
    </figure>
    <figure className="dc-evidence-card">
      <span className="dc-kicker">Public revenue</span><h3>What employees pay in state income tax</h3><p>The second comparison counts only state income tax from employees. Zero means those taxes equal the adjusted tax-break cost. A negative number means they fall short.</p>
      <div className="dc-roi-chart" role="group" aria-label="Estimated employee income tax divided by adjusted tax-break cost, minus one">
        {[{name:"Standard",value:1.35},{name:"Rural",value:-.84},{name:"SIP",value:.03}].map(r => <div className="dc-roi-row" key={r.name}>
          <span>{r.name}</span>
          <div className="dc-roi-track" aria-hidden="true"><i /><span style={{left: (r.value < 0 ? 40 + r.value / 2.5 * 100 : 40) + "%",width: Math.abs(r.value) / 2.5 * 100 + "%",backgroundColor:r.value < 0 ? "#d9a17b" : "#a7c89c"}} /></div>
          <strong>{r.value > 0 ? "+" : ""}{r.value.toFixed(2)}</strong>
        </div>)}
      </div>
      <p className="dc-fine" style={{marginBottom:16}}>0 = taxes equal the adjusted cost</p>
      <figcaption className="dc-fine">For the rural program, −0.84 means about 16 cents in employee income tax per $1 of adjusted tax-break cost. This leaves out other taxes and costs, and does not show whether the break caused the investment.</figcaption>
    </figure>
  </div></>;
}
