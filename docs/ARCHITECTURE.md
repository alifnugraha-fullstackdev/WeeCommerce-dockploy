# WeeCommerce Architecture — Detailed System Design

**Version:** 1.1
**Domain:** weecommerce.web.id
**Infrastructure:** VPS (Ubuntu 22.04 LTS, 2GB RAM) + Docker
**Orchestration:** Docker Compose + Dokploy
**Container Count:** 5 (streamlined dari draft awal 10+ microservices — lihat [PRD.md §7.1](./PRD.md#71-decision-streamlined-5-container-bukan-microservices) untuk reasoning)

> Berkaitan: [PRD.md](./PRD.md) · [DATABASE.md](./DATABASE.md) · [API.md](./API.md) · [SEO.md](./SEO.md) · [SECURITY.md](./SECURITY.md) · [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Container Architecture](#2-container-architecture)
3. [Service Responsibilities](#3-service-responsibilities)
4. [Data Flow](#4-data-flow)
5. [Caching Strategy](#5-caching-strategy)
6. [Rate Limiting](#6-rate-limiting)
7. [Service Communication](#7-service-communication)
8. [Error Handling & Resilience](#8-error-handling--resilience)
9. [External Integrations](#9-external-integrations)
10. [Scaling Path](#10-scaling-path)

---

## 1. System Architecture

### 1.1 High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│ Internet (Users, Search Engines, AI Crawlers)           │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────┐
│ Cloudflare (DNS only mode OR proxy)                     │
│ ├─ Free: DDoS protection, global anycast DNS            │
│ ├─ Optional proxy: edge cache, WAF, image opt           │
│ └─ R2 storage (images, PDFs)                             │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│ VPS — Ubuntu 22.04 LTS, 2GB RAM, 1 vCPU, 50GB SSD       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Docker Engine + Dokploy                             │ │
│ │                                                      │ │
│ │  ┌──────────────────────────────────────────────┐   │ │
│ │  │ Nginx (Reverse Proxy) — :80, :443            │   │ │
│ │  │ ├─ SSL/TLS termination (Let's Encrypt)       │   │ │
│ │  │ ├─ Security headers (HSTS, CSP, etc)         │   │ │
│ │  │ ├─ Rate limiting (Nginx zones)               │   │ │
│ │  │ ├─ Gzip/Brotli compression                   │   │ │
│ │  │ └─ Routing: / → nextjs, /api → hono          │   │ │
│ │  └──────────────────────────────────────────────┘   │ │
│ │           │                          │                │ │
│ │      ┌────▼────┐               ┌────▼─────────────┐  │ │
│ │      │ Next.js │               │ Hono API         │  │ │
│ │      │ :3000   │               │ :4000            │  │ │
│ │      │         │               │                  │  │ │
│ │      │ SSR/SSG │               │ Business logic   │  │ │
│ │      │ React   │               │ CMS read         │  │ │
│ │      │ Server  │               │ Contact form     │  │ │
│ │      │ Comp.   │               │ SEO/sitemap gen  │  │ │
│ │      │         │               │ llms.txt gen     │  │ │
│ │      │ Shadcn  │               │ Public AI API    │  │ │
│ │      │ /UI     │               │ Webhook dispatch │  │ │
│ │      └────┬────┘               └────┬─────────────┘  │ │
│ │           │                         │                 │ │
│ │      ┌────▼─────────────────────────▼────┐           │ │
│ │      │  PostgreSQL :5432  │  Redis :6379  │           │ │
│ │      │  (content, leads)  │  (cache, rate │           │ │
│ │      │                    │   counters)  │           │ │
│ │      └────────────────────┴───────────────┘           │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ External (SaaS, via HTTPS API calls from containers):   │
│ ├─ Cloudflare R2 (image/PDF storage, S3 protocol)       │
│ ├─ Resend (transactional email)                         │
│ ├─ Sentry (error tracking)                              │
│ ├─ UptimeRobot (uptime monitoring)                      │
│ ├─ Plausible (analytics, self-host OR cloud)            │
│ ├─ Cloudflare Turnstile (spam protection)               │
│ └─ n8n (webhook automation, Alif's existing stack)      │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Why 5 Container (Bukan 10+ Microservices)

| Pertimbangan | Microservices (draft awal) | Streamlined (dipilih) |
|---|---|---|
| RAM | ~2–4GB (18 container) — OOM risk di 2GB VPS | ~600MB–1GB total — aman |
| Operasional | Tiap service butuh config, log, monitoring sendiri | 5 service, satu orang handle |
| Dev velocity | Cross-service coordination, banyak repo | Single backend repo (Hono), iterate cepat |
| Cost | Butuh VPS 8GB ($20+/bln) | VPS 2GB ($3–8/bln) ✅ |
| Fit untuk use case | Overkill untuk read-heavy company profile | Right-sized |

**Trade-off:** Tidak ada independent scaling per service. **Mitigation:** Jika satu service jadi bottleneck, extract jadi microservice terpisah (lihat [§10 Scaling Path](#10-scaling-path) dan [ROADMAP.md](./ROADMAP.md) trigger arsitektur).

---

## 2. Container Architecture

### 2.1 Container Inventory

| Container | Image Base | Internal Port | Exposed | Volume | Restart |
|---|---|---|---|---|---|
| `weecommerce-nginx` | `nginx:alpine` | 80, 443 | 80, 443 (host) | `./nginx/conf`, `./certbot` | always |
| `weecommerce-nextjs` | `node:20-alpine` | 3000 | (via nginx) | `nextjs-cache:/app/.next/cache` | always |
| `weecommerce-hono` | `node:20-alpine` | 4000 | (via nginx) | `hono-logs:/app/logs` | always |
| `weecommerce-postgres` | `postgres:16-alpine` | 5432 | (internal) | `postgres-data:/var/lib/postgresql/data` | always |
| `weecommerce-redis` | `redis:7-alpine` | 6379 | (internal) | `redis-data:/data` | always |

### 2.2 Resource Budget (VPS 2GB)

| Component | RAM (idle) | RAM (peak) |
|---|---|---|
| OS + Docker daemon | ~150 MB | ~250 MB |
| Nginx | ~10 MB | ~50 MB |
| Next.js (production) | ~120 MB | ~250 MB |
| Hono API | ~60 MB | ~150 MB |
| PostgreSQL | ~100 MB | ~300 MB |
| Redis | ~10 MB | ~100 MB |
| **Total** | **~450 MB** | **~1.1 GB** |

**Headroom:** ~900 MB untuk burst + OS cache. Cukup untuk MVP traffic (~500 visitors/day).

### 2.3 Production docker-compose.yml

> Full file reference: [DEPLOYMENT.md §5](./DEPLOYMENT.md#5-docker-setup).

```yaml
# docker-compose.yml (production)
name: weecommerce

services:
  nginx:
    image: nginx:alpine
    container_name: weecommerce-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - nextjs
      - hono
    restart: always
    networks:
      - weecommerce-net

  nextjs:
    image: ghcr.io/<org>/weecommerce-web:latest
    container_name: weecommerce-nextjs
    environment:
      - NODE_ENV=production
      - API_URL=http://hono:4000
      - NEXT_PUBLIC_SITE_URL=https://weecommerce.web.id
      - NEXT_PUBLIC_PLAUSIBLE_DOMAIN=weecommerce.web.id
      - NEXT_PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js
    depends_on:
      hono:
        condition: service_healthy
    restart: always
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 30s
    networks:
      - weecommerce-net

  hono:
    image: ghcr.io/<org>/weecommerce-api:latest
    container_name: weecommerce-hono
    environment:
      - NODE_ENV=production
      - PORT=4000
      - DATABASE_URL=postgresql://weecommerce:${DB_PASSWORD}@postgres:5432/weecommerce
      - REDIS_URL=redis://redis:6379
      - RESEND_API_KEY=${RESEND_API_KEY}
      - RESEND_FROM=hello@weecommerce.web.id
      - ADMIN_EMAIL=hello@weecommerce.web.id
      - TURNSTILE_SECRET=${TURNSTILE_SECRET}
      - WEBHOOK_URL=${WEBHOOK_URL}
      - SENTRY_DSN=${SENTRY_DSN}
      - R2_ACCOUNT_ID=${R2_ACCOUNT_ID}
      - R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
      - R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}
      - R2_BUCKET=weecommerce-media
      - LOG_LEVEL=info
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - hono-logs:/app/logs
    restart: always
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:4000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s
    networks:
      - weecommerce-net

  postgres:
    image: postgres:16-alpine
    container_name: weecommerce-postgres
    environment:
      - POSTGRES_USER=weecommerce
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=weecommerce
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./db/init:/docker-entrypoint-initdb.d:ro
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U weecommerce -d weecommerce"]
      interval: 30s
      timeout: 5s
      retries: 5
    networks:
      - weecommerce-net

  redis:
    image: redis:7-alpine
    container_name: weecommerce-redis
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    restart: always
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - weecommerce-net

networks:
  weecommerce-net:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
  nextjs-cache:
  hono-logs:
```

### 2.4 Service Dependencies Graph

```
                    ┌─────────┐
                    │  Nginx  │
                    └────┬────┘
              ┌──────────┴──────────┐
              ▼                     ▼
        ┌──────────┐           ┌─────────┐
        │ Next.js  │           │  Hono   │
        └────┬─────┘           └────┬────┘
             │                      │
             │  (Server Components  │  (DB queries,
             │   fetch via API_URL) │   cache, external)
             └──────────┬───────────┘
                        ▼
              ┌──────────────────┐
              │  PostgreSQL      │
              └──────────────────┘
                        ▲
                        │
              ┌──────────────────┐
              │  Redis           │
              └──────────────────┘

External (HTTPS, from Hono):
  R2 ─── Resend ─── Sentry ─── Plausible (browser) ─── n8n (webhook out)
```

---

## 3. Service Responsibilities

### 3.1 Nginx (Reverse Proxy)

**Role:** Single entry point. Handle semua transport-level concerns.

**Responsibilities:**
- SSL/TLS termination (Let's Encrypt via Certbot atau Dokploy built-in).
- HTTP → HTTPS redirect (301).
- Routing:
  - `/` → Next.js (frontend)
  - `/api/*` → Hono API
  - `/sitemap.xml`, `/robots.txt`, `/feed.xml`, `/llms.txt`, `/llms-full.txt`, `/ai-sitemap.xml` → Hono
  - `/storage/*` → Cloudflare R2 (via signed URL redirect, atau direct R2 public URL)
- Security headers (HSTS, CSP, X-Frame-Options, dll — full list di [SECURITY.md](./SECURITY.md)).
- Rate limiting zones (general, contact form, search).
- Gzip + Brotli compression.
- Static asset caching (1 year untuk hashed assets).

**Tidak boleh:** Business logic, content generation, database access.

### 3.2 Next.js Frontend

**Role:** Presentation layer + user interaction.

**Responsibilities:**
- SSR (Server-Side Rendering) untuk dynamic pages.
- SSG (Static Site Generation) untuk marketing pages yang jarang berubah (Home, About, Pricing, FAQ).
- ISR (Incremental Static Regeneration) untuk blog & portfolio (`revalidate: 3600`).
- Server Components by default (zero JS untuk most content).
- Client Components only bila perlu interactivity (form, theme toggle, filter, dialog) — pakai Shadcn/UI.
- Image optimization via `next/image` (auto WebP, srcset, lazy load).
- Font optimization via `next/font` (Inter body, Space Grotesk display, JetBrains Mono code).
- Admin UI (route protected).
- Plausible analytics script inject (`<script>` di layout).

**Komunikasi:**
- Fetch data dari Hono API via `API_URL` (server-side, internal Docker network).
- Client-side fetch untuk form submission, search, filter.

**Tidak boleh:** Direct database access, business logic, email sending, sitemap generation.

### 3.3 Hono API (Backend Monolith)

**Role:** Business logic + content management + SEO/AI generation.

**Responsibilities:**
- **CMS read endpoints** — `/api/v1/posts`, `/case-studies`, `/services`, `/team`, `/faq` (data dari PostgreSQL).
- **Contact form** — `POST /api/v1/contact` (validate via Zod, Turnstile verify, save to DB, email via Resend, webhook dispatch).
- **Newsletter** — `POST /api/v1/newsletter/subscribe` (double opt-in flow).
- **SEO generation** — `/sitemap.xml`, `/sitemap-images.xml`, `/robots.txt`, `/feed.xml` (built from DB content, cached di Redis).
- **GEO generation** — `/llms.txt`, `/llms-full.txt`, `/ai-sitemap.xml` (built from DB content).
- **Public AI API** — `/api/v1/public/*` (machine-readable JSON untuk AI training/citation, no auth, generous rate limit).
- **Markdown export** — `/api/v1/public/blog/:slug/markdown` (clean markdown tanpa HTML).
- **Webhook dispatch** — POST to `WEBHOOK_URL` (n8n) on contact form submit, with retry logic.
- **Health check** — `GET /health` (DB + Redis connectivity).

**Middleware stack:**
- `helmet` (security headers — defense-in-depth, Nginx juga set).
- `cors` (allow `weecommerce.web.id` + `www.weecommerce.web.id`).
- `logger` (pino structured JSON logs → file `/app/logs` + Sentry breadcrumb).
- `rateLimit` (Redis-backed sliding window, per endpoint zone).
- `compress` (gzip).
- `compress` (gzip).
- Error handler (capture to Sentry, return sanitized JSON).

**Hono app skeleton:**

```typescript
// apps/api/src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { compress } from 'hono/compress';
import * as Sentry from '@sentry/node';

import { rateLimit } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { dbHealth, redisHealth } from './lib/health';

import publicRoutes from './routes/public';      // /api/v1/public/*
import contentRoutes from './routes/content';    // /api/v1/posts, /case-studies, dll
import contactRoutes from './routes/contact';    // /api/v1/contact, /newsletter
import seoRoutes from './routes/seo';            // /sitemap.xml, /robots.txt, /llms.txt

const app = new Hono();

// Sentry init (if DSN configured)
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV });
}

// Core middleware
app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', compress());
app.use('*', cors({
  origin: [
    'https://weecommerce.web.id',
    'https://www.weecommerce.web.id',
  ],
  credentials: true,
}));
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

// Routes
app.route('/api/v1/public', publicRoutes);
app.route('/api/v1', contentRoutes);
app.route('/api/v1', contactRoutes);
app.route('/', seoRoutes); // sitemap, robots, llms.txt at root

// 404
app.notFound((c) => c.json({ error: 'Not Found', status: 404 }, 404));

// Error handler
app.onError(errorHandler);

export default app;
```

**Tidak boleh:** Render HTML pages (itu Next.js job), direct user-facing UI.

### 3.4 PostgreSQL

**Role:** Single source of truth untuk semua persistent data.

**Tabel:** Lihat [DATABASE.md](./DATABASE.md) untuk full schema. Singkat:
- Content: `posts`, `categories`, `tags`, `case_studies`, `services`, `faq`, `team_members`, `pages`.
- Media: `media_files` (R2 key reference).
- Leads: `form_submissions`, `newsletter_subscribers`.
- SEO: `seo_metadata`, `redirects`.
- Audit: `audit_logs`.

**Connection:** TLS-enabled, parameterized queries via `pg` driver (no string concat → SQL injection prevention).

### 3.5 Redis

**Role:** In-memory cache + rate limit counter store.

**Use cases:**
- API response cache (TTL 1 jam untuk content, 30 menit untuk query results).
- Rate limit counters (sliding window via sorted set).
- Session storage (admin dashboard, Phase 2 client portal).
- Next.js Data Cache invalidation signals.

**Eviction policy:** `allkeys-lru`, max 256 MB (VPS 2GB budget).

---

## 4. Data Flow

### 4.1 Visitor Request Flow (read, e.g., load `/services/launch`)

```
1. Visitor buka https://weecommerce.web.id/services/launch
   │
2. Cloudflare (DNS or proxy mode)
   ├─ DNS resolve weecommerce.web.id → VPS IP
   ├─ (proxy mode) Check edge cache — miss
   └─ Forward to origin (VPS)
   │
3. Nginx (Reverse Proxy)
   ├─ Terminate TLS
   ├─ Apply security headers
   ├─ Rate limit check (general zone, 10 r/s burst 20)
   ├─ Route / → nextjs:3000
   └─ Proxy pass with X-Forwarded-For, X-Forwarded-Proto
   │
4. Next.js (Server Component)
   ├─ Cache check (ISR, revalidate: 3600)
   │  ├─ HIT: Return cached HTML → Nginx → Browser (FAST, ~50ms)
   │  └─ MISS/STALE: Render server-side
   ├─ Server Component fetch: GET http://hono:4000/api/v1/services/launch
   │   │
   │   └─5. Hono API
   │      ├─ Rate limit check
   │      ├─ Redis cache check: "service:launch"
   │      │  ├─ HIT: Return JSON (5ms)
   │      │  └─ MISS: Query PostgreSQL
   │      │     ├─ SELECT * FROM services WHERE slug = 'launch'
   │      │     └─ SELECT * FROM service_features WHERE service_id = ...
   │      ├─ Cache result in Redis (TTL 1h)
   │      └─ Return JSON
   │
6. Next.js render HTML dengan data
   │
7. Nginx
   ├─ Gzip compress
   ├─ Add cache headers (Cache-Control: s-maxage=3600, stale-while-revalidate)
   └─ Return ke browser
   │
8. Browser
   ├─ Parse HTML
   ├─ Load CSS (inlined critical + deferred)
   ├─ Hydrate React (Shadcn islands only)
   ├─ Load images (lazy via next/image)
   └─ Display page
```

**Typical TTFB:** ~100–200ms (ISR hit) atau ~300–500ms (full render).

### 4.2 Contact Form Submission Flow

```
1. User isi form di /contact (Shadcn Form + React Hook Form + Zod)
   │
2. Client-side validation (zod schema shared dengan server)
   ├─ Invalid: Show error per field, stop
   └─ Valid: Continue
   │
3. Generate Turnstile token (browser, Cloudflare widget)
   │
4. POST /api/v1/contact
   Body: { name, email, company, message, phone, turnstileToken, honeypot }
   │
5. Nginx
   ├─ Rate limit: contact_form zone (5/hour/IP)
   ├─ Honeypot check (jika honeypot field filled → bot → 400 silently)
   └─ Proxy pass to hono:4000
   │
6. Hono API (contactRoutes)
   ├─ Parse body
   ├─ Validate with Zod (server-side, source of truth)
   │  └─ Invalid: Return 422 with field errors
   ├─ Verify Turnstile token (POST to Cloudflare siteverify)
   │  └─ Invalid: Return 400 "CAPTCHA verification failed"
   ├─ Sanitize inputs (escape HTML untuk display safety)
   ├─ INSERT INTO form_submissions (...) — parameterized
   │  └─ Get submission_id
   │
   ├─ ASYNC (parallel, non-blocking):
   │  ├─7a. Resend: send email ke ADMIN_EMAIL
   │  │      Subject: "New contact form submission from {name}"
   │  │      Body: All form data + metadata
   │  │
   │  ├─7b. Resend: send auto-reply ke user email
   │  │      Subject: "Thanks for reaching out, {name}!"
   │  │
   │  └─7c. Webhook: POST to WEBHOOK_URL (n8n) jika configured
   │         Body: { event: "contact_form.submitted", data: {...} }
   │         Retry: 3x dengan exponential backoff (5s, 30s, 5min)
   │
   └─8. Return 200 JSON: { success: true, message: "Thank you..." }
   │
9. Next.js client
   ├─ Show success state (Shadcn Toast / inline)
   ├─ Reset form
   └─ (Optional) redirect to /thank-you
```

### 4.3 Sitemap/llms.txt Generation Flow

```
1. Scheduled trigger: cron job (Hono internal) every 24h OR
   Content update trigger: webhook dari admin dashboard
   │
2. Hono seoRoutes
   ├─ Query PostgreSQL untuk semua published content
   │  ├─ All pages (Home, About, Services, dll)
   │  ├─ All published posts
   │  ├─ All published case_studies
   │  └─ All team members
   ├─ Build XML/JSON/markup string
   ├─ Cache di Redis: "sitemap:xml", "llms:txt", "llms-full:txt" (TTL 24h)
   └─ (Next.js ISR revalidate dipicu untuk page yang related)
   │
3. Crawler (Googlebot atau GPTBot) request /sitemap.xml
   ├─ Nginx → Hono
   ├─ Redis HIT → return cached (FAST)
   └─ Redis MISS → regenerate (cold start ~500ms)
```

---

## 5. Caching Strategy

### 5.1 Multi-Layer Cache

```
┌─────────────────────────────────────────────────┐
│ Layer 1: Browser Cache                          │
│ ├─ Hashed assets (JS/CSS): max-age=31536000     │
│ ├─ Images: max-age=31536000                     │
│ └─ HTML: no-cache (always revalidate)           │
└────────────────────┬────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer 2: Cloudflare Edge Cache (jika proxy on)  │
│ ├─ Static content: 1 month                      │
│ ├─ API responses: 10 minutes                    │
│ └─ Purge on content update (webhook)            │
└────────────────────┬────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer 3: Next.js Data Cache + ISR              │
│ ├─ Page HTML: revalidate 3600s (1h)            │
│ ├─ Fetch cache: tag-based invalidation          │
│ └─ Triggered by Hono on content update          │
└────────────────────┬────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer 4: Redis Cache (Hono API)                 │
│ ├─ API responses: 1 hour                        │
│ ├─ Query results: 30 minutes                    │
│ ├─ Sitemap/llms.txt: 24 hours                   │
│ └─ Rate limit counters: per-window              │
└────────────────────┬────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer 5: PostgreSQL                             │
│ ├─ Prepared statements                          │
│ ├─ Connection pool (max 20)                     │
│ └─ Indexes on hot columns                       │
└─────────────────────────────────────────────────┘
```

### 5.2 Cache Invalidation Chain

Konten update (admin dashboard):

```
1. Content updated (e.g., blog post published)
   │
2. Hono API
   ├─ INSERT/UPDATE PostgreSQL
   ├─ Redis DEL "posts:*" (wildcard via SCAN)
   ├─ Redis DEL "sitemap:xml" (force regenerate on next crawl)
   ├─ Redis DEL "llms-full:txt" (company overview berubah)
   └─ Revalidate Next.js: POST http://nextjs:3000/api/revalidate
        Body: { secret, path: '/blog', tag: 'posts' }
   │
3. Next.js
   ├─ Purge ISR cache untuk affected paths
   └─ Fresh content live in < 1 second
```

### 5.3 Redis Helper (Hono)

```typescript
// apps/api/src/lib/cache.ts
import { redis } from './redis';

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
      // Corrupt cache, fall through to fetch
    }
  }

  const fresh = await fetchFn();
  await redis.setex(key, ttlSeconds, JSON.stringify(fresh));
  return fresh;
}

export async function invalidate(pattern: string): Promise<void> {
  // Use SCAN to find keys matching pattern, then delete
  let cursor = '0';
  do {
    const [nextCursor, keys] = await redis.scan(
      cursor, 'MATCH', pattern, 'COUNT', 100,
    );
    cursor = nextCursor;
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== '0');
}
```

---

## 6. Rate Limiting

### 6.1 Rate Limit Zones

| Zone | Path | Limit | Window | Burst | Storage |
|---|---|---|---|---|---|
| General API | `/api/*` (read) | 1000 req | 1 hour | 20 | Nginx (per IP) |
| Contact form | `/api/v1/contact` | 5 req | 1 hour | 2 | Redis (per IP) |
| Newsletter | `/api/v1/newsletter/*` | 3 req | 1 hour | 1 | Redis (per IP) |
| Search | `/api/v1/posts/search` | 100 req | 1 minute | 10 | Nginx (per IP) |
| Public AI API | `/api/v1/public/*` | 100 req | 1 hour | 10 | Redis (per IP, generous) |
| Login (admin) | `/api/v1/admin/login` | 10 req | 15 minutes | 1 | Redis (per IP) |

### 6.2 Nginx Rate Limit Config

```nginx
# nginx/conf.d/rate-limit.conf
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=search:10m rate=100r/m;

server {
    # General API
    location /api/ {
        limit_req zone=general burst=20 nodelay;
        proxy_pass http://hono;
    }

    # Search endpoint (stricter)
    location = /api/v1/posts/search {
        limit_req zone=search burst=10 nodelay;
        proxy_pass http://hono;
    }
}
```

### 6.3 Hono Redis-Backed Rate Limit (Application-Level)

Digunakan untuk endpoint yang butuh logic lebih kompleks (e.g., contact form dengan per-email limit juga):

```typescript
// apps/api/src/middleware/rateLimit.ts
import type { Context, Next } from 'hono';
import { redis } from '../lib/redis';

interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
  keyPrefix: string;
  keyFn?: (c: Context) => string; // default: IP
}

export function rateLimit(opts: RateLimitOptions) {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const keyExtra = opts.keyFn ? opts.keyFn(c) : ip;
    const key = `ratelimit:${opts.keyPrefix}:${keyExtra}`;

    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, opts.windowSeconds);
    }

    c.header('X-RateLimit-Limit', String(opts.limit));
    c.header('X-RateLimit-Remaining', String(Math.max(0, opts.limit - count)));
    c.header('X-RateLimit-Reset', String(opts.windowSeconds));

    if (count > opts.limit) {
      return c.json(
        { error: 'Too Many Requests', status: 429, message: 'Rate limit exceeded. Try again later.' },
        429,
      );
    }

    await next();
  };
}
```

Usage di contact route:

```typescript
// apps/api/src/routes/contact.ts
import { Hono } from 'hono';
import { rateLimit } from '../middleware/rateLimit';

const app = new Hono();

app.post(
  '/contact',
  rateLimit({ limit: 5, windowSeconds: 3600, keyPrefix: 'contact' }),
  async (c) => { /* ... */ },
);

export default app;
```

---

## 7. Service Communication

### 7.1 Internal (Docker Network)

| From | To | Method | Use |
|---|---|---|---|
| Nginx | Next.js | HTTP proxy | Render request |
| Nginx | Hono | HTTP proxy | API request |
| Next.js | Hono | HTTP fetch (Server Component) | Data fetching |
| Next.js (client) | Hono | HTTP fetch | Form submit, search, filter |
| Hono | PostgreSQL | TCP (pg driver) | Data read/write |
| Hono | Redis | TCP (redis client) | Cache, rate limit |
| Hono | Next.js | HTTP POST (ISR revalidate) | Cache invalidation |

### 7.2 External (HTTPS)

| From | To | Method | Use |
|---|---|---|---|
| Next.js (client) | Plausible | HTTPS (script) | Analytics |
| Next.js (client) | Cloudflare Turnstile | HTTPS (widget) | Spam protection |
| Hono | Cloudflare R2 | HTTPS (S3 API) | Image/file storage |
| Hono | Resend | HTTPS (REST API) | Send email |
| Hono | Sentry | HTTPS | Error tracking |
| Hono | n8n (Alif's) | HTTPS (webhook POST) | Automation trigger |

### 7.3 Webhook Payload (Hono → n8n)

Pada contact form submit, Hono dispatch webhook ke n8n untuk automation (Slack notification, CRM sync, dll):

```json
{
  "event": "contact_form.submitted",
  "timestamp": "2026-06-28T10:00:00Z",
  "data": {
    "id": "01HXY...",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Inc",
    "phone": "+62...",
    "message": "...",
    "spam_score": 0.1,
    "source": "weecommerce.web.id"
  }
}
```

**Retry policy:**
- Attempt 1: Immediate.
- Attempt 2: +5 seconds.
- Attempt 3: +30 seconds.
- Attempt 4: +5 minutes.
- Max 4 attempts. Log failure ke `submission_logs` table untuk manual review.

---

## 8. Error Handling & Resilience

### 8.1 Global Error Handler (Hono)

```typescript
// apps/api/src/middleware/errorHandler.ts
import type { Context } from 'hono';
import * as Sentry from '@sentry/node';

export function errorHandler(err: Error, c: Context) {
  const status = (err as any).status || 500;
  const isServerError = status >= 500;

  // Log dengan konteks
  console.error({
    timestamp: new Date().toISOString(),
    level: isServerError ? 'error' : 'warn',
    message: err.message,
    path: c.req.path,
    method: c.req.method,
    stack: err.stack,
  });

  // Send ke Sentry untuk server errors
  if (isServerError && process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  // Return sanitized response (jangan leak stack trace ke client)
  return c.json(
    {
      error: isServerError ? 'Internal Server Error' : err.message,
      status,
      timestamp: new Date().toISOString(),
    },
    status,
  );
}
```

### 8.2 Graceful Degradation

Jika external service gagal, fallback ke cached/hardcoded data:

```typescript
// apps/api/src/routes/content.ts
import { getOrSet } from '../lib/cache';
import { db } from '../lib/db';

const FALLBACK_SERVICES = [
  { slug: 'launch', name: 'LAUNCH', price_idr: 15000000, price_usd: 2500 },
  { slug: 'convert', name: 'CONVERT', price_idr: 38000000, price_usd: 6000 },
  { slug: 'scale', name: 'SCALE', price_idr: 70000000, price_usd: 11000 },
  { slug: 'integrate', name: 'INTEGRATE', price_idr: 8000000, price_usd: 1200 },
];

app.get('/services', async (c) => {
  try {
    const services = await getOrSet('services:all', 3600, () =>
      db.query('SELECT * FROM services ORDER BY sort_order'),
    );
    return c.json({ data: services });
  } catch (err) {
    // DB down — return fallback (cached or hardcoded)
    return c.json({ data: FALLBACK_SERVICES, _fallback: true });
  }
});
```

### 8.3 Circuit Breaker (untuk External Services)

Untuk mencegah cascade failure bila external service (R2, Resend) down:

```typescript
// apps/api/src/lib/circuitBreaker.ts
class CircuitBreaker {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  failureCount = 0;
  failureThreshold = 5;
  resetTimeoutMs = 60000;
  lastFailureAt = 0;

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureAt > this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker OPEN');
      }
    }
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureAt = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

export const emailBreaker = new CircuitBreaker();
export const storageBreaker = new CircuitBreaker();
```

### 8.4 Container Restart Policy

Semua container set `restart: always` di docker-compose. Docker akan:
- Restart container yang crash.
- Backoff exponentially (10s, 20s, 40s, ...).
- Max 5 attempts dalam window.

Untuk OOM: Docker akan restart container yang exceed memory limit (jika `mem_limit` set). Tidak ada limit di MVP (headroom cukup).

---

## 9. External Integrations

### 9.1 Cloudflare R2 (Storage)

- **Protocol:** S3-compatible API.
- **Use:** Image upload (blog featured, portfolio gallery), PDF assets.
- **Bucket:** `weecommerce-media`.
- **Access:** Private bucket + signed URLs (24h expiry) untuk upload. Public read via custom domain `cdn.weecommerce.web.id` (atau R2 public URL).
- **Image transformation:** Cloudflare Image Resizing (jika proxy on) OR pre-generate multiple sizes saat upload via `sharp`.

```typescript
// apps/api/src/lib/r2.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(r2, command, { expiresIn: 3600 });
}

export function getPublicUrl(key: string): string {
  return `https://cdn.weecommerce.web.id/${key}`;
}
```

### 9.2 Resend (Email)

- **Use:** Transactional email (contact form admin notification + auto-reply, newsletter opt-in).
- **Free tier:** 3,000 emails/month, 100/day. Cukup untuk MVP.
- **From:** `hello@weecommerce.web.id` (domain verified via DNS).
- **Templates:** Inline HTML (kept simple) atau Resend React Email templates.

```typescript
// apps/api/src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminNotification(submission: ContactSubmission) {
  return resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: process.env.ADMIN_EMAIL!,
    subject: `New inquiry from ${submission.name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(submission.company || 'N/A')}</p>
      <p><strong>Phone:</strong> ${escapeHtml(submission.phone || 'N/A')}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(submission.message).replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submitted: ${new Date().toISOString()}</small></p>
    `,
  });
}
```

### 9.3 Sentry (Error Tracking)

- **Use:** Capture unhandled exceptions di Hono + Next.js.
- **Free tier:** 5,000 errors/month.
- **Init:** SDK in both apps, DSN via env var.
- **Release tracking:** Tag dengan git SHA (CI inject).

### 9.4 UptimeRobot (Uptime Monitoring)

- **Use:** Monitor `https://weecommerce.web.id/health` setiap 5 menit.
- **Alert:** Email + Slack/Discord webhook jika down > 1 min.
- **Free tier:** 50 monitors, 5-min interval.

### 9.5 Plausible (Analytics)

- **Use:** Privacy-focused analytics (cookieless, GDPR-compliant by default).
- **Deploy:** Plausible Cloud ($9/bln) atau self-host di VPS yang sama (Phase 2 Engage).
- **Script:** Inject di Next.js root layout:
  ```tsx
  <script
    defer
    data-domain="weecommerce.web.id"
    src="https://plausible.io/js/script.js"
  />
  ```
- **Custom events:** Track form_submit, whatsapp_click, cta_click via `plausible('EventName')`.

### 9.6 Cloudflare Turnstile (Spam Protection)

- **Use:** Replace reCAPTCHA (privacy-friendly, no tracking).
- **Free.**
- **Implementation:**
  - Frontend: `<Turnstile />` Shadcn-wrapped component, generate token.
  - Backend: Verify token via POST ke `https://challenges.cloudflare.com/turnstile/v2/siteverify`.

### 9.7 n8n (Webhook Automation)

- **Use:** Alif's existing automation stack.
- **Trigger:** Hono webhook on contact form submit.
- **Workflows (Phase 1):**
  - New inquiry → Slack/Discord notification.
  - New inquiry → CRM row (Notion/Google Sheets).
  - Newsletter subscribe → Resend Audience add.

---

## 10. Scaling Path

### 10.1 Phase 0 (MVP, current)

```
1 VPS (2GB) — 5 container (nginx + nextjs + hono + postgres + redis)
Capacity: ~500 visitors/day, ~50 concurrent users
```

### 10.2 Phase 1: Vertical Scale

```
1 VPS upgrade (4GB, 2 vCPU) — same 5 container
Capacity: ~2,000 visitors/day, ~200 concurrent users
Cost: ~$6–10/month
```

Trigger: CPU usage > 70% sustained, atau memory pressure.

### 10.3 Phase 2 Engagement: Horizontal Scale (specific service)

```
1 VPS (4GB) — nginx + nextjs×2 + hono×2 + postgres + redis
Capacity: ~5,000 visitors/day
```

Trigger: Hono API response time > 1s p95, atau Next.js render queue build up.

Docker Compose scale:
```bash
docker-compose up -d --scale nextjs=2 --scale hono=2
```

Nginx upstream update untuk load balance:
```nginx
upstream nextjs_backend {
    least_conn;
    server weecommerce-nextjs-1:3000;
    server weecommerce-nextjs-2:3000;
}
```

### 10.4 Phase 3 Scale: Managed Services

```
1 VPS (4GB) — nginx + nextjs + hono + redis
External: Managed PostgreSQL (Neon, Supabase, atau Cloudflare D1)
Capacity: ~10,000+ visitors/day, automated backup, HA
```

Trigger: Database maintenance jadi bottleneck, atau butuh HA.

### 10.5 Phase 4: Microservices Extraction (if needed)

```
Multiple VPS or Kubernetes
Extract: search-service, notification-service, admin-service dari Hono monolith
Capacity: unlimited (with corresponding cost & operational overhead)
```

Trigger: Team growth (>1 dev), atau service-specific scaling needs.

**Trigger untuk arsitektur evolution** — lihat [ROADMAP.md §8](./ROADMAP.md) untuk decision matrix.

---

## Summary

Architecture ini provide:

- ✅ **Performance** — Multi-layer caching (browser → CDN → ISR → Redis → PG), optimized Next.js rendering.
- ✅ **Budget-friendly** — 5 container di VPS 2GB ($3–8/bln) + SaaS free tier (R2, Resend, Sentry, UptimeRobot, Turnstile).
- ✅ **Reliability** — Health checks, auto-restart, graceful degradation, circuit breaker untuk external services.
- ✅ **Maintainability** — Single backend codebase (Hono), clear boundary antara presentation (Next.js) dan business logic (Hono).
- ✅ **Security** — SSL/TLS, rate limiting, input validation, CSP, defense-in-depth. Detail di [SECURITY.md](./SECURITY.md).
- ✅ **Observability** — Sentry errors, UptimeRobot uptime, Plausible analytics, structured logs.
- ✅ **GEO-ready** — Hono generate `llms.txt`, `ai-sitemap.xml`, public AI API, markdown export. Detail di [SEO.md](./SEO.md).
- ✅ **Scalable path** — Clear upgrade route (vertical → horizontal → managed → microservices).

**Next:** [DATABASE.md](./DATABASE.md) untuk full schema & migrations.
