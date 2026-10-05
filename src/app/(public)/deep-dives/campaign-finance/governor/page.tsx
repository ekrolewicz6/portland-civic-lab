import Link from 'next/link';
import { pageMeta } from '@/lib/page-meta';
import { BASE } from '@/lib/campaign-finance/filters';
import {
  governor, governorCandidate, governorCandidates, governorUnlinked, oregonCounties, GOVERNOR_PATH, GOVERNOR_EVIDENCE,
  explorerHref, longDate, longMonthDay, nearestThousand, plural, roundMoney, share, wholeDollars, words, type GovernorCandidate,
} from '@/lib/campaign-finance/governor';
import {
  BothTable, BreadthTiles, Evidence, FundersTable, GiftSizeChart, PayeesChart, PositionChart, SourceMixChart,
  SpendingChart, StateChart, TopSourcesChart, WeeklyChart,
} from '@/components/deep-dives/campaign-finance/governor/GovernorCharts';
import { MoneyInOut, MoneyOverTime } from '@/components/deep-dives/campaign-finance/MoneyOverTime';
import { governorMoney } from '@/lib/campaign-finance/money-lead';
import { currentMoneyTotals } from '@/lib/campaign-finance/query';
import CountyMaps from '@/components/deep-dives/campaign-finance/governor/CountyMaps';
import s from '@/components/deep-dives/campaign-finance/governor/governor.module.css';

