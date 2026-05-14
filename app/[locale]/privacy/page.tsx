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
    title: 'Privacy',
    description: 'How Flyto2 handles your data.',
    alternates: pageAlternates('privacy'),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <article className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="mb-12">
        <span className="label-mono">PRIVACY</span>
        <h1 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">How we treat your data.</h1>
      </header>

      <div className="prose-flyto space-y-6 text-[15px] leading-relaxed text-bone-200">
        <p>
          Flyto2 is offline-first. Recordings, credentials, scraped data and run history live on
          your machine. We do not collect telemetry from the desktop runner. The runtime makes no
          outbound calls except the ones your workflow explicitly performs.
        </p>

        <h2 className="font-display text-2xl font-semibold text-bone-100">What we do collect</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <b>Account information.</b> If you create a Flyto2 account, we keep your email
            address and authentication state. Account auth is via Firebase Authentication.
          </li>
          <li>
            <b>Forum posts.</b> Anything you publish in the public Q&amp;A forum is, by design,
            public and indexed by search engines.
          </li>
          <li>
            <b>Anonymous web analytics.</b> This website (<code>flyto2.com</code>) uses
            privacy-respecting page-load metrics. No personal identifiers, no cross-site tracking.
          </li>
        </ul>

        <h2 className="font-display text-2xl font-semibold text-bone-100">What we never collect</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Your workflow recordings, run history, or any data your workflows touch.</li>
          <li>Credentials, cookies, tokens or session state from the sites you automate.</li>
          <li>The contents of files your workflows read or write.</li>
        </ul>

        <h2 className="font-display text-2xl font-semibold text-bone-100">Third parties</h2>
        <p>
          The hosted forum runs on Firebase (Google Cloud). Payment processing, when applicable,
          runs on Stripe. We do not sell or share data with advertisers or data brokers.
        </p>

        <h2 className="font-display text-2xl font-semibold text-bone-100">Your rights</h2>
        <p>
          Email <a className="text-violet-300 hover:text-violet-200" href="mailto:privacy@flyto2.com">privacy@flyto2.com</a> for
          data export, correction or deletion. We respond within 30 days.
        </p>

        <p className="text-bone-300/80">Last updated: 2026-05-15.</p>
      </div>
    </article>
  );
}
