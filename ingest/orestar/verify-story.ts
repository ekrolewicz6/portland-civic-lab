import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { story } from '../../src/lib/campaign-finance/story';

const origin = 'http://127.0.0.1:3145';
const path = '/deep-dives/campaign-finance';
const out = 'runtime-data/orestar-analysis/verification/race-story';
async function run() {
  mkdirSync(out, { recursive: true });
  const errors: string[] = []; const checks: Record<string, unknown> = {};
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', e => errors.push(e.message));
    const r = await page.goto(origin + path, { waitUntil: 'networkidle', timeout: 60000 });
    assert.equal(r?.status(), 200); assert.equal(await page.locator('[data-nextjs-dialog]').count(), 0);
    const article = page.locator('[data-story-snapshot]');
    assert.match(await article.innerText(), /The money behind/);
    assert.match(await article.innerText(), /\$738\.15/);
    assert.match(await article.innerText(), /48\.8%/);
    assert.match(await article.innerText(), /No Ditch Mitch filer rows/);
    assert.equal(await article.locator('figure').count(), 12);
    for (const [district, totalLeader, otherLeader, count] of [[3, 'Tiffany Koyama Lane', 'Steve Novick', 9], [4, 'Eli Arnold', 'Eli Arnold', 8]] as const) {
      const chart = article.locator(`[data-funding-chart="${district}"]`);
      assert.equal(await chart.locator('[data-candidate]').count(), count);
      assert.equal(await chart.locator('[data-candidate]').first().getAttribute('data-candidate'), totalLeader);
      const button = chart.getByRole('button', { name: 'Excluding City matches' });
      await button.focus(); await page.keyboard.press('Enter');
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await chart.locator('[data-candidate]').first().getAttribute('data-candidate'), otherLeader);
      await chart.getByText('Exact amounts and source categories', { exact: true }).click();
      assert.equal(await chart.locator('tbody tr').count(), count);
      await chart.getByRole('button', { name: 'All cash contributions', exact: true }).click();
      await chart.getByText('Exact amounts and source categories', { exact: true }).click();
    }
    checks.interaction = 'Both funding controls work with keyboard input; District 3 leader changes correctly; exact tables have all 17 linked candidates';
    const anchors = await article.locator('a[href^="#"]').evaluateAll(links => links.map(a => a.getAttribute('href')!));
    for (const anchor of anchors) assert.equal(await page.locator(anchor).count(), 1, anchor);
    checks.anchors = anchors.length;
    for (const e of story.evidence) {
      const response = await page.request.get(origin + '/data/campaign-finance/story/' + e.file);
      assert.equal(response.status(), 200, e.file);
      assert.equal(createHash('sha256').update(await response.body()).digest('hex'), e.sha256, e.file);
    }
    checks.downloads = story.evidence.length;
    const links = [...new Set(await article.locator('a[href^="/"]').evaluateAll(links => links.map(a => a.getAttribute('href')!.split('#')[0])))];
    for (const link of links) { const response = await page.request.get(origin + link); assert.equal(response.status(), 200, link); }
    checks.localLinks = links.length;
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: out + '/desktop-opening.png' });
    for (const id of ['district-3', 'district-4', 'shared-support', 'money-left', 'auditor', 'statewide']) {
      await page.locator('#' + id).screenshot({ path: `${out}/desktop-${id}.png` });
    }
    for (const width of [390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `${out}/opening-${width}.png` });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${width}`);
      if (width === 390) {
        for (const district of [3, 4]) {
          const chart = article.locator(`[data-funding-chart="${district}"]`);
          await chart.getByText('Exact amounts and source categories', { exact: true }).click();
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          await chart.screenshot({ path: `${out}/mobile-funding-${district}.png` });
          await chart.getByText('Exact amounts and source categories', { exact: true }).click();
        }
        await article.locator('[data-chart="september"]').screenshot({ path: out + '/mobile-september.png' });
        await article.locator('[data-chart="endorsements"]').screenshot({ path: out + '/mobile-endorsements.png' });
      }
    }
    checks.responsive = '390px and 768px without document overflow; horizontal evidence tables remain contained';
    const nojs = await browser.newContext({ javaScriptEnabled: false });
    const plain = await nojs.newPage(); await plain.goto(origin + path, { waitUntil: 'domcontentloaded' });
    assert.match(await plain.locator('[data-story-snapshot]').innerText(), /\$277,809\.22/);
    assert.equal(await plain.locator('[data-story-snapshot] figure').count(), 12);
    await nojs.close(); checks.noJavaScript = 'Article, charts and evidence tables are server-rendered';
    assert.deepEqual(errors, []);
    const result = { at: new Date().toISOString(), status: 'passed', checks, pageErrors: errors };
    writeFileSync(out + '/results.json', JSON.stringify(result, null, 2)); appendFileSync(out + '/attempts.ndjson', JSON.stringify(result) + '\n'); console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    const result = { at: new Date().toISOString(), status: 'failed', checks, pageErrors: errors, error: String(error) };
    writeFileSync(out + '/results.json', JSON.stringify(result, null, 2)); appendFileSync(out + '/attempts.ndjson', JSON.stringify(result) + '\n'); throw error;
  } finally { await browser.close(); }
}
run().catch(e => { console.error(e); process.exitCode = 1; });
