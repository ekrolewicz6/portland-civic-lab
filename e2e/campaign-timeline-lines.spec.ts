import { test, expect, type Locator, type Page } from '@playwright/test';
import frozen from '../src/lib/campaign-finance/campaign-dynamics.json';
import { money } from '../src/lib/campaign-finance/filters';
import { buildEventWindows } from '../src/lib/campaign-finance/timeline';
import { readingText } from '../src/lib/campaign-finance/timeline-lines';

// The four District 3 campaigns the chart opens on, in the order their lines are painted.
const OPENING = ['23208', '23028', '15109', '24897'];
const LATE_MARCH = '2026-03-23';
type Weekly = typeof frozen.weekly;
type Cash = keyof Weekly[number]['weekly'];
const nameOf = (id: string) => frozen.candidates.find(candidate => candidate.committeeId === id)!.name;
const rowsOf = (weekly: Weekly, id: string, from = LATE_MARCH) => weekly.filter(row => row.committeeId === id && row.weekEnd >= from).sort((a, b) => a.weekEnd.localeCompare(b.weekEnd));
/** The words the chart should show for one point, worked out from the data file. */
const words = (row: Weekly[number], mode: 'cumulative' | 'weekly', basis: Cash = 'nonmatching_cents') => readingText(mode, money(row[mode][basis]), row.weekStart, row.weekEnd);

/**
 * Errors the page throws while these tests run. React's hydration error #418 is left out:
 * it appears on this page only on the CI runner, predates these lines, and
 * e2e/campaign-timeline.spec.ts still fails on it.
 */
function pageErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', error => { if (!error.message.includes('Minified React error #418')) errors.push(error.message); });
  return errors;
}

/** Open the page with a fixed set of filings, so every expected amount can be read from the same file. */
async function open(page: Page, weekly: Weekly = frozen.weekly) {
  const fixture = { ...frozen, weekly, events: buildEventWindows(frozen.candidates.map(candidate => candidate.committeeId), '2025-01-01', frozen.end, () => 100), refresh: { status: 'validated' } };
  await page.route('**/api/campaign-finance/daily', route => route.fulfill({ json: fixture }));
  await page.goto('/deep-dives/campaign-finance');
  const chart = page.locator('#cumulative-fundraising');
  await expect(chart.getByRole('status')).toContainText('Filings through');
  await bring(chart.locator('[data-plot]'));
  return { chart, plot: chart.locator('[data-plot]'), tip: chart.locator('[data-tip]'), pick: chart.locator('[data-pick]'), lifted: chart.locator('svg g[data-lifted]'), names: chart.locator('[class*="lineKey"]') };
}

/** Wait out a smooth scroll before reading positions. */
const settle = (page: Page) => expect.poll(async () => {
  const before = await page.evaluate(() => window.scrollY);
  await page.waitForTimeout(150);
  return await page.evaluate(() => window.scrollY) === before;
}).toBe(true);

/**
 * Put the chart a little below the sticky site header. The site scrolls smoothly, so any
 * scroll already under way is waited out and the jump itself does not animate.
 */
async function bring(plot: Locator) {
  await settle(plot.page());
  await plot.evaluate(node => window.scrollBy({ top: node.getBoundingClientRect().top - 140, behavior: 'instant' }));
}

/** Where one week of one candidate's line sits on screen, counted back from the latest week. Brings the chart on screen first. */
async function pointOn(chart: Locator, id: string, fromEnd = 0) {
  await bring(chart.locator('[data-plot]'));
  return chart.locator('[data-plot] svg').evaluate((svg, [series, back]) => {
    const box = svg.getBoundingClientRect(), view = (svg as SVGSVGElement).viewBox.baseVal;
    const points = [...svg.querySelector<SVGPolylineElement>(`g[data-series="${series}"] polyline`)!.points];
    const point = points[points.length - 1 - (back as number)];
    return { x: box.left + point.x * box.width / view.width, y: box.top + point.y * box.height / view.height };
  }, [id, fromEnd] as const);
}
/** The reading stays inside the chart on every side, so it never hides a control or scrolls the page sideways. */
const insidePlot = async (tip: Locator, plot: Locator) => {
  const [inner, outer] = [(await tip.boundingBox())!, (await plot.boundingBox())!];
  expect(inner.x).toBeGreaterThanOrEqual(outer.x - 1);
  expect(inner.x + inner.width).toBeLessThanOrEqual(outer.x + outer.width + 1);
  expect(inner.y).toBeGreaterThanOrEqual(outer.y - 1);
  expect(inner.y + inner.height).toBeLessThanOrEqual(outer.y + outer.height + 1);
};
const noSidewaysScroll = async (page: Page) => expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

