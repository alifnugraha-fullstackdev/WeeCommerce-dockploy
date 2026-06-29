import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/json-ld';
import { ArrowRight, Bot, Database, Workflow, Zap, Check, Sparkles, BarChart3, ShoppingCart, Headphones, MessageCircle, TrendingUp, Users, Settings, Shield, Star, Clock, DollarSign } from 'lucide-react';

const services = [
  {
    slug: 'launch',
    name: 'LAUNCH',
    tagline: 'Punya platform sendiri. Berhenti numpang di marketplace orang.',
    price_idr: 'Rp 15–25 juta',
    price_usd: '$2,500–$4,000',
    timeline: '4–6 minggu',
    popular: false,
    bestFor: 'Brand migrating off marketplace, needs core platform',
    route: 'A — BUILD',
    gradient: 'from-teal-400/15 to-transparent',
    icon: ShoppingCart,
    description: 'Custom e-commerce storefront built with Next.js and Supabase. Product catalog, cart, multi-step checkout, payment gateway integration (Midtrans / Stripe), shipping integration, admin dashboard, mobile responsive, basic SEO.',
    included: [
      'Custom storefront (Next.js + Supabase)',
      'Product catalog, cart, checkout flow',
      'Payment gateway — Midtrans (ID) / Stripe (Intl)',
      'Shipping integration',
      'Admin dashboard for orders & inventory',
      'Mobile responsive design',
      'Basic SEO setup',
    ],
    notIncluded: [
      'AI Customer Service Chatbot',
      'RAG Knowledge Base',
      'n8n Automation',
    ],
    metrics: [
      { label: 'Timeline', value: '4–6 minggu' },
      { label: 'Investment start', value: 'Rp 15 jt' },
      { label: 'Pages included', value: '5–7 pages' },
    ],
  },
  {
    slug: 'convert',
    name: 'CONVERT',
    tagline: 'Toko lo jalan. Sekarang biarin AI yang kerja keras.',
    price_idr: 'Rp 38–55 juta',
    price_usd: '$6,000–$9,000',
    timeline: '7–10 minggu',
    popular: true,
    bestFor: 'Brand ready to automate CS and operations with AI',
    route: 'A — BUILD',
    gradient: 'from-purple-400/15 to-transparent',
    icon: Bot,
    description: 'Everything in LAUNCH, plus: AI Customer Service Chatbot trained on your products & FAQ, RAG Knowledge Base for dynamic product Q&A, Basic n8n Automation (order notifications, follow-up, low stock alerts).',
    included: [
      'Semua yang ada di LAUNCH',
      'AI Customer Service Chatbot (trained on your data)',
      'RAG Knowledge Base (dynamic product Q&A)',
      'Basic n8n Automation: order notif, follow-up, stock alert',
    ],
    notIncluded: [
      'Advanced n8n Suite (CRM, abandoned cart)',
      'AI Analytics Dashboard',
      'Multi-channel integration',
    ],
    metrics: [
      { label: 'Timeline', value: '7–10 minggu' },
      { label: 'Investment start', value: 'Rp 38 jt' },
      { label: 'AI features', value: '3 modules' },
    ],
  },
  {
    slug: 'scale',
    name: 'SCALE',
    tagline: 'Sistem yang tumbuh bareng bisnis lo — tanpa nambah orang.',
    price_idr: 'Rp 70–120 juta',
    price_usd: '$11,000–$20,000',
    timeline: '10–16 minggu',
    popular: false,
    bestFor: 'Brand building full commerce infrastructure',
    route: 'A — BUILD',
    gradient: 'from-orange-400/15 to-transparent',
    icon: TrendingUp,
    description: 'Everything in CONVERT, plus: Advanced n8n Suite (CRM sync, abandoned cart, post-purchase email, inventory automation), AI Analytics Dashboard, multi-channel integration (WhatsApp Business API, email), performance optimization (Core Web Vitals, caching).',
    included: [
      'Semua yang ada di CONVERT',
      'Advanced n8n Suite: CRM, abandoned cart, post-purchase',
      'AI Analytics Dashboard',
      'Multi-channel (WhatsApp Business API, email)',
      'Performance optimization (CWV, caching)',
    ],
    notIncluded: [
      'Fine-tuning (custom quote)',
    ],
    metrics: [
      { label: 'Timeline', value: '10–16 minggu' },
      { label: 'Investment start', value: 'Rp 70 jt' },
      { label: 'Automation workflows', value: '5+' },
    ],
  },
  {
    slug: 'integrate',
    name: 'INTEGRATE',
    tagline: 'AI & automation for your existing store.',
    price_idr: 'Rp 8–40 juta',
    price_usd: '$1,200–$6,500',
    timeline: '2–8 minggu',
    popular: false,
    bestFor: 'Existing store needing AI layer',
    route: 'B — INTEGRATE',
    gradient: 'from-blue-400/15 to-transparent',
    icon: Zap,
    description: 'For brands that already have a Shopify or custom platform. Add the AI intelligence layer without rebuilding everything from scratch. Modules available individually or as a bundled suite.',
    modules: [
      { name: 'AI Chatbot', slug: 'chatbot', icon: MessageCircle, price_idr: 'Rp 8–15 jt', price_usd: '$1,200–$2,500', desc: 'Setup + training pada produk & FAQ klien. 24/7 customer service.' },
      { name: 'RAG System', slug: 'rag', icon: Database, price_idr: 'Rp 10–18 jt', price_usd: '$1,500–$3,000', desc: 'Knowledge base dinamis dari katalog produk.' },
      { name: 'n8n Automation', slug: 'n8n', icon: Workflow, price_idr: 'Rp 8–15 jt', price_usd: '$1,200–$2,500', desc: '3–5 workflow custom: order, CRM, email, inventory.' },
      { name: 'Full AI Suite', slug: 'suite', icon: Star, price_idr: 'Rp 22–40 jt', price_usd: '$3,500–$6,500', desc: 'Semua modul di atas — bundled.' },
    ],
    metrics: [
      { label: 'Timeline per module', value: '1–2 minggu' },
      { label: 'Modules available', value: '4' },
      { label: 'Integration type', value: 'Add-on' },
    ],
  },
];

