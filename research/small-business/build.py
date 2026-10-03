#!/usr/bin/env python3
"""Rebuild verified small-business tables and figures from pinned raw evidence."""
import csv, hashlib, json, zipfile
from pathlib import Path
import openpyxl
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent
RAW=ROOT/"runtime-data/small-business"
OUT=HERE/"data"
VIS=HERE/"visuals"
HASHES={
 "susb2022_msa.txt":"e90e9f9029af62b954d98e4bdad82f504f36aad2508e17d2240d53beb336230d",
 "susb2022_county.xlsx":"21ba2207f8bd76683945437e66091a5c84c80c1ef551b8ee2badd15afb1ea833",
 "osb_year_one.pdf":"bf3f83dd299ae9a39f6df33365bcaf0a93a5fc11420a585d8677fb25dd618002",
 "bds2023_msa.csv":"1efaa54b3926fddd410719cb77dcb65a8f2f47eb5ba070d0037be60cc6fc3b79",
 "bds2023_msa_fac.csv":"b2b22253b0fd51569e79a800dccc9e17afbfaff7f7395738fa90d1cc4ffd6015"}
ANCILLARY_HASHES={
 "runtime-data/maker-economy/qcew2019.csv":"b7692e311b2744c3e3ad35a3ce205a2b744096a3ddfa9c1500b43957025df142",
 "runtime-data/maker-economy/qcew2025.csv":"04d3b9a1b4d79c6fec3de32045a0e5c18910ce8f1ed3febd52a3f1acc48a7bbb",
 "runtime-data/maker-economy/nes2023.zip":"65030a96b0e5542ca7b52aa954c2c66cf1cff0f936e8b2b225375d3d186bac28",
 "runtime-data/small-business/web/prosper-insights.pdf":"aa21830664a1fa7faa4b7491b24a1b90a2450da249f017c506dca482c13b36c0"}
PEERS={"38900":"Portland","42660":"Seattle","19740":"Denver","33460":"Minneapolis","40900":"Sacramento","41620":"Salt Lake City","38300":"Pittsburgh","26900":"Indianapolis","12420":"Austin"}
SIZES={"02":"<5","03":"5-9","04":"10-19","06":"20-99","07":"100-499","09":"500+"}
SECTORS={"11":"Agriculture","21":"Mining","22":"Utilities","23":"Construction","31-33":"Manufacturing","42":"Wholesale","44-45":"Retail","48-49":"Transport","51":"Information","52":"Finance","53":"Real estate","54":"Professional","55":"Management","56":"Administrative","61":"Education","62":"Health care","71":"Arts and recreation","72":"Accommodation/food","81":"Other services","99":"Unclassified"}
BLUE,GOLD,GRAY="#176f8a","#d1853f","#677886"
plt.rcParams.update({"font.family":"DejaVu Sans","font.size":10,"axes.spines.top":False,"axes.spines.right":False,"figure.facecolor":"#faf9f5","axes.facecolor":"#faf9f5","savefig.facecolor":"#faf9f5"})

def digest(path):
 h=hashlib.sha256()
 with path.open("rb") as f:
  for block in iter(lambda:f.read(1<<20),b""): h.update(block)
 return h.hexdigest()
def write_csv(name,rows):
 if not rows: raise ValueError("Empty "+name)
 with (OUT/name).open("w",newline="") as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
def num(v):
 try: return int(v)
 except (ValueError,TypeError): return None
def save(name,title,xlabel=""):
 plt.title(title,loc="left",fontweight="bold",pad=15)
 if xlabel: plt.xlabel(xlabel)
 plt.tight_layout(pad=2); plt.savefig(VIS/(name+".svg"),bbox_inches="tight"); plt.savefig(VIS/(name+".png"),bbox_inches="tight",dpi=140); plt.close()
def bars(name,title,labels,values,xlabel,colors=BLUE):
 fig,ax=plt.subplots(figsize=(9,max(3.4,len(labels)*.42+1.3)))
 y=np.arange(len(labels)); ax.barh(y,values,color=colors); ax.set_yticks(y,labels); ax.invert_yaxis()
 ax.grid(axis="x",alpha=.17); ax.set_axisbelow(True); save(name,title,xlabel)

