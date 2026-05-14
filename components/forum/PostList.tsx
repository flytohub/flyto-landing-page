'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import type { QueryDocumentSnapshot } from 'firebase/firestore';
import { listPosts, localeToLang, type Category, type Post, type Product, type Sort } from '@/lib/forum';
import { PostCard } from './PostCard';
import { CategoryFilter } from './CategoryFilter';
import { SortToggle } from './SortToggle';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/cn';

interface PostListProps {
  product: Product;
  onComposeClick: () => void;
}

const PAGE_SIZE = 20;

export function PostList({ product, onComposeClick }: PostListProps) {
  const t = useTranslations('forum.list');
  const locale = useLocale();
  const lang = localeToLang(locale);
  const { user } = useAuth();

  const [posts, setPosts]       = useState<Post[]>([]);
  const [category, setCat]      = useState<Category | 'all'>('all');
  const [sort, setSort]         = useState<Sort>('new');
  const [page, setPage]         = useState(1);
  /** Stack of cursors. cursorStack[i] is the cursor used to load page i+2.
   *  Page 1 uses no cursor; page 2 uses cursorStack[0]; page N uses cursorStack[N-2]. */
  const [cursorStack, setCursorStack] = useState<QueryDocumentSnapshot[]>([]);
  const [nextCursor, setNextCursor]   = useState<QueryDocumentSnapshot | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [indexRetry, setIndexRetry] = useState(0);

  const MAX_INDEX_RETRIES = 10;
  const RETRY_INTERVAL_MS = 30_000;

  /**
   * Load a specific page. `cursor` is the snapshot to start AFTER (null = page 1).
   * Posts always replace (not append) since pagination shows one page at a time.
   */
  const fetchPage = useCallback(async (cursor: QueryDocumentSnapshot | null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await listPosts({
        product,
        lang,
        category,
        sort,
        pageSize: PAGE_SIZE,
        cursor,
      });
      setPosts(result.posts);
      setNextCursor(result.nextCursor);
      setIndexRetry(0);
    } catch (e: unknown) {
      const raw = e instanceof Error ? e.message : String(e);
      // eslint-disable-next-line no-console
      console.error('[forum] listPosts failed:', e);
      const isIndexBuilding =
        /currently building/i.test(raw)
        || /requires an index/i.test(raw);
      if (isIndexBuilding) {
        setError(t('indexBuilding'));
        setIndexRetry((n) => n + 1);
      } else {
        setError(raw);
      }
    } finally {
      setLoading(false);
    }
  }, [product, lang, category, sort, t]);

  // Auto-retry while the index is still building.
  useEffect(() => {
    if (indexRetry === 0 || indexRetry > MAX_INDEX_RETRIES) return;
    const cursor = cursorStack[cursorStack.length - 1] ?? null;
    const id = setTimeout(() => fetchPage(cursor), RETRY_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [indexRetry, cursorStack, fetchPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
    setCursorStack([]);
    setNextCursor(null);
    fetchPage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, lang, category, sort]);

  const goNext = () => {
    if (!nextCursor || loading) return;
    const newStack = [...cursorStack, nextCursor];
    setCursorStack(newStack);
    setPage((p) => p + 1);
    fetchPage(nextCursor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goPrev = () => {
    if (page <= 1 || loading) return;
    const newStack = cursorStack.slice(0, -1);
    setCursorStack(newStack);
    setPage((p) => p - 1);
    const prevCursor = newStack[newStack.length - 1] ?? null;
    fetchPage(prevCursor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goFirst = () => {
    if (page <= 1 || loading) return;
    setCursorStack([]);
    setPage(1);
    fetchPage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <CategoryFilter value={category} onChange={setCat} />
          <SortToggle value={sort} onChange={setSort} />
        </div>
        <button
          onClick={onComposeClick}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--color-line-strong)] bg-violet-500/15 px-4 py-2 text-[13px] font-medium text-bone-100 transition-all hover:-translate-y-px hover:bg-violet-500/25"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          <span>{user ? t('compose') : t('composeSignIn')}</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/[0.06] p-4 text-[13px] text-red-300">
          {error}
        </div>
      )}

      {/* Empty state */}
      {posts.length === 0 && !loading && !error && (
        <div className="rounded-xl border border-[var(--color-line)] bg-ink-800/40 p-10 text-center">
          <p className="text-[14px] text-bone-200">{t('empty')}</p>
        </div>
      )}

      {/* Loading state (full overlay-style placeholder) */}
      {loading && posts.length === 0 && (
        <div className="flex items-center justify-center py-20 text-bone-300">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {/* Posts grid */}
      <motion.div
        key={`page-${page}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={cn('grid gap-3', loading && posts.length > 0 && 'opacity-50 pointer-events-none')}
      >
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </motion.div>

      {/* Pagination footer */}
      {(posts.length > 0 || page > 1) && (
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-[var(--color-line)] pt-6">
          <div className="font-mono text-[11.5px] tracking-[0.16em] uppercase text-bone-300">
            {t('pageIndicator', { page })}
          </div>

          <div className="flex items-center gap-1.5">
            {page > 2 && (
              <button
                onClick={goFirst}
                disabled={loading}
                className="hidden h-9 items-center rounded-full border border-[var(--color-line)] bg-ink-800 px-3 font-mono text-[11px] tracking-wide text-bone-300 transition-colors hover:border-[var(--color-line-strong)] hover:text-bone-100 disabled:opacity-50 sm:inline-flex"
              >
                {t('first')}
              </button>
            )}
            <button
              onClick={goPrev}
              disabled={page <= 1 || loading}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-[var(--color-line)] bg-ink-800 px-3.5 text-[12.5px] tracking-wide text-bone-200 transition-colors hover:border-[var(--color-line-strong)] hover:text-bone-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>{t('prev')}</span>
            </button>
            <button
              onClick={goNext}
              disabled={!nextCursor || loading}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-[var(--color-line-strong)] bg-violet-500/15 px-3.5 text-[12.5px] font-medium tracking-wide text-bone-100 transition-all hover:-translate-y-px hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <span>{t('next')}</span>
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
