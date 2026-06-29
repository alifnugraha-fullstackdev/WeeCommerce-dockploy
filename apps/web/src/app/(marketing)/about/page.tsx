import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Target, Bot, Gauge, Quote, Mail } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'About — WeeCommerce E-Commerce Systems Agency',
  description: 'WeeCommerce is a specialist e-commerce agency building AI-powered systems. Custom Next.js + Supabase platforms with RAG, AI chatbot, and n8n automation.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About — WeeCommerce', description: 'Specialist e-commerce agency at the intersection of AI and automation.' },
  other: { 'ai:author': 'Alif Nugraha', 'ai:published-date': '2026-01-01' },
};

const differentiators = [
  {
    icon: Bot, title: 'AI-Native, Not AI-Added',
    desc: 'Every system we build is designed with AI integration from the first line of architecture. Chatbot, RAG, automation — all first-class citizens, not afterthoughts.',
  },
  {
    icon: Target, title: 'Specialist, Not Generalist',
    desc: 'WeeCommerce does one thing: e-commerce systems. We don\'t do branding, social media, or graphic design. This focus translates to deeper expertise and faster delivery.',
  },
  {
    icon: Building2, title: 'End-to-End Ownership',
    desc: 'From discovery to deployment — one team handles the full scope. No handoffs, no lost context. You have one point of contact throughout the project.',
  },
  {
    icon: Gauge, title: 'Built to Scale',
    desc: 'Architecture decisions are made with your next phase in mind. The system you launch with should still perform when you 10x your order volume — without a full rebuild.',
  },
];

