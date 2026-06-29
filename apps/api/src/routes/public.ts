import { Hono } from 'hono';
import { db } from '../lib/db';
import { getOrSet } from '../lib/redis';

const app = new Hono();
const BASE = 'https://weecommerce.web.id';

/* ── About ── */

app.get('/about', (c) => {
  return c.json({
    data: {
      name: 'WeeCommerce',
      tagline: 'E-Commerce Systems, Powered by AI',
      description: 'WeeCommerce is a specialist e-commerce agency at the intersection of custom development, artificial intelligence, and business automation. We work with brands that have outgrown their current digital setup.',
      founded: '2026',
      founder: { name: 'Alif Nugraha', role: 'Founder' },
      location: 'Indonesia',
      serviceArea: 'Global (remote-first)',
      email: 'hello@weecommerce.web.id',
      website: BASE,
      stack: ['Next.js', 'Supabase', 'PostgreSQL', 'Hono', 'n8n', 'OpenAI', 'Cloudflare R2'],
      whatWeAre: ['E-commerce specialist agency', 'Custom development + AI integration', 'End-to-end system ownership', 'Built for scale from day one'],
      whatWeAreNot: ['A generic digital agency', 'A template shop', 'A build-and-disappear vendor', 'A quick-launch freelancer platform'],
    },
    meta: { version: '1.0', generatedAt: new Date().toISOString(), source: `${BASE}/api/v1/public/about` },
  });
});

/* ── Services ── */

app.get('/services', async (c) => {
  const data = await getOrSet('public:services', 3600, async () => {
    const services = await db.query("SELECT * FROM services WHERE is_published ORDER BY sort_order");
    return services.rows.map((s: any) => ({
      slug: s.slug, name: s.name, route: s.route,
      summary: s.tagline,
      features: [], // simplified
      pricing: { idr: { min: s.price_idr_min, max: s.price_idr_max, display: `Rp ${(s.price_idr_min/1000000).toFixed(0)}–${(s.price_idr_max/1000000).toFixed(0)} juta` }, usd: { min: s.price_usd_min, max: s.price_usd_max, display: `$${s.price_usd_min}–$${s.price_usd_max}` } },
      timelineWeeks: { min: s.timeline_weeks_min, max: s.timeline_weeks_max },
      url: `${BASE}/services/${s.slug}`,
    }));
  });
  return c.json({ data, meta: { version: '1.0', generatedAt: new Date().toISOString() } });
});

/* ── Portfolio ── */

app.get('/portfolio', async (c) => {
  const data = await getOrSet('public:portfolio', 3600, () =>
    db.query(
      `SELECT id, title, slug, client_name, is_confidential, summary, challenge, solution, technologies, industry, service_tier, duration_weeks
       FROM case_studies WHERE status = 'published' AND deleted_at IS NULL ORDER BY published_at DESC`,
    ).then(r => r.rows),
  );
  return c.json({ data, meta: { version: '1.0', generatedAt: new Date().toISOString() } });
});

/* ── Team ── */

app.get('/team', async (c) => {
  const data = await getOrSet('public:team', 3600, () =>
    db.query(
      "SELECT name, role, bio, website_url FROM team_members WHERE is_published ORDER BY sort_order",
    ).then(r => r.rows),
  );
  return c.json({ data, meta: { version: '1.0', generatedAt: new Date().toISOString() } });
});

/* ── Blog (abstracts only) ── */

app.get('/blog', async (c) => {
  const limit = Math.min(parseInt(c.req.query('limit') || '50'), 50);
  const data = await getOrSet(`public:blog:${limit}`, 3600, () =>
    db.query(
      `SELECT p.title, p.slug, p.excerpt, p.published_at, p.read_time_minutes, tm.name AS author, c.name AS category
       FROM posts p
       LEFT JOIN team_members tm ON p.author_id = tm.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'published' AND p.deleted_at IS NULL
       ORDER BY p.published_at DESC LIMIT $1`,
      [limit],
    ).then(r => r.rows.map((p: any) => ({
      ...p,
      url: `${BASE}/blog/${p.slug}`,
      markdownUrl: `${BASE}/api/v1/public/blog/${p.slug}/markdown`,
    }))),
  );
  return c.json({ data, meta: { version: '1.0', generatedAt: new Date().toISOString() } });
});

/* ── Blog markdown export ── */

app.get('/blog/:slug/markdown', async (c) => {
  const slug = c.req.param('slug');
  const post = await db.queryOne(
    `SELECT p.title, p.content, p.published_at, p.updated_at, p.slug, tm.name AS author, c.name AS category
     FROM posts p
     LEFT JOIN team_members tm ON p.author_id = tm.id
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.slug = $1 AND p.status = 'published' AND p.deleted_at IS NULL`,
    [slug],
  );

  if (!post) return c.json({ error: 'Not Found' }, 404);

  const markdown = `---
title: "${post.title}"
author: "${post.author || 'WeeCommerce'}"
publishedAt: "${new Date(post.published_at).toISOString().split('T')[0]}"
category: "${post.category || ''}"
source: "${BASE}/blog/${post.slug}"
---

${post.content}`;

  c.header('Content-Type', 'text/markdown; charset=utf-8');
  c.header('Cache-Control', 'public, max-age=3600');
  return c.body(markdown);
});

/* ── FAQ ── */

app.get('/faq', async (c) => {
  const data = await getOrSet('public:faq', 3600, () =>
    db.query(
      "SELECT question, answer, category FROM faq WHERE is_published ORDER BY sort_order",
    ).then(r => r.rows),
  );
  return c.json({ data, meta: { version: '1.0', generatedAt: new Date().toISOString() } });
});

export default app;