for (const width of [390, 1440]) {
  test.describe(`fundraising timeline lines at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    test.describe.configure({ timeout: 90_000 });

    test('pointing at a line names the candidate, the amount, the week and the money counted', async ({ page }) => {
      const errors = pageErrors(page);
      const { chart, plot, tip, pick, lifted } = await open(page);
      const id = OPENING[1], row = rowsOf(frozen.weekly, id).at(-3)!;
      await expect(tip).toHaveCount(0);
      await expect(pick.getByText('Point at a line to see whose it is.')).toBeVisible();

      const at = await pointOn(chart, id, 2);
      await page.mouse.move(at.x, at.y);
      await expect(tip).toContainText(nameOf(id));
      await expect(tip).toContainText(words(row, 'cumulative'));
      await expect(tip).toContainText('Money shown: Without City matches');
      await insidePlot(tip, plot);
      await noSidewaysScroll(page);

      // The line stands out by more than its color: it is redrawn thicker on top and the others fade.
      await expect(lifted).toHaveAttribute('data-lifted', id);
      const strokes = await chart.locator('svg').evaluate(svg => ({
        lifted: Number(svg.querySelector('g[data-lifted] polyline:last-of-type')!.getAttribute('stroke-width')),
        plain: Number(svg.querySelector('g[data-series] polyline')!.getAttribute('stroke-width')),
        lastGroup: svg.querySelector('g[data-lifted]') === [...svg.querySelectorAll('g')].at(-1),
      }));
      expect(strokes.lifted).toBeGreaterThan(strokes.plain);
      expect(strokes.lastGroup).toBe(true);
      for (const other of OPENING) await expect.poll(() => chart.locator(`svg g[data-series="${other}"]`).evaluate(node => Number(getComputedStyle(node).opacity))).toBe(other === id ? 1 : 0.28);

      // Nothing in the figure, the reading included, is set under 12px.
      const small = await chart.evaluate(figure => [...figure.querySelectorAll<HTMLElement>('*')]
        .filter(node => !(node instanceof SVGElement) && !node.closest('svg') && node.getClientRects().length && [...node.childNodes].some(child => child.nodeType === 3 && child.textContent!.trim()))
        .filter(node => parseFloat(getComputedStyle(node).fontSize) < 12).map(node => `${node.tagName} ${node.textContent!.slice(0, 40)}`));
      expect(small).toEqual([]);

      // Moving along the line reads other weeks. Moving away puts everything back.
      const earlier = await pointOn(chart, id, 9);
      await page.mouse.move(earlier.x, earlier.y);
      await expect(tip).toContainText(words(rowsOf(frozen.weekly, id).at(-10)!, 'cumulative'));
      await page.mouse.move(2, 2);
      await expect(tip).toHaveCount(0);
      await expect(lifted).toHaveCount(0);
      expect(errors).toEqual([]);
    });

    test('a clicked line stays picked out through view, money, period and candidate changes', async ({ page }) => {
      const { chart, tip, pick, lifted, names } = await open(page);
      const id = OPENING[0], row = rowsOf(frozen.weekly, id).at(-5)!;
      const at = await pointOn(chart, id, 4);
      await page.mouse.click(at.x, at.y);
      await page.mouse.move(2, 2);
      await expect(tip).toContainText(nameOf(id));
      await expect(tip).toContainText(words(row, 'cumulative'));
      await expect(names.locator(`button[data-series="${id}"]`)).toHaveAttribute('aria-pressed', 'true');
      await expect(pick).toContainText(nameOf(id));

      // The same week, read in the other view and with other money counted.
      await chart.getByRole('button', { name: 'Each week', exact: true }).click();
      await expect(tip).toContainText(words(row, 'weekly'));
      await chart.getByLabel('Money shown', { exact: true }).selectOption('cash_cents');
      await expect(tip).toContainText(words(row, 'weekly', 'cash_cents'));
      await expect(tip).toContainText('Money shown: All cash');
      await chart.getByRole('button', { name: 'Running total', exact: true }).click();
      await expect(tip).toContainText(words(row, 'cumulative', 'cash_cents'));

      // A longer period keeps the week. A period that starts after the week moves the reading to its first week.
      await chart.getByLabel('Time period', { exact: true }).selectOption('2025-01-01');
      await expect(tip).toContainText(words(row, 'cumulative', 'cash_cents'));
      await chart.locator('[data-plot]').focus();
      await page.keyboard.press('Home');
      await expect(tip).toContainText(words(rowsOf(frozen.weekly, id, '2025-01-01')[0], 'cumulative', 'cash_cents'));
      await chart.getByLabel('Time period', { exact: true }).selectOption(LATE_MARCH);
      await expect(tip).toContainText(words(rowsOf(frozen.weekly, id)[0], 'cumulative', 'cash_cents'));
      await expect(lifted).toHaveAttribute('data-lifted', id);

      // Clicking the same line again lets it go, as does the button.
      const again = await pointOn(chart, id, 4);
      await page.mouse.click(again.x, again.y);
      await page.mouse.move(2, 2);
      await expect(tip).toHaveCount(0);
      await page.mouse.click(again.x, again.y);
      await page.mouse.move(2, 2);
      await expect(tip).toContainText(nameOf(id));
      await chart.getByRole('button', { name: 'Show all lines' }).click();
      await expect(tip).toHaveCount(0);
      await expect(lifted).toHaveCount(0);

      // Unticking the picked candidate drops the reading, and it does not come back with the line.
      const end = await pointOn(chart, id);
      await page.mouse.click(end.x, end.y);
      await page.mouse.move(2, 2);
      await expect(tip).toContainText(nameOf(id));
      await chart.locator('summary', { hasText: 'Compare candidates' }).click();
      await chart.getByRole('checkbox', { name: nameOf(id) }).uncheck();
      await expect(tip).toHaveCount(0);
      await expect(chart.locator(`svg g[data-series="${id}"]`)).toHaveCount(0);
      await chart.getByRole('checkbox', { name: nameOf(id) }).check();
      await expect(chart.locator(`svg g[data-series="${id}"]`)).toHaveCount(1);
      await expect(tip).toHaveCount(0);

      // A new race starts with every line shown.
      await names.locator(`button[data-series="${id}"]`).click();
      await expect(tip).toContainText(nameOf(id));
      await chart.getByRole('button', { name: 'District 4', exact: true }).click();
      await expect(tip).toHaveCount(0);
      await expect(chart.getByRole('button', { name: 'Show all lines' })).toHaveCount(0);
    });

    test('a name in the legend lifts its line, and a click keeps it lifted', async ({ page }) => {
      const { chart, plot, tip, lifted, names } = await open(page);
      const id = OPENING[2], latest = rowsOf(frozen.weekly, id).at(-1)!;
      const name = names.locator(`button[data-series="${id}"]`);
      await expect(name).toContainText(`${nameOf(id)}: ${money(latest.cumulative.nonmatching_cents)} total`);
      await name.hover();
      await expect(tip).toContainText(nameOf(id));
      await expect(tip).toContainText(words(latest, 'cumulative'));
      await expect(lifted).toHaveAttribute('data-lifted', id);
      await name.click();
      await page.mouse.move(2, 2);
      await expect(tip).toContainText(nameOf(id));
      await expect(name).toHaveAttribute('aria-pressed', 'true');
      await expect(plot).toBeInViewport({ ratio: 0.6 });
      await name.click();
      await page.mouse.move(2, 2);
      await expect(tip).toHaveCount(0);
      await expect(name).toHaveAttribute('aria-pressed', 'false');
    });

    test('arrow keys read along a line and across candidates', async ({ page }) => {
      const { chart, plot, tip, pick, lifted } = await open(page);
      const [first, second] = OPENING;
      const rows = rowsOf(frozen.weekly, first), others = rowsOf(frozen.weekly, second);
      // Reach the chart the way a keyboard does, from the control before it.
      await chart.getByRole('button', { name: 'Each week', exact: true }).focus();
      await page.keyboard.press('Tab');
      await expect(plot).toBeFocused();
      await expect(plot).toHaveAttribute('role', 'application');
      await expect(plot).toHaveAttribute('aria-label', /Arrow keys: left and right move week by week, up and down change candidate/);
      await expect(pick).toContainText('Left and right arrows move week by week.');
      await settle(page);
      const scrolled = await page.evaluate(() => window.scrollY);

      await page.keyboard.press('ArrowDown');
      await expect(tip).toContainText(nameOf(first));
      await expect(tip).toContainText(words(rows.at(-1)!, 'cumulative'));
      await expect(plot.locator('[aria-live]')).toHaveText(`${nameOf(first)}: ${words(rows.at(-1)!, 'cumulative')}. Money shown: Without City matches.`);
      await expect(lifted).toHaveAttribute('data-lifted', first);
      await page.keyboard.press('ArrowLeft');
      await expect(tip).toContainText(words(rows.at(-2)!, 'cumulative'));
      await page.keyboard.press('ArrowDown');
      await expect(tip).toContainText(nameOf(second));
      await expect(tip).toContainText(words(others.at(-2)!, 'cumulative'));
      await expect(plot.locator('[aria-live]')).toContainText(nameOf(second));
      await page.keyboard.press('ArrowUp');
      await expect(tip).toContainText(nameOf(first));
      await page.keyboard.press('PageUp');
      await expect(tip).toContainText(words(rows.at(-6)!, 'cumulative'));
      await page.keyboard.press('Home');
      await expect(tip).toContainText(words(rows[0], 'cumulative'));
      await page.keyboard.press('End');
      await expect(tip).toContainText(words(rows.at(-1)!, 'cumulative'));
      await page.keyboard.press('ArrowUp');
      await expect(tip).toContainText(nameOf(OPENING.at(-1)!));
      // The keys move the reading and leave the page where it was.
      expect(await page.evaluate(() => window.scrollY)).toBe(scrolled);

      // The other view is announced for the same week without another key press.
      await page.keyboard.press('ArrowDown');
      await chart.getByRole('button', { name: 'Each week', exact: true }).click();
      await expect(plot.locator('[aria-live]')).toHaveText(`${nameOf(first)}: ${words(rows.at(-1)!, 'weekly')}. Money shown: Without City matches.`);
      await plot.focus();
      await insidePlot(tip, plot);
      await page.keyboard.press('Escape');
      await expect(tip).toHaveCount(0);
      await expect(lifted).toHaveCount(0);
      await expect(plot.locator('[aria-live]')).toHaveText('All lines are shown.');
      await noSidewaysScroll(page);
    });

    test('lines that sit on top of each other can each be read', async ({ page }) => {
      // Two campaigns are given identical filings, so one line hides the other completely.
      const [under, over] = [OPENING[2], OPENING[3]];
      const weekly = frozen.weekly.map(row => row.committeeId === over ? { ...frozen.weekly.find(twin => twin.committeeId === under && twin.weekStart === row.weekStart)!, committeeId: over } : row);
      const { chart, plot, tip, lifted, names } = await open(page, weekly);
      const row = rowsOf(weekly, under).at(-4)!;
      const at = await pointOn(chart, under, 3);
      // The pointer finds the line painted on top, and the reading says who else is there.
      await page.mouse.move(at.x, at.y);
      await expect(tip).toContainText(nameOf(over));
      await expect(tip).toContainText(words(row, 'cumulative'));
      await expect(tip).toContainText(`Same amount: ${nameOf(under)}`);
      await expect(lifted).toHaveAttribute('data-lifted', over);
      // The hidden one answers to its name and to the keys.
      await names.locator(`button[data-series="${under}"]`).click();
      await page.mouse.move(2, 2);
      await expect(tip).toContainText(nameOf(under));
      await expect(tip).toContainText(`Same amount: ${nameOf(over)}`);
      await expect(lifted).toHaveAttribute('data-lifted', under);
      await plot.focus();
      await page.keyboard.press('ArrowDown');
      await expect(tip).toContainText(nameOf(over));
      await expect(plot.locator('[aria-live]')).toContainText(`Same amount: ${nameOf(under)}.`);
      await page.keyboard.press('ArrowUp');
      await expect(lifted).toHaveAttribute('data-lifted', under);
      // While one of the pair is being read, a pointer resting on both stays with it, and a click lets it go.
      const again = await pointOn(chart, under, 3);
      await page.mouse.move(again.x, again.y);
      await page.mouse.move(again.x + 1, again.y);
      await expect(tip).toContainText(nameOf(under));
      await expect(tip).toContainText(words(row, 'cumulative'));
      await insidePlot(tip, plot);
      await page.mouse.click(again.x + 1, again.y);
      await page.mouse.move(2, 2);
      await expect(tip).toHaveCount(0);
    });

    test('a candidate with no weekly totals is left out of the reading, and an empty chart stays quiet', async ({ page }) => {
      const errors = pageErrors(page);
      const missing = OPENING[1];
      const { chart, plot, tip, pick, names } = await open(page, frozen.weekly.filter(row => row.committeeId !== missing));
      await expect(chart.locator('svg g[data-series]')).toHaveCount(OPENING.length - 1);
      await expect(names.locator('button')).toHaveCount(OPENING.length - 1);
      await expect(names).toContainText(`${nameOf(missing)}: no weekly totals on file`);
      await plot.focus();
      for (const id of [...OPENING.filter(item => item !== missing), OPENING[0]]) {
        await page.keyboard.press('ArrowDown');
        await expect(tip).toContainText(nameOf(id));
      }
      await page.keyboard.press('Escape');

      // With no filings at all there is nothing to point at, and the chart says so.
      await page.unroute('**/api/campaign-finance/daily');
      const empty = await open(page, []);
      await expect(empty.chart.locator('svg g[data-series]')).toHaveCount(0);
      await expect(empty.pick).toContainText('No weekly totals are on file for these candidates in this period.');
      const box = (await empty.plot.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowLeft');
      await expect(empty.tip).toHaveCount(0);
      await expect(pick.getByRole('button')).toHaveCount(0);
      expect(errors).toEqual([]);
    });

    test.describe('by touch', () => {
      test.use({ hasTouch: true });
      test('a tap picks the nearest line, a sideways drag reads along it, and an upward drag still scrolls', async ({ page }) => {
        const { chart, plot, tip, pick, lifted, names } = await open(page);
        const id = OPENING[1], rows = rowsOf(frozen.weekly, id);
        await expect(plot).toHaveCSS('touch-action', 'pan-y');
        await expect(pick).toContainText('Tap a line or a name to pick out one candidate.');
        const at = await pointOn(chart, id, 2);
        await page.touchscreen.tap(at.x, at.y + 4);
        await expect(tip).toContainText(nameOf(id));
        await expect(tip).toContainText(words(rows.at(-3)!, 'cumulative'));
        await expect(tip).toContainText('Money shown: Without City matches');
        await expect(lifted).toHaveAttribute('data-lifted', id);
        await insidePlot(tip, plot);
        await noSidewaysScroll(page);

        // A second tap farther along the same line moves the reading. It does not let the line go.
        const farther = await pointOn(chart, id, 8);
        await page.touchscreen.tap(farther.x, farther.y);
        await expect(tip).toContainText(words(rows.at(-9)!, 'cumulative'));

        // A finger dragged sideways reads week after week along the picked line, wherever it wanders vertically.
        const touch = await page.context().newCDPSession(page);
        const target = await pointOn(chart, id, 14);
        await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: farther.x, y: farther.y }] });
        for (let step = 1; step <= 6; step++) await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: farther.x + (target.x - farther.x) * step / 6, y: farther.y - 3 * step }] });
        await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await expect(tip).toContainText(nameOf(id));
        await expect(tip).toContainText(words(rows.at(-15)!, 'cumulative'));
        await insidePlot(tip, plot);

        // A finger dragged up the chart scrolls the page and leaves the reading alone.
        await bring(plot);
        const before = await page.evaluate(() => window.scrollY);
        const middle = (await plot.boundingBox())!;
        await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: middle.x + middle.width / 2, y: middle.y + middle.height - 30 }] });
        for (let step = 1; step <= 6; step++) await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: middle.x + middle.width / 2, y: middle.y + middle.height - 30 - 25 * step }] });
        await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 60);
        await expect(tip).toContainText(words(rows.at(-15)!, 'cumulative'));

        await chart.getByRole('button', { name: 'Show all lines' }).tap();
        await expect(tip).toHaveCount(0);
        await expect(lifted).toHaveCount(0);

        // A name brings its line forward, and a tap on empty chart lets it go.
        const other = OPENING[3];
        await names.locator(`button[data-series="${other}"]`).tap();
        await expect(tip).toContainText(nameOf(other));
        await expect(tip).toContainText(words(rowsOf(frozen.weekly, other).at(-1)!, 'cumulative'));
        await expect(plot).toBeInViewport({ ratio: 0.6 });
        await bring(plot);
        const corner = (await plot.boundingBox())!;
        await page.touchscreen.tap(corner.x + (width < 600 ? 70 : 120), corner.y + 30);
        await expect(tip).toHaveCount(0);
        await noSidewaysScroll(page);
      });
    });
  });
}
