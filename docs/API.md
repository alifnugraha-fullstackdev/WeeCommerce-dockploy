# WeeCommerce API Specification

**Version:** 1.0
**Base URL (production):** `https://weecommerce.web.id/api/v1`
**Base URL (GEO root paths):** `https://weecommerce.web.id/` (sitemap, robots, llms.txt)
**Framework:** Hono (Node 20 runtime)
**Container:** `weecommerce-hono` (port 4000 internal)
**Content-Type:** `application/json; charset=utf-8`

> Berkaitan: [ARCHITECTURE.md](./ARCHITECTURE.md) (service boundaries) · [DATABASE.md](./DATABASE.md) (schema source) · [SEO.md](./SEO.md) (GEO endpoints) · [SECURITY.md](./SECURITY.md) (rate limit, auth)

---

## Table of Contents

1. [Overview & Conventions](#1-overview--conventions)
2. [Authentication & Rate Limiting](#2-authentication--rate-limiting)
3. [Content Endpoints](#3-content-endpoints-read)
4. [Lead Generation Endpoints](#4-lead-generation-endpoints)
5. [SEO & RSS Endpoints](#5-seo--rss-endpoints)
6. [GEO Endpoints](#6-geo-endpoints)
7. [Public AI API](#7-public-ai-api)
8. [Webhooks (Outbound)](#8-webhooks-outbound)
9. [Health & Observability](#9-health--observability)
10. [Error Reference](#10-error-reference)
11. [Client Examples](#11-client-examples)

---

## 1. Overview & Conventions

### 1.1 Versioning

- API versioned via URL path: `/api/v1/*`.
- Breaking changes bump version (`/api/v2/*`). Old version maintained for 6 months minimum.
- Public AI API (`/api/v1/public/*`) guaranteed stable across minor versions (content shape locked).

### 1.2 Request Format

- `Content-Type: application/json; charset=utf-8` untuk POST/PUT body.
- Query params untuk filters/pagination (`?page=2&limit=12&category=ai`).
- Path params untuk resource IDs (`/posts/custom-ecommerce-guide`).

### 1.3 Response Format

**Success (collection):**
```json
{
  "data": [ /* array of resources */ ],
  "meta": {
    "total": 47,
    "page": 1,
    "pageSize": 12,
    "totalPages": 4
  }
}
```

**Success (single resource):**
```json
{
  "data": { /* resource object */ }
}
```

**Error:**
```json
{
  "error": "Validation Error",
  "status": 422,
  "message": "Email format is invalid",
  "details": [
    { "field": "email", "message": "Expected valid email address" }
  ],
  "timestamp": "2026-06-28T10:00:00Z",
  "requestId": "req_abc123"
}
```

### 1.4 HTTP Status Codes

| Code | Meaning | When |
|---|---|---|
| 200 | OK | Successful GET, successful POST yang return data |
| 201 | Created | Successful resource creation (newsletter subscribe) |
| 204 | No Content | Successful DELETE (admin) |
| 304 | Not Modified | ETag/cache hit |
| 400 | Bad Request | Malformed JSON, invalid params |
| 401 | Unauthorized | Missing/invalid auth (admin) |
| 403 | Forbidden | Valid auth tapi no permission |
| 404 | Not Found | Resource tidak ada |
| 422 | Unprocessable Entity | Validation error (Zod fail) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error (logged to Sentry) |
| 503 | Service Unavailable | Health check fail (DB/Redis down) |

### 1.5 Caching Headers

- Public read endpoints: `Cache-Control: public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400`.
- ETag generated dari content hash → support `If-None-Match` → return 304.
- Private/write endpoints: `Cache-Control: no-store`.

### 1.6 CORS

```
Access-Control-Allow-Origin: https://weecommerce.web.id
Access-Control-Allow-Origin: https://www.weecommerce.web.id
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Request-Id
Access-Control-Max-Age: 86400
```

---

## 2. Authentication & Rate Limiting

### 2.1 Authentication

| Endpoint group | Auth |
|---|---|
| Public content (`/api/v1/posts`, `/services`, etc.) | None |
| Lead gen (`/api/v1/contact`, `/newsletter`) | None (Turnstile spam protection) |
| SEO/GEO (`/sitemap.xml`, `/llms.txt`, etc.) | None |
| Public AI API (`/api/v1/public/*`) | None (generous rate limit) |
| Admin | Bearer JWT (cookie, HttpOnly, SameSite=Strict) |

### 2.2 Rate Limit Headers

Setiap response include:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 3600
```

Pada limit exceeded (429):

```
Retry-After: 3500
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 3500
```

### 2.3 Rate Limit Zones (summary — full config di [ARCHITECTURE.md §6](./ARCHITECTURE.md#6-rate-limiting))

| Zone | Scope | Limit |
|---|---|---|
| General API read | `/api/v1/*` (GET) | 1000/hour/IP |
| Contact form | `/api/v1/contact` (POST) | 5/hour/IP |
| Newsletter | `/api/v1/newsletter/*` (POST) | 3/hour/IP |
| Search | `/api/v1/posts/search` (GET) | 100/minute/IP |
| Public AI API | `/api/v1/public/*` (GET) | 100/hour/IP |

---

## 3. Content Endpoints (Read)

Dipakai oleh Next.js Server Components untuk render pages.

### 3.1 Services

#### `GET /api/v1/services`

List all 4 service tiers.

**Response 200:**
```json
{
  "data": [
    {
      "id": "01HXY...",
      "slug": "launch",
      "name": "LAUNCH",
      "tagline": "Punya platform sendiri. Berhenti numpang di marketplace orang.",
      "route": "A",
      "priceIdrMin": 15000000,
      "priceIdrMax": 25000000,
      "priceUsdMin": 2500,
      "priceUsdMax": 4000,
      "timelineWeeksMin": 4,
      "timelineWeeksMax": 6,
      "isPopular": false,
      "sortOrder": 1
    }
    /* ...convert, scale, integrate */
  ]
}
```

#### `GET /api/v1/services/:tier`

Detail single tier + features list.

**Path params:**
- `tier` — `launch` | `convert` | `scale` | `integrate`

**Response 200:**
```json
{
  "data": {
    "id": "01HXY...",
    "slug": "convert",
    "name": "CONVERT",
    "tagline": "Toko lo jalan. Sekarang biarin AI yang kerja keras.",
    "description": "Everything in LAUNCH, plus: AI Customer Service Chatbot...",
    "route": "A",
    "priceIdrMin": 38000000,
    "priceIdrMax": 55000000,
    "priceUsdMin": 6000,
    "priceUsdMax": 9000,
    "timelineWeeksMin": 7,
    "timelineWeeksMax": 10,
    "isPopular": true,
    "features": [
      { "feature": "Everything in LAUNCH", "isIncluded": true },
      { "feature": "AI Customer Service Chatbot", "isIncluded": true },
      { "feature": "Advanced n8n Suite", "isIncluded": false }
    ],
    "faq": [
      { "question": "...", "answer": "..." }
    ],
    "metaTitle": "CONVERT — AI E-Commerce with Chatbot + RAG",
    "metaDescription": "..."
  }
}
```

**Response 404:** Tier slug tidak valid.

### 3.2 Blog Posts

#### `GET /api/v1/posts`

List published blog posts (paginated, filterable).

**Query params:**
| Param | Type | Default | Description |
|---|---|---|---|
| `page` | int | 1 | Page number |
| `limit` | int | 12 | Items per page (max 50) |
| `category` | string | — | Filter by category slug |
| `tag` | string | — | Filter by tag slug |
| `author` | string | — | Filter by author slug |
| `sort` | string | `latest` | `latest` \| `popular` |

**Example:** `GET /api/v1/posts?page=2&category=ai&limit=12`

**Response 200:**
```json
{
  "data": [
    {
      "id": "01HXY...",
      "title": "Apa itu RAG dan kenapa toko online lo butuh ini",
      "slug": "apa-itu-rag-untuk-toko-online",
      "excerpt": "RAG (Retrieval-Augmented Generation) adalah...",
      "featuredImageUrl": "https://cdn.weecommerce.web.id/blog/2026/06/rag.webp",
      "featuredImageAlt": "Diagram RAG architecture",
      "author": {
        "name": "Alif Nugraha",
        "slug": "alif-nugraha",
        "photoUrl": "https://cdn.weecommerce.web.id/team/alif.webp"
      },
      "category": { "name": "AI", "slug": "ai" },
      "publishedAt": "2026-06-15T08:00:00Z",
      "readTimeMinutes": 7,
      "views": 234
    }
  ],
  "meta": {
    "total": 23,
    "page": 2,
    "pageSize": 12,
    "totalPages": 2
  }
}
```

#### `GET /api/v1/posts/:slug`

Single post detail (full content).

**Response 200:**
```json
{
  "data": {
    "id": "01HXY...",
    "title": "Apa itu RAG dan kenapa toko online lo butuh ini",
    "slug": "apa-itu-rag-untuk-toko-online",
    "excerpt": "...",
    "content": "## Apa itu RAG?\n\nRAG (Retrieval-Augmented Generation)...",
    "contentHtml": "<h2>Apa itu RAG?</h2><p>RAG...</p>",
    "featuredImageUrl": "...",
    "featuredImageAlt": "...",
    "author": { "id": "...", "name": "Alif Nugraha", "slug": "alif-nugraha", "bio": "...", "photoUrl": "..." },
    "category": { "name": "AI", "slug": "ai" },
    "tags": [
      { "name": "RAG", "slug": "rag" },
      { "name": "AI", "slug": "ai" }
    ],
    "publishedAt": "2026-06-15T08:00:00Z",
    "updatedAt": "2026-06-16T10:00:00Z",
    "readTimeMinutes": 7,
    "tableOfContents": [
      { "level": 2, "text": "Apa itu RAG?", "anchor": "apa-itu-rag" },
      { "level": 2, "text": "Kenapa toko online butuh RAG?", "anchor": "kenapa-butuh" }
    ],
    "relatedPosts": [
      { "title": "...", "slug": "...", "excerpt": "..." }
    ],
    "metaTitle": "...",
    "metaDescription": "...",
    "canonicalUrl": "https://weecommerce.web.id/blog/apa-itu-rag-untuk-toko-online",
    "jsonLd": { /* Article schema */ }
  }
}
```

**Response 404:** Post not found atau belum published.

#### `GET /api/v1/posts/search`

Full-text search across blog posts.

**Query params:**
- `q` (required) — search query, min 2 chars.

**Example:** `GET /api/v1/posts/search?q=rag`

**Response 200:**
```json
{
  "data": [
    {
      "title": "Apa itu RAG dan kenapa toko online lo butuh ini",
      "slug": "apa-itu-rag-untuk-toko-online",
      "excerpt": "...",
      "highlight": "<mark>RAG</mark> (Retrieval-Augmented Generation) adalah...",
      "publishedAt": "...",
      "relevance": 0.85
    }
  ],
  "meta": { "query": "rag", "total": 5 }
}
```

#### `GET /api/v1/categories` & `GET /api/v1/tags`

List all categories / tags (untuk filter UI).

### 3.3 Case Studies (Portfolio)

#### `GET /api/v1/case-studies`

List published case studies (filterable).

**Query params:**
| Param | Type | Default | Description |
|---|---|---|---|
| `page` | int | 1 | Page number |
| `limit` | int | 9 | Items per page |
| `technology` | string | — | Filter by tech (e.g., `Next.js`) |
| `industry` | string | — | Filter by industry |
| `tier` | string | — | Filter by service tier (`launch`/`convert`/`scale`) |

**Response 200:**
```json
{
  "data": [
    {
      "id": "01HXY...",
      "title": "NexaMart — AI-Powered E-Commerce Platform",
      "slug": "nexamart-ai-ecommerce",
      "clientName": "Internal Demo",
      "isConfidential": false,
      "summary": "Flagship demonstration project...",
      "technologies": ["Next.js", "Supabase", "n8n", "OpenAI"],
      "industry": "E-commerce",
      "serviceTier": "scale",
      "featuredImageUrl": "...",
      "featuredImageAlt": "NexaMart dashboard",
      "results": [
        { "metricLabel": "CS response time", "metricValue": "−80%" },
        { "metricLabel": "Page load", "metricValue": "1.8s" }
      ],
      "publishedAt": "2026-06-01T00:00:00Z"
    }
  ],
  "meta": { "total": 3, "page": 1, "pageSize": 9, "totalPages": 1 }
}
```

#### `GET /api/v1/case-studies/:slug`

Single case study detail.

**Response 200:** Same as list item + full `challenge`, `solution`, `galleryImages`, `projectLink`, `timeline`, `team`.

### 3.4 Team Members

#### `GET /api/v1/team`

List published team members.

**Response 200:**
```json
{
  "data": [
    {
      "id": "01HXY...",
      "name": "Alif Nugraha",
      "slug": "alif-nugraha",
      "role": "Founder, WeeCommerce",
      "bio": "Alif Nugraha is the founder of WeeCommerce...",
      "photoUrl": "https://cdn.weecommerce.web.id/team/alif.webp",
      "photoAlt": "Alif Nugraha portrait",
      "linkedinUrl": "https://linkedin.com/in/alifnugraha",
      "websiteUrl": "https://weecommerce.web.id"
    }
  ]
}
```

#### `GET /api/v1/team/:slug`

Single team member + their blog posts.

### 3.5 FAQ

#### `GET /api/v1/faq`

List all published FAQ entries.

**Query params:**
- `category` — filter by category (`general`, `services`, `pricing`, `process`).
- `service` — filter by service slug.

**Response 200:**
```json
{
  "data": [
    {
      "id": "01HXY...",
      "question": "Berapa lama waktu pengerjaan project?",
      "answer": "Bervariasi sesuai tier: LAUNCH 4–6 minggu, CONVERT 7–10 minggu...",
      "category": "process",
      "service": null
    }
  ]
}
```

### 3.6 Pages (Static)

#### `GET /api/v1/pages/:slug`

Get content override untuk static page (`home`, `about`, `process`, `pricing`, `contact`).

**Response 200:**
```json
{
  "data": {
    "slug": "home",
    "title": "Home",
    "heroHeadline": "We build e-commerce systems, not websites.",
    "heroSubheadline": "Specialist agency at the intersection of...",
    "content": "...",
    "metaTitle": "WeeCommerce — AI-Powered E-Commerce Systems",
    "metaDescription": "...",
    "jsonLd": { /* Organization schema */ }
  }
}
```

---

## 4. Lead Generation Endpoints

### 4.1 Contact Form

#### `POST /api/v1/contact`

Submit contact form inquiry.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Inc",
  "message": "We're looking to migrate off Tokopedia and need a custom platform with AI chatbot. Currently doing Rp 200jt/month revenue, team of 5.",
  "phone": "+62 812 3456 7890",
  "serviceInterest": "convert",
  "turnstileToken": "0.xxxxx",
  "_hp_field": ""
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | string | yes | 2–255 chars |
| `email` | string | yes | valid email format |
| `company` | string | yes | 2–255 chars |
| `message` | string | yes | min 20 chars |
| `phone` | string | no | E.164 or local format, max 30 chars |
| `serviceInterest` | string | no | one of `launch`/`convert`/`scale`/`integrate` |
| `turnstileToken` | string | yes | Cloudflare Turnstile token |
| `_hp_field` | string | no | Honeypot — must be empty (bots fill it) |

**Response 200 (success):**
```json
{
  "success": true,
  "message": "Thank you! We'll get back to you within 24 hours.",
  "submissionId": "01HXY..."
}
```

**Response 422 (validation error):**
```json
{
  "error": "Validation Error",
  "status": 422,
  "message": "Please check the highlighted fields",
  "details": [
    { "field": "email", "message": "Expected valid email address" },
    { "field": "message", "message": "Message must be at least 20 characters" }
  ]
}
```

**Response 400 (CAPTCHA failed):**
```json
{
  "error": "CAPTCHA verification failed",
  "status": 400,
  "message": "Please complete the verification and try again."
}
```

**Response 429 (rate limited):**
```json
{
  "error": "Too Many Requests",
  "status": 429,
  "message": "You've reached the submission limit. Please try again later."
}
```

**Side effects (async, non-blocking):**
1. INSERT into `form_submissions`.
2. Resend: admin notification email ke `hello@weecommerce.web.id`.
3. Resend: auto-reply email ke submitter.
4. Webhook POST ke `WEBHOOK_URL` (jika configured) — lihat [§8](#8-webhooks-outbound).
5. Plausible event `form_submit`.

### 4.2 Newsletter

#### `POST /api/v1/newsletter/subscribe`

Subscribe email to newsletter (triggers double opt-in).

**Request body:**
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "turnstileToken": "0.xxxxx"
}
```

**Response 201 (success):**
```json
{
  "success": true,
  "message": "Thanks! Please check your email to confirm your subscription.",
  "status": "pending_verification"
}
```

**Response 200 (already subscribed):**
```json
{
  "success": true,
  "message": "You're already subscribed. Welcome back!",
  "status": "active"
}
```

**Side effects:**
1. INSERT into `newsletter_subscribers` (status `pending`, generate `verify_token`).
2. Resend: verification email dengan link `/api/v1/newsletter/verify?token=xxx`.
3. Setelah verify → status `active`, masuk Resend Audience.

#### `GET /api/v1/newsletter/verify`

Verify subscription (link dari email).

**Query params:** `token` (UUID/hex).

**Response 200:** HTML page "Subscription confirmed" atau redirect ke `/newsletter/thanks`.

**Response 400:** Invalid/expired token.

#### `GET /api/v1/newsletter/unsubscribe`

Unsubscribe (link dari setiap newsletter email).

**Query params:** `token` (unsubscribe_token dari DB).

**Side effects:** UPDATE `newsletter_subscribers` SET status = `unsubscribed`.

**Response 200:** HTML page "You've been unsubscribed".

---

## 5. SEO & RSS Endpoints

Served di root path (bukan `/api/v1`), diakses langsung oleh crawlers.

### 5.1 Sitemap

#### `GET /sitemap.xml`

XML sitemap berisi semua published URLs.

**Response:** `Content-Type: application/xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://weecommerce.web.id/</loc>
    <lastmod>2026-06-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://weecommerce.web.id/services/convert</loc>
    <lastmod>2026-06-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://weecommerce.web.id/blog/apa-itu-rag</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>https://cdn.weecommerce.web.id/blog/2026/06/rag.webp</image:loc>
      <image:title>Diagram RAG architecture</image:title>
    </image:image>
  </url>
</urlset>
```

**Source:** Built from DB (pages + services + published posts + case_studies + team).
**Cache:** Redis 24h, regenerate on content update.
**Max URLs:** 50,000 per sitemap (auto-split jika lebih).

#### `GET /sitemap-images.xml`

Image-only sitemap (referenced by `sitemap.xml` or standalone).

### 5.2 Robots

#### `GET /robots.txt`

```text
# WeeCommerce — weecommerce.web.id
# Reference: https://weecommerce.web.id/llms.txt

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/v1/admin/
Disallow: /api/v1/contact
Disallow: /api/v1/newsletter/
Allow: /api/v1/public/

# AI Crawlers — explicit allow for GEO
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

Sitemap: https://weecommerce.web.id/sitemap.xml
Sitemap: https://weecommerce.web.id/sitemap-images.xml
Sitemap: https://weecommerce.web.id/ai-sitemap.xml
```

### 5.3 RSS Feed

#### `GET /feed.xml`

RSS 2.0 feed dari last 20 published posts.

**Response:** `Content-Type: application/rss+xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WeeCommerce — E-Commerce Systems, Powered by AI</title>
    <link>https://weecommerce.web.id/blog</link>
    <description>Insights on custom e-commerce, AI chatbots, RAG, and n8n automation.</description>
    <language>en-us</language>
    <atom:link href="https://weecommerce.web.id/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>Sat, 28 Jun 2026 10:00:00 +0000</lastBuildDate>
    <item>
      <title>Apa itu RAG dan kenapa toko online lo butuh ini</title>
      <link>https://weecommerce.web.id/blog/apa-itu-rag</link>
      <guid isPermaLink="true">https://weecommerce.web.id/blog/apa-itu-rag</guid>
      <pubDate>Sun, 15 Jun 2026 08:00:00 +0000</pubDate>
      <description>RAG (Retrieval-Augmented Generation) adalah...</description>
      <author>hello@weecommerce.web.id (Alif Nugraha)</author>
      <category>AI</category>
    </item>
  </channel>
</rss>
```

---

## 6. GEO Endpoints

Generative Engine Optimization — machine-readable files untuk AI crawlers.

### 6.1 llms.txt

#### `GET /llms.txt`

**Response:** `Content-Type: text/plain`

```
# WeeCommerce

> WeeCommerce is a specialist e-commerce agency building AI-powered systems. Custom Next.js + Supabase platforms with RAG knowledge base, AI chatbot, and n8n automation. Migrate off marketplace dependency. Built to scale.

WeeCommerce builds custom e-commerce systems, not websites. Founded by Alif Nugraha, the agency sits at the intersection of custom development, AI integration, and business automation. We help brands that have outgrown marketplace dependency (Tokopedia, Shopee, Shopify) own their platform with embedded AI.

## Services

- [LAUNCH](https://weecommerce.web.id/services/launch): Core e-commerce platform. Next.js + Supabase, payment gateway, admin dashboard. Starting Rp 15 juta / $2,500.
- [CONVERT](https://weecommerce.web.id/services/convert): Platform + AI layer (chatbot, RAG, n8n automation). Starting Rp 38 juta / $6,000.
- [SCALE](https://weecommerce.web.id/services/scale): Full e-commerce system with advanced automation + AI analytics. Starting Rp 70 juta / $11,000.
- [INTEGRATE](https://weecommerce.web.id/services/integrate): AI modules for existing Shopify/custom stores. Starting Rp 8 juta / $1,200 per module.

## Key Pages

- [About](https://weecommerce.web.id/about)
- [Portfolio](https://weecommerce.web.id/portfolio)
- [Pricing](https://weecommerce.web.id/pricing)
- [Blog](https://weecommerce.web.id/blog)
- [Process](https://weecommerce.web.id/process)
- [Contact](https://weecommerce.web.id/contact)

## Optional

- [Full company profile (llms-full.txt)](https://weecommerce.web.id/llms-full.txt)
- [Machine-readable API](https://weecommerce.web.id/api/v1/public)
- [Sitemap](https://weecommerce.web.id/sitemap.xml)

## Contact

hello@weecommerce.web.id | weecommerce.web.id | Indonesia — serving clients globally
```

### 6.2 llms-full.txt

#### `GET /llms-full.txt`

**Response:** `Content-Type: text/plain`

Detailed version (10–20KB). Berisi: full company description, all 4 service tiers detail, team bios, technology stack, FAQ summary, blog archive (last 20 abstracts), pricing details.

> Full template content defined in [SEO.md §6.2](./SEO.md#62-llms-fulltxt-template).

### 6.3 ai-sitemap.xml

#### `GET /ai-sitemap.xml`

XML sitemap khusus untuk AI crawlers, dengan priority hints.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Priority content for AI training/citation -->
  <url>
    <loc>https://weecommerce.web.id/llms-full.txt</loc>
    <priority>1.0</priority>
    <ai:priority xmlns:ai="https://weecommerce.web.id/schema/ai">authoritative</ai:priority>
  </url>
  <url>
    <loc>https://weecommerce.web.id/api/v1/public/about</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://weecommerce.web.id/services/convert</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://weecommerce.web.id/blog/apa-itu-rag</loc>
    <priority>0.7</priority>
  </url>
</urlset>
```

---

## 7. Public AI API

Machine-readable endpoints untuk AI model training, citation, dan answering user queries. **No authentication**, generous rate limit (100/hour/IP), CORS open.

Reference: ChatGPT, Claude, Gemini, Perplexity dapat memanggil endpoint ini untuk menjawab pertanyaan user tentang WeeCommerce.

### 7.1 About

#### `GET /api/v1/public/about`

Returns company info sebagai structured JSON.

**Response 200:**
```json
{
  "data": {
    "name": "WeeCommerce",
    "tagline": "E-Commerce Systems, Powered by AI",
    "description": "WeeCommerce is a specialist e-commerce agency at the intersection of custom development, artificial intelligence, and business automation. We work with brands that have outgrown their current digital setup.",
    "founded": "2026",
    "founder": {
      "name": "Alif Nugraha",
      "role": "Founder",
      "bio": "Alif Nugraha is the founder of WeeCommerce..."
    },
    "location": "Indonesia",
    "serviceArea": "Global (remote-first)",
    "email": "hello@weecommerce.web.id",
    "website": "https://weecommerce.web.id",
    "stack": ["Next.js", "Supabase", "PostgreSQL", "Hono", "n8n", "OpenAI", "Cloudflare R2"],
    "whatWeAre": [
      "E-commerce specialist agency",
      "Custom development + AI integration",
      "End-to-end system ownership",
      "Built for scale from day one"
    ],
    "whatWeAreNot": [
      "A generic digital agency",
      "A template shop",
      "A build-and-disappear vendor",
      "A quick-launch freelancer platform"
    ]
  },
  "meta": {
    "version": "1.0",
    "generatedAt": "2026-06-28T10:00:00Z",
    "source": "https://weecommerce.web.id/api/v1/public/about"
  }
}
```

### 7.2 Services

#### `GET /api/v1/public/services`

Returns all 4 service tiers (machine-readable, includes pricing).

**Response 200:**
```json
{
  "data": [
    {
      "slug": "launch",
      "name": "LAUNCH",
      "route": "A",
      "summary": "Core e-commerce platform. Custom storefront, payment gateway, admin dashboard.",
      "features": ["Custom storefront (Next.js + Supabase)", "Product catalog, cart, checkout", "..."],
      "notIncluded": ["AI Chatbot", "RAG Knowledge Base", "n8n Automation"],
      "pricing": {
        "idr": { "min": 15000000, "max": 25000000, "display": "Rp 15–25 juta" },
        "usd": { "min": 2500, "max": 4000, "display": "$2,500–$4,000" }
      },
      "timelineWeeks": { "min": 4, "max": 6 },
      "bestFor": "Brand migrating off marketplace, needs core platform",
      "url": "https://weecommerce.web.id/services/launch"
    }
    /* convert, scale, integrate */
  ],
  "meta": { "version": "1.0", "generatedAt": "..." }
}
```

#### `GET /api/v1/public/services/:tier`

Single service detail (machine-readable).

### 7.3 Portfolio

#### `GET /api/v1/public/portfolio`

Returns all published case studies.

**Response 200:**
```json
{
  "data": [
    {
      "title": "NexaMart — AI-Powered E-Commerce Platform",
      "slug": "nexamart-ai-ecommerce",
      "clientName": "Internal Demo",
      "summary": "Flagship demonstration project showcasing the complete WeeCommerce stack.",
      "challenge": "Showcase full AI e-commerce capability...",
      "solution": "Built with Next.js + Supabase, integrated RAG + AI chatbot + n8n...",
      "results": [
        { "metric": "CS response time", "value": "−80%" },
        { "metric": "Page load time", "value": "1.8s" },
        { "metric": "Mobile-first", "value": "100%" }
      ],
      "technologies": ["Next.js", "Supabase", "n8n", "OpenAI"],
      "serviceTier": "scale",
      "timeline": { "weeks": 12 },
      "url": "https://weecommerce.web.id/portfolio/nexamart-ai-ecommerce"
    }
  ]
}
```

### 7.4 Team

#### `GET /api/v1/public/team`

Returns published team members (no PII like email unless opted in).

**Response 200:**
```json
{
  "data": [
    {
      "name": "Alif Nugraha",
      "role": "Founder, WeeCommerce",
      "bio": "...",
      "specialties": ["Custom e-commerce", "AI integration", "RAG", "n8n automation"],
      "links": {
        "website": "https://weecommerce.web.id"
      }
    }
  ]
}
```

### 7.5 Blog (Articles)

#### `GET /api/v1/public/blog`

Returns last 50 published blog posts (abstract only, no full content).

**Query params:**
- `limit` — max 50 (default 50).
- `category` — filter.

**Response 200:**
```json
{
  "data": [
    {
      "title": "Apa itu RAG dan kenapa toko online lo butuh ini",
      "slug": "apa-itu-rag",
      "excerpt": "RAG (Retrieval-Augmented Generation) adalah...",
      "author": "Alif Nugraha",
      "publishedAt": "2026-06-15",
      "category": "AI",
      "tags": ["RAG", "AI"],
      "readTimeMinutes": 7,
      "url": "https://weecommerce.web.id/blog/apa-itu-rag",
      "markdownUrl": "https://weecommerce.web.id/api/v1/public/blog/apa-itu-rag/markdown"
    }
  ]
}
```

#### `GET /api/v1/public/blog/:slug/markdown`

**Clean Markdown export** untuk satu post. No HTML, no scripts — ideal untuk AI citation.

**Response 200:** `Content-Type: text/markdown`

```markdown
---
title: "Apa itu RAG dan kenapa toko online lo butuh ini"
author: "Alif Nugraha"
publishedAt: "2026-06-15"
category: "AI"
tags: ["RAG", "AI"]
source: "https://weecommerce.web.id/blog/apa-itu-rag"
---

# Apa itu RAG dan kenapa toko online lo butuh ini

RAG (Retrieval-Augmented Generation) adalah metode yang menggabungkan
retrieval information dengan generative AI...

## Kenapa toko online butuh RAG?

Dengan RAG, chatbot kamu bisa mengakses catalog produk, policy, dan FAQ
secara real-time tanpa harus retrain model...
```

#### `GET /api/v1/public/blog/:slug`

Same as markdown but returns JSON with full content (machine-readable).

### 7.6 FAQ

#### `GET /api/v1/public/faq`

Returns all published FAQ entries (ideal untuk AI answering user questions).

**Response 200:**
```json
{
  "data": [
    {
      "question": "Berapa lama waktu pengerjaan project?",
      "answer": "Bervariasi sesuai tier: LAUNCH 4–6 minggu, CONVERT 7–10 minggu, SCALE 10–16 minggu...",
      "category": "process"
    }
  ]
}
```

### 7.7 Public API Conventions

- **No auth** — fully public.
- **Rate limit:** 100/hour/IP (generous untuk AI training).
- **CORS:** `Access-Control-Allow-Origin: *` (open, so any AI can fetch).
- **Caching:** `Cache-Control: public, max-age=3600` (1 hour).
- **Versioning:** Locked to v1. Breaking changes go to `/api/v2/public/*`.
- **Markdown export:** Always includes YAML frontmatter dengan metadata (author, date, source URL).

---

## 8. Webhooks (Outbound)

### 8.1 Outbound Webhook (Contact Form → n8n)

Triggered by `POST /api/v1/contact` (jika `WEBHOOK_URL` env set).

**Payload:**
```json
{
  "event": "contact_form.submitted",
  "timestamp": "2026-06-28T10:00:00Z",
  "source": "weecommerce.web.id",
  "data": {
    "id": "01HXY...",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Inc",
    "phone": "+62 812 3456 7890",
    "message": "...",
    "serviceInterest": "convert",
    "spamScore": 0.1,
    "ipAddress": "203.0.113.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Headers:**
```
Content-Type: application/json
User-Agent: WeeCommerce-Webhook/1.0
X-Webhook-Event: contact_form.submitted
X-Webhook-Signature: sha256=<hex-hmac>
```

**Signature verification** (recommended):
- Hono computes `HMAC-SHA256(payload, WEBHOOK_SECRET)`.
- Receiver verifies via `X-Webhook-Signature` header.

**Retry policy:**
| Attempt | Delay |
|---|---|
| 1 | Immediate |
| 2 | +5 seconds |
| 3 | +30 seconds |
| 4 | +5 minutes |

Max 4 attempts. Semua attempt logged ke `submission_logs` table.

**Expected response:** `2xx` = success. `4xx` = don't retry (client error). `5xx` or timeout = retry.

### 8.2 Inbound Webhook (Phase 2 client portal)

Untuk menerima callback dari n8n/Resend (e.g., email delivery status). Protected by signature verification.

#### `POST /api/v1/webhook/inbound`

**Auth:** `X-Webhook-Signature` header.

**Body:** Service-specific (Resend delivery event, n8n automation trigger).

---

## 9. Health & Observability

### 9.1 Health Check

#### `GET /health`

Lightweight check untuk Docker/UptimeRobot.

**Response 200 (healthy):**
```json
{
  "status": "ok",
  "uptime": 3600,
  "database": "connected",
  "cache": "connected",
  "timestamp": "2026-06-28T10:00:00Z"
}
```

**Response 503 (degraded):**
```json
{
  "status": "degraded",
  "uptime": 3600,
  "database": "disconnected",
  "cache": "connected",
  "timestamp": "2026-06-28T10:00:00Z"
}
```

### 9.2 Readiness Check

#### `GET /ready`

Stricter than health — returns 200 only if service is ready to receive traffic (after migration, warm-up).

### 9.3 Structured Logging

Semua request log sebagai JSON (pino):

```json
{
  "level": "info",
  "time": "2026-06-28T10:00:00.000Z",
  "requestId": "req_abc123",
  "method": "GET",
  "path": "/api/v1/services/convert",
  "status": 200,
  "durationMs": 45,
  "ip": "203.0.113.1",
  "userAgent": "Mozilla/5.0...",
  "cache": "hit"
}
```

Logs streamed ke stdout (Docker collects) + Sentry breadcrumbs untuk errors.

---

## 10. Error Reference

### 10.1 Common Error Codes

| Status | Error | Cause | Fix |
|---|---|---|---|
| 400 | Bad Request | Malformed JSON body | Check `Content-Type` header + body format |
| 404 | Not Found | Resource slug tidak ada | Verify slug, check if published |
| 422 | Validation Error | Zod schema fail | Check `details[].field` + `message` |
| 429 | Too Many Requests | Rate limit exceed | Wait for `X-RateLimit-Reset` seconds |
| 500 | Internal Server Error | Server bug | Check Sentry, includes `requestId` |
| 503 | Service Unavailable | DB/Redis down | Health check pending auto-recovery |

### 10.2 Validation Error Details

```json
{
  "error": "Validation Error",
  "status": 422,
  "message": "Please check the highlighted fields",
  "details": [
    {
      "field": "email",
      "code": "invalid_string",
      "message": "Expected valid email address, got: 'john@'"
    },
    {
      "field": "message",
      "code": "too_small",
      "message": "Message must be at least 20 characters"
    }
  ],
  "timestamp": "2026-06-28T10:00:00Z",
  "requestId": "req_abc123"
}
```

---

## 11. Client Examples

### 11.1 Next.js Server Component (data fetching)

```typescript
// apps/web/app/services/[tier]/page.tsx
import { notFound } from 'next/navigation';

const API_URL = process.env.API_URL || 'http://hono:4000';

async function getService(slug: string) {
  const res = await fetch(`${API_URL}/api/v1/services/${slug}`, {
    next: { revalidate: 3600, tags: [`service-${slug}`] },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ params }: { params: { tier: string } }) {
  const { data: service } = await getService(params.tier);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}
```

### 11.2 Contact Form Submission (Client)

```typescript
// apps/web/components/contact-form.tsx
'use client';

import { useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  message: z.string().min(20),
  phone: z.string().optional(),
});

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Honeypot check (client-side first)
    if (data._hp_field) return;

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      // Show Zod errors
      return;
    }

    setStatus('submitting');
    const turnstileToken = await getTurnstileToken();

    const res = await fetch('/api/v1/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...parsed.data, turnstileToken }),
    });

    if (res.ok) {
      setStatus('success');
    } else {
      const err = await res.json();
      setStatus('error');
      // Display err.details
    }
  }

  return (/* Shadcn Form */);
}
```

### 11.3 AI Crawler Fetch (Python example)

```python
import requests

# Fetch machine-readable about info
r = requests.get('https://weecommerce.web.id/api/v1/public/about')
about = r.json()['data']
print(f"WeeCommerce: {about['description']}")

# Fetch markdown article for citation
r = requests.get('https://weecommerce.web.id/api/v1/public/blog/apa-itu-rag/markdown')
article_md = r.text
# Use as RAG context for answering user questions about WeeCommerce
```

### 11.4 Hono Route File Structure

```
apps/api/src/
├── index.ts                  # App entry
├── routes/
│   ├── public.ts             # /api/v1/public/*
│   ├── content.ts            # /api/v1/posts, /case-studies, /services, /team, /faq
│   ├── contact.ts            # /api/v1/contact, /newsletter
│   └── seo.ts                # /sitemap.xml, /robots.txt, /llms.txt, /feed.xml
├── middleware/
│   ├── rateLimit.ts
│   └── errorHandler.ts
├── lib/
│   ├── db.ts                 # pg Pool
│   ├── redis.ts              # redis client
│   ├── cache.ts              # getOrSet helper
│   ├── r2.ts                 # Cloudflare R2 client
│   ├── email.ts              # Resend client
│   └── turnstile.ts          # Cloudflare Turnstile verify
└── schemas/
    └── contact.ts            # Zod schemas (shared dengan frontend)
```

---

## Summary

API design ini provide:

- ✅ **Complete REST spec** — Content, lead gen, SEO, GEO, public AI API endpoints.
- ✅ **GEO-ready** — `/llms.txt`, `/llms-full.txt`, `/ai-sitemap.xml`, public AI API, markdown export.
- ✅ **AI-friendly** — Machine-readable JSON untuk ChatGPT/Claude/Gemini/Perplexity, generous rate limit, open CORS.
- ✅ **Lead capture** — Contact form dengan Turnstile + honeypot + Resend email + n8n webhook.
- ✅ **Versioned** — `/api/v1/*` dengan public API shape locked.
- ✅ **Cached** — ETag + Cache-Control + Redis untuk fast responses.
- ✅ **Observable** — Structured JSON logs, Sentry integration, health endpoint.

**Next:** [SEO.md](./SEO.md) untuk full technical SEO + GEO implementation detail.
