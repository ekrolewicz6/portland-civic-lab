import Link from 'next/link';
import { pageMeta } from '@/lib/page-meta';
import { money } from '@/lib/campaign-finance/filters';
import { financeFacts } from '@/lib/campaign-finance/candidate-facts';
import data from '@/lib/campaign-finance/supplier-data.json';
import SupplierExplorer from '@/components/deep-dives/campaign-finance/SupplierExplorer';
import s from '@/components/deep-dives/campaign-finance/suppliers.module.css';

const BASE = '/deep-dives/campaign-finance';
export const metadata = pageMeta({
  title: 'Where Portland campaigns spent their money',
  description: 'See what 17 Portland City Council campaigns paid, which suppliers they shared, and the records behind every figure.',
  path: BASE + '/suppliers',
  type: 'article',
  sectionImage: true,
});

const percent = (part: number, whole: number) => whole ? (100 * part / whole).toFixed(1) + '%' : '0%';
const reported = (name: string) => {
  const group = data.reportedNames.find(entry => entry.reportedName === name);
  if (!group) throw new Error('Missing reported payee: ' + name);
  return group;
};
const codeAmount = (name: string) => {
  const row = data.purpose.find(entry => entry.name === name);
  if (!row) throw new Error('Missing purpose code: ' + name);
  return row.cents;
};

const cne = reported('C&E Systems');
const infused = reported('Infused LLC');
const hollywood = reported('Hollywood Impress Printing');
const morel = reported('Morel Ink');
const actblue = reported('ActBlue');
const d3 = data.candidates.filter(candidate => candidate.district === 3);
const d4 = data.candidates.filter(candidate => candidate.district === 4);
const sharedGroups = data.payees.filter(payee => payee.candidateCount > 1);
const expenseMax = Math.max(...data.candidates.map(candidate => candidate.cents));

const purposeRows = [
  { label: 'General operations', cents: codeAmount('General operations') },
  { label: 'Management services', cents: codeAmount('Management services') },
  { label: 'Payroll and benefits', cents: codeAmount('Wages, salaries, benefits') },
  { label: 'Mixed or blank codes', cents: codeAmount('Multiple reported codes') + codeAmount('Unspecified code') },
  { label: 'Advertising and signs', cents: codeAmount('Advertising production') + codeAmount('Other advertising / signs') + codeAmount('Online advertising') + codeAmount('Print-media advertising') },
  { label: 'Fundraising-event code', cents: codeAmount('Fundraising event code') },
  { label: 'Printing', cents: codeAmount('Literature and printing') },
];
const otherPurposeCents = data.totals.cashPaymentCents - purposeRows.reduce((sum, row) => sum + row.cents, 0);
if (otherPurposeCents < 0) throw new Error('Supplier purpose buckets exceed payments');
purposeRows.push({ label: 'Other, including reimbursements', cents: otherPurposeCents });
purposeRows.sort((a, b) => b.cents - a.cents);

if (data.snapshot !== financeFacts.snapshot) throw new Error('Supplier and receipt snapshots differ');
const matchedFacts = data.candidates.map(candidate => {
  const facts = financeFacts.committees[candidate.committeeId];
  if (!facts?.account || facts.account.year !== 2026 || facts.account.reconciliation !== 'agrees') {
    throw new Error('Missing reconciled account summary for committee ' + candidate.committeeId);
  }
  return facts;
});
const raisedCents = matchedFacts.reduce((sum, facts) => sum + facts.cashCents, 0);
const cashOnHandCents = matchedFacts.reduce((sum, facts) => sum + facts.account!.endingCashCents, 0);

type Candidate = typeof data.candidates[number];
type ReportedPayee = typeof cne;

function Heading({ index, label, children }: { index: string; label: string; children: React.ReactNode }) {
  return <header className={s.chapterHead}><span className={s.eyebrow}>{index} / {label}</span><h2>{children}</h2></header>;
}

