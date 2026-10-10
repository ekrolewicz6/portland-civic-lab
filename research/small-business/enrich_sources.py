#!/usr/bin/env python3
"""Rebuild source-register provenance columns from logged access and claim locators."""
import csv,json
from pathlib import Path
P=Path(__file__).resolve().parent
rows=list(csv.DictReader((P/'sources.tsv').open(newline=''),delimiter='\t'))
claims=list(csv.DictReader((P/'claims.tsv').open(newline=''),delimiter='\t'))
log={r['id']:r for r in json.loads((P/'crawl-log.json').read_text())['results']}
raw=json.loads((P/'data/checks.json').read_text())['source_sha256']
raw_by_id={'susb-msa-2022':'susb2022_msa.txt','susb-county-2022':'susb2022_county.xlsx','osb-2026':'osb_year_one.pdf','bds-msa-2023':'bds2023_msa.csv','bds-msa-age-2023':'bds2023_msa_fac.csv','qcew-2019':'runtime-data/maker-economy/qcew2019.csv','qcew-2025':'runtime-data/maker-economy/qcew2025.csv','nes-2023':'runtime-data/maker-economy/nes2023.zip'}
questions={'structure':'firm mix; size; ownership','dynamics':'entry; exit; age; durability','jobs':'employment; payroll; industry change','gdp':'GDP feasibility; value added','programs':'services; spending; reach','accountability':'program effectiveness; oversight','barriers':'operating conditions; costs','geography':'location; spatial coverage','local':'owner experience; business mix','capital':'finance; access','procurement':'large-small linkages; supplier access','policy':'evaluation; program design','ai':'AI adoption; service design'}
for r in rows:
 a=log.get(r['id'],{})
 r['research_questions']=questions.get(r['family'],'other')
 r['access_status']=a.get('status','not logged')
 r['archive_file']=a.get('file','')
 r['sha256']=a.get('sha256',raw.get(raw_by_id.get(r['id'],''),''))
 r['evidence_locations']=' | '.join(c['id']+': '+c['locator'] for c in claims if c['source_id']==r['id']) or 'No claim extracted yet'
 pub=r['publisher'].lower()
 if any(x in pub for x in ('us census','us bls','us bea','federal reserve','oregon employment','city of portland','city auditor','oregon secretary','business oregon','us sba','ffiec')): interest='public agency or official data; check program role'
 elif any(x in pub for x in ('prosper','office of small business','imda','city of seattle','nyc comptroller')): interest='program operator or public oversight body'
 elif any(x in pub for x in ('chamber','bricks need mortar','downtown','meso','livelihood','sbdc')): interest='membership, provider or advocacy interest'
 else: interest='research or other; inspect funding'
 r['funding_interest']=interest
 r['methodology_note']=r['note'] if r['status'] in ('reviewed','archived-reviewed') else 'Not fully reviewed; inspect publisher methods before use'
fields=list(rows[0])
with (P/'sources.tsv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=fields,delimiter='\t');w.writeheader();w.writerows(rows)
print(f'Enriched {len(rows)} source records')
