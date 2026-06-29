import { serve } from '@hono/node-server';
import app from './index';

const port = parseInt(process.env.PORT || '4000');

serve({
  fetch: app.fetch,
  port,
});

console.log(`🟢 WeeCommerce API running on http://localhost:${port}`);
