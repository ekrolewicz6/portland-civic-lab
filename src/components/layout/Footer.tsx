import Link from "next/link";
import { ASK_PORTLAND_URL, PARKS_URL, PERMITS_URL } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-canopy)] text-white/60 mt-20">
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-ember)]/40 to-transparent" />

      <div className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-baseline gap-3 mb-3">
              <h3 className="font-editorial-normal text-2xl text-white leading-none">
                Portland Civic Lab
              </h3>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-ember)]/70">
                Est. 2026
              </span>
            </div>
            <p className="text-[13px] leading-relaxed max-w-sm text-white/65">
              An independent initiative focused on improving how Portland&apos;s
              systems work in practice. We build public dashboards, civic
              measurement tools, and workflow products that make local decisions
              easier to understand.
            </p>
            <p className="mt-4 text-[12px] leading-relaxed max-w-sm text-white/50 italic font-editorial">
              &ldquo;Practical tools, real workflows, clear public data.&rdquo;
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[10px] font-mono font-semibold text-[var(--color-ember)] uppercase tracking-[0.2em] mb-4">
              Tools
            </h4>
            <ul className="text-[13px] space-y-2 text-white/65">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Live Dashboards
                </Link>
              </li>
              <li>
                <a href={PARKS_URL} className="hover:text-white transition-colors">
                  Parks Atlas
                </a>
              </li>
              <li>
                <a href={ASK_PORTLAND_URL} className="hover:text-white transition-colors">
                  Ask Portland
                </a>
              </li>
              <li>
                <a href={PERMITS_URL} className="hover:text-white transition-colors">
                  Portland Permits
                </a>
              </li>
              <li>
                <a
                  href={`${PERMITS_URL}/zoning`}
                  className="hover:text-white transition-colors"
                >
                  Zoning Check
                </a>
              </li>
              <li>
                <a
                  href={`${PERMITS_URL}/fees`}
                  className="hover:text-white transition-colors"
                >
                  Fee Calculator
                </a>
              </li>
              <li>
                <a
                  href={`${PERMITS_URL}/timeline`}
                  className="hover:text-white transition-colors"
                >
                  Timeline Estimator
                </a>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-white transition-colors">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/open-data" className="hover:text-white transition-colors">
                  Open Data &amp; API
                </Link>
              </li>
              <li>
                <Link href="/records" className="hover:text-white transition-colors">
                  Public Records
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="hover:text-white transition-colors">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-[10px] font-mono font-semibold text-[var(--color-ember)] uppercase tracking-[0.2em] mb-4">
              Focus
            </h4>
            <ul className="text-[13px] space-y-2 text-white/65">
              <li>Dashboards that turn public data into a clear picture</li>
              <li>Surveys that measure what Portlanders actually think</li>
              <li>Permitting tools that cut the confusion before you apply</li>
              <li>More tools on the way — suggest one anytime</li>
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-white/50">
              Everything we build is open and public: you can see where the data
              comes from, how we got the numbers, and use the tools yourself.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-white/55">
            &copy; {year} Portland Civic Lab &middot; Public data, freely available
          </p>
          <div className="flex items-center gap-4 text-[12px] text-white/55">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
