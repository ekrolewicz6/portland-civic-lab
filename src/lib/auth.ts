import type { NextAuthOptions } from "next-auth";

/**
 * NextAuth.js configuration for Portland Civic Lab.
 *
 * There is currently no way to sign in: the old hard-coded dev credentials
 * provider was removed for security (the repo is public), and real member
 * authentication arrives with the WorkOS AuthKit integration. Sessions are
 * JWT-only; no accounts exist until then.
 */

/**
 * Resolve the JWT signing secret. In production a missing NEXTAUTH_SECRET is
 * a fatal misconfiguration — a guessable secret would let anyone forge
 * sessions, so we refuse to boot rather than fall back.
 */
export function requireAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXTAUTH_SECRET is not set. Refusing to start with a guessable JWT secret in production."
    );
  }
  return "insecure-local-dev-only-secret";
}

export const authOptions: NextAuthOptions = {
  // No providers: sign-in is disabled until WorkOS membership auth lands.
  providers: [],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: "/login",
    newUser: "/signup",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as Record<string, unknown>).role as string | undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.sub;
        (session.user as Record<string, unknown>).role = token.role;
      }
      return session;
    },
  },

  secret: requireAuthSecret(),
};

/** Re-export helpers that other server code may need. */
export { authOptions as config };
