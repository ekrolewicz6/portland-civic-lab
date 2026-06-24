import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms for using Portland Civic Lab: free public data and tools, provided in good faith, with honest caveats about accuracy.",
  alternates: { canonical: "https://www.portlandciviclab.org/terms" },
};

const EFFECTIVE_DATE = "June 10, 2026";

export default function TermsPage() {
  return (
    <div className="bg-[var(--color-paper)]">
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-18">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-[var(--color-ember)]" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
            Terms
          </span>
        </div>
        <h1 className="font-editorial-normal text-[36px] sm:text-[44px] text-[var(--color-ink)] leading-tight">
          Terms of Use
        </h1>
        <p className="mt-2 text-[13px] text-[var(--color-ink-muted)]">
          Effective {EFFECTIVE_DATE} · Operated by Portland Civic Lab LLC
        </p>

        <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-[var(--color-ink-light)]">
          <section>
            <h2 className="font-editorial text-[24px] text-[var(--color-ink)] mb-3">
              Use the data — that&apos;s why it&apos;s here
            </h2>
            <p>
              Everything on this site is free to read, cite, link, download,
              and build on. The underlying data comes from public government
              sources; our presentations, analyses, and code are open source
              under the AGPL-3.0 license (see the{" "}
              <a
                href="https://github.com/ekrolewicz6/portland-civic-lab"
                className="text-[var(--color-canopy)] underline"
              >
                repository
              </a>
              ). If you republish our charts or numbers, a link back is
              appreciated.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-[24px] text-[var(--color-ink)] mb-3">
              Accuracy, in plain terms
            </h2>
            <p>
              We work hard to present public data faithfully and we document
              known limitations on the{" "}
              <Link href="/methodology" className="text-[var(--color-canopy)] underline">
                methodology page
              </Link>
              . But government data has gaps, lags, and errors, and so will
              this site. Everything is provided as-is, without warranty.
              Don&apos;t use it as the sole basis for legal, financial, or
              safety decisions — verify against official sources, and{" "}
              <Link href="/contact" className="text-[var(--color-canopy)] underline">
                tell us
              </Link>{" "}
              when you spot something wrong so we can fix it.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-[24px] text-[var(--color-ink)] mb-3">
              We are not the City of Portland
            </h2>
            <p>
              Portland Civic Lab is an independent company. We are not
              affiliated with, endorsed by, or speaking for the City of
              Portland, Multnomah County, or any government agency. Tools like
              the permitting guides are practical aids, not official advice —
              the city&apos;s own processes and staff are always the
              authority.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-[24px] text-[var(--color-ink)] mb-3">
              Member accounts
            </h2>
            <p>
              Membership is free. We ask members to participate in good faith:
              no harassment, no deliberately false data reports, no scraping
              other members&apos; information. We may suspend accounts that
              abuse the platform. You can delete your account anytime via the{" "}
              <Link href="/contact" className="text-[var(--color-canopy)] underline">
                contact form
              </Link>
              . See the{" "}
              <Link href="/privacy" className="text-[var(--color-canopy)] underline">
                privacy policy
              </Link>{" "}
              for how we handle your information.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-[24px] text-[var(--color-ink)] mb-3">
              Supporting the Lab
            </h2>
            <p>
              The tools are free; support is voluntary. Portland Civic Lab LLC
              is a for-profit company, so contributions are not tax-deductible
              charitable donations — you&apos;re backing a company that gives its
              work away free. Payments are processed by Stripe; we never store
              your card details. You can cancel monthly support anytime through
              the{" "}
              <Link href="/contact" className="text-[var(--color-canopy)] underline">
                contact form
              </Link>
              , which stops any future charges, and if you ever want a recent
              one-time contribution back, just ask and we&apos;ll refund it.
            </p>
          </section>

          <section>
            <h2 className="font-editorial text-[24px] text-[var(--color-ink)] mb-3">
              The legal bits
            </h2>
            <p>
              This site is operated by Portland Civic Lab LLC, Portland,
              Oregon. To the maximum extent permitted by law, Portland Civic
              Lab LLC is not liable for damages arising from use of this site
              or its data. These terms are governed by Oregon law. We may
              update them as the project evolves; material changes will be
              noted here with a new effective date.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
