import { cn } from '@/lib/utils';

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-display text-lg font-semibold tracking-tight',
        className,
      )}
    >
      Wee<span className="text-primary">·</span>Commerce
    </span>
  );
}
