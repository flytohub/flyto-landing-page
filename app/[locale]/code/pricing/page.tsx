import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Check, X, ArrowUpRight } from 'lucide-react';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Pricing — Warroom early access',
    description:
      'Beta pricing for Warroom: free for solo developers, early-access team plan, enterprise on request.',
    alternates: pageAlternates('code/pricing', locale),
  };
}

interface Plan {
  name: string;
  blurb: string;
  price: string;
  priceSub: string;
  accent: string;
  cta: { label: string; href: string };
  highlights: { label: string; included: boolean }[];
  footer?: string;
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    name: 'Solo (CLI)',
    blurb: 'The whole indexer + scanner suite, runs on your machine, no account required.',
    price: 'Free',
    priceSub: 'forever',
    accent: 'border-[var(--color-line-strong)]',
    cta: { label: 'pip install flyto-indexer', href: 'https://pypi.org/project/flyto-indexer/' },
    highlights: [
      { label: 'SCA + SAST + secrets + IaC scanning',     included: true },
      { label: 'Taint analysis, dead code, complexity',   included: true },
      { label: 'MCP server (Claude / Cursor / Windsurf)', included: true },
      { label: 'JSON / SARIF output',                     included: true },
      { label: '`.flyto-rules.yaml` custom rules',        included: true },
      { label: 'Multi-repo war room',                     included: false },
      { label: 'Closed-loop verification',                included: false },
      { label: 'Hosted PR check + audit log',             included: false },
    ],
    footer: 'Open source, MIT licence. Stays free.',
  },
  {
    name: 'Team (Beta)',
    blurb: 'The hosted war room with closed-loop verification, currently in private beta.',
    price: 'Early access',
    priceSub: 'request invite',
    accent: 'border-cyan-400/55 ring-1 ring-cyan-400/15',
    recommended: true,
    cta: { label: 'Open the beta →', href: 'https://warroom.flyto2.com/' },
    highlights: [
      { label: 'Everything in Solo',                       included: true },
      { label: 'Multi-repo war-room console',              included: true },
      { label: 'Closed-loop verify (pentest workflow)',    included: true },
      { label: 'PR-check + status checks (GH / GL / BB)',  included: true },
      { label: 'Cross-repo correlation + Pulse view',      included: true },
      { label: 'AutoFix Tier 1 + Tier 2 (AI patches)',     included: true },
      { label: 'Slack / Email / Webhook alerts',           included: true },
      { label: 'Team seats, RBAC, audit log',              included: true },
    ],
    footer: 'Beta users get grandfathered on pricing when the plan goes GA.',
  },
  {
    name: 'Enterprise',
    blurb: 'Air-gapped self-hosted, SSO, custom integrations, dedicated runtime resources.',
    price: 'Contact us',
    priceSub: 'tailored to scale',
    accent: 'border-[var(--color-line-strong)]',
    cta: { label: 'Email security@flyto2.com', href: 'mailto:security@flyto2.com' },
    highlights: [
      { label: 'Everything in Team',                          included: true },
      { label: 'Self-hosted on-prem or air-gapped',           included: true },
      { label: 'SSO (Okta / Azure AD / SAML)',                included: true },
      { label: 'Custom scanning policy + rule packs',         included: true },
      { label: 'Dedicated runtime cluster',                   included: true },
      { label: 'Designated engineering contact + SLA',        included: true },
      { label: 'Custom MCP / API surface for internal tools', included: true },
      { label: 'Volume / multi-year discounts',               included: true },
    ],
    footer: 'For regulated industries that can\'t run code through SaaS.',
  },
];

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Why no public price for Team yet?',
    a: 'Because Warroom is in beta and we want to ship value before we put a fixed number on it. Early-access teams get a grandfathered price when we open GA.',
  },
  {
    q: 'Do you run code on your servers?',
    a: 'The indexer scans your code locally and uploads structured analysis — function names, dependency graphs, finding metadata. Source code never leaves your machine unless you explicitly upload it for a specific feature. Air-gapped mode (Enterprise) bypasses uploads entirely.',
  },
  {
    q: 'How is this different from Flyto2 Cloud?',
    a: 'Cloud is browser automation — record and replay workflows. Warroom is application security — scan, audit, verify. They share design tokens and infrastructure but solve different problems for different teams.',
  },
  {
    q: 'Can I use the CLI without the war room?',
    a: 'Yes. The CLI is the foundation; the war room is what you get when you upload findings to a shared console. Many teams stay on the CLI long-term and integrate via SARIF.',
  },
  {
    q: 'What happens to my data if I stop using it?',
    a: 'Solo: nothing ever left your machine. Team: 30-day soft-delete with a single API call to wipe immediately. Enterprise: contractually whatever your data-residency policy says.',
  },
];

