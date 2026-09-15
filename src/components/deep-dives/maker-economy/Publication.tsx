import Link from 'next/link';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DIVE_CONTAINER } from '@/components/deep-dives/shared';
import { headingId, MAKER_PATH, makerDocuments } from '@/lib/maker-economy/publication';
import styles from './publication.module.css';

/** A semantic rendering of the article's production chain, with no client diagram runtime. */
function ProductionChain() {
  return (
    <figure className="my-8 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 sm:p-7">
      <figcaption className="mb-5 font-mono text-xs uppercase tracking-wider text-[var(--color-fern)]">
        Follow a real project
      </figcaption>
      <ol className={styles.chain}>
        {['Materials & equipment', 'Making & skilled work', 'Objects, repair & instruction', 'Customers & payments', 'Expenses & producer income'].map((step, index) => (
          <li key={step}><span className="mb-2 block font-mono text-xs text-[var(--color-fern)]">0{index + 1}</span>{step}</li>
        ))}
      </ol>
      <p className="mt-5 text-sm text-[var(--color-ink-light)]">Shared space and skills support making. Markets and referrals connect work to customers.</p>
    </figure>
  );
}

const components: Components = {
  h2: ({ children }) => <h2 id={headingId(String(children))}>{children}</h2>,
  a: ({ href, children }) => href?.startsWith('/')
    ? <Link href={href}>{children}</Link>
    : <a href={href}>{children}</a>,
  table: ({ children }) => <div className={styles.tableScroll} role="region" aria-label="Research table, scroll horizontally for more columns" tabIndex={0}><table>{children}</table></div>,
  pre: ({ children, node }) => {
    const code = node?.children[0];
    if (code?.type === 'element' && Array.isArray(code.properties.className) && code.properties.className.includes('language-mermaid')) {
      return <ProductionChain />;
    }
    return <pre>{children}</pre>;
  },
};

export default function MakerPublication({ document }: { document: typeof makerDocuments[number] }) {
  const isArticle = document.slug === '';
  const headings = [...document.body.matchAll(/^## (.+)$/gm)].map(match => match[1]);
  return (
    <article className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <header className="relative overflow-hidden bg-[var(--color-canopy)] py-14 text-white sm:py-20">
        <div className={DIVE_CONTAINER}>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-ember-bright)]">
            <Link href="/deep-dives" className="hover:underline">Policy deep-dives</Link> / Work, craft & the creative economy
          </p>
          <h1 className="mt-6 max-w-5xl font-editorial-normal text-[38px] leading-[1.08] tracking-tight sm:text-[56px] lg:text-[66px]">
            {isArticle ? <>Portland makes things.<span className="mt-2 block font-editorial italic text-[var(--color-ember-bright)]">How much of that economy can we see?</span></> : document.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            {isArticle ? 'What workshops and independent makers produce, whom they support, and what the evidence can tell us about their economic role.' : 'The evidence and research tools behind Portland Civic Lab’s investigation of the maker economy.'}
          </p>
          <p className="mt-7 font-mono text-xs text-white/65">Public-source research · Evidence reviewed September 15, 2026</p>
        </div>
      </header>
      <nav aria-label="Maker economy research" className="border-b border-[var(--color-parchment)] bg-white">
        <div className={`${DIVE_CONTAINER} flex flex-wrap gap-x-6 gap-y-3 py-5 text-sm`}>
          {makerDocuments.map(item => <Link key={item.slug} href={`${MAKER_PATH}${item.slug ? `/${item.slug}` : ''}`} aria-current={item.slug === document.slug ? 'page' : undefined} className={`underline-offset-4 hover:underline ${item.slug === document.slug ? 'font-semibold text-[var(--color-canopy)] underline' : 'text-[var(--color-ink-light)]'}`}>{item.label}</Link>)}
        </div>
      </nav>
      {isArticle ? <div className={`${DIVE_CONTAINER} pt-10`}>
        <dl className="grid gap-px overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-[var(--color-parchment)] sm:grid-cols-3">
          {[
            ['Measured in parts', 'Payroll, business receipts, commissions, and access to production.'],
            ['No citywide maker total', 'People, jobs, businesses, memberships, and visits count different things.'],
            ['Economic value, open questions', 'Outside demand and local purchases matter. Earnings and viability need better evidence.'],
          ].map(([title, description]) => <div key={title} className="bg-white p-6"><dt className="font-editorial text-2xl">{title}</dt><dd className="mt-3 text-sm leading-relaxed text-[var(--color-ink-light)]">{description}</dd></div>)}
        </dl>
      </div> : null}
      <div className={`${DIVE_CONTAINER} grid items-start gap-10 py-12 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16`}>
        <aside className="lg:sticky lg:top-24">
          <nav aria-label="On this page">
            <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-fern)]">On this page</h2>
            <ol className="mt-5 space-y-3 text-sm leading-snug">
              {headings.map(heading => <li key={heading}><a className="text-[var(--color-ink-light)] hover:text-[var(--color-canopy)] hover:underline" href={`#${headingId(heading)}`}>{heading}</a></li>)}
            </ol>
          </nav>
          <a className="mt-7 inline-block text-sm font-semibold text-[var(--color-canopy)] underline underline-offset-4" href="/data/maker-economy/data/ecosystem.csv">Download ecosystem inventory (CSV)</a>
          <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-light)]">A dated discovery list, not a census. Community questionnaires are prepared for a future pilot.</p>
        </aside>
        <div className={`${styles.prose} min-w-0 max-w-[850px]`}>
          <Markdown remarkPlugins={[remarkGfm]} components={components}>{document.body}</Markdown>
        </div>
      </div>
      <footer className="border-t border-[var(--color-parchment)] bg-[var(--color-paper-warm)] py-10">
        <div className={`${DIVE_CONTAINER} flex flex-wrap items-center justify-between gap-5 text-sm`}>
          <p>Explore the evidence, reproduce the calculations, or help close a gap.</p>
          <div className="flex flex-wrap gap-5 font-semibold text-[var(--color-canopy)]">
            <a className="underline underline-offset-4" href="https://github.com/ekrolewicz6/portland-civic-lab/tree/main/research/maker-economy">Research repository</a>
            <Link className="underline underline-offset-4" href="/contact?topic=Work%20on%20a%20topic&project=Portland%20maker%20economy">Work on this topic</Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
