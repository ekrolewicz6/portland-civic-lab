import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { pageMeta } from "@/lib/page-meta";
import styles from "../research.module.css";

export const metadata = pageMeta({
  title: "Measure 26-267: full research and source review",
  description:
    "An independent analysis of Portland’s 2026 participatory budgeting measure: the strongest YES and NO arguments, real budget tradeoffs, research, and both campaigns’ claims.",
  path: "/deep-dives/participatory-budgeting/research",
  type: "article",
});

// Preserve the complete original report, including its introduction and reference links.
const report = readFileSync(
  join(process.cwd(), "research/participatory-budgeting-2026/independent-analysis.md"),
  "utf8",
);
const references = report.match(/^\[[^\]]+\]: .+$/gm)?.join("\n") ?? "";
const content = report.replace(/^\[[^\]]+\]: .+$/gm, "");
const introduction = content.split(/^## /m)[0].replace(/^# .+\n/, "").trim();
const sections = [...content.matchAll(/^## (.+)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map(
  ([, title, body]) => ({
    title,
    body: `${body.trim()}\n\n${references}`,
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  }),
);

function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ children }) => (
          <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Comparison table; scroll horizontally on small screens">
            <table>{children}</table>
          </div>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

export default function ParticipatoryBudgetingPage() {
  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.container}>
          <Link className={styles.back} href="/deep-dives/participatory-budgeting">← Back to the visual voter guide</Link>
          <p className={styles.eyebrow}>Measure 26-267 · Research edition</p>
          <h1>The full research behind the voter guide.</h1>
          <div className={styles.section}><Markdown>{`${introduction}\n\n${references}`}</Markdown></div>
        </div>
      </header>

      <div className={`${styles.container} ${styles.layout}`}>
        <aside className={styles.rail}>
          <nav aria-label="In this analysis">
            <p>In this analysis</p>
            {sections.map(({ id, title }) => <a key={id} href={`#${id}`}>{title}</a>)}
          </nav>
          <div className={styles.campaigns}>
            <p>Read both campaigns</p>
            <a href="https://your2centspdx.com/">Your 2 Cents Portland ↗</a>
            <a href="https://www.protectourcityservices.org/">Protect Our City Services ↗</a>
            <span>Campaign claims are checked against the text and evidence below.</span>
          </div>
        </aside>
        <div className={styles.analysis}>
          {sections.map(({ id, title, body }, index) => (
            <section id={id} key={id} className={styles.section}>
              <p className={styles.sectionNumber}>{String(index + 1).padStart(2, "0")} / Analysis</p>
              <h2>{title}</h2>
              <Markdown>{body}</Markdown>
            </section>
          ))}
          <div className={styles.closing}>
            <Link href="/deep-dives/city-budget">Explore Portland’s adopted budget →</Link>
            <Link href="/voters-guide">Return to the voters’ guide →</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
