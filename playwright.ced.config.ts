import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  testMatch: "ced-portfolio.spec.ts",
  timeout: 60000,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.CED_PREVIEW_URL ?? "http://127.0.0.1:3157",
    headless: true,
    viewport: { width: 1440, height: 1000 },
    screenshot: "only-on-failure",
  },
});
