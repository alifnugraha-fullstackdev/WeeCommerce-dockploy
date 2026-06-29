'use client';
import { cn } from '@/lib/utils';

const locales = [
  { code: 'id', label: 'ID' },
];

export function LocaleSwitcher() {
  const current = 'id';

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-card p-0.5 text-xs">
      {locales.map((locale) => (
        <span
          key={locale.code}
          className={cn(
            'rounded-full px-2 py-1 transition-colors',
            current === locale.code
              ? 'bg-card-foreground/10 text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {locale.label}
        </span>
      ))}
      {/* EN — coming soon */}
      <span
        className="rounded-full px-2 py-1 text-xs text-muted-foreground/40 line-through cursor-not-allowed"
        title="English version coming soon"
      >
        EN
      </span>
    </div>
  );
}
