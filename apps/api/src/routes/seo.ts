import { Hono } from 'hono';
import { db } from '../lib/db';
import { getOrSet } from '../lib/redis';

const app = new Hono();
const BASE = 'https://weecommerce.web.id';

/* ── robots.txt ── */

app.get('/robots.txt', (c) => {
  return c.text(`# WeeCommerce — weecommerce.web.id
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/v1/admin/
Disallow: /api/v1/contact
Disallow: /api/v1/newsletter/
Allow: /api/v1/public/

# AI Crawlers
User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Perplexity
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

Crawl-delay: 1

Sitemap: ${BASE}/sitemap.xml
Sitemap: ${BASE}/sitemap-images.xml
Sitemap: ${BASE}/ai-sitemap.xml
`);
});

/* ── Sitemap XML ── */

app.get('/sitemap.xml', async (c) => {
  const xml = await getOrSet('sitemap:xml', 86400, async () => {
    const [pages, services, posts, caseStudies] = await Promise.all([
      db.query("SELECT slug, updated_at FROM pages WHERE is_published"),
      db.query("SELECT slug, updated_at FROM services WHERE is_published"),
      db.query("SELECT slug, updated_at FROM posts WHERE status = 'published' AND deleted_at IS NULL"),
      db.query("SELECT slug, updated_at FROM case_studies WHERE status = 'published' AND deleted_at IS NULL"),
    ]);

    const urls: string[] = [];

    function url(loc: string, priority: string, freq: string, lastmod?: string) {
      return `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>` : ''}\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    }

    urls.push(url(BASE, '1.0', 'weekly'));
    pages.rows.forEach((p: any) => urls.push(url(`${BASE}/${p.slug === 'home' ? '' : p.slug}`, '0.9', 'monthly', p.updated_at)));
    services.rows.forEach((s: any) => urls.push(url(`${BASE}/services/${s.slug}`, '0.9', 'monthly', s.updated_at)));
    posts.rows.forEach((p: any) => urls.push(url(`${BASE}/blog/${p.slug}`, '0.7', 'weekly', p.updated_at)));
    caseStudies.rows.forEach((cs: any) => urls.push(url(`${BASE}/portfolio/${cs.slug}`, '0.8', 'monthly', cs.updated_at)));

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  });

  c.header('Content-Type', 'application/xml; charset=utf-8');
  c.header('Cache-Control', 'public, max-age=86400');
  return c.body(xml);
});

/* ── Image Sitemap ── */

