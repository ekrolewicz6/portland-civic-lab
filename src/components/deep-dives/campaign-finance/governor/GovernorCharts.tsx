import 'server-only';
import Link from 'next/link';
import { money, shortMoney } from '@/lib/campaign-finance/filters';
import {
  governor, governorCandidates, GOVERNOR_EVIDENCE, KIND_ORDER, KIND_SHORT, KIND_SINGULAR, explorerHref, longDate, longMonthDay, monthDay, share, wholeDollars,
  type GovernorCandidate,
} from '@/lib/campaign-finance/governor';
import s from './governor.module.css';

const candidates = governorCandidates;
const maxCash = Math.max(...candidates.map(c => c.totals.cashCents));
const width = (part: number, whole: number) => `${Math.max(0, 100 * part / whole)}%`;
const plain = (name: string) => name.replace(/\s*\(\d+\)$/, '');
const place = (city: string, state: string) => [city, state].filter(Boolean).join(', ');
const STATE_NAMES: Record<string, string> = { DC: 'Washington, D.C.', IN: 'Indiana', CA: 'California', WA: 'Washington', MO: 'Missouri', IL: 'Illinois', NV: 'Nevada', CO: 'Colorado', ID: 'Idaho', ND: 'North Dakota', MT: 'Montana', AZ: 'Arizona', TX: 'Texas', FL: 'Florida', NY: 'New York', MA: 'Massachusetts', WI: 'Wisconsin' };

export function Evidence({ file, children }: { file: string; children: React.ReactNode }) {
  return <a href={`${GOVERNOR_EVIDENCE}${file}`} download>{children}</a>;
}
function Name({ candidate }: { candidate: GovernorCandidate }) {
  return <Link href={candidate.href}>{candidate.name}</Link>;
}

export function SourceMixChart() {
  return <figure className={s.figure} data-chart="source-mix">
    <figcaption><span className={s.kicker}>Cash contributions by kind of source</span><h3>Where each campaign’s money comes from</h3>
      <p className={s.howTo}>Each bar is one campaign’s cash on the same dollar scale, split by who gave it. The amounts under each bar add up to its total.</p></figcaption>
    <div className={s.scale} aria-hidden="true"><span>$0</span><span>{shortMoney(maxCash / 2)}</span><span>{shortMoney(maxCash)}</span></div>
    <div className={s.mixRows}>{candidates.map(candidate => {
      const kinds = KIND_ORDER.map(key => candidate.kinds.find(kind => kind.key === key)!).filter(kind => kind.cents > 0);
      return <div key={candidate.candidateId} data-candidate={candidate.candidateId}>
        <div className={s.mixHead}><Name candidate={candidate} /><strong>{wholeDollars(candidate.totals.cashCents)}</strong></div>
        <div className={s.mixTrack} role="img" aria-label={`${candidate.name}: ${kinds.map(kind => `${KIND_SHORT[kind.key]} ${wholeDollars(kind.cents)}`).join('; ')}`}>
          {kinds.map(kind => <span key={kind.key} className={s[`kind-${kind.key}`]} style={{ width: width(kind.cents, maxCash) }} />)}
        </div>
        <div className={s.mixParts}>{kinds.map(kind => <div key={kind.key}><i className={s[`kind-${kind.key}`]} aria-hidden="true" /><span>{KIND_SHORT[kind.key]}<b>{wholeDollars(kind.cents)}</b><small>{share(kind.cents, candidate.totals.cashCents)} of cash</small></span></div>)}</div>
      </div>;
    })}</div>
    <details className={s.details}><summary>How we grouped the sources</summary>
      <p>Individuals, businesses and unions follow the contributor type on each filing. Committees and associations that gave $50,000 or more to either campaign are grouped by sponsor when the sponsor is clear from the name, from the committee’s own filings or from a cited source. Smaller committees stay under “other committees and organizations,” so the union and trade figures are minimums.</p>
      <p>Gifts of $100 or less can be reported in combined entries with no names. They are counted in the totals and cannot be traced to people.</p>
      <ul>{governor.context.reviewedSources.filter(source => source.kind !== 'other').map(source => <li key={source.id}>{plain(source.name)}: {source.basis}</li>)}</ul>
    </details>
    <p className={s.source}>Cash contributions from January 1, 2025 through {longDate(governor.end)}, before refunds. <Evidence file="source-groups.csv">Download every source and its group</Evidence>.</p>
  </figure>;
}

