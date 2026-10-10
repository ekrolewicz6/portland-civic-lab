import { ArrowUpRight } from "lucide-react";
import type { LabEvent } from "@/lib/events";

/**
 * The event's Luma registration widget, with a plain link under it for
 * readers whose browser blocks the frame. Luma stacks the widget below about
 * 670px wide (up to roughly 880px tall) and lays it out in a row above that
 * (about 500px), so the frame is tall on phones and short from md up, where
 * the reading column is wide enough for the row layout.
 */
export default function LumaRegistration({ event }: { event: LabEvent }) {
  return (
    <section id="register" className="scroll-mt-24" aria-labelledby="register-title">
      <h2 id="register-title" className="font-editorial text-[28px] leading-tight text-[var(--color-ink)] sm:text-[34px]">
        Register
      </h2>
      <iframe
        src={event.luma.embedUrl}
        title={`Register for ${event.title} on Luma`}
        loading="lazy"
        allow="fullscreen; payment"
        className="mt-4 block h-[900px] w-full rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] md:h-[540px]"
      />
      <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
        Registration runs on Luma, which emails you the confirmed details.{" "}
        <a
          href={event.luma.url}
          className="inline-flex items-center gap-1 font-semibold text-[var(--color-canopy)] hover:underline"
        >
          Open the Luma page
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </p>
    </section>
  );
}
