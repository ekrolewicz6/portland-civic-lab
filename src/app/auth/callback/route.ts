import { handleAuth } from "@workos-inc/authkit-nextjs";
import { upsertMemberFromWorkOS } from "@/lib/membership";

/**
 * WorkOS AuthKit callback. After a successful sign-in we mirror the WorkOS
 * user into the local `members` table so the rest of the app can attach
 * roles, interests, and participation to it.
 */
export const GET = handleAuth({
  returnPathname: "/member",
  onSuccess: async ({ user }) => {
    try {
      await upsertMemberFromWorkOS(user);
    } catch (error) {
      // A failed mirror shouldn't block sign-in; the member row is
      // re-upserted on the next sign-in.
      console.error("[auth/callback] member upsert failed:", error);
    }
  },
});
