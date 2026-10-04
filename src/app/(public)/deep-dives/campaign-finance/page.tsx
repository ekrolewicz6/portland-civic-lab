import Link from 'next/link';
import { pageMeta } from '@/lib/page-meta';
import { BASE, SNAPSHOT, money, shortMoney } from '@/lib/campaign-finance/filters';
import { fundingRows, story, storyCandidate } from '@/lib/campaign-finance/story';
import statewide from '@/lib/campaign-finance/publication.json';
import FundingChart from '@/components/deep-dives/campaign-finance/FundingChart';
import { Evidence, SeptemberChart, WeeklyChart, OverlapChart, EndorsementChart, ReservesChart } from '@/components/deep-dives/campaign-finance/StoryCharts';
import ZipContributionMap from '@/components/deep-dives/campaign-finance/ZipContributionMap';
import MajorDonorMatrix from '@/components/deep-dives/campaign-finance/MajorDonorMatrix';
import { CampaignTimeline, CandidateDonorDossier, CrossListSupport } from '@/components/deep-dives/campaign-finance/CampaignDynamics';
import districtAddress from '@/lib/campaign-finance/district-address-data.json';
import { activeManifest } from '@/lib/campaign-finance/active';
import { currentCandidateFacts } from '@/lib/campaign-finance/query';
import s from '@/components/deep-dives/campaign-finance/story.module.css';

export const metadata = pageMeta({ title: 'The money behind Portland’s next council', description: 'A chart-led investigation of Portland Districts 3 and 4: public matching, fundraising surges, shared donors, endorsements and cash reserves, with an auditor profile and statewide context.', path: BASE, type: 'article' });
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const d3 = fundingRows('portland-district-3');
const d4 = fundingRows('portland-district-4');
const koyama = storyCandidate('23208'), novick = storyCandidate('15109'), torres = storyCandidate('24897');
const arnold = storyCandidate('23295'), zimmerman = storyCandidate('17629'), green = storyCandidate('23365'), rede = storyCandidate('21777');
const topState = statewide.top_committees.slice(0, 3);
const percent = (a: number, b: number) => (100 * a / b).toFixed(1) + '%';
function ChapterHeading({ number, label, children }: { number: string; label: string; children: React.ReactNode }) { return <header className={s.chapterHeader}><p className={s.kicker}>{number} / {label}</p><h2>{children}</h2></header>; }

async function loadLatestFunding() {
  const active=activeManifest();
  const ids=[...new Set([...d3,...d4].map(row=>row.id))];
  const facts=await Promise.all(ids.map(id=>currentCandidateFacts(id)));
  const current=new Map(ids.map((id,index)=>[id,facts[index]]));
  const rows=[...d3,...d4].map(candidate=>({ ...candidate, facts:current.get(candidate.id) })).filter(row=>row.facts);
  const cash=rows.reduce((sum,row)=>sum+row.facts!.cashCents,0);
  const publicCash=rows.reduce((sum,row)=>sum+row.facts!.publicCents,0);
  const ranked=rows.sort((a,b)=>b.facts!.cashCents-a.facts!.cashCents);
  const max=Math.max(1,...ranked.map(row=>row.facts!.cashCents));
  return {active,rows,ranked,cash,publicCash,max};
}
function LatestFunding({data}:{data:Awaited<ReturnType<typeof loadLatestFunding>>}) {
  const {active,rows,ranked,max}=data;
  return <section className={s.chapter} aria-labelledby="latest-funding-heading" data-live-finance-snapshot={active.snapshot}>
    <header className={s.chapterHeader}><p className={s.kicker}>The current picture<br/>Through {active.end}</p><h2 id="latest-funding-heading">Who has raised the most?</h2></header>
    <div className={s.legend}><span><i className={s.public}/>City matching funds</span><span><i className={s.individual}/>Other cash contributions</span></div>
    <div className={s.latestGrid}>{ranked.slice(0,8).map(row=><div className={s.latestRow} key={row.id}><div><Link href={row.href}>{row.name}</Link><strong>{money(row.facts!.cashCents)}</strong></div><div className={s.latestTrack} role="img" aria-label={`${row.name}: ${money(row.facts!.publicCents)} reviewed City matching and ${money(row.facts!.nonmatchingCents)} other cash`}><span className={s.public} style={{width:`${100*row.facts!.publicCents/max}%`}}/><span className={s.individual} style={{width:`${100*row.facts!.nonmatchingCents/max}%`}}/></div></div>)}</div>
    <p className={s.source}>Eight highest totals among {rows.length} linked campaigns. <Link href={`${BASE}/races/portland-district-3`}>Compare District 3</Link> · <Link href={`${BASE}/races/portland-district-4`}>Compare District 4</Link> · <Link href={`${BASE}/explorer?basis=cash_contribution`}>Check the receipts</Link>.</p>
    <details className={s.details}><summary>Dates, coverage and what counts as fundraising</summary><p>These are gross cash contributions before refunds. Loans and in-kind support are separate. {active.completeness_verified?'Recent filings can still change the totals.':'The latest manual export may miss older-dated late filings.'} The chapters below use the September 27 research edition. Maps, official balances and reviewed donor relationships keep their own dates.</p></details>
  </section>;
}