function Portfolio({ group, note }: { group: ReportedPayee; note: string }) {
  const maximum = Math.max(...group.candidates.map(candidate => candidate.cents));
  return <div className={s.supplierCard}>
    <div className={s.supplierCardHead}><h3>{group.reportedName}</h3><strong>{money(group.cents)}</strong></div>
    <p>{note}</p>
    <div className={s.portfolioBars}>
      {[...group.candidates].sort((a, b) => b.cents - a.cents).map(candidate => <div className={s.portfolioBar} key={candidate.committeeId}>
        <div><span>{candidate.name} <small>District {candidate.district}</small></span><b>{money(candidate.cents)}</b></div>
        <div className={s.track} aria-hidden="true"><span className={candidate.district === 4 ? s.districtFour : undefined} style={{ width: percent(candidate.cents, maximum) }} /></div>
      </div>)}
    </div>
  </div>;
}

function CampaignBars({ candidates, district }: { candidates: Candidate[]; district: number }) {
  return <div className={s.campaignColumn}><span className={s.eyebrow}>District {district} · {candidates.length} committees with reviewed data</span>
    <div className={s.barRows}>{candidates.map(candidate => {
      const named = data.payees.filter(payee => payee.candidates.some(entry => entry.committeeId === candidate.committeeId))
        .sort((a, b) => (b.candidates.find(entry => entry.committeeId === candidate.committeeId)?.cents ?? 0) - (a.candidates.find(entry => entry.committeeId === candidate.committeeId)?.cents ?? 0))[0];
      const top = named?.candidates.find(entry => entry.committeeId === candidate.committeeId);
      return <div className={s.campaignRow} key={candidate.committeeId}>
        <div className={s.barLabel}><span>{candidate.candidate}</span><strong>{money(candidate.cents)}</strong></div>
        <div className={s.track} aria-hidden="true"><span className={district === 4 ? s.districtFour : undefined} style={{ width: percent(candidate.cents, expenseMax) }} /></div>
        <small>{top ? 'Largest named payee: ' + named.reportedName + ' · ' + money(top.cents) : 'No named payee in this snapshot'}</small>
      </div>;
    })}</div>
  </div>;
}