app.get('/sitemap-images.xml', async (c) => {
  const xml = await getOrSet('sitemap:images', 86400, async () => {
    const posts = await db.query("SELECT slug, featured_image_key, featured_image_alt FROM posts WHERE status = 'published' AND deleted_at IS NULL AND featured_image_key IS NOT NULL");
    const items = posts.rows.map((p: any) =>
      `  <url>\n    <loc>${BASE}/blog/${p.slug}</loc>\n    <image:image>\n      <image:loc>https://cdn.weecommerce.web.id/${p.featured_image_key}</image:loc>\n      <image:caption>${escXml(p.featured_image_alt || '')}</image:caption>\n    </image:image>\n  </url>`
    ).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${items}\n</urlset>`;
  });

  c.header('Content-Type', 'application/xml; charset=utf-8');
  c.header('Cache-Control', 'public, max-age=86400');
  return c.body(xml);
});

/* ── AI Sitemap ── */

app.get('/ai-sitemap.xml', (c) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE}/llms-full.txt</loc><priority>1.0</priority></url>
  <url><loc>${BASE}/api/v1/public/about</loc><priority>0.9</priority></url>
  <url><loc>${BASE}/api/v1/public/services</loc><priority>0.9</priority></url>
  <url><loc>${BASE}/api/v1/public/portfolio</loc><priority>0.9</priority></url>
  <url><loc>${BASE}/api/v1/public/blog</loc><priority>0.8</priority></url>
  <url><loc>${BASE}/api/v1/public/faq</loc><priority>0.8</priority></url>
  <url><loc>${BASE}/services/convert</loc><priority>0.9</priority></url>
  <url><loc>${BASE}/about</loc><priority>0.8</priority></url>
</urlset>`;

  c.header('Content-Type', 'application/xml; charset=utf-8');
  return c.body(xml);
});

/* ── RSS Feed ── */

app.get('/feed.xml', async (c) => {
  const xml = await getOrSet('feed:xml', 86400, async () => {
    const posts = await db.query(
      `SELECT p.title, p.slug, p.excerpt, p.published_at, p.updated_at, tm.name AS author
       FROM posts p LEFT JOIN team_members tm ON p.author_id = tm.id
       WHERE p.status = 'published' AND p.deleted_at IS NULL
       ORDER BY p.published_at DESC LIMIT 20`,
    );

    const items = posts.rows.map((p: any) =>
      `    <item>\n      <title>${escXml(p.title)}</title>\n      <link>${BASE}/blog/${p.slug}</link>\n      <guid isPermaLink="true">${BASE}/blog/${p.slug}</guid>\n      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>\n      <description>${escXml(p.excerpt || '')}</description>\n      <author>${escXml(p.author || 'WeeCommerce')}</author>\n    </item>`
    ).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>WeeCommerce — E-Commerce Systems, Powered by AI</title>\n    <link>${BASE}/blog</link>\n    <description>Insights on custom e-commerce, AI chatbots, RAG, and n8n automation.</description>\n    <language>en-us</language>\n    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>\n${items}\n  </channel>\n</rss>`;
  });

  c.header('Content-Type', 'application/rss+xml; charset=utf-8');
  c.header('Cache-Control', 'public, max-age=86400');
  return c.body(xml);
});

/* ── llms.txt ── */

app.get('/llms.txt', async (c) => {
  const text = await getOrSet('llms:txt', 86400, async () => {
    const pages = await db.query("SELECT slug, meta_title, meta_description FROM pages WHERE is_published");
    return `# WeeCommerce

> WeeCommerce is a specialist e-commerce agency building AI-powered systems. Custom Next.js + Supabase platforms with RAG knowledge base, AI chatbot, and n8n automation. Migrate off marketplace dependency. Built to scale. Founded by Alif Nugraha.

## Services

- [LAUNCH](${BASE}/services/launch): Core e-commerce platform. Starting Rp 15 juta / $2,500.
- [CONVERT](${BASE}/services/convert): Platform + AI layer (chatbot, RAG, n8n). Starting Rp 38 juta / $6,000.
- [SCALE](${BASE}/services/scale): Full e-commerce system with advanced automation. Starting Rp 70 juta / $11,000.
- [INTEGRATE](${BASE}/services/integrate): AI modules for existing stores. Starting Rp 8 juta / $1,200.

## Key Pages
${pages.rows.filter((p: any) => p.slug !== 'home').map((p: any) => `- [${p.meta_title || p.slug}](${BASE}/${p.slug})`).join('\n')}

## AI & GEO
- [Full company profile (llms-full.txt)](${BASE}/llms-full.txt)
- [Machine-readable public API](${BASE}/api/v1/public)
- [AI sitemap](${BASE}/ai-sitemap.xml)

## Contact
hello@weecommerce.web.id | ${BASE} | Indonesia — serving clients globally
`;
  });

  c.header('Content-Type', 'text/plain; charset=utf-8');
  return c.body(text);
});

/* ── llms-full.txt ── */

app.get('/llms-full.txt', async (c) => {
  const text = await getOrSet('llms:full', 86400, async () => {
    const services = await db.query("SELECT * FROM services WHERE is_published ORDER BY sort_order");
    const faq = await db.query("SELECT question, answer FROM faq WHERE is_published ORDER BY sort_order LIMIT 10");
    const team = await db.query("SELECT name, role, bio FROM team_members WHERE is_published");

    return `# WeeCommerce — Full Company Profile

## Overview
WeeCommerce is a specialist e-commerce agency at the intersection of custom development, artificial intelligence, and business automation. Founded in 2026 by Alif Nugraha.

Most agencies build you a store. WeeCommerce builds you a system.

## Services
${services.rows.map((s: any) => `\n### ${s.name}\n${s.description}\n- Pricing: Rp ${(s.price_idr_min/1000000).toFixed(0)}–${(s.price_idr_max/1000000).toFixed(0)} juta / $${s.price_usd_min}–$${s.price_usd_max}\n- Timeline: ${s.timeline_weeks_min}–${s.timeline_weeks_max} weeks\n`).join('')}
## FAQ
${faq.rows.map((f: any) => `\nQ: ${f.question}\nA: ${f.answer}`).join('\n')}

## Team
${team.rows.map((t: any) => `\n- ${t.name} — ${t.role}`).join('')}

## AI Resources
- Public API: ${BASE}/api/v1/public
- llms.txt: ${BASE}/llms.txt
- AI sitemap: ${BASE}/ai-sitemap.xml
`;
  });

  c.header('Content-Type', 'text/plain; charset=utf-8');
  return c.body(text);
});

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export default app;
