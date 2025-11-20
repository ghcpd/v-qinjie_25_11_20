"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        throw new Error('Invalid token');
      }
      setToken('');
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white/90 rounded-2xl p-6 shadow border border-indigo-100">
      <h1 className="text-2xl font-semibold mb-4 text-primary-600">Admin Login</h1>
      <p className="text-sm text-gray-600 mb-4">Enter the server-provided admin token. It will be stored in an HttpOnly cookie.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Admin token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-md text-white font-medium bg-primary-600 hover:bg-primary-700 disabled:opacity-60 transition"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
