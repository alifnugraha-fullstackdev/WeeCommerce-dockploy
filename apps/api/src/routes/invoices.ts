import { Hono, Context, Next } from 'hono';
import { jwtVerify } from 'jose';
import { z } from 'zod';
import { db } from '../lib/db';
import { JWT_SECRET, JWT_ISSUER } from './admin';

const app = new Hono();

/* ── Auth middleware ── */
async function requireAdmin(c: Context, next: Next) {
  const auth = c.req.header('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const { payload } = await jwtVerify(auth.slice(7), JWT_SECRET, { issuer: JWT_ISSUER });
    (c as any).adminUser = payload;
    await next();
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
}

const invoiceSchema = z.object({
  client_name: z.string().min(2),
  client_email: z.string().email(),
  client_phone: z.string().optional(),
  project_name: z.string().min(2),
  service_tier: z.string().optional(),
  amount_idr: z.number().int().positive(),
  amount_usd: z.number().int().optional(),
  currency: z.enum(['IDR', 'USD']).default('IDR'),
  notes: z.string().optional(),
  items: z.array(z.object({
    description: z.string(),
    amount_idr: z.number().int().positive(),
    amount_usd: z.number().int().optional(),
  })).optional(),
});

/* ── List invoices ── */
app.get('/', requireAdmin, async (c) => {
  const { rows } = await db.query(
    'SELECT id, invoice_number, client_name, client_email, project_name, service_tier, amount_idr, amount_usd, currency, status, milestone, created_at FROM invoices ORDER BY created_at DESC',
  );
  return c.json({ data: rows });
});

/* ── Get single invoice ── */
app.get('/:id', requireAdmin, async (c) => {
  const id = c.req.param('id');
  if (!id) return c.json({ error: 'Not found' }, 404);
  const invoice = await db.queryOne('SELECT * FROM invoices WHERE id = $1', [id]);
  if (!invoice) return c.json({ error: 'Not found' }, 404);
  const { rows: items } = await db.query('SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY sort_order', [id]);
  return c.json({ data: { ...invoice, items } });
});

/* ── Create invoice ── */
app.post('/', requireAdmin, async (c) => {
  const body = await c.req.json();
  const parsed = invoiceSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: 'Validation', details: parsed.error.issues }, 422);

  const user = (c as any).adminUser as { sub: string; email: string; name: string; role: string };
  const data = parsed.data;

  // Generate invoice number: INV-2026-XXXX (UUID-based)
  const shortId = crypto.randomUUID().slice(0, 8).toUpperCase();
  const invNum = `INV-${new Date().getFullYear()}-${shortId}`;

  const result = await db.query(
    `INSERT INTO invoices (invoice_number, client_name, client_email, client_phone, project_name, service_tier, amount_idr, amount_usd, currency, notes, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [invNum, data.client_name, data.client_email, data.client_phone ?? null, data.project_name, data.service_tier ?? null, data.amount_idr, data.amount_usd ?? null, data.currency, data.notes ?? null, user.sub],
  );

  const invoice = result.rows[0];

  // Insert items if provided
  if (data.items?.length) {
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      await db.query(
        'INSERT INTO invoice_items (invoice_id, description, amount_idr, amount_usd, sort_order) VALUES ($1, $2, $3, $4, $5)',
        [invoice.id, item.description, item.amount_idr, item.amount_usd || null, i],
      );
    }
  }

  return c.json({ data: invoice }, 201);
});

/* ── Update status ── */
app.patch('/:id/status', requireAdmin, async (c) => {
  const id = c.req.param('id');
  const { status, milestone } = await c.req.json();
  const valid = ['draft', 'sent', 'paid_kickoff', 'paid_staging', 'paid_final', 'cancelled'];
  if (!valid.includes(status)) return c.json({ error: 'Invalid status' }, 422);

  await db.query(
    'UPDATE invoices SET status = $1, milestone = COALESCE($2, milestone), updated_at = NOW() WHERE id = $3',
    [status, milestone || null, id],
  );

  return c.json({ success: true });
});

export { app as invoiceRoutes };
