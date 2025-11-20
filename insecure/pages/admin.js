export default function Admin() {
  // No access control: shows sensitive info directly (vulnerability #5)
  const ADMIN_TOKEN = 'admin_token_insecure_9876'
  return (
    <main className="min-h-screen bg-slate-900 text-white p-10">
      <div className="max-w-3xl mx-auto bg-slate-800/50 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard (No Auth)</h1>
        <p className="text-sm mb-4 text-slate-300">This route is intentionally unprotected to simulate missing access control.</p>

        <pre className="p-4 bg-black/40 rounded">SENSITIVE_ADMIN_TOKEN: {ADMIN_TOKEN}</pre>

        <div className="mt-4 text-xs text-slate-400">Server secret (accidentally shown): {process.env.SERVER_SECRET}</div>

        <div className="mt-6">
          <a href="/" className="underline">Back</a>
        </div>
      </div>
    </main>
  )
}
