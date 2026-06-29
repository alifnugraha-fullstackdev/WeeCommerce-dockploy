import { Hono } from 'hono';
import { db } from '../lib/db';
import { getOrSet } from '../lib/redis';

const app = new Hono();

/* ── Services ────────────────────────────────────────── */

app.get('/services', async (c) => {
  const data = await getOrSet('services:all', 3600, () =>
    db.query(
      'SELECT id, slug, name, tagline, route, price_idr_min, price_idr_max, price_usd_min, price_usd_max, timeline_weeks_min, timeline_weeks_max, is_popular, sort_order FROM services WHERE is_published ORDER BY sort_order',
    ).then(r => r.rows),
  );
  return c.json({ data });
});

app.get('/services/:tier', async (c) => {
  const { tier } = c.req.param();
  const data = await getOrSet(`service:${tier}`, 3600, async () => {
    const service = await db.queryOne(
      'SELECT * FROM services WHERE slug = $1 AND is_published',
      [tier],
    );
    if (!service) return null;

    const features = await db.query(
      'SELECT feature, is_included, sort_order FROM service_features WHERE service_id = $1 ORDER BY sort_order',
      [service.id],
    );

    return { ...service, features: features.rows };
  });

  if (!data) return c.json({ error: 'Not Found', status: 404 }, 404);
  return c.json({ data });
});

/* ── Blog Posts ──────────────────────────────────────── */

app.get('/posts', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '12'), 50);
  const offset = (page - 1) * limit;
  const category = c.req.query('category');

  const cacheKey = `posts:page:${page}:limit:${limit}:cat:${category || 'all'}`;

  const data = await getOrSet(cacheKey, 3600, async () => {
    let where = "WHERE p.status = 'published' AND p.deleted_at IS NULL";
    const params: (string | number)[] = [];

    if (category) {
      where += ' AND c.slug = $' + (params.length + 1);
      params.push(category);
    }

    params.push(limit, offset);

    const posts = await db.query(
      `SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image_key, p.featured_image_alt,
              p.read_time_minutes, p.views, p.published_at,
              jsonb_build_object('name', tm.name, 'slug', tm.slug) AS author,
              jsonb_build_object('name', c.name, 'slug', c.slug) AS category
       FROM posts p
       LEFT JOIN team_members tm ON p.author_id = tm.id
       LEFT JOIN categories c ON p.category_id = c.id
       ${where}
       ORDER BY p.published_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    const countResult = await db.query(
      `SELECT COUNT(*) FROM posts p ${where ? 'LEFT JOIN categories c ON p.category_id = c.id ' + where.replace(/^WHERE p\./, 'WHERE p.') : ''}`,
      params.slice(0, params.length - 2),
    );

    return {
      posts: posts.rows.map((p: any) => ({
        ...p,
        featuredImageUrl: p.featured_image_key ? `https://cdn.weecommerce.web.id/${p.featured_image_key}` : null,
      })),
      total: parseInt(countResult.rows[0].count),
    };
  });

  return c.json({
    data: data.posts,
    meta: { total: data.total, page, pageSize: limit, totalPages: Math.ceil(data.total / limit) },
  });
});

app.get('/posts/:slug', async (c) => {
  const slug = c.req.param('slug');
  const data = await getOrSet(`post:${slug}`, 3600, async () => {
    const post = await db.queryOne(
      `SELECT p.*,
              jsonb_build_object('name', tm.name, 'slug', tm.slug, 'bio', tm.bio, 'photo_key', tm.photo_key) AS author,
              jsonb_build_object('name', c.name, 'slug', c.slug) AS category
       FROM posts p
       LEFT JOIN team_members tm ON p.author_id = tm.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.status = 'published' AND p.deleted_at IS NULL`,
      [slug],
    );
    if (!post) return null;

    const tags = await db.query(
      'SELECT t.name, t.slug FROM tags t JOIN posts_to_tags pt ON t.id = pt.tag_id WHERE pt.post_id = $1',
      [post.id],
    );

    const related = await db.query(
      `SELECT p.title, p.slug, p.excerpt FROM posts p
       JOIN posts_to_tags pt ON p.id = pt.post_id
       WHERE pt.tag_id IN (SELECT tag_id FROM posts_to_tags WHERE post_id = $1)
         AND p.id != $1 AND p.status = 'published' AND p.deleted_at IS NULL
       GROUP BY p.id ORDER BY COUNT(pt.tag_id) DESC, p.published_at DESC LIMIT 3`,
      [post.id],
    );

    // Increment views async (fire-and-forget)
    db.query('UPDATE posts SET views = views + 1 WHERE id = $1', [post.id]);

    return { ...post, tags: tags.rows, relatedPosts: related.rows };
  });

  if (!data) return c.json({ error: 'Not Found', status: 404 }, 404);
  return c.json({ data });
});

app.get('/posts/search', async (c) => {
  const q = c.req.query('q');
  if (!q || q.length < 2) {
    return c.json({ error: 'Query must be at least 2 characters', status: 400 }, 400);
  }

  const data = await db.query(
    `SELECT title, slug, excerpt, published_at,
            ts_rank(search_vector, plainto_tsquery('english', $1)) AS relevance
     FROM posts
     WHERE status = 'published' AND deleted_at IS NULL
       AND search_vector @@ plainto_tsquery('english', $1)
     ORDER BY relevance DESC, published_at DESC
     LIMIT 20`,
    [q],
  );

  return c.json({ data: data.rows, meta: { query: q, total: data.rows.length } });
});

