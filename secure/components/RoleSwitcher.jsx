'use client';

import { useTransition } from 'react';

export default function RoleSwitcher({ currentRole, switchRole }) {
  const [pending, startTransition] = useTransition();

  const handleChange = (role) => {
    startTransition(async () => {
      await switchRole(role);
    });
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <header className="flex flex-col gap-2 pb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Access Control</p>
        <h2 className="text-xl font-semibold text-white">Switch between guest and analyst</h2>
        <p className="text-sm text-white/70">Role cookies are session-bound, HttpOnly, and same-site to prevent theft.</p>
      </header>
      <div className="mt-4 flex gap-4">
        {['guest', 'analyst'].map((role) => (
          <button
            key={role}
            onClick={() => handleChange(role)}
            disabled={pending}
            className={`rounded-full px-5 py-2 text-sm transition ${
              currentRole === role ? 'bg-cyber text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
      {pending && <p className="mt-2 text-xs text-white/40">Persisting role…</p>}
    </section>
  );
}
