import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Check, ArrowRight, HelpCircle, Clock, Shield, Star, Zap, Sparkles,
} from 'lucide-react';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Pricing — WeeCommerce E-Commerce Tiers',
  description: 'Transparent IDR + USD pricing for LAUNCH, CONVERT, SCALE, INTEGRATE. Milestone-based payments. No hidden fees.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing — WeeCommerce',
    description: 'LAUNCH from Rp 15jt. CONVERT from Rp 38jt. SCALE from Rp 70jt. INTEGRATE from Rp 8jt.',
  },
};

const tiers = [
  {
    slug: 'launch',
    name: 'LAUNCH',
    tagline: 'Platform only',
    desc: 'Custom e-commerce storefront. Payment gateway, admin dashboard, mobile responsive. Tanpa AI.',
    idr: { min: 15_000_000, max: 25_000_000, label: 'Rp 15–25 juta' },
    usd: { min: 2500, max: 4000, label: '$2,500–$4,000' },
    timeline: '4–6 minggu',
    popular: false,
    bestFor: 'Brand migrasi dari marketplace',
    features: [
      { text: 'Custom storefront (Next.js + Supabase)', inc: true },
      { text: 'Product catalog, cart, checkout', inc: true },
      { text: 'Payment gateway (Midtrans / Stripe)', inc: true },
      { text: 'Shipping integration', inc: true },
      { text: 'Admin dashboard', inc: true },
      { text: 'Mobile responsive + SEO', inc: true },
      { text: 'AI Chatbot', inc: false },
      { text: 'RAG Knowledge Base', inc: false },
      { text: 'n8n Automation', inc: false },
    ],
    highlightFeature: 'Own platform. Zero marketplace dependency.',
  },
  {
    slug: 'convert',
    name: 'CONVERT',
    tagline: 'Platform + AI',
    desc: 'Semua LAUNCH + AI Chatbot, RAG, n8n. CS otomatis 24/7 tanpa tambah tim.',
    idr: { min: 38_000_000, max: 55_000_000, label: 'Rp 38–55 juta' },
    usd: { min: 6000, max: 9000, label: '$6,000–$9,000' },
    timeline: '7–10 minggu',
    popular: true,
    bestFor: 'Brand siap automate CS & operasional',
    features: [
      { text: 'Everything in LAUNCH', inc: true },
      { text: 'AI Customer Service Chatbot', inc: true },
      { text: 'RAG Knowledge Base', inc: true },
      { text: 'Basic n8n Automation', inc: true },
      { text: 'Advanced n8n Suite', inc: false },
      { text: 'AI Analytics Dashboard', inc: false },
      { text: 'Multi-channel integration', inc: false },
    ],
    highlightFeature: 'CS workload turun 60–80%. ROI dalam minggu pertama.',
  },
  {
    slug: 'scale',
    name: 'SCALE',
    tagline: 'Full system',
    desc: 'Semua CONVERT + advanced n8n, AI analytics, multi-channel, performance optimization.',
    idr: { min: 70_000_000, max: 120_000_000, label: 'Rp 70–120 juta' },
    usd: { min: 11000, max: 20000, label: '$11,000–$20,000' },
    timeline: '10–16 minggu',
    popular: false,
    bestFor: 'Brand building full commerce infrastructure',
    features: [
      { text: 'Everything in CONVERT', inc: true },
      { text: 'Advanced n8n Suite (CRM, abandoned cart, post-purchase, inventory)', inc: true },
      { text: 'AI Analytics Dashboard', inc: true },
      { text: 'Multi-channel (WhatsApp Business API, email)', inc: true },
      { text: 'AI Chatbot + RAG + n8n', inc: true, note: 'unlimited' },
    ],
    highlightFeature: 'Scale tanpa nambah orang. 40+ jam/minggu ter-automate.',
  },
  {
    slug: 'integrate',
    name: 'INTEGRATE',
    tagline: 'AI untuk existing store',
    desc: 'Tambah AI ke Shopify / platform existing. Module-based. Mulai dari Rp 8jt.',
    idr: { min: 8_000_000, max: 40_000_000, label: 'Rp 8–40 juta' },
    usd: { min: 1200, max: 6500, label: '$1,200–$6,500' },
    timeline: '2–8 minggu',
    popular: false,
    bestFor: 'Existing store butuh AI layer',
    features: [
      { text: 'AI Chatbot module', inc: true },
      { text: 'RAG System module', inc: true },
      { text: 'n8n Automation module', inc: true },
      { text: 'Full AI Suite (bundled)', inc: true },
      { text: 'Rebuild existing store', inc: false },
    ],
    highlightFeature: 'Gak perlu rebuild. AI jalan di store lo yang udah ada.',
  },
];

