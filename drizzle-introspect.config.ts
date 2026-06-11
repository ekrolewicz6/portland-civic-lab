import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/introspected",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: [
    "public", "safety", "housing", "homelessness", "education", "economy",
    "environment", "transportation", "quality", "accountability", "business",
    "downtown", "migration", "fiscal", "content", "performance", "reference",
    "real_estate",
  ],
});
