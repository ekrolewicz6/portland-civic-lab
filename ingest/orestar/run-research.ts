/** Bulk, local-only research DAG. No browser launches or source requests. */
import {spawn,type ChildProcess} from 'node:child_process';
import {createHash} from 'node:crypto';
import {appendFileSync,existsSync,mkdirSync,readFileSync,renameSync,unlinkSync,writeFileSync} from 'node:fs';
import {dirname,resolve,sep} from 'node:path';

const root=resolve('runtime-data/orestar-analysis/research-runs');mkdirSync(root,{recursive:true});
const python=resolve('runtime-data/orestar-analysis/py312/bin/python');
const code='ingest/orestar/analysis/';
const research='research/campaign-finance/';
const published='public/data/campaign-finance/';
const app='src/lib/campaign-finance/';
const snapshot=research+'snapshot-manifest.json';
const snapshotData=JSON.parse(readFileSync(snapshot,'utf8'));
const work='runtime-data/orestar-analysis/'+snapshotData.snapshot+'/';
const jobs=Number(process.argv.find(a=>a.startsWith('--jobs='))?.slice(7)??2);
if(!Number.isInteger(jobs)||jobs<1||jobs>2)throw Error('Use --jobs=1 or --jobs=2 (at most four DuckDB threads across jobs)');
const copies=(name:string)=>[research,published,app].map(p=>p+name+'.json');
type Stage={id:string;script:string;deps:string[];inputs:string[];outputs:string[];artifactManifests?:string[]};
const enrichmentManifest='runtime-data/orestar-analysis/enrichment/manifest.json';
const detailManifest='runtime-data/orestar-analysis/details/manifest.json';
const storyResearch=research+'investigation/portland/';
const storyEvidence=['candidate-weeks','event-windows','billboard-date-sensitivity','donor-overlap-tests','shared-donor-pair-amounts','candidate-report-metrics','donor-portfolios-complete','donor-candidate-complete-ledger','candidate-daily-nonmatching'];
const stages:Stage[]=[
  {id:'measures',script:'analyze.py',deps:[],inputs:[],outputs:[app+'publication.json',research+'metric-definitions.json',published+'summary.json',work+'summary.json',published+'profile-queue.csv']},
  {id:'sensitivity',script:'robustness.py',deps:[],inputs:[],outputs:[...copies('robustness'),published+'concentration-sensitivity.csv']},
  {id:'official-records',script:'enrichment.py',deps:[],inputs:[enrichmentManifest,'runtime-data/orestar-analysis/context/portland-roster.json','runtime-data/orestar-analysis/context/sde-2026.json'],artifactManifests:[enrichmentManifest],outputs:[...copies('enrichment'),research+'committee-race-crosswalk.json',published+'committee-race-crosswalk.json',...['account-summaries','portland-public-financing','public-matching-receipts'].map(n=>published+n+'.csv')]},
  {id:'candidate-facts',script:'publish_candidate_finance.py',deps:['official-records'],inputs:[research+'committee-race-crosswalk.json',published+'public-matching-receipts.csv',published+'account-summaries.csv'],outputs:[app+'candidate-facts.json',published+'candidates/facts.json']},
  {id:'zip-map',script:'publish_zip_map.py',deps:['candidate-facts'],inputs:[published+'public-matching-receipts.csv',work+'original-records-private.parquet'],outputs:[app+'zip-map-data.json',published+'zip-map/data.json',published+'zip-map/candidate-zip-totals.csv',published+'zip-map/portland-metro-2020-zcta-500k.geojson']},
  {id:'district-zip',script:'publish-district-zip.mjs',deps:['zip-map'],inputs:[app+'zip-map-data.json'],outputs:[app+'district-zip-data.json',published+'zip-map/district-zip-totals.csv',published+'zip-map/district-coverage.csv']},
  {id:'district-origin',script:'publish-district-origin.mjs',deps:['zip-map'],inputs:[app+'zip-map-data.json',published+'zip-map/portland-metro-2020-zcta-500k.geojson','runtime-data/orestar-analysis/geography/portland-council-districts-2026.geojson'],outputs:[app+'district-origin-data.json',published+'zip-map/district-origin-data.json',published+'zip-map/candidate-district-origin.csv',published+'zip-map/candidate-zip-district-classification.csv']},
  {id:'district-address',script:'publish-district-address-local.mjs',deps:['district-origin'],artifactManifests:['runtime-data/orestar-analysis/geography/address-points/manifest.json'],inputs:[code+'extract_district_address_rows.py',app+'candidate-facts.json',published+'public-matching-receipts.csv',published+'zip-map/candidate-zip-district-classification.csv','runtime-data/orestar-analysis/geography/address-points/manifest.json','runtime-data/orestar-analysis/geography/portland-council-districts-2026.geojson',work+'original-records-private.parquet'],outputs:[app+'district-address-data.json',published+'zip-map/district-address-data.json',published+'zip-map/candidate-district-address-summary.csv']},
  {id:'race-story',script:'publish_story.py',deps:['candidate-facts'],inputs:[storyResearch+'report-data.json',storyResearch+'analysis.json',research+'investigation/portland-context.json',...storyEvidence.map(n=>storyResearch+n+'.csv')],outputs:[app+'story-data.json',published+'story/story-data.json',...storyEvidence.map(n=>published+'story/'+n+'.csv')]},
  {id:'major-donors',script:'publish_major_donors.py',deps:['race-story'],inputs:[storyResearch+'donor-portfolios-complete.csv',storyResearch+'donor-candidate-complete-ledger.csv',app+'story-data.json',app+'candidate-facts.json'],outputs:[app+'major-donor-matrix.json',published+'story/major-donor-matrix.json',published+'story/major-donor-matrix.csv']},
  {id:'suppliers',script:'publish_suppliers.py',deps:['candidate-facts'],inputs:[storyResearch+'transactions.csv',storyResearch+'analysis.json',storyResearch+'report-data.json',app+'candidate-facts.json'],outputs:[app+'supplier-data.json',published+'suppliers/data.json',...['cash-payments','payee-record-groups','payee-candidate-ledger','reported-name-groups'].map(n=>published+'suppliers/'+n+'.csv')]},
  {id:'target-details',script:'details.py',deps:[],inputs:[detailManifest],artifactManifests:[detailManifest],outputs:[...copies('independent-spending'),...['independent-records','independent-allocations','transaction-associations','detail-gaps'].map(n=>published+n+'.csv')]},
  {id:'networks',script:'networks.py',deps:[],inputs:[],outputs:[published+'networks.json',research+'network-method.json',published+'shared-donor-tests.csv']},
  {id:'questions',script:'catalogue.py',deps:['measures','official-records','target-details','networks','sensitivity','district-address'],inputs:[],outputs:[...copies('questions'),...copies('gaps')]},
  {id:'findings',script:'publish_findings.py',deps:['questions'],inputs:[],outputs:[...copies('findings'),research+'REPORT.md']},
  {id:'verify-findings',script:'verify_findings.py',deps:['findings'],inputs:[],outputs:[research+'findings-verification.json',published+'findings-verification.json']},
];
type Result={signature:string;outputs:Record<string,string>;completedAt:string};
const cacheFile=root+'/stages.json';
const cache:Record<string,Result>=existsSync(cacheFile)?JSON.parse(readFileSync(cacheFile,'utf8')):{};
const digest=(path:string)=>createHash('sha256').update(readFileSync(path)).digest('hex');
const save=()=>{writeFileSync(cacheFile+'.tmp',JSON.stringify(cache,null,2)+'\n');renameSync(cacheFile+'.tmp',cacheFile);};
const event=(e:object)=>appendFileSync(root+'/events.ndjson',JSON.stringify({at:new Date().toISOString(),...e})+'\n');

