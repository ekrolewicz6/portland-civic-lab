/**
 * Shared auth check for /api/cron/* routes.
 *
 * Fail-secure: if CRON_SECRET is not configured, every request is rejected.
 * (Previously these routes were wide open whenever the secret was unset,
 * which let anyone trigger expensive syncs or tamper with data.)
 *
 * Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically when
 * the CRON_SECRET environment variable is set on the project.
 */
export function isAuthorizedCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error(
      "[cron-auth] CRON_SECRET is not set — rejecting request. Configure it in the environment to enable cron routes."
    );
    return false;
  }
  return request.headers.get("authorization") === `Bearer ${secret}`;
}
