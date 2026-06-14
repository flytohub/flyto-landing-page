import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { SecurityPage } from '@/lib/security-pages';

export function SecurityProductPage({ page }: { page: SecurityPage }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Flyto2 ${page.eyebrow}`,
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    url: `https://flyto2.com/${page.slug}/`,
    description: page.metaDescription,
    publisher: {
      '@type': 'Organization',
      name: 'Flyto2',
      url: 'https://flyto2.com',
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative isolate overflow-hidden">
        <div className="glow-radial" aria-hidden />
        <div className="grid-faint" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/[0.05] px-3 py-1 text-[12px] tracking-wide text-cyan-100">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>{page.eyebrow}</span>
            </div>
            <h1 className="h-display mt-8 max-w-4xl text-[clamp(42px,7.4vw,86px)] leading-[0.98]">
              {page.title}
            </h1>
            <p className="mt-7 max-w-2xl text-[16px] leading-relaxed text-bone-200 sm:text-[18px]">
              {page.lede}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={page.primaryCta.href}>{page.primaryCta.label}</Button>
              <Button href={page.secondaryCta.href} variant="secondary">
                {page.secondaryCta.label}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-x-6 -top-8 -bottom-8 -z-10 rounded-[36px] bg-cyan-400/10 blur-3xl"
            />
            <div className="overflow-hidden rounded-2xl border border-[var(--color-line-strong)] bg-ink-900/85 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.72)]">
              <div className="flex items-center gap-2 border-b border-[var(--color-line)] bg-ink-800/80 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-auto font-mono text-[10px] tracking-[0.16em] text-bone-300 uppercase">
                  warroom
                </span>
              </div>
              <div className="relative aspect-[16/10] bg-ink-900">
                <Image
                  src={page.image}
                  alt={page.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--color-line)] bg-ink-800/30">
        <div className="mx-auto grid max-w-6xl gap-px px-5 py-12 sm:px-8 md:grid-cols-3">
          {page.proofPoints.map((point) => (
            <div key={point} className="flex items-start gap-3 bg-ink-800/60 p-5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-cyan-300" strokeWidth={1.75} />
              <span className="text-[14px] leading-relaxed text-bone-100/90">{point}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] lg:grid-cols-3">
          {page.sections.map((section) => (
            <section key={section.title} className="bg-ink-800 p-7 sm:p-9">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-bone-100">
                {section.title}
              </h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-bone-200">{section.body}</p>
              <ul className="mt-6 space-y-2.5">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-bone-200">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-cyan-300/70" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-[var(--color-line)] px-5 py-16 sm:px-8 sm:py-20">
        <span className="label-mono">RELATED</span>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {page.related.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--color-line)] bg-ink-800/55 px-5 py-4 text-[14px] text-bone-100 transition-colors hover:border-cyan-300/50 hover:bg-cyan-400/[0.05]"
            >
              <span>{link.label}</span>
              <ArrowRight className="h-4 w-4 text-cyan-300 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}
