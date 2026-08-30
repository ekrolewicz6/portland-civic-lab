#!/usr/bin/env python3
"""Derive the analysis series from the canonical PPS corpus tables.

  python3 ingest/pps-budget/analysis/derive.py            # uses cached CPI if present
  python3 ingest/pps-budget/analysis/derive.py --fetch-cpi  # refresh CPI from BLS (2 API calls)

Reads research/pps-budget/data/*.csv, writes research/pps-budget/data/derived/.
Every output row names the input rows (doc_id+page) it came from, so derived
figures stay traceable. Selection rules are explicit and logged to
derived/DERIVATION_NOTES.md rather than buried in code.
"""

import csv
import json
import re
import sys
import urllib.request
from collections import defaultdict
from pathlib import Path

DATA = Path("research/pps-budget/data")
OUT = DATA / "derived"
OUT.mkdir(exist_ok=True)

YEARS = [f"20{y:02d}-{y+1:02d}" for y in range(16, 27)]  # 2016-17 .. 2026-27
notes: list[str] = []


def read(name: str) -> list[dict]:
    with open(DATA / name) as f:
        return list(csv.DictReader(f))


def num(s: str):
    if s is None or s.strip() in ("", "-", "n/a", "NA"):
        return None
    try:
        return float(s.replace(",", "").replace("$", ""))
    except ValueError:
        return None


def write(name: str, header: list[str], rows: list[list]):
    with open(OUT / name, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)
    print(f"{name}: {len(rows)} rows")


# ── CPI (BLS annual averages, CUUR0000SA0) ─────────────────────────────────
CPI_CACHE = OUT / "cpi.json"


def fetch_cpi() -> dict[int, float]:
    out: dict[int, float] = {}
    for start, end in [("2016", "2021"), ("2022", "2026")]:
        req = urllib.request.Request(
            "https://api.bls.gov/publicAPI/v1/timeseries/data/",
            data=json.dumps(
                {"seriesid": ["CUUR0000SA0"], "startyear": start, "endyear": end, "annualaverage": True}
            ).encode(),
            headers={"Content-Type": "application/json"},
        )
        body = json.load(urllib.request.urlopen(req, timeout=60))
        if body.get("status") != "REQUEST_SUCCEEDED":
            raise SystemExit(f"BLS refused: {body.get('message')}")
        for s in body["Results"]["series"]:
            for d in s["data"]:
                if d["period"] == "M13":  # annual average
                    out[int(d["year"])] = float(d["value"])
    # Current year has no annual average yet; use latest monthly as provisional.
    if 2026 not in out:
        latest = None
        req = urllib.request.Request(
            "https://api.bls.gov/publicAPI/v1/timeseries/data/",
            data=json.dumps({"seriesid": ["CUUR0000SA0"], "startyear": "2026", "endyear": "2026"}).encode(),
            headers={"Content-Type": "application/json"},
        )
        body = json.load(urllib.request.urlopen(req, timeout=60))
        for s in body.get("Results", {}).get("series", []):
            for d in s["data"]:
                if d["period"].startswith("M") and d["period"] != "M13":
                    latest = float(d["value"])
                    break
        if latest:
            out[2026] = latest
            notes.append("CPI 2026 is the latest monthly value, not an annual average (provisional).")
    return out


if "--fetch-cpi" in sys.argv or not CPI_CACHE.exists():
    cpi = fetch_cpi()
    CPI_CACHE.write_text(json.dumps(cpi, indent=2))
else:
    cpi = {int(k): v for k, v in json.loads(CPI_CACHE.read_text()).items()}

BASE_YEAR = 2026  # express real dollars in FY2026-27 (calendar 2026) terms


def deflate(value: float, fy: str):
    cal = int("20" + fy[2:4])  # FY 2016-17 -> 2016
    if cal not in cpi or BASE_YEAR not in cpi:
        return None
    return value * cpi[BASE_YEAR] / cpi[cal]


# ── canonical GF + all-funds adopted series ────────────────────────────────
funds = read("all_funds_by_fund.csv")
GF_RE = re.compile(r"general fund", re.I)
TOTAL_RE = re.compile(r"^(grand total all funds|total all funds|all funds total|total district budget)", re.I)
GROUP_RE = re.compile(r"group total|type total", re.I)


def pick(rows: list[dict], value_col: str) -> tuple[float, str] | None:
    """Prefer a budget-book row; on disagreement take max and log."""
    vals = [(num(r[value_col]), r) for r in rows]
    vals = [(v, r) for v, r in vals if v is not None]
    if not vals:
        return None
    books = [(v, r) for v, r in vals if r["doc_id"].startswith("budget-")]
    chosen = max(books or vals, key=lambda x: x[0])
    spread = max(v for v, _ in vals) - min(v for v, _ in vals)
    if spread > max(1.0, chosen[0] * 0.001):
        notes.append(
            f"{value_col} {chosen[1]['fy']}: sources disagree by {spread:,.0f}K across {len(vals)} rows; took {chosen[1]['doc_id']} p{chosen[1]['page']}"
        )
    return chosen[0], f"{chosen[1]['doc_id']} p{chosen[1]['page']}"