// Include every CSV, all public/app copies, and archived source bodies in cache
// validation. An unchanged manifest alone does not establish intact artifacts.
function outputPaths(s:Stage){
  const paths=[...s.outputs];
  if(s.id==='measures'){
    const metrics=JSON.parse(readFileSync(research+'metric-definitions.json','utf8'));
    for(const metric of Object.values(metrics) as {download:string}[]){
      if(!metric.download.startsWith('/data/campaign-finance/'))throw Error('Unexpected evidence download path');
      paths.push('public'+metric.download);
    }
  }
  if(s.id==='candidate-facts'){
    const facts=JSON.parse(readFileSync(app+'candidate-facts.json','utf8'));
    for(const committee of Object.values(facts.committees) as {evidenceUrl:string}[]){
      if(!/^\/data\/campaign-finance\/candidates\/[0-9]+-cash-contributions\.csv$/.test(committee.evidenceUrl))throw Error('Unexpected candidate evidence download path');
      paths.push('public'+committee.evidenceUrl);
    }
  }
  return [...new Set(paths)].sort();
}
function artifactChecks(manifests:string[]){
  const checks:Record<string,string>={};
  function visit(value:unknown,base:string){
    if(!value||typeof value!=='object')return;
    const item=value as Record<string,unknown>;
    if(typeof item.path==='string'&&typeof item.sha256==='string'){
      const path=item.path.startsWith('runtime-data/')?resolve(item.path):resolve(base,item.path);
      if(!path.startsWith(resolve('runtime-data/orestar-analysis')+sep))throw Error('Unexpected source artifact path');
      const actual=digest(path);
      if(actual!==item.sha256)throw Error('Source checksum mismatch: '+path);
      checks[path]=actual;
    }
    for(const child of Object.values(item))visit(child,base);
  }
  for(const manifest of manifests)visit(JSON.parse(readFileSync(manifest,'utf8')),dirname(manifest));
  return Object.entries(checks).sort(([a],[b])=>a.localeCompare(b));
}
const lock=root+'/.runner.lock';
function acquireLock(){
  if(existsSync(lock)){
    const pid=Number(readFileSync(lock,'utf8'));
    if(!Number.isInteger(pid)||pid<2)throw Error('Unrecognized research runner lock; inspect before recovery');
    try{process.kill(pid,0);throw Error('Local research runner '+pid+' is already active');}
    catch(error){if((error as NodeJS.ErrnoException).code!=='ESRCH')throw error;}
    unlinkSync(lock);
  }
  writeFileSync(lock,String(process.pid));
}
function releaseLock(){
  if(existsSync(lock)&&readFileSync(lock,'utf8')===String(process.pid))unlinkSync(lock);
}
const children=new Set<ChildProcess>();
let interrupted=false;
for(const signal of ['SIGINT','SIGTERM'] as const){
  process.on(signal,()=>{interrupted=true;for(const child of children)child.kill('SIGTERM');});
}
function execute(script:string,log:string):Promise<void>{
  return new Promise((resolve,reject)=>{
    const child=spawn(script.endsWith('.mjs')?process.execPath:python,[code+script],{stdio:['ignore','pipe','pipe'],env:{...process.env,ORESTAR_OFFLINE:'1',OMP_NUM_THREADS:'1',OPENBLAS_NUM_THREADS:'1',MKL_NUM_THREADS:'1',NUMEXPR_NUM_THREADS:'1',VECLIB_MAXIMUM_THREADS:'1'}});
    children.add(child);
    let recent='';
    const record=(data:Buffer)=>{appendFileSync(log,data);recent=(recent+data.toString()).slice(-4000);};
    child.stdout?.on('data',record);
    child.stderr?.on('data',record);
    child.on('error',error=>{children.delete(child);reject(error);});
    child.on('close',(code,signal)=>{children.delete(child);if(code===0)resolve();else reject(Error(script+' exited '+String(code??signal)+': '+recent.slice(-1000)));});
  });
}
const commonInputs=[snapshot,code+'common.py',code+'requirements.lock.txt'];
let commonChecks:[string,string][]=[];
const completed=new Set<string>();
const failed=new Set<string>();
const active=new Map<string,Promise<void>>();
async function stage(s:Stage){
  const started=Date.now();
  try{
    const signature=createHash('sha256').update(JSON.stringify({cacheVersion:2,inputs:[...commonChecks,...[code+s.script,...s.inputs].map(p=>[p,digest(p)])],artifacts:artifactChecks(s.artifactManifests??[]),deps:s.deps.map(id=>cache[id]),config:{duckdbThreadsPerJob:2,numericalThreads:1}})).digest('hex');
    const previous=cache[s.id];
    if(!process.argv.includes('--force')&&previous?.signature===signature&&s.outputs.every(p=>existsSync(p))){
      const paths=outputPaths(s);
      if(JSON.stringify(paths)===JSON.stringify(Object.keys(previous.outputs).sort())&&paths.every(p=>existsSync(p)&&digest(p)===previous.outputs[p])){
        completed.add(s.id);event({stage:s.id,status:'cached',signature});console.log(s.id+': reused verified cached output');return;
      }
    }
    event({stage:s.id,status:'started',signature});console.log(s.id+': running locally');
    const log=root+'/'+s.id+'.log';
    appendFileSync(log,'\nRun started '+new Date().toISOString()+'\n');
    await execute(s.script,log);
    const outputs=Object.fromEntries(outputPaths(s).map(p=>[p,digest(p)]));
    cache[s.id]={signature,outputs,completedAt:new Date().toISOString()};save();completed.add(s.id);
    event({stage:s.id,status:'complete',signature,elapsedMs:Date.now()-started,outputs});console.log(s.id+': complete');
  }catch(error){failed.add(s.id);event({stage:s.id,status:'failed',error:String(error),retry:'npm run orestar:research'});console.error(s.id+': failed; retained for retry: '+String(error));}
}
async function run(){
  acquireLock();
  try{
    const databaseHash=digest(snapshotData.database);
    if(databaseHash!==snapshotData.database_sha256)throw Error('Immutable database checksum mismatch');
    const localSnapshot=JSON.parse(readFileSync(work+'manifest.json','utf8'));
    if(localSnapshot.database!==snapshotData.database||localSnapshot.database_sha256!==databaseHash)throw Error('Local and published snapshot manifests disagree');
    commonChecks=[...commonInputs.map(p=>[p,digest(p)] as [string,string]),[snapshotData.database,databaseHash]];
    console.log('Local-only bulk research: '+jobs+' concurrent jobs; no source requests or browser windows.');
    while(completed.size+failed.size<stages.length&&!interrupted){
      for(const s of stages){
        if(completed.has(s.id)||failed.has(s.id)||active.has(s.id))continue;
        if(s.deps.some(id=>failed.has(id))){failed.add(s.id);event({stage:s.id,status:'dependency_failed',dependencies:s.deps});continue;}
        if(active.size<jobs&&s.deps.every(id=>completed.has(id))){const task=stage(s).finally(()=>active.delete(s.id));active.set(s.id,task);}
      }
      if(active.size)await Promise.race(active.values());
      else if(completed.size+failed.size<stages.length)throw Error('Research dependency graph is blocked');
    }
    await Promise.all(active.values());
    if(interrupted)throw Error('Interrupted; completed outputs are retained for resume');
    if(failed.size)throw Error('Failed/dependent stages: '+[...failed].join(', '));
    console.log('Bulk research complete. Unchanged stages will be reused on the next run.');
  }finally{
    try{await execute('status.py',root+'/status.log');}
    catch(error){event({stage:'failure-register',status:'failed',error:String(error)});process.exitCode=1;}
    releaseLock();
  }
}
run().catch(error=>{event({status:'run_failed',error:String(error)});console.error(error);process.exitCode=1;});
