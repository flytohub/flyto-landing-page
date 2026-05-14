import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await params;
  return {
    title: 'Terms',
    description: 'The terms that govern your use of Flyto2.',
    alternates: pageAlternates('terms'),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <article className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="mb-12">
        <span className="label-mono">TERMS</span>
        <h1 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">Terms of service.</h1>
      </header>

      <div className="prose-flyto space-y-6 text-[15px] leading-relaxed text-bone-200">
        <p>
          By using Flyto2 — the desktop runner, the hosted services or this website — you agree
          to the terms below. Plain English, no legalese theatre.
        </p>

        <h2 className="font-display text-2xl font-semibold text-bone-100">1. The runtime is MIT</h2>
        <p>
          The Flyto2 desktop runner is open source under the MIT licence. Use, modify, fork,
          ship — see the licence text on{' '}
          <a className="text-violet-300 hover:text-violet-200" href="https://github.com/flytohub/flyto-core/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>

        <h2 className="font-display text-2xl font-semibold text-bone-100">2. Acceptable use</h2>
        <p>
          You agree not to use Flyto2 to: violate the terms of services you automate against, send
          unsolicited communications at scale, infringe intellectual property, harm individuals or
          circumvent authentication you have no right to.
        </p>
        <p>
          Flyto2 is a tool. What you do with it is your call. We do not police your workflows,
          but we will cooperate with lawful requests from authorities.
        </p>

        <h2 className="font-display text-2xl font-semibold text-bone-100">3. No warranty</h2>
        <p>
          The software is provided &quot;as is&quot;. The authors are not liable for indirect or
          consequential damages — like lost revenue from a workflow that fired the wrong button on
          a third-party site. Test before you trust.
        </p>

        <h2 className="font-display text-2xl font-semibold text-bone-100">4. Paid features and refunds</h2>
        <p>
          If a paid feature breaks materially within 14 days of purchase, email{' '}
          <a className="text-violet-300 hover:text-violet-200" href="mailto:support@flyto2.com">support@flyto2.com</a> for
          a refund. Beyond that, prorated credit at our discretion.
        </p>

        <h2 className="font-display text-2xl font-semibold text-bone-100">5. Changes</h2>
        <p>
          We can update these terms. Material changes are announced in the changelog and the
          version field below.
        </p>

        <p className="text-bone-300/80">Last updated: 2026-05-15.</p>
      </div>
    </article>
  );
}
