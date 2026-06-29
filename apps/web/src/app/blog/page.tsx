import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Search, Clock, User, Tag } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Blog — WeeCommerce E-Commerce & AI Insights',
  description: 'Insights on custom e-commerce, AI chatbots, RAG, n8n automation, and marketplace migration. Practical guides for Indonesian e-commerce brands.',
  alternates: { canonical: '/blog' },
  openGraph: { title: 'Blog — WeeCommerce', description: 'Custom e-commerce, AI chatbot, RAG, and n8n automation insights.' },
};

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: number;
  author: string;
  tags: string[];
  image: string;
  imageAlt: string;
}

const posts: Post[] = [
  {
    slug: 'apa-itu-rag-untuk-toko-online',
    title: 'Apa itu RAG dan Kenapa Toko Online Lo Butuh Ini',
    excerpt: 'RAG (Retrieval-Augmented Generation) adalah teknologi yang bikin chatbot toko online lo bisa jawab pertanyaan customer dengan akurat berdasarkan data real-time dari katalog produk. Bukan hafalan — tapi search-based AI.',
    content: '## Apa itu RAG?\n\nRAG (Retrieval-Augmented Generation) menggabungkan kekuatan search engine dengan AI generatif...\n\n## Kenapa toko online butuh RAG?\n\nDengan RAG, chatbot langsung akses katalog produk, FAQ, dan policy — jawabannya akurat karena based on data real-time...',
    category: 'AI',
    date: '2026-06-15',
    readTime: 7,
    author: 'Alif Nugraha',
    tags: ['RAG', 'AI', 'Chatbot'],
    image: '/blog/rag-diagram.webp',
    imageAlt: 'Diagram arsitektur RAG retrieval dari database produk ke AI generatif',
  },
  {
    slug: 'migrasi-tokopedia-ke-website',
    title: 'Cara Migrate dari Tokopedia ke Website Sendiri',
    excerpt: 'Panduan langkah demi langkah untuk pindah dari marketplace ke platform sendiri tanpa kehilangan trafik, data pelanggan, dan omzet.',
    content: '## Kenapa harus migrate?\n\nMarketplace fee naik terus, data customer bukan milik lo, algoritma berubah kapan aja...',
    category: 'E-Commerce',
    date: '2026-06-10',
    readTime: 10,
    author: 'Alif Nugraha',
    tags: ['Marketplace', 'Migrasi', 'E-Commerce'],
    image: '/blog/migrasi-marketplace.webp',
    imageAlt: 'Ilustrasi proses migrasi dari Tokopedia ke website e-commerce custom',
  },
  {
    slug: 'n8n-otomasi-toko-online',
    title: 'n8n untuk Otomasi Toko Online: Panduan Lengkap',
    excerpt: 'Automasi operasional e-commerce dengan n8n: order notification, CRM sync, abandoned cart recovery, inventory alerts — tanpa coding.',
    content: '## Apa itu n8n?\n\nn8n adalah workflow automation platform open-source...',
    category: 'Automation',
    date: '2026-06-05',
    readTime: 8,
    author: 'Alif Nugraha',
    tags: ['n8n', 'Automation', 'Workflow'],
    image: '/blog/n8n-workflow.webp',
    imageAlt: 'Dashboard n8n automation workflow untuk e-commerce',
  },
  {
    slug: 'ai-chatbot-cs-otomatis',
    title: 'AI Chatbot untuk Customer Service Toko Online',
    excerpt: 'Implementasi AI chatbot yang bener-bener works untuk e-commerce: training data, multi-channel, escalation logic, dan metrik yang perlu di-track.',
    content: '## Kenapa chatbot untuk e-commerce?\n\nCustomer service adalah salah satu operational pain terbesar...',
    category: 'AI',
    date: '2026-05-28',
    readTime: 12,
    author: 'Alif Nugraha',
    tags: ['Chatbot', 'AI', 'Customer Service'],
    image: '/blog/ai-chatbot-cs.webp',
    imageAlt: 'AI chatbot melayani customer di website dan WhatsApp 24/7',
  },
  {
    slug: 'perbedaan-shopify-custom-ecommerce',
    title: 'Shopify vs Custom E-Commerce: Mana yang Tepat untuk Lo?',
    excerpt: 'Perbandingan komprehensif antara Shopify dan custom e-commerce (Next.js + Supabase). Biaya, kontrol, skalabilitas, dan kapan harus pilih yang mana.',
    content: '## Shopify vs Custom: Perbedaan Fundamental...',
    category: 'E-Commerce',
    date: '2026-05-20',
    readTime: 15,
    author: 'Alif Nugraha',
    tags: ['Shopify', 'Custom', 'Perbandingan'],
    image: '/blog/shopify-vs-custom.webp',
    imageAlt: 'Perbandingan Shopify vs custom e-commerce Next.js dan Supabase',
  },
];

const categories = ['All', 'AI', 'E-Commerce', 'Automation'];

export default function BlogPage() {
  return (
    <div className="flex flex-col">
      {/* ── Header ── */}
      <section className="border-t border-border py-16 md:py-20">
        <div className="section-container text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Search className="size-6" />
          </div>
          <h1 className="mb-3 font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Insights on custom e-commerce, AI chatbots, RAG, n8n automation, and marketplace migration.
          </p>
        </div>
      </section>

      {/* ── Posts ── */}
      <section className="border-t border-border bg-card py-16">
        <div className="section-container">
          <div className="mx-auto max-w-4xl">
            {/* Search + Filter */}
            <BlogFilters categories={categories} />

            {/* Article list */}
            <div className="space-y-6">
              {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Thumbnail */}
                      <div className="relative aspect-video w-full shrink-0 overflow-hidden sm:w-48 sm:aspect-auto">
                        <img
                          src={post.image}
                          alt={post.imageAlt}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      {/* Content */}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                            <Tag className="size-3" /> {post.category}
                          </span>
                          <span className="flex items-center gap-1"><Clock className="size-3" /> {post.readTime} min read</span>
                          <span className="flex items-center gap-1"><User className="size-3" /> {post.author}</span>
                        </div>
                        <h2 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors md:text-xl">
                          {post.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="mt-5 mr-5 size-5 shrink-0 self-center text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1 hidden sm:block" />
                    </div>
                </Link>
              ))}
            </div>

            {/* JSON-LD BlogPosting list */}
            <JsonLd data={{
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: posts.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                  '@type': 'BlogPosting',
                  headline: p.title,
                  description: p.excerpt,
                  author: { '@type': 'Person', name: p.author },
                  datePublished: p.date,
                  url: `https://weecommerce.web.id/blog/${p.slug}`,
                },
              })),
            }} />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border py-16">
        <div className="section-container text-center">
          <p className="text-sm text-muted-foreground">
            Want to stay updated? Follow us on{' '}
            <a href="https://threads.net/@weecommerce.id" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Threads</a>
            {' '}or{' '}
            <a href="https://linkedin.com/company/weecommerce" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ── Client component for filters ── */
function BlogFilters({ categories }: { categories: string[] }) {
  return (
    <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
      {categories.map((cat) => (
        <a
          key={cat}
          href={cat === 'All' ? '/blog' : `/blog?category=${cat.toLowerCase()}`}
          className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-card-foreground hover:text-background"
        >
          {cat}
        </a>
      ))}
    </div>
  );
}
