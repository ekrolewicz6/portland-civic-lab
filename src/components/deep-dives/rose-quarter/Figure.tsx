import Image from "next/image";
import { RENDERINGS, CREDIT, type Rendering, type RenderingId } from "@/lib/rose-quarter/images";

/**
 * An ODOT image, always credited and always linked back to the original.
 *
 * `omits` is the reason this component exists rather than a bare <img>. An
 * agency's rendering is an argument as much as a depiction — it shows what the
 * agency wants seen. Where we know something material is missing from the
 * frame, it is printed directly under the picture rather than left for the
 * reader to notice.
 */
export default function Figure({
  id,
  priority,
  className = "",
}: {
  id: RenderingId;
  priority?: boolean;
  className?: string;
}) {
  const r: Rendering = RENDERINGS[id];
  return (
    <figure className={`overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white ${className}`}>
      <Image
        src={r.file}
        alt={r.alt}
        width={1600}
        height={900}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes="(max-width: 1024px) 100vw, 66vw"
        className="h-auto w-full"
      />
      <figcaption className="border-t border-[var(--color-parchment)] p-3 sm:p-4">
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-light)]">{r.caption}</p>
        {r.omits && (
          <p className="mt-1.5 border-l-2 border-[var(--color-clay)] pl-2.5 text-[12.5px] leading-relaxed text-[var(--color-ink-light)]">
            <strong className="text-[var(--color-ink)]">What it leaves out:</strong> {r.omits}
          </p>
        )}
        <p className="mt-2 font-mono text-[10.5px] uppercase tracking-wide text-[var(--color-ink-muted)]">
          {CREDIT} ·{" "}
          <a
            href={r.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[var(--color-parchment)] underline-offset-2 hover:decoration-[var(--color-river)]"
          >
            original
          </a>{" "}
          · retrieved {r.retrieved}
        </p>
      </figcaption>
    </figure>
  );
}
