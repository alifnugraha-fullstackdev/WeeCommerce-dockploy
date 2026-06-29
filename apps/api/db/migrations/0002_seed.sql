-- ===================================================
-- WeeCommerce — Seed Data
-- DATABASE.md §6
-- ===================================================

-- Team member: Founder
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

-- Service tiers (4 tiers)
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
 'For brands that already have a Shopify or custom platform. Add the AI intelligence layer without rebuilding. Modules: AI Chatbot, RAG System, n8n Automation, or the full bundled AI Suite.',
 'B', 8000000, 40000000, 1200, 6500, 2, 8, FALSE, 4);

-- Service features: LAUNCH
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

-- Service features: CONVERT
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

-- Service features: SCALE
INSERT INTO service_features (service_id, feature, is_included, sort_order)
SELECT id, feat, inc, ord FROM services, (VALUES
  ('Everything in CONVERT', TRUE, 1),
  ('Advanced n8n Suite (CRM sync, abandoned cart, post-purchase)', TRUE, 2),
  ('AI Analytics Dashboard', TRUE, 3),
  ('Multi-channel (WhatsApp Business API, email)', TRUE, 4),
  ('Performance optimization (Core Web Vitals, caching)', TRUE, 5)
) AS v(feat, inc, ord)
WHERE slug = 'scale';

-- Service features: INTEGRATE
INSERT INTO service_features (service_id, feature, is_included, sort_order)
SELECT id, feat, inc, ord FROM services, (VALUES
  ('AI Chatbot module (Rp 8–15jt / $1,200–$2,500)', TRUE, 1),
  ('RAG System module (Rp 10–18jt / $1,500–$3,000)', TRUE, 2),
  ('n8n Automation module (Rp 8–15jt / $1,200–$2,500)', TRUE, 3),
  ('Full AI Suite bundle (Rp 22–40jt / $3,500–$6,500)', TRUE, 4),
  ('Rebuild existing store', FALSE, 5)
) AS v(feat, inc, ord)
WHERE slug = 'integrate';

-- FAQ
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

-- Pages (static content slots)
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
 'Learn about WeeCommerce: a specialist e-commerce agency building AI-powered systems.'),

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
