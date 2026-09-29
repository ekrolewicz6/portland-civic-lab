"""Publish candidate-level ZIP sums without publishing donor addresses.

Only the archived, immutable ORESTAR snapshot is queried. Boundaries are
cached official 2020 Census ZCTAs, never interpreted as postal or district
boundaries. Census retrieval attempts are recorded for safe retries.
"""
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen
import csv
import hashlib
import json
import os
import re
import time
import duckdb
from common import ROOT, WORK, SNAPSHOT, write_json

OUT = ROOT / 'public/data/campaign-finance/zip-map'
DATA = ROOT / 'src/lib/campaign-finance/zip-map-data.json'
LOG = ROOT / 'runtime-data/orestar-analysis/verification/zip-map/attempts.ndjson'
SHAPES = OUT / 'portland-metro-2020-zcta-500k.geojson'
SOURCE = 'https://tigerweb.geo.census.gov/arcgis/rest/services/Generalized_TAB2020/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/3/query'
BBOX = '-123.15,45.2,-122.25,45.85'

def sha(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()

def log(**event):
    LOG.parent.mkdir(parents=True, exist_ok=True)
    with LOG.open('a') as stream:
        stream.write(json.dumps({'at': datetime.now(timezone.utc).isoformat(), **event}) + '\n')

def boundaries():
    if SHAPES.exists():
        data = json.loads(SHAPES.read_text())
        codes = {f['properties']['GEOID'] for f in data['features']}
        if len(codes) == len(data['features']) and 90 <= len(codes) <= 150:
            log(stage='census_zcta', status='reused', features=len(codes), sha256=sha(SHAPES))
            return codes
        raise ValueError('Cached Census boundary file failed shape/ID checks; inspect before replacement')
    if os.environ.get('ORESTAR_OFFLINE') == '1':
        raise FileNotFoundError('Cached Census boundary is absent; run publish_zip_map.py once outside the offline research runner')
    params = {'where':'1=1', 'geometry':BBOX, 'geometryType':'esriGeometryEnvelope',
              'inSR':'4326', 'spatialRel':'esriSpatialRelIntersects', 'outFields':'GEOID',
              'returnGeometry':'true', 'outSR':'4326', 'geometryPrecision':'5',
              'maxAllowableOffset':'0.0003', 'f':'geojson'}
    url = SOURCE + '?' + urlencode(params)
    for attempt in range(1, 4):
        try:
            log(stage='census_zcta', status='attempt', attempt=attempt)
            with urlopen(url, timeout=45) as response:
                data = json.load(response)
            if data.get('type') != 'FeatureCollection':
                raise ValueError('Expected Census GeoJSON FeatureCollection')
            features = [{'type':'Feature','properties':{'GEOID':f['properties']['GEOID']},
                         'geometry':f['geometry']} for f in data['features']]
            codes = [f['properties']['GEOID'] for f in features]
            if not 90 <= len(codes) <= 150 or len(codes) != len(set(codes)) or any(not re.fullmatch(r'\d{5}', z) for z in codes):
                raise ValueError('Unexpected Census ZCTA count or identifiers')
            write_json(SHAPES, {'type':'FeatureCollection','features':features})
            log(stage='census_zcta', status='complete', attempt=attempt, features=len(codes), sha256=sha(SHAPES))
            return set(codes)
        except Exception as error:
            log(stage='census_zcta', status='failed', attempt=attempt, error=str(error), retryable=attempt < 3)
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    zctas = boundaries()
    manifest = json.loads((WORK / 'manifest.json').read_text())
    facts = json.loads((ROOT / 'src/lib/campaign-finance/candidate-facts.json').read_text())
    assert facts['snapshot'] == SNAPSHOT and manifest['database_sha256'] == facts['sourceDatabaseSha256']
    links = {x['committeeId']:x for x in facts['links'] if x['status'] == 'reviewed'}
    assert len(links) == len(facts['committees'])
    match = {r['transaction_id'] for r in csv.DictReader((ROOT / 'public/data/campaign-finance/public-matching-receipts.csv').open())}
    raw = WORK / 'original-records-private.parquet'
    con = duckdb.connect(str(ROOT / manifest['database']), read_only=True)
    con.execute("SET threads=2; SET memory_limit='2GB'")
    ids = sorted(links)
    query = """SELECT t.transaction_id,t.committee_id,t.amount_cents,t.is_disclosure_category,
                     t.identity_status,json_extract_string(r.source_record_json,'$.Zip') AS zip
               FROM transactions t LEFT JOIN read_parquet(?) r USING(transaction_id)
               WHERE t.basis='cash_contribution' AND t.committee_id IN (""" + ','.join('?' for _ in ids) + ")"
    rows = con.execute(query, [str(raw), *ids]).fetchall()
    con.close()
    sums = defaultdict(lambda: defaultdict(lambda: [0,0]))
    coverage = {cid: defaultdict(int) for cid in ids}
    records = {cid: defaultdict(int) for cid in ids}
    for tid,cid,cents,disclosure,identity,rawzip in rows:
        if tid in match:
            kind = 'public'
        elif disclosure or identity == 'unknown':
            kind = 'unidentified'
        else:
            zip5 = (rawzip or '').strip()
            if re.fullmatch(r'\d{5}(?:-\d{4})?', zip5):
                zip5 = zip5[:5]
                kind = 'mapped' if zip5 in zctas else 'other_zip'
                sums[cid][zip5][0] += cents
                sums[cid][zip5][1] += 1
            else:
                kind = 'missing_zip' if not zip5 else 'invalid_zip'
        coverage[cid][kind] += cents
        records[cid][kind] += 1
    for cid in ids:
        f = facts['committees'][cid]
        assert sum(coverage[cid].values()) == f['cashCents'], cid
        assert sum(records[cid].values()) == f['cashRecords'], cid
        assert coverage[cid]['public'] == f['publicCents'], cid
        assert coverage[cid]['unidentified'] == next(x['cents'] for x in f['sources'] if x['key'] == 'unidentified'), cid
        assert sum(v[0] for v in sums[cid].values()) == coverage[cid]['mapped']+coverage[cid]['other_zip'], cid
    totals = []
    for cid in ids:
        link = links[cid]
        for zipcode,(cents,count) in sorted(sums[cid].items()):
            totals.append({'snapshot':SNAPSHOT,'race_id':link['raceId'],'candidate':link['candidateName'],
                           'committee_id':cid,'zip5':zipcode,'gross_cash_cents':cents,'records':count,
                           'in_metro_map':zipcode in zctas})
    csvpath = OUT / 'candidate-zip-totals.csv'
    with csvpath.open('w', newline='') as stream:
        writer = csv.DictWriter(stream,fieldnames=list(totals[0]))
        writer.writeheader(); writer.writerows(totals)
    publication = {'version':'candidate-zip-map-v1','snapshot':SNAPSHOT,'start':manifest['start'],'end':manifest['end'],
                   'sourceDatabaseSha256':manifest['database_sha256'],'privateSourceSha256':sha(raw),
                   'matchingReceiptSha256':sha(ROOT / 'public/data/campaign-finance/public-matching-receipts.csv'),
                   'boundaryUrl':SOURCE,'boundaryBbox':BBOX,'boundarySha256':sha(SHAPES),
                   'boundaryPath':'/data/campaign-finance/zip-map/'+SHAPES.name,
                   'evidencePath':'/data/campaign-finance/zip-map/'+csvpath.name,'evidenceSha256':sha(csvpath),
                   'definition':'Gross cash contributions received outside reviewed City matching payments, grouped by valid reported contributor ZIP. Aggregate/unidentified records are not mapped. ZIPs are not donor residences or district eligibility; 2020 Census ZCTAs approximate postal ZIPs.',
                   'candidates':[{'committeeId':cid,'candidate':links[cid]['candidateName'],'raceId':links[cid]['raceId'],
                                  'cashCents':facts['committees'][cid]['cashCents'],
                                  'coverageCents':dict(coverage[cid]),'coverageRecords':dict(records[cid]),
                                  'zipTotals':[{'zip5':z,'cents':v[0],'records':v[1],'mapped':z in zctas} for z,v in sorted(sums[cid].items())]}
                                 for cid in ids]}
    write_json(DATA, publication)
    write_json(OUT/'data.json', publication)
    log(stage='publish',status='complete',candidates=len(ids),rows=len(totals),sha256=sha(DATA))
    print(json.dumps({'candidates':len(ids),'zipRows':len(totals),'zctas':len(zctas),'coverage':{k:sum(c['coverageCents'].get(k,0) for c in publication['candidates']) for k in ('mapped','other_zip','missing_zip','invalid_zip','unidentified','public')}}))

if __name__ == '__main__':
    main()
