# Topic boards: comparing on the office's own choices

Written 2026-09-22 after reader feedback on the governor race: "I have to
constantly scroll back and forth, and when I click a topic it doesn't focus
on anything." This note records what a reader actually hits, why the code
produces it, and the redesign that replaces topic columns with topic boards.

## What a desktop reader hits today

Measured on the governor race with all ten topics added, production build,
Playwright at three common widths.

| Width | Grid width | Visible | Hidden to the right |
|---|---|---|---|
| 1440 | 2472px | 1320px | 1152px |
| 1280 | 2472px | 1232px | 1240px |
| 1024 | 2472px | 976px | 1496px |

1. **The comparison is wider than any screen.** Fourteen chip columns at
   148px each plus the name column is 2472px. Half the table is off-screen
   at every width, behind a 28px edge fade and, on a Mac, an invisible
   overlay scrollbar. Mouse users have no obvious way to move sideways.
2. **Opening a far-right chip shows an empty panel.** The detail row is a
   `<tr>` inside the scrolling table, so it is 2440px wide and starts at
   the table's left edge. After scrolling right to reach "Interstate
   bridge" and clicking it, the panel's name, question and cards sit
   1092px to the left of the viewport. The reader sees a blank warm box
   with Site, Full brief and × in its top-right corner. Nothing is scrolled
   into view either: at 900px tall, the panel's top lands at 704px, so only
   its header strip is on screen.
3. **Reading one topic across three candidates costs six scrolls.** Scroll
   right, click, scroll left to read, scroll right for the next candidate,
   and so on. Thirty chips for the governor race; 168 for a council race
   with eight topics and twenty-one candidates.
4. **Column headers break mid-word and lose their meaning.** Eleven-point
   uppercase mono with 0.08em tracking in a 150px column wraps
   "TRANSPORTATION TAXES" onto three lines and, at some widths, splits
   "TRANSPORTATIO / N". Inside the scroller the headers also stop sticking
   vertically, because a sticky offset inside an overflow container is
   measured from the container, not the viewport; on a 21-row race the
   labels are gone after one screen of scrolling.
5. **The layout jumps as topics are added.** One or two topics widen the
   chips; a third switches the whole grid into a scroller with a sticky
   name column and a 1320px breakout. The reader did not ask for a mode
   change.

## Why the code does that

`StanceGrid` renders one `<table>` with a column per issue and per added
topic (`extra`), `table-layout: fixed`, and, past two topics, an
`overflow-x: auto` wrapper (`.wrap[data-scroll]`) with a sticky first
column. The detail is a row of that table (`colSpan={columns}`), so it
inherits the table's width and lives inside the scrollport. The topic set
is unbounded (10 for the governor, 9 for Multnomah, 8 for Council), so the
table's width is unbounded too. Nothing scrolls the opened detail into
view.

## The question readers are asking

A grid answers "who is roughly where on the four issues" at a glance, and
four columns fit on every screen. The topics answer a different question:
"on this choice, what did each of them say, and where is the source?" That
is one question and N answers, which is a vertical list, not a fifteenth
column. It is also what the featured-votes panel already does on Council
pages, one `<details>` per question with every candidate beneath.

## The redesign

- **The grid stays four columns and never scrolls sideways.** Topic columns,
  the picker, the breakout and the sticky column are removed. The detail
  panel is always full width, and opening a chip scrolls the panel into
  view when it would land off-screen.
- **Each topic is a board beneath the grid.** A `<details>` row per topic:
  the label, the plain question, and "N of M on record" with the names of
  whoever is missing when the field is small. Open, it shows the context
  line and then every candidate A–Z: portrait and name, the recorded vote
  or the short reading as a static pill, the sentence, and the source chip.
  A gap is a one-line row that says so. Nothing needs a click to read.
- **Open all** shows every board at once, which is the "who has said
  nothing about what" view readers asked for, without a 2472px table.
- **Deep links keep working.** `#topics=a,b` opens those boards (and the
  share link carries them); `#topic-<id>` opens one and scrolls to it.
- **Phones get the same boards.** The issue rail still picks which column
  the cards show; topics no longer add rows to every card.

The toolbar's "Compare on more topics" control becomes a jump to the
boards with the count. The Stakes block's pointer to the Topics control
now points to the boards.
