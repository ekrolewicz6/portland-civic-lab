import Link from "next/link";

export const metadata = {
  title: "Membership coming soon | Portland Civic Lab",
};

export default function SignupPage() {
  return (
    <div className="w-full max-w-md text-center">
      <h1 className="font-editorial-normal text-[32px] text-[var(--color-ink)]">
        Membership is coming soon
      </h1>
      <p className="text-[15px] text-[var(--color-ink-muted)] mt-4 leading-relaxed">
        We&apos;re building a membership program where Portlanders can help
        shape what the Civic Lab tracks and builds. Accounts aren&apos;t open
        yet — but we&apos;d love to hear from you in the meantime.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/contact"
          className="inline-block px-6 py-2.5 bg-[var(--color-canopy)] text-white text-[14px] font-medium rounded hover:bg-[var(--color-canopy-mid)] transition-colors"
        >
          Get in touch
        </Link>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-2.5 border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] text-[var(--color-ink)] text-[14px] font-medium rounded hover:bg-[var(--color-paper)] transition-colors"
        >
          Explore the dashboards
        </Link>
      </div>
    </div>
  );
}
