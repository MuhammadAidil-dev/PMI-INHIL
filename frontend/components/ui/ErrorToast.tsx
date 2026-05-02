'use client';

import { ErrorEntry, useErrorStore } from '@/lib/errors/error.store';
import { useEffect } from 'react';

// ============================================================
// ErrorToast: Komponen global untuk menampilkan error dari store
// Letakkan di layout utama (app/layout.tsx)
// ============================================================

const AUTO_DISMISS_MS = 5000;

const SEVERITY_STYLES = {
  error: {
    container:
      'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
    icon: '✕',
    iconBg: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    bar: 'bg-red-400',
  },
  warning: {
    container:
      'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100',
    icon: '⚠',
    iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300',
    bar: 'bg-amber-400',
  },
  info: {
    container:
      'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
    icon: 'ℹ',
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    bar: 'bg-blue-400',
  },
} as const;

interface ToastItemProps {
  entry: ErrorEntry;
  onDismiss: (id: string) => void;
}

const ToastItem = ({ entry, onDismiss }: ToastItemProps) => {
  const { id, error } = entry;
  const styles = SEVERITY_STYLES[error.severity];

  // Auto-dismiss setelah AUTO_DISMISS_MS
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        relative flex items-start gap-3 rounded-lg border p-4 shadow-lg
        min-w-[320px] max-w-105
        animate-in slide-in-from-right-5 fade-in duration-300
        ${styles.container}
      `}
    >
      {/* Progress bar auto-dismiss */}
      <div
        className={`
          absolute bottom-0 left-0 h-0.5 rounded-b-lg
          ${styles.bar}
          animate-shrink
        `}
        style={{ animationDuration: `${AUTO_DISMISS_MS}ms` }}
      />

      {/* Icon */}
      <span
        className={`
          flex h-6 w-6 shrink-0 items-center justify-center
          rounded-full text-xs font-bold
          ${styles.iconBg}
        `}
      >
        {styles.icon}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug wrap-break-word">
          {error.message}
        </p>

        {/* Tampilkan kode error di development */}
        {process.env.NODE_ENV === 'development' && error.code && (
          <p className="mt-0.5 text-xs opacity-60 font-mono">{error.code}</p>
        )}

        {/* Tampilkan validation errors jika ada */}
        {error.validationErrors && (
          <ul className="mt-1.5 space-y-0.5">
            {Object.entries(error.validationErrors).map(([field, msg]) => (
              <li key={field} className="text-xs opacity-80">
                <span className="font-semibold capitalize">{field}:</span> {msg}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(id)}
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity text-sm leading-none"
        aria-label="Tutup notifikasi"
      >
        ✕
      </button>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────

export const ErrorToast = () => {
  const { errors, dismissError } = useErrorStore();

  if (errors.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-9999 flex flex-col gap-2 items-end"
      aria-label="Notifikasi error"
    >
      {errors.map((entry) => (
        <ToastItem key={entry.id} entry={entry} onDismiss={dismissError} />
      ))}
    </div>
  );
};

// Tambahkan keyframe untuk progress bar di globals.css:
// @keyframes shrink { from { width: 100%; } to { width: 0%; } }
// .animate-shrink { animation: shrink linear forwards; }
