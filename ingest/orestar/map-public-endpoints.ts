/** Reconstruct public UI contracts, not an official or exhaustive private API. */
import {chromium,type Page} from 'playwright';
import {createHash} from 'node:crypto';
import {appendFileSync,existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const ORIGIN='https://secure.sos.state.or.us';
const archive=resolve('runtime-data/orestar-analysis/endpoint-map');
const out=resolve('research/campaign-finance/api');
const sensitive=/csrf|session|password|token/i;
const safeError=(error:unknown)=>String(error).split('\n')[0].replace(/(OWASP_CSRFTOKEN=)[^&\s]+/gi,'$1SESSION_VALUE');
const clean=(url:string)=>{try{const u=new URL(url,ORIGIN+'/orestar/');u.pathname=u.pathname.replace(/;JSESSIONID[^/]*/i,'');for(const k of [...u.searchParams.keys()])if(sensitive.test(k))u.searchParams.set(k,'SESSION_VALUE');return u.href;}catch{return url;}};
type Endpoint={path:string;methods:string[];observations:{source:string;kind:string;query:string[];example:string}[];responses:{status:number;contentType:string}[];forms:unknown[];status:string};
const endpoints=new Map<string,Endpoint>();
const pages:unknown[]=[];
const scriptUrls=new Set<string>();
const events:unknown[]=[];
function record(url:string,method:string,source:string,kind:string){
  const u=new URL(url,ORIGIN+'/orestar/');
  if(u.origin!==ORIGIN||!u.pathname.startsWith('/orestar/')||/\.(png|jpg|gif|css|woff|ico)$/i.test(u.pathname))return;
  const path=u.pathname.replace(/;JSESSIONID[^/]*/i,'');
  const row=endpoints.get(path)??{path,methods:[],observations:[],responses:[],forms:[],status:'observed-reference-only'};
  if(method&&!row.methods.includes(method))row.methods.push(method);
  const observation={source:clean(source),kind,query:[...new Set(u.searchParams.keys())].sort(),example:clean(u.href)};
  if(!row.observations.some(o=>JSON.stringify(o)===JSON.stringify(observation)))row.observations.push(observation);
  endpoints.set(path,row);return row;
}
async function ready(page:Page){await page.waitForFunction(()=>document.body?.innerText.includes('Elections Division'),{},{timeout:25000});}
async function capture(page:Page,label:string){
  await ready(page);
  const state=await page.evaluate(()=>({
    title:document.title,text:document.body.innerText,
    forms:Array.from(document.forms).map(f=>({name:f.name,action:f.action,method:f.method.toUpperCase(),fields:Array.from(f.elements).map(e=>{const el=e as HTMLInputElement;const select=e as unknown as HTMLSelectElement;return {name:el.name,type:el.type,required:el.required||false,value:/csrf|session|password|token/i.test(el.name)?'[SESSION VALUE]':el.value,options:el.tagName==='SELECT'?Array.from(select.options).map(o=>({value:o.value,label:o.text})):undefined};}).filter(e=>e.name)})),
    links:Array.from(document.querySelectorAll('a')).map(a=>({label:a.textContent?.trim()||'',url:a.href})),
    scripts:Array.from(document.scripts).map(s=>({src:s.src,text:s.src?'':s.textContent||''}))
  }));
  const html=await page.content();const sha256=createHash('sha256').update(html).digest('hex');
  writeFileSync(resolve(archive,label+'.html'),html);
  writeFileSync(resolve(archive,label+'.json'),JSON.stringify({...state,url:clean(page.url()),sha256},null,2));
  const source=clean(page.url());
  const endpoint=record(source,'',source,'loaded-page');if(endpoint)endpoint.status='page-loaded';
  for(const f of state.forms){const route=record(f.action,f.method,source,'html-form');route?.forms.push({source,...f,action:clean(f.action)});}
  for(const link of state.links)if(link.url.startsWith(ORIGIN))record(link.url,'GET',source,'anchor');
  for(const script of state.scripts){
    if(script.src){if(script.src.startsWith(ORIGIN)){record(script.src,'GET',source,'script-asset');scriptUrls.add(script.src);}}
    for(const match of script.text.matchAll(/["']([^"'\s<>]*(?:\.do|\.action|Xcel\w+)(?:\?[^"'<>]*)?)["']/g))try{record(new URL(match[1],page.url()).href,'',source,'inline-script-reference');}catch{}
  }
  pages.push({label,url:source,sha256,forms:state.forms.map(f=>({...f,action:clean(f.action)})),links:state.links.filter(l=>l.url.startsWith(ORIGIN)).map(l=>({...l,url:clean(l.url)})),version:state.text.match(/Version:\s*([^\s)]+)/)?.[1]});
  return state;
}
async function run(){
  mkdirSync(archive,{recursive:true});mkdirSync(out,{recursive:true});
  const lock=resolve('runtime-data/orestar-analysis/enrichment/.collector.lock');
  if(existsSync(lock))throw Error('ORESTAR enrichment collector is active; endpoint discovery must be sequential.');
  if(process.argv.includes('--expand-only')&&existsSync(resolve(out,'endpoint-catalogue.json'))){
    const prior=JSON.parse(readFileSync(resolve(out,'endpoint-catalogue.json'),'utf8'));
    prior.endpoints.forEach((e:Endpoint)=>endpoints.set(e.path,e));pages.push(...prior.pages);events.push(...prior.failures);
  }
  const browser=await chromium.launch({channel:'chrome',headless:!process.argv.includes('--headed')});const page=await browser.newPage();
  page.setDefaultTimeout(25000);
  page.on('response',r=>{
    if(!['document','xhr','fetch'].includes(r.request().resourceType()))return;
    const route=record(r.url(),r.request().method(),page.url(),'network-response');
    if(route){route.responses.push({status:r.status(),contentType:r.headers()['content-type']||''});if(r.ok())route.status='response-observed';}
  });
  async function visit(url:string,label:string){
    for(let attempt=1;attempt<=3;attempt++)try{await page.waitForTimeout(850);await page.goto(url,{waitUntil:'load',timeout:35000});const result=await capture(page,label);console.log(label,`forms=${result.forms.length}`,result.forms.map(f=>({name:f.name,action:clean(f.action),fields:f.fields})));return result;}catch(error){const event={label,url:clean(url),attempt,error:safeError(error),at:new Date().toISOString()};events.push(event);appendFileSync(resolve(archive,'events.ndjson'),JSON.stringify(event)+'\n');if(attempt<3)await page.waitForTimeout(1500*attempt);}
  }
  try{
    if(!process.argv.includes('--expand-only')) {
    const entry=await visit(ORIGIN+'/orestar/GotoSearchByName.do','committee-search');
    if(!entry)throw Error('Public entry page unavailable');
    const publicLabels=['Committees/Filers by Election','Committees by Measure/Petition','Campaign Finance Transactions','Campaign Finance Certificates','Candidate Filings','Local Measures'];
    for(const label of publicLabels){
      // Tokens are session-scoped; use actual observed link from the live page.
      const link=entry.links.find(l=>l.label===label);if(link)await visit(link.url,label.toLowerCase().replace(/[^a-z]+/g,'-'));
    }
    await visit(ORIGIN+'/orestar/GotoSearchByName.do','committee-search-repeat');
    await page.locator('[name=committeeId]').fill('3865');
    await Promise.all([page.waitForNavigation({waitUntil:'load'}),page.locator('input[name=submit][value=Submit]').click()]);
    const profile=await capture(page,'committee-profile');
    const readLinks=['Prior Statement of Organization','Persons Associated with Committee','Election Activity Log','History','Account Summary','Campaign Finance Activity'];
    for(const label of readLinks){const link=profile.links.find(l=>l.label===label);if(link){const detail=await visit(link.url,label.toLowerCase().replace(/[^a-z]+/g,'-'));if(label==='Account Summary'&&detail){const prev=page.locator('input[name=buttonName][value=Prev]').first();if(await prev.count()){await Promise.all([page.waitForNavigation({waitUntil:'load'}),prev.click()]);await capture(page,'account-summary-previous-year');}}if(label==='Campaign Finance Activity'&&detail){const transaction=detail.links.find(l=>l.url.includes('gotoPublicTransactionDetail.do'));if(transaction)await visit(transaction.url,'transaction-detail');}}}
    }
    // Exercise bounded public searches through the UI to expose result/detail contracts.
    if(!process.argv.includes('--skip-candidates')) { try {
    await visit(ORIGIN+'/orestar/CFSearchPage.do','candidate-search-contract');
    await page.locator('[name=cfName]').fill('Kotek');
    await page.locator('[name=cfyearActive]').selectOption('2026');
    await page.waitForTimeout(1200);
    await capture(page,'candidate-dependent-options');
    await Promise.all([page.waitForNavigation({waitUntil:'load'}),page.locator('#submitSearch').click()]);
    const candidates=await capture(page,'candidate-results-2026-kotek');
    const candidateLink=candidates.links.find(l=>/cfDetail|candidateDetail|cfDetailPage/i.test(l.url));
    if(candidateLink)await visit(candidateLink.url,'candidate-detail');
    } catch(error) { events.push({surface:'candidate-search',error:safeError(error)});writeFileSync(resolve(archive,'candidate-failure.txt'),await page.locator('body').innerText());} }
    try {
    await visit(ORIGIN+'/orestar/gotoPublicCertificateSearch.do','certificate-search-contract');
    await Promise.all([page.waitForNavigation({waitUntil:'load'}),page.locator('input[name=search][value=Submit]').click()]);
    await capture(page,'certificates-2026');
    } catch(error) {events.push({surface:'certificate-search',error:safeError(error)});writeFileSync(resolve(archive,'certificate-failure.txt'),await page.locator('body').innerText());}
    try {
    await visit(ORIGIN+'/orestar/gotoLocalMeasSearch.do','measure-search-contract');
    await page.locator('[name=electionYear]').selectOption('2026');
    await page.waitForTimeout(1200);
    await page.locator('[name=county]').selectOption('26');
    await page.waitForTimeout(1200);
    await capture(page,'measure-dependent-options');
    await Promise.all([page.waitForNavigation({waitUntil:'load'}),page.locator('input[name=search][value=Submit]').click()]);
    const measures=await capture(page,'measure-results-2026-multnomah');
    const measureLink=measures.links.find(l=>/localMeasureDetail|measureDetail/i.test(l.url));
    if(measureLink)await visit(measureLink.url,'measure-detail');
    } catch(error) {events.push({surface:'measure-search',error:safeError(error)});writeFileSync(resolve(archive,'measure-failure.txt'),await page.locator('body').innerText());}
    // All candidates here came from delivered public page scripts, not guessed routes.
    for(const example of scriptUrls){
      if(!/\.js(?:\?|$)/.test(example)||/jquery|navgoco|blockui|bootstrap|wz_tooltip/i.test(example))continue;
      await page.waitForTimeout(850);
      try{const response=await page.request.get(example);if(!response.ok())continue;const script=await response.text();writeFileSync(resolve(archive,'script-'+createHash('sha256').update(example).digest('hex').slice(0,12)+'.js'),script);for(const m of script.matchAll(/["']([^"'\s<>]*(?:\.do|\.action|Xcel\w+)(?:\?[^"'<>]*)?)["']/g))try{record(new URL(m[1],example).href,'',example,'external-script-reference');}catch{}}catch(error){events.push({url:clean(example),error:safeError(error)});}
    }
  }catch(error){events.push({stage:'workflow',error:safeError(error),at:new Date().toISOString()});throw error;}finally{
    await browser.close();
    const rows=[...endpoints.values()].sort((a,b)=>a.path.localeCompare(b.path));
    const catalogue={version:'public-ui-contracts-v1',generatedAt:new Date().toISOString(),scope:'Observed public ORESTAR campaign-finance and election UI only. Not an official API specification; private/authenticated routes not exercised. References do not establish callable methods.',officialSpecSearch:{status:'No official public read API/OpenAPI specification located in searched Secretary of State documentation. Official XML upload specifications exist but describe authorized filing, not bulk public reads.',source:'https://sos.oregon.gov/elections/Pages/manuals-tutorials.aspx'},endpoints:rows,pages,failures:events.map(event=>{const e=event as Record<string,unknown>;return {...e,...(e.error?{error:safeError(e.error)}:{})};})};
    writeFileSync(resolve(out,'endpoint-catalogue.json'),JSON.stringify(catalogue,null,2)+'\n');
    writeFileSync(resolve(out,'README.md'),`# ORESTAR public endpoint catalogue\n\nReconstructed from ordinary public pages, forms, script references and observed network requests. **Not an official or exhaustive API specification.**\n\nGenerated ${catalogue.generatedAt}. ${rows.length} observed routes/assets; ${pages.length} page states inspected.\n\n| Route | Observed methods | Verification |\n|---|---|---|\n${rows.map(e=>`| \`${e.path}\` | ${e.methods.join(', ')||'Unknown'} | ${e.status} |`).join('\n')}\n\nSee endpoint-catalogue.json for form fields, select values, session markers, sources, response types and failures. Do not treat all references as executable or authenticated authorization. Use the existing session and fresh CSRF token; never hard-code saved tokens. Search POSTs change search-session state but do not file transactions. No filing, amendment, registration or account mutation was exercised.\n`);
    console.log(`Saved ${rows.length} routes/assets, ${pages.length} page states, ${events.length} failure attempts.`);
  }
}
run().catch(e=>{console.error(e);process.exitCode=1;});
