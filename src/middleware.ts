import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

/**
 * Middleware gates the member area (/member, /admin).
 *
 * When WorkOS AuthKit is configured, it manages sessions on those routes and
 * pages enforce sign-in via `withAuth({ ensureSignedIn: true })`. When it
 * isn't configured (e.g. a fork without keys), the routes fail closed and
 * redirect to /login, which explains that sign-in isn't open yet.
 */

const workosConfigured = Boolean(
  process.env.WORKOS_API_KEY &&
    process.env.WORKOS_CLIENT_ID &&
    process.env.WORKOS_COOKIE_PASSWORD
);

const authkit = workosConfigured ? authkitMiddleware() : null;

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  if (authkit) {
    return authkit(request, event);
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/member/:path*", "/admin/:path*"],
};
