import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { withAuth } from "@workos-inc/authkit-nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toHeaderMember } from "@/lib/member-nav";
import { getMemberByWorkOSId } from "@/lib/membership";
import { requireBusinessAccess } from "@/lib/business-guard";
import { sendEmail } from "@/lib/email";
import { UPCOMING_SERVICES } from "@/lib/services";
import {
  createInvite,
  formatAmountRange,
  formatUsd,
  getBusinessTeam,
  getMatchesForBusiness,
  getPendingInvites,
  isBusinessMember,
  sortByPriority,
  summarizeMatches,
  EFFORT_LABELS,
  MATCH_STATUSES,
  MATCH_STATUS_LABELS,
  type MatchWithOpportunity,
} from "@/lib/business";

export const metadata: Metadata = {
  title: "Funding dashboard | Portland Civic Lab",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  identified: "bg-stone-100 text-stone-600 border-stone-200",
  qualified: "bg-blue-50 text-blue-800 border-blue-200",
  in_prep: "bg-violet-50 text-violet-800 border-violet-200",
  ready_for_review: "bg-amber-50 text-amber-800 border-amber-200",
  submitted: "bg-sky-50 text-sky-800 border-sky-200",
  awarded: "bg-emerald-50 text-emerald-800 border-emerald-200",
  declined: "bg-stone-100 text-stone-500 border-stone-200",
};

const LEVEL_LABELS: Record<string, string> = {
  city: "City",
  county: "Regional",
  state: "State",
  federal: "Federal",
  private: "Private",
};

