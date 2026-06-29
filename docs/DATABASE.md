# WeeCommerce Database — Schema & Migrations

**Version:** 1.0
**Database:** PostgreSQL 16 (Alpine)
**Container:** `weecommerce-postgres` (single instance)
**Persistence:** Docker volume `postgres-data`

> Berkaitan: [ARCHITECTURE.md](./ARCHITECTURE.md) · [API.md](./API.md) · [DEPLOYMENT.md](./DEPLOYMENT.md) (backup) · [SECURITY.md](./SECURITY.md) (DB hardening)

---

## Table of Contents

1. [Overview](#1-overview)
2. [ER Diagram](#2-er-diagram)
3. [Schema Definitions](#3-schema-definitions)
4. [Indexes & Constraints](#4-indexes--constraints)
5. [Full-Text Search](#5-full-text-search)
6. [Seed Data](#6-seed-data)
7. [Migration Strategy](#7-migration-strategy)
8. [Backup & Restore](#8-backup--restore)
9. [Data Retention Policy](#9-data-retention-policy)
10. [Performance Tuning](#10-performance-tuning)

---

## 1. Overview

### 1.1 Database Choice

- **Engine:** PostgreSQL 16.
- **Why not SQLite:** Multi-container setup (Hono + future admin), need network-accessible DB, concurrent writes from form submissions.
- **Why not managed DB (MVP):** Budget. Single VPS dengan container PostgreSQL cukup. Managed DB (Neon, Supabase) adalah Phase 3 Scale [ROADMAP.md](./ROADMAP.md).

### 1.2 Conventions

| Aspect | Convention |
|---|---|
| Table names | `snake_case`, plural (`posts`, `form_submissions`) |
| Column names | `snake_case` (`created_at`, `published_at`) |
| Primary keys | `id UUID DEFAULT gen_random_uuid()` |
| Timestamps | `TIMESTAMPTZ` (always store UTC) |
| Boolean | `BOOLEAN` (not `INT`) |
| JSON | `JSONB` (not `JSON`) untuk indexable document columns |
| Arrays | `TEXT[]` untuk simple tag lists |
| Enums | PostgreSQL `ENUM` type for fixed-set statuses |
| Foreign keys | `REFERENCES` dengan `ON DELETE` policy explicit |
| Soft delete | `deleted_at TIMESTAMPTZ` (nullable) untuk content tables |

### 1.3 Required Extensions

```sql
-- Run as superuser on init
CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";     -- uuid_generate_v4() (fallback)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- trigram search (fallback if no FTS index)
```

---

## 2. ER Diagram

```
┌─────────────┐         ┌──────────────┐         ┌──────────┐
│ categories  │1───────*│ posts        │*───────*│ tags     │
│             │         │              │         │          │
└─────────────┘         └──────┬───────┘         └──────────┘
                               │
                               │ (author ref)
                               ▼
                        ┌──────────────┐
                        │ team_members │
                        └──────────────┘
                               ▲
                               │
┌──────────────┐         ┌─────┴────────┐         ┌──────────────────┐
│ case_studies │*───────*│              │         │ services         │
└──────┬───────┘         │ (separate)   │         │   │              │
       │                 └──────────────┘         │   ▼              │
       │                                          │ service_features │
       │ (results JSONB)                          └──────────────────┘
       ▼
┌──────────────────┐    ┌──────────────┐    ┌──────────────────────┐
│ case_study_      │    │ faq          │    │ pages                │
│  results         │    │              │    │ (static: about, etc) │
└──────────────────┘    └──────────────┘    └──────────────────────┘

┌──────────────┐    ┌──────────────────────┐    ┌────────────────────┐
│ media_files  │    │ form_submissions     │    │ newsletter_        │
│ (R2 refs)    │    │                      │    │  subscribers       │
└──────────────┘    └──────────────────────┘    └────────────────────┘

┌──────────────┐    ┌──────────────────────┐    ┌────────────────────┐
│ seo_metadata │    │ redirects            │    │ audit_logs         │
└──────────────┘    └──────────────────────┘    └────────────────────┘

┌──────────────────────┐
│ submission_logs      │
│ (webhook/email trail)│
└──────────────────────┘
```

---

## 3. Schema Definitions

### 3.1 Content Tables

#### `categories`

```sql
CREATE TABLE categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  slug         VARCHAR(100) UNIQUE NOT NULL,
  description  TEXT,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
```

#### `tags`

```sql
CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(50) NOT NULL,
  slug       VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tags_slug ON tags(slug);
```

#### `team_members`

```sql
CREATE TABLE team_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(100) NOT NULL,
  slug            VARCHAR(100) UNIQUE NOT NULL,
  role            VARCHAR(100) NOT NULL,
  bio             TEXT,
  photo_key       VARCHAR(255),        -- R2 object key
  photo_alt       VARCHAR(200),
  email           VARCHAR(255),
  linkedin_url    VARCHAR(500),
  github_url      VARCHAR(500),
  x_url           VARCHAR(500),
  website_url     VARCHAR(500),
  sort_order      INT DEFAULT 0,
  is_published    BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_members_slug ON team_members(slug);
CREATE INDEX idx_team_members_published ON team_members(is_published, sort_order);
```

#### `posts`

```sql
CREATE TABLE posts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                VARCHAR(255) NOT NULL,
  slug                 VARCHAR(255) UNIQUE NOT NULL,
  excerpt              VARCHAR(500),
  content              TEXT NOT NULL,           -- markdown or MDX source
  content_html         TEXT,                    -- pre-rendered HTML cache
  author_id            UUID REFERENCES team_members(id) ON DELETE SET NULL,
  category_id          UUID REFERENCES categories(id) ON DELETE SET NULL,
  featured_image_key   VARCHAR(255),            -- R2 object key
  featured_image_alt   VARCHAR(200),
  status               VARCHAR(20) DEFAULT 'draft'
                       CHECK (status IN ('draft', 'published', 'archived')),
  published_at         TIMESTAMPTZ,
  read_time_minutes    INT,
  word_count           INT,
  views                INT DEFAULT 0,

  -- SEO
  meta_title           VARCHAR(60),
  meta_description     VARCHAR(160),
  og_image_key         VARCHAR(255),
  canonical_url        VARCHAR(500),

  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status_published ON posts(status, published_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_category ON posts(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_author ON posts(author_id);
-- Full-text search index (see §5)
```

#### `posts_to_tags` (many-to-many)

```sql
CREATE TABLE posts_to_tags (
  post_id  UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id   UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_ptt_tag ON posts_to_tags(tag_id);
```

#### `case_studies`

```sql
CREATE TABLE case_studies (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                VARCHAR(255) NOT NULL,
  slug                 VARCHAR(255) UNIQUE NOT NULL,
  client_name          VARCHAR(100),
  is_confidential      BOOLEAN DEFAULT FALSE,
  summary              TEXT NOT NULL,
  challenge            TEXT,
  solution             TEXT,
  technologies         TEXT[] DEFAULT '{}',  -- e.g., {Next.js, Supabase, n8n}
  industry             VARCHAR(100),
  service_tier         VARCHAR(20)
                       CHECK (service_tier IN ('launch', 'convert', 'scale', 'integrate')),
  project_link         VARCHAR(500),
  start_date           DATE,
  end_date             DATE,
  duration_weeks       INT,

  featured_image_key   VARCHAR(255),
  featured_image_alt   VARCHAR(200),
  gallery_keys         JSONB DEFAULT '[]',  -- [{key, alt}, ...]

  status               VARCHAR(20) DEFAULT 'published'
                       CHECK (status IN ('draft', 'published', 'archived')),
  published_at         TIMESTAMPTZ DEFAULT NOW(),
  sort_order           INT DEFAULT 0,

  -- SEO
  meta_title           VARCHAR(60),
  meta_description     VARCHAR(160),

  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ
);

CREATE INDEX idx_cs_slug ON case_studies(slug);
CREATE INDEX idx_cs_status_published ON case_studies(status, published_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_cs_technologies ON case_studies USING GIN(technologies);
CREATE INDEX idx_cs_service_tier ON case_studies(service_tier);
CREATE INDEX idx_cs_industry ON case_studies(industry);
```

#### `case_study_results` (key metrics per case study)

```sql
CREATE TABLE case_study_results (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id  UUID REFERENCES case_studies(id) ON DELETE CASCADE,
  metric_label   VARCHAR(100) NOT NULL,   -- e.g., "Revenue increase"
  metric_value   VARCHAR(50) NOT NULL,    -- e.g., "250%"
  sort_order     INT DEFAULT 0
);

CREATE INDEX idx_csr_case_study ON case_study_results(case_study_id, sort_order);
```

#### `services` (4 tiers)

```sql
CREATE TABLE services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(20) UNIQUE NOT NULL
                  CHECK (slug IN ('launch', 'convert', 'scale', 'integrate')),
  name            VARCHAR(50) NOT NULL,           -- "LAUNCH"
  tagline         VARCHAR(200),
  description     TEXT NOT NULL,
  route           VARCHAR(20),                    -- 'A' (build) or 'B' (integrate)
  price_idr_min   INT,                            -- 15000000
  price_idr_max   INT,                            -- 25000000
  price_usd_min   INT,                            -- 2500
  price_usd_max   INT,                            -- 4000
  timeline_weeks_min INT,
  timeline_weeks_max INT,
  is_popular      BOOLEAN DEFAULT FALSE,          -- highlight CONVERT
  sort_order      INT DEFAULT 0,
  is_published    BOOLEAN DEFAULT TRUE,

  -- SEO
  meta_title        VARCHAR(60),
  meta_description  VARCHAR(160),

  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_published_sort ON services(is_published, sort_order);
```

#### `service_features` (what's included per tier)

```sql
CREATE TABLE service_features (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  UUID REFERENCES services(id) ON DELETE CASCADE,
  feature     TEXT NOT NULL,
  is_included BOOLEAN DEFAULT TRUE,   -- TRUE = included, FALSE = "not included"
  sort_order  INT DEFAULT 0
);

CREATE INDEX idx_sf_service ON service_features(service_id, sort_order);
```

#### `faq`

```sql
CREATE TABLE faq (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question    VARCHAR(300) NOT NULL,
  answer      TEXT NOT NULL,
  category    VARCHAR(50) DEFAULT 'general',  -- general, services, pricing, process
  service_id  UUID REFERENCES services(id) ON DELETE SET NULL,
  sort_order  INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_faq_category_sort ON faq(category, sort_order) WHERE is_published;
CREATE INDEX idx_faq_service ON faq(service_id);
```

#### `pages` (static page content overrides)

```sql
CREATE TABLE pages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(50) UNIQUE NOT NULL,   -- 'home', 'about', 'process', 'pricing'
  title           VARCHAR(100) NOT NULL,
  hero_headline   VARCHAR(200),
  hero_subheadline TEXT,
  content         TEXT,                          -- markdown
  meta_title      VARCHAR(60),
  meta_description VARCHAR(160),
  og_image_key    VARCHAR(255),
  is_published    BOOLEAN DEFAULT TRUE,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pages_slug ON pages(slug);
```

### 3.2 Media Table

#### `media_files` (R2 object metadata, not blob)

```sql
CREATE TABLE media_files (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  r2_key         VARCHAR(500) UNIQUE NOT NULL,   -- e.g., "blog/2026/06/hero.webp"
  filename       VARCHAR(255) NOT NULL,
  mime_type      VARCHAR(100) NOT NULL,
  size_bytes     BIGINT NOT NULL,
  width          INT,                            -- for images
  height         INT,
  alt_text       VARCHAR(200),
  caption        TEXT,
  uploaded_by    UUID REFERENCES team_members(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_r2_key ON media_files(r2_key);
CREATE INDEX idx_media_mime ON media_files(mime_type);
```

### 3.3 Leads Tables

#### `form_submissions`

```sql
CREATE TABLE form_submissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  company      VARCHAR(255),
  phone        VARCHAR(30),
  message      TEXT NOT NULL,
  source       VARCHAR(50) DEFAULT 'contact_form',  -- contact_form, whatsapp, etc
  ip_address   INET,
  user_agent   TEXT,
  spam_score   DECIMAL(3,2) DEFAULT 0.00,    -- 0.0 clean, 1.0 definite spam
  status       VARCHAR(20) DEFAULT 'new'
               CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'spam', 'archived')),
  service_interest VARCHAR(20),              -- launch, convert, scale, integrate
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  notes        TEXT,                          -- internal admin notes (MVP admin)
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fs_email ON form_submissions(email);
CREATE INDEX idx_fs_status ON form_submissions(status);
CREATE INDEX idx_fs_submitted ON form_submissions(submitted_at DESC);
CREATE INDEX idx_fs_ip ON form_submissions(ip_address);
```

#### `newsletter_subscribers`

```sql
CREATE TABLE newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  name            VARCHAR(255),
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending', 'active', 'unsubscribed', 'bounced')),
  verify_token    VARCHAR(64),                -- for double opt-in
  verified_at     TIMESTAMPTZ,
  unsubscribe_token VARCHAR(64) NOT NULL,
  ip_address      INET,
  source          VARCHAR(50) DEFAULT 'footer_form',
  preferences     JSONB DEFAULT '{"updates": true, "blog": true}',
  subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_ns_email ON newsletter_subscribers(email);
CREATE INDEX idx_ns_status ON newsletter_subscribers(status);
CREATE INDEX idx_ns_unsubscribe_token ON newsletter_subscribers(unsubscribe_token);
CREATE INDEX idx_ns_verify_token ON newsletter_subscribers(verify_token);
```

#### `submission_logs` (audit trail for form → email/webhook)

```sql
CREATE TABLE submission_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id  UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  action         VARCHAR(50) NOT NULL,  -- email_sent, webhook_dispatched, webhook_retry, webhook_failed
  channel        VARCHAR(50),           -- email_admin, email_autoreply, webhook_n8n
  status         VARCHAR(20) NOT NULL,  -- success, failed, retrying
  attempt        INT DEFAULT 1,
  error_message  TEXT,
  metadata       JSONB,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sl_submission ON submission_logs(submission_id, created_at);
CREATE INDEX idx_sl_status ON submission_logs(status);
```

### 3.4 SEO Tables

#### `seo_metadata` (per-page overrides)

```sql
CREATE TABLE seo_metadata (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type       VARCHAR(30) NOT NULL,  -- post, case_study, service, page, category, tag
  page_id         UUID,                  -- FK to relevant table (nullable for dynamic)
  path            VARCHAR(500),          -- URL path (for pages without entity)
  meta_title      VARCHAR(60),
  meta_description VARCHAR(160),
  og_image_key    VARCHAR(255),
  canonical_url   VARCHAR(500),
  json_ld         JSONB,                 -- additional structured data
  robots_index    BOOLEAN DEFAULT TRUE,
  robots_follow   BOOLEAN DEFAULT TRUE,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_type, page_id)
);

CREATE INDEX idx_seo_page ON seo_metadata(page_type, page_id);
CREATE INDEX idx_seo_path ON seo_metadata(path);
```

#### `redirects`

```sql
CREATE TABLE redirects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path     VARCHAR(500) UNIQUE NOT NULL,
  to_url        VARCHAR(500) NOT NULL,
  status_code   INT DEFAULT 301
                CHECK (status_code IN (301, 302, 307, 308)),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_redirects_from ON redirects(from_path) WHERE is_active;
```

### 3.5 Audit Table

#### `audit_logs`

```sql
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID,                       -- team_member_id (admin user) or NULL for system
  actor_email VARCHAR(255),
  action      VARCHAR(50) NOT NULL,       -- create, update, delete, publish, login
  entity_type VARCHAR(50) NOT NULL,       -- post, case_study, service, form_submission
  entity_id   UUID,
  changes     JSONB,                      -- {before: {...}, after: {...}}
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

### 3.6 Updated-At Triggers

Auto-update `updated_at` on row modification (apply to all tables with that column):

```sql
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to each table (repeat pattern)
CREATE TRIGGER set_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON faq
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON form_submissions
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON seo_metadata
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
```

---

## 4. Indexes & Constraints

### 4.1 Hot Query Indexes (Summary)

| Query | Index |
|---|---|
| Get published posts (recent first) | `idx_posts_status_published` (partial, status + published_at DESC) |
| Get post by slug | `idx_posts_slug` (UNIQUE) |
| Filter posts by category | `idx_posts_category` (partial) |
| Filter case studies by tech | `idx_cs_technologies` (GIN) |
| Filter case studies by tier | `idx_cs_service_tier` |
| Service by slug | `idx_services_slug` (UNIQUE) |
| Form submission by email | `idx_fs_email` |
| Form submission status workflow | `idx_fs_status` |

### 4.2 Constraints Summary

- All `slug` columns UNIQUE + indexed.
- All status columns CHECK-constrained to allowed values.
- Foreign keys with explicit `ON DELETE` (CASCADE for children, SET NULL for optional refs).
- Soft-delete (`deleted_at`) on content tables with partial indexes.

---

## 5. Full-Text Search

Blog/portfolio search menggunakan PostgreSQL built-in full-text search (no Elasticsearch needed for MVP).

### 5.1 Add Search Vector Column

```sql
-- Add tsvector column to posts
ALTER TABLE posts ADD COLUMN search_vector tsvector;

-- Populate from title + excerpt + content
UPDATE posts SET search_vector =
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(content, '')), 'C');

-- GIN index for fast search
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Trigger to keep search_vector updated
CREATE OR REPLACE FUNCTION posts_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_search_vector_trigger
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION posts_search_vector_update();
```

### 5.2 Search Query

```sql
-- Search blog posts (used by /api/v1/posts/search)
SELECT id, title, slug, excerpt, published_at,
       ts_rank(search_vector, query) AS relevance
FROM posts, plainto_tsquery('english', $1) query
WHERE status = 'published'
  AND deleted_at IS NULL
  AND search_vector @@ query
ORDER BY relevance DESC, published_at DESC
LIMIT 20;
```

### 5.3 Case Study Search (similar pattern)

```sql
ALTER TABLE case_studies ADD COLUMN search_vector tsvector;

UPDATE case_studies SET search_vector =
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(solution, '')), 'C') ||
  setweight(to_tsvector('english', coalesce(array_to_string(technologies, ' '), '')), 'B');

CREATE INDEX idx_cs_search ON case_studies USING GIN(search_vector);

-- Trigger (same pattern as posts)
```

---

## 6. Seed Data

Seed file: `db/init/0002_seed.sql`. Run on fresh DB to populate WeeCommerce's actual content.

### 6.1 Team Member (Founder)

```sql
INSERT INTO team_members (name, slug, role, bio, email, website_url, sort_order)
VALUES (
  'Alif Nugraha',
  'alif-nugraha',
  'Founder, WeeCommerce',
  'Alif Nugraha is the founder of WeeCommerce, a specialist agency building AI-powered e-commerce systems. He focuses on the intersection of custom development, AI integration, and business automation — helping brands migrate off marketplace dependency and own their platform.',
  'hello@weecommerce.web.id',
  'https://weecommerce.web.id',
  0
);
```

### 6.2 Service Tiers (4 tiers per Brand Blueprint)

```sql
INSERT INTO services (slug, name, tagline, description, route, price_idr_min, price_idr_max, price_usd_min, price_usd_max, timeline_weeks_min, timeline_weeks_max, is_popular, sort_order) VALUES
('launch', 'LAUNCH',
 'Punya platform sendiri. Berhenti numpang di marketplace orang.',
 'Custom e-commerce storefront built with Next.js and Supabase. Product catalog, cart, multi-step checkout, payment gateway integration (Midtrans / Stripe), shipping integration, admin dashboard, mobile responsive, basic SEO. AI layer: not included.',
 'A', 15000000, 25000000, 2500, 4000, 4, 6, FALSE, 1),

('convert', 'CONVERT',
 'Toko lo jalan. Sekarang biarin AI yang kerja keras.',
 'Everything in LAUNCH, plus: AI Customer Service Chatbot trained on your products & FAQ, RAG Knowledge Base for dynamic product Q&A, Basic n8n Automation (order notifications, follow-up, low stock alerts).',
 'A', 38000000, 55000000, 6000, 9000, 7, 10, TRUE, 2),

('scale', 'SCALE',
 'Sistem yang tumbuh bareng bisnis lo — tanpa nambah orang.',
 'Everything in CONVERT, plus: Advanced n8n Suite (CRM sync, abandoned cart, post-purchase email, inventory automation), AI Analytics Dashboard, multi-channel integration (WhatsApp Business API), performance optimization (Core Web Vitals, caching).',
 'A', 70000000, 120000000, 11000, 20000, 10, 16, FALSE, 3),

('integrate', 'INTEGRATE',
 'AI & automation for your existing store.',
 'For brands that already have a Shopify or custom platform. Add the AI intelligence layer without rebuilding everything. Modules: AI Chatbot, RAG System, n8n Automation, or the full bundled AI Suite.',
 'B', 8000000, 40000000, 1200, 6500, 2, 8, FALSE, 4);
```

### 6.3 Service Features

```sql
-- LAUNCH features
INSERT INTO service_features (service_id, feature, is_included, sort_order)
SELECT id, feat, inc, ord FROM services, (VALUES
  ('Custom storefront (Next.js + Supabase)', TRUE, 1),
  ('Product catalog, cart, checkout', TRUE, 2),
  ('Payment gateway (Midtrans / Stripe)', TRUE, 3),
  ('Shipping integration', TRUE, 4),
  ('Admin dashboard', TRUE, 5),
  ('Mobile responsive', TRUE, 6),
  ('Basic SEO setup', TRUE, 7),
  ('AI Chatbot', FALSE, 8),
  ('RAG Knowledge Base', FALSE, 9),
  ('n8n Automation', FALSE, 10)
) AS v(feat, inc, ord)
WHERE slug = 'launch';

-- CONVERT features (everything in LAUNCH + AI layer)
INSERT INTO service_features (service_id, feature, is_included, sort_order)
SELECT id, feat, inc, ord FROM services, (VALUES
  ('Everything in LAUNCH', TRUE, 1),
  ('AI Customer Service Chatbot', TRUE, 2),
  ('RAG Knowledge Base', TRUE, 3),
  ('Basic n8n Automation (order, follow-up, low stock)', TRUE, 4),
  ('Advanced n8n Suite (CRM, abandoned cart)', FALSE, 5),
  ('AI Analytics Dashboard', FALSE, 6),
  ('Multi-channel (WhatsApp Business API)', FALSE, 7)
) AS v(feat, inc, ord)
WHERE slug = 'convert';

-- SCALE features (full system)
INSERT INTO service_features (service_id, feature, is_included, sort_order)
SELECT id, feat, inc, ord FROM services, (VALUES
  ('Everything in CONVERT', TRUE, 1),
  ('Advanced n8n Suite (CRM sync, abandoned cart, post-purchase)', TRUE, 2),
  ('AI Analytics Dashboard', TRUE, 3),
  ('Multi-channel (WhatsApp Business API, email)', TRUE, 4),
  ('Performance optimization (Core Web Vitals, caching)', TRUE, 5)
) AS v(feat, inc, ord)
WHERE slug = 'scale';

-- INTEGRATE features (modular)
INSERT INTO service_features (service_id, feature, is_included, sort_order)
SELECT id, feat, inc, ord FROM services, (VALUES
  ('AI Chatbot module (Rp 8–15jt / $1,200–$2,500)', TRUE, 1),
  ('RAG System module (Rp 10–18jt / $1,500–$3,000)', TRUE, 2),
  ('n8n Automation module (Rp 8–15jt / $1,200–$2,500)', TRUE, 3),
  ('Full AI Suite bundle (Rp 22–40jt / $3,500–$6,500)', TRUE, 4),
  ('Rebuild existing store', FALSE, 5)
) AS v(feat, inc, ord)
WHERE slug = 'integrate';
```

### 6.4 Initial FAQ

```sql
INSERT INTO faq (question, answer, category, sort_order) VALUES
('Apakah WeeCommerce hanya melayani Indonesia?',
 'Untuk Phase 1, kami fokus melayani brand lokal Indonesia (IDR pricing, komunikasi via WhatsApp/Threads). Layanan internasional (USD pricing, English) tersedia mulai bulan ke-6. Hubungi kami untuk diskusi.',
 'general', 1),

('Berapa lama waktu pengerjaan project?',
 'Bervariasi sesuai tier: LAUNCH 4–6 minggu, CONVERT 7–10 minggu, SCALE 10–16 minggu. Untuk modul INTEGRATE, timeline 2–8 minggu tergantung scope. Timeline final ditentukan setelah discovery call.',
 'process', 2),

('Apakah AI fine-tuning termasuk dalam paket?',
 'Tidak. Fine-tuning tidak masuk tier manapun karena biaya compute-nya tidak predictable. Fine-tuning selalu custom quote setelah data audit. Untuk kebanyakan use case, RAG dan prompt engineering sudah cukup.',
 'services', 3),

('Siapa pemilik source code setelah project selesai?',
 'Anda. Source code ownership ditransfer setelah pelunasan. Anda menerima dokumentasi lengkap (code, API integrations, workflow guides).',
 'services', 4),

('Apakah biaya API dan hosting termasuk?',
 'Tidak. Biaya third-party (OpenAI, hosting, domain, Midtrans/Stripe fee) ditanggung klien. Kami yang configure, tapi klien setup akun sendiri. Tidak ada markup dari kami.',
 'pricing', 5),

('Bagaimana sistem pembayaran?',
 'Milestone-based: 50% DP setelah SPK ditandatangani, 30% saat staging delivery (preview approve), 20% sebelum go-live. Internasional: pembayaran via Wise atau Payoneer dalam USD.',
 'pricing', 6),

('Apakah bisa lihat portfolio atau demo?',
 'Ya. NexaMart adalah flagship demo project kami — platform e-commerce AI-powered yang fully functional. Kami walk through setiap prospect lewat NexaMart sebelum menulis proposal. Request demo via halaman Contact.',
 'services', 7),

('Apa beda WeeCommerce dengan agency lain?',
 'Kami specialist e-commerce, bukan generalist. Tidak mengerjakan branding, social media, atau design grafis. Fokus tunggal: e-commerce systems + AI integration + automation. End-to-end ownership, satu PIC sepanjang project.',
 'general', 8),

('Bisakah upgrade dari LAUNCH ke CONVERT nanti?',
 'Bisa. Arsitektur kami modular — LAUNCH dibangun dengan asumsi AI layer akan ditambahkan kemudian. Upgrade path jelas tanpa rebuild from scratch.',
 'services', 9),

('Apakah ada maintenance setelah launch?',
 'Ya. Retainer Basic (Rp 2–3jt/bln, bug fixes + monthly report) atau Advanced (Rp 4–6jt/bln, + AI re-training + n8n maintenance + 24h response). 30 hari post-launch support untuk bug fixes selalu included.',
 'pricing', 10);
```

### 6.5 Pages (Static Content Slots)

```sql
INSERT INTO pages (slug, title, hero_headline, hero_subheadline, meta_title, meta_description) VALUES
('home', 'Home',
 'We build e-commerce systems, not websites.',
 'Specialist agency at the intersection of custom development, AI, and business automation. Built to scale.',
 'WeeCommerce — AI-Powered E-Commerce Systems',
 'WeeCommerce builds custom e-commerce systems with AI chatbot, RAG, and n8n automation. Migrate off marketplace dependency. Built to scale.'),

('about', 'About Us',
 'E-commerce systems, powered by AI.',
 'WeeCommerce is a specialist agency at the intersection of custom development, AI, and business automation.',
 'About WeeCommerce — Specialist E-Commerce Agency',
 'Learn about WeeCommerce: a specialist e-commerce agency building AI-powered systems for brands that have outgrown their current setup.'),

('process', 'Process',
 'How we work.',
 'Every engagement follows a structured process designed to reduce ambiguity, protect your investment, and ship clean systems on time.',
 'Our Process — WeeCommerce',
 'Discovery, Proposal, Design & Build, AI Integration, Launch, Retain. A structured 6-step process for e-commerce systems.'),

('pricing', 'Pricing',
 'Transparent pricing, scoped per project.',
 'All prices are starting points. We scope each project individually after a 30-minute discovery call.',
 'Pricing — WeeCommerce E-Commerce Tiers',
 'LAUNCH, CONVERT, SCALE, INTEGRATE. Transparent IDR + USD pricing for custom e-commerce systems with AI.'),

('contact', 'Contact',
 'Let''s build something that works.',
 'Every project starts with a 30-minute conversation. No sales pitch — just us understanding your business.',
 'Contact WeeCommerce — Start Your Project',
 'Get in touch with WeeCommerce. 30-minute discovery call, proposal within 48 hours. Indonesia-primary, globally available.');
```

---

## 7. Migration Strategy

### 7.1 File Structure

```
db/
├── init/                      # Auto-run on container first start
│   ├── 0001_extensions.sql    # CREATE EXTENSION statements
│   └── 0002_seed.sql          # Seed data (idempotent)
└── migrations/                # Versioned migrations (manual run)
    ├── 0001_init.sql          # Initial schema (all tables above)
    ├── 0002_seed_services.sql # Service tiers + features
    ├── 0003_seed_faq.sql      # FAQ entries
    └── README.md
```

### 7.2 Migration Runner

Menggunakan `node-pg-migrate` (lightweight, TypeScript-friendly). Atau manual `psql` untuk simplicity.

**package.json script:**

```json
{
  "scripts": {
    "db:migrate": "node-pg-migrate -f db/migrations-config.js up",
    "db:migrate:down": "node-pg-migrate -f db/migrations-config.js down",
    "db:migrate:create": "node-pg-migrate -f db/migrations-config.js create",
    "db:seed": "psql $DATABASE_URL -f db/init/0002_seed.sql",
    "db:reset": "psql $DATABASE_URL -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;' && npm run db:migrate && npm run db:seed"
  }
}
```

### 7.3 Migration Naming Convention

```
NNNN_description.sql
└─┬─┘ └────┬────┘
  │        └─ snake_case, descriptive
  └─ 4-digit sequence (0001, 0002, ...)
```

### 7.4 Migration Rules

1. **Never edit a migration yang sudah run di production.** Buat migration baru untuk revert/change.
2. **Always backup sebelum migration production** (`pg_dump` ke R2).
3. **Test migration di staging** sebelum production.
4. **Idempotent where possible** (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`).
5. **Both up + down** bila feasible (reversible migration).

### 7.5 Production Migration Procedure

```bash
# 1. Backup current state
docker exec weecommerce-postgres pg_dump -U weecommerce weecommerce | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# 2. Upload backup ke R2
rclone copy backup_*.sql.gz r2:weecommerce-backups/db/

# 3. Run migration (in new container, zero-downtime approach)
docker-compose run --rm hono npm run db:migrate

# 4. Verify
docker exec weecommerce-postgres psql -U weecommerce -c '\dt'

# 5. If error, restore
gunzip -c backup_*.sql.gz | docker exec -i weecommerce-postgres psql -U weecommerce weecommerce
```

---

## 8. Backup & Restore

### 8.1 Backup Strategy

| Frequency | Method | Destination | Retention |
|---|---|---|---|
| Daily (2 AM UTC) | `pg_dump | gzip` via cron | R2 `weecommerce-backups/db/` | 30 days |
| Weekly (Sunday) | `pg_dump --format=custom` | R2 + local | 12 months |
| Pre-migration | Manual `pg_dump` | R2 + local | Indefinite |

### 8.2 Backup Script

```bash
#!/bin/bash
# scripts/backup-db.sh
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="weecommerce_${TIMESTAMP}.sql.gz"
R2_REMOTE="r2:weecommerce-backups/db/"

echo "[$(date)] Starting backup..."

# Dump + compress
docker exec weecommerce-postgres pg_dump \
  -U weecommerce \
  -d weecommerce \
  --no-owner \
  --no-privileges \
  | gzip > "/tmp/${BACKUP_FILE}"

# Verify non-empty
SIZE=$(stat -c%s "/tmp/${BACKUP_FILE}")
if [ "$SIZE" -lt 1000 ]; then
  echo "[$(date)] ERROR: Backup too small ($SIZE bytes). Aborting."
  exit 1
fi

# Upload ke R2
rclone copy "/tmp/${BACKUP_FILE}" "$R2_REMOTE"

# Cleanup local
rm "/tmp/${BACKUP_FILE}"

# Cleanup old backups di R2 (keep 30 daily)
rclone delete "$R2_REMOTE" --min-age 30d

echo "[$(date)] Backup complete: ${BACKUP_FILE} ($SIZE bytes)"
```

Cron entry (di VPS host):
```cron
0 2 * * * /opt/weecommerce/scripts/backup-db.sh >> /var/log/weecommerce-backup.log 2>&1
```

### 8.3 Restore Procedure

```bash
# 1. Download backup dari R2
rclone copy r2:weecommerce-backups/db/weecommerce_YYYYMMDD_020000.sql.gz /tmp/

# 2. Decompress
gunzip /tmp/weecommerce_YYYYMMDD_020000.sql.gz

# 3. Stop app (avoid writes during restore)
docker-compose stop hono nextjs

# 4. Drop & recreate schema (DESTRUCTIVE)
docker exec weecommerce-postgres psql -U weecommerce -d weecommerce \
  -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'

# 5. Restore
docker exec -i weecommerce-postgres psql -U weecommerce -d weecommerce \
  < /tmp/weecommerce_YYYYMMDD_020000.sql

# 6. Verify
docker exec weecommerce-postgres psql -U weecommerce -c '\dt'

# 7. Restart app
docker-compose start hono nextjs

# 8. Smoke test
curl https://weecommerce.web.id/health
```

### 8.4 Weekly Restore Test

Automated weekly test di staging VPS (atau local Docker) untuk verify backup integrity:

```bash
#!/bin/bash
# scripts/test-restore.sh
# Run weekly via cron. Alert Slack if restore fails.

LATEST=$(rclone lsf r2:weecommerce-backups/db/ | sort | tail -1)
rclone copy "r2:weecommerce-backups/db/${LATEST}" /tmp/
gunzip "/tmp/${LATEST}"

docker run --rm -d --name test-pg -e POSTGRES_PASSWORD=test postgres:16-alpine
sleep 5
cat "/tmp/${LATEST%.gz}" | docker exec -i test-pg psql -U postgres

if docker exec test-pg psql -U postgres -c '\dt weecommerce' | grep -q 'public'; then
  echo "OK: restore successful"
else
  echo "FAIL: restore failed" | send-slack-alert
fi

docker rm -f test-pg
rm "/tmp/${LATEST%.gz}"
```

---

## 9. Data Retention Policy

| Data | Retention | Action |
|---|---|---|
| Form submissions (converted/qualified) | 2 years | Then archive (anonymize PII) |
| Form submissions (spam) | 90 days | Then hard delete |
| Form submissions (no follow-up) | 1 year | Then anonymize email/phone |
| Newsletter subscribers (unsubscribed) | 30 days | Then hard delete (GDPR right to deletion) |
| Submission logs | 1 year | Then hard delete |
| Audit logs | 1 year | Then archive to R2 cold storage |
| Blog posts (published) | Indefinite | Soft delete only |
| Blog posts (draft, never published) | 1 year | Then hard delete |
| Analytics (Plausible) | Indefinite (Plausible default) | Aggregated, no PII |
| Backups | 30 days daily, 12 months weekly | Auto-cleanup |

### 9.1 GDPR Right to Deletion

Untuk request deletion (`/api/v1/privacy/delete-request` — MVP, admin dashboard):

```sql
-- Anonymize form submissions (keep aggregate stats)
UPDATE form_submissions
SET name = '[DELETED]', email = '[DELETED]', phone = NULL, message = '[DELETED]'
WHERE email = $1;

-- Delete newsletter subscriber
DELETE FROM newsletter_subscribers WHERE email = $1;

-- Log action
INSERT INTO audit_logs (action, entity_type, changes)
VALUES ('gdpr_deletion', 'user', '{"email": "[redacted]"}');
```

---

## 10. Performance Tuning

### 10.1 PostgreSQL Config (VPS 2GB)

File: `db/postgresql.conf` overrides (atau via `docker-compose` command args):

```ini
# Memory tuning for 2GB VPS
shared_buffers = 256MB          # 25% of available RAM
effective_cache_size = 768MB    # 75% of available RAM
work_mem = 4MB                  # per-query sort/hash memory
maintenance_work_mem = 64MB     # for VACUUM, CREATE INDEX

# Connection
max_connections = 50            # Hono pool max 20, leave headroom

# WAL / Replication (future)
wal_buffers = 4MB
checkpoint_completion_target = 0.9

# Query planner
random_page_cost = 1.1          # SSD optimization
effective_io_concurrency = 200  # SSD

# Autovacuum
autovacuum = on
autovacuum_naptime = 60s
```

### 10.2 Query Analysis

Untuk debug slow queries:

```sql
-- Enable slow query logging (> 1 second)
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- Analyze specific query
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM posts
WHERE status = 'published' AND deleted_at IS NULL
ORDER BY published_at DESC LIMIT 12;

-- Check index usage
SELECT relname, indexrelname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### 10.3 Regular Maintenance

Weekly cron:

```bash
# Vacuum analyze (update planner stats)
docker exec weecommerce-postgres psql -U weecommerce -c 'VACUUM ANALYZE;'

# Reindex jika bloat tinggi (cek pgstattuple dulu)
# docker exec weecommerce-postgres psql -U weecommerce -c 'REINDEX DATABASE weecommerce;'
```

---

## Summary

Database design ini provide:

- ✅ **Complete schema** — 16 tables covering content, media, leads, SEO, audit.
- ✅ **Performance-ready** — Indexes di hot columns, partial indexes untuk soft-delete, GIN untuk array/JSONB/FTS.
- ✅ **Full-text search** — Built-in PostgreSQL FTS (no Elasticsearch needed for MVP).
- ✅ **Seed data** — Real WeeCommerce content (4 service tiers, 10 FAQ, founder bio).
- ✅ **Migration strategy** — Versioned SQL files, reversible, idempotent.
- ✅ **Backup & restore** — Daily automated ke R2, weekly restore test, 30-day retention.
- ✅ **GDPR-ready** — Data retention policy, right-to-deletion SQL pattern.
- ✅ **Budget-friendly** — Single PostgreSQL 16 container, tuned untuk VPS 2GB.

**Next:** [API.md](./API.md) untuk REST endpoints yang query database ini.
