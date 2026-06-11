import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { withAuth } from "@workos-inc/authkit-nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import sql from "@/lib/db-query";
import { getMemberByWorkOSId } from "@/lib/membership";

export const metadata: Metadata = {
  title: "Data flag review | Portland Civic Lab",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface FlagRow {
  id: number;
  question: string;
  metric: string | null;
  message: string;
  reporter_email: string | null;
  status: string;
  resolution_note: string | null;
  created_at: string;
}

async function requireAdmin() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const member = await getMemberByWorkOSId(user.id);
  if (member?.role !== "admin") redirect("/member");
  return member;
}

async function updateFlag(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  const note = String(formData.get("note") ?? "").trim();
  if (!Number.isInteger(id) || !["reviewing", "resolved", "dismissed"].includes(status)) {
    return;
  }
  await sql`
    UPDATE data_flags
    SET status = ${status},
        resolution_note = ${note || null},
        resolved_at = ${status === "resolved" || status === "dismissed" ? new Date() : null}
    WHERE id = ${id}
  `;
  revalidatePath("/admin/flags");
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-amber-50 text-amber-800 border-amber-200",
  reviewing: "bg-blue-50 text-blue-800 border-blue-200",
  resolved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  dismissed: "bg-stone-100 text-stone-500 border-stone-200",
};

export default async function AdminFlagsPage() {
  await requireAdmin();

  const flags = (await sql`
    SELECT id, question, metric, message, reporter_email, status, resolution_note, created_at
    FROM data_flags
    ORDER BY (status = 'new') DESC, created_at DESC
    LIMIT 200
  `) as unknown as FlagRow[];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <Header />
      <main className="flex-1 max-w-[1000px] mx-auto w-full px-5 sm:px-8 py-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-[var(--color-ember)]" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
            Admin · Data flags
          </span>
        </div>
        <h1 className="font-editorial-normal text-[32px] text-[var(--color-ink)]">
          Data flag review queue
        </h1>
        <p className="mt-2 text-[14px] text-[var(--color-ink-light)]">
          {flags.filter((f) => f.status === "new").length} new ·{" "}
          {flags.length} total (latest 200). Resolutions appear on the public
          flag list.
        </p>

        <div className="mt-8 space-y-4">
          {flags.length === 0 && (
            <p className="text-[14px] text-[var(--color-ink-muted)]">
              No flags yet.
            </p>
          )}
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="rounded-sm border border-[var(--color-parchment)] bg-white p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink-muted)]">
                  #{flag.id} · {flag.question}
                  {flag.metric ? ` · ${flag.metric}` : ""}
                </span>
                <span
                  className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    STATUS_STYLES[flag.status] ?? STATUS_STYLES.new
                  }`}
                >
                  {flag.status}
                </span>
                <span className="text-[11px] text-[var(--color-ink-muted)]">
                  {new Date(flag.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink)]">
                {flag.message}
              </p>
              {flag.reporter_email && (
                <p className="mt-1 text-[12px] text-[var(--color-ink-muted)]">
                  Reporter: {flag.reporter_email}
                </p>
              )}
              {flag.resolution_note && (
                <p className="mt-2 text-[13px] text-[var(--color-ink-light)]">
                  <strong>Resolution:</strong> {flag.resolution_note}
                </p>
              )}
              <form
                action={updateFlag}
                className="mt-4 flex flex-wrap items-center gap-2"
              >
                <input type="hidden" name="id" value={flag.id} />
                <input
                  name="note"
                  defaultValue={flag.resolution_note ?? ""}
                  placeholder="Resolution note (shown publicly)"
                  className="min-w-[240px] flex-1 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] px-3 py-1.5 text-[13px] outline-none focus:border-[var(--color-sage)]"
                />
                {["reviewing", "resolved", "dismissed"].map((status) => (
                  <button
                    key={status}
                    type="submit"
                    name="status"
                    value={status}
                    className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-3 py-1.5 text-[12px] font-semibold capitalize text-[var(--color-ink)] hover:bg-[var(--color-paper)] transition-colors"
                  >
                    {status}
                  </button>
                ))}
              </form>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
