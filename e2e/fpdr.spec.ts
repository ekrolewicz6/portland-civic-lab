import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test.describe(`FPDR at ${width}px`, () => {
    test.use({ viewport: { width, height: 1000 } });

    test("household estimate supports exact values, growth scenarios and keyboard use", async ({
      page,
    }) => {
      await page.goto("/deep-dives/fpdr");
      const section = page.locator("#cost");
      const value = section.getByRole("spinbutton", {
        name: "Assessed value in dollars",
      });
      await value.fill("350000");
      await expect(section.locator('[aria-live="polite"]')).toHaveText(
        "$1,046",
      );
      await section
        .getByText("See the calculation and year-by-year estimates", {
          exact: true,
        })
        .click();
      await expect(
        section.getByRole("row").filter({ hasText: "2026–27" }),
      ).toContainText("$360,500");
      await expect(
        section.getByRole("row").filter({ hasText: "2026–27" }),
      ).toContainText("$1,150");
      await section
        .getByLabel("Assumed annual growth after FY2025–26")
        .selectOption("0");
      await expect(
        section.getByRole("row").filter({ hasText: "2026–27" }),
      ).toContainText("$350,000");
      await expect(
        section.getByRole("row").filter({ hasText: "2026–27" }),
      ).toContainText("$1,117");
      await value.fill("342517");
      await expect(section.getByRole("slider")).toHaveValue("342517");
      await value.fill("");
      await expect(value).toHaveAttribute("aria-invalid", "true");
      await expect(
        section.getByText(/Results retain the last valid value/),
      ).toBeVisible();
      const preset = section.getByRole("button", {
        name: "$850,000",
        exact: true,
      });
      await preset.focus();
      await page.keyboard.press("Enter");
      await expect(value).toHaveValue("850000");
      await expect(preset).toHaveAttribute("aria-pressed", "true");
      await expect(value).toHaveAttribute("aria-invalid", "false");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });

    test("funding model exposes borrowing losses and both crossover views", async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/deep-dives/fpdr");
      const simulator = page.locator("#fix");
      const returns = simulator.getByRole("slider", {
        name: "Assumed annual investment return",
      });
      await returns.focus();
      await page.keyboard.press("ArrowLeft");
      await expect(returns).toHaveAttribute("aria-valuetext", "6.5% per year");
      await page.keyboard.press("Home");
      const outcome = simulator.getByTestId("fpdr-cost-outcome");
      await expect(outcome.locator("p").nth(1)).toHaveText("$0");
      await simulator
        .getByRole("button", { name: "$200M bond", exact: true })
        .click();
      await expect(outcome).toContainText("Added cash cost");
      await expect(outcome.locator("p").nth(1)).toHaveText("$172.7M");
      await simulator
        .getByRole("button", { name: "Cumulative", exact: true })
        .click();
      await expect(
        simulator.getByRole("heading", {
          name: "What taxpayers have contributed in total",
        }),
      ).toBeVisible();
      await expect(simulator.getByRole("img")).toHaveAttribute(
        "aria-label",
        /No crossover/,
      );
      await simulator
        .getByRole("button", { name: "7% return", exact: true })
        .click();
      await expect(outcome).toContainText("Cash contributions saved");
      await simulator
        .getByText("Read the chart as a table", { exact: true })
        .click();
      await expect(simulator.getByRole("table")).toBeVisible();
      expect(await simulator.getByRole("row").count()).toBe(59);
      const broken = await page
        .locator('main a[href^="#"]')
        .evaluateAll(
          (links) =>
            links.filter(
              (link) =>
                !document.getElementById(link.getAttribute("href")!.slice(1)),
            ).length,
        );
      expect(broken).toBe(0);
      expect(errors).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });
  });
}
