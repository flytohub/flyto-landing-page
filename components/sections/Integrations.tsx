'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import {
  FileSpreadsheet,
  FileText,
  Database,
  CreditCard,
  Mail,
  MessageSquare,
  Calendar,
  Cloud as CloudIcon,
  Github,
  Globe,
  Bot,
  Webhook,
  Sheet,
  Code2,
  Folder,
  Receipt,
  ShoppingBag,
  Send,
  type LucideIcon,
} from 'lucide-react';

interface Integration {
  iconName: keyof typeof ICONS;
  name: string;
}

const ICONS: Record<string, LucideIcon> = {
  FileSpreadsheet, FileText, Database, CreditCard, Mail, MessageSquare,
  Calendar, CloudIcon, Github, Globe, Bot, Webhook, Sheet, Code2, Folder,
  Receipt, ShoppingBag, Send,
};

const INTEGRATIONS: Integration[] = [
  { iconName: 'FileSpreadsheet', name: 'CSV' },
  { iconName: 'Sheet',           name: 'Excel' },
  { iconName: 'Sheet',           name: 'Google Sheets' },
  { iconName: 'Database',        name: 'PostgreSQL' },
  { iconName: 'Database',        name: 'MySQL' },
  { iconName: 'CreditCard',      name: 'Stripe' },
  { iconName: 'Mail',            name: 'Gmail' },
  { iconName: 'Mail',            name: 'Outlook' },
  { iconName: 'MessageSquare',   name: 'Slack' },
  { iconName: 'MessageSquare',   name: 'Discord' },
  { iconName: 'FileText',        name: 'Notion' },
  { iconName: 'Calendar',        name: 'Google Calendar' },
  { iconName: 'CloudIcon',       name: 'AWS S3' },
  { iconName: 'CloudIcon',       name: 'GCS' },
  { iconName: 'Github',          name: 'GitHub' },
  { iconName: 'Webhook',         name: 'Webhook' },
  { iconName: 'Bot',             name: 'OpenAI' },
  { iconName: 'Bot',             name: 'Anthropic' },
  { iconName: 'Globe',           name: 'HTTP' },
  { iconName: 'Code2',           name: 'JavaScript' },
  { iconName: 'Code2',           name: 'Python' },
  { iconName: 'Folder',          name: 'Local files' },
  { iconName: 'Receipt',         name: 'QuickBooks' },
  { iconName: 'ShoppingBag',     name: 'Shopify' },
  { iconName: 'Send',            name: 'Twilio' },
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

      <p className="mt-6 font-mono text-[11px] tracking-[0.16em] uppercase text-bone-300">
        {t('andMore')}
      </p>
    </section>
  );
}
