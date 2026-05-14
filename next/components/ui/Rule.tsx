import { cn } from '@/lib/cn';

export function Rule({ className, label }: { className?: string; label?: string }) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-3 text-bone-100/40', className)}>
        <span className="h-px flex-1 bg-[var(--color-line)]" />
        <span className="label-mono">{label}</span>
        <span className="h-px flex-1 bg-[var(--color-line)]" />
      </div>
    );
  }
  return <div className={cn('h-px w-full bg-[var(--color-line)]', className)} />;
}
