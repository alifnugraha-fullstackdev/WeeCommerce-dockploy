import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { compress } from 'hono/compress';
import { timing } from 'hono/timing';

import { rateLimit } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { dbHealth } from './lib/db';
import { redisHealth } from './lib/redis';

import publicRoutes from './routes/public';
import contentRoutes from './routes/content';
import contactRoutes from './routes/contact';
import { newsletterRoutes } from './routes/newsletter';
import { bookingRoutes } from './routes/booking';
import { adminRoutes } from './routes/admin';
import { invoiceRoutes } from './routes/invoices';
import seoRoutes from './routes/seo';

const app = new Hono();

// Core middleware
app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', timing());
app.use('*', compress());
app.use('*', cors({
  origin: [
    'https://weecommerce.web.id',
    'https://www.weecommerce.web.id',
    'http://localhost:3000',
  ],
  credentials: true,
}));

// Rate limiting
app.use('/api/*', rateLimit);

// Health check
app.get('/health', async (c) => {
  const db = await dbHealth();
  const cache = await redisHealth();
  const status = db.ok && cache.ok ? 'ok' : 'degraded';
  return c.json({
    status,
    uptime: process.uptime(),
    database: db.status,
    cache: cache.status,
    timestamp: new Date().toISOString(),
  }, status === 'ok' ? 200 : 503);
});

// Readiness
app.get('/ready', async (c) => {
  return c.json({ status: 'ready' });
});

// Routes
app.route('/api/v1/public', publicRoutes);
app.route('/api/v1', contentRoutes);
app.route('/api/v1', contactRoutes);
app.route('/api/v1/newsletter', newsletterRoutes);
app.route('/api/v1/book', bookingRoutes);
app.route('/api/v1/admin', adminRoutes);
app.route('/api/v1/admin/invoices', invoiceRoutes);
app.route('/', seoRoutes);

// 404
app.notFound((c) => c.json({ error: 'Not Found', status: 404 }, 404));

// Error handler
app.onError(errorHandler);

export default app;
