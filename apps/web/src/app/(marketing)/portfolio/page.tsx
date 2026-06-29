import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, TrendingUp, Clock, Code2, ExternalLink } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Portfolio — WeeCommerce Case Studies',
  description: 'See real projects built by WeeCommerce: AI-powered e-commerce platforms with chatbot, RAG, and n8n automation. Results-driven case studies.',
  alternates: { canonical: '/portfolio' },
  openGraph: { title: 'Portfolio — WeeCommerce', description: 'AI-powered e-commerce platforms with measurable results.' },
};

const caseStudies = [
  {
    slug: 'nexamart-ai-ecommerce',
    title: 'NexaMart — AI-Powered E-Commerce Platform',
    client: 'Internal Demo',
    industry: 'Technology',
    summary: 'Flagship demonstration project showcasing the complete WeeCommerce stack in production conditions. A fully functional e-commerce platform with AI chatbot, RAG, n8n automation — all working together.',
    challenge: 'Need to demonstrate the full WeeCommerce capability in a real production environment — not a mockup or prototype.',
    solution: 'Built with Next.js + Supabase for the core platform. Integrated RAG knowledge base for product discovery, AI chatbot for customer service, and n8n for order/CRM automation. All layers connected in one system.',
    results: [
      { metric: 'CS Response Time', value: '−80%' },
      { metric: 'Page Load (4G)', value: '1.8s' },
      { metric: 'Chatbot Coverage', value: '24/7' },
      { metric: 'Core Web Vitals', value: 'All Green' },
    ],
    tech: ['Next.js', 'Supabase', 'OpenAI', 'n8n', 'RAG'],
    tier: 'SCALE',
    year: '2026',
  },
  {
    slug: 'amuleie-ecommerce',
    title: 'Amuleie — Bespoke Jewelry E-Commerce',
    client: 'Amuleie',
    industry: 'Retail / Fashion',
    summary: 'Custom e-commerce platform for a high-end jewelry brand. AI chatbot trained on product catalog and care instructions for personalized customer service.',
    challenge: 'Needed a platform that reflects brand luxury while providing automated customer service for global customers across different time zones.',
    solution: 'Custom Next.js storefront with elegant design matching brand identity. AI chatbot trained on jewelry catalog, sizing guides, and care instructions. RAG system for accurate product recommendations.',
    results: [
      { metric: 'Auto-CS Rate', value: '65%' },
      { metric: 'Response Time', value: '< 5s' },
      { metric: 'Mobile Traffic', value: '72%' },
    ],
    tech: ['Next.js', 'Supabase', 'OpenAI'],
    tier: 'CONVERT',
    year: '2026',
  },
];

export default function PortfolioPage() {
  return (
    <div className="flex flex-col">
      {/* ═══ Hero ═══ */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="section-container">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Code2 className="size-8" />
            </div>
            <h1 className="mb-4 font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Our Work
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Real projects. Real results. See what WeeCommerce can build for your business.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Case Studies Grid ═══ */}
      <section className="border-t border-border bg-card py-16 md:py-20">
        <div className="section-container">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8">
              {caseStudies.map((cs) => (
                <div key={cs.slug} className="group overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-primary/30 hover:shadow-lg">
                  <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{cs.tier}</span>
                      <span className="text-xs text-muted-foreground">{cs.client} · {cs.industry} · {cs.year}</span>
                    </div>

                    <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{cs.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cs.summary}</p>

                    {/* Results */}
                    <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-surface-2/60 p-5 md:grid-cols-4">
                      {cs.results.map((r) => (
                        <div key={r.metric} className="text-center">
                          <p className="font-mono text-lg font-medium text-primary md:text-xl">{r.value}</p>
                          <p className="text-xs text-muted-foreground">{r.metric}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tech + CTA */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-1.5">
                        {cs.tech.map((t) => (
                          <span key={t} className="rounded-full border border-border/50 bg-background px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">{t}</span>
                        ))}
                      </div>
                      <Link
                        href={`/portfolio/${cs.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        View Case Study <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="border-t border-border py-20">
        <div className="section-container text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Want Results Like These?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Let&apos;s discuss how we can build something great for your business.
          </p>
          <Link href="/contact" className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90">
            Start Your Project <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* JSON-LD */}
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'WeeCommerce Portfolio',
        description: 'Case studies and projects by WeeCommerce.',
        mainEntity: caseStudies.map((cs) => ({
          '@type': 'CreativeWork',
          name: cs.title,
          description: cs.summary,
          keywords: cs.tech.join(', '),
        })),
      }} />
    </div>
  );
}
