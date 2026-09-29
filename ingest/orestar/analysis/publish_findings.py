"""Versioned findings, competing explanations and a portable research manuscript."""
import json
from common import *

def run():
    s=json.loads((WORK/'summary.json').read_text())
    e=json.loads((RESEARCH/'enrichment.json').read_text())
    r=json.loads((RESEARCH/'robustness.json').read_text())
    q=json.loads((RESEARCH/'questions.json').read_text())
    cash=sum(x['amount_cents'] for x in s['bases'] if x['basis']=='cash_contribution')
    dollars=lambda n:f'${n/100:,.2f}'
    pct=lambda n,d:f'{n/d:.1%}'
    findings=[]
    def finding(id,questions,title,answer,denominator,evidence,method,why,limits,counter,source_ids=None):
        findings.append({'id':id,'questionIds':questions,'title':title,'answer':answer,
            'population':'Fixed ORESTAR current-version snapshot; any narrower population is specified in the denominator.',
            'dates':{'start':START,'end':END},'snapshot':SNAPSHOT,'denominator':denominator,
            'calculation':method,'evidence':evidence,'sourceTransactionIds':source_ids or [],
            'whyItMatters':why,'uncertainty':limits,'competingExplanations':counter,
            'reviewStatus':'calculation-checked; working-edition editorial review pending',
            'notCausal':True})
    finding('F001',['Q001','Q002'],'Reported resources are not one additive pot',
        f"Cash contributions total {dollars(cash)}; cash payments total {dollars(sum(x['amount_cents'] for x in s['bases'] if x['basis']=='cash_payment'))}. Loans, in-kind support, refunds and obligations remain separate.",
        'All current rows in each explicitly defined financial basis; 316,926 rows overall.', ['financial-bases.csv'],
        'Sum exact integer-cent Amount within each subtype/basis; never add Aggregate Amount.',
        'This prevents circulation, debt and later settlement from masquerading as new purchasing power.',
        'Not outside-money totals, complete cycles, bank balances or an audit of whether filings are accurate.',
        'A large expenditure can be a transfer, reimbursement or pass-through rather than a vendor earning.')
    top3=s['top_committees'][:3];amount=sum(x['cash_contributions_cents'] for x in top3)
    finding('F002',['Q005'],'The three largest recipients span different political roles',
        f"Friends of Tina Kotek, Friends of Christine Drazan and Building a Stronger Oregon report {dollars(amount)} combined cash contributions ({pct(amount,cash)} of reported cash). A single September 16, 2026 Carpenters contribution to Building a Stronger Oregon is $10 million.",
        f'All reported cash contributions: {cash} cents.', ['committees.csv','largest-cash-records.csv','enrichment.json'],
        'Order committee-own cash receipts; sum first three. Named committee type/candidate associations reviewed against official profiles.',
        'Magnitude is concentrated, but a PAC is not equivalent to a candidate campaign in a same-race comparison.',
        'No conclusion about ultimate spending, obligations to a contributor or purchased influence.',
        'Election stage, incumbent committees, PAC roles and pre-period resources make a pooled ranking an imperfect comparison.', ['5816290'])
    base=r['concentrationScenarios'][0];without=r['concentrationScenarios'][1];aggressive=r['concentrationScenarios'][2]
    finding('F003',['Q005','Q007'],'Concentration survives several accounting and identity scenarios',
        f"Visible-source Gini is {base['gini']:.3f}; removing the largest group leaves {without['gini']:.3f}. Aggressive same-name/type grouping yields {aggressive['gini']:.3f}. Top-ten visible-source share is {base['top10_share']:.1%}, falling to {without['top10_share']:.1%} after removing the largest group.",
        f"{base['groups']:,} positive visible source groups; {dollars(base['total_cents'])}. Includes committee sources; excludes disclosure/unknown groups.",
        ['donor-record-groups.csv','concentration-sensitivity.csv'], 'Gini, HHI, effective groups and top shares over positive cumulative group amounts. Separate committee-source exclusion and individual-only scenarios.',
        'Unevenness is not solely an artifact of the single largest visible source, although its influence is substantial.',
        'Fingerprints are provisional. Sensitivity grouping is intentionally aggressive and is not an identity decision. Hidden activity remains unallocated.',
        'Public funding and committee transfers differ from private individual giving, so the source population changes the substantive interpretation.')
    gifts=s['gift_sizes'];small=gifts[:2];big=gifts[-1];n=sum(x['records'] for x in gifts);v=sum(x['amount_cents'] for x in gifts)
    finding('F004',['Q008'],'Most small transactions supply a small share of visible dollars',
        f"Transactions of $100 or less are {pct(sum(x['records'] for x in small),n)} of nonaggregate cash rows but {pct(sum(x['amount_cents'] for x in small),v)} of their dollars. Transactions over $1,000 are {pct(big['records'],n)} of these rows and {pct(big['amount_cents'],v)} of their dollars.",
        f'{n:,} cash-contribution rows after excluding aggregate categories; {v} cents.', ['gift-sizes.csv','donor-committee.csv'],
        'Mutually exclusive transaction-size bands; compare record share and dollar share. Cumulative source totals are separate.',
        'Transaction volume and financial weight tell different stories; neither counts unique people.',
        'Small gifts are not necessarily small cumulative donors. Prior unitemized giving is not recoverable.',
        'Recurring giving raises the count of small transactions without increasing the number of identified sources.')
    finding('F005',['Q038'],'Disclosure categories count money but cannot count people',
        '32,258 contribution-family rows total $12,084,155.64 under miscellaneous or anonymous labels.',
        'All 217,239 contribution-family records, across contribution subtypes; not solely cash.', ['disclosure.csv'],
        'Explicit label rules create committee-scoped disclosure buckets, excluded from identity graphs.',
        'Treating the same aggregate label as a donor would fabricate ties across unrelated committees.',
        'No full distinct-person count or cross-campaign donor attribution is identifiable for those amounts.',
        'Aggregate reporting can be normal under disclosure rules; visibility gaps are not automatically violations.')
    t=r['transferScenario']
    finding('F006',['Q020','Q021'],'The strict transfer count is deliberately conservative',
        f"{s['transfers']['strict_pairs']:,} strict same-day pairs total {dollars(t['strict_same_day_cents'])}. A maximum one-to-one reconciliation within seven-day candidates can match {dollars(t['maximum_candidate_matching_cents'])} across {t['maximum_candidate_pairs']:,} pairs.",
        'Cash receipt/payment pairs with reciprocal authoritative committee IDs, equal positive cents and dates within seven days.',
        ['matched-transfers.csv','ambiguous-transfers.csv','robustness.json'],t['method'],
        'Internal circulation is sensitive to matching rules; neither side of a paired transfer is a new external dollar.',t['limitation'],
        'An ordinary $1,208,352.82 nurses’ PAC payment and next-day receipt fail the strict same-day test without implying misconduct.', ['5305330','5309856'])
    geography='; '.join(x['geography']+': '+dollars(x['amount_cents'])+' ('+pct(x['amount_cents'],cash)+')' for x in s['geography'])
    finding('F007',['Q014'],'Reported location is not district residency',geography,
        f'All cash-contribution cents including unknown-state rows: {cash}.', ['geography.csv','cities.csv'],
        'Reported State equals OR, another code, or blank. Unknown remains in denominator.',
        'An outside-Oregon comparison is available now; a neighborhood-representation claim needs boundaries and population denominators.',
        'No geocoded legal residence or district membership; aggregate records concentrate in unknown locations.',
        'Employer/business mailing locations can differ from residence, and committees can have statewide constituencies.')
    finding('F008',['Q028'],'Portland’s two funding records overlap and differ',
        f"The City reports {dollars(e['cityMatchingDistributedCents'])} distributed to 13 certified candidates. Reviewed matching receipts in the fixed snapshot total {dollars(e['snapshotMatchingReportedCents'])}; the difference is {dollars(e['cityMatchingDistributedCents']-e['snapshotMatchingReportedCents'])}.",
        'Thirteen certified 2026 Portland program candidates, linked to authoritative ORESTAR committees; source observations retrieved September 27.',
        ['portland-public-financing.csv','public-matching-receipts.csv','committee-race-crosswalk.json'],
        'Compare City cumulative amount with classified ORESTAR receipts by reviewed committee. Do not combine the two sources.',
        'Public matching must be distinguished from private giving before comparing campaign dependency or breadth.',
        'Aggregate reconciliation only, not City payment-level matching. The unclassified remainder is not verified private money.',
        'Reporting timing, late filings, amendments and differing source coverage can explain differences. No allegation is made.')
    finding('F009',['Q004','Q034'],'Balances require a starting point and an explicit reconciliation',
        f"Among {e['coverage']['account_years']} retrieved committee-year summaries, {e['accountAgreement']['agrees']} agree with snapshot cash contributions, payments and net change; {e['accountAgreement']['differences']} retain discrepancies.",
        f"Targeted {e['coverage']['profiles']} of 1,888 filers, not a representative sample.", ['account-summaries.csv','enrichment.json'],
        'Check official opening + official net = closing, adjacent-year roll-forward, and source-basis ledger reconciliation.',
        'Reported flows alone cannot establish reserves, outstanding debt or runway.',
        'Official summaries are live observations, not independently audited bank statements. Statewide coverage remains incomplete.',
        'Different retrieval times, future-dated records or amendments can create disagreement with an immutable snapshot.')
    september=next(x for x in s['monthly'] if x['month']=='2026-09' and x['basis']=='cash_contribution')
    august=next(x for x in s['monthly'] if x['month']=='2026-08' and x['basis']=='cash_contribution')
    largest=1_000_000_000
    finding('F010',['Q030','Q005'],'One reported gift changes the September story',
        f"September 1–27 reports {dollars(september['amount_cents'])} in cash contributions. Transaction 5816290—the $10 million Carpenters contribution to Building a Stronger Oregon—is {pct(largest,september['amount_cents'])} of that total. Excluding that one record leaves {dollars(september['amount_cents']-largest)}, versus {dollars(august['amount_cents'])} in the full month of August.",
        f"All September 1–27 cash-contribution rows: {september['records']:,}; denominator {september['amount_cents']} cents.",
        ['monthly.csv','largest-cash-records.csv'],
        'Single-record influence analysis: subtract the specified transaction from the September sum, retaining every other row and the same accounting basis.',
        'An aggregate fundraising surge can reflect a single institutional funding event rather than a broad-based increase in participation.',
        'September is incomplete, reporting can arrive later, and the comparison is not seasonally adjusted. No claim about acceleration, spending, donor intent or electoral effect.',
        'Other campaigns can accelerate even when an aggregate comparison is dominated by one receipt. Gross receipts still include committee transfers.',
        ['5816290'])
    current=lambda id:next(x for x in e['profiles'][id]['accountSummaries'] if x['year']==2026)
    kotek,drazan=current('4792'),current('19050')
    ratio=kotek['ending_cash_cents']/drazan['ending_cash_cents']
    finding('F011',['Q004','Q034'],'Similar 2026 fundraising masks sharply different reported cash positions',
        f"Kotek’s committee reports {dollars(kotek['official_cash_contributions_cents'])} in 2026 cash contributions and Drazan’s {dollars(drazan['official_cash_contributions_cents'])}. Their retrieved official summaries report closing cash of {dollars(kotek['ending_cash_cents'])} and {dollars(drazan['ending_cash_cents'])}, respectively—a {ratio:.2f}-to-one ratio.",
        'Two authoritative committees, 4792 and 19050; official 2026 account summaries retrieved September 27. A selected comparison, not a ranking of all candidates.',
        ['account-summaries.csv','enrichment.json'],
        'Reconcile official opening cash + official net change = closing cash. Compare same-year contribution and payment bases; do not infer balances from receipts alone.',
        f"Kotek started 2026 with {dollars(kotek['beginning_cash_cents'])} and reports {dollars(kotek['official_cash_payments_cents'])} in cash expenditures. Drazan started with {dollars(drazan['beginning_cash_cents'])} and reports {dollars(drazan['official_cash_payments_cents'])}. Both starting resources and spending distinguish their positions.",
        f"These are reported—not bank-verified—balances. Drazan’s official cash payments exceed the fixed snapshot by {dollars(drazan['payment_difference_cents'])}; that unresolved difference is retained. Cash balances do not measure unpaid commitments, campaign quality or election probability.",
        'Earlier spending may already have purchased advertising, organization or other useful capacity. A lower balance is not itself a weaker campaign or proof of poor management.')
    programme=e['portlandPublicFinancing']
    matching=sum(x['orestar_reported_matching_cents'] for x in programme)
    receipts=sum(x['orestar_cash_contributions_cents'] for x in programme)
    assert all(x['classified_public_share']>0.5 for x in programme)
    finding('F012',['Q028','Q006'],'Public matching is the majority of reported cash for all 13 linked certified candidates',
        f"Classified matching-fund receipts supply {pct(matching,receipts)} of the combined {dollars(receipts)} in cash contributions reported by the 13 linked Portland certified candidates. Every one of the 13 is above half; individual shares range from {min(x['classified_public_share'] for x in programme):.1%} to {max(x['classified_public_share'] for x in programme):.1%}.",
        f"These 13 committees’ cash contributions across January 1, 2025–September 27, 2026: {receipts} cents. Reviewed matching receipt numerator: {matching} cents.",
        ['portland-public-financing.csv','public-matching-receipts.csv','committee-race-crosswalk.json'],
        'Sum reviewed public matching receipt classifications and divide by the same committees’ reported cash contributions. Do not add City distribution totals to committee receipts.',
        'In this group, a gross fundraising ranking is substantially a public-financing ranking. It cannot be read as a ranking of private fundraising alone.',
        'Not all Portland candidates, not a causal comparison of participants with nonparticipants, and not an exact City disbursement-level match. Unclassified receipts are not certified private money.',
        'The City and fixed ORESTAR observations differ in timing and coverage. Public matching may reflect qualifying participation, but these totals alone do not establish broader or more representative donor support.')
    # Lead with substantive contrasts, retaining all accounting and counterevidence.
    order=['F010','F011','F012']
    findings.sort(key=lambda f:(order.index(f['id']) if f['id'] in order else len(order),f['id']))
    ledger={'version':'findings-v2','snapshot':SNAPSHOT,'status':'working-edition; broader research programme incomplete','findings':findings}
    for path in [RESEARCH/'findings.json',PUBLIC/'findings.json',ROOT/'src/lib/campaign-finance/findings.json']:write_json(path,ledger)
    lines=['# Oregon campaign finance: who funds it, how money moves, and what the record can establish','',
        'Working local research edition · January 1, 2025–September 27, 2026','',
        '**Review status:** Functional report/explorer and reproducible descriptive findings. The full research programme is not complete. Independent-spending allocation, statewide enrichment, certified-outcome joins, neighborhood denominators and governing-record investigations require further work. No deployment or historical backfill has begun.','',
        'The snapshot contains 316,926 current transactions from 1,888 filers. November–December 2024 is missing. Recent activity is provisional; federal fundraising is outside these ORESTAR totals.','']
    for f in findings:
        lines.extend(['## '+f['title'],'',f['answer'],'', '**Why it matters.** '+f['whyItMatters'],'',
            '**Compared with what.** '+f['denominator'],'','**Method.** '+f['calculation'],'',
            '**What we cannot conclude.** '+f['uncertainty'],'','**Counterexplanation / counterexample.** '+f['competingExplanations'],'',
            'Evidence: '+', '.join('['+x+'](../../public/data/campaign-finance/'+x+')' for x in f['evidence'])+'.',''])
    lines.extend(['## Research question catalogue','',f"{q['counts']['answered']} answered, {q['counts']['qualified']} qualified, {q['counts']['currently unanswerable']} currently unanswerable in this edition. An acquisition gap is not proof the underlying question can never be answered.",''])
    for row in q['questions']:
        lines.extend(['### '+row['id']+' · '+row['question'],'',row['status']+'. '+row['answer'],'','Method: '+row['method'],'','Limitation: '+row['limitation'],''])
    (RESEARCH/'REPORT.md').write_text('\n'.join(lines))
    print(str(len(findings))+' structured findings and portable manuscript written')

if __name__=='__main__':run()
