"""Story-led, reproducible census analysis of the frozen 2025-2026 snapshot.

Run with runtime-data/orestar-analysis/py312/bin/python. Read-only database;
additive outputs only. All dollars remain integer cents in evidence exports.
"""
from __future__ import annotations
import csv
import json
from collections import defaultdict
from datetime import datetime, timezone
import duckdb
from common import ROOT, WORK, RESEARCH, PUBLIC, SNAPSHOT, digest, write_json, concentration

OUT = RESEARCH / "investigation"

def run():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((WORK / "manifest.json").read_text())
    db = ROOT / manifest["database"]
    c = duckdb.connect(str(db), read_only=True)
    c.execute("SET threads=2; SET memory_limit='2GB'")
    evidence = {}
    def query(key, sql, definition):
        cur = c.execute(sql)
        cols = [x[0] for x in cur.description]
        rows = [dict(zip(cols, row)) for row in cur.fetchall()]
        path = OUT / (key + ".csv")
        with path.open("w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=cols); w.writeheader()
            w.writerows({k:("'"+v if isinstance(v,str) and v.lstrip().startswith(("=","+","@","-")) else v) for k,v in r.items()} for r in rows)
        evidence[key] = dict(sql=sql, definition=definition, rows=len(rows), sha256=digest(path))
        return rows

    c.execute("CREATE TEMP VIEW matching AS SELECT * FROM read_csv_auto('" + str(PUBLIC / "public-matching-receipts.csv").replace("'", "''") + "')")
    c.execute("CREATE TEMP VIEW t AS SELECT *, transaction_id IN (SELECT transaction_id::VARCHAR FROM matching) AS public_match FROM transactions")
    totals = query("period-totals", "SELECT substr(transaction_date,1,4) AS year,basis,count(*) AS records,sum(amount_cents)::BIGINT AS cents FROM t GROUP BY ALL ORDER BY 1,2", "2025 is a full year; 2026 stops September 27. Bases are not additive spending measures.")
    monthly = query("monthly", "SELECT substr(transaction_date,1,7) AS month,basis,count(*) AS records,sum(amount_cents)::BIGINT AS cents,max(amount_cents) AS largest_record_cents FROM t GROUP BY ALL ORDER BY 1,2", "Transaction dates; current versions; final month incomplete.")
    monthly_sources = query("monthly-source-mix", "SELECT substr(transaction_date,1,7) AS month,book_type,count(*) AS records,sum(amount_cents)::BIGINT AS cents FROM t WHERE basis='cash_contribution' GROUP BY ALL ORDER BY 1,2", "Filer-reported contributor classifications, not verified industries.")
    profiles = query("committee-profiles", """WITH periods AS (
      SELECT '2025-2026' AS period,* FROM t UNION ALL SELECT substr(transaction_date,1,4),* FROM t
    ) SELECT period,committee_id,any_value(committee_name) AS name,count(*) AS records,
      sum(CASE WHEN basis='cash_contribution' THEN amount_cents ELSE 0 END)::BIGINT AS cash_cents,
      sum(CASE WHEN basis='cash_payment' THEN amount_cents ELSE 0 END)::BIGINT AS paid_cents,
      sum(CASE WHEN basis='loan_received' THEN amount_cents ELSE 0 END)::BIGINT AS loans_cents,
      sum(CASE WHEN basis='contribution_refund' THEN amount_cents ELSE 0 END)::BIGINT AS refund_cents,
      sum(CASE WHEN basis='noncash_support' THEN amount_cents ELSE 0 END)::BIGINT AS inkind_cents,
      sum(CASE WHEN basis='cash_contribution' AND (is_disclosure_category OR identity_status='unknown') THEN amount_cents ELSE 0 END)::BIGINT AS unidentified_cents,
      sum(CASE WHEN basis='cash_contribution' AND public_match THEN amount_cents ELSE 0 END)::BIGINT AS public_cents,
      sum(CASE WHEN basis='cash_contribution' AND counterparty_committee_id IS NOT NULL THEN amount_cents ELSE 0 END)::BIGINT AS committee_id_cents,
      sum(CASE WHEN basis='cash_contribution' AND state='OR' THEN amount_cents ELSE 0 END)::BIGINT AS oregon_cents,
      sum(CASE WHEN basis='cash_contribution' AND state NOT IN ('','OR') THEN amount_cents ELSE 0 END)::BIGINT AS outside_cents,
      sum(CASE WHEN basis='cash_contribution' AND state='' THEN amount_cents ELSE 0 END)::BIGINT AS unknown_state_cents,
      sum(CASE WHEN basis='cash_contribution' AND book_type='Individual' AND NOT is_disclosure_category THEN amount_cents ELSE 0 END)::BIGINT AS individual_cents,
      sum(CASE WHEN basis='cash_contribution' AND book_type='Candidate & Immediate Family' THEN amount_cents ELSE 0 END)::BIGINT AS self_family_cents
      FROM periods GROUP BY period,committee_id ORDER BY period,cash_cents DESC,committee_id""", "Reported committee activity, not unique donor dollars or race-cycle totals. Missing profile is unavailable, not zero.")
    sources = query("committee-source-groups", """WITH p AS (SELECT '2025-2026' AS period,* FROM t UNION ALL SELECT substr(transaction_date,1,4),* FROM t)
      SELECT period,committee_id,entity_id,any_value(entity_name) AS name,any_value(book_type) AS book_type,
      bool_or(public_match) AS public_match,count(*) AS gifts,sum(amount_cents)::BIGINT AS cents,
      min(transaction_date) AS first_date,max(transaction_date) AS last_date
      FROM p WHERE basis='cash_contribution' AND NOT is_disclosure_category AND identity_status<>'unknown'
      GROUP BY period,committee_id,entity_id ORDER BY period,committee_id,cents DESC,entity_id""", "Conservative name/type/full-address fingerprints or authoritative committee ID. Record groups are not verified unique people; no addresses exported.")
    mix = query("committee-source-mix", "SELECT substr(transaction_date,1,4) AS year,committee_id,book_type,sum(amount_cents)::BIGINT AS cents FROM t WHERE basis='cash_contribution' GROUP BY ALL ORDER BY 1,2,3", "Categories as reported; public money separated in the companion profile, not assumed private.")
    cadence = query("committee-monthly", "SELECT committee_id,substr(transaction_date,1,7) AS month,basis,count(*) AS records,sum(amount_cents)::BIGINT AS cents FROM t GROUP BY ALL ORDER BY 1,2,3", "Calendar-month activity by financial basis; no inferred opening cash.")
    payees = query("committee-payees", "SELECT committee_id,entity_id,any_value(entity_name) AS name,any_value(counterparty_committee_id) AS payee_committee_id,count(*) AS records,sum(amount_cents)::BIGINT AS cents FROM t WHERE basis='cash_payment' AND NOT is_disclosure_category AND identity_status<>'unknown' GROUP BY 1,2 ORDER BY 1,cents DESC,entity_id", "Cash payments, not vendor profit. Committee payments retained and separately identified.")
    purpose = query("committee-purposes", "SELECT committee_id,substr(transaction_date,1,4) AS year,purpose_codes,count(*) AS records,sum(amount_cents)::BIGINT AS cents FROM t WHERE basis='cash_payment' GROUP BY ALL ORDER BY 1,2,cents DESC", "Code bundles kept intact, avoiding multiple counts of the same payment.")
    largest = query("large-contribution-records", "SELECT transaction_id,transaction_date,committee_id,committee_name,entity_id,entity_name,book_type,state,amount_cents,source_raw_file,source_row FROM t WHERE basis='cash_contribution' AND amount_cents>=10000000 ORDER BY amount_cents DESC,transaction_id", "Every gross cash contribution of at least $100,000, including committee sources; source records retained for audit.")
    ports = json.loads((RESEARCH / "committee-race-crosswalk.json").read_text())["links"]
    selected = {r["committeeId"] for r in ports} | {"4792", "19050", "24693", "23285", "21717", "1524", "12986", "4572", "33", "4", "22185"}
    ids = ",".join("'"+x+"'" for x in sorted(selected))
    donor_records = query("selected-contribution-evidence", f"SELECT transaction_id,transaction_date,committee_id,entity_id,entity_name,book_type,basis,amount_cents,is_disclosure_category,identity_status,public_match,state,source_raw_file,source_row FROM t WHERE committee_id IN ({ids}) AND basis IN ('cash_contribution','contribution_refund') ORDER BY committee_id,transaction_date,transaction_id", "Selected named case evidence. No residential street addresses or employer attribution exported.")
    payments = query("selected-payment-evidence", f"SELECT transaction_id,transaction_date,committee_id,entity_id,entity_name,amount_cents,purpose_codes,purpose_description,source_raw_file,source_row FROM t WHERE committee_id IN ({ids}) AND basis='cash_payment' ORDER BY committee_id,transaction_date,transaction_id", "Selected spending evidence; reported purpose descriptions are claims by filers.")
    groups = defaultdict(list)
    for r in sources: groups[(r["period"],r["committee_id"])].append(r)
    metrics=[]
    for p in profiles:
        rs=groups[(p["period"],p["committee_id"])]
        visible=concentration([r["cents"] for r in rs])
        individuals=[r for r in rs if r["book_type"]=="Individual"]
        indi=concentration([r["cents"] for r in individuals])
        nongov=[r for r in rs if not r["public_match"]]
        top=rs[0] if rs else None
        metrics.append({**p,"visible_groups":len(rs),"top_source_name":top["name"] if top else None,
          "top_source_cents":top["cents"] if top else 0,"top10_cents":sum(r["cents"] for r in rs[:10]),
          "visible_hhi":visible["hhi"],"visible_effective_groups":visible["effective_groups"],
          "individual_groups":len(individuals),"individual_effective_groups":indi["effective_groups"],
          "individual_top10_cents":sum(sorted((r["cents"] for r in individuals),reverse=True)[:10]),
          "individual_cumulative_le100_cents":sum(r["cents"] for r in individuals if r["cents"]<=10000),
          "individual_repeat_groups":sum(r["gifts"]>1 for r in individuals),
          "individual_repeat_cents":sum(r["cents"] for r in individuals if r["gifts"]>1),
          "nonpublic_top_cents":max((r["cents"] for r in nongov),default=0)})
    path=OUT/"fundraising-profiles.csv"
    with path.open("w",newline="") as f:
        w=csv.DictWriter(f,fieldnames=list(metrics[0]));w.writeheader();w.writerows(metrics)
    evidence["fundraising-profiles"]={"definition":"All observed filers, exact totals and conservative source-group dependency; unidentified cash stays in all-cash denominators.","rows":len(metrics),"sha256":digest(path),"calculation":"investigation.py"}
    profile_map={(r["period"],r["committee_id"]):r for r in metrics}
    case_profiles=[profile_map[("2026",i)] for i in sorted(selected) if ("2026",i) in profile_map]
    # Growth decomposition compares identical Jan 1-Sep 27 calendar windows.
    growth=query("matched-window-growth", "SELECT substr(transaction_date,1,4) AS year,committee_id,any_value(committee_name) AS name,sum(amount_cents)::BIGINT AS cents FROM t WHERE basis='cash_contribution' AND substr(transaction_date,6,5)<='09-27' GROUP BY 1,2 ORDER BY 1,4 DESC", "Equal calendar windows, not a seasonality-adjusted causal comparison; 2025 local elections differ from 2026 statewide elections.")
    # Exact donor cohorts, no anonymous records treated as people.
    cohorts=query("individual-cohorts", """WITH g AS (SELECT committee_id,entity_id,
      sum(CASE WHEN transaction_date<'2026-01-01' THEN amount_cents ELSE 0 END)::BIGINT AS y25,
      sum(CASE WHEN transaction_date>='2026-01-01' THEN amount_cents ELSE 0 END)::BIGINT AS y26
      FROM t WHERE basis='cash_contribution' AND book_type='Individual' AND NOT is_disclosure_category AND identity_status<>'unknown' GROUP BY 1,2)
      SELECT committee_id,CASE WHEN y25>0 AND y26>0 THEN 'both_years' WHEN y25>0 THEN '2025_only' ELSE '2026_first_observed' END AS cohort,count(*) AS groups,sum(y25)::BIGINT AS cents_2025,sum(y26)::BIGINT AS cents_2026 FROM g GROUP BY 1,2 ORDER BY 1,2""", "First observed is not first-ever donor. Full 2025 versus partial 2026, exact fingerprints may split repeat donors.")
    diagnostics={"rows":c.sql("SELECT count(*) FROM t").fetchone()[0],"filers":c.sql("SELECT count(DISTINCT committee_id) FROM t").fetchone()[0],"all_cash_cents":sum(r["cents"] for r in totals if r["basis"]=="cash_contribution")}
    assert diagnostics["rows"]==316926 and diagnostics["filers"]==1888
    assert sum(r["cash_cents"] for r in metrics if r["period"]=="2025-2026")==diagnostics["all_cash_cents"]
    assert all(r["oregon_cents"]+r["outside_cents"]+r["unknown_state_cents"]==r["cash_cents"] for r in metrics)
    assert all(r["public_cents"]<=r["cash_cents"] for r in metrics)
    data={"snapshot":SNAPSHOT,"database_sha256":digest(db),"generated_at":datetime.now(timezone.utc).isoformat(),"diagnostics":diagnostics,"case_profiles":case_profiles,"evidence":evidence,"seed":20260927,"limitations":["No November-December 2024 data; window covers just under 21 months, not two complete years.","No unique-person assertion from fingerprints; no misconduct or coordination inferred.","No general-election result exists yet. No causal vote/spending estimate.","Public matching recognition limited to reviewed program receipts."]}
    write_json(OUT/"analysis.json",data)
    write_json(OUT/"run-status.json",{"status":"complete","checks_passed":4,"recoveries":[{"error":"DuckDB DDL prepared parameter unsupported","resolution":"TEMP VIEW with escaped fixed local path; persistent relation views rejected in read-only mode","status":"resolved"},{"error":"Legacy .venv lacks DuckDB","resolution":"Used existing pinned py312 runtime","status":"resolved"},{"error":"Exploratory SQL alias name and guessed network column failed","resolution":"Explicit AS aliases and verified shared_visible_groups schema","status":"resolved"}]})
    print(json.dumps({"diagnostics":diagnostics,"case_profiles":case_profiles,"tables":len(evidence)},indent=2))

if __name__ == "__main__": run()