export default async function CodePricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="mx-auto mb-16 max-w-3xl text-center">
        <span className="label-mono">PRICING — BETA</span>
        <h1 className="h-display mt-4 text-[clamp(40px,7vw,80px)]">
          Free to start. <span className="text-cyan-300">Beta to scale.</span>
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-bone-200 sm:text-[17px]">
          The solo CLI is free and open source, forever. The hosted war room is in private beta —
          early teams get grandfathered pricing when we open it. Enterprise is one email away.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((p) => (
          <section
            key={p.name}
            className={`relative flex flex-col rounded-3xl border bg-ink-800/40 p-7 sm:p-9 ${p.accent}`}
          >
            {p.recommended && (
              <span className="absolute -top-3 left-7 rounded-full border border-cyan-400/50 bg-ink-900 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.18em] text-cyan-200 uppercase">
                Recommended
              </span>
            )}

            <header>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-bone-100">{p.name}</h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-bone-200">{p.blurb}</p>
            </header>

            <div className="mt-7">
              <div className="font-display text-[36px] font-semibold tracking-tight text-bone-100">
                {p.price}
              </div>
              <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-bone-300">
                {p.priceSub}
              </div>
            </div>

            <Link
              href={p.cta.href}
              target={p.cta.href.startsWith('http') ? '_blank' : undefined}
              rel={p.cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`mt-6 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-medium tracking-wide transition-all ${
                p.recommended
                  ? 'bg-bone-100 text-ink-900 hover:-translate-y-px hover:bg-white'
                  : 'border border-[var(--color-line-strong)] text-bone-100 hover:-translate-y-px hover:border-bone-100/80'
              }`}
            >
              {p.cta.label}
              {p.cta.href.startsWith('http') && (
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
              )}
            </Link>

            <ul className="mt-8 space-y-2.5 border-t border-[var(--color-line)] pt-7">
              {p.highlights.map((h) => (
                <li
                  key={h.label}
                  className={`flex items-start gap-2 text-[13.5px] ${
                    h.included ? 'text-bone-200' : 'text-bone-300/50 line-through'
                  }`}
                >
                  {h.included ? (
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-cyan-300" strokeWidth={2} />
                  ) : (
                    <X className="mt-0.5 h-3.5 w-3.5 flex-none text-bone-300/40" strokeWidth={1.5} />
                  )}
                  <span>{h.label}</span>
                </li>
              ))}
            </ul>

            {p.footer && (
              <p className="mt-7 border-t border-[var(--color-line)] pt-5 text-[12.5px] leading-relaxed text-bone-300/90">
                {p.footer}
              </p>
            )}
          </section>
        ))}
      </div>

      <section className="mt-20 max-w-3xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Pricing FAQ</h2>
        <dl className="mt-8 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
          {FAQ_ITEMS.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-display text-[16px] font-semibold tracking-tight text-bone-100">
                {f.q}
              </dt>
              <dd className="mt-2 text-[14px] leading-relaxed text-bone-200">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
