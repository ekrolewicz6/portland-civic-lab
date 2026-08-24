import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { withAuth } from "@workos-inc/authkit-nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toHeaderMember } from "@/lib/member-nav";
import { getMemberByWorkOSId } from "@/lib/membership";
import { requireBusinessAccess } from "@/lib/business-guard";
import {
  formatAmountRange,
  getMatchById,
  isBusinessMember,
  updateMatchStatus,
  EFFORT_LABELS,
  MATCH_STATUS_LABELS,
} from "@/lib/business";

export const metadata: Metadata = {
  title: "Funding opportunity | Portland Civic Lab",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const LEVEL_LABELS: Record<string, string> = {
  city: "City of Portland",
  county: "Regional / county",
  state: "State of Oregon",
  federal: "Federal",
  private: "Private",
};

const VALUE_TYPE_NOTES: Record<string, string> = {
  one_time: "One-time",
  recurring_annual: "Repeats every year",
  per_unit: "Per unit",
};

export default async function OpportunityDetail({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const { user, member, business } = await requireBusinessAccess(slug);

  const matchId = Number(id);
  if (!Number.isFinite(matchId)) notFound();

  const match = await getMatchById(business.id, matchId);
  if (!match) notFound();

  const draft = match.application_draft;
  const eligibility = match.eligibility;

  async function setStatus(formData: FormData) {
    "use server";
    const { user: u } = await withAuth({ ensureSignedIn: true });
    const m = await getMemberByWorkOSId(u.id);
    if (!m || !(await isBusinessMember(business.id, m.id))) redirect("/member");

    const status = String(formData.get("status") ?? "");
    const allowed = ["submitted", "dismissed", "qualified"];
    if (!allowed.includes(status)) redirect(`/member/business/${business.slug}`);

    const who = [m.first_name, m.last_name].filter(Boolean).join(" ") || m.email;
    const note =
      status === "submitted"
        ? `Approved and submitted by ${who}.`
        : status === "dismissed"
          ? `Passed on by ${who}.`
          : null;

    await updateMatchStatus(business.id, matchId, status, note);
    revalidatePath(`/member/business/${business.slug}`);
    redirect(
      status === "dismissed"
        ? `/member/business/${business.slug}`
        : `/member/business/${business.slug}/opportunities/${matchId}`
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <Header member={toHeaderMember(user, member)} />

      <main className="flex-1 max-w-[900px] mx-auto w-full px-5 sm:px-8 py-12 sm:py-16">
        <Link
          href={`/member/business/${business.slug}`}
          className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
        >
          ← {business.name}
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            {LEVEL_LABELS[match.level] ?? match.level}
          </span>
          <span className="rounded-sm border border-[var(--color-parchment)] px-2 py-0.5 text-[11px] text-[var(--color-ink-light)]">
            {MATCH_STATUS_LABELS[match.status] ?? match.status}
          </span>
          {match.verification_status !== "verified" && (
            <span className="rounded-sm border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-800">
              Amounts unverified
            </span>
          )}
        </div>

        <h1 className="mt-3 font-editorial-normal text-[34px] sm:text-[40px] text-[var(--color-ink)] leading-tight">
          {match.opportunity_name}
        </h1>
        <p className="mt-2 text-[15px] text-[var(--color-ink-muted)]">
          {match.funder}
        </p>

        {match.opportunity_description && (
          <p className="mt-5 text-[15px] text-[var(--color-ink-light)] leading-relaxed">
            {match.opportunity_description}
          </p>
        )}

        {match.fit_rationale && (
          <div className="mt-6 rounded-sm border-l-2 border-[var(--color-ember)] bg-[var(--color-paper-warm)] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
              Why we matched you
            </p>
            <p className="mt-2 text-[14px] text-[var(--color-ink-light)] leading-relaxed">
              {match.fit_rationale}
            </p>
          </div>
        )}

        <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Amount
            </dt>
            <dd className="mt-2 font-editorial text-[19px] text-[var(--color-ink)]">
              {formatAmountRange(match.amount_min, match.amount_max)}
            </dd>
            <dd className="mt-1 text-[12px] text-[var(--color-ink-muted)]">
              {match.value_type === "per_unit"
                ? (match.unit_label ?? "Per unit")
                : VALUE_TYPE_NOTES[match.value_type]}
            </dd>
          </div>
          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Deadline
            </dt>
            <dd className="mt-2 text-[14px] text-[var(--color-ink)]">
              {match.rolling
                ? "Rolling"
                : match.deadline
                  ? new Date(match.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Varies by cycle"}
            </dd>
          </div>
          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Effort
            </dt>
            <dd className="mt-2 text-[14px] text-[var(--color-ink)]">
              {match.effort_level
                ? (EFFORT_LABELS[match.effort_level] ?? match.effort_level)
                : "—"}
            </dd>
          </div>
          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Likelihood
            </dt>
            <dd className="mt-2 text-[14px] capitalize text-[var(--color-ink)]">
              {match.success_probability ?? "—"}
            </dd>
          </div>
        </dl>

        {eligibility && (
          <section className="mt-8">
            <h2 className="font-editorial text-[22px] text-[var(--color-ink)]">
              Eligibility
            </h2>
            <ul className="mt-3 space-y-1.5 text-[14px] text-[var(--color-ink-light)]">
              {eligibility.geography?.label && (
                <li>
                  <span className="text-[var(--color-ink-muted)]">Where: </span>
                  {eligibility.geography.label}
                </li>
              )}
              {eligibility.maxEmployees && (
                <li>
                  <span className="text-[var(--color-ink-muted)]">Size: </span>
                  Up to {eligibility.maxEmployees} employees
                </li>
              )}
              {eligibility.ownershipAttributes &&
                eligibility.ownershipAttributes.length > 0 && (
                  <li>
                    <span className="text-[var(--color-ink-muted)]">
                      Ownership:{" "}
                    </span>
                    {eligibility.ownershipAttributes
                      .map((a) => a.replace(/_/g, " "))
                      .join(", ")}
                  </li>
                )}
              {eligibility.notes && (
                <li className="leading-relaxed">{eligibility.notes}</li>
              )}
            </ul>
          </section>
        )}

        {/* ── The prepared application ───────────────────────────── */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[var(--color-ember)]" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
              {draft ? "Your application, already written" : "Application"}
            </span>
          </div>

          {draft && draft.questions.length > 0 ? (
            <>
              <p className="max-w-2xl text-[14px] text-[var(--color-ink-light)] leading-relaxed">
                Portland Civic Lab drafted every answer from your business
                profile and our research. Read it, change anything that
                doesn&apos;t sound like you, then submit it on the funder&apos;s
                site. We never submit anything in your name.
              </p>

              <div className="mt-6 space-y-6">
                {draft.questions.map((q, i) => (
                  <div
                    key={i}
                    className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6"
                  >
                    <p className="font-editorial text-[17px] text-[var(--color-ink)]">
                      {q.question}
                    </p>
                    <p className="mt-3 whitespace-pre-line text-[15px] text-[var(--color-ink-light)] leading-relaxed">
                      {q.answer}
                    </p>
                    {q.source && (
                      <p className="mt-3 border-t border-[var(--color-parchment)] pt-2.5 font-mono text-[11px] text-[var(--color-ink-muted)]">
                        Source: {q.source}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {match.status === "submitted" ? (
                <div className="mt-8 rounded-sm border border-emerald-200 bg-emerald-50 px-5 py-4">
                  <p className="text-[14px] text-emerald-900 leading-relaxed">
                    Marked as submitted.{" "}
                    {match.status_note ? match.status_note : null} PCL will
                    track it from here and tell you the moment there&apos;s an
                    answer.
                  </p>
                </div>
              ) : (
                <div className="mt-8 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6">
                  <h3 className="font-editorial text-[20px] text-[var(--color-ink)]">
                    Ready to send it?
                  </h3>
                  <p className="mt-2 text-[14px] text-[var(--color-ink-light)] leading-relaxed">
                    Open the funder&apos;s application, paste in the answers
                    above, and submit. Then mark it here so we can track the
                    outcome.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {match.url && (
                      <a
                        href={match.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm bg-[var(--color-canopy)] px-5 py-2.5 text-[14px] font-semibold text-[var(--color-paper)] hover:bg-[var(--color-canopy-light)] transition-colors"
                      >
                        Open the application ↗
                      </a>
                    )}
                    <form action={setStatus}>
                      <input type="hidden" name="status" value="submitted" />
                      <button
                        type="submit"
                        className="rounded-sm border border-[var(--color-canopy)] px-5 py-2.5 text-[14px] font-semibold text-[var(--color-canopy)] hover:bg-[var(--color-lichen)]/30 transition-colors"
                      >
                        Mark as submitted
                      </button>
                    </form>
                    <form action={setStatus}>
                      <input type="hidden" name="status" value="dismissed" />
                      <button
                        type="submit"
                        className="text-[13px] text-[var(--color-ink-muted)] underline hover:text-[var(--color-ink)] transition-colors"
                      >
                        Not interested
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6">
              <p className="text-[15px] text-[var(--color-ink-light)] leading-relaxed">
                Portland Civic Lab is preparing this one. Current stage:{" "}
                <strong className="text-[var(--color-ink)]">
                  {MATCH_STATUS_LABELS[match.status] ?? match.status}
                </strong>
                . When the draft is ready you&apos;ll find every answer written
                out here, and all that&apos;s left is your review.
              </p>
              {match.url && (
                <a
                  href={match.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-[14px] font-semibold text-[var(--color-canopy)] hover:underline"
                >
                  See the program ↗
                </a>
              )}
              <form action={setStatus} className="mt-5">
                <input type="hidden" name="status" value="dismissed" />
                <button
                  type="submit"
                  className="text-[13px] text-[var(--color-ink-muted)] underline hover:text-[var(--color-ink)] transition-colors"
                >
                  Not interested — stop working on this
                </button>
              </form>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