const milestones = [
  { year: '2026 Q1', title: 'WeeCommerce Founded', desc: 'Alif Nugraha founded WeeCommerce with a vision: make enterprise-grade AI e-commerce accessible for Indonesian brands.' },
  { year: '2026 Q2', title: 'NexaMart Launch', desc: 'Flagship AI e-commerce platform launched — showcasing full WeeCommerce stack with RAG, chatbot, and n8n automation.' },
  { year: '2026 Q3', title: 'First Client Projects', desc: 'Delivered custom platforms for brands migrating off marketplace dependency, with measurable results.' },
  { year: '2026 Q4+', title: 'Scale & International', desc: 'Expanding to international markets, client portal, knowledge base, and AI-powered search.' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* ═══ Hero ═══ */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="section-container">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Building2 className="size-8" />
            </div>
            <h1 className="mb-4 font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              We build e-commerce <span className="text-primary">systems</span>, not websites.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Specialist agency at the intersection of custom development, artificial intelligence, and business automation. 
              Founded by <strong className="text-foreground">Alif Nugraha</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Story ═══ */}
      <section className="border-t border-border bg-card py-20">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Our Story</div>
            <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">Why WeeCommerce Exists</h2>
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              <p>
                <strong className="text-foreground">Marketplace dependency is a trap.</strong> Fee naik terus, algoritma berubah kapan aja, 
                dan data customer bukan milik lo. Tapi selama ini, satu-satunya alternatif adalah agency mahal atau template Shopify yang terbatas.
              </p>
              <p>
                WeeCommerce hadir untuk menjembatani gap itu. Kami membangun custom e-commerce platform dengan 
                <strong className="text-foreground"> kekuatan AI dan automation</strong> — dengan harga yang masuk akal untuk brand Indonesia.
              </p>
              <p>
                Setiap sistem yang kami bangun dirancang dengan asumsi bahwa <strong className="text-foreground">intelligence harus di-embed sejak awal</strong>, 
                bukan ditambahkan sebagai afterthought. Chatbot, RAG, n8n automation — semuanya first-class citizens, bukan feature tempelan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ What We Are vs What We Are Not ═══ */}
      <section className="border-t border-border py-20">
        <div className="section-container">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-3 text-center font-display text-2xl font-semibold tracking-tight md:text-3xl">What We Are</h2>
            <p className="mb-10 text-center text-muted-foreground">And what we&apos;re not.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10"><span className="text-xs text-primary">✓</span></span>
                  <span className="text-sm font-medium">E-commerce specialist agency</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10"><span className="text-xs text-primary">✓</span></span>
                  <span className="text-sm font-medium">Custom development + AI integration</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10"><span className="text-xs text-primary">✓</span></span>
                  <span className="text-sm font-medium">End-to-end system ownership</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10"><span className="text-xs text-primary">✓</span></span>
                  <span className="text-sm font-medium">Built for scale from day one</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  'A generic digital agency',
                  'A template shop',
                  'A build-and-disappear vendor',
                  'A quick-launch freelancer platform',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/30 px-5 py-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted/20"><span className="text-xs text-muted-foreground/50">✗</span></span>
                    <span className="text-sm text-muted-foreground/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Differentiators ═══ */}
      <section className="border-t border-border bg-card py-20">
        <div className="section-container">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-3 text-center font-display text-2xl font-semibold tracking-tight md:text-3xl">Why WeeCommerce</h2>
            <p className="mb-10 text-center text-muted-foreground">Four things that make us different.</p>
            <div className="grid gap-5 md:grid-cols-2">
              {differentiators.map((d) => (
                <div key={d.title} className="glass-hover flex flex-col items-center rounded-2xl border bg-background p-7 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <d.icon className="size-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{d.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Founder ═══ */}
      <section className="border-t border-border py-20">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start md:gap-8">
              <div className="mb-4 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary text-3xl font-display font-bold ring-1 ring-primary/20 md:mb-0">
                AN
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold md:text-2xl">Alif Nugraha</h2>
                <p className="text-sm text-muted-foreground">Founder, WeeCommerce</p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Alif adalah seorang pengembang dan entrepreneur yang fokus di persimpangan antara custom development, 
                  AI integration, dan business automation. Dengan pengalaman membangun sistem e-commerce dari nol hingga 
                  production, Alif mendirikan WeeCommerce untuk membantu brand Indonesia keluar dari dependency marketplace 
                  dan memiliki platform sendiri yang didukung AI canggih.
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Filosofi Alif: <strong className="text-foreground">technology should serve business, not the other way around.</strong> 
                  Setiap keputusan arsitektur harus bisa dijelaskan dalam terms bisnis, bukan cuma "karena teknologinya keren".
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Milestones ═══ */}
      <section className="border-t border-border bg-card py-20">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-center font-display text-2xl font-semibold tracking-tight md:text-3xl">Milestones</h2>
            <div className="space-y-0">
              {milestones.map((m, i) => (
                <div key={m.year} className="relative flex gap-6 pb-10 last:pb-0">
                  {/* Timeline line */}
                  {i < milestones.length - 1 && <div className="absolute left-[19px] top-10 h-full w-px bg-border" />}
                  {/* Dot */}
                  <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-medium text-primary">{m.year}</span>
                    <h3 className="font-display text-base font-semibold">{m.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Testimonial / Quote ═══ */}
      <section className="border-t border-border py-20">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <Quote className="mx-auto mb-4 size-8 text-primary/30" />
            <blockquote className="text-xl leading-relaxed text-foreground/90 md:text-2xl">
              &ldquo;Most agencies build you a store. We build you a system.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-muted-foreground">— Alif Nugraha, Founder WeeCommerce</p>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="border-t border-border bg-card py-20">
        <div className="section-container text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Let&apos;s Build Your System</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            30-minute discovery call. No sales pitch — just us understanding your business.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90">
              Start a Conversation <ArrowRight className="size-4" />
            </Link>
            <Link href="/portfolio" className="inline-flex h-11 items-center rounded-full border border-border bg-background px-7 text-sm font-medium hover:bg-card">
              See Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About WeeCommerce',
        description: 'WeeCommerce is a specialist e-commerce agency building AI-powered systems.',
        mainEntity: { '@type': 'Organization', name: 'WeeCommerce', founder: { '@type': 'Person', name: 'Alif Nugraha' } },
      }} />
    </div>
  );
}
