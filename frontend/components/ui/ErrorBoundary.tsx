'use client';

import React, { Component, type ReactNode } from 'react';

// ============================================================
// ErrorBoundary: Tangkap error render React
// Gunakan di sekitar komponen yang mungkin crash
// ============================================================

interface Props {
  children: ReactNode;
  /** Komponen fallback kustom. Jika tidak ada, gunakan fallback default */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Uncaught render error:', error, info);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (!hasError || !error) return children;

    // Fallback kustom sebagai function
    if (typeof fallback === 'function') {
      return fallback(error, this.reset);
    }

    // Fallback kustom sebagai ReactNode
    if (fallback) return fallback;

    // Fallback default
    return (
      <div className="flex min-h-50 flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl dark:bg-red-900">
          ⚠️
        </div>
        <div>
          <p className="font-semibold text-red-900 dark:text-red-100">
            Terjadi kesalahan saat menampilkan konten ini
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 font-mono">
              {error.message}
            </p>
          )}
        </div>
        <button
          onClick={this.reset}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }
}