export function TopSourcesChart() {
  return <figure className={s.figure} data-chart="top-sources">
    <figcaption><span className={s.kicker}>Ten largest sources for each campaign</span><h3>The biggest checks, by name</h3>
      <p className={s.howTo}>Bars in both lists use the same dollar scale. Colors match the groups in the chart above.</p></figcaption>
    <div className={s.pair}>{candidates.map(candidate => {
      const rows = candidate.topSources.slice(0, 10);
      const top = Math.max(...candidates.map(c => c.topSources[0].cents));
      return <div className={s.panel} key={candidate.candidateId}>
        <div className={s.panelHead}><Name candidate={candidate} /><strong>{share(candidate.totals.topTenCents, candidate.totals.cashCents)} of cash from these ten</strong></div>
        <ol className={s.rank}>{rows.map(row => <li key={row.id}>
          <div className={s.rankLabel}><span>{plain(row.name)}</span><strong>{wholeDollars(row.cents)}</strong></div>
          <p className={s.rankMeta}>{KIND_SINGULAR[row.kind]} · {place(row.city, row.state)} · {row.records === 1 ? '1 contribution' : `${row.records} contributions`}</p>
          <div className={s.rankTrack} aria-hidden="true"><span className={s[`kind-${row.kind}`]} style={{ width: width(row.cents, top) }} /></div>
        </li>)}</ol>
      </div>;
    })}</div>
    <p className={s.source}>Names appear as the campaigns reported them. The same donor can appear under more than one spelling, and entries are never merged by name alone. <Evidence file="source-groups.csv">Download all sources</Evidence>.</p>
  </figure>;
}

const BAND_COLORS: Record<string, string> = { under_1k: '#cfe0d4', '1k_10k': '#9fc3ad', '10k_100k': '#5f9a80', '100k_1m': '#2e715d', '1m_plus': '#173c31' };
export function GiftSizeChart() {
  return <figure className={s.figure} data-chart="gift-sizes">
    <figcaption><span className={s.kicker}>Cash by how much each source gave in total</span><h3>How much comes from large givers?</h3>
      <p className={s.howTo}>Each source is placed by its total giving to that campaign since January 2025. Darker green means larger givers.</p></figcaption>
    <div className={s.scale} aria-hidden="true"><span>$0</span><span>{shortMoney(maxCash / 2)}</span><span>{shortMoney(maxCash)}</span></div>
    <div className={s.mixRows}>{candidates.map(candidate => {
      const bands = [...candidate.bands].reverse();
      return <div key={candidate.candidateId} data-candidate={candidate.candidateId}>
        <div className={s.mixHead}><Name candidate={candidate} /><strong>{wholeDollars(candidate.totals.cashCents)}</strong></div>
        <div className={s.mixTrack} role="img" aria-label={`${candidate.name}: ${bands.map(band => `${band.label}, ${wholeDollars(band.cents)} from ${band.groups} sources`).join('; ')}; combined gifts of $100 or less, ${wholeDollars(candidate.totals.smallCents)}`}>
          {bands.map(band => <span key={band.key} style={{ width: width(band.cents, maxCash), background: BAND_COLORS[band.key] }} />)}
          <span className={s['kind-small']} style={{ width: width(candidate.totals.smallCents, maxCash) }} />
        </div>
        <div className={s.mixParts}>
          {bands.map(band => <div key={band.key}><i style={{ background: BAND_COLORS[band.key] }} aria-hidden="true" /><span>{band.label}<b>{wholeDollars(band.cents)}</b><small>{band.groups.toLocaleString('en-US')} {band.groups === 1 ? 'source' : 'sources'} · {share(band.cents, candidate.totals.cashCents)}</small></span></div>)}
          <div><i className={s['kind-small']} aria-hidden="true" /><span>Combined gifts of $100 or less<b>{wholeDollars(candidate.totals.smallCents)}</b><small>Givers not named · {share(candidate.totals.smallCents, candidate.totals.cashCents)}</small></span></div>
        </div>
      </div>;
    })}</div>
    <p className={s.source}>A source is one reported name and address. Its total can include several contributions. <Evidence file="source-groups.csv">Download the source totals</Evidence>.</p>
  </figure>;
}