def main():
 OUT.mkdir(exist_ok=True); VIS.mkdir(exist_ok=True)
 for name,expected in HASHES.items():
  if digest(RAW/name)!=expected: raise ValueError("Pinned source changed: "+name)
 for name,expected in ANCILLARY_HASHES.items():
  if digest(ROOT/name)!=expected: raise ValueError("Pinned source changed: "+name)
 with (RAW/"susb2022_msa.txt").open(newline="",encoding="latin1") as f:
  rows=[r for r in csv.DictReader(f) if r["MSA"] in PEERS]
 total={(r["MSA"],r["ENTRSIZE"]):r for r in rows if r["NAICS"]=="--"}
 if len(total)!=len(PEERS)*9: raise ValueError("Unexpected metro total rows")
 metro=[]
 for code,name in PEERS.items():
  t=total[(code,"01")]
  for band in ["02","03","04","05","06","07","08","09"]:
   r=total[(code,band)]
   metro.append({"msa":code,"metro":name,"size_code":band,"size":r["ENTRSIZEDSCR"],"firms":r["FIRM"],"establishments":r["ESTB"],"jobs":r["EMPL"],"payroll_usd":num(r["PAYR"])*1000,"receipts_usd":num(r["RCPT"])*1000,"jobs_share":round(num(r["EMPL"])/num(t["EMPL"]),6),"payroll_share":round(num(r["PAYR"])/num(t["PAYR"]),6),"receipts_share":round(num(r["RCPT"])/num(t["RCPT"]),6),"annual_payroll_per_job_usd":round(num(r["PAYR"])*1000/num(r["EMPL"])),"employment_noise":r["EMPLFL_N"],"payroll_noise":r["PAYRFL_N"],"receipts_noise":r["RCPTFL_N"],"source_id":"susb-msa-2022"})
  for field in ["FIRM","ESTB","EMPL","PAYR","RCPT"]:
   if abs(sum(num(total[(code,b)][field]) for b in SIZES)-num(t[field]))>max(3,num(t[field])*.00001): raise ValueError(name+" "+field+" mismatch")
 write_csv("metro-size-2022.csv",metro)
 sheet=openpyxl.load_workbook(RAW/"susb2022_county.xlsx",read_only=True,data_only=True)["County"]
 county=[]; county_total=None
 for r in sheet.iter_rows(min_row=4,values_only=True):
  if r[0]!="41" or r[2]!="051" or r[4]!="--": continue
  band=str(r[6]).split(":")[0]
  if band=="1": county_total=r; continue
  county.append({"county_fips":"41051","county":"Multnomah County","size_code":band,"size":r[6],"firms":r[7],"establishments":r[8],"jobs":r[9],"payroll_usd":r[11]*1000,"receipts_usd":r[13]*1000,"employment_noise":r[10],"payroll_noise":r[12],"receipts_noise":r[14],"source_id":"susb-county-2022"})
 if len(county)!=4 or county_total is None: raise ValueError("County size data missing")
 for field,idx in [("firms",7),("establishments",8),("jobs",9),("payroll_usd",11),("receipts_usd",13)]:
  expected=county_total[idx]*(1000 if field.endswith("usd") else 1)
  if abs(sum(r[field] for r in county)-expected)>max(3,expected*.00001): raise ValueError("County "+field+" mismatch")
 write_csv("county-size-2022.csv",county)
 sectors=[]
 for r in rows:
  if r["MSA"]!="38900" or r["NAICS"] not in SECTORS or r["ENTRSIZE"] not in ("01","08"): continue
  sectors.append({"naics":r["NAICS"],"sector":SECTORS[r["NAICS"]],"size_code":r["ENTRSIZE"],"firms":r["FIRM"],"establishments":r["ESTB"],"jobs":r["EMPL"],"payroll_usd":num(r["PAYR"])*1000 if num(r["PAYR"]) is not None else "","receipts_usd":num(r["RCPT"])*1000 if num(r["RCPT"]) is not None else "","employment_noise":r["EMPLFL_N"],"payroll_noise":r["PAYRFL_N"],"receipts_noise":r["RCPTFL_N"],"source_id":"susb-msa-2022"})
 write_csv("metro-sectors-2022.csv",sectors)
 qcew=[]
 for year in [2019,2025]:
  with (ROOT/f"runtime-data/maker-economy/qcew{year}.csv").open(newline="") as f:
   for r in csv.DictReader(f):
    if r["area_fips"]!="41051" or r["own_code"]!="5" or r["size_code"]!="0" or r["qtr"]!="A" or r["industry_code"] not in ("10",*SECTORS): continue
    sup=bool(r["disclosure_code"])
    qcew.append({"year":year,"county_fips":"41051","naics":r["industry_code"],"sector":SECTORS.get(r["industry_code"],"All private"),"establishments":r["annual_avg_estabs"],"jobs":"" if sup else r["annual_avg_emplvl"],"payroll_usd":"" if sup else r["total_annual_wages"],"average_pay_usd":"" if sup else r["avg_annual_pay"],"employment_lq":"" if sup else r["lq_annual_avg_emplvl"],"disclosure_code":r["disclosure_code"],"source_id":f"qcew-{year}"})
 write_csv("qcew-sectors-2019-2025.csv",qcew)
 nes=[]
 with zipfile.ZipFile(ROOT/"runtime-data/maker-economy/nes2023.zip") as z,z.open("nonemp23co.txt") as f:
  for r in csv.DictReader((b.decode("latin1") for b in f)):
   if r["ST"]!="41" or r["CTY"]!="051" or (r["NAICS"]!="00" and r["NAICS"] not in SECTORS): continue
   nes.append({"year":2023,"county_fips":"41051","naics":r["NAICS"],"sector":SECTORS.get(r["NAICS"],"All nonemployers"),"establishments":num(r["ESTAB"]) if num(r["ESTAB"]) is not None else "","receipts_usd":num(r["RCPTOT"])*1000 if num(r["RCPTOT"]) is not None else "","establishment_flag":r["ESTAB_F"],"receipts_noise":r["RCPTOT_N_F"],"receipts_flag":r["RCPTOT_F"],"source_id":"nes-2023"})
 write_csv("nonemployer-sectors-2023.csv",nes)
 bds=[]
 with (RAW/"bds2023_msa.csv").open(newline="",encoding="utf-8-sig") as f:
  for r in csv.DictReader(f):
   if r["msa"] not in PEERS or int(r["year"]) not in range(2019,2024): continue
   bds.append({"year":r["year"],"msa":r["msa"],"metro":PEERS[r["msa"]],"firms":r["firms"],"establishments":r["estabs"],"jobs":r["emp"],"establishments_entered":r["estabs_entry"],"entry_rate_pct":r["estabs_entry_rate"],"establishments_exited":r["estabs_exit"],"exit_rate_pct":r["estabs_exit_rate"],"jobs_created":r["job_creation"],"jobs_destroyed":r["job_destruction"],"net_jobs":r["net_job_creation"],"firm_deaths":r["firmdeath_firms"],"source_id":"bds-msa-2023"})
 if len(bds)!=len(PEERS)*5: raise ValueError("BDS metro years/peers missing")
 write_csv("bds-metro-2019-2023.csv",bds)
 age=[]
 with (RAW/"bds2023_msa_fac.csv").open(newline="",encoding="utf-8-sig") as f:
  for r in csv.DictReader(f):
   if r["msa"]!="38900" or r["year"]!="2023": continue
   age.append({"year":2023,"msa":"38900","firm_age_band":r["fagecoarse"],"firms":r["firms"],"establishments":r["estabs"],"jobs":r["emp"],"jobs_created":r["job_creation"],"jobs_destroyed":"" if r["job_destruction"]=="X" else r["job_destruction"],"net_jobs":r["net_job_creation"],"source_id":"bds-msa-age-2023"})
 if len(age)!=5: raise ValueError("BDS firm-age rows missing")
 write_csv("bds-portland-firm-age-2023.csv",age)
 p={r["size_code"]:r for r in metro if r["msa"]=="38900"}
 c={r["size_code"]:r for r in county}
 peers={name:{r["size_code"]:r for r in metro if r["metro"]==name} for name in PEERS.values()}
 s={r["sector"]:r for r in sectors if r["size_code"]=="01"}
 ss={r["sector"]:r for r in sectors if r["size_code"]=="08"}
 q19={r["sector"]:r for r in qcew if r["year"]==2019}; q25={r["sector"]:r for r in qcew if r["year"]==2025}
 bars("01-metro-size-jobs","Portland metro jobs by enterprise size, 2022",list(SIZES.values()),[int(p[k]["jobs"])/1000 for k in SIZES],"Thousands of payroll jobs; employers only")
 fig,ax=plt.subplots(figsize=(8,4)); xs=np.arange(2)
 for i,(field,label,color) in enumerate([("jobs_share","Jobs",BLUE),("payroll_share","Payroll",GOLD),("receipts_share","Receipts",GRAY)]): ax.bar(xs+(i-1)*.23,[p[k][field]*100 for k in ["05","08"]],.23,label=label,color=color)
 ax.set_xticks(xs,["<20 employees","<500 employees"]); ax.set_ylabel("Share of employer-business total (%)"); ax.set_ylim(0,65); ax.legend(frameon=False,ncol=3)
 save("02-metro-contributions","How the size threshold changes the contribution")
 for old in ["03-county-size-jobs.svg","03-county-size-jobs.png"]: (VIS/old).unlink(missing_ok=True)
 city=[{"year":2019,"jobs":108785,"geography":"Portland city","reported_size_band":"1-20 in figure text; 1-19 elsewhere in report","source_id":"prosper-insights","locator":"Figure 1.06, PDF page 17"},{"year":2024,"jobs":112411,"geography":"Portland city","reported_size_band":"1-20 in figure text; 1-19 elsewhere in report","source_id":"prosper-insights","locator":"Figure 1.06, PDF page 17"}]
 write_csv("city-small-employment-report-2019-2024.csv",city)
 fig,ax=plt.subplots(figsize=(8,4.5)); bars_=ax.bar(["2019","2024"],[r["jobs"]/1000 for r in city],color=[BLUE,GOLD],width=.55); ax.bar_label(bars_,labels=[f'{r["jobs"]:,}' for r in city],padding=4); ax.set_ylabel("Thousands of jobs, as reported"); ax.set_ylim(0,130)
 save("03-city-small-jobs","City small-business jobs: a modest net rise")
 order=sorted(peers,key=lambda n:peers[n]["08"]["jobs_share"],reverse=True)
 bars("04-peer-under500-jobs","Jobs at enterprises with fewer than 500 employees",order,[peers[n]["08"]["jobs_share"]*100 for n in order],"Percent of metro payroll jobs, 2022",[GOLD if n=="Portland" else BLUE for n in order])
 order=sorted(peers,key=lambda n:peers[n]["05"]["jobs_share"],reverse=True)
 bars("05-peer-under20-jobs","Jobs at enterprises with fewer than 20 employees",order,[peers[n]["05"]["jobs_share"]*100 for n in order],"Percent of metro payroll jobs, 2022",[GOLD if n=="Portland" else BLUE for n in order])
 bars("06-payroll-per-job","Annual payroll per job varies by enterprise size",list(SIZES.values()),[p[k]["annual_payroll_per_job_usd"]/1000 for k in SIZES],"Thousands of dollars per mid-March employee; industry mix differs")
 top=sorted([r for r in s.values() if num(r["jobs"]) and r["sector"]!="Unclassified"],key=lambda r:num(r["jobs"]),reverse=True)[:12]
 bars("07-sector-jobs","Where Portland metro employer jobs are, 2022",[r["sector"] for r in top],[num(r["jobs"])/1000 for r in top],"Thousands of payroll jobs")
 firms=sorted(s.values(),key=lambda r:num(r["firms"]) or 0,reverse=True)[:12]
 bars("08-sector-firms","The largest sectors by metro firm count, 2022",[r["sector"] for r in firms],[num(r["firms"])/1000 for r in firms],"Thousands of employer firms")
 comp=[r for r in top if r["sector"] in ss and num(ss[r["sector"]]["jobs"])]
 bars("09-sector-under500","Small-firm employment share varies by industry",[r["sector"] for r in comp],[num(ss[r["sector"]]["jobs"])/num(r["jobs"])*100 for r in comp],"Percent of sector jobs at enterprises <500")
 change=[(n,(num(q25[n]["jobs"])/num(q19[n]["jobs"])-1)*100) for n in q25 if n in q19 and num(q25[n]["jobs"]) and num(q19[n]["jobs"]) and n!="All private" and num(q19[n]["jobs"])>=1000]
 change.sort(key=lambda x:x[1])
 bars("10-sector-change","Multnomah private jobs changed unevenly, 2019–2025",[x[0] for x in change],[x[1] for x in change],"Percent change in annual-average covered jobs",[GOLD if x[1]<0 else BLUE for x in change])
 ntop=sorted([r for r in nes if r["naics"]!="00" and num(r["establishments"])],key=lambda r:num(r["establishments"]),reverse=True)[:12]
 bars("11-nonemployers","Multnomah nonemployers by sector, 2023",[r["sector"] for r in ntop],[num(r["establishments"])/1000 for r in ntop],"Thousands of tax-reporting businesses without paid employees")
 bars("12-osb-industries","OSB's client mix is led by food service",["Food service","Retail/storefronts","Personal services","Professional services","Arts/events","Health care","Other","Consumer products","Construction"],[33,15,9,8,7,5,5,5,4],"Percent of businesses served; OSB Year One p. 4")
 bars("13-osb-services","Half of recorded OSB services involved Prosper resources",["Prosper resources","Community connections","Other resources","City bureau support","Access to capital"],[50,18,14,11,7],"Percent of services; referral does not establish outcome")
 bars("14-osb-intake","How businesses reached the Office of Small Business",["Liaison outreach","Appointment","Prosper website","Phone","OSB website","Partner referral","Online chat"],[30,25,19,10,9,5,2],"Percent of inquiries; OSB Year One p. 4")
 fig,ax=plt.subplots(figsize=(8,4)); ax.bar(["District 1","District 2","District 3","District 4","Arithmetic gap\n(not a district)"],[103,182,154,142,178],color=[BLUE]*4+[GOLD]); ax.set_ylabel("Businesses"); save("15-osb-district-gap","District counts sum to 581, versus 759 unique clients")
 port=sorted([r for r in bds if r["msa"]=="38900"],key=lambda r:int(r["year"]))
 fig,ax=plt.subplots(figsize=(9,4.5)); ax.plot([int(r["year"]) for r in port],[float(r["entry_rate_pct"]) for r in port],marker="o",linewidth=2.5,color=BLUE,label="Establishment entry"); ax.plot([int(r["year"]) for r in port],[float(r["exit_rate_pct"]) for r in port],marker="o",linewidth=2.5,color=GOLD,label="Establishment exit"); ax.set_xticks([2019,2020,2021,2022,2023]); ax.set_ylabel("Percent of average establishments in adjacent years"); ax.legend(frameon=False)
 save("16-bds-entry-exit","Metro establishment entry and exit both matter")
 checks={"source_sha256":{**{n:digest(RAW/n) for n in HASHES},**{n:digest(ROOT/n) for n in ANCILLARY_HASHES}},"msa_portland_jobs_total":num(total[("38900","01")]["EMPL"]),"msa_portland_under500_jobs":num(total[("38900","08")]["EMPL"]),"msa_portland_under500_job_share":p["08"]["jobs_share"],"county_jobs_total":county_total[9],"county_under500_jobs":sum(c[k]["jobs"] for k in ["2","3","4"]),"osb_unique_businesses_reported":759,"osb_district_businesses_sum":581,"osb_district_gap":178,"figures":len(list(VIS.glob("*.svg")))}
 if checks["figures"]!=16: raise ValueError("Expected 16 figures")
 (OUT/"checks.json").write_text(json.dumps(checks,indent=2)+"\n")
 print(json.dumps(checks,indent=2))

if __name__=="__main__": main()
