import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    include: [
      'ingest/orestar/finance.test.ts',
      'ingest/orestar/candidate-facts.test.ts',
      'ingest/orestar/story.test.ts',
      'ingest/orestar/timeline.test.ts',
      'tests/campaign-finance/**/*.test.ts',
    ],
    testTimeout: 15000,
  },
});
