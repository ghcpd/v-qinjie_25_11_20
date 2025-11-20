import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function fetchSecret(token: string) {
  const res = await fetch(`/api/secret`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function AdminPage() {
  const cookieStore = cookies();
  const cookieToken = cookieStore.get('admin_token')?.value;
  const adminToken = process.env.ADMIN_TOKEN;

  const authorized = !!cookieToken && !!adminToken && cookieToken === adminToken;
  const secret = authorized && adminToken ? await fetchSecret(adminToken) : null;

  if (!authorized) {
    return (
      <div className="bg-white/90 rounded-2xl p-8 shadow border border-amber-200">
        <h1 className="text-3xl font-bold text-amber-600 mb-3">Access Restricted</h1>
        <p className="text-gray-600">You must be an authenticated admin to view this page.</p>
        <p className="text-sm text-gray-500 mt-2">Login at <code>/login</code> with the server-side admin token.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 rounded-2xl p-8 shadow border border-emerald-200">
      <h1 className="text-3xl font-bold text-emerald-600 mb-4">Admin Console</h1>
      <div className="space-y-4">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded">
          <h2 className="font-semibold mb-2">Privileged Data</h2>
          <pre className="bg-gray-900 text-green-300 p-3 rounded text-xs overflow-auto">
            {JSON.stringify(secret, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
