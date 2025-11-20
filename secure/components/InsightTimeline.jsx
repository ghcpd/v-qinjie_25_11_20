import { insightTimeline } from '../lib/data';

export default function InsightTimeline() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <header className="pb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Remediation Timeline</p>
        <h2 className="text-xl font-semibold text-white">Fix evidence</h2>
      </header>
      <ol className="space-y-4 border-l border-white/10 pl-4">
        {insightTimeline.map((item) => (
          <li key={item.title} className="relative">
            <span className="absolute -left-[33px] top-1 h-3 w-3 rounded-full bg-sage shadow-glow" />
            <p className="text-sm font-semibold text-white">{item.title}</p>
            <p className="text-xs text-white/60">{item.description}</p>
            <p className="text-[0.7rem] text-white/40">{item.date}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
