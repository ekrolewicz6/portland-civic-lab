import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

/**
 * Middleware gates the member area (/member, /admin) and provides optional
 * session context to participation APIs.
 *
 * middlewareAuth: matched routes require a session and the MIDDLEWARE
 * performs the AuthKit redirect. (Page-level withAuth({ ensureSignedIn })
 * can't redirect on Next 15 — it would write the PKCE cookie during render,
 * which Next forbids outside route handlers/server actions.)
 * Paths in unauthenticatedPaths still get session context when one exists,
 * but anonymous requests pass through — used by /api/data-flags so both
 * members and anonymous visitors can report data issues.
 */

const workosConfigured = Boolean(
  process.env.WORKOS_API_KEY &&
    process.env.WORKOS_CLIENT_ID &&
    process.env.WORKOS_COOKIE_PASSWORD
);

const authkit = workosConfigured
  ? authkitMiddleware({
      middlewareAuth: {
        enabled: true,
        unauthenticatedPaths: ["/api/data-flags", "/api/proposals", "/api/proposals/(.*)"],
      },
    })
  : null;

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  if (authkit) {
    return authkit(request, event);
  }

  // WorkOS not configured (forks/CI): APIs stay reachable anonymously,
  // member pages fail closed to the sign-in explainer.
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/member/:path*",
    "/admin/:path*",
    "/api/data-flags",
    "/api/proposals/:path*",
    "/api/proposals",
  ],
};
