"use client";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqData = [
  { q: 'Apakah WeeCommerce hanya melayani Indonesia?', a: 'Untuk Phase 1, kami fokus melayani brand lokal Indonesia (IDR pricing, komunikasi via WhatsApp/Threads). Layanan internasional (USD pricing, English) tersedia mulai bulan ke-6.', category: 'general' },
  { q: 'Berapa lama waktu pengerjaan project?', a: 'Bervariasi sesuai tier: LAUNCH 4–6 minggu, CONVERT 7–10 minggu, SCALE 10–16 minggu.', category: 'process' },
  { q: 'Apakah AI fine-tuning termasuk dalam paket?', a: 'Tidak. Fine-tuning tidak masuk tier manapun karena biaya compute-nya tidak predictable.', category: 'services' },
  { q: 'Siapa pemilik source code setelah project selesai?', a: 'Anda. Source code ownership ditransfer setelah pelunasan.', category: 'services' },
  { q: 'Apakah biaya API dan hosting termasuk?', a: 'Tidak. Biaya third-party (OpenAI, hosting, domain) ditanggung klien. Tidak ada markup dari kami.', category: 'pricing' },
  { q: 'Bagaimana sistem pembayaran?', a: 'Milestone-based: 50% DP setelah SPK, 30% staging delivery, 20% sebelum go-live.', category: 'pricing' },
  { q: 'Apa beda WeeCommerce dengan agency lain?', a: 'Kami specialist e-commerce, bukan generalist. Fokus tunggal: e-commerce systems + AI integration + automation.', category: 'general' },
  { q: 'Apakah ada maintenance setelah launch?', a: 'Ya. Retainer Basic (Rp 2–3jt/bln) atau Advanced (Rp 4–6jt/bln). 30 hari post-launch support termasuk.', category: 'pricing' },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const categories = [...new Set(faqData.map((f) => f.category))];
  const filtered = activeCategory ? faqData.filter((f) => f.category === activeCategory) : faqData;

  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="mb-4 text-center font-display text-4xl font-semibold tracking-tight md:text-5xl">FAQ</h1>
      <p className="mb-8 text-center text-muted-foreground">Frequently asked questions about WeeCommerce.</p>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {[{ label: 'All', value: null }, ...categories.map((c) => ({ label: c, value: c }))].map((item) => (
          <button key={item.label} onClick={() => { setActiveCategory(item.value); setOpenIndex(null); }}
            className={cn('rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              activeCategory === item.value ? 'bg-card-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((item, i) => (
          <div key={i} className="rounded-lg border border-border">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
              aria-controls={`faq-answer-${i}`}
              id={`faq-question-${i}`}
              className="flex w-full items-center justify-between px-5 py-4 text-left font-medium transition-colors hover:text-foreground"
            >
              <span>{item.q}</span>
              <ChevronDown className={cn('size-4 shrink-0 text-muted-foreground transition-transform duration-200', openIndex === i && 'rotate-180')} />
            </button>
            {openIndex === i && (
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                className="border-t border-border px-5 py-4 text-sm text-muted-foreground leading-relaxed"
              >
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
