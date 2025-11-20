export default function MetricCard({ name, change, detail }) {
  return (
    <div className="gradient-border group rounded-3xl border border-white/5 bg-white/5 p-6 transition duration-500 hover:-translate-y-1 hover:bg-white/10">
      <p className="text-sm uppercase tracking-widest text-white/60">{name}</p>
      <p className="mt-3 text-3xl font-semibold text-sage">{change}</p>
      <p className="mt-2 text-sm text-white/70">{detail}</p>
      <div className="mt-4 h-1 w-full rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyber to-sage" style={{ width: '86%' }} />
      </div>
    </div>
  );
}
