'use client';

import { useEffect, useMemo, useState } from 'react';
import { money } from '@/lib/campaign-finance/filters';
import s from './suppliers.module.css';

type Payee = { entityId: string; reportedName: string; nameVariants: string[]; identityStatus: string; bookType: string; cents: number; records: number; candidateCount: number; firstDate: string; lastDate: string; purposeCodes: string[]; candidates: { committeeId: string; name: string; district: number; cents: number; records: number }[] };
type Candidate = { committeeId: string; candidate: string; district: number };

export default function SupplierExplorer({ payees, candidates }: { payees: Payee[]; candidates: Candidate[] }) {
  const [query, setQuery] = useState('');
  const [committee, setCommittee] = useState('');
  const [shared, setShared] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') ?? '');
    setCommittee(params.get('committee') ?? '');
    setShared(params.get('shared') === '1');
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query) params.set('q', query); else params.delete('q');
    if (committee) params.set('committee', committee); else params.delete('committee');
    if (shared) params.set('shared', '1'); else params.delete('shared');
    window.history.replaceState(null, '', `${window.location.pathname}${params.size ? `?${params}` : ''}${window.location.hash}`);
  }, [query, committee, shared]);
  const selected = useMemo(() => payees.filter(p => {
    if (committee && !p.candidates.some(c => c.committeeId === committee)) return false;
    if (shared && p.candidateCount < 2) return false;
    const needle = query.trim().toLocaleLowerCase();
    return !needle || p.reportedName.toLocaleLowerCase().includes(needle) || p.purposeCodes.some(code => code.toLocaleLowerCase().includes(needle));
  }).sort((a, b) => committee ? (b.candidates.find(c => c.committeeId === committee)?.cents ?? 0) - (a.candidates.find(c => c.committeeId === committee)?.cents ?? 0) : b.cents - a.cents), [payees, query, committee, shared]);
  return <div className={s.explorer} id="all-payees"><div className={s.explorerHead}><div><span className={s.eyebrow}>Explore every named recipient</span><h2>Find a payee.</h2><p>Search a name or filing category. Choose a campaign, then open any result to see who paid it. The same real person or firm may appear in more than one entry when filing details differ.</p></div><a href="/data/campaign-finance/suppliers/cash-payments.csv" download>Download all 2,441 payments ↗</a></div>
    <div className={s.filters}><label>Name or filing category<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search payees or categories" type="search" /></label><label>Candidate<select value={committee} onChange={event => setCommittee(event.target.value)}><option value="">All 17 linked candidates</option>{candidates.map(c => <option key={c.committeeId} value={c.committeeId}>{c.candidate} · District {c.district}</option>)}</select></label><label className={s.check}><input type="checkbox" checked={shared} onChange={event => setShared(event.target.checked)} /> Paid by 2+ campaigns</label></div>
    <p className={s.resultCount}>{selected.length} payee entries shown · {money(selected.reduce((sum, p) => sum + (committee ? p.candidates.find(c => c.committeeId === committee)?.cents ?? 0 : p.cents), 0))} in matching cash payments{committee ? ' by selected campaign' : ''}.</p>
    <div className={s.payeeList}>{selected.map(p => <details key={p.entityId} className={s.payee}><summary><span><strong>{p.reportedName}</strong><small>{p.candidateCount} campaign{p.candidateCount === 1 ? '' : 's'} · {p.records} record{p.records === 1 ? '' : 's'}</small></span><b>{money(committee ? p.candidates.find(c => c.committeeId === committee)?.cents ?? 0 : p.cents)}</b></summary><div className={s.payeeDetail}><p>Payment dates: {p.firstDate}–{p.lastDate}. Filed as: {p.bookType}. Filing categor{p.purposeCodes.length === 1 ? 'y' : 'ies'}: {p.purposeCodes.length ? p.purposeCodes.join(' · ') : 'not specified'}.</p><ul>{p.candidates.map(c => <li key={c.committeeId}><span>{c.name} <small>District {c.district} · {c.records} payments</small></span><strong>{money(c.cents)}</strong></li>)}</ul><p>These are reported payments, not proof of the recipient’s profit or a political alliance.</p></div></details>)}</div>
    {selected.length === 0 && <p className={s.empty}>No named payees match. Try clearing a filter. Unnamed payments remain in the full payment download.</p>}
  </div>;
}
