# WeeCommerce Roadmap — MVP & Future Phases

**Version:** 1.1
**Last Updated:** Juni 2026
**Philosophy:** Jualan-ready over feature-complete

> ⚠ **Perubahan v1.1:** Phase 1 (MVP) dan Phase 2 (Enable) lama **disatukan** jadi satu MVP. Alasan: admin dashboard, i18n, dan newsletter adalah foundational capability — lebih murah dibangun sekali dari pada di-retrofit kemudian. Phase 3 (Engage) lama → Phase 2. Phase 4 (Scale) lama → Phase 3.

> Berkaitan: [PRD.md §3](./PRD.md#3-scope) (scope detail) · [ARCHITECTURE.md §10](./ARCHITECTURE.md#10-scaling-path) (scaling path) · [DESIGN.md](./DESIGN.md) (component inventory)

---

## Table of Contents

1. [Roadmap Philosophy](#1-roadmap-philosophy)
2. [Phase Overview](#2-phase-overview)
3. [Phase 1: MVP (Combined)](#3-phase-1-mvp-combined)
4. [Phase 2: Engage & Retain](#4-phase-2-engage--retain)
5. [Phase 3: Scale & Extract](#5-phase-3-scale--extract)
6. [Out of Scope (Deprioritized)](#6-out-of-scope-deprioritized)
7. [Triggers for Architecture Evolution](#7-triggers-for-architecture-evolution)
8. [Feature Flag Strategy](#8-feature-flag-strategy)
9. [KPIs per Phase](#9-kpis-per-phase)

---

## 1. Roadmap Philosophy

### 1.1 Core Principle

> *"Jangan bangun brand sebelum bisa jualan. Bangun cukup untuk tidak mempermalukan diri sendiri, lalu langsung sell. Brand yang indah tapi tidak ada klien = hobby, bukan bisnis."*
> — Brand Blueprint §G

### 1.2 Why MVP Combines Admin + i18n + Newsletter (v1.1 change)

Awalnya admin dashboard, multi-lang, dan newsletter di-fase terpisah (Phase 2). Diputuskan **disatukan ke MVP** karena:

1. **Admin dashboard** — Tanpa ini, setiap blog post / portfolio update butuh SQL manual. Pain untuk solo dev (Alif) yang harus kontent cadence 3–5x/minggu. Lebih murah bangun sekali dari retrofit.
2. **Multi-language (ID + EN)** — i18n retrofit ke arsitektur yang sudah jalan = rewrite routing + schema. Bangun dari awal murah. Sekaligun serve 2 market (ID primary, EN secondary) lebih awal.
3. **Newsletter** — Lead capture channel. Setiap visitor yang ga siap contact form, bisa capture email. Pipeline sehat dari day 1.
4. **Auth foundation** — Admin butuh auth. Bangun auth sekali, foundation untuk Phase 2 (client portal) udah siap.

**Trade-off:** MVP scope ~2.5× lebih besar (8–12 minggu vs 4–6 minggu). Worth it karena foundational.

### 1.3 Decision Framework

Setiap feature request dievaluasi terhadap 3 pertanyaan:

1. **Apakah ini membantu close klien bulan ini?** → If yes, MVP. If no, defer.
2. **Apakah ini bisa dikerjakan solo dalam X hari?** → Solo capacity check.
3. **Apakah ROI-nya jelas dalam 3 bulan?** → If unclear, defer.

### 1.4 Sequencing Rules

- **Satu hal pada satu waktu.** Selesaikan MVP dulu, baru tambah feature.
- **Sell before scale.** Dapatkan klien pertama sebelum optimize untuk 1000 klien.
- **Indonesia-primary, international-secondary.** Tapi i18n infra siap dari MVP.

---

## 2. Phase Overview

| Phase | Timeline | Theme | Goal |
|---|---|---|---|
| **Phase 1 — MVP (combined)** | Minggu 1–12 | Jualan-ready + ops foundation | 1 discovery call/minggu, 2 closing di 90 hari, content self-serve |
| **Phase 2 — Engage** | Bulan 4–6 | Pipeline + retention | Client portal, KB, case studies, international activation |
| **Phase 3 — Scale** | Bulan 6+ | Architecture evolution | Microservices extraction, managed DB, multi-region |

### Effort Legend

- 🟢 **S** = Small (1–3 hari)
- 🟡 **M** = Medium (1–2 minggu)
- 🔴 **L** = Large (2–4 minggu)

---

## 3. Phase 1: MVP (Combined)

**Goal:** Website jualan-ready + operational foundation (admin, i18n, newsletter) jalan dalam satu siklus build. Setelah launch, Alif bisa content cadence 3–5x/minggu tanpa sentuh code.

**Timeline:** 8–12 minggu (combined Phase 1 lama + Phase 2 lama).
**Stretch target:** Week 8 untuk public launch, Week 12 untuk admin + i18n stable.

### 3.1 Pages (10 core)

| Page | Priority | Effort | Notes |
|---|---|---|---|
| Home | P0 | 🟡 M | Hero (`hero-1`), services overview, featured portfolio, latest blog, CTA |
| Services (4 detail) | P0 | 🟡 M | `/services/[launch\|convert\|scale\|integrate]`, bento-pricing reference |
| Portfolio | P0 | 🟡 M | Case study grid + detail page with results breakdown |
| About | P1 | 🟢 S | Founder bio (Alif Nugraha), company story |
| Process | P1 | 🟢 S | 6-step workflow (Discovery → Retain), HowTo schema |
| Pricing | P0 | 🟡 M | Bento grid 4 tiers, IDR/USD toggle |
| FAQ | P1 | 🟢 S | 10+ questions, FAQPage schema |
| Contact | P0 | 🟡 M | Form + Turnstile + WhatsApp + email CTA |
| Blog | P0 | 🟡 M | Listing + detail, MDX rendering, TOC |
| Case Studies | P1 | 🟢 S | (Subset of Portfolio, deeper detail) |

### 3.2 Infrastructure (5 container)

| Task | Priority | Effort | Reference |
|---|---|---|---|
| Setup monorepo (pnpm workspace) | P0 | 🟢 S | CONTRIBUTING.md §1 |
| Next.js + Hono + PG + Redis + Nginx | P0 | 🟡 M | ARCHITECTURE.md §2 |
| Docker Compose (dev + prod) | P0 | 🟢 S | DEPLOYMENT.md §5 |
| Dokploy deployment | P0 | 🟢 S | DEPLOYMENT.md §6 |
| Staging environment (`staging.weecommerce.web.id`) | P0 | 🟡 M | DEPLOYMENT.md §1.3 — needed sebelum prod deploy dengan admin auth |
| Domain `weecommerce.web.id` + SSL | P0 | 🟢 S | DEPLOYMENT.md §2.4 |
| Database schema + seed | P0 | 🟡 M | DATABASE.md §3, §6 |

### 3.3 Core Features (Public)

| Feature | Priority | Effort | Notes |
|---|---|---|---|
| Contact form (Turnstile + Resend) | P0 | 🟡 M | API.md §4.1 |
| WhatsApp floating CTA | P0 | 🟢 S | Sticky bottom-right |
| Dark/light mode toggle | P1 | 🟢 S | DESIGN.md §3 |
| Portfolio filtering (tech/industry/tier) | P1 | 🟢 S | Client-side filter |
| Blog search (PostgreSQL FTS) | P1 | 🟢 S | DATABASE.md §5 |
| Related content recommendations | P2 | 🟢 S | SQL query in DATABASE.md §12.3 |
| Currency toggle IDR/USD | P1 | 🟢 S | DESIGN.md §11.5 |
| Newsletter subscribe (double opt-in) | P0 | 🟡 M | API.md §4.2, GDPR-compliant |

### 3.4 Admin Dashboard (Internal)

| Feature | Priority | Effort | Notes |
|---|---|---|---|
| Auth (NextAuth + bcrypt + 2FA TOTP) | P0 | 🔴 L | SECURITY.md §7, session HttpOnly cookies |
| Login rate limit (10/15min/IP) | P0 | 🟢 S | ARCHITECTURE.md §6.1 |
| Blog CRUD (create/edit/publish/schedule) | P0 | 🔴 L | Uses `posts` + `posts_to_tags` + `audit_logs` tables |
| Portfolio/case study CRUD | P0 | 🟡 M | Uses `case_studies` + `case_study_results` |
| Services/pricing editor | P1 | 🟢 S | Uses `services` + `service_features` |
| FAQ editor | P1 | 🟢 S | Uses `faq` table |
| Pages editor (hero, about content) | P2 | 🟢 S | Uses `pages` table |
| Form submissions viewer | P0 | 🟡 M | Inbox UI, status workflow (new → contacted → qualified → converted) |
| Image upload to R2 (with sharp optimization) | P0 | 🟡 M | API.md storage integration, SEO.md §7.1 |
| SEO metadata editor (per page) | P1 | 🟢 S | Uses `seo_metadata` table |
| Audit log viewer | P2 | 🟢 S | Uses `audit_logs` table |

### 3.5 Multi-Language (i18n)

| Feature | Priority | Effort | Notes |
|---|---|---|---|
| i18n setup (next-intl) | P0 | 🟡 M | ID default + EN |
| Hreflang tags | P0 | 🟢 S | SEO.md §3.3 |
| Content translation UI (per-post) | P1 | 🔴 L | Schema: add `locale` column + translations table |
| Locale-based routing (`/id/*`, `/en/*`) | P0 | 🟢 S | Default `/` = ID |
| Locale-based redirects (Accept-Language) | P1 | 🟢 S | First-visit detect, cookie persistent |
| Currency auto-tie to locale | P1 | 🟢 S | EN → USD default, ID → IDR default |

### 3.6 Newsletter & Email

| Feature | Priority | Effort | Notes |
|---|---|---|---|
| Double opt-in flow (verify token) | P0 | 🟢 S | API.md §4.2, `newsletter_subscribers` table |
| Resend Audience integration | P0 | 🟢 S | Sync verified subscribers |
| Unsubscribe handling (token-based) | P0 | 🟢 S | GDPR compliance |
| Welcome email sequence (3-email drip) | P1 | 🟢 S | Day 0, Day 3, Day 7 |
| Monthly newsletter send | P2 | 🟡 M | Curated blog digest |

### 3.7 SEO & GEO

| Task | Priority | Effort | Reference |
|---|---|---|---|
| Meta tags (title/desc/canonical/OG) | P0 | 🟢 S | SEO.md §3 |
| JSON-LD (Organization, Service, Article, FAQ) | P0 | 🟡 M | SEO.md §4 |
| `sitemap.xml` + `robots.txt` + `feed.xml` | P0 | 🟢 S | API.md §5 |
| `llms.txt` + `llms-full.txt` + `ai-sitemap.xml` | P0 | 🟡 M | SEO.md §9–10, API.md §6 |
| Public AI API (`/api/v1/public/*`) | P0 | 🟡 M | API.md §7 |
| Markdown export endpoint | P1 | 🟢 S | API.md §7.5 |
| Cloudflare R2 image optimization | P1 | 🟡 M | SEO.md §7 |
| Google Search Console + Bing setup | P0 | 🟢 S | SEO.md §13.2 |
| Plausible analytics + goals | P0 | 🟢 S | DEPLOYMENT.md §10.3 |

### 3.8 Security & Ops

| Task | Priority | Effort | Reference |
|---|---|---|---|
| HTTPS + security headers (Nginx) | P0 | 🟢 S | SECURITY.md §2–3 |
| CSP (Shadcn-safe, nonce-based untuk admin) | P0 | 🟡 M | SECURITY.md §4 — nonce CSP karena admin auth |
| Rate limiting (Nginx + Redis) | P0 | 🟢 S | ARCHITECTURE.md §6 |
| Zod validation (server + client, shared schema) | P0 | 🟢 S | SECURITY.md §5, packages/db shared |
| CSRF protection (admin endpoints) | P0 | 🟢 S | SECURITY.md §7.2 |
| Admin auth (NextAuth + bcrypt + 2FA) | P0 | 🔴 L | SECURITY.md §7 |
| Sentry error tracking | P0 | 🟢 S | DEPLOYMENT.md §10.1 |
| UptimeRobot monitoring | P0 | 🟢 S | DEPLOYMENT.md §10.2 |
| Daily backup to R2 | P0 | 🟢 S | DEPLOYMENT.md §9 |
| GitHub Actions CI/CD | P0 | 🟡 M | DEPLOYMENT.md §7 |
| GDPR right-to-deletion endpoint | P1 | 🟢 S | SECURITY.md §16.4 |
| Audit logging (admin actions) | P1 | 🟢 S | SECURITY.md §15 |

### 3.9 Optional Stretch (MVP, kalau time allows)

| Feature | Priority | Effort | Notes |
|---|---|---|---|
| AI-powered semantic search (pgvector) | P2 | 🔴 L | Embeddings via OpenAI, "Ask WeeCommerce" UI |
| A/B testing framework | P2 | 🔴 L | Plausible experiments or GrowthBook |
| Self-hosted Plausible (instead of cloud) | P2 | 🟡 M | Saves $9/mo, +200MB RAM |

### 3.10 Phase 1 Success Criteria

#### Public-facing
- [ ] Semua 10 halaman live (ID + EN), no broken links.
- [ ] Lighthouse Performance ≥ 95, SEO ≥ 95, A11y ≥ 95.
- [ ] Core Web Vitals all green.
- [ ] Contact form bekerja (email masuk + auto-reply).
- [ ] Newsletter double opt-in working.
- [ ] `llms.txt`, `llms-full.txt`, public AI API accessible.
- [ ] JSON-LD valid (Rich Results Test 0 errors).
- [ ] Daily backup running, weekly restore test passing.

#### Admin
- [ ] Login dengan 2FA working.
- [ ] Publish blog post via UI (no SQL).
- [ ] Upload image to R2 via UI.
- [ ] View + manage form submissions via UI.
- [ ] Audit log captures all admin actions.

#### i18n
- [ ] ID + EN content both rendered.
- [ ] Hreflang valid.
- [ ] Currency auto-switches with locale.

#### Business
- [ ] **1 discovery call per minggu** (Brand Blueprint §E goal).
- [ ] **2 project closing dalam 90 hari** post-launch.

---

## 4. Phase 2: Engage & Retain

**Goal:** Bangun pipeline jangka panjang + retainer base. Mulai activate international market secara aktif.

**Timeline:** Bulan 4–6.
**Trigger:** 3+ klien closing OR revenue mencapai threshold sustainable OR MVP stable for 60 hari.

### 4.1 Client Portal

| Feature | Priority | Effort | Notes |
|---|---|---|---|
| Client auth (separate role from admin) | P0 | 🟡 M | Extend MVP auth system |
| Project tracking dashboard | P0 | 🔴 L | Milestones, deliverables, timeline |
| File sharing (R2 signed URLs) | P1 | 🟡 M | |
| Invoice/payment status | P2 | 🔴 L | Midtrans/Stripe integration |
| Communication thread (async) | P2 | 🔴 L | |

### 4.2 Knowledge Base / Documentation

| Feature | Priority | Effort | Notes |
|---|---|---|---|
| Docs site (Fumadocs or Mintlify) | P0 | 🔴 L | Subdomain `docs.weecommerce.web.id` |
| Client onboarding guides | P1 | 🟡 M | Per-tier onboarding checklist |
| Technical docs (API, integrations) | P1 | 🟡 M | For client dev teams |
| Video tutorials | P2 | 🔴 L | R2-hosted, HLS streaming |

### 4.3 Case Study Engine

| Feature | Priority | Effort | Notes |
|---|---|---|---|
| Structured case study template | P0 | 🟢 S | Challenge/Solution/Results/Tech |
| Results metrics dashboard | P1 | 🟡 M | Animated counters, before/after |
| Client testimonial collection | P1 | 🟢 S | Post-project form |
| Public case study showcase | P0 | 🟢 S | Expanded from MVP portfolio |

### 4.4 International Activation

| Feature | Priority | Effort | Notes |
|---|---|---|---|
| LinkedIn content engine (EN) | P0 | 🟡 M | Brand Blueprint §E international phase |
| Cold email sequence | P1 | 🟡 M | Outreach templates |
| Case study localization (top 3) | P1 | 🟢 S | Translate to EN (i18n infra siap dari MVP) |
| International pricing page emphasis | P0 | 🟢 S | USD-primary variant, geo-detect |
| Wise/Payoneer payment flow | P0 | 🟢 S | For international invoices |

### 4.5 Analytics & Insights

| Feature | Priority | Effort | Notes |
|---|---|---|---|
| Conversion funnel dashboard | P1 | 🟡 M | |
| Blog reading analytics | P2 | 🟢 S | scroll depth tracking |
| Brand mention tracking (AI engines) | P2 | 🟡 M | Track ChatGPT/Perplexity mentions |

### 4.6 Phase 2 Success Criteria

- [ ] Client portal live, klien bisa track project.
- [ ] Documentation site published.
- [ ] 5+ published case studies (real client results).
- [ ] LinkedIn EN content cadence 3x/week.
- [ ] **1 international project closing** (Brand Blueprint §E international goal).

---

## 5. Phase 3: Scale & Extract

**Goal:** Architecture evolution untuk handle scale + operational efficiency.

**Timeline:** Bulan 6+.
**Trigger:** Lihat [§7 Triggers](#7-triggers-for-architecture-evolution).

### 5.1 Architecture Evolution

| Task | Priority | Effort | Trigger |
|---|---|---|---|
| Extract search-service from Hono | P2 | 🔴 L | Search load > 20% CPU |
| Extract notification-service | P2 | 🔴 L | Email queue > 1000/day |
| Managed PostgreSQL (Neon/Supabase) | P2 | 🔴 L | DB maintenance bottleneck |
| Multi-region deploy | P3 | 🔴 L | International traffic > 50% |
| Redis Cluster | P3 | 🔴 L | Cache hit rate < 80% |
| CDN image transformation service | P2 | 🟡 M | R2 transform limits hit |

### 5.2 Advanced Features

| Feature | Priority | Effort | Notes |
|---|---|---|---|
| AI chatbot on website (RAG over docs) | P1 | 🔴 L | Dogfood WeeCommerce's own stack |
| Personalization engine | P2 | 🔴 L | Locale/industry-based hero variants |
| Community forum (Discourse) | P3 | 🔴 L | Subdomain `community.weecommerce.web.id` |
| Affiliate/partner program | P3 | 🔴 L | |
| Public API v2 (GraphQL) | P3 | 🔴 L | For partner integrations |

### 5.3 Operational Maturity

| Task | Priority | Effort | Notes |
|---|---|---|---|
| E2E test suite (Playwright, full coverage) | P1 | 🟡 M | Critical user journeys |
| Load testing (k6) | P2 | 🟡 M | Pre-scale validation |
| Status page (public) | P1 | 🟢 S | `status.weecommerce.web.id` |
| On-call rotation | P3 | 🟡 M | If team grows |
| SOC 2 compliance (if enterprise) | P3 | 🔴 L | |

### 5.4 Phase 3 Success Criteria

- [ ] Architecture scalable horizontal (if needed).
- [ ] E2E test coverage critical flows.
- [ ] **Retainer base sustainable** (Brand Blueprint goal).
- [ ] Evaluate rebrand trigger (Brand Blueprint §A).

---

## 6. Out of Scope (Deprioritized)

Hal-hal yang **sengaja tidak dikerjakan** kecuali ada demand aktual:

| Item | Why Deferred |
|---|---|
| **Fine-tuning offering** | Biaya compute unpredictable. Brand Blueprint §C: "Selalu custom quote setelah data audit." Hanya kalau ada enterprise demand. |
| **Payment gateway di own site** | WeeCommerce jual services, bukan products. Invoices manual cukup. |
| **Real-time live chat** | WhatsApp CTA + AI chatbot (Phase 3) cukup. Live chat butuh CS capacity. |
| **Mobile app** | Website mobile-first responsive cukup. Native app = overhead tanpa ROI clear. |
| **Marketplace template** | WeeCommerce positioning: custom, bukan template. Template shop bertentangan dengan brand. |
| **Branding/graphic design service** | WeeCommerce specialist e-commerce. Brand Blueprint §B: "We don't do branding, social media, or graphic design." |
| **Multiple theme variants** | Satu brand identity. Variants dilute brand. |
| **WordPress integration** | Stack modern (Next.js + Supabase). WP bukan target market. |
| **White-label agency** | WeeCommerce brand sendiri. White-label konflik dengan brand building. |

---

## 7. Triggers for Architecture Evolution

Kapan harus pindah dari streamlined 5-container ke arsitektur yang lebih kompleks:

### 7.1 Vertical Scale

```
Trigger: CPU usage > 70% sustained ATAU memory pressure (> 80%)
Action: Upgrade VPS (2GB → 4GB, 1 vCPU → 2 vCPU)
Cost: $3–8/mo → $6–12/mo
```

### 7.2 Horizontal Scale

```
Trigger: Hono API response time > 1s p95 ATAU Next.js render queue
Action: docker-compose scale nextjs=2 hono=2 (load balanced via Nginx)
Cost: Same VPS, more containers
```

### 7.3 Managed Services

```
Trigger: Database maintenance jadi bottleneck ATAU butuh HA
Action: Pindah PostgreSQL ke managed (Neon free tier, Supabase, atau Cloudflare D1)
Cost: $0–25/mo depending on provider
```

### 7.4 Microservices Extraction

```
Trigger:
- Team growth (> 1 developer)
- Service-specific scaling needs (search heavy, email heavy)
- Deployment frequency bottleneck (one monolith = one deploy)

Action: Extract services satu per satu (search-service dulu, lalu notification-service)
Architecture: 5 container → 7–8 container
```

### 7.5 Multi-Region

```
Trigger: International traffic > 50% ATAU latency issues di region tertentu
Action: Multi-region deploy (VPS di US + Asia, atau Cloudflare Workers edge)
Cost: Significant ($50+/mo)
```

### 7.6 Decision Matrix

| Symptom | Solution | Phase |
|---|---|---|
| Slow page load | Optimize Next.js (image, font, code split) | MVP |
| High CPU | Vertical scale (bigger VPS) | MVP / Phase 2 |
| API slow | Add Redis cache, optimize queries | MVP |
| DB slow | Add indexes, analyze EXPLAIN | MVP |
| DB maintenance pain | Managed PostgreSQL | Phase 3 |
| Deploy bottleneck | Extract microservices | Phase 3 |
| Team > 1 | Split repo per service | Phase 3 |

---

## 8. Feature Flag Strategy

Semua feature baru shipped behind flag, di-enable gradual.

### 8.1 Why Feature Flags

- **Decouple deploy dari release.** Code bisa deploy tanpa activate.
- **A/B testing.**
- **Kill switch** kalau feature causing issues.
- **Dark launch** (deploy, test di prod dengan traffic 0%, lalu ramp up).

### 8.2 Implementation

```typescript
// apps/api/src/lib/flags.ts
type Flag = 'client_portal' | 'docs_site' | 'ai_chatbot' | 'community';

const FLAGS: Record<Flag, boolean> = {
  client_portal: process.env.ENABLE_CLIENT_PORTAL === 'true',
  docs_site: process.env.ENABLE_DOCS === 'true',
  ai_chatbot: process.env.ENABLE_AI_CHATBOT === 'true',
  community: process.env.ENABLE_COMMUNITY === 'true',
};

export function isEnabled(flag: Flag): boolean {
  return FLAGS[flag] ?? false;
}
```

### 8.3 Flag Lifecycle

1. **Off (default)** — code shipped but not active.
2. **Internal** — enabled via env var for testing.
3. **Percentage rollout** — enable for X% of traffic (via cookie or random).
4. **Full** — enabled for everyone.
5. **Cleanup** — remove flag + dead code once stable.

---

## 9. KPIs per Phase

### 9.1 Phase 1 (MVP — 90 hari post-launch)

| KPI | Target | Tool |
|---|---|---|
| Lighthouse (perf/seo/a11y) | ≥ 95 | PageSpeed Insights |
| Core Web Vitals | All green | Search Console |
| Discovery calls / minggu | ≥ 1 | Manual count |
| Organic visitors / bulan | 200+ (start) | Plausible |
| Form submissions / bulan | 15+ | Plausible goal |
| Newsletter subscribers | 50+ | Resend |
| Blog posts published | 12+ (3/minggu cadence) | Manual |
| Admin dashboard adoption | 100% content via UI | Audit log |
| **Project closing** | **2 dalam 90 hari** | Manual |
| Uptime | 99.5% | UptimeRobot |

### 9.2 Phase 2 (Bulan 4–6)

| KPI | Target |
|---|---|
| Organic visitors / bulan | 1,000+ |
| Form submissions / bulan | 50+ |
| Newsletter subscribers | 300+ |
| Published case studies | 5+ |
| LinkedIn EN followers | 500+ |
| Client portal active users | 3+ (clients) |
| **International project closing** | **1** |

### 9.3 Phase 3 (Bulan 6+)

| KPI | Target |
|---|---|
| Organic visitors / bulan | 2,000+ |
| Retainer clients | 3+ |
| International revenue % | 30%+ |
| Domain authority | 20+ (Ahrefs) |
| Rebrand evaluation | Done (Brand Blueprint §A trigger check) |

---

## Summary

Roadmap ini provide:

- ✅ **MVP combines foundational capability** — public site + admin dashboard + i18n + newsletter in one build cycle.
- ✅ **Phase 2 clear** — client portal, KB, case studies, international activation.
- ✅ **Phase 3 clear** — architecture evolution (microservices, managed DB, multi-region).
- ✅ **Triggers for evolution** — kapan upgrade VPS, kapan extract microservices.
- ✅ **Out of scope explicit** — fine-tuning, payment gateway, dll.
- ✅ **Feature flag strategy** — decouple deploy dari release.
- ✅ **KPIs per phase** — measurable targets aligned dengan Brand Blueprint goals.
- ✅ **Aligned dengan Brand Blueprint** — Indonesia-primary, discovery call/minggu sebagai goal utama.

**Next:** [CONTRIBUTING.md](./CONTRIBUTING.md) untuk development guidelines + component workflow.
