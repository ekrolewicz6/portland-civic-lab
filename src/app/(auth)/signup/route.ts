import { NextResponse, type NextRequest } from "next/server";
import { getSignUpUrl } from "@workos-inc/authkit-nextjs";
import { isWorkOSConfigured } from "@/lib/membership";

/**
 * Sign-up doorway. Route handler rather than a page because AuthKit's
 * getSignUpUrl() writes a PKCE verifier cookie (see login/route.ts).
 */
export async function GET(request: NextRequest) {
  if (!isWorkOSConfigured()) {
    return NextResponse.redirect(new URL("/membership", request.url));
  }
  return NextResponse.redirect(await getSignUpUrl());
}
