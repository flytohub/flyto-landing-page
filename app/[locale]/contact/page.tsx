import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { pageAlternates } from '@/lib/seo';
import { Mail, MessageSquare, Github, BookOpen, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Contact Flyto2',
    description:
      'Get in touch with the Flyto2 team. Email support, public discussions, security disclosures, and partnership inquiries.',
    alternates: pageAlternates('contact', locale),
  };
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Flyto2',
  url: 'https://flyto2.com',
  logo: 'https://flyto2.com/assets/img/white-logo.png',
  sameAs: [
    'https://github.com/flytohub',
    'https://www.youtube.com/@Flyto2',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'info@flyto2.com',
      availableLanguage: ['English'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'security',
      email: 'security@flyto2.com',
      availableLanguage: ['English'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'privacy',
      email: 'privacy@flyto2.com',
      availableLanguage: ['English'],
    },
  ],
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <header className="mb-12">
        <span className="label-mono">CONTACT</span>
        <h1 className="h-display mt-4 text-[clamp(36px,6vw,64px)]">Talk to the team.</h1>
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-bone-200">
          We answer email within one business day. For anything that can be public — product
          questions, bug reports, feature ideas — the discussions board is usually faster.
        </p>
      </header>

      <div className="space-y-12">
        <section>
          <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-bone-300">
            Direct email
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ContactCard
              icon={Mail}
              label="General"
              email="info@flyto2.com"
              hint="Sales, partnerships, press"
            />
            <ContactCard
              icon={Mail}
              label="Support"
              email="support@flyto2.com"
              hint="Account, billing, technical"
            />
            <ContactCard
              icon={Mail}
              label="Security"
              email="security@flyto2.com"
              hint="Responsible disclosure"
            />
          </div>
        </section>

        <section>
          <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-bone-300">
            Public channels
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <LinkCard
              icon={MessageSquare}
              label="Discussions"
              href={locale === 'en' ? '/cloud/discussions' : `/${locale}/cloud/discussions`}
              hint="Community Q&A and announcements"
            />
            <LinkCard
              icon={Github}
              label="GitHub"
              href="https://github.com/flytohub"
              external
              hint="Source, issues, releases"
            />
            <LinkCard
              icon={BookOpen}
              label="Documentation"
              href="https://docs.flyto2.com"
              external
              hint="Guides and API reference"
            />
          </div>
        </section>

        <section className="prose-flyto space-y-4 text-[15px] leading-relaxed text-bone-200">
          <h2 className="font-display text-2xl font-semibold text-bone-100">Response time</h2>
          <p>
            We aim to reply to direct email within one business day (US Pacific). Security
            disclosures sent to <code>security@flyto2.com</code> are triaged first and acknowledged
            within 24 hours, with a remediation plan within five business days for valid reports.
          </p>
          <h2 className="font-display text-2xl font-semibold text-bone-100">Press &amp; partnerships</h2>
          <p>
            For media inquiries, interview requests, or partnership discussions, write to{' '}
            <a className="text-violet-300 hover:text-violet-200" href="mailto:info@flyto2.com">
              info@flyto2.com
            </a>{' '}
            with &ldquo;Press&rdquo; or &ldquo;Partnership&rdquo; in the subject line. We respond
            within two business days.
          </p>
        </section>
      </div>
    </article>
  );
}

function ContactCard({
  icon: Icon,
  label,
  email,
  hint,
}: {
  icon: typeof Mail;
  label: string;
  email: string;
  hint: string;
}) {
  return (
    <a
      href={`mailto:${email}`}
      className="lift group block rounded-2xl border border-[var(--color-line)] bg-ink-700/30 p-5 transition-colors hover:border-violet-400/60"
    >
      <span className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-line-strong)] bg-ink-900 text-violet-300 transition-colors group-hover:text-violet-200">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <h3 className="mt-4 font-display text-[15px] font-semibold tracking-tight text-bone-100">
        {label}
      </h3>
      <p className="mt-1 text-[12.5px] text-bone-300">{hint}</p>
      <p className="mt-3 break-all font-mono text-[12px] text-bone-200 group-hover:text-bone-100">
        {email}
      </p>
    </a>
  );
}

function LinkCard({
  icon: Icon,
  label,
  href,
  hint,
  external = false,
}: {
  icon: typeof Mail;
  label: string;
  href: string;
  hint: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-line-strong)] bg-ink-900 text-violet-300 transition-colors group-hover:text-violet-200">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <div className="mt-4 flex items-center justify-between">
        <h3 className="font-display text-[15px] font-semibold tracking-tight text-bone-100">
          {label}
        </h3>
        <ArrowUpRight
          className="h-4 w-4 text-bone-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone-100"
          strokeWidth={1.5}
        />
      </div>
      <p className="mt-1 text-[12.5px] text-bone-300">{hint}</p>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="lift group block rounded-2xl border border-[var(--color-line)] bg-ink-700/30 p-5 transition-colors hover:border-violet-400/60"
      >
        {content}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="lift group block rounded-2xl border border-[var(--color-line)] bg-ink-700/30 p-5 transition-colors hover:border-violet-400/60"
    >
      {content}
    </Link>
  );
}
