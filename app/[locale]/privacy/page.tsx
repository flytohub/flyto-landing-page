import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Privacy policy',
    description:
      'How Flyto2 handles account, workflow, MCP, connected device, security, support, and billing data.',
    alternates: pageAlternates('privacy', locale),
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
        <h1 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">Flyto2 privacy policy.</h1>
      </header>

      <div className="prose-flyto space-y-6 text-[15px] leading-relaxed text-bone-200">
        <p>
          This policy explains how Flyto2 handles personal data when you use flyto2.com, Flyto2
          Cloud, the Flyto2 ChatGPT app and MCP gateway, connected runners, Warroom, support, or
          billing. Self-hosted and local execution can keep raw data in your environment, but
          connected services necessarily process the account, routing, execution, and security
          metadata described below.
        </p>

        <h2 className="font-display text-2xl font-semibold text-bone-100">Data we process</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <b>Account and authentication data.</b> Email address, display name, organization and
            workspace membership, authentication state, OAuth clients and grants, and security
            events.
          </li>
          <li>
            <b>Cloud and MCP data.</b> Workflow definitions and inputs you submit to Cloud,
            execution routes, connected device identifiers and status, run state, progress,
            evidence, Warroom decisions, and audit metadata. Device secrets and tokens are stored
            or transmitted only as needed to authenticate the service and are not intentionally
            exposed in product responses.
          </li>
          <li>
            <b>Support, billing, and public content.</b> Support correspondence and attachments,
            billing records handled with our payment providers, and content you intentionally
            publish in public community areas.
          </li>
          <li>
            <b>Website and operational data.</b> Basic page, device, network, error, abuse
            prevention, and service reliability events. We do not sell personal data or use it for
            cross-site advertising.
          </li>
        </ul>

        <h2 className="font-display text-2xl font-semibold text-bone-100">Purpose and control</h2>
        <p>
          We use this data to authenticate users, route and execute requested work, enforce tenant
          and device boundaries, perform Warroom security checks, provide evidence and support,
          prevent abuse, process billing, comply with law, and improve service reliability. A
          connected runner initiates outbound connections; its local credentials and raw
          environment data remain local unless a configured workflow or evidence policy sends
          them to Flyto2 Cloud or another destination.
        </p>

        <h2 className="font-display text-2xl font-semibold text-bone-100">Retention</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>OAuth authorization transactions and codes: up to 5 minutes.</li>
          <li>ChatGPT access tokens: up to 15 minutes; refresh tokens: up to 30 days.</li>
          <li>Dynamic OAuth client registrations: up to 365 days unless revoked earlier.</li>
          <li>MCP rate-limit counters: up to 60 seconds; idempotency records: up to 24 hours.</li>
          <li>
            Account, workflow, route, device, run, and evidence records: while the account is
            active, followed by a 30-day deletion safety period after an account deletion request.
          </li>
          <li>Security and audit logs: normally up to 12 months.</li>
          <li>Closed support cases: up to 24 months.</li>
          <li>
            Billing and tax records: up to 7 years where required by applicable law.
          </li>
        </ul>
        <p>
          Backups containing deleted data are overwritten within 90 days in the ordinary backup
          cycle. A legal hold, security investigation, enterprise contract, or legal requirement
          may require longer retention; when applicable, access remains restricted and deletion
          resumes when the obligation ends.
        </p>

        <h2 className="font-display text-2xl font-semibold text-bone-100">Service providers and transfers</h2>
        <p>
          We use service providers such as Google Cloud and Firebase for hosting and identity,
          Stripe for payment processing when applicable, and OpenAI when you connect the Flyto2
          ChatGPT app. We share only what is needed to deliver the requested service, protect the
          platform, or comply with law. Data may be processed in countries where these providers
          operate, subject to applicable contractual and legal safeguards.
        </p>

        <h2 className="font-display text-2xl font-semibold text-bone-100">Your choices and rights</h2>
        <p>
          Depending on your location, you may request access, correction, export, restriction,
          objection, or deletion. Use the deletion control in Flyto2 Cloud or email{' '}
          <a className="text-violet-300 hover:text-violet-200" href="mailto:privacy@flyto2.com">
            privacy@flyto2.com
          </a>
          . We verify requests and normally respond within 30 days. You may also revoke the ChatGPT
          connection, OAuth grant, or connected device from the relevant product controls.
        </p>

        <h2 className="font-display text-2xl font-semibold text-bone-100">Contact</h2>
        <p>
          Privacy questions: <a className="text-violet-300 hover:text-violet-200" href="mailto:privacy@flyto2.com">privacy@flyto2.com</a>.
          General support: <a className="text-violet-300 hover:text-violet-200" href="mailto:support@flyto2.com">support@flyto2.com</a>.
          Security reports: <a className="text-violet-300 hover:text-violet-200" href="mailto:security@flyto2.com">security@flyto2.com</a>.
        </p>

        <p className="text-bone-300/80">Last updated: 2026-07-28.</p>
      </div>
    </article>
  );
}
