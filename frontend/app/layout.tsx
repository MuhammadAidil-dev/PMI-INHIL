import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ErrorToast } from '@/components/ui/ErrorToast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PMI INHIL -Sistem Management Donor',
  description:
    'Sistem yang mengelola stok dan informasi terkait donor darah pada PMI INHIL',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <ErrorToast />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
