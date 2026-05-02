'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ActionResult, LoginPayload, LoginResponse } from '../type/auth.type';
import { apiServerClient } from '@/lib/api/api-server-client';
import { COOKIE_KEYS } from '@/lib/cookies/cookies';

// ============================================================
// Auth Server Actions
//
// Kenapa apiServerClient (fetch native), bukan apiClient (Axios)?
// ───────────────────────────────────────────────────────────
// apiClient (Axios) bergantung pada js-cookie yang client-only.
// Di Server Action (Node.js), tidak ada `window` atau `document`,
// sehingga js-cookie tidak bisa dipakai.
//
// apiServerClient pakai fetch native yang jalan di mana saja
// (browser & server), dengan return format ApiResult<T> yang
// sama persis — jadi cara konsumsinya identik.
// ============================================================

const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari dalam detik

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
): Promise<ActionResult<void>> => {
  // Validasi sederhana di server sebelum hit API
  if (!payload.identifier?.trim() || !payload.password?.trim()) {
    return {
      success: false,
      message: 'Validasi gagal',
      code: 'VALIDATION_ERROR',
      validationErrors: {
        ...(!payload.identifier?.trim() && {
          username: 'Username wajib diisi',
        }),
        ...(!payload.password?.trim() && { password: 'Password wajib diisi' }),
      },
    };
  }

  // Gunakan apiServerClient — return format sama dengan apiClient
  const { data, error } = await apiServerClient.post<LoginResponse>(
    '/v1/auth/login',
    payload,
  );

  console.log('data : ', data);

  if (error) {
    // error sudah berupa AppError — serialize ke ActionResult
    return {
      success: false,
      message: error.message,
      code: error.code,
      validationErrors: error.validationErrors,
    };
  }

  // Set token di httpOnly cookie dari server
  // httpOnly: JS client tidak bisa baca → aman dari XSS
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_KEYS.AUTH_TOKEN, data!.token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });

  // redirect() harus di luar try/catch karena Next.js
  // menggunakan throw secara internal untuk redirect
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
