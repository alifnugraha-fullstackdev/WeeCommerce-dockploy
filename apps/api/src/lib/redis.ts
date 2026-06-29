import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 10) return null;
    return Math.min(times * 50, 2000);
  },
});

redis.on('error', (err) => console.error('Redis error:', err.message));

export async function redisHealth() {
  try {
    await redis.ping();
    return { ok: true, status: 'connected' };
  } catch {
    return { ok: false, status: 'disconnected' };
  }
}

export async function getOrSet<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>,
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    try {
      return JSON.parse(cached) as T;
    } catch {
      // corrupt cache, fall through
    }
  }

  const fresh = await fetchFn();
  await redis.setex(key, ttlSeconds, JSON.stringify(fresh));
  return fresh;
}