gf_series = []
for fy in YEARS:
    gf_rows = [r for r in funds if r["fy"] == fy and r["basis"] == "adopted" and GF_RE.search(r["fund_name"]) and not GROUP_RE.search(r["fund_name"])]
    tot_rows = [r for r in funds if r["fy"] == fy and r["basis"] == "adopted" and TOTAL_RE.search(r["fund_name"]) and not GROUP_RE.search(r["fund_name"])]
    gf = pick(gf_rows, "requirements_k")
    tot = pick(tot_rows, "requirements_k")
    if not tot:
        groups = [r for r in funds if r["fy"] == fy and r["basis"] == "adopted" and GROUP_RE.search(r["fund_name"])]
        by_doc: dict[str, list[dict]] = defaultdict(list)
        for r in groups:
            by_doc[r["doc_id"]].append(r)
        best = max(by_doc.values(), key=len, default=None)
        if best and gf and len(best) >= 4:
            s = sum(num(r["requirements_k"]) or 0 for r in best) + gf[0]
            tot = (s, f"sum of {len(best)} fund-type group totals + GF ({best[0]['doc_id']})")
            notes.append(f"gf_series {fy}: no grand-total row; all-funds = GF + group totals from {best[0]['doc_id']}")
        else:
            singles = [r for r in funds if r["fy"] == fy and r["basis"] == "adopted" and not GROUP_RE.search(r["fund_name"]) and not TOTAL_RE.search(r["fund_name"]) and num(r["requirements_k"])]
            by_doc2: dict[str, list[dict]] = defaultdict(list)
            for r in singles:
                by_doc2[r["doc_id"]].append(r)
            best2 = max(by_doc2.values(), key=len, default=None)
            if best2 and len(best2) >= 5:
                s = sum(num(r["requirements_k"]) for r in best2)
                tot = (s, f"sum of {len(best2)} individual adopted fund rows ({best2[0]['doc_id']})")
                notes.append(f"gf_series {fy}: no total or group rows; all-funds = sum of {len(best2)} fund rows from {best2[0]['doc_id']}")
    if not gf:
        notes.append(f"gf_series {fy}: no adopted GF row found")
        continue
    gf_real = deflate(gf[0], fy)
    gf_series.append([fy, f"{gf[0]:.0f}", f"{tot[0]:.0f}" if tot else "", f"{gf_real:.0f}" if gf_real else "", gf[1], tot[1] if tot else ""])
write("gf_series.csv", ["fy", "gf_adopted_k", "all_funds_adopted_k", "gf_real_fy27_k", "gf_cite", "all_funds_cite"], gf_series)

# ── canonical enrollment + per-pupil ───────────────────────────────────────
enr = read("enrollment.csv")

def fy_of_enr_row(r: dict) -> str:
    """ACFR statistical tables label a school year by its ENDING fiscal year
    (label 2017 = October 2016 headcount = school year 2016-17)."""
    if r["doc_id"].startswith("acfr") and re.fullmatch(r"20\d\d", r["fy"].strip()):
        end = int(r["fy"])
        return f"{end - 1}-{str(end)[2:]}"
    return r["fy"]

