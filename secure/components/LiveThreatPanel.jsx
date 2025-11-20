'use client';

import { useMemo, useState } from 'react';
import { sanitizeInput } from '../lib/security';

export default function LiveThreatPanel() {
  const [payload, setPayload] = useState('<img src=x onerror=alert(`pwned`)>');

  const sanitized = useMemo(() => sanitizeInput(payload), [payload]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
      <header className="flex flex-col gap-2 border-b border-white/10 pb-4">
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">Payload Sandbox</p>
        <h2 className="text-2xl font-semibold text-white">Client-side sanitization in action</h2>
        <p className="text-sm text-white/70">
          Try pasting any HTML payload. Instead of using <code>dangerouslySetInnerHTML</code>, inputs are sanitized on keystroke
          with DOMPurify and rendered via <code>dangerouslySetInnerHTML</code> only after sanitization.
        </p>
      </header>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <textarea
          aria-label="Malicious payload input"
          className="min-h-[180px] rounded-2xl border border-white/20 bg-night/50 p-4 text-sm text-white/90 focus:border-cyber focus:outline-none"
          value={payload}
          onChange={(event) => setPayload(event.target.value)}
        />
        <div className="rounded-2xl border border-white/10 bg-night/30 p-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Preview (safe)</p>
          <div className="prose prose-invert mt-2 max-w-none" dangerouslySetInnerHTML={{ __html: sanitized }} />
        </div>
      </div>
    </section>
  );
}
