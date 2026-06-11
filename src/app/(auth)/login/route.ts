import { NextResponse, type NextRequest } from "next/server";
import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import { isWorkOSConfigured } from "@/lib/membership";

/**
 * Sign-in doorway. This must be a route handler, not a page: AuthKit's
 * getSignInUrl() writes a PKCE verifier cookie, and Next.js only allows
 * cookie writes in route handlers and server actions.
 */
export async function GET(request: NextRequest) {
  if (!isWorkOSConfigured()) {
    return NextResponse.redirect(new URL("/membership", request.url));
  }
  return NextResponse.redirect(await getSignInUrl());
}
