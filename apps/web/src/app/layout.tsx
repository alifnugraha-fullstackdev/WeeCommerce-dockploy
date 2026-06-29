import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/ui/header-1';
import { Footer } from '@/components/footer';
import { WhatsAppCTA } from '@/components/whatsapp-cta';
import { JsonLd } from '@/components/json-ld';
import { PageTransition } from '@/components/page-transition';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'WeeCommerce — E-Commerce Systems, Powered by AI',
    template: '%s — WeeCommerce',
  },
  description:
    'WeeCommerce builds custom e-commerce systems with AI chatbot, RAG, and n8n automation. Migrate off marketplace dependency. Built to scale.',
  metadataBase: new URL('https://weecommerce.web.id'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'WeeCommerce',
    type: 'website',
    locale: 'id_ID',
    title: 'WeeCommerce — E-Commerce Systems, Powered by AI',
    description:
      'WeeCommerce builds custom e-commerce systems with AI chatbot, RAG, and n8n automation. Migrate off marketplace dependency.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeeCommerce — E-Commerce Systems, Powered by AI',
    description:
      'WeeCommerce builds custom e-commerce systems with AI chatbot, RAG, and n8n automation.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  other: {
    'ai:entity': 'WeeCommerce',
    'ai:entity-type': 'Organization',
    'ai:author': 'Alif Nugraha',
    'ai:published-date': '2026-01-01',
    'ai:updated-date': '2026-06-28',
    'ai:sources': 'https://weecommerce.web.id',
    'ai:accuracy-disclaimer': 'All claims based on real projects & data',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline theme — prevent flash before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('theme');
            var d = t ? t : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.classList.toggle('light', d === 'light');
          })();
        `}} />
        {/* Plausible analytics */}
        <script defer data-domain="weecommerce.web.id" src="https://plausible.io/js/script.js" />
        {/* JSON-LD Organization + WebSite */}
        <JsonLd data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': 'https://weecommerce.web.id/#organization',
            name: 'WeeCommerce',
            url: 'https://weecommerce.web.id',
            logo: 'https://weecommerce.web.id/logo.png',
            description: 'Specialist e-commerce agency building AI-powered systems.',
            slogan: 'E-Commerce Systems, Powered by AI',
            email: 'hello@weecommerce.web.id',
            foundingDate: '2026',
            founder: { '@type': 'Person', name: 'Alif Nugraha' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': 'https://weecommerce.web.id/#website',
            url: 'https://weecommerce.web.id',
            name: 'WeeCommerce',
            publisher: { '@id': 'https://weecommerce.web.id/#organization' },
            potentialAction: {
              '@type': 'SearchAction',
              target: { '@type': 'EntryPoint', urlTemplate: 'https://weecommerce.web.id/blog/search?q={search_term_string}' },
              'query-input': 'required name=search_term_string',
            },
          },
        ]} />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased" suppressHydrationWarning>
        <Header />
        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>
        <Footer />
        <WhatsAppCTA />
      </body>
    </html>
  );
}
