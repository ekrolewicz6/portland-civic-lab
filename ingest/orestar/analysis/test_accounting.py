import unittest
import json
import duckdb
from common import *

class AccountingTests(unittest.TestCase):
    def test_exact_cents(self):
        self.assertEqual(cents('$1,234.56'),123456)
        self.assertEqual(cents('(42.31)'),-4231)
        with self.assertRaises(ValueError):cents('0.001')
        with self.assertRaises(ValueError):cents('NaN')
    def test_payable_then_payment_is_one_cash_outflow(self):
        rows=[('Account Payable',10000),('Cash Expenditure',10000)]
        self.assertEqual(sum(SEMANTICS[t][2]*a for t,a in rows),-10000)
    def test_obligation_cancellation_and_forgiveness_are_not_cash(self):
        for t in ['Account Payable Rescinded','In-Kind/Forgiven Account Payable','In-Kind/Forgiven Personal Expenditures','Loan Forgiven (Non-Exempt)','Personal Expenditure Balance Adjustment']:
            self.assertEqual(SEMANTICS[t][2],0)
    def test_refund_and_lost_check_direction(self):
        self.assertEqual(SEMANTICS['Return or Refund of Contribution'][2],-1)
        self.assertEqual(SEMANTICS['Lost or Returned Check'][2],1)
    def test_financing_separate_from_fundraising(self):
        self.assertEqual(SEMANTICS['Loan Received (Non-Exempt)'][0],'loan_received')
        self.assertEqual(SEMANTICS['Loan Payment (Exempt)'][2],-1)
        self.assertNotEqual(SEMANTICS['Loan Payment (Non-Exempt)'][0],'cash_payment')
    def row(self,**updates):
        r={k:'' for k in ['Contributor/Payee','Contributor/Payee Committee ID','Filer Id','Tran Id','Book Type','Addr Line1','Addr Line2','City','State','Zip','Country']}
        r.update({'Contributor/Payee':'Alex Smith','Filer Id':'1','Tran Id':'10','Book Type':'Individual'});r.update(updates);return r
    def test_aggregate_labels_never_bridge_committees(self):
        a=self.row(**{'Contributor/Payee':'Miscellaneous Cash Contributions $100 and under'})
        b={**a,'Filer Id':'2'}
        self.assertNotEqual(identity(a)[0],identity(b)[0]);self.assertEqual(identity(a)[1],'disclosure_category')
    def test_aggregate_before_malformed_id(self):
        r=self.row(**{'Contributor/Payee':'Anonymous Contribution','Contributor/Payee Committee ID':'55'})
        self.assertEqual(identity(r)[1],'disclosure_category')
    def test_same_name_different_address_not_merged(self):
        self.assertNotEqual(identity(self.row(**{'Addr Line1':'1 Main'}))[0],identity(self.row(**{'Addr Line1':'2 Main'}))[0])
    def test_blank_counterparties_not_merged(self):
        self.assertNotEqual(identity(self.row(**{'Contributor/Payee':''}))[0],identity(self.row(**{'Contributor/Payee':'','Tran Id':'11'}))[0])
    def test_committee_id_authoritative_across_name_changes(self):
        a=self.row(**{'Contributor/Payee Committee ID':'7'});b={**a,'Contributor/Payee':'Changed Name'}
        self.assertEqual(identity(a),identity(b))
    def test_concentration(self):
        self.assertEqual(concentration([100,100])['gini'],0)
        self.assertEqual(concentration([100,100])['hhi'],0.5)
        self.assertEqual(concentration([100])['effective_groups'],1)
        self.assertIsNone(concentration([])['gini'])
    def test_frozen_snapshot_invariants(self):
        m=json.loads((WORK/'manifest.json').read_text());c=duckdb.connect(str(ROOT/m['database']),read_only=True)
        self.assertEqual(c.execute('SELECT count(*),count(DISTINCT transaction_id),count(DISTINCT committee_id) FROM transactions').fetchone(),(316926,316926,1888))
        self.assertEqual(c.execute("SELECT count(*) FROM transactions WHERE is_disclosure_category AND NOT starts_with(entity_id,'disclosure:'||committee_id||':')").fetchone()[0],0)
        self.assertEqual(c.execute("SELECT count(*),sum(amount_cents) FROM transactions WHERE family='Contribution' AND is_disclosure_category").fetchone(),(32258,1208415564))
        self.assertEqual(c.execute("SELECT count(*) FROM transfers WHERE match_status='strict_unique_same_day' AND day_gap<>0").fetchone()[0],0)
        self.assertEqual(c.execute("SELECT count(*)-count(DISTINCT receipt_id),count(*)-count(DISTINCT payment_id) FROM transfers WHERE match_status='strict_unique_same_day'").fetchone(),(0,0))
        c.close()

if __name__=='__main__':unittest.main(verbosity=2)
