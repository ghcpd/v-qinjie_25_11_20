import './globals.css';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Secure Admin Dashboard',
  description: 'Remediated Next.js app with secure patterns'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen text-gray-900">
        <header className="w-full bg-white/80 backdrop-blur border-b border-indigo-100 shadow-sm">
          <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-bold text-primary-600">Secure Dashboard</Link>
            <div className="flex gap-4 text-sm font-medium">
              <Link href="/" className="hover:text-primary-600 transition">Home</Link>
              <Link href="/admin" className="hover:text-primary-600 transition">Admin</Link>
              <Link href="/login" className="hover:text-primary-600 transition">Login</Link>
            </div>
          </nav>
        </header>

        <main className="max-w-5xl mx-auto py-10 px-4">{children}</main>
      </body>
    </html>
  );
}
