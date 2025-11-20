'use client';

import { useEffect, useState } from 'react';

const HARDCODED_KEY = 'sk_live_codex_demo_123456789';

export default function InsecureHome() {
  const [payload, setPayload] = useState('<img src=x onerror=alert(`owned`)>');
  const [apiData, setApiData] = useState([]);
  const [role, setRole] = useState('guest');

  useEffect(() => {
    window.__LAB_DEBUG_KEY__ = HARDCODED_KEY;
    console.info('Leaked key for debugging:', HARDCODED_KEY);

    fetch(`http://insecure-api.local/metrics?token=${HARDCODED_KEY}`, {
      headers: {
        Authorization: `Bearer ${HARDCODED_KEY}`
      }
    })
      .then((res) => res.json())
      .then((data) => setApiData(data.metrics || []));
  }, []);

  const impersonate = () => {
    setRole('analyst');
    localStorage.setItem('role', 'analyst');
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>🚨 Insecure prototype</h1>
      <p>Anyone can view the leaked API key below and replay privileged calls.</p>
      <pre>Key: {HARDCODED_KEY}</pre>

      <section>
        <h2>Payload preview (unsafe)</h2>
        <textarea value={payload} onChange={(event) => setPayload(event.target.value)} />
        <div dangerouslySetInnerHTML={{ __html: payload }} />
      </section>

      <section>
        <h2>Metrics (HTTP + query token)</h2>
        <ul>
          {apiData.map((metric) => (
            <li key={metric.name}>{metric.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Access control bypass</h2>
        <p>Role stored in localStorage and mutated client-side.</p>
        <button onClick={impersonate}>Become analyst instantly</button>
        {role === 'analyst' && <div>🔐 Analyst dashboard showing sensitive telemetry.</div>}
      </section>
    </main>
  );
}
