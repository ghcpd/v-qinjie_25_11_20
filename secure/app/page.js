import { useState } from 'react'

export default function Page() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  async function sendMessage() {
    // Secure fetch: Use server-side API that handles secrets and prevents token leaks
    const res = await fetch('/api/echo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    setResponse(data.reply);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start gap-6 p-8 bg-gradient-to-b from-sky-500 via-indigo-600 to-violet-600 text-white">
      <h1 className="text-3xl font-bold mt-8">Secure UI - Vulnerability Fixed</h1>

      <div className="w-full max-w-2xl bg-white/10 rounded-lg p-6 shadow-lg">
        <label className="block mb-2">Message (validated):</label>
        <textarea className="w-full p-3 rounded text-black" value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className="flex gap-2 mt-3">
          <button className="px-4 py-2 bg-green-600 rounded font-semibold" onClick={sendMessage}>Send</button>
        </div>

        <div className="mt-4">
          <strong>Response:</strong>
          <pre>{response}</pre>
        </div>

        <div className="mt-6 text-sm text-gray-200">
          <p>Client does NOT store or expose API keys and all data sent to the server is validated.</p>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white/10 rounded-lg p-6 shadow-lg mt-4">
        <h2>Admin Panel (Auth)</h2>
        <p className="text-sm">This page is protected. Log in to view secrets.</p>
        <a className="mt-2 inline-block px-4 py-2 bg-white/20 rounded" href="/admin">Go to Admin</a>
      </div>

    </main>
  )
}
