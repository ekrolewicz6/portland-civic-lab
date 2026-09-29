/** Private, headless visual inventory. Outputs never enter the publication bundle. */
import { chromium } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const base = process.argv[2] || 'http://127.0.0.1:3146';
const output = mkdtempSync(join(tmpdir(), 'pcl-chart-audit-'));
const width = Number(process.argv[3] || 390);
const browser = await chromium.launch({ headless: true });
const rows = [];
try {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const [name, route] of [['story','/deep-dives/campaign-finance'],['suppliers','/deep-dives/campaign-finance/suppliers'],['profile','/voters-guide/portland-district-4/eli-arnold'],['race','/deep-dives/campaign-finance/races/portland-district-3'],['statewide','/deep-dives/campaign-finance/statewide']]) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.addStyleTag({content:'header:not(article header),nextjs-portal{visibility:hidden!important}'});
    const visuals = page.locator('figure, #zip-map, svg[role="img"]:not(figure svg):not(#zip-map svg)');
    for (let i=0; i<await visuals.count(); i++) {
      const visual = visuals.nth(i);
      if (!await visual.isVisible()) await visual.evaluate(element=>{
        for(let parent=element.parentElement;parent;parent=parent.parentElement){
          if(parent instanceof HTMLDetailsElement&&!parent.open){parent.dataset.auditOpened='true';parent.open=true;}
        }
      });
      if (!await visual.isVisible()) continue;
      const box = await visual.boundingBox();
      if (!box || box.width < 30 || box.height < 30) continue;
      await visual.screenshot({ path: join(output, `${name}-${i}.png`) });
      rows.push({name,i,title:(await visual.innerText()).slice(0,140),width:box.width,height:box.height});
      await page.locator('details[data-audit-opened]').evaluateAll(elements=>elements.forEach(element=>{element.open=false;delete element.dataset.auditOpened;}));
    }
    console.log(`Captured ${name}.`);
  }
  writeFileSync(join(output,'inventory.json'),JSON.stringify({width,rows,errors},null,2));
  console.log(JSON.stringify({output,width,visuals:rows.length,errors}));
} finally { await browser.close(); }
