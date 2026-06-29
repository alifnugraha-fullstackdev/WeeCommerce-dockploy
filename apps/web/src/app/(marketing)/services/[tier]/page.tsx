import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import {
  ArrowRight, Check, X, Clock, DollarSign, BarChart3, Shield, Bot, ShoppingCart, TrendingUp, Zap,
  Users, Headphones, MessageCircle, Database, Workflow, Smartphone, Search, Globe, CreditCard,
  TrendingDown, Sparkles, Target, Gauge, Layers, Repeat, RefreshCw, Star,
} from 'lucide-react';

/* ── All tier data ── */
const allData: Record<string, any> = {
  launch: {
    name: 'LAUNCH',
    tagline: 'Punya platform sendiri. Berhenti numpang di marketplace orang.',
    price_idr: 'Rp 15–25 juta',
    price_usd: '$2,500–$4,000',
    timeline: '4–6 minggu',
    route: 'A — BUILD',
    bestFor: 'Brand yang masih jualan di Tokopedia/Shopee dan mau punya platform sendiri',
    icon: ShoppingCart,
    problem: {
      headline: 'Setiap transaksi di marketplace, lo bayar fee 15–30%. Data customer bukan milik lo.',
      bullets: [
        'Fee marketplace terus naik setiap tahun',
        'Algoritma bisa rubah kapan aja — traffic lo drop dalam semalam',
        'Data customer ada di tangan marketplace, bukan lo',
        'Susah bikin brand identity kalo numpang di platform orang',
      ],
    },
    solution: {
      headline: 'LAUNCH — platform lo sendiri, zero dependency marketplace.',
      desc: 'Custom e-commerce storefront dengan Next.js + Supabase. Cepat, aman, scalable. Lengkap dari catalog sampai payment gateway.',
    },
    heroDesc: 'Custom e-commerce storefront (Next.js + Supabase). Product catalog, cart, checkout, payment gateway (Midtrans/Stripe), shipping, admin dashboard, mobile responsive, basic SEO. AI layer: not included — but architecture is upgrade-ready.',
    longDesc: 'LAUNCH adalah entry point terbaik buat brand yang serius mau keluar dari marketplace dan punya platform sendiri. Dibangun dengan teknologi modern (Next.js + Supabase) yang scalable dari hari pertama — jadi kalau bisnis lo tumbuh 10×, platform-nya tetap kuat. AI layer belum include, tapi arsitektur udah siap di-upgrade ke CONVERT kapan aja tanpa rebuild dari awal.',
    diagram: {
      title: 'Arsitektur LAUNCH',
      layers: [
        { icon: Smartphone, label: 'Frontend', items: 'Next.js · Mobile-first · SSR/SSG · SEO' },
        { icon: Database, label: 'Backend & DB', items: 'Supabase · PostgreSQL · Redis cache' },
        { icon: CreditCard, label: 'Payment', items: 'Midtrans (ID) / Stripe (Global)' },
        { icon: Globe, label: 'Domain & Hosting', items: 'VPS Docker · Cloudflare CDN · R2 Storage' },
      ],
    },
    included: [
      { feat: 'Custom Storefront (Next.js + Supabase)', desc: 'High-performance frontend. Server-side rendering + static generation. Fast loading di semua device.', icon: Smartphone },
      { feat: 'Product Catalog + Cart + Checkout', desc: 'Katalog dengan kategori, filter, pencarian. Cart & checkout flow yang smooth dengan validasi otomatis.', icon: ShoppingCart },
      { feat: 'Payment Gateway (Midtrans / Stripe)', desc: 'Multi-payment method. Support kartu kredit, transfer bank, e-wallet, COD (Midtrans).', icon: CreditCard },
      { feat: 'Shipping Integration', desc: 'Integrasi API shipping. Tracking real-time, ongkos kirim otomatis, multi-kurir.', icon: Globe },
      { feat: 'Admin Dashboard', desc: 'Manage produk, pantau order, kelola inventory. Akses dari mana aja.', icon: BarChart3 },
      { feat: 'Mobile Responsive', desc: 'Mobile-first design. Toko lo berfungsi sempurna di HP, tablet, dan desktop.', icon: Smartphone },
      { feat: 'Basic SEO Setup', desc: 'Meta tags, sitemap.xml, robots.txt, JSON-LD structured data. Siap index Google.', icon: Search },
    ],
    notIncluded: ['AI Customer Service Chatbot', 'RAG Knowledge Base', 'n8n Automation'],
    painPoints: [
      { icon: TrendingDown, label: 'Marketplace fee', desc: '15–30% per transaksi' },
      { icon: Users, label: 'Customer data', desc: 'Bukan milik lo' },
      { icon: RefreshCw, label: 'Algorithm risk', desc: 'Traffic bisa drop kapan aja' },
    ],
    gains: [
      { icon: Star, label: 'Zero fee', desc: '100% revenue lo' },
      { icon: Users, label: 'Your data', desc: 'Customer data milik lo' },
      { icon: Layers, label: 'Full control', desc: 'Lo yang pegang kendali' },
    ],
  },
  convert: {
    name: 'CONVERT',
    tagline: 'Toko lo jalan. Sekarang biarin AI yang kerja keras.',
    price_idr: 'Rp 38–55 juta',
    price_usd: '$6,000–$9,000',
    timeline: '7–10 minggu',
    route: 'A — BUILD',
    bestFor: 'Brand yang udah punya produk jalan dan mau automate CS + operasional dengan AI',
    icon: Bot,
    problem: {
      headline: 'CS lo kewalahan, operasional manual, dan lo gak bisa scale tanpa nambah orang.',
      bullets: [
        'Customer service balas chat manual — 1 orang cuma handle 20–30 chat/hari',
        'Pertanyaan itu-itu aja (ongkir, retur, stok) tapi tetep harus dijawab manual',
        'Order notification harus di-cek satu-satu',
        'Lo capek, tim lo capek, bisnis stretch di tempat',
      ],
    },
    solution: {
      headline: 'CONVERT — AI handle CS + operasional. Lo fokus ke growth.',
      desc: 'AI chatbot yang tau produk lo, RAG yang jawab akurat, n8n yang automate tugas repetitive. Tim lo bisa scale tanpa nambah orang.',
    },
    heroDesc: 'Everything in LAUNCH, plus: AI Customer Service Chatbot (trained on your products & FAQ), RAG Knowledge Base (dynamic Q&A), Basic n8n Automation (order notifications, follow-up, low stock alerts).',
    longDesc: 'CONVERT adalah sweet spot. Lo dapet platform e-commerce lengkap DITAMBAH layer AI yang langsung ngurangin beban operasional. AI Chatbot handle customer service 24/7 — bahkan di WhatsApp. RAG bikin product recommendation akurat berdasarkan katalog real-time. n8n automate notifikasi order, follow-up, dan alert stok. Ini tier paling populer karena ROI-nya paling cepat terasa: CS workload turun 60–80% dalam minggu pertama. Tim lo bisa fokus ke growth, bukan repetitive tanya.',
    diagram: {
      title: 'Cara Kerja AI Layer di CONVERT',
      layers: [
        { icon: MessageCircle, label: 'Customer', items: 'Chat via web / WhatsApp' },
        { icon: Bot, label: 'AI Chatbot + RAG', items: 'Jawab real-time dari knowledge base' },
        { icon: Database, label: 'Knowledge Base', items: 'Produk · FAQ · Policy · Katalog' },
        { icon: Workflow, label: 'n8n Automation', items: 'Notif · Follow-up · Alert stok' },
      ],
    },
    included: [
      { feat: '✅ Everything in LAUNCH', desc: 'Full platform e-commerce + payment + admin dashboard.', icon: ShoppingCart },
      { feat: 'AI Customer Service Chatbot', desc: 'Trained on your products & FAQ. 24/7 across web & WhatsApp. Handle 60–80% inquiries otomatis.', icon: MessageCircle },
      { feat: 'RAG Knowledge Base', desc: 'Dynamic Q&A dari product catalog. Jawab akurat, real-time, tanpa retrain manual.', icon: Database },
      { feat: 'Basic n8n Automation', desc: 'Order notifications, customer follow-up, low stock alerts — semuanya automated.', icon: Workflow },
    ],
    notIncluded: ['Advanced n8n Suite (CRM, abandoned cart)', 'AI Analytics Dashboard', 'Multi-channel integration'],
    roi: [
      { icon: Headphones, label: 'CS workload reduction', value: '−60–80%' },
      { icon: Clock, label: 'Response time', value: '< 5 detik' },
      { icon: RefreshCw, label: 'Available', value: '24/7' },
    ],
  },
  scale: {
    name: 'SCALE',
    tagline: 'Sistem yang tumbuh bareng bisnis lo — tanpa nambah orang.',
    price_idr: 'Rp 70–120 juta',
    price_usd: '$11,000–$20,000',
    timeline: '10–16 minggu',
    route: 'A — BUILD',
    bestFor: 'Brand yang udah 3–5× growth dan butuh infrastructure kelas enterprise tanpa enterprise price tag',
    icon: TrendingUp,
    problem: {
      headline: 'Bisnis lo tumbuh cepat. Sekarang sistemnya yang jadi bottleneck.',
      bullets: [
        'Tim lo sibuk input data manual yang harusnya automated',
        'CS channel udah di mana-mana (web, WA, email, IG) tapi gak terintegrasi',
        'Lo butuh data real-time buat ambil keputusan, tapi report-nya manual',
        'Abandoned cart nambah terus, gak ada sistem follow-up otomatis',
      ],
    },
    solution: {
      headline: 'SCALE — full automation infrastructure. Bisnis lo scale, orang gak nambah.',
      desc: 'Advanced n8n suite, AI analytics, multi-channel integration, performance optimization. Sistem yang tumbuh bareng lo.',
    },
    heroDesc: 'Everything in CONVERT, plus: Advanced n8n Suite (CRM sync, abandoned cart, post-purchase email, inventory automation), AI Analytics Dashboard, multi-channel integration (WhatsApp Business API, email), performance optimization (Core Web Vitals, caching).',
    longDesc: 'SCALE adalah ultimate infrastructure untuk brand yang serius scale. Advanced n8n automation automate hampir semua operasional — dari CRM sync sampai inventory management. AI Analytics Dashboard kasih insight real-time: produk apa yang paling laku, jam berapa order paling banyak, customer behavior pattern. Multi-channel integration (WhatsApp Business API, email) bikin lo reach customer di mana pun mereka berada. Plus performa dioptimasi untuk traffic tinggi: Core Web Vitals, advanced caching, CDN — semua all green.',
    diagram: {
      title: 'SCALE — Sistem Terintegrasi',
      layers: [
        { icon: Layers, label: 'E-Commerce Core', items: 'Storefront · Checkout · Payment · Dashboard' },
        { icon: Bot, label: 'AI Layer', items: 'Chatbot · RAG · Multi-channel CS' },
        { icon: Workflow, label: 'Advanced n8n', items: 'CRM · Abandoned cart · Post-purchase · Inventory' },
        { icon: BarChart3, label: 'Analytics & Ops', items: 'AI Analytics · Performance · Reporting' },
      ],
    },
    included: [
      { feat: '✅ Everything in CONVERT', desc: 'Platform + AI chatbot + RAG + basic n8n.', icon: ShoppingCart },
      { feat: 'Advanced n8n Suite', desc: 'CRM sync, abandoned cart recovery, post-purchase email sequences, inventory automation — 5+ workflows.', icon: Workflow },
      { feat: 'AI Analytics Dashboard', desc: 'Sales trends, customer behavior, operational metrics — real-time, bisa diakses dari mana aja.', icon: BarChart3 },
      { feat: 'Multi-Channel Integration', desc: 'WhatsApp Business API, email marketing integration. Semua channel terpusat.', icon: Globe },
      { feat: 'Performance Optimization', desc: 'Core Web Vitals all green, advanced caching, CDN, image optimization. Siap traffic tinggi.', icon: Gauge },
    ],
    notIncluded: ['Fine-tuning (custom quote after data audit)'],
    roi: [
      { icon: Clock, label: 'Operational hours saved', value: '40+ jam/minggu' },
      { icon: ShoppingCart, label: 'Abandoned cart recovery', value: '+15–25%' },
      { icon: TrendingUp, label: 'Revenue impact', value: '2–5× ROI' },
    ],
  },
  integrate: {
    name: 'INTEGRATE',
    tagline: 'AI & automation untuk existing store — tanpa rebuild.',
    price_idr: 'Rp 8–40 juta',
    price_usd: '$1,200–$6,500',
    timeline: '2–8 minggu',
    route: 'B — INTEGRATE',
    bestFor: 'Brand yang udah punya Shopify / custom store dan mau tambah AI tanpa mulai dari nol',
    icon: Zap,
    problem: {
      headline: 'Lo udah punya store. Tapi tanpa AI, lo ketinggalan.',
      bullets: [
        'Store udah jalan, tapi CS masih manual — pelan, mahal, gak scalable',
        'Katalog produk besar, customer susah cari barang yang tepat',
        'Operasional masih manual: input order, kirim notif, update stok',
        'Gak mau rebuild dari awal. Lo butuh solusi yang nempel di sistem existing.',
      ],
    },
    solution: {
      headline: 'INTEGRATE — tambah AI ke store lo. Dalam minggu, bukan bulan.',
      desc: 'Pilih module yang lo butuh: AI Chatbot, RAG, n8n — atau ambil Full Suite. Semua terintegrasi dengan store lo yang udah ada.',
    },
    heroDesc: 'For brands with existing Shopify or custom platforms. Add AI layer without rebuilding. Modules: AI Chatbot, RAG System, n8n Automation, or the full bundled AI Suite.',
    longDesc: 'Sudah punya store di Shopify, WooCommerce, atau platform custom? INTEGRATE dirancang khusus buat nambahin AI layer ke sistem yang udah jalan — tanpa perlu rebuild dari awal. Pilih module yang lo butuh: Chatbot untuk CS otomatis, RAG untuk product discovery yang akurat, n8n untuk automasi workflow. Atau ambil Full AI Suite untuk bundle terbaik dengan harga lebih hemat.',
    diagram: {
      title: 'INTEGRATE — Modular AI Layer',
      layers: [
        { icon: ShoppingCart, label: 'Existing Store', items: 'Shopify / Custom / WooCommerce' },
        { icon: Zap, label: 'INTEGRATE Modules', items: 'Chatbot · RAG · n8n · Full Suite' },
        { icon: Bot, label: 'AI di Store Lo', items: 'CS otomatis · Cerdas · Efisien' },
      ],
    },
    included: [
      { feat: '✅ Tidak perlu rebuild', desc: 'Semua module jalan di atas store lo yang udah ada. Zero disruption.', icon: RefreshCw },
    ],
    modules: [
      { name: 'AI Chatbot', price_idr: 'Rp 8–15 jt', price_usd: '$1,200–$2,500', desc: 'Setup + training pada produk & FAQ. 24/7 customer service di web & WhatsApp.', icon: MessageCircle },
      { name: 'RAG System', price_idr: 'Rp 10–18 jt', price_usd: '$1,500–$3,000', desc: 'Knowledge base dinamis dari katalog produk. Q&A akurat real-time.', icon: Database },
      { name: 'n8n Automation', price_idr: 'Rp 8–15 jt', price_usd: '$1,200–$2,500', desc: '3–5 custom workflow: order sync, CRM, abandoned cart, inventory.', icon: Workflow },
      { name: 'Full AI Suite', price_idr: 'Rp 22–40 jt', price_usd: '$3,500–$6,500', desc: 'Semua modul bundled. Paling hemat + fully integrated.', icon: Star },
    ],
    notIncluded: ['Full platform rebuild', 'Custom storefront design'],
    roi: [
      { icon: Headphones, label: 'CS automate', value: '60–80%' },
      { icon: Clock, label: 'Time to value', value: '1–2 minggu' },
      { icon: DollarSign, label: 'Module mulai', value: 'Rp 8 jt' },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params;
  const svc = allData[tier];
  if (!svc) return { title: 'Service — WeeCommerce' };
  return {
    title: `${svc.name} — Custom E-Commerce ${svc.route.includes('BUILD') ? 'Platform' : 'AI Module'}`,
    description: svc.tagline.slice(0, 160),
    alternates: { canonical: `/services/${tier}` },
    openGraph: {
      title: `${svc.name} — WeeCommerce`,
      description: svc.tagline.slice(0, 160),
    },
  };
}

export default async function ServiceDetail({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params;
  const svc = allData[tier];
  if (!svc) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Service not found.</div>;

  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: svc.name,
        description: svc.tagline,
        provider: { '@type': 'Organization', name: 'WeeCommerce' },
        offers: {
          '@type': 'Offer',
          price: svc.price_idr.replace(/[^0-9]/g, ''),
          priceCurrency: 'IDR',
          availability: 'https://schema.org/InStock',
        },
      }} />
      <div className="flex flex-col">
      {/* ═══ 1. HERO ═══ */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="section-container">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <a href="/services" className="mb-6 self-start text-sm text-muted-foreground hover:text-foreground">← All Services</a>
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <svc.icon className="size-8" />
            </div>
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{svc.route}</span>
              {tier === 'convert' && <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">★ Most Popular</span>}
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">{svc.name}</h1>
            <p className="mt-2 max-w-xl text-lg text-muted-foreground md:text-xl">{svc.tagline}</p>
            <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
              {[
                { icon: Clock, label: 'Timeline', value: svc.timeline },
                { icon: DollarSign, label: 'Mulai IDR', value: svc.price_idr },
                { icon: DollarSign, label: 'Mulai USD', value: svc.price_usd },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-center gap-3 rounded-xl border border-border bg-card p-4">
                  <m.icon className="size-5 shrink-0 text-primary" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="font-mono text-sm font-medium">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. PROBLEM → SOLUTION ═══ */}
      {svc.problem && (
        <section className="border-t border-border bg-card py-16">
          <div className="section-container">
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Problem */}
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <TrendingDown className="size-5" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-red-400">Problem</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{svc.problem.headline}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {svc.problem.bullets.map((b: string) => (
                      <li key={b} className="flex items-start gap-2">
                        <X className="mt-0.5 size-3.5 shrink-0 text-red-400" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solution */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="size-5" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-primary">Solution</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{svc.solution.headline}</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">{svc.solution.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 3. PAIN → GAIN (LAUNCH only) ═══ */}
      {svc.painPoints && (
        <section className="border-t border-border py-12">
          <div className="section-container">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center font-display text-xl font-semibold tracking-tight">Before & After</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
                <div className="space-y-3">
                  <p className="text-center text-xs font-semibold text-red-400 uppercase tracking-wider">With Marketplace</p>
                  {svc.painPoints.map((p: any) => (
                    <div key={p.label} className="flex items-center gap-3 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3">
                      <p.icon className="size-4 shrink-0 text-red-400" />
                      <div>
                        <p className="text-xs font-medium">{p.label}</p>
                        <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-center text-xs font-semibold text-primary uppercase tracking-wider">With LAUNCH</p>
                  {svc.gains.map((g: any) => (
                    <div key={g.label} className="flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3">
                      <g.icon className="size-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-xs font-medium">{g.label}</p>
                        <p className="text-[10px] text-muted-foreground">{g.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 4. FULL DESCRIPTION ═══ */}
      <section className="border-t border-border bg-card py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed md:text-xl">{svc.heroDesc}</p>
            <p className="mt-6 leading-relaxed text-muted-foreground">{svc.longDesc}</p>
          </div>
        </div>
      </section>

      {/* ═══ 5. DIAGRAM ═══ */}
      {svc.diagram && (
        <section className="border-t border-border py-16">
          <div className="section-container">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center font-display text-xl font-semibold tracking-tight md:text-2xl">{svc.diagram.title}</h2>
              <div className="relative grid gap-0 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
                {svc.diagram.layers.map((layer: any, i: number) => (
                  <div key={layer.label} className="relative flex flex-col items-center p-6 text-center">
                    {/* Arrow connector between boxes */}
                    {i < svc.diagram.layers.length - 1 && (
                      <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-muted-foreground/30 lg:block">
                        <ArrowRight className="size-5" />
                      </div>
                    )}
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <layer.icon className="size-5" />
                    </div>
                    <h3 className="font-display text-sm font-semibold">{layer.label}</h3>
                    <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{layer.items}</p>
                  </div>
                ))}
              </div>
              {/* Connection bar */}
              <div className="mt-4 h-1.5 w-full rounded-full bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40" />
            </div>
          </div>
        </section>
      )}

      {/* ═══ 6. ROI (CONVERT/SCALE/INTEGRATE) ═══ */}
      {svc.roi && (
        <section className="border-t border-border bg-card py-16">
          <div className="section-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-3 font-display text-xl font-semibold tracking-tight md:text-2xl">Expected Impact</h2>
              <p className="mb-8 text-sm text-muted-foreground">What {svc.name} delivers for your business.</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {svc.roi.map((r: any) => (
                  <div key={r.label} className="rounded-xl border border-border bg-background p-5">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <r.icon className="size-5" />
                    </div>
                    <p className="font-mono text-xl font-medium text-primary">{r.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 7. WHAT'S INCLUDED ═══ */}
      <section className="border-t border-border py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-3 text-center font-display text-xl font-semibold tracking-tight md:text-2xl">What's Included</h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">Every feature that comes with {svc.name}.</p>

            <div className="space-y-4">
              {svc.included?.map((item: any) => (
                <div key={item.feat} className="flex gap-4 rounded-xl border border-border bg-card p-5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {item.icon ? <item.icon className="size-4" /> : <Check className="size-4" />}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold">{item.feat}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modules for INTEGRATE */}
            {svc.modules && (
              <div className="mt-10">
                <h3 className="mb-6 text-center font-display text-lg font-semibold">Available Modules</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {svc.modules.map((mod: any) => (
                    <div key={mod.name} className="flex flex-col items-center rounded-xl border border-border bg-background p-6 text-center transition-all hover:border-primary/30">
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <mod.icon className="size-4" />
                      </div>
                      <h4 className="font-display text-sm font-semibold">{mod.name}</h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{mod.desc}</p>
                      <div className="mt-3 space-y-0.5">
                        <p className="font-mono text-sm font-medium text-primary">{mod.price_idr}</p>
                        <p className="text-[10px] text-muted-foreground">{mod.price_usd} USD</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ 8. NOT INCLUDED ═══ */}
      <section className="border-t border-border bg-card py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-3 text-center font-display text-xl font-semibold tracking-tight md:text-2xl">Not Included</h2>
            <p className="mb-6 text-center text-sm text-muted-foreground">Items outside the scope of {svc.name}. These can be added separately.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {svc.notIncluded?.map((item: string) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 px-5 py-4 text-sm text-muted-foreground">
                  <X className="size-4 shrink-0 text-muted-foreground/50" /> {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl glass p-5 text-center text-sm text-muted-foreground">
              <strong className="text-foreground">Third-party costs</strong> (OpenAI, hosting, domain) not included. Client sets up accounts. No markups.
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 9. INVESTMENT ═══ */}
      <section className="border-t border-border py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-3 font-display text-xl font-semibold tracking-tight md:text-2xl">Investment</h2>
            <p className="mb-8 text-sm text-muted-foreground">Transparent pricing, scoped per project. What you see is what you get.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-border bg-card px-8 py-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Mulai IDR</p>
                <p className="font-mono text-2xl font-medium text-primary md:text-3xl">{svc.price_idr}</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Mulai USD</p>
                <p className="font-mono text-2xl font-medium md:text-3xl">{svc.price_usd}</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Timeline</p>
                <p className="font-mono text-2xl font-medium md:text-3xl">{svc.timeline}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { phase: 'DP / Kickoff', pct: '50%' },
                { phase: 'Staging Delivery', pct: '30%' },
                { phase: 'Final Launch', pct: '20%' },
              ].map((p) => (
                <div key={p.phase} className="rounded-xl border border-border/50 bg-card/50 p-3 text-center text-xs text-muted-foreground">
                  <span className="font-mono text-sm font-medium text-primary">{p.pct}</span>
                  <span className="ml-1">{p.phase}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              <Shield className="mr-1 inline size-3 text-primary" />
              Source code ownership transferred upon final payment.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 10. CTA ═══ */}
      <section className="border-t border-border bg-card py-20">
        <div className="section-container text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {tier === 'convert' ? 'The Most Popular Tier for a Reason.' : 'Ready to Get Started?'}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Every project starts with a 30-minute conversation. We'll help you figure out if {svc.name} is the right fit.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90">
              Book a Discovery Call <ArrowRight className="size-4" />
            </Link>
            <Link href="/pricing" className="inline-flex h-11 items-center rounded-full border border-border bg-background px-7 text-sm font-medium hover:bg-card">
              Compare All Tiers
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
