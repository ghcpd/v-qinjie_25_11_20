import './globals.css'
import { cookies } from 'next/headers'

export default function AdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('secure-auth');

  // In server-rendered logic, presence of cookie allows showing admin secret
  if (!token) {
    // Show login form (simple client-side form)
    return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-indigo-600 text-white">
      <div className="bg-white/10 p-6 rounded max-w-md w-full">
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="mb-4">Enter admin credentials to view admin secret.</p>
        <form method="post" action="/api/login" className="flex flex-col gap-2">
          <input name="username" placeholder="username" className="p-2 rounded text-black" defaultValue="admin" />
          <input name="password" placeholder="password" type="password" className="p-2 rounded text-black" defaultValue="adminpass" />
          <button className="px-4 py-2 bg-green-600 rounded">Login</button>
        </form>
      </div>
    </main>
    )
  }

  // If cookie exists; show admin secret but not the actual server secret
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-indigo-600 text-white">
      <div className="bg-white/10 p-6 rounded max-w-md w-full">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="mt-4">Admin Secret: <code>REDACTED</code></p>
        <p className="mt-2 text-sm text-gray-200">Sensitive data is hidden when viewed by the admin UI. Server-side secrets are not sent to browser.</p>
      </div>
    </main>
  )
}
