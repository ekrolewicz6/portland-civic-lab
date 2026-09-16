/** Offline, reproducible directory grouping and figure inputs. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { readCSV, sources } from './common';
const root = 'research/maker-economy/data';
const listings = readCSV(`${root}/directory-listings.csv`);
const links = readCSV(`${root}/directory-links.csv`);
const knownSources = new Map(sources.map(s => [s.id, s]));
const ids = new Set<string>();
for (const r of listings) {
  if (ids.has(r.listing_id)) throw Error('Duplicate listing ID');
  ids.add(r.listing_id);
  if (!knownSources.has(r.doc_id) || !r.name || !r.period || !r.geography) throw Error('Missing provenance');
  if (r.urls && r.urls.split(';').some(u => !/^https?:\/\//.test(u) || u.includes('mailto:'))) throw Error('Unsafe URL');
}
const keys = new Map(listings.map(r => [r.listing_id, r.match_key]));
for (const r of links) {
  if (!ids.has(r.left) || !ids.has(r.right)) throw Error('Unknown linkage');
  if (r.decision === 'link-public-profiles') keys.set(r.right, keys.get(r.left)!);
}
const groups = new Map<string, typeof listings>();
for (const r of listings) {
  const key = keys.get(r.listing_id)!;
  groups.set(key, [...(groups.get(key) ?? []), r]);
}
const networks = [...new Set(listings.map(r => r.doc_id))].map(id => ({
  id, title: knownSources.get(id)!.title, url: knownSources.get(id)!.url,
  period: knownSources.get(id)!.period, count: listings.filter(r => r.doc_id === id).length,
}));
const profiles = [...groups].map(([id, rows]) => ({
  id, url: rows.flatMap(r => r.urls.split(';')).find(u => u && new URL(u).hostname !== 'portlandopenstudios.com') ?? knownSources.get(rows[0].doc_id)!.url, names: [...new Set(rows.map(r => r.name))], medium: [...new Set(rows.map(r => r.medium))].join(' · '),
  sources: [...new Set(rows.map(r => r.doc_id))], listings: rows.map(r => r.listing_id),
  scope: rows.some(r => r.scope === 'physical-medium-listed') ? 'Physical medium listed' : 'Activity needs review',
})).sort((a, b) => a.names[0].localeCompare(b.names[0], 'en'));
const nonemployers = readCSV(`${root}/nonemployers.csv`).filter(r => ['315','316','321','3231','3271','3272','332','337','81142'].includes(r.code));
const payroll = readCSV(`${root}/derived/employment-comparison.csv`).filter(r => ['10','327110','337122','337212','339910','339992','332323','315'].includes(r.code));
const historical = readCSV(`${root}/historical-survey.csv`);
if (historical.filter(r => r.series === 'revenue-band').reduce((s,r) => s + Number(r.value),0) !== 84) throw Error('Revenue survey denominator');
if (historical.filter(r => r.series === 'work-location').reduce((s,r) => s + Number(r.value),0) !== 100) throw Error('Work allocation sum');
const totals = { listings: listings.length, profileGroups: profiles.length, nonemployerBusinesses: nonemployers.reduce((s,r) => s + Number(r.establishments),0), nonemployerReceipts: nonemployers.reduce((s,r) => s + Number(r.receipts_usd),0) };
const output = JSON.stringify({ reviewedOn:'2026-09-15', networks, profiles, totals, nonemployers, payroll, historical }, null, 2) + '\n';
const path = 'src/lib/maker-economy/figures.json';
if (process.argv.includes('--check')) {
  if (!existsSync(path) || readFileSync(path,'utf8') !== output) throw Error('Maker figures stale');
} else writeFileSync(path, output);
console.log(totals);
