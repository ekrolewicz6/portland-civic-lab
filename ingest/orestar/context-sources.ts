import {chromium} from 'playwright';
import {createHash} from 'node:crypto';
import {appendFileSync,existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const sources=[
  ['portland-roster','https://www.portland.gov/auditor/elections/run4office/2026-city-candidates'],
  ['sde-rules','https://www.portland.gov/smalldonorelections/how-are-sde-and-non-sde-candidates-raising-money-0'],
  ['sde-2026','https://www.portland.gov/smalldonorelections/all-about-2026-election'],
  ['sde-portal','https://openelectionsportland.org/'],
  ['certified-results-index','https://sos.oregon.gov/elections/pages/historical-data.aspx'],
  ['portland-lobbying','https://www.portland.gov/auditor/lobbyist'],
];
async function run(){
  const root=resolve('runtime-data/orestar-analysis/context');mkdirSync(root,{recursive:true});
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    for(const[id,url]of sources){
      if(existsSync(resolve(root,id+'.json')))continue;
      for(let attempt=1;attempt<=3;attempt++){
        const page=await browser.newPage();
        const requests:string[]=[];
        page.on('response',r=>{if(r.request().resourceType()==='xhr'||r.request().resourceType()==='fetch')requests.push(r.url());});
        try{
          const response=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
          if(!response?.ok())throw Error(`HTTP ${response?.status()}`);
          const text=await page.locator('body').innerText();
          const links=await page.locator('a').evaluateAll(anchors=>anchors.map(a=>({label:a.textContent?.trim(),url:a.href})));
          const html=await page.content();
          const data={id,url,retrievedAt:new Date().toISOString(),sha256:createHash('sha256').update(html).digest('hex'),text,links,requests};
          writeFileSync(resolve(root,id+'.html'),html);writeFileSync(resolve(root,id+'.json'),JSON.stringify(data,null,2));
          console.log(id,JSON.stringify({text:text.slice(0,1600),requests,links:links.filter(l=>/result|2026|data|download|match|qualif|contribut|certif/i.test(l.label??''))}));
          break;
        }catch(error){appendFileSync(resolve(root,'events.ndjson'),JSON.stringify({id,url,attempt,at:new Date().toISOString(),error:String(error)})+'\n');console.warn(id,String(error));}
        finally{await page.close();}
      }
    }
  }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
