/** Isolated local report preview; leaves other Next.js preview caches untouched. */
import http from 'node:http';
import next from 'next';
import config from '../../next.config';
const port = Number(process.env.SMALL_BUSINESS_PORT || 3014);
const app = next({
  dev: true,
  hostname: 'localhost',
  port,
  conf: { ...config, distDir: 'runtime-data/small-business/.next' },
});
app.prepare().then(() => {
  http.createServer(app.getRequestHandler()).listen(port, () => {
    console.log(`Small-business report: http://localhost:${port}/deep-dives/small-business`);
  });
});
