import "server-only";

/**
 * WorkOS Sessions API helpers ("sign out everywhere").
 *
 * Revoking a session is enforced reactively: an app still holding a valid
 * access token notices at its next refresh, so propagation takes up to the
 * access-token lifetime (WorkOS default: 5 minutes).
 */

const WORKOS_API = "https://api.workos.com";

interface WorkOSSession {
  id: string;
}

/** Revoke every active WorkOS session for a user. Returns the revoked count. */
export async function revokeAllSessions(workosUserId: string): Promise<number> {
  const apiKey = process.env.WORKOS_API_KEY;
  if (!apiKey) return 0;

  const listRes = await fetch(
    `${WORKOS_API}/user_management/users/${encodeURIComponent(workosUserId)}/sessions`,
    { headers: { Authorization: `Bearer ${apiKey}` }, cache: "no-store" },
  );
  if (!listRes.ok) return 0;

  const payload = (await listRes.json()) as { data?: WorkOSSession[] };
  const sessions = payload.data ?? [];

  let revoked = 0;
  for (const session of sessions) {
    const res = await fetch(`${WORKOS_API}/user_management/sessions/revoke`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: session.id }),
    });
    if (res.ok) revoked += 1;
  }
  return revoked;
}
