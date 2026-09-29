/** Conservative, reproducible ZIP-area comparison with official council districts.
 * No source street address or residential point is published or inferred.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { booleanDisjoint, booleanWithin } from '@turf/turf';
import { resolve } from 'node:path';

const root = resolve('.');
const source = root + '/src/lib/campaign-finance/zip-map-data.json';
const zctaPath = root + '/public/data/campaign-finance/zip-map/portland-metro-2020-zcta-500k.geojson';
const boundaryPath = root + '/runtime-data/orestar-analysis/geography/portland-council-districts-2026.geojson';
const logPath = root + '/runtime-data/orestar-analysis/geography/district-origin-attempts.ndjson';
const appPath = root + '/src/lib/campaign-finance/district-origin-data.json';
const publicPath = root + '/public/data/campaign-finance/zip-map/district-origin-data.json';
const csvPath = root + '/public/data/campaign-finance/zip-map/candidate-district-origin.csv';
const zipCsvPath = root + '/public/data/campaign-finance/zip-map/candidate-zip-district-classification.csv';
const boundaryUrl = 'https://www.portlandmaps.com/od/rest/services/COP_OpenData_Boundary/MapServer/1413/query?where=1%3D1&outFields=DISTRICT&outSR=4326&f=geojson';
const sha = value => createHash('sha256').update(value).digest('hex');
const event = fields => appendFileSync(logPath, JSON.stringify({at:new Date().toISOString(),...fields})+'\n');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const cleanBoundary = value => {
  if (value?.type !== 'FeatureCollection' || value.features?.length !== 4) throw Error('Expected four official council district polygons');
  const names = value.features.map(f => String(f.properties?.DISTRICT)).sort();
  if (names.join(',') !== '1,2,3,4' || value.features.some(f => !['Polygon','MultiPolygon'].includes(f.geometry?.type))) throw Error('Unexpected district identifiers or geometry');
  return {type:'FeatureCollection',features:value.features.map(f => ({type:'Feature',properties:{DISTRICT:String(f.properties.DISTRICT)},geometry:f.geometry}))};
};

async function boundary() {
  if (existsSync(boundaryPath)) {
    const value = cleanBoundary(readJson(boundaryPath));
    event({stage:'boundary',status:'reused',sha256:sha(readFileSync(boundaryPath))});
    return value;
  }
  if (process.env.ORESTAR_OFFLINE === '1') throw Error('Official council boundary is not cached for offline publication');
  for (let attempt=1;attempt<=3;attempt++) {
    try {
      event({stage:'boundary',status:'attempt',attempt});
      const response = await fetch(boundaryUrl,{signal:AbortSignal.timeout(20000)});
      if (!response.ok) throw Error('HTTP '+response.status);
      const value = cleanBoundary(await response.json());
      writeFileSync(boundaryPath,JSON.stringify(value)+'\n');
      event({stage:'boundary',status:'complete',attempt,sha256:sha(readFileSync(boundaryPath))});
      return value;
    } catch(error) {
      event({stage:'boundary',status:'failed',attempt,error:String(error),retryable:attempt<3});
      if (attempt===3) throw error;
      await sleep(500*attempt);
    }
  }
}

const sum = (items,key) => items.reduce((total,item) => total+(item[key]??0),0);
const csv = (path,headers,rows) => writeFileSync(path,[headers.join(','),...rows.map(row => headers.map(key => String(row[key]??'')).join(','))].join('\n')+'\n');
const add = (bucket,row) => { bucket.cents+=row.cents; bucket.records+=row.records; };
const categories = ['within','outside','crosses','other_zip','unlocated','public'];

async function main() {
  mkdirSync(resolve(root,'runtime-data/orestar-analysis/geography'),{recursive:true});
  const sourceData=readJson(source), zctaData=readJson(zctaPath), districts=await boundary();
  if (zctaData.type!=='FeatureCollection'||zctaData.features.length!==109) throw Error('Unexpected cached Census ZIP polygons');
  if (sha(readFileSync(zctaPath))!==sourceData.boundarySha256) throw Error('Census ZIP boundary checksum changed');
  const zctas=new Map(zctaData.features.map(f=>[f.properties.GEOID,f]));
  if (zctas.size!==109) throw Error('Duplicate Census ZIP identifiers');
  const districtByNumber=new Map(districts.features.map(f=>[f.properties.DISTRICT,f]));
  const classified=new Map();
  for (const district of ['3','4']) for (const [zip,poly] of zctas) {
    const districtPoly=districtByNumber.get(district);
    const status=booleanWithin(poly,districtPoly)?'within':booleanDisjoint(poly,districtPoly)?'outside':'crosses';
    classified.set(district+':'+zip,status);
  }
  const candidates=[],zipRows=[],totals=Object.fromEntries(categories.map(key=>[key,{cents:0,records:0}]));
  for (const candidate of sourceData.candidates.filter(c=>/^portland-district-[34]$/.test(c.raceId))) {
    const district=candidate.raceId.at(-1);
    const sums=Object.fromEntries(categories.map(key=>[key,{cents:0,records:0}]));
    for (const row of candidate.zipTotals) {
      const status=zctas.has(row.zip5)?classified.get(district+':'+row.zip5):'other_zip';
      if (!status) throw Error('Missing ZIP geometry classification');
      add(sums[status],row);
      zipRows.push({snapshot:sourceData.snapshot,committee_id:candidate.committeeId,candidate:candidate.candidate,district,zip5:row.zip5,status,cents:row.cents,records:row.records});
    }
    for (const key of ['unidentified','missing_zip','invalid_zip']) {
      sums.unlocated.cents+=candidate.coverageCents[key]??0;
      sums.unlocated.records+=candidate.coverageRecords[key]??0;
    }
    sums.public.cents=candidate.coverageCents.public??0;
    sums.public.records=candidate.coverageRecords.public??0;
    if (sum(Object.values(sums),'cents')!==candidate.cashCents) throw Error('Dollar reconciliation failed for '+candidate.committeeId);
    if (sum(Object.values(sums),'records')!==sum(Object.values(candidate.coverageRecords).map(records=>({records})),'records')) throw Error('Record reconciliation failed for '+candidate.committeeId);
    for (const key of categories) add(totals[key],sums[key]);
    candidates.push({committeeId:candidate.committeeId,candidate:candidate.candidate,raceId:candidate.raceId,district:Number(district),cashCents:candidate.cashCents,cashRecords:sum(Object.values(sums),'records'),categories:sums});
  }
  if (candidates.length!==17) throw Error('Expected 17 reviewed council candidates');
  const csvRows=candidates.flatMap(c=>categories.map(key=>({snapshot:sourceData.snapshot,committee_id:c.committeeId,candidate:c.candidate,district:c.district,category:key,cash_cents:c.categories[key].cents,records:c.categories[key].records})));
  csv(csvPath,['snapshot','committee_id','candidate','district','category','cash_cents','records'],csvRows);
  csv(zipCsvPath,['snapshot','committee_id','candidate','district','zip5','status','cents','records'],zipRows);
  const publication={version:'candidate-district-origin-v1',snapshot:sourceData.snapshot,start:sourceData.start,end:sourceData.end,
    sourceZipDataSha256:sha(readFileSync(source)),censusZctaSha256:sha(readFileSync(zctaPath)),officialDistrictUrl:boundaryUrl,
    officialDistrictSha256:sha(readFileSync(boundaryPath)),districtBoundaryDate:'2023-08-21',
    basis:'Gross cash contributions. Reported source ZIP, not verified residence. Reviewed City matching payments are separate.',
    definitions:{within:'Reported ZIP has a 2020 Census ZCTA polygon wholly within the candidate district.',outside:'Reported ZIP has a local 2020 Census ZCTA polygon disjoint from the candidate district.',crosses:'The ZCTA touches or crosses the candidate district boundary; individual location is uncertain.',other_zip:'Valid reported ZIP has no polygon in the local Census map; district relationship is not classified.',unlocated:'Aggregate or unidentified source, missing ZIP, or invalid ZIP.',public:'Reviewed City matching receipt; not assigned to a contributor location.'},
    limitations:'Census ZCTAs approximate postal ZIP areas. A reported address can be a mailing address, workplace or PO box, and a transaction is not a unique donor. In/out are classifications of reported ZIP areas, not verified donor residency or eligibility. Split and absent ZIPs are never apportioned.',
    evidence:{summary:'/data/campaign-finance/zip-map/candidate-district-origin.csv',zipClassifications:'/data/campaign-finance/zip-map/candidate-zip-district-classification.csv'},
    evidenceSha256:{summary:sha(readFileSync(csvPath)),zipClassifications:sha(readFileSync(zipCsvPath))},totals,candidates};
  const body=JSON.stringify(publication,null,2)+'\n';writeFileSync(appPath,body);writeFileSync(publicPath,body);
  event({stage:'publication',status:'complete',candidates:candidates.length,zipRows:zipRows.length,sha256:sha(body)});
  console.log(JSON.stringify({status:'passed',candidates:candidates.length,zipRows:zipRows.length,totals}));
}
main().catch(error=>{event({stage:'publication',status:'failed',error:String(error),retry:'node ingest/orestar/analysis/publish-district-origin.mjs'});console.error(error);process.exitCode=1;});
