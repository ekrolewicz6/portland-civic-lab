const source = "https://www.oregon.gov/odf/aboutodf/documents/2025-odf-sb83-landscape-resilency-strategy-implementation-report.pdf";

const reported = [
  { name: "Forest Legacy", amount: 24505614, detail: "A forest acquisition and easement-related work", color: "legacy" },
  { name: "Federal forest restoration", amount: 11778573, detail: "Preparation, restoration, monitoring and commercial projects", color: "federal" },
  { name: "Landscape resiliency", amount: 5756305, detail: "Fuels work, prescribed fire and juniper treatment", color: "resiliency" },
] as const;
const total = 50984180;
const other = total - reported.reduce((sum, item) => sum + item.amount, 0);
const items = [...reported, { name: "Ten other programs", amount: other, detail: "Different types of assistance, treatment and restoration", color: "other" }] as const;
const dollars = (amount: number) => `$${(amount / 1_000_000).toFixed(2)}m`;

export default function FireSpendingEvidence() {
  return <figure className="fire-spending-evidence" id="actual-fire-spending">
    <div className="fire-spending-heading fire-figure-head">
      <div><span className="fire-eyebrow">A real spending account / calendar 2025</span><h3>What did ODF&apos;s $50.98 million pay for?</h3></div>
      <p>Oregon&apos;s forestry department reported expenditures across 13 programs supporting its landscape strategy. The total covers different kinds of work, including land acquisition. It cannot be divided by acres burned to get a burn cost.</p>
    </div>
    <div className="fire-spending-bar" role="img" aria-label="Of 50.98 million dollars reported by ODF, 24.51 million went to Forest Legacy, 11.78 million to Federal Forest Restoration, 5.76 million to Landscape Resiliency, and 8.94 million to ten other programs.">
      {items.map(item => <span key={item.name} className={`fire-spending-${item.color}`} style={{ width: `${item.amount / total * 100}%` }} />)}
    </div>
    <div className="fire-spending-key">
      {items.map(item => <div key={item.name}>
        <span className={`fire-spending-swatch fire-spending-${item.color}`} aria-hidden="true" />
        <div><strong>{item.name}</strong><p>{item.detail}</p></div>
        <b>{dollars(item.amount)}</b>
      </div>)}
    </div>
    <figcaption>ODF&apos;s <a href={source}>2025 implementation report, pages 1 and 8–9 ↗</a>. Amounts are program expenditures, not individual project invoices. “Ten other programs” is the reported total less the three exact program amounts shown; several underlying figures in the report are rounded. These categories do not represent all Oregon fire spending.</figcaption>
  </figure>;
}
