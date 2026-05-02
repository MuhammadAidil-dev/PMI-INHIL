'use client';

import { useTransition, useState } from 'react';
import { ActionResult } from '../../type/auth.type';
import { loginAction } from '../../action/auth.action';
import { FieldError } from '@/components/ui/FieldError';

// ============================================================
// LoginForm: Form login yang memanggil Server Action
//
// Pola yang dipakai: useTransition + Server Action
// ─────────────────────────────────────────────────────────
// - `isPending` dari useTransition → loading state otomatis
// - Error validasi per-field ditampilkan via FieldError
// - Error umum (network, 500) ditampilkan di atas tombol
// ============================================================

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<Extract<
    ActionResult,
    { success: false }
  > | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('dipanggil');
    setActionError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      identifier: formData.get('username') as string,
      password: formData.get('password') as string,
    };

    startTransition(async () => {
      const result = await loginAction(payload);

      console.log('result: ', result);
      // Jika success: loginAction sudah redirect() ke /dashboard
      // Kode di bawah hanya jalan jika result.success === false
      if (!result.success) {
        setActionError(result);
      }
    });
  };

  const fieldErr = actionError?.validationErrors;
  // Error umum: bukan validasi form (misal 500, network error)
  const generalError =
    actionError && !actionError.validationErrors ? actionError.message : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Error umum (non-validasi) */}
      {generalError && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {generalError}
        </div>
      )}

      {/* Field: Username */}
      <div className="space-y-1 text-black">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-black"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          disabled={isPending}
          aria-describedby={fieldErr?.username ? 'username-error' : undefined}
          className={`
            w-full rounded-md border px-3 py-2 text-sm outline-none
            transition-colors focus:ring-2 focus:ring-red-500 focus:border-red-500
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400
            ${fieldErr?.username ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}
          `}
        />
        <FieldError message={fieldErr?.username} />
      </div>

      {/* Field: Password */}
      <div className="space-y-1 text-black">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-black"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          disabled={isPending}
          aria-describedby={fieldErr?.password ? 'password-error' : undefined}
          className={`
            w-full rounded-md border px-3 py-2 text-sm outline-none
            transition-colors focus:ring-2 focus:ring-red-500 focus:border-red-500
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400
            ${fieldErr?.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}
          `}
        />
        <FieldError message={fieldErr?.password} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="
          w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold
          text-white transition-colors hover:bg-red-700 active:bg-red-800
          disabled:cursor-not-allowed disabled:bg-red-400
          focus-visible:outline focus-visible:outline-red-600
        "
      >
        {isPending ? 'Memproses...' : 'Masuk'}
      </button>
    </form>
  );
}
