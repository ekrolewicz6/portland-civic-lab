"""Publish bounded chart inputs and unchanged evidence from the reviewed report.

No acquisition, database mutation, identity matching or statistical refitting.
Run after portland_report_data.py and publish_candidate_finance.py.
"""
import csv
import hashlib
import json
from pathlib import Path
from shutil import copyfile

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / 'research/campaign-finance/investigation/portland'
DEST = ROOT / 'public/data/campaign-finance/story'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def table(name):
    with (SOURCE / (name + '.csv')).open(newline='') as handle:
        return list(csv.DictReader(handle))


def run():
    report = json.loads((SOURCE / 'report-data.json').read_text())
    analysis = json.loads((SOURCE / 'analysis.json').read_text())
    facts = json.loads((ROOT / 'src/lib/campaign-finance/candidate-facts.json').read_text())
    context = json.loads((SOURCE.parent / 'portland-context.json').read_text())
    assert report['snapshot'] == analysis['snapshot'] == facts['snapshot']
    for c in report['candidates']:
        f = facts['committees'][c['committee_id']]
        for a, b in [('cash_cents', 'cashCents'), ('public_cents', 'publicCents'), ('nonmatching_cents', 'nonmatchingCents')]:
            assert c[a] == f[b], (c['candidate'], a)
    weeks = table('candidate-weeks')
    for c in report['candidates']:
        rows = [w for w in weeks if w['committee_id'] == c['committee_id']]
        for key in ['cash_cents', 'public_cents', 'nonmatching_cents']:
            assert sum(int(r[key]) for r in rows) == c[key], (c['candidate'], key)
    pairs = table('donor-overlap-tests')
    pair_amounts = table('shared-donor-pair-amounts')
    assert len(pairs) == len(pair_amounts) == analysis['network']['hypotheses'] == 136
    dollars = {frozenset((r['committee_a'], r['committee_b'])): r for r in pair_amounts}
    assert len(dollars) == 136
    assert all(int(dollars[frozenset((p['committee_a'], p['committee_b']))]['shared_groups']) == int(p['shared']) for p in pairs)
    names = ['candidate-weeks', 'event-windows', 'billboard-date-sensitivity',
             'donor-overlap-tests', 'shared-donor-pair-amounts', 'candidate-report-metrics',
             'donor-portfolios-complete', 'donor-candidate-complete-ledger',
             'candidate-daily-nonmatching']
    expected = {k + '.csv': v['sha256'] for k, v in analysis['tables'].items()}
    expected.update({r['file']: r['sha256'] for r in report['tables']})
    DEST.mkdir(parents=True, exist_ok=True)
    evidence = []
    for name in names:
        file = name + '.csv'
        assert file in expected, 'Missing source checksum: ' + file
        assert sha(SOURCE / file) == expected[file], 'Changed evidence: ' + file
        header = (SOURCE / file).read_text().splitlines()[0].lower()
        assert 'address' not in header and 'street' not in header
        copyfile(SOURCE / file, DEST / file)
        evidence.append({'file': file, 'sha256': sha(DEST / file)})
    number_keys = ['cash_cents', 'public_cents', 'nonmatching_cents', 'unidentified_cents', 'individual_itemized_cents']
    chart_weeks = [{**{k: w[k] for k in ['committee_id', 'candidate', 'week_start']},
                    **{k: int(w[k]) for k in number_keys}, 'provisional': w['provisional'] == 'True'}
                   for w in weeks if w['week_start'] >= '2026-01-05']
    events = [{**{k: r[k] for k in ['committee_id', 'candidate', 'event_date']},
               **{k: int(r[k]) for k in ['pre_cents', 'post_cents', 'pre_itemized_individual_cents', 'post_itemized_individual_cents']}}
              for r in table('event-windows') if r['event_date'] == '2026-09-13' and r['window_days'] == '7']
    assert len(events) == 17
    chart_pairs = [{**{k: p[k] for k in ['committee_a', 'committee_b', 'candidate_a', 'candidate_b']},
                    **{k: int(p[k]) for k in ['shared', 'same_name_sensitivity_shared', 'null_p025', 'null_p975']},
                    **{k: float(p[k]) for k in ['null_mean', 'bh_q']},
                    'pair_gross_cents': int(dollars[frozenset((p['committee_a'], p['committee_b']))]['pair_gross_cents'])} for p in pairs]
    output = {'snapshot': report['snapshot'], 'version': 'race-story-v1',
              'totals': report['totals'], 'coverage': {'reviewed': 17, 'roster': 33},
              'weeks': chart_weeks, 'september': events, 'pairs': chart_pairs,
              'network': analysis['network'], 'endorsements': context['endorsements'],
              'evidence': evidence, 'sourceReportSha256': sha(SOURCE / 'report-data.json'),
              'candidateFactsSha256': sha(ROOT / 'src/lib/campaign-finance/candidate-facts.json')}
    serialized = json.dumps(output, ensure_ascii=False, separators=(',', ':')) + '\n'
    (ROOT / 'src/lib/campaign-finance/story-data.json').write_text(serialized)
    (DEST / 'story-data.json').write_text(serialized)
    print(json.dumps({'status': 'passed', 'weeklyRows': len(chart_weeks), 'pairs': len(pairs), 'evidenceFiles': len(evidence), 'bytes': len(serialized.encode())}))


if __name__ == '__main__':
    run()
