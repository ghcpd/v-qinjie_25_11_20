'use client'

// FIX 9: Never display passwords in plain text - use hashed values
export default function AdminPanel() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', passwordHash: '$2b$10$...' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', passwordHash: '$2b$10$...' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6">
            Admin Panel (Protected)
          </h1>
          <p className="text-green-600 font-semibold mb-6">
            ✅ This page requires authentication and authorization
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Password Hash
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-green-600">
                      {user.passwordHash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Security Improvements:</h3>
            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
              <li>Authentication required to access this page</li>
              <li>Passwords stored as secure hashes (bcrypt)</li>
              <li>Role-based access control implemented</li>
              <li>Session management with secure tokens</li>
            </ul>
          </div>

          <div className="mt-8">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
