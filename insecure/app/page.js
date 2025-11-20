import { useState } from 'react'

// Intentionally hard-coded API key and public variable leak for demo
const HARD_CODED_API_KEY = 'INSECURE_CLIENT_API_KEY_12345'; // VULN: Hardcoded API key on client

export default function Page() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  async function sendMessage() {
    // VULN: Sends secret via URL query and no HTTPS enforcement, token leaked
    const res = await fetch(`/api/echo?message=${encodeURIComponent(message)}&apikey=${HARD_CODED_API_KEY}`);
    const data = await res.json();
    setResponse(data.reply);
  }

  function selfXSS() {
    // VULN: Dangerous HTML injection via innerHTML (simulating stored/reflected XSS)
    const el = document.getElementById('xss-area');
    el.innerHTML = message; // dangerously updating DOM with unsanitized input
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start gap-6 p-8 bg-gradient-to-b from-purple-600 via-pink-600 to-orange-400 text-white">
      <h1 className="text-3xl font-bold mt-8">Insecure UI - Vulnerability Demo</h1>

      <div className="w-full max-w-2xl bg-white/10 rounded-lg p-6 shadow-lg">
        <label className="block mb-2">Message (unsafe):</label>
        <textarea className="w-full p-3 rounded text-black" value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className="flex gap-2 mt-3">
          <button className="px-4 py-2 bg-red-600 rounded font-semibold" onClick={sendMessage}>Send</button>
          <button className="px-4 py-2 bg-yellow-500 rounded font-semibold text-black" onClick={selfXSS}>Render as HTML (XSS)</button>
        </div>

        <div className="mt-4">
          <strong>Response:</strong>
          <pre>{response}</pre>
        </div>

        <div id="xss-area" className="mt-4 p-3 bg-white/20 rounded h-24 overflow-auto"></div>

        <div className="mt-6 text-sm text-gray-200">
          <p>Client-side leaked API Key: <code>{HARD_CODED_API_KEY}</code></p>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white/10 rounded-lg p-6 shadow-lg mt-4">
        <h2>Admin Panel (No Auth)</h2>
        <p className="text-sm">This page simulates an admin screen that should be protected but isn't.</p>
        <pre className="mt-2">Admin Secret: <code>ADM_SECRET_CLIENT_VISIBLE_ABC</code></pre> {/* VULN: sensitive data displayed in UI */}
      </div>

    </main>
  )
}
