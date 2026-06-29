import { Hono } from 'hono';
import { db } from '../lib/db';

const app = new Hono();

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v2/siteverify';

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  // Test key always passes
  if (token === '1x00000000000000000000AA') return true;

  const form = new URLSearchParams();
  form.append('secret', process.env.TURNSTILE_SECRET || '');
  form.append('response', token);
  form.append('remoteip', ip);

  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body: form });
    const data = await res.json() as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

// Verify subscription
app.get('/verify', async (c) => {
  const token = c.req.query('token');
  if (!token) return c.redirect('/');

  const subscriber = await db.queryOne(
    'SELECT id FROM newsletter_subscribers WHERE verify_token = $1 AND status = $2',
    [token, 'pending'],
  );
  if (!subscriber) return c.redirect('/?newsletter=invalid');

  await db.query(
    'UPDATE newsletter_subscribers SET status = $1, verified_at = NOW() WHERE id = $2',
    ['active', subscriber.id],
  );
  return c.redirect('/?newsletter=confirmed');
});

// Unsubscribe
app.get('/unsubscribe', async (c) => {
  const token = c.req.query('token');
  if (!token) return c.redirect('/');

  await db.query(
    'UPDATE newsletter_subscribers SET status = $1, unsubscribed_at = NOW() WHERE unsubscribe_token = $2',
    ['unsubscribed', token],
  );
  return c.redirect('/?newsletter=unsubscribed');
});

export { app as newsletterRoutes };
