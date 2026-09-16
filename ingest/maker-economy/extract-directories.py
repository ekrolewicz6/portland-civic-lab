"""Extract public directory listings. Requires lxml; private contact/location fields never read.
Raw inputs are pinned by checksums.lock.json; normalized names group candidate matches,
not people. Offline calculation from the committed CSV is in build-makers.ts.
"""
from pathlib import Path
from lxml import html
from urllib.parse import urlparse
import csv, json, hashlib, re, unicodedata
root=Path('research/maker-economy'); raw=Path('runtime-data/maker-economy')
locks={r['file']:r for r in json.loads((root/'checksums.lock.json').read_text()) if 'file' in r}
def tree(file):
 p=raw/file; b=p.read_bytes(); lock=locks.get(str(p))
 if not lock or hashlib.sha256(b).hexdigest()!=lock['sha256']: raise ValueError('Unpinned source '+file)
 return html.fromstring(b)
def text(n): return ' '.join(n.text_content().split())
def norm(s): return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower())
def safe_urls(urls): return list(dict.fromkeys(u.strip() for u in urls if urlparse(u.strip()).scheme in ('http','https') and 'safelinks.protection.outlook.com' not in u))
rows=[]
def add(source,name,medium,urls,period,scope,locator):
 urls=safe_urls(urls)
 rows.append(dict(listing_id=f'{source}-{len([r for r in rows if r["doc_id"]==source])+1:03}',name=name,match_key=norm(name),medium=medium,scope=scope,urls=';'.join(urls),period=period,geography=('Portland-area studio tour; production city unverified' if source=='open-studios-2025' else 'Regional exhibitors at a Portland venue; production city unverified'),doc_id=source,locator=locator,observed_on='2026-09-15'))
for n in tree('pos2025.html').xpath('//*[contains(@class,"collection-item-label")][contains(.,"Studio ")]'):
 name=text(n.xpath('.//a')[0]); p=n.getparent(); d=p.xpath('.//*[contains(@class,"collection-item-description")]/p')[0]
 lines=[x.strip() for x in d.itertext() if x.strip()]; medium=next((line for line in lines if ' | ' in line), lines[-2])
 scope='physical-medium-listed' if any(s in medium.lower() for s in ['acrylic','oil','painting','ceramic','clay','wood','metal','glass','jewelry','sculpture','textile','fiber','printmaking','mixed media','drawing','collage','encaustic','watercolor','pastel','pencil','gouache','assemblage','leather']) else 'needs-activity-review'
 add('open-studios-2025',name,medium,p.xpath('.//a/@href'),'2025 tour',scope,text(n))
for n in tree('potters2026.html').xpath('//div[@class="vendor"]'):
 name=text(n.xpath('.//*[@class="vendorname"]')[0]); add('potters-directory',name,'Ceramics',n.xpath('.//a/@href'),'Undated directory; not assigned to 2026','physical-medium-listed',name)
for n in tree('guilds2026.html').xpath('//h4[contains(@class,"hp-listing__title")]'):
 name=re.sub(r'\s+–\s+.*$','',text(n)); p=n.getparent(); cat=text(p.xpath('.//*[contains(@class,"hp-listing__categories")]')[0])
 add('guilds-2026',name,cat,n.xpath('.//a/@href'),'2026 exhibitor directory','physical-medium-listed',text(n))
for n in tree('psm-crafts.html').xpath('//h2[contains(@class,"list-item-content__title")]'):
 name=text(n); p=n.getparent().getparent().getparent(); add('market-directory',name,'Craft directory; discipline not individually verified',p.xpath('.//a/@href'),'Undated directory','needs-activity-review',name)
with (root/'data/directory-listings.csv').open('w') as f:
 w=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n'); w.writeheader();w.writerows(rows)
from collections import Counter,defaultdict
print(Counter(r['doc_id'] for r in rows)); groups=defaultdict(list)
for r in rows: groups[r['match_key']].append(r)
print('Exact-name groups',len(groups))
for v in groups.values():
 if len(v)>1:print('MATCH',[(r['name'],r['doc_id']) for r in v])
print('Ambiguous Open Studios:',[(r['name'],r['medium']) for r in rows if r['doc_id']=='open-studios-2025' and r['scope']=='needs-activity-review'])
