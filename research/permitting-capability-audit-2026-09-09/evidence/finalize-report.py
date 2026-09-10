import csv,re,json,hashlib
from pathlib import Path
R=Path(__file__).resolve().parent.parent
sources={x['id']:x for x in csv.DictReader((R/'sources.csv').open())}
text=(R/'evidence/report-template.md').read_text()
text=re.sub(r'\[\[([CO]\d+)\]\]',lambda m:'['+m[1]+']('+sources[m[1]]['url']+')',text)
(R/'report.md').write_text(text)
checks={}
checks['report_has_no_unresolved_citations']=not re.search(r'\[\[[CO]\d+\]\]',text)
checks['no_internal_web_tokens']=not re.search(r'turn\d+(?:search|view)\d+|',text)
tables={p.name:list(csv.DictReader(p.open())) for p in R.glob('*.csv')}
checks['catalog_180_unique']=len(tables['catalog-matrix.csv'])==len(set(x['slug'] for x in tables['catalog-matrix.csv']))==180
checks['catalog_nonempty_cells']=all(all(v.strip() for v in row.values()) for row in tables['catalog-matrix.csv'])
checks['catalog_matches_verification']=set(x['slug'] for x in tables['catalog-matrix.csv'])==set(x['slug'] for x in json.loads((R/'evidence/catalog-verification.json').read_text()))
checks['category_totals_180']=sum(int(x['actual_entries']) for x in tables['catalog-reconciliation.csv'])==180
checks['all_source_ids_resolve']=all(all(v in sources for v in row['source_ids'].split(';')) for n in ['automation-paths.csv','rules-coverage.csv','integration-gaps.csv','claims-verdicts.csv'] for row in tables[n])
checks['backlog_rule_sources_resolve']=all(all(v in sources for v in row['rule_source_ids'].split(';')) for row in tables['engineering-backlog.csv'])
checks['path_slugs_resolve']=all(all(v in set(x['slug'] for x in tables['catalog-matrix.csv']) for v in row['catalog_slugs'].split(';')) for row in tables['automation-paths.csv'])
checks['no_csv_formula_prefixes']=all(not v.startswith(('=','+','@')) for rows in tables.values() for row in rows for v in row.values())
checks['impact_arithmetic']=all(abs(float(r['modeled_annual_hours'])-float(r['annualized_proxy'])*float(r['assumed_covered_share'])*float(r['assumed_minutes_saved'])/60)<.06 for r in tables['impact-sensitivity.csv'])
checks['test_count_matches']=len(tables['test-results.csv'])==json.loads((R/'evidence/test-results.json').read_text())['total']==69
missing=[]
for p in [R/'report.md',R/'verification.md',R/'sources.md']:
 for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if target.startswith(('http:','https:','#')):continue
  dest=Path(target) if target.startswith('/') else p.parent/target.split('#')[0]
  if not dest.exists():missing.append(str(dest))
checks['local_links_exist']=not missing
assert all(checks.values()),(checks,missing)
(R/'evidence/artifact-qa.json').write_text(json.dumps({'checks':checks,'csv_rows':{k:len(v) for k,v in tables.items()},'report_words':len(text.split()),'missing_links':missing},indent=2)+'\n')
manifest={str(p.relative_to(R)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(R.rglob('*')) if p.is_file() and p.name!='artifact-manifest.json'}
(R/'evidence/artifact-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'passed':len(checks),'report_words':len(text.split()),'artifacts':len(manifest)}))
