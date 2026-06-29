-- ===================================================
-- WeeCommerce — Migration 0001: Initial Schema
-- DATABASE.md §3
-- ===================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===================================================
-- Content tables
-- ===================================================

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

CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(50) NOT NULL,
  slug       VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tags_slug ON tags(slug);

CREATE TABLE team_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(100) NOT NULL,
  slug            VARCHAR(100) UNIQUE NOT NULL,
  role            VARCHAR(100) NOT NULL,
  bio             TEXT,
  photo_key       VARCHAR(255),
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

CREATE TABLE posts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                VARCHAR(255) NOT NULL,
  slug                 VARCHAR(255) UNIQUE NOT NULL,
  excerpt              VARCHAR(500),
  content              TEXT NOT NULL,
  content_html         TEXT,
  author_id            UUID REFERENCES team_members(id) ON DELETE SET NULL,
  category_id          UUID REFERENCES categories(id) ON DELETE SET NULL,
  featured_image_key   VARCHAR(255),
  featured_image_alt   VARCHAR(200),
  status               VARCHAR(20) DEFAULT 'draft'
                       CHECK (status IN ('draft', 'published', 'archived')),
  published_at         TIMESTAMPTZ,
  read_time_minutes    INT,
  word_count           INT,
  views                INT DEFAULT 0,
  meta_title           VARCHAR(60),
  meta_description     VARCHAR(160),
  og_image_key         VARCHAR(255),
  canonical_url        VARCHAR(500),
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status_published ON posts(status, published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_category ON posts(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_author ON posts(author_id);

CREATE TABLE posts_to_tags (
  post_id  UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id   UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_ptt_tag ON posts_to_tags(tag_id);

CREATE TABLE case_studies (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                VARCHAR(255) NOT NULL,
  slug                 VARCHAR(255) UNIQUE NOT NULL,
  client_name          VARCHAR(100),
  is_confidential      BOOLEAN DEFAULT FALSE,
  summary              TEXT NOT NULL,
  challenge            TEXT,
  solution             TEXT,
  technologies         TEXT[] DEFAULT '{}',
  industry             VARCHAR(100),
  service_tier         VARCHAR(20)
                       CHECK (service_tier IN ('launch', 'convert', 'scale', 'integrate')),
  project_link         VARCHAR(500),
  start_date           DATE,
  end_date             DATE,
  duration_weeks       INT,
  featured_image_key   VARCHAR(255),
  featured_image_alt   VARCHAR(200),
  gallery_keys         JSONB DEFAULT '[]',
  status               VARCHAR(20) DEFAULT 'published'
                       CHECK (status IN ('draft', 'published', 'archived')),
  published_at         TIMESTAMPTZ DEFAULT NOW(),
  sort_order           INT DEFAULT 0,
  meta_title           VARCHAR(60),
  meta_description     VARCHAR(160),
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ
);

CREATE INDEX idx_cs_slug ON case_studies(slug);
CREATE INDEX idx_cs_status_published ON case_studies(status, published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_cs_technologies ON case_studies USING GIN(technologies);
CREATE INDEX idx_cs_service_tier ON case_studies(service_tier);
CREATE INDEX idx_cs_industry ON case_studies(industry);

CREATE TABLE case_study_results (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id  UUID REFERENCES case_studies(id) ON DELETE CASCADE,
  metric_label   VARCHAR(100) NOT NULL,
  metric_value   VARCHAR(50) NOT NULL,
  sort_order     INT DEFAULT 0
);

CREATE INDEX idx_csr_case_study ON case_study_results(case_study_id, sort_order);

CREATE TABLE services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(20) UNIQUE NOT NULL
                  CHECK (slug IN ('launch', 'convert', 'scale', 'integrate')),
  name            VARCHAR(50) NOT NULL,
  tagline         VARCHAR(200),
  description     TEXT NOT NULL,
  route           VARCHAR(20),
  price_idr_min   INT,
  price_idr_max   INT,
  price_usd_min   INT,
  price_usd_max   INT,
  timeline_weeks_min INT,
  timeline_weeks_max INT,
  is_popular      BOOLEAN DEFAULT FALSE,
  sort_order      INT DEFAULT 0,
  is_published    BOOLEAN DEFAULT TRUE,
  meta_title      VARCHAR(60),
  meta_description VARCHAR(160),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_published_sort ON services(is_published, sort_order);

CREATE TABLE service_features (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  UUID REFERENCES services(id) ON DELETE CASCADE,
  feature     TEXT NOT NULL,
  is_included BOOLEAN DEFAULT TRUE,
  sort_order  INT DEFAULT 0
);

CREATE INDEX idx_sf_service ON service_features(service_id, sort_order);

CREATE TABLE faq (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question    VARCHAR(300) NOT NULL,
  answer      TEXT NOT NULL,
  category    VARCHAR(50) DEFAULT 'general',
  service_id  UUID REFERENCES services(id) ON DELETE SET NULL,
  sort_order  INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_faq_category_sort ON faq(category, sort_order) WHERE is_published;
CREATE INDEX idx_faq_service ON faq(service_id);

CREATE TABLE pages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(50) UNIQUE NOT NULL,
  title           VARCHAR(100) NOT NULL,
  hero_headline   VARCHAR(200),
  hero_subheadline TEXT,
  content         TEXT,
  meta_title      VARCHAR(60),
  meta_description VARCHAR(160),
  og_image_key    VARCHAR(255),
  is_published    BOOLEAN DEFAULT TRUE,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pages_slug ON pages(slug);

-- ===================================================
-- Media
-- ===================================================

CREATE TABLE media_files (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  r2_key         VARCHAR(500) UNIQUE NOT NULL,
  filename       VARCHAR(255) NOT NULL,
  mime_type      VARCHAR(100) NOT NULL,
  size_bytes     BIGINT NOT NULL,
  width          INT,
  height         INT,
  alt_text       VARCHAR(200),
  caption        TEXT,
  uploaded_by    UUID REFERENCES team_members(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_r2_key ON media_files(r2_key);
CREATE INDEX idx_media_mime ON media_files(mime_type);

-- ===================================================
-- Leads
-- ===================================================

CREATE TABLE form_submissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  company      VARCHAR(255),
  phone        VARCHAR(30),
  message      TEXT NOT NULL,
  source       VARCHAR(50) DEFAULT 'contact_form',
  ip_address   INET,
  user_agent   TEXT,
  spam_score   DECIMAL(3,2) DEFAULT 0.00,
  status       VARCHAR(20) DEFAULT 'new'
               CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'spam', 'archived')),
  service_interest VARCHAR(20),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fs_email ON form_submissions(email);
CREATE INDEX idx_fs_status ON form_submissions(status);
CREATE INDEX idx_fs_submitted ON form_submissions(submitted_at DESC);
CREATE INDEX idx_fs_ip ON form_submissions(ip_address);

CREATE TABLE newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  name            VARCHAR(255),
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending', 'active', 'unsubscribed', 'bounced')),
  verify_token    VARCHAR(64),
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

CREATE TABLE submission_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id  UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  action         VARCHAR(50) NOT NULL,
  channel        VARCHAR(50),
  status         VARCHAR(20) NOT NULL,
  attempt        INT DEFAULT 1,
  error_message  TEXT,
  metadata       JSONB,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sl_submission ON submission_logs(submission_id, created_at);
CREATE INDEX idx_sl_status ON submission_logs(status);

-- ===================================================
-- SEO
-- ===================================================

CREATE TABLE seo_metadata (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type       VARCHAR(30) NOT NULL,
  page_id         UUID,
  path            VARCHAR(500),
  meta_title      VARCHAR(60),
  meta_description VARCHAR(160),
  og_image_key    VARCHAR(255),
  canonical_url   VARCHAR(500),
  json_ld         JSONB,
  robots_index    BOOLEAN DEFAULT TRUE,
  robots_follow   BOOLEAN DEFAULT TRUE,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_type, page_id)
);

CREATE INDEX idx_seo_page ON seo_metadata(page_type, page_id);
CREATE INDEX idx_seo_path ON seo_metadata(path);

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

-- ===================================================
-- Audit
-- ===================================================

CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID,
  actor_email VARCHAR(255),
  action      VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id   UUID,
  changes     JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ===================================================
-- Updated-at triggers
-- ===================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
CREATE TRIGGER set_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
