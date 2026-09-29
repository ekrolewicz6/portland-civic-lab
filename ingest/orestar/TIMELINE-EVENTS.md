# Fundraising timeline event catalogue

The interactive timeline uses the versioned public source catalogue at
`src/lib/campaign-finance/timeline-events.json`. This replaces the older event
selection for this interactive view only; the September 27 editorial evidence
and its downloads remain unchanged.

## September 29 review

Added dated budget proposals/hearings/votes, small-business tax relief, the
Campesinos Boulevard vote, and campaign activity documented in OPB's September
25 photographs. Photo-caption event dates are not the article's publication date.
These are a selection of relevant events, not a complete campaign calendar.

Moda is limited to four public Council anchors: June 24 and July 30 work
sessions, August 6 amendments (part of the August 5–6 hearing), and August 12
adoption. Removed the proposal, state legislation, draft delivery, county delay,
protest, and repeated reactions as separate chart anchors. This avoids treating
every development in one policy debate as a separate fundraising experiment.

## Recalculation and presentation

Both the active-database API and daily collector compute seven calendar days
before and after each anchor, excluding the anchor day, separately for every
cash metric and committee. Missing full windows remain null. Older verified
daily files retain their valid nonmatching comparisons; other metrics or new
anchors stay unavailable until recomputed, never silently substituted.

The figure shows every in-range event in three time-aligned lanes. Adjacent
events share touch-sized buttons on small screens. Exact-date ticks remain in
the plot; counts and the complete source list expose every event. No event is
selected by default. Peak cards rank complete Monday–Sunday weeks for the
selected committees and money type, not events' purported effects.

Source dates, committee choices, money basis, and incomplete windows matter:
nearby events overlap and the chart is descriptive, not a causal estimate.
The current JSON download carries the financial snapshot and catalogue version.
