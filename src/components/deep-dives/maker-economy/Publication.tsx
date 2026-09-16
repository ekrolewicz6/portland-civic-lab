import Link from 'next/link';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DIVE_CONTAINER } from '@/components/deep-dives/shared';
import { headingId, MAKER_PATH, makerDocuments } from '@/lib/maker-economy/publication';
import MakerFigure from './Figures';
import styles from './publication.module.css';

const components: Components = {
  h2: ({ children }) => <h2 id={headingId(String(children))}>{children}</h2>,
  a: ({ href, children }) => href?.startsWith('/') ? <Link href={href}>{children}</Link> : <a href={href}>{children}</a>,
  table: ({ children }) => <div className={styles.tableScroll} role="region" aria-label="Research table, scroll horizontally for more columns" tabIndex={0}><table>{children}</table></div>,
  pre: ({ children, node }) => {
    const code = node?.children[0];
    if (code?.type === 'element' && Array.isArray(code.properties.className) && code.properties.className.includes('language-maker-figure')) {
      const name = code.children.filter(n => n.type === 'text').map(n => n.type === 'text' ? n.value : '').join('').trim();
      return <MakerFigure name={name} />;
    }
    return <pre>{children}</pre>;
  },
};

export default function MakerPublication({ document }: { document: typeof makerDocuments[number] }) {
  const isArticle = document.slug === '';
  const headings = [...document.body.matchAll(/^## (.+)$/gm)].map(match => match[1]);
  return (
    <article className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <header className={`${styles.hero} ${isArticle ? styles.articleHero : ''}`}>
        <div className={DIVE_CONTAINER}>
          <p className={styles.kicker}><Link href="/deep-dives">Portland Civic Lab / Deep dives</Link><span>Work & the maker economy</span></p>
          <h1 className={styles.title}>{isArticle ? <>The work behind<br /><em>Portland’s handmade city.</em></> : document.title}</h1>
          <p className={styles.dek}>{isArticle ? 'Inside the workshops, home studios, small businesses, and markets that turn Portland’s skills into objects—and income.' : 'Evidence, methods, and research tools for understanding Portland’s maker economy.'}</p>
          <p className={styles.byline}>Public-source investigation <span>·</span> Revised September 15, 2026</p>
          {isArticle && <div className={styles.chapterLinks}><a href="#counting-starts-with-names">Explore the names <span>↗</span></a><a href="#what-the-business-records-already-show">Follow the money <span>↗</span></a><a href="#a-sale-is-only-the-beginning-of-an-income">Try the sales model <span>↗</span></a></div>}
        </div>
      </header>
      <nav aria-label="Maker economy research" className="border-b border-[var(--color-parchment)] bg-white">
        <div className={`${DIVE_CONTAINER} flex flex-wrap gap-x-6 gap-y-3 py-5 text-xs`}>
          {makerDocuments.map(item => <Link key={item.slug} href={`${MAKER_PATH}${item.slug ? `/${item.slug}` : ''}`} aria-current={item.slug === document.slug ? 'page' : undefined} className={`underline-offset-4 hover:underline ${item.slug === document.slug ? 'font-semibold text-[var(--color-canopy)] underline' : 'text-[var(--color-ink-light)]'}`}>{item.label}</Link>)}
        </div>
      </nav>
      <div className={`${DIVE_CONTAINER} ${styles.articleGrid}`}>
        <aside className={styles.contents}>
          <nav aria-label="On this page"><h2>In this investigation</h2><ol>{headings.map((heading,i) => <li key={heading}><a href={`#${headingId(heading)}`}><span>{String(i+1).padStart(2,'0')}</span>{heading.replace(/^\d+\. /,'')}</a></li>)}</ol></nav>
          <a className={styles.download} href="/data/maker-economy/data/directory-listings.csv">The public listing register ↓</a>
        </aside>
        <div className={`${styles.prose} min-w-0`}><Markdown remarkPlugins={[remarkGfm]} components={components}>{document.body}</Markdown></div>
      </div>
      <footer className="border-t border-[var(--color-parchment)] bg-[var(--color-paper-warm)] py-10">
        <div className={`${DIVE_CONTAINER} flex flex-wrap items-center justify-between gap-5 text-sm`}><p>Help make the picture of Portland’s makers more complete.</p><div className="flex flex-wrap gap-5 font-semibold text-[var(--color-canopy)]"><a className="underline underline-offset-4" href="https://github.com/ekrolewicz6/portland-civic-lab/tree/main/research/maker-economy">Research repository</a><Link className="underline underline-offset-4" href="/contact?topic=Work%20on%20a%20topic&project=Portland%20maker%20economy">Work on this topic</Link></div></div>
      </footer>
    </article>
  );
}