/* ── Case Studies ────────────────────────────────────── */

app.get('/case-studies', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '9'), 50);
  const offset = (page - 1) * limit;
  const tech = c.req.query('technology');
  const tier = c.req.query('tier');
  const industry = c.req.query('industry');

  const cacheKey = `cs:${page}:${limit}:t:${tech || ''}:i:${industry || ''}:ti:${tier || ''}`;
  const data = await getOrSet(cacheKey, 3600, async () => {
    let where = "WHERE status = 'published' AND deleted_at IS NULL";
    const params: (string | number)[] = [];
    let paramIdx = 0;

    if (tech) { paramIdx++; where += ` AND $${paramIdx} = ANY(technologies)`; params.push(tech); }
    if (tier) { paramIdx++; where += ` AND service_tier = $${paramIdx}`; params.push(tier); }
    if (industry) { paramIdx++; where += ` AND industry = $${paramIdx}`; params.push(industry); }

    paramIdx++; params.push(limit);
    paramIdx++; params.push(offset);

    const items = await db.query(
      `SELECT id, title, slug, client_name, is_confidential, summary, technologies, industry, service_tier,
              featured_image_key, featured_image_alt, published_at, duration_weeks,
              (SELECT jsonb_agg(jsonb_build_object('metric_label', metric_label, 'metric_value', metric_value) ORDER BY sort_order)
               FROM case_study_results WHERE case_study_id = case_studies.id) AS results
       FROM case_studies ${where}
       ORDER BY published_at DESC LIMIT $${paramIdx - 1} OFFSET $${paramIdx}`,
      params,
    );

    const countResult = await db.query(
      `SELECT COUNT(*) FROM case_studies ${where}`,
      params.slice(0, -2),
    );

    return { items: items.rows, total: parseInt(countResult.rows[0].count) };
  });

  return c.json({
    data: data.items,
    meta: { total: data.total, page, pageSize: limit, totalPages: Math.ceil(data.total / limit) },
  });
});

app.get('/case-studies/:slug', async (c) => {
  const slug = c.req.param('slug');
  const data = await getOrSet(`cs:${slug}`, 3600, async () => {
    const item = await db.queryOne(
      `SELECT cs.*, (SELECT jsonb_agg(jsonb_build_object('metric_label', metric_label, 'metric_value', metric_value) ORDER BY sort_order)
                     FROM case_study_results WHERE case_study_id = cs.id) AS results
       FROM case_studies cs WHERE cs.slug = $1 AND cs.status = 'published' AND cs.deleted_at IS NULL`,
      [slug],
    );
    return item || null;
  });

  if (!data) return c.json({ error: 'Not Found', status: 404 }, 404);
  return c.json({ data });
});

/* ── Team ────────────────────────────────────────────── */

app.get('/team', async (c) => {
  const data = await getOrSet('team:all', 3600, () =>
    db.query(
      'SELECT id, name, slug, role, bio, photo_key, photo_alt, email, linkedin_url, github_url, x_url, website_url FROM team_members WHERE is_published ORDER BY sort_order',
    ).then(r => r.rows),
  );
  return c.json({ data });
});

app.get('/team/:slug', async (c) => {
  const slug = c.req.param('slug');
  const data = await db.queryOne(
    'SELECT * FROM team_members WHERE slug = $1 AND is_published',
    [slug],
  );
  if (!data) return c.json({ error: 'Not Found', status: 404 }, 404);
  return c.json({ data });
});

/* ── FAQ ─────────────────────────────────────────────── */

app.get('/faq', async (c) => {
  const category = c.req.query('category');
  const service = c.req.query('service');

  let where = 'WHERE f.is_published';
  const params: (string | number)[] = [];

  if (category) { where += ` AND f.category = $${params.length + 1}`; params.push(category); }
  if (service) { where += ` AND s.slug = $${params.length + 1}`; params.push(service); }

  const data = await db.query(
    `SELECT f.id, f.question, f.answer, f.category, f.sort_order
     FROM faq f ${service ? 'LEFT JOIN services s ON f.service_id = s.id' : ''}
     ${where} ORDER BY f.sort_order`,
    params,
  );
  return c.json({ data: data.rows });
});

/* ── Pages ───────────────────────────────────────────── */

app.get('/pages/:slug', async (c) => {
  const slug = c.req.param('slug');
  const data = await getOrSet(`page:${slug}`, 3600, () =>
    db.queryOne('SELECT * FROM pages WHERE slug = $1 AND is_published', [slug]),
  );
  if (!data) return c.json({ error: 'Not Found', status: 404 }, 404);
  return c.json({ data });
});

/* ── Categories / Tags ───────────────────────────────── */

app.get('/categories', async (c) => {
  const data = await getOrSet('categories:all', 3600, () =>
    db.query('SELECT * FROM categories ORDER BY sort_order').then(r => r.rows),
  );
  return c.json({ data });
});

app.get('/tags', async (c) => {
  const data = await getOrSet('tags:all', 3600, () =>
    db.query('SELECT * FROM tags ORDER BY name').then(r => r.rows),
  );
  return c.json({ data });
});

export default app;
