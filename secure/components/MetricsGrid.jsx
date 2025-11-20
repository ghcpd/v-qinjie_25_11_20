import MetricCard from './MetricCard';

export default function MetricsGrid({ metrics = [] }) {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {metrics.map((metric) => (
        <MetricCard key={metric.name} {...metric} />
      ))}
    </section>
  );
}
