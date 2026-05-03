import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { ErrorToast } from '@/components/ui/ErrorToast';
import { ToastContainer } from 'react-toastify';

const montserrat = Montserrat({
  variable: '--font-montserrat',
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
    <html lang="id" className={`h-full antialiased`}>
      <ErrorToast />

      <body className={`${montserrat.variable} min-h-full flex flex-col`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
