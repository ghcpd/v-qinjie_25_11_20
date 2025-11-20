"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnnouncementForm() {
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      if (!res.ok) {
        throw new Error('Failed to post announcement');
      }
      setInput('');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
        placeholder="Share an update (HTML will be escaped)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded-md text-white font-medium bg-primary-600 hover:bg-primary-700 disabled:opacity-60 transition"
      >
        {submitting ? 'Posting…' : 'Post Announcement'}
      </button>
    </form>
  );
}
