import Link from "next/link";

export const metadata = {
  title: "Membership | Portland Civic Lab",
};

/**
 * Shown only when WorkOS isn't configured in the environment (e.g. forks
 * without keys). With WorkOS configured, /login and /signup redirect
 * straight to hosted AuthKit and this page is unreachable from the UI.
 */
export default function MembershipPage() {
  return (
    <div className="w-full max-w-md text-center">
      <h1 className="font-editorial-normal text-[32px] sm:text-[40px] text-[var(--color-ink)] leading-[1.05]">
        Membership is coming soon
      </h1>
      <p className="text-[15px] text-[var(--color-ink-light)] mt-4 leading-relaxed">
        We&apos;re building a membership program where Portlanders can help
        shape what the Civic Lab tracks and builds. Accounts aren&apos;t open
        yet — but we&apos;d love to hear from you in the meantime.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-canopy)] px-5 py-3 text-[15px] font-semibold text-white hover:bg-[var(--color-canopy-mid)] transition-colors"
        >
          Get in touch
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-3 text-[15px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-paper)] transition-colors"
        >
          Explore the dashboards
        </Link>
      </div>
    </div>
  );
}
