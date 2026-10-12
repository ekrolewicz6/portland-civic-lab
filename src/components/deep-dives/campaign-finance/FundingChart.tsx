'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { FundingRow } from '@/lib/campaign-finance/story';
import { money, shortMoney } from '@/lib/campaign-finance/filters';
import s from './story.module.css';

const keys = ['public', 'unidentified', 'individual', 'other'] as const;
const labels = { public: 'City matching', unidentified: 'Unnamed donors', individual: 'Named individuals', other: 'Other named sources' };
export default function FundingChart({ rows, district, roster, through }: { rows: FundingRow[]; district: number; roster: number; through: string }) {
  const [basis, setBasis] = useState<'total' | 'nonmatching'>('total');
  const value = (r: FundingRow) => basis === 'total' ? r.cash : r.cash - r.public;
  const ordered = [...rows].sort((a, b) => value(b) - value(a) || a.name.localeCompare(b.name));
  const maximum = Math.max(...ordered.map(value), 1);
  return <figure className={s.figure} data-funding-chart={district}>
    <figcaption><span className={s.kicker}>District {district} · funding mix</span><h3>{basis === 'total' ? 'How much did each candidate raise?' : 'Who raised the most without City matching?'}</h3></figcaption>
    <div className={s.toggle} role="group" aria-label={`District ${district} fundraising measure`}>
      <button type="button" aria-pressed={basis === 'total'} onClick={() => setBasis('total')}>All reported cash</button>
      <button type="button" aria-pressed={basis === 'nonmatching'} onClick={() => setBasis('nonmatching')}>Without City matching</button>
    </div>
    <p className={s.chartNote} aria-live="polite">{basis === 'total' ? 'All reported cash, before refunds.' : 'Cash from outside the City matching program, before refunds.'} Showing {rows.length} candidates with reviewed records. {roster - rows.length} others are missing from this comparison, not counted as $0.</p>
    <div className={s.legend}>{keys.filter(k => basis === 'total' || k !== 'public').map(k => <span key={k}><i className={s[k]} aria-hidden="true" />{labels[k]}</span>)}</div>
    <div className={s.scale}><span>$0</span><span>{shortMoney(maximum / 2)}</span><span>{shortMoney(maximum)}</span></div>
    <ol className={s.fundingRows}>{ordered.map(r => <li key={r.id} data-candidate={r.name}>
      <div className={s.barLabel}><Link href={r.href}>{r.name}</Link><strong>{money(value(r))}</strong></div>
      <div className={s.track} aria-hidden="true">{keys.filter(k => basis === 'total' || k !== 'public').map(k => <span key={k} className={s[k]} style={{ width: `${r[k] / maximum * 100}%` }} />)}</div>
    </li>)}</ol>
    <details className={s.details}><summary>See exact amounts</summary><div className={s.tableWrap} tabIndex={0} role="region" aria-label={`District ${district} funding data, horizontally scrollable`}><table><thead><tr><th scope="col">Candidate</th><th scope="col">Gross cash</th>{keys.map(k => <th scope="col" key={k}>{labels[k]}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={r.id}><th scope="row">{r.name}</th><td>{money(r.cash)}</td>{keys.map(k => <td key={k}>{money(r[k])}</td>)}</tr>)}</tbody></table></div></details>
    <p className={s.source}>January 1, 2025–{through}, not full campaign totals. Recent filings remain provisional. “Other named sources” includes political committees, businesses, labor groups and candidate or family money. <a href="/data/campaign-finance/current/candidate-funding.csv" download>Download chart evidence</a>.</p>
  </figure>;
}
