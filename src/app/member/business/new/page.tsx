import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { withAuth } from "@workos-inc/authkit-nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getMemberByWorkOSId } from "@/lib/membership";
import { toHeaderMember } from "@/lib/member-nav";
import { createBusiness } from "@/lib/business";

export const metadata: Metadata = {
  title: "Register your business | Portland Civic Lab",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const OWNERSHIP_OPTIONS = [
  { value: "woman_owned", label: "Woman-owned" },
  { value: "minority_owned", label: "Minority-owned" },
  { value: "veteran_owned", label: "Veteran-owned" },
  { value: "lgbtq_owned", label: "LGBTQ+-owned" },
  { value: "immigrant_owned", label: "Immigrant-owned" },
  { value: "disability_owned", label: "Disability-owned" },
];

const MISSION_OPTIONS = [
  { value: "community_events", label: "Community events" },
  { value: "arts_culture", label: "Arts & culture" },
  { value: "literacy", label: "Literacy & education" },
  { value: "youth", label: "Youth programming" },
  { value: "sustainability", label: "Sustainability" },
  { value: "safe_space", label: "Safe space for marginalized communities" },
  { value: "accessibility", label: "Accessibility" },
  { value: "food_access", label: "Food access" },
];

const ENTITY_TYPES = [
  { value: "", label: "Not sure yet" },
  { value: "sole_prop", label: "Sole proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "LLC" },
  { value: "s_corp", label: "S corporation" },
  { value: "c_corp", label: "C corporation" },
  { value: "nonprofit", label: "Nonprofit" },
];

const REVENUE_BANDS = [
  { value: "", label: "Prefer not to say" },
  { value: "under_100k", label: "Under $100k" },
  { value: "100k_500k", label: "$100k – $500k" },
  { value: "500k_1m", label: "$500k – $1M" },
  { value: "1m_5m", label: "$1M – $5M" },
  { value: "over_5m", label: "Over $5M" },
];

const labelCls =
  "block text-[13px] font-semibold text-[var(--color-ink)] mb-1.5";
const inputCls =
  "w-full rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] px-3 py-2 text-[14px] text-[var(--color-ink)] focus:border-[var(--color-sage)] focus:outline-none";
const hintCls = "mt-1 text-[12px] text-[var(--color-ink-muted)]";

function optionalNumber(value: FormDataEntryValue | null): number | null {
  const n = Number(String(value ?? "").trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}

function optionalText(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

export default async function NewBusinessPage() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const member = await getMemberByWorkOSId(user.id);

  async function handleCreate(formData: FormData) {
    "use server";
    const { user: u } = await withAuth({ ensureSignedIn: true });
    const m = await getMemberByWorkOSId(u.id);
    if (!m || m.status !== "active") redirect("/member");

    const name = String(formData.get("name") ?? "").trim();
    if (name.length < 2) redirect("/member/business/new?error=name");

    const business = await createBusiness(
      {
        name,
        legalName: optionalText(formData.get("legalName")),
        entityType: optionalText(formData.get("entityType")),
        naicsCode: optionalText(formData.get("naicsCode")),
        description: optionalText(formData.get("description")),
        addressStreet: optionalText(formData.get("addressStreet")),
        addressZip: optionalText(formData.get("addressZip")),
        neighborhood: optionalText(formData.get("neighborhood")),
        website: optionalText(formData.get("website")),
        yearFounded: optionalNumber(formData.get("yearFounded")),
        employeeCount: optionalNumber(formData.get("employeeCount")),
        revenueBand: optionalText(formData.get("revenueBand")),
        ownershipAttributes: formData
          .getAll("ownershipAttributes")
          .map(String),
        missionTags: formData.getAll("missionTags").map(String),
      },
      m.id
    );

    redirect(`/member/business/${business.slug}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <Header member={toHeaderMember(user, member)} />

      <main className="flex-1 max-w-[820px] mx-auto w-full px-5 sm:px-8 py-12 sm:py-16">
        <Link
          href="/member"
          className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
        >
          ← Back to member area
        </Link>

        <h1 className="mt-5 font-editorial-normal text-[36px] sm:text-[42px] text-[var(--color-ink)] leading-tight">
          Register your business
        </h1>
        <p className="mt-3 text-[15px] text-[var(--color-ink-light)] leading-relaxed">
          Tell us this once. Portland Civic Lab uses it to search city, county,
          state, federal, and private programs for money you qualify for — then
          prepares the applications for you to review and submit.
        </p>
        <p className="mt-3 text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
          We don&apos;t ask for your EIN, SSN, or bank details, and we never
          will without telling you exactly which application needs them.
          Everything below except the name is optional — more detail means
          better matches.
        </p>

        <form action={handleCreate} className="mt-10 space-y-8">
          <fieldset className="space-y-5">
            <legend className="font-editorial text-[22px] text-[var(--color-ink)] mb-3">
              The basics
            </legend>

            <div>
              <label htmlFor="name" className={labelCls}>
                Business name <span className="text-[var(--color-clay)]">*</span>
              </label>
              <input id="name" name="name" required className={inputCls} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="legalName" className={labelCls}>
                  Legal name
                </label>
                <input id="legalName" name="legalName" className={inputCls} />
                <p className={hintCls}>If different from the trading name.</p>
              </div>
              <div>
                <label htmlFor="entityType" className={labelCls}>
                  Entity type
                </label>
                <select id="entityType" name="entityType" className={inputCls}>
                  {ENTITY_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelCls}>
                What does the business do?
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className={inputCls}
              />
              <p className={hintCls}>
                Plain language is fine. Mention what makes you unusual — the
                community programming, the mission, who you serve. That detail
                is what unlocks grants a generic business won&apos;t qualify
                for.
              </p>
            </div>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="font-editorial text-[22px] text-[var(--color-ink)] mb-3">
              Where and how big
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="addressStreet" className={labelCls}>
                  Street address
                </label>
                <input
                  id="addressStreet"
                  name="addressStreet"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="addressZip" className={labelCls}>
                  ZIP
                </label>
                <input id="addressZip" name="addressZip" className={inputCls} />
              </div>
              <div>
                <label htmlFor="neighborhood" className={labelCls}>
                  Neighborhood
                </label>
                <input
                  id="neighborhood"
                  name="neighborhood"
                  className={inputCls}
                />
                <p className={hintCls}>
                  Several grants are district-specific.
                </p>
              </div>
              <div>
                <label htmlFor="website" className={labelCls}>
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="yearFounded" className={labelCls}>
                  Year founded
                </label>
                <input
                  id="yearFounded"
                  name="yearFounded"
                  type="number"
                  min="1800"
                  max="2100"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="employeeCount" className={labelCls}>
                  Employees
                </label>
                <input
                  id="employeeCount"
                  name="employeeCount"
                  type="number"
                  min="0"
                  className={inputCls}
                />
                <p className={hintCls}>
                  Including part-time. Many programs have headcount caps.
                </p>
              </div>
              <div>
                <label htmlFor="revenueBand" className={labelCls}>
                  Annual revenue
                </label>
                <select id="revenueBand" name="revenueBand" className={inputCls}>
                  {REVENUE_BANDS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="naicsCode" className={labelCls}>
                  NAICS code
                </label>
                <input id="naicsCode" name="naicsCode" className={inputCls} />
                <p className={hintCls}>Leave blank if you don&apos;t know it.</p>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-editorial text-[22px] text-[var(--color-ink)] mb-1">
              Ownership
            </legend>
            <p className="text-[13px] text-[var(--color-ink-muted)] mb-4 leading-relaxed">
              Whole categories of funding are reserved for these. Check
              everything that applies to an owner holding a meaningful stake —
              certification requirements vary and we&apos;ll flag the ones that
              need 51%.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {OWNERSHIP_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className="flex items-center gap-2.5 text-[14px] text-[var(--color-ink-light)]"
                >
                  <input
                    type="checkbox"
                    name="ownershipAttributes"
                    value={o.value}
                    className="rounded-sm border-[var(--color-parchment)]"
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-editorial text-[22px] text-[var(--color-ink)] mb-1">
              What you do for the neighborhood
            </legend>
            <p className="text-[13px] text-[var(--color-ink-muted)] mb-4 leading-relaxed">
              Arts, literacy, and community-programming funders exist alongside
              the business ones. This is often where the money nobody else
              applies for lives.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MISSION_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className="flex items-center gap-2.5 text-[14px] text-[var(--color-ink-light)]"
                >
                  <input
                    type="checkbox"
                    name="missionTags"
                    value={o.value}
                    className="rounded-sm border-[var(--color-parchment)]"
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="pt-2">
            <button
              type="submit"
              className="rounded-sm bg-[var(--color-canopy)] px-6 py-3 text-[15px] font-semibold text-[var(--color-paper)] hover:bg-[var(--color-canopy-light)] transition-colors"
            >
              Create profile &amp; find funding
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