function deadlineLabel(m: MatchWithOpportunity): string {
  if (m.rolling) return "Rolling — no deadline";
  if (!m.deadline) return "Cycle dates vary";
  const d = new Date(m.deadline);
  return `Closes ${d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function valueLabel(m: MatchWithOpportunity): string | null {
  if (m.value_type === "recurring_annual") return "Every year";
  if (m.value_type === "per_unit") return m.unit_label ?? "Per unit";
  return null;
}

function MoneyCard({
  label,
  value,
  note,
  emphasis = false,
}: {
  label: string;
  value: string;
  note: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-sm border p-5 ${
        emphasis
          ? "border-[var(--color-ember)] bg-[var(--color-paper-warm)]"
          : "border-[var(--color-parchment)] bg-[var(--color-paper-warm)]"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
        {label}
      </p>
      <p className="mt-3 font-editorial-normal text-[34px] leading-none text-[var(--color-ink)]">
        {value}
      </p>
      <p className="mt-2 text-[12px] text-[var(--color-ink-muted)] leading-relaxed">
        {note}
      </p>
    </div>
  );
}

export default async function BusinessDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { user, member, business } = await requireBusinessAccess(slug);

  const [matches, team, invites] = await Promise.all([
    getMatchesForBusiness(business.id),
    getBusinessTeam(business.id),
    getPendingInvites(business.id),
  ]);

  const summary = summarizeMatches(matches);
  const ranked = sortByPriority(matches);
  const unverifiedCount = matches.filter(
    (m) => m.verification_status !== "verified"
  ).length;

  async function handleRescan() {
    "use server";
    const { user: u } = await withAuth({ ensureSignedIn: true });
    const m = await getMemberByWorkOSId(u.id);
    if (!m || !(await isBusinessMember(business.id, m.id))) redirect("/member");

    const { generateMatchesForBusiness } = await import("@/lib/funding/match");
    await generateMatchesForBusiness(business.id);
    revalidatePath(`/member/business/${business.slug}`);
  }

  async function handleInvite(formData: FormData) {
    "use server";
    const { user: u } = await withAuth({ ensureSignedIn: true });
    const m = await getMemberByWorkOSId(u.id);
    if (!m || !(await isBusinessMember(business.id, m.id))) redirect("/member");

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    if (!email.includes("@")) return;

    const invite = await createInvite(business.id, email, "co_owner", m.id);

    const host = (await headers()).get("host");
    const proto = host?.startsWith("localhost") ? "http" : "https";
    const link = `${proto}://${host}/member/business/invite/${invite.token}`;
    const inviterName = [m.first_name, m.last_name].filter(Boolean).join(" ");

    await sendEmail({
      to: email,
      subject: `${inviterName || "Your co-owner"} added you to ${business.name} on Portland Civic Lab`,
      replyTo: m.email,
      text: [
        `${inviterName || m.email} added you as a co-owner of ${business.name} on Portland Civic Lab.`,
        "",
        "Portland Civic Lab finds funding your business qualifies for, prepares the applications, and tracks them. Accept the invitation to see what we've found:",
        link,
        "",
        "This link expires in 14 days.",
      ].join("\n"),
    }).catch((err) => {
      // A mail provider failure shouldn't lose the invite — the link still
      // works and is shown in the UI below.
      console.error("[business-invite] email delivery failed:", err);
      return null;
    });

    revalidatePath(`/member/business/${business.slug}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <Header member={toHeaderMember(user, member)} />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <Link
          href="/member"
          className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
        >
          ← Member area
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-editorial-normal text-[36px] sm:text-[44px] text-[var(--color-ink)] leading-tight">
              {business.name}
            </h1>
            <p className="mt-2 text-[14px] text-[var(--color-ink-muted)]">
              {[business.address_street, business.neighborhood, business.address_city]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className="flex -space-x-2">
            {team.map((t) => (
              <span
                key={t.member_id}
                title={`${[t.first_name, t.last_name].filter(Boolean).join(" ") || t.email} — ${t.title ?? t.role}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--color-paper)] bg-[var(--color-canopy)] text-[12px] font-semibold text-[var(--color-paper)]"
              >
                {(t.first_name?.[0] ?? t.email[0]).toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* ── Headline: cash flow, not a grant count ─────────────── */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[var(--color-ember)]" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
              What we found
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MoneyCard
              emphasis
              label="Realistic first year"
              value={formatUsd(summary.expectedFirstYear)}
              note={`Across ${summary.matchCount} programs, weighted by how likely each one is. If everything landed at the top of its range: ${formatUsd(summary.firstYearMax)}.`}
            />
            <MoneyCard
              label="Recurring every year"
              value={formatUsd(summary.expectedRecurring)}
              note={`Credits, rebates, and co-op funds that repeat annually — the part that compounds. Full range ${formatUsd(summary.recurringAnnualMin)}–${formatUsd(summary.recurringAnnualMax)}.`}
            />
            <MoneyCard
              label="Five-year value"
              value={formatUsd(
                summary.expectedFirstYear + summary.expectedRecurring * 4
              )}
              note="This year plus four more years of the recurring benefits, at the same weighting."
            />
            <MoneyCard
              label={summary.awardedTotal > 0 ? "Awarded so far" : "Capital access"}
              value={
                summary.awardedTotal > 0
                  ? formatUsd(summary.awardedTotal)
                  : formatUsd(summary.capitalAccessMax)
              }
              note={
                summary.awardedTotal > 0
                  ? "Money actually in the door."
                  : "Low-interest lending identified. Borrowing capacity, not income — kept out of the totals above."
              }
            />
          </div>

          {unverifiedCount > 0 && (
            <p className="mt-4 rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900 leading-relaxed">
              <strong>{unverifiedCount}</strong> of these programs still need
              PCL to confirm current amounts and deadlines against the funder&apos;s
              own listing. Estimates are researched, not yet verified — we show
              you which is which rather than quoting numbers we can&apos;t stand
              behind.
            </p>
          )}
        </section>

        {/* ── Ranked opportunities ───────────────────────────────── */}
        <section className="mt-14">
          <h2 className="font-editorial text-[28px] text-[var(--color-ink)]">
            Ranked for you
          </h2>
          <p className="mt-2 max-w-3xl text-[14px] text-[var(--color-ink-light)] leading-relaxed">
            Ordered by what actually improves cash flow — value over five years,
            weighted by how likely it is and discounted by how much work it
            takes. Not by how big the headline number looks.
          </p>

          {ranked.length === 0 && (
            <div className="mt-6 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6">
              <h3 className="font-editorial text-[20px] text-[var(--color-ink)]">
                Nothing matched yet
              </h3>
              <p className="mt-2 max-w-2xl text-[14px] text-[var(--color-ink-light)] leading-relaxed">
                Our catalog didn&apos;t turn up programs for this profile. That
                usually means the profile is thin rather than that the money
                isn&apos;t there — ownership details, employee count, and what
                you do for the neighborhood are what unlock most programs. Fill
                those in and search again.
              </p>
              <form action={handleRescan} className="mt-5">
                <button
                  type="submit"
                  className="rounded-sm bg-[var(--color-canopy)] px-5 py-2.5 text-[14px] font-semibold text-[var(--color-paper)] hover:bg-[var(--color-canopy-light)] transition-colors"
                >
                  Search the catalog again
                </button>
              </form>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {ranked.map((m) => (
              <Link
                key={m.id}
                href={`/member/business/${business.slug}/opportunities/${m.id}`}
                className="block rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6 hover:border-[var(--color-sage)] transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-block rounded-sm border px-2 py-0.5 text-[11px] font-medium ${
                          STATUS_STYLES[m.status] ?? STATUS_STYLES.identified
                        }`}
                      >
                        {MATCH_STATUS_LABELS[m.status] ?? m.status}
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                        {LEVEL_LABELS[m.level] ?? m.level}
                      </span>
                      {valueLabel(m) && (
                        <span className="rounded-sm bg-[var(--color-lichen)]/40 px-2 py-0.5 text-[11px] font-medium text-[var(--color-canopy)]">
                          {valueLabel(m)}
                        </span>
                      )}
                      {m.verification_status !== "verified" && (
                        <span className="rounded-sm border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-800">
                          Unverified
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2.5 font-editorial text-[21px] text-[var(--color-ink)]">
                      {m.opportunity_name}
                    </h3>
                    <p className="text-[13px] text-[var(--color-ink-muted)]">
                      {m.funder}
                    </p>
                    {m.fit_rationale && (
                      <p className="mt-3 max-w-2xl text-[14px] text-[var(--color-ink-light)] leading-relaxed">
                        {m.fit_rationale}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-editorial-normal text-[24px] leading-none text-[var(--color-ink)]">
                      {formatAmountRange(m.amount_min, m.amount_max)}
                    </p>
                    <p className="mt-2 text-[12px] text-[var(--color-ink-muted)]">
                      {deadlineLabel(m)}
                    </p>
                    {m.effort_level && (
                      <p className="mt-1 text-[12px] text-[var(--color-ink-muted)]">
                        Effort: {EFFORT_LABELS[m.effort_level] ?? m.effort_level}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Pipeline ───────────────────────────────────────────── */}
        <section className="mt-14">
          <h2 className="font-editorial text-[28px] text-[var(--color-ink)]">
            Where everything stands
          </h2>
          <p className="mt-2 max-w-3xl text-[14px] text-[var(--color-ink-light)] leading-relaxed">
            Portland Civic Lab moves items down this pipeline on your behalf.
            You only act at &ldquo;ready for review&rdquo; — read what we wrote,
            then submit it.
          </p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MATCH_STATUSES.map((s) => (
              <div
                key={s}
                className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4"
              >
                <p className="font-editorial-normal text-[30px] leading-none text-[var(--color-ink)]">
                  {summary.byStatus[s] ?? 0}
                </p>
                <p className="mt-2 text-[12px] text-[var(--color-ink-muted)]">
                  {MATCH_STATUS_LABELS[s]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Team ───────────────────────────────────────────────── */}
        <section className="mt-14">
          <h2 className="font-editorial text-[28px] text-[var(--color-ink)]">
            Who&apos;s on this business
          </h2>
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6">
              <ul className="space-y-3">
                {team.map((t) => (
                  <li
                    key={t.member_id}
                    className="flex items-center justify-between gap-4 text-[14px]"
                  >
                    <span className="text-[var(--color-ink)]">
                      {[t.first_name, t.last_name].filter(Boolean).join(" ") ||
                        t.email}
                    </span>
                    <span className="text-[12px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                      {t.title ?? t.role.replace("_", "-")}
                    </span>
                  </li>
                ))}
              </ul>

              {invites.length > 0 && (
                <div className="mt-5 border-t border-[var(--color-parchment)] pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                    Pending invitations
                  </p>
                  <ul className="mt-3 space-y-3">
                    {invites.map((i) => (
                      <li key={i.id} className="text-[13px]">
                        <span className="text-[var(--color-ink)]">{i.email}</span>
                        <span className="ml-2 text-[var(--color-ink-muted)]">
                          invited
                        </span>
                        <code className="mt-1 block truncate rounded-sm bg-[var(--color-paper)] px-2 py-1 text-[11px] text-[var(--color-ink-muted)]">
                          /member/business/invite/{i.token}
                        </code>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[12px] text-[var(--color-ink-muted)] leading-relaxed">
                    We emailed the invitation. If it doesn&apos;t arrive, send
                    them the link above — it works either way.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6">
              <h3 className="font-editorial text-[20px] text-[var(--color-ink)]">
                Add a co-owner
              </h3>
              <p className="mt-2 text-[14px] text-[var(--color-ink-light)] leading-relaxed">
                Co-owners see everything you see and can approve applications.
                Some programs are only open because of who owns the business, so
                it&apos;s worth having everyone on here.
              </p>
              <form action={handleInvite} className="mt-4 flex flex-wrap gap-3">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="their@email.com"
                  className="min-w-0 flex-1 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] px-3 py-2 text-[14px] text-[var(--color-ink)] focus:border-[var(--color-sage)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-sm bg-[var(--color-canopy)] px-5 py-2 text-[14px] font-semibold text-[var(--color-paper)] hover:bg-[var(--color-canopy-light)] transition-colors"
                >
                  Send invite
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── The rest of the platform ───────────────────────────── */}
        <section className="mt-14">
          <h2 className="font-editorial text-[28px] text-[var(--color-ink)]">
            What we&apos;re building next
          </h2>
          <p className="mt-2 max-w-3xl text-[14px] text-[var(--color-ink-light)] leading-relaxed">
            Funding is the first service. The same profile powers everything
            below — you won&apos;t fill anything out twice. Savings estimates are
            typical ranges for a business your size, not promises.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {UPCOMING_SERVICES.map((s) => (
              <div
                key={s.slug}
                className="rounded-sm border border-dashed border-[var(--color-parchment)] p-5"
              >
                <p className="font-editorial text-[17px] text-[var(--color-ink)]">
                  {s.name}
                </p>
                <p className="mt-1 text-[12px] font-semibold text-[var(--color-ember)]">
                  {s.valueHint}
                </p>
                <p className="mt-2 text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
                  {s.tagline}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
