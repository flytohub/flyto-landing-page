import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import {
  Boxes, Code2, KeyRound, ScrollText, Bug, Crosshair, FileCheck2, Activity, Container,
  type LucideIcon,
} from 'lucide-react';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await params;
  return {
    title: 'Security — what Warroom scans',
    description:
      'Nine independent security signals — SCA, SAST, secrets, license, CVE, IaC, container, runtime, pentest — rolled into one A–F health score.',
    alternates: pageAlternates('code/security'),
  };
}

interface Signal {
  icon: LucideIcon;
  short: string;
  name: string;
  blurb: string;
  whatItCatches: string[];
  whatItIsnt: string;
  status: 'shipping' | 'beta' | 'planned';
}

const SIGNALS: Signal[] = [
  {
    icon: Boxes, short: 'SCA', name: 'Software Composition Analysis', status: 'shipping',
    blurb:
      'Every direct and transitive dependency in your lockfile, joined with a current CVE database and weighted by whether the vulnerable function is actually reachable from your code.',
    whatItCatches: [
      'CVE-affected packages in your dependency tree',
      'License contamination (GPL pulled in by a transitive dep)',
      'Typosquats and known-malicious packages',
      'Duplicate versions of the same package pinned at different points in the graph',
    ],
    whatItIsnt:
      'A list of "every CVE that ever touched npm." The default ranking surfaces ~the 5% that have a reachable call path, not the 95% that don\'t.',
  },
  {
    icon: Code2, short: 'SAST', name: 'Static Application Security Testing', status: 'shipping',
    blurb:
      'AST-based taint tracking from untrusted sources to dangerous sinks. Cross-function, cross-package, sanitizer-aware.',
    whatItCatches: [
      'SQL injection, command injection, path traversal',
      'Reflected and stored XSS where unsanitized input reaches a template',
      'SSRF in HTTP-fetch wrappers',
      'Insecure deserialization, prototype pollution, unsafe regex',
    ],
    whatItIsnt:
      'A regex match. Our sources/sinks/sanitizers config in `.flyto-rules.yaml` lets you teach it about your codebase\'s own wrappers.',
  },
  {
    icon: KeyRound, short: 'Secrets', name: 'Hard-coded secret detection', status: 'shipping',
    blurb:
      'Scans HEAD and git history for hard-coded API keys, tokens, credentials and private keys.',
    whatItCatches: [
      'AWS / GCP / Azure access keys',
      'Stripe / Twilio / SendGrid / Anthropic / OpenAI keys',
      'GitHub / GitLab personal access tokens',
      'Generic high-entropy strings flagged by entropy + context',
      'Private keys in .pem, .key, .p12 or pasted into source files',
    ],
    whatItIsnt:
      'A `git secrets` clone. We look at HEAD *and* historical commits, and we tag the commit + author so you know whose hands the key has passed through.',
  },
  {
    icon: ScrollText, short: 'License', name: 'License compliance', status: 'shipping',
    blurb:
      'Every dependency\'s licence — direct and transitive — mapped against your policy.',
    whatItCatches: [
      'GPL contamination via transitive dependencies in a commercial product',
      'Missing attributions (BSD-3, Apache-2.0, MIT NOTICE files)',
      'Commercial-incompatible AGPL pulled in by a tooling chain',
      'Unknown / unspecified licences that block legal review',
    ],
    whatItIsnt:
      'Legal advice. We surface the facts; your counsel decides what to do with them.',
  },
  {
    icon: Bug, short: 'CVE', name: 'Live CVE triage', status: 'shipping',
    blurb:
      'Continuously cross-references your dependency tree with the latest CVE feeds. When a new CVE drops, you know within hours whether you\'re exposed.',
    whatItCatches: [
      'New CVEs against pinned versions of your direct dependencies',
      'CVEs against transitive dependencies, prioritized by reachability',
      'Time-to-patch (how long has a fix been available?)',
      'Replay POCs for high-severity vulns, where public ones exist',
    ],
    whatItIsnt:
      'A panic-button alerting system. The default cadence is daily; webhook + Slack-on-HIGH integration available.',
  },
  {
    icon: Container, short: 'Container', name: 'Container & image scanning', status: 'beta',
    blurb:
      'Scans the Docker images you build for OS-package CVEs, embedded secrets and misconfigurations. Runs alongside SCA so OS + app vulns sit in one view.',
    whatItCatches: [
      'OS-level CVEs in base images (Debian, Alpine, Ubuntu, distroless)',
      'Embedded secrets baked into image layers',
      'Misconfigured Dockerfile patterns (root user, latest tag, broad COPY)',
      'Unscanned third-party base images surfaced as a separate risk',
    ],
    whatItIsnt:
      'A Kubernetes-runtime tool. This is the build-time slice; runtime container security is a planned Phase 4 dimension.',
  },
  {
    icon: FileCheck2, short: 'IaC', name: 'Infrastructure-as-Code', status: 'beta',
    blurb:
      'Reads your Terraform / Kubernetes manifests / Dockerfiles alongside your application code, so security posture and runtime topology come from the same pass.',
    whatItCatches: [
      'Publicly exposed S3 buckets, GCS buckets, Azure containers',
      'Open security groups / firewall rules',
      'Hardcoded credentials in Terraform variables',
      'Drift between what\'s declared in IaC and what\'s deployed',
      'Misconfigurations against CIS benchmarks',
    ],
    whatItIsnt:
      'An IaC linter (we don\'t care about formatting). We care about what the infra exposes.',
  },
  {
    icon: Crosshair, short: 'Pentest', name: 'Pentest-as-code', status: 'beta',
    blurb:
      'The closed-loop differentiator. For each SAST finding, the platform generates a YAML pentest workflow, runs it against your staging environment in a real browser, and reports back: exploitable / sanitized / unreachable.',
    whatItCatches: [
      'Reflected XSS verified against the live response',
      'SQL injection where the error response confirms the payload landed',
      'Auth bypass where the unauthenticated request returned the protected data',
      'Open redirect, SSRF, IDOR — each generated dynamically per finding',
    ],
    whatItIsnt:
      'An adversarial scanner. We run the test in your staging environment with your consent; we never probe production without explicit opt-in.',
  },
  {
    icon: Activity, short: 'Runtime', name: 'Runtime protection', status: 'planned',
    blurb:
      'Phase 4. Lightweight agents that watch production for the patterns we caught statically — and kill-switch the bad requests.',
    whatItCatches: [
      'Production reproduction of statically-found taint paths',
      'Drift between deployed and last-scanned code',
      'Unauthenticated requests to endpoints the static scan flagged as auth-required',
      'Rate spikes against vulnerable endpoints',
    ],
    whatItIsnt:
      'Available yet. Targeted for the Phase 4 roadmap window.',
  },
];

