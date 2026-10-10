"""Publish the governor's-race finance edition from the active ORESTAR ledger.

Read-only against the active DuckDB snapshot. Reviewed inputs (candidate to
committee links, sponsor groupings for large committee donors, dated events and
legal context) live in ingest/orestar/governor-review.json and are never
inferred from names here. Street addresses and ZIP codes are used only to place
a contribution in an Oregon county and are never written out.

Run from the research checkout, or pass --data-root when the ledger lives in a
different checkout than the one receiving the publication files:

    runtime-data/orestar-analysis/py312/bin/python \
        ingest/orestar/analysis/publish_governor.py [--data-root PATH]
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

OUT_ROOT = Path(__file__).resolve().parents[3]
VERSION = 'governor-finance-v1'
EVIDENCE_URL = '/data/campaign-finance/governor/'
STATES = set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY AS GU MP PR VI'.split())
KINDS = [
    ('individual', 'Named individuals'),
    ('small', 'Gifts of $100 or less, reported in combined entries'),
    ('business', 'Businesses'),
    ('trade', 'Business and trade association committees'),
    ('labor', 'Unions and union committees'),
    ('governors', 'National governors’ groups'),
    ('candidates', 'Other candidates’ committees and parties'),
    ('other', 'Other committees and organizations'),
]
BANDS = [
    ('under_1k', 'Under $1,000', 0, 100_000),
    ('1k_10k', '$1,000 to $9,999', 100_000, 1_000_000),
    ('10k_100k', '$10,000 to $99,999', 1_000_000, 10_000_000),
    ('100k_1m', '$100,000 to $999,999', 10_000_000, 100_000_000),
    ('1m_plus', '$1 million or more', 100_000_000, None),
]
PURPOSES = {
    'Broadcast Advertising (radio, tv)': 'Broadcast advertising (radio, TV)',
    'Online and Social Media Advertising': 'Online and social media advertising',
    'Preparation and Production of Advertising': 'Advertising production',
    'Other Advertising (yard signs, buttons, etc.)': 'Signs and other advertising',
    'Newspaper and Other Periodical Advertising': 'Print advertising',
    'Literature, Brochures, Printing': 'Literature and printing',
    'Postage': 'Postage',
    'Management Services': 'Management and consulting services',
    'Surveys and Polls': 'Surveys and polls',
    'Wages, Salaries, Benefits': 'Wages, salaries and benefits',
    'General Operational Expenses (need description)': 'General operations',
    'Travel Expenses (need description)': 'Travel',
    'Fundraising Event Expenses': 'Fundraising events',
    'Cash Contribution': 'Contributions to other committees',
    'Reimbursement for Personal Expenditures': 'Personal-expense reimbursements',
    'Utilities': 'Utilities',
    'Agent': 'Payments through an agent',
    'Petition Circulators': 'Petition circulators',
}


def sha(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()


def safe(value):
    if isinstance(value, str) and value.lstrip().startswith(('=', '+', '-', '@')):
        return "'" + value
    return value


def clean(name: str) -> str:
    return re.sub(r'\s+', ' ', name or '').strip()


def week_start(day: str) -> str:
    parsed = date.fromisoformat(day)
    return (parsed - timedelta(days=parsed.weekday())).isoformat()


def purpose_label(codes: str) -> str:
    codes = (codes or '').strip()
    if not codes:
        return 'No purpose code reported'
    if ';' in codes:
        parts = [part.strip() for part in codes.split(';')]
        if all('Advertising' in part for part in parts):
            return 'Advertising, more than one code'
        return 'More than one purpose code'
    return PURPOSES.get(codes, 'Other reported purposes')


def band_for(cents: int) -> str:
    for key, _label, low, high in BANDS:
        if cents >= low and (high is None or cents < high):
            return key
    raise ValueError(cents)


def kind_for(row: dict, reviewed: dict) -> str:
    if row['hidden']:
        return 'small'
    if row['book_type'] == 'Individual':
        return 'individual'
    if row['entity_id'] in reviewed:
        return reviewed[row['entity_id']]['kind']
    return {'Business Entity': 'business', 'Labor Organization': 'labor',
            'Political Party Committee': 'candidates'}.get(row['book_type'], 'other')


def load_zips(data_root: Path, ids: set[str], duckdb) -> dict[str, str]:
    """Private ZIP lookup for county placement only; nothing here is published."""
    zips: dict[str, str] = {}
    parquet = data_root / 'runtime-data/orestar-analysis/orestar-20250101-20260927-v1/original-records-private.parquet'
    con = duckdb.connect()
    try:
        con.execute('CREATE TEMP TABLE wanted(transaction_id VARCHAR)')
        con.executemany('INSERT INTO wanted VALUES (?)', [(value,) for value in sorted(ids)])
        for transaction, raw in con.execute(
                f"SELECT p.transaction_id, p.source_record_json FROM '{parquet}' p JOIN wanted w USING (transaction_id)").fetchall():
            zips[str(transaction)] = (json.loads(raw).get('Zip') or '').strip()[:5]
    finally:
        con.close()
    manual = data_root / 'runtime-data/orestar-manual'
    for path in sorted(manual.glob('*/new-raw-records.json')):
        for record in json.loads(path.read_text()):
            transaction = str(record.get('Tran Id', '')).strip()
            if transaction in ids and transaction not in zips:
                zips[transaction] = str(record.get('Zip') or '').strip()[:5]
    return zips


def run(data_root: Path, out_root: Path) -> dict:
    import duckdb

    review = json.loads((out_root / 'ingest/orestar/governor-review.json').read_text())
    manifest = json.loads((data_root / 'research/campaign-finance/active-snapshot-manifest.json').read_text())
    database = data_root / manifest['database']
    if sha(database) != manifest['database_sha256']:
        raise ValueError('Active database checksum mismatch')
    reviewed = review['sourceKinds']['entities']
    counties = {}
    with (out_root / 'ingest/orestar/reference/oregon-zcta-county-2020.csv').open(newline='') as stream:
        for row in csv.DictReader(stream):
            counties[row['zcta']] = row['county']
    county_names = sorted({c['name'] for c in json.loads((out_root / 'src/lib/campaign-finance/oregon-counties.json').read_text())['counties']})
    assert len(county_names) == 36 and set(counties.values()) <= set(county_names)
    accounts = defaultdict(dict)
    with (out_root / 'public/data/campaign-finance/account-summaries.csv').open(newline='') as stream:
        for row in csv.DictReader(stream):
            accounts[row['committee_id']][row['year']] = row

    con = duckdb.connect(str(database), read_only=True)
    con.execute('SET threads=2')
    linked = [c for c in review['candidates'] if c['committeeId']]
    columns = ('transaction_id transaction_date filed_date basis subtype amount_cents cash_sign entity_id entity_name '
               'identity_status is_disclosure_category book_type city state purpose_codes counterparty_committee_id').split()
    ledgers = {}
    for candidate in linked:
        cursor = con.execute(f"SELECT {','.join(columns)} FROM transactions WHERE committee_id=? ORDER BY transaction_date,transaction_id",
                             [candidate['committeeId']])
        rows = [dict(zip(columns, record)) for record in cursor.fetchall()]
        if not rows:
            raise ValueError('Reviewed committee has no records: ' + candidate['committeeId'])
        for row in rows:
            row['entity_name'] = clean(row['entity_name'])
            row['hidden'] = bool(row['is_disclosure_category']) or row['identity_status'] == 'unknown'
        ledgers[candidate['committeeId']] = rows
    cash_ids = {row['transaction_id'] for rows in ledgers.values() for row in rows if row['basis'] == 'cash_contribution'}
    zips = load_zips(data_root, cash_ids, duckdb)
    # Post-office-box ZIP codes have no Census area. Those records fall back to
    # the county where at least 80% of the same city's mapped records sit.
    city_votes = defaultdict(lambda: defaultdict(int))
    for rows in ledgers.values():
        for row in rows:
            if row['basis'] == 'cash_contribution' and not row['hidden'] and clean(row['state']).upper() == 'OR':
                county = counties.get(zips.get(row['transaction_id'], ''))
                if county:
                    city_votes[clean(row['city']).upper()][county] += 1
    city_county = {}
    for city, votes in city_votes.items():
        county, count = max(votes.items(), key=lambda pair: (pair[1], pair[0]))
        if city and count >= 3 and count / sum(votes.values()) >= 0.8:
            city_county[city] = county

    start, end = manifest['start'], manifest['end']
    weeks = []
    cursor_day = date.fromisoformat(week_start(start))
    while cursor_day.isoformat() <= end:
        weeks.append(cursor_day.isoformat())
        cursor_day += timedelta(days=7)
    months = []
    month_cursor = date.fromisoformat(start).replace(day=1)
    while month_cursor.isoformat() <= end:
        months.append(month_cursor.strftime('%Y-%m'))
        month_cursor = (month_cursor.replace(day=28) + timedelta(days=4)).replace(day=1)

    latest_payment = {cid: max(row['transaction_date'] for row in rows if row['basis'] == 'cash_payment') for cid, rows in ledgers.items()}
    common_day = min(latest_payment.values())
    cap = review['context']['limits']['personPerElectionCents']
    evidence_rows = defaultdict(list)
    output_candidates = []
    group_index = {}

    for candidate in review['candidates']:
        cid = candidate['committeeId']
        base = {key: candidate[key] for key in ('candidateId', 'name', 'party', 'committeeId', 'committeeName', 'linkStatus',
                                                'linkBasis', 'linkSource', 'linkRetrievedAt', 'governorCommitteeFrom',
                                                'announced', 'announcedSource')}
        base['href'] = f"/voters-guide/{review['raceId']}/{candidate['candidateId']}"
        if not cid:
            output_candidates.append(base)
            continue
        rows = ledgers[cid]
        cash = [row for row in rows if row['basis'] == 'cash_contribution']
        payments = [row for row in rows if row['basis'] == 'cash_payment']
        total = sum(row['amount_cents'] for row in cash)
        assert all(row['amount_cents'] >= 0 for row in cash + payments)
        hidden_names = {row['entity_name'] for row in cash if row['hidden']}
        assert all(name.startswith('Miscellaneous Cash Contributions $100 and under') for name in hidden_names), hidden_names

        # Source groups: conservative record groups, never merged across spellings.
        groups = {}
        for row in cash:
            if row['hidden']:
                continue
            group = groups.setdefault(row['entity_id'], {
                'id': row['entity_id'], 'name': row['entity_name'], 'bookType': row['book_type'], 'kind': kind_for(row, reviewed),
                'city': clean(row['city']).title(), 'state': clean(row['state']).upper(), 'cents': 0, 'records': 0,
                'firstDate': row['transaction_date'], 'lastDate': row['transaction_date']})
            group['cents'] += row['amount_cents']
            group['records'] += 1
            group['lastDate'] = max(group['lastDate'], row['transaction_date'])
        ordered = sorted(groups.values(), key=lambda g: (-g['cents'], g['name'], g['id']))
        group_index[cid] = groups

        kinds = {key: {'key': key, 'label': label, 'cents': 0, 'records': 0, 'groups': 0} for key, label in KINDS}
        reported = defaultdict(lambda: {'cents': 0, 'records': 0})
        for row in cash:
            kind = kind_for(row, reviewed)
            kinds[kind]['cents'] += row['amount_cents']
            kinds[kind]['records'] += 1
            label = 'Combined entries of $100 or less' if row['hidden'] else row['book_type'] or 'Not reported'
            reported[label]['cents'] += row['amount_cents']
            reported[label]['records'] += 1
        for group in ordered:
            kinds[group['kind']]['groups'] += 1
        assert sum(item['cents'] for item in kinds.values()) == total
        assert sum(item['records'] for item in kinds.values()) == len(cash)

        bands = {key: {'key': key, 'label': label, 'cents': 0, 'groups': 0} for key, label, _low, _high in BANDS}
        for group in ordered:
            band = bands[band_for(group['cents'])]
            band['cents'] += group['cents']
            band['groups'] += 1
        small = kinds['small']['cents']
        assert sum(item['cents'] for item in bands.values()) + small == total

        over = {}
        for key, book in (('individual', 'Individual'), ('business', 'Business Entity')):
            matched = [g for g in ordered if g['bookType'] == book and g['cents'] > 2 * cap]
            over[key] = {'groups': len(matched), 'cents': sum(g['cents'] for g in matched),
                         'aboveCapCents': sum(g['cents'] - 2 * cap for g in matched)}

        weekly = {week: {'week': week, 'cents': 0, 'records': 0} for week in weeks}
        monthly = {month: {'month': month, 'cashCents': 0, 'paymentCents': 0} for month in months}
        for row in cash:
            bucket = weekly[week_start(row['transaction_date'])]
            bucket['cents'] += row['amount_cents']
            bucket['records'] += 1
            monthly[row['transaction_date'][:7]]['cashCents'] += row['amount_cents']
        for row in payments:
            monthly[row['transaction_date'][:7]]['paymentCents'] += row['amount_cents']
        assert sum(item['cents'] for item in weekly.values()) == total
        peaks = []
        for item in sorted(weekly.values(), key=lambda w: (-w['cents'], w['week']))[:3]:
            last = (date.fromisoformat(item['week']) + timedelta(days=6)).isoformat()
            in_week = defaultdict(int)
            for row in cash:
                if item['week'] <= row['transaction_date'] <= last:
                    in_week['Combined gifts of $100 or less' if row['hidden'] else row['entity_name']] += row['amount_cents']
            top = sorted(in_week.items(), key=lambda pair: (-pair[1], pair[0]))[:4]
            peaks.append({'start': item['week'], 'end': min(last, end), 'cents': item['cents'], 'records': item['records'],
                          'top': [{'name': name, 'cents': cents} for name, cents in top]})

        # Geography: reported contributor location, combined small gifts excluded.
        states = defaultdict(lambda: {'cents': 0, 'records': 0})
        people = {'oregon': {'cents': 0, 'records': 0}, 'outside': {'cents': 0, 'records': 0}, 'unknown': {'cents': 0, 'records': 0}}
        county_totals = {name: {'county': name, 'cents': 0, 'records': 0} for name in county_names}
        undetermined = {'cents': 0, 'records': 0}
        for row in cash:
            if row['hidden']:
                continue
            state = clean(row['state']).upper()
            key = state if state in STATES else 'unknown'
            states[key]['cents'] += row['amount_cents']
            states[key]['records'] += 1
            if row['book_type'] != 'Individual':
                continue
            place = people['oregon' if key == 'OR' else 'unknown' if key == 'unknown' else 'outside']
            place['cents'] += row['amount_cents']
            place['records'] += 1
            if key == 'OR':
                county = counties.get(zips.get(row['transaction_id'], '')) or city_county.get(clean(row['city']).upper())
                target = county_totals[county] if county else undetermined
                target['cents'] += row['amount_cents']
                target['records'] += 1
        named = total - small
        assert sum(item['cents'] for item in states.values()) == named
        oregon = states['OR']['cents']
        assert sum(item['cents'] for item in people.values()) == kinds['individual']['cents']
        assert sum(item['cents'] for item in county_totals.values()) + undetermined['cents'] == people['oregon']['cents']
        outside = sorted(((state, value) for state, value in states.items() if state not in ('OR', 'unknown')),
                         key=lambda pair: (-pair[1]['cents'], pair[0]))

        # Spending: cash payments only. Payables are not added to their payments.
        paid = sum(row['amount_cents'] for row in payments)
        purposes = defaultdict(lambda: {'cents': 0, 'records': 0})
        payees = {}
        to_individuals = {'cents': 0, 'records': 0}
        to_combined = {'cents': 0, 'records': 0}
        for row in payments:
            label = purpose_label(row['purpose_codes'])
            purposes[label]['cents'] += row['amount_cents']
            purposes[label]['records'] += 1
            if row['hidden']:
                to_combined['cents'] += row['amount_cents']
                to_combined['records'] += 1
                continue
            if row['book_type'] == 'Individual':
                to_individuals['cents'] += row['amount_cents']
                to_individuals['records'] += 1
                continue
            key = row['entity_name'].casefold()
            payee = payees.setdefault(key, {'name': row['entity_name'], 'bookType': row['book_type'], 'city': clean(row['city']).title(),
                                            'state': clean(row['state']).upper(), 'cents': 0, 'records': 0,
                                            'firstDate': row['transaction_date'], 'lastDate': row['transaction_date'],
                                            'purposes': defaultdict(int)})
            payee['cents'] += row['amount_cents']
            payee['records'] += 1
            payee['lastDate'] = max(payee['lastDate'], row['transaction_date'])
            payee['purposes'][label] += row['amount_cents']
        payee_rows = sorted(payees.values(), key=lambda p: (-p['cents'], p['name']))
        for payee in payee_rows:
            payee['mainPurpose'] = max(payee.pop('purposes').items(), key=lambda pair: (pair[1], pair[0]))[0]
        assert sum(p['cents'] for p in payee_rows) + to_individuals['cents'] + to_combined['cents'] == paid
        assert sum(item['cents'] for item in purposes.values()) == paid

        # Official balances and a like-for-like position on the last day both
        # committees have payments on file.
        official = accounts[cid]
        year = official['2026']
        flows = sum(row['cash_sign'] * row['amount_cents'] for row in rows if '2026-01-01' <= row['transaction_date'] <= common_day)
        position = int(year['beginning_cash_cents']) + flows
        account = {
            'year': 2026,
            'openingCash2025Cents': int(official['2025']['beginning_cash_cents']),
            'beginningCashCents': int(year['beginning_cash_cents']),
            'endingCashCents': int(year['ending_cash_cents']),
            'outstandingLoanCents': int(year['outstanding_loans_cents']),
            'retrievedAt': year['retrieved_at'][:10],
            'reconciliation': year['status'],
            'paymentDifferenceCents': int(year['payment_difference_cents']),
            'source': year['source'],
        }
        through = lambda items: sum(row['amount_cents'] for row in items if row['transaction_date'] <= common_day)
        after = lambda items: sum(row['amount_cents'] for row in items if row['transaction_date'] > common_day)
        like = {'asOf': common_day, 'raisedCents': through(cash), 'paidCents': through(payments), 'cashPositionCents': position,
                'raisedAfterCents': after(cash), 'paidAfterCents': after(payments)}

        since = candidate['governorCommitteeFrom']
        before = sum(row['amount_cents'] for row in cash if row['transaction_date'] < since)
        totals = {
            'cashCents': total, 'cashRecords': len(cash), 'namedCents': named, 'smallCents': small,
            'namedGroups': len(ordered), 'individualGroups': kinds['individual']['groups'],
            'inKindCents': sum(row['amount_cents'] for row in rows if row['basis'] == 'noncash_support'),
            'refundCents': sum(row['amount_cents'] for row in rows if row['basis'] == 'contribution_refund'),
            'paidCents': paid, 'paymentRecords': len(payments),
            'firstCashDate': cash[0]['transaction_date'], 'latestCashDate': cash[-1]['transaction_date'],
            'latestPaymentDate': latest_payment[cid],
            'latestFiledDate': max(row['filed_date'] for row in rows if row['filed_date']),
            'cashBeforeGovernorCommitteeCents': before if since > start else 0,
            'republicanGovernorsCents': sum(row['amount_cents'] for row in cash if 'REPUBLICAN GOVERNORS' in row['entity_name'].upper()),
            'topTenCents': sum(group['cents'] for group in ordered[:10]),
        }
        lags = sorted((date.fromisoformat(row['filed_date']) - date.fromisoformat(row['transaction_date'])).days
                      for row in payments if row['filed_date'] and row['transaction_date'] >= '2026-06-01')
        totals['medianPaymentFilingLagDays'] = lags[len(lags) // 2] if lags else None

        base.update({
            'totals': totals,
            'kinds': [kinds[key] for key, _label in KINDS],
            'reportedTypes': [{'label': label, **value} for label, value in sorted(reported.items(), key=lambda pair: -pair[1]['cents'])],
            'bands': [bands[key] for key, *_rest in BANDS],
            'topSources': [{k: g[k] for k in ('id', 'name', 'bookType', 'kind', 'city', 'state', 'cents', 'records', 'firstDate', 'lastDate')} for g in ordered[:15]],
            'overCap': over,
            'weekly': [weekly[week] for week in weeks],
            'peaks': peaks,
            'monthly': [monthly[month] for month in months],
            'geography': {
                'oregonCents': oregon, 'oregonRecords': states['OR']['records'],
                'outsideCents': sum(value['cents'] for _state, value in outside),
                'outsideRecords': sum(value['records'] for _state, value in outside),
                'unknownCents': states['unknown']['cents'], 'unknownRecords': states['unknown']['records'],
                'states': [{'state': state, **value} for state, value in outside[:8]],
                'individuals': people,
                'counties': list(county_totals.values()),
                'countyUndetermined': undetermined,
            },
            'spending': {
                'purposes': [{'label': label, **value} for label, value in sorted(purposes.items(), key=lambda pair: (-pair[1]['cents'], pair[0]))],
                'payees': [{k: p[k] for k in ('name', 'bookType', 'city', 'state', 'cents', 'records', 'firstDate', 'lastDate', 'mainPurpose')} for p in payee_rows[:12]],
                'toIndividuals': to_individuals, 'toCombined': to_combined,
            },
            'account': account,
            'likeForLike': like,
        })
        output_candidates.append(base)

        for group in ordered:
            evidence_rows['source-groups'].append({'snapshot': manifest['snapshot'], 'committee_id': cid, 'candidate': candidate['name'],
                'entity_id': group['id'], 'reported_name': group['name'], 'reported_type': group['bookType'], 'display_group': group['kind'],
                'city': group['city'], 'state': group['state'], 'gross_cents': group['cents'], 'contribution_records': group['records'],
                'first_date': group['firstDate'], 'last_date': group['lastDate']})
        evidence_rows['source-groups'].append({'snapshot': manifest['snapshot'], 'committee_id': cid, 'candidate': candidate['name'],
            'entity_id': '', 'reported_name': 'Miscellaneous Cash Contributions $100 and under (combined entries)', 'reported_type': 'Unspecified',
            'display_group': 'small', 'city': '', 'state': '', 'gross_cents': small, 'contribution_records': kinds['small']['records'],
            'first_date': '', 'last_date': ''})
        for item in weekly.values():
            evidence_rows['weekly'].append({'snapshot': manifest['snapshot'], 'committee_id': cid, 'candidate': candidate['name'],
                'week_start': item['week'], 'cash_contribution_cents': item['cents'], 'contribution_records': item['records']})
        for item in monthly.values():
            evidence_rows['monthly'].append({'snapshot': manifest['snapshot'], 'committee_id': cid, 'candidate': candidate['name'],
                'month': item['month'], 'cash_contribution_cents': item['cashCents'], 'cash_payment_cents': item['paymentCents']})
        for state, value in sorted(states.items(), key=lambda pair: -pair[1]['cents']):
            evidence_rows['states'].append({'snapshot': manifest['snapshot'], 'committee_id': cid, 'candidate': candidate['name'],
                'reported_state': state, 'named_cash_cents': value['cents'], 'contribution_records': value['records']})
        for item in list(county_totals.values()) + [{'county': 'Oregon, county not determined', **undetermined}]:
            evidence_rows['oregon-counties'].append({'snapshot': manifest['snapshot'], 'committee_id': cid, 'candidate': candidate['name'],
                'county': item['county'], 'named_individual_cash_cents': item['cents'], 'contribution_records': item['records']})
        for label, value in sorted(purposes.items(), key=lambda pair: -pair[1]['cents']):
            evidence_rows['spending-purposes'].append({'snapshot': manifest['snapshot'], 'committee_id': cid, 'candidate': candidate['name'],
                'purpose_group': label, 'cash_payment_cents': value['cents'], 'payment_records': value['records']})
        for payee in payee_rows:
            evidence_rows['payees'].append({'snapshot': manifest['snapshot'], 'committee_id': cid, 'candidate': candidate['name'],
                'reported_payee': payee['name'], 'reported_type': payee['bookType'], 'city': payee['city'], 'state': payee['state'],
                'cash_payment_cents': payee['cents'], 'payment_records': payee['records'], 'first_date': payee['firstDate'],
                'last_date': payee['lastDate'], 'largest_purpose_group': payee['mainPurpose']})

    # Sources that appear in both committees under the same conservative record group.
    first, second = (c['committeeId'] for c in linked)
    both = []
    for entity in sorted(set(group_index[first]) & set(group_index[second])):
        a, b = group_index[first][entity], group_index[second][entity]
        both.append({'id': entity, 'name': a['name'], 'bookType': a['bookType'], 'cents': {first: a['cents'], second: b['cents']}})
    both.sort(key=lambda row: (-(row['cents'][first] + row['cents'][second]), row['name']))
    for row in both:
        evidence_rows['both-candidates'].append({'snapshot': manifest['snapshot'], 'entity_id': row['id'], 'reported_name': row['name'],
            'reported_type': row['bookType'], f'committee_{first}_cents': row['cents'][first], f'committee_{second}_cents': row['cents'][second]})

    # One step up the money trail for Oregon committees that gave $50,000 or more.
    upstream = []
    minimum = review['sourceKinds']['minimumCents']
    for cid in (first, second):
        for group in sorted(group_index[cid].values(), key=lambda g: -g['cents']):
            if not group['id'].startswith('committee:') or group['cents'] < minimum:
                continue
            donor = group['id'].split(':', 1)[1]
            receipts = con.execute("SELECT entity_name,book_type,is_disclosure_category OR identity_status='unknown',sum(amount_cents)::BIGINT,count(*) "
                                   "FROM transactions WHERE committee_id=? AND basis='cash_contribution' GROUP BY entity_id,entity_name,book_type,3 "
                                   "ORDER BY 4 DESC,1", [donor]).fetchall()
            total = sum(row[3] for row in receipts)
            combined = sum(row[3] for row in receipts if row[2])
            named = [row for row in receipts if not row[2]]
            # Name a funder only when it is an organization supplying at least 5% of receipts.
            top = [{'name': clean(row[0]), 'bookType': row[1], 'cents': row[3]} for row in named
                   if row[1] != 'Individual' and row[3] * 20 >= total][:2]
            upstream.append({'committeeId': donor, 'name': group['name'], 'gaveTo': cid, 'gaveCents': group['cents'],
                             'receiptsCents': total, 'combinedSmallCents': combined, 'namedSources': len(named), 'topNamed': top})
            evidence_rows['committee-funders'].append({'snapshot': manifest['snapshot'], 'donor_committee_id': donor, 'donor_committee': group['name'],
                'gave_to_committee_id': cid, 'gave_cents': group['cents'], 'own_cash_receipts_cents': total,
                'combined_small_gift_cents': combined, 'named_source_groups': len(named),
                'largest_organization_source': top[0]['name'] if top else '',
                'largest_organization_source_cents': top[0]['cents'] if top else 0})

    ten = review['context']['tenMillion']
    record = con.execute("SELECT entity_name,amount_cents,transaction_date FROM transactions WHERE committee_id=? AND basis='cash_contribution' "
                         "AND transaction_date=? ORDER BY amount_cents DESC LIMIT 1", [ten['committeeId'], ten['date']]).fetchone()
    assert record and record[1] == 1_000_000_000, record
    con.close()

    # Reviewed independent-expenditure allocations whose reported target is a linked committee.
    independent = []
    targets = {c['committeeId']: c['name'] for c in linked}
    with (out_root / 'public/data/campaign-finance/independent-allocations.csv').open(newline='') as stream:
        for row in csv.DictReader(stream):
            if row['target_label'].strip() in targets:
                independent.append({'transactionId': row['transaction_id'], 'date': row['transaction_date'], 'spender': row['committee_name'],
                                    'position': row['position'], 'target': targets[row['target_label'].strip()],
                                    'cents': int(row['allocated_cents']), 'basis': row['basis'], 'source': row['source']})
    spending_scope = json.loads((out_root / 'src/lib/campaign-finance/independent-spending.json').read_text())

    public = out_root / 'public/data/campaign-finance/governor'
    public.mkdir(parents=True, exist_ok=True)
    evidence = {}
    for name, rows in sorted(evidence_rows.items()):
        if not rows:
            raise ValueError('Refusing empty evidence: ' + name)
        path = public / f'{name}.csv'
        with path.open('w', newline='') as stream:
            writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
            writer.writeheader()
            for row in rows:
                writer.writerow({key: safe(value) for key, value in row.items()})
        evidence[name] = {'url': f'{EVIDENCE_URL}{name}.csv', 'sha256': sha(path), 'rows': len(rows)}

    result = {
        'version': VERSION,
        'snapshot': manifest['snapshot'], 'start': start, 'end': end,
        'completenessVerified': bool(manifest.get('completeness_verified')),
        'databaseSha256': manifest['database_sha256'],
        'reviewedAt': review['reviewedAt'], 'raceId': review['raceId'], 'election': review['election'],
        'commonPaymentDate': common_day,
        'candidates': output_candidates,
        'both': both,
        'upstream': upstream,
        'independent': {'allocations': independent, 'searchedRecords': spending_scope['searched_records'],
                        'parsedRecords': spending_scope['parsed_records'], 'gapRecords': spending_scope['gap_records']},
        'events': review['events'],
        'context': {
            **review['context'],
            'tenMillion': {**ten, 'reportedSource': clean(record[0]), 'cents': record[1]},
            'sourceKindNote': review['sourceKinds']['note'],
            'sourceKindMinimumCents': minimum,
            'reviewedSources': [{'id': key, **value} for key, value in reviewed.items()],
        },
        'evidence': evidence,
    }
    serialized = json.dumps(result, ensure_ascii=False, separators=(',', ':')) + '\n'
    for path in (out_root / 'src/lib/campaign-finance/governor-data.json', public / 'data.json'):
        temp = path.with_suffix(path.suffix + '.tmp')
        temp.write_text(serialized)
        temp.replace(path)
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--data-root', type=Path, default=OUT_ROOT)
    parser.add_argument('--output', type=Path, default=OUT_ROOT)
    args = parser.parse_args()
    published = run(args.data_root.resolve(), args.output.resolve())
    print(json.dumps({
        'snapshot': published['snapshot'], 'commonPaymentDate': published['commonPaymentDate'],
        'candidates': [{'name': c['name'], 'cashCents': c.get('totals', {}).get('cashCents')} for c in published['candidates']],
        'both': len(published['both']), 'upstream': len(published['upstream']),
        'evidence': {key: value['rows'] for key, value in published['evidence'].items()},
    }, indent=2))
