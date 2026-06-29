'use client';
import { cn } from '@/lib/utils';
import { LogoCloud } from '@/components/ui/logo-cloud-3';
import { RocketIcon, ArrowRightIcon, PhoneCallIcon } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative mx-auto w-full max-w-5xl">
      {/* Intelligence Grid background */}
      <div aria-hidden="true" className="intelligence-grid absolute inset-0 -z-10" />

      {/* Top radial fade */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -top-14 isolate -z-10 hidden overflow-hidden lg:block"
      >
        <div className="absolute inset-0 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.08),transparent)]" />
      </div>

      {/* Vertical hairline borders */}
      <div aria-hidden="true" className="absolute inset-0 mx-auto hidden min-h-screen w-full max-w-5xl lg:block">
        <div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 left-0 z-10 h-full w-px bg-foreground/15" />
        <div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 right-0 z-10 h-full w-px bg-foreground/15" />
      </div>

      <div className="relative flex flex-col items-center justify-center gap-5 pb-30 pt-32">
        {/* Inner vertical lines */}
        <div aria-hidden="true" className="absolute inset-0 z-0 size-full overflow-hidden">
          <div className="absolute inset-y-0 left-4 w-px bg-gradient-to-b from-transparent via-border to-border md:left-8" />
          <div className="absolute inset-y-0 right-4 w-px bg-gradient-to-b from-transparent via-border to-border md:right-8" />
          <div className="absolute inset-y-0 left-8 w-px bg-gradient-to-b from-transparent via-border/50 to-border/50 md:left-12" />
          <div className="absolute inset-y-0 right-8 w-px bg-gradient-to-b from-transparent via-border/50 to-border/50 md:right-12" />
        </div>

        {/* Badge */}
        <a
          className={cn(
            'group mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-3 py-1 shadow-sm',
            'transition-all duration-300 hover:bg-card/80',
          )}
          href="#services"
        >
          <RocketIcon className="size-3 text-muted-foreground" />
          <span className="text-xs">E-commerce, powered by AI!</span>
          <span className="block h-5 border-l" />
          <ArrowRightIcon className="size-3 duration-150 ease-out group-hover:translate-x-1" />
        </a>

        {/* Headline */}
        <h1 className="text-balance text-center font-display text-4xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-5xl lg:text-6xl">
          Built to convert. <br /> Wired to learn.
        </h1>

        {/* Subhead */}
        <p className="mx-auto max-w-md text-balance text-center text-base tracking-wider text-foreground/80 sm:text-lg md:text-xl">
          We build the store. AI runs it.{' '}
          <span className="block text-sm text-muted-foreground md:text-base">
            Most agencies build you a store. We build you a system.
          </span>
        </p>

        {/* CTAs */}
        <div className="relative z-20 flex flex-row flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="/contact"
            className="pointer-events-auto inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition-all hover:bg-card/80 active:scale-[0.97]"
          >
            <PhoneCallIcon className="size-4" />
            Book a Call
          </a>
          <a
            href="/contact"
            className="pointer-events-auto inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-all hover:bg-foreground/90 active:scale-[0.97]"
          >
            Get Started
            <ArrowRightIcon className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function LogosSection() {
  return (
    <section className="relative space-y-4 border-t pb-10 pt-6">
      <h2 className="text-center text-lg font-medium tracking-tight text-muted-foreground md:text-xl">
        Built with{' '}
        <span className="text-foreground">industry-leading technology</span>
      </h2>
      <div className="relative z-10 mx-auto max-w-4xl">
        <LogoCloud logos={logos} />
      </div>
    </section>
  );
}

const logos = [
  { alt: 'Next.js' },
  { alt: 'Supabase' },
  { alt: 'OpenAI' },
  { alt: 'n8n' },
  { alt: 'Cloudflare' },
  { alt: 'Hono' },
  { alt: 'PostgreSQL' },
  { alt: 'Redis' },
];
