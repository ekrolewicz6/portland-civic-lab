import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { pageMeta } from "@/lib/page-meta";
import BudgetIllustration from "@/components/deep-dives/participatory-budgeting/BudgetIllustration";
import styles from "./participatory-budgeting.module.css";

export const metadata = pageMeta({
  title: "Measure 26-267: Portland participatory budgeting, explained",
  description:
    "An independent analysis of Portland’s 2026 participatory budgeting measure: the strongest YES and NO arguments, real budget tradeoffs, research, and both campaigns’ claims.",
  path: "/deep-dives/participatory-budgeting",
  type: "article",
});

// The website and research edition share one editorial source.
const report = readFileSync(
  join(process.cwd(), "research/participatory-budgeting-2026/independent-analysis.md"),
  "utf8",
);
const references = report.match(/^\[[^\]]+\]: .+$/gm)?.join("\n") ?? "";
const content = report.replace(/^\[[^\]]+\]: .+$/gm, "");
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
          <Link className={styles.back} href="/deep-dives">← All policy deep-dives</Link>
          <p className={styles.eyebrow}>Measure 26-267 · November 3, 2026</p>
          <h1>Who should decide Portland’s next public investments?</h1>
          <p className={styles.dek}>
            Participatory budgeting would give residents binding power over a share of public spending.
            It would also guarantee annual funding before Portland has tested this particular citywide system.
          </p>
          <div className={styles.arguments}>
            <div>
              <span>The strongest case for YES</span>
              <h2>Give resident power staying power.</h2>
              <p>A protected budget could make participation meaningful, include overlooked voices, and survive changes at City Hall.</p>
              <a href="#the-strongest-case-for-voting-yes">Examine the case for YES ↓</a>
            </div>
            <div>
              <span>The strongest case for NO</span>
              <h2>Test the model before locking in funding.</h2>
              <p>A permanent spending floor reduces flexibility while costs, voting rules, and delivery capacity remain unresolved.</p>
              <a href="#the-strongest-case-for-voting-no">Examine the case for NO ↓</a>
            </div>
          </div>
          <p className={styles.stance}>Independent analysis. No endorsement. Both choices involve real tradeoffs.</p>
          <div className={styles.facts}>
            <div><strong>2%</strong><span>Minimum based on prior-year adopted General Fund discretionary ongoing expenses. Not 2% of the entire budget.</span></div>
            <div><strong>$16.4M</strong><span>Preliminary FY2027–28 ballot estimate. Includes program administration; the formula determines the actual floor.</span></div>
            <div><strong>July 2028</strong><span>Latest start of the first PB process. Annual funding must begin by FY2027–28.</span></div>
          </div>
          <p className={styles.sourceLine}>
            Sources: <a href="https://www.portland.gov/auditor/elections/documents/pdx25ol-01-text-proposed-charter-change/download">filed amendment</a> and <a href="https://multco.us/file/measure_26-267/download">official ballot filing</a>.
          </p>
          <div className={styles.edition}>
            <span>Updated September 20, 2026</span>
            <span>Budget and original web review: September 17</span>
            <a href="#read-the-supplied-campaign-materials">Five PDFs + the full campaign presentation ↓</a>
          </div>
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
              {id === "follow-the-money-three-different-questions" && <BudgetIllustration />}
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