export default function Suppliers() {
  return <main className={s.page} data-supplier-snapshot={data.snapshot}><div className={s.wrap}>

    <header className={s.hero}>
      <div>
        <span className={s.eyebrow}>Portland City Council / Districts 3 and 4 / 2025–26</span>
        <h1>The other side<br />of campaign <em>money.</em></h1>
        <p className={s.dek}>Seventeen campaigns have reported more than $672,000 in payments. Who received it—and which names appear across campaigns?</p>
        <p className={s.meta}>September 27, 2026 snapshot · 17 reviewed candidate committees</p>
      </div>
      <aside className={s.heroLedger}>
        <p className={s.heroLedgerLabel}>Cash paid out / cash raised</p>
        <strong className={s.heroPaid}>{money(data.totals.cashPaymentCents)}</strong>
        <p className={s.heroRaised}>/ <b>{money(raisedCents)}</b> raised</p>
        <div className={s.heroProgress} role="img" aria-label={'Payments equal ' + percent(data.totals.cashPaymentCents, raisedCents) + ' of gross cash raised'}><span style={{ width: percent(data.totals.cashPaymentCents, raisedCents) }} /></div>
        <p className={s.heroShare}>Payments equal {percent(data.totals.cashPaymentCents, raisedCents)} of cash raised</p>
        <p className={s.heroBalance}><b>{money(cashOnHandCents)}</b><span>reported cash on hand</span></p>
        <small>Raised includes City matching money. Cash on hand comes from account summaries, not simple subtraction, and may be needed for unpaid obligations.</small>
      </aside>
    </header>

    <div className={s.stats}>
      <div><strong>{data.totals.cashPaymentRecords.toLocaleString()}</strong><span>cash payments</span></div>
      <div><strong>{data.totals.visiblePayeeGroups}</strong><span>searchable payee entries</span></div>
      <div><strong>{data.totals.multiCandidatePayeeGroups}</strong><span>entries paid by more than one campaign</span></div>
      <div><strong>{money(data.totals.aggregateCents)}</strong><span>paid with no usable name</span></div>
    </div>
    <nav className={s.jump} aria-label="Supplier story sections"><a href="#what-was-bought">Where the money went</a><a href="#shared-infrastructure">Shared suppliers</a><a href="#campaign-models">Each campaign</a><a href="#all-payees">Search payees</a><a href="#methods">Methods</a></nav>

    <section className={s.chapter} id="what-was-bought">
      <Heading index="01" label="Follow the checks">Most payments name a recipient.</Heading>
      <p className={s.sectionLead}>Campaigns report who they pay: staff, firms, printers, platforms and others. {money(data.totals.identifiedCents)} of the {money(data.totals.cashPaymentCents)} has a usable payee name.</p>
      <figure className={s.viz}>
        <h3>How much can be tied to a named payee?</h3>
        <div className={s.splitBar} role="img" aria-label={money(data.totals.identifiedCents) + ' with a named payee; ' + money(data.totals.aggregateCents) + ' without one'}>
          <span style={{ width: percent(data.totals.identifiedCents, data.totals.cashPaymentCents) }} /><span />
        </div>
        <div className={s.splitLegend}><div><i className={s.namedKey} /><span>Named payee</span><b>{money(data.totals.identifiedCents)}</b></div><div><i className={s.unknownKey} /><span>No usable name</span><b>{money(data.totals.aggregateCents)}</b></div></div>
        <figcaption className={s.source}>A named recipient is not necessarily the person who ultimately earned the money. A processor or staff member may pass funds along or be reimbursed.</figcaption>
      </figure>
      <figure className={s.viz}>
        <h3>What campaigns said the payments were for</h3>
        <p>These are the campaigns’ filing categories—not an audit of the service delivered.</p>
        <div className={s.purposeBars}>{purposeRows.map(row => <div className={s.purposeRow} key={row.label}>
          <span>{row.label}</span><div className={s.track} aria-hidden="true"><span style={{ width: percent(row.cents, data.totals.cashPaymentCents) }} /></div><strong>{money(row.cents)}</strong>
        </div>)}</div>
        <figcaption className={s.source}>Each payment appears once. “Other” includes reimbursements, travel, utilities and other codes. <a href={data.evidence.payments.url} download>Check the filed descriptions and payment records</a>.</figcaption>
      </figure>
      <aside className={s.codeCase}>
        <span className={s.eyebrow}>Why filing codes need context</span>
        <h3>961 ActBlue payments do not mean 961 fundraisers.</h3>
        <p>The filings show {actblue.records.toLocaleString()} payments totaling {money(actblue.cents)} under the payee name ActBlue. Some use a “Fundraising Event Expenses” code. <a href="https://help.actblue.com/hc/en-us/articles/16869086351895-How-does-ActBlue-work">ActBlue processes online donations</a> for Democratic and progressive campaigns; a fee coded this way does not prove an in-person event. <a href="https://www.actblue.com/solutions/">Using its platform is not an endorsement</a>.</p>
      </aside>
    </section>

    <section className={s.chapter} id="shared-infrastructure">
      <Heading index="02" label="Shared suppliers">Some names cross district lines.</Heading>
      <p className={s.sectionLead}>{data.totals.multiCandidatePayeeGroups} searchable payee entries received {money(data.totals.multiCandidateGroupCents)} from at least two of these campaigns. A shared supplier is a business connection in the filings—not proof the campaigns coordinated.</p>
      <figure className={s.viz}>
        <h3>Largest payee entries used by multiple campaigns</h3>
        <div className={s.barRows}>{sharedGroups.slice(0, 8).map(payee => <div className={s.barRow} key={payee.entityId}>
          <div className={s.barLabel}><span>{payee.reportedName}</span><strong>{money(payee.cents)}</strong></div>
          <div className={s.track} aria-hidden="true"><span style={{ width: percent(payee.cents, sharedGroups[0].cents) }} /></div>
          <small>{payee.candidateCount} campaigns · {payee.records} payments</small>
        </div>)}</div>
        <figcaption className={s.source}>Same-looking names can be separate entries when the source details differ. <Link href={BASE + '/suppliers?shared=1#all-payees'}>See every shared payee entry</Link>.</figcaption>
      </figure>
      <div className={s.portfolioIntro}><h3>Who paid the same named suppliers?</h3><p>Each bar compares payments to one reported name. Green bars are District 3; gold bars are District 4. Bars restart at each supplier’s largest candidate payment.</p></div>
      <div className={s.supplierGrid}>
        <Portfolio group={cne} note="Management services · one payee entry in this snapshot" />
        <Portfolio group={infused} note="Treasury-related descriptions · two source entries share this name" />
        <Portfolio group={hollywood} note="Printing and signs · one payee entry" />
        <Portfolio group={morel} note="Printing and signs · two source entries share this name" />
      </div>
      <p className={s.source}>A shared name does not establish common ownership, an endorsement or a political alliance. <a href={data.evidence.reportedNames.url} download>Download all same-name comparisons</a>.</p>
    </section>

    <section className={s.chapter} id="campaign-models">
      <Heading index="03" label="Campaign by campaign">Who spent the most—and to whom?</Heading>
      <p className={s.sectionLead}>These are cash payments reported by 17 reviewed committees from January 1, 2025 to September 27, 2026. A longer bar means more money paid out, not a more effective campaign.</p>
      <figure className={s.viz}>
        <div className={s.two}><CampaignBars candidates={d3} district={3} /><CampaignBars candidates={d4} district={4} /></div>
        <figcaption className={s.source}>All candidate bars share one dollar scale. “Largest named payee” is the largest single payee entry we could identify, not necessarily the final beneficiary. District 3 has 21 candidates and District 4 has 12; unlinked campaigns are not shown as zero spending.</figcaption>
      </figure>
    </section>

    <SupplierExplorer payees={data.payees} candidates={data.candidates} />

    <section className={s.chapter} id="methods">
      <Heading index="04" label="Read the evidence">What these figures include.</Heading>
      <div className={s.methodCards}>
        <div><h3>Time and money</h3><p>Cash payments by 17 linked candidate committees, dated January 1, 2025–September 27, 2026. Loans, unpaid bills, in-kind support and refunds are not counted as extra purchases. November–December 2024 is missing from this window.</p></div>
        <div><h3>What counts as a payee entry?</h3><p>We group filing records when names and other source fields strongly match. One real firm may still appear in more than one entry; a matching name alone is not proof of one legal entity. Aggregate or unnamed payments remain dollars, not invented suppliers.</p></div>
        <div><h3>What payments cannot prove</h3><p>A payment does not establish a vendor’s profit, final recipient, political preference or coordination between campaigns. Reimbursements, payroll processors and subcontracting need more tracing.</p></div>
      </div>
      <div className={s.evidence}><a href={data.evidence.payments.url} download>All payment records</a><a href={data.evidence.payeeGroups.url} download>Payee entries</a><a href={data.evidence.payeeCandidates.url} download>Payee–campaign payments</a><a href={data.evidence.reportedNames.url} download>Same-name comparisons</a><a href="/data/campaign-finance/suppliers/data.json" download>Chart data and checksums</a><Link href={BASE + '/methodology'}>Full campaign-finance methods</Link></div>
      <p className={s.source}>Snapshot {data.snapshot}. Amounts are exact sums of the filed rows. Source transaction IDs and checksums are in the downloads.</p>
    </section>
    <footer className={s.foot}><p>For where campaign money came from, read <Link href={BASE}>the main campaign-finance investigation</Link>.</p></footer>
  </div></main>;
}
