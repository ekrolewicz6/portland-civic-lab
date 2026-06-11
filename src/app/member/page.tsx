import type { Metadata } from "next";
import Link from "next/link";
import { withAuth, signOut } from "@workos-inc/authkit-nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getMemberByWorkOSId } from "@/lib/membership";

export const metadata: Metadata = {
  title: "Member area | Portland Civic Lab",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MemberPage() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const member = await getMemberByWorkOSId(user.id);

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  async function handleSignOut() {
    "use server";
    await signOut({ returnTo: "/" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <Header />

      <main className="flex-1 max-w-[1400px] 3xl:max-w-[1800px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-[var(--color-ember)]" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
            Member area
          </span>
        </div>

        <h1 className="font-editorial-normal text-[36px] sm:text-[44px] text-[var(--color-ink)] leading-tight">
          Welcome, {displayName}
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] text-[var(--color-ink-light)] leading-relaxed">
          You&apos;re one of the first members of Portland Civic Lab.
          Member features are rolling out in stages — here&apos;s what&apos;s
          coming and how to get involved today.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6">
            <h2 className="font-editorial text-[22px] text-[var(--color-ink)]">
              Your profile
            </h2>
            <dl className="mt-4 space-y-2 text-[14px] text-[var(--color-ink-light)]">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-ink-muted)]">Email</dt>
                <dd className="truncate">{user.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-ink-muted)]">Role</dt>
                <dd className="capitalize">{member?.role ?? "member"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-ink-muted)]">Member since</dt>
                <dd>
                  {member?.joined_at
                    ? new Date(member.joined_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Today"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6">
            <h2 className="font-editorial text-[22px] text-[var(--color-ink)]">
              Things you can do now
            </h2>
            <ul className="mt-4 space-y-2 text-[14px] text-[var(--color-ink-light)] leading-relaxed">
              <li>
                <Link href="/proposals" className="text-[var(--color-canopy)] hover:underline">
                  Propose and vote on dashboard topics →
                </Link>
              </li>
              <li>
                Flag suspect numbers on any{" "}
                <Link href="/dashboard" className="text-[var(--color-canopy)] hover:underline">
                  dashboard
                </Link>
              </li>
              <li>
                Follow our{" "}
                <Link href="/records" className="text-[var(--color-canopy)] hover:underline">
                  public records requests
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="text-[var(--color-canopy)] hover:underline">
                  Volunteer your skills →
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6">
            <h2 className="font-editorial text-[22px] text-[var(--color-ink)]">
              Get involved now
            </h2>
            <p className="mt-4 text-[14px] text-[var(--color-ink-light)] leading-relaxed">
              See something wrong in the data, or have an idea for what the
              lab should build next? We read every note.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block text-[14px] font-semibold text-[var(--color-canopy)] hover:underline"
            >
              Send a note →
            </Link>
          </div>
        </div>

        <form action={handleSignOut} className="mt-10">
          <button
            type="submit"
            className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] underline transition-colors"
          >
            Sign out
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
