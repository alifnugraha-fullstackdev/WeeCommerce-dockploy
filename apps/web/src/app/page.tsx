import { HeroSection, LogosSection } from '@/components/ui/hero-1';
import { Timeline } from '@/components/ui/timeline';
import {
  ArrowRight,
  Bot,
  Database,
  Workflow,
  Building2,
  Target,
	  Gauge,
	  Zap,
  BarChart3,
  MessageCircle,
  ShoppingCart,
  Shield,
  Headphones,
} from 'lucide-react';
import Link from 'next/link';

const differentiators = [
  {
    icon: Bot,
    title: 'AI-Native, Not AI-Added',
    desc: 'Every system is designed with AI integration from the first line of architecture. Chatbot, RAG, automation — all first-class citizens, not afterthoughts.',
    gradient: 'from-teal-400/10 via-teal-400/5 to-transparent',
  },
  {
    icon: Target,
    title: 'Specialist, Not Generalist',
    desc: 'WeeCommerce does one thing: e-commerce systems. We don\'t do branding, social media, or graphic design. This focus translates to deeper expertise and faster delivery.',
    gradient: 'from-blue-400/10 via-blue-400/5 to-transparent',
  },
  {
    icon: Building2,
    title: 'End-to-End Ownership',
    desc: 'From discovery to deployment — one team handles the full scope. No handoffs, no lost context, no \'that\'s not our department.\' You have one point of contact throughout.',
    gradient: 'from-violet-400/10 via-violet-400/5 to-transparent',
  },
  {
    icon: Gauge,
    title: 'Built to Scale',
    desc: 'Architecture decisions are made with your next phase in mind. The system you launch with still performs when you 10x your order volume — without a full rebuild.',
    gradient: 'from-orange-400/10 via-orange-400/5 to-transparent',
  },
];

const capabilities = [
  {
    icon: Database,
    title: 'RAG System',
    desc: 'Dynamic knowledge base trained on your product catalog, FAQs, and policies. Customer queries get accurate, contextual answers drawn directly from your data.',
    impact: 'Eliminates repetitive CS queries. Scales product knowledge without manual updates.',
  },
  {
    icon: Bot,
    title: 'AI Customer Service Chatbot',
    desc: 'Custom-trained on your specific products, brand voice, and FAQ library. Handles common inquiries 24/7, escalates edge cases to your team.',
    impact: 'Reduces CS workload by 60–80% on routine inquiries. Available across web, WhatsApp, and messaging channels.',
  },
  {
    icon: Workflow,
    title: 'Automation Workflows (n8n)',
    desc: 'Connect your store to the tools you already use. Order notifications, CRM sync, inventory alerts, abandoned cart recovery, post-purchase email sequences.',
    impact: 'Replaces manual operations. Scales without adding headcount.',
  },
];

