'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Loader2, Lock, Pin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  getPost,
  listComments,
  bumpView,
  type Comment,
  type Post,
} from '@/lib/forum';
import { Avatar } from './PostCard';
import { ReactionBar } from './ReactionBar';
import { CommentThread } from './CommentThread';

export function PostDetail({ postId, backHref }: { postId: string; backHref: string }) {
  const t = useTranslations('forum.detail');

  const [post, setPost]         = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [p, cs] = await Promise.all([getPost(postId), listComments(postId)]);
      setPost(p);
      setComments(cs);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('error');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [postId, t]);

  useEffect(() => {
    refresh();
    bumpView(postId).catch(() => {});
  }, [postId, refresh]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center px-5 py-24 text-bone-300 sm:px-8">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-[13px] text-bone-200 transition-colors hover:text-bone-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>{t('back')}</span>
        </Link>
        <p className="mt-8 text-[14px] text-red-400">{error ?? t('notFound')}</p>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <Link
        href={backHref}
        className="mb-8 inline-flex items-center gap-2 text-[13px] text-bone-200 transition-colors hover:text-bone-100"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        <span>{t('back')}</span>
      </Link>

      <header className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] uppercase">
          <span className="text-violet-300">{post.category}</span>
          {post.pinned && (
            <span className="inline-flex items-center gap-1 text-amber-300">
              <Pin className="h-3 w-3" strokeWidth={2} /> Pinned
            </span>
          )}
          {post.locked && (
            <span className="inline-flex items-center gap-1 text-bone-300">
              <Lock className="h-3 w-3" strokeWidth={2} /> Locked
            </span>
          )}
        </div>
        <h1 className="font-display text-[clamp(28px,4vw,40px)] font-semibold leading-tight tracking-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-[12.5px] text-bone-300">
          <Avatar name={post.user_name} avatar={post.user_avatar} isOfficial={post.is_official} size="md" />
          <span className="num-mono">{post.created_at.toLocaleString()}</span>
          <span className="num-mono">{post.view_count} views</span>
        </div>
      </header>

      <div className="prose-forum mt-8 text-[15px] leading-relaxed text-bone-100">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
      </div>

      {post.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-[var(--color-line)] bg-ink-800 px-2 py-0.5 font-mono text-[10.5px] text-bone-300"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 border-y border-[var(--color-line)] py-4">
        <ReactionBar postId={post.id} initialSum={post.reaction_sum} />
      </div>

      <div className="mt-12">
        <CommentThread post={post} comments={comments} onCommentCreated={refresh} />
      </div>
    </article>
  );
}
