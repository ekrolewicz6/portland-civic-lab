import Link from "next/link";
import { ASK_PORTLAND_URL, PARKS_URL, PERMITS_URL } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-canopy)] text-white">
      <div className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-3 group">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <path
                d="M14 2L6 8v12l8 6 8-6V8l-8-6z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-[var(--color-sage)]"
              />
              <path
                d="M14 6l-4 3v8l4 3 4-3v-8l-4-3z"
                fill="currentColor"
                className="text-[var(--color-ember)]"
                opacity="0.8"
              />
              <circle cx="14" cy="14" r="2" fill="white" opacity="0.9" />
            </svg>
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold tracking-tight">
                Portland Civic Lab
              </span>
              <span className="hidden sm:inline text-[11px] font-medium text-[var(--color-sage)] uppercase tracking-[0.15em]">
                Dashboards & Civic Tools
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-5 text-[11px] font-mono uppercase tracking-[0.16em]">
            <Link
              href="/dashboard"
              className="text-[var(--color-sage)] hover:text-white transition-colors"
            >
              Dashboards
            </Link>
            <a
              href={PARKS_URL}
              className="hidden md:inline text-white/55 hover:text-white transition-colors"
            >
              Parks Atlas
            </a>
            <a
              href={ASK_PORTLAND_URL}
              className="hidden lg:inline text-white/55 hover:text-white transition-colors"
            >
              Ask Portland
            </a>
            <a
              href={PERMITS_URL}
              className="hidden sm:inline text-white/55 hover:text-white transition-colors"
            >
              Permitting
            </a>
            <Link
              href="/contact"
              className="hidden sm:inline text-white/55 hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/signup"
              className="rounded-sm bg-[var(--color-ember)] px-3 py-1.5 font-semibold text-[var(--color-canopy)] hover:bg-[var(--color-ember-bright)] transition-colors"
            >
              Join
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
