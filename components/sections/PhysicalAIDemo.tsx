import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PHYSICAL_AI_DEMO_ASSET, physicalAIDemoCopy } from '@/lib/physical-ai-demo';

export function PhysicalAIDemo({ locale }: { locale: string }) {
  const copy = physicalAIDemoCopy(locale);
  return (
    <section id="physical-ai-exhibit" aria-labelledby="physical-ai-exhibit-title" className="border-y border-[var(--color-line)] bg-ink-800/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <figure className="overflow-hidden rounded-2xl border border-[var(--color-line-strong)] bg-ink-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]">
          <Image src={PHYSICAL_AI_DEMO_ASSET} alt={copy.alt} width={952} height={908} sizes="(min-width: 1024px) 544px, calc(100vw - 40px)" className="h-auto w-full" />
          <figcaption className="border-t border-[var(--color-line)] px-5 py-4 text-[12.5px] leading-relaxed text-bone-300">{copy.caption}</figcaption>
        </figure>
        <div>
          <span className="label-mono">{copy.eyebrow}</span>
          <h2 id="physical-ai-exhibit-title" className="h-display mt-4 text-[clamp(34px,5vw,58px)]">{copy.title}</h2>
          <div className="mt-6 rounded-xl border border-amber-300/25 bg-amber-300/5 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200">{copy.statusLabel}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-bone-100">{copy.summary}</p>
          </div>
          <ul className="mt-6 space-y-3">
            {copy.facts.map((fact) => <li key={fact} className="flex gap-3 text-[13.5px] leading-relaxed text-bone-200"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-cyan-300" aria-hidden /><span>{fact}</span></li>)}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="https://github.com/flytohub/flyto-robotics" arrow>{copy.sourceCta}</Button>
            <Button href="#flow-demo-videos" variant="secondary">{copy.videosCta}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
