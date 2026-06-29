import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Tag, Calendar } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';

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
  imageCaption: string;
}

const posts: Post[] = [
  {
    slug: 'apa-itu-rag-untuk-toko-online',
    title: 'Apa itu RAG dan Kenapa Toko Online Lo Butuh Ini',
    excerpt: 'RAG (Retrieval-Augmented Generation) adalah teknologi yang bikin chatbot toko online lo bisa jawab pertanyaan customer dengan akurat berdasarkan data real-time dari katalog produk.',
    content: `## Apa itu RAG?
RAG (Retrieval-Augmented Generation) adalah metode yang menggabungkan retrieval information dengan generative AI untuk menghasilkan jawaban yang akurat berdasarkan data real-time.

Berbeda dengan chatbot tradisional yang cuma mengandalkan data training, RAG bisa search langsung ke database produk lo setiap kali ada pertanyaan. Hasilnya: jawaban yang akurat, kontekstual, dan selalu up-to-date.

## Kenapa Toko Online Butuh RAG?
Dengan RAG, chatbot kamu bisa:
- **Mengakses katalog produk real-time** — stok, harga, varian selalu akurat
- **Menjawab pertanyaan spesifik** — "Ada ukuran XL warna merah?" → search langsung
- **Auto-update** — gak perlu retrain setiap kali katalog berubah

## Manfaat untuk Bisnis
- **Mengurangi repetitive CS queries** hingga 60–80%
- **Skalabilitas pengetahuan produk** tanpa manual update
- **Akurasi lebih tinggi** daripada chatbot tradisional
- **Integrasi mudah** dengan existing product database`,
    category: 'AI',
    date: '2026-06-15',
    readTime: 7,
    author: 'Alif Nugraha',
    tags: ['RAG', 'AI', 'Chatbot'],
    image: '/blog/rag-diagram.webp',
    imageAlt: 'Diagram arsitektur RAG yang menunjukkan proses retrieval dari database produk ke AI generatif untuk menghasilkan jawaban akurat',
    imageCaption: 'Arsitektur RAG: retrieval + generation = jawaban akurat real-time',
  },
  {
    slug: 'migrasi-tokopedia-ke-website',
    title: 'Cara Migrate dari Tokopedia ke Website Sendiri',
    excerpt: 'Panduan langkah demi langkah untuk pindah dari marketplace ke platform sendiri tanpa kehilangan trafik.',
    content: `## Kenapa Harus Migrate?
Marketplace fee semakin naik, data customer tidak sepenuhnya milik Anda, dan algoritma tidak bisa dikontrol.

## Langkah-langkah
1. **Audit current product catalog** — inventory, pricing, images
2. **Setup custom e-commerce platform** — Next.js + Supabase
3. **Migrate product data** — export → transform → import
4. **Setup payment gateway** — Midtrans / Stripe
5. **Launch + redirect traffic** — dari marketplace ke platform lo

## Timeline Estimasi
LAUNCH tier bisa selesai dalam 4–6 minggu untuk brand dengan 100–500 produk.`,
    category: 'E-Commerce',
    date: '2026-06-10',
    readTime: 10,
    author: 'Alif Nugraha',
    tags: ['Marketplace', 'Migrasi', 'E-Commerce'],
    image: '/blog/migrasi-marketplace.webp',
    imageAlt: 'Ilustrasi proses migrasi dari Tokopedia dan Shopee ke website e-commerce custom milik sendiri',
    imageCaption: 'Proses migrasi marketplace ke platform sendiri dalam 5 langkah',
  },
  {
    slug: 'n8n-otomasi-toko-online',
    title: 'n8n untuk Otomasi Toko Online: Panduan Lengkap',
    excerpt: 'Automasi operasional e-commerce dengan n8n: order notification, CRM sync, abandoned cart recovery.',
    content: `## Apa itu n8n?
n8n adalah workflow automation platform open-source yang menghubungkan berbagai service tanpa perlu coding.

## Use Cases untuk E-Commerce
- **Order confirmation** via WhatsApp/Email otomatis
- **CRM sync** — setiap order baru otomatis tercatat
- **Abandoned cart recovery** — reminder H+1, H+3, H+7
- **Low stock alerts** — notifikasi ke tim purchasing
- **Post-purchase follow-up** — request review, rekomendasi produk

## Keuntungan
Tim lo bisa hemat 20+ jam per minggu dengan automate repetitive tasks.`,
    category: 'Automation',
    date: '2026-06-05',
    readTime: 8,
    author: 'Alif Nugraha',
    tags: ['n8n', 'Automation', 'Workflow'],
    image: '/blog/n8n-workflow.webp',
    imageAlt: 'Tampilan dashboard n8n automation workflow untuk e-commerce order notification dan CRM sync',
    imageCaption: 'n8n workflow automation: order, CRM, inventory — semua otomatis',
  },
  {
    slug: 'ai-chatbot-cs-otomatis',
    title: 'AI Chatbot untuk Customer Service Toko Online',
    excerpt: 'Implementasi AI chatbot yang bener-bener works untuk e-commerce.',
    content: `## Kenapa Chatbot untuk E-Commerce?
Customer service adalah operational pain terbesar untuk e-commerce brand.

## Kunci Sukses Implementasi
1. **Training data yang tepat** — FAQ, product catalog, policy
2. **Multi-channel** — web, WhatsApp, Instagram
3. **Escalation logic** — chatbot handle 80%, sisanya ke tim CS
4. **Monitoring** — track resolution rate, customer satisfaction

## Hasil yang Diharapkan
- CS workload turun 60–80%
- Response time < 5 detik
- Customer satisfaction meningkat`,
    category: 'AI',
    date: '2026-05-28',
    readTime: 12,
    author: 'Alif Nugraha',
    tags: ['Chatbot', 'AI', 'Customer Service'],
    image: '/blog/ai-chatbot-cs.webp',
    imageAlt: 'AI chatbot melayani customer di website dan WhatsApp secara real-time 24/7',
    imageCaption: 'AI Chatbot: 24/7 customer service di web & WhatsApp',
  },
  {
    slug: 'perbedaan-shopify-custom-ecommerce',
    title: 'Shopify vs Custom E-Commerce: Mana yang Tepat?',
    excerpt: 'Perbandingan komprehensif antara Shopify dan custom e-commerce.',
    content: `## Shopify vs Custom: Perbedaan Fundamental

| Aspek | Shopify | Custom (Next.js + Supabase) |
|---|---|---|
| Biaya bulanan | $29–$299/bln + transaction fee | Hosting ~$5–$20/bln |
| Kontrol | Terbatas pada template | Full control |
| Kustomisasi | Apps + Liquid | Full code custom |
| Skalabilitas | Tergantung plan | Unlimited |
| AI Integration | Limited via API | Built-in dari arsitektur |

## Kapan Pilih Custom?
- Lo butuh AI chatbot + RAG + automation
- Transaction volume tinggi (> 500 order/hari)
- Lo mau punya full control atas data & infrastructure`,
    category: 'E-Commerce',
    date: '2026-05-20',
    readTime: 15,
    author: 'Alif Nugraha',
    tags: ['Shopify', 'Custom', 'Perbandingan'],
    image: '/blog/shopify-vs-custom.webp',
    imageAlt: 'Perbandingan antara platform Shopify dengan custom e-commerce Next.js dan Supabase',
    imageCaption: 'Shopify vs Custom E-Commerce: mana yang tepat untuk bisnis lo?',
  },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found — WeeCommerce' };
  return {
    title: `${post.title} — WeeCommerce Blog`,
    description: post.excerpt.slice(0, 160),
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt.slice(0, 160),
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, width: 1200, height: 630, alt: post.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt.slice(0, 160),
      images: [post.image],
    },
    other: {
      'ai:author': post.author,
      'ai:published-date': post.date,
      'ai:updated-date': post.date,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Post not found.</p>
        <Link href="/blog" className="text-sm text-primary hover:underline">← Back to blog</Link>
      </div>
    );
  }

  // Parse markdown content into sections
  const sections = post.content.split(/\n(?=## )/).filter(Boolean);

  return (
    <div className="flex flex-col">
      {/* ── Article ── */}
      <article className="border-t border-border py-16 md:py-20">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <Link href="/blog" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" /> Back to blog
            </Link>

            {/* Meta */}
            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                <Tag className="size-3" /> {post.category}
              </span>
              <span className="flex items-center gap-1"><Calendar className="size-3" /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock className="size-3" /> {post.readTime} min read</span>
              <span className="flex items-center gap-1"><User className="size-3" /> {post.author}</span>
            </div>

            {/* Title */}
            <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* Featured Image — SEO + GEO optimized */}
            <div className="relative mb-10 overflow-hidden rounded-2xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              <img
                src={post.image}
                alt={post.imageAlt}
                className="aspect-video w-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              {post.imageCaption && (
                <div className="border-t border-border bg-card/80 px-5 py-3">
                  <p className="text-xs text-muted-foreground italic">
                    <span aria-hidden="true">📷 </span>
                    {post.imageCaption}
                    <meta name="ai:image-caption" content={post.imageCaption} />
                  </p>
                </div>
              )}
            </div>
            {/* Hidden AI metadata for GEO */}
            <meta name="ai:image-alt" content={post.imageAlt} />
            <meta name="ai:image-focus" content="informational diagram" />

            {/* Content */}
            <div className="space-y-6 text-base leading-relaxed md:text-lg">
              {sections.map((section, i) => {
                const lines = section.split('\n').filter(Boolean);
                const heading = lines[0].replace(/^## /, '');
                const body = lines.slice(1).join('\n');

                return (
                  <div key={i}>
                    <h2 className="mb-3 font-display text-xl font-semibold tracking-tight md:text-2xl">
                      {heading}
                    </h2>
                    <div className="text-muted-foreground space-y-4">
                      {body.split('\n\n').map((para, j) => {
                        // Handle bullet lists
                        if (para.includes('\n- ') || para.includes('\n* ')) {
                          const items = para.split('\n').filter((l) => l.startsWith('- ') || l.startsWith('* '));
                          const intro = para.split('\n')[0];
                          return (
                            <div key={j}>
                              {!intro.startsWith('-') && !intro.startsWith('*') && <p>{intro}</p>}
                              <ul className="mt-2 space-y-1.5">
                                {items.map((item, k) => (
                                  <li key={k} className="flex items-start gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                    <span>{item.replace(/^[-*] /, '')}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        }
                        // Handle numbered lists
                        if (para.includes('\n') && /^\d+\./.test(para.split('\n')[0])) {
                          const items = para.split('\n');
                          return (
                            <ol key={j} className="space-y-2 list-decimal pl-5">
                              {items.map((item, k) => (
                                <li key={k}>{item.replace(/^\d+\.\s*/, '')}</li>
                              ))}
                            </ol>
                          );
                        }
                        // Handle bold markers
                        const boldHtml = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        return <p key={j} dangerouslySetInnerHTML={{ __html: boldHtml }} />;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* ── Related Posts ── */}
      <section className="border-t border-border bg-card py-16">
        <div className="section-container">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-display text-xl font-semibold tracking-tight md:text-2xl">
              Related Articles
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {posts
                .filter((p) => p.slug !== slug && p.category === post.category)
                .slice(0, 2)
                .map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/30"
                  >
                    <div className="mb-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{related.category}</span>
                    </div>
                    <h3 className="font-display text-sm font-semibold group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{related.excerpt}</p>
                    <div className="mt-2 text-[10px] text-muted-foreground">{related.readTime} min read</div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── JSON-LD Article ── */}
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        thumbnailUrl: post.image,
        author: { '@type': 'Person', name: post.author },
        datePublished: post.date,
        dateModified: post.date,
        publisher: { '@type': 'Organization', name: 'WeeCommerce' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://weecommerce.web.id/blog/${post.slug}` },
      }} />

      {/* ── CTA ── */}
      <section className="border-t border-border py-12">
        <div className="section-container text-center">
          <p className="text-sm text-muted-foreground">
            Want to build an AI-powered e-commerce system?{' '}
            <Link href="/contact" className="text-primary hover:underline">Start a conversation</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
