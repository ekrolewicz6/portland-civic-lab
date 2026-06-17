import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { requireAdmin } from "@/lib/admin";
import sql from "@/lib/db-query";
import { toHeaderMember } from "@/lib/member-nav";

export const metadata: Metadata = {
  title: "Admin portal | Portland Civic Lab",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AdminStats {
  members: number;
  admins: number;
  suspended: number;
  new_flags: number;
  open_proposals: number;
}

const statLabel: Record<keyof AdminStats, string> = {
  members: "Members",
  admins: "Admins",
  suspended: "Suspended",
  new_flags: "New data flags",
  open_proposals: "Open proposals",
};

function NumberCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
        {label}
      </p>
      <p className="mt-3 font-editorial-normal text-[42px] leading-none text-[var(--color-ink)]">
        {value.toLocaleString("en-US")}
      </p>
    </div>
  );
}

export default async function AdminIndex() {
  const { user, member } = await requireAdmin();
  const [stats] = (await sql`
    SELECT
      (SELECT COUNT(*)::int FROM members) AS members,
      (SELECT COUNT(*)::int FROM members WHERE role = 'admin' AND status = 'active') AS admins,
      (SELECT COUNT(*)::int FROM members WHERE status = 'suspended') AS suspended,
      (SELECT COUNT(*)::int FROM data_flags WHERE status = 'new') AS new_flags,
      (SELECT COUNT(*)::int FROM topic_proposals WHERE status = 'open') AS open_proposals
  `) as unknown as AdminStats[];

  const safeStats = stats ?? {
    members: 0,
    admins: 0,
    suspended: 0,
    new_flags: 0,
    open_proposals: 0,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <Header member={toHeaderMember(user, member)} />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-[var(--color-ember)]" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
            Admin portal
          </span>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-editorial-normal text-[36px] sm:text-[48px] text-[var(--color-ink)] leading-tight">
              Portland Civic Lab admin
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] text-[var(--color-ink-light)] leading-relaxed">
              Manage member access, review community data flags, and keep the
              member-facing tools clean enough to operate.
            </p>
          </div>
          <Link
            href="/member"
            className="inline-flex w-fit items-center rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-4 py-2 text-[13px] font-semibold text-[var(--color-canopy)] hover:bg-white transition-colors"
          >
            View member profile
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {(Object.keys(statLabel) as (keyof AdminStats)[]).map((key) => (
            <NumberCard key={key} label={statLabel[key]} value={Number(safeStats[key] ?? 0)} />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Link
            href="/admin/users"
            className="rounded-sm border border-[var(--color-parchment)] bg-white p-6 transition-colors hover:border-[var(--color-ember)]"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
              Users
            </p>
            <h2 className="mt-3 font-editorial text-[26px] text-[var(--color-ink)]">
              Manage members
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
              See all mirrored WorkOS members, promote admins, demote admins,
              and suspend or reactivate accounts.
            </p>
          </Link>

          <Link
            href="/admin/flags"
            className="rounded-sm border border-[var(--color-parchment)] bg-white p-6 transition-colors hover:border-[var(--color-ember)]"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
              Data quality
            </p>
            <h2 className="mt-3 font-editorial text-[26px] text-[var(--color-ink)]">
              Review flags
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
              Resolve public data corrections, dismiss bad reports, and publish
              resolution notes.
            </p>
          </Link>

          <Link
            href="/proposals"
            className="rounded-sm border border-[var(--color-parchment)] bg-white p-6 transition-colors hover:border-[var(--color-ember)]"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
              Membership
            </p>
            <h2 className="mt-3 font-editorial text-[26px] text-[var(--color-ink)]">
              Topic proposals
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
              Track what members are proposing and voting up for the dashboard
              roadmap.
            </p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