const services = [
  {
    name: 'LAUNCH',
    tagline: 'Platform only',
    desc: 'Custom e-commerce storefront (Next.js + Supabase). Product catalog, cart, checkout flow, payment gateway (Midtrans/Stripe), shipping integration, admin dashboard, mobile responsive, basic SEO. AI layer: not included.',
    price_idr: 'Rp 15–25 jt',
    price_usd: '$2,500–$4,000',
    timeline: '4–6 minggu',
    slug: 'launch',
    features: ['Custom storefront', 'Payment gateway', 'Admin dashboard', 'Mobile responsive'],
    popular: false,
  },
  {
    name: 'CONVERT',
    tagline: 'Platform + AI',
    desc: 'Everything in LAUNCH, plus: AI Customer Service Chatbot (trained on your products & FAQ), RAG Knowledge Base (dynamic product Q&A), Basic n8n Automation (order notifications, follow-up, low stock alerts).',
    price_idr: 'Rp 38–55 jt',
    price_usd: '$6,000–$9,000',
    timeline: '7–10 minggu',
    slug: 'convert',
    features: ['Semua LAUNCH', 'AI Chatbot', 'RAG Knowledge Base', 'n8n Automation'],
    popular: true,
  },
  {
    name: 'SCALE',
    tagline: 'Full system',
    desc: 'Everything in CONVERT, plus: Advanced n8n Suite (CRM sync, abandoned cart, post-purchase email, inventory automation), AI Analytics Dashboard, multi-channel integration (WhatsApp Business API), performance optimization.',
    price_idr: 'Rp 70–120 jt',
    price_usd: '$11,000–$20,000',
    timeline: '10–16 minggu',
    slug: 'scale',
    features: ['Semua CONVERT', 'Advanced n8n', 'AI Analytics', 'Multi-channel'],
    popular: false,
  },
  {
    name: 'INTEGRATE',
    tagline: 'AI untuk existing store',
    desc: 'For brands that already have a Shopify or custom platform. Add the AI intelligence layer without rebuilding everything. Modules: AI Chatbot, RAG System, n8n Automation, or the full bundled AI Suite.',
    price_idr: 'Rp 8–40 jt',
    price_usd: '$1,200–$6,500',
    timeline: '2–8 minggu',
    slug: 'integrate',
    features: ['AI Chatbot', 'RAG System', 'n8n Workflows', 'Bundled AI Suite'],
    popular: false,
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <LogosSection />

      {/* ═══ Why WeeCommerce ═══ */}
          <section className="border-t border-border py-24">
        <div className="section-container">
          <h2 className="mb-3 text-center font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Why WeeCommerce
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-lg text-muted-foreground">
            Most agencies build you a store. We build you a system.
            <span className="mt-1 block text-sm">
              The difference is felt when your order volume triples, your CS team is overwhelmed,
              and your platform still works as if nothing changed.
            </span>
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {differentiators.map((d) => (
              <div
                key={d.title}
                className="glass-hover group relative flex flex-col items-center overflow-hidden rounded-2xl border p-8 text-center"
              >
                {/* Gradient background accent */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${d.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:ring-2">
                    <d.icon className="size-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold md:text-xl">{d.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground/90">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Services Overview ═══ */}
          <section className="border-t border-border bg-card py-24">
        <div className="section-container">
          <div className="text-center">
            <div className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Services
            </div>
            <h2 className="mb-3 text-center font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Two Paths, One Mission
            </h2>
            <p className="mx-auto mb-14 max-w-2xl text-center text-muted-foreground">
              Whether you&apos;re building from scratch or adding AI to your existing store — we have the right entry point.
            </p>
          </div>

          {/* Jalur A — BUILD */}
          <div className="mb-14">
            <h3 className="mb-6 text-center font-display text-lg font-semibold tracking-tight md:text-xl">
              <span className="inline-flex h-6 items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">A</span>{' '}
              Build
              <span className="ml-2 text-sm font-normal text-muted-foreground">— Bangun dari nol / migrasi dari marketplace</span>
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {services.slice(0, 3).map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="card-lift group relative flex flex-col overflow-visible rounded-2xl border bg-background p-7"
                >
                  {svc.popular && (
                    <span className="absolute -top-3 right-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-md">
                      ★ Most Popular
                    </span>
                  )}
                  <div className="mb-3">
                    <h4 className="font-display text-xl font-semibold tracking-tight">{svc.name}</h4>
                    <p className="mt-0.5 text-sm text-muted-foreground">{svc.tagline}</p>
                  </div>
                  <div className="mb-4 space-y-0.5">
                    <p className="font-mono text-xl font-medium text-primary">{svc.price_idr}</p>
                    <p className="text-xs text-muted-foreground">{svc.timeline} · mulai {svc.price_usd} USD</p>
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-xl bg-surface-2/60 px-4 py-3">
                    {svc.features.map((f) => (
                      <span key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="text-primary">✓</span> {f}
                      </span>
                    ))}
                  </div>
                  <p className="mb-4 text-xs leading-relaxed text-muted-foreground/70 line-clamp-3">
                    {svc.desc}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                    Learn more <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Jalur B — INTEGRATE */}
          <div>
            <h3 className="mb-6 text-center font-display text-lg font-semibold tracking-tight md:text-xl">
              <span className="inline-flex h-6 items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">B</span>{' '}
              Integrate
              <span className="ml-2 text-sm font-normal text-muted-foreground">— AI & Automation untuk existing store</span>
            </h3>
            <Link
              href="/services/integrate"
              className="card-lift group flex items-center justify-between gap-6 rounded-2xl border bg-background p-7"
            >
              <div className="flex min-w-0 items-center gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Zap className="size-6" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-semibold">INTEGRATE</h4>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    AI Chatbot · RAG System · n8n Workflows · Full AI Suite
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground/70 max-w-lg line-clamp-2">
                    Add the AI intelligence layer to your existing Shopify or custom platform without rebuilding everything.
                    Modules available individually or as a bundled suite.
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-lg font-medium text-primary">Rp 8–40 jt</p>
                <p className="text-xs text-muted-foreground">$1,200–$6,500</p>
                <p className="text-xs text-muted-foreground">2–8 minggu</p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Compare all tiers <BarChart3 className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ AI Capabilities ═══ */}
          <section className="border-t border-border py-24">
        <div className="section-container">
          <h2 className="mb-3 text-center font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            AI Capabilities
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-lg text-muted-foreground">
            AI integration is not a feature we offer — it is the foundation of how we build.
            <span className="mt-1 block text-sm">
              Every system we architect is designed with the assumption that intelligence should be embedded, not added later.
            </span>
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="glass-hover group relative flex flex-col items-center overflow-hidden rounded-2xl border p-8 text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:ring-2">
                  <c.icon className="size-6" />
                </div>
                <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground/90">{c.desc}</p>
                <div className="mt-6 w-full rounded-xl border border-border/50 bg-surface-2/60 px-4 py-4 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Business Impact:</span>{' '}
                  {c.impact}
                </div>
              </div>
            ))}
          </div>

          {/* Fine-tuning note */}
          <div className="mt-8 rounded-2xl glass p-6 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Note on fine-tuning:</span>{' '}
              Fine-tuning is not suitable for every project. It requires substantial training data
              and compute resources. We always conduct a data audit before proposing it — and we will
              tell you honestly if RAG or prompt engineering will serve you better.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Portfolio Showcase ═══ */}
          <section className="border-t border-border py-24">
        <div className="section-container">
          <div className="text-center">
            <h2 className="mb-3 font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Recent Work
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
              Real projects. Real results. See what WeeCommerce can build.
            </p>
          </div>

          <div className="relative">
            {/* Scrollable container */}
            <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
              {[
                {
                  title: 'NexaMart — AI E-Commerce',
                  client: 'Internal Demo',
                  summary: 'Flagship project — full AI e-commerce platform with RAG, chatbot, n8n automation.',
                  tech: ['Next.js', 'Supabase', 'n8n', 'OpenAI'],
                  metric: '−80% CS time',
                  slug: 'nexamart-ai-ecommerce',
                },
                {
                  title: 'Amuleie — Jewelry Store',
                  client: 'Amuleie',
                  summary: 'Bespoke e-commerce platform for a high-end jewelry brand with AI customer service.',
                  tech: ['Next.js', 'Supabase', 'OpenAI'],
                  metric: '60% auto-CS',
                  slug: 'amuleie-ecommerce',
                },
              ].map((item, i) => (
                <Link
                  key={item.slug}
                  href={`/portfolio/${item.slug}`}
                  className="group relative flex w-[85vw] shrink-0 snap-center flex-col rounded-2xl border bg-card p-7 transition-all hover:border-primary/30 md:w-[400px]"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                      Project {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.client}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tech.map((t) => (
                      <span key={t} className="rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">{t}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                    <span className="font-mono text-sm font-medium text-primary">{item.metric}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-all group-hover:text-foreground">
                      View case study <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Scroll hint */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-card">←</span>
              <span>Scroll to browse</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-card">→</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/portfolio"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background hover:bg-foreground/90"
            >
              View All Projects <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ How We Work ═══ */}
          <section className="border-t border-border py-24">
        <div className="section-container">
          <h2 className="mb-3 text-center font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            How We Work
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-muted-foreground">
            Every engagement follows a structured process designed to reduce ambiguity, protect
            your investment, and ship clean systems on time.
          </p>
          <Timeline />
        </div>
      </section>

      {/* ═══ Client Value Props ═══ */}
          <section className="border-t border-border bg-card py-24">
        <div className="section-container">
          <h2 className="mb-3 text-center font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            What&apos;s Always Included
          </h2>
          <div className="mx-auto mb-14 grid max-w-4xl gap-4 md:grid-cols-3">
            {[
              { icon: Shield, title: 'Source Code Ownership', desc: 'Transferred upon final payment. Full documentation included.' },
              { icon: Headphones, title: '30-Day Support', desc: 'Post-launch bug fixes and minor updates — always free.' },
              { icon: MessageCircle, title: 'One Point of Contact', desc: 'Direct communication, async updates, no account managers.' },
            ].map((v) => (
              <div key={v.title} className="glass-hover rounded-2xl border p-5 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <v.icon className="size-5" />
                </div>
                <h3 className="font-display text-sm font-semibold">{v.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-3 text-center font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            What&apos;s Never Included
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-center text-sm text-muted-foreground">
            Unless agreed separately, these are outside project scope:
          </p>
          <div className="mx-auto grid max-w-3xl gap-3 md:grid-cols-3">
            {[
              'Copywriting or content creation',
              'Product photography or graphic design',
              'Paid marketing or SEO campaigns',
              'Third-party API subscription costs',
              'Domain registration & hosting fees',
              'Fine-tuning (always custom quote)',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-xs text-muted-foreground">
                <span className="text-destructive/70">✗</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Pricing Summary ═══ */}
          <section className="border-t border-border py-24">
        <div className="section-container text-center">
          <h2 className="mb-3 font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mb-4 max-w-xl text-muted-foreground">
            All prices are starting points. We scope each project individually after a 30-minute discovery call.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {[
              { tier: 'LAUNCH', idr: 'Rp 15 jt', usd: '$2.5k' },
              { tier: 'CONVERT', idr: 'Rp 38 jt', usd: '$6k' },
              { tier: 'SCALE', idr: 'Rp 70 jt', usd: '$11k' },
              { tier: 'INTEGRATE', idr: 'Rp 8 jt', usd: '$1.2k' },
            ].map((p) => (
              <div
                key={p.tier}
                className="glass-hover rounded-2xl border px-5 py-4 text-center"
              >
                <p className="font-display text-sm font-semibold">{p.tier}</p>
                <p className="mt-1 font-mono text-base font-medium text-primary">{p.idr}</p>
                <p className="text-[10px] text-muted-foreground">mulai {p.usd} USD</p>
              </div>
            ))}
          </div>
          <Link
            href="/pricing"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View Full Pricing <ArrowRight className="size-4" />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            All prices exclude third-party API costs (OpenAI, hosting, domain) — passed through at cost, no markup.
          </p>
        </div>
      </section>

      {/* ═══ Final CTA ═══ */}
          <section className="border-t border-border bg-card py-24">
        <div className="section-container text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Let&apos;s Build Something That Works
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every project starts with a 30-minute conversation. No sales pitch — just us
              understanding your business and being honest about whether we&apos;re the right fit.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90"
              >
                Start Your Project <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex h-11 items-center rounded-full border border-border bg-background px-7 text-sm font-medium hover:bg-accent"
              >
                See Our Work
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShoppingCart className="size-3" /> 30-min discovery
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1">
                <BarChart3 className="size-3" /> Proposal within 48h
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1">
                <Shield className="size-3" /> Milestone-based payments
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

