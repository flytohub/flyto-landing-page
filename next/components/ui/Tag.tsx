import { cn } from '@/lib/cn';

type Variant = 'default' | 'live' | 'soon';

export function Tag({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const styles: Record<Variant, string> = {
    default: 'border-[var(--color-line-strong)] text-bone-100/70',
    live: 'border-emerald-500/40 text-emerald-300',
    soon: 'border-amber-400/40 text-amber-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase',
        styles[variant],
        className,
      )}
    >
      {variant === 'live' && <span className="pulse-dot" aria-hidden />}
      {children}
    </span>
  );
}
