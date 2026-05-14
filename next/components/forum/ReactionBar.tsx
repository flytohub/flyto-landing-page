'use client';

import { useState } from 'react';
import { ThumbsUp, Heart, Rocket, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toggleReaction, type Emoji } from '@/lib/forum';
import { cn } from '@/lib/cn';

const EMOJIS: { key: Emoji; Icon: typeof ThumbsUp }[] = [
  { key: 'thumbs_up', Icon: ThumbsUp },
  { key: 'heart',     Icon: Heart    },
  { key: 'rocket',    Icon: Rocket   },
  { key: 'eyes',      Icon: Eye      },
];

export function ReactionBar({
  postId,
  initialSum,
}: {
  postId: string;
  initialSum: number;
}) {
  const { user } = useAuth();
  const [active, setActive] = useState<Set<Emoji>>(new Set());
  const [sum, setSum] = useState(initialSum);
  const [busy, setBusy] = useState(false);

  async function toggle(emoji: Emoji) {
    if (!user || busy) return;
    setBusy(true);
    const has = active.has(emoji);
    const next = new Set(active);
    if (has) next.delete(emoji); else next.add(emoji);
    setActive(next);
    setSum((s) => s + (has ? -1 : 1));
    try {
      await toggleReaction(postId, user.uid, emoji, !has);
    } catch {
      // revert
      setActive(active);
      setSum(sum);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      {EMOJIS.map(({ key, Icon }) => (
        <button
          key={key}
          onClick={() => toggle(key)}
          disabled={!user || busy}
          aria-label={key}
          className={cn(
            'inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[12px] transition-colors',
            active.has(key)
              ? 'border-violet-400 bg-violet-500/20 text-violet-100'
              : 'border-[var(--color-line)] bg-ink-800 text-bone-300 hover:border-[var(--color-line-strong)] hover:text-bone-100',
            !user && 'cursor-not-allowed opacity-50',
          )}
        >
          <Icon className="h-3 w-3" strokeWidth={1.75} />
        </button>
      ))}
      <span className="num-mono ml-2 text-[12px] text-bone-300">{sum}</span>
    </div>
  );
}
