'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// global-error.tsx menggantikan root layout saat error
// sehingga harus include <html> dan <body> sendiri
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{ margin: 0, fontFamily: 'sans-serif', background: '#f8fafc' }}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              background: '#ffffff',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            {/* Simple error icon tanpa external dependency */}
            <div
              style={{
                width: '48px',
                height: '48px',
                background: '#fef2f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 7v6M12 16.5v.5"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h1
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: '8px',
              }}
            >
              Aplikasi mengalami masalah
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#64748b',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
              }}
            >
              Terjadi kesalahan kritis yang tidak dapat dipulihkan secara
              otomatis. Silakan muat ulang halaman.
            </p>

            {process.env.NODE_ENV === 'development' && error.digest && (
              <p
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#94a3b8',
                  background: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  marginBottom: '1.5rem',
                }}
              >
                digest: {error.digest}
              </p>
            )}

            <button
              onClick={reset}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: '#dd2d4a',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 500,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Muat ulang halaman
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
