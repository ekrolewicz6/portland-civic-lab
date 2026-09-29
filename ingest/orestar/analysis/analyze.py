"""Deterministic, census-of-records analysis. No sampling CIs for exact totals."""
from __future__ import annotations
import csv
import json
import math
from collections import defaultdict
import duckdb
import numpy as np
from common import *

def safe_csv(row):
    return {k: ("'"+v if isinstance(v,str) and re.match(r'^[\s]*[=+@-]',v) else v) for k,v in row.items()}

def run():
    manifest = json.loads((WORK / "manifest.json").read_text())
    con = duckdb.connect(str(ROOT / manifest["database"]), read_only=True)
    con.execute("SET threads=2; SET memory_limit='2GB'")
    PUBLIC.mkdir(parents=True, exist_ok=True)
    evidence = {}

    def query(key, sql, description):
        cursor = con.execute(sql)
        columns = [d[0] for d in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
        path = PUBLIC / f"{key}.csv"
        with path.open("w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=columns)
            writer.writeheader()
            writer.writerows(safe_csv(r) for r in rows)
        evidence[key] = {"metric": key + "-v1", "snapshot": SNAPSHOT, "description": description, "sql": sql, "rows": len(rows), "sha256": digest(path), "download": f"/data/campaign-finance/{key}.csv"}
        return rows

    bases = query("financial-bases", "SELECT basis, subtype, direction, count(*) AS records, sum(amount_cents)::BIGINT AS amount_cents FROM transactions GROUP BY ALL ORDER BY basis, subtype", "Reported subtype amounts, not an additive grand total across accounting bases.")
    committees = query("committees", "SELECT committee_id, any_value(committee_name) AS name, count(*) AS records, sum(CASE WHEN basis='cash_contribution' THEN amount_cents ELSE 0 END)::BIGINT AS cash_contributions_cents, sum(CASE WHEN basis='cash_payment' THEN amount_cents ELSE 0 END)::BIGINT AS cash_payments_cents, sum(CASE WHEN basis='cash_contribution' AND is_disclosure_category THEN amount_cents ELSE 0 END)::BIGINT AS unidentified_cash_cents, sum(CASE WHEN basis='cash_contribution' AND counterparty_committee_id IS NOT NULL THEN amount_cents ELSE 0 END)::BIGINT AS committee_sourced_cash_cents, sum(CASE WHEN basis='loan_received' THEN amount_cents ELSE 0 END)::BIGINT AS loans_received_cents, sum(CASE WHEN basis='noncash_support' THEN amount_cents ELSE 0 END)::BIGINT AS inkind_cents FROM transactions GROUP BY committee_id ORDER BY cash_contributions_cents DESC, committee_id", "Committee-reported flows within the observed interval, not campaign-cycle totals or balances.")
    disclosure = query("disclosure", "SELECT family, subtype, entity_name AS label, count(*) AS records, sum(amount_cents)::BIGINT AS amount_cents FROM transactions WHERE is_disclosure_category GROUP BY ALL ORDER BY records DESC", "Aggregate and anonymous categories remain amounts, never donor identities.")
    donors = query("donor-record-groups", "SELECT entity_id, any_value(entity_name) AS name, any_value(identity_status) AS identity_status, count(DISTINCT committee_id) AS recipient_committees, count(*) AS gifts, sum(amount_cents)::BIGINT AS amount_cents FROM transactions WHERE basis='cash_contribution' AND NOT is_disclosure_category AND identity_status<>'unknown' GROUP BY entity_id ORDER BY amount_cents DESC, entity_id", "Gross cash contribution totals for conservative record groups. Not verified unique people. Includes authoritative committee sources separately identifiable by ID.")
    donor_committee = query("donor-committee", "SELECT committee_id, entity_id, any_value(identity_status) AS identity_status, any_value(book_type) AS book_type, count(*) AS gifts, sum(amount_cents)::BIGINT AS amount_cents, min(transaction_date) AS first_gift, max(transaction_date) AS last_gift FROM transactions WHERE basis='cash_contribution' AND NOT is_disclosure_category AND identity_status<>'unknown' GROUP BY committee_id, entity_id ORDER BY committee_id, entity_id", "Within-committee cumulative cash giving. Aggregate dollars cannot be allocated back to identified donors.")
    by_committee = defaultdict(list)
    for row in donor_committee:
        by_committee[row["committee_id"]].append(row)
    dependency = []
    for committee in committees:
        grouped = by_committee[committee["committee_id"]]
        metrics = concentration([r["amount_cents"] for r in grouped])
        unidentified = committee["unidentified_cash_cents"]
        total = committee["cash_contributions_cents"]
        identified = metrics["total_cents"]
        # Disclosure-bound HHI conditional on fixed observed groups, not an
        # assertion that anonymous amounts are all separate or one donor.
        squares = sum(r["amount_cents"] ** 2 for r in grouped)
        largest = max((r["amount_cents"] for r in grouped), default=0)
        dependency.append({"committee_id": committee["committee_id"], "name": committee["name"], **metrics,
            "unidentified_share": unidentified / total if total else None,
            "top_visible_group_share_all_cash": largest / total if total else None,
            "disclosure_hhi_infimum": squares / total ** 2 if total else None,
            "disclosure_hhi_upper": (squares - largest ** 2 + (largest + unidentified) ** 2) / total ** 2 if total else None,
            "repeat_group_share": sum(r["gifts"] > 1 for r in grouped) / len(grouped) if grouped else None,
            "visible_small_group_cash_cents": sum(r["amount_cents"] for r in grouped if r["amount_cents"] <= 10000),
            "scenario_remove_top_group_cents": identified - largest,
        })
    with (PUBLIC / "dependency.csv").open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(dependency[0])); w.writeheader(); w.writerows(safe_csv(r) for r in dependency)
    evidence["dependency"] = {"metric": "dependency-v1", "snapshot": SNAPSHOT, "description": "HHI, Gini and effective number among visible record groups; sensitivity bounds assign unidentified cash to infinitely diffuse sources or the largest visible source. Top-group removal is hypothetical forgone receipts, not cash runway.", "calculation": "ingest/orestar/analysis/common.py:concentration and analyze.py", "download": "/data/campaign-finance/dependency.csv", "sha256": digest(PUBLIC / "dependency.csv")}
    geography = query("geography", "SELECT CASE WHEN state='' THEN 'Unknown state' WHEN state='OR' THEN 'Oregon' ELSE 'Outside Oregon (reported)' END AS geography, count(*) AS records, sum(amount_cents)::BIGINT AS amount_cents, sum(CASE WHEN NOT is_disclosure_category AND identity_status<>'unknown' THEN amount_cents ELSE 0 END)::BIGINT AS identified_cents FROM transactions WHERE basis='cash_contribution' GROUP BY 1 ORDER BY amount_cents DESC", "Reported counterparty state, not donor residence verification or district location; unknown kept in denominator.")
    cities = query("cities", "SELECT city, state, count(*) AS records, sum(amount_cents)::BIGINT AS amount_cents FROM transactions WHERE basis='cash_contribution' GROUP BY ALL ORDER BY amount_cents DESC", "Reported city/state text, not a geocoded neighborhood or legal residence.")
    categories = query("reported-contributor-types", "SELECT book_type, count(*) AS records, sum(amount_cents)::BIGINT AS amount_cents FROM transactions WHERE basis='cash_contribution' GROUP BY book_type ORDER BY amount_cents DESC", "Filer-reported address-book classifications, not independently reviewed industries or employer attribution.")
    vendors = query("payee-record-groups", "SELECT entity_id, any_value(entity_name) AS name, any_value(identity_status) AS identity_status, count(DISTINCT committee_id) AS paying_committees, count(*) AS records, sum(amount_cents)::BIGINT AS amount_cents FROM transactions WHERE basis='cash_payment' AND NOT is_disclosure_category AND identity_status<>'unknown' AND counterparty_committee_id IS NULL GROUP BY entity_id ORDER BY amount_cents DESC, entity_id", "Noncommittee cash payees; includes reimbursements, intermediaries and pass-throughs, not verified vendor earnings.")
    purposes = query("purpose-bundles", "SELECT CASE WHEN purpose_codes='' THEN 'Not specified' ELSE purpose_codes END AS purpose_bundle, count(*) AS records, sum(amount_cents)::BIGINT AS amount_cents FROM transactions WHERE basis='cash_payment' GROUP BY 1 ORDER BY amount_cents DESC", "Multivalued purpose-code combinations kept intact so a payment is not counted in several categories.")
    monthly = query("monthly", "SELECT substr(transaction_date,1,7) AS month, basis, count(*) AS records, sum(amount_cents)::BIGINT AS amount_cents FROM transactions GROUP BY 1,2 ORDER BY 1,2", "Transaction-date activity, not filing-date arrivals. September 2026 ends on the 27th and is incomplete.")
    lag = query("filing-lag", "SELECT status, count(*) AS records, min(filed_lag_days) AS minimum_days, quantile_disc(filed_lag_days,0.5) AS median_days, quantile_disc(filed_lag_days,0.9) AS p90_days, quantile_disc(filed_lag_days,0.99) AS p99_days, count(*) FILTER (WHERE filed_lag_days<0) AS negative_lags FROM transactions GROUP BY status", "Current-version filed date minus transaction date. Amended rows do not reveal the initial disclosure date. Neither distribution establishes statutory lateness.")
    strict = query("matched-transfers", "SELECT * FROM transfers WHERE match_status='strict_unique_same_day' ORDER BY amount_cents DESC, receipt_id", "Unique reciprocal committee IDs, equal positive amount and same date. Both transaction IDs retained; candidate matches are not proof of an association recorded by ORESTAR.")
    candidates = query("ambiguous-transfers", "SELECT * FROM transfers WHERE match_status<>'strict_unique_same_day' ORDER BY receipt_id,payment_id", "Reciprocal IDs and equal amount within seven days but not uniquely same-day matched; excluded from strict circulation deduction.")
    flow = query("network-boundary", "SELECT basis, CASE WHEN counterparty_committee_id IN (SELECT committee_id FROM committees) THEN 'Observed committee counterparty' WHEN counterparty_committee_id IS NOT NULL THEN 'Committee outside observed filer set' WHEN is_disclosure_category OR identity_status='unknown' THEN 'Unidentified disclosure' ELSE 'No committee ID reported' END AS boundary, count(*) AS records, sum(amount_cents)::BIGINT AS amount_cents FROM transactions WHERE basis IN ('cash_contribution','cash_payment') GROUP BY ALL ORDER BY basis,boundary", "An observed-network boundary classification, not ultimate donor attribution. No committee ID does not prove a noncommittee origin.")
    gifts = query("gift-sizes", "SELECT CASE WHEN amount_cents<=2500 THEN '$25 or less' WHEN amount_cents<=10000 THEN '$25.01–$100' WHEN amount_cents<=35000 THEN '$100.01–$350' WHEN amount_cents<=100000 THEN '$350.01–$1,000' ELSE 'Over $1,000' END AS band, count(*) AS records, sum(amount_cents)::BIGINT AS amount_cents FROM transactions WHERE basis='cash_contribution' AND NOT is_disclosure_category GROUP BY 1 ORDER BY min(amount_cents)", "Individual itemized transaction sizes, not cumulative donor sizes. Aggregate rows excluded.")
    amendments = query("amendments", "SELECT family, status, count(*) AS records, sum(amount_cents)::BIGINT AS amount_cents FROM transactions GROUP BY ALL ORDER BY family,status", "Latest available versions only. Dollar totals across families are not a combined financial measure.")
    missingness = query("missingness", "SELECT family, count(*) AS records, count(*) FILTER(WHERE state='') AS missing_state, count(*) FILTER(WHERE city='') AS missing_city, count(*) FILTER(WHERE employer='') AS missing_employer, count(*) FILTER(WHERE occupation='') AS missing_occupation, count(*) FILTER(WHERE purpose_codes='') AS missing_purpose_codes, count(*) FILTER(WHERE purpose_description='') AS missing_description, count(*) FILTER(WHERE identity_status='unknown') AS missing_counterparty FROM transactions GROUP BY family", "Blank fields across transaction families; field applicability differs, so these are not violation counts.")
    large = query("largest-cash-records", "SELECT transaction_id, transaction_date, committee_id, committee_name, entity_id, entity_name, basis, amount_cents FROM transactions WHERE basis IN ('cash_contribution','cash_payment') ORDER BY amount_cents DESC,transaction_id LIMIT 100", "Magnitude-based investigation leads, not findings of misconduct.")
    names = query("same-name-candidates", "SELECT upper(trim(entity_name)) AS name, count(DISTINCT entity_id) AS distinct_record_groups, count(*) AS records FROM transactions WHERE identity_status='provisional_record_group' GROUP BY 1 HAVING count(DISTINCT entity_id)>1 ORDER BY distinct_record_groups DESC, name", "Possible entity-review candidates; never automatically merged on name.")
    # Report concentration at three distinct grains, making transfer sensitivity explicit.
    individual_groups = con.execute("SELECT entity_id,sum(amount_cents)::BIGINT FROM transactions WHERE basis='cash_contribution' AND book_type='Individual' AND NOT is_disclosure_category GROUP BY entity_id").fetchall()
    cash = sum(r["amount_cents"] for r in bases if r["basis"] == "cash_contribution")
    circulation = sum(r["amount_cents"] for r in strict)
    network = {"strict_pairs": len(strict), "strict_circulation_cents": circulation, "ambiguous_candidate_pairs": len(candidates), "cash_contributions_less_strict_matched_transfers_cents": cash - circulation,
        "warning": "Subtracting strict matched transfers is a conservative adjustment for observed internal circulation, not a verified total of outside money. Other internal transfers remain unmatched; origins may be unknown."}
    concentration_all = concentration([r["amount_cents"] for r in donors])
    concentration_people = concentration([r[1] for r in individual_groups])
    cumulative = sorted(r["amount_cents"] for r in donors)
    cs = np.cumsum(cumulative)
    lorenz = [{"group_share": 0, "cash_share": 0}] + [{"group_share": (i+1)/len(cumulative), "cash_share": int(cs[i])/int(cs[-1])} for i in sorted(set(round(x*(len(cumulative)-1)) for x in np.linspace(0,1,101)))]
    summary = {"snapshot": SNAPSHOT, "metric_version": SEMANTICS_VERSION, "start": START, "end": END, "rows": manifest["rows"], "filers": manifest["filers"],
        "bases": bases, "disclosure": disclosure, "geography": geography, "contributor_types": categories, "monthly": monthly, "lag": lag, "network_boundary": flow, "transfers": network,
        "concentration": {"visible_source_groups_including_committees": concentration_all, "reported_individual_groups": concentration_people}, "lorenz": lorenz,
        "top_committees": committees[:30], "top_payees": vendors[:25], "top_source_groups": donors[:25], "purpose_bundles": purposes[:25], "gift_sizes": gifts,
        "dependency": sorted([r for r in dependency if r["total_cents"] >= 10000000], key=lambda r: r["top1_share"], reverse=True)[:30], "same_name_candidate_count": len(names),
        "evidence": evidence, "review_status": "working local research edition; named committee IDs source-reviewed; broader identity/enrichment review incomplete"}
    write_json(WORK / "summary.json", summary)
    write_json(RESEARCH / "metric-definitions.json", evidence)
    write_json(PUBLIC / "summary.json", summary)
    write_json(ROOT / "src/lib/campaign-finance/publication.json", summary)
    query("profile-queue", "SELECT committee_id FROM transactions GROUP BY committee_id ORDER BY sum(CASE WHEN basis='cash_contribution' THEN amount_cents ELSE 0 END) DESC, committee_id", "Acquisition priority, not a sample for statewide totals.")
    print(json.dumps({"cash_contributions_cents": cash, "transfers": network, "concentration": summary["concentration"], "evidence_tables": len(evidence)}, indent=2))
    con.close()

if __name__ == "__main__":
    run()
