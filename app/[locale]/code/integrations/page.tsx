import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Github, GitBranch, Box, Bot, Bell, Terminal, type LucideIcon } from 'lucide-react';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Integrations — Warroom plugs into the tools you already use',
    description:
      'Git providers, CI/CD systems, IDEs, alerting channels and MCP-capable AI clients — Warroom slots into the existing developer workflow.',
    alternates: pageAlternates('code/integrations', locale),
  };
}

interface Section {
  icon: LucideIcon;
  title: string;
  body: string;
  items: { name: string; what: string; status: 'live' | 'beta' | 'planned' }[];
}

const STATUS_DOT: Record<'live' | 'beta' | 'planned', string> = {
  live:    'bg-emerald-400',
  beta:    'bg-cyan-300',
  planned: 'bg-amber-300',
};
const STATUS_LABEL: Record<'live' | 'beta' | 'planned', string> = {
  live: 'Live', beta: 'Beta', planned: 'Planned',
};

const SECTIONS: Section[] = [
  {
    icon: Github, title: 'Git providers',
    body: 'Connect any repo; the scanner reads source from the provider\'s API or a local checkout.',
    items: [
      { name: 'GitHub',     what: 'OAuth (web) + PAT (CLI). PR check, status check, comment-on-PR, code-scanning SARIF.', status: 'live' },
      { name: 'GitLab',     what: 'Authorization-code + PKCE. MR comments, status checks, GitLab.com or self-hosted.', status: 'live' },
      { name: 'Bitbucket',  what: 'OAuth app integration. PR comments and build statuses.', status: 'beta' },
      { name: 'Gitea / Forgejo', what: 'Self-hosted git server support — repo clone + webhook.', status: 'planned' },
      { name: 'Self-hosted Git', what: 'Anywhere you can run `git clone`, the scanner runs.', status: 'live' },
    ],
  },
  {
    icon: GitBranch, title: 'CI / CD',
    body: 'Drop Warroom into the pipeline you already run. Zero new infrastructure needed.',
    items: [
      { name: 'GitHub Actions',  what: '`flytohub/scan@v1` — uploads SARIF, posts PR comment, gates merge.', status: 'live' },
      { name: 'GitLab CI',       what: 'Reference YAML, picks up MR context, posts MR note.', status: 'live' },
      { name: 'Jenkins',         what: 'Plugin + CLI; SARIF + JSON output for downstream consumers.', status: 'beta' },
      { name: 'CircleCI',        what: 'Orb + CLI, parallel-friendly for monorepos.', status: 'beta' },
      { name: 'Buildkite',       what: 'CLI wrapper + Buildkite annotation output.', status: 'planned' },
      { name: 'Drone CI',        what: 'Containerised step + standard exit codes.', status: 'planned' },
      { name: 'Self-hosted CLI', what: '`flyto-code scan .` works in any container or CI runner.', status: 'live' },
    ],
  },
  {
    icon: Box, title: 'Languages & ecosystems',
    body:
      'The scanner ingests source from any combination of these — multi-language monorepos are first-class.',
    items: [
      { name: 'JavaScript / TypeScript', what: 'npm, yarn, pnpm. React, Vue, Svelte, Next.js, Astro, server-side and CLI.', status: 'live' },
      { name: 'Python',                  what: 'pip, Poetry, uv. Django, Flask, FastAPI, Pyramid, Starlette, scripts.', status: 'live' },
      { name: 'Go',                      what: 'Modules + vendored. Standard library + popular frameworks (gin, echo, chi).', status: 'live' },
      { name: 'Java / Kotlin',           what: 'Maven + Gradle. Spring, Jakarta EE, Android.', status: 'live' },
      { name: 'Rust',                    what: 'Cargo workspaces, cross-crate references via rust-analyzer.', status: 'beta' },
      { name: 'PHP',                     what: 'Composer. Laravel, Symfony, WordPress.', status: 'live' },
      { name: 'Ruby',                    what: 'Bundler. Rails, Sinatra.', status: 'live' },
      { name: 'Container images',        what: 'Docker / OCI image layers — OS-level CVE + secret scanning.', status: 'beta' },
    ],
  },
  {
    icon: Terminal, title: 'IDE integration',
    body: 'See the same findings in your editor that the war room shows.',
    items: [
      { name: 'VS Code',     what: '`flyto-vscode` extension — inline annotations on findings, hover for taint flow.', status: 'beta' },
      { name: 'JetBrains',   what: 'IntelliJ / PyCharm / WebStorm plugin (shared protocol with VS Code).', status: 'planned' },
      { name: 'Neovim / Vim',what: 'LSP-style integration via the existing flyto-indexer LSP server.', status: 'planned' },
      { name: 'Sublime Text',what: 'LSP integration via Package Control plugin.', status: 'planned' },
    ],
  },
  {
    icon: Bot, title: 'AI clients (MCP)',
    body:
      'flyto-indexer ships an MCP server with eight tools (`search`, `impact`, `audit`, `task`, `structure`, plus four more). Any MCP-capable client can drive Warroom.',
    items: [
      { name: 'Claude Code', what: 'STDIO transport, runs alongside other MCP servers in your workspace.', status: 'live' },
      { name: 'Claude Desktop', what: 'Drop-in MCP config; same tool surface.', status: 'live' },
      { name: 'Cursor',      what: 'MCP server configuration via Cursor settings.', status: 'live' },
      { name: 'Windsurf',    what: 'MCP transport supported out of the box.', status: 'live' },
      { name: 'Continue.dev',what: 'MCP-compatible config block.', status: 'beta' },
      { name: 'Cline',       what: 'MCP STDIO transport.', status: 'beta' },
    ],
  },
  {
    icon: Bell, title: 'Notifications & ticketing',
    body: 'When a HIGH severity finding lands, the right person should know without opening a tab.',
    items: [
      { name: 'Slack',     what: 'New high-severity findings into a channel. Dedupe across runs.', status: 'beta' },
      { name: 'Microsoft Teams', what: 'Webhook out, same dedupe model as Slack.', status: 'beta' },
      { name: 'Discord',   what: 'Webhook out with severity-aware embed formatting.', status: 'beta' },
      { name: 'Email',     what: 'Daily digest + immediate-on-CRITICAL for opt-in users.', status: 'live' },
      { name: 'PagerDuty', what: 'Optional integration for ops teams that want page-on-critical.', status: 'planned' },
      { name: 'Jira',      what: 'File a ticket from any finding; bi-directional status sync.', status: 'planned' },
      { name: 'GitHub Issues', what: 'File against the same repo the finding came from.', status: 'beta' },
      { name: 'Linear',    what: 'Workflow integration with team assignment.', status: 'planned' },
    ],
  },
];

