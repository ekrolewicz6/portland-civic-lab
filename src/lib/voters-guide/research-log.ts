/**
 * The date of the newest entry in the voters' guide research log
 * (`src/app/(public)/voters-guide/research-log/page.tsx`). Every guide route
 * reports it as its last-modified date in the sitemap and in structured
 * data, so a crawler sees the guide change when the log says it changed.
 *
 * Update it in the same change as a new log entry; `tests/voters-guide/
 * research-log-date.test.ts` fails when the log's newest heading is newer.
 */
export const RESEARCH_LOG_UPDATED = "2026-10-08";
