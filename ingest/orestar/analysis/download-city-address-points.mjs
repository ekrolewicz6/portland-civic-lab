/** Download public City address points by whole ZIP areas, never querying donor addresses. */
import {createHash} from 'node:crypto';
import {appendFileSync,existsSync,mkdirSync,readFileSync,writeFileSync,renameSync} from 'node:fs';
import {resolve} from 'node:path';

const root=resolve('.');
const input=root+'/public/data/campaign-finance/zip-map/candidate-zip-district-classification.csv';
const out=root+'/runtime-data/orestar-analysis/geography/address-points';
const log=root+'/runtime-data/orestar-analysis/geography/address-point-attempts.ndjson';
const endpoint='https://www.portlandmaps.com/od/rest/services/COP_OpenData_Property/MapServer/1272/query';
const pageSize=500;
const zipRows=readFileSync(input,'utf8').trim().split('\n').slice(1).map(line=>line.split(','));
const zips=[...new Set(zipRows.filter(row=>row[5]==='crosses'&&Number(row[7])>0).map(row=>row[4]))].sort();
const sha=buffer=>createHash('sha256').update(buffer).digest('hex');
const event=fields=>appendFileSync(log,JSON.stringify({at:new Date().toISOString(),...fields})+'\n');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
mkdirSync(out,{recursive:true});

async function request(zip,offset,countOnly=false){
  const params=new URLSearchParams({where:`ZIP_CODE='${zip}'`,f:'geojson'});
  if(countOnly){params.set('f','json');params.set('returnCountOnly','true');}
  else {params.set('outFields','ADDRESS_FULL,ZIP_CODE');params.set('returnGeometry','true');params.set('outSR','4326');params.set('orderByFields','OBJECTID ASC');params.set('resultOffset',String(offset));params.set('resultRecordCount',String(pageSize));}
  for(let attempt=1;attempt<=3;attempt++){
    try{
      const response=await fetch(endpoint+'?'+params,{signal:AbortSignal.timeout(30000)});
      if(!response.ok)throw Error('HTTP '+response.status);
      const data=await response.json();
      if(data.error)throw Error('ArcGIS: '+data.error.message);
      return data;
    }catch(error){
      event({zip,offset,status:'failed',attempt,error:String(error),retryable:attempt<3});
      if(attempt===3)throw error;
      await wait(500*attempt);
    }
  }
}

async function main(){
  if(zips.length<15||zips.length>40)throw Error('Unexpected number of public boundary-crossing ZIP areas');
  const counts=await Promise.all(zips.map(async zip=>[zip,(await request(zip,0,true)).count]));
  if(counts.some(([zip,count])=>!Number.isInteger(count)||count<0||count>60000))throw Error('Unexpected City address count');
  const pages=counts.flatMap(([zip,count])=>Array.from({length:Math.ceil(count/pageSize)},(_,i)=>({zip,offset:i*pageSize,expected:Math.min(pageSize,count-i*pageSize)})));
  let next=0,downloaded=0,reused=0;
  async function worker(){
    while(next<pages.length){
      const task=pages[next++],path=`${out}/${task.zip}-${String(task.offset).padStart(5,'0')}.json`;
      if(existsSync(path)){
        const cached=JSON.parse(readFileSync(path,'utf8'));
        if(cached.type!=='FeatureCollection'||cached.features.length!==task.expected)throw Error('Corrupt cached City address page '+path);
        reused++;continue;
      }
      const data=await request(task.zip,task.offset);
      if(data.type!=='FeatureCollection'||data.features?.length!==task.expected||data.features.some(f=>f.properties?.ZIP_CODE!==task.zip||f.geometry?.type!=='Point'||typeof f.properties?.ADDRESS_FULL!=='string'))throw Error(`Unexpected City address page ${task.zip} ${task.offset}`);
      const minimal={type:'FeatureCollection',features:data.features.map(f=>({type:'Feature',properties:{ADDRESS_FULL:f.properties.ADDRESS_FULL,ZIP_CODE:f.properties.ZIP_CODE},geometry:f.geometry}))};
      const body=JSON.stringify(minimal)+'\n',temp=path+'.tmp';writeFileSync(temp,body);renameSync(temp,path);downloaded++;
      if((downloaded+reused)%100===0)event({status:'progress',pagesDone:downloaded+reused,totalPages:pages.length});
    }
  }
  await Promise.all(Array.from({length:4},worker));
  const manifest={version:1,source:endpoint,query:'Complete City address-point pages for public boundary-crossing ZIP areas; no contributor addresses transmitted',retrievedAt:new Date().toISOString(),inputSha256:sha(readFileSync(input)),zipCounts:Object.fromEntries(counts),pages:pages.map(p=>({zip:p.zip,offset:p.offset,records:p.expected,file:`${p.zip}-${String(p.offset).padStart(5,'0')}.json`,path:`runtime-data/orestar-analysis/geography/address-points/${p.zip}-${String(p.offset).padStart(5,'0')}.json`,sha256:sha(readFileSync(`${out}/${p.zip}-${String(p.offset).padStart(5,'0')}.json`))}))};
  writeFileSync(out+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');
  event({status:'complete',zips:zips.length,pages:pages.length,downloaded,reused,records:counts.reduce((n,[,count])=>n+count,0)});
  console.log(JSON.stringify({status:'complete',zips:zips.length,pages:pages.length,downloaded,reused,records:counts.reduce((n,[,count])=>n+count,0)}));
}
main().catch(error=>{event({status:'run_failed',error:String(error),retry:'node ingest/orestar/analysis/download-city-address-points.mjs'});console.error(error);process.exitCode=1;});
