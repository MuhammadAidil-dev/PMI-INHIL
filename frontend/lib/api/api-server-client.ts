// ============================================================
// api-server-client.ts
//
// Wrapper fetch native untuk dipakai di Server Action & Server Component.
// Pakai fetch (bukan Axios) karena:
//   1. Jalan di Node.js server environment
//   2. Bisa set `cache`, `next.revalidate` per-request (fitur Next.js)
//   3. Tidak bergantung js-cookie yang client-only
//
// Return format: ApiResult<T> — sama persis dengan apiClient (Axios)
// sehingga cara konsumsinya konsisten: const { data, error } = await ...
// ============================================================

// ── Re-export type agar consumer tidak perlu import dari dua tempat ──
export type { ApiResult } from './api-client';
import { ApiErrorResponse, ApiResponse } from '@/types/api.type';
import type { ApiResult } from './api-client';
import { AppError } from '../errors/error';
import { CONSTANT_ENV } from '@/constant/env';

// ── Config ──────────────────────────────────────────────────────────

const BASE_URL = CONSTANT_ENV.BASE_URL;

// ── Default message fallback (mirror dari parse-error.ts) ───────────

const getDefaultMessage = (status: number): string => {
  const messages: Record<number, string> = {
    400: 'Data yang dikirim tidak valid. Periksa kembali isian Anda.',
    401: 'Sesi Anda telah berakhir. Silakan login kembali.',
    403: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
    404: 'Data yang dicari tidak ditemukan.',
    409: 'Data sudah ada. Gunakan data yang berbeda.',
    422: 'Data tidak dapat diproses. Periksa format yang dikirim.',
    429: 'Terlalu banyak permintaan. Coba lagi dalam beberapa saat.',
    500: 'Terjadi kesalahan pada server. Silakan coba lagi.',
    502: 'Server sedang tidak tersedia. Coba lagi nanti.',
    503: 'Layanan sedang dalam pemeliharaan. Coba lagi nanti.',
  };
  return messages[status] ?? `Terjadi kesalahan (${status}).`;
};

// ── Request options ──────────────────────────────────────────────────

export interface ServerRequestConfig {
  /** Bearer token — untuk endpoint yang perlu auth (optional) */
  token?: string;
  /**
   * Next.js cache strategy per-request.
   * - 'no-store'  → selalu fetch fresh (default untuk mutasi)
   * - 'force-cache' → selalu pakai cache
   * - { revalidate: N } → ISR setiap N detik
   */
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
}

// ── Core wrapper ─────────────────────────────────────────────────────

const safeServerRequest = async <T>(
  url: string,
  init: RequestInit,
  config?: ServerRequestConfig,
): Promise<ApiResult<T>> => {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(init.headers as Record<string, string>),
  };

  // Sisipkan token jika diberikan (misal dari cookies() di Server Action)
  if (config?.token) {
    headers['Authorization'] = `Bearer ${config.token}`;
  }

  try {
    const response = await fetch(fullUrl, {
      ...init,
      headers,
      // Default: no-store agar Server Action tidak pakai stale cache
      cache: config?.cache ?? 'no-store',
      next: config?.next,
    });

    // Parse body — backend selalu return JSON
    const body = (await response.json()) as ApiResponse<T> | ApiErrorResponse;

    // Response tidak OK (4xx/5xx) atau success: false dari backend
    if (!response.ok || !body.success) {
      const errBody = body as ApiErrorResponse;
      return {
        data: null,
        error: new AppError({
          message: errBody.message ?? getDefaultMessage(response.status),
          statusCode: response.status,
          code: errBody.code ?? `HTTP_${response.status}`,
          validationErrors: errBody.errors,
          severity: response.status >= 500 ? 'error' : 'error',
        }),
      };
    }

    const okBody = body as ApiResponse<T>;
    return { data: okBody.data as T, error: null };
  } catch (raw) {
    // Network error / timeout / JSON parse gagal
    const isNetworkError = raw instanceof TypeError;
    return {
      data: null,
      error: new AppError({
        message: isNetworkError
          ? 'Tidak dapat terhubung ke server. Periksa koneksi Anda.'
          : 'Terjadi kesalahan yang tidak terduga.',
        statusCode: 0,
        code: isNetworkError ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR',
        isNetworkError,
      }),
    };
  }
};

// ── Public API ───────────────────────────────────────────────────────

export const apiServerClient = {
  /**
   * GET — cocok untuk Server Component yang butuh data fresh
   *
   * @example
   * // Di Server Component, dengan revalidasi ISR
   * const { data, error } = await apiServerClient.get<Donor[]>('/donors', {
   *   next: { revalidate: 60 },
   * });
   */
  get: <T>(url: string, config?: ServerRequestConfig): Promise<ApiResult<T>> =>
    safeServerRequest<T>(url, { method: 'GET' }, config),

  /**
   * POST — untuk mutasi di Server Action
   *
   * @example
   * const { data, error } = await apiServerClient.post<LoginResponse>(
   *   '/auth/login',
   *   { username, password },
   * );
   */
  post: <T>(
    url: string,
    body?: unknown,
    config?: ServerRequestConfig,
  ): Promise<ApiResult<T>> =>
    safeServerRequest<T>(
      url,
      { method: 'POST', body: JSON.stringify(body) },
      config,
    ),

  /**
   * PUT — untuk replace resource di Server Action
   */
  put: <T>(
    url: string,
    body?: unknown,
    config?: ServerRequestConfig,
  ): Promise<ApiResult<T>> =>
    safeServerRequest<T>(
      url,
      { method: 'PUT', body: JSON.stringify(body) },
      config,
    ),

  /**
   * PATCH — untuk partial update di Server Action
   */
  patch: <T>(
    url: string,
    body?: unknown,
    config?: ServerRequestConfig,
  ): Promise<ApiResult<T>> =>
    safeServerRequest<T>(
      url,
      { method: 'PATCH', body: JSON.stringify(body) },
      config,
    ),

  /**
   * DELETE — untuk hapus resource di Server Action
   */
  delete: <T>(
    url: string,
    config?: ServerRequestConfig,
  ): Promise<ApiResult<T>> =>
    safeServerRequest<T>(url, { method: 'DELETE' }, config),
};
