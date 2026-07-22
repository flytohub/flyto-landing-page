import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import {
  FileText, FileSpreadsheet, CreditCard, Database, MessageSquare, Bot, Code2,
  Mail, Calendar, Globe, Cloud, Webhook, Chrome, GitBranch, FolderTree,
  ShoppingCart, KeyRound, Server, Image as ImageIcon, FileJson, FlaskConical,
  type LucideIcon,
} from 'lucide-react';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Integrations — 452 modules',
    description:
      '452 pre-wired modules across CSV, spreadsheets, Stripe, Notion, Slack, AI, databases, browsers and more. Drag, drop, configure.',
    alternates: pageAlternates('cloud/integrations', locale),
  };
}

interface IntegrationGroup {
  icon: LucideIcon;
  name: string;
  body: string;
  modules: string[];
}

const GROUPS: IntegrationGroup[] = [
  {
    icon: FileText, name: 'Files & Documents',
    body: 'Read, write, transform — local files, network drives, S3-style object stores.',
    modules: ['csv.read', 'csv.write', 'csv.append', 'json.read', 'json.write', 'json.merge', 'yaml.read', 'yaml.write', 'xml.parse', 'pdf.extract', 'pdf.create', 'pdf.merge', 'pdf.split', 'markdown.read', 'markdown.write', 'text.read', 'text.write', 'file.copy', 'file.move', 'file.delete', 'folder.list', 'folder.create'],
  },
  {
    icon: FileSpreadsheet, name: 'Spreadsheets',
    body: 'Excel and Google Sheets as both data source and output target.',
    modules: ['excel.read', 'excel.write', 'excel.append', 'excel.formula', 'excel.format', 'sheets.read', 'sheets.append', 'sheets.batch_update', 'sheets.format', 'sheets.import_csv', 'sheets.export'],
  },
  {
    icon: CreditCard, name: 'Payments & Finance',
    body: 'Stripe — subscriptions, invoices, refunds, reports.',
    modules: ['stripe.charge', 'stripe.refund', 'stripe.subscription.create', 'stripe.subscription.cancel', 'stripe.invoice.list', 'stripe.customer.find', 'stripe.customer.create', 'stripe.balance', 'stripe.webhook.verify'],
  },
  {
    icon: Database, name: 'Databases',
    body: 'Postgres, MySQL, SQLite, MongoDB — the boring, reliable kind.',
    modules: ['postgres.query', 'postgres.insert', 'postgres.upsert', 'postgres.transaction', 'mysql.query', 'sqlite.query', 'mongo.find', 'mongo.insert', 'mongo.update', 'redis.get', 'redis.set', 'redis.publish'],
  },
  {
    icon: FolderTree, name: 'Knowledge & Notes',
    body: 'Notion and Confluence — pages, databases, blocks.',
    modules: ['notion.page.create', 'notion.page.update', 'notion.page.read', 'notion.database.query', 'notion.database.update_row', 'notion.block.append', 'confluence.page.create', 'confluence.page.update', 'confluence.search'],
  },
  {
    icon: MessageSquare, name: 'Chat & Messaging',
    body: 'Slack, Discord, Microsoft Teams, LINE, Telegram — channels, threads, attachments.',
    modules: ['slack.message', 'slack.channel.list', 'slack.thread.reply', 'slack.upload', 'discord.message', 'discord.embed', 'teams.message', 'line.push', 'line.broadcast', 'telegram.send'],
  },
  {
    icon: Mail, name: 'Email',
    body: 'Send via SMTP / Gmail / SES; read via IMAP / Gmail API.',
    modules: ['smtp.send', 'gmail.send', 'gmail.read', 'gmail.search', 'gmail.label', 'imap.fetch', 'imap.search', 'ses.send', 'mailgun.send'],
  },
  {
    icon: Calendar, name: 'Calendar & Scheduling',
    body: 'Google Calendar, Outlook, Calendly — events, invites, free/busy.',
    modules: ['gcal.event.create', 'gcal.event.update', 'gcal.event.list', 'gcal.busy', 'outlook.event.create', 'outlook.event.list', 'calendly.event.list'],
  },
  {
    icon: Code2, name: 'Developer Tools',
    body: 'GitHub, GitLab, Bitbucket — issues, PRs, releases, repos.',
    modules: ['github.issue.create', 'github.issue.comment', 'github.pr.create', 'github.pr.merge', 'github.release.create', 'github.repo.list', 'gitlab.issue.create', 'gitlab.mr.create', 'bitbucket.pr.create'],
  },
  {
    icon: GitBranch, name: 'CI / CD',
    body: 'Trigger pipelines, read status, publish artifacts.',
    modules: ['actions.dispatch', 'actions.status', 'circleci.trigger', 'jenkins.trigger', 'docker.build', 'docker.push', 'kubectl.apply'],
  },
  {
    icon: Bot, name: 'AI & LLM',
    body: 'OpenAI, Anthropic, Gemini, local Ollama. Bring your own key.',
    modules: ['openai.chat', 'openai.embed', 'openai.image', 'openai.transcribe', 'anthropic.chat', 'anthropic.tool_use', 'gemini.chat', 'ollama.chat', 'llm.classify', 'llm.extract', 'llm.summarize', 'llm.translate'],
  },
  {
    icon: Webhook, name: 'HTTP & Webhooks',
    body: 'http.request is the universal escape hatch — call any REST/GraphQL service.',
    modules: ['http.get', 'http.post', 'http.put', 'http.patch', 'http.delete', 'http.graphql', 'webhook.receive', 'webhook.verify', 'oauth.exchange', 'oauth.refresh'],
  },
  {
    icon: Chrome, name: 'Browser Automation',
    body: '74 atomic modules — record once, replay forever. Captcha-aware, stealth-capable.',
    modules: ['browser.launch', 'browser.goto', 'browser.click', 'browser.type', 'browser.scroll', 'browser.extract', 'browser.screenshot', 'browser.pdf', 'browser.record', 'browser.replay', 'browser.evaluate', 'browser.network', 'browser.performance', 'browser.cookies', 'browser.download', 'browser.frame', 'browser.intercept', 'browser.select', 'browser.wait', 'browser.close'],
  },
  {
    icon: ShoppingCart, name: 'E-commerce',
    body: 'Shopify, WooCommerce, Square — orders, products, inventory.',
    modules: ['shopify.order.list', 'shopify.product.update', 'shopify.inventory.set', 'square.order.list', 'square.invoice.create', 'woo.order.list', 'woo.product.update'],
  },
  {
    icon: KeyRound, name: 'Auth & Secrets',
    body: '1Password CLI, Doppler, HashiCorp Vault — secret-store first, never inline.',
    modules: ['onepassword.read', 'doppler.read', 'vault.read', 'aws.secret.read', 'env.read', 'env.write'],
  },
  {
    icon: Server, name: 'Cloud Storage',
    body: 'AWS S3, Google Cloud Storage, Azure Blob, Dropbox, Box.',
    modules: ['s3.upload', 's3.download', 's3.list', 'gcs.upload', 'gcs.download', 'azure_blob.upload', 'dropbox.upload', 'box.upload'],
  },
  {
    icon: ImageIcon, name: 'Image & Media',
    body: 'OCR, resize, compress, format conversion, watermarking.',
    modules: ['image.resize', 'image.compress', 'image.convert', 'image.watermark', 'image.ocr', 'image.detect_text', 'video.thumbnail', 'audio.transcribe'],
  },
  {
    icon: FileJson, name: 'Data Processing',
    body: 'Filter, sort, group, join, transform — for the messy in-between steps.',
    modules: ['data.filter', 'data.sort', 'data.group', 'data.join', 'data.merge', 'data.transform', 'data.validate', 'data.deduplicate', 'array.map', 'array.flatten'],
  },
  {
    icon: Globe, name: 'Geo & Maps',
    body: 'Google Maps geocoding, distance matrix, places, country detection.',
    modules: ['maps.geocode', 'maps.reverse_geocode', 'maps.distance', 'maps.places.search', 'ipinfo.lookup'],
  },
  {
    icon: FlaskConical, name: 'Flow Control',
    body: 'The plumbing that makes 452 modules into actual workflows.',
    modules: ['flow.branch', 'flow.switch', 'flow.loop', 'flow.foreach', 'flow.fork', 'flow.merge', 'flow.breakpoint', 'flow.wait', 'flow.timeout', 'flow.retry'],
  },
  {
    icon: Cloud, name: 'Templates & Recipes',
    body: 'Call other workflows as if they were modules. Marketplace-ready.',
    modules: ['template.invoke', 'template.fork', 'template.publish', 'recipe.run', 'workflow.replay', 'workflow.test'],
  },
];

