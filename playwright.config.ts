import { defineConfig } from "@playwright/test";

/**
 * Smoke tests against a production build (`next start`). Run with no
 * DATABASE_URL and the suite exercises mock/fallback paths — pages must
 * still render; data-backed assertions are kept loose on purpose.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3100",
  },
  webServer: {
    command: "npm run start -- --port 3100",
    port: 3100,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
