'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { X, Loader2, Send } from 'lucide-react';
import { useAuth, toAuthor } from '@/lib/auth';
import { createPost, localeToLang, type Category, type Product } from '@/lib/forum';
import { AuthGate } from './AuthGate';
import { cn } from '@/lib/cn';

const CATS: Category[] = ['question', 'bug', 'feature', 'discussion'];

export function PostComposer({
  product,
  open,
  onClose,
  onCreated,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const t = useTranslations('forum.composer');
  const tCat = useTranslations('forum.categories');
  const locale = useLocale();
  const lang = localeToLang(locale);
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<Category>('question');
  const [tags, setTags] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true); setErr(null);
    try {
      const id = await createPost(toAuthor(user), {
        product,
        lang,
        category,
        title: title.trim(),
        body:  body.trim(),
        tags:  tags.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 5),
      });
      setTitle(''); setBody(''); setTags('');
      onCreated(id);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('error');
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink-900/85 px-4 py-8 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[var(--color-line-strong)] bg-ink-800 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-line)] text-bone-300 transition-colors hover:border-[var(--color-line-strong)] hover:text-bone-100"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div className="border-b border-[var(--color-line)] px-6 py-5 sm:px-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{t('title')}</h2>
          <p className="mt-1 text-[13px] text-bone-200">{t('subtitle')}</p>
        </div>

        <AuthGate intent="post">
          <form onSubmit={submit} className="space-y-4 px-6 py-6 sm:px-8">
            {/* Category chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-[12px] tracking-wide transition-colors',
                    category === c
                      ? 'border-violet-400 bg-violet-500/15 text-bone-100'
                      : 'border-[var(--color-line)] bg-ink-900/40 text-bone-200 hover:border-[var(--color-line-strong)]',
                  )}
                >
                  {tCat(c)}
                </button>
              ))}
            </div>

            <input
              required
              minLength={5}
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('titlePlaceholder')}
              className="w-full rounded-md border border-[var(--color-line)] bg-ink-900/40 px-4 py-3 text-[15px] font-medium text-bone-100 outline-none transition-colors placeholder:text-bone-300/60 focus:border-violet-400"
            />

            <textarea
              required
              minLength={10}
              maxLength={10000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t('bodyPlaceholder')}
              rows={10}
              className="w-full resize-y rounded-md border border-[var(--color-line)] bg-ink-900/40 px-4 py-3 font-mono text-[13.5px] leading-relaxed text-bone-100 outline-none transition-colors placeholder:text-bone-300/60 focus:border-violet-400"
            />

            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={t('tagsPlaceholder')}
              className="w-full rounded-md border border-[var(--color-line)] bg-ink-900/40 px-4 py-2.5 text-[13px] text-bone-100 outline-none transition-colors placeholder:text-bone-300/60 focus:border-violet-400"
            />

            {err && <p className="text-[12.5px] text-red-400">{err}</p>}

            <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-4">
              <p className="text-[11.5px] text-bone-300">{t('markdownHint')}</p>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line-strong)] bg-violet-500/20 px-5 py-2.5 text-[13px] font-medium tracking-wide text-bone-100 transition-all hover:-translate-y-px hover:bg-violet-500/30 disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
                )}
                <span>{t('submit')}</span>
              </button>
            </div>
          </form>
        </AuthGate>
      </div>
    </div>
  );
}
