# TODO

Running list of features that are temporarily hidden or deferred. Each entry
includes where it lives so it's easy to find when we come back to it.

## Hidden / Disabled Features

### Export CSV button
**Status:** Hidden in UI as of 2026-04-08
**Why:** Doesn't actually produce a working CSV yet
**Location:** `src/app/(public)/dashboard/[question]/page.tsx` — `<ExportButton />`
**To re-enable:** Wire up real CSV generation per question, then remove the
`hidden` prop / re-add the button to the action bar.

### Embed button
**Status:** Hidden in UI as of 2026-04-08
**Why:** Embed flow / iframe target is not built
**Location:** `src/app/(public)/dashboard/[question]/page.tsx` — `<EmbedButton />`
**To re-enable:** Build an `/embed/[question]` route that renders a stripped
chart-only view, then re-add the button.

### Other navigation modules
**Status:** Hidden from header as of 2026-04-08
**Why:** Site is dashboard-only for the initial launch
**Hidden modules:** Concierge, Business Directory, Spaces, Reports, Benefits Calculator
**Location:** `src/components/layout/Header.tsx` — old nav items removed
**To re-enable:** Add nav links back when each module is ready to ship.
