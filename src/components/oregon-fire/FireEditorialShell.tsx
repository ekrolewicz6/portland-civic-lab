import Link from "next/link";
import localFont from "next/font/local";
import { FIRE_AUTHORS } from "@/lib/oregon-fire/metadata";
import "@/app/(public)/oregon-fire/fire.css";
import "@/app/(public)/oregon-fire/guide.css";
import "@/app/(public)/oregon-fire/editorial.css";

const editorial = localFont({ src: "../../lib/oregon-fire/fonts/CormorantGaramond-Medium.ttf", weight: "500", variable: "--font-editorial", display: "swap" });
export default function FireEditorialShell({ children, eyebrow, title, intro }: { children: React.ReactNode; eyebrow: string; title: string; intro: string }) {
  return <article className={`fire-page fire-editorial ${editorial.variable}`}>
    <header className="fire-editorial-hero"><Link href="/oregon-fire" className="fire-editorial-back">← Fire in Oregon</Link><span className="fire-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p><div className="fire-byline"><span>By {FIRE_AUTHORS.join(" & ")}</span><span>Public evidence · September 26, 2026</span></div></header>
    <div className="fire-editorial-body">{children}</div>
  </article>;
}
