import re, json, unicodedata
TXT="/tmp/pdx-budget-vol1.txt"
NUMRE=re.compile(r'\d[\d,]*(?:\.\d+)?')
BUREAU_MAP = {
 "office of the city attorney":"city-attorney","office of the city auditor":"city-auditor",
 "city budget office":"cbo","city administrator":"office-city-administrator",
 "portland children's levy":"childrens-levy","council":"city-council",
 "office of city operations":"office-city-operations","fire & police disability & retirement":"fpdr",
 "portland permitting & development":"ppd","office of community and econ development":"office-ced",
 "office of community and economic development":"office-ced","bureau of emergency communications":"boec",
 "portland office of emergency management":"pbem","bureau of environmental services":"bes",
 "portland fire & rescue":"pfr","bureau of fleet & facilities":"bff",
 "office of government relations":"office-government-relations","portland housing bureau":"phb",
 "bureau of human resources":"bhr","office of the chief financial officer":"cfo-office",
 "office of the mayor":"mayor","office of community and civic life":"civic-life",
 "office of equity":"office-equity","office of community-based police accountability":"ocpa",
 "portland parks & recreation":"parks","portland police bureau":"ppb",
 "bureau of planning & sustainability":"bps","office of the public safety dca":"community-safety",
 "portland bureau of transportation":"pbot","bureau of technology services":"bts",
 "water bureau":"water","office of public works":"office-public-works",
}
def norm(s):
    s=unicodedata.normalize("NFKD",s).encode("ascii","ignore").decode()
    return re.sub(r'\s+',' ',s).strip().lower()
T8 = {"city-attorney":80.5,"city-auditor":47.0,"cbo":18.0,"office-city-administrator":47.0,
"childrens-levy":7.8,"city-council":52.0,"office-city-operations":164.0,"fpdr":18.0,"ppd":340.9,
"office-ced":12.0,"boec":169.9,"pbem":23.9,"bes":658.0,"pfr":782.4,"bff":150.0,
"office-government-relations":10.0,"phb":90.0,"bhr":110.0,"cfo-office":204.0,"mayor":9.0,
"civic-life":9.9,"office-equity":16.0,"ocpa":6.0,"parks":784.61,"ppb":1215.9,"bps":173.7,
"community-safety":126.0,"pbot":1044.0,"bts":276.0,"water":624.8,"office-public-works":10.0}
SKIP_PREFIX=("Total Full-Time","Total Part-Time","Grand Total","FTE Summary","Class",
 "City of Portland","Summary of","Bureau ","Financial Summaries","Table ")
lines=open(TXT,encoding="utf-8",errors="ignore").read().split("\n")
bureau_names=set(BUREAU_MAP.keys())
cur=None; data={}; last=None
def is_header(s): return norm(s) in bureau_names and len(s)<70
for raw in lines:
    line=raw.rstrip(); s=line.strip()
    if not s: continue
    if is_header(s): cur=BUREAU_MAP[norm(s)]; data.setdefault(cur,{}); last=None; continue
    if any(s.startswith(p) for p in SKIP_PREFIX): last=None; continue
    if cur is None: continue
    m=re.match(r'\s*(\d{8})\b', line)
    nums=list(NUMRE.finditer(line))
    if m and len(nums)>=7:          # classId + >=6 trailing year-columns
        classId=m.group(1)
        adoptedFte=float(nums[-2].group().replace(",","")); adoptedAmt=int(float(nums[-1].group().replace(",","")))
        ndata=len(nums)-1           # numbers after classId
        bMin=bMax=None
        if ndata>=8:
            bMin=int(float(nums[-8].group().replace(",",""))); bMax=int(float(nums[-7].group().replace(",","")))
        title_end = nums[-8].start() if ndata>=8 else nums[-6].start()
        title=line[m.end():title_end].strip()
        rec=data[cur].get(classId)
        if rec: rec["fte"]+=adoptedFte; rec["amount"]+=adoptedAmt
        else: data[cur][classId]={"classId":classId,"title":title,"fte":adoptedFte,"amount":adoptedAmt,"bMin":bMin,"bMax":bMax}; last=data[cur][classId]
    elif last is not None and not re.match(r'\s*\d{8}\b', line) and not nums:
        last["title"]=(last["title"]+" "+s).strip()
print("bureau            parsed   table8    diff  #cls")
ok=0; tot=0
for nid in sorted(T8):
    recs=data.get(nid,{}); pf=round(sum(r["fte"] for r in recs.values()),2); tot+=pf
    diff=round(pf-T8[nid],2); flag="" if abs(diff)<0.5 else " <-- off"
    if abs(diff)<0.5: ok+=1
    print(f"{nid:26}{pf:8.2f}{T8[nid]:9.2f}{diff:7.2f}  {len(recs):3}{flag}")
print(f"reconciled {ok}/{len(T8)}   parsed total {round(tot,2)} vs Table8 {round(sum(T8.values()),2)}")
json.dump(data, open("/tmp/org_personnel_budget.json","w"))
