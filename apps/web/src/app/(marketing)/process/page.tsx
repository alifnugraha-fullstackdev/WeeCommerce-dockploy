import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Search, FileText, Code, Bot, Rocket, HeartHandshake, Check } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';
import { Timeline } from '@/components/ui/timeline';

export const metadata: Metadata = {
  title: 'Our Process — WeeCommerce 6-Step Development',
  description: 'Discovery, Proposal, Design & Build, AI Integration, Launch, Retain. A structured 6-step process for building AI-powered e-commerce systems.',
  alternates: { canonical: '/process' },
  openGraph: { title: 'Our Process — WeeCommerce', description: 'A structured 6-step process for e-commerce systems with AI.' },
};

const steps = [
  { num: '01', icon: Search, title: 'Discovery', goal: 'Pahami bisnis lo sebelum merekomendasikan apa pun.',
    bullets: [
      '30–45 menit video call untuk understand business model, revenue, channel, pain points',
      'Kami yang tanya, lo yang cerita. Bukan sales pitch.',
      'Output: assessment jelas tentang apa yang lo butuh — dan apakah WeeCommerce cocok',
    ] },
  { num: '02', icon: FileText, title: 'Proposal', goal: 'Scope, timeline, dan investment — transparan dari awal.',
    bullets: [
      'Dalam 48 jam setelah call, lo terima proposal detail (8–12 halaman)',
      'Executive summary, understanding of your business, proposed solution, timeline, investment',
      'Explicit in-scope dan out-of-scope. Gak ada hidden fee.',
    ] },
  { num: '03', icon: Code, title: 'Design & Build', goal: 'Lo lihat progress setiap minggu — bukan cuma di akhir.',
    bullets: [
      'UI/UX design dulu, lalu full-stack development dengan Next.js + Supabase',
      'Staging preview setiap sprint — lo bisa lihat, kasih feedback, minta revisi',
      '2 putaran revisi included per milestone. Transparan, gak ada black box.',
    ] },
  { num: '04', icon: Bot, title: 'AI Integration', goal: 'Chatbot + RAG + n8n — di-training dengan data lo.',
    bullets: [
      'AI chatbot di-training dengan product catalog, FAQ, dan brand voice lo',
      'RAG knowledge base terhubung ke database real-time — akurat, auto-update',
      'n8n workflow di-configure untuk notifikasi order, CRM sync, inventory alert',
      'Semua di-test dengan skenario real sebelum tanda tangan',
    ] },
  { num: '05', icon: Rocket, title: 'Launch', goal: 'Go-live yang mulus tanpa drama.',
    bullets: [
      'Final QA: load test, mobile test, Core Web Vitals check, payment gateway sandbox test',
      'Lo terima link staging buat final approval',
      'Begitu lo approve, kami deploy ke production + monitoring 24 jam pertama',
    ] },
  { num: '06', icon: HeartHandshake, title: 'Retain', goal: 'Sistem lo tetap sharpen — bahkan setelah launch.',
    bullets: [
      '30 hari post-launch support gratis: bug fixes & minor updates',
      'Pilih Retainer Basic (bug fixes, monthly report, 48h response) atau Advanced (+ AI re-training, n8n maintenance, 24h response)',
    ] },
];

const guarantees = [
  'Source code ownership transferred upon final payment',
  'Full documentation: code, API integrations, workflow guides',
  '30 days post-launch support for bug fixes',
  'Staging environment for client preview before go-live',
  'Milestone-based payments — you only pay for completed work',
];

export default function ProcessPage() {
  return (
    <div className="flex flex-col">
      {/* ═══ Hero ═══ */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="section-container">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Search className="size-8" />
            </div>
            <h1 className="mb-4 font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              How We Work
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              A structured process designed to <strong className="text-foreground">reduce ambiguity</strong>, 
              protect your investment, and <strong className="text-foreground">ship clean systems on time</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Interactive Timeline ═══ */}
      <section className="border-t border-border bg-card py-20">
        <div className="section-container">
          <Timeline />
        </div>
      </section>

      {/* ═══ Step Details ═══ */}
      <section className="border-t border-border py-20">
        <div className="section-container">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center font-display text-2xl font-semibold tracking-tight md:text-3xl">
              What Happens at Each Step
            </h2>
            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={s.num} className="relative flex gap-6 rounded-2xl border border-border bg-card p-6 md:p-8">
                  {/* Step number badge */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-medium text-primary">{s.num}</span>
                      <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                    </div>
                    <p className="mb-4 text-sm font-medium text-foreground/80">{s.goal}</p>
                    <ul className="space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Guarantees ═══ */}
      <section className="border-t border-border bg-card py-20">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">Always Included</h2>
            <p className="mb-8 text-sm text-muted-foreground">Things you can count on in every engagement.</p>
            <div className="grid gap-3 md:grid-cols-2">
              {guarantees.map((g) => (
                <div key={g} className="flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 px-5 py-4 text-sm">
                  <Check className="size-5 shrink-0 text-primary" />
                  <span className="text-left">{g}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="border-t border-border py-20">
        <div className="section-container text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Ready to Start?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Every project begins with a conversation. No commitment, no pressure.
          </p>
          <Link href="/contact" className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90">
            Book a Discovery Call <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* JSON-LD HowTo */}
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How WeeCommerce Builds an E-Commerce System',
        description: 'A structured 6-step process for building AI-powered e-commerce systems.',
        totalTime: 'P60D',
        step: steps.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.title,
          text: s.goal,
        })),
      }} />
    </div>
  );
}
