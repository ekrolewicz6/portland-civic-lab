#!/usr/bin/env python3
"""Meaningful consistency checks for published research artifacts."""
import csv,json,re
from pathlib import Path
from html.parser import HTMLParser
P=Path(__file__).resolve().parent

def rows(file,delim=','):
 with (P/file).open(newline='') as f:return list(csv.DictReader(f,delimiter=delim))
source=rows('sources.tsv','\t');claims=rows('claims.tsv','\t');programs=rows('program-inventory.tsv','\t')
ids={s['id'] for s in source}
raw=rows('raw-inputs.tsv','\t')
assert len(raw)==9 and all(r['source_id'] in ids and len(r['sha256'])==64 for r in raw)
assert len(ids)==len(source) and len(source)>=60
assert len({c['id'] for c in claims})==len(claims)
assert all(c['source_id'] in ids for c in claims)
assert all(p['source_id'] in ids for p in programs)
assert all(c['locator'] and c['limitation'] for c in claims)
assert all(s['geography'] and s['reference_period'] and s['status'] for s in source)
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.img=[];self.href=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='img':self.img.append(a)
  if tag=='a':self.href.append(a.get('href',''))
for name in ['visual-atlas.html','source-explorer.html']:
 parser=Parser();parser.feed((P/name).read_text())
 for href in parser.href:
  if href and not href.startswith(('http:','https:','#')):assert (P/href).exists(),(name,href)
 if name=='visual-atlas.html':
  assert len(parser.img)==16
  assert all(i.get('alt') and (P/i['src']).exists() for i in parser.img)
  assert len(list((P/'visuals').glob('*.svg')))==16
  assert len(list((P/'visuals').glob('*.png')))==16
check=json.loads((P/'data/checks.json').read_text())
metro=rows('data/metro-size-2022.csv');county=rows('data/county-size-2022.csv')
p={r['size_code']:r for r in metro if r['msa']=='38900'}
c={r['size_code']:r for r in county}
assert sum(int(p[b]['jobs']) for b in ['02','03','04','06','07','09'])==check['msa_portland_jobs_total']==1084535
assert int(p['08']['jobs'])==sum(int(p[b]['jobs']) for b in ['02','03','04','06','07'])==544855
assert int(p['05']['jobs'])==sum(int(p[b]['jobs']) for b in ['02','03','04'])==203569
assert sum(int(x['jobs']) for x in county)==check['county_jobs_total']==439591
assert sum(int(c[b]['jobs']) for b in ['2','3','4'])==check['county_under500_jobs']==216121
assert check['osb_district_businesses_sum']==103+182+154+142==581
assert check['osb_unique_businesses_reported']-581==178
assert len(rows('data/nonemployer-sectors-2023.csv'))>10
assert [int(r['jobs']) for r in rows('data/city-small-employment-report-2019-2024.csv')]==[108785,112411]
print(json.dumps({'sources':len(source),'claims':len(claims),'program_channels':len(programs),'figures':16,'metro_jobs':1084535,'county_jobs':439591,'status':'verified'},indent=2))
