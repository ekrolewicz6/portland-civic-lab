"""Publish bounded retry status without leaking browser cookies or raw records."""
import json
import re
from collections import Counter
from common import *

def safe_error(value):
    return re.sub(r'(OWASP_CSRFTOKEN=)[^&\s]+',r'\1SESSION_VALUE',str(value).split('\n')[0])

def run():
    base=ROOT/'runtime-data/orestar-analysis'
    files=[ROOT/'runtime-data/orestar/contributions-2025-01-01_2026-09-27/events.ndjson',ROOT/'runtime-data/orestar/non-contributions-2025-01-01_2026-09-27/events.ndjson']
    files += [base/name/'events.ndjson' for name in ['enrichment','context','endpoint-map','details','verification','research-runs']]
    events=[];sources=[]
    for path in files:
        if not path.exists():continue
        rows=[json.loads(line) for line in path.read_text().splitlines() if line.strip()]
        sources.append({'path':str(path.relative_to(ROOT)),'sha256':digest(path),'events':len(rows)})
        for row in rows:
            kind=row.get('type',row.get('status','event'))
            if row.get('error') or 'fail' in kind or kind=='stale_lock_recovered':
                events.append({'log':str(path.relative_to(ROOT)),'at':row.get('at'),'type':kind,
                    'target':row.get('stage',row.get('id',row.get('label',row.get('start','workflow')))),
                    'attempt':row.get('attempt'),'error':safe_error(row.get('error','Recovered lock of confirmed-terminated process' if kind=='stale_lock_recovered' else 'See source event for dependency or failure details'))})
    enrichment=json.loads((base/'enrichment/manifest.json').read_text())
    items=enrichment['items'];unresolved=[{'committee_id':id,'attempts':x['attempts'],'error':safe_error(x.get('error',''))} for id,x in items.items() if x['status']!='complete']
    incomplete=[id for id in enrichment['queue'] if id not in items]
    details=json.loads((base/'details/manifest.json').read_text()) if (base/'details/manifest.json').exists() else {}
    verification=json.loads((base/'verification/results.json').read_text()) if (base/'verification/results.json').exists() else {'status':'not_run'}
    local_stages={}
    local_log=base/'research-runs/events.ndjson'
    if local_log.exists():
        for line in local_log.read_text().splitlines():
            if not line.strip():continue
            item=json.loads(line)
            if item.get('stage'):
                local_stages[item['stage']]={'status':item.get('status'),'at':item.get('at'),'error':safe_error(item.get('error',''))}
    register={'version':'failure-register-v2','snapshot':SNAPSHOT,'events':events,'sourceLogs':sources,
        'failureCountsByLog':dict(Counter(e['log'] for e in events)),
        'sourceRecovery':{'raw_snapshot':'All frozen partitions complete; exact raw-to-normalized ID equality verified.',
            'profiles_complete':sum(x['status']=='complete' for x in items.values()),'profiles_unresolved':unresolved,
            'profiles_not_attempted':len(incomplete),'notAttemptedMeans':'A coverage gap, not a request failure or zero activity.',
            'independent_queue':len(details.get('independentIds',[])),
            'detail_status_counts':dict(Counter(x['status'] for x in details.get('items',{}).values()))},
        'localVerification':verification,
        'localAnalysisStages':local_stages,
        'unresolvedLocalStages':[k for k,v in local_stages.items() if v['status'] not in ('complete','cached')],
        'operationalRecoveries':[
            {'issue':'Configured workspace symlink prevents default sandbox startup','status':'working_real_path_with_approval','retry':'Use the resolved project path; do not repeatedly retry unchanged sandbox startup.'},
            {'issue':'Host Python 3.14 triggered unsupported source builds','status':'recovered','retry':'Pinned project-local Python 3.12 environment and wheel-compatible versions.'},
            {'issue':'Entity path colon remained encoded','status':'fixed_and_verified','retry':'Decode once, then validate canonical entity identifier.'},
            {'issue':'Early pagination check raced URL navigation','status':'fixed_and_verified','retry':'Await the navigation and assert preserved filters.'},
            {'issue':'Collector cached current year while previous year was missing','status':'fixed_and_reconciled','retry':'Require previous-year artifact or explicit unavailability; checksums on resume.'},
            {'issue':'Independent checkbox is absent from visible result criteria','status':'fixed','retry':'Verify cneSearchIndependentInd=I in result links. Keep search intent and archived result.'},
            {'issue':'Repeated export links and an unhandled download wait','status':'fixed','retry':'Use first export control and jointly await click/download; validated stale-owner recovery.'},
            {'issue':'ORESTAR rejects simultaneous tabs','status':'single_tab_workflow_verified','retry':'Close prior page before opening next; reject warning-bearing captures.'},
            {'issue':'Local script syntax/test-variable errors during implementation','status':'corrected','retry':'Type checking, unit tests and end-to-end verification recorded separately.'},
            {'issue':'Research runner file was shortened during a local edit','status':'restored_and_type_checked','retry':'Runner DAG and retry logging reconstructed; no source records changed. Run local research again only when refreshing the edition.'},
        ],
        'localAnalysisPolicy':'Two independent local jobs by default; validated input/output hashes, dependency-aware cache, failed-stage retry on rerun. No network or browser activity.',
        'browserPolicy':'Headless by default; no automatic visible fallback. Pause source collection if headless is rejected.',
        'retryPolicy':'One ORESTAR collector and active page; at most three attempts with increasing delay; stop three consecutively failing detail workflows. Preserve immutable partitions and hashes. Do not bypass access controls.',
        'remainingProgramme':'Statewide profile/balance coverage, fully reviewed entity resolution and associations, certified outcomes, neighborhood denominators, public-payment-level reconciliation and governing-record investigations remain incomplete.'}
    for path in [RESEARCH/'failure-register.json',PUBLIC/'failure-register.json']:write_json(path,register)
    print(json.dumps({'logged_failures_and_recoveries':len(events),'sourceRecovery':register['sourceRecovery'],'verification':verification['status']},indent=2))

if __name__=='__main__':run()
