import { NextResponse, type NextRequest } from "next/server";
import { handleAuth } from "@workos-inc/authkit-nextjs";
import { isWorkOSConfigured, upsertMemberFromWorkOS } from "@/lib/membership";
import { notifyIntake } from "@/lib/intake-notifications";

/**
 * WorkOS AuthKit callback. After a successful sign-in we mirror the WorkOS
 * user into the local `members` table so the rest of the app can attach
 * roles, interests, and participation to it. A first-time insert enqueues a
 * registration notification (drizzle/0016); we try to deliver it right away
 * and the retry cron covers anything that fails. Returning members have no
 * pending row, so the call is a no-op for them.
 */
const authHandler = handleAuth({
  returnPathname: "/member",
  onSuccess: async ({ user }) => {
    try {
      const member = await upsertMemberFromWorkOS(user);
      await notifyIntake("members", String(member.id));
    } catch (error) {
      // A failed mirror shouldn't block sign-in; the member row is
      // re-upserted on the next sign-in.
      console.error("[auth/callback] member upsert failed:", error);
    }
  },
});

export async function GET(request: NextRequest) {
  if (!isWorkOSConfigured()) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // A visit without an authorization code (a bookmark, a crawler, a stale
  // tab) is not an error worth a 500. Start the sign-in over instead.
  if (!request.nextUrl.searchParams.get("code")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return authHandler(request);
}
