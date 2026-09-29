/** Headless release checks. Never opens or focuses a user browser. */
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:3146';
const output = mkdtempSync(join(tmpdir(), 'pcl-finance-release-'));
const browser = await chromium.launch({ headless: true });
const errors = [];
const results = [];
const root = '/deep-dives/campaign-finance';
const routes = [root, `${root}/suppliers`, `${root}/explorer`, `${root}/races/portland-district-3`, `${root}/races/portland-district-4`, '/voters-guide/portland-district-4/eli-arnold'];
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [390, 1440, 320, 768]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
      assert.equal(response.status(), 200, `${width}: ${route}`);
      assert.equal(await page.locator('h1').count(), 1, `One h1: ${route}`);
      const sizes = await page.evaluate(() => ({ screen: innerWidth, document: document.documentElement.scrollWidth }));
      assert(sizes.document <= sizes.screen + 1, `Horizontal page overflow: ${width}: ${route}: ${sizes.document}`);
      if (width === 390 || width === 1440) await page.screenshot({ path: join(output, `${width}-${route.split('/').at(-1)}.png`) });
      results.push({ width, route, status: response.status(), overflow: false });
    }
    console.log(`Layout checks passed at ${width}px.`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + routes.at(-1) + '#campaign-finance', { waitUntil: 'networkidle' });
  const mosaic = page.locator('figure[data-committee]');
  await mosaic.getByRole('button', { name: 'Named sources', exact: true }).click();
  const field = mosaic.getByRole('listbox');
  await field.focus();
  const initial = await field.getAttribute('aria-activedescendant');
  await page.keyboard.press('ArrowRight');
  assert.notEqual(await field.getAttribute('aria-activedescendant'), initial, 'Keyboard contribution selection');
  await field.screenshot({ path: join(output, 'mobile-contribution-squares.png') });

  await page.goto(base + root + '?view=district&race=portland-district-3#zip-map', { waitUntil: 'networkidle' });
  const map = page.locator('#zip-map');
  assert.equal(await map.getByRole('button', { name: 'All reviewed candidates', exact: true }).getAttribute('aria-pressed'), 'true');
  await map.getByRole('button', { name: 'District 4', exact: true }).click();
  assert((await page.url()).includes('portland-district-4'));
  await map.getByRole('button', { name: 'One candidate', exact: true }).click();
  await map.getByRole('combobox', { name: 'Candidate', exact: true }).selectOption('23365');
  await map.getByRole('button', { name: /ZIP .* records/ }).first().focus();
  await page.keyboard.press('Enter');
  await map.screenshot({ path: join(output, 'mobile-map.png') });

  await page.goto(base + root + '/suppliers#all-payees', { waitUntil: 'networkidle' });
  await page.getByRole('searchbox').fill('ActBlue');
  assert(await page.locator('#all-payees details').count() > 0);
  await page.locator('#all-payees details summary').first().click();
  await page.locator('#all-payees').screenshot({ path: join(output, 'mobile-supplier-search.png') });
  await page.getByRole('searchbox').fill('no-such-payee-012345');
  assert.equal(await page.locator('#all-payees details').count(), 0);
  await page.getByText('No named payees match.', { exact: false }).waitFor();

  const fetchJson = async path => {
    const response = await context.request.get(base + path);
    assert.equal(response.status(), 200, path);
    return response.json();
  };
  const all = await fetchJson('/api/campaign-finance');
  assert.equal(all.rows.length, 25);
  assert(all.records >= 317095);
  const filtered = await fetchJson('/api/campaign-finance?committee=24897&start=2026-08-09&end=2026-08-09&basis=cash_contribution&matching=exclude');
  assert.equal(filtered.records, 54);
  assert.equal(Number(filtered.totals[0].amount_cents), 1933500);
  const second = await fetchJson('/api/campaign-finance?page=2');
  assert(second.rows.every(row => !all.rows.some(first => first.transaction_id === row.transaction_id)), 'Pages do not overlap');
  const invalid = await context.request.get(base + '/api/campaign-finance?committee=1%27%20OR%201=1');
  assert.equal(invalid.status(), 400, 'Invalid filter rejected');
  const csv = await context.request.get(base + '/api/campaign-finance?committee=24897&start=2026-08-09&end=2026-08-09&basis=cash_contribution&matching=exclude&format=csv');
  assert.equal(csv.status(), 200);
  const text = await csv.text();
  assert.equal(text.trim().split(/\r?\n/).length, 55);
  assert(!/street_address|source_raw_file|purpose_description|\/Users\//.test(text));
  const daily = await fetchJson('/api/campaign-finance/daily');
  assert.equal(daily.snapshot, all.snapshot);
  assert(daily.weekly.length > 0);
  for (const route of ['/methodology', '/evidence', '/questions', '/statewide', '/api-reference', '/entities/committee:23285']) {
    const response = await context.request.get(base + root + route);
    assert.equal(response.status(), 200, route);
  }
  for (const privatePath of ['/server-data/campaign-finance/finance.duckdb', '/research/campaign-finance/active-snapshot-manifest.json', '/runtime-data/orestar-manual/', '/.env.local']) {
    assert.equal((await context.request.get(base + privatePath)).status(), 404, `Private path inaccessible: ${privatePath}`);
  }
  assert.deepEqual(errors, [], 'No browser runtime errors');
  writeFileSync(join(output, 'verification.json'), JSON.stringify({ status: 'passed', snapshot: all.snapshot, results, errors }, null, 2));
  console.log(JSON.stringify({ status: 'passed', layoutChecks: results.length, snapshot: all.snapshot, checks: 'keyboard, map, supplier filters, pagination, exact CSV reconciliation, timeline, input validation, private paths', output }, null, 2));
} catch (error) {
  writeFileSync(join(output, 'failure.json'), JSON.stringify({ error: String(error), results, errors }, null, 2));
  console.error(`Verification failed. Private test artifacts: ${output}`);
  throw error;
} finally { await browser.close(); }
