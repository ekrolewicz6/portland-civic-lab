import { NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { getMemberByWorkOSId, isWorkOSConfigured } from "@/lib/membership";
import { toHeaderMember } from "@/lib/member-nav";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isWorkOSConfigured()) {
    return NextResponse.json({ signedIn: false, member: null });
  }

  try {
    const { user } = await withAuth();
    if (!user) return NextResponse.json({ signedIn: false, member: null });

    const member = await getMemberByWorkOSId(user.id).catch(() => null);
    return NextResponse.json({
      signedIn: true,
      member: toHeaderMember(user, member),
    });
  } catch {
    return NextResponse.json({ signedIn: false, member: null });
  }
}

