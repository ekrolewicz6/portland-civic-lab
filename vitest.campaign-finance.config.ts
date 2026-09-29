import {defineConfig} from 'vitest/config';
export default defineConfig({test:{include:['ingest/orestar/finance.test.ts','ingest/orestar/candidate-facts.test.ts','ingest/orestar/story.test.ts','ingest/orestar/timeline.test.ts'],testTimeout:15000}});
