import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'UI Security Evaluation | Next.js Lab',
  description: 'Secure UI patterns demonstrating remediation of leaked secrets and XSS in Next.js applications.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-night">
      <body className={`${inter.className} bg-night text-white`}>{children}</body>
    </html>
  );
}
