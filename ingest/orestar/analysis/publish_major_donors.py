"""Publish an identity-conservative, read-only money-giver matrix for reviewed council races."""
import csv
import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path
from tempfile import NamedTemporaryFile

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / 'research/campaign-finance/investigation/portland'
APP = ROOT / 'src/lib/campaign-finance/major-donor-matrix.json'
PUBLIC_JSON = ROOT / 'public/data/campaign-finance/story/major-donor-matrix.json'
PUBLIC_CSV = ROOT / 'public/data/campaign-finance/story/major-donor-matrix.csv'
INDIVIDUAL_MIN_CENTS = 75000


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_csv(path):
    with path.open(newline='', encoding='utf-8') as handle:
        return list(csv.DictReader(handle))


def atomic_text(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile('w', encoding='utf-8', dir=path.parent, prefix=path.name + '.', suffix='.tmp', delete=False) as handle:
        handle.write(value)
        temp = Path(handle.name)
    temp.replace(path)


def run():
    portfolio_path = SOURCE / 'donor-portfolios-complete.csv'
    ledger_path = SOURCE / 'donor-candidate-complete-ledger.csv'
    portfolios = read_csv(portfolio_path)
    ledger = read_csv(ledger_path)
    story = json.loads((ROOT / 'src/lib/campaign-finance/story-data.json').read_text())
    facts = json.loads((ROOT / 'src/lib/campaign-finance/candidate-facts.json').read_text())
    assert story['snapshot'] == facts['snapshot']
    expected = {row['file']: row['sha256'] for row in story['evidence']}
    for path in (portfolio_path, ledger_path):
        assert digest(path) == expected[path.name], f'Changed source ledger: {path.name}'
    candidates = [
        dict(committeeId=link['committeeId'], name=link['candidateName'],
             raceId=link['raceId'], href=f"/voters-guide/{link['raceId']}/{link['candidateId']}#campaign-finance")
        for link in facts['links']
        if link['status'] == 'reviewed' and link['raceId'] in ('portland-district-3', 'portland-district-4')
    ]
    assert len(candidates) == 17
    candidate_ids = {candidate['committeeId'] for candidate in candidates}
    assert len(candidate_ids) == 17
    by_entity = defaultdict(list)
    for row in ledger:
        assert row['committee_id'] in candidate_ids
        by_entity[row['entity_id']].append(row)
    assert len({row['entity_id'] for row in portfolios}) == len(portfolios)
    selected = [
        row for row in portfolios
        if row['book_type'] != 'Individual' or int(row['gross_cents']) >= INDIVIDUAL_MIN_CENTS
    ]
    selected.sort(key=lambda row: (-int(row['gross_cents']), row['reported_name'], row['entity_id']))
    name_counts = Counter(row['reported_name'].casefold() for row in selected)
    output_rows = []
    csv_rows = []
    for portfolio in selected:
        entity_id = portfolio['entity_id']
        items = by_entity[entity_id]
        assert items, f'Portfolio without candidate ledger: {entity_id}'
        gross = sum(int(item['gross_cents']) for item in items)
        refunds = sum(int(item['observed_refund_cents']) for item in items)
        records = sum(int(item['contribution_records']) for item in items)
        assert gross == int(portfolio['gross_cents']), entity_id
        assert refunds == int(portfolio['observed_refund_cents']), entity_id
        assert records == int(portfolio['contribution_records']), entity_id
        assert portfolio['book_type'] == items[0]['book_type']
        assert portfolio['identity_status'] == items[0]['identity_status']
        assert len({item['committee_id'] for item in items}) == len(items)
        support = []
        for item in items:
            value = dict(committeeId=item['committee_id'], grossCents=int(item['gross_cents']),
                         refundCents=int(item['observed_refund_cents']),
                         records=int(item['contribution_records']))
            support.append(value)
            csv_rows.append([
                story['snapshot'], entity_id, portfolio['reported_name'], portfolio['book_type'],
                portfolio['identity_status'], item['committee_id'], item['candidate'], item['district'],
                value['grossCents'], value['refundCents'], value['records'], item['contribution_transaction_ids'],
                item['refund_transaction_ids'],
            ])
        code = entity_id.rsplit(':', 1)[-1][:6] if name_counts[portfolio['reported_name'].casefold()] > 1 else None
        output_rows.append(dict(
            entityId=entity_id, name=portfolio['reported_name'], groupCode=code,
            bookType=portfolio['book_type'], identityStatus=portfolio['identity_status'],
            grossCents=gross, refundCents=refunds, records=records, support=support,
        ))
    assert len(output_rows) >= 70
    result = dict(
        version='major-donor-matrix-v1', snapshot=story['snapshot'], start=facts['start'], end=facts['end'],
        individualMinimumCents=INDIVIDUAL_MIN_CENTS,
        definition='All visible non-Individual source groups, plus Individual record groups with at least $750 gross across reviewed District 3/4 committees. Gross cash contribution amounts before observed refunds; no City matching, loans, in-kind or aggregate/unidentified labels. Contributions are not endorsements.',
        limitation='Only reviewed committees and disclosed itemized source groups. Individual and noncommittee organization identities are provisional record groups; same-name groups are not merged. Transaction counts are not unique gifts or people. Candidate committee history in the window is not exclusively 2026 race activity.',
        portfolioSha256=digest(portfolio_path), ledgerSha256=digest(ledger_path),
        evidencePath='/data/campaign-finance/story/major-donor-matrix.csv',
        fullLedgerPath='/data/campaign-finance/story/donor-candidate-complete-ledger.csv',
        candidates=candidates, rows=output_rows,
    )
    serialized=json.dumps(result, ensure_ascii=False, separators=(',', ':')) + '\n'
    atomic_text(APP, serialized)
    atomic_text(PUBLIC_JSON, serialized)
    header=['snapshot','entity_id','reported_name','book_type','identity_status','committee_id',
            'candidate','district','gross_cents','observed_refund_cents','contribution_records',
            'contribution_transaction_ids','refund_transaction_ids']
    PUBLIC_CSV.parent.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile('w', encoding='utf-8', newline='', dir=PUBLIC_CSV.parent,
                            prefix=PUBLIC_CSV.name + '.', suffix='.tmp', delete=False) as handle:
        writer=csv.writer(handle)
        writer.writerow(header)
        writer.writerows(csv_rows)
        temp=Path(handle.name)
    temp.replace(PUBLIC_CSV)
    print(json.dumps({'rows':len(output_rows),'candidateRelationships':len(csv_rows),
                      'individuals':sum(row['bookType']=='Individual' for row in output_rows),
                      'otherGroups':sum(row['bookType']!='Individual' for row in output_rows)}))


if __name__ == '__main__':
    run()
