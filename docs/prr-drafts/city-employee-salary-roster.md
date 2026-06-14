# Public Records Request — City of Portland Employee Salary Roster

**Status:** DRAFT — ready for Edan to review and submit
**To:** City of Portland public records (GovQA portal — select Bureau of Human Resources / Citywide)
GovQA portal: https://portlandor.govqa.us/WEBAPP/_rs/supporthome.aspx
(City rule ARA-8.03 bars phone/email requests — the portal is the only accepted channel.)
**Why this letter exists:** The City's public wage data is an aggregate, view-only Power BI
dashboard (portland.gov/bhr/open-data-analytics). A row-level, machine-readable roster — the
input the org chart needs to attach real pay to each position — is obtainable only by records
request. Under Oregon Public Records Law, public-employee names, job classifications, and pay
are disclosable.
**Tracked at:** https://www.portlandciviclab.org/records

---

Subject: Public records request — citywide employee salary/wage roster (machine-readable)

To the Records Custodian, City of Portland (Bureau of Human Resources):

Pursuant to the Oregon Public Records Law (ORS 192.311–192.478), I request a copy of the
following record:

A citywide roster of all City of Portland employees for the most recent complete fiscal year
(FY 2024–25, July 1, 2024 – June 30, 2025), with one row per employee and the following
columns where maintained:

1. Employee name;
2. Job classification / working title;
3. Bureau or office, and — if the City's HR system stores it — the service area the bureau
   sits within under the current (post-2025) organizational structure;
4. Regular/base gross pay;
5. Overtime pay;
6. Other earnings (premiums, differentials, cash-outs, etc.), itemized if your system
   distinguishes them;
7. FTE / employment status (full-time, part-time, limited-term, seasonal);
8. Bargaining unit / representation, if maintained.

I request this record in machine-readable electronic format — Excel (.xlsx) or CSV. I
understand this data underlies the City Employee Wage Report dashboard; the underlying tabular
extract, rather than a screenshot or PDF, is what I am requesting. A recurring export or a
pointer to a self-service data source would fully satisfy this request and minimize staff
burden.

I acknowledge that a narrow set of employees (e.g., undercover or safety-sensitive personnel)
may be exempt from name disclosure; for any such records, please withhold or anonymize only
the exempt field (name) and release all other columns, consistent with the City's past
practice of designating such individuals as "Employee 1, 2, …".

I am requesting this record on behalf of Portland Civic Lab, an independent, non-commercial
civic organization that publishes Portland public data freely at portlandciviclab.org.
Because disclosure will be published openly and primarily benefits the general public, I
respectfully request a fee waiver or reduction under ORS 192.324(5). If fees over $25 will
apply, please provide an itemized estimate before proceeding.

If any portion of this request is denied, please cite the specific exemption claimed and
release all reasonably segregable non-exempt portions.

Thank you — I'm happy to clarify or narrow this request; the goal is the most useful data with
the least burden on your staff.

[Name]
Portland Civic Lab
[email]

---

## After filing

- Add the request to the public tracker at `/records` (table: `records_requests`).
- The City has 5 business days to acknowledge and must respond "as soon as practicable and
  without unreasonable delay" (ORS 192.329).
- When the roster arrives, it becomes the input for the org chart's **v3 individual-pay layer**
  (load into `hr.employee_pay` per the build plan in `docs/org-chart-plan.md`).
- Repeat annually after each fiscal year closes (data refreshes ~Q1 of the following FY).
