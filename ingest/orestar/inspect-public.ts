import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

async function run() {
  const out = resolve('runtime-data/orestar-analysis/inspection');
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: !process.argv.includes('--headed') });
  try {
    const page = await browser.newPage();
    await page.goto('https://secure.sos.state.or.us/orestar/GotoSearchByName.do', { waitUntil: 'domcontentloaded' });
    await page.locator('[name=committeeId]').fill(process.argv[2] ?? '3865');
    await page.locator('input[name=submit][value=Submit]').click();
    await page.waitForLoadState('domcontentloaded');
    const text = await page.locator('body').innerText();
    const links = await page.locator('a').evaluateAll(elements => elements.map(a => ({ text: a.textContent?.trim(), href: a.href })));
    writeFileSync(resolve(out, 'profile.html'), await page.content());
    writeFileSync(resolve(out, 'profile.json'), JSON.stringify({ url: page.url(), text, links }, null, 2));
    console.log(JSON.stringify({ text, links }, null, 2));
    const account = links.find(l => l.href.includes('publicAccountSummary'));
    if (account) {
      await page.goto(account.href, { waitUntil: 'domcontentloaded' });
      writeFileSync(resolve(out, 'account.html'), await page.content());
      console.log('ACCOUNT', await page.locator('body').innerText());
    }
  } finally { await browser.close(); }
}
run().catch(e => { console.error(e); process.exitCode = 1; });