const featuredIds = ['23208', '23028', '15109', '24897', '23295', '23365', '17629', '23199'];
const districtRows = featuredIds.map(id => {
  const row = districtAddress.candidates.find(candidate => candidate.committeeId === id);
  if (!row) throw new Error('Missing district address facts for ' + id);
  const parts = row.categories;
  return {
    id,
    name: row.candidate,
    inside: parts.address_inside.cents + parts.zip_inside.cents,
    outside: parts.address_outside.cents + parts.state_outside.cents + parts.zip_outside.cents,
    unknown: parts.uncertain.cents,
    privateCash: row.cashCents - parts.public.cents,
  };
});
const repeatRows = featuredIds.map(storyCandidate).sort((a, b) =>
  b.repeatIndividualGroups / b.visibleIndividualGroups - a.repeatIndividualGroups / a.visibleIndividualGroups
);
const districtTotals = (district: number) => {
  const rows = districtAddress.candidates.filter(candidate => candidate.district === district);
  const sum = (category: keyof typeof rows[number]['categories']) => rows.reduce((total, row) => total + row.categories[category].cents, 0);
  return {
    inside: sum('address_inside') + sum('zip_inside'),
    outside: sum('address_outside') + sum('state_outside') + sum('zip_outside'),
    unknown: sum('uncertain'),
  };
};
const d3Source = districtTotals(3);
const d4Source = districtTotals(4);


function DistrictSourceChart() {
  return <figure className={s.figure} data-chart="district-source">
    <figcaption><span className={s.kicker}>Eight highest-receipt reviewed council committees</span><h3>Was the reported source inside the candidate’s district?</h3><p className={s.chartNote}>Cash excluding City matching money. The gray part cannot be placed confidently inside or outside.</p></figcaption>
    <div className={s.questionLegend}><span><i className={s.insideKey} />Inside</span><span><i className={s.outsideKey} />Outside</span><span><i className={s.unknownKey} />Unknown</span></div>
    <div className={s.questionRows}>{districtRows.map(row => <div className={s.questionRow} key={row.id}>
      <div className={s.questionHeading}><Link href={storyCandidate(row.id).href}>{row.name}</Link><strong>{money(row.privateCash)}</strong></div>
      <div className={s.threeWayBar} role="img" aria-label={row.name + ': ' + money(row.inside) + ' reported inside, ' + money(row.outside) + ' outside, ' + money(row.unknown) + ' unknown'}>
        <span className={s.insideKey} style={{ width: percent(row.inside, row.privateCash) }} /><span className={s.outsideKey} style={{ width: percent(row.outside, row.privateCash) }} /><span className={s.unknownKey} style={{ width: percent(row.unknown, row.privateCash) }} />
      </div>
      <div className={s.questionAmounts}><span>{money(row.inside)} inside</span><span>{money(row.outside)} outside</span><span>{money(row.unknown)} unknown</span></div>
    </div>)}</div>
    <p className={s.source}>Reported address or ZIP—not verified residence. Some filings have no usable location. We never publish street addresses. <a href={districtAddress.evidencePath} download>Check all 17 committees and transaction counts</a>.</p>
  </figure>;
}

