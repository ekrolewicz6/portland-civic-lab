# Intake email delivery

Every main-site intake is persisted first. Database triggers atomically create a private `intake_notifications` record; the route attempts to send immediately. A provider outage does not discard the submission or ask the sender to resubmit an already-saved message.

## Coverage

| Intake | Path | Record |
| --- | --- | --- |
| All 13 contact topics, including volunteer, partnership, paid work, project-prefilled and Oregon Fire contribution links | `/contact` → `/api/contact` | `contact_submissions` |
| Dashboard data corrections | `/api/data-flags` | `data_flags` |
| Signed-in member topic proposals | `/api/proposals` | `topic_proposals` |
| Legacy application intake (the public application page currently redirects to `/business`) | `/api/pcb/apply` | `pcb_applications` |

The Parks Atlas correction tool prepares a `mailto:` message to the editor; its UI explicitly states that it has not submitted anything. Such messages are sent by the visitor's email client, not Resend. Survey answers, votes, searches, and member account edits are not contact submissions.

## Configuration and deployment

- `DATABASE_URL`: required for deployed intake.
- `CONTACT_TO_EMAIL`: private destination inbox, never selected by the visitor.
- `CONTACT_FROM_EMAIL`: verified sender, also used by business invitations.
- `RESEND_API_KEY`: Resend credential. SMTP remains an alternative when no Resend credential is configured.
- `CRON_SECRET`: required for the retry endpoint; Vercel supplies its bearer header.
- Apply `drizzle/0012_pcb_applications.sql` and then `drizzle/0015_intake_notifications.sql` **before deploying this code**. CI applies migrations to its own database.

`/api/cron/retry-notifications` runs every five minutes, with a bounded batch and time budget. It returns 401 without authorization and 503 while notifications are pending or need review. It never returns message bodies or recipient addresses.

The queue has RLS enabled and no public policies. Access it with the trusted server database connection only.

## Receipts and retries

`sent` means accepted by the provider. `provider_id` is the Resend email ID or SMTP message ID; `accepted_at` is the acceptance timestamp. This does not prove Inbox placement. For Resend, retrieve that ID to check `last_event`; check the recipient mailbox when Inbox placement matters.

Retries reuse the stored request and `intake/<notification UUID>` idempotency key. Concurrent workers use an atomic claim with a two-minute lease; expired leases are recoverable. After 23 hours from the first send attempt, automatic resending stops (`failed`) because Resend's 24-hour deduplication window is about to expire. Inspect the provider before manually resending such a notification. General SMTP servers do not provide Resend API idempotency guarantees.

To inspect failures without exposing submission bodies:

```sql
select source, source_id, status, attempts, provider, provider_id,
       created_at, accepted_at, next_attempt_at, last_error
from intake_notifications
where status <> 'sent'
order by created_at;
```

If a provider accepted a notification but receipt persistence failed, retry it within the idempotency window. Do not create a new queue record or idempotency key for the same submission. Never reset an old `failed` row without checking provider history first.

## Verification

- `npm run test:notifications`: real Postgres-compatible in-memory database, real SQL triggers and API handlers, mocked email transport. Covers every contact topic, other intake routes, atomic rollback, missing configuration, provider failure/retry, concurrent attempts, stable requests, honeypot/validation, cron authorization and expired idempotency windows.
- `npx playwright test e2e/contact-form.spec.ts`: desktop/mobile form behavior, including interrupted connections and honest acknowledgement of queued notifications. Browser transport is mocked; these tests do not email real people.
- For a live smoke check, submit a clearly marked test through `/contact`, verify the original and queue rows, retrieve the provider receipt, then check the owner's mailbox. Do not email previous submitters or create public proposals for a notification test.

## September 14, 2026 audit

The original public form successfully delivered a marked test to the configured owner's Gmail Inbox. Resend had one earlier accepted/delivered notification from September 6. The database contained 12 older database-only contacts, including two explicitly labeled validation tests. These records predated the email configuration; the old delivery ladder used database storage instead of notification delivery, rather than retaining both.

Dashboard corrections and topic proposals had no email step. The legacy application endpoint also lacked notification delivery, and its storage migration had not been applied. This change covers all four persisted intake sources and preserves provider receipts for future audits.
