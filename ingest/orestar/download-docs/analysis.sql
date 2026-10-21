-- Run from the extracted archive directory. No network connection is required.
CREATE OR REPLACE VIEW transactions AS SELECT * FROM read_parquet('tables/transactions.parquet');
CREATE OR REPLACE VIEW committees AS SELECT * FROM read_parquet('tables/committees.parquet');
CREATE OR REPLACE VIEW entities AS SELECT * FROM read_parquet('tables/entities.parquet');
CREATE OR REPLACE VIEW aliases AS SELECT * FROM read_parquet('tables/aliases.parquet');
CREATE OR REPLACE VIEW reviewed_matching_ids AS SELECT * FROM read_parquet('tables/reviewed_matching_ids.parquet');
CREATE OR REPLACE VIEW candidate_finance_facts AS SELECT * FROM read_parquet('tables/candidate_finance_facts.parquet');
CREATE OR REPLACE VIEW cash_by_committee AS
SELECT committee_id, max(committee_name) AS committee_name, count(*) AS gift_records,
       sum(amount_cents)::BIGINT AS cash_cents,
       coalesce(sum(amount_cents) FILTER (WHERE transaction_id IN (SELECT transaction_id FROM reviewed_matching_ids)), 0)::BIGINT AS matching_cents
FROM transactions WHERE basis = 'cash_contribution' GROUP BY committee_id;
CREATE OR REPLACE VIEW individual_gifts AS
SELECT * FROM transactions WHERE basis = 'cash_contribution' AND amount_cents > 0
  AND book_type = 'Individual' AND NOT is_disclosure_category AND identity_status <> 'unknown'
  AND NOT starts_with(entity_id, 'committee:')
  AND transaction_id NOT IN (SELECT transaction_id FROM reviewed_matching_ids);
CREATE OR REPLACE VIEW individual_gift_statistics AS
WITH frequencies AS (
  SELECT committee_id, amount_cents, count(*) AS n FROM individual_gifts GROUP BY committee_id, amount_cents
), ranked AS (
  SELECT *, max(n) OVER (PARTITION BY committee_id) AS highest FROM frequencies
), modes AS (
  SELECT committee_id, list(amount_cents ORDER BY amount_cents) FILTER (WHERE n = highest AND highest > 1) AS modes_cents
  FROM ranked GROUP BY committee_id
)
SELECT g.committee_id, count(*) AS gift_records, sum(g.amount_cents)::BIGINT AS cash_cents,
       avg(g.amount_cents) AS mean_cents, median(g.amount_cents) AS median_cents,
       quantile_cont(g.amount_cents, 0.25) AS q1_cents, quantile_cont(g.amount_cents, 0.75) AS q3_cents,
       min(g.amount_cents) AS min_cents, max(g.amount_cents) AS max_cents, any_value(m.modes_cents) AS modes_cents
FROM individual_gifts g JOIN modes m USING (committee_id) GROUP BY g.committee_id;
