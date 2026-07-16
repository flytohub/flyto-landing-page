import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  arrow?: boolean;
}

type AsLink = BaseProps & { href: string; onClick?: never; type?: never };
type AsButton = BaseProps & {
  href?: never;
  onClick?: () => void;
  type?: 'button' | 'submit';
};

export function Button(props: AsLink | AsButton) {
  const { variant = 'primary', className, children, arrow } = props;

  const base =
    'btn-shimmer group relative inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium tracking-wide transition-all duration-300 will-change-transform';

  const styles: Record<Variant, string> = {
    primary:
      'bg-bone-100 text-ink-900 hover:bg-white hover:-translate-y-[1px] shadow-[0_10px_40px_-10px_rgba(244,237,226,0.4)]',
    secondary:
      'border border-[var(--color-line-strong)] text-bone-100 hover:border-violet-400 hover:bg-violet-500/10',
    ghost: 'text-bone-100/80 hover:text-bone-100',
  };

  const inner = (
    <span className="relative z-10 inline-flex items-center gap-2">
      {children}
      {arrow && (
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.5}
        />
      )}
    </span>
  );

  const cls = cn(base, styles[variant], className);

  if ('href' in props && props.href) {
    const prefetch = props.href.startsWith('/') && !props.href.startsWith('//') ? false : undefined;

    return (
      <Link href={props.href} prefetch={prefetch} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={props.type ?? 'button'} onClick={props.onClick} className={cls}>
      {inner}
    </button>
  );
}
