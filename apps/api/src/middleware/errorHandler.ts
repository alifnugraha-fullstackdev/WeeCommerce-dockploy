import type { Context } from 'hono';

export function errorHandler(err: Error, c: Context) {
  const status = (err as any).status || 500;
  const isServerError = status >= 500;

  console.error({
    timestamp: new Date().toISOString(),
    level: isServerError ? 'error' : 'warn',
    message: err.message,
    path: c.req.path,
    method: c.req.method,
    stack: err.stack,
  });

  return c.json({
    error: isServerError ? 'Internal Server Error' : err.message,
    status,
    timestamp: new Date().toISOString(),
  }, status);
}
