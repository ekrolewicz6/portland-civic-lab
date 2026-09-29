import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.ORESTAR_LOCAL_URL || 'http://127.0.0.1:3145';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}/deep-dives/campaign-finance?committee=17629#zip-map`, { waitUntil: 'domcontentloaded' });
  await page.locator('#zip-map svg path').first().waitFor({ timeout: 30000 });
  assert.equal(await page.locator('#zip-map svg path').count(), 109);
  assert.equal(await page.locator('#zip-map select').inputValue(), '17629');
  assert.match(await page.locator('#zip-map').innerText(), /Eric Zimmerman/);
  await page.locator('#zip-map select').selectOption('23365');
  assert.match(page.url(), /committee=23365/);
  assert.match(await page.locator('#zip-map').innerText(), /Mitch Green/);
  await page.getByRole('button', { name: 'Full regional extent' }).click();
  assert.equal(await page.locator('#zip-map svg').getAttribute('viewBox'), '0 0 800 580');
  await page.getByRole('button', { name: 'Portland close-up' }).click();
  assert.equal(await page.locator('#zip-map svg').getAttribute('viewBox'), '250 160 260 220');
  await page.locator('#zip-map details summary').click();
  assert.match(await page.locator('#zip-map details').innerText(), /No local ZCTA/);
  await page.locator('#zip-map svg').screenshot({ path: '/private/tmp/orestar-zip-map-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#zip-map svg').screenshot({ path: '/private/tmp/orestar-zip-map-mobile.png' });
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, map: document.querySelector('#zip-map')?.scrollWidth, mapClient: document.querySelector('#zip-map')?.clientWidth }));
  assert.ok(dimensions.document <= dimensions.viewport + 1, JSON.stringify(dimensions));
  assert.ok(dimensions.map <= dimensions.mapClient + 1, JSON.stringify(dimensions));
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'passed', polygons: 109, initialCandidate: '17629', switchedCandidate: '23365', dimensions, screenshots: ['/private/tmp/orestar-zip-map-desktop.png', '/private/tmp/orestar-zip-map-mobile.png'] }));
} finally {
  await browser.close();
}
