/** Sequential public-profile acquisition. Cached immutable artifacts + persistent failures. */
import { chromium, type Page } from 'playwright';
import { DuckDBInstance } from '@duckdb/node-api';
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('runtime-data/orestar-analysis/enrichment');
const manifestPath = resolve(root, 'manifest.json');
const hash = (s: string | Buffer) => createHash('sha256').update(s).digest('hex');
type Artifact = { path: string; sha256: string; retrievedAt: string; source: string };
type Item = { committeeId: string; status: 'complete' | 'failed' | 'partial'; attempts: number; artifacts: Record<string, Artifact>; error?: string; unavailable?: string[] };
type Manifest = { version: 1; queue: string[]; items: Record<string, Item> };
const cleanUrl = (url: string) => url.replace(/;JSESSIONID_ORESTAR=[^?&#]*/g, '').replace(/([?&])OWASP_CSRFTOKEN=[^&#]*/g, '$1').replace(/[?&]$/, '');
const event = (data: object) => appendFileSync(resolve(root, 'events.ndjson'), JSON.stringify({ at: new Date().toISOString(), ...data }) + '\n');
function save(manifest: Manifest) {
  writeFileSync(manifestPath + '.tmp', JSON.stringify(manifest, null, 2) + '\n');
  renameSync(manifestPath + '.tmp', manifestPath);
}
async function capture(page: Page, id: string, kind: string): Promise<Artifact> {
  await page.waitForFunction(() => document.body?.innerText.includes('Elections Division'), {}, { timeout: 25000 });
  const text = await page.locator('body').innerText();
  if (/access denied|request rejected|service unavailable/i.test(text) || text.length < 500) throw new Error('Public page unavailable or incomplete');
  const rows = await page.locator('tr').evaluateAll(trs => trs.map(tr => Array.from(tr.querySelectorAll(':scope > td, :scope > th')).map(td => td.textContent?.replace(/\s+/g, ' ').trim() ?? '')).filter(row => row.length));
  const links = await page.locator('a').evaluateAll(anchors => anchors.map(a => ({ text: a.textContent?.trim(), href: (a as HTMLAnchorElement).href })));
  const retrievedAt = new Date().toISOString();
  const data = JSON.stringify({ committeeId: id, kind, source: cleanUrl(page.url()), retrievedAt, text, rows, links: links.map(l => ({ ...l, href: cleanUrl(l.href) })) }, null, 2);
  const checksum = hash(data);
  const path = `${id}/${kind}-${checksum.slice(0, 12)}.json`;
  mkdirSync(resolve(root, id), { recursive: true });
  writeFileSync(resolve(root, path), data);
  writeFileSync(resolve(root, id, `${kind}-${checksum.slice(0,12)}.html`), await page.content());
  return { path, sha256: checksum, retrievedAt, source: cleanUrl(page.url()) };
}
async function run() {
  mkdirSync(root, { recursive: true });
  const lock = resolve(root, '.collector.lock');
  writeFileSync(lock, String(process.pid), { flag: 'wx' });
  let browser;
  try {
    let manifest: Manifest;
    if (existsSync(manifestPath)) manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    else {
      const snapshot = JSON.parse(readFileSync('research/campaign-finance/snapshot-manifest.json', 'utf8'));
      const db = await DuckDBInstance.create(resolve(snapshot.database), { access_mode: 'READ_ONLY', threads: '2' });
      const con = await db.connect();
      const rows = (await con.runAndReadAll(`SELECT committee_id FROM committees ORDER BY CASE WHEN regexp_matches(lower(name), 'portland|pdx|morillo|koyama|mitch green|olivia|zimmerman|corcoran|hallett|torres|cronlund|leake|schulte|sollitt|hilton|legree|frankenstein|sweeney|landgraver|evenstar|goldsmith|otero|simone rede') THEN 0 ELSE 1 END, (SELECT coalesce(sum(amount_cents),0) FROM transactions t WHERE t.committee_id=committees.committee_id AND basis='cash_contribution') DESC, committee_id`)).getRowObjectsJson();
      manifest = { version: 1, queue: rows.map(r => String(r.committee_id)), items: {} };
      con.closeSync(); db.closeSync(); save(manifest);
    }
    const limit = Number(process.argv.find(a => a.startsWith('--limit='))?.split('=')[1] ?? manifest.queue.length);
    const selectedIds = process.argv.find(a => a.startsWith('--ids='))?.split('=')[1]?.split(',');
    const queue = selectedIds ?? manifest.queue.slice(0, limit);
    browser = await chromium.launch({ channel: 'chrome', headless: !process.argv.includes('--headed') });
    const page = await browser.newPage();
    page.setDefaultTimeout(20000);
    for (const id of queue) {
      const prior = manifest.items[id];
      if (prior?.status === 'complete' && (prior.artifacts.account2025 || prior.unavailable?.includes('account2025')) && Object.values(prior.artifacts).every(a => existsSync(resolve(root,a.path)) && hash(readFileSync(resolve(root,a.path)))===a.sha256)) continue;
      const item: Item = prior ?? { committeeId: id, status: 'partial', attempts: 0, artifacts: {} };
      manifest.items[id] = item;
      for (let attempt=1; attempt<=3; attempt++) {
        item.attempts++;
        try {
          await page.waitForTimeout(750);
          await page.goto('https://secure.sos.state.or.us/orestar/GotoSearchByName.do', { waitUntil: 'domcontentloaded' });
          await page.locator('[name=committeeId]').fill(id);
          await Promise.all([page.waitForNavigation({waitUntil:'load'}), page.locator('input[name=submit][value=Submit]').click()]);
          await page.waitForFunction(() => document.body?.innerText.includes('Elections Division'));
          const profileText = await page.locator('body').innerText();
          if (!/Statement of Organization|Committee Information|Filer Information/.test(profileText) || !profileText.includes(id)) { writeFileSync(resolve(root, `failure-${id}.txt`), profileText); throw new Error('No unique profile returned for committee ID'); }
          item.artifacts.profile = await capture(page,id,'profile'); save(manifest);
          const links = await page.locator('a').evaluateAll(anchors => anchors.map(a => ({ text: a.textContent?.trim(), href: (a as HTMLAnchorElement).href })));
          for (const [kind, token] of [['account2026','publicAccountSummary'],['history','committeeSearchSOOHistory'],['people','personAssocitedCommittee'],['elections','electionActivityLog']] as const) {
            if ((kind!=='account2026' || item.artifacts.account2025 || item.unavailable?.includes('account2025')) && item.artifacts[kind] && existsSync(resolve(root,item.artifacts[kind].path)) && hash(readFileSync(resolve(root,item.artifacts[kind].path)))===item.artifacts[kind].sha256) continue;
            const link = links.find(l => l.href.includes(token));
            if (!link) { event({ type: 'missing_link', id, kind }); continue; }
            await page.waitForTimeout(750);
            await page.goto(link.href, { waitUntil: 'domcontentloaded' });
            item.artifacts[kind] = await capture(page,id,kind); save(manifest);
            if (kind==='account2026') {
              if (!(await page.locator('body').innerText()).match(/year\s+2026/)) throw new Error('Unexpected account summary year');
              const prev = page.locator('input[name=buttonName][value=Prev]').first();
              if (await prev.count()) {
                await page.waitForTimeout(750); await Promise.all([page.waitForNavigation({waitUntil:'load'}), prev.click()]);
                await page.waitForFunction(() => document.body?.innerText.includes('Elections Division'));
                if (!(await page.locator('body').innerText()).match(/year\s+2025/)) throw new Error('Previous summary did not select 2025');
                item.artifacts.account2025 = await capture(page,id,'account2025'); save(manifest);
              } else {item.unavailable=[...new Set([...(item.unavailable??[]),'account2025'])];event({type:'unavailable_previous_year',id,year:2025});save(manifest);}
            }
          }
          item.status='complete'; delete item.error; save(manifest); event({ type:'complete', id, artifacts:Object.keys(item.artifacts) });
          console.log(`${id}: complete (${Object.keys(item.artifacts).length} artifacts)`); break;
        } catch (error) {
          item.error = error instanceof Error ? error.message.split('\n')[0] : String(error);
          item.status='failed'; save(manifest); event({type:'failure', id, attempt, error:item.error});
          console.warn(`${id}: attempt ${attempt}/3: ${item.error}`);
          if (attempt<3) await page.waitForTimeout(1500*2**(attempt-1));
        }
      }
    }
  } finally { await browser?.close(); unlinkSync(lock); }
}
run().catch(e => { console.error(e); process.exitCode=1; });
