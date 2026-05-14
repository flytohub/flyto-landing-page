import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Briefcase, ShieldCheck, Users, type LucideIcon } from 'lucide-react';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Use cases — who Warroom is built for',
    description:
      'Three buyer archetypes — CTO, Security Lead, Engineering Manager — and the specific questions Warroom answers for each.',
    alternates: pageAlternates('code/use-cases', locale),
  };
}

interface Persona {
  icon: LucideIcon;
  role: string;
  headline: string;
  worldview: string;
  questions: { q: string; a: string }[];
  outcome: string;
}

const PERSONAS: Persona[] = [
  {
    icon: Briefcase,
    role: 'CTO',
    headline: 'Wants one number, defensible to the board.',
    worldview:
      'You sit in front of board members who ask "are we secure?" once a quarter. You can\'t answer "yes." You can\'t answer "no." The honest answer — "compared to what, weighted by which threat, against which assets?" — doesn\'t fit on a slide.',
    questions: [
      {
        q: 'What is our overall security posture today?',
        a: 'One A–F score per project, rolled up to a single org grade. Score components (SCA, SAST, secrets, license, IaC, CVE, pentest, runtime, compliance) visible underneath so the question "why" has an answer.',
      },
      {
        q: 'How does posture change over time?',
        a: 'Trend lines for every category, with marked deltas at known events (deploys, dependency bumps, CVEs landing). Last quarter vs. this quarter, last release vs. main — comparable.',
      },
      {
        q: 'Which teams or services are bleeding?',
        a: 'Per-team and per-service rollups. The CTO knows which director-level conversation to have without asking the security lead to build the report.',
      },
      {
        q: 'Are we ready for SOC 2 / ISO 27001?',
        a: 'Compliance mapping (Phase 4) marks each finding against the controls it implicates. Auditor-ready evidence locker as a side-effect of normal scanning.',
      },
    ],
    outcome:
      'Walks into the board meeting with one slide that survives cross-examination. Sleeps better the night before.',
  },
  {
    icon: ShieldCheck,
    role: 'Security Lead',
    headline: 'Wants to fix the thing that is actually exploitable.',
    worldview:
      'You have a backlog of 2,400 findings across three scanners. You know maybe 5% are real. You don\'t have the cycles to triage all 2,400 to find the 120 that matter. Your engineers have stopped reading the security channel because it cried wolf too often.',
    questions: [
      {
        q: 'Which CVEs in our deps are actually reachable from our code?',
        a: 'Reachability analysis traces the static call graph from our application code through the dependency tree to the vulnerable function. Findings split into "reachable" and "merely present" — you act on the first, you log the second.',
      },
      {
        q: 'Is this SQL injection finding a real issue or a false positive?',
        a: 'The closed-loop verify flow generates a YAML pentest workflow, runs it against staging in a real browser, and tells you: exploitable / sanitized / unreachable. Each finding has evidence — request, response, screenshot — attached.',
      },
      {
        q: 'How do I tune out the noise without missing real things?',
        a: 'Custom rules in `.flyto-rules.yaml`, version-controlled with the codebase. Suppress one specific finding with `// flyto-ignore: <rule-id>` on the previous line. Audit the suppressions in PR.',
      },
      {
        q: 'How do I prove our security improved this quarter?',
        a: 'Score trend chart, per-category. Critical-and-high finding count over time. MTTR for resolved findings. Numbers stakeholders can read; numbers you can defend.',
      },
    ],
    outcome:
      'Goes from triaging a 2,400-finding backlog to acting on the 60 that have a path to proof.',
  },
  {
    icon: Users,
    role: 'Engineering Manager',
    headline: 'Wants security to not block PRs unnecessarily.',
    worldview:
      'Your team ships changes daily. The current security review process either reviews nothing (and risks shipping a real issue) or reviews everything (and burns half a sprint per release). Neither is acceptable.',
    questions: [
      {
        q: 'Which PRs should I actually slow down?',
        a: 'The PR check posts a single comment: blast radius score, files touched, security delta vs. base. Most PRs get a one-line "no new security risk" comment. The 5% that need scrutiny are visible.',
      },
      {
        q: 'How do I help my engineers fix the legitimate findings without context-switching?',
        a: 'Every finding has an AutoFix tier. Tier 1 (deterministic transforms — pin a version, escape an output, add a sanitizer call) lands as a draft PR. Tier 2 (LLM-suggested fixes) needs review. Tier 3 ("this needs design") raises a ticket.',
      },
      {
        q: 'Which finding categories give the worst false-positive rate against our codebase?',
        a: 'Audit dashboard shows per-rule FP rate (suppressions / total triggers). Tune the noisy ones in `.flyto-rules.yaml`, ship cleaner findings next run.',
      },
      {
        q: 'How do I onboard a new engineer to our security posture?',
        a: 'A one-page rendered audit + the `.flyto-rules.yaml` itself become living documentation. New hire reads the rules to understand "what does this team consider important?" without a 90-minute walkthrough.',
      },
    ],
    outcome:
      'Security becomes a half-page comment in the PR, not a half-day external review.',
  },
];

export default async function CodeUseCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
      <header className="mb-16 max-w-3xl">
        <span className="label-mono">USE CASES</span>
        <h1 className="h-display mt-4 text-[clamp(40px,7vw,80px)]">
          Who Warroom is for.
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-bone-200 sm:text-[17px]">
          Three roles, three sets of questions, three different reasons the war room is the
          surface that answers them. If you are one of these — or you work with one — the install
          is a couple of CLI commands.
        </p>
      </header>

      <div className="space-y-12">
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          return (
            <section
              key={p.role}
              className="rounded-3xl border border-[var(--color-line)] bg-ink-800/40 p-7 sm:p-10"
            >
              <header className="flex items-start gap-5">
                <span className="grid h-12 w-12 flex-none place-items-center rounded-xl border border-[var(--color-line-strong)] bg-ink-700 text-cyan-300">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-bone-300">
                    {p.role}
                  </span>
                  <h2 className="font-display mt-1.5 text-2xl font-semibold tracking-tight text-bone-100 sm:text-3xl">
                    {p.headline}
                  </h2>
                </div>
              </header>

              <p className="mt-5 max-w-3xl text-[14.5px] leading-relaxed text-bone-200">
                {p.worldview}
              </p>

              <dl className="mt-8 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
                {p.questions.map((q) => (
                  <div key={q.q} className="py-5">
                    <dt className="font-display text-[15.5px] font-semibold tracking-tight text-bone-100">
                      {q.q}
                    </dt>
                    <dd className="mt-2 text-[13.5px] leading-relaxed text-bone-200">{q.a}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-7 rounded-2xl border border-cyan-400/25 bg-cyan-500/[0.04] p-4 text-[14px] leading-relaxed text-bone-100">
                <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-cyan-300/85">
                  Outcome —
                </span>{' '}
                {p.outcome}
              </p>
            </section>
          );
        })}
      </div>
    </article>
  );
}