function RepeatSupportChart() {
  return <figure className={s.figure} data-chart="repeat-support">
    <figcaption><span className={s.kicker}>Named individual entries · eight highest-receipt committees</span><h3>Who has more repeat givers in the visible record?</h3><p className={s.chartNote}>Share of separately listed individual entries with more than one contribution record to that campaign.</p></figcaption>
    <div className={s.questionRows}>{repeatRows.map(candidate => <div className={s.questionRow} key={candidate.committeeId}>
      <div className={s.questionHeading}><Link href={candidate.href}>{candidate.name}</Link><strong>{percent(candidate.repeatIndividualGroups, candidate.visibleIndividualGroups)} · {candidate.repeatIndividualGroups} of {candidate.visibleIndividualGroups}</strong></div>
      <div className={s.repeatTrack} role="img" aria-label={candidate.name + ': ' + candidate.repeatIndividualGroups + ' of ' + candidate.visibleIndividualGroups + ' listed individual entries have multiple contribution records'}>
        <span style={{ width: percent(candidate.repeatIndividualGroups, candidate.visibleIndividualGroups) }} />
      </div>
    </div>)}</div>
    <p className={s.source}>Entries are carefully matched from the filings, not a verified count of unique people. More than one row does not always mean gifts on different days. Aggregate donations are excluded. <Evidence file="donor-candidate-complete-ledger.csv">Check the dated giving records</Evidence>.</p>
  </figure>;
}