export const metadata = pageMeta({
  title: 'The money behind the race for governor',
  description: 'Who funds Christine Drazan and Tina Kotek, when the money arrived, where it came from, what it paid for and how much is left, from Oregon’s public campaign records.',
  path: GOVERNOR_PATH,
  type: 'article',
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const drazan = governorCandidate('christine-drazan')!;
const kotek = governorCandidate('tina-kotek')!;
const smith = governorUnlinked[0];
const total = governorCandidates.reduce((sum, candidate) => sum + candidate.totals.cashCents, 0);
const kind = (candidate: GovernorCandidate, key: string) => candidate.kinds.find(item => item.key === key)!.cents;
const large = (candidate: GovernorCandidate) => candidate.bands.filter(band => band.key === '100k_1m' || band.key === '1m_plus');
const largeCents = (candidate: GovernorCandidate) => large(candidate).reduce((sum, band) => sum + band.cents, 0);
const largeCount = (candidate: GovernorCandidate) => large(candidate).reduce((sum, band) => sum + band.groups, 0);
const overCents = (candidate: GovernorCandidate) => candidate.overCap.individual.cents + candidate.overCap.business.cents;
const through = (candidate: GovernorCandidate, lastMonth: string) => candidate.monthly.filter(month => month.month <= lastMonth).reduce((sum, month) => sum + month.cashCents, 0);
const paidIn = (candidate: GovernorCandidate, months: string[]) => candidate.monthly.filter(month => months.includes(month.month)).reduce((sum, month) => sum + month.paymentCents, 0);
const purpose = (candidate: GovernorCandidate, label: string) => candidate.spending.purposes.find(item => item.label === label)?.cents ?? 0;
const state = (candidate: GovernorCandidate, code: string) => candidate.geography.states.find(item => item.state === code)?.cents ?? 0;
const plain = (name: string) => name.replace(/\s*\(\d+\)$/, '');
const last = (candidate: GovernorCandidate) => candidate.name.split(' ').at(-1)!;
const dga = kotek.topSources.filter(source => source.kind === 'governors');
const jones = drazan.topSources.filter(source => source.name.startsWith('Don H Jones'));
const jackson = drazan.geography.counties.find(county => county.county === 'Jackson')!;
const cape = governor.upstream.find(row => row.committeeId === '33')!;
const agc = governor.upstream.find(row => row.committeeId === '4')!;
const laborIds = new Set(governor.context.reviewedSources.filter(source => source.kind === 'labor').map(source => source.id));
const laborFunders = governor.upstream.filter(row => row.gaveTo === kotek.committeeId && laborIds.has(`committee:${row.committeeId}`));
const laborSmall = laborFunders.filter(row => row.combinedSmallCents * 2 >= row.receiptsCents);
const carpenters = kotek.topSources.find(source => source.id === `committee:${governor.context.tenMillion.committeeId}`)!;
const bothMore = (candidate: GovernorCandidate, other: GovernorCandidate) => governor.both.filter(row => (row.cents as Record<string, number>)[candidate.committeeId] > (row.cents as Record<string, number>)[other.committeeId]).length;
const bothEqual = governor.both.length - bothMore(kotek, drazan) - bothMore(drazan, kotek);
const independent = governor.independent;
const limits = governor.context.limits;
const cap = limits.personPerElectionCents;
const asOf = governor.commonPaymentDate;
const CHAPTERS = [['who-gives', 'Who gives'], ['how-big', 'How big'], ['when', 'When'], ['where', 'Where'], ['behind-the-names', 'Behind the names'], ['what-it-bought', 'What it bought'], ['money-left', 'Money left'], ['what-is-missing', 'What is missing']] as const;

function ChapterHeading({ number, label, children }: { number: string; label: string; children: React.ReactNode }) {
  return <header className={s.chapterHeader}><p className={s.kicker}>{number} / {label}</p><h2>{children}</h2></header>;
}

export default async function GovernorInvestigation() {
  const [lead, statewide] = await Promise.all([governorMoney(), currentMoneyTotals('all')]);
  const throughDay = longDate(lead.end);
  return <article className={s.story} data-governor-snapshot={governor.snapshot}><div className={s.wrap}>
    <header className={s.hero} id="story-top">
      <p className={s.kicker}>The 2026 election · Governor of Oregon</p>
      <h1>The money behind<br />the race for <em>governor.</em></h1>
      <p className={s.lead}>Christine Drazan and Tina Kotek have raised {roundMoney(total)} between them since January 2025, and their campaigns are funded in very different ways. These are the public records of who gave, when the money arrived and what it paid for.</p>
    </header>
    <MoneyOverTime measure="raised" panels={[lead.panel]} end={lead.end} events={governor.events} ranked={false}
      kicker="Cash raised since January 1, 2025" title="How much each candidate has raised, and when"
      howTo="Each line is one campaign’s running total. It steps up on the day money arrives and stops at the campaign’s latest contribution in the records. Numbered markers are the dated events listed under the chart."
      source={<>Cash contributions before refunds, by the date on each filing, through {throughDay}. {smith.name}, the {smith.party} nominee, has no committee in these records, which is missing coverage and does not mean he raised nothing. {governorCandidates.map((candidate, index) => <span key={candidate.candidateId}>{index ? ' · ' : ''}<Link href={explorerHref(candidate.committeeId, '&basis=cash_contribution')}>{last(candidate)}’s contributions</Link></span>)}.</>} />
    <MoneyOverTime measure="paid" panels={[lead.panel]} end={lead.end} events={governor.events} ranked={false}
      kicker="Cash paid out since January 1, 2025" title="How much each candidate has spent, and when"
      howTo="Each line starts at a campaign’s first payment and stops at its latest one in the records. A line that stops early has no later payments on file, either because none were made or because they have not reached these records."
      source={<>Cash payments by the date paid, through {throughDay}. Bills owed and not yet paid are left out. {lead.staleNote} {governorCandidates.map((candidate, index) => <span key={candidate.candidateId}>{index ? ' · ' : ''}<Link href={explorerHref(candidate.committeeId, '&basis=cash_payment')}>{last(candidate)}’s payments</Link></span>)}.</>} />
    <MoneyInOut kicker="Money in and money out since January 1, 2025" title="How much has moved, and where the payments went"
      howTo="Each bar is all of one group’s payments, split by the address of whoever was paid."
      rows={[
        ...lead.candidates.map(({ candidate, totals, stale }) => ({ key: candidate.candidateId, label: candidate.name, totals,
          note: stale ? <>These records have no payments by this committee after {longDate(totals.latestPayment!)}, so its money out is incomplete.</> : undefined })),
        { key: 'statewide', label: 'Every committee in Oregon’s campaign records', totals: statewide, note: <>{statewide.committees.toLocaleString('en-US')} committees, including candidates, ballot measures, parties and political action committees. {wholeDollars(statewide.fromCommitteesCents)} of the money in came from other committees, so that money is counted each time it moves.</> },
      ]}
      source={<>The address is the payee’s. A media firm in another state may spend what it is paid on Oregon stations, and filings do not show that second step. Records run through {throughDay}, and late filings can be missing.</>} />
    <div className={s.doorRow}>
      <Link className={s.door} href="/voters-guide/oregon-governor"><span>Voter guide: Governor<small>Positions, records and the choices ahead</small></span><span aria-hidden="true">↗</span></Link>
      <Link className={s.door} href={BASE}><span>Portland council money<small>The same charts for Districts 3 and 4</small></span><span aria-hidden="true">↗</span></Link>
    </div>
    <p className={s.doorNote}>Candidates are listed alphabetically. The charts above read the current records, and the chapters below use records through {longDate(governor.end)}.</p>
    <p className={s.byline}>Portland Civic Lab · Analysis dated {longDate(governor.reviewedAt)} · Records through {longDate(governor.end)}</p>
    <nav className={s.sectionNav} aria-label="Chapters in this investigation">{CHAPTERS.map(([id, label], index) => <a key={id} href={`#${id}`}><span>0{index + 1}</span>{label}</a>)}</nav>

    <section className={s.chapter} id="who-gives"><ChapterHeading number="01" label="Who gives">Two campaigns built from different kinds of money.</ChapterHeading>
      <div className={s.body}>
        <p><strong>Named individuals supplied {share(kind(drazan, 'individual'), drazan.totals.cashCents)} of Drazan’s cash and businesses another {share(kind(drazan, 'business'), drazan.totals.cashCents)}. Kotek’s largest share, at least {share(kind(kotek, 'labor'), kotek.totals.cashCents)}, came from unions and their committees, and {share(kind(kotek, 'governors'), kotek.totals.cashCents)} came from two national Democratic governors’ groups.</strong></p>
        <p>Kotek has raised more in total, {roundMoney(kotek.totals.cashCents)} to Drazan’s {roundMoney(drazan.totals.cashCents)}. Drazan has raised more from individuals, {roundMoney(kind(drazan, 'individual'))} to {roundMoney(kind(kotek, 'individual'))}, and more from businesses giving directly, {roundMoney(kind(drazan, 'business'))} to {roundMoney(kind(kotek, 'business'))}.</p>
      </div>
      <SourceMixChart />
      <div className={s.body}>
        <p>Kotek’s two largest sources are the {plain(dga[0].name)}, at {roundMoney(dga[0].cents)}, and the {plain(dga[1].name)}, at {roundMoney(dga[1].cents)}. Drazan’s filings show {drazan.totals.republicanGovernorsCents > 0 ? `${roundMoney(drazan.totals.republicanGovernorsCents)} from` : 'no contribution from'} the Republican Governors Association in this period. Her largest source is reported as {plain(drazan.topSources[0].name)} of {drazan.topSources[0].city}, at {roundMoney(drazan.topSources[0].cents)}.</p>
      </div>
      <TopSourcesChart />
    </section>

    <section className={s.chapter} id="how-big"><ChapterHeading number="02" label="How big">More than half of each campaign’s money came from sources that gave $100,000 or more.</ChapterHeading>
      <div className={s.body}>
        <p><strong>Kotek received $100,000 or more from {largeCount(kotek)} sources, and together they account for {share(largeCents(kotek), kotek.totals.cashCents)} of her cash. Drazan received that much from {largeCount(drazan)} sources, who account for {share(largeCents(drazan), drazan.totals.cashCents)} of hers.</strong></p>
      </div>
      <GiftSizeChart />
      <div className={s.body}><p>Both campaigns also have thousands of smaller donors. They are a large share of the names and a small share of the dollars.</p></div>
      <BreadthTiles />
      <aside className={s.callout} aria-labelledby="limits-heading">
        <p className={s.kicker} id="limits-heading">Starting in 2027</p>
        <div>
          <p>Oregon’s first contribution limits take effect on {longDate(limits.operative)}, so under current law this is the last race for governor run without them. From then on a candidate for governor may accept no more than {wholeDollars(cap)} per election from a person. <a href={limits.source}>The law</a> counts both individuals and businesses as persons, and it treats the primary and the general as separate elections.</p>
          <p>In these records, {drazan.overCap.individual.groups} individuals and {drazan.overCap.business.groups} businesses gave Drazan more than {wholeDollars(2 * cap)}, the most one person could give across both elections under the new rule. Together they gave {roundMoney(overCents(drazan))}, or {share(overCents(drazan), drazan.totals.cashCents)} of her cash. For Kotek the count is {kotek.overCap.individual.groups} individuals and {kotek.overCap.business.groups} businesses, who gave {roundMoney(overCents(kotek))}, or {share(overCents(kotek), kotek.totals.cashCents)}. Committees and membership organizations face separate limits that depend on their kind, so they are left out of this count.</p>
        </div>
      </aside>
    </section>

    <section className={s.chapter} id="when"><ChapterHeading number="03" label="When">Kotek’s biggest weeks were built on a few large checks. Drazan’s three biggest have all come since the end of August.</ChapterHeading>
      <div className={s.body}>
        <p><strong>Kotek’s biggest week began {longMonthDay(kotek.peaks[0].start)}, when the {plain(kotek.peaks[0].top[0].name)} gave {roundMoney(kotek.peaks[0].top[0].cents)}. Drazan’s biggest week began {longMonthDay(drazan.peaks[0].start)}, when {plain(drazan.peaks[0].top[0].name)}, a contractors’ committee, gave {roundMoney(drazan.peaks[0].top[0].cents)}.</strong></p>
        <p>By the end of September 2025, before either had announced, Kotek’s committee had raised {roundMoney(through(kotek, '2025-09'))} since January and Drazan’s had raised {roundMoney(through(drazan, '2025-09'))}. Drazan’s committee was registered for a legislative seat until she <a href={drazan.announcedSource}>entered the race on {longDate(drazan.announced)}</a>. Kotek <a href={kotek.announcedSource}>announced on {longDate(kotek.announced)}</a>.</p>
      </div>
      <WeeklyChart />
      <div className={s.body}><p>Both won their primaries on May 19. Drazan took the Republican nomination with 41% of the vote in a contested field, and Kotek won the Democratic nomination with 84%, according to <a href={governor.context.primary.source}>results reported by the Oregon Capital Chronicle</a>.</p></div>
    </section>

    <section className={s.chapter} id="where"><ChapterHeading number="04" label="Where">Most of Drazan’s money has an Oregon address. Almost half of Kotek’s comes from other states.</ChapterHeading>
      <div className={s.body}>
        <p><strong>Oregon addresses account for {share(drazan.geography.oregonCents, drazan.totals.namedCents)} of Drazan’s named money. For Kotek the share is {share(kotek.geography.oregonCents, kotek.totals.namedCents)}, and {roundMoney(state(kotek, 'DC'))} came from Washington, D.C., where national unions and the Democratic Governors Association have their offices.</strong></p>
      </div>
      <StateChart />
      <div className={s.body}>
        <p>Counting only individual donors narrows the gap in where the money comes from. Oregonians gave Kotek {roundMoney(kotek.geography.individuals.oregon.cents)} in {kotek.geography.individuals.oregon.records.toLocaleString('en-US')} gifts, which is {share(kotek.geography.individuals.oregon.cents, kind(kotek, 'individual'))} of her money from individuals. They gave Drazan {roundMoney(drazan.geography.individuals.oregon.cents)} in {drazan.geography.individuals.oregon.records.toLocaleString('en-US')} gifts, or {share(drazan.geography.individuals.oregon.cents, kind(drazan, 'individual'))}.</p>
      </div>
      <figure className={s.figure} data-chart="counties">
        <figcaption><span className={s.kicker}>Gifts from named individuals with Oregon addresses</span><h3>Where in Oregon the individual donors are</h3>
          <p className={s.howTo}>Darker counties gave more. Switch to the number of gifts to see where donors are without one large check changing the picture.</p></figcaption>
        <CountyMaps
          width={oregonCounties.width} height={oregonCounties.height}
          shapes={oregonCounties.counties.map(({ fips, name, d }) => ({ fips, name, d }))}
          candidates={governorCandidates.map(candidate => ({ candidateId: candidate.candidateId, name: candidate.name, href: candidate.href, counties: candidate.geography.counties, oregonCents: candidate.geography.individuals.oregon.cents, oregonRecords: candidate.geography.individuals.oregon.records }))}
        />
        <p className={s.source}>Two entries under the name Don H Jones of Ashland total {roundMoney(jones.reduce((sum, source) => sum + source.cents, 0))}, which is most of Drazan’s {roundMoney(jackson.cents)} from Jackson County. Counties are assigned from the ZIP code on each filing using Census boundaries, and a ZIP code that crosses a county line goes to the county holding most of its land. {wholeDollars(kotek.geography.countyUndetermined.cents + drazan.geography.countyUndetermined.cents)} could not be placed. Street addresses are never published. <Evidence file="oregon-counties.csv">Download all 36 counties</Evidence>.</p>
      </figure>
    </section>

    <section className={s.chapter} id="behind-the-names"><ChapterHeading number="05" label="Behind the names">Who funds the committees that fund the candidates?</ChapterHeading>
      <div className={s.body}>
        <p><strong>A committee’s name rarely says where its money started. Its own filings often do.</strong></p>
        <p>{words(laborSmall.length, true)} of the {words(laborFunders.length)} union committees on Kotek’s list took in most of their money as gifts of $100 or less, which are reported in combined entries without names. {plain(cape.name)}, the committee of SEIU Local 503, reported {roundMoney(cape.combinedSmallCents)} of its {roundMoney(cape.receiptsCents)} that way. The contractors’ committee that gave Drazan {roundMoney(agc.gaveCents)} received {wholeDollars(agc.topNamed[0].cents)} of its {wholeDollars(agc.receiptsCents)} from one trade association chapter.</p>
      </div>
      <FundersTable />
      <div className={s.body}>
        <p>One committee on that list changed size during these records. On {longDate(governor.context.tenMillion.date)} the {governor.context.tenMillion.reportedSource} gave {roundMoney(governor.context.tenMillion.cents)} to {plain(carpenters.name)}. That committee has given Kotek {roundMoney(carpenters.cents)} in these records, most recently on {longMonthDay(carpenters.lastDate)}. Ron Rowlett, the union’s director of government relations, <a href={governor.context.tenMillion.source}>told OPB</a> the money “{governor.context.tenMillion.quote}.” These records cannot show how it will be spent.</p>
        <p>{words(governor.both.length, true)} sources gave to both campaigns. {words(bothMore(kotek, drazan), true)} of them gave more to Kotek, {words(bothMore(drazan, kotek))} gave more to Drazan and {words(bothEqual)} gave the same amount to each.</p>
      </div>
      <BothTable />
    </section>

    <section className={s.chapter} id="what-it-bought"><ChapterHeading number="06" label="What it bought">Advertising is the largest expense for both campaigns.</ChapterHeading>
      <div className={s.body}>
        <p><strong>Drazan’s committee has reported {roundMoney(drazan.totals.paidCents)} in payments, including {roundMoney(purpose(drazan, 'Broadcast advertising (radio, TV)'))} for broadcast advertising. These records hold {roundMoney(kotek.totals.paidCents)} in payments by Kotek’s committee, including {roundMoney(purpose(kotek, 'Broadcast advertising (radio, TV)'))} for broadcast, and none dated after {longDate(kotek.totals.latestPaymentDate)}.</strong></p>
        <p>Kotek’s later payments exist. <a href={governor.context.laterBalances.source}>OPB reported on {longDate(governor.context.laterBalances.date)}</a> that her cash on hand had fallen to {roundMoney(governor.context.laterBalances.kotekCents)}, well below the state’s September 27 figure. Her committee reports payments about 30 days after making them, and our latest download covered only transactions dated September 28 or later, so a month of her spending has not reached these records.</p>
      </div>
      <SpendingChart />
      <div className={s.body}>
        <p>Drazan paid out {roundMoney(paidIn(drazan, ['2026-04', '2026-05']))} in April and May 2026, the two months around the primary. Kotek paid out {roundMoney(paidIn(kotek, ['2026-04', '2026-05']))} in the same months.</p>
      </div>
      <PayeesChart />
      <div className={s.body}><p>A payment is dated when the campaign pays it. An advertising payment can cover airtime that runs weeks later, so the dates here show when money left the account and say less about when voters saw the ads.</p></div>
    </section>

    <section className={s.chapter} id="money-left"><ChapterHeading number="07" label="Money left">How much each campaign has left depends on which day you ask.</ChapterHeading>
      <div className={s.body}>
        <p><strong>On {longDate(asOf)}, the last day these records have payments for both campaigns, Kotek had about {roundMoney(kotek.likeForLike.cashPositionCents)} in cash and Drazan about {roundMoney(drazan.likeForLike.cashPositionCents)}.</strong></p>
      </div>
      <PositionChart />
      <div className={s.body}>
        <p>The two committees report on different schedules. Since June, Drazan’s has filed its payments a median of {plural(drazan.totals.medianPaymentFilingLagDays ?? 0, 'day')} after making them, and Kotek’s a median of {plural(kotek.totals.medianPaymentFilingLagDays ?? 0, 'day')} after. <a href={governor.context.filingDeadlines.source}>State law</a> allows 30 days for most of the year and seven days in the final six weeks before an election.</p>
        <p>That timing shaped the official balances. On {longDate(kotek.account.retrievedAt)} the state’s summaries showed {roundMoney(kotek.account.endingCashCents)} for Kotek and about {nearestThousand(drazan.account.endingCashCents)} for Drazan, at a point when Kotek’s September spending was not yet on file. <a href={governor.context.laterBalances.source}>OPB reported on {longDate(governor.context.laterBalances.date)}</a>, after more filings, that Kotek had {roundMoney(governor.context.laterBalances.kotekCents)} on hand and Drazan roughly {roundMoney(governor.context.laterBalances.drazanCents)}.</p>
      </div>
    </section>

    <section className={s.chapter} id="what-is-missing"><ChapterHeading number="08" label="What is missing">What these records leave out.</ChapterHeading>
      <ul className={s.gaps}>
        <li><h3>{smith.name}</h3><p>The {smith.party} nominee has no committee in these records. <a href={smith.linkSource}>A candidate who expects to raise and spend $750 or less in a year</a> does not have to form one, so his absence here does not mean he raised nothing.</p></li>
        <li><h3>Outside spending</h3><p>Groups can spend on their own to support or oppose a candidate. The state’s export does not name the target of that spending, and our review of the detail records is incomplete, with {independent.parsedRecords} of {independent.searchedRecords} flagged records read so far. {independent.allocations.length === 1 ? <>One of them names a candidate in this race: a {wholeDollars(independent.allocations[0].cents)} payment by {independent.allocations[0].spender} in {independent.allocations[0].position} to {independent.allocations[0].target} on {longDate(independent.allocations[0].date)}.</> : <>{independent.allocations.length} of them name a candidate in this race.</>}</p></li>
        <li><h3>Earlier money</h3><p>The records start on January 1, 2025. Kotek’s committee opened that year with {wholeDollars(kotek.account.openingCash2025Cents)} already in the bank and Drazan’s with {wholeDollars(drazan.account.openingCash2025Cents)}, and both committees existed before this race.</p></li>
        <li><h3>Late filings</h3><p>This copy joins a complete pull on September 27 with two later downloads that searched by transaction date. A record dated before September 28 and filed after that pull can be missing, which is why Kotek’s payments stop on August 26. The newest days can also still change.</p></li>
        <li><h3>Names</h3><p>Donors are grouped by the exact name and address on each filing. One person reported two ways counts as two sources, so the donor counts are close estimates.</p></li>
        <li><h3>Goods and services</h3><p>Support given directly as goods or services is tracked separately from cash. Kotek reported {wholeDollars(kotek.totals.inKindCents)} of it and Drazan {wholeDollars(drazan.totals.inKindCents)}.</p></li>
      </ul>
    </section>

    <footer className={s.foot}>
      <p className={s.kicker}>Behind this investigation</p>
      <h2>Check the numbers yourself.</h2>
      <p>Every chart links to records you can download, and the explorer shows each contribution and payment behind them. Fundraising totals describe money. They do not measure voter support or predict a result.</p>
      <div className={s.links}>
        {governorCandidates.map(candidate => <Link key={candidate.candidateId} href={explorerHref(candidate.committeeId)}>All of {last(candidate)}’s records</Link>)}
        <a href={`${GOVERNOR_EVIDENCE}data.json`} download>Chart data and checksums</a>
        <Link href={`${BASE}/methodology#governor`}>Methods and definitions</Link>
        <Link href="/voters-guide/oregon-governor">Voter guide: Governor</Link>
        <Link href={BASE}>Portland council money</Link>
        <a href="#story-top">Back to the top</a>
      </div>
      <p className={s.source}>Snapshot {governor.snapshot}. Committee links were reviewed against ORESTAR statements of organization retrieved {longDate(kotek.linkRetrievedAt)}.</p>
    </footer>
  </div></article>;
}
