import Link from 'next/link';
import { getUserRole, isAnalyst } from '../../../lib/auth';

export const metadata = {
  title: 'Analyst Console | UI Security'
};

export default async function AnalystPage() {
  const role = await getUserRole();
  if (!isAnalyst(role)) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 p-8 text-center">
        <p className="text-4xl">🚫</p>
        <h1 className="text-2xl font-semibold">Restricted</h1>
        <p className="text-sm text-white/70">
          Analyst telemetry is hidden because your session is <strong>{role}</strong>. Elevate via the role switcher on the landing page.
        </p>
        <Link className="rounded-full bg-cyber px-6 py-2 text-sm" href="/">
          Back to home
        </Link>
      </main>
    );
  }

  const data = [
    { name: 'Patched Secrets', value: '42' },
    { name: 'Sandbox Escapes', value: '0' },
    { name: 'Malicious Payloads', value: '12' }
  ];

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-8 p-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Analyst console</p>
        <h1 className="text-4xl font-bold">Privileged operations</h1>
        <p className="text-sm text-white/60">Only visible while holding an HttpOnly analyst cookie.</p>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        {data.map((item) => (
          <div key={item.name} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">{item.name}</p>
            <p className="text-3xl font-semibold text-sage">{item.value}</p>
          </div>
        ))}
      </section>
      <p className="text-sm text-white/60">
        Secrets stay server-side and nothing from the insecure variant (hardcoded keys, inline HTML) is preserved here.
      </p>
    </main>
  );
}
