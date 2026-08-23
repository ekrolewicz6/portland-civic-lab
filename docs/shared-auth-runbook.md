# Shared Auth Across Civic Lab Apps — Runbook

Goal: sign in once, be signed in everywhere.

- `www` / `council` / `parks` / `ask` (`*.portlandciviclab.org`): **one shared
  session cookie** — zero redirects, instant.
- `portlandpermits.org` (different domain — cookies cannot cross): **same
  WorkOS environment, second Application**, signed in via a silent WorkOS
  redirect, auto-triggered by an `sso=1` hint on links from our sites.
- Every app resolves the visitor to one canonical account via
  `POST portlandciviclab.org/api/internal/accounts/resolve` — no duplicate
  accounts, ever.

## What is already done (main site, this repo)

- `members.account_public_id` (opaque UUID) + `account_identities` table —
  migrated and backfilled (20 members).
- `resolveMemberFromWorkOS()`: race-safe upsert keyed on the WorkOS user id,
  with verified-email relinking for consolidated identities
  ([membership.ts](../src/lib/membership.ts)).
- `POST /api/internal/accounts/resolve` — HMAC-authenticated (per-app secrets
  in `CIVICLAB_INTERNAL_APP_SECRETS`), never browser-callable, returns only
  `{accountPublicId, status, platformRole}`.
- "Sign out everywhere" on `/member` — revokes all WorkOS sessions (other
  apps notice within ~5 minutes, the access-token lifetime) then clears the
  local session.
- Permits links site-wide carry `?sso=1` when the visitor is signed in
  ([SsoLink.tsx](../src/components/SsoLink.tsx)).
- Production env (verified by audit): `WORKOS_COOKIE_DOMAIN=.portlandciviclab.org`,
  callback `https://www.portlandciviclab.org/auth/callback`. Cookie password
  is 32 chars.

## Audit findings (2026-08-21, via `vercel env pull`)

| Project | Client ID | Cookie domain | Callback |
|---|---|---|---|
| portland-dashboard | `client_01KTT5E9SMG…` | `.portlandciviclab.org` ✅ | ✅ correct |
| council-os | *(sensitive — unreadable)* | **unset** | ✅ `council.portlandciviclab.org/auth/callback` |
| portland-permits | `client_01KHWHTQ377…` (different) | unset (fine — separate domain) | ❌ **stale**: `portland-civic-labs.vercel.app/callback` |

## Step 1 — WorkOS dashboard checks (you; ~10 minutes)

1. **Council**: confirm which environment + client `council-os` uses
   (its env vars are marked sensitive, so check the WorkOS dashboard and the
   Vercel project settings side by side).
   - If it uses the **same client ID as main**: proceed to Step 2 — shared
     cookie will just work.
   - If it uses a **different Application, same environment**: switch council
     to main's client ID + API key (shared cookie requires the same client).
   - If it uses a **different WorkOS environment**: its users are a separate
     pool. Plan a consolidation: council resolves each user against
     `/api/internal/accounts/resolve` (verified email links them via
     `account_identities`), then switch council to main's environment and
     client.
2. **Permits**: in main's WorkOS environment, create a second Application
   "Portland Permits" (Applications → Create). Set redirect URI to
   `https://www.portlandpermits.org/callback` (or the app's actual callback
   route) and the logout URI. Note its client ID.
3. **Empirical silent-SSO test** (10 min, do once): sign into the main site,
   then hit the AuthKit sign-in URL for the Permits Application in the same
   browser. Expected: redirected back signed in, no password prompt. WorkOS
   docs imply this; they don't explicitly promise it — this test is the
   proof. If it re-prompts, the `sso=1` flow still works but shows the
   AuthKit page once per session; acceptable, not silent.

## Step 2 — Council env (after Step 1 confirms same client)

```
# in the council-os repo/project
vercel env add WORKOS_COOKIE_DOMAIN production   # value: .portlandciviclab.org
# WORKOS_COOKIE_PASSWORD must EQUAL main's (same value, not same length)
# WORKOS_CLIENT_ID / WORKOS_API_KEY must EQUAL main's
```

Code requirements in council-os:
- `@workos-inc/authkit-nextjs` pinned to the same version as main
  (both apps unseal the same cookie; version skew is the failure mode).
- On login callback, call the resolve API (snippet below) and store
  `accountPublicId` alongside its local user reference.
- Redeploy. Test: sign in on www → open council → already signed in, no hop.

## Step 3 — Permits app changes (portland-permits repo)

1. Upgrade `@workos-inc/authkit-nextjs` (plan flagged it as outdated).
2. Point env at the new Application: `WORKOS_CLIENT_ID` (from Step 1.2),
   main environment's `WORKOS_API_KEY`, correct
   `NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://www.portlandpermits.org/...` —
   this also fixes the stale-callback bug.
3. **`sso=1` handler** (middleware or landing layout):

```ts
// If a visitor arrives from a Civic Lab site already signed in there,
// silently establish a session here. Strip the param either way.
const url = request.nextUrl;
if (url.searchParams.get("sso") === "1") {
  url.searchParams.delete("sso");
  const { user } = await withAuth();
  if (!user) {
    const signIn = await getSignInUrl({ returnPathname: url.pathname + url.search });
    return NextResponse.redirect(signIn);
  }
  return NextResponse.redirect(url); // clean the param
}
```

4. **Resolve call** on login callback:

```ts
import { createHmac } from "node:crypto";

async function resolveAccount(user: { id: string; email: string; emailVerified?: boolean }) {
  const body = JSON.stringify({
    workosUserId: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
  });
  const ts = String(Math.floor(Date.now() / 1000));
  const app = "permits"; // or "council"
  const sig = createHmac("sha256", process.env.CIVICLAB_RESOLVE_SECRET!)
    .update(`${app}.${ts}.${body}`)
    .digest("hex");
  const res = await fetch("https://www.portlandciviclab.org/api/internal/accounts/resolve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-civiclab-app": app,
      "x-civiclab-timestamp": ts,
      "x-civiclab-signature": sig,
    },
    body,
  });
  return res.ok ? res.json() : null; // { accountPublicId, status, platformRole }
}
```

## Step 4 — Secrets

Generate one secret per app and set them:

```
# generate
openssl rand -hex 32   # once per app

# main site (this project)
vercel env add CIVICLAB_INTERNAL_APP_SECRETS production
# value: {"council":"<hex>","permits":"<hex>"}

# each app gets only its own:
# council-os:        CIVICLAB_RESOLVE_SECRET=<council hex>
# portland-permits:  CIVICLAB_RESOLVE_SECRET=<permits hex>
```

## Step 5 — Acceptance checks

- [ ] Sign in on www → open council.portlandciviclab.org: signed in, zero redirects.
- [ ] Sign in on www → click any Permits link: lands signed in (one invisible redirect).
- [ ] Anonymous visitor on Permits: never bounced through WorkOS.
- [ ] Sign in on council first, then www: same account (check `account_identities` gained no duplicate member).
- [ ] "Sign out everywhere" on /member: council session dies immediately (shared cookie cleared); Permits within ~5 min.
- [ ] Resolve API: request with bad signature or >5-min-old timestamp → 401.
- [ ] No sequential member id appears in any cross-app payload.

## Deferred (deliberately)

- Central `/account` hub page, per-app activity summaries (pull-on-demand
  later, not push), residency-receipt service, Parks/Ask auth — per the
  adopted middle-path plan.
- Revisit cookie isolation only if: a subdomain hosts third-party or
  user-generated content, an app gains outside operators, or wildcard DNS /
  stale subdomains appear. Until then shared-cookie is the right UX call.
