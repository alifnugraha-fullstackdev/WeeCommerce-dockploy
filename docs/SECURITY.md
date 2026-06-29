# WeeCommerce Security — Hardening & Incident Response

**Version:** 1.0
**Domain:** weecommerce.web.id
**Stack:** Next.js 14 + Hono + PostgreSQL + Redis + Nginx
**Compliance Targets:** OWASP Top 10, GDPR-ready, CIS Docker Benchmark (lite)

> Berkaitan: [ARCHITECTURE.md](./ARCHITECTURE.md) (Nginx config) · [API.md](./API.md) (validation) · [DEPLOYMENT.md](./DEPLOYMENT.md) (secrets) · [DATABASE.md §9](./DATABASE.md#9-data-retention-policy) (GDPR)

---

## Table of Contents

1. [Threat Model](#1-threat-model)
2. [Transport Security](#2-transport-security)
3. [Security Headers](#3-security-headers)
4. [Content Security Policy](#4-content-security-policy)
5. [Input Validation](#5-input-validation)
6. [XSS Prevention](#6-xss-prevention)
7. [CSRF Protection](#7-csrf-protection)
8. [Rate Limiting & Spam Protection](#8-rate-limiting--spam-protection)
9. [SQL Injection Prevention](#9-sql-injection-prevention)
10. [Bot Detection](#10-bot-detection)
11. [Secrets Management](#11-secrets-management)
12. [Container Security](#12-container-security)
13. [Dependency Scanning](#13-dependency-scanning)
14. [Data Security](#14-data-security)
15. [Audit Logging](#15-audit-logging)
16. [GDPR & Privacy](#16-gdpr--privacy)
17. [Incident Response](#17-incident-response)
18. [OWASP Top 10 Mapping](#18-owasp-top-10-mapping)

---

## 1. Threat Model

### 1.1 Attack Surface

```
┌─────────────────────────────────────────────────────────┐
│ Public-facing attack surface                            │
│ ├─ Nginx :443 (HTTPS) — all requests                    │
│ ├─ Next.js :3000 (via Nginx) — pages, client components │
│ ├─ Hono :4000 (via Nginx) — public API endpoints        │
│ └─ Cloudflare R2 public URL — read-only media           │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Internal-only (Docker network, no public exposure)      │
│ ├─ PostgreSQL :5432                                      │
│ └─ Redis :6379                                           │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Top Threats (Prioritized)

| Threat | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Contact form spam/abuse | High | Low | Rate limit + Turnstile + honeypot |
| Credential stuffing (admin) | Medium | High | Rate limit + 2FA + bcrypt |
| XSS via blog markdown | Medium | High | DOMPurify sanitize + CSP |
| SQL injection | Low | Critical | Parameterized queries (no concat) |
| DDoS volumetric | Medium | Medium | Cloudflare DDoS + Nginx rate limit |
| Sensitive data exposure (PII leak) | Low | Critical | TLS + R2 private buckets + GDPR policy |
| Supply chain (malicious dep) | Low | High | Dependabot + npm audit + lockfile |
| Misconfigured CORS | Low | Medium | Strict origin allowlist |
| Brute force API | Medium | Low | Rate limit per IP + per user |
| Container escape | Very Low | Critical | Non-root user + Alpine minimal + Trivy |

### 1.3 Trust Boundaries

- **Internet → Cloudflare:** Untrusted. WAF + DDoS.
- **Cloudflare → Nginx:** Semi-trusted (Cloudflare IP range). Rate limit + headers.
- **Nginx → Next.js/Hono:** Semi-trusted (internal). Validate `X-Forwarded-For`.
- **Hono → PostgreSQL/Redis:** Trusted (internal Docker network, no TLS needed locally, but use TLS in prod for defense-in-depth).
- **Hono → External (R2/Resend):** TLS enforced, API key auth.

---

## 2. Transport Security

### 2.1 HTTPS-Only

- HTTP requests 301 redirect ke HTTPS (Nginx).
- HSTS header enforces HTTPS di browser (1 year + preload).

```nginx
server {
    listen 80;
    server_name weecommerce.web.id www.weecommerce.web.id;
    return 301 https://weecommerce.web.id$request_uri;
}
```

### 2.2 TLS Configuration

- **Protocol:** TLS 1.3 (preferred), TLS 1.2 (minimum). Disable SSLv3, TLS 1.0/1.1.
- **Cipher suites:** Modern, prefers AEAD (AES-GCM, ChaCha20-Poly1305).
- **Certificate:** Let's Encrypt (via Dokploy built-in atau Certbot), auto-renew via cron.
- **HSTS preload:** Submit ke [hstspreload.org](https://hstspreload.org) after stable.

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;
```

### 2.3 HSTS Header

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

---

## 3. Security Headers

Full Nginx config. Defense-in-depth (Hono juga sets via `secureHeaders()` middleware).

```nginx
server {
    listen 443 ssl http2;
    server_name weecommerce.web.id;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    add_header Cross-Origin-Resource-Policy "same-site" always;
    add_header X-DNS-Prefetch-Control "off" always;
    add_header X-Download-Options "noopen" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;

    # CSP (see §4 for detail)
    add_header Content-Security-Policy "<see-below>" always;

    # Remove server version
    server_tokens off;
    proxy_hide_header X-Powered-By;
}
```

### Header Reference

| Header | Value | Purpose |
|---|---|---|
| Strict-Transport-Security | max-age=31536000; includeSubDomains; preload | Force HTTPS |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-Frame-Options | DENY | Prevent clickjacking |
| Referrer-Policy | strict-origin-when-cross-origin | Limit referrer leakage |
| Permissions-Policy | camera=(), microphone=(), geolocation=(), payment=(), usb=() | Disable unused browser features |
| Cross-Origin-Opener-Policy | same-origin | Process isolation |
| Cross-Origin-Resource-Policy | same-site | CORS resource restriction |
| Content-Security-Policy | (see §4) | Script/source allowlist |
| X-DNS-Prefetch-Control | off | Disable DNS prefetch (privacy) |
| X-Download-Options | noopen | Disable auto-open downloads (IE) |
| X-Permitted-Cross-Domain-Policies | none | Block Adobe cross-domain |

---

## 4. Content Security Policy

Strict CSP, Shadcn/UI-safe. Allow Plausible analytics, Cloudflare Turnstile, Resend (not loaded client-side), R2 image CDN.

### 4.1 Production CSP

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://plausible.io https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline';
img-src 'self' https: data: blob:;
font-src 'self' data:;
connect-src 'self' https://plausible.io https://challenges.cloudflare.com https://weecommerce.web.id;
frame-src https://challenges.cloudflare.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

### 4.2 Directive Explanation

| Directive | Allowed | Reason |
|---|---|---|
| `default-src 'self'` | Same origin only | Strict default |
| `script-src 'self' 'unsafe-inline'` | Self + inline | Next.js injects inline scripts (hydration). `'unsafe-inline'` is needed. Nonce-based CSP: post-MVP enhancement. |
| `script-src plausible.io` | Plausible analytics | Privacy analytics |
| `script-src challenges.cloudflare.com` | Turnstile widget | Spam protection |
| `style-src 'self' 'unsafe-inline'` | Self + inline | Next.js + Tailwind inject styles inline |
| `img-src 'self' https: data: blob:` | Self, any HTTPS, data URI, blob | R2 CDN, OG images, dynamic images |
| `font-src 'self' data:` | Self, data | `next/font` self-hosts fonts |
| `connect-src` | Self, Plausible, Turnstile, same-site | API + analytics + verification |
| `frame-src challenges.cloudflare.com` | Turnstile iframe only | Widget iframe |
| `object-src 'none'` | Nothing | Block plugins (Flash, Java) |
| `base-uri 'self'` | Self | Prevent base tag injection |
| `form-action 'self'` | Self | Forms submit only to self |
| `frame-ancestors 'none'` | Nobody | Prevent framing (clickjacking) — replaces X-Frame-Options |
| `upgrade-insecure-requests` | — | Auto-upgrade HTTP to HTTPS |

### 4.3 Why `'unsafe-inline'` for Scripts?

Next.js injects inline scripts for hydration + Bootstrap. To remove `'unsafe-inline'`:

1. Generate per-request nonce in Next.js middleware.
2. Apply nonce to `<script>` tags via `<Script nonce={nonce}>`.
3. CSP: `script-src 'self' 'nonce-<random>'`.

This is **Phase 2** enhancement (CSP Level 3 strict mode, for client portal). For MVP, `'unsafe-inline'` is acceptable with strict `default-src 'self'` and limited allowlist.

### 4.4 CSP in Hono (defense-in-depth)

```typescript
// apps/api/src/index.ts
import { secureHeaders } from 'hono/secure-headers';

app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://plausible.io', 'https://challenges.cloudflare.com'],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'https:', 'data:', 'blob:'],
    connectSrc: ["'self'", 'https://plausible.io'],
    frameSrc: ['https://challenges.cloudflare.com'],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
  },
}));
```

---

## 5. Input Validation

### 5.1 Server-Side Validation (Source of Truth)

Semua input validated di Hono via Zod. Frontend validation (React Hook Form + Zod) is convenience only — server re-validates always.

```typescript
// apps/api/src/schemas/contact.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  company: z.string().min(2).max(255),
  message: z.string().min(20).max(5000),
  phone: z.string().max(30).optional().or(z.literal('')),
  serviceInterest: z.enum(['launch', 'convert', 'scale', 'integrate']).optional(),
  turnstileToken: z.string().min(1),
  _hp_field: z.string().max(0).optional(),  // honeypot — must be empty
});

export type ContactInput = z.infer<typeof contactSchema>;
```

```typescript
// apps/api/src/routes/contact.ts
import { contactSchema } from '../schemas/contact';

app.post('/contact', rateLimit({...}), async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Invalid JSON' }, 400);

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({
      error: 'Validation Error',
      status: 422,
      message: 'Please check the highlighted fields',
      details: parsed.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message,
      })),
    }, 422);
  }
  // ... process
});
```

### 5.2 Validation Rules

| Field | Rule |
|---|---|
| Strings | Min/max length always set |
| Email | Zod `.email()` + DNS MX record check (optional, client portal Phase 2) |
| URL | `z.string().url()` |
| Numbers | `z.number().int().positive().max(N)` |
| Enums | `z.enum([...])` — whitelist |
| Dates | ISO 8601 format + range check |
| Arrays | Max items limit |

### 5.3 Sanitization

- **HTML output** (e.g., blog markdown → HTML): DOMPurify.
- **SQL**: parameterized queries (no string concat — see §9).
- **Logs**: strip secrets (passwords, tokens, PII) before logging.
- **User display**: HTML-escape on output (React does this by default).

```typescript
// HTML escape helper for non-React output (e.g., email templates)
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

---

## 6. XSS Prevention

### 6.1 Defense Layers

1. **React auto-escaping** — JSX expressions are auto-escaped.
2. **Avoid `dangerouslySetInnerHTML`** — except for trusted, sanitized content.
3. **DOMPurify for markdown** — Sanitize rendered HTML.
4. **CSP** — Block unauthorized scripts (mitigates XSS impact).
5. **HttpOnly cookies** — Session cookies not accessible to JS.

### 6.2 Markdown Rendering Pipeline

```typescript
// apps/web/lib/markdown.ts
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

export function renderMarkdown(md: string): string {
  // 1. Convert markdown → HTML
  const rawHtml = marked.parse(md, { async: false }) as string;

  // 2. Sanitize HTML (strip scripts, event handlers, dangerous tags)
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'blockquote', 'pre', 'code',
      'ul', 'ol', 'li',
      'a', 'strong', 'em', 'del', 'mark',
      'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
    ],
    ALLOWED_ATTR: ['href', 'title', 'src', 'alt', 'class', 'id', 'target', 'rel', 'width', 'height'],
    ALLOW_DATA_ATTR: false,
  });
}
```

### 6.3 Safe Anchor Links

```typescript
// Add rel="noopener noreferrer" to all external links
// Configure marked renderer
const renderer = new marked.Renderer();
const originalLink = renderer.link.bind(renderer);
renderer.link = (href, title, text) => {
  const html = originalLink(href, title, text);
  if (href?.startsWith('http')) {
    return html.replace('<a ', '<a rel="noopener noreferrer" target="_blank" ');
  }
  return html;
};
marked.use({ renderer });
```

### 6.4 JSON-LD Safe Injection

`dangerouslySetInnerHTML` aman untuk JSON-LD karena content adalah hardcoded schema (not user input). Tapi sanitize user-derived values:

```typescript
// Strip </script> from any string in schema
function sanitizeForJsonLd(str: string): string {
  return str.replace(/<\/script>/gi, '<\\/script>');
}
```

---

## 7. CSRF Protection

### 7.1 SameSite Cookies

```typescript
// Cookie setting (admin auth)
c.cookie('session', token, {
  httpOnly: true,
  secure: true,           // HTTPS only
  sameSite: 'Strict',     // or 'Lax' for navigation
  path: '/',
  maxAge: 60 * 60 * 24 * 7,  // 7 days
});
```

### 7.2 CSRF Token (Admin API)

Untuk state-changing endpoints (admin dashboard), require CSRF token:

```typescript
// apps/api/src/middleware/csrf.ts
import { Context, Next } from 'hono';

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

export async function csrfMiddleware(c: Context, next: Next) {
  if (SAFE_METHODS.includes(c.req.method)) {
    return next();
  }

  const token = c.req.header('x-csrf-token');
  const cookieToken = getCookie(c, 'csrf-token');

  if (!token || token !== cookieToken) {
    return c.json({ error: 'CSRF token mismatch' }, 403);
  }

  await next();
}
```

### 7.3 Public Form CSRF (MVP)

Contact form & newsletter are public (no auth). Mitigation:
- Origin/Referer check (Hono).
- Turnstile token (proves human + recent).
- Honeypot field.
- Rate limiting per IP.

```typescript
// apps/api/src/middleware/originCheck.ts
export async function originCheck(c: Context, next: Next) {
  const origin = c.req.header('origin');
  const allowed = ['https://weecommerce.web.id', 'https://www.weecommerce.web.id'];

  if (origin && !allowed.includes(origin)) {
    return c.json({ error: 'Invalid origin' }, 403);
  }

  await next();
}
```

---

## 8. Rate Limiting & Spam Protection

### 8.1 Rate Limit Zones

(Lihat [ARCHITECTURE.md §6](./ARCHITECTURE.md#6-rate-limiting) untuk full config.)

| Zone | Scope | Limit | Storage |
|---|---|---|---|
| General API read | `/api/v1/*` (GET) | 1000/hour/IP | Nginx |
| Contact form | `/api/v1/contact` (POST) | 5/hour/IP | Redis |
| Newsletter | `/api/v1/newsletter/*` (POST) | 3/hour/IP | Redis |
| Search | `/api/v1/posts/search` (GET) | 100/min/IP | Nginx |
| Public AI API | `/api/v1/public/*` (GET) | 100/hour/IP | Redis |

### 8.2 Cloudflare Turnstile (Spam Protection)

Replace reCAPTCHA (privacy-friendly, free, no tracking).

**Frontend (Shadcn-wrapped component):**

```tsx
// apps/web/components/turnstile.tsx
'use client';
import { Turnstile } from '@marsidev/react';

export function TurnstileWidget({ onVerify }: { onVerify: (token: string) => void }) {
  return (
    <Turnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onSuccess={onVerify}
      options={{ theme: 'light', size: 'normal' }}
    />
  );
}
```

**Backend verify:**

```typescript
// apps/api/src/lib/turnstile.ts
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v2/siteverify';

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const form = new URLSearchParams();
  form.append('secret', process.env.TURNSTILE_SECRET!);
  form.append('response', token);
  form.append('remoteip', ip);

  const res = await fetch(VERIFY_URL, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  return data.success === true && data.score >= 0.5;
}
```

### 8.3 Honeypot Field

Invisible field yang humans don't fill, but bots do:

```tsx
<input
  type="text"
  name="_hp_field"
  tabIndex={-1}
  autoComplete="off"
  className="absolute -left-[9999px] h-0 w-0 opacity-0"
  aria-hidden="true"
/>
```

Server check: if `_hp_field` is non-empty → silent 400 (don't tell bot it's honeypot).

### 8.4 Email Validation (Deeper)

Beyond format check, optionally verify email exists (Phase 2 client portal):
- MX record lookup (`dns.resolveMx(domain)`).
- SMTP VRFY (rarely reliable, often disabled).
- Use service like Abstract API / Hunter Email Verifier (paid).

For MVP: format check only. Spam score dari Turnstile + IP reputation (Cloudflare) + honeypot sudah cukup.

---

## 9. SQL Injection Prevention

### 9.1 Parameterized Queries Only

**Always use** `pg` driver's parameter substitution (`$1, $2, ...`). Never string concat.

```typescript
// apps/api/src/lib/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
});

export const db = {
  async query(text: string, params: (string | number | null)[] = []) {
    return pool.query(text, params);
  },

  async queryOne<T>(text: string, params: (string | number | null)[] = []): Promise<T | null> {
    const res = await pool.query(text, params);
    return res.rows[0] || null;
  },
};
```

### 9.2 Anti-Patterns (NEVER DO)

```typescript
// ❌ BAD — string concat, SQL injection vulnerable
const res = await pool.query(`SELECT * FROM posts WHERE slug = '${slug}'`);

// ❌ BAD — template literal with user input
const res = await pool.query(`SELECT * FROM posts WHERE author = '${req.body.author}'`);

// ✅ GOOD — parameterized
const res = await pool.query('SELECT * FROM posts WHERE slug = $1', [slug]);
```

### 9.3 Query Builder (Optional Phase 2 client portal)

Untuk complex queries, use Drizzle ORM or Kysely (type-safe, parameterized by default):

```typescript
// apps/api/src/lib/db.ts (Phase 2 client portal)
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug').notNull().unique(),
  title: varchar('title').notNull(),
  // ...
});

export const db = drizzle(pool);

// Type-safe, parameterized
const post = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
```

### 9.4 Dynamic Identifiers

If you MUST use dynamic table/column names (rare), use `pg-format` or whitelist:

```typescript
const ALLOWED_SORT = ['published_at', 'title', 'views'];

function safeSort(field: string): string {
  if (!ALLOWED_SORT.includes(field)) {
    throw new Error('Invalid sort field');
  }
  return field;
}

const res = await pool.query(
  `SELECT * FROM posts ORDER BY ${safeSort(sortBy)} DESC LIMIT $1`,
  [limit],
);
```

---

## 10. Bot Detection

### 10.1 Crawler Allowlist

Allow known good bots (search engines, AI crawlers) to access public content:

```nginx
# nginx/conf.d/bots.conf
map $http_user_agent $is_bad_bot {
    default 0;
    "~*SemrushBot" 1;
    "~*AhrefsBot" 1;
    "~*DotBot" 1;
    "~*MJ12bot" 1;
    "~*Bytespider" 1;
    "~*PetalBot" 1;
}

# Block bad bots
if ($is_bad_bot) {
    return 403;
}
```

Allowlist (don't block):
- `Googlebot`, `Bingbot`, `DuckDuckBot`, `Slurp`, `Baiduspider` (search).
- `ChatGPT-User`, `GPTBot`, `Google-Extended`, `ClaudeBot`, `PerplexityBot` (AI).
- `WhatsApp`, `TelegramBot`, `facebookexternalhit` (social previews).

### 10.2 Behavioral Rate Limiting

If a single IP:
- Makes > 100 req/min on read endpoints → suspect scraper.
- Submits multiple contact forms in short window → spam bot.

Auto-throttle via Redis sliding window (lihat [ARCHITECTURE.md §6.3](./ARCHITECTURE.md#63-hono-redis-backed-rate-limit-application-level)).

### 10.3 Turnstile Score

Cloudflare Turnstile returns a score (0.0–1.0). Threshold:
- ≥ 0.5 → accept.
- < 0.5 → reject with "Please try again".

---

## 11. Secrets Management

### 11.1 Principle

- **Never commit secrets** to git (`.env*` in `.gitignore`).
- **Never log secrets** — strip from logs.
- **Rotate regularly** — DB password, API keys (quarterly for prod).
- **Least privilege** — each service only has keys it needs.

### 11.2 Secret Storage by Environment

| Environment | Storage |
|---|---|
| Local dev | `.env.local` (gitignored) |
| CI/CD (GitHub Actions) | GitHub Secrets (encrypted) |
| Production (Dokploy) | Dokploy env vars (encrypted at rest) |
| Database | PostgreSQL users table (bcrypt-hashed, admin) |
| Backups | R2 server-side encryption (AES-256) |

### 11.3 .env.example (Template — commit this)

```bash
# Database
DATABASE_URL=postgresql://weecommerce:CHANGE_ME@postgres:5432/weecommerce
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD

# Redis
REDIS_URL=redis://redis:6379

# Email (Resend)
RESEND_API_KEY=re_CHANGE_ME
RESEND_FROM=hello@weecommerce.web.id
ADMIN_EMAIL=hello@weecommerce.web.id

# Spam protection (Cloudflare Turnstile)
TURNSTILE_SECRET=0xCHANGE_ME
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0xCHANGE_ME

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=CHANGE_ME
R2_ACCESS_KEY_ID=CHANGE_ME
R2_SECRET_ACCESS_KEY=CHANGE_ME
R2_BUCKET=weecommerce-media

# Webhook (n8n, optional)
WEBHOOK_URL=https://n8n.example.com/webhook/contact
WEBHOOK_SECRET=CHANGE_ME

# Monitoring (Sentry)
SENTRY_DSN=https://CHANGE_ME@sentry.io/123

# Analytics (Plausible)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=weecommerce.web.id
NEXT_PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js

# App
NEXT_PUBLIC_SITE_URL=https://weecommerce.web.id
NODE_ENV=production
LOG_LEVEL=info

# ISR revalidation secret (Next.js)
REVALIDATE_SECRET=CHANGE_ME_RANDOM_STRING
```

### 11.4 Secret Scanning

Pre-commit hook + CI check untuk detect accidentally committed secrets:

```yaml
# .github/workflows/secret-scan.yml
name: Secret Scan
on: [push, pull_request]
jobs:
  trufflehog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: trufflesecurity/trufflehog@main
        with:
          path: .
          extra_args: --only-verified
```

### 11.5 Log Sanitization

Strip secrets before logging:

```typescript
// apps/api/src/lib/logger.ts
const SENSITIVE_KEYS = ['password', 'token', 'secret', 'apiKey', 'authorization'];

function sanitize(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;
  const clean: any = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k))) {
      clean[key] = '[REDACTED]';
    } else {
      clean[key] = sanitize(value);
    }
  }
  return clean;
}

export function logRequest(req: Request) {
  console.log(JSON.stringify(sanitize({
    method: req.method,
    path: new URL(req.url).pathname,
    headers: Object.fromEntries(req.headers.entries()),
  })));
}
```

---

## 12. Container Security

### 12.1 Dockerfile Best Practices

**Multi-stage build** — small final image.

```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S hono -u 1001
USER hono

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=20s \
    CMD curl -f http://localhost:4000/health || exit 1

CMD ["node", "dist/index.js"]
```

### 12.2 Non-Root User

All containers run as non-root:
- Next.js: `next` user (built-in dari `node:20-alpine`).
- Hono: custom `hono` user.
- PostgreSQL: `postgres` user (built-in).
- Redis: `redis` user (built-in).

### 12.3 Image Scanning (Trivy in CI)

```yaml
# .github/workflows/security.yml
name: Security Scan
on: [push, pull_request]
jobs:
  trivy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build images
        run: |
          docker build -t weecommerce-web:test ./apps/web
          docker build -t weecommerce-api:test ./apps/api
      - name: Run Trivy on web
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: weecommerce-web:test
          severity: CRITICAL,HIGH
          exit-code: '1'
      - name: Run Trivy on api
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: weecommerce-api:test
          severity: CRITICAL,HIGH
          exit-code: '1'
```

### 12.4 Docker Network Isolation

```yaml
# docker-compose.yml — only Nginx exposes ports
services:
  nginx:
    ports: ["80:80", "443:443"]
  postgres:
    # NO ports exposed — internal only
  redis:
    # NO ports exposed — internal only
```

Dev mode: expose ports locally for debugging (`docker-compose.dev.yml`), but never in prod.

---

## 13. Dependency Scanning

### 13.1 Dependabot (GitHub)

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/apps/web"
    schedule:
      interval: "weekly"
  - package-ecosystem: "npm"
    directory: "/apps/api"
    schedule:
      interval: "weekly"
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "monthly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
```

### 13.2 npm audit in CI

```yaml
# .github/workflows/ci.yml (excerpt)
- name: npm audit
  run: npm audit --audit-level=high
  continue-on-error: false  # fail build on high/critical
```

### 13.3 Lockfile Integrity

- `package-lock.json` committed.
- CI uses `npm ci` (respects lockfile exactly).
- Renovate (alternative to Dependabot) for automated PRs.

### 13.4 Snyk (Optional Phase 2 client portal)

For deeper runtime vulnerability scanning + license compliance.

---

## 14. Data Security

### 14.1 Database

- **Connection TLS:** Enabled in production (`ssl: { rejectUnauthorized: true }`).
- **Credentials:** Env vars, never in code.
- **Least privilege:** Single `weecommerce` DB user with needed perms only. No superuser for app.
- **Encryption at rest:** R2 backup encryption (AES-256). DB encryption optional (VPS disk encryption).

```sql
-- Least privilege user (instead of using superuser)
CREATE USER weecommerce_app WITH PASSWORD '...';
GRANT CONNECT ON DATABASE weecommerce TO weecommerce_app;
GRANT USAGE ON SCHEMA public TO weecommerce_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO weecommerce_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO weecommerce_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO weecommerce_app;
```

### 14.2 Cloudflare R2

- **Private bucket** + signed URLs for upload.
- **Public read** via custom domain (`cdn.weecommerce.web.id`) untuk cached media.
- **Bucket policy:** Read-only untuk public CDN, write only via API keys.
- **Encryption:** AES-256 (default R2 server-side encryption).

### 14.3 PII Handling

PII collected: name, email, phone (optional), IP address (form submissions).

- **Minimization:** Collect only what's needed.
- **Storage:** PostgreSQL, encrypted backups.
- **Access:** Only admin (Alif) via admin dashboard.
- **Retention:** Lihat [DATABASE.md §9](./DATABASE.md#9-data-retention-policy).
- **Deletion:** GDPR right-to-deletion endpoint (Phase 2 client portal).

---

## 15. Audit Logging

### 15.1 What to Log

| Event | Table | Example |
|---|---|---|
| Form submission | `form_submissions` | New inquiry received |
| Email sent | `submission_logs` | `email_sent` action |
| Webhook dispatch | `submission_logs` | `webhook_dispatched` / `webhook_failed` |
| Admin login | `audit_logs` | `login` action |
| Content change | `audit_logs` | `create` / `update` / `delete` entity |
| GDPR request | `audit_logs` | `gdpr_deletion` action |

### 15.2 Audit Log Schema

Lihat [DATABASE.md §3.5](./DATABASE.md#35-audit-table). Captures: actor, action, entity, changes (before/after), IP, user agent.

### 15.3 Log Retention

- Application logs (Docker logs): rotated weekly, kept 30 days.
- Audit logs (DB): 1 year, then archive ke R2 cold storage.
- Sentry events: 90 days (free tier).

---

## 16. GDPR & Privacy

### 16.1 Data Collected

| Data | Source | Purpose | Lawful Basis |
|---|---|---|---|
| Name, email, company, message | Contact form | Respond to inquiry | Consent |
| Phone (optional) | Contact form | Call back | Consent |
| IP address | All requests | Security, rate limit | Legitimate interest |
| Email | Newsletter | Marketing | Consent (double opt-in) |
| Analytics (aggregated) | Plausible | UX improvement | Consent (cookieless) |

### 16.2 Consent Mechanism

- Contact form: Privacy policy link + consent checkbox (required).
- Newsletter: Double opt-in (verify email before subscribing).
- Analytics: Plausible is cookieless, no consent needed under GDPR.

```tsx
<label className="flex items-start gap-2">
  <input type="checkbox" required />
  <span className="text-sm text-muted-foreground">
    I agree to the{' '}
    <a href="/privacy" className="underline">Privacy Policy</a> and consent
    to WeeCommerce storing my information to respond to this inquiry.
  </span>
</label>
```

### 16.3 Privacy Policy Page (`/privacy`)

Required content:
- What data we collect.
- Why we collect it.
- How long we keep it.
- Third parties we share with (Resend, R2, Plausible).
- User rights (access, rectification, deletion, portability).
- How to exercise rights (email hello@weecommerce.web.id).
- Cookie usage.
- Contact for privacy questions.

### 16.4 Right to Deletion

Endpoint `/api/v1/privacy/delete-request` (MVP, automated via admin dashboard):

```sql
-- Anonymize form submissions (keep aggregate stats)
UPDATE form_submissions
SET name = '[DELETED]', email = '[DELETED]', phone = NULL, message = '[DELETED]'
WHERE email = $1;

-- Delete newsletter subscriber
DELETE FROM newsletter_subscribers WHERE email = $1;

-- Log action
INSERT INTO audit_logs (action, entity_type, changes, created_at)
VALUES ('gdpr_deletion', 'user', jsonb_build_object('email_hash', md5($1)), NOW());
```

Manual process if admin dashboard not yet ready (email request → SQL execution → confirmation).

If Phase 2 client portal adds auth cookies: disclose in cookie policy.

### 16.6 Data Processing Addendum

Untuk enterprise/international clients (Phase 3), provide DPA detailing:
- Sub-processors (Resend, Cloudflare).
- Data location (Resend: US/EU, Cloudflare: global edge).
- Data transfer mechanisms (SCCs).

---

## 17. Incident Response

### 17.1 Severity Levels

| Severity | Definition | Response Time | Example |
|---|---|---|---|
| **P0 — Critical** | Production down, data breach | Immediate | DB leaked, site offline |
| **P1 — High** | Major feature broken, security vuln | < 4 hours | Contact form broken, XSS found |
| **P2 — Medium** | Minor feature broken, perf degrade | < 24 hours | Slow page load, broken image |
| **P3 — Low** | Cosmetic, non-urgent | < 7 days | Typo, alignment |

### 17.2 Response Phases

```
1. DETECT
   ├─ Sentry alert (error spike)
   ├─ UptimeRobot alert (downtime)
   ├─ User report (email)
   └─ Manual discovery (self-test)
   │
2. CONTAIN (immediate)
   ├─ Roll back to last known good (Dokploy)
   ├─ Disable affected endpoint (return 503)
   ├─ Block offending IP (Nginx)
   └─ Rotate compromised secrets
   │
3. ERADICATE
   ├─ Identify root cause
   ├─ Apply fix (hotfix branch)
   ├─ Deploy fix
   └─ Verify fix resolves issue
   │
4. RECOVER
   ├─ Restore from backup (if data loss)
   ├─ Re-enable endpoints
   ├─ Monitor for recurrence (24-48h)
   └─ Communicate to users (if user-facing)
   │
5. POST-MORTEM (within 7 days)
   ├─ Timeline of incident
   ├─ Root cause analysis
   ├─ What went well / poorly
   ├─ Action items (prevent recurrence)
   └─ Document in /docs/incidents/YYYY-MM-DD-<name>.md
```

### 17.3 Rollback Procedure

```bash
# Dokploy: rollback to previous deployment
# Via Dokploy UI: Select app → Deployments → Rollback to previous

# Or via Docker manually:
docker-compose pull  # get latest
docker-compose up -d  # if latest broken, specify previous tag:
docker-compose up -d nextjs:ghcr.io/org/weecommerce-web:<previous-sha>

# Database rollback if migration caused issue:
gunzip -c /tmp/weecommerce_<timestamp>.sql.gz | \
  docker exec -i weecommerce-postgres psql -U weecommerce weecommerce
```

### 17.4 Communication Templates

**Internal Slack alert:**
```
🚨 [P0] Production issue detected
Issue: <description>
Started: <timestamp>
Status: Investigating
Owner: <name>
Bridge: <link>
```

**User-facing status page (Phase 2 Engage):**
```
We're investigating an issue with <feature>. Some users may experience <symptom>.
We'll update here every 30 minutes until resolved.
```

---

## 18. OWASP Top 10 Mapping

[OWASP Top 10 (2021)](https://owasp.org/Top10/) coverage:

| # | OWASP Risk | Mitigation in WeeCommerce | Reference |
|---|---|---|---|
| A01 | Broken Access Control | Auth (MVP admin), least-privilege DB user, internal-only DB/Redis | §11, §14 |
| A02 | Cryptographic Failures | TLS 1.3, HSTS, bcrypt for passwords (MVP admin), AES-256 backups | §2, §14 |
| A03 | Injection | Parameterized queries, Zod validation, no string concat | §5, §9 |
| A04 | Insecure Design | Threat model (§1), defense-in-depth, secure-by-default | This doc |
| A05 | Security Misconfiguration | Strict CSP, no default creds, security headers, non-root containers | §3, §4, §12 |
| A06 | Vulnerable & Outdated Components | Dependabot, npm audit, Trivy, lockfile | §13 |
| A07 | Identification & Auth Failures | Rate limit login (MVP admin), bcrypt, session expiry, 2FA (MVP admin) | §8 |
| A08 | Software & Data Integrity Failures | Signed webhook (HMAC), lockfile, signed Docker images (Phase 3 Scale) | §11, §13 |
| A09 | Security Logging & Monitoring Failures | Audit logs, Sentry, UptimeRobot, structured logs | §15 |
| A10 | Server-Side Request Forgery (SSRF) | No user-controlled URLs fetched server-side, allowlist outbound hosts | API design |

---

## Summary

Security hardening ini provide:

- ✅ **Defense-in-depth** — Multiple layers (Nginx headers + Hono middleware + DB constraints).
- ✅ **OWASP Top 10 coverage** — All 10 risks addressed.
- ✅ **Transport security** — HTTPS-only, TLS 1.3, HSTS preload-ready.
- ✅ **Strict CSP** — Shadcn-safe, allows Plausible + Turnstile, blocks the rest.
- ✅ **Input validation** — Zod server-side (source of truth) + frontend for UX.
- ✅ **XSS prevention** — React auto-escape + DOMPurify + CSP.
- ✅ **SQL injection prevention** — Parameterized queries only, no concat.
- ✅ **Rate limiting** — Nginx + Redis-backed, per-endpoint zones.
- ✅ **Spam protection** — Cloudflare Turnstile + honeypot + rate limit.
- ✅ **Secret management** — Dokploy env vars, no secrets in repo, log sanitization.
- ✅ **Container security** — Non-root users, Alpine minimal, Trivy scan in CI.
- ✅ **GDPR-ready** — Consent, retention policy, right-to-deletion path.
- ✅ **Incident response** — Severity levels, 5-phase runbook, rollback procedure.

**Next:** [DEPLOYMENT.md](./DEPLOYMENT.md) untuk Docker, Dokploy, CI/CD setup.
