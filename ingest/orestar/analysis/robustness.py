"""Sensitivity scenarios, not alternative verified identities or money tracing."""
import csv
import json
import duckdb
import networkx as nx
from common import *

def run():
    manifest=json.loads((WORK/'manifest.json').read_text())
    con=duckdb.connect(str(ROOT/manifest['database']),read_only=True);con.execute('SET threads=2')
    visible="basis='cash_contribution' AND NOT is_disclosure_category AND identity_status<>'unknown'"
    scenarios=[
        ('conservative_visible_groups',f"SELECT entity_id,sum(amount_cents)::BIGINT amount FROM transactions WHERE {visible} GROUP BY 1",'Conservative fingerprint/authoritative committee groups; includes committee sources.'),
        ('same_name_type_stress_test',f"SELECT upper(trim(entity_name))||'|'||book_type,sum(amount_cents)::BIGINT amount FROM transactions WHERE {visible} GROUP BY 1",'Deliberately aggressive same-name/type grouping; not approved entity links. Can merge different people.'),
        ('exclude_reported_committee_sources',f"SELECT entity_id,sum(amount_cents)::BIGINT amount FROM transactions WHERE {visible} AND counterparty_committee_id IS NULL AND book_type NOT IN ('Political Committee','Political Party Committee','Unregistered Committee') GROUP BY 1",'Exclude all reported committee types and IDs. Remaining sources are not thereby proven external or private.'),
        ('reported_individual_groups',f"SELECT entity_id,sum(amount_cents)::BIGINT amount FROM transactions WHERE {visible} AND book_type='Individual' GROUP BY 1",'Reported individuals only; fingerprints are not verified people.'),
    ]
    results=[]
    for key,sql,limitation in scenarios:
        rows=con.execute(sql).fetchall()
        for exclude_top in [False,True]:
            values=sorted(r[1] for r in rows if r[1]>0)
            if exclude_top:values=values[:-1]
            results.append({'scenario':key+('_without_largest_group' if exclude_top else ''),**concentration(values),'limitation':limitation+(' Removes the single largest scenario group, not an estimated counterfactual campaign response.' if exclude_top else '')})
    with (PUBLIC/'concentration-sensitivity.csv').open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(results[0]));w.writeheader();w.writerows(results)
    rows=con.execute('SELECT receipt_id,payment_id,amount_cents,match_status FROM transfers').fetchall()
    graph=nx.Graph();left=set()
    for receipt,payment,amount,status in rows:
        a='r:'+receipt;b='p:'+payment;left.add(a);graph.add_edge(a,b,amount=amount)
    # Every connected component has one amount because each candidate edge
    # requires exact equality. Maximum cardinality therefore also maximizes
    # candidate dollars within each component; no payment/receipt reused.
    for component in nx.connected_components(graph):
        amounts={d['amount'] for _,_,d in graph.subgraph(component).edges(data=True)}
        assert len(amounts)==1
    matching=nx.bipartite.maximum_matching(graph,top_nodes=left)
    selected=[(a,b,graph[a][b]['amount']) for a,b in matching.items() if a in left]
    strict=sum(amount for _,_,amount,status in rows if status=='strict_unique_same_day')
    maximum=sum(amount for _,_,amount in selected)
    assert maximum>=strict
    transfer={'strict_same_day_cents':strict,'maximum_candidate_matching_cents':maximum,'maximum_candidate_pairs':len(selected),
        'method':'Maximum one-to-one bipartite matching across all reciprocal-ID, equal-amount, seven-day candidate pairs. Both sides retained.',
        'limitation':'Maximum is a possible reconciliation within this candidate set, not a verified transfer total or a global upper bound on all internal transfers. One optimum may not be unique; unmatched transfers may have changed dates/amounts or missing IDs.'}
    data={'version':'sensitivity-v1','snapshot':SNAPSHOT,'concentrationScenarios':results,'transferScenario':transfer,
        'findings':'Concentration persists across these scenarios; magnitudes depend on grouping and the source population. No fuzzy link is promoted by a sensitivity test.'}
    for path in [RESEARCH/'robustness.json',PUBLIC/'robustness.json',ROOT/'src/lib/campaign-finance/robustness.json']:write_json(path,data)
    print(json.dumps(data,indent=2));con.close()

if __name__=='__main__':run()
