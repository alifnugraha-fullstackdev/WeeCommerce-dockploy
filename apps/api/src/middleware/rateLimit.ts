import type { Context } from 'hono';
import { redis } from '../lib/redis';

export async function rateLimit(c: Context, next: () => Promise<void>) {
  const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const path = c.req.path;

  let limit = 1000;
  let window = 3600;

  if (path === '/api/v1/contact') {
    limit = 5;
    window = 3600;
  } else if (path.startsWith('/api/v1/public/')) {
    limit = 100;
    window = 3600;
  } else if (path.startsWith('/api/v1/newsletter')) {
    limit = 3;
    window = 3600;
  }

  const key = `ratelimit:${ip}:${path}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, window);
  }

  c.header('X-RateLimit-Limit', String(limit));
  c.header('X-RateLimit-Remaining', String(Math.max(0, limit - count)));
  c.header('X-RateLimit-Reset', String(window));

  if (count > limit) {
    return c.json({
      error: 'Too Many Requests',
      status: 429,
      message: 'Rate limit exceeded. Try again later.',
    }, 429);
  }

  await next();
}
