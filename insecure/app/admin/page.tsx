"use client";

import { useEffect, useState } from "react";

const SECRET_ADMIN_FLAG = "admin-token-allow-all"; // Hardcoded admin token

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [notes, setNotes] = useState<any>(null);

  // Vulnerability: query param grants admin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") {
      setIsAdmin(true);
    }
  }, []);

  // Vulnerability: leak privileged data without auth
  useEffect(() => {
    fetch("/api/secret")
      .then((res) => res.json())
      .then(setNotes)
      .catch(() => setNotes({ error: "Failed to load secret" }));
  }, []);

  return (
    <main className="max-w-3xl mx-auto py-12 px-4 space-y-6">
      <div className="bg-white/90 rounded-2xl p-6 shadow border border-red-200">
        <h1 className="text-3xl font-bold text-red-600 mb-3">Admin Console</h1>
        <p className="text-gray-600 mb-4">Vulnerability: No real authentication. Append <code>?admin=true</code> to access.</p>
        {isAdmin ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <h2 className="font-semibold mb-2">Privileged Controls</h2>
              <div className="text-sm text-gray-700">
                <div>Admin Token: <code>{SECRET_ADMIN_FLAG}</code></div>
                <div>Notes:</div>
                <pre className="bg-gray-900 text-green-300 p-3 rounded text-xs overflow-auto">{JSON.stringify(notes, null, 2)}</pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Access denied. (But not really.)</div>
        )}
      </div>
    </main>
  );
}
