const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'../..');
const out = path.join(root,'runtime-data/small-business');
fs.mkdirSync(out,{recursive:true});
const base = process.env.SMALL_BUSINESS_PREVIEW || 'http://localhost:3014';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const consoleErrors=[];page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
 const response=await page.goto(base+'/deep-dives/small-business',{waitUntil:'networkidle'});
 assert.equal(response.status(),200);
 await page.getByRole('heading',{name:'Portland loves its small businesses. How well does it help them?',exact:true}).waitFor();
 assert.equal(await page.locator('.sb-figure').count(),20);assert.equal(await page.locator('.sb-chapter').count(),12);
 const figure=(text)=>page.locator('.sb-figure').filter({has:page.getByRole('heading',{name:text,exact:true})});
 const size=figure('Small companies have half the jobs and a smaller share of the money.');
 assert.match(await size.locator('.sb-huge').innerText(),/50.2%/);
 await size.getByRole('button',{name:'Fewer than 20 employees',exact:true}).click();assert.match(await size.locator('.sb-huge').innerText(),/18.8%/);
 await size.getByRole('button',{name:'Sales',exact:true}).click();assert.match(await size.locator('.sb-huge').innerText(),/11.9%/);
 await size.getByRole('button',{name:'Fewer than 500 employees',exact:true}).click();await size.getByRole('button',{name:'Jobs',exact:true}).click();
 const industry=figure('Health care, retail and manufacturing employ the most people.');await industry.getByRole('button',{name:'Companies',exact:true}).click();assert.match(await industry.locator('.sb-bar-row').first().innerText(),/Professional[\s\S]*8,870/);await industry.getByRole('button',{name:'Jobs',exact:true}).click();
 const peers=figure('Only Sacramento has a bigger share of jobs at small companies.');assert.match(await peers.locator('.sb-peer-row').first().innerText(),/Sacramento/);
 await peers.getByRole('checkbox').check();assert.match(await peers.locator('.sb-peer-row').first().innerText(),/Portland/);assert.match(await peers.locator('.sb-peer-row').filter({hasText:'Seattle'}).innerText(),/46.7%/);
 await peers.getByRole('button',{name:'Sales',exact:true}).click();assert.equal(await peers.getByRole('checkbox').isDisabled(),true);await peers.getByRole('button',{name:'Jobs',exact:true}).click();await peers.getByRole('checkbox').uncheck();
 await page.getByRole('button',{name:'Large metros (500,000+ jobs)',exact:true}).click();assert.doesNotMatch(await figure('Portland is a little above the figure for all U.S. metro areas.').locator('.sb-chart-explainer').innerText(),/shows 387/);await page.getByRole('button',{name:'All 387 metros',exact:true}).click();
 await page.getByLabel('Choose an industry',{exact:true}).selectOption('31-33');assert.match(await page.locator('.sb-sector-detail').innerText(),/−20\.8%/);
 await page.getByRole('button',{name:'Show Health care',exact:true}).focus();await page.keyboard.press('Enter');assert.equal(await page.getByLabel('Choose an industry',{exact:true}).inputValue(),'62');
 const owner=page.locator('#sb-cost');await owner.focus();await owner.press('End');assert.match(await page.locator('.sb-calculator-result').innerText(),/−\$28,000/);await owner.press('Home');for(let i=0;i<16;i++)await owner.press('ArrowRight');
 await page.locator('#sb-dynamics-metro').selectOption('Austin');assert.match(await figure('Each year about one business location in ten is new, and nearly as many close.').locator('svg').getAttribute('aria-label'),/Austin/);await page.locator('#sb-dynamics-metro').selectOption('Portland');
 await page.getByRole('button',{name:'Trades & contracting',exact:true}).click();assert.match(await page.locator('.sb-journey').innerText(),/Get paid/);await page.getByRole('button',{name:'Storefront',exact:true}).click();
 await page.locator('#sb-delay-months').focus();await page.keyboard.press('End');assert.match(await page.locator('.sb-delay-total').innerText(),/72,000/);await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');
 await page.getByText('The office’s own numbers don’t quite add up',{exact:true}).click();assert.match(await page.locator('.sb-audit').innerText(),/178/);
 const effect=page.locator('#sb-effect');await effect.focus();await effect.press('Home');assert.match(await page.locator('.sb-scenario-result').innerText(),/No answer/);for(let i=0;i<4;i++)await effect.press('ArrowRight');
 assert.match(await page.locator('.sb-budget-total').innerText(),/1,890,000/);await page.getByRole('button',{name:'1 · Make the current system work',exact:true}).click();assert.match(await page.locator('.sb-budget-total').innerText(),/1,125,000/);await page.getByRole('button',{name:'3 · Fix the recurring roadblocks',exact:true}).click();assert.match(await page.locator('.sb-budget-total').innerText(),/2,070,000/);await page.getByRole('button',{name:'2 · A shared back office',exact:true}).click();
 await page.getByLabel('Search the sources',{exact:true}).fill('zz-no-source');assert.match(await page.locator('.sb-library-count').innerText(),/^0 of/);await page.getByLabel('Search the sources',{exact:true}).fill('BEA');assert.equal(await page.locator('.sb-source-list details').count()>0,true);await page.getByLabel('Search the sources',{exact:true}).fill('');
 const anchors=await page.locator('.sb-report a[href^="#"]').evaluateAll(links=>links.filter(a=>!document.getElementById(a.getAttribute('href').slice(1))).map(a=>a.getAttribute('href')));assert.deepEqual(anchors,[]);
 const duplicates=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id).filter((id,i,a)=>a.indexOf(id)!==i));assert.deepEqual(duplicates,[]);
 const files=[...new Set(await page.locator('.sb-report a[download]').evaluateAll(links=>links.map(a=>a.getAttribute('href'))))];for(const file of files){const res=await page.request.get(base+file);assert.equal(res.status(),200,file);assert.equal((await res.body()).length>0,true,file);}
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 const accessibility=await page.evaluate(async()=>await axe.run('.sb-report',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
 fs.writeFileSync(path.join(out,'accessibility.json'),JSON.stringify(accessibility.violations,null,2));
 const screenshots=[];
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:path.join(out,'desktop-hero.png')});screenshots.push('desktop-hero.png');
 for(const [text,name] of [['Small companies have half the jobs and a smaller share of the money.','desktop-size.png'],['Only Sacramento has a bigger share of jobs at small companies.','desktop-peers.png'],['Thirteen of 18 industries had fewer jobs in 2025 than in 2019.','desktop-sectors.png'],['Three ways to spend the next dollar.','desktop-policy.png']]){await figure(text).screenshot({path:path.join(out,name),style:'body header,.sb-nav,nextjs-portal{visibility:hidden!important}'});screenshots.push(name);}
 const responsive=[];
 for(const width of [768,390,320]){
  await page.setViewportSize({width,height:900});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(150);
  const geometry=await page.evaluate(()=>({viewport:innerWidth,page:document.documentElement.scrollWidth,header:document.querySelector('body header').getBoundingClientRect().height}));responsive.push(geometry);assert.equal(geometry.page<=geometry.viewport,true,`overflow at ${width}`);
  if(width===390){await page.screenshot({path:path.join(out,'mobile-hero.png')});await figure('Thirteen of 18 industries had fewer jobs in 2025 than in 2019.').screenshot({path:path.join(out,'mobile-sectors.png'),style:'body header,.sb-nav,nextjs-portal{visibility:hidden!important}'});await figure('Three ways to spend the next dollar.').screenshot({path:path.join(out,'mobile-policy.png'),style:'body header,.sb-nav,nextjs-portal{visibility:hidden!important}'});}
 }
 assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);
 const report={status:accessibility.violations.length?'needs-accessibility-fixes':'passed',figures:20,chapters:12,downloadChecks:files.length,responsive,accessibilityViolations:accessibility.violations.map(v=>({id:v.id,impact:v.impact,count:v.nodes.length})),errors,consoleErrors,screenshots};fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();if(accessibility.violations.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1);});
