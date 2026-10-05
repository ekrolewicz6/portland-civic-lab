import Link from "next/link";
import localFont from "next/font/local";
import { ArrowLeft } from "lucide-react";
import { FIRE_AUTHORS } from "@/lib/oregon-fire/metadata";
import FireRidge from "./FireRidge";
import FireSectionNav, { type FireNavItem } from "./FireSectionNav";
import "@/app/(public)/oregon-fire/fire.css";

const editorial = localFont({ src: "../../lib/oregon-fire/fonts/CormorantGaramond-Medium.ttf", weight: "500", variable: "--font-editorial", display: "swap" });

export default function FireEditorialShell({
  children,
  eyebrow,
  title,
  intro,
  className = "",
  nav,
  navLabel = "On this page",
  back = { href: "/oregon-fire", label: "Fire in Oregon" },
  byline = true,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  intro: string;
  className?: string;
  nav?: FireNavItem[];
  navLabel?: string;
  back?: { href: string; label: string };
  byline?: boolean;
}) {
  return (
    <article className={`fire-page fire-editorial ${editorial.variable} ${className}`}>
      <header className="fire-editorial-hero">
        <div className="fire-wrap fire-editorial-hero-inner">
          <Link href={back.href} className="fire-editorial-back">
            <ArrowLeft size={16} aria-hidden="true" /> {back.label}
          </Link>
          <span className="fire-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{intro}</p>
          {byline && (
            <div className="fire-byline">
              <span>By {FIRE_AUTHORS.join(" & ")}</span>
              <span>Public evidence · Updated September 30, 2026</span>
            </div>
          )}
        </div>
        <FireRidge />
      </header>
      {nav && <FireSectionNav className="fire-story-nav" label={navLabel} items={nav} />}
      <div className="fire-wrap fire-editorial-body">{children}</div>
    </article>
  );
}