const addOns = [
  { name: 'Fine-Tuning', desc: 'Custom model training on your proprietary data. Requires data audit.', price: 'Custom quote' },
  { name: 'Dedicated VPS Setup', desc: 'Private server for higher performance & security.', price: 'Rp 500rb–2jt/bln' },
  { name: 'Additional n8n Workflows', desc: 'Beyond the included workflows.', price: 'Rp 3–5jt/workflow' },
];

const faqs = [
  { q: 'Apakah ada biaya tersembunyi?', a: 'Tidak. Semua biaya transparan di proposal. Yang tidak termasuk: third-party API costs (OpenAI, hosting, domain) — ini ditanggung klien, kami yang configure. Tidak ada markup.' },
  { q: 'Kenapa ada range harga?', a: 'Setiap project beda kompleksitas: jumlah produk, integrasi pihak ketiga, desain custom. Range harga mencerminkan fleksibilitas ini. Harga final ditentukan setelah discovery call.' },
  { q: 'Bagaimana sistem pembayaran?', a: 'Milestone-based: 50% DP setelah SPK, 30% staging delivery, 20% final launch. Internasional via Wise/Payoneer dalam USD.' },
  { q: 'Bisa upgrade dari LAUNCH ke CONVERT nanti?', a: 'Bisa. Arsitektur dibuat modular — upgrade path jelas tanpa rebuild. Biaya upgrade dihitung proporsional.' },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* ════════════════════════════════════════════════════════════
           1. HEADER
      ════════════════════════════════════════════════════════════ */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="section-container text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Zap className="size-6" />
          </div>
          <h1 className="mb-3 font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            All prices are starting points. We scope each project individually after a 30-minute discovery call.
            <span className="mt-2 block text-sm">What you see is what you get. No hidden fees. No surprise charges.</span>
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
           2. PRICING TABLE
      ════════════════════════════════════════════════════════════ */}
      <section className="border-t border-border bg-card py-16 md:py-20">
        <div className="section-container">
          <div className="mx-auto max-w-6xl">
            {/* Pricing cards grid */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {tiers.map((tier) => (
                <div
                  key={tier.slug}
                  className={`relative flex flex-col rounded-2xl border bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${
                    tier.popular ? 'border-primary/40 shadow-md ring-1 ring-primary/20 scale-[1.02] lg:scale-105' : 'border-border'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground shadow-md whitespace-nowrap">
                        <Sparkles className="size-3" /> Most Popular
                      </span>
                    </div>
                  )}

                  {/* Tier header */}
                  <div className="mb-5 text-center">
                    <h2 className="font-display text-xl font-semibold tracking-tight">{tier.name}</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">{tier.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-5 text-center">
                    <div className="space-y-0.5">
                      <p className="font-mono text-2xl font-medium text-primary">{tier.idr.label}</p>
                      <p className="text-xs text-muted-foreground">{tier.usd.label} USD · {tier.timeline}</p>
                    </div>
                  </div>

                  {/* Highlight */}
                  <div className="mb-5 rounded-lg bg-primary/5 px-4 py-3 text-center">
                    <p className="text-xs font-medium text-primary leading-relaxed">{tier.highlightFeature}</p>
                  </div>

                  {/* Features */}
                  <ul className="mb-6 space-y-2.5 flex-1">
                    {tier.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5 text-xs">
                        <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ${
                          f.inc ? 'bg-primary/10 text-primary' : 'bg-muted/20 text-muted-foreground/50'
                        }`}>
                          {f.inc ? <Check className="size-3" /> : <span className="text-[9px]">✗</span>}
                        </span>
                        <span className={f.inc ? 'text-foreground' : 'text-muted-foreground/60 line-through'}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={`/services/${tier.slug}`}
                    className={`inline-flex h-10 w-full items-center justify-center rounded-full text-sm font-medium transition-all ${
                      tier.popular
                        ? 'bg-foreground text-background hover:bg-foreground/90'
                        : 'border border-border bg-card text-foreground hover:bg-card/80'
                    }`}
                  >
                    {tier.popular ? 'Get Started →' : 'View Details'}
                  </Link>
                </div>
              ))}
            </div>

            {/* Note */}
            <p className="mt-8 text-center text-xs text-muted-foreground">
              <Shield className="mr-1 inline size-3 text-primary" />
              All prices exclude third-party API & infrastructure costs (OpenAI, hosting, domain).
              These are passed through at cost — no markups.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
           3. COMPARISON TABLE (Desktop + Mobile)
      ════════════════════════════════════════════════════════════ */}
      <section className="border-t border-border py-16 md:py-20">
        <div className="section-container">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-3 text-center font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Detailed Comparison
            </h2>
            <p className="mb-10 text-center text-sm text-muted-foreground">
              See exactly what each tier includes — and what it doesn&apos;t.
            </p>

            {/* Desktop table — hidden on mobile */}
            <div className="hidden overflow-hidden rounded-2xl border border-border md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-card">
                    <th className="p-4 text-left font-medium">Feature</th>
                    {tiers.map((t) => (
                      <th key={t.slug} className={`p-4 text-center font-display text-sm font-semibold ${t.popular ? 'bg-primary/5' : ''}`}>
                        <div className="flex items-center justify-center gap-1.5">
                          {t.name}
                          {t.popular && <Star className="size-3 text-primary" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr className="bg-card/30">
                    <td className="p-4 font-medium">Investment</td>
                    {tiers.map((t) => (
                      <td key={t.slug} className={`p-4 text-center font-mono text-xs ${t.popular ? 'bg-primary/5' : ''}`}>
                        <span className="text-primary font-medium">{t.idr.label}</span>
                        <br />
                        <span className="text-muted-foreground">{t.usd.label}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Timeline</td>
                    {tiers.map((t) => (
                      <td key={t.slug} className={`p-4 text-center text-xs ${t.popular ? 'bg-primary/5' : ''}`}>{t.timeline}</td>
                    ))}
                  </tr>
                  <tr className="bg-card/30">
                    <td className="p-4 font-medium">Best For</td>
                    {tiers.map((t) => (
                      <td key={t.slug} className={`p-4 text-center text-xs text-muted-foreground ${t.popular ? 'bg-primary/5' : ''}`}>{t.bestFor}</td>
                    ))}
                  </tr>
                  {/* Feature rows — explicit matrix */}
                  {[
                    { label: 'Custom storefront (Next.js + Supabase)', launch: true, convert: true, scale: true, integrate: false },
                    { label: 'Payment gateway (Midtrans / Stripe)', launch: true, convert: true, scale: true, integrate: false },
                    { label: 'Admin dashboard', launch: true, convert: true, scale: true, integrate: false },
                    { label: 'Mobile responsive + SEO', launch: true, convert: true, scale: true, integrate: false },
                    { label: 'AI Customer Service Chatbot', launch: false, convert: true, scale: true, integrate: true },
                    { label: 'RAG Knowledge Base', launch: false, convert: true, scale: true, integrate: true },
                    { label: 'Basic n8n Automation', launch: false, convert: true, scale: true, integrate: true },
                    { label: 'Advanced n8n Suite', launch: false, convert: false, scale: true, integrate: false },
                    { label: 'AI Analytics Dashboard', launch: false, convert: false, scale: true, integrate: false },
                    { label: 'Multi-channel integration', launch: false, convert: false, scale: true, integrate: false },
                  ].map((row) => (
                    <tr key={row.label} className="border-t border-border/30">
                      <td className="p-3.5 text-xs text-muted-foreground">{row.label}</td>
                      {['launch', 'convert', 'scale', 'integrate'].map((slug) => {
                        const included = row[slug as keyof typeof row] as boolean;
                        return (
                          <td key={slug} className={`p-3.5 text-center ${slug === 'convert' ? 'bg-primary/5' : ''}`}>
                            {included ? (
                              <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/10">
                                <Check className="size-3 text-primary" />
                              </span>
                            ) : (
                              <span className="text-muted-foreground/30">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile accordion cards */}
            <div className="space-y-4 md:hidden">
              {tiers.map((tier) => (
                <details key={tier.slug} className="group rounded-xl border border-border bg-card overflow-hidden">
                  <summary className="flex cursor-pointer items-center justify-between p-4 list-none">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-semibold">{tier.name}</span>
                        {tier.popular && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">Popular</span>}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{tier.idr.label} · {tier.timeline}</p>
                    </div>
                    <HelpCircle className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-border px-4 py-4 space-y-2.5">
                    {tier.features.map((f) => (
                      <div key={f.text} className="flex items-center gap-2 text-xs">
                        <span className={f.inc ? 'text-primary' : 'text-muted-foreground/40'}>
                          {f.inc ? '✓' : '✗'}
                        </span>
                        <span className={f.inc ? '' : 'text-muted-foreground/50 line-through'}>{f.text}</span>
                      </div>
                    ))}
                    <Link href={`/services/${tier.slug}`} className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full border border-border bg-background text-xs font-medium hover:bg-card">
                      Full details →
                    </Link>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
           4. INTEGRATE MODULES
      ════════════════════════════════════════════════════════════ */}
      <section className="border-t border-border bg-card py-16 md:py-20">
        <div className="section-container">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">INTEGRATE — Module Pricing</h2>
            <p className="mb-10 text-sm text-muted-foreground">For existing Shopify or custom stores. Add AI without rebuilding.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'AI Chatbot', price: 'Rp 8–15 jt', usd: '$1,200–$2,500', desc: 'Training + integrasi website & WhatsApp', icon: '🤖' },
                { name: 'RAG System', price: 'Rp 10–18 jt', usd: '$1,500–$3,000', desc: 'Knowledge base real-time dari katalog', icon: '🧠' },
                { name: 'n8n Automation', price: 'Rp 8–15 jt', usd: '$1,200–$2,500', desc: '3–5 custom workflow (CRM, order, inventory)', icon: '⚡' },
                { name: 'Full AI Suite', price: 'Rp 22–40 jt', usd: '$3,500–$6,500', desc: 'Semua module bundled. Hemat 30–40%', icon: '✨' },
              ].map((m) => (
                <Link key={m.name} href={`/ai/${m.name.toLowerCase().includes('chatbot') ? 'chatbot' : m.name.toLowerCase().includes('rag') ? 'rag' : m.name.toLowerCase().includes('n8n') ? 'n8n' : 'suite'}`}
                  className="group flex flex-col items-center rounded-xl border border-border bg-background p-6 text-center transition-all hover:border-primary/30 hover:-translate-y-0.5">
                  <span className="mb-3 text-2xl">{m.icon}</span>
                  <h3 className="font-display text-sm font-semibold">{m.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                  <div className="mt-3 space-y-0.5">
                    <p className="font-mono text-sm font-medium text-primary">{m.price}</p>
                    <p className="text-[10px] text-muted-foreground">{m.usd} USD</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
           5. ADD-ONS
      ════════════════════════════════════════════════════════════ */}
      <section className="border-t border-border py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-3 font-display text-xl font-semibold tracking-tight md:text-2xl">Add-Ons & Extras</h2>
            <p className="mb-8 text-sm text-muted-foreground">Optional enhancements — only if you need them.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {addOns.map((a) => (
                <div key={a.name} className="rounded-xl border border-border bg-card p-5 text-center">
                  <h3 className="font-display text-sm font-semibold">{a.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
                  <p className="mt-3 font-mono text-sm font-medium text-primary">{a.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
           6. PAYMENT STRUCTURE
      ════════════════════════════════════════════════════════════ */}
      <section className="border-t border-border bg-card py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-3 font-display text-xl font-semibold tracking-tight md:text-2xl">Payment Structure</h2>
            <p className="mb-8 text-sm text-muted-foreground">Milestone-based. You only pay for completed, approved work.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { phase: 'Kickoff', pct: '50%', trigger: 'Setelah SPK ditandatangani' },
                { phase: 'Staging Delivery', pct: '30%', trigger: 'Preview di-approve klien' },
                { phase: 'Final Launch', pct: '20%', trigger: 'Go-live approval' },
              ].map((p) => (
                <div key={p.phase} className="rounded-xl border border-border bg-background p-5">
                  <p className="font-mono text-3xl font-medium text-primary">{p.pct}</p>
                  <p className="mt-1 text-sm font-semibold">{p.phase}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.trigger}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Shield className="size-3 text-primary" /> Internasional: Wise / Payoneer (USD)</span>
              <span className="flex items-center gap-1"><Shield className="size-3 text-primary" /> Source code ownership setelah pelunasan</span>
              <span className="flex items-center gap-1"><Shield className="size-3 text-primary" /> 30 hari post-launch support gratis</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
           7. FAQ
      ════════════════════════════════════════════════════════════ */}
      <section className="border-t border-border py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center font-display text-xl font-semibold tracking-tight md:text-2xl">Pricing FAQ</h2>
            <JsonLd data={{
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }} />
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-xl border border-border bg-card overflow-hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-2 p-5 text-sm font-medium list-none">
                    <span>{faq.q}</span>
                    <HelpCircle className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
           8. CTA
      ════════════════════════════════════════════════════════════ */}
      <section className="border-t border-border bg-card py-20">
        <div className="section-container text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Not Sure Which Tier Fits?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            We&apos;ll help you figure it out — and be honest if we&apos;re not the right fit.
            Every project starts with a free 30-minute discovery call.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90">
              Book a Discovery Call <ArrowRight className="size-4" />
            </Link>
            <Link href="/services" className="inline-flex h-11 items-center rounded-full border border-border bg-background px-7 text-sm font-medium hover:bg-card">
              View Service Details
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="size-3" /> 30-min call</span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1"><Star className="size-3" /> Proposal within 48h</span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1"><Shield className="size-3" /> No pressure, no push</span>
          </div>
        </div>
      </section>
    </div>
  );
}