export const metadata: Metadata = {
  title: 'Services — WeeCommerce',
  description: 'From LAUNCH to full AI-powered system. Build from scratch or add AI to your existing store. Transparent pricing, milestone-based payments.',
  alternates: { canonical: '/services' },
  openGraph: { title: 'Services — WeeCommerce', description: 'E-commerce systems with AI chatbot, RAG, and n8n automation.' },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: services.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Service',
            name: s.name,
            description: s.tagline,
            url: `https://weecommerce.web.id/services/${s.slug}`,
          },
        })),
      }} />
      <div className="flex flex-col">
      {/* ── Header ── */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="section-container text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Zap className="size-6" />
          </div>
          <h1 className="mb-3 font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Services
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From platform to full AI-powered system — we have the right entry point for your business.
            <span className="mt-2 block text-sm">
              Dua jalur: bangun dari nol (Jalur A) atau tambah AI ke store existing (Jalur B).
            </span>
          </p>
        </div>
      </section>

      {/* ── Jalur A ── */}
      <section className="border-t border-border bg-card py-20 md:py-24">
        <div className="section-container">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Settings className="size-3" /> Jalur A
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              BUILD — Bangun dari Nol
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Untuk brand yang mau migrasi dari marketplace (Tokopedia, Shopee) atau bangun platform e-commerce dari awal.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.slice(0, 3).map((svc) => (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className="card-lift group relative flex flex-col overflow-visible rounded-2xl border bg-background p-7 transition-all"
              >
                {svc.popular && (
                  <span className="absolute -top-3 right-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-md">
                    ★ Most Popular
                  </span>
                )}
                <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${svc.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:ring-2">
                    <svc.icon className="size-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">{svc.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{svc.tagline}</p>

                  <div className="mt-5 space-y-0.5">
                    <p className="font-mono text-lg font-medium text-primary">{svc.price_idr}</p>
                    <p className="text-xs text-muted-foreground">{svc.timeline} · mulai {svc.price_usd} USD</p>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground/80 line-clamp-3">
                    {svc.description}
                  </p>

                  <div className="mt-4 space-y-1 text-xs">
                    {svc.included?.slice(0, 4).map((f: string) => (
                      <p key={f} className="flex items-center gap-1.5 text-muted-foreground">
                        <Check className="size-3 text-primary" /> {f.length > 40 ? f.slice(0, 40) + '...' : f}
                      </p>
                    ))}
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                    View full details <ArrowRight className="size-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jalur B ── */}
      <section className="border-t border-border py-20 md:py-24">
        <div className="section-container">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Zap className="size-3" /> Jalur B
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              INTEGRATE — AI untuk Existing Store
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Untuk brand yang sudah punya store (Shopify / custom) dan ingin tambah AI tanpa rebuild dari awal.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Zap className="size-7" />
            </div>
            <h3 className="font-display text-xl font-semibold">INTEGRATE — Full AI Suite</h3>
            <p className="mt-1 text-sm text-muted-foreground">Mulai dari Rp 8–40 juta · 2–8 minggu · $1,200–$6,500 USD</p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Add the AI intelligence layer to your existing Shopify or custom platform without rebuilding everything.
              Pilih module yang lo butuh, atau ambil Full AI Suite untuk bundle terbaik.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {services[3].modules?.map((mod) => (
                <a
                  key={mod.name}
                  href={`/ai/${mod.slug}`}
                  className="group flex flex-col items-center rounded-xl border border-border bg-background p-6 text-center transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110">
                    <mod.icon className="size-5" />
                  </div>
                  <h4 className="font-display text-sm font-semibold">{mod.name}</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{mod.desc}</p>
                  <div className="mt-3 space-y-0.5">
                    <p className="font-mono text-sm font-medium text-primary">{mod.price_idr}</p>
                    <p className="text-[10px] text-muted-foreground">{mod.price_usd} USD</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5">
                    View details <ArrowRight className="size-3" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RETAIN ── */}
      <section className="border-t border-border bg-card py-20 md:py-24">
        <div className="section-container">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Ongoing — RETAIN
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              After launch, we offer monthly retainers to keep your system sharp.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {[
              {
                name: 'Basic',
                price_idr: 'Rp 2–3 jt/bln',
                price_usd: '$200–$350/mo',
                features: ['Bug fixes & minor updates', 'Monthly performance report', '48h response time'],
                gradient: 'from-teal-400/10 to-transparent',
              },
              {
                name: 'Advanced',
                price_idr: 'Rp 4–6 jt/bln',
                price_usd: '$400–$700/mo',
                features: ['Everything in Basic', 'AI model re-training', 'n8n workflow maintenance', '24h response time'],
                gradient: 'from-purple-400/10 to-transparent',
                popular: true,
              },
            ].map((plan) => (
              <div key={plan.name} className={`card-lift relative overflow-hidden rounded-2xl border bg-background p-7 ${plan.popular ? 'border-primary/30' : 'border-border'}`}>
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50`} />
                <div className="relative z-10">
                  <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-3 space-y-0.5">
                    <p className="font-mono text-lg font-medium text-primary">{plan.price_idr}</p>
                    <p className="text-xs text-muted-foreground">{plan.price_usd}</p>
                  </div>
                  <ul className="mt-4 space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="size-3 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment & FAQ ── */}
      <section className="border-t border-border py-20 md:py-24">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-3 text-center font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Payment Structure
            </h2>
            <p className="mb-10 text-center text-sm text-muted-foreground">
              All projects are milestone-based. You only pay for completed, approved work.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { phase: 'Kickoff', pct: '50%', trigger: 'Setelah SPK ditandatangani' },
                { phase: 'Staging Delivery', pct: '30%', trigger: 'Preview di-approve klien' },
                { phase: 'Final Launch', pct: '20%', trigger: 'Go-live approval dari klien' },
              ].map((p) => (
                <div key={p.phase} className="rounded-xl border border-border bg-card p-5 text-center">
                  <div className="mb-1 font-mono text-2xl font-medium text-primary">{p.pct}</div>
                  <h3 className="text-sm font-semibold">{p.phase}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{p.trigger}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-3 rounded-2xl border border-border/50 bg-card/50 p-6 text-sm">
              <p className="flex items-start gap-2 text-muted-foreground">
                <Shield className="mt-0.5 size-4 shrink-0 text-primary" />
                <span><strong className="text-foreground">Source code ownership</strong> transferred upon final payment. Full documentation included.</span>
              </p>
              <p className="flex items-start gap-2 text-muted-foreground">
                <Shield className="mt-0.5 size-4 shrink-0 text-primary" />
                <span><strong className="text-foreground">Third-party API & infrastructure costs</strong> (OpenAI, hosting, domain) are NOT included. Client sets up own accounts; WeeCommerce configures. No markups.</span>
              </p>
              <p className="flex items-start gap-2 text-muted-foreground">
                <Shield className="mt-0.5 size-4 shrink-0 text-primary" />
                <span><strong className="text-foreground">International payments</strong> via Wise or Payoneer in USD. Currency locked at contract signing.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border bg-card py-20">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Not Sure Which Tier Fits?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Every project starts with a 30-minute discovery call. We'll help you figure out the right scope.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90"
            >
              Book a Discovery Call <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-11 items-center rounded-full border border-border bg-background px-7 text-sm font-medium hover:bg-card"
            >
              Compare Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
