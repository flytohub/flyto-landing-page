'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import {
  FileSpreadsheet,
  FileText,
  Database,
  Mail,
  MessageSquare,
  Cloud as CloudIcon,
  GitFork,
  Globe,
  Bot,
  Webhook,
  Code2,
  Folder,
  ShoppingBag,
  Send,
  type LucideIcon,
} from 'lucide-react';

interface Integration {
  iconName: keyof typeof ICONS;
  name: string;
}

const ICONS: Record<string, LucideIcon> = {
  FileSpreadsheet, FileText, Database, Mail, MessageSquare,
  CloudIcon, GitFork, Globe, Bot, Webhook, Code2, Folder,
  ShoppingBag, Send,
};

const INTEGRATIONS: Integration[] = [
  { iconName: 'GitFork',         name: 'GitHub' },
  { iconName: 'GitFork',         name: 'GitLab' },
  { iconName: 'Code2',           name: 'SARIF' },
  { iconName: 'Code2',           name: 'SCA/SAST' },
  { iconName: 'Globe',           name: 'ASM' },
  { iconName: 'Globe',           name: 'EASM' },
  { iconName: 'Webhook',         name: 'Ratings' },
  { iconName: 'Database',        name: 'CMDB' },
  { iconName: 'CloudIcon',       name: 'AWS' },
  { iconName: 'CloudIcon',       name: 'GCP' },
  { iconName: 'CloudIcon',       name: 'Azure' },
  { iconName: 'FileText',        name: 'SBOM' },
  { iconName: 'Database',        name: 'CSPM' },
  { iconName: 'Bot',             name: 'MCP' },
  { iconName: 'Folder',          name: 'Repos' },
  { iconName: 'FileSpreadsheet', name: 'CSV' },
  { iconName: 'Webhook',         name: 'API ingest' },
  { iconName: 'MessageSquare',   name: 'Slack' },
  { iconName: 'Mail',            name: 'Email' },
  { iconName: 'Send',            name: 'Webhooks' },
  { iconName: 'Database',        name: 'Threat feeds' },
  { iconName: 'Globe',           name: 'IOCs' },
  { iconName: 'FileText',        name: 'Reports' },
  { iconName: 'ShoppingBag',     name: 'Vendors' },
];

export function Integrations() {
  const t = useTranslations('home.integrations');

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="max-w-2xl">
        <span className="label-mono">{t('label')}</span>
        <h2 className="h-display mt-4 text-[clamp(32px,5vw,56px)]">{t('title')}</h2>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-bone-200">{t('subtitle')}</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
      >
        {INTEGRATIONS.map((it) => {
          const Icon = ICONS[it.iconName];
          return (
            <div
              key={it.name}
              className="flex aspect-square flex-col items-center justify-center gap-2 bg-ink-800 transition-colors hover:bg-ink-700"
            >
              <Icon className="h-5 w-5 text-bone-200" strokeWidth={1.25} />
              <span className="font-mono text-[10.5px] tracking-wide text-bone-300">{it.name}</span>
            </div>
          );
        })}
      </motion.div>

      <p className="mt-6 font-mono text-[11px] tracking-[0.16em] uppercase text-bone-200">
        {t('andMore')}
      </p>
    </section>
  );
}
