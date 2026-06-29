# WeeCommerce Documentation

**Version:** 1.0 · **Last Updated:** Juni 2026
**Project:** WeeCommerce Company Profile Website
**Domain:** weecommerce.web.id

Documentation index + cross-reference map for the WeeCommerce company profile website — a high-performance, AI-optimized (GEO) lead generation engine built on Next.js 14 + Hono + PostgreSQL, deployed as 5 Docker containers on a budget VPS.

---

## 📚 Documentation Index

### Strategy & Scope

| # | Document | What's Inside | Read When |
|---|---|---|---|
| 1 | [**PRD.md**](./PRD.md) | Product overview, goals, success metrics, scope, functional/non-functional requirements, acceptance criteria | You want to understand WHAT we're building and WHY |
| 2 | [**ROADMAP.md**](./ROADMAP.md) | MVP vs Phase 2–4 plan, triggers for architecture evolution, KPIs per phase | You want to know WHEN features ship |

### Technical Design

| # | Document | What's Inside | Read When |
|---|---|---|---|
| 3 | [**ARCHITECTURE.md**](./ARCHITECTURE.md) | 5-container system design, Docker Compose, Nginx config, data flow, caching, rate limiting, scaling path | You want to understand HOW the system works |
| 4 | [**DATABASE.md**](./DATABASE.md) | PostgreSQL schema (16 tables), migrations, seed data, full-text search, backup/restore | You're writing queries or adding tables |
| 5 | [**API.md**](./API.md) | Hono REST API spec — content endpoints, contact form, SEO/GEO endpoints, public AI API, webhooks | You're building/consuming the API |
| 6 | [**DESIGN.md**](./DESIGN.md) | Design system — Framer-inspired dark canvas adapted to WeeCommerce teal brand, Hero + bento pricing integration | You're building UI components |

### Quality & Operations

| # | Document | What's Inside | Read When |
|---|---|---|---|
| 7 | [**SEO.md**](./SEO.md) | Technical SEO + GEO (Generative Engine Optimization), JSON-LD templates, llms.txt content, keyword targets | You're optimizing for Google + AI engines |
| 8 | [**SECURITY.md**](./SECURITY.md) | Threat model, security headers, CSP, OWASP Top 10 mapping, GDPR, incident response | You're handling user input, secrets, or auth |
| 9 | [**DEPLOYMENT.md**](./DEPLOYMENT.md) | Docker, Dokploy, CI/CD (GitHub Actions), backups, monitoring, disaster recovery | You're deploying or maintaining prod |
| 10 | [**CONTRIBUTING.md**](./CONTRIBUTING.md) | Project structure, coding standards, git workflow, component registry, testing, checklists | You're contributing code |

### Brand Reference (External)

| Document | Use |
|---|---|
| [WeeCommerce-Brand-Blueprint.txt](../WeeCommerce-Brand-Blueprint.txt) | Strategic brand reference (positioning, ICP, offering, GTM, visual identity direction) |
| [WeeCommerce-Company-Profile.txt](../WeeCommerce-Company-Profile.txt) | External-facing company description, copy reference |

---

## 🎯 Quick Start

**New to the project?** Read in this order:

1. **[PRD.md](./PRD.md)** — Understand what we're building (15 min).
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Understand the system (20 min).
3. **[CONTRIBUTING.md](./CONTRIBUTING.md) §4** — Get your dev environment running (10 min).
4. **[DESIGN.md](./DESIGN.md)** — Understand the visual language (15 min).
5. Pick a task from **[ROADMAP.md](./ROADMAP.md)** Phase 1 and start building.

**Need specific info?** Jump directly:

