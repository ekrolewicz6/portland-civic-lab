import {chromium} from 'playwright';
import {mkdirSync,writeFileSync,appendFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const origin='http://127.0.0.1:3145';
const base='/deep-dives/campaign-finance';
async function run(){
  const out='runtime-data/orestar-analysis/verification';mkdirSync(out,{recursive:true});
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  const errors:string[]=[];const checks:Record<string,unknown>={};
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    page.on('pageerror',e=>errors.push(e.message));
    let response=await page.goto(origin+base,{waitUntil:'networkidle',timeout:60000});
    assert.equal(response?.status(),200);assert.match(await page.locator('h1').innerText(),/Many transactions/);
    assert.equal(await page.locator('[data-nextjs-dialog]').count(),0);
    const stories=await page.locator('#emerging-stories').innerText();
    for(const fact of ['$20,056,194.92','49.9%','$8,376,671.93','$964,650.50','66.1%'])assert.ok(stories.includes(fact),fact);
    checks.storyFigures='New headline figures appear and agree with independently verified evidence';
    await page.screenshot({path:out+'/report-desktop.png',fullPage:true});checks.article='200; meaningful heading; no framework overlay';
    response=await page.goto(origin+base+'/explorer?committee=4792&basis=cash_contribution',{waitUntil:'networkidle',timeout:60000});
    assert.equal(response?.status(),200);assert.match(await page.locator('body').innerText(),/12,793,504.47/);
    assert.ok(await page.getByRole('link',{name:'Next →',exact:true}).count());
    await page.screenshot({path:out+'/explorer-desktop.png',fullPage:true});checks.filteredExplorer='Committee 4792 cash total agrees with report: 1279350447 cents';
    await Promise.all([page.waitForURL(url=>url.searchParams.get('page')==='2'),page.getByRole('link',{name:'Next →',exact:true}).click()]);await page.waitForLoadState('networkidle');assert.ok(page.url().includes('page=2'));checks.pagination='URL retains filters and moves to page 2';
    const api=await page.request.get(origin+'/api/campaign-finance?committee=4792&basis=cash_contribution');assert.equal(api.status(),200);const result=await api.json();assert.equal(Number(result.totals[0].amount_cents),1279350447);assert.equal(result.rows.length,25);checks.api='Validated filters → read-only immutable DB → expected JSON';
    for(const query of ['basis=bad','start=2026-02-30','page=-1','snapshot=live','sql=select'])assert.equal((await page.request.get(origin+'/api/campaign-finance?'+query)).status(),400);
    checks.invalidFilters='5 invalid requests rejected with 400';
    for(const [family,expected] of [['contributions',217239],['everything_else',99687]] as const){const r=await page.request.get(origin+'/api/campaign-finance?family='+family);assert.equal(r.status(),200);assert.equal((await r.json()).records,expected);}
    checks.familyFilters='217,239 contributions + 99,687 other records = 316,926';
    const raceApi=await page.request.get(origin+'/api/campaign-finance?race=portland-district-3');assert.equal(raceApi.status(),200);assert.ok((await raceApi.json()).records>0);
    const guide=await page.goto(origin+'/voters-guide/portland-district-3/tiffany-koyama-lane',{waitUntil:'networkidle'});assert.equal(guide?.status(),200);assert.ok(await page.getByRole('link',{name:/Explore committee 23208/}).count());checks.voterGuide='Reviewed committee link is present';
    for(const path of ['/entities/committee:4792','/races','/races/portland-district-3','/questions','/methodology','/evidence','/api-reference']){
      const r=await page.goto(origin+base+path,{waitUntil:'networkidle',timeout:60000});assert.equal(r?.status(),200,path);assert.equal(await page.locator('[data-nextjs-dialog]').count(),0,path);
    }
    checks.supportingRoutes='Entity, race index/comparison, questions, methodology and evidence all return 200';
    await page.setViewportSize({width:390,height:844});
    await page.goto(origin+base+'/explorer',{waitUntil:'networkidle'});
    const dimensions=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(dimensions.scroll<=dimensions.viewport+1,JSON.stringify(dimensions));
    await page.getByLabel('Name search',{exact:true}).focus();await page.keyboard.type('Kotek');await page.keyboard.press('Tab');assert.equal(await page.locator('[name=basis]').evaluate(e=>e===document.activeElement),true);
    await page.screenshot({path:out+'/explorer-mobile.png',fullPage:true});checks.mobile='390px viewport: no document overflow; labeled inputs and keyboard progression';
    await page.goto(origin+base+'/explorer?q=zzzz-no-such-campaign-zzzz',{waitUntil:'networkidle'});assert.match(await page.locator('body').innerText(),/No matching records/);checks.emptyState='Missing results not represented as zero campaign fundraising';
    // Stream full evidence, count CSV records without counting embedded newlines.
    const download=await fetch(origin+'/api/campaign-finance?format=csv');assert.equal(download.status,200);assert.ok(download.body);
    const hash=createHash('sha256');const decoder=new TextDecoder();let quoted=false,lines=0,bytes=0,header='';
    for await(const chunk of download.body){hash.update(chunk);bytes+=chunk.length;const text=decoder.decode(chunk,{stream:true});if(!header.includes('\n'))header+=text.slice(0,text.indexOf('\n')+1);for(const ch of text){if(ch==='"')quoted=!quoted;else if(ch==='\n'&&!quoted)lines++;}}
    assert.equal(lines,316927);assert.ok(!/addr|occupation|employer/i.test(header));assert.match(header,/snapshot,metric_definition/);
    checks.fullExport={records:lines-1,bytes,sha256:hash.digest('hex'),residentialAddressColumns:false};
    assert.deepEqual(errors,[]);checks.pageErrors=errors;
    const verificationResult={status:'passed',at:new Date().toISOString(),checks};writeFileSync(out+'/results.json',JSON.stringify(verificationResult,null,2));appendFileSync(out+'/events.ndjson',JSON.stringify(verificationResult)+'\n');
    console.log(JSON.stringify(checks,null,2));
  }catch(error){appendFileSync(out+'/events.ndjson',JSON.stringify({status:'failed',at:new Date().toISOString(),checks,error:String(error)})+'\n');writeFileSync(out+'/results.json',JSON.stringify({status:'failed',at:new Date().toISOString(),checks,errors,error:String(error)},null,2));throw error;}
  finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
