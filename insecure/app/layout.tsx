import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Insecure Admin Dashboard',
  description: 'Intentionally insecure Next.js app for security evaluation'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen text-gray-900">
        {children}
      </body>
    </html>
  );
}
