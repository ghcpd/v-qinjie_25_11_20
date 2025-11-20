import { useState } from 'react'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)

  async function login() {
    setStatus('loading')
    const r = await fetch('/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) })
    if (r.ok) setStatus('ok')
    else setStatus('failed')
  }

  async function fetchSecret(){
    const r = await fetch('/api/admin')
    const json = await r.json()
    if (r.ok) setStatus('secret: ' + json.secret)
    else setStatus('unauthorized')
  }

  return (
    <main className="min-h-screen p-10 text-white flex items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-900/40 p-6 rounded-xl border border-white/5">
        <h1 className="text-2xl font-bold mb-4">Admin (Protected)</h1>
        <label className="text-sm">Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 rounded bg-white/5 mb-3"/>
        <div className="flex gap-3">
          <button onClick={login} className="px-4 py-2 bg-indigo-600 rounded">Login</button>
          <button onClick={fetchSecret} className="px-4 py-2 border border-white/10 rounded">Fetch Protected Info</button>
        </div>
        <div className="mt-4 text-sm text-slate-300">Status: {status}</div>
        <div className="mt-4 text-xs text-slate-400"><a href="/">Back</a></div>
      </div>
    </main>
  )
}
