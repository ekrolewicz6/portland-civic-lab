import {chromium} from 'playwright';
import {mkdirSync,writeFileSync,appendFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {candidateFinance,financeFacts} from '../../src/lib/campaign-finance/candidate-facts';
import {money} from '../../src/lib/campaign-finance/filters';

const origin='http://127.0.0.1:3145';
const out='runtime-data/orestar-analysis/verification/candidate-finance';
async function run(){
  mkdirSync(out,{recursive:true});
  const checks:Record<string,unknown>={};const errors:string[]=[];
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  try{
    const page=await browser.newPage({viewport:{width:1360,height:1000}});
    page.on('pageerror',e=>errors.push(e.message));
    const goto=async(path:string)=>{const r=await page.goto(origin+path,{waitUntil:'networkidle',timeout:60000});assert.equal(r?.status(),200,path);assert.equal(await page.locator('[data-nextjs-dialog]').count(),0,path);};
    await goto('/voters-guide/portland-district-3/tiffany-koyama-lane');
    const profile=page.locator('#campaign-finance');
    assert.match(await profile.innerText(),/277,809\.22/);assert.match(await profile.innerText(),/200,000\.00/);assert.match(await profile.innerText(),/77,809\.22/);
    await profile.getByText('Monthly cash, loan and noncash records',{exact:true}).focus();
    await page.keyboard.press('Enter');
    assert.equal(await profile.locator('details').first().getAttribute('open'),'');
    assert.match(await profile.innerText(),/2025-01/);assert.match(await profile.innerText(),/2026-09/);
    await profile.getByText(/Largest disclosed sources outside City matching/).click();
    await profile.getByText('Official reported cash and outstanding obligations',{exact:true}).click();
    await profile.screenshot({path:out+'/candidate-desktop.png'});
    checks.candidate='Exact cash, matching and nonmatching amounts; keyboard-operable monthly table, donor disclosure and official accounts';
    const download=await page.request.get(origin+candidateFinance('portland-district-3','tiffany-koyama-lane')[0].evidenceUrl);
    assert.equal(download.status(),200);const csv=await download.text();assert.match(csv.split('\n')[0],/snapshot,transaction_id/);assert.doesNotMatch(csv.split('\n')[0],/address|street|employer|occupation/);
    checks.evidence='Per-committee CSV returns 200 with explicit source category and no residential address fields';
    await page.setViewportSize({width:390,height:844});
    for(const path of ['/voters-guide/portland-district-3/tiffany-koyama-lane','/voters-guide/portland-district-3','/deep-dives/campaign-finance/races/portland-district-4']){
      await goto(path);const dimensions=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(dimensions.scroll<=dimensions.viewport+1,JSON.stringify({path,...dimensions}));
      const target=page.locator(path.includes('tiffany-')?'#campaign-finance':'#race-fundraising');
      await target.screenshot({path:out+(path.includes('tiffany-')?'/candidate-mobile.png':path.includes('district-4')?'/race-d4-mobile.png':'/race-d3-mobile.png')});
      if(path.includes('tiffany-')){
        await target.getByText('Monthly cash, loan and noncash records',{exact:true}).click();
        await target.getByText(/Largest disclosed sources outside City matching/).click();
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      }
    }
    checks.mobile='390px viewport has no document overflow, including expanded financial tables';
    await page.setViewportSize({width:1360,height:1000});
    await goto('/voters-guide/portland-district-3');
    const race=page.locator('#race-fundraising');const story=await race.innerText();
    assert.match(story,/9 of 21 candidates/);assert.match(story,/Tiffany Koyama Lane reported the highest gross cash/);assert.match(story,/Steve Novick reported the highest cash total excluding/);assert.match(story,/No reviewed link; not zero/);
    assert.equal(await race.locator('tbody tr').count(),21);await race.screenshot({path:out+'/race-desktop.png'});
    await goto('/voters-guide/portland-district-4');assert.match(await page.locator('#race-fundraising').innerText(),/8 of 12 candidates/);
    await goto('/deep-dives/campaign-finance/races/portland-district-3');assert.equal(await page.locator('#race-fundraising').innerText(),story);
    checks.races='Guide and deep-dive share identical factual summaries and all candidates, including missing coverage';
    await goto('/voters-guide/portland-district-3/ali-beaudoin');assert.match(await page.locator('#campaign-finance').innerText(),/missing coverage, not zero fundraising/);
    await goto('/voters-guide/oregon-us-senate');assert.match(await page.locator('#race-fundraising').innerText(),/FEC records/);assert.equal(await page.locator('#race-fundraising tbody tr').count(),0);
    checks.missing='Unlinked candidate stays unknown; federal race requests FEC data, not ORESTAR zeroes';
    await goto('/deep-dives/campaign-finance/entities/committee:23208');assert.match(await page.locator('#campaign-finance').innerText(),/277,809\.22/);
    checks.entity='Reviewed candidate facts also appear on linked committee profile';
    let checked=0;
    for(const link of financeFacts.links){
      const response=await page.request.get(`${origin}/voters-guide/${link.raceId}/${link.candidateId}`);assert.equal(response.status(),200,link.candidateId);const body=await response.text();
      const c=financeFacts.committees[link.committeeId];assert.ok(body.includes('candidate-finance-heading'));assert.ok(body.includes(money(c.cashCents)),link.candidateId);assert.ok(body.includes(c.evidenceUrl),link.candidateId);checked++;
    }
    checks.reviewedProfiles=checked;assert.deepEqual(errors,[]);
    const result={status:'passed',at:new Date().toISOString(),checks,pageErrors:errors};writeFileSync(out+'/results.json',JSON.stringify(result,null,2));appendFileSync(out+'/attempts.ndjson',JSON.stringify(result)+'\n');console.log(JSON.stringify(result,null,2));
  }catch(error){const failure={status:'failed',at:new Date().toISOString(),checks,pageErrors:errors,error:String(error)};appendFileSync(out+'/attempts.ndjson',JSON.stringify(failure)+'\n');writeFileSync(out+'/results.json',JSON.stringify(failure,null,2));throw error;}
  finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
