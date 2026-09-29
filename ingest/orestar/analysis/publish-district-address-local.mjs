/** Private local join: ORESTAR addresses x complete public City address-point ZIP areas. */
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync,readdirSync,writeFileSync,appendFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {booleanPointInPolygon} from '@turf/turf';

const root=resolve('.'),archive=root+'/runtime-data/orestar-analysis/geography/address-points';
const districtPath=root+'/runtime-data/orestar-analysis/geography/portland-council-districts-2026.geojson';
const manifestPath=archive+'/manifest.json';
const sourcePath=root+'/runtime-data/orestar-analysis/orestar-20250101-20260927-v1/original-records-private.parquet';
const outputPath=root+'/src/lib/campaign-finance/district-address-data.json';
const publicPath=root+'/public/data/campaign-finance/zip-map/district-address-data.json';
const csvPath=root+'/public/data/campaign-finance/zip-map/candidate-district-address-summary.csv';
const logPath=root+'/runtime-data/orestar-analysis/geography/local-address-join.ndjson';
const sha=buffer=>createHash('sha256').update(buffer).digest('hex');
const readJson=path=>JSON.parse(readFileSync(path,'utf8'));
const event=fields=>appendFileSync(logPath,JSON.stringify({at:new Date().toISOString(),...fields})+'\n');
const kinds=['address_inside','address_outside','state_outside','zip_inside','zip_outside','uncertain','public'];
const blank=()=>({cents:0,records:0});
const validZip=value=>/^\d{5}(?:-\d{4})?$/.test((value??'').trim())?value.trim().slice(0,5):'';
function normalize(value){
  let x=(value??'').toUpperCase().trim();
  x=x.replace(/\b(?:APARTMENT|APT|SUITE|STE|UNIT|ROOM|RM)\b.*$/,'').replace(/#.*$/,'');
  x=x.replace(/\bNORTHEAST\b/g,'NE').replace(/\bNORTHWEST\b/g,'NW').replace(/\bSOUTHEAST\b/g,'SE').replace(/\bSOUTHWEST\b/g,'SW');
  x=x.replace(/\bSTREET\b/g,'ST').replace(/\bAVENUE\b/g,'AVE').replace(/\bBOULEVARD\b/g,'BLVD').replace(/\bDRIVE\b/g,'DR').replace(/\bROAD\b/g,'RD').replace(/\bPLACE\b/g,'PL').replace(/\bCOURT\b/g,'CT').replace(/\bLANE\b/g,'LN');
  return x.replace(/[^A-Z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
const plausible=value=>/^\d+[A-Z]?\s+[A-Z]/.test(normalize(value))&&!/\b(?:PO BOX|P O BOX|POST OFFICE BOX|PMB|MAILBOX)\b/i.test(value??'');

function main(){
  const manifest=readJson(manifestPath),zipData=readJson(root+'/src/lib/campaign-finance/zip-map-data.json'),facts=readJson(root+'/src/lib/campaign-finance/candidate-facts.json');
  const zipOrigin=readJson(root+'/src/lib/campaign-finance/district-origin-data.json'),districts=readJson(districtPath);
  if(manifest.pages.length<700||manifest.pages.length>900||districts.features.length!==4)throw Error('Incomplete address-point archive or district boundaries');
  if(sha(readFileSync(districtPath))!==zipOrigin.officialDistrictSha256)throw Error('District boundary checksum mismatch');
  const addressDistrict=new Map();let cityPointCount=0,conflicts=0;
  for(const page of manifest.pages){
    const path=archive+'/'+page.file,body=readFileSync(path);
    if(sha(body)!==page.sha256)throw Error('City address-point page checksum mismatch: '+page.file);
    const data=JSON.parse(body);
    if(data.features.length!==page.records)throw Error('City address-point page row mismatch: '+page.file);
    for(const feature of data.features){
      const zip=feature.properties.ZIP_CODE,name=normalize(feature.properties.ADDRESS_FULL);
      if(!name||!zip)continue;
      const point=feature.geometry.coordinates;
      const districtIds=districts.features.filter(d=>booleanPointInPolygon(point,d)).map(d=>d.properties.DISTRICT);
      const district=districtIds.length===1?districtIds[0]:'outside_city_or_boundary';
      const key=zip+'|'+name,previous=addressDistrict.get(key);
      if(previous&&previous!==district){addressDistrict.set(key,'conflict');conflicts++;}
      else if(!previous)addressDistrict.set(key,district);
      cityPointCount++;
    }
  }
  event({status:'city_indexed',addressPoints:cityPointCount,keys:addressDistrict.size,conflicts});
  const py=root+'/runtime-data/orestar-analysis/py312/bin/python';
  const privateRows=JSON.parse(execFileSync(py,[root+'/ingest/orestar/analysis/extract_district_address_rows.py'],{cwd:root,maxBuffer:16*1024*1024,env:{...process.env,ORESTAR_OFFLINE:'1'}}));
  if(privateRows.length!==3940)throw Error('Private cash-contribution row count mismatch');
  const links=new Map(facts.links.filter(x=>x.status==='reviewed'&&/^portland-district-[34]$/.test(x.raceId)).map(x=>[x.committeeId,x]));
  const sums=new Map([...links.keys()].map(cid=>[cid,Object.fromEntries(kinds.map(k=>[k,blank()]))]));
  const matchingCsv=readFileSync(root+'/public/data/campaign-finance/public-matching-receipts.csv','utf8').trim().split('\n');
  const matchIndex=matchingCsv[0].split(',').indexOf('transaction_id');
  const matches=new Set(matchingCsv.slice(1).map(line=>line.split(',')[matchIndex]));
  const zipCsv=readFileSync(root+'/public/data/campaign-finance/zip-map/candidate-zip-district-classification.csv','utf8').trim().split('\n');
  const zipClasses=new Map(zipCsv.slice(1).map(line=>{const parts=line.split(',');return [parts[1]+'|'+parts[4],parts[5]]}));
  const reasons={};
  for(const [tid,cid,cents,disclosure,identity,address,city,state,rawZip] of privateRows){
    const district=links.get(cid)?.raceId.at(-1);
    if(!district)throw Error('Unexpected committee in private join');
    let kind,reason;
    const zip=validZip(rawZip),region=(state??'').trim().toUpperCase();
    if(matches.has(tid)){kind='public';reason='city_matching';}
    else if(disclosure||identity==='unknown'){kind='uncertain';reason='aggregate_or_unidentified';}
    else if(region&&region!=='OR'&&region!=='OREGON'){kind='state_outside';reason='reported_other_state';}
    else{
      const matched=zip&&plausible(address)?addressDistrict.get(zip+'|'+normalize(address)):null;
      if(matched&&matched!=='conflict'&&matched!=='outside_city_or_boundary'){
        kind=matched===district?'address_inside':'address_outside';reason='local_exact_address_point';
      }else if(matched==='outside_city_or_boundary'){
        kind='address_outside';reason='local_exact_address_point_outside_city';
      }else{
        const proxy=zipClasses.get(cid+'|'+zip);
        if(proxy==='within'){kind='zip_inside';reason='whole_zcta_proxy';}
        else if(proxy==='outside'){kind='zip_outside';reason='whole_zcta_proxy';}
        else{kind='uncertain';reason=proxy==='crosses'?'boundary_crossing_zip_without_exact_match':'missing_or_unmapped_zip';}
      }
    }
    const value=sums.get(cid)[kind];value.cents+=cents;value.records++;
    reasons[reason]=(reasons[reason]??0)+1;
  }
  const candidates=[...links].map(([cid,link])=>{
    const categories=sums.get(cid),fact=facts.committees[cid];
    if(Object.values(categories).reduce((n,r)=>n+r.cents,0)!==fact.cashCents||Object.values(categories).reduce((n,r)=>n+r.records,0)!==fact.cashRecords||categories.public.cents!==fact.publicCents)throw Error('Candidate reconciliation failed: '+cid);
    return {committeeId:cid,candidate:link.candidateName,raceId:link.raceId,district:Number(link.raceId.at(-1)),cashCents:fact.cashCents,cashRecords:fact.cashRecords,categories};
  }).sort((a,b)=>a.district-b.district||b.cashCents-a.cashCents);
  const totals=Object.fromEntries(kinds.map(k=>[k,{cents:candidates.reduce((n,c)=>n+c.categories[k].cents,0),records:candidates.reduce((n,c)=>n+c.categories[k].records,0)}]));
  const csvRows=candidates.flatMap(c=>kinds.map(kind=>[zipData.snapshot,c.committeeId,c.candidate,c.district,kind,c.categories[kind].cents,c.categories[kind].records].join(',')));
  writeFileSync(csvPath,['snapshot,committee_id,candidate,district,category,cash_cents,transactions',...csvRows].join('\n')+'\n');
  const publication={version:'candidate-district-address-local-v1',snapshot:zipData.snapshot,start:zipData.start,end:zipData.end,
    sourceDatabaseSha256:facts.sourceDatabaseSha256,privateSourceSha256:sha(readFileSync(sourcePath)),districtBoundarySha256:sha(readFileSync(districtPath)),cityAddressPointManifestSha256:sha(readFileSync(manifestPath)),
    basis:'Gross cash-contribution transactions from reviewed District 3/4 committees. Public matching deposits are separate.',
    method:'Match reported street address and five-digit ZIP locally to the City’s complete active address points in 25 boundary-crossing ZIP areas, after conservative normalization. Place City point coordinates against official council districts. Exact street matches outrank ZIP-area proxies. An out-of-Oregon reported state is outside. Unmatched source ZIPs are classified only if the local Census ZIP polygon is wholly inside or disjoint; split and absent ZIPs remain uncertain.',
    privacy:'Contributor street addresses and point coordinates stay in the private local source/archive and are never sent to a geocoder or published. Only committee-level amounts and transaction counts are released.',
    limitation:'A reported source address may be a mailing address, office or other location rather than residence. Transaction counts are not unique donor counts. City active addresses are a 2026 reference and may miss historical or variant addresses. ZCTA proxies are not exact postal ZIP boundaries.',
    categories:{address_inside:'Exact locally matched City address point in the candidate district',address_outside:'Exact locally matched City address point in another district or outside City districts',state_outside:'Reported state outside Oregon',zip_inside:'Unmatched address/ZIP whose local Census ZCTA is wholly inside the candidate district',zip_outside:'Unmatched address/ZIP whose local Census ZCTA is disjoint from the candidate district',uncertain:'Aggregate, invalid/missing location, or boundary-crossing/absent ZIP without an exact local match',public:'Reviewed City matching deposit, not assigned to a donor address'},
    geography:{publicCityAddressPoints:cityPointCount,distinctLocalKeys:addressDistrict.size,conflictingKeys:conflicts,locallyMatchedTransactions:(reasons.local_exact_address_point??0)+(reasons.local_exact_address_point_outside_city??0)},
    evidencePath:'/data/campaign-finance/zip-map/candidate-district-address-summary.csv',evidenceSha256:sha(readFileSync(csvPath)),totals,candidates};
  const body=JSON.stringify(publication,null,2)+'\n';writeFileSync(outputPath,body);writeFileSync(publicPath,body);
  event({status:'complete',candidates:candidates.length,transactions:privateRows.length,geography:publication.geography,totals,reasons});
  console.log(JSON.stringify({status:'passed',candidates:candidates.length,transactions:privateRows.length,geography:publication.geography,totals}));
}
try{main()}catch(error){event({status:'failed',error:String(error),retry:'node ingest/orestar/analysis/publish-district-address-local.mjs'});console.error(error);process.exitCode=1}
