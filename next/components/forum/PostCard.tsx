'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  MessageSquare,
  ThumbsUp,
  Pin,
  CheckCircle2,
  HelpCircle,
  Bug,
  Sparkles,
  Megaphone,
  Eye,
} from 'lucide-react';
import type { Category, Post } from '@/lib/forum';
import { cn } from '@/lib/cn';

interface CategoryStyle {
  Icon:   typeof HelpCircle;
  text:   string;       // tag text colour class
  bar:    string;       // accent bar bg colour (hex/rgba)
  label:  string;
}

const CATEGORY_META: Record<Category, CategoryStyle> = {
  question:   { Icon: HelpCircle, text: 'text-violet-300',  bar: 'rgba(167, 139, 250, 0.6)', label: 'Q&A'      },
  bug:        { Icon: Bug,        text: 'text-red-300',     bar: 'rgba(248, 113, 113, 0.6)', label: 'Bug'      },
  feature:    { Icon: Sparkles,   text: 'text-amber-300',   bar: 'rgba(252, 211, 77, 0.6)',  label: 'Feature'  },
  discussion: { Icon: Megaphone,  text: 'text-cyan-300',    bar: 'rgba(103, 232, 249, 0.6)', label: 'Discuss'  },
};

export function PostCard({ post }: { post: Post }) {
  const locale = useLocale();
  const meta = CATEGORY_META[post.category];
  const { Icon } = meta;
  const productPath = post.product === 'cloud' ? '/cloud/discussions' : '/code/discussions';
  const localized = (href: string) => (locale === 'en' ? href : `/${locale}${href}`);
  const href = `${localized(productPath)}?post=${post.id}`;

  return (
    <Link
      href={href}
      className={cn(
        'group relative grid grid-cols-[3px_1fr] gap-0 overflow-hidden rounded-xl border border-[var(--color-line)] bg-ink-800 transition-all duration-300',
        'hover:-translate-y-px hover:border-[var(--color-line-strong)] hover:bg-ink-700/70',
      )}
    >
      {/* Left accent bar — colour matches category */}
      <span
        className="block opacity-30 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: meta.bar }}
        aria-hidden
      />

      <div className="flex flex-col gap-3 px-5 py-4 sm:px-6 sm:py-5">
        {/* Tag row */}
        <div className="flex items-center gap-2.5 text-[11px]">
          <span className={cn('inline-flex items-center gap-1 font-mono tracking-[0.16em] uppercase', meta.text)}>
            <Icon className="h-3 w-3" strokeWidth={1.75} />
            {meta.label}
          </span>
          {post.pinned && (
            <span className="inline-flex items-center gap-1 font-mono tracking-[0.14em] uppercase text-amber-300/90">
              <Pin className="h-3 w-3" strokeWidth={2} />
              Pinned
            </span>
          )}
          {post.solution_id && (
            <span className="inline-flex items-center gap-1 font-mono tracking-[0.14em] uppercase text-emerald-300">
              <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
              Solved
            </span>
          )}
          {post.locked && (
            <span className="font-mono tracking-[0.14em] uppercase text-bone-300">Locked</span>
          )}
          <span className="ml-auto num-mono text-[10.5px] text-bone-300">{relTime(post.created_at)}</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-[17px] font-semibold leading-snug tracking-tight transition-colors group-hover:text-violet-100">
          {post.title}
        </h3>

        {/* Body preview */}
        <p className="line-clamp-2 text-[13px] leading-relaxed text-bone-200">{post.body}</p>

        {/* Footer row — author + counters */}
        <div className="mt-1 flex items-center gap-3 border-t border-[var(--color-line)] pt-3 text-[11.5px] text-bone-300">
          <Avatar name={post.user_name} avatar={post.user_avatar} isOfficial={post.is_official} />
          <span className="ml-auto inline-flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" strokeWidth={1.75} />
              <span className="num-mono">{compact(post.view_count)}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" strokeWidth={1.75} />
              <span className="num-mono">{post.reply_count}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" strokeWidth={1.75} />
              <span className="num-mono">{post.reaction_sum}</span>
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function Avatar({
  name, avatar, isOfficial, size = 'sm',
}: {
  name: string;
  avatar?: string;
  isOfficial?: boolean;
  size?: 'sm' | 'md';
}) {
  const sz = size === 'md' ? 'h-7 w-7 text-[12px]' : 'h-5 w-5 text-[10px]';
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <span className="inline-flex items-center gap-1.5">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          alt={name}
          className={cn(sz, 'rounded-full object-cover')}
        />
      ) : (
        <span
          className={cn(
            sz,
            'inline-grid place-items-center rounded-full font-mono font-semibold',
            isOfficial
              ? 'bg-violet-500/30 text-violet-100 ring-1 ring-violet-400'
              : 'bg-ink-700 text-bone-200',
          )}
        >
          {initial}
        </span>
      )}
      <span className={cn(isOfficial ? 'text-violet-200' : 'text-bone-200')}>{name}</span>
      {isOfficial && (
        <span className="rounded-sm border border-violet-400/40 px-1 font-mono text-[8.5px] tracking-[0.18em] text-violet-200">
          OFFICIAL
        </span>
      )}
    </span>
  );
}

function relTime(d: Date): string {
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)    return 'just now';
  if (mins < 60)   return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)    return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30)   return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(months / 12)}y`;
}

function compact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}
