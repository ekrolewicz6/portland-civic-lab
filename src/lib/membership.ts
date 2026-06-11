import sql from "@/lib/db-query";

/**
 * Membership layer on top of WorkOS AuthKit.
 *
 * WorkOS owns identity (sign-in, sessions, email verification); the local
 * `members` table owns everything the Civic Lab knows about a member beyond
 * identity: role, status, neighborhood, interests, participation.
 */

/** Whether WorkOS AuthKit is configured in this environment. */
export function isWorkOSConfigured(): boolean {
  return Boolean(
    process.env.WORKOS_API_KEY &&
      process.env.WORKOS_CLIENT_ID &&
      process.env.WORKOS_COOKIE_PASSWORD
  );
}

interface WorkOSUserLike {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
}

export interface Member {
  id: number;
  workos_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: string;
  status: string;
  neighborhood: string | null;
  interests: string[] | null;
  joined_at: string;
}

/** Emails granted the admin role on sign-in (comma-separated env var). */
function isAdminEmail(email: string): boolean {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}

/**
 * Create or refresh the local member row after a successful WorkOS sign-in.
 * Idempotent: keyed on the WorkOS user id. Role is re-derived from
 * ADMIN_EMAILS on every sign-in, so adding the env var later promotes the
 * account at its next sign-in (and removal demotes it).
 */
export async function upsertMemberFromWorkOS(user: WorkOSUserLike): Promise<void> {
  const role = isAdminEmail(user.email) ? "admin" : "member";
  await sql`
    INSERT INTO members (workos_user_id, email, first_name, last_name, avatar_url, role)
    VALUES (
      ${user.id},
      ${user.email},
      ${user.firstName ?? null},
      ${user.lastName ?? null},
      ${user.profilePictureUrl ?? null},
      ${role}
    )
    ON CONFLICT (workos_user_id) DO UPDATE SET
      email = EXCLUDED.email,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      avatar_url = EXCLUDED.avatar_url,
      role = EXCLUDED.role,
      last_seen_at = now()
  `;
}

/** Look up the local member row for a WorkOS user id. */
export async function getMemberByWorkOSId(workosUserId: string): Promise<Member | null> {
  const rows = (await sql`
    SELECT * FROM members WHERE workos_user_id = ${workosUserId} LIMIT 1
  `) as unknown as Member[];
  return rows[0] ?? null;
}
