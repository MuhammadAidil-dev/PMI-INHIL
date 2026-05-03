'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ActionResult, LoginPayload, LoginResponse } from '../type/auth.type';
import { COOKIE_KEYS } from '@/lib/cookies/cookies';
import { authService } from '../service/auth.service';

// ============================================================
// Auth Server Actions
// ============================================================

// ── Login ──────────────────────────────────────────────────

/**
 * loginAction: kirim kredensial ke backend, simpan token di cookie httpOnly.
 *
 * Dipanggil dari LoginForm menggunakan `useTransition` atau `form action`.
 *
 * @example
 * const result = await loginAction({ username: 'admin', password: '...' });
 * if (!result.success) {
 *   setError(result);
 * }
 * // Jika success: redirect otomatis ke /dashboard
 */

export const loginAction = async (
  payload: LoginPayload,
): Promise<ActionResult<LoginResponse>> => {
  // Validasi sederhana di server sebelum hit API
  if (!payload.identifier?.trim() || !payload.password?.trim()) {
    return {
      success: false,
      message: 'Validasi gagal',
      code: 'VALIDATION_ERROR',
      validationErrors: {
        ...(!payload.identifier?.trim() && {
          identifier: 'Identifier wajib diisi',
        }),
        ...(!payload.password?.trim() && { password: 'Password wajib diisi' }),
      },
    };
  }

  // Gunakan apiServerClient — return format sama dengan apiClient
  const { data, error } = await authService.loginService(payload);

  if (error) {
    // error sudah berupa AppError — serialize ke ActionResult
    return {
      success: false,
      message: error.message,
      code: error.code,
      validationErrors: error.validationErrors,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_KEYS.AUTH_TOKEN, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60, // 8 jam dalam detik
    path: '/',
  });

  redirect('/dashboard');
};

// ── Logout ─────────────────────────────────────────────────

/**
 * logoutAction: hapus token dari cookie dan redirect ke login.
 *
 * @example
 * // Di komponen (misalnya tombol logout)
 * <button onClick={() => logoutAction()}>Logout</button>
 *
 * // Atau via form action
 * <form action={logoutAction}><button type="submit">Logout</button></form>
 */
export const logoutAction = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_KEYS.AUTH_TOKEN);
  redirect('/login');
};
