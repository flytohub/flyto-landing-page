import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import {
  Apple,
  Monitor,
  Laptop,
  Container,
  Terminal,
  GitFork,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { CTASection } from '@/components/sections/CTASection';
import { pageAlternates } from '@/lib/seo';

interface Platform {
  iconName: 'Apple' | 'Monitor' | 'Laptop';
  os: string;
  filename: string;
  href: string;
  note: string;
}

const ICONS: Record<Platform['iconName'], LucideIcon> = {
  Apple,
  Monitor,
  Laptop,
};

const RELEASES = 'https://github.com/flytohub/flyto2/releases/latest';

const PLATFORMS: Platform[] = [
  { iconName: 'Apple',   os: 'macOS',   filename: 'Flyto2.dmg',         href: RELEASES, note: 'Apple Silicon · Intel · macOS 12+' },
  { iconName: 'Monitor', os: 'Windows', filename: 'Flyto2-Setup.exe',   href: RELEASES, note: 'Windows 10 · 11 · x64' },
  { iconName: 'Laptop',  os: 'Linux',   filename: 'Flyto2.AppImage',    href: RELEASES, note: 'AppImage · deb · Ubuntu 20.04+' },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'download' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: pageAlternates('cloud/download', locale),
  };
}

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <DownloadHero />
      <PlatformGrid />
      <SelfHostStrip />
      <CTASection
        namespace="download.cta"
        primaryHref={RELEASES}
        secondaryHref="https://pypi.org/project/flyto-core/"
        primaryIcon="Download"
        secondaryIcon="CodeIcon"
      />
    </>
  );
}

function DownloadHero() {
  const t = useTranslations('download.hero');
  return (
    <section className="relative isolate overflow-hidden">
      <div className="glow-radial" aria-hidden />
      <div className="grid-faint" aria-hidden />
      <div className="halo" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-12 text-center sm:px-8 sm:pb-20 sm:pt-16">
        <Tag variant="live">{t('eyebrow')}</Tag>
        <h1 className="h-display mx-auto mt-7 max-w-4xl text-[clamp(44px,8vw,108px)]">
          {t('title')}{' '}
          <span className="aurora-text">{t('titleAccent')}</span>
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-[16px] leading-relaxed text-bone-200">
          {t('lede')}
        </p>
      </div>
    </section>
  );
}

function PlatformGrid() {
  const t = useTranslations('download');
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
      <div className="grid gap-5 sm:grid-cols-3">
        {PLATFORMS.map((p) => {
          const Icon = ICONS[p.iconName];
          return (
            <a
              key={p.os}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="lift group relative flex flex-col gap-5 rounded-3xl border border-[var(--color-line)] bg-gradient-to-b from-ink-700/40 to-ink-800/20 p-7"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-900 text-violet-300 transition-colors group-hover:border-violet-400 group-hover:text-violet-200">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">{p.os}</h3>
                <p className="mt-1 font-mono text-[11.5px] tracking-wide text-bone-300">
                  {p.filename}
                </p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-bone-200">{p.note}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] tracking-wide text-bone-100 transition-all group-hover:gap-2.5">
                <span>{t('downloadFor', { os: p.os })}</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                />
              </span>
            </a>
          );
        })}
      </div>

      <p className="mt-6 text-center font-mono text-[11px] tracking-[0.16em] uppercase text-bone-300">
        <a
          href={RELEASES}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-bone-100"
        >
          {t('allReleases')} ↗
        </a>
      </p>
    </section>
  );
}

function SelfHostStrip() {
  const t = useTranslations('download');
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Docker self-host */}
        <div className="lift relative flex flex-col gap-5 rounded-3xl border border-[var(--color-line)] bg-gradient-to-br from-ink-700/40 to-ink-800/20 p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-line-strong)] bg-ink-900 text-cyan-400">
              <Container className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <Tag>SELF-HOST</Tag>
          </div>
          <h3 className="font-display text-2xl font-semibold tracking-tight">
            {t('docker.title')}
          </h3>
          <p className="text-[14px] leading-relaxed text-bone-200">{t('docker.body')}</p>
          <pre className="overflow-x-auto rounded-lg border border-[var(--color-line)] bg-ink-900/60 px-4 py-3 font-mono text-[12.5px] text-bone-100">
            <code>docker run -p 9090:9090 flytohub/flyto2:latest</code>
          </pre>
          <Button href="https://hub.docker.com/r/flytohub/flyto2" variant="secondary">
            <span>{t('docker.cta')}</span>
          </Button>
        </div>

        {/* OSS engine */}
        <div className="lift relative flex flex-col gap-5 rounded-3xl border border-[var(--color-line)] bg-gradient-to-br from-ink-700/40 to-ink-800/20 p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-line-strong)] bg-ink-900 text-violet-300">
              <Terminal className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <Tag>OPEN SOURCE</Tag>
          </div>
          <h3 className="font-display text-2xl font-semibold tracking-tight">
            {t('oss.title')}
          </h3>
          <p className="text-[14px] leading-relaxed text-bone-200">{t('oss.body')}</p>
          <pre className="overflow-x-auto rounded-lg border border-[var(--color-line)] bg-ink-900/60 px-4 py-3 font-mono text-[12.5px] text-bone-100">
            <code>pip install flyto-core</code>
          </pre>
          <Button href="https://github.com/flytohub" variant="secondary">
            <GitFork className="h-4 w-4" strokeWidth={1.75} />
            <span>{t('oss.cta')}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
