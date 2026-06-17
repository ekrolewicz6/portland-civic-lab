"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Trees, ClipboardList, MapPinned, ArrowUpRight } from "lucide-react";
import { ASK_PORTLAND_URL, PARKS_URL, PERMITS_URL } from "@/lib/site";
import type { HeaderMember } from "@/lib/member-nav";

const PRIMARY = [
  { label: "Dashboards", href: "/dashboard" },
  { label: "Deep-Dives", href: "/deep-dives" },
  { label: "Org Chart", href: "/org-chart" },
];

const TOOLS = [
  { label: "Parks Atlas", href: PARKS_URL, desc: "Every Portland park, mapped", icon: Trees, external: true },
  { label: "Ask Portland", href: ASK_PORTLAND_URL, desc: "Independent civic surveys", icon: ClipboardList, external: true },
  { label: "Permitting", href: PERMITS_URL, desc: "Zoning, fees & timelines", icon: MapPinned, external: true },
];

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none" className="transition-transform duration-300 group-hover:rotate-[8deg]">
        <path d="M14 2L6 8v12l8 6 8-6V8l-8-6z" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-sage)]" />
        <path d="M14 6l-4 3v8l4 3 4-3v-8l-4-3z" fill="currentColor" className="text-[var(--color-ember)]" opacity="0.85" />
        <circle cx="14" cy="14" r="2" fill="white" opacity="0.9" />
      </svg>
      <span className="font-editorial-normal text-[17px] tracking-tight text-white leading-none">
        Portland Civic Lab
      </span>
    </Link>
  );
}

function NavLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative py-1 text-[11px] font-mono uppercase tracking-[0.16em] transition-colors ${
        active ? "text-white" : "text-[var(--color-sage)] hover:text-white"
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-0.5 left-0 h-px bg-[var(--color-ember)] transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}

function MemberBadge({ member, compact = false }: { member: HeaderMember; compact?: boolean }) {
  return (
    <Link
      href="/member"
      className={`group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] text-white transition-colors hover:border-[var(--color-ember)]/45 hover:bg-white/[0.1] ${
        compact ? "px-1.5 py-1.5" : "px-2.5 py-1.5"
      }`}
      aria-label={`Member area for ${member.name}`}
    >
      <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[var(--color-ember)] text-[10px] font-mono font-bold uppercase tracking-[0.08em] text-[var(--color-canopy)] ring-1 ring-white/15">
        {member.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          member.initials
        )}
      </span>
      {!compact && (
        <span className="hidden lg:block text-left leading-none">
          <span className="block max-w-[120px] truncate text-[12px] font-semibold tracking-tight">
            {member.name}
          </span>
          <span className="mt-0.5 block text-[9px] font-mono uppercase tracking-[0.14em] text-[var(--color-sage)]">
            {member.role === "admin" ? "Admin" : "Member"}
          </span>
        </span>
      )}
    </Link>
  );
}

export default function Header({ member: initialMember = null }: { member?: HeaderMember | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [member, setMember] = useState<HeaderMember | null>(initialMember);
  const toolsRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (initialMember) return;
    let cancelled = false;
    fetch("/api/member/me", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.member) setMember(data.member);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [initialMember]);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setToolsOpen(false);
  }, [pathname]);

  // Click-outside + Escape for the Tools dropdown
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setToolsOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-[var(--color-canopy)]/95 backdrop-blur-sm text-white transition-shadow duration-300 ${
        scrolled ? "border-b border-white/10 shadow-[0_1px_24px_rgba(0,0,0,0.25)]" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14">
          <Wordmark />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {PRIMARY.map((l) => (
              <NavLink key={l.href} label={l.label} href={l.href} active={isActive(l.href)} />
            ))}

            {/* Tools dropdown */}
            <div
              ref={toolsRef}
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                onClick={() => setToolsOpen((v) => !v)}
                className="group flex items-center gap-1 py-1 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--color-sage)] hover:text-white transition-colors"
                aria-expanded={toolsOpen}
              >
                Tools
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsOpen && (
                <div className="absolute right-0 top-full pt-3 w-[320px] animate-fade-up" style={{ animationDuration: "0.18s" }}>
                  <div className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] shadow-[0_16px_48px_rgba(15,36,25,0.22)]">
                    <div className="px-4 pt-3 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-ember)]">
                      Civic tools
                    </div>
                    {TOOLS.map((t) => (
                      <a
                        key={t.label}
                        href={t.href}
                        className="group flex items-center gap-3 px-4 py-2.5 hover:bg-white transition-colors"
                      >
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm bg-[var(--color-canopy)]/[0.06] text-[var(--color-canopy)] group-hover:bg-[var(--color-ember)]/15 group-hover:text-[var(--color-clay)] transition-colors">
                          <t.icon className="w-4 h-4" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-1 text-[14px] font-semibold text-[var(--color-ink)]">
                            {t.label}
                            <ArrowUpRight className="w-3 h-3 text-[var(--color-ink-muted)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </span>
                          <span className="block text-[12px] text-[var(--color-ink-muted)] leading-snug">{t.desc}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="h-4 w-px bg-white/15" />

            <Link
              href="/contact"
              className={`text-[11px] font-mono uppercase tracking-[0.16em] transition-colors ${
                isActive("/contact") ? "text-white" : "text-white/55 hover:text-white"
              }`}
            >
              Contact
            </Link>
            {member ? (
              <MemberBadge member={member} />
            ) : (
              <Link
                href="/signup"
                className="rounded-sm bg-[var(--color-ember)] px-3.5 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[var(--color-canopy)] hover:bg-[var(--color-ember-bright)] transition-colors"
              >
                Join
              </Link>
            )}
          </nav>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-3">
            {member ? (
              <MemberBadge member={member} compact />
            ) : (
              <Link
                href="/signup"
                className="rounded-sm bg-[var(--color-ember)] px-3 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[var(--color-canopy)]"
              >
                Join
              </Link>
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-sm text-[var(--color-sage)] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[var(--color-canopy)] animate-slide-down">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-5 space-y-6">
            <MobileGroup title="Explore">
              {PRIMARY.map((l) => (
                <MobileLink key={l.href} href={l.href} label={l.label} active={isActive(l.href)} />
              ))}
            </MobileGroup>
            <MobileGroup title="Civic tools">
              {TOOLS.map((t) => (
                <MobileLink key={t.label} href={t.href} label={t.label} desc={t.desc} external />
              ))}
            </MobileGroup>
            <MobileGroup title="Connect">
              <MobileLink href="/contact" label="Contact" active={isActive("/contact")} />
              {member ? (
                <MobileLink
                  href="/member"
                  label={member.name}
                  desc={member.role === "admin" ? "Admin member area" : "Member area"}
                  active={isActive("/member")}
                />
              ) : (
                <MobileLink href="/signup" label="Join the lab" active={isActive("/signup")} />
              )}
            </MobileGroup>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-ember)] mb-2.5">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function MobileLink({
  href,
  label,
  desc,
  active,
  external,
}: {
  href: string;
  label: string;
  desc?: string;
  active?: boolean;
  external?: boolean;
}) {
  const cls = `flex items-center justify-between rounded-sm px-3 py-2.5 transition-colors ${
    active ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
  }`;
  const inner = (
    <>
      <span>
        <span className={`block text-[15px] ${active ? "text-white" : "text-[var(--color-sage)]"}`}>{label}</span>
        {desc && <span className="block text-[12px] text-white/45">{desc}</span>}
      </span>
      {external && <ArrowUpRight className="w-4 h-4 text-white/35" />}
    </>
  );
  return external ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
