import "server-only";

import { redirect } from "next/navigation";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { getMemberByWorkOSId } from "@/lib/membership";

export async function requireAdmin() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const member = await getMemberByWorkOSId(user.id);

  if (member?.role !== "admin" || member.status !== "active") {
    redirect("/member");
  }

  return { user, member };
}
