const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.SMALL_BUSINESS_PREVIEW||'http://localhost:3015';
const output=path.resolve(__dirname,'../../runtime-data/small-business/osb-review-2026-10-05');
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/deep-dives/small-business',{waitUntil:'networkidle'});
 const osb=page.locator('#osb-year-one');
 assert.equal(await osb.locator('.sb-osb-share-row').count(),28);
 assert.equal(await osb.locator('.sb-osb-districts > div').count(),4);
 assert.equal(await osb.locator('article').count(),4);
 assert.match(await osb.locator('.sb-osb-reconcile').innerText(),/126[\s\S]*136/);
 assert.match(await osb.locator('.sb-osb-reading').innerText(),/102%/);
 for(const p of [2,4,5,6,7,8,9,10,11,12,13])assert.equal(await osb.locator(`a[href$="#page=${p}"]`).count()>0,true,`missing page ${p} citation`);
 for(const detail of await osb.locator('details').all()){
  await detail.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await detail.getAttribute('open')!==null,true);
 }
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 const audit=await page.evaluate(async()=>await axe.run('#osb-year-one',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
 fs.writeFileSync(path.join(output,'accessibility.json'),JSON.stringify(audit.violations,null,2));assert.deepEqual(audit.violations,[]);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow at ${width}`);
  await osb.locator('.sb-osb-mix').screenshot({path:path.join(output,`mix-${width}.png`),style:"body header,.sb-nav{visibility:hidden!important}"});
  if(width!==320)await osb.locator('.sb-osb-cases').screenshot({path:path.join(output,`cases-${width}.png`),style:"body header,.sb-nav{visibility:hidden!important}"});
 }
 assert.deepEqual(errors,[]);
 const noJs=await browser.newContext({javaScriptEnabled:false});const plain=await noJs.newPage();await plain.goto(base+'/deep-dives/small-business');assert.equal(await plain.locator('#osb-year-one .sb-osb-share-row').count(),28);assert.equal(await plain.locator('#osb-year-one article').count(),4);await noJs.close();
 const result={status:'passed',categories:28,districts:4,cases:4,pageCitations:true,nativeDetailsKeyboard:true,noJavaScriptContent:true,accessibilityViolations:0,viewportWidths:[1440,390,320],errors};
 fs.writeFileSync(path.join(output,'browser-checks.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