export default async function Investigation() {
  const latest=await loadLatestFunding();
  return <article className={s.story} data-story-snapshot={SNAPSHOT}><div className={s.wrap}>
    <header className={s.hero} id="story-top"><p className={s.kicker}>The 2026 election · A visual investigation</p><h1>The money behind<br/>Portland’s <em>next council.</em></h1><p className={s.lead}>Who gives. Where it comes from. Who gets paid. <br/>Follow the money through Portland’s District 3 and 4 races.</p>
      <div className={s.openingGrid}><figure className={s.openingFigure} data-chart="opening"><figcaption><span className={s.kicker}>Cash raised by 17 linked campaigns</span><strong className={s.heroAmount}>{money(latest.cash)}</strong><span className={s.heroCaption}>{percent(latest.publicCash, latest.cash)} comes from City matching funds.</span></figcaption><div className={s.fundingStrip} role="img" aria-label={`${money(latest.publicCash)} City matching funds; ${money(latest.cash-latest.publicCash)} other cash contributions`}><span className={s.public} style={{ width: percent(latest.publicCash, latest.cash) }} /><span className={s.individual} style={{ width: percent(latest.cash-latest.publicCash, latest.cash) }} /></div><div className={s.openingNumbers}><div><strong>{shortMoney(latest.publicCash)}</strong><span><i className={s.public}/>City matching funds</span></div><div><strong>{shortMoney(latest.cash-latest.publicCash)}</strong><span><i className={s.individual}/>Other cash contributions</span></div></div><p className={s.source}>Jan. 1, 2025–{new Date(latest.active.end+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'})} · Before refunds · <Link href={`${BASE}/explorer?basis=cash_contribution&race=portland-district-3`}>Explore the records</Link></p></figure>
        <aside className={s.scope}><p className={s.kicker}>Start with your race</p><Link className={s.raceDoor} href={`${BASE}/races/portland-district-3`}><span>District 3<small>9 of 21 candidates linked</small></span><span aria-hidden="true">↗</span></Link><Link className={s.raceDoor} href={`${BASE}/races/portland-district-4`}><span>District 4<small>8 of 12 candidates linked</small></span><span aria-hidden="true">↗</span></Link><p className={s.coverageNote}>Missing records don’t mean $0 raised. Recent filings remain provisional; the latest manual export may not include every late filing.</p></aside></div>
      <p className={s.byline}>Portland Civic Lab · Analysis dated September 27, 2026 · Latest transaction update {latest.active.end}</p>
    </header>
    <nav className={s.sectionNav} aria-label="Chapters in this investigation">{[['district-3', 'District 3'], ['district-4', 'District 4'], ['campaign-timeline', 'When money arrived'], ['zip-map', 'Where it came from'], ['shared-support', 'Donors & endorsements'], ['money-left', 'Money left'], ['auditor', 'Auditor'], ['statewide', 'Beyond Portland']].map(([id, label], i) => <a key={id} href={`#${id}`}><span>0{i + 1}</span>{label}</a>)}</nav>
    <LatestFunding data={latest}/>

    <section className={s.chapter} id="district-3"><ChapterHeading number="01" label="District 3">Two measures.<br/>Two fundraising leaders.</ChapterHeading><div className={s.body}><p><strong>Tiffany Koyama Lane leads in all cash raised. Steve Novick leads if you leave out City matching money.</strong> Koyama Lane’s {money(koyama.cashCents)} includes {money(koyama.publicCents)} from the City. Novick’s {money(novick.cashCents)} includes {money(novick.publicCents)}. Both views matter: one shows campaign resources, the other shows money from outside the matching program.</p></div>
      <FundingChart rows={d3} district={3} roster={21} />
      <div className={s.body}><p>Torres also passes Morillo when City matches are left out. The chart includes smaller campaigns; <Link href={`${BASE}/races/portland-district-3`}>12 other candidates lack reviewed records</Link> and are not shown as $0.</p><p>The City restored higher matching limits on June 24. A large City deposit may reflect gifts made earlier, not a sudden rush of new donors. <a href="https://www.portland.gov/smalldonorelections/program-notices">City notice</a>.</p></div>
      <WeeklyChart ids={['23208', '23028', '15109', '24897']} title="Their biggest weeks came at different times." />
      <details className={s.caseStudy}><summary>Inside a peak week: Torres’s $19,335 in contributions</summary><div className={s.split}><div className={s.body}>
        <h3>What made up Torres’s August peak?</h3>
        <p>Torres’s largest 2026 week for contributions outside City matching was August 3–9. The filings date all 54 contribution records to August 9. They total <strong>$19,335</strong>, including $17,750 under reported donor names and $1,585 in one combined small-donation entry.</p>
        <p>The <a href="https://hoodline.com/2026/08/portland-mayor-wilson-backs-kellie-torres-sets-up-fight-for-council-majority/">reported Wilson endorsement event</a> was August 12. The August 9 transaction dates come first, but the filings do not show what prompted each gift or when every contribution was first visible to voters.</p>
        <p>We examine this week because the event makes its timing relevant. The weekly charts give every candidate the same link to the receipts behind their biggest week.</p>
      </div><figure className={s.figure} data-chart="torres-week"><figcaption><span className={s.kicker}>Torres · August 3–9, 2026</span><h3>What the cash records say</h3></figcaption>
        <div className={s.weekLedger}>
          <div><span>City matching deposit</span><strong>$72,000</strong><small>August 4 · 1 record</small></div>
          <div><span>Reported donor names</span><strong>$17,750</strong><small>August 9 · 53 records</small></div>
          <div><span>Combined small donations; names not listed</span><strong>$1,585</strong><small>August 9 · 1 record</small></div>
        </div>
        <p className={s.chartNote}>The two August 9 rows add to $19,335 outside City matching. Forty-seven named entries are $350 each, totaling $16,450. <a href="https://www.portland.gov/code/2/16/120">City rules cap individual gifts to participating campaigns at $350 per election</a>. The amount appears in 426 contribution records across these 17 campaigns in 2026. Repetition alone does not identify a fundraiser. The City deposit is separate and does not identify which gifts qualified for matching.</p>
        <details className={s.details}><summary>When were the August 9 records filed?</summary><p>In this snapshot, 33 records totaling $12,235 carry an August 12 filing date; 13 totaling $4,300 carry an August 27 amended date; eight totaling $2,800 carry a September 15 amended date. An amended row’s current filing date does not tell us when its first version became public.</p></details>
        <p className={s.source}><Link href={BASE + '/explorer?snapshot=' + SNAPSHOT + '&committee=24897&start=2026-08-09&end=2026-08-09&basis=cash_contribution&matching=exclude'}>Inspect all 54 August 9 contribution records</Link> · <a href={'/api/campaign-finance?snapshot=' + SNAPSHOT + '&committee=24897&start=2026-08-09&end=2026-08-09&basis=cash_contribution&matching=exclude&format=csv'} download>Download those 54 records</a> · <Link href={BASE + '/explorer?snapshot=' + SNAPSHOT + '&committee=24897&start=2026-08-04&end=2026-08-04&basis=cash_contribution&matching=only'}>Inspect the City deposit</Link></p>
      </figure></div></details>
      <p className={s.links}><Link href={`${BASE}/races/portland-district-3`}>Compare all District 3 candidates</Link><Link href={`/voters-guide/portland-district-3`}>Read their policy profiles</Link></p>
    </section>

    <section className={s.chapter} id="district-4"><ChapterHeading number="02" label="District 4">A {shortMoney(arnold.cashCents - zimmerman.cashCents)} cash lead narrows to {money(arnold.nonmatchingCents - zimmerman.nonmatchingCents)}.</ChapterHeading><div className={s.body}><p><strong>Arnold leads Zimmerman by {money(arnold.cashCents - zimmerman.cashCents)} in all cash raised—but by just {money(arnold.nonmatchingCents - zimmerman.nonmatchingCents)} without City matches.</strong> That second view also puts Green and Clark much closer to them.</p></div>
      <FundingChart rows={d4} district={4} roster={12} />
      <div className={s.split}><div className={s.body}><h3>September brought increases on more than one side.</h3><p>Old Green posts resurfaced September 13. In the next seven days, Arnold and Zimmerman recorded their biggest weeks of 2026 for cash outside City matches. Green’s receipts rose too—from $1,710.66 to $8,491.48. <a href="https://recalibrateportland.substack.com/p/mitch-green-between-the-tweets">Dated publication</a>.</p><p>Money rose for all three. The filings cannot tell us whether the news caused it or whether anyone switched sides.</p><p>That week also included the police chief’s response and a reported billboard. Green said the posts reflected anger over police violence and defended his oversight role. <a href="https://www.wweek.com/news/city/2026/09/16/police-chief-says-he-no-longer-has-confidence-in-councilors-judgment-after-old-tweets-resurface/">Reporting and Green’s response</a>.</p></div><SeptemberChart /></div>
      <details className={s.caseStudy}><summary>Why the billboard’s timing is uncertain</summary><div className={s.body}><p>We do not know the exact day it went up. Moving that date by a few days changes whether Arnold’s and Zimmerman’s fundraising looks higher or lower afterward. <Evidence file="billboard-date-sensitivity.csv">See the date comparisons</Evidence>.</p><p>The <a href="https://www.wweek.com/news/city/2026/09/18/new-committee-funded-in-part-by-chamber-of-commerce-attacks-mitch-green/">billboard was reported</a>, but this snapshot does not let us verify its cost or trace every payment behind it.</p></div></details>
      <WeeklyChart ids={['23295', '17629', '23365', '23199']} title="September was a peak for two candidates, not the whole field." />
      <div className={s.body}><p>Green’s biggest week for cash outside City matching was July 20–26, before September’s controversy. Clark’s was March 16–22. Her last recorded contribution outside City matching is September 8. Blank later weeks do not prove that fundraising stopped.</p></div>
      <details className={s.details}><summary>See weekly patterns for the other nine reviewed council candidates</summary><WeeklyChart ids={['24661', '24973', '24972', '24966', '24979', '23411', '25040', '25103', '24615']} title="Smaller reported totals also have distinct timelines." /></details>
      <p className={s.links}><Link href={`${BASE}/races/portland-district-4`}>Compare all District 4 candidates</Link><Link href="/voters-guide/portland-district-4">Read their policy profiles</Link></p>
    </section>

    <section className={s.chapter} id="campaign-timeline"><ChapterHeading number="03" label="The active campaign">Fundraising accelerated<br/>as summer went on.</ChapterHeading><div className={s.body}><p>Across these 17 campaigns, weekly cash outside City matches rose from about <strong>$6,400</strong> early in 2026 to <strong>$26,600</strong> after mid-July. Follow the lines and select a dated event to see the money reported around it.</p></div><CampaignTimeline /></section>

    <section className={s.chapter} id="zip-map"><ChapterHeading number="04" label="Where the reported money came from">Where campaigns’ reported cash came from.</ChapterHeading><div className={s.body}><p>District 3 campaigns report <strong>{money(d3Source.outside)} from outside</strong> versus {money(d3Source.inside)} from inside the district among cash we can place. District 4 reports <strong>{money(d4Source.inside)} from inside</strong> versus {money(d4Source.outside)} outside.</p><p>Much of the money has no reliable location. The charts use reported addresses or ZIPs, never publish street addresses, and leave out City matching deposits.</p></div><DistrictSourceChart /><ZipContributionMap /><p className={s.source}>January 2025–September 2026. ZIP areas are approximate and can cross district lines. Missing candidates are not counted as $0. <Link href={`${BASE}/methodology`}>How locations were classified</Link>.</p></section>

    <section className={s.chapter} id="shared-support"><ChapterHeading number="05" label="Across both districts">Shared supporters.<br/>Overlapping coalitions.</ChapterHeading><div className={s.body}><p><strong>At least {story.totals.multi_candidate_groups} of {story.totals.individual_groups.toLocaleString()} listed individual donor entries appear in more than one reviewed campaign.</strong> Each district elects three councilors, so supporting several candidates is not necessarily hedging.</p></div>
      <RepeatSupportChart /><OverlapChart />
      <div className={s.smallGrid}><div><h3>What is distinctive about the overlap?</h3><p>We can match 41 donor entries between Koyama Lane and Green. Similar comparisons averaged about six. Their supporters overlap far more than usual, but the gift records do not show why.</p></div><div><h3>Some names are hard to match.</h3><p>Torres and Zimmerman share five donor entries we can match closely. Matching names alone suggests 43 possible overlaps, but many could be different people. We do not count those as confirmed.</p></div></div>
      <EndorsementChart />
      <CandidateDonorDossier />
      <MajorDonorMatrix />
      <CrossListSupport />
      <div className={s.body}><p>The endorsement lists do not make two sealed camps. SEIU lists all six incumbents; Oregon AFSCME names candidates on both sides of the apparent divide.</p><p>The IBEW Local 48 Small Donor PAC gave $2,225 across Green, Zimmerman, Clark and Novick. <Evidence file="donor-portfolios-complete.csv">See all reported donor portfolios</Evidence>.</p></div>
      <aside className={s.blindspot}><div><strong>{percent(story.totals.unidentified_cents, story.totals.nonmatching_cents)}</strong><p>of cash outside City matching has no named donor.</p></div><div><p>That is {money(story.totals.unidentified_cents)} for which the filings do not name the underlying people. We can count the money but cannot trace those donors across campaigns.</p><p className={s.source}><Evidence file="donor-candidate-complete-ledger.csv">See every named donor’s recorded gifts</Evidence>.</p></div></aside>
    </section>

    <section className={s.chapter} id="money-left"><ChapterHeading number="06" label="Resources remaining">Money raised is not<br/>money left to spend.</ChapterHeading><div className={s.body}><p><strong>Arnold has {money(arnold.account!.endingCashCents)} in reported cash on hand; Green has {money(green.account!.endingCashCents)}.</strong> Money raised and money still in the account are different questions.</p><p>More cash on hand can mean more resources for the closing weeks. It does not tell us whose earlier spending worked.</p></div><ReservesChart /><div className={s.body}><p>Zimmerman also has <strong>{money(zimmerman.account!.outstandingLoanCents)} in reported outstanding loans</strong>. Debt is separate from cash on hand.</p><p>The balances come from committee reports, not bank audits. Unpaid bills and loans may reduce what campaigns can actually spend.</p><p>Our <Link href={`${BASE}/suppliers`}>supplier investigation</Link> shows who received the 2,441 reported payments from these campaigns.</p></div></section>

    <section className={s.chapter} id="auditor"><ChapterHeading number="07" label="Portland auditor">A different scale.<br/>No fundraising contest to rank.</ChapterHeading><div className={s.body}><p>The reviewed voter-guide roster has one named auditor candidate, <Link href={rede.href}>Simone Rede</Link>. Her linked committee records {money(rede.cashCents)} in cash contributions and no reviewed City matching receipts in this window. The absence of a recorded payment does not establish program ineligibility.</p><div className={s.auditorStats}><div><strong>{money(rede.cashCents)}</strong><span>{rede.cashRecords} contribution records</span></div><div><strong>{money(rede.account!.endingCashCents)}</strong><span>Official 2026 ending cash</span></div><div><strong>{money(rede.bases.noncash_support.cents)}</strong><span>In-kind support, separate from cash</span></div></div>
      <figure className={s.figure} data-chart="auditor"><figcaption><h3>Most reported cash came from named individual donors.</h3></figcaption>{rede.sources.filter(r => r.cents > 0).sort((a, b) => b.cents - a.cents).map(r => <div className={s.reserveRow} key={r.key}><div className={s.barLabel}><span>{r.label}</span><strong>{money(r.cents)}</strong></div><div className={s.track} aria-hidden="true"><span className={r.key === 'unidentified' ? s.unidentified : r.key === 'individual' ? s.individual : s.other} style={{ width: percent(r.cents, rede.cashCents) }} /></div></div>)}<p className={s.source}>Each bar is a share of {money(rede.cashCents)} in reported cash contributions. <a href={rede.evidenceUrl} download>Contribution evidence</a>.</p></figure><p>Her last recorded cash contribution is June 11. Later empty months are not enough to conclude that she stopped soliciting or receiving money. With no second named candidate on the checked roster, a comparative fundraising leaderboard would add no useful race evidence.</p><p className={s.links}><Link href={`${BASE}/races/portland-auditor`}>Auditor financial profile</Link><Link href="/voters-guide/portland-auditor">Auditor’s responsibilities and platform</Link></p></div></section>

    <section className={s.chapter} id="statewide"><ChapterHeading number="08" label="Beyond Portland">The statewide scale is larger.<br/>The race-level work is not finished.</ChapterHeading><div className={s.body}><p>Oregon’s larger database contains {statewide.rows.toLocaleString()} records from {statewide.filers.toLocaleString()} filing groups. The biggest totals mix candidates and political committees, so they are not a race leaderboard.</p></div><figure className={s.figure} data-chart="statewide"><figcaption><span className={s.kicker}>Statewide snapshot · three largest committee receipt totals</span><h3>Candidate committees and intermediaries sit side by side.</h3></figcaption>{topState.map(c => <div key={c.committee_id} className={s.reserveRow}><div className={s.barLabel}><Link href={`${BASE}/entities/committee:${c.committee_id}`}>{c.name}</Link><strong>{money(c.cash_contributions_cents)}</strong></div><div className={s.track} aria-hidden="true"><span className={s.after} style={{ width: percent(c.cash_contributions_cents, topState[0].cash_contributions_cents) }} /></div></div>)}<p className={s.source}>Money received by these committees, including transfers between committees. This is not a governor-race ranking. <a href="/data/campaign-finance/committees.csv" download>Full committee ledger</a>.</p></figure><div className={s.body}><p>The <Link href={`${BASE}/governor`}>governor’s race investigation</Link> follows the money behind Christine Drazan and Tina Kotek. The <Link href={`${BASE}/statewide`}>statewide investigation</Link> looks at big-picture funding and disclosure. Race-by-race stories elsewhere in Oregon still need more verified candidate links. Federal races require separate FEC data.</p></div>
      <div className={s.coverageGrid}><div><h3>District 3</h3><p>9 of 21 candidate links reviewed. Funding mix, timing, donors and balances are available for those nine.</p><Link href={`${BASE}/races/portland-district-3`}>Covered and missing candidates</Link></div><div><h3>District 4</h3><p>8 of 12 reviewed. Event comparisons are provisional; outside-spending allocations remain incomplete.</p><Link href={`${BASE}/races/portland-district-4`}>Covered and missing candidates</Link></div><div><h3>Other contests</h3><p>Governor: two of three candidates linked, with a full investigation. Auditor: one of one named roster candidates linked. County race narratives remain pending; missing is not zero.</p><Link href={`${BASE}/governor`}>The governor’s race</Link></div></div>
    </section>
    <footer className={s.foot}><p className={s.kicker}>Behind this investigation</p><h2>Explore the numbers behind the story.</h2><p>Every chart links to records you can download. Donors may be unnamed, some candidates are not yet linked to records, and recent filings may change. No donor street addresses are published.</p><div className={s.links}><Link href={`${BASE}/explorer?snapshot=${SNAPSHOT}`}>Explore the source records</Link><Link href={`${BASE}/methodology`}>Read methods and gaps</Link><Link href={`${BASE}/evidence`}>All evidence downloads</Link><a href="/data/campaign-finance/story/story-data.json" download>Chart data and checksums</a><Link href={`${BASE}/api-reference`}>ORESTAR endpoint reference</Link><a href="#story-top">Back to the story</a></div><p className={s.source}>Snapshot {SNAPSHOT}. This investigation will be updated as missing records and candidate links are reviewed.</p></footer>
  </div></article>;
}
