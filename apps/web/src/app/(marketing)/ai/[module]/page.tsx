import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import {
  ArrowRight, Check, X, Bot, Database, Workflow, Zap, Star, Clock, DollarSign,
  MessageCircle, Search, ShoppingCart, TrendingDown, Sparkles, Headphones,
  BarChart3, Users, RefreshCw, Globe, Smartphone, Shield, Layers, Gauge,
  Code, Cpu, TrendingUp, Target,
} from 'lucide-react';

/* ── 4 AI Module Pages ── */
const modules: Record<string, any> = {
  chatbot: {
    slug: 'chatbot',
    name: 'AI Customer Service Chatbot',
    shortName: 'AI Chatbot',
    tagline: '24/7 customer service yang tau produk lo — tanpa tambah tim CS.',
    price_idr: 'Rp 8–15 juta',
    price_usd: '$1,200–$2,500',
    timeline: '1–2 minggu',
    icon: MessageCircle,
    color: 'from-emerald-400/20 via-emerald-400/10 to-transparent',
    accent: 'emerald',
    problem: {
      headline: 'Customer lo nanya 24/7. Tim CS lo cuma kerja 8 jam.',
      bullets: [
        'Pertanyaan itu-itu aja: "ongkir berapa?", "barangnya kapan sampai?", "ini size apa?"',
        '1 orang CS cuma handle 20–30 chat per hari — di atas itu, pelayanan turun',
        'Kalau libur atau malam hari, pertanyaan menumpuk',
        'Rekrut CS baru = biaya training, gaji, turnover',
      ],
    },
    solution: {
      headline: 'AI chatbot yang paham produk lo. 24/7, tanpa capek.',
      desc: 'Chatbot yang di-training khusus dengan produk, FAQ, dan brand voice lo. Handle 60–80% pertanyaan otomatis — yang sisanya di-eskalasi ke tim lo dengan konteks lengkap.',
      highlights: [
        { icon: Headphones, label: 'Coverage', value: '24/7, termasuk hari libur' },
        { icon: Clock, label: 'Response time', value: '< 5 detik' },
        { icon: Bot, label: 'Auto-handle rate', value: '60–80%' },
      ],
    },
    howItWorks: [
      { icon: Database, title: '1. Training Data', desc: 'Kami training chatbot dengan product catalog, FAQ, policy, dan brand voice lo. Semua data diambil dari toko lo — gak perlu nulis ulang dari nol.' },
      { icon: Bot, title: '2. AI Processing', desc: 'Chatbot pake RAG (Retrieval-Augmented Generation) — kombinasi search + AI generatif. Jawabannya akurat karena based on data real-time, bukan hafalan.' },
      { icon: MessageCircle, title: '3. Multi-Channel', desc: 'Pasang di website toko lo, WhatsApp Business API, atau kedua-duanya. Satu chatbot untuk semua channel.' },
      { icon: Users, title: '4. Escalation', desc: 'Kalau ada pertanyaan yang di luar kemampuan chatbot, di-eskalasi ke tim lo — lengkap dengan riwayat chat dan konteks.' },
    ],
    included: [
      'Training chatbot dengan product & FAQ lo (hingga 1.000 item data)',
      'Integrasi website (chat widget)',
      'Integrasi WhatsApp Business API',
      'Custom brand voice & tone',
      'Sistem eskalasi otomatis ke tim CS',
      'Dashboard monitoring chat performance',
      '1 bulan maintenance + retraining',
    ],
    notIncluded: ['RAG System (terpisah, lihat module RAG)', 'n8n automation workflows'],
    useCases: [
      { icon: ShoppingCart, title: 'E-commerce', desc: 'Produk, ongkir, retur, status pesanan — semuanya otomatis.' },
      { icon: Clock, title: '24/7 Support', desc: 'Pertanyaan malam hari, akhir pekan, hari libur — tetap terjawab.' },
      { icon: Globe, title: 'Multi-Language', desc: 'Jawab dalam Bahasa Indonesia dan Inggris secara otomatis.' },
    ],
  },
  rag: {
    slug: 'rag',
    name: 'RAG Knowledge Base',
    shortName: 'RAG System',
    tagline: 'Customer bisa tanya apapun tentang produk lo — dan chatbot jawab dengan akurat.',
    price_idr: 'Rp 10–18 juta',
    price_usd: '$1,500–$3,000',
    timeline: '1–2 minggu',
    icon: Database,
    color: 'from-violet-400/20 via-violet-400/10 to-transparent',
    accent: 'violet',
    problem: {
      headline: 'Chatbot biasa cuma jawab based on FAQ. Kalau pertanyaan agak beda, dia nyasar.',
      bullets: [
        'Katalog produk lo ribuan — chatbot gak mungkin hafal semuanya',
        'Stok berubah setiap hari, harga promo ganti mingguan',
        'Customer nanya barang yang mirip tapi beda varian — chatbot bingung',
        'Retrain manual setiap kali katalog berubah = capek',
      ],
    },
    solution: {
      headline: 'RAG = search + AI. Jawab akurat from your product catalog in real-time.',
      desc: 'RAG (Retrieval-Augmented Generation) menggabungkan product search dengan AI. Chatbot gak perlu hafal semua produk — dia tinggal "cari" di katalog lo setiap kali ada pertanyaan. Akurat, real-time, tanpa retrain manual.',
      highlights: [
        { icon: Search, label: 'Search-based', value: 'Cari real-time dari katalog' },
        { icon: RefreshCw, label: 'Auto-update', value: 'Stok & harga berubah otomatis' },
        { icon: Bot, label: 'Accuracy', value: 'Lebih tinggi dari chatbot biasa' },
      ],
    },
    howItWorks: [
      { icon: Database, title: '1. Knowledge Base', desc: 'Kami bangun vector database dari product catalog lo — nama produk, deskripsi, harga, varian, stok, kategori. Semua terindeks.' },
      { icon: Search, title: '2. Retrieval', desc: 'Setiap ada pertanyaan, sistem mencari produk/vendor yang paling relevan dari database. Bukan nebak — tapi search.' },
      { icon: Bot, title: '3. Generation', desc: 'Hasil search dikirim ke AI (GPT/Claude) buat ngerangkai jawaban yang natural dan kontekstual. Akurat karena sumbernya jelas.' },
      { icon: RefreshCw, title: '4. Auto-Sync', desc: 'Setiap kali katalog lo berubah (produk baru, harga update, stok habis), RAG otomatis nyesuain — tanpa perlu retrain manual.' },
    ],
    included: [
      'Vector database dari catalog lo (hingga 5.000 produk)',
      'Real-time product search & retrieval',
      'Auto-sync dengan database toko lo',
      'Integrasi dengan AI Chatbot (module terpisah / bundle)',
      'Support multi-category & multi-variant',
      'Custom embedding model sesuai domain',
    ],
    notIncluded: ['AI Chatbot widget (module terpisah)', 'Custom fine-tuning (enterprise)'],
    useCases: [
      { icon: ShoppingCart, title: 'Product Discovery', desc: 'Customer nemuin produk yang tepat lebih cepat & akurat.' },
      { icon: BarChart3, title: 'Catalog besar (1000+)', desc: 'RAG scale dengan jumlah produk berapa pun — gak peduli 100 atau 100.000 SKU.' },
      { icon: RefreshCw, title: 'Dynamic Pricing', desc: 'Harga & promo berubah? RAG otomatis ngikut. Gak perlu retrain.' },
    ],
  },
  n8n: {
    slug: 'n8n',
    name: 'n8n Automation',
    shortName: 'n8n Automation',
    tagline: 'Otomatis kerjaan manual toko lo. Order, CRM, email, inventory — semua jalan sendiri.',
    price_idr: 'Rp 8–15 juta',
    price_usd: '$1,200–$2,500',
    timeline: '1–2 minggu',
    icon: Workflow,
    color: 'from-orange-400/20 via-orange-400/10 to-transparent',
    accent: 'orange',
    problem: {
      headline: 'Tim lo sibuk input data, kirim notif manual, dan ngejar abandoned cart yang numpuk.',
      bullets: [
        'Order baru masuk = harus kirim notif manual ke customer + tim produksi',
        'CRM di-update satu-satu — capek dan rawan human error',
        'Abandoned cart gak ada follow-up otomatis — potensi revenue hilang',
        'Stok barang harus di-check manual, baru order kalau mau restock',
      ],
    },
    solution: {
      headline: 'n8n automate semua repetitive tasks. Tanpa code. Tanpa ribet.',
      desc: 'n8n adalah workflow automation platform open-source. Kami configurasi 3–5 workflow custom sesuai SOP toko lo. Order, CRM, email, inventory — semuanya jalan otomatis. Lo cukup monitor.',
      highlights: [
        { icon: Workflow, label: 'Workflows included', value: '3–5 custom' },
        { icon: Clock, label: 'Time saved', value: '20+ jam/minggu' },
        { icon: ShoppingCart, label: 'Abandoned cart recovery', value: '+15–25%' },
      ],
    },
    howItWorks: [
      { icon: ShoppingCart, title: '1. Order Workflow', desc: 'Order baru → notif WhatsApp/Email ke customer + update otomatis ke tim produksi + log ke CRM. Semua dalam hitungan detik.' },
      { icon: Users, title: '2. CRM Sync', desc: 'Data customer sinkron ke CRM (atau Google Sheets / Airtable) otomatis setiap ada transaksi. Update status, riwayat belanja, segmentasi.' },
      { icon: ShoppingCart, title: '3. Abandoned Cart', desc: 'Customer tinggalin cart? Auto-reminder via WhatsApp/Email di H+1, H+3, H+7. Dengan promo personal jika perlu.' },
      { icon: BarChart3, title: '4. Inventory Alert', desc: 'Stok menipis → notif ke tim purchasing. Bisa auto-create purchase order kalau udah setup.' },
    ],
    included: [
      '3–5 custom n8n workflows sesuai SOP toko lo',
      'Integrasi WhatsApp Business API',
      'Integrasi Email (Resend / SMTP)',
      'CRM sync (Google Sheets / Airtable / API)',
      'Abandoned cart recovery sequence',
      'Inventory alert automation',
      'Monitoring dashboard + error alert',
      '1 bulan maintenance',
    ],
    notIncluded: ['AI Chatbot', 'RAG System', 'Custom API integration di luar service yang disebut'],
    useCases: [
      { icon: ShoppingCart, title: 'Order Automation', desc: 'Dari order masuk → notif → update CRM → kirim — semua otomatis.' },
      { icon: Users, title: 'CRM & Follow-up', desc: 'Data customer rapi tanpa input manual. Follow-up otomatis.' },
      { icon: BarChart3, title: 'Inventory Management', desc: 'Stok menipis? Auto-notif ke purchasing. Gak pernah kehabisan.' },
    ],
  },
  suite: {
    slug: 'suite',
    name: 'Full AI Suite',
    shortName: 'Full AI Suite',
    tagline: 'Semua module AI dalam satu bundle. Paling hemat & fully integrated.',
    price_idr: 'Rp 22–40 juta',
    price_usd: '$3,500–$6,500',
    timeline: '3–6 minggu',
    icon: Star,
    color: 'from-teal-400/20 via-teal-400/10 to-transparent',
    accent: 'teal',
    problem: {
      headline: 'Lo butuh chatbot + RAG + n8n. Beli terpisah lebih mahal dan gak nyambung.',
      bullets: [
        'Kalau pasang chatbot doang, tanpa RAG jawabannya kurang akurat',
        'Kalau pasang RAG doang, tanpa chatbot customer gak bisa nanya langsung',
        'Kalau pasang n8n doang, CS masih manual — operasional jalan tapi CS tetep berat',
        'Masing-masing vendor beda platform, beda login, gak terintegrasi',
      ],
    },
    solution: {
      headline: 'Full AI Suite — semua module dalam satu bundle. Integrated. Lebih hemat.',
      desc: 'AI Chatbot + RAG + n8n dalam satu paket. Chatbot pake RAG biar jawab akurat. n8n automate operasional. Semua terintegrasi — dashboard, database, branding. Lebih hemat 30–40% daripada pasang terpisah.',
      highlights: [
        { icon: Star, label: 'Bundle hemat', value: '30–40% lebih murah' },
        { icon: Layers, label: 'Modules', value: '3 fully integrated' },
        { icon: Bot, label: 'Auto-handle rate', value: '80%+ inquiries' },
      ],
    },
    modules: [
      { icon: MessageCircle, name: 'AI Chatbot', desc: '24/7 customer service. Training produk + FAQ + brand voice.', price: 'Include' },
      { icon: Database, name: 'RAG System', desc: 'Knowledge base real-time dari katalog. Auto-sync.', price: 'Include' },
      { icon: Workflow, name: 'n8n Automation', desc: '3–5 workflow: order, CRM, inventory, abandoned cart.', price: 'Include' },
    ],
    howItWorks: [
      { icon: Layers, title: 'Integrated Architecture', desc: 'Ketiga module berbagi database dan infrastruktur yang sama. Chatbot + RAG = jawab akurat. n8n = tindak lanjut otomatis. Satu dashboard untuk semua.' },
      { icon: Gauge, title: 'Workflow Contoh', desc: 'Customer chat "status pesanan saya" → Chatbot+RAG cek database → Jawab status real-time → Kalau ada masalah, eskalasi ke tim CS + n8n kirim notif ke tim fulfillment — semua dalam satu sistem.' },
      { icon: Cpu, title: 'Scalable', desc: 'Bundle ini tumbuh bareng bisnis lo. Nambah produk? RAG auto-sync. Nambah tim? Chatbot tetap handle 80% inquiries. Traffic naik? Infrastruktur siap.' },
    ],
    included: [
      'AI Chatbot (training + integrasi web & WhatsApp)',
      'RAG System (vector database + real-time retrieval)',
      'n8n Automation (3–5 workflows)',
      'Integrasi penuh antar module (satu ekosistem)',
      'Dashboard terpadu untuk monitoring',
      '1 bulan maintenance & support',
      'Hemat 30–40% dibanding beli terpisah',
    ],
    notIncluded: ['Custom fine-tuning (enterprise)', 'Dedicated VPS / hosting (ditanggung klien)'],
    useCases: [
      { icon: Bot, title: 'Full AI Store', desc: 'Toko online dengan CS 24/7 + product discovery + operasional otomatis.' },
      { icon: TrendingUp, title: 'Scale-Up Brand', desc: 'Bisnis yang siap scale tanpa nambah tim CS & operasional.' },
      { icon: ShoppingCart, title: 'High-Volume Store', desc: 'Ratusan order/hari. CS, katalog, operasional — semua AI-powered.' },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const mod = modules[module];
  if (!mod) return { title: 'AI Module — WeeCommerce' };
  return {
    title: `${mod.shortName} — AI for E-Commerce`,
    description: mod.tagline.slice(0, 160),
    alternates: { canonical: `/ai/${module}` },
    openGraph: { title: `${mod.name} — WeeCommerce`, description: mod.tagline.slice(0, 160) },
  };
}

export default async function AIModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const mod = modules[module];
  if (!mod) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Module not found.</div>;

  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: mod.name,
        description: mod.tagline,
        provider: { '@type': 'Organization', name: 'WeeCommerce' },
        offers: {
          '@type': 'Offer',
          price: mod.price_idr.replace(/[^0-9]/g, ''),
          priceCurrency: 'IDR',
          availability: 'https://schema.org/InStock',
        },
      }} />
      <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════════
           1. HERO
      ════════════════════════════════════════════════════ */}
      <section className={`border-t border-border py-16 md:py-24`}>
        <div className="section-container">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <a href="/services/integrate" className="mb-6 self-start text-sm text-muted-foreground hover:text-foreground">
              ← Back to INTEGRATE
            </a>
            <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20`}>
              <mod.icon className="size-8" />
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">{mod.name}</h1>
            <p className="mt-3 max-w-xl text-lg text-muted-foreground">{mod.tagline}</p>

            <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
              {[
                { icon: DollarSign, label: 'Harga Mulai', value: mod.price_idr },
                { icon: DollarSign, label: 'USD Mulai', value: mod.price_usd },
                { icon: Clock, label: 'Timeline', value: mod.timeline },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-center gap-3 rounded-xl border border-border bg-card p-4">
                  <m.icon className="size-5 shrink-0 text-primary" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="font-mono text-sm font-medium">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
           2. PROBLEM → SOLUTION
      ════════════════════════════════════════════════════ */}
      {mod.problem && (
        <section className="border-t border-border bg-card py-16">
          <div className="section-container">
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <TrendingDown className="size-5" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-red-400">Problem</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mod.problem.headline}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {mod.problem.bullets.map((b: string) => (
                      <li key={b} className="flex items-start gap-2">
                        <X className="mt-0.5 size-3.5 shrink-0 text-red-400" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="size-5" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-primary">Solution</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mod.solution.headline}</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">{mod.solution.desc}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {mod.solution.highlights.map((h: any) => (
                      <div key={h.label} className="text-center">
                        <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <h.icon className="size-4" />
                        </div>
                        <p className="font-mono text-sm font-medium text-primary">{h.value}</p>
                        <p className="text-[10px] text-muted-foreground">{h.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
           3. HOW IT WORKS (Step-by-step)
      ════════════════════════════════════════════════════ */}
      {mod.howItWorks && (
        <section className="border-t border-border py-16">
          <div className="section-container">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">How It Works</div>
              <h2 className="mb-10 font-display text-xl font-semibold tracking-tight md:text-2xl">
                {mod.shortName} in {mod.howItWorks.length} Steps
              </h2>
              <div className="space-y-6">
                {mod.howItWorks.map((step: any, i: number) => (
                  <div key={step.title} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {step.icon ? <step.icon className="size-5" /> : <span className="text-sm font-mono">{i + 1}</span>}
                      </div>
                      {i < mod.howItWorks.length - 1 && <div className="mt-1 h-full w-px bg-border/50" />}
                    </div>
                    <div className="pb-6">
                      <h3 className="font-display text-base font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
           4. USE CASES
      ════════════════════════════════════════════════════ */}
      {mod.useCases && (
        <section className="border-t border-border bg-card py-16">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-3 font-display text-xl font-semibold tracking-tight md:text-2xl">Use Cases</h2>
              <p className="mb-8 text-sm text-muted-foreground">Best scenarios for {mod.shortName}.</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {mod.useCases.map((u: any) => (
                  <div key={u.title} className="flex flex-col items-center rounded-xl border border-border bg-background p-6 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <u.icon className="size-5" />
                    </div>
                    <h3 className="font-display text-sm font-semibold">{u.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{u.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
           5. WHAT'S INCLUDED + MODULES (Suite)
      ════════════════════════════════════════════════════ */}
      <section className="border-t border-border py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-3 text-center font-display text-xl font-semibold tracking-tight md:text-2xl">What's Included</h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">Everything that comes with {mod.shortName}.</p>
            <div className="space-y-3">
              {mod.included.map((item: string) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 text-sm">
                  <Check className="size-4 shrink-0 text-primary" />
                  {item}
                </div>
              ))}
            </div>

            {/* Suite module breakdown */}
            {mod.modules && (
              <div className="mt-10">
                <h3 className="mb-6 text-center font-display text-lg font-semibold">Everything in One Bundle</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {mod.modules.map((m: any) => (
                    <div key={m.name} className="flex flex-col items-center rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <m.icon className="size-5" />
                      </div>
                      <h4 className="font-display text-sm font-semibold">{m.name}</h4>
                      <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
                      <span className="mt-2 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-medium text-primary-foreground">{m.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
           6. NOT INCLUDED
      ════════════════════════════════════════════════════ */}
      <section className="border-t border-border bg-card py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-3 text-center font-display text-xl font-semibold tracking-tight md:text-2xl">Not Included</h2>
            <p className="mb-6 text-center text-sm text-muted-foreground">Items outside the scope of {mod.shortName}.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {mod.notIncluded.map((item: string) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 px-5 py-4 text-sm text-muted-foreground">
                  <X className="size-4 shrink-0 text-muted-foreground/50" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
           7. INVESTMENT
      ════════════════════════════════════════════════════ */}
      <section className="border-t border-border py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-3 font-display text-xl font-semibold tracking-tight md:text-2xl">Investment</h2>
            <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-border bg-card px-8 py-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Mulai IDR</p>
                <p className="font-mono text-2xl font-medium text-primary md:text-3xl">{mod.price_idr}</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Mulai USD</p>
                <p className="font-mono text-2xl font-medium md:text-3xl">{mod.price_usd}</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Timeline</p>
                <p className="font-mono text-2xl font-medium md:text-3xl">{mod.timeline}</p>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <Shield className="mr-1 inline size-3 text-primary" />
              Milestone-based payment. Source code ownership upon final payment.
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
           8. CTA
      ════════════════════════════════════════════════════ */}
      <section className="border-t border-border bg-card py-20">
        <div className="section-container text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Ready to Add AI to Your Store?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Let's discuss which module fits your business. 30-minute discovery call — no pressure.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90">
              Book a Discovery Call <ArrowRight className="size-4" />
            </Link>
            <Link href="/services/integrate" className="inline-flex h-11 items-center rounded-full border border-border bg-background px-7 text-sm font-medium hover:bg-card">
              Back to INTEGRATE
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
