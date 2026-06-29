'use client';
import React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Wordmark } from '@/components/wordmark';
import { useScroll } from '@/components/ui/use-scroll';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { DarkModeToggle } from '@/components/dark-mode-toggle';
import { LocaleSwitcher } from '@/components/locale-switcher';

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  const links = [
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'About', href: '/about' },
    { label: 'Process', href: '/process' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300',
        {
          'bg-background/95 border-border backdrop-blur-lg': scrolled,
        },
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <a href="/" className="hover:opacity-80 transition-opacity">
          <Wordmark className="h-5" />
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <div className="ml-2 flex items-center gap-2">
            <LocaleSwitcher />
            <DarkModeToggle />
            <a
              href="/contact"
              className={buttonVariants({ variant: 'secondary', size: 'sm' })}
            >
              Book a Call
            </a>
            <a
              href="/contact"
              className={buttonVariants({ variant: 'default', size: 'sm' })}
            >
              Get Started
            </a>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-card-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <HamburgerIcon />}
        </button>
      </nav>
      {open && typeof window !== 'undefined' && (
        <MobileMenu open={open} onClose={() => setOpen(false)} />
      )}
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const links = [
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'About', href: '/about' },
    { label: 'Process', href: '/process' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return createPortal(
    <div
      id="mobile-menu"
      className="fixed inset-0 top-14 z-40 flex flex-col bg-background/95 backdrop-blur-lg md:hidden"
    >
      <div className="flex flex-1 flex-col gap-4 p-6">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="text-2xl font-display font-semibold tracking-tight hover:text-primary transition-colors"
          >
            {link.label}
          </a>
        ))}
        <div className="mt-auto flex flex-col gap-3 pb-8">
          <a
            href="/contact"
            onClick={onClose}
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'lg' }),
              'w-full text-center',
            )}
          >
            Book a Call
          </a>
          <a
            href="/contact"
            onClick={onClose}
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'w-full text-center',
            )}
          >
            Get Started
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M3 5h14" />
      <path d="M3 10h14" />
      <path d="M3 15h14" />
    </svg>
  );
}
