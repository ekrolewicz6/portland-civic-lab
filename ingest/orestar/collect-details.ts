/** Public transaction detail collection, with a frozen independent-spending queue. */
import {acquirePublicSession} from './session-lock';
import {chromium,type Page} from 'playwright';
import {createHash} from 'node:crypto';
import {appendFileSync,existsSync,mkdirSync,readFileSync,renameSync,unlinkSync,writeFileSync} from 'node:fs';
import {spreadsheetRows} from './download-contributions';
const root='runtime-data/orestar-analysis/details';
const file=root+'/manifest.json';
const hash=(data:string|Buffer)=>createHash('sha256').update(data).digest('hex');
const clean=(url:string)=>{const u=new URL(url);u.pathname=u.pathname.replace(/;JSESSIONID[^/]*/i,'');for(const k of [...u.searchParams.keys()])if(/csrf|session|token/i.test(k))u.searchParams.delete(k);return u.href;};
type Partition={start:string;end:string;status:'pending'|'split'|'complete';children?:Partition[];count?:number;path?:string;sha256?:string;ids?:string[]};
type Item={status:'complete'|'failed';path?:string;sha256?:string;attempts:number;error?:string};
type Manifest={version:1;roots:Partition[];independentIds?:string[];items:Record<string,Item>};
const save=(m:Manifest)=>{writeFileSync(file+'.tmp',JSON.stringify(m,null,2)+'\n');renameSync(file+'.tmp',file);};
const event=(e:object)=>appendFileSync(root+'/events.ndjson',JSON.stringify({at:new Date().toISOString(),...e})+'\n');
const date=(d:string)=>d.slice(5,7)+'/'+d.slice(8,10)+'/'+d.slice(0,4);
async function ready(page:Page){await page.waitForFunction(()=>document.body?.innerText.includes('Elections Division'),{},{timeout:25000});}
async function run(){
  mkdirSync(root,{recursive:true});
  const release=acquirePublicSession();
  const browser=await chromium.launch({channel:'chrome',headless:!process.argv.includes('--headed')}).catch(error=>{release();throw error;});
  const context=await browser.newContext({acceptDownloads:true});
  const m:Manifest=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{version:1,roots:[{start:'2025-01-01',end:'2025-12-31',status:'pending'},{start:'2026-01-01',end:'2026-09-27',status:'pending'}],items:{}};
  save(m);
  const page=await context.newPage();page.setDefaultTimeout(20000);
  async function partition(p:Partition):Promise<string[]>{
    if(p.status==='split'){const ids:string[]=[];for(const child of p.children!)ids.push(...await partition(child));return ids;}
    if(p.status==='complete'&&p.path&&existsSync(p.path)&&hash(readFileSync(p.path))===p.sha256)return p.ids!;
    for(let attempt=1;attempt<=3;attempt++)try{
      await page.waitForTimeout(1000);
      await page.goto('https://secure.sos.state.or.us/orestar/gotoPublicTransactionSearch.do',{waitUntil:'load'});await ready(page);
      await page.locator('[name=cneSearchTranStartDate]').fill(date(p.start));
      await page.locator('[name=cneSearchTranEndDate]').fill(date(p.end));
      await page.locator('[name=cneSearchIndependentInd]').check();
      await Promise.all([page.waitForNavigation({waitUntil:'load'}),page.locator('input[name=search]').first().click()]);await ready(page);
      const text=await page.locator('body').innerText();
      writeFileSync(root+'/search-result.txt',text);writeFileSync(root+'/search-result.html',await page.content());
      const retained=await page.locator('a').evaluateAll(links=>links.some(a=>{try{return new URL(a.href).searchParams.get('cneSearchIndependentInd')==='I';}catch{return false;}}));
      if(!retained)throw Error('Independent-spending search criterion was not retained');
      const match=text.match(/Results\s*:\s*([\d,]+)\s+records found/i);if(!match)throw Error('Search count unavailable');
      p.count=Number(match[1].replaceAll(',',''));event({type:'search_count',start:p.start,end:p.end,count:p.count});
      if(p.count>5000){
        if(p.start===p.end)throw Error('One-day partition exceeds export cap; subtype subdivision required');
        const start=Date.parse(p.start),end=Date.parse(p.end),mid=start+Math.floor((end-start)/86400000/2)*86400000;
        p.children=[{start:p.start,end:new Date(mid).toISOString().slice(0,10),status:'pending'},{start:new Date(mid+86400000).toISOString().slice(0,10),end:p.end,status:'pending'}];p.status='split';save(m);return partition(p);
      }
      const path=root+`/independent-${p.start}_${p.end}.xlsx`;
      const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:'Export To Excel Format'}).first().click()]);await download.saveAs(path+'.part');
      const rows=spreadsheetRows(path+'.part');if(rows.rows.length!==p.count)throw Error('Export count disagrees with search');
      renameSync(path+'.part',path);p.path=path;p.sha256=hash(readFileSync(path));p.ids=rows.rows.map(r=>r[rows.transactionIdIndex]);p.status='complete';save(m);console.log(`Independent ${p.start}–${p.end}: ${p.count}`);return p.ids;
    }catch(error){event({type:'partition_failure',start:p.start,end:p.end,attempt,error:String(error).split('\n')[0]});if(attempt===3||String(error).includes('criterion was not retained'))throw error;await page.waitForTimeout(1500*attempt);}
    throw Error('Partition unavailable');
  }
  try{
    if(process.argv.includes('--independent')&&!m.independentIds){const ids:string[]=[];for(const p of m.roots)ids.push(...await partition(p));if(new Set(ids).size!==ids.length)throw Error('Duplicate IDs across independent partitions');m.independentIds=ids;save(m);}
    const specified=process.argv.find(a=>a.startsWith('--ids='))?.slice(6).split(',');
    await page.close(); // ORESTAR explicitly supports only one active tab.
    const queue=specified??m.independentIds??[];
    const limit=Number(process.argv.find(a=>a.startsWith('--limit='))?.slice(8)??queue.length);
    let consecutiveFailures=0;
    for(const id of queue.slice(0,limit)){
      if(!/^\d+$/.test(id))throw Error('Invalid source transaction ID');
      const prior=m.items[id];if(prior?.status==='complete'&&prior.path&&existsSync(prior.path)&&hash(readFileSync(prior.path))===prior.sha256&&!JSON.parse(readFileSync(prior.path,'utf8')).text.includes('ORESTAR does not support multiple tabs'))continue;
      const item:Item=prior??{status:'failed',attempts:0};m.items[id]=item;
      for(let attempt=1;attempt<=3;attempt++){
        // Detail pages submit Back on beforeunload. Close the previous page
        // before creating this one: never hold two ORESTAR tabs open.
        const detail=await context.newPage();detail.setDefaultTimeout(20000);
        try{
          item.attempts++;await detail.waitForTimeout(1000);
          await detail.goto('https://secure.sos.state.or.us/orestar/gotoPublicTransactionDetail.do?tranRsn='+id,{waitUntil:'load'});await ready(detail);
          const text=await detail.locator('body').innerText();
          if(text.includes('ORESTAR does not support multiple tabs'))throw Error('Single-tab requirement was not satisfied');
          if(!new RegExp('Transaction ID\\s*:\\s*'+id+'\\b').test(text))throw Error('Transaction detail identity mismatch');
          const tables=await detail.locator('tr').evaluateAll(rows=>rows.map(r=>Array.from(r.querySelectorAll(':scope > td,:scope > th')).map(c=>c.textContent?.replace(/\s+/g,' ').trim()??'')).filter(r=>r.length));
          const links=await detail.locator('a').evaluateAll(a=>a.map(x=>({text:x.innerText,href:x.href})));
          const content=JSON.stringify({transactionId:id,retrievedAt:new Date().toISOString(),source:clean(detail.url()),text,rows:tables,links:links.map(l=>({...l,href:l.href.startsWith('http')?clean(l.href):l.href}))},null,2);
          const path=root+'/transaction-'+id+'-'+hash(content).slice(0,12)+'.json';writeFileSync(path,content);writeFileSync(path.replace('.json','.html'),await detail.content());
          item.path=path;item.sha256=hash(content);item.status='complete';delete item.error;save(m);event({type:'detail_complete',id,path,sha256:item.sha256});console.log(id+': complete');consecutiveFailures=0;break;
        }catch(error){item.status='failed';item.error=String(error).split('\n')[0];save(m);event({type:'detail_failure',id,attempt,error:item.error});if(attempt===3)consecutiveFailures++;else await detail.waitForTimeout(1500*attempt);}
        finally{await detail.close();}
      }
      if(consecutiveFailures>=3)throw Error('Three consecutive detail workflows failed; circuit breaker stopped collection');
    }
  }finally{await browser.close();release();}
}
run().catch(error=>{console.error(String(error).split('\n')[0]);process.exitCode=1;});