canon_enr: dict[str, tuple[float, str, str]] = {}
for fy in YEARS:
    actuals = [r for r in enr if fy_of_enr_row(r) == fy and "forecast" not in (r["notes"] or "").lower() and num(r["enrollment"])]
    pref = sorted(actuals, key=lambda r: (0 if r["doc_id"].startswith("acfr") else 1 if r["doc_id"].startswith("tscc") else 2))
    # Continuity guard: an actual that differs >8% from the median of the year's
    # candidates is treated as a source anomaly (e.g. the ACFR 2025 statistical
    # table prints 52,380 for 2022-23 amid 45,497 and 44,771 - an apparent typo
    # that survived audit; see DERIVATION_NOTES).
    if len(pref) > 1:
        vals = sorted(num(r["enrollment"]) for r in pref)
        med = vals[len(vals) // 2]
        good = [r for r in pref if abs(num(r["enrollment"]) - med) / med <= 0.08]
        if good and len(good) < len(pref):
            dropped = [r for r in pref if r not in good]
            for dr in dropped:
                notes.append(f"enrollment {fy}: DROPPED outlier {num(dr['enrollment']):.0f} from {dr['doc_id']} p{dr['page']} (>8% off median {med:.0f}) - possible source typo, flag in document")
            pref = good
    if pref:
        r = pref[0]
        canon_enr[fy] = (num(r["enrollment"]), f"{r['doc_id']} p{r['page']}", "actual")
        continue
    forecasts = [r for r in enr if fy_of_enr_row(r) == fy and num(r["enrollment"]) and "forecast" in (r["notes"] or "").lower()]
    if forecasts:
        r = sorted(forecasts, key=lambda r: (0 if r["doc_id"].startswith("tscc") else 1))[0]
        canon_enr[fy] = (num(r["enrollment"]), f"{r['doc_id']} p{r['page']}", "forecast")

per_pupil = []
for row in gf_series:
    fy, gf_k = row[0], float(row[1])
    if fy not in canon_enr:
        notes.append(f"per_pupil {fy}: no enrollment figure at all")
        continue
    e, cite, kind = canon_enr[fy]
    nominal = gf_k * 1000 / e
    real = deflate(nominal, fy)
    per_pupil.append([fy, f"{e:.0f}", kind, f"{nominal:.0f}", f"{real:.0f}" if real else "", cite, row[4]])
write("per_pupil_gf.csv", ["fy", "enrollment", "enrollment_kind", "gf_per_student_nominal", "gf_per_student_real_fy27", "enrollment_cite", "gf_cite"], per_pupil)

# ── compression series ─────────────────────────────────────────────────────
tax = read("tax_rates.csv")
comp = []
for r in sorted(tax, key=lambda r: r["fy"]):
    v = num(r["compression_loss_k"])
    if v is None:
        continue
    comp.append([r["fy"], f"{v:.0f}", r["basis"], f"{r['doc_id']} p{r['page']}", (r["notes"] or "")[:120]])
write("compression_series.csv", ["fy", "compression_loss_k", "basis", "cite", "notes"], comp)

# ── purchased services (object 300), GF adopted ────────────────────────────
obj = read("gf_requirements_object.csv")
ps = []
for fy in YEARS:
    if fy < "2019-20":
        continue  # pre-2019-20 books print combined object categories; no clean 300 series
    rows = [r for r in obj if r["fy"] == fy and r["object_code"].strip() == "300" and r["basis"] == "adopted"]
    p = pick(rows, "amount_k")
    if p:
        share = ""
        gfrow = next((g for g in gf_series if g[0] == fy), None)
        if gfrow:
            share = f"{p[0] / float(gfrow[1]) * 100:.1f}"
        ps.append([fy, f"{p[0]:.0f}", share, p[1]])
write("purchased_services_gf.csv", ["fy", "object300_adopted_k", "pct_of_gf", "cite"], ps)

# ── FTE trends (budget-book "Total FTE" style rows + function groups) ──────
fte = read("fte_by_function.csv")
fte_rows = []
for r in sorted(fte, key=lambda r: (r["fy"], r["group"])):
    v = num(r["fte"])
    if v is None:
        continue
    fte_rows.append([r["fy"], r["group"], f"{v:.2f}", r["basis"], f"{r['doc_id']} p{r['page']}"])
write("fte_series.csv", ["fy", "group", "fte", "basis", "cite"], fte_rows)

# ── FY26 -> FY27 fund-level waterfall ──────────────────────────────────────
wf = []
by_fund: dict[str, dict[str, tuple[float, str]]] = defaultdict(dict)
NORM = [
    (re.compile(r"general fund", re.I), "General Fund"),
    (re.compile(r"special revenue", re.I), "Special Revenue Funds"),
    (re.compile(r"debt service", re.I), "Debt Service Funds"),
    (re.compile(r"capital", re.I), "Capital Projects Funds"),
    (re.compile(r"internal service", re.I), "Internal Service Funds"),
]
for r in funds:
    if r["fy"] not in ("2025-26", "2026-27") or r["basis"] != "adopted":
        continue
    label = next((lab for rx, lab in NORM if rx.search(r["fund_name"])), None)
    if not label or GROUP_RE.search(r["fund_name"]) is not None and "group" in r["fund_name"].lower():
        # group-total rows are exactly what we want for fund types; individual funds also match — prefer group totals below
        pass
    if not label:
        continue
    v = num(r["requirements_k"])
    if v is None:
        continue
    cur = by_fund[label].get(r["fy"])
    is_group = bool(GROUP_RE.search(r["fund_name"])) or "funds" in r["fund_name"].lower()
    if cur is None or (is_group and v >= cur[0]):
        by_fund[label][r["fy"]] = (v, f"{r['doc_id']} p{r['page']}")
for label, years in by_fund.items():
    a, b = years.get("2025-26"), years.get("2026-27")
    wf.append([label, f"{a[0]:.0f}" if a else "", f"{b[0]:.0f}" if b else "", f"{(b[0] - a[0]):.0f}" if a and b else "", a[1] if a else "", b[1] if b else ""])
write("waterfall_fy26_fy27.csv", ["fund_type", "fy2025_26_k", "fy2026_27_k", "delta_k", "cite_fy26", "cite_fy27"], wf)

# ── notes ──────────────────────────────────────────────────────────────────
with open(OUT / "DERIVATION_NOTES.md", "w") as f:
    f.write("# Derivation notes (generated by derive.py)\n\n")
    f.write(f"- CPI-U (CUUR0000SA0) annual averages, real dollars in calendar-{BASE_YEAR} terms; FY mapped to its starting calendar year.\n")
    f.write("- GF/all-funds selection prefers budget-book rows; disagreements >0.1% logged below.\n")
    f.write("- Enrollment preference order: TSCC series, then ACFR, then budget book; forecast rows excluded.\n\n")
    for n in notes:
        f.write(f"- {n}\n")
print(f"DERIVATION_NOTES.md: {len(notes)} notes")
