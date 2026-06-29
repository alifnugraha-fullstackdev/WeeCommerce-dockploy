import { Wordmark } from '@/components/wordmark';
import { Camera, Globe, MessageSquare, Hash, ArrowUpRight, Mail } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  {
    title: 'Services',
    links: [
      { label: 'LAUNCH', href: '/services/launch' },
      { label: 'CONVERT', href: '/services/convert' },
      { label: 'SCALE', href: '/services/scale' },
      { label: 'INTEGRATE', href: '/services/integrate' },
      { label: 'AI Chatbot', href: '/ai/chatbot' },
      { label: 'RAG System', href: '/ai/rag' },
      { label: 'n8n Automation', href: '/ai/n8n' },
      { label: 'Full AI Suite', href: '/ai/suite' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Process', href: '/process' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
      { label: 'Book a Call', href: '/contact' },
    ],
  },
  {
    title: 'AI Modules',
    links: [
      { label: 'AI Chatbot', href: '/ai/chatbot' },
      { label: 'RAG System', href: '/ai/rag' },
      { label: 'n8n Automation', href: '/ai/n8n' },
      { label: 'Full AI Suite', href: '/ai/suite' },
    ],
  },
];

const socials = [
  { label: 'Instagram', href: 'https://instagram.com/weecommerce.id', icon: Camera },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/weecommerce', icon: Globe },
  { label: 'Threads', href: 'https://threads.net/@weecommerce.id', icon: MessageSquare },
  { label: 'X / Twitter', href: '#', icon: Hash },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background">
      {/* Intelligence Grid edge */}
      <div aria-hidden="true" className="intelligence-grid pointer-events-none absolute inset-0 opacity-[0.04]" />

      <div className="section-container relative z-10">
        {/* ── Desktop / Tablet: 4-column grid ── */}
        <div className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column — spans wider */}
          <div className="lg:col-span-2">
            <Wordmark className="text-xl" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Specialist e-commerce agency building AI-powered systems. Custom development, AI integration, and business automation for brands ready to scale.
            </p>

            {/* Email + CTA */}
            <div className="mt-5 space-y-3">
              <a href="mailto:hello@weecommerce.web.id" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="size-4 text-primary" />
                hello@weecommerce.web.id
              </a>
              <br />
              <Link
                href="/contact"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Book a Discovery Call <ArrowUpRight className="size-3" />
              </Link>
            </div>

            {/* Social — hidden on mobile (shown below) */}
            <div className="mt-6 hidden gap-2 md:flex">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.slice(0, 3).map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Mobile only: Social + Newsletter ── */}
        <div className="flex flex-wrap gap-3 border-t border-border/50 py-6 md:hidden">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
            >
              <s.icon className="size-4" />
            </a>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/50 py-6 md:flex-row">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} WeeCommerce. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground/60">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <span>Indonesia — Remote-first, globally available</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
