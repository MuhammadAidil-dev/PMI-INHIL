import Cookies from 'js-cookie';

// ============================================================
// cookies.ts: Helper terpusat untuk manajemen cookie auth
// ============================================================

/** Nama-nama cookie yang dipakai di seluruh aplikasi */
export const COOKIE_KEYS = {
  AUTH_TOKEN: process.env.NEXT_PUBLIC_COOKIE_KEY || 'auth_token',
} as const;

/** Opsi default cookie — sesuaikan domain/secure di production */
const DEFAULT_OPTIONS: Cookies.CookieAttributes = {
  // Akses cookie hanya via HTTP (tidak bisa dibaca JS) → nonaktifkan
  // karena kita perlu baca via JS untuk sisipkan ke Axios header.
  // Untuk keamanan tambahan, set httpOnly di sisi server (Set-Cookie header).
  sameSite: 'Strict',
  secure: process.env.NODE_ENV === 'production',
  // Expire dalam 7 hari; sesuaikan dengan TTL token backend
  expires: 7,
};

export const cookieStorage = {
  /** Ambil nilai cookie. Return undefined jika tidak ada. */
  get: (key: string): string | undefined => {
    return Cookies.get(key);
  },

  /** Simpan nilai ke cookie dengan opsi default */
  set: (
    key: string,
    value: string,
    options?: Cookies.CookieAttributes,
  ): void => {
    Cookies.set(key, value, { ...DEFAULT_OPTIONS, ...options });
  },

  /** Hapus cookie */
  remove: (key: string): void => {
    Cookies.remove(key, { sameSite: 'Strict' });
  },

  // ── Shortcut khusus auth token ──────────────────────────

  /** Ambil auth token */
  getToken: (): string | undefined => {
    return Cookies.get(COOKIE_KEYS.AUTH_TOKEN);
  },

  /** Simpan auth token */
  setToken: (token: string, options?: Cookies.CookieAttributes): void => {
    Cookies.set(COOKIE_KEYS.AUTH_TOKEN, token, {
      ...DEFAULT_OPTIONS,
      ...options,
    });
  },

  /** Hapus auth token (logout) */
  removeToken: (): void => {
    Cookies.remove(COOKIE_KEYS.AUTH_TOKEN, { sameSite: 'Strict' });
  },
};
