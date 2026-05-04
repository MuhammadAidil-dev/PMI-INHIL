'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Log error ke monitoring service (misal Sentry) di sini
    console.error('[ErrorBoundary]', error);
  }, [error]);

  // Deteksi jenis error dari message atau digest
  const isNetworkError =
    error.message.includes('NETWORK_ERROR') ||
    error.message.includes('fetch failed') ||
    error.message.includes('ECONNREFUSED');

  const isServerError =
    error.message.includes('500') || error.message.includes('SERVER_ERROR');

  const getErrorContent = () => {
    if (isNetworkError) {
      return {
        title: 'Tidak dapat terhubung ke server',
        description:
          'Periksa koneksi internet Anda, lalu coba muat ulang halaman.',
        showReset: true,
      };
    }

    if (isServerError) {
      return {
        title: 'Terjadi kesalahan pada server',
        description:
          'Server sedang mengalami gangguan. Tim kami sudah diberitahu. Silakan coba lagi.',
        showReset: true,
      };
    }

    return {
      title: 'Terjadi kesalahan',
      description:
        error.message ||
        'Sesuatu yang tidak terduga terjadi. Silakan coba lagi.',
      showReset: true,
    };
  };

  const content = getErrorContent();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md bg-background rounded-xl p-8 border border-gray-200">
        {/* Icon */}
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="text-red-500" size={24} />
        </div>

        {/* Content */}
        <h1 className="text-xl font-semibold text-neutral mb-2">
          {content.title}
        </h1>
        <p className="text-sm text-tertiary leading-relaxed mb-6">
          {content.description}
        </p>

        {/* Digest — hanya tampil di development untuk debugging */}
        {process.env.NODE_ENV === 'development' && error.digest && (
          <p className="text-xs font-mono text-tertiary bg-secondary px-3 py-2 rounded mb-6">
            digest: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {content.showReset && (
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-white text-sm font-medium rounded-md hover:bg-hover transition-colors"
            >
              <RefreshCw size={14} />
              Coba lagi
            </button>
          )}

          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 text-neutral text-sm font-medium rounded-md hover:bg-secondary transition-colors"
          >
            <ArrowLeft size={14} />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
