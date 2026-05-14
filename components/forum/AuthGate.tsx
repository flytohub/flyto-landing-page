'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import {
  useAuth,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
} from '@/lib/auth';

interface AuthGateProps {
  /** When true, renders children regardless of auth (useful for read-only sections) */
  passive?: boolean;
  children?: ReactNode;
  /** What the gate is protecting — used in the "sign in to post" copy */
  intent?: 'post' | 'comment' | 'react';
}

/**
 * Conditionally requires Firebase Auth before rendering its children. In
 * passive mode it always renders but still exposes the user's status to
 * children via context-free hooks (children call `useAuth` themselves).
 */
export function AuthGate({ passive = false, children, intent = 'post' }: AuthGateProps) {
  const { user, loading } = useAuth();
  const t = useTranslations('forum.auth');

  if (passive) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] bg-ink-800 px-5 py-6 text-[13px] text-bone-200">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>{t('loading')}</span>
      </div>
    );
  }

  if (!user) {
    return <SignInPanel intent={intent} />;
  }

  return <>{children}</>;
}

function SignInPanel({ intent }: { intent: AuthGateProps['intent'] }) {
  const t = useTranslations('forum.auth');
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      if (mode === 'sign-up') await signUpWithEmail(email, password);
      else                    await signInWithEmail(email, password);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('error');
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true); setErr(null);
    try { await signInWithGoogle(); }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('error');
      setErr(msg);
    } finally { setBusy(false); }
  }

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-ink-800 p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-2">
        <LogIn className="h-4 w-4 text-violet-300" strokeWidth={1.75} />
        <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-bone-300">
          {t(`reason.${intent}`)}
        </span>
      </div>

      <h3 className="font-display text-2xl font-semibold tracking-tight">{t('title')}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-bone-200">{t('subtitle')}</p>

      <button
        onClick={handleGoogle}
        disabled={busy}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-bone-100 px-5 py-3 text-[13.5px] font-medium text-ink-900 transition-all hover:-translate-y-px hover:bg-white disabled:opacity-50"
      >
        <GoogleMark className="h-4 w-4" />
        <span>{t('continueGoogle')}</span>
      </button>

      <div className="my-6 flex items-center gap-3 text-[11px] text-bone-300">
        <span className="h-px flex-1 bg-[var(--color-line)]" />
        <span className="font-mono uppercase tracking-[0.16em]">{t('or')}</span>
        <span className="h-px flex-1 bg-[var(--color-line)]" />
      </div>

      <form onSubmit={handleEmail} className="space-y-2.5">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email')}
          className="w-full rounded-md border border-[var(--color-line)] bg-ink-900/60 px-3.5 py-2.5 text-[13.5px] text-bone-100 outline-none transition-colors placeholder:text-bone-300/60 focus:border-violet-400"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('password')}
          className="w-full rounded-md border border-[var(--color-line)] bg-ink-900/60 px-3.5 py-2.5 text-[13.5px] text-bone-100 outline-none transition-colors placeholder:text-bone-300/60 focus:border-violet-400"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-violet-500/15 px-5 py-3 text-[13.5px] font-medium tracking-wide text-bone-100 transition-all hover:-translate-y-px hover:bg-violet-500/25 disabled:opacity-50"
        >
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          <span>{mode === 'sign-up' ? t('signUp') : t('signIn')}</span>
        </button>
      </form>

      {err && <p className="mt-3 text-[12px] text-red-400">{err}</p>}

      <button
        type="button"
        onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
        className="mt-4 w-full text-center text-[12px] text-bone-300 hover:text-bone-100"
      >
        {mode === 'sign-in' ? t('switchToSignUp') : t('switchToSignIn')}
      </button>
    </div>
  );
}

/** Sign-out button for a logged-in chrome corner. */
export function SignOutButton() {
  const { user } = useAuth();
  const t = useTranslations('forum.auth');
  if (!user) return null;
  return (
    <button
      onClick={() => signOut()}
      className="inline-flex items-center gap-1.5 text-[12px] text-bone-300 transition-colors hover:text-bone-100"
    >
      <LogOut className="h-3 w-3" strokeWidth={1.75} />
      <span>{t('signOut')}</span>
    </button>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#EA4335" d="M12 5c1.6 0 3 .55 4.13 1.62L19.4 3.36C17.43 1.55 14.9.5 12 .5 7.4.5 3.4 3.13 1.4 7l3.86 3C6.2 7.18 8.85 5 12 5z" />
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45c-.28 1.5-1.13 2.77-2.4 3.62l3.7 2.87c2.16-1.99 3.4-4.92 3.4-8.68z" />
      <path fill="#FBBC05" d="M5.27 14c-.23-.7-.37-1.46-.37-2.24s.13-1.55.37-2.25l-3.86-3C.5 8.36 0 10.13 0 12s.5 3.64 1.4 5.49l3.87-3z" />
      <path fill="#34A853" d="M12 23.5c3 0 5.55-1 7.4-2.7l-3.7-2.87c-1.03.7-2.36 1.1-3.7 1.1-3.15 0-5.83-2.18-6.78-5l-3.86 3C3.4 20.87 7.4 23.5 12 23.5z" />
    </svg>
  );
}
