import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-canopy)] text-white/60 mt-20">
      {/* Top accent rule */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-ember)]/40 to-transparent" />

      <div className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-12 py-14">
        {/* Newspaper-style colophon */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand column */}
          <div className="md:col-span-5">
            <div className="flex items-baseline gap-3 mb-3">
              <h3 className="font-editorial-normal text-2xl text-white leading-none">
                Portland Civic Lab
              </h3>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-ember)]/70">
                Est. 2026
              </span>
            </div>
            <p className="text-[13px] leading-relaxed max-w-sm text-white/55">
              A civic dashboard for Portland, Oregon. Eight questions, answered
              with real public data — automatically pulled from city APIs,
              government records, and verified sources.
            </p>
            <p className="mt-4 text-[12px] leading-relaxed max-w-sm text-white/35 italic font-editorial">
              &ldquo;Open data, open methodology, open books. If we can&apos;t
              show the math, we won&apos;t make the claim.&rdquo;
            </p>
          </div>

          {/* Sections column */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-mono font-semibold text-[var(--color-ember)] uppercase tracking-[0.2em] mb-4">
              Sections
            </h4>
            <ul className="text-[13px] space-y-2 text-white/55">
              <li>
                <Link
                  href="/dashboard/housing"
                  className="hover:text-white transition-colors"
                >
                  Housing
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/safety"
                  className="hover:text-white transition-colors"
                >
                  Public Safety
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/economy"
                  className="hover:text-white transition-colors"
                >
                  Economy
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/homelessness"
                  className="hover:text-white transition-colors"
                >
                  Homelessness
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/education"
                  className="hover:text-white transition-colors"
                >
                  Education
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/climate"
                  className="hover:text-white transition-colors"
                >
                  Climate
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/quality"
                  className="hover:text-white transition-colors"
                >
                  Quality of Life
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/accountability"
                  className="hover:text-white transition-colors"
                >
                  Accountability
                </Link>
              </li>
            </ul>
          </div>

          {/* Sources column */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-mono font-semibold text-[var(--color-ember)] uppercase tracking-[0.2em] mb-4">
              Data Sources
            </h4>
            <ul className="text-[13px] space-y-2 text-white/55">
              <li>City of Portland Open Data</li>
              <li>Multnomah County HSD &amp; Health</li>
              <li>Oregon Department of Education</li>
              <li>U.S. Census Bureau (ACS)</li>
              <li>Bureau of Labor Statistics</li>
              <li>HUD &amp; HUD-PIT counts</li>
              <li>Metro SHS Quarterly Reports</li>
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-white/35">
              Every metric links back to its source. See methodology notes on
              each section.
            </p>
          </div>
        </div>

        {/* Bottom rule */}
        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-white/40">
            &copy; {year} Portland Civic Lab &middot; Public data, freely
            available
          </p>
          <p className="text-[10px] text-white/25 font-mono uppercase tracking-[0.2em]">
            Auto-updated &middot; Source-linked data
          </p>
        </div>
      </div>
    </footer>
  );
}
