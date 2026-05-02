'use client';

import { useTransition } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { logoutAction } from '../../action/auth.action';

// ============================================================
// LogoutButton: Tombol logout yang memanggil Server Action
// ============================================================

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({
  className = '',
  children = 'Keluar',
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const clearSession = useAuthStore((s) => s.clearSession);

  const handleLogout = () => {
    // Clear store dulu di client agar UI langsung responsif
    clearSession();

    startTransition(async () => {
      // Server action akan hapus cookie & redirect ke /login
      await logoutAction();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={`disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isPending ? 'Keluar...' : children}
    </button>
  );
}
