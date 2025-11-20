import { secureLogs } from '../lib/data';

export default function SecureLogViewer() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Audit Log</p>
          <h2 className="text-xl font-semibold text-white">Server-side only insights</h2>
        </div>
        <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-200">Streaming</span>
      </header>
      <div className="mt-6 space-y-3">
        {secureLogs.map((log) => (
          <article key={log.message} className="rounded-2xl border border-white/10 bg-night/40 p-4">
            <p className="text-sm text-white/80">{log.message}</p>
            <p className="text-xs text-white/40">{log.time}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