- Writing a query? → [DATABASE.md](./DATABASE.md)
- Building an API endpoint? → [API.md](./API.md) + [SECURITY.md §5](./SECURITY.md#5-input-validation)
- Building a UI component? → [DESIGN.md](./DESIGN.md) + [CONTRIBUTING.md §7](./CONTRIBUTING.md#7-component-guidelines)
- Adding a blog post? → [SEO.md §5](./SEO.md#5-on-page-seo) + [SEO.md §4](./SEO.md#4-structured-data-json-ld)
- Deploying? → [DEPLOYMENT.md](./DEPLOYMENT.md)
- Got a security concern? → [SECURITY.md](./SECURITY.md)

---

## 🏗️ Canonical Stack (Must Stay Consistent Across All Docs)

Every doc references these constants. If you change one, update everywhere.

| Layer | Choice |
|---|---|
| **Frontend** | Next.js 14+ (App Router, Turbopack, Server Components, SSG/ISR) |
| **UI** | Shadcn/UI (Radix + Tailwind v4) — single UI lib, no HeroUI |
| **Backend API** | Hono (Node 20 runtime, single container, port 4000) |
| **Database** | PostgreSQL 16-alpine |
| **Cache** | Redis 7-alpine |
| **Reverse Proxy** | Nginx alpine |
| **Storage** | Cloudflare R2 (S3-compatible SaaS, $0 egress) |
| **Email** | Resend |
| **Monitoring** | Sentry + UptimeRobot + Plausible (all SaaS) |
| **Spam Protection** | Cloudflare Turnstile |
| **Deploy** | Docker Compose + Dokploy |
| **CI/CD** | GitHub Actions |

**Shared Constants:**

| Constant | Value |
|---|---|
| Domain | `weecommerce.web.id` |
| Email | `hello@weecommerce.web.id` |
| Founder | `Alif Nugraha` |
| Service tiers | `LAUNCH`, `CONVERT`, `SCALE`, `INTEGRATE` |
| Anchor demo | `NexaMart` |
| Tagline | `E-Commerce Systems, Powered by AI` |
| Ports (internal) | nginx 80/443, nextjs 3000, hono 4000, postgres 5432, redis 6379 |
| API base | `/api/v1` |
| Public AI API | `/api/v1/public/*` |
| GEO files | `/llms.txt`, `/llms-full.txt`, `/ai-sitemap.xml`, `/robots.txt`, `/sitemap.xml`, `/feed.xml` |

**Design Constants:**

| Token | Value |
|---|---|
| Accent (teal) | `#2DD4BF` |
| Accent dim | `#0D9488` |
| Canvas (dark) | `#09090B` |
| Surface 1 | `#111113` |
| Surface 2 | `#1A1A1D` |
| Text | `#FAFAFA` |
| Muted | `#A1A1AA` |
| Display font | Space Grotesk (500–700) |
| Body font | Inter Variable (400–500) |
| Mono font | JetBrains Mono (400) |

**Container Count:** 5 (nginx + nextjs + hono + postgres + redis) — fits VPS 2GB.
**Monthly Cost:** ≤ $10 (VPS + Resend free + R2 free + SaaS free tiers).

---

## 🔗 Cross-Reference Map

How documents reference each other:

```
                    ┌──────────┐
                    │  PRD.md  │ ← foundation (scope, goals)
                    └────┬─────┘
            ┌────────────┼────────────┐
            ▼            ▼            ▼
      ┌──────────┐ ┌──────────┐ ┌──────────┐
      │ ARCHTECT │ │ ROADMAP  │ │  DESIGN  │
      │   .md    │ │   .md    │ │   .md    │
      └────┬─────┘ └────┬─────┘ └────┬─────┘
           │            │            │
    ┌──────┼──────┬─────┘     ┌──────┘
    ▼      ▼      ▼           ▼
 ┌─────┐┌─────┐┌────────┐┌────────┐
 │ API ││ DB  ││SECURITY││CONTRIB │
 │ .md ││.md  ││  .md   ││  .md   │
 └──┬──┘└──┬──┘└────┬───┘└────────┘
    │      │        │
    └──────┴─────── ┴─────→ DEPLOYMENT.md
                            SEO.md
```

| From | References To |
|---|---|
| **PRD.md** | → ARCHITECTURE.md §7, DATABASE.md §8, SEO.md §9, SECURITY.md §11, DEPLOYMENT.md §12 |
| **ARCHITECTURE.md** | → DATABASE.md (schema), API.md (endpoints), DEPLOYMENT.md (Docker), SECURITY.md (headers) |
| **DATABASE.md** | → API.md (query endpoints), DEPLOYMENT.md §9 (backup) |
| **API.md** | → SEO.md (public AI API, sitemap), SECURITY.md (rate limit, validation) |
| **SEO.md** | → API.md §5–7 (sitemap/rss/public endpoints), SECURITY.md §4 (CSP) |
| **SECURITY.md** | → ARCHITECTURE.md (Nginx config), DEPLOYMENT.md (secrets), API.md (validation) |
| **DEPLOYMENT.md** | → ARCHITECTURE.md (containers), SECURITY.md (secrets), DATABASE.md (backup) |
| **DESIGN.md** | → PRD.md (UI reqs), CONTRIBUTING.md (component workflow), SECURITY.md (CSP) |
| **ROADMAP.md** | → all docs (MVP scope) |
| **CONTRIBUTING.md** | → ARCHITECTURE.md, DEPLOYMENT.md, DESIGN.md, SEO.md |

---

## ✅ Project Status

| Phase | Status | Target |
|---|---|---|
| **Phase 0 — Foundation** (docs, design) | ✅ Complete (this release) | Juni 2026 |
| **Phase 1 — MVP Combined** (public site + admin + i18n + newsletter) | 🚧 Ready to build | 8–12 minggu |
| **Phase 2 — Engage** (client portal, KB, case studies, international) | ⏳ Planned | Bulan 4–6 |
| **Phase 3 — Scale** (microservices extraction, managed DB, advanced) | ⏳ Planned | Bulan 6+ |

Detail: [ROADMAP.md](./ROADMAP.md).

Detail: [ROADMAP.md](./ROADMAP.md).

---

## 📋 Definition of Done (MVP)

The MVP is "jualan-ready" when ALL of these pass:

### Functional
- [ ] 10 halaman live, no broken links.
- [ ] Contact form: validates, sends email + auto-reply, triggers webhook.
- [ ] Portfolio filtering works (tech/industry/tier).
- [ ] Blog search returns results.
- [ ] Dark/light mode toggle persistent.
- [ ] WhatsApp CTA on all relevant pages.

### Performance
- [ ] Lighthouse Performance ≥ 95.
- [ ] Lighthouse SEO ≥ 95.
- [ ] Lighthouse Accessibility ≥ 95.
- [ ] Core Web Vitals all green (LCP < 2.5s, CLS < 0.1, INP < 200ms).
- [ ] TTFB < 200ms.
- [ ] Initial JS < 200KB gzipped.

### SEO + GEO
- [ ] `robots.txt` allows Google + AI crawlers.
- [ ] `sitemap.xml` includes all pages + images.
- [ ] Unique meta title + description per page.
- [ ] JSON-LD validates (Rich Results Test 0 errors).
- [ ] `/llms.txt` + `/llms-full.txt` + `/ai-sitemap.xml` accessible.
- [ ] Public AI API (`/api/v1/public/*`) returns JSON.
- [ ] Markdown export endpoint works.
- [ ] AI citation metadata tags present.

### Security
- [ ] HTTPS only (HTTP → 301).
- [ ] Security headers (HSTS, CSP, X-Frame-Options) present.
- [ ] Rate limiting active (contact form, API).
- [ ] Cloudflare Turnstile on contact form.
- [ ] No secrets in code/logs.
- [ ] SQL injection prevention (parameterized queries).

### Ops
- [ ] 5 containers running via Docker Compose.
- [ ] Deployable via Dokploy (one-click).
- [ ] Health checks working per service.
- [ ] CI/CD pipeline green (GitHub Actions).
- [ ] Daily DB backup to R2 running.
- [ ] Sentry + UptimeRobot + Plausible configured.

### Business
- [ ] **1 discovery call per minggu** (Brand Blueprint §E Phase 1 goal).
- [ ] **2 project closing dalam 90 hari** (Brand Blueprint §E Phase 1 goal).

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Local dev setup.
- Coding standards.
- Git workflow + PR template.
- Component registry integration (Shadcn/UI + 21st.dev).
- Testing strategy.
- Accessibility + SEO + performance checklists.

---

## 📄 License

Proprietary — internal use only. WeeCommerce © 2026 Alif Nugraha.

---

*WeeCommerce — E-Commerce Systems, Powered by AI.*