const STATUS_LABEL: Record<Signal['status'], string> = {
  shipping: 'SHIPPING',
  beta:     'BETA',
  planned:  'PLANNED',
};
const STATUS_COLOR: Record<Signal['status'], string> = {
  shipping: 'border-emerald-500/40 text-emerald-300',
  beta:     'border-cyan-400/45 text-cyan-200',
  planned:  'border-amber-400/40 text-amber-300',
};

export default async function CodeSecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="mb-16 max-w-3xl">
        <span className="label-mono">SECURITY</span>
        <h1 className="h-display mt-4 text-[clamp(40px,7vw,80px)]">
          Nine signals. <span className="bg-gradient-to-br from-cyan-300 to-violet-300 bg-clip-text text-transparent">One health score.</span>
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-bone-200 sm:text-[17px]">
          Each signal answers a different question your security team actually asks. The war room
          rolls them into a single A–F grade your CISO can read; you drill into the panel that\'s
          bleeding when something changes.
        </p>
      </header>

      <div className="space-y-8">
        {SIGNALS.map((s) => {
          const Icon = s.icon;
          return (
            <section
              key={s.short}
              className="rounded-3xl border border-[var(--color-line)] bg-ink-800/40 p-7 sm:p-10"
            >
              <header className="flex items-start gap-5">
                <span className="grid h-12 w-12 flex-none place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-700 text-cyan-300">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-bone-300">
                      {s.short}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9.5px] tracking-[0.18em] ${STATUS_COLOR[s.status]}`}
                    >
                      {STATUS_LABEL[s.status]}
                    </span>
                  </div>
                  <h2 className="font-display mt-1.5 text-2xl font-semibold tracking-tight text-bone-100 sm:text-3xl">
                    {s.name}
                  </h2>
                </div>
              </header>

              <p className="mt-5 text-[14.5px] leading-relaxed text-bone-200">{s.blurb}</p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="label-mono text-cyan-300/80">WHAT IT CATCHES</div>
                  <ul className="mt-3 space-y-1.5 text-[13.5px] leading-relaxed text-bone-200">
                    {s.whatItCatches.map((w) => (
                      <li key={w} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 flex-none rounded-full bg-cyan-300/60" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="label-mono text-bone-300/80">WHAT IT ISN&apos;T</div>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-bone-200/90">{s.whatItIsnt}</p>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
