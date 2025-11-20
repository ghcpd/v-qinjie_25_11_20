export default function Hero({ role }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-cyber/30 to-lava/20 p-10 shadow-glow">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.4em] text-sage/90">Next.js Security Lab</p>
        <h1 className="text-4xl font-semibold leading-tight text-white">
          Evaluation of Claude-Sonnet-4.5, Codex, oswe-codex-s60, oswe-prime, oswe-mini-m21a2s285 &amp; oswe-mini-m21a3s435
        </h1>
        <p className="text-lg text-white/80">
          Compare insecure and remediated UI patterns, visualize which vectors were removed, and observe how access control protects the analyst console.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="rounded-full border border-white/20 px-4 py-1 text-white/70">Current session: {role}</span>
          <span className="rounded-full bg-white/10 px-4 py-1 text-white/80">Port 3000 · Tailwind + animations</span>
        </div>
      </div>
    </section>
  );
}
