"""Exploratory shared-source tests conditional on observed bipartite degrees.

Population is explicitly selected: 30 committees with the most visible
individual record groups. Not a statewide test of every possible committee pair.
"""
import csv
import json
import os
os.environ.setdefault("OMP_NUM_THREADS","2")
os.environ.setdefault("OPENBLAS_NUM_THREADS","2")
import duckdb
import numpy as np
import networkx as nx
from scipy.sparse import coo_matrix
from common import *

def bh(p):
    p=np.asarray(p); order=np.argsort(p); ranked=p[order]*len(p)/np.arange(1,len(p)+1)
    adjusted=np.minimum.accumulate(ranked[::-1])[::-1].clip(0,1)
    out=np.empty(len(p));out[order]=adjusted;return out

def random_pairs(rng,n):
    """Buffer the same RNG integer stream; avoid a NumPy call per swap."""
    while True:
        yield from rng.integers(n,size=(4096,2))

def swap(edges,edge_set,pairs,target):
    successes=0;attempts=0;n=len(edges)
    while successes<target and attempts<target*30:
        i,j=next(pairs);attempts+=1
        a,b=edges[i];c,d=edges[j]
        if a==c or b==d or (a,d) in edge_set or (c,b) in edge_set:continue
        edge_set.remove((a,b));edge_set.remove((c,d));edge_set.add((a,d));edge_set.add((c,b))
        edges[i]=(a,d);edges[j]=(c,b);successes+=1
    if successes<target:raise RuntimeError("Could not mix degree-preserving chain sufficiently")
    return attempts

def overlap(edges,n,m):
    a,b=zip(*edges);matrix=coo_matrix((np.ones(len(edges),dtype=np.int32),(a,b)),shape=(n,m)).tocsr()
    return (matrix.T@matrix).toarray()

def run():
    manifest=json.loads((WORK/'manifest.json').read_text())
    con=duckdb.connect(str(ROOT/manifest['database']),read_only=True)
    con.execute("SET threads=2; SET memory_limit='2GB'")
    ids=[r[0] for r in con.execute("SELECT committee_id FROM transactions WHERE basis='cash_contribution' AND book_type='Individual' AND NOT is_disclosure_category GROUP BY committee_id ORDER BY count(DISTINCT entity_id) DESC,committee_id LIMIT 30").fetchall()]
    placeholders=','.join('?' for _ in ids)
    pairs=con.execute(f"SELECT DISTINCT entity_id,committee_id FROM transactions WHERE basis='cash_contribution' AND book_type='Individual' AND identity_status='provisional_record_group' AND committee_id IN ({placeholders}) ORDER BY entity_id,committee_id",ids).fetchall()
    donors={d:i for i,d in enumerate(sorted({r[0] for r in pairs}))};committees={c:i for i,c in enumerate(ids)}
    original=[(donors[d],committees[c]) for d,c in pairs];n,m=len(donors),len(ids)
    observed=overlap(original,n,m);indices=np.triu_indices(m,1);obs=observed[indices]
    simulations=[];chain_means=[];seeds=[20260927,20260928];attempts=0;draws=199
    for seed in seeds:
        rng=random_pairs(np.random.default_rng(seed),len(original));edges=original.copy();edge_set=set(edges)
        attempts+=swap(edges,edge_set,rng,len(edges)*10)
        chain=[]
        for _ in range(draws):
            attempts+=swap(edges,edge_set,rng,len(edges))
            chain.append(overlap(edges,n,m)[indices])
        simulations.extend(chain);chain_means.append(np.mean(chain,axis=0))
        print(f'Network null chain {seed}: {draws} draws complete',flush=True)
    null=np.array(simulations);p=(1+(null>=obs).sum(axis=0))/(len(null)+1);q=bh(p)
    names=dict(con.execute('SELECT committee_id,name FROM committees').fetchall())
    records=[];projection=nx.Graph();projection.add_nodes_from(ids)
    for k,(i,j) in enumerate(zip(*indices)):
        denom=int(observed[i,i]+observed[j,j]-observed[i,j]);jac=int(obs[k])/denom if denom else 0
        records.append({'committee_a':ids[i],'committee_b':ids[j],'name_a':names[ids[i]],'name_b':names[ids[j]],'shared_visible_groups':int(obs[k]),'groups_a':int(observed[i,i]),'groups_b':int(observed[j,j]),'jaccard':jac,'null_mean_shared':float(null[:,k].mean()),'excess_shared':float(obs[k]-null[:,k].mean()),'permutation_p':float(p[k]),'bh_q':float(q[k]),'chain_mean_difference':float(abs(chain_means[0][k]-chain_means[1][k]))})
        if obs[k]>0:projection.add_edge(ids[i],ids[j],weight=jac)
    communities=nx.community.louvain_communities(projection,seed=20260927,weight='weight')
    communities_again=nx.community.louvain_communities(projection,seed=20260928,weight='weight')
    communities_stable={frozenset(c) for c in communities}=={frozenset(c) for c in communities_again}
    path=PUBLIC/'shared-donor-tests.csv'
    with path.open('w',newline='') as f:w=csv.DictWriter(f,fieldnames=list(records[0]));w.writeheader();w.writerows(sorted(records,key=lambda r:(r['bh_q'],-r['excess_shared'])))
    result={'snapshot':SNAPSHOT,'population':'30 committees with most visible filer-classified Individual record groups, cash contributions only','committee_ids':ids,'record_groups':n,'edges':len(original),'hypotheses':len(records),'seeds':seeds,'draws_per_chain':draws,'successful_swaps_per_draw':len(original),'burn_in_swaps_per_chain':len(original)*10,'attempted_swaps':attempts,'null':'Bipartite simple-edge swaps preserve each selected donor-group degree and each committee donor-group count. Dollars not permuted. Conditional on selected subgraph; unitemized donors absent.','p_definition':'(1 + simulated overlaps >= observed)/(1 + 398 draws); dependent MCMC draws, mixing not proven by two-chain mean agreement.','multiple_testing':'Benjamini–Hochberg over all 435 selected pairs; exploratory under dependent tests.','communities':[sorted(c) for c in communities],'community_seed_agreement':communities_stable,'modularity':nx.community.modularity(projection,communities,weight='weight'),'top_pairs':sorted(records,key=lambda r:(r['bh_q'],-r['excess_shared']))[:20],'limitations':['No coordination inference; shared sources may reflect geography, ideology, party, incumbency or donor popularity.','Fingerprints are not reviewed individual identities. All named pair interpretations remain qualified.','Community labels are not political identities; two seeds are a stability diagnostic, not comprehensive validation.','Sparse/missing donor disclosure can change the graph; thresholds and selected population matter.'],'download':'/data/campaign-finance/shared-donor-tests.csv','sha256':digest(path)}
    write_json(PUBLIC/'networks.json',result);write_json(RESEARCH/'network-method.json',result)
    print(json.dumps({k:result[k] for k in ['record_groups','edges','hypotheses','community_seed_agreement','modularity']},indent=2))

if __name__=='__main__':run()
