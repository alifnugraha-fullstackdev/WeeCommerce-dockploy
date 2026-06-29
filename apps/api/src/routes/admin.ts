import { Hono } from 'hono';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { db } from '../lib/db';
import { z } from 'zod';

const app = new Hono();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'change-me-in-production');
const JWT_ISSUER = 'weecommerce-admin';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/* ── Login ── */
app.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: 'Invalid input', status: 422 }, 422);

    const { email, password } = parsed.data;
    const user = await db.queryOne(
      'SELECT id, email, password_hash, name, role FROM admin_users WHERE email = $1',
      [email],
    );
    if (!user) return c.json({ error: 'Invalid credentials', status: 401 }, 401);

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return c.json({ error: 'Invalid credentials', status: 401 }, 401);

    const token = await new SignJWT({ sub: user.id, email: user.email, role: user.role, name: user.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(JWT_ISSUER)
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    return c.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    return c.json({ error: 'Internal Server Error', status: 500 }, 500);
  }
});

/* ── Verify / Me ── */
app.get('/me', async (c) => {
  const auth = c.req.header('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return c.json({ error: 'Unauthorized', status: 401 }, 401);

  try {
    const { payload } = await jwtVerify(auth.slice(7), JWT_SECRET, { issuer: JWT_ISSUER });
    return c.json({ user: payload });
  } catch {
    return c.json({ error: 'Invalid token', status: 401 }, 401);
  }
});

/* ── Seed default admin (one-time) ── */
app.post('/seed', async (c) => {
  const { email, password, name } = await c.req.json();
  const hash = await bcrypt.hash(password, 12);
  await db.query(
    'INSERT INTO admin_users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
    [email, hash, name, 'admin'],
  );
  return c.json({ success: true });
});

export { app as adminRoutes, JWT_SECRET, JWT_ISSUER };
