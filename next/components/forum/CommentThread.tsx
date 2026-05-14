'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth, toAuthor } from '@/lib/auth';
import { createComment, type Comment, type Post } from '@/lib/forum';
import { Avatar } from './PostCard';
import { AuthGate } from './AuthGate';
import { cn } from '@/lib/cn';

export function CommentThread({
  post,
  comments,
  onCommentCreated,
}: {
  post: Post;
  comments: Comment[];
  onCommentCreated: () => void;
}) {
  const t = useTranslations('forum.comments');
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <h3 className="font-display text-xl font-semibold tracking-tight">
          {t('heading', { count: comments.length })}
        </h3>
        <span className="h-px flex-1 bg-[var(--color-line)]" />
      </div>

      <ul className="space-y-3">
        {comments.length === 0 && (
          <li className="rounded-xl border border-[var(--color-line)] bg-ink-800/40 p-6 text-center text-[13px] text-bone-200">
            {t('empty')}
          </li>
        )}
        {comments.map((c) => (
          <CommentRow key={c.id} c={c} post={post} />
        ))}
      </ul>

      {!post.locked && (
        <div className="mt-6">
          <AuthGate intent="comment">
            <CommentForm postId={post.id} onCreated={onCommentCreated} />
          </AuthGate>
        </div>
      )}
    </section>
  );
}

function CommentRow({ c, post }: { c: Comment; post: Post }) {
  const isSolution = c.id === post.solution_id;
  return (
    <li
      className={cn(
        'rounded-xl border bg-ink-800 p-5 sm:p-6',
        isSolution
          ? 'border-emerald-400/30 bg-emerald-500/[0.03]'
          : 'border-[var(--color-line)]',
        c.is_official && !isSolution && 'border-violet-400/30 bg-violet-500/[0.03]',
      )}
    >
      <div className="mb-3 flex items-center gap-3 text-[12px] text-bone-300">
        <Avatar name={c.user_name} avatar={c.user_avatar} isOfficial={c.is_official} size="md" />
        <span className="num-mono">{c.created_at.toLocaleString()}</span>
        {isSolution && (
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10.5px] tracking-[0.16em] uppercase text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Solution</span>
          </span>
        )}
      </div>
      <div className="prose-forum text-[14px] leading-relaxed text-bone-100">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{c.body}</ReactMarkdown>
      </div>
    </li>
  );
}

function CommentForm({ postId, onCreated }: { postId: string; onCreated: () => void }) {
  const { user } = useAuth();
  const t = useTranslations('forum.comments');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true); setErr(null);
    try {
      await createComment(postId, toAuthor(user), body.trim());
      setBody('');
      onCreated();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('error');
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-[var(--color-line)] bg-ink-800 p-5">
      <textarea
        required
        minLength={1}
        maxLength={5000}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={t('placeholder')}
        rows={4}
        className="w-full resize-y rounded-md border border-[var(--color-line)] bg-ink-900/40 px-4 py-3 font-mono text-[13px] leading-relaxed text-bone-100 outline-none transition-colors placeholder:text-bone-300/60 focus:border-violet-400"
      />
      {err && <p className="mt-2 text-[12px] text-red-400">{err}</p>}
      <div className="mt-3 flex items-center justify-end">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line-strong)] bg-violet-500/15 px-4 py-2 text-[13px] font-medium tracking-wide text-bone-100 transition-all hover:-translate-y-px hover:bg-violet-500/25 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" strokeWidth={1.75} />}
          <span>{t('submit')}</span>
        </button>
      </div>
    </form>
  );
}
