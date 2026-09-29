"""Independent evidence checks; stdlib only; run with unittest."""
import csv,json,unittest
from collections import defaultdict
from datetime import date,timedelta
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
P=ROOT/'research/campaign-finance/investigation/portland'
def read(n):
    with (P/(n+'.csv')).open() as f: return list(csv.DictReader(f))
class PortlandEvidenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tx=read('transactions');cls.cash=[r for r in cls.tx if r['basis']=='cash_contribution']
        with (ROOT/'public/data/campaign-finance/public-matching-receipts.csv').open() as f:
            cls.match={r['transaction_id'] for r in csv.DictReader(f)}
        cls.nm=[r for r in cls.cash if r['transaction_id'] not in cls.match]
        cls.metrics=read('candidate-report-metrics')
    def test_source_scope(self):
        self.assertEqual(len(self.tx),6700);self.assertEqual(len({r['transaction_id'] for r in self.tx}),6700)
        self.assertTrue(all('2025-01-01'<=r['transaction_date']<='2026-09-27' for r in self.tx))
        self.assertEqual(len(self.cash),3940)
        self.assertEqual(sum(int(r['amount_cents']) for r in self.cash),207120805)
    def test_financial_components(self):
        for r in self.metrics:
            self.assertEqual(int(r['cash_cents']),sum(int(r[k]) for k in ['public_cents','unidentified_cents','visible_individual_cents','other_visible_nonmatching_cents']))
            self.assertEqual(r['official_reconciliation'],'agrees')
        self.assertEqual(sum(int(r['public_cents']) for r in self.metrics),136371300)
        self.assertEqual(sum(int(r['unidentified_cents']) for r in self.metrics),34525101)
    def test_ledger_is_complete_and_excludes_categories(self):
        valid={r['transaction_id']:r for r in self.nm if r['is_disclosure_category']=='False' and r['identity_status']!='unknown'}
        seen=[]
        for r in read('donor-candidate-complete-ledger'):
            ids=r['contribution_transaction_ids'].split('|');seen.extend(ids)
            self.assertEqual(len(ids),int(r['contribution_records']))
            self.assertEqual(sum(int(valid[i]['amount_cents']) for i in ids),int(r['gross_cents']))
            self.assertEqual(len({valid[i]['transaction_date'] for i in ids}),int(r['distinct_reported_dates']))
            self.assertTrue(all(valid[i]['entity_id']==r['entity_id'] and valid[i]['committee_id']==r['committee_id'] for i in ids))
        self.assertEqual(set(seen),set(valid));self.assertEqual(len(seen),len(set(seen)))
    def test_portfolio_frequency(self):
        rows=[r for r in read('donor-portfolios-complete') if r['book_type']=='Individual']
        self.assertEqual(len(rows),1117);self.assertEqual(sum(int(r['candidate_count'])>1 for r in rows),131)
        self.assertEqual(sum(r['repeat_records_same_candidate']=='True' for r in rows),172)
        self.assertEqual(sum(r['repeat_dates_same_candidate']=='True' for r in rows),148)
        r=next(r for r in rows if r['reported_name']=='Christopher Schweizer')
        self.assertEqual((r['gross_cents'],r['observed_refund_cents'],r['gross_less_observed_refunds_cents']),('69600','5600','64000'))
    def test_all_event_windows(self):
        end=date(2026,9,27)
        for r in read('event-windows'):
            dt=date.fromisoformat(r['event_date']);n=int(r['window_days']);c=r['committee_id']
            a=sum(int(x['amount_cents']) for x in self.nm if x['committee_id']==c and dt-timedelta(days=n)<=date.fromisoformat(x['transaction_date'])<dt)
            b=sum(int(x['amount_cents']) for x in self.nm if x['committee_id']==c and dt<date.fromisoformat(x['transaction_date'])<=min(dt+timedelta(days=n),end))
            self.assertEqual((a,b),(int(r['pre_cents']),int(r['post_cents'])))
            if r['full_post_window']=='False':self.assertEqual(r['difference_cents'],'');self.assertEqual(r['ratio'],'')
    def test_september_headline(self):
        expected={'23295':(174000,919000),'17629':(651000,1082500),'23365':(171066,849148)}
        for c,v in expected.items():
            r=next(r for r in read('event-windows') if r['event_date']=='2026-09-13' and r['committee_id']==c and r['window_days']=='7')
            self.assertEqual((int(r['pre_cents']),int(r['post_cents'])),v)
    def test_torres_batch(self):
        rows=[r for r in self.nm if r['committee_id']=='24897' and r['transaction_date']=='2026-08-09']
        self.assertEqual(len(rows),54);self.assertEqual(sum(int(r['amount_cents']) for r in rows),1933500)
        self.assertEqual(sum(int(r['amount_cents'])==35000 for r in rows),47)
        self.assertEqual(sum(int(r['amount_cents']) for r in self.cash if r['committee_id']=='24897' and r['transaction_date']=='2026-08-04' and r['transaction_id'] in self.match),7200000)
    def test_every_peak(self):
        wk=read('candidate-weeks')
        self.assertEqual(len(wk),17*91)
        for r in self.metrics:
            v=[x for x in wk if x['committee_id']==r['committee_id'] and x['week_start']>='2026-01-01']
            best=sorted(v,key=lambda x:(-int(x['nonmatching_cents']),x['week_start']))[0]
            self.assertEqual((best['week_start'],best['nonmatching_cents']),(r['best_2026_nonmatching_week'],r['best_week_cents']))
    def test_network_population(self):
        pairs=read('donor-overlap-tests');self.assertEqual(len(pairs),136)
        sets=defaultdict(set)
        for r in self.nm:
            if r['book_type']=='Individual' and r['is_disclosure_category']=='False' and r['identity_status']!='unknown':sets[r['committee_id']].add(r['entity_id'])
        for r in pairs:
            a,b=r['committee_a'],r['committee_b'];self.assertEqual(len(sets[a]&sets[b]),int(r['shared']))
            self.assertEqual(r['null_draws'],'2997');self.assertTrue(0<float(r['permutation_p'])<=float(r['bh_q'])<=1)
        self.assertEqual(sum(float(r['bh_q'])<.05 for r in pairs),6)
        r=next(r for r in pairs if {r['committee_a'],r['committee_b']}=={'24897','17629'})
        self.assertEqual((r['shared'],r['same_name_sensitivity_shared']),('5','43'))
    def test_shared_pair_dollars(self):
        overlaps=read('donor-overlap-tests')
        pairs=read('shared-donor-pair-amounts')
        self.assertEqual(len(pairs),len(overlaps))
        ledger=defaultdict(dict)
        for row in read('donor-candidate-complete-ledger'):
            if row['book_type']=='Individual':
                ledger[row['entity_id']][row['committee_id']]=row
        by_pair={frozenset((r['committee_a'],r['committee_b'])):r for r in pairs}
        self.assertEqual(len(by_pair),136)
        for overlap in overlaps:
            a,b=overlap['committee_a'],overlap['committee_b']
            row=by_pair[frozenset((a,b))]
            shared={eid for eid,recipients in ledger.items() if a in recipients and b in recipients}
            self.assertEqual(int(row['shared_groups']),len(shared))
            self.assertEqual(int(row['shared_groups']),int(overlap['shared']))
            self.assertEqual(set(row['shared_entity_ids'].split('|')) if row['shared_entity_ids'] else set(),shared)
            gross_a=sum(int(ledger[eid][a]['gross_cents']) for eid in shared)
            gross_b=sum(int(ledger[eid][b]['gross_cents']) for eid in shared)
            refunds=sum(int(ledger[eid][cid]['observed_refund_cents']) for eid in shared for cid in (a,b))
            self.assertEqual((int(row['gross_to_a_cents']),int(row['gross_to_b_cents']),int(row['pair_gross_cents']),int(row['observed_refunds_cents']),int(row['gross_less_observed_refunds_cents'])),(gross_a,gross_b,gross_a+gross_b,refunds,gross_a+gross_b-refunds))
        headline=by_pair[frozenset(('23208','23365'))]
        self.assertEqual((headline['shared_groups'],headline['pair_gross_cents']),('41','2130637'))
    def test_export_avoids_street_addresses(self):
        for name in ['transactions','donor-candidate-complete-ledger','donor-portfolios-complete']:
            fields=list(read(name)[0]);self.assertFalse(any('address' in f.lower() or 'street' in f.lower() for f in fields))
    def test_manifest_digests(self):
        import hashlib
        for obj in json.loads((P/'report-data.json').read_text())['tables']:
            self.assertEqual(hashlib.sha256((P/obj['file']).read_bytes()).hexdigest(),obj['sha256'])
        for name,obj in json.loads((P/'analysis.json').read_text())['tables'].items():
            self.assertEqual(hashlib.sha256((P/(name+'.csv')).read_bytes()).hexdigest(),obj['sha256'])
if __name__=='__main__':unittest.main()
