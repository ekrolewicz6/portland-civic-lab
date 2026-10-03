#!/usr/bin/env python3
"""Build the webpage payload from pinned research extracts; no live API needed."""
import csv,json,hashlib,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent
OUT=ROOT/'src/data/small-business'
PUB=ROOT/'public/data/small-business'
OUT.mkdir(exist_ok=True,parents=True);PUB.mkdir(exist_ok=True,parents=True)
def read(name):
 with (HERE/'data'/name).open() as f:return list(csv.DictReader(f))
def numeric(rows,keys):
 return [{k:(float(v) if v else None) if k in keys else v for k,v in r.items()} for r in rows]
raw=ROOT/'runtime-data/small-business/susb2022_msa.txt'
assert hashlib.sha256(raw.read_bytes()).hexdigest()=='e90e9f9029af62b954d98e4bdad82f504f36aad2508e17d2240d53beb336230d'
with raw.open(encoding='latin1') as f: rows=list(csv.DictReader(f))
lookup={(r['MSA'],r['NAICS'],r['ENTRSIZE']):r for r in rows}
metros=[]
for r in rows:
 if r['NAICS']!='--' or r['ENTRSIZE']!='01' or 'Metro Area' not in r['MSADSCR']:continue
 small=lookup[(r['MSA'],'--','08')]; micro=lookup[(r['MSA'],'--','05')]
 metros.append(dict(msa=r['MSA'],name=r['MSADSCR'].replace(' Metro Area',''),jobs=int(r['EMPL']),smallJobs=int(small['EMPL']),microJobs=int(micro['EMPL']),share=int(small['EMPL'])/int(r['EMPL'])*100,microShare=int(micro['EMPL'])/int(r['EMPL'])*100))
peers={'38900':'Portland','42660':'Seattle','19740':'Denver','33460':'Minneapolis','40900':'Sacramento','41620':'Salt Lake City','38300':'Pittsburgh','26900':'Indianapolis','12420':'Austin'}
sectors=['11','21','22','23','31-33','42','44-45','48-49','51','52','53','54','55','56','61','62','71','72','81']
# Fix all comparisons to Portland's 19-sector jobs mix. Exclude NAICS 99.
weights={s:int(lookup[('38900',s,'01')]['EMPL']) for s in sectors}; wt=sum(weights.values())
adjusted=[]
for msa,name in peers.items():
 for size in ['05','08']:
  value=0
  for s,w in weights.items():
   total=lookup[(msa,s,'01')];part=lookup[(msa,s,size)]
   assert total['EMPL'].isdigit() and part['EMPL'].isdigit()
   assert total['EMPLFL_N'] in ['G','H','J'] and part['EMPLFL_N'] in ['G','H','J']
   value+=w/wt*int(part['EMPL'])/int(total['EMPL'])*100
  adjusted.append(dict(msa=msa,metro=name,size_code=size,adjusted_jobs_share=value,portland_weight_jobs=wt))
with (HERE/'data/metro-industry-standardized-2022.csv').open('w') as f:
 w=csv.DictWriter(f,fieldnames=adjusted[0]);w.writeheader();w.writerows(adjusted)
with (HERE/'data/all-metro-context-2022.csv').open('w') as f:
 w=csv.DictWriter(f,fieldnames=metros[0]);w.writeheader();w.writerows(metros)
size=numeric(read('metro-size-2022.csv'),['firms','establishments','jobs','payroll_usd','receipts_usd','jobs_share','payroll_share','receipts_share','annual_payroll_per_job_usd'])
sector=numeric(read('metro-sectors-2022.csv'),['firms','establishments','jobs','payroll_usd','receipts_usd'])
qcew=numeric(read('qcew-sectors-2019-2025.csv'),['year','jobs','payroll_usd','average_pay_usd','employment_lq','establishments'])
nes=numeric(read('nonemployer-sectors-2023.csv'),['establishments','receipts_usd'])
bds=numeric(read('bds-metro-2019-2023.csv'),['year','firms','establishments','jobs','establishments_entered','entry_rate_pct','establishments_exited','exit_rate_pct','jobs_created','jobs_destroyed','net_jobs','firm_deaths'])
age=numeric(read('bds-portland-firm-age-2023.csv'),['firms','jobs','jobs_created','jobs_destroyed','net_jobs'])
with (HERE/'sources.tsv').open() as f:sources=list(csv.DictReader(f,delimiter='\t'))
extra_path=HERE/'web-sources.json'
extra=json.loads(extra_path.read_text()) if extra_path.exists() else []
# Only reviewed sources support editorial claims; full register retains screened/queued labels.
payload=dict(size=size,sectors=sector,qcew=qcew,nes=nes,bds=bds,age=age,metros=metros,adjusted=adjusted,sources=sources+extra)
(OUT/'evidence.json').write_text(json.dumps(payload,separators=(',',':'))+'\n')
for p in (HERE/'data').glob('*.csv'):shutil.copyfile(p,PUB/p.name)
for name in ['sources.tsv','claims.tsv','methodology.md','gdp-feasibility.md','fieldwork-kit.md','future-program.md','raw-inputs.tsv','web-claims.tsv','build-web.py']:shutil.copyfile(HERE/name,PUB/name)
if extra_path.exists():shutil.copyfile(extra_path,PUB/'web-sources.json')
shutil.copyfile(HERE/'notes/webpage-research.md',PUB/'webpage-methods.md')
checks={'metros':len(metros),'all_metro_weighted_under500_pct':sum(m['smallJobs'] for m in metros)/sum(m['jobs'] for m in metros)*100,'all_metro_weighted_under20_pct':sum(m['microJobs'] for m in metros)/sum(m['jobs'] for m in metros)*100,'standardized_sector_coverage_pct':wt/1084535*100,'adjusted':adjusted}
assert len(metros)==387
assert abs(sum(r['jobs'] for r in size if r['metro']=='Portland' and r['size_code'] in ['02','03','04','06','07','09'])-1084535)<1
assert abs(next(r['adjusted_jobs_share'] for r in adjusted if r['msa']=='38900' and r['size_code']=='08')-50.24)<.02
(HERE/'data/web-checks.json').write_text(json.dumps(checks,indent=2)+'\n')
print(json.dumps(checks,indent=2))
