"""Rebuild transaction-derived candidate facts inside a staged active DuckDB.

Reviewed race links and City matching payor groups are inputs, not inferred
from names. Official balances, addresses, endorsements and editorial findings
are deliberately not recalculated from a transaction export.
"""
from __future__ import annotations

import csv
import json
from collections import defaultdict
from datetime import date, timedelta

from common import ROOT

LABELS = {
    'public': 'City matching funds (reviewed payor)',
    'unidentified': 'Unidentified / aggregate reporting',
    'individual': 'Itemized individuals',
    'committee': 'Political committees',
    'business': 'Business entities',
    'labor': 'Labor organizations',
    'self_family': 'Candidate and immediate family',
    'other': 'Other identified source types',
}
BOOK_TYPES = {'Individual': 'individual', 'Political Committee': 'committee',
              'Business Entity': 'business', 'Labor Organization': 'labor',
              'Candidate & Immediate Family': 'self_family'}
STATES = set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY AS GU MP PR VI'.split())


def matching_payors():
    with (ROOT / 'public/data/campaign-finance/public-matching-receipts.csv').open(newline='') as source:
        rows = list(csv.DictReader(source))
    return {row['transaction_id'] for row in rows}, {(row['committee_id'], row['entity_id']) for row in rows}


def build(con, snapshot: str, start: str, end: str) -> None:
    links = [row for row in json.loads((ROOT / 'research/campaign-finance/committee-race-crosswalk.json').read_text())['links'] if row['status'] == 'reviewed']
    ids = sorted({row['committeeId'] for row in links})
    known_ids, known_pairs = matching_payors()
    sql = 'SELECT transaction_id,committee_id,committee_name,transaction_date,filed_date,basis,amount_cents,entity_id,entity_name,identity_status,is_disclosure_category,book_type,city,state FROM transactions WHERE committee_id IN (' + ','.join('?' for _ in ids) + ') ORDER BY transaction_date,transaction_id'
    cur = con.execute(sql, ids)
    columns = [col[0] for col in cur.description]
    groups = defaultdict(list)
    for record in cur.fetchall():
        row = dict(zip(columns, record))
        groups[row['committee_id']].append(row)
    con.execute('CREATE TABLE candidate_finance_facts(committee_id VARCHAR PRIMARY KEY, facts_json JSON)')
    con.execute('CREATE TABLE reviewed_matching_ids(transaction_id VARCHAR PRIMARY KEY)')
    matching_rows = []
    for cid in ids:
        rr = groups[cid]
        for row in rr:
            if row['basis'] != 'cash_contribution':
                continue
            if row['transaction_id'] in known_ids or (cid, row['entity_id']) in known_pairs:
                matching_rows.append((row['transaction_id'],))
            elif any(word in row['entity_name'].upper() for word in ('SMALL DONOR ELECTION', 'CITY OF PORTLAND', 'OPEN AND ACCOUNTABLE ELECTION')):
                raise ValueError(f"Possible unmatched City receipt {row['transaction_id']}; review before publishing")
    con.executemany('INSERT INTO reviewed_matching_ids VALUES (?)', matching_rows)
    matching_ids = {row[0] for row in matching_rows}
    for cid in ids:
        rr = groups[cid]
        cash = [row for row in rr if row['basis'] == 'cash_contribution']
        categories = {key: {'key': key, 'label': label, 'cents': 0, 'records': 0} for key, label in LABELS.items()}
        bases = defaultdict(lambda: {'cents': 0, 'records': 0})
        sources = defaultdict(list)
        weekly = defaultdict(int)
        geo = {key: {'key': key, 'label': label, 'cents': 0, 'records': 0} for key, label in [
            ('portland', 'Reported Portland, Oregon'), ('other_oregon', 'Other reported Oregon locations'),
            ('outside_oregon', 'Outside Oregon (reported state)'), ('unknown', 'Location unknown / aggregate')]}
        months = {}
        cursor = date.fromisoformat(start).replace(day=1)
        last_month = date.fromisoformat(end).replace(day=1)
        while cursor <= last_month:
            key = cursor.strftime('%Y-%m')
            months[key] = {'month': key, 'cashCents': 0, 'publicCents': 0,
                           'nonmatchingCents': 0, 'loanCents': 0, 'inKindCents': 0}
            cursor = (cursor.replace(day=28) + timedelta(days=4)).replace(day=1)
        for row in rr:
            amount = row['amount_cents']
            basis = row['basis']
            bases[basis]['cents'] += amount
            bases[basis]['records'] += 1
            month = months[row['transaction_date'][:7]]
            if basis == 'loan_received': month['loanCents'] += amount
            if basis == 'noncash_support': month['inKindCents'] += amount
            if basis != 'cash_contribution': continue
            public = row['transaction_id'] in matching_ids
            hidden = row['is_disclosure_category'] or row['identity_status'] == 'unknown'
            category = 'public' if public else 'unidentified' if hidden else BOOK_TYPES.get(row['book_type'], 'other')
            categories[category]['cents'] += amount
            categories[category]['records'] += 1
            month['cashCents'] += amount
            month['publicCents' if public else 'nonmatchingCents'] += amount
            if public: continue
            state = (row['state'] or '').strip().upper()
            city = (row['city'] or '').strip().upper()
            place = 'unknown' if hidden or state not in STATES or (state == 'OR' and not city) else 'portland' if state == 'OR' and city == 'PORTLAND' else 'other_oregon' if state == 'OR' else 'outside_oregon'
            geo[place]['cents'] += amount
            geo[place]['records'] += 1
            day = date.fromisoformat(row['transaction_date'])
            week = (day - timedelta(days=day.weekday())).isoformat()
            weekly[week] += amount
            if not hidden: sources[row['entity_id']].append(row)
        donors = []
        for entity_id, gifts in sources.items():
            donors.append({'id': entity_id, 'name': gifts[0]['entity_name'].strip(),
                           'bookType': gifts[0]['book_type'], 'identityStatus': gifts[0]['identity_status'],
                           'cents': sum(row['amount_cents'] for row in gifts), 'records': len(gifts),
                           'distinctDates': len({row['transaction_date'] for row in gifts}),
                           'firstDate': gifts[0]['transaction_date'], 'lastDate': gifts[-1]['transaction_date']})
        donors.sort(key=lambda row: (-row['cents'], row['name'], row['id']))
        individual = [row for row in donors if row['bookType'] == 'Individual']
        peak_weeks = sorted(((week, amount) for week, amount in weekly.items() if week >= '2026-01-01'), key=lambda item: (-item[1], item[0]))
        peak = None if not peak_weeks else {'start': peak_weeks[0][0], 'end': (date.fromisoformat(peak_weeks[0][0]) + timedelta(days=6)).isoformat(),
                                            'cents': peak_weeks[0][1], 'provisional': peak_weeks[0][0] > (date.fromisoformat(end) - timedelta(days=20)).isoformat()}
        cash_sum = sum(row['amount_cents'] for row in cash)
        public_sum = categories['public']['cents']
        nonmatching = cash_sum - public_sum
        assert sum(item['cents'] for item in categories.values()) == cash_sum
        assert sum(item['records'] for item in categories.values()) == len(cash)
        assert sum(item['cents'] for item in geo.values()) == nonmatching
        assert sum(item['cashCents'] for item in months.values()) == cash_sum
        assert sum(row['cents'] for row in donors) + categories['unidentified']['cents'] == nonmatching
        facts = {'committeeId': cid, 'committeeName': rr[-1]['committee_name'] if rr else None,
                 'observedRecords': len(rr), 'cashCents': cash_sum, 'cashRecords': len(cash),
                 'publicCents': public_sum, 'nonmatchingCents': nonmatching, 'sources': list(categories.values()),
                 'geography': list(geo.values()), 'bases': dict(bases), 'visibleIndividualGroups': len(individual),
                 'repeatIndividualGroups': sum(row['distinctDates'] > 1 for row in individual),
                 'visibleSourceGroups': len(donors), 'topSources': donors[:10], 'monthly': list(months.values()),
                 'peak2026': peak, 'latestCashDate': max((row['transaction_date'] for row in cash), default=None),
                 'account': None, 'evidenceUrl': f'/api/campaign-finance?committee={cid}&basis=cash_contribution&format=csv',
                 'evidenceSha256': ''}
        con.execute('INSERT INTO candidate_finance_facts VALUES (?, ?)', [cid, json.dumps(facts)])
    count = con.execute('SELECT count(*) FROM candidate_finance_facts').fetchone()[0]
    if count != len(ids): raise ValueError('Candidate facts table count mismatch')
