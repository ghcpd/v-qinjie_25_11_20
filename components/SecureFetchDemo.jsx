'use client';

import { useEffect, useState } from 'react';
import { maskKey } from '../lib/security';

export default function SecureFetchDemo() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/secure-metrics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-client-tenant': 'ui-security-lab'
          },
          credentials: 'same-origin',
          cache: 'no-store'
        });
        if (!response.ok) throw new Error('API rejected request');
        const data = await response.json();
        if (!ignore) {
          setMetrics(data.metrics ?? []);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <header className="flex flex-col gap-2 border-b border-white/10 pb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Secure Fetch</p>
        <h2 className="text-xl font-semibold text-white">Server-minted metrics without leaking tokens</h2>
        <p className="text-sm text-white/70">
          Requests target the local API using HTTPS-only headers, same-origin credentials, and no query-string tokens.
        </p>
      </header>
      {loading ? (
        <p className="mt-6 animate-pulse text-sm text-white/60">Collecting metrics…</p>
      ) : error ? (
        <p className="mt-6 text-sm text-red-300">{error}</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {metrics.map((metric) => (
            <li key={metric.key} className="rounded-2xl border border-white/10 bg-night/30 p-4">
              <p className="text-sm font-semibold text-sage">{metric.name}</p>
              <p className="text-xs text-white/60">Scope: {metric.scope}</p>
              <p className="text-xs text-white/40">API Token: {maskKey(metric.maskedToken)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
