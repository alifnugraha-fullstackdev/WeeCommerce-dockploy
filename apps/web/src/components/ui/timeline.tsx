'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'We spend time understanding your business model, customer journey, current pain points, and growth goals — before proposing anything. No generic solutions.',
    detail:
      'We start with a 30–45 minute call covering: revenue range, current sales channels, team size, pain points, and growth goals. By the end, we know exactly what you need — and whether we\'re the right fit.',
  },
  {
    num: '02',
    title: 'Proposal',
    desc: 'We define the right scope, timeline, and investment for your specific situation. Presented with full transparency.',
    detail:
      'Within 48 hours of the call, you receive a detailed proposal: executive summary, understanding of your business, proposed solution with diagrams, explicit in-scope/out-of-scope, timeline with milestones, and investment breakdown.',
  },
  {
    num: '03',
    title: 'Design & Build',
    desc: 'UI/UX design followed by full-stack development. You receive regular staging previews — no black-box delivery.',
    detail:
      'We build your platform iteratively. Each sprint ends with a staging preview where you can see real progress, leave feedback, and request adjustments. Two revision rounds included per milestone.',
  },
  {
    num: '04',
    title: 'AI Integration',
    desc: 'Chatbot training on your product data, RAG system configuration, and automation workflow setup. Tested against real-world queries.',
    detail:
      'Your AI chatbot is trained on actual product data, FAQs, and policies. RAG knowledge base connected to your catalog. n8n workflows configured for order notifications, CRM sync, inventory alerts — all tested with real scenarios before sign-off.',
  },
  {
    num: '05',
    title: 'Launch',
    desc: 'Staging review, QA testing, performance checks, and go-live. You approve before anything goes public.',
    detail:
      'Final QA sweep: load testing, mobile responsiveness, Core Web Vitals check, payment gateway sandbox testing. You receive a staging link for final approval. Once you give the green light, we deploy to production.',
  },
  {
    num: '06',
    title: 'Retain',
    desc: 'Optional ongoing support: monthly maintenance, AI model updates as your catalog grows, workflow adjustments, and performance monitoring.',
    detail:
      'Choose Basic (bug fixes, monthly report, 48h response) or Advanced (AI re-training, n8n maintenance, 24h response). Either way, 30 days of post-launch bug fixes are always included free.',
  },
];

export function Timeline() {
  const [active, setActive] = useState(0);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Step indicators */}
      <div className="mb-12 flex justify-center">
        <div className="inline-flex items-center gap-0 rounded-full bg-card p-1">
          {steps.map((s, i) => (
            <button
              key={s.num}
              onClick={() => setActive(i)}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                active === i
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">{s.num}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active step content */}
      <div className="relative rounded-2xl border border-border bg-card p-8 md:p-10">
        {/* Step number badge */}
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-medium text-primary">
            {steps[active].num}
          </span>
          <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
            {steps[active].title}
          </h3>
        </div>

        {/* Summary */}
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          {steps[active].desc}
        </p>

        {/* Detail expandable */}
        <div
          className={cn(
            'mt-4 overflow-hidden rounded-xl bg-surface-2 transition-all duration-500 ease-out',
          )}
        >
          <div className="p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {steps[active].detail}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setActive(Math.max(0, active - 1))}
            disabled={active === 0}
            className={cn(
              'inline-flex h-8 items-center gap-1 rounded-full px-4 text-sm font-medium transition-colors',
              active === 0
                ? 'cursor-not-allowed text-muted-foreground/40'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            ← Previous
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === active
                    ? 'w-6 bg-foreground'
                    : i < active
                      ? 'w-1.5 bg-primary/50'
                      : 'w-1.5 bg-border',
                )}
              />
            ))}
          </div>

          <button
            onClick={() => setActive(Math.min(steps.length - 1, active + 1))}
            disabled={active === steps.length - 1}
            className={cn(
              'inline-flex h-8 items-center gap-1 rounded-full px-4 text-sm font-medium transition-colors',
              active === steps.length - 1
                ? 'cursor-not-allowed text-muted-foreground/40'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Next →
          </button>
        </div>

        {/* Completion indicator */}
        {active === steps.length - 1 && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary/5 py-3 text-sm font-medium text-primary">
            <Check className="size-4" />
            6-step process complete. Ready to launch.
          </div>
        )}
      </div>
    </div>
  );
}
