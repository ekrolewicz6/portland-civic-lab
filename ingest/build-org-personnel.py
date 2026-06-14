import re, json, openpyxl
budget=json.load(open("/tmp/org_personnel_budget.json"))
XLSX="/Users/edankrolewicz/Downloads/FY-25-26-City-of-Portland-Comp-Plan_0.xlsx"

# --- parse comp plan: jobId -> annual salary range + barg unit ---
wb=openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
ws=wb.active
rows=list(ws.iter_rows(values_only=True))
# find header row
hdr=None
for i,r in enumerate(rows):
    cells=[str(c).strip() if c is not None else "" for c in r]
    if "Job ID" in cells and "Classification" in cells and "Rate Type" in cells:
        hdr=i; cols={name:j for j,name in enumerate(cells)}; break
def ci(name): return cols.get(name)
JOB=ci("Job ID"); BARG=ci("Barg Unit"); CLS=ci("Classification"); RT=ci("Rate Type"); FLSA=ci("FLSA")
# rate value columns: from "Minimum" to end
start=ci("Minimum")
comp={}
for r in rows[hdr+1:]:
    if r is None: continue
    job=r[JOB]
    if job is None: continue
    job=str(int(job)) if isinstance(job,(int,float)) else str(job).strip()
    rt=str(r[RT]).strip() if r[RT] else ""
    if rt!="Annual": continue
    vals=[]
    for c in r[start:]:
        if isinstance(c,(int,float)) and c and c>1000: vals.append(float(c))
    if not vals: continue
    comp[job]={"classification":str(r[CLS]).strip() if r[CLS] else "","barg":str(r[BARG]).strip() if r[BARG] else "","min":int(min(vals)),"max":int(max(vals))}
print(f"comp plan: {len(comp)} annual classifications parsed")

# --- join ---
matched=0; unmatched=0
out={}
for nid, recs in budget.items():
    classes=[]
    for cid, r in recs.items():
        if r["fte"]<=0: continue
        c=comp.get(cid)
        if c:
            matched+=1
            salMin, salMax, barg = c["min"], c["max"], c["barg"]
        else:
            unmatched+=1
            salMin, salMax, barg = r.get("bMin"), r.get("bMax"), None
        # clean comp-less zero ranges
        if salMin==0 and (salMax==0 or salMax is None): salMin=salMax=None
        classes.append({"title":re.sub(r'\s+',' ',r["title"]).strip(),"fte":round(r["fte"],2),
                        "salMin":salMin,"salMax":salMax,"barg":barg or None})
    classes.sort(key=lambda x:-x["fte"])
    tot=round(sum(c["fte"] for c in classes),2)
    out[nid]={"classifications":classes,"totalFte":tot,"classCount":len(classes)}
print(f"join: {matched} classes matched to comp plan, {unmatched} fell back to budget range")

# --- emit TS ---
def esc(s): return s.replace("\\","\\\\").replace('"','\\"')
lines=[]
lines.append("// Per-bureau personnel detail — the deepest authoritative public layer.")
lines.append("// Source: FY2025-26 Adopted Budget Vol 1 per-bureau FTE Summary tables")
lines.append("// (authorized FTE + budgeted $ by job classification), joined by Class ID to")
lines.append("// the City's FY2025-26 Compensation Plan (annual salary range + bargaining unit).")
lines.append("// Generated; do not hand-edit. 28/31 bureaus reconcile exactly to budget Table 8;")
lines.append("// Parks/FPDR/Civic Life list a few seasonal/limited-term positions beyond the")
lines.append("// authorized total. Below individual employees (PRR/v3), this is as deep as it goes.")
lines.append("")
lines.append('export const PERSONNEL_FY = "FY2025-26 Adopted";')
lines.append('export const PERSONNEL_SOURCE =')
lines.append('  "https://www.portland.gov/budget/documents/fy-2025-26-city-portland-adopted-budget-vol-1-city-summaries-and-bureau-budgets/download";')
lines.append("")
lines.append("export interface PersonnelClass {")
lines.append("  title: string;")
lines.append("  fte: number;")
lines.append("  salaryMin: number | null;")
lines.append("  salaryMax: number | null;")
lines.append("  bargUnit: string | null;")
lines.append("}")
lines.append("export interface BureauPersonnel {")
lines.append("  classifications: PersonnelClass[];")
lines.append("  totalFte: number;")
lines.append("  classCount: number;")
lines.append("}")
lines.append("")
lines.append("export const BUREAU_PERSONNEL: Record<string, BureauPersonnel> = {")
for nid, b in sorted(out.items()):
    lines.append(f'  "{nid}": {{ totalFte: {b["totalFte"]}, classCount: {b["classCount"]}, classifications: [')
    for c in b["classifications"]:
        smin = "null" if c["salMin"] is None else str(c["salMin"])
        smax = "null" if c["salMax"] is None else str(c["salMax"])
        barg = "null" if not c["barg"] else f'"{esc(c["barg"])}"'
        lines.append(f'    {{ title: "{esc(c["title"])}", fte: {c["fte"]}, salaryMin: {smin}, salaryMax: {smax}, bargUnit: {barg} }},')
    lines.append("  ] },")
lines.append("};")
open("src/data/org-personnel.ts","w").write("\n".join(lines)+"\n")
print("wrote src/data/org-personnel.ts")
print("\n=== sample: PPB ===")
for c in out["ppb"]["classifications"][:6]:
    rng=f'${c["salMin"]:,}-${c["salMax"]:,}' if c["salMin"] else "(no range)"
    print(f'  {c["title"][:38]:38} {c["fte"]:7.2f} FTE  {rng}  [{c["barg"]}]')
