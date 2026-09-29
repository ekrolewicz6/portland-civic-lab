/** Headless chart-state regression checks; no screenshots or source records are published. */
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const base = process.argv[2] || 'http://127.0.0.1:3146';
const browser = await chromium.launch({ headless: true });
const errors = [];
let states = 0;
try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(base + '/deep-dives/campaign-finance', { waitUntil: 'networkidle' });
    const timeline = page.locator('figure').filter({ has: page.getByRole('heading', { name: 'Steeper lines mean money arrived faster.' }) });
    for (const race of [3, 4]) {
      await timeline.getByRole('button', { name: `District ${race}`, exact: true }).click();
      for (const basis of ['nonmatching_cents', 'cash_cents', 'public_cents', 'individual_itemized_cents']) {
        await timeline.getByRole('combobox', { name: /^Money shown/ }).selectOption(basis);
        for (const period of ['active', 'year', 'all']) {
          await timeline.getByRole('combobox', { name: /^Time period/ }).selectOption(period);
          const geometry = await timeline.locator('svg').evaluate(svg => {
            const bounds = svg.getBoundingClientRect();
            return { width: bounds.width, clientWidth: svg.parentElement.clientWidth, invalid: /NaN|Infinity/.test(svg.innerHTML), clippedLabels: [...svg.querySelectorAll('text')].filter(text => { const r = text.getBoundingClientRect(); return r.left < bounds.left - 1 || r.right > bounds.right + 1; }).map(text => text.textContent) };
          });
          assert(geometry.width <= geometry.clientWidth + 1, 'Timeline fits its container');
          assert.equal(geometry.invalid, false);
          assert.deepEqual(geometry.clippedLabels, [], `Clipped labels: ${width}/${race}/${basis}/${period}`);
          states++;
        }
      }
    }
    const eventSelect = timeline.getByRole('combobox', { name: /Choose an event/ });
    const events = await eventSelect.locator('option').evaluateAll(options => options.filter(option => !option.disabled).map(option => option.value));
    for (const event of events) {
      await eventSelect.selectOption(event);
      assert.equal(await timeline.locator('svg line[stroke-dasharray]').count(), 1);
      states++;
    }
    const dossier = page.locator('#donor-dossiers');
    const candidate = dossier.getByRole('combobox');
    const ids = await candidate.locator('option').evaluateAll(options => options.map(option => option.value));
    for (const id of ids) {
      await candidate.selectOption(id);
      assert(!/NaN|undefined/.test(await dossier.innerText()));
      states++;
    }
    const health = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, brokenImages: [...document.images].filter(image => image.complete && image.naturalWidth === 0).map(image => image.getAttribute('src')) }));
    assert.equal(health.overflow, false);
    assert.deepEqual(health.brokenImages, []);
    console.log(`Chart controls passed at ${width}px.`);
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'passed', states, errors }));
} finally { await browser.close(); }
