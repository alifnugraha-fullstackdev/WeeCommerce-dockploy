# WeeCommerce Company Profile Website — PRD

**Version:** 1.1
**Status:** MVP Phase
**Last Updated:** Juni 2026
**Architecture:** Streamlined Docker (5 container, VPS 2GB)
> ⚠ **v1.1 Update — Phase 1+2 digabung:** Admin dashboard, i18n, newsletter — semula Phase 2 — ditarik ke MVP. Detail di [ROADMAP.md](./ROADMAP.md).
**Domain:** weecommerce.web.id

> Dokumen ini adalah single source of truth untuk product requirements. Detail teknis ada di file ter-link:
> [ARCHITECTURE.md](./ARCHITECTURE.md) · [DATABASE.md](./DATABASE.md) · [API.md](./API.md) · [SEO.md](./SEO.md) · [SECURITY.md](./SECURITY.md) · [DEPLOYMENT.md](./DEPLOYMENT.md) · [ROADMAP.md](./ROADMAP.md) · [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Scope](#3-scope)
4. [User Types](#4-user-types)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Architecture Overview](#7-architecture-overview)
8. [Database Requirements](#8-database-requirements)
9. [SEO Requirements](#9-seo-requirements)
10. [GEO (Generative Engine Optimization)](#10-geo-generative-engine-optimization)
11. [Security Requirements](#11-security-requirements)
12. [Deployment & DevOps](#12-deployment--devops)
13. [Monitoring & Observability](#13-monitoring--observability)
14. [Acceptance Criteria](#14-acceptance-criteria)

---

## 1. Product Overview

### What is This?

A high-performance, AI-optimized company profile website for **WeeCommerce** (specialist e-commerce agency). It functions as:

- **Digital Sales Machine** — Lead generation engine that converts visitors into qualified inquiries (contact form, WhatsApp, email).
- **SEO Authority Hub** — Organic traffic generator ranking for target keywords (custom e-commerce Indonesia, AI chatbot, RAG, n8n automation).
- **AI Discoverable Platform (GEO)** — Optimized for ChatGPT, Claude, Gemini, Perplexity crawling via `llms.txt`, `ai-sitemap.xml`, JSON-LD, and a public read-only API.
- **Knowledge Hub** — Blog, case studies, and FAQ accessible to humans AND AI models.
- **Portfolio Showcase** — Demonstrate capability through real projects (NexaMart anchor demo + future client case studies).
- **Sales Asset** — Downloadable company profile PDF, pricing guide, one-pager.

### Core Principles

- **Business Logic > Technology Complexity** — Choose proven, simple tech over bleeding-edge. Streamlined monolith over premature microservices.
- **Performance First** — Every architectural decision prioritizes speed (TTFB, LCP, CLS, INP).
- **SEO Native** — Not SEO-bolted-on; SEO is fundamental to design.
- **AI-Ready (GEO)** — Structured data, metadata, and content format for machine readability from day one.
- **Container Native** — 100% Docker containerized, Dokploy-deployable, one-click.
- **Budget Conscious** — Total infra cost ≤ $10/month (VPS + Resend + R2 free tier + Cloudflare free tier).
- **Maintainability** — Single codebase per service. Clear file boundaries. One developer (Alif) can run everything solo.

### Target Outcomes (6 bulan post-launch)

1. **Organic Discovery** — 70% of traffic from Google + AI engines.
2. **Lead Generation** — 50+ qualified leads/month (form + WhatsApp).
3. **Authority Building** — Domain authority naik, backlinks dari industri e-commerce/AI.
4. **Conversion** — 5%+ conversion rate (visitor → form submission).
5. **Performance** — 99.5% uptime, < 2s load, Core Web Vitals all green.

---

## 2. Goals & Success Metrics

### Primary Goals

| Goal | Description | Metric |
|------|-------------|--------|
| **Increase Organic Traffic** | Drive discovery via Google Search | 1,000+ organic visitors/month by month 6 |
| **Improve AI Discoverability** | Make content accessible to LLM crawlers | `llms.txt` + `ai-sitemap.xml` + valid JSON-LD + public API |
| **Lead Generation** | Convert visitors into sales pipeline | 50+ qualified leads/month |
| **Build Authority** | Establish WeeCommerce sebagai industry expert | 20+ backlinks dari authority sites |
| **Fast Performance** | Excellent UX + ranking signal | Core Web Vitals: All Green |

### Success Metrics (Hard Numbers)

| Metric | Target | Tool |
|--------|--------|------|
| Core Web Vitals | All Green (LCP < 2.5s, CLS < 0.1, INP < 200ms) | Google Search Console |
| Lighthouse Performance | ≥ 95 | PageSpeed Insights |
| Lighthouse SEO | ≥ 95 | Lighthouse |
| Lighthouse Accessibility | ≥ 95 | Lighthouse |
| Structured Data Validation | 0 Errors | Schema.org Validator (Rich Results Test) |
| Organic Traffic | 1,000+ visitors/month | Google Analytics 4 / Plausible |
| Form Conversion Rate | ≥ 5% (visitor → submission) | Plausible goals |
| Average Page Load Time | < 2 seconds | WebPageTest |
| TTFB (Time to First Byte) | < 200ms | WebPageTest |
| Uptime | 99.5% | UptimeRobot |
| Crawlability | 100% of pages indexed | Google Search Console |

---

## 3. Scope

### MVP (Phase 1) — Jualan-Ready

**Pages (10 core):**
- **Home** — Hero + Services Overview + Featured Portfolio + Latest Blog + CTA
- **Services** — 4 tiers (LAUNCH, CONVERT, SCALE, INTEGRATE) + detail pages `/services/[tier]`
- **Portfolio** — Case studies grid + detail pages dengan results breakdown `/portfolio/[slug]`
- **About Us** — Company story, founder bio (Alif Nugraha), values
- **Process** — How we work: 6-step workflow (Discovery → Retain)
- **Pricing** — Transparent tier comparison (IDR + USD)
- **FAQ** — 30+ common questions
- **Contact** — Form + WhatsApp + Email CTAs
- **Blog** — Article listing + detail `/blog/[slug]` + category/tag filters
- **Case Studies** — Detailed project breakdown (subset of Portfolio, deeper)

**Features (Public):**
- Mobile-first responsive (320px → 1920px)
- Dark/Light mode toggle (persistent via localStorage + system preference)
- Server-Side Rendering + Static Site Generation + ISR (Next.js 14 App Router)
- Progressive Enhancement (works without JS for core content)
- WCAG AA Accessibility
- Full SEO optimization (meta, sitemap, robots, JSON-LD, canonical, OG)
- AI-crawlable structured data + `llms.txt` ecosystem
- Contact form with Zod validation + Cloudflare Turnstile spam protection
- Email notifications via Resend (admin + auto-reply) + webhook ke n8n
- Blog search (PostgreSQL full-text search)
- Portfolio filtering (by technology, industry, service tier)
- Related content recommendations
- Newsletter (double opt-in, Resend Audience)
- Multi-language (ID default + EN, hreflang, locale routing)
- Analytics via Plausible (privacy-focused, GDPR-friendly)

**Features (Admin Dashboard):**
- Auth (NextAuth + bcrypt + 2FA TOTP), login rate limit
- Blog CRUD (create/edit/publish/schedule) with image upload
- Portfolio/case study CRUD
- Services/pricing editor
- FAQ editor
- Form submissions inbox (status workflow)
- SEO metadata editor per page
- Image upload to R2 (sharp optimization)
- Audit log viewer

**Containers (5):**
- `nginx` — Reverse proxy, SSL termination, rate limiting, static cache
- `nextjs` — Frontend (SSR/SSG/ISR) + admin dashboard UI
- `hono-api` — Backend monolith: CMS read + contact form + admin CRUD + SEO/sitemap/llms.txt generation + public AI API + webhook dispatch
- `postgres` — Single database instance (PostgreSQL 16)
- `redis` — Cache + rate limit counters + session store

**External Services (SaaS, no container):**
- Cloudflare R2 — Image & document storage (free 10GB + zero egress)
- Resend — Transactional email (3,000 free/month) + newsletter
- Sentry — Error tracking
- UptimeRobot — Uptime monitoring
- Plausible — Analytics (self-hosted option via Plausible Cloud atau VPS)
- Cloudflare Turnstile — Spam protection (free, privacy-friendly)
- n8n — Webhook automation (existing Alif's stack)

### Future Phases (Post-MVP)

Lihat detail di [ROADMAP.md](./ROADMAP.md).

**Phase 2 — Engage (bulan 4–6):**
- Client portal (project tracking with auth)
- Knowledge base / documentation site (`docs.weecommerce.web.id`)
- Case study engine (results dashboard, testimonial collection)
- International activation (LinkedIn EN, cold email, Wise)

**Phase 3 — Scale (bulan 6+, scale):**
- AI chatbot on website (RAG over docs)
- Extract microservices dari Hono monolith (jika load butuh)
- Managed PostgreSQL (Neon/Supabase)
- Multi-region deploy
- Community forum (opsional)
- Advanced personalization

### Out of Scope (MVP)

- e-Commerce functionality (product catalog, cart, checkout) — *ini yang WeeCommerce jual ke klien, bukan yang dipakai sendiri*
- Public user accounts / registration (admin-only auth)
- Real-time features (live chat dibawa ke WhatsApp link)
- Payment processing
- Fine-tuning offering

---

## 4. User Types

### 4.1 Visitor (Public)
- Primary user accessing the website.
- Goals: Pelajari WeeCommerce, explore services, lihat portfolio, request demo/konsultasi.
- Entry points: Google Search, AI chatbot answers, social media, direct.
- Behavior: Browse 5–10 pages, isi contact form, download materials.

### 4.2 Prospective Client (Indonesia) — Primary Market Phase 1
- Profil: Brand lokal SME, omzet Rp 50jt–500jt/bln, sudah aktif di Tokopedia/Shopee.
- Device: Mostly mobile (WhatsApp-first mindset).
- Bahasa: Indonesian (campuran OK).
- Pain point: Dependency marketplace, fee naik, CS manual, data customer tidak dimiliki.
- Decision criteria: Harga, timeline, portfolio proof.
- CTA preference: WhatsApp / "Konsultasi gratis".

### 4.3 Prospective Client (International) — Secondary Market Phase 1
- Profil: Founder-led e-commerce, technical background, revenue $5k–$50k/month.
- Device: Desktop + mobile.
- Bahasa: English only.
- Pain point: Western agency mahal, Shopify terlalu terbatas, butuh AI capability.
- Decision criteria: Technical capability, case studies, communication clarity, async professionalism.
- CTA preference: Email / "Book a call".

### 4.4 Search Engine Bot (Googlebot)
- Crawler: Googlebot (desktop + mobile).
- Requirements: Crawlable HTML, sitemaps, robots.txt, valid schema, fast TTFB.
- Behavior: Indexes pages, evaluates Core Web Vitals, checks mobile-friendliness.

### 4.5 AI Crawler (ChatGPT, Claude, Gemini, Perplexity)
- LLM trying to understand WeeCommerce for user queries (e.g., "e-commerce agency Indonesia AI").
- Requirements: `llms.txt`, `llms-full.txt`, `ai-sitemap.xml`, structured data, machine-readable content, public read-only API.
- Behavior: Indexes content for training/citations, answers user questions about WeeCommerce.

### 4.6 Admin (Internal) — Alif Nugraha
- Founder/operator managing content.
- Access: Admin dashboard (part of MVP).
- Responsibilities: Update blog, services, portfolio, manage inquiries via UI.
- Requirements: Easy content management, no technical knowledge needed.

---

## 5. Functional Requirements

### 5.1 Website Core

#### Responsiveness
- Mobile-first design (320px min).
- Tablet support (768px).
- Desktop optimization (1920px max).
- No horizontal scroll at any breakpoint.
- Touch targets ≥ 44×44px (Shadcn/UI components default to this).

#### Dark/Light Mode
- User preference toggle (persistent di localStorage).
- Respects system preference (`prefers-color-scheme`) on first visit.
- CSS variables for theming (Tailwind v4 + Shadcn token system).
- Smooth transition (150ms) between modes.
- All text contrast meets WCAG AA (4.5:1 text, 3:1 large text).

#### Performance
- SSR/SSG/ISR via Next.js 14 App Router (Server Components by default).
- `next/image` untuk image optimization (auto WebP, srcset, lazy load).
- Code splitting & dynamic imports per route.
- Font optimization via `next/font` (Inter + Space Grotesk + JetBrains Mono).
- Critical CSS inlined.
- Preload critical resources (hero image, font, LCP target).

#### Progressive Enhancement
- Core content accessible tanpa JavaScript (semantic HTML renders server-side).
- Form submissions work via standard POST fallback (progressive enhancement pattern).
- Navigation functional via anchor links (client-side enhancement only).

#### Accessibility
- WCAG 2.1 AA compliance (minimum).
- Semantic HTML (`h1`, `article`, `main`, `aside`, `nav`, `section`).
- ARIA labels where semantic HTML insufficient (Shadcn/Radix handles this).
- Keyboard navigation (Tab through all interactive elements).
- Color not sole information method (icon + text always).
- Focus indicators visible (Shadcn focus rings).
- Screen reader tested (NVDA / VoiceOver).
- `prefers-reduced-motion` respected.

### 5.2 Lead Generation

#### Contact Form
- Fields: Name (required), Email (required), Company (required), Message (required, min 20 chars), Phone (optional).
- Validation: Real-time client-side (React Hook Form + Zod) + server-side (Hono + Zod, source of truth).
- Submission flow:
  1. User fills form.
  2. Client-side validation.
  3. Submit `POST /api/v1/contact` ke Hono.
  4. Server-side validation (Zod).
  5. Spam detection (Cloudflare Turnstile + honeypot field).
  6. Save to PostgreSQL (`form_submissions` table).
  7. Send email ke admin via Resend.
  8. Send auto-reply ke user via Resend.
  9. Trigger webhook ke n8n (optional, untuk CRM/Slack).
  10. Track analytics event (Plausible).
  11. Show success message.
- Feedback: Clear error messages per field, success confirmation, error toast.
- GDPR-friendly: Privacy notice link + consent checkbox.

#### WhatsApp CTA
- Floating button (sticky, bottom-right, mobile + desktop).
- Direct link: `https://wa.me/<number>?text=<pre-filled-message>`.
- Appears on: Home, Services, About, Contact pages.
- Tracking: Plausible goal event on click.

#### Email CTA
- Newsletter subscription form (footer).
- Fields: Email (required).
- Integration: Resend Audiences OR standalone newsletter table.
- Confirmation: Double opt-in (email verification link).
- Unsubscribe link di setiap email (CAN-SPAM + GDPR compliance).

#### Calendly Integration (Optional Phase 1)
- Embedded calendar untuk demo scheduling (international market).
- Fallback: Contact form jika calendar unavailable.

#### Download Assets (ungated in MVP; optional gating Phase 2 client portal)
- Company profile PDF (downloadable dari About / Contact).
- Pricing guide (downloadable dari Pricing).
- One-pager service descriptions (downloadable dari Services).

### 5.3 Blog

#### Content Structure

**Listing page** (`/blog`):
- Grid view (responsive: 1 col mobile, 2 col tablet, 3 col desktop).
- Pagination (12 posts per page).
- Filter by category (checkboxes, multi-select).
- Filter by tag (clickable pills).
- Search input (full-text search via API).
- Sort: Latest (default), Most Read.

**Post detail page** (`/blog/[slug]`):
- Article content (rich text rendered dari MDX atau markdown stored di DB).
- Featured image (R2-hosted, `next/image` optimized).
- Author bio (name, photo, bio, social links).
- Publish date + update date (visible, schema-included).
- Category + tags (clickable).
- Reading time estimate (calculated server-side).
- Table of Contents (auto-generated from H2/H3, sticky sidebar desktop).
- Related articles (3 similar posts, by category/tags).
- Social share buttons (X, LinkedIn, WhatsApp, Copy link).
- AI citation metadata (`ai:author`, `ai:published-date`, `ai:updated-date`).

**Author page** (`/blog/author/[slug]`):
- Author bio + photo.
- All posts by author.
- Social links.

#### Blog Features
- Category pages (`/blog/category/[slug]`).
- Tag pages (`/blog/tag/[slug]`).
- Search (global site search via API).
- RSS Feed (`/feed.xml` — valid RSS 2.0, last 20 posts).
- Sitemap (`/sitemap.xml` includes all blog URLs, priority 0.7, changefreq weekly).

### 5.4 Portfolio / Case Studies

#### Case Study Detail (`/portfolio/[slug]`)
- Project title + description.
- Client name (atau "Confidential" jika NDA).
- Results: 3–5 key metrics (e.g., "250% revenue increase", "60% reduction in CS time").
- Challenge (problem statement).
- Solution (what was built — diagram/flow optional).
- Technologies used (tags: Next.js, Supabase, n8n, RAG).
- Timeline (start date, end date, total weeks).
- Featured image + gallery (3–5 images dari R2).
- Link to live project (jika public).

#### Portfolio Filtering
- Filter by technology (checkbox).
- Filter by industry (dropdown).
- Filter by service tier (LAUNCH/CONVERT/SCALE).
- Combine filters (e.g., "Next.js + E-commerce").
- Results count updates dynamically (no full page reload).

#### Portfolio Gallery
- Grid layout (3 col desktop, 2 tablet, 1 mobile).
- Lazy load images.
- Click to expand modal (Shadcn Dialog).
- Prev/next navigation in modal.

### 5.5 Services

#### Service Pages
- 4 main tiers: LAUNCH, CONVERT, SCALE, INTEGRATE (referensi Brand Blueprint Section C).
- Each tier detail page (`/services/[tier]`):
  - Detailed description.
  - Features list (what's included).
  - Not included list (explicit).
  - Pricing (IDR + USD, soft anchor: "Starting from...").
  - Timeline (weeks + description).
  - FAQ (service-specific).
  - Related case studies (2–3).
  - CTA button: "Konsultasi Gratis" (ID) / "Book a Call" (EN).

#### Service Comparison (Pricing page)
- Comparison table (all tiers side-by-side, Shadcn Table).
- Highlight "Most Popular" tier (CONVERT, badge + emphasis).
- Toggle IDR/USD (state persistent per visitor).

### 5.6 Contact & Validation

#### Form Validation
- **Client-side:** React Hook Form + Zod (shared schema dengan server).
- **Server-side:** Hono + Zod (single source of truth).
- Clear error messages ("Email format: name@company.com").
- Submit button disabled until form valid.
- Required field indicators (`*`).

#### Email Notifications (via Resend)
- **To admin** (`hello@weecommerce.web.id`):
  - Subject: "New contact form submission from [Name]".
  - Body: All form data + timestamp + IP + user agent.
- **To user** (auto-reply):
  - Subject: "Thanks for reaching out, [Name]!".
  - Body: Acknowledge receipt + next steps ("We'll reply within 24 hours") + links to FAQ/blog/calendar.

#### Webhook Support (to n8n / external)
- Webhook endpoint optional (`WEBHOOK_URL` env var).
- Payload: Form data + metadata (timestamp, IP, spam score).
- Retry logic: 3 attempts with exponential backoff (5s, 30s, 5min).
- Webhook logs stored di PostgreSQL untuk debugging.

---

## 6. Non-Functional Requirements

### 6.1 Availability & Uptime

| SLA | Target | Monitoring |
|-----|--------|-----------|
| Uptime | 99.5% | UptimeRobot check every 60s |
| Auto-recovery | < 30s | Docker restart policy `always` |
| Backup | Daily | `pg_dump` → R2, 2 AM UTC |
| RTO (Recovery Time Objective) | < 1 hour | From backup |
| RPO (Recovery Point Objective) | < 24 hours | Latest daily backup |

### 6.2 Performance

| Metric | Target | Tool |
|--------|--------|------|
| TTFB (Time to First Byte) | < 200ms | WebPageTest |
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse, Chrome DevTools |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| INP (Interaction to Next Paint) | < 200ms | Chrome DevTools |
| FCP (First Contentful Paint) | < 1.8s | Lighthouse |
| TBT (Total Blocking Time) | < 200ms | Lighthouse |
| Total Page Size (JS) | < 200KB initial | WebPageTest |
| Image Total Size | < 1MB (optimized) | WebPageTest |
| Lighthouse Performance | ≥ 95 | Lighthouse |

### 6.3 SEO & Discoverability

| Requirement | Target |
|-------------|--------|
| Lighthouse SEO | ≥ 95 |
| Structured Data | 0 errors (Rich Results Test) |
| Mobile-friendly | 100% |
| Page Indexability | 100% |
| Crawlability | No blocked resources |
| XML Sitemap | Auto-generated by Hono, daily rebuild |
| robots.txt | Valid, allow Google + AI crawlers |
| Canonical URLs | Every page has canonical |
| Meta Tags | Unique title (50–60c) + description (150–160c) per page |
| Open Graph | All shareable content has og:* tags |
| Twitter Card | Blog posts + case studies |

Detail lengkap di [SEO.md](./SEO.md).

### 6.4 Accessibility

| Standard | Target |
|----------|--------|
| WCAG | Level AA (minimum) |
| Lighthouse Accessibility | ≥ 95 |
| Keyboard Navigation | 100% interactive elements |
| Color Contrast | 4.5:1 text, 3:1 large text |
| Alt Text | All images have descriptive alt |
| Screen Reader | Tested with NVDA / VoiceOver |
| Form Labels | All inputs have associated labels |

### 6.5 Maintainability

- TypeScript strict mode (all packages).
- Test coverage ≥ 80% (Vitest unit + Playwright e2e).
- Documentation: setiap file kode kompleks punya inline comment.
- Modularity: clear boundary antara Next.js (presentation) dan Hono (business logic).
- Versioning: Semantic versioning per package (MAJOR.MINOR.PATCH).
- Dependency scanning: Dependabot (GitHub) + `npm audit` di CI.

---

## 7. Architecture Overview

### 7.1 Decision: Streamlined 5-Container (bukan microservices)

Draft awal PRD mendefinisikan 10+ microservice. Setelah review resource (VPS 2GB RAM) dan scope (company profile + form, mostly read-heavy static), diputuskan **streamline ke 5 container**. Alasan:

| Factor | 10+ Microservices | 5 Container (chosen) |
|---|---|---|
| RAM usage | ~2–4GB (OOM risk di 2GB VPS) | ~600MB–1GB (aman di 2GB) |
| Operational overhead | 18+ container untuk maintain | 5 container, satu orang bisa handle |
| Development speed | Koordinasi antar service lambat | Single backend codebase (Hono), cepat iterate |
| Cost | Butuh VPS 8GB ($20+/bln) | VPS 2GB ($3–8/bln) |
| Fit untuk use case | Overkill untuk company profile | Right-sized |

Trade-off: kehilangan independent scaling per service. **Mitigation:** jikan nanti satu service jadi bottleneck (misal API), extract jadi microservice terpisah (lihat [ROADMAP.md](./ROADMAP.md) trigger evolusi arsitektur).

### 7.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Internet (Users, Googlebot, AI Crawlers)                │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────┐
│ Cloudflare (DNS + CDN + WAF)                            │
│ ├─ DDoS protection (free)                               │
│ ├─ Global edge cache (static assets)                    │
│ ├─ TLS termination (optional, atau di Nginx)            │
│ └─ R2 storage integration                               │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│ VPS (Ubuntu 22.04, 2GB RAM, 1 vCPU)                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Docker Engine + Dokploy                             │ │
│ │                                                      │ │
│ │ ┌──────────┐   ┌─────────┐   ┌──────────────────┐  │ │
│ │ │ Nginx    │──▶│ Next.js │   │ Hono API         │  │ │
│ │ │ (proxy)  │──▶│ :3000   │   │ :4000            │  │ │
│ │ │ :80/:443 │   │ (SSR/   │   │ (business logic, │  │ │
│ │ │          │   │  SSG)   │   │  CMS, form, SEO, │  │ │
│ │ └──────────┘   └────┬────┘   │  AI public API)  │  │ │
│ │                      │        └────────┬─────────┘  │ │
│ │                      │                 │             │ │
│ │              ┌───────┴─────────────────┘             │ │
│ │              ▼                                       │ │
│ │ ┌──────────────────┐  ┌──────────────────┐          │ │
│ │ │ PostgreSQL :5432 │  │ Redis :6379      │          │ │
│ │ │ (content, leads) │  │ (cache, rate     │          │ │
│ │ │                  │  │  limit counters) │          │ │
│ │ └──────────────────┘  └──────────────────┘          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ External (SaaS, no container):                          │
│ ├─ Cloudflare R2 (images, PDFs)                         │
│ ├─ Resend (email)                                       │
│ ├─ Sentry (error tracking)                              │
│ ├─ UptimeRobot (uptime monitor)                         │
│ ├─ Plausible (analytics)                                │
│ ├─ Cloudflare Turnstile (spam)                          │
│ └─ n8n (webhook automation)                             │
└─────────────────────────────────────────────────────────┘
```

Detail lengkap (container config, nginx.conf, data flow, caching, scaling) di [ARCHITECTURE.md](./ARCHITECTURE.md).

### 7.3 Container Summary

| Container | Image | Port | Volume | Responsibility |
|---|---|---|---|---|
| `nginx` | `nginx:alpine` | 80, 443 | SSL certs, conf | Reverse proxy, SSL, rate limit, security headers |
| `nextjs` | Custom (node:20-alpine) | 3000 | `.next/cache` | SSR/SSG/ISR rendering, admin dashboard UI |
| `hono-api` | Custom (node:20-alpine) | 4000 | logs | Business logic, CMS read, form, SEO gen, public AI API |
| `postgres` | `postgres:16-alpine` | 5432 | `pgdata` | Persistent data |
| `redis` | `redis:7-alpine` | 6379 | `redis-data` | Cache + rate limit |

---

## 8. Database Requirements

### 8.1 High-Level Data Model

PostgreSQL 16, single instance. Schema lengkap + migration files di [DATABASE.md](./DATABASE.md).

```
Content       → posts, categories, tags, posts_to_tags,
                case_studies, case_study_results,
                services, service_features, faq, team_members, pages
Media         → media_files (R2 object key reference, bukan blob)
Leads         → form_submissions, newsletter_subscribers, submission_logs
SEO           → seo_metadata, redirects
Audit         → audit_logs
```

### 8.2 Key Tables (overview, full schema di DATABASE.md)

- `posts` — Blog articles (slug, content, author, SEO fields, status).
- `case_studies` — Portfolio (client, results JSONB, technologies array, gallery).
- `services` — 4 tier info (LAUNCH, CONVERT, SCALE, INTEGRATE) + `service_features`.
- `form_submissions` — Contact form data + spam_score + status workflow.
- `newsletter_subscribers` — Email list dengan double opt-in state.
- `seo_metadata` — Per-page SEO override + JSON-LD.
- `team_members` — Founder/team bios (Alif Nugraha sebagai default).

### 8.3 Backup & Retention

- **Daily backup:** `pg_dump | gzip` → R2 (2 AM UTC, via cron + rclone).
- **Retention:** 30 days daily + 12 months weekly.
- **Encryption:** AES-256 at rest (R2 default).
- **Restore test:** Weekly (automated script, verify integrity).

---

## 9. SEO Requirements

Detail lengkap di [SEO.md](./SEO.md). High-level:

### 9.1 Technical SEO
- Canonical URLs di setiap page.
- Meta tags (title 50–60c, description 150–160c, unique per page).
- Open Graph + Twitter Card tags.
- Structured data JSON-LD (Organization, Article, FAQPage, Service, Person, BreadcrumbList, HowTo).
- `robots.txt` allow Google + AI crawlers.
- XML Sitemap auto-generated oleh Hono, daily rebuild.
- URL structure: lowercase, descriptive (`/services/launch`, `/blog/custom-ecommerce-guide`).
- Internal linking strategy (topic clusters).

### 9.2 On-Page SEO
- Keyword di title, H1, first 100 words.
- Heading hierarchy (1 H1 → H2 → H3, no skipping).
- Content length: blog 1,200–2,500 words, landing 500–1,000 words.
- Image alt text (descriptive, 100–125c).
- Table of Contents auto-generated.

### 9.3 Core Web Vitals
- LCP < 2.5s (optimize hero image + font + render-blocking).
- CLS < 0.1 (reserve image space, no unsized embeds).
- INP < 200ms (minimize main-thread work, break long tasks).

### 9.4 Image SEO
- `next/image` auto WebP + srcset + lazy load.
- Multiple sizes (200px, 400px, 800px, 1200px).
- Compression quality 80–85%.
- EXIF strip via R2 Image Transformations.

---

## 10. GEO (Generative Engine Optimization)

GEO = optimizing website untuk AI model discovery (ChatGPT, Claude, Gemini, Perplexity). Berbeda dari SEO (human search), GEO fokus ke machine-readable content.

Detail implementasi (endpoint spec, template isi, schema) di [SEO.md](./SEO.md#geo) dan [API.md](./API.md#public-ai-api).

### 10.1 GEO Assets (served by Hono)

| Asset | Path | Size | Purpose |
|---|---|---|---|
| `llms.txt` | `/llms.txt` | 2–3 KB | Company overview summary untuk AI quick parse |
| `llms-full.txt` | `/llms-full.txt` | 10–20 KB | Detailed company description, all services, team, pricing |
| `ai-sitemap.xml` | `/ai-sitemap.xml` | varies | Priority URLs untuk AI training, allow/disallow per crawler |
| Public API | `/api/v1/public/*` | JSON | Machine-readable content (about, services, portfolio, team, blog, faq) |
| Markdown export | `/api/v1/public/blog/:slug/markdown` | varies | Clean markdown untuk AI citation |

### 10.2 GEO Principles
- **Structured entities** — Konsisten naming ("WeeCommerce", "Alif Nugraha", "LAUNCH/CONVERT/SCALE").
- **JSON-LD everywhere** — Schema.org markup di setiap page.
- **Citation-friendly content** — Sources, dates, author attribution.
- **Fact-based writing** — Claims backed by data, no speculation as fact.
- **Public API** — Generous rate limit (100 req/hr) untuk AI training/citation, no auth.
- **AI metadata tags** — `<meta name="ai:author">`, `ai:published-date`, `ai:updated-date`, `ai:sources`.

### 10.3 robots.txt Allowlist for AI Crawlers

```
User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Perplexity
Allow: /

User-agent: Google-Extended
Allow: /
```

---

## 11. Security Requirements

Detail lengkap (config, OWASP mapping, incident response) di [SECURITY.md](./SECURITY.md).

### 11.1 Transport Security
- HTTPS only (HTTP → HTTPS redirect via Nginx).
- TLS 1.3 (1.2 minimum for legacy).
- HSTS header (`max-age=31536000; includeSubDomains`).
- SSL cert via Dokploy (Let's Encrypt auto-renew).

### 11.2 Application Security
- **CSP** — Strict Content Security Policy, allow Shadcn + Plausible + Resend + R2.
- **CSRF** — SameSite cookies + CSRF token untuk state-changing endpoints.
- **XSS** — Input sanitization (DOMPurify), output encoding, no `dangerouslySetInnerHTML`.
- **Rate limiting** — Contact form 5/hr/IP, API 1000/hr/IP, search 100/min/IP.
- **Spam protection** — Cloudflare Turnstile on contact form + honeypot field.

### 11.3 Data Security
- DB credentials in env vars (Dokploy secrets), never in code.
- TLS connection to database.
- R2 bucket private + signed URLs untuk sensitive assets.
- Backups encrypted at rest (R2 default).

### 11.4 Compliance
- **GDPR-ready** — Consent checkbox, data export endpoint, right to deletion.
- **Privacy Policy** — Clear, transparent (page `/privacy`).
- **Cookie Policy** — Disclosure of analytics cookies (Plausible cookieless).

---

## 12. Deployment & DevOps

Detail lengkap (Dockerfile, docker-compose, CI/CD, Dokploy steps) di [DEPLOYMENT.md](./DEPLOYMENT.md).

### 12.1 Containerization
- Every container: multi-stage build, Alpine base, non-root user, healthcheck.
- `.dockerignore` exclude `node_modules`, `.git`, `.next`, `dist`.
- No secrets baked into images.

### 12.2 Deployment Platform
- **VPS:** Ubuntu 22.04 LTS, 2GB RAM, 1 vCPU (Contabo/Linode/Vultr, ~$3–8/bln).
- **Orchestrator:** Dokploy (self-hosted Vercel alternative, one-click deploy).
- **Domain:** `weecommerce.web.id` (budget TLD).

### 12.3 CI/CD (GitHub Actions)
- Trigger: push to `main` → build → push to GHCR → Dokploy webhook → zero-downtime deploy.
- Lint + typecheck + test before build.
- Trivy security scan on image.
- Lighthouse CI untuk performance regression check.

### 12.4 Environment Variables
- Dev: `.env.local` (gitignored).
- Production: Dokploy encrypted env vars per application.
- CI: GitHub Secrets.
- No secrets in logs (strip sensitive data).

---

## 13. Monitoring & Observability

### 13.1 SaaS Stack (no self-hosted untuk MVP)

| Concern | Tool | Free Tier |
|---|---|---|
| Error tracking | Sentry | 5,000 errors/bln |
| Uptime monitoring | UptimeRobot | 50 monitors, 5-min interval |
| Analytics | Plausible | Self-host atau $9/bln cloud |
| Performance | Google Search Console + Lighthouse CI | Free |
| Logs | Docker logs + Sentry breadcrumbs | Built-in |

### 13.2 Health Endpoints
Setiap container expose `GET /health`:
```json
{
  "status": "ok",
  "uptime": 3600,
  "database": "connected",
  "cache": "connected",
  "timestamp": "2026-06-28T10:00:00Z"
}
```

### 13.3 Alerting
- Sentry → email + Slack/Discord webhook on new error.
- UptimeRobot → email + Slack on downtime > 1 min.
- Disk usage > 80% → alert (cron check).

---

## 14. Acceptance Criteria

### Functional ✓
- [ ] Semua 10 halaman render tanpa error.
- [ ] Services page menampilkan 4 tiers (LAUNCH, CONVERT, SCALE, INTEGRATE).
- [ ] Contact form validate inputs, send email + auto-reply.
- [ ] Blog search bekerja (query return matching articles).
- [ ] Portfolio filtering bekerja (by tech, industry, service).
- [ ] Dark/light mode toggle persistent.
- [ ] WhatsApp CTA link working di semua page relevan.
- [ ] Newsletter subscription capture email.
- [ ] Related content (blog, portfolio) link correctly.
- [ ] Form submission trigger webhook (jika `WEBHOOK_URL` set).

### Performance ✓
- [ ] Lighthouse Performance ≥ 95.
- [ ] Lighthouse SEO ≥ 95.
- [ ] Lighthouse Accessibility ≥ 95.
- [ ] Core Web Vitals all green (LCP < 2.5s, CLS < 0.1, INP < 200ms).
- [ ] TTFB < 200ms.
- [ ] Total page size < 200KB initial JS.
- [ ] Images optimized (WebP, responsive sizes).
- [ ] Load time < 2 seconds on 4G.

### SEO ✓
- [ ] `robots.txt` generated correctly (allow Google + AI crawlers).
- [ ] `sitemap.xml` includes all pages + images.
- [ ] All pages have unique meta title + description.
- [ ] Structured data validates tanpa error (JSON-LD).
- [ ] Open Graph tags on shareable content.
- [ ] Twitter Card tags on blog posts.
- [ ] All images have alt text.
- [ ] Canonical URL di setiap page.
- [ ] No broken internal links.
- [ ] Proper heading hierarchy (H1 → H2 → H3).

### GEO (AI Optimization) ✓
- [ ] `/llms.txt` exists (company overview).
- [ ] `/llms-full.txt` exists (detailed content).
- [ ] `/ai-sitemap.xml` generated.
- [ ] JSON-LD structured data di semua page.
- [ ] Public API endpoint (`/api/v1/public/*`).
- [ ] Markdown export endpoint (`/api/v1/public/blog/:slug/markdown`).
- [ ] Entity linking in content.
- [ ] AI Citation metadata tags present.
- [ ] Content machine-readable (no JS required for parsing).

### Security ✓
- [ ] HTTPS only (no HTTP fallback).
- [ ] Security headers present (HSTS, CSP, X-Frame-Options).
- [ ] CSRF protection on forms.
- [ ] XSS protection (input sanitization, output encoding).
- [ ] Rate limiting working (contact form, API).
- [ ] Cloudflare Turnstile on contact form.
- [ ] No secrets in code/logs.
- [ ] SQL injection prevention (parameterized queries).
- [ ] GDPR consent mechanism.

### Accessibility ✓
- [ ] WCAG AA compliance (minimum).
- [ ] Lighthouse Accessibility ≥ 95.
- [ ] Keyboard navigation (Tab through all elements).
- [ ] Focus indicators visible.
- [ ] Color not sole information method.
- [ ] Semantic HTML (article, main, nav, etc).
- [ ] Screen reader tested.
- [ ] Contrast ratio ≥ 4.5:1 for text.

### Architecture & Deployment ✓
- [ ] 5 container berjalan via Docker Compose.
- [ ] Docker Compose runs all services locally.
- [ ] Deployable via Dokploy (one-click).
- [ ] Health checks working per service.
- [ ] Auto-restart policy configured.
- [ ] Environment variables managed securely.
- [ ] CI/CD pipeline working (GitHub Actions).
- [ ] Auto-deploy on push to main.
- [ ] Database backups running daily.
- [ ] Sentry + UptimeRobot + Plausible configured.

### Testing ✓
- [ ] Unit tests ≥ 80% coverage.
- [ ] Integration tests untuk critical flows (contact form).
- [ ] E2E tests untuk user journeys (Playwright).
- [ ] Lighthouse tests in CI/CD.

### Documentation ✓
- [ ] README.md with setup instructions.
- [ ] ARCHITECTURE.md documenting system design.
- [ ] API.md documenting all endpoints.
- [ ] DATABASE.md documenting schema.
- [ ] SEO.md documenting SEO + GEO setup.
- [ ] SECURITY.md documenting hardening.
- [ ] DEPLOYMENT.md with deployment instructions.
- [ ] ROADMAP.md with phase plan.
- [ ] CONTRIBUTING.md for developers.

### Acceptance Sign-Off
- [ ] Stakeholder (Alif Nugraha) approve design & functionality.
- [ ] Performance targets met (Lighthouse ≥ 95).
- [ ] Security review passed.
- [ ] All acceptance criteria checked.
- [ ] Ready for production launch.

---

## Summary

PRD ini defines a high-performance, AI-optimized (GEO) company profile website untuk WeeCommerce. Stack: **Next.js 14 + Shadcn/UI + Hono + PostgreSQL + Redis**, deployed as **5 Docker container** via Dokploy di VPS 2GB (budget-friendly).

**MVP Focus:** 10 core pages, SEO + GEO optimization, lead generation, performance.
**Future Phases:** Admin dashboard, multi-language, AI search, client portal — detail di [ROADMAP.md](./ROADMAP.md).

**Key Success Metrics:**
- Lighthouse ≥ 95 (performance, SEO, accessibility).
- Core Web Vitals all green.
- 1,000+ organic visitors/month.
- 50+ qualified leads/month.

**Deployment:** Docker-native, Dokploy-ready, one-click deploy, total cost ≤ $10/month.
