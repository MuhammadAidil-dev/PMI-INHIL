import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { cookieStorage } from '../cookies/cookies';
import { AppError } from '../errors/error';
import { ApiResponse, RequestConfig } from '@/types/api.type';
import { parseError } from '../errors/parse-error';

// ============================================================
// API Client: Wrapper Axios yang type-safe dan konsisten
// ============================================================

/**
 * Buat instance Axios dengan konfigurasi dasar.
 * BASE_URL diambil dari env Next.js.
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000',
    timeout: 15_000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    withCredentials: true,
  });

  // ── Request Interceptor ────────────────────────────────────
  // Sisipkan Authorization token dari cookie jika ada
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // cookieStorage.getToken() hanya jalan di client-side (js-cookie)
      if (typeof window !== 'undefined') {
        const token = cookieStorage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // ── Response Interceptor ──────────────────────────────────
  // Handle 401: hapus token & redirect ke login
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          cookieStorage.removeToken();
          // Hindari redirect loop jika sudah di halaman login
          if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

// ============================================================
// Result type: semua method kembalikan { data, error }
// agar consumer tidak perlu try/catch lagi
// ============================================================

export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: AppError };

/**
 * Bungkus Axios call → { data, error }
 * Tidak pernah throw; semua error dikonversi ke AppError.
 */
const safeRequest = async <T>(
  fn: () => Promise<AxiosResponse<ApiResponse<T>>>,
  config?: RequestConfig,
): Promise<ApiResult<T>> => {
  try {
    const response = await fn();
    const body = response.data;

    // Backend mengembalikan success: false tapi status 2xx
    // Perlakukan sebagai error logis
    if (!body.success) {
      const err = new AppError({
        message: body.message ?? 'Permintaan gagal.',
        statusCode: response.status,
        code: body.code ?? 'LOGICAL_ERROR',
      });
      return { data: null, error: err };
    }

    return { data: body.data as T, error: null };
  } catch (raw) {
    const err = parseError(raw);
    if (!config?.silent) {
      // Error tetap di-return, bukan di-throw
      // Consumer bebas memilih cara menampilkannya
    }
    return { data: null, error: err };
  }
};

// ============================================================
// apiClient: Objek utama yang dipakai di services
// ============================================================

export const apiClient = {
  /**
   * GET /endpoint
   * @example
   * const { data, error } = await apiClient.get<Donor[]>('/donors');
   */
  get: <T>(
    url: string,
    params?: Record<string, unknown>,
    config?: RequestConfig,
  ): Promise<ApiResult<T>> =>
    safeRequest<T>(
      () =>
        axiosInstance.get<ApiResponse<T>>(url, {
          params,
          baseURL: config?.baseURL,
        } satisfies AxiosRequestConfig),
      config,
    ),

  /**
   * POST /endpoint
   * @example
   * const { data, error } = await apiClient.post<Donor>('/donors', payload);
   */
  post: <T>(
    url: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResult<T>> =>
    safeRequest<T>(
      () =>
        axiosInstance.post<ApiResponse<T>>(url, body, {
          baseURL: config?.baseURL,
        } satisfies AxiosRequestConfig),
      config,
    ),

  /**
   * PUT /endpoint
   * @example
   * const { data, error } = await apiClient.put<Donor>('/donors/123', payload);
   */
  put: <T>(
    url: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResult<T>> =>
    safeRequest<T>(
      () =>
        axiosInstance.put<ApiResponse<T>>(url, body, {
          baseURL: config?.baseURL,
        } satisfies AxiosRequestConfig),
      config,
    ),

  /**
   * PATCH /endpoint
   * @example
   * const { data, error } = await apiClient.patch<Donor>('/donors/123', { name: 'Baru' });
   */
  patch: <T>(
    url: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResult<T>> =>
    safeRequest<T>(
      () =>
        axiosInstance.patch<ApiResponse<T>>(url, body, {
          baseURL: config?.baseURL,
        } satisfies AxiosRequestConfig),
      config,
    ),

  /**
   * DELETE /endpoint
   * @example
   * const { data, error } = await apiClient.delete<void>('/donors/123');
   */
  delete: <T>(url: string, config?: RequestConfig): Promise<ApiResult<T>> =>
    safeRequest<T>(
      () =>
        axiosInstance.delete<ApiResponse<T>>(url, {
          baseURL: config?.baseURL,
        } satisfies AxiosRequestConfig),
      config,
    ),

  /**
   * Upload file (multipart/form-data)
   * @example
   * const form = new FormData();
   * form.append('photo', file);
   * const { data, error } = await apiClient.upload<{ url: string }>('/upload', form);
   */
  upload: <T>(
    url: string,
    formData: FormData,
    config?: RequestConfig,
  ): Promise<ApiResult<T>> =>
    safeRequest<T>(
      () =>
        axiosInstance.post<ApiResponse<T>>(url, formData, {
          baseURL: config?.baseURL,
          headers: { 'Content-Type': 'multipart/form-data' },
        } satisfies AxiosRequestConfig),
      config,
    ),
};
