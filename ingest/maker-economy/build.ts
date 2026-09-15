/** Offline reproduction and evidence checks. Run from repository root.
 * npx tsx ingest/maker-economy/build.ts [--check]
 * Uses only committed inputs. --check verifies outputs without rewriting. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, readCSV, number, csv, sources, locks } from './common';
const check = process.argv.includes('--check');
function output(path: string, value: string) {
  const dest = resolve(root, path);
  if (check) assert.equal(readFileSync(dest, 'utf8'), value, `Stale generated file: ${path}`);
  else writeFileSync(dest, value);
}
const q = readCSV(resolve(root, 'data/qcew.csv'));
const n = readCSV(resolve(root, 'data/nonemployers.csv'));
const obs = readCSV(resolve(root, 'data/observations.csv'));
const eco = readCSV(resolve(root, 'data/ecosystem.csv'));
const ids = new Set(sources.map(s => s.id)); assert.equal(ids.size, sources.length);
assert.equal(new Set(q.map(r => `${r.year}/${r.geoid}/${r.code}`)).size, q.length);
assert.equal(new Set(n.map(r => `${r.year}/${r.geoid}/${r.code}`)).size, n.length);
assert.equal(new Set(obs.map(r => r.observation_id)).size, obs.length);
assert.equal(new Set(eco.map(r => r.entity_id)).size, eco.length);
for (const rows of [q, n, obs, eco]) for (const r of rows) {
  assert.ok(r.locator && r.doc_id, 'Missing provenance');
  for (const id of r.doc_id.split(';')) assert.ok(ids.has(id), `Unknown source ${id}`);
}
for (const r of q) {
  assert.equal(r.geoid, '41051');
  for (const k of ['annual_avg_jobs', 'annual_payroll_usd', 'average_annual_pay_usd']) {
    if (r.disclosure_code) assert.equal(r[k], '', 'Suppression converted to a value');
    else assert.ok(number(r[k]) >= 0);
  }
}
for (const r of n) {
  assert.equal(r.geoid, '41051');
  if (r.establishment_flag) assert.equal(r.establishments, '');
  if (r.receipt_flag || r.noise_flag === 'S') assert.equal(r.receipts_usd, '');
}
function one(year: string, code: string) { const r = q.find(r => r.year === year && r.code === code); assert.ok(r); return r; }
const pct = (a: number, b: number) => (b / a - 1) * 100;
const comparisons = q.filter(r => r.year === '2025').map(end => {
  const start = one('2019', end.code), total = one('2025', '10');
  return { code: end.code, label: end.label, geography: end.geography, coverage: end.coverage, start_year: 2019, end_year: 2025,
    jobs_2019: start.annual_avg_jobs, jobs_2025: end.annual_avg_jobs,
    jobs_change_pct: start.annual_avg_jobs && end.annual_avg_jobs ? pct(number(start.annual_avg_jobs), number(end.annual_avg_jobs)).toFixed(3) : '',
    share_of_private_jobs_2025_pct: end.annual_avg_jobs ? (100 * number(end.annual_avg_jobs) / number(total.annual_avg_jobs)).toFixed(4) : '',
    average_annual_pay_2025_usd: end.average_annual_pay_usd,
    pay_vs_private_average_2025_pct: end.average_annual_pay_usd ? (100 * number(end.average_annual_pay_usd) / number(total.average_annual_pay_usd)).toFixed(2) : '',
    employment_location_quotient_2025: end.employment_location_quotient,
    doc_id: 'qcew2019;qcew2025', locator: `code=${end.code};own_code=5;size_code=0;area_fips=41051`,
    note: 'County industry jobs; not maker people. Pay is nominal and affected by hours and mix.' };
});
output('data/derived/employment-comparison.csv', csv(comparisons));
const base = q.filter(r => r.year === '2025' && r.tier === 'selected-production').map(r => r.code);
const baskets = [{ name: 'Five selected production industries', codes: base }, { name: 'Plus ornamental architectural metal work', codes: [...base, '332323'] }, { name: 'Plus mixed independent artists writers performers', codes: [...base, '332323', '711510'] }].map(b => {
  assert.equal(new Set(b.codes).size, b.codes.length);
  for (const a of b.codes) for (const c of b.codes) if (a !== c) assert.ok(!a.startsWith(c), 'Nested NAICS codes');
  const rows = b.codes.map(c => one('2025', c));
  assert.ok(rows.every(r => !r.disclosure_code));
  return { definition: b.name, codes: b.codes.join(';'), year: 2025, geography: 'Multnomah County OR', jobs: rows.reduce((s, r) => s + number(r.annual_avg_jobs), 0), payroll_usd: rows.reduce((s, r) => s + number(r.annual_payroll_usd), 0), doc_id: 'qcew2025', locator: 'Private ownership; selected industry codes', note: 'Definition sensitivity only. Neither estimate nor lower/upper bound for makers. Rows overlap: do not add.' };
});
output('data/derived/definition-sensitivity.csv', csv(baskets));
const nonemp = n.filter(r => r.code !== '00').map(r => ({ code: r.code, label: r.label, year: 2023, geography: r.geography, establishments: r.establishments, receipts_usd: r.receipts_usd, mean_receipts_per_establishment_usd: r.establishments && r.receipts_usd ? (number(r.receipts_usd) / number(r.establishments)).toFixed(2) : '', share_of_all_nonemployer_establishments_pct: r.establishments ? (100 * number(r.establishments) / number(n.find(x => x.code === '00')!.establishments)).toFixed(3) : '', noise_flag: r.noise_flag, doc_id: r.doc_id, locator: r.locator, note: 'Mean gross receipts; not median income or owner take-home. Categories contain non-makers.' }));
output('data/derived/nonemployer-context.csv', csv(nonemp));
const val = (id: string) => number(obs.find(r => r.observation_id === id)!.value);
assert.equal(val('aep-org-spend') + val('aep-audience-spend'), val('aep-total-spend'));
assert.notEqual(val('aep-attendance'), val('aep-audience-spend'));
const aep = [{metric:'AEP6 organization response rate',value:(100*val('aep-respondents')/val('aep-eligible')).toFixed(3),unit:'percent',period:'FY2022',geography:'Portland study',doc_id:'aep6-portland',locator:'PDF p.2',note:'Respondents / eligible; not a population expansion weight'}];
output('data/derived/study-checks.csv',csv(aep));
const md = ['# Source registry', '', 'Evidence reviewed as of September 15, 2026. Archive status is separate from substantive verification. BLS documentation marked fetch_failed was read through web retrieval; its bulk economic files are pinned locally. `checksums.lock.json` records SHA-256 hashes, source URLs, retrieval dates, and archive failures.', '', '| ID | Source | Period | Geography | Archive |', '|---|---|---|---|---|', ...sources.map(s => `| ${s.id} | [${s.title}](${s.url}) | ${s.period} | ${s.geography} | ${locks.find(l => l.id === s.id)?.status ?? 'unrecorded'} |`), ''].join('\n');
output('sources.md', md);
const fmt = (v: string, digits = 0) => v === '' ? 'Suppressed' : number(v).toLocaleString('en-US', {minimumFractionDigits:digits,maximumFractionDigits:digits});
const table = ['# Reproduced economic tables', '', '## Multnomah County private payroll industries, 2019 and 2025', '', 'Source: BLS QCEW, pinned September 15, 2026. Annual-average jobs, not people. Dollar pay is nominal; it is not an hourly wage or owner income.', '', '| Industry | Jobs 2019 | Jobs 2025 | Change | Average pay 2025 | Employment LQ 2025 |', '|---|---:|---:|---:|---:|---:|', ...comparisons.map(r => `| ${r.label} | ${fmt(r.jobs_2019)} | ${fmt(r.jobs_2025)} | ${r.jobs_change_pct === '' ? 'Unknown' : fmt(r.jobs_change_pct,1)+'%'} | ${r.average_annual_pay_2025_usd === '' ? 'Suppressed' : '$'+fmt(r.average_annual_pay_2025_usd)} | ${fmt(r.employment_location_quotient_2025,2)} |`), '', '## Multnomah County nonemployer businesses, 2023', '', 'Source: Census NES county bulk file. Receipts are gross, before expenses, and disclosure noise is retained. County assignment generally follows business mailing addresses. These categories are not a maker census.', '', '| Category | Businesses | Receipts | Mean receipts per business |', '|---|---:|---:|---:|', ...nonemp.map(r => `| ${r.label} | ${fmt(r.establishments)} | $${fmt(r.receipts_usd)} | $${fmt(r.mean_receipts_per_establishment_usd)} |`), '', '## Definition sensitivity, 2025', '', 'Illustrates what adding broad categories does. These are overlapping industry baskets, not lower/middle/upper maker estimates.', '', '| Basket | Payroll jobs | Payroll |', '|---|---:|---:|', ...baskets.map(r => `| ${r.definition} | ${r.jobs} | $${r.payroll_usd.toLocaleString('en-US')} |`), ''].join('\n');
output('data/derived/tables.md',table);
for (const file of ['document.md','methodology.md','case-studies.md','community-research-kit.md','notes/gaps-and-requests.md']) {
  const path=resolve(root,file); if (!existsSync(path)) { if(check) throw new Error(`Missing deliverable ${file}`); continue; }
  const text=readFileSync(path,'utf8');
  assert.ok(!/turn\d+(search|view)|\bTODO\b|\bTBD\b/.test(text),`Unresolved marker in ${file}`);
  for(const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const target=match[1]; if(/^(https?:|#|mailto:)/.test(target)) continue;
    assert.ok(existsSync(resolve(path,'..',target.split('#')[0])),`Broken relative link in ${file}: ${target}`);
  }
}
console.log(`Verified ${q.length} payroll rows, ${n.length} nonemployer rows, ${obs.length} observations, ${eco.length} inventory entries; ${check ? 'generated outputs match' : 'outputs written'}.`);
