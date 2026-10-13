const odf = "https://www.oregon.gov/odf/aboutodf/documents/2025-odf-sb83-landscape-resilency-strategy-implementation-report.pdf";
const osfm = "https://www.oregon.gov/osfm/wildfire/pages/investments-for-oregon.aspx";

export default function FireFundingPath() {
  return <section className="fire-funding-path" aria-labelledby="fire-funding-title">
    <div className="fire-funding-heading">
      <span className="fire-eyebrow">Follow the money · before comparing numbers</span>
      <h3 id="fire-funding-title">A dollar changes meaning as it moves.</h3>
      <p>A budget sets money aside. An award names a recipient and purpose. An expenditure records what was spent. None alone tells us what was completed or whether it helped.</p>
    </div>
    <ol className="fire-funding-steps" aria-label="Stages of fire funding">
      <li><span>01</span><strong>Budgeted</strong><small>Money made available</small></li>
      <li><span>02</span><strong>Awarded</strong><small>A recipient and purpose named</small></li>
      <li><span>03</span><strong>Spent</strong><small>Costs recorded</small></li>
      <li><span>04</span><strong>Done & checked</strong><small>Work and results documented</small></li>
    </ol>
    <div className="fire-funding-examples">
      <div>
        <span>ODF · calendar 2025 · expenditure</span>
        <strong>$50.98m</strong>
        <p>Reported across 13 landscape-strategy programs, including land conservation. This is an agency spending account, not a price for prescribed burning.</p>
        <a href={odf}>ODF implementation report, pp. 1 and 8–9 ↗</a>
      </div>
      <div>
        <span>OSFM · announced February 2023 · investment</span>
        <strong>$2.7m</strong>
        <p>One-time Community Wildfire Protection Plan investments for projects in 25 counties, including education, home assessments and fuel work. The announcement does not report final project expenditures or results.</p>
        <a href={osfm}>OSFM investment and project list ↗</a>
      </div>
    </div>
    <p className="fire-funding-rule">These amounts cover different agencies, periods and accounting stages. We do not add them into a statewide total.</p>
  </section>;
}
