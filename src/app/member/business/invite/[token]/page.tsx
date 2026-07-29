import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { withAuth } from "@workos-inc/authkit-nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toHeaderMember } from "@/lib/member-nav";
import { getMemberByWorkOSId } from "@/lib/membership";
import { acceptInvite, getInviteByToken } from "@/lib/business";

export const metadata: Metadata = {
  title: "Business invitation | Portland Civic Lab",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Lives under /member so middleware forces sign-in first and returns here —
 * an invited co-owner who doesn't have an account yet signs up through the
 * normal PCL flow and lands back on this page.
 */
export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const { user } = await withAuth({ ensureSignedIn: true });
  const member = await getMemberByWorkOSId(user.id);
  const invite = await getInviteByToken(token);

  async function handleAccept() {
    "use server";
    const { user: u } = await withAuth({ ensureSignedIn: true });
    const m = await getMemberByWorkOSId(u.id);
    if (!m || m.status !== "active") redirect("/member");

    const accepted = await acceptInvite(token, m.id);
    redirect(
      accepted ? `/member/business/${accepted.business_slug}` : "/member"
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <Header member={toHeaderMember(user, member)} />

      <main className="flex-1 max-w-[680px] mx-auto w-full px-5 sm:px-8 py-16 sm:py-24">
        {invite ? (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[var(--color-ember)]" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
                Invitation
              </span>
            </div>
            <h1 className="font-editorial-normal text-[34px] sm:text-[40px] text-[var(--color-ink)] leading-tight">
              You&apos;ve been added to {invite.business_name}
            </h1>
            <p className="mt-4 text-[15px] text-[var(--color-ink-light)] leading-relaxed">
              Accepting makes you a{" "}
              {invite.role === "co_owner" ? "co-owner" : invite.role} on
              Portland Civic Lab. You&apos;ll see every funding program
              we&apos;ve matched to the business, the applications we&apos;ve
              prepared, and where each one stands — and you can approve them
              yourself.
            </p>
            <form action={handleAccept} className="mt-8">
              <button
                type="submit"
                className="rounded-sm bg-[var(--color-canopy)] px-6 py-3 text-[15px] font-semibold text-[var(--color-paper)] hover:bg-[var(--color-canopy-light)] transition-colors"
              >
                Accept invitation
              </button>
            </form>
            <p className="mt-4 text-[13px] text-[var(--color-ink-muted)]">
              Signed in as {user.email}. If that&apos;s not you, sign out first
              — the invitation attaches to whoever accepts it.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-editorial-normal text-[34px] text-[var(--color-ink)] leading-tight">
              This invitation isn&apos;t valid
            </h1>
            <p className="mt-4 text-[15px] text-[var(--color-ink-light)] leading-relaxed">
              It may have already been accepted, been revoked, or expired —
              invitations last 14 days. Ask whoever invited you to send a fresh
              one.
            </p>
            <Link
              href="/member"
              className="mt-6 inline-block text-[14px] font-semibold text-[var(--color-canopy)] hover:underline"
            >
              Go to your member area →
            </Link>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