export default async function CloudIntegrationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const total = GROUPS.reduce((s, g) => s + g.modules.length, 0);

  return (
    <article className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="mb-16 max-w-3xl">
        <span className="label-mono">INTEGRATIONS</span>
        <h1 className="h-display mt-4 text-[clamp(40px,7vw,80px)]">
          {total}+ modules. <span className="text-violet-300">Plug, configure, run.</span>
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-bone-200 sm:text-[17px]">
          Each module is a pre-wired primitive — handle the connection, the pagination, the retries,
          the rate limits — so you build by composition, not by writing API plumbing. Snap together
          modules from any of the categories below into a workflow that does real work.
        </p>
      </header>

      <div className="space-y-12">
        {GROUPS.map((g) => {
          const Icon = g.icon;
          return (
            <section
              key={g.name}
              className="rounded-3xl border border-[var(--color-line)] bg-ink-800/40 p-7 sm:p-10"
            >
              <header className="flex items-center gap-4">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-700 text-violet-300">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-bone-100">
                    {g.name}
                  </h2>
                  <p className="mt-1 text-[13.5px] text-bone-200/80">{g.body}</p>
                </div>
                <span className="ml-auto font-mono text-[10px] tracking-[0.18em] uppercase text-bone-300">
                  {g.modules.length} modules
                </span>
              </header>

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {g.modules.map((m) => (
                  <li
                    key={m}
                    className="rounded-md border border-[var(--color-line)] bg-ink-900/60 px-2.5 py-1 font-mono text-[11.5px] text-bone-100/85"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <footer className="mt-16 rounded-3xl border border-[var(--color-line)] bg-ink-800/40 p-8 sm:p-10">
        <h2 className="font-display text-xl font-semibold tracking-tight">Build your own.</h2>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-bone-200">
          If you can call it with HTTP, Flyto2 already speaks to it via{' '}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[12px]">http.request</code>.
          For anything more involved, the plugin SDK lets you ship a module in Python or JavaScript
          and have it appear in the recorder palette next run.
        </p>
      </footer>
    </article>
  );
}
