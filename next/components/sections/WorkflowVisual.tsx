import { Circle, MousePointer2, Type, Database, ShieldCheck, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  icon: LucideIcon;
  label: string;
  t: string;
}

const STEPS: Step[] = [
  { icon: MousePointer2, label: 'Click "Login"',    t: '+0.0s' },
  { icon: Type,          label: 'Fill credentials', t: '+0.3s' },
  { icon: Database,      label: 'Read 142 rows',    t: '+0.6s' },
  { icon: ShieldCheck,   label: 'Validate',         t: '+0.9s' },
  { icon: Send,          label: 'Push to Slack',    t: '+1.2s' },
];

export function WorkflowVisual() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--color-line-strong)] bg-ink-800/80 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.6)]">
      {/* App chrome */}
      <div className="flex items-center gap-3 border-b border-[var(--color-line)] bg-ink-900/40 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <span className="font-mono text-[11px] tracking-[0.04em] text-bone-200">
          checkout-flow.flyto2
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-300">
          <Circle className="h-2 w-2 fill-violet-400 text-violet-400" />
          recorded
        </span>
      </div>

      {/* Step list */}
      <ul className="divide-y divide-[var(--color-line)]">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <li
              key={i}
              className="flex items-center gap-4 px-5 py-3.5"
            >
              <span className="num-mono w-6 text-[11px] text-bone-300">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-md border border-[var(--color-line)] bg-ink-900/70 text-bone-200">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
              </span>
              <span className="flex-1 text-[13.5px] text-bone-100">{step.label}</span>
              <span className="num-mono text-[11px] text-bone-300">{step.t}</span>
            </li>
          );
        })}
      </ul>

      {/* Footer bar */}
      <div className="flex items-center justify-between border-t border-[var(--color-line)] bg-ink-900/40 px-5 py-3 font-mono text-[11px] text-bone-300">
        <span>5 steps · 1.2s total</span>
        <span>local · ready to replay</span>
      </div>
    </div>
  );
}
