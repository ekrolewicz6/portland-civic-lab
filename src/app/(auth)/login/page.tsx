import Link from "next/link";

export const metadata = {
  title: "Sign in | Portland Civic Lab",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md text-center">
      <h1 className="font-editorial-normal text-[32px] text-[var(--color-ink)]">
        Sign-in isn&apos;t open yet
      </h1>
      <p className="text-[15px] text-[var(--color-ink-muted)] mt-4 leading-relaxed">
        Member accounts are on the way. Everything on the site is free and
        public in the meantime — no account needed.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/dashboard"
          className="inline-block px-6 py-2.5 bg-[var(--color-canopy)] text-white text-[14px] font-medium rounded hover:bg-[var(--color-canopy-mid)] transition-colors"
        >
          Explore the dashboards
        </Link>
        <Link
          href="/contact"
          className="inline-block px-6 py-2.5 border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] text-[var(--color-ink)] text-[14px] font-medium rounded hover:bg-[var(--color-paper)] transition-colors"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
