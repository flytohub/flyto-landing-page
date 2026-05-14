import { cn } from '@/lib/cn';

type Variant = 'default' | 'live' | 'beta' | 'soon';

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
    beta: 'border-cyan-400/45 bg-cyan-400/[0.04] text-cyan-200',
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
      {(variant === 'live' || variant === 'beta') && (
        <span className="pulse-dot" aria-hidden />
      )}
      {children}
    </span>
  );
}
