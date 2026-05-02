'use client';

import {
  selectIsInitialized,
  useAuthStore,
} from '@/features/auth/store/auth.store';
import { useEffect } from 'react';

// ============================================================
// SessionProvider: Restore session saat app pertama mount
//
// Letakkan di dalam layout yang membutuhkan auth:
// app/(admin)/layout.tsx
// ============================================================

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const isInitialized = useAuthStore(selectIsInitialized);
  const initSession = useAuthStore((s) => s.initSession);

  useEffect(() => {
    if (!isInitialized) {
      initSession();
    }
  }, [isInitialized, initSession]);

  return <>{children}</>;
}
