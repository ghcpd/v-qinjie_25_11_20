import Hero from '../components/Hero';
import MetricsGrid from '../components/MetricsGrid';
import LiveThreatPanel from '../components/LiveThreatPanel';
import SecureLogViewer from '../components/SecureLogViewer';
import SecureFetchDemo from '../components/SecureFetchDemo';
import RoleSwitcher from '../components/RoleSwitcher';
import InsightTimeline from '../components/InsightTimeline';
import { metricLibrary } from '../lib/data';
import { getUserRole } from '../lib/auth';
import { setUserRole } from './actions';

export default async function Home() {
  const role = await getUserRole();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <Hero role={role} />
      <MetricsGrid metrics={metricLibrary} />
      <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        <LiveThreatPanel />
        <div className="space-y-6">
          <SecureLogViewer />
          <InsightTimeline />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <SecureFetchDemo />
        <RoleSwitcher currentRole={role} switchRole={setUserRole} />
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
        <p>
          This secure variant removes the following issues from the <code>insecure/</code> snapshot: hardcoded API keys, inline secrets,
          <code>dangerouslySetInnerHTML</code> without sanitization, client-side role spoofing, and plaintext token fetching. Tests inside
          <code>tests/</code> detect these regressions automatically.
        </p>
      </div>
    </main>
  );
}
