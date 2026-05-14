'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { PostList } from './PostList';
import { PostDetail } from './PostDetail';
import { PostComposer } from './PostComposer';
import { SignOutButton } from './AuthGate';
import type { Product } from '@/lib/forum';
import { useAuth } from '@/lib/auth';
import { Avatar } from './PostCard';

/**
 * Discussions = list + detail in one route, switched by `?post=ID` in the URL.
 * Static export friendly: no dynamic [id] segment, all client-side routing.
 */
export function DiscussionsView({ product }: { product: Product }) {
  const t = useTranslations('forum');
  const locale = useLocale();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user, configured } = useAuth();

  const postId = params.get('post');
  const [composerOpen, setComposerOpen] = useState(false);

  const setPost = useCallback((id: string | null) => {
    const next = new URLSearchParams(Array.from(params.entries()));
    if (id) next.set('post', id);
    else next.delete('post');
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, router, pathname]);

  // Reset to list when product changes
  const productLocalized = `/${product === 'cloud' ? 'cloud' : 'code'}/discussions`;
  const backHref = locale === 'en' ? productLocalized : `/${locale}${productLocalized}`;

  useEffect(() => {
    if (postId) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [postId]);

  // Firebase env vars unset → render a helpful setup notice rather than
  // blowing up with `auth/invalid-api-key` from deep in the SDK.
  if (!configured) {
    return <FirebaseSetupNotice product={product} />;
  }

  return (
    <>
      <div className="mx-auto max-w-5xl px-5 pt-12 sm:px-8 sm:pt-16">
        {!postId && (
          <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-bone-300">
                <MessageSquare className="-mt-px mr-1 inline h-3 w-3" strokeWidth={1.75} />
                {product === 'cloud' ? 'CLOUD · COMMUNITY' : 'WARROOM · COMMUNITY'}
              </span>
              <h1 className="h-display mt-3 text-[clamp(36px,5vw,56px)]">
                {t(product === 'cloud' ? 'titleCloud' : 'titleCode')}
              </h1>
              <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-bone-200">
                {t(product === 'cloud' ? 'subtitleCloud' : 'subtitleCode')}
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-ink-800 px-3 py-1.5 text-[12px]">
                <Avatar
                  name={user.displayName ?? user.email?.split('@')[0] ?? 'User'}
                  avatar={user.photoURL ?? undefined}
                  isOfficial={user.email === 'admin@flyto2.com'}
                />
                <SignOutButton />
              </div>
            )}
          </header>
        )}

        {postId ? (
          <PostDetail postId={postId} backHref={backHref} />
        ) : (
          <div className="pb-24">
            <PostList product={product} onComposeClick={() => setComposerOpen(true)} />
          </div>
        )}
      </div>

      <PostComposer
        product={product}
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onCreated={(id) => {
          setComposerOpen(false);
          setPost(id);
        }}
      />
    </>
  );
}

function FirebaseSetupNotice({ product }: { product: Product }) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
      <div className="rounded-2xl border border-amber-400/30 bg-amber-500/[0.04] p-7 sm:p-8">
        <div className="flex items-center gap-2 text-amber-300">
          <AlertTriangle className="h-4 w-4" strokeWidth={1.75} />
          <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase">SETUP REQUIRED</span>
        </div>
        <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight">
          Firebase isn&apos;t configured yet
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-bone-200">
          The {product === 'cloud' ? 'Cloud' : 'Warroom'} discussion forum needs Firebase
          credentials before it can show posts. The rest of the site works fine — only
          this page is gated.
        </p>

        <ol className="mt-6 space-y-3 text-[13px] text-bone-200">
          <li className="flex gap-3">
            <span className="num-mono font-display flex h-6 w-6 flex-none items-center justify-center rounded-md border border-[var(--color-line-strong)] text-[12px] text-bone-100">1</span>
            <span>
              Copy <code className="rounded bg-ink-900/60 px-1 py-0.5 font-mono text-[12px]">.env.local.example</code>
              {' '}to <code className="rounded bg-ink-900/60 px-1 py-0.5 font-mono text-[12px]">.env.local</code>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="num-mono font-display flex h-6 w-6 flex-none items-center justify-center rounded-md border border-[var(--color-line-strong)] text-[12px] text-bone-100">2</span>
            <span>
              Open{' '}
              <a
                href="https://console.firebase.google.com/project/ticket-helper-dbc0e/settings/general"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-300 underline-offset-4 hover:underline"
              >
                Firebase Console → Project Settings → General
              </a>
              {' '}→ scroll to <span className="font-medium">Your apps</span> → Web app → copy the Config
              values into the matching <code className="font-mono text-[12px]">NEXT_PUBLIC_FIREBASE_*</code> env vars.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="num-mono font-display flex h-6 w-6 flex-none items-center justify-center rounded-md border border-[var(--color-line-strong)] text-[12px] text-bone-100">3</span>
            <span>
              Restart <code className="rounded bg-ink-900/60 px-1 py-0.5 font-mono text-[12px]">npm run dev</code> — env
              vars are baked at build time, so HMR alone won&apos;t pick them up.
            </span>
          </li>
        </ol>

        <p className="mt-6 border-t border-amber-400/20 pt-5 text-[12px] leading-relaxed text-bone-300">
          To populate the forum with the seed data (4,000 Cloud + 1,600 Warroom posts), follow the same
          steps and additionally drop a service-account JSON at{' '}
          <code className="font-mono text-[11.5px]">./.firebase-sa.json</code>, then run{' '}
          <code className="font-mono text-[11.5px]">node scripts/seed-forum.mjs --apply</code>.
        </p>
      </div>
    </div>
  );
}