export default async function CodeIntegrationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="mb-16 max-w-3xl">
        <span className="label-mono">INTEGRATIONS</span>
        <h1 className="h-display mt-4 text-[clamp(40px,7vw,80px)]">
          Slots into the tools you already use.
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-bone-200 sm:text-[17px]">
          Warroom doesn\'t ask your team to switch IDEs, change CI providers, or learn a new chat
          tool. It plugs into the developer workflow you already have, reports the same findings
          in every surface, and lets the engineer fix things from where they were already working.
        </p>
      </header>

      <div className="space-y-10">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <section
              key={s.title}
              className="rounded-3xl border border-[var(--color-line)] bg-ink-800/40 p-7 sm:p-10"
            >
              <header className="flex items-start gap-4">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-700 text-cyan-300">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-bone-100">
                    {s.title}
                  </h2>
                  <p className="mt-1.5 text-[13.5px] text-bone-200/80">{s.body}</p>
                </div>
              </header>

              <ul className="mt-6 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
                {s.items.map((it) => (
                  <li key={it.name} className="grid gap-1 py-4 sm:grid-cols-12 sm:gap-6">
                    <div className="sm:col-span-3">
                      <h3 className="font-display text-[15px] font-semibold tracking-tight text-bone-100">
                        {it.name}
                      </h3>
                      <div className="mt-1 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-bone-300">
                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[it.status]}`} />
                        {STATUS_LABEL[it.status]}
                      </div>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-bone-200 sm:col-span-9">
                      {it.what}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </article>
  );
}
