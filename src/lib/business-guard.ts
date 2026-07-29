import "server-only";

import { redirect } from "next/navigation";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { getMemberByWorkOSId } from "@/lib/membership";
import { getBusinessBySlug, isBusinessMember } from "@/lib/business";

/**
 * Gate for business pages: the signed-in member must be on the business's
 * team. Mirrors requireAdmin() in src/lib/admin.ts — redirects rather than
 * throwing, so an unauthorized member lands back on their own member page
 * instead of seeing another business's funding pipeline.
 */
export async function requireBusinessAccess(slug: string) {
  const { user } = await withAuth({ ensureSignedIn: true });
  const member = await getMemberByWorkOSId(user.id);
  if (!member || member.status !== "active") redirect("/member");

  const business = await getBusinessBySlug(slug);
  if (!business) redirect("/member");

  if (!(await isBusinessMember(business.id, member.id))) redirect("/member");

  return { user, member, business };
}
