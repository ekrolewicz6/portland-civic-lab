'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BASE } from '@/lib/campaign-finance/filters';
import s from './navigation.module.css';

const sections = [
  { href: BASE, label: 'Overview' },
  { href: `${BASE}/races`, label: 'Compare races' },
  { href: `${BASE}/suppliers`, label: 'Who gets paid' },
  { href: `${BASE}/statewide`, label: 'Statewide' },
];
const references = [
  { href: `${BASE}/questions`, label: 'Research questions', description: 'What we asked and what we found' },
  { href: `${BASE}/methodology`, label: 'Methods & gaps', description: 'How we counted, and what is missing' },
  { href: `${BASE}/evidence`, label: 'Evidence downloads', description: 'The data behind the analysis' },
  { href: `${BASE}/api-reference`, label: 'ORESTAR reference', description: 'Source tools and technical documentation' },
];

function Navigation({ pathname }: { pathname?: string }) {
  const active = (href: string) => pathname === href || (href !== BASE && pathname?.startsWith(`${href}/`));
  const exploring = active(`${BASE}/explorer`) || pathname?.startsWith(`${BASE}/entities/`);
  const readingReference = references.some(({ href }) => active(href));

  return <nav className={s.nav} aria-label="Campaign finance">
    <div className={s.wrap}>
      <div className={s.top}>
        <div className={s.identity}>
          <Link className={s.parent} href="/deep-dives">Deep dives <span aria-hidden="true">/</span></Link>
          <Link className={s.title} href={BASE}>Campaign finance</Link>
        </div>
        <Link className={s.explorer} href={`${BASE}/explorer`} aria-current={exploring ? (pathname === `${BASE}/explorer` ? 'page' : 'location') : undefined}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>
          Explore records
        </Link>
      </div>
      <div className={s.bottom}>
        <div className={s.sections}>
          {sections.map(({ href, label }) => <Link key={href} href={href} aria-current={active(href) ? (pathname === href ? 'page' : 'location') : undefined}>{label}</Link>)}
        </div>
        <details className={s.references} key={pathname} onKeyDown={event => {
          if (event.key === 'Escape' && event.currentTarget.open) {
            event.currentTarget.open = false;
            event.currentTarget.querySelector('summary')?.focus();
          }
        }}>
          <summary data-active={readingReference || undefined}>Research & sources <span className={s.chevron} aria-hidden="true"/></summary>
          <div className={s.referenceLinks}>
            {references.map(({ href, label, description }) => <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined} onClick={event => {
              const details = event.currentTarget.closest('details');
              if (details) details.open = false;
            }}><strong>{label}</strong><span>{description}</span></Link>)}
          </div>
        </details>
      </div>
    </div>
  </nav>;
}

export function FinanceNavigationFallback() {
  return <Navigation />;
}

export default function FinanceNavigation() {
  const pathname = usePathname();
  return <Navigation pathname={pathname ?? undefined} />;
}