export function BreadthTiles() {
  return <div>{candidates.map(candidate => {
    const small = candidate.bands.find(band => band.key === 'under_1k')!;
    return <div className={s.tileGroup} key={candidate.candidateId}><p>{candidate.name}</p>
      <div className={s.tiles}>
        <div className={s.tile}><strong>{candidate.totals.cashRecords.toLocaleString('en-US')}</strong><span>cash contributions on file</span></div>
        <div className={s.tile}><strong>{candidate.totals.individualGroups.toLocaleString('en-US')}</strong><span>named individual donors, as reported</span></div>
        <div className={s.tile}><strong>{small.groups.toLocaleString('en-US')}</strong><span>named sources who gave under $1,000 in total</span></div>
        <div className={s.tile}><strong>{wholeDollars(candidate.totals.smallCents)}</strong><span>in combined gifts of $100 or less</span></div>
      </div></div>;
  })}</div>;
}

/* Time charts */
const weeks = candidates[0].weekly.map(week => week.week);
const firstDay = Date.parse(`${weeks[0]}T00:00:00Z`);
const lastDay = Date.parse(`${weeks.at(-1)}T00:00:00Z`) + 7 * 86400000;
const xOf = (iso: string) => (Date.parse(`${iso}T00:00:00Z`) - firstDay) / (lastDay - firstDay);
const quarterTicks = weeks.reduce<{ label: string; x: number; minor: boolean }[]>((ticks, week, index) => {
  const month = Number(week.slice(5, 7));
  const previous = index ? Number(weeks[index - 1].slice(5, 7)) : 0;
  if (month !== previous && [1, 4, 7, 10].includes(month)) {
    ticks.push({ label: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${week}T12:00:00Z`)), x: index / weeks.length, minor: month !== 1 });
  }
  return ticks;
}, []);
const LINE = ['#9a6418', '#163b30'];

export function CumulativeChart() {
  const series = candidates.map(candidate => {
    let running = 0;
    return candidate.weekly.map(week => (running += week.cents));
  });
  const top = Math.ceil(Math.max(...series.map(values => values.at(-1)!)) / 200_000_000) * 200_000_000;
  const gridlines = Array.from({ length: top / 200_000_000 + 1 }, (_, index) => index * 200_000_000);
  const path = (values: number[]) => values.map((value, index) => `${index === 0 ? 'M' : 'L'}${(1000 * (index + 1) / weeks.length).toFixed(1)},${(300 - 300 * value / top).toFixed(1)}`).join('');
  return <figure className={s.figure} data-chart="cumulative">
    <figcaption><span className={s.kicker}>Running total of cash contributions</span><h3>How each campaign’s total grew</h3>
      <p className={s.howTo}>Each line adds up one campaign’s cash week by week. Numbered markers are the dated events listed under the chart.</p></figcaption>
    <div className={s.legend}>{candidates.map((candidate, index) => <span key={candidate.candidateId}><i className={index === 0 ? s.dashKey : undefined} style={{ color: LINE[index], background: index === 0 ? undefined : LINE[index], height: 4, width: 26 }} aria-hidden="true" />{candidate.name}, {wholeDollars(series[index].at(-1)!)} by {longMonthDay(governor.end)}</span>)}</div>
    <div className={s.timeBlock}>
      <div className={s.yLabels} aria-hidden="true">{gridlines.map(value => <span key={value} style={{ top: `${100 - 100 * value / top}%` }}>{value === 0 ? '$0' : `$${value / 100_000_000}M`}</span>)}</div>
      <div className={s.timeArea}>
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" role="img" aria-label={candidates.map((candidate, index) => `${candidate.name} reached ${wholeDollars(series[index].at(-1)!)} by ${longDate(governor.end)}`).join('. ')}>
          {gridlines.slice(1).map(value => <line key={value} x1="0" x2="1000" y1={300 - 300 * value / top} y2={300 - 300 * value / top} stroke="#dde3db" vectorEffect="non-scaling-stroke" />)}
          {governor.events.map(event => <line key={event.id} x1={1000 * xOf(event.date)} x2={1000 * xOf(event.date)} y1="0" y2="300" stroke="#7d8f84" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />)}
          {series.map((values, index) => <path key={candidates[index].candidateId} d={path(values)} fill="none" stroke={LINE[index]} strokeWidth={index === 0 ? 3 : 3} strokeDasharray={index === 0 ? '9 5' : undefined} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />)}
        </svg>
        {governor.events.map((event, index) => <span key={event.id} className={s.flag} style={{ left: `${100 * xOf(event.date)}%` }} aria-hidden="true">{index + 1}</span>)}
      </div>
      <div className={s.xLabels} aria-hidden="true">{quarterTicks.map(tick => <span key={tick.label} className={tick.minor ? s.xMinor : undefined} style={{ left: `${100 * tick.x}%` }}>{tick.label}</span>)}</div>
    </div>
    <ol className={s.events}>{governor.events.map((event, index) => <li key={event.id}><b aria-hidden="true">{index + 1}</b><span><time dateTime={event.date}>{longDate(event.date)}</time><a href={event.source}>{event.label}</a></span></li>)}</ol>
    <p className={s.source}>Contributions are placed by the date on the filing. The last weeks can still change as late filings arrive. <Evidence file="weekly.csv">Download the weekly amounts</Evidence>.</p>
  </figure>;
}

export function WeeklyChart() {
  const top = Math.max(...candidates.flatMap(candidate => candidate.weekly.map(week => week.cents)));
  const ceiling = Math.ceil(top / 50_000_000) * 50_000_000;
  const gridlines = [0, ceiling / 2, ceiling];
  return <figure className={s.figure} data-chart="weekly">
    <figcaption><span className={s.kicker}>Cash contributions by week</span><h3>When the money arrived</h3>
      <p className={s.howTo}>One bar is one Monday-to-Sunday week. Both panels run from $0 to {shortMoney(ceiling)}, and gold marks each campaign’s biggest week.</p></figcaption>
    <div className={s.weekPanels}>{candidates.map(candidate => {
      const peak = candidate.peaks[0];
      return <div className={s.weekPanel} key={candidate.candidateId} data-candidate={candidate.candidateId}>
        <div className={s.weekHead}><Name candidate={candidate} /><span>Biggest week: {monthDay(peak.start)} to {monthDay(peak.end)}, {peak.start.slice(0, 4)} · <strong>{wholeDollars(peak.cents)}</strong></span></div>
        <div className={s.timeBlock}>
          <div className={s.yLabels} aria-hidden="true">{gridlines.map(value => <span key={value} style={{ top: `${100 - 100 * value / ceiling}%` }}>{value === 0 ? '$0' : shortMoney(value)}</span>)}</div>
          <div className={s.timeArea}>
            <svg viewBox={`0 0 ${weeks.length * 10} 100`} preserveAspectRatio="none" role="img" aria-label={`${candidate.name}, weekly cash contributions. Biggest week ${wholeDollars(peak.cents)} starting ${longDate(peak.start)}.`}>
              <line x1="0" x2={weeks.length * 10} y1="50" y2="50" stroke="#dde3db" vectorEffect="non-scaling-stroke" />
              {candidate.weekly.map((week, index) => <rect key={week.week} x={index * 10 + 1.5} width="7" y={100 - 100 * week.cents / ceiling} height={100 * week.cents / ceiling} fill={week.week === peak.start ? '#bb8125' : '#286955'}><title>{`Week of ${longDate(week.week)}: ${money(week.cents)}`}</title></rect>)}
            </svg>
          </div>
          <div className={s.xLabels} aria-hidden="true">{quarterTicks.map(tick => <span key={tick.label} className={tick.minor ? s.xMinor : undefined} style={{ left: `${100 * tick.x}%` }}>{tick.label}</span>)}</div>
        </div>
      </div>;
    })}</div>
    <div className={s.legend}><span><i className={s.swatchPeak} aria-hidden="true" />Biggest week</span></div>
    <h4>What made up each campaign’s three biggest weeks</h4>
    <div className={s.peakGrid}>{candidates.map(candidate => <div key={candidate.candidateId}>
      <div className={s.panelHead}><span>{candidate.name}</span></div>
      {candidate.peaks.map(peak => <div className={s.peakWeek} key={peak.start}>
        <div><span>{monthDay(peak.start)} to {monthDay(peak.end)}, {peak.start.slice(0, 4)}</span><strong>{wholeDollars(peak.cents)}</strong></div>
        <ul>{peak.top.map(item => <li key={item.name}><span>{plain(item.name)}</span><span>{wholeDollars(item.cents)}</span></li>)}</ul>
        <p className={s.rankMeta}><Link href={explorerHref(candidate.committeeId, `&start=${peak.start}&end=${peak.end}&basis=cash_contribution`)}>See all {peak.records.toLocaleString('en-US')} contributions that week</Link></p>
      </div>)}
    </div>)}</div>
    <p className={s.source}>Weeks use the dates reported in the filings. Combined entries of small gifts carry one date for many gifts. <Evidence file="weekly.csv">Download the weekly amounts</Evidence>.</p>
  </figure>;
}

export function StateChart() {
  return <figure className={s.figure} data-chart="states">
    <figcaption><span className={s.kicker}>Cash by the address on the filing</span><h3>How much came from Oregon?</h3>
      <p className={s.howTo}>Green is money from Oregon addresses and gold is money from other states, on one dollar scale. Combined small gifts carry no address.</p></figcaption>
    <div className={s.legend}><span><i className={s['kind-individual']} aria-hidden="true" />Oregon address</span><span><i className={s['kind-business']} aria-hidden="true" />Address in another state</span><span><i className={s['kind-small']} aria-hidden="true" />Combined small gifts, no address</span></div>
    <div className={s.scale} aria-hidden="true"><span>$0</span><span>{shortMoney(maxCash / 2)}</span><span>{shortMoney(maxCash)}</span></div>
    <div className={s.mixRows}>{candidates.map(candidate => {
      const geo = candidate.geography;
      return <div key={candidate.candidateId} data-candidate={candidate.candidateId}>
        <div className={s.mixHead}><Name candidate={candidate} /><strong>{share(geo.oregonCents, candidate.totals.namedCents)} of named money from Oregon</strong></div>
        <div className={s.mixTrack} role="img" aria-label={`${candidate.name}: ${wholeDollars(geo.oregonCents)} from Oregon addresses, ${wholeDollars(geo.outsideCents)} from other states, ${wholeDollars(candidate.totals.smallCents)} in combined small gifts`}>
          <span className={s['kind-individual']} style={{ width: width(geo.oregonCents, maxCash) }} />
          <span className={s['kind-business']} style={{ width: width(geo.outsideCents + geo.unknownCents, maxCash) }} />
          <span className={s['kind-small']} style={{ width: width(candidate.totals.smallCents, maxCash) }} />
        </div>
        <div className={s.mixParts}>
          <div><i className={s['kind-individual']} aria-hidden="true" /><span>Oregon<b>{wholeDollars(geo.oregonCents)}</b><small>{geo.oregonRecords.toLocaleString('en-US')} contributions</small></span></div>
          <div><i className={s['kind-business']} aria-hidden="true" /><span>Other states<b>{wholeDollars(geo.outsideCents + geo.unknownCents)}</b><small>{(geo.outsideRecords + geo.unknownRecords).toLocaleString('en-US')} contributions</small></span></div>
          {geo.states.slice(0, 2).map(state => <div key={state.state}><i style={{ background: 'transparent' }} aria-hidden="true" /><span>{STATE_NAMES[state.state] ?? state.state}<b>{wholeDollars(state.cents)}</b><small>{state.records.toLocaleString('en-US')} contributions</small></span></div>)}
        </div>
      </div>;
    })}</div>
    <p className={s.source}>The address is the one reported for each contributor. A national organization’s address is its office, which is often in Washington, D.C. <Evidence file="states.csv">Download every state</Evidence>.</p>
  </figure>;
}

export function FundersTable() {
  const rows = [...governor.upstream].sort((a, b) => b.gaveCents - a.gaveCents);
  const nameOf = (committeeId: string) => candidates.find(candidate => candidate.committeeId === committeeId)!.name;
  return <figure className={s.figure} data-chart="funders">
    <figcaption><span className={s.kicker}>Oregon committees that gave $50,000 or more</span><h3>Where those committees got their money</h3>
      <p className={s.howTo}>Each row is a committee that gave to a candidate, followed by what its own filings show about its funding since January 2025.</p></figcaption>
    <div className={s.tableWrap}><table className={s.table}>
      <thead><tr><th scope="col">Committee</th><th scope="col" className={s.hideSmall}>Gave to</th><th scope="col" className={`${s.num} ${s.hideSmall}`}>Amount</th><th scope="col">Its own funding in these records</th></tr></thead>
      <tbody>{rows.map(row => {
        const smallShare = row.receiptsCents ? row.combinedSmallCents / row.receiptsCents : 0;
        return <tr key={`${row.committeeId}-${row.gaveTo}`}>
          <th scope="row"><Link href={`/deep-dives/campaign-finance/entities/committee:${row.committeeId}`}>{plain(row.name)}</Link><small className={s.onlySmall}>Gave {nameOf(row.gaveTo)} {wholeDollars(row.gaveCents)}</small></th>
          <td className={s.hideSmall}>{nameOf(row.gaveTo)}</td>
          <td className={`${s.num} ${s.hideSmall}`}>{wholeDollars(row.gaveCents)}</td>
          <td>{wholeDollars(row.receiptsCents)} received.{' '}
            {smallShare >= 0.5
              ? <>{share(row.combinedSmallCents, row.receiptsCents)} came in combined gifts of $100 or less.</>
              : row.topNamed.length
                ? <>{row.topNamed.map((source, index) => <span key={source.name}>{index ? ' and ' : ''}{plain(source.name)} gave {wholeDollars(source.cents)}</span>)}.</>
                : <>It came from {row.namedSources.toLocaleString('en-US')} named sources and combined small gifts, and no organization supplied 5% or more.</>}
            <span className={s.shareBar} aria-hidden="true"><i style={{ width: width(smallShare >= 0.5 ? row.combinedSmallCents : row.topNamed.reduce((sum, source) => sum + source.cents, 0), row.receiptsCents) }} /></span>
          </td>
        </tr>;
      })}</tbody>
    </table></div>
    <p className={s.source}>The green bar is the share of the committee’s receipts described in that row. Committees registered outside Oregon do not file here, so they are missing from this table. <Evidence file="committee-funders.csv">Download the table</Evidence>.</p>
  </figure>;
}

export function BothTable() {
  const [first, second] = candidates;
  const cents = (row: (typeof governor.both)[number], candidate: GovernorCandidate) => (row.cents as Record<string, number>)[candidate.committeeId];
  return <figure className={s.figure} data-chart="both">
    <figcaption><span className={s.kicker}>Sources that appear in both campaigns’ filings</span><h3>{governor.both.length} sources gave to both candidates</h3>
      <p className={s.howTo}>Each row is one source matched by the same reported name and address in both committees’ records.</p></figcaption>
    <div className={s.tableWrap}><table className={s.table}>
      <thead><tr><th scope="col">Source</th><th scope="col" className={s.num}>To {first.name.split(' ').at(-1)}</th><th scope="col" className={s.num}>To {second.name.split(' ').at(-1)}</th></tr></thead>
      <tbody>{governor.both.map(row => <tr key={row.id}><th scope="row">{plain(row.name)}<small>{row.bookType}</small></th><td className={s.num}>{wholeDollars(cents(row, first))}</td><td className={s.num}>{wholeDollars(cents(row, second))}</td></tr>)}</tbody>
    </table></div>
    <p className={s.source}>Matching is strict, so a donor who is reported under two spellings or addresses will be missed. A gift to both is a record of two contributions and says nothing about why they were made. <Evidence file="both-candidates.csv">Download the table</Evidence>.</p>
  </figure>;
}

export function SpendingChart() {
  const paidMax = Math.max(...candidates.map(candidate => candidate.spending.purposes[0].cents));
  return <figure className={s.figure} data-chart="spending">
    <figcaption><span className={s.kicker}>Cash payments by reported purpose</span><h3>What the campaigns paid for</h3>
      <p className={s.howTo}>Bars in both lists use the same dollar scale. Purposes are the codes each campaign chose when it reported a payment.</p></figcaption>
    <div className={s.pair}>{candidates.map(candidate => {
      const shown = candidate.spending.purposes.slice(0, 7);
      const rest = candidate.spending.purposes.slice(7).reduce((sum, purpose) => sum + purpose.cents, 0);
      return <div className={s.panel} key={candidate.candidateId} data-candidate={candidate.candidateId}>
        <div className={s.panelHead}><Name candidate={candidate} /><strong>{wholeDollars(candidate.totals.paidCents)} paid</strong></div>
        <p className={s.rankMeta}>Payments on file through {longDate(candidate.totals.latestPaymentDate)}</p>
        <ol className={s.rank}>{shown.map(purpose => <li key={purpose.label}>
          <div className={s.rankLabel}><span>{purpose.label}</span><strong>{wholeDollars(purpose.cents)}</strong></div>
          <div className={s.rankTrack} aria-hidden="true"><span className={s.swatchPaid} style={{ width: width(purpose.cents, paidMax) }} /></div>
        </li>)}
          <li><div className={s.rankLabel}><span>Everything else</span><strong>{wholeDollars(rest)}</strong></div><div className={s.rankTrack} aria-hidden="true"><span className={s['kind-other']} style={{ width: width(rest, paidMax) }} /></div></li>
        </ol>
      </div>;
    })}</div>
    <p className={s.source}>Cash payments only. Bills that are owed and not yet paid are left out so nothing is counted twice. <Evidence file="spending-purposes.csv">Download all purposes</Evidence>.</p>
  </figure>;
}

export function PayeesChart() {
  const payeeMax = Math.max(...candidates.map(candidate => candidate.spending.payees[0].cents));
  return <figure className={s.figure} data-chart="payees">
    <figcaption><span className={s.kicker}>Eight largest payees for each campaign</span><h3>Who got paid</h3>
      <p className={s.howTo}>Each row is a business or committee the campaign paid, with the purpose attached to most of that money.</p></figcaption>
    <div className={s.pair}>{candidates.map(candidate => <div className={s.panel} key={candidate.candidateId} data-candidate={candidate.candidateId}>
      <div className={s.panelHead}><Name candidate={candidate} /></div>
      <ol className={s.rank}>{candidate.spending.payees.slice(0, 8).map(payee => <li key={payee.name}>
        <div className={s.rankLabel}><span>{plain(payee.name)}</span><strong>{wholeDollars(payee.cents)}</strong></div>
        <p className={s.rankMeta}>{payee.mainPurpose} · {place(payee.city, payee.state)} · {payee.records === 1 ? '1 payment' : `${payee.records} payments`}</p>
        <div className={s.rankTrack} aria-hidden="true"><span className={s.swatchPaid} style={{ width: width(payee.cents, payeeMax) }} /></div>
      </li>)}</ol>
      <p className={s.rankMeta}>Payments to individuals, such as staff and reimbursements, total {wholeDollars(candidate.spending.toIndividuals.cents)} and are in the download.</p>
    </div>)}</div>
    <p className={s.source}>A payment to a media buyer usually passes through to stations and platforms, and the filing does not show that second step. <Evidence file="payees.csv">Download all payees</Evidence> or <Link href={explorerHref(candidates[0].committeeId, '&basis=cash_payment')}>browse {candidates[0].name.split(' ').at(-1)}’s payments</Link> and <Link href={explorerHref(candidates[1].committeeId, '&basis=cash_payment')}>{candidates[1].name.split(' ').at(-1)}’s payments</Link>.</p>
  </figure>;
}

export function PositionChart() {
  const asOf = governor.commonPaymentDate;
  const top = Math.max(...candidates.flatMap(candidate => [candidate.likeForLike.raisedCents, candidate.likeForLike.paidCents, candidate.likeForLike.cashPositionCents]));
  return <figure className={s.figure} data-chart="position">
    <figcaption><span className={s.kicker}>Through {longDate(asOf)}, the last day both campaigns have payments on file</span><h3>Raised, paid out and left on the same date</h3>
      <p className={s.howTo}>All bars share one dollar scale. Cash left starts from each committee’s official opening balance for 2026 and adds the money in and out through {longMonthDay(asOf)}.</p></figcaption>
    <div className={s.legend}><span><i className={s.swatchRaised} aria-hidden="true" />Raised since January 2025</span><span><i className={s.swatchPaid} aria-hidden="true" />Paid out since January 2025</span><span><i className={s.swatchCash} aria-hidden="true" />Cash left on {longMonthDay(asOf)}</span></div>
    <div className={s.position}>{candidates.map(candidate => {
      const like = candidate.likeForLike;
      return <div key={candidate.candidateId} data-candidate={candidate.candidateId}>
        <div className={s.panelHead}><Name candidate={candidate} /></div>
        <div className={s.positionRows}>
          {[['Raised', like.raisedCents, s.swatchRaised], ['Paid out', like.paidCents, s.swatchPaid], ['Cash left', like.cashPositionCents, s.swatchCash]].map(([label, cents, color]) => <div className={s.positionRow} key={String(label)}>
            <span>{label}</span><div className={s.positionTrack} aria-hidden="true"><span className={String(color)} style={{ width: width(Number(cents), top) }} /></div><strong>{wholeDollars(Number(cents))}</strong>
          </div>)}
        </div>
        <p className={s.positionNote}>After {longMonthDay(asOf)}, the committee raised {wholeDollars(like.raisedAfterCents)} more through {longMonthDay(candidate.totals.latestCashDate)}. {like.paidAfterCents > 0 ? `It paid out ${wholeDollars(like.paidAfterCents)} more through ${longMonthDay(candidate.totals.latestPaymentDate)}.` : 'No later payments were on file when these records were collected.'}</p>
      </div>;
    })}</div>
    <p className={s.source}>Opening balances come from the official ORESTAR account summaries retrieved {longDate(candidates[0].account.retrievedAt)}. Cash left is our calculation from those balances and the filed transactions. <a href="/data/campaign-finance/account-summaries.csv" download>Download the official summaries</a>.</p>
  </figure>;
}
