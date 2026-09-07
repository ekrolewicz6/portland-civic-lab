# Deployment checklist

What has to be set, and what happens if it is not. Everything here was
verified by running the app with the variable unset and the migration
unapplied, not by reading the code.

The short version: **nothing in this list will take the site down.** Every
missing piece degrades to a specific feature being unavailable, with a clear
message. The list exists so you know which feature you are losing.

## 1. Apply three migrations

`drizzle/0011_business_claim_guard.sql`, `0012_pcb_applications.sql`,
`0013_donations.sql`.

```bash
npx tsx --env-file=.env.local ingest/apply-migration.ts drizzle/0011_business_claim_guard.sql
npx tsx --env-file=.env.local ingest/apply-migration.ts drizzle/0012_pcb_applications.sql
npx tsx --env-file=.env.local ingest/apply-migration.ts drizzle/0013_donations.sql
```

Order does not matter, and neither does whether they run before or after the
deploy — the code tolerates their absence:

| Missing | Effect |
|---|---|
| 0011 (`businesses.claim_email`) | The "is this your business?" card does not appear on `/member`, and nobody is offered a claim button. The page renders normally. Fails closed: no unauthorized claim can slip through. |
| 0012 (`pcb_applications`) | `/apply` submissions return 503 with "we could not record your application". Nothing is silently dropped. |
| 0013 (`donations`) | The Stripe webhook returns 500, so Stripe retries with backoff for ~3 days. Apply the migration inside that window and the queued events land. Payments still complete — only our record of them waits. |

## 2. Environment variables

### Required in production

| Variable | Without it |
|---|---|
| `DATABASE_URL` | Every dashboard reports "data unavailable". Pages render; no numbers. There is no default — a wrong database is worse than none. |
| `CRON_SECRET` | Every `/api/cron/*` route returns 401 and no data syncs. Fails closed by design. |
| `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`, `WORKOS_COOKIE_PASSWORD` | Sign-in is off; `/member` and `/admin` redirect to the sign-in explainer. |
| `NEXT_PUBLIC_APP_URL` | Donations return 503. The Stripe return URL would otherwise be built from the `Host` header, which a proxy can forward from the client, so we refuse rather than send a donor to an attacker's origin after paying. Set it to `https://www.portlandciviclab.org`. |

### Required for the features that use them

| Variable | Powers | Without it |
|---|---|---|
| `STRIPE_SECRET_KEY` | `/donate` | Checkout returns 503 with a clear message. |
| `STRIPE_WEBHOOK_SECRET` | Donation records | **New.** The webhook returns 503 and refuses every request — an unverified webhook endpoint is an open write API. Get it from the Stripe dashboard when you add the endpoint (`/api/donate/webhook`, events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, `invoice.payment_failed`). Until it is set, donations still complete in Stripe; only our own record of them is missing. |
| `ANTHROPIC_API_KEY` | `/concierge` | Answers with a canned "demo mode" notice. |
| `AIRNOW_API_KEY` | Air quality sync | `sync-aqi` returns 500 and the AQI panel stays empty. |
| `RESEND_API_KEY` **or** `SMTP_*` | Contact form, invites | Submissions fall back to the database or a local file; nothing is lost, but no mail is sent. |
| `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Contact form delivery | Same fallback as above. |
| `ADMIN_EMAILS` | Admin bootstrap | Nobody is granted admin on sign-in. Existing admins in the `members` table keep their role. |
| `CIVICLAB_INTERNAL_APP_SECRETS` | Cross-app account resolution | `/api/internal/accounts/resolve` returns 401 to every caller. |
| `PERFORMANCE_API_TOKEN` | Performance sync API | Falls back to `CRON_SECRET`. Set its own value so one secret does not authorize both the scheduler and a JSON API. |

### Optional

| Variable | Default |
|---|---|
| `ANTHROPIC_MODEL` | Current Sonnet generation. Set only to try another. |
| `BUSINESS_CLAIM_EMAILS` | Unset. Leave it that way — with 0011 applied, claiming is scoped per business by `claim_email`, which is the safer mechanism. This allowlist lets an address claim *any* unclaimed business. |
| `CONTACT_DATABASE_FALLBACK`, `CONTACT_STORE_FALLBACK`, `CONTACT_FALLBACK_DIR` | Contact-form storage fallbacks. |

### Ingest scripts only

`PORTLAND_MAPS_API_KEY` (**new** — required, no default; the previous default
was a key read out of the City's own public JavaScript), `CENSUS_API_KEY`,
`BEA_API_KEY`, `HUD_API_TOKEN`, `PBJ_INPUT_DIR`, `PERMIT_DETAIL_CONCURRENT`,
`PERMIT_DETAIL_DELAY_MS`. None affect the running site.

## 3. After deploying

Set a Stripe webhook endpoint if you want donation records, then confirm:

```bash
curl -s https://www.portlandciviclab.org/api/dashboard/safety | jq '{dataStatus, dataThrough, generatedAt}'
```

`dataThrough` is the newest period in the data; `generatedAt` is when the
response was computed. If they are far apart, a sync is behind — that is the
point of reporting them separately.
