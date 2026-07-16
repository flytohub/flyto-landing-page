'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check, FileJson, Terminal, Webhook } from 'lucide-react';
import { cn } from '@/lib/cn';

type Tab = 'json' | 'cli' | 'webhook';

const SAMPLES: Record<Tab, { ext: string; code: string }> = {
  json: {
    ext: 'workflow.json',
    code: `{
  "name": "Daily invoice extraction",
  "trigger": { "kind": "cron", "expr": "0 9 * * MON" },
  "steps": [
    { "id": "login",   "module": "browser.click",  "selector": "#sign-in" },
    { "id": "fill",    "module": "browser.fill",   "fields": { "email": "{{vars.email}}" } },
    { "id": "open",    "module": "browser.goto",   "url": "/invoices?status=paid" },
    { "id": "extract", "module": "browser.scrape", "schema": { "amount": "td.total" } },
    { "id": "push",    "module": "sheets.append",  "doc": "{{vars.sheet}}" }
  ],
  "on_error": { "retry": 3, "notify": "slack:#ops" }
}`,
  },
  cli: {
    ext: 'shell',
    code: `# Run a workflow from the CLI
	flyto2 run checkout-flow.json --vars email=team@flyto2.com

# Schedule on a cron
flyto2 schedule add checkout-flow.json --cron "0 9 * * MON"

# Inspect a recorded run
flyto2 logs --run last --tail 50

# Export to CI
flyto2 export --target github-actions > .github/workflows/checkout.yml`,
  },
  webhook: {
    ext: 'curl',
    code: `# Trigger a workflow via webhook
curl -X POST https://api.flyto2.com/v1/workflows/checkout-flow/run \\
  -H "Authorization: Bearer $FLYTO2_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "vars": { "email": "team@flyto2.com" },
    "wait": true
  }'

# Response
{
  "run_id": "run_01HXY...",
  "status": "succeeded",
  "duration_ms": 1247,
  "output": { "extracted": 142, "pushed_to_sheet": true }
}`,
  },
};

export function CodeSample() {
  const t = useTranslations('cloud.codeSample');
  const [tab, setTab] = useState<Tab>('json');
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(SAMPLES[tab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-32">
      <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-16">
        <header className="min-w-0 lg:col-span-5">
          <span className="label-mono">{t('label')}</span>
          <h2 className="h-display mt-4 text-[clamp(32px,5vw,56px)]">{t('title')}</h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-bone-200">
            {t('subtitle')}
          </p>

          <ul className="mt-8 space-y-3 text-[14px] text-bone-200">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1 w-3 flex-none bg-violet-400" />
              <span>{t('point1')}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1 w-3 flex-none bg-violet-400" />
              <span>{t('point2')}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1 w-3 flex-none bg-violet-400" />
              <span>{t('point3')}</span>
            </li>
          </ul>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0 lg:col-span-7"
        >
          <div className="w-full max-w-full overflow-hidden rounded-2xl border border-[var(--color-line)] bg-ink-900/80 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.6)]">
            <div className="flex min-w-0 items-center overflow-x-auto border-b border-[var(--color-line)] bg-ink-800/40">
              <TabBtn label="workflow.json"  icon={FileJson} active={tab === 'json'}    onClick={() => setTab('json')} />
              <TabBtn label="cli"            icon={Terminal} active={tab === 'cli'}     onClick={() => setTab('cli')} />
              <TabBtn label="webhook"        icon={Webhook}  active={tab === 'webhook'} onClick={() => setTab('webhook')} />

              <button
                onClick={onCopy}
                className="ml-auto inline-flex shrink-0 items-center gap-1.5 px-3 py-3 font-mono text-[10.5px] tracking-wide uppercase text-bone-300 transition-colors hover:text-bone-100 sm:px-4"
                aria-label="Copy"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="max-h-[360px] max-w-full overflow-auto px-4 py-4 font-mono text-[11px] leading-relaxed text-bone-100 sm:max-h-[420px] sm:px-5 sm:py-5 sm:text-[12.5px]">
              <code>{SAMPLES[tab].code}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TabBtn({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof FileJson;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 font-mono text-[10.5px] tracking-wide transition-colors sm:px-4 sm:text-[11.5px]',
        active
          ? 'border-violet-400 text-bone-100'
          : 'border-transparent text-bone-300 hover:text-bone-200',
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      <span>{label}</span>
    </button>
  );
}
