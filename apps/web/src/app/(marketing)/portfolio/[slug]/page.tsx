import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, TrendingUp, Star, Code2, Check } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';

const caseStudies: Record<string, any> = {
  'nexamart-ai-ecommerce': {
    slug: 'nexamart-ai-ecommerce',
    title: 'NexaMart — AI-Powered E-Commerce Platform',
    client: 'Internal Demo',
    industry: 'Technology',
    summary: 'Flagship demonstration project showcasing the complete WeeCommerce stack in production conditions.',
    challenge: 'Kami perlu demokan full capability WeeCommerce dalam environment production yang real — bukan mockup atau prototype. Platform harus bisa menunjukkan semua layer: e-commerce core, AI chatbot, RAG, dan n8n automation dalam satu sistem terintegrasi.',
    solution: 'Built with Next.js + Supabase for the core platform. RAG knowledge base untuk product discovery yang akurat. AI chatbot untuk customer service 24/7. n8n untuk order management dan CRM automation. Semua layer terhubung dalam satu ekosistem.',
    results: [
      { metric: 'CS Response Time', value: '−80%' },
      { metric: 'Page Load (4G)', value: '1.8s' },
      { metric: 'Mobile Responsive', value: '100%' },
      { metric: 'Chatbot Coverage', value: '24/7' },
      { metric: 'Order Processing', value: 'Automated' },
      { metric: 'Core Web Vitals', value: 'All Green' },
    ],
    tech: ['Next.js', 'Supabase', 'OpenAI', 'n8n', 'RAG', 'PostgreSQL'],
    tier: 'SCALE',
    year: '2026',
    features: [
      'Custom storefront with SSR/SSG — fast loading di semua device',
      'AI chatbot trained on product catalog — jawab pertanyaan customer real-time',
      'RAG knowledge base — product discovery akurat dari database real-time',
      'n8n automation untuk order notif, CRM sync, inventory alert',
      'Mobile-first responsive design — sub-3s load time di 4G',
    ],
  },
  'amuleie-ecommerce': {
    slug: 'amuleie-ecommerce',
    title: 'Amuleie — Bespoke Jewelry E-Commerce',
    client: 'Amuleie',
    industry: 'Retail / Fashion',
    summary: 'Custom e-commerce platform untuk brand jewelry high-end dengan AI customer service.',
    challenge: 'Membangun platform yang mencerminkan kemewahan brand sambil menyediakan automated customer service untuk pelanggan global di berbagai zona waktu.',
    solution: 'Custom Next.js storefront dengan desain elegan yang mencerminkan brand identity. AI chatbot dilatih dengan katalog perhiasan, panduan ukuran, dan instruksi perawatan. RAG system untuk rekomendasi produk yang akurat.',
    results: [
      { metric: 'Auto-CS Rate', value: '65%' },
      { metric: 'Response Time', value: '< 5 detik' },
      { metric: 'Mobile Traffic', value: '72%' },
      { metric: 'Avg. Order Value', value: '+23%' },
    ],
    tech: ['Next.js', 'Supabase', 'OpenAI'],
    tier: 'CONVERT',
    year: '2026',
    features: [
      'Custom storefront dengan brand identity',
      'AI chatbot trained on jewelry catalog',
      'RAG product recommendation system',
      'Multi-language support (ID + EN)',
      'WhatsApp Business API integration',
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies[slug];
  if (!cs) return { title: 'Case Study — WeeCommerce' };
  return {
    title: `${cs.title} — WeeCommerce Case Study`,
    description: cs.summary.slice(0, 160),
    alternates: { canonical: `/portfolio/${slug}` },
    openGraph: { title: cs.title, description: cs.summary.slice(0, 160) },
  };
}

export default async function PortfolioDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = caseStudies[slug];
  if (!cs) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Case study not found.</div>;

  return (
    <div className="flex flex-col">
      {/* ═══ Hero ═══ */}
      <section className="border-t border-border py-16 md:py-20">
        <div className="section-container">
          <div className="mx-auto max-w-4xl">
            <Link href="/portfolio" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" /> Back to portfolio
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{cs.tier}</span>
              <span className="text-sm text-muted-foreground">{cs.client} · {cs.industry} · {cs.year}</span>
            </div>

            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">{cs.title}</h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{cs.summary}</p>

            {/* Results metrics */}
            <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-6">
              {cs.results.map((r: any) => (
                <div key={r.metric} className="text-center">
                  <p className="font-mono text-lg font-medium text-primary md:text-xl">{r.value}</p>
                  <p className="text-xs text-muted-foreground">{r.metric}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Challenge + Solution ═══ */}
      <section className="border-t border-border bg-card py-16">
        <div className="section-container">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                <h2 className="mb-3 font-display text-lg font-semibold text-red-400">Challenge</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{cs.challenge}</p>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <h2 className="mb-3 font-display text-lg font-semibold text-primary">Solution</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{cs.solution}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Features ═══ */}
      <section className="border-t border-border py-16">
        <div className="section-container">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-display text-2xl font-semibold tracking-tight">Key Features</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {cs.features.map((f: string) => (
                <div key={f} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Tech Stack ═══ */}
      <section className="border-t border-border bg-card py-16">
        <div className="section-container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 font-display text-xl font-semibold tracking-tight">Technology Stack</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {cs.tech.map((t: string) => (
                <span key={t} className="rounded-full border border-border bg-background px-4 py-2 font-mono text-sm text-muted-foreground hover:border-primary/30 transition-colors">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="border-t border-border py-20">
        <div className="section-container text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Want Similar Results?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Let&apos;s build something great for your business.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90">
              Start Your Project <ArrowRight className="size-4" />
            </Link>
            <Link href="/portfolio" className="inline-flex h-11 items-center rounded-full border border-border bg-background px-7 text-sm font-medium hover:bg-card">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: cs.title,
        description: cs.summary,
        author: { '@type': 'Organization', name: 'WeeCommerce' },
        keywords: cs.tech.join(', '),
      }} />
    </div>
  );
}
